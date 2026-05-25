import { useEffect, useMemo, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import {
  CalendarPlus,
  CheckIcon,
  Clapperboard,
  DeleteIcon,
  IndianRupee,
  Search,
  Sparkles,
  StarIcon,
  Wand2,
} from "lucide-react";
import { kConverter } from "../../lib/kConverter";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const sectionLabels = {
  nowPlaying: "Now Playing India",
  popular: "Global Popular",
  upcoming: "Upcoming",
  olderMovies: "Classics",
};

const quickTimes = ["10:30", "13:30", "16:30", "19:30", "22:30"];

const AddShows = () => {
  const { axios, getToken, user, image_base_url } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY || "$";

  const [movieSections, setMovieSections] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("220");
  const [addingShow, setAddingShow] = useState(false);
  const [activeSection, setActiveSection] = useState("nowPlaying");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const selectedShowCount = useMemo(
    () =>
      Object.values(dateTimeSelection).reduce(
        (total, times) => total + times.length,
        0
      ),
    [dateTimeSelection]
  );

  const selectedMovieList =
    activeSection === "search"
      ? searchResults
      : movieSections?.[activeSection] || [];

  const fetchNowPlayingMovies = async () => {
    try {
      const { data } = await axios.get("/api/show/now-playing", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) setMovieSections(data.sections);
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.error("Could not load TMDB movies");
    }
  };

  const searchMovies = async () => {
    const query = searchQuery.trim();
    if (!query) return toast("Type a movie name first");

    try {
      setSearching(true);
      setActiveSection("search");
      const { data } = await axios.get(`/api/show/search?q=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setSearchResults(data.movies);
        if (data.movies.length === 0) toast("No movies found");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Movie search error:", error);
      toast.error("Search failed");
    } finally {
      setSearching(false);
    }
  };

  const addTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if (times.includes(time)) return prev;
      return { ...prev, [date]: [...times, time].sort() };
    });
  };

  const handleDateTimeAdd = () => {
    if (!dateTimeInput) return toast("Select a date and time");
    const [date, time] = dateTimeInput.split("T");
    if (!date || !time) return;
    addTime(date, time);
  };

  const addSmartWeekPlan = () => {
    const today = new Date();
    for (let day = 0; day < 5; day += 1) {
      const date = new Date(today);
      date.setDate(today.getDate() + day);
      const dateKey = date.toISOString().split("T")[0];
      ["13:30", "19:30", "22:30"].forEach((time) => addTime(dateKey, time));
    }
  };

  const handleRemoveTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const filteredTimes = prev[date].filter((item) => item !== time);
      if (filteredTimes.length === 0) {
        const { [date]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [date]: filteredTimes };
    });
  };

  const handleSubmit = async () => {
    try {
      if (!selectedMovie || Object.keys(dateTimeSelection).length === 0 || !showPrice) {
        return toast("Select movie, price and at least one showtime");
      }

      setAddingShow(true);

      const showsInput = Object.entries(dateTimeSelection).map(
        ([date, time]) => ({ date, time })
      );

      const { data } = await axios.post(
        "/api/show/add",
        {
          movieId: selectedMovie.id,
          showsInput,
          showPrice: Number(showPrice),
        },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        toast.success(data.message);
        setSelectedMovie(null);
        setDateTimeSelection({});
        setDateTimeInput("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setAddingShow(false);
    }
  };

  useEffect(() => {
    if (user) fetchNowPlayingMovies();
  }, [user]);

  if (!movieSections) return <Loading />;

  return (
    <>
      <Title text1="Add" text2="Shows" />

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="flex items-center gap-2 text-sm text-primary">
                  <Wand2 className="h-4 w-4" />
                  TMDB-powered movie picker
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Search or choose a movie to schedule
                </h2>
              </div>

              <div className="flex min-w-0 flex-1 gap-2 lg:max-w-xl">
                <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
                  <Search className="h-5 w-5 text-white/45" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") searchMovies();
                    }}
                    placeholder="Search any movie..."
                    className="w-full bg-transparent text-sm outline-none placeholder:text-white/35"
                  />
                </div>
                <button
                  onClick={searchMovies}
                  disabled={searching}
                  className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-black disabled:opacity-60"
                >
                  {searching ? "Searching" : "Search"}
                </button>
              </div>
            </div>

            <div className="mt-5 flex gap-3 overflow-x-auto pb-1 no-scrollbar">
              {Object.keys(sectionLabels).map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm ${
                    activeSection === section
                      ? "border-primary bg-primary text-black"
                      : "border-white/10 bg-white/5 text-white/65 hover:border-primary/50 hover:text-white"
                  }`}
                >
                  {sectionLabels[section]}
                </button>
              ))}
              <button
                onClick={() => setActiveSection("search")}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm ${
                  activeSection === "search"
                    ? "border-primary bg-primary text-black"
                    : "border-white/10 bg-white/5 text-white/65 hover:border-primary/50 hover:text-white"
                }`}
              >
                Search Results
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
            {selectedMovieList.map((movie) => {
              const isSelected = selectedMovie?.id === movie.id;

              return (
                <button
                  key={movie.id}
                  className={`group relative overflow-hidden rounded-2xl border bg-white/[0.055] p-3 text-left transition duration-300 hover:-translate-y-1 ${
                    isSelected ? "border-primary" : "border-white/10 hover:border-primary/40"
                  }`}
                  onClick={() => setSelectedMovie(movie)}
                >
                  <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-black/30">
                    <img
                      src={image_base_url + movie.poster_path}
                      alt={movie.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3">
                      <p className="flex items-center gap-1 text-sm text-white/85">
                        <StarIcon className="h-4 w-4 fill-primary text-primary" />
                        {movie.vote_average?.toFixed(1) || "NA"}
                        <span className="text-white/45">
                          ({kConverter(movie.vote_count || 0)})
                        </span>
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="absolute right-5 top-5 grid h-7 w-7 place-items-center rounded-full bg-primary text-black">
                      <CheckIcon className="h-4 w-4" strokeWidth={3} />
                    </div>
                  )}

                  <p className="mt-3 truncate font-medium">{movie.title}</p>
                  <p className="text-sm text-white/45">
                    {movie.release_date || "Release date unavailable"}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.055] p-5 backdrop-blur-xl xl:sticky xl:top-24">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/25">
            {selectedMovie ? (
              <div className="grid grid-cols-[110px_1fr] gap-4 p-3">
                <img
                  src={image_base_url + selectedMovie.poster_path}
                  alt={selectedMovie.title}
                  className="h-40 rounded-xl object-cover"
                />
                <div className="min-w-0 py-2">
                  <p className="flex items-center gap-2 text-xs text-primary">
                    <Sparkles className="h-4 w-4" />
                    Selected movie
                  </p>
                  <h3 className="mt-2 line-clamp-2 text-lg font-semibold">
                    {selectedMovie.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/55">
                    {selectedMovie.release_date || "No release date"}
                  </p>
                  <p className="mt-2 flex items-center gap-1 text-sm text-white/70">
                    <StarIcon className="h-4 w-4 fill-primary text-primary" />
                    {selectedMovie.vote_average?.toFixed(1) || "NA"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid min-h-44 place-items-center p-6 text-center text-white/55">
                <div>
                  <Clapperboard className="mx-auto h-9 w-9 text-primary" />
                  <p className="mt-3 text-sm">Select a movie to build shows.</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">Show Price</label>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
                {currency === "₹" ? (
                  <IndianRupee className="h-4 w-4 text-primary" />
                ) : (
                  <span className="text-primary">{currency}</span>
                )}
                <input
                  min={0}
                  type="number"
                  value={showPrice}
                  onChange={(event) => setShowPrice(event.target.value)}
                  placeholder="Enter show price"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Select Date and Time
              </label>
              <div className="grid gap-2">
                <input
                  type="datetime-local"
                  value={dateTimeInput}
                  onChange={(event) => setDateTimeInput(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 outline-none"
                />
                <button
                  onClick={handleDateTimeAdd}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm hover:bg-white/15"
                >
                  <CalendarPlus className="h-4 w-4 text-primary" />
                  Add Selected Time
                </button>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Quick time slots</p>
              <div className="flex flex-wrap gap-2">
                {quickTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => {
                      const date =
                        dateTimeInput.split("T")[0] ||
                        new Date().toISOString().split("T")[0];
                      addTime(date, time);
                    }}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:border-primary/50 hover:text-white"
                  >
                    {time}
                  </button>
                ))}
              </div>
              <button
                onClick={addSmartWeekPlan}
                className="mt-3 w-full rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary hover:bg-primary/15"
              >
                Smart 5-day plan
              </button>
            </div>

            {selectedShowCount > 0 && (
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-medium">Selected Showtimes</h2>
                  <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-black">
                    {selectedShowCount}
                  </span>
                </div>

                <div className="mt-4 max-h-64 space-y-4 overflow-y-auto pr-1">
                  {Object.entries(dateTimeSelection).map(([date, times]) => (
                    <div key={date}>
                      <p className="text-sm font-medium text-white/80">{date}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {times.map((time) => (
                          <button
                            key={time}
                            onClick={() => handleRemoveTime(date, time)}
                            className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs text-primary"
                          >
                            {time}
                            <DeleteIcon className="h-3.5 w-3.5" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={addingShow}
              className="w-full rounded-2xl bg-primary px-6 py-3 font-semibold text-black shadow-lg shadow-primary/20 disabled:opacity-60"
            >
              {addingShow ? "Adding Show..." : "Add Show"}
            </button>
          </div>
        </aside>
      </div>
    </>
  );
};

export default AddShows;
