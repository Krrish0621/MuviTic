import { useMemo, useState } from "react";
import { ArrowRight, BrainCircuit, Sparkles, Wand2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { aiPromptIdeas, getAiRecommendations } from "../lib/movieAi";
import { useAppContext } from "../context/AppContext";
import BlurCircle from "./BlurCircle";

const moods = [
  { key: "thrill", label: "Thrill" },
  { key: "date", label: "Date" },
  { key: "family", label: "Family" },
  { key: "premium", label: "Premium" },
];

const AiMovieConcierge = () => {
  const navigate = useNavigate();
  const { shows, image_base_url } = useAppContext();
  const [prompt, setPrompt] = useState(aiPromptIdeas[0]);
  const [mood, setMood] = useState("thrill");

  const recommendations = useMemo(
    () => getAiRecommendations(shows, prompt, mood, 3),
    [shows, prompt, mood]
  );

  const openMovie = (id) => {
    navigate(`/movies/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section id="ai-picks" className="relative overflow-hidden py-24">
      <BlurCircle top="0" left="-120px" size="20rem" opacity={0.14} />

      <div className="cinema-container holo-border glass-panel relative overflow-hidden rounded-[2rem]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(0,229,195,0.16),transparent_34%),radial-gradient(circle_at_80%_30%,rgba(244,63,94,0.14),transparent_32%)]" />

        <div className="relative grid lg:grid-cols-[0.95fr_1.35fr] gap-8 p-6 md:p-10">
          <div className="flex flex-col justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 text-primary">
                <BrainCircuit className="w-5 h-5" />
                <span className="text-sm uppercase tracking-[0.24em] text-white/60">
                  CineMatch AI
                </span>
              </div>

              <h2 className="mt-4 text-4xl md:text-6xl font-black leading-tight">
                Ask anything. CineMatch still finds a movie.
              </h2>

              <p className="mt-5 text-white/60 leading-relaxed">
                Type any prompt: scary but short, Hindi comedy, superhero date
                night, emotional family movie, or just a messy mood. The matcher
                always returns the closest available shows.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {moods.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setMood(item.key)}
                    className={`px-4 py-2 rounded-full text-sm border ${
                      mood === item.key
                        ? "bg-primary text-black border-primary shadow-lg shadow-primary/20"
                        : "bg-white/[0.055] text-white/70 border-white/10 hover:border-primary/50 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                <label className="sr-only" htmlFor="ai-movie-prompt">
                  Describe your movie mood
                </label>
                <textarea
                  id="ai-movie-prompt"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  rows={4}
                  className="w-full resize-none bg-transparent px-2 py-2 text-white placeholder:text-white/35 outline-none"
                  placeholder="Example: I want something scary but not too long, with good ratings"
                />
                <div className="flex flex-wrap gap-2 border-t border-white/10 pt-3">
                  {aiPromptIdeas.slice(1).map((idea) => (
                    <button
                      key={idea}
                      onClick={() => setPrompt(idea)}
                      className="rounded-full bg-white/[0.07] px-3 py-1.5 text-xs text-white/65 hover:bg-white/[0.12] hover:text-white"
                    >
                      {idea}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {recommendations.length > 0 ? (
              recommendations.map(({ movie, match, reason }, index) => (
                <button
                  key={movie._id}
                  onClick={() => openMovie(movie._id)}
                  className="group grid grid-cols-[86px_1fr_auto] items-center gap-4 rounded-2xl border border-white/10 bg-black/32 p-3 text-left hover:border-primary/50 hover:bg-white/[0.06]"
                >
                  <div className="relative h-28 overflow-hidden rounded-xl bg-white/5">
                    <img
                      src={
                        movie.poster_path || movie.backdrop_path
                          ? image_base_url + (movie.poster_path || movie.backdrop_path)
                          : "/backgroundImage.png"
                      }
                      alt={movie.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/70 text-xs font-semibold">
                      {index + 1}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-primary">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-xs font-medium">{match}% match</span>
                    </div>
                    <h3 className="mt-2 truncate text-lg font-semibold text-white">
                      {movie.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/58">
                      {reason}
                    </p>
                  </div>

                  <ArrowRight className="hidden h-5 w-5 text-white/35 transition-transform group-hover:translate-x-1 group-hover:text-primary sm:block" />
                </button>
              ))
            ) : (
              <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/25 p-8 text-center">
                <Wand2 className="h-10 w-10 text-primary" />
                <h3 className="mt-4 text-xl font-semibold">Waiting for shows</h3>
                <p className="mt-2 max-w-sm text-sm text-white/55">
                  Add shows from the admin panel and CineMatch will instantly
                  generate personalized picks here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiMovieConcierge;
