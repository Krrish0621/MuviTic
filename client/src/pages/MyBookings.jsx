import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import timeFormat from "../lib/timeFormat";
import { dateFormat } from "../lib/dateFormat";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const { axios, getToken, user, image_base_url } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMyBookings = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get("/api/user/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getMyBookings();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <section className="relative pt-28 md:pt-36 px-6 md:px-16 lg:px-40 pb-24 min-h-screen overflow-hidden">

      <BlurCircle top="120px" left="-120px" size="22rem" opacity={0.15} />
      <BlurCircle bottom="100px" right="-120px" size="20rem" opacity={0.12} />

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-white/60 uppercase tracking-widest text-sm">
            Your Activity
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold mt-2">
            My Bookings
          </h1>
        </div>

        {/* Empty State */}
        {bookings.length === 0 ? (
          <div className="text-center mt-20">
            <p className="text-white/60">
              You haven’t booked any tickets yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">

            {bookings.map((item) => (
              <div
                key={item._id}
                className="flex flex-col md:flex-row justify-between bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 hover:border-primary/40 transition-all duration-300"
              >
                {/* Left Section */}
                <div className="flex flex-col md:flex-row gap-6">

                  <img
                    src={
                      image_base_url +
                      item?.show?.movie?.poster_path
                    }
                    alt="poster"
                    className="h-40 w-28 object-cover rounded-xl shadow-md"
                  />

                  <div className="flex flex-col justify-between">

                    <div>
                      <p className="text-lg font-semibold">
                        {item?.show?.movie?.title}
                      </p>

                      <p className="text-white/60 text-sm mt-1">
                        {timeFormat(item?.show?.movie?.runtime)}
                      </p>

                      <p className="text-white/50 text-sm mt-1">
                        {dateFormat(item?.show?.showDateTime)}
                      </p>
                    </div>

                    <div className="text-sm text-white/60 mt-4">
                      <p>
                        <span className="text-white/40">Total Tickets:</span>{" "}
                        {item.bookedSeats?.length}
                      </p>
                      <p>
                        <span className="text-white/40">Seat Numbers:</span>{" "}
                        {item.bookedSeats?.join(", ")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-col md:items-end justify-between mt-6 md:mt-0">

                  <div className="flex items-center gap-4">
                    <p className="text-2xl font-semibold">
                      {currency}
                      {item.amount}
                    </p>

                    {!item.isPaid ? (
                      <Link
                        to={item.paymentLink}
                        className="px-4 py-2 text-sm bg-primary text-black rounded-full font-medium shadow-md shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
                      >
                        Pay Now
                      </Link>
                    ) : (
                      <span className="px-4 py-2 text-sm bg-green-500/20 text-green-400 rounded-full">
                        Paid
                      </span>
                    )}
                  </div>

                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </section>
  );
};

export default MyBookings;
