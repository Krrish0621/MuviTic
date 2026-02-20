import { useState } from "react";
import { dummyTrailers } from "../assets/assets";
import ReactPlayer from "react-player";
import BlurCircle from "./BlurCircle";
import { PlayCircleIcon } from "lucide-react";

const TrailersSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(
    dummyTrailers?.[0] || null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [fade, setFade] = useState(true);

  const handleTrailerChange = (trailer) => {
    if (trailer.videoUrl === currentTrailer?.videoUrl) return;

    setFade(false);

    setTimeout(() => {
      setCurrentTrailer(trailer);
      setIsPlaying(true);
      setFade(true);
    }, 250);
  };

  return (
    <section className="relative bg-[#0b0f19] text-white py-24 overflow-hidden">

      {/* Glow Effect */}
      <BlurCircle top="-120px" right="-100px" size="24rem" opacity={0.15} />

      {/* Container aligned with website */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-44">

        {/* ===== Heading (Screenshot Style) ===== */}
        <div className="max-w-6xl mx-auto">
          <p className="text-white/60 uppercase tracking-widest text-sm">
            Watch Preview
          </p>

          <h2 className="text-3xl md:text-4xl font-semibold mt-2">
            Latest Trailers
          </h2>
        </div>

        {/* ===== Main Player ===== */}
        {currentTrailer && (
          <div
            className={`relative mt-12 max-w-6xl mx-auto rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl transition-opacity duration-300 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="relative w-full pt-[56.25%] bg-black">
              <ReactPlayer
                url={currentTrailer.videoUrl}
                controls
                playing={isPlaying}
                width="100%"
                height="100%"
                className="absolute top-0 left-0"
              />
            </div>
          </div>
        )}

        {/* ===== Thumbnails ===== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 mt-16 max-w-6xl mx-auto">
          {dummyTrailers.map((trailer) => {
            const isActive =
              trailer.videoUrl === currentTrailer?.videoUrl;

            return (
              <div
                key={trailer.videoUrl}
                onClick={() => handleTrailerChange(trailer)}
                className={`group relative cursor-pointer rounded-2xl overflow-hidden transform transition-all duration-500
                ${
                  isActive
                    ? "ring-2 ring-white/40 scale-105"
                    : "hover:scale-105"
                }`}
              >
                {/* Thumbnail */}
                <img
                  src={trailer.image}
                  alt="trailer thumbnail"
                  className="w-full h-44 object-cover transition-transform duration-700 group-hover:scale-125 group-hover:brightness-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition duration-500" />

                {/* Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlayCircleIcon
                    strokeWidth={1.5}
                    className="w-12 h-12 text-white opacity-80 group-hover:scale-125 transition-all duration-500"
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default TrailersSection;