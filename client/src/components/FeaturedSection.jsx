import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BlurCircle from "./BlurCircle";
import MovieCard from "./MovieCard";
import { useAppContext } from "../context/AppContext";

const FeaturedSection = () => {
  const navigate = useNavigate();
  const { shows } = useAppContext();

  const goToMovies = () => {
    navigate("/movies");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden py-20">

      {/* Cinematic Glow */}
      <BlurCircle top="-120px" right="-100px" size="22rem" opacity={0.18} />

      {/* Header */}
      <div className="cinema-container flex items-center justify-between mb-12">
        <div>
          <p className="text-white/60 uppercase tracking-widest text-sm">
            Featured Collection
          </p>
          <h2 className="text-4xl md:text-5xl font-black mt-2">
            Now Showing
          </h2>
        </div>

        <button
          onClick={goToMovies}
          className="group flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors"
        >
          View All
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>

      {/* Movie Grid */}
      <div className="cinema-container grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {shows.slice(0, 4).map((show) => (
          <MovieCard key={show._id} movie={show} />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="flex justify-center mt-16">
        <button
          onClick={goToMovies}
          className="cinema-button px-12 py-3"
        >
          Explore More Movies
        </button>
      </div>
    </section>
  );
};

export default FeaturedSection;
