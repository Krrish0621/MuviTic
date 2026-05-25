import React from "react";
import HeroSection from "../components/HeroSection";
import AiMovieConcierge from "../components/AiMovieConcierge";
import SmartFeaturesSection from "../components/SmartFeaturesSection";
import FeaturedSection from "../components/FeaturedSection";
import TrailersSection from "../components/TrailersSection";

const Home = () => {
  return (
    <>
      <HeroSection />
      <AiMovieConcierge />
      <SmartFeaturesSection />
      <FeaturedSection />
      <TrailersSection />
    </>
  );
};

export default Home;
