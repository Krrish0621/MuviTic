import axios from "axios";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import { inngest } from "../inngest/index.js";

// ======================================
// API to get Now Playing + Older Movies
// ======================================
export const getNowPlayingMovies = async (req, res) => {
  try {
    // 🎬 1. NOW PLAYING (India theatrical)
    const nowPlayingResponse = await axios.get(
      "https://api.themoviedb.org/3/movie/now_playing",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
        params: {
          region: "IN",
        },
      }
    );

    const nowPlaying = nowPlayingResponse.data.results
      .filter((movie) => movie.original_language === "hi")
      .filter((movie) => movie.poster_path)
      .sort((a, b) => b.popularity - a.popularity);

    // 🎞 2. OLDER HINDI MOVIES (Before 2016)
    const olderMoviesResponse = await axios.get(
      "https://api.themoviedb.org/3/discover/movie",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
        params: {
          with_original_language: "hi",
          sort_by: "popularity.desc",
          "primary_release_date.lte": "2015-12-31",
          include_adult: false,
          page: 1,
        },
      }
    );

    const olderMovies = olderMoviesResponse.data.results
      .filter((movie) => movie.poster_path)
      .slice(0, 12);

    const popularResponse = await axios.get(
      "https://api.themoviedb.org/3/movie/popular",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
        params: {
          region: "IN",
          page: 1,
        },
      }
    );

    const upcomingResponse = await axios.get(
      "https://api.themoviedb.org/3/movie/upcoming",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
        params: {
          region: "IN",
          page: 1,
        },
      }
    );

    res.json({
      success: true,
      sections: {
        nowPlaying,
        olderMovies,
        popular: popularResponse.data.results
          .filter((movie) => movie.poster_path)
          .slice(0, 16),
        upcoming: upcomingResponse.data.results
          .filter((movie) => movie.poster_path)
          .slice(0, 16),
      },
    });
  } catch (error) {
    console.error("Now Playing Fetch Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================
// API to search TMDB movies for admin
// ======================================
export const searchMovies = async (req, res) => {
  try {
    const query = req.query.q?.trim();

    if (!query) {
      return res.json({ success: true, movies: [] });
    }

    const { data } = await axios.get(
      "https://api.themoviedb.org/3/search/movie",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
        params: {
          query,
          include_adult: false,
          page: 1,
          region: "IN",
        },
      }
    );

    res.json({
      success: true,
      movies: data.results
        .filter((movie) => movie.poster_path)
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 18),
    });
  } catch (error) {
    console.error("Movie Search Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================
// API to add a new show to the database
// ======================================
export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;

    let movie = await Movie.findById(movieId);

    if (!movie) {
      const [movieDetailsResponse, movieCreditsResponse] =
        await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
            headers: {
              Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
            },
          }),
          axios.get(
            `https://api.themoviedb.org/3/movie/${movieId}/credits`,
            {
              headers: {
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
              },
            }
          ),
        ]);

      const movieApiData = movieDetailsResponse.data;
      const movieCreditsData = movieCreditsResponse.data;

      const movieDetails = {
        _id: movieId,
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        genres: movieApiData.genres,
        casts: movieCreditsData.cast,
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || "",
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime,
      };

      movie = await Movie.create(movieDetails);
    }

    const showsToCreate = [];

    showsInput.forEach((show) => {
      const showDate = show.date;

      show.time.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`;

        showsToCreate.push({
          movie: movieId,
          showDateTime: new Date(dateTimeString),
          showPrice,
          occupiedSeats: {},
        });
      });
    });

    if (showsToCreate.length > 0) {
      await Show.insertMany(showsToCreate);
    }

    res.json({ success: true, message: "Show Added successfully." });
  } catch (error) {
    console.error("Add Show Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================
// API to get all upcoming movies with shows
// ======================================
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({
      showDateTime: { $gte: new Date() },
    })
      .populate("movie")
      .sort({ showDateTime: 1 });

    const uniqueShowsMap = new Map();

    shows.forEach((show) => {
      if (show.movie) {
        uniqueShowsMap.set(show.movie._id.toString(), show.movie);
      }
    });

    res.json({
      success: true,
      shows: Array.from(uniqueShowsMap.values()),
    });
  } catch (error) {
    console.error("Get Shows Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================
// API to get single movie show timings
// ======================================
export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;

    const shows = await Show.find({
      movie: movieId,
      showDateTime: { $gte: new Date() },
    });

    const movie = await Movie.findById(movieId);

    const dateTime = {};

    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split("T")[0];

      if (!dateTime[date]) {
        dateTime[date] = [];
      }

      dateTime[date].push({
        time: show.showDateTime,
        showId: show._id,
      });
    });

    res.json({ success: true, movie, dateTime });
  } catch (error) {
    console.error("Get Show Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
