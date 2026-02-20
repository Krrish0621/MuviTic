import axios from "axios";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import { inngest } from "../inngest/index.js";

// ======================================
// API to get Bollywood movies section-wise
// ======================================
export const getNowPlayingMovies = async (req, res) => {
  try {
    const { data } = await axios.get(
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

    const today = new Date();

    const hindiMovies = data.results
      .filter((movie) => movie.original_language === "hi")
      .filter((movie) => movie.poster_path)
      .sort((a, b) => b.popularity - a.popularity);

    let newReleases = [];
    let nowPlaying = [];
    let olderRunning = [];

    // 🔹 Initial Split
    hindiMovies.forEach((movie) => {
      const releaseDate = new Date(movie.release_date);
      const diffDays =
        (today - releaseDate) / (1000 * 60 * 60 * 24);

      if (diffDays <= 7) {
        newReleases.push(movie);
      } else if (diffDays <= 30) {
        nowPlaying.push(movie);
      } else {
        olderRunning.push(movie);
      }
    });

    // 🔥 Guarantee at least 1 movie per section
    if (newReleases.length === 0 && nowPlaying.length > 0) {
      newReleases.push(nowPlaying.shift());
    }

    if (olderRunning.length === 0 && nowPlaying.length > 0) {
      olderRunning.push(nowPlaying.pop());
    }

    if (nowPlaying.length === 0 && newReleases.length > 1) {
      nowPlaying.push(newReleases.pop());
    }

    res.json({
      success: true,
      sections: {
        newReleases,
        nowPlaying,
        olderRunning,
      },
    });
  } catch (error) {
    console.error(error);
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
    console.error(error);
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
    console.error(error);
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
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};