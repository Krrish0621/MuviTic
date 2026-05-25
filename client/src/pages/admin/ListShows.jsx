import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dateFormat } from "../../lib/dateFormat";
import { useAppContext } from "../../context/AppContext";
import { CalendarDays, Search } from "lucide-react";

const ListShows = () => {
  const { axios, getToken, user } = useAppContext();

  const currency = import.meta.env.VITE_CURRENCY;

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const getAllShow = async () => {
    try {
      const { data } = await axios.get("/api/admin/all-shows", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      setShows(data.shows);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      getAllShow();
    }
  }, [user]);

  const filteredShows = shows.filter((show) =>
    show.movie?.title?.toLowerCase().includes(query.toLowerCase())
  );

  return !loading ? (
    <>
      <Title text1="List" text2="Shows" />

      <div className="mt-6 flex max-w-5xl flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm text-primary">
            <CalendarDays className="h-4 w-4" />
            {filteredShows.length} active shows
          </p>
          <p className="mt-1 text-sm text-white/50">
            Search and monitor every upcoming screening.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 md:min-w-80">
          <Search className="h-5 w-5 text-white/45" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search shows..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-white/35"
          />
        </div>
      </div>

      <div className="max-w-5xl mt-6 overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.04]">
        <table className="w-full border-collapse overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-white/10 text-left text-white">
              <th className="p-4 font-medium pl-5">Movie Name</th>
              <th className="p-4 font-medium">Show Time</th>
              <th className="p-4 font-medium">Bookings</th>
              <th className="p-4 font-medium">Earnings</th>
            </tr>
          </thead>
          <tbody>
            {filteredShows.map((show, index) => (
              <tr
                key={index}
                className="border-b border-white/10 bg-white/[0.025] even:bg-white/[0.055]"
              >
                <td className="p-4 min-w-45 pl-5 font-medium">{show.movie.title}</td>
                <td className="p-4 text-white/70">{dateFormat(show.showDateTime)}</td>
                <td className="p-4">
                  {Object.keys(show.occupiedSeats).length}
                </td>
                <td className="p-4 text-primary font-semibold">
                  {currency}{" "}
                  {Object.keys(show.occupiedSeats).length * show.showPrice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default ListShows;
