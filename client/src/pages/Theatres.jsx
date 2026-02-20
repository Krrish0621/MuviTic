import React, { useEffect, useState } from "react";

const dummyTheatres = [
  {
    _id: "1",
    name: "PVR Cinemas",
    location: "Delhi",
    screens: 5,
    rating: "4.5",
    facilities: ["IMAX", "Recliner Seats", "Dolby Atmos"],
  },
  {
    _id: "2",
    name: "INOX",
    location: "Mumbai",
    screens: 4,
    rating: "4.3",
    facilities: ["3D", "Food Court", "Premium Lounge"],
  },
  {
    _id: "3",
    name: "Cinepolis",
    location: "Bangalore",
    screens: 6,
    rating: "4.6",
    facilities: ["4DX", "Luxury Seats", "Dolby Vision"],
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">

      {/* ===== HERO SECTION ===== */}
      <section className="pt-32 pb-20 px-6 md:px-16 lg:px-36">
        <p className="text-white/60 uppercase tracking-widest text-sm">
          Discover Cinemas
        </p>

        <h1 className="text-4xl font-bold mt-2 
                       bg-gradient-to-r from-red-500 via-pink-500 to-orange-400 
                       bg-clip-text text-transparent">
          Experience Movies Like Never Before
        </h1>

        <p className="text-white/60 mt-6 max-w-2xl">
          Explore the best theatres near you with premium screens,
          immersive sound systems and ultimate comfort.
        </p>

        {/* Search Bar (UI only) */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 max-w-3xl">
          <input
            type="text"
            placeholder="Search by city or theatre..."
            className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/10 focus:outline-none focus:border-primary"
          />
          <button className="px-6 py-3 rounded-full bg-primary text-black font-medium">
            Search
          </button>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="px-6 md:px-16 lg:px-36 pb-16">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold">50+</h2>
            <p className="text-white/60 mt-2">Partner Theatres</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold">120+</h2>
            <p className="text-white/60 mt-2">Screens Available</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold">4.5★</h2>
            <p className="text-white/60 mt-2">Average Rating</p>
          </div>
        </div>
      </section>

      {/* ===== THEATRE LIST ===== */}
      <section className="px-6 md:px-16 lg:px-36 pb-24">

        <div className="mb-12">
          <p className="text-white/50 uppercase tracking-widest text-sm">
            Find Your Theatre
          </p>
          <h2 className='text-4xl font-bold mt-2 
                       bg-gradient-to-r from-red-500 via-pink-500 to-orange-400 
                       bg-clip-text text-transparent'>
            Available Theatres
          </h2>
        </div>

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
                           rounded-2xl p-6 hover:border-primary/40 
                           transition duration-300 shadow-lg hover:shadow-primary/20"
              >
                <h2 className="text-xl font-semibold mb-2">
                  {theatre.name}
                </h2>

                <p className="text-white/70 mb-1">
                  📍 {theatre.location}
                </p>

                <p className="text-white/70 mb-1">
                  🎥 Screens: {theatre.screens}
                </p>

                <p className="text-white/70 mb-4">
                  ⭐ Rating: {theatre.rating}
                </p>

                {/* Facilities */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {theatre.facilities.map((facility, index) => (
                    <span
                      key={index}
                      className="text-xs bg-white/10 px-3 py-1 rounded-full"
                    >
                      {facility}
                    </span>
                  ))}
                </div>

                <button className="w-full py-2 rounded-full bg-primary text-black font-medium hover:bg-primary-dull transition-all">
                  View Shows
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="px-6 md:px-16 lg:px-36 pb-32">
        <div className="bg-gradient-to-r from-primary/20 to-pink-500/20 border border-white/10 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-semibold">
            Want to Partner With Us?
          </h2>
          <p className="text-white/60 mt-4 max-w-2xl mx-auto">
            Join our growing cinema network and reach thousands of movie lovers.
          </p>
          <button className="mt-6 px-6 py-3 rounded-full bg-primary text-black font-medium">
            Become a Partner
          </button>
        </div>
      </section>

    </div>
  );
};

export default Theatres;