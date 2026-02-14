import BlurCircle from "../components/BlurCircle";
import MovieCard from "../components/MovieCard";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Favorite = () => {
  const { favoriteMovies } = useAppContext();
  const navigate = useNavigate();

  // ================= EMPTY STATE =================
  if (favoriteMovies.length === 0) {
    return (
      <div
        className="relative min-h-screen pt-28 px-6 
                   flex flex-col items-center justify-center 
                   text-center 
                   bg-gradient-to-br from-black via-gray-900 to-black 
                   text-white overflow-hidden"
      >
        {/* Blur Effects */}
        <BlurCircle top="120px" left="-80px" size="20rem" opacity={0.15} />
        <BlurCircle bottom="100px" right="-60px" size="18rem" opacity={0.12} />

        <h1 className="text-3xl md:text-4xl font-semibold">
          No Favorites Yet
        </h1>

        <p className="text-white/60 mt-4 max-w-md">
          Start exploring movies and add them to your favorites
          to see them here.
        </p>

        <button
          onClick={() => {
            navigate("/movies");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="mt-8 px-8 py-3 rounded-full 
                     bg-primary text-black font-medium 
                     shadow-md shadow-primary/20 
                     hover:shadow-primary/40 hover:scale-105 
                     transition-all duration-300"
        >
          Explore Movies
        </button>
      </div>
    );
  }

  // ================= FAVORITES GRID =================
  return (
    <section
      className="relative min-h-screen pt-32 pb-24 
                 px-6 md:px-16 lg:px-40 xl:px-44 
                 overflow-hidden 
                 bg-gradient-to-br from-black via-gray-900 to-black 
                 text-white"
    >
      {/* Blur Effects */}
      <BlurCircle top="100px" left="-120px" size="22rem" opacity={0.18} />
      <BlurCircle bottom="80px" right="-100px" size="20rem" opacity={0.15} />

      {/* Heading */}
      <div className="mb-10">
        <p className="text-white/60 uppercase tracking-widest text-sm">
          Your Collection
        </p>
        <h1
          className="text-4xl font-bold mt-2 
                     bg-gradient-to-r from-red-500 via-pink-500 to-orange-400 
                     bg-clip-text text-transparent"
        >
          Favorite Movies
        </h1>
      </div>

      {/* Favorites Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {favoriteMovies.map((movie) => (
          <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>
    </section>
  );
};

export default Favorite;
