import BlurCircle from "../components/BlurCircle";
import MovieCard from "../components/MovieCard";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { getAiRecommendations, getGenreNames } from "../lib/movieAi";

const Movies = () => {
  const { shows } = useAppContext();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");

  const genres = useMemo(() => {
    const genreSet = new Set();
    shows.forEach((movie) => getGenreNames(movie).forEach((genre) => genreSet.add(genre)));
    return ["All", ...Array.from(genreSet).sort()];
  }, [shows]);

  const filteredShows = useMemo(() => {
    const search = query.trim().toLowerCase();

    const filtered = shows.filter((movie) => {
      const genres = getGenreNames(movie);
      const matchesGenre = activeGenre === "All" || genres.includes(activeGenre);
      const matchesSearch =
        !search ||
        movie.title?.toLowerCase().includes(search) ||
        movie.overview?.toLowerCase().includes(search) ||
        genres.join(" ").toLowerCase().includes(search);

      return matchesGenre && matchesSearch;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "rating") return (b.vote_average || 0) - (a.vote_average || 0);
      if (sortBy === "newest") return new Date(b.release_date) - new Date(a.release_date);
      if (sortBy === "runtime") return (a.runtime || 0) - (b.runtime || 0);
      return (b.vote_average || 0) * 2 + (b.runtime || 0) / 100 - ((a.vote_average || 0) * 2 + (a.runtime || 0) / 100);
    });
  }, [activeGenre, query, shows, sortBy]);

  const aiPick = useMemo(() => {
    const prompt = query || `${activeGenre} high rating`;
    return getAiRecommendations(filteredShows, prompt, "premium", 1)[0];
  }, [activeGenre, filteredShows, query]);

  // ================= EMPTY STATE =================
  if (shows.length === 0) {
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
          No Movies Available
        </h1>

        <p className="text-white/60 mt-4 max-w-md">
          We’re working on adding exciting new releases.
          Check back soon for the latest shows.
        </p>

        <button
          onClick={() => {
            navigate("/");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="mt-8 px-8 py-3 rounded-full 
                     bg-primary text-black font-medium 
                     shadow-md shadow-primary/20 
                     hover:shadow-primary/40 hover:scale-105 
                     transition-all duration-300"
        >
          Go Home
        </button>
      </div>
    );
  }

  // ================= MOVIES GRID =================
  return (
    <section
      className="relative min-h-screen pt-32 pb-24 
                 px-6 md:px-16 lg:px-40 xl:px-44 
                 overflow-hidden 
                 bg-gradient-to-br from-black via-gray-900 to-black 
                 text-white"
    >
      {/* Blur Effects */}
      <BlurCircle top="120px" left="-120px" size="22rem" opacity={0.18} />
      <BlurCircle bottom="100px" right="-100px" size="20rem" opacity={0.15} />

      {/* Heading */}
      <div className="cinema-container mb-10 flex flex-col gap-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-white/60 uppercase tracking-widest text-sm">
              Now Streaming
            </p>
            <h1 className="text-5xl font-black mt-2 text-cinema-gradient">
              Discover Shows
            </h1>
          </div>

          <div className="glass-panel flex items-center gap-2 rounded-full px-4 py-3 text-sm text-white/70">
            <Sparkles className="h-4 w-4 text-primary" />
            {aiPick ? `${aiPick.movie.title} is your AI top pick` : "AI picks update as you filter"}
          </div>
        </div>

        <div className="glass-panel grid gap-4 rounded-3xl p-4 lg:grid-cols-[1fr_auto]">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
            <Search className="h-5 w-5 text-white/45" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, genre, mood, language..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
            />
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
            <SlidersHorizontal className="h-5 w-5 text-white/45" />
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="bg-transparent text-sm text-white outline-none"
            >
              <option className="bg-black" value="recommended">Recommended</option>
              <option className="bg-black" value="rating">Highest rated</option>
              <option className="bg-black" value="newest">Newest</option>
              <option className="bg-black" value="runtime">Shortest first</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setActiveGenre(genre)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm ${
                activeGenre === genre
                  ? "border-primary bg-primary text-black"
                  : "border-white/10 bg-white/[0.055] text-white/65 hover:border-primary/50 hover:text-white"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Movies Grid */}
      <div className="cinema-container grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredShows.map((movie) => (
          <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>

      {filteredShows.length === 0 && (
        <div className="cinema-container glass-panel mt-16 rounded-3xl p-10 text-center">
          <h2 className="text-2xl font-semibold">No matching movies</h2>
          <p className="mt-3 text-white/55">
            Try a different mood, genre or search term.
          </p>
        </div>
      )}
    </section>
  );
};

export default Movies;
