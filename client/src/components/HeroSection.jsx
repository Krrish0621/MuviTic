import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen pt-20 flex items-center px-6 md:px-16 lg:px-36 overflow-hidden text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10">

        {/* Proper Cover Image */}
        <img
          src="/backgroundImage.png"
          alt="cinema background"
          className="w-full h-full object-cover object-[42%_0%]"
        />

        {/* Strong Cinematic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40"></div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 w-full h-52 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      {/* Content */}
      <div className="max-w-3xl z-10 pt-20">

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight tracking-tight">
          Book Movies
          <br />
          <span className="bg-gradient-to-r from-primary via-pink-500 to-orange-400 bg-clip-text text-transparent">
            Like Never Before
          </span>
        </h1>

        <p className="mt-8 text-white/85 text-lg max-w-xl leading-relaxed">
          Discover blockbusters, explore theatres, and book your seats
          instantly with a seamless cinematic platform built for
          modern movie lovers.
        </p>

        <button
          onClick={() => navigate("/movies")}
          className="mt-10 flex items-center gap-3 px-10 py-4 rounded-full
                     bg-gradient-to-r from-primary to-emerald-400
                     text-black font-medium
                     shadow-xl shadow-primary/30
                     hover:scale-105 hover:shadow-primary/50
                     transition-all duration-300"
        >
          Explore Movies
          <ArrowRight className="w-5 h-5" />
        </button>

      </div>
    </section>
  );
};

export default HeroSection;