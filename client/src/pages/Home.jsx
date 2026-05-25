import React from "react";
import HeroSection from "../components/HeroSection";
import AiMovieConcierge from "../components/AiMovieConcierge";
import FeaturedSection from "../components/FeaturedSection";
import TrailersSection from "../components/TrailersSection";

const Home = () => {
  return (
    <>
      <HeroSection />
      <AiMovieConcierge />
      <FeaturedSection />
      <TrailersSection />
    </>
  );
};

export default Home;
