import { ArrowRight, Bot, CalendarDays, Play, ShieldCheck, Sparkles, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const HeroSection = () => {
  const navigate = useNavigate();
  const { shows, image_base_url } = useAppContext();

  const heroMovies = shows.slice(0, 3);
  const leadMovie = heroMovies[0];

  return (
    <section className="relative min-h-screen overflow-hidden px-4 pt-28 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10">
        <img
          src={
            leadMovie?.backdrop_path
              ? image_base_url + leadMovie.backdrop_path
              : "/backgroundImage.png"
          }
          alt="cinema background"
          className="h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(24,242,210,0.22),transparent_28%),linear-gradient(90deg,#05050a_0%,rgba(5,5,10,0.92)_42%,rgba(5,5,10,0.58)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#05050a] to-transparent" />
      </div>

      <div className="cinema-container grid min-h-[calc(100vh-112px)] items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="max-w-3xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-sm text-white/70 backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-primary" />
            New MuviTic AI cinema experience
          </div>

          <h1 className="text-5xl font-black leading-[0.95] tracking-normal md:text-7xl lg:text-8xl">
            Cinema, matched by{" "}
            <span className="text-cinema-gradient">intelligence</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl">
            Discover shows, ask CineMatch for the perfect movie mood, and book
            premium seats through a futuristic ticketing experience.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={() => {
                document.getElementById("ai-picks")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="cinema-button flex items-center gap-3 px-7 py-4"
            >
              Find My Movie
              <Bot className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate("/movies")}
              className="flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.06] px-7 py-4 font-semibold text-white hover:border-primary/45 hover:text-primary"
            >
              Browse Shows
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-12 grid max-w-2xl grid-cols-3 gap-3">
            {[
              ["AI Picks", "Mood-aware"],
              ["Checkout", "Stripe ready"],
              ["Admin", "TMDB search"],
            ].map(([label, value]) => (
              <div key={label} className="glass-panel rounded-2xl p-4">
                <p className="text-xs uppercase tracking-widest text-white/42">{label}</p>
                <p className="mt-2 text-sm font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px]">
          <div className="holo-border glass-panel relative overflow-hidden rounded-[2rem] p-4">
            <div className="rounded-[1.5rem] border border-white/10 bg-black/35 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/50">Tonight’s signal</p>
                  <h2 className="mt-1 text-2xl font-semibold">
                    {leadMovie?.title || "Movie intelligence"}
                  </h2>
                </div>
                <button className="grid h-12 w-12 place-items-center rounded-full bg-primary text-black">
                  <Play className="h-5 w-5 fill-black" />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-[1fr_0.72fr] gap-4">
                <div className="overflow-hidden rounded-3xl bg-white/5">
                  <img
                    src={
                      leadMovie?.poster_path
                        ? image_base_url + leadMovie.poster_path
                        : "/backgroundImage.png"
                    }
                    alt={leadMovie?.title || "movie poster"}
                    className="h-[390px] w-full object-cover"
                  />
                </div>

                <div className="space-y-3">
                  {heroMovies.map((movie, index) => (
                    <div key={movie._id || index} className="rounded-2xl border border-white/10 bg-white/[0.055] p-3">
                      <p className="flex items-center gap-1 text-sm text-primary">
                        <Star className="h-4 w-4 fill-primary" />
                        {movie.vote_average?.toFixed(1) || "AI"}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm font-medium">
                        {movie.title || "Curated show"}
                      </p>
                    </div>
                  ))}
                  <div className="rounded-2xl border border-white/10 bg-primary/10 p-3 text-primary">
                    <CalendarDays className="h-5 w-5" />
                    <p className="mt-2 text-sm font-semibold">Fast seat booking</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-coral/10 p-3 text-coral">
                    <ShieldCheck className="h-5 w-5" />
                    <p className="mt-2 text-sm font-semibold">Secure flow</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
