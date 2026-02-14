import React, { useEffect, useState } from "react";

const dummyTheatres = [
  {
    _id: "1",
    name: "PVR Cinemas",
    location: "Delhi",
    screens: 5,
  },
  {
    _id: "2",
    name: "INOX",
    location: "Mumbai",
    screens: 4,
  },
  {
    _id: "3",
    name: "Cinepolis",
    location: "Bangalore",
    screens: 6,
  },
];

const Theatres = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setTheatres(dummyTheatres);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="min-h-screen pt-28 px-6 md:px-16 lg:px-36 
                    bg-gradient-to-br from-black via-gray-900 to-black text-white">

      {/* Heading */}
      <div className="mb-12">
        <p className="text-white/60 uppercase tracking-widest text-sm">
          Find Your Theatre
        </p>
        <h1 className="text-4xl font-bold mt-2 bg-gradient-to-r from-red-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
          Available Theatres
        </h1>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-white/60 text-lg animate-pulse">
          Loading theatres...
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {theatres.map((theatre) => (
            <div
              key={theatre._id}
              className="bg-white/5 backdrop-blur-xl border border-white/10 
                         rounded-2xl p-6 hover:border-red-500/40 
                         transition duration-300 shadow-lg hover:shadow-red-500/20"
            >
              <h2 className="text-xl font-semibold mb-3 text-white">
                {theatre.name}
              </h2>

              <p className="text-white/70 mb-1">
                📍 {theatre.location}
              </p>

              <p className="text-white/70 mb-6">
                🎥 Screens: {theatre.screens}
              </p>

              <button className="px-4 py-2 text-xs bg-primary text-black hover:bg-primary-dull transition-all duration-300 rounded-full font-medium shadow-md shadow-primary/20 hover:shadow-primary/40">
                View Shows
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Theatres;
