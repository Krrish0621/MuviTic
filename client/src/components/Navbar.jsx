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
  const [scrolled, setScrolled] = useState(false);

  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;

      if (current > lastScrollY.current && current > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      setScrolled(current > 20);
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
    `relative cursor-pointer transition-all duration-300 ${
      location.pathname === path
        ? "text-white"
        : "text-white/70 hover:text-white"
    }`;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500
        ${showNavbar ? "translate-y-0" : "-translate-y-full"}
        ${
          scrolled
            ? "bg-black/70 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/40"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 md:px-16 lg:px-36">

          {/* Logo */}
          <h1
            onClick={() => handleNavigate("/")}
            className="text-2xl md:text-3xl font-black tracking-widest cursor-pointer"
          >
            <span className="bg-gradient-to-r from-red-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              MuviTic
            </span>
          </h1>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
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
                    <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-gradient-to-r from-red-500 to-orange-400 rounded-full"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4 sm:gap-6">

            <SearchIcon className="hidden md:block w-5 h-5 text-white/70 hover:text-white cursor-pointer transition" />

            {!user ? (
              <button
                onClick={openSignIn}
                className="px-5 py-2 rounded-full font-semibold
                           bg-gradient-to-r from-red-500 via-pink-500 to-orange-400
                           text-black shadow-lg shadow-red-500/30
                           hover:scale-105 hover:shadow-red-500/50
                           transition-all duration-300"
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

            <MenuIcon
              onClick={() => setIsOpen(true)}
              className="md:hidden w-7 h-7 text-white cursor-pointer"
            />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-72 sm:w-80 z-50 transform transition-all duration-500
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        bg-black/95 backdrop-blur-xl border-l border-white/10`}
      >
        <div className="flex justify-end p-6">
          <XIcon
            onClick={() => setIsOpen(false)}
            className="w-7 h-7 text-white cursor-pointer hover:rotate-90 transition"
          />
        </div>

        <div className="flex flex-col gap-8 mt-10 px-8 text-lg font-semibold text-white">
          {[
            { label: "Home", path: "/" },
            { label: "Movies", path: "/movies" },
            { label: "Favourites", path: "/favorite" },
            { label: "Theaters", path: "/theatres" },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className="hover:text-red-400 transition"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        ></div>
      )}
    </>
  );
};

export default Navbar;