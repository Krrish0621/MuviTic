import { useState } from "react";
import { dummyTrailers } from "../assets/assets";
import ReactPlayer from "react-player";
import BlurCircle from "./BlurCircle";
import { PlayCircleIcon } from "lucide-react";

const TrailersSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);

  return (
    <section className="relative px-6 md:px-16 lg:px-24 xl:px-44 py-24 overflow-hidden">

      {/* Glow Effect */}
      <BlurCircle top="-150px" right="-120px" size="22rem" opacity={0.18} />

      {/* Heading */}
      <div className="max-w-5xl mx-auto">
        <p className="text-white/60 uppercase tracking-widest text-sm">
          Watch Preview
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold mt-2">
          Latest Trailers
        </h2>
      </div>

      {/* Video Player */}
      <div className="relative mt-10 max-w-5xl mx-auto rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl">

        {/* 16:9 Aspect Ratio */}
        <div className="relative w-full pt-[56.25%]">
          <ReactPlayer
            url={currentTrailer.videoUrl}
            controls
            playing={false}
            width="100%"
            height="100%"
            className="absolute top-0 left-0"
          />
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">

        {dummyTrailers.map((trailer) => {
          const isActive = trailer.videoUrl === currentTrailer.videoUrl;

          return (
            <div
              key={trailer.image}
              onClick={() => setCurrentTrailer(trailer)}
              className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300
                ${
                  isActive
                    ? "ring-2 ring-primary scale-105"
                    : "opacity-70 hover:opacity-100 hover:-translate-y-2"
                }`}
            >
              <img
                src={trailer.image}
                alt="trailer"
                className="w-full h-40 object-cover brightness-75"
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <PlayCircleIcon
                  strokeWidth={1.5}
                  className="w-8 h-8 text-primary"
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TrailersSection;
