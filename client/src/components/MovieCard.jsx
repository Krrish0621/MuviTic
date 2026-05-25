import { Clock3, StarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import timeFormat from "../lib/timeFormat";
import { useAppContext } from "../context/AppContext";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { image_base_url } = useAppContext();
  const imagePath = movie.backdrop_path || movie.poster_path;

  const handleNavigate = () => {
    navigate(`/movies/${movie._id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10">
      <div className="relative overflow-hidden rounded-xl">
        <img
          onClick={handleNavigate}
          src={imagePath ? image_base_url + imagePath : "/backgroundImage.png"}
          alt={movie.title}
          className="h-52 w-full cursor-pointer object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-xs text-white/80 backdrop-blur-md">
          <Clock3 className="h-3.5 w-3.5 text-primary" />
          {timeFormat(movie.runtime)}
        </div>
      </div>

      <p className="mt-3 truncate font-semibold text-white">{movie.title}</p>

      <p className="mt-2 text-sm text-white/60">
        {new Date(movie.release_date).getFullYear()} •{" "}
        {movie.genres
          ?.slice(0, 2)
          .map((genre) => genre.name)
          .join(" | ")}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={handleNavigate}
          className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-black shadow-md shadow-primary/20 transition-all duration-300 hover:bg-primary-dull hover:shadow-primary/40"
        >
          Buy Tickets
        </button>

        <div className="flex items-center gap-1 text-sm text-white/70">
          <StarIcon className="h-4 w-4 fill-primary text-primary" />
          {movie.vote_average?.toFixed(1)}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
