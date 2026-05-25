import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlurCircle from "../components/BlurCircle";
import { BrainCircuit, Heart, PlayCircleIcon, Sparkles, StarIcon } from "lucide-react";
import timeFormat from "../lib/timeFormat";
import DateSelect from "../components/DateSelect";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { getMovieAiInsights } from "../lib/movieAi";

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [show, setShow] = useState(null);

  const {
    shows,
    axios,
    getToken,
    user,
    fetchFavoriteMovies,
    favoriteMovies,
    image_base_url,
  } = useAppContext();

  const isFavorite = useMemo(() => {
    return favoriteMovies?.some((m) => m._id === id);
  }, [favoriteMovies, id]);

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);
      if (data.success) {
        setShow(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFavorite = async () => {
    try {
      if (!user) return toast.error("Please login to proceed");

      const token = await getToken();

      const { data } = await axios.post(
        "/api/user/update-favorite",
        { movieId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        await fetchFavoriteMovies();
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) getShow();
  }, [id]);

  if (!show) return <Loading />;

  const movie = show.movie;
  const aiInsights = getMovieAiInsights(movie);

  return (
    <section className="relative overflow-hidden px-4 pt-32 pb-24 sm:px-6">

      <BlurCircle top="100px" left="-120px" size="22rem" opacity={0.15} />
      <BlurCircle bottom="80px" right="-120px" size="22rem" opacity={0.12} />

      <div className="cinema-container glass-panel rounded-[2rem] p-5 md:p-8 flex flex-col md:flex-row gap-12">

        {/* Poster */}
        <img
          src={image_base_url + movie?.poster_path}
          alt="poster"
          className="mx-auto h-[440px] w-[292px] rounded-[1.5rem] object-cover shadow-2xl shadow-black/40 md:mx-0"
        />

        {/* Info Section */}
        <div className="flex flex-col gap-4 relative">

          <p className="text-primary uppercase tracking-widest text-sm">
            {movie?.original_language}
          </p>

          <h1 className="text-4xl md:text-6xl font-black max-w-2xl">
            {movie?.title}
          </h1>

          <div className="flex items-center gap-3 text-white/70">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
            {movie?.vote_average?.toFixed(1)} User Rating
          </div>

          <p className="text-white/60 mt-2 text-sm leading-relaxed max-w-xl">
            {movie?.overview}
          </p>

          <p className="text-white/70 text-sm">
            {timeFormat(movie?.runtime)} •{" "}
            {movie?.genres?.map((g) => g.name).join(", ")} •{" "}
            {movie?.release_date?.split("-")[0]}
          </p>

          <div className="glass-panel mt-4 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-primary">
              <BrainCircuit className="h-5 w-5" />
              <p className="text-sm font-medium">AI booking insight</p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {aiInsights.map((insight) => (
                <div
                  key={insight}
                  className="rounded-xl border border-white/10 bg-black/25 p-3 text-sm text-white/70"
                >
                  <Sparkles className="mb-2 h-4 w-4 text-primary" />
                  {insight}
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center flex-wrap gap-4 mt-6">

            <button className="flex items-center gap-2 px-6 py-3 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300">
              <PlayCircleIcon className="w-5 h-5 text-primary" />
              Watch Trailer
            </button>

            <a
              href="#dateSelect"
              className="cinema-button px-8 py-3 text-sm"
            >
              Buy Tickets
            </a>

            <button
              onClick={handleFavorite}
              className="bg-white/5 border border-white/10 p-3 rounded-full hover:bg-primary/10 hover:border-primary/50 transition"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite
                    ? "fill-primary text-primary"
                    : "text-white/60"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      <div className="cinema-container mt-24">
        <p className="text-white/60 uppercase tracking-widest text-sm">
          Cast
        </p>

        <h2 className="text-2xl font-semibold mt-2 mb-8">
          Featured Actors
        </h2>

        <div className="overflow-x-auto no-scrollbar pb-4">
          <div className="flex gap-6 w-max">
            {movie?.casts?.slice(0, 12).map((cast, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <img
                  src={image_base_url + cast.profile_path}
                  alt="profile"
                  className="rounded-full h-20 w-20 object-cover border border-white/10"
                />
                <p className="text-sm mt-3 text-white/70">
                  {cast.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Date Select */}
      <div className="cinema-container">
        <DateSelect dateTime={show?.dateTime} id={id} />
      </div>

      {/* Recommended */}
      <div className="cinema-container mt-24">
        <p className="text-white/60 uppercase tracking-widest text-sm">
          Recommendations
        </p>

        <h2 className="text-2xl font-semibold mt-2 mb-10">
          You May Also Like
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {shows.slice(0, 4).map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>

        <div className="flex justify-center mt-14">
          <button
            onClick={() => {
              navigate("/movies");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-10 py-3 text-sm bg-primary text-black hover:bg-primary-dull rounded-full font-medium transition-all duration-300"
          >
            Explore More
          </button>
        </div>
      </div>

    </section>
  );
};

export default MovieDetails;
