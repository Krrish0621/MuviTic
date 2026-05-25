import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dateFormat } from "../../lib/dateFormat";
import { useAppContext } from "../../context/AppContext";
import { ReceiptText, Search } from "lucide-react";

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const { axios, getToken, user } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");

  const getAllBookings = async () => {
    try {
      const { data } = await axios.get("/api/admin/all-bookings", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      setBookings(data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      getAllBookings();
    }
  }, [user]);

  const filteredBookings = bookings.filter((item) => {
    const text = [
      item.user,
      item.show?.movie?.title,
      item.bookedSeats?.join(" "),
      item.amount,
    ]
      .join(" ")
      .toLowerCase();

    return text.includes(query.toLowerCase());
  });

  return !isLoading ? (
    <>
      <Title text1="List" text2="Bookings" />

      <div className="glass-panel mt-6 flex max-w-6xl flex-col gap-4 rounded-3xl p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm text-primary">
            <ReceiptText className="h-4 w-4" />
            {filteredBookings.length} booking records
          </p>
          <p className="mt-1 text-sm text-white/50">
            Track customers, seats, payments and show timing.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 md:min-w-80">
          <Search className="h-5 w-5 text-white/45" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search bookings..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-white/35"
          />
        </div>
      </div>

      <div className="max-w-6xl mt-6 overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.04]">
        <table className="w-full border-collapse overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-white/10 text-left text-white">
              <th className="p-4 font-medium pl-5">User Name</th>
              <th className="p-4 font-medium">Movie Name</th>
              <th className="p-4 font-medium">Show Time</th>
              <th className="p-4 font-medium">Seats</th>
              <th className="p-4 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {filteredBookings.map((item, index) => (
              <tr
                key={index}
                className="border-b border-white/10 bg-white/[0.025] even:bg-white/[0.055]"
              >
                <td className="p-4 min-w-45 pl-5">
                  {item.user || "Unknown User"}
                </td>

                <td className="p-4 font-medium">
                  {item.show?.movie?.title || "Movie Deleted"}
                </td>

                <td className="p-4 text-white/70">
                  {item.show?.showDateTime
                    ? dateFormat(item.show.showDateTime)
                    : "N/A"}
                </td>

                <td className="p-4">
                  {Array.isArray(item.bookedSeats)
                    ? item.bookedSeats.join(", ")
                    : "N/A"}
                </td>

                <td className="p-4 font-semibold text-primary">
                  {currency} {item.amount}
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

export default ListBookings;
