import { StarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import timeFormat from "../lib/timeFormat";
import { useAppContext } from "../context/AppContext";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { image_base_url } = useAppContext();

  const handleNavigate = () => {
    navigate(`/movies/${movie._id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="group relative flex flex-col justify-between p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-primary/40 hover:-translate-y-2 transition-all duration-300 w-64">

      {/* Poster */}
      <div className="overflow-hidden rounded-xl">
        <img
          onClick={handleNavigate}
          src={image_base_url + movie.backdrop_path}
          alt={movie.title}
          className="h-52 w-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Title */}
      <p className="font-semibold mt-3 truncate text-white">
        {movie.title}
      </p>

      {/* Meta Info */}
      <p className="text-sm text-white/60 mt-2">
        {new Date(movie.release_date).getFullYear()} •{" "}
        {movie.genres
          ?.slice(0, 2)
          .map((genre) => genre.name)
          .join(" | ")}{" "}
        • {timeFormat(movie.runtime)}
      </p>

      {/* Bottom Section */}
      <div className="flex items-center justify-between mt-4">

        {/* CTA Button */}
        <button
          onClick={handleNavigate}
          className="px-4 py-2 text-xs bg-primary text-black hover:bg-primary-dull transition-all duration-300 rounded-full font-medium shadow-md shadow-primary/20 hover:shadow-primary/40"
        >
          Buy Tickets
        </button>

        {/* Rating */}
        <div className="flex items-center gap-1 text-sm text-white/70">
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          {movie.vote_average?.toFixed(1)}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
