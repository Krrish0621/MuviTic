import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bot, Clapperboard, MenuIcon, SearchIcon, Sparkles, TicketPlus, XIcon } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Movies", path: "/movies" },
  { label: "AI Picks", path: "/#ai-picks" },
  { label: "Favourites", path: "/favorite" },
  { label: "Theaters", path: "/theatres" },
];

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
      setShowNavbar(!(current > lastScrollY.current && current > 110));
      setScrolled(current > 18);
      lastScrollY.current = current;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (path) => {
    if (path === "/#ai-picks") {
      navigate("/");
      setTimeout(() => {
        document.getElementById("ai-picks")?.scrollIntoView({ behavior: "smooth" });
      }, 80);
      setIsOpen(false);
      return;
    }

    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed left-0 top-0 z-50 w-full transition-all duration-500 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="px-4 pt-4 sm:px-6 lg:px-8">
          <div
            className={`mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full border px-4 transition-all duration-300 md:px-5 ${
              scrolled
                ? "border-white/10 bg-black/60 shadow-2xl shadow-black/35 backdrop-blur-2xl"
                : "border-white/10 bg-white/[0.055] backdrop-blur-xl"
            }`}
          >
            <button
              onClick={() => handleNavigate("/")}
              className="group flex items-center gap-3"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-black shadow-lg shadow-primary/25">
                <Clapperboard className="h-5 w-5" />
              </span>
              <span className="text-xl font-black tracking-wide md:text-2xl">
                Muvi<span className="text-primary">Tic</span>
              </span>
            </button>

            <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-black/28 p-1 md:flex">
              {navItems.map((item) => {
                const active =
                  location.pathname === item.path ||
                  (item.path === "/#ai-picks" && location.hash === "#ai-picks");

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      active
                        ? "bg-white text-black"
                        : "text-white/62 hover:bg-white/8 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavigate("/movies")}
                className="hidden h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:border-primary/50 hover:text-primary md:grid"
                aria-label="Search movies"
              >
                <SearchIcon className="h-5 w-5" />
              </button>

              <button
                onClick={() => handleNavigate("/#ai-picks")}
                className="hidden items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/15 lg:flex"
              >
                <Bot className="h-4 w-4" />
                Ask AI
              </button>

              {!user ? (
                <button onClick={openSignIn} className="coral-button px-5 py-2 text-sm">
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

              <button
                onClick={() => setIsOpen(true)}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white md:hidden"
                aria-label="Open menu"
              >
                <MenuIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`fixed right-0 top-0 z-50 h-full w-80 max-w-[86vw] transform border-l border-white/10 bg-[#070914]/95 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-500 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold">MuviTic OS</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-10 flex flex-col gap-3">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className="rounded-2xl border border-white/10 bg-white/[0.055] px-5 py-4 text-left font-semibold text-white/75 hover:border-primary/40 hover:text-white"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {isOpen && (
        <button
          aria-label="Close menu overlay"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        />
      )}
    </>
  );
};

export default Navbar;
