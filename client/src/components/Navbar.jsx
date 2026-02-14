import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MenuIcon,
  SearchIcon,
  TicketPlus,
  XIcon,
} from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();

  const lastScrollY = useRef(0);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;

      if (current > lastScrollY.current && current > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      lastScrollY.current = current;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsOpen(false);
  };

  const navLinkClass = (path) =>
    `relative cursor-pointer transition duration-300 ${
      location.pathname === path
        ? "text-white"
        : "text-white/70 hover:text-white"
    }`;

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500
        ${showNavbar ? "translate-y-0" : "-translate-y-full"}
        bg-gradient-to-b from-black/85 via-black/75 to-black/60
        backdrop-blur-2xl shadow-2xl shadow-black/50`}
      >
        {/* Soft Color Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-pink-500/5 to-orange-400/5 pointer-events-none"></div>

        {/* Bottom Divider Glow */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

        <div className="relative flex items-center justify-between h-16 px-6 md:px-16 lg:px-36">

          {/* Logo */}
          <h1
            onClick={() => handleNavigate("/")}
            className="text-2xl md:text-3xl font-black tracking-widest cursor-pointer group"
          >
            <span className="bg-gradient-to-r from-red-500 via-pink-500 to-orange-400 bg-clip-text text-transparent transition-all duration-500 group-hover:brightness-125">
              MuviTic
            </span>
          </h1>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10 text-sm font-medium">
            {["/", "/movies", "/favorite", "/theatres"].map((path, i) => {
              const labels = ["Home", "Movies", "Favourites", "Theaters"];
              return (
                <button
                  key={path}
                  onClick={() => handleNavigate(path)}
                  className={navLinkClass(path)}
                >
                  {labels[i]}
                  {location.pathname === path && (
                    <span className="absolute left-0 -bottom-2 w-full h-[2px] rounded-full bg-gradient-to-r from-red-500 to-orange-400"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">

            <SearchIcon className="hidden md:block w-5 h-5 text-white/70 hover:text-white cursor-pointer transition duration-300" />

            {!user ? (
              <button
                onClick={openSignIn}
                className="px-6 py-2 bg-gradient-to-r from-red-500 via-pink-500 to-orange-400 
                           text-black font-semibold rounded-full
                           transition-all duration-300
                           shadow-lg shadow-red-500/30
                           hover:scale-105 hover:shadow-red-500/50"
              >
                Login
              </button>
            ) : (
              <UserButton afterSignOutUrl="/">
                <UserButton.MenuItems>
                  <UserButton.Action
                    label="My Bookings"
                    labelIcon={<TicketPlus width={15} />}
                    onClick={() => navigate("/my-bookings")}
                  />
                </UserButton.MenuItems>
              </UserButton>
            )}

            {/* Mobile Menu Icon */}
            <MenuIcon
              onClick={() => setIsOpen(true)}
              className="md:hidden w-7 h-7 text-white cursor-pointer"
            />
          </div>
        </div>
      </nav>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`fixed top-0 right-0 h-full w-80 z-50 transform transition-all duration-500 ease-out
        ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        bg-gradient-to-b from-black/95 via-black/90 to-black/95
        backdrop-blur-2xl shadow-2xl shadow-black/60 border-l border-white/10`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-6">
          <XIcon
            onClick={() => setIsOpen(false)}
            className="w-7 h-7 text-white cursor-pointer hover:rotate-90 transition duration-300"
          />
        </div>

        {/* Nav Links */}
        <div className="flex flex-col gap-10 mt-10 px-8 text-xl font-semibold text-white">
          <button
            onClick={() => handleNavigate("/")}
            className="hover:text-red-400 transition"
          >
            Home
          </button>
          <button
            onClick={() => handleNavigate("/movies")}
            className="hover:text-red-400 transition"
          >
            Movies
          </button>
          <button
            onClick={() => handleNavigate("/favorite")}
            className="hover:text-red-400 transition"
          >
            Favourites
          </button>
          <button
            onClick={() => handleNavigate("/theatres")}
            className="hover:text-red-400 transition"
          >
            Theaters
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-500"
        ></div>
      )}
    </>
  );
};

export default Navbar;
