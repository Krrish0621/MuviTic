import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import isoTimeFormat from "../lib/isoTimeFormat";
import BlurCircle from "../components/BlurCircle";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const SeatLayout = () => {
  const groupRows = [
    ["A", "B"],       // VIP
    ["C", "D"],       // Premium
    ["E", "F"],
    ["G", "H"],
    ["I", "J"],
  ];

  const VIP_ROWS = ["A", "B"];
  const PREMIUM_ROWS = ["C", "D"];

  const { id, date } = useParams();
  const { axios, getToken, user } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY || "$";

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(false);

  const MAX_SELECTION = 5;

  const isSeatSelected = (seatId) =>
    selectedSeats.includes(seatId);

  const isSeatOccupied = (seatId) =>
    occupiedSeats.includes(seatId);

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);
      if (data.success) setShow(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getOccupiedSeats = async () => {
    try {
      setLoadingSeats(true);
      const { data } = await axios.get(
        `/api/booking/seats/${selectedTime?.showId}`
      );
      if (data.success) {
        setOccupiedSeats(data.occupiedSeats || []);
        setSelectedSeats([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSeats(false);
    }
  };

  const handleSeatClick = (seatId) => {
    if (!selectedTime) return toast("Select time first");
    if (isSeatOccupied(seatId)) return toast("Seat already booked");

    if (!isSeatSelected(seatId) && selectedSeats.length >= MAX_SELECTION) {
      return toast(`Maximum ${MAX_SELECTION} seats allowed`);
    }

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  const bookTickets = async () => {
    try {
      if (!user) return toast.error("Login required");
      if (!selectedTime || selectedSeats.length === 0)
        return toast.error("Select time & seats");

      const token = await getToken();

      const { data } = await axios.post(
        "/api/booking/create",
        { showId: selectedTime.showId, selectedSeats },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) window.location.href = data.url;
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (id) getShow();
  }, [id]);

  useEffect(() => {
    if (selectedTime) getOccupiedSeats();
  }, [selectedTime]);

  if (!show) return <Loading />;

  const seatPrice = (seatId) => {
    if (VIP_ROWS.includes(seatId[0])) return 250;
    if (PREMIUM_ROWS.includes(seatId[0])) return 180;
    return 120;
  };

  const totalPrice = selectedSeats.reduce(
    (acc, seat) => acc + seatPrice(seat),
    0
  );

  return (
    <section className="relative px-4 sm:px-6 md:px-16 lg:px-28 py-24 overflow-hidden">

      <BlurCircle top="120px" left="-120px" size="24rem" opacity={0.12} />
      <BlurCircle bottom="0" right="-100px" size="24rem" opacity={0.1} />

      {/* ===== SHOW DETAILS HEADER ===== */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold">
          {show.movie?.title}
        </h1>
        <p className="text-white/60 mt-2">
          {show.theatre?.name} • {date}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">

        {/* ===== LEFT PANEL ===== */}
        <div className="lg:w-80 w-full space-y-8">

          {/* Timings */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <p className="text-lg font-semibold mb-6">
              Available Timings
            </p>

            <div className="grid grid-cols-2 gap-3">
              {show?.dateTime?.[date]?.map((item) => (
                <button
                  key={item.showId}
                  onClick={() => setSelectedTime(item)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm transition-all
                    ${
                      selectedTime?.showId === item.showId
                        ? "bg-primary text-black shadow-lg shadow-primary/40"
                        : "bg-white/5 hover:bg-white/10"
                    }
                  `}
                >
                  <ClockIcon className="w-4 h-4" />
                  {isoTimeFormat(item.time)}
                </button>
              ))}
            </div>
          </div>

          {/* Booking Summary */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <p className="text-lg font-semibold mb-4">
              Your Selection
            </p>

            <p className="text-sm text-white/70">
              Seats:{" "}
              <span className="text-white">
                {selectedSeats.length
                  ? selectedSeats.join(", ")
                  : "None"}
              </span>
            </p>

            <p className="mt-3 text-sm text-white/70">
              Estimated total:{" "}
              <span className="font-semibold text-primary">
                {currency}
                {totalPrice}
              </span>
            </p>
          </div>
        </div>

        {/* ===== SEAT AREA ===== */}
        <div className="flex-1 flex flex-col items-center">

          {/* Screen */}
          <div className="relative mb-12 w-full max-w-xl">
            <div className="h-3 bg-gradient-to-r from-gray-300 to-white rounded-full shadow-2xl shadow-white/30"></div>
            <p className="text-center text-xs text-white/50 mt-2">
              SCREEN SIDE
            </p>
          </div>

          {/* Seats with Perspective */}
          <div className="overflow-x-auto w-full">
            <div className="min-w-[500px] flex flex-col items-center transform perspective-1000 rotateX-6">

              {groupRows.map((group, index) => (
                <div key={index} className="mb-8">
                  {group.map((row) => (
                    <div key={row} className="flex gap-3 mt-3 justify-center">

                      {Array.from({ length: 9 }, (_, i) => {
                        const seatId = `${row}${i + 1}`;
                        const selected = isSeatSelected(seatId);
                        const occupied = isSeatOccupied(seatId);

                        let baseColor = "bg-white/5 border-white/20";

                        if (VIP_ROWS.includes(row))
                          baseColor = "bg-yellow-500/10 border-yellow-400/40";

                        if (PREMIUM_ROWS.includes(row))
                          baseColor = "bg-purple-500/10 border-purple-400/40";

                        return (
                          <button
                            key={seatId}
                            onClick={() => handleSeatClick(seatId)}
                            disabled={occupied}
                            className={`h-10 w-10 rounded-md text-xs font-medium transition-all duration-200 border
                              ${
                                occupied
                                  ? "bg-white/10 text-white/30 cursor-not-allowed"
                                  : selected
                                  ? "bg-primary text-black border-primary shadow-xl shadow-primary/50 scale-125 animate-bounce"
                                  : `${baseColor} hover:scale-110 hover:shadow-lg`
                              }
                            `}
                          >
                            {seatId}
                          </button>
                        );
                      })}

                    </div>
                  ))}
                </div>
              ))}

            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={bookTickets}
            disabled={loadingSeats}
            className="mt-16 w-full sm:w-auto px-14 py-4 rounded-full
                       bg-gradient-to-r from-primary to-emerald-400
                       text-black font-semibold
                       shadow-xl shadow-primary/30
                       hover:scale-105 hover:shadow-primary/50
                       transition-all duration-300
                       animate-pulse disabled:opacity-50"
          >
            <span className="inline-flex items-center gap-2">
              Proceed to Checkout
              <ArrowRightIcon className="h-5 w-5" />
            </span>
          </button>

        </div>
      </div>
    </section>
  );
};

export default SeatLayout;
