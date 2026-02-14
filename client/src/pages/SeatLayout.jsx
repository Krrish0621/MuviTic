import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Loading from "../components/Loading";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import isoTimeFormat from "../lib/isoTimeFormat";
import BlurCircle from "../components/BlurCircle";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const SeatLayout = () => {
  const groupRows = [
    ["A", "B"],
    ["C", "D"],
    ["E", "F"],
    ["G", "H"],
    ["I", "J"],
  ];

  const { id, date } = useParams();
  const navigate = useNavigate();

  const { axios, getToken, user } = useAppContext();

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
      if (data.success) {
        setShow(data);
      }
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
        setSelectedSeats([]); // reset seats when time changes
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSeats(false);
    }
  };

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast("Please select time first");
    }

    if (isSeatOccupied(seatId)) {
      return toast("This seat is already booked");
    }

    if (!isSeatSelected(seatId) && selectedSeats.length >= MAX_SELECTION) {
      return toast(`You can only select ${MAX_SELECTION} seats`);
    }

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const bookTickets = async () => {
    try {
      if (!user) return toast.error("Please login to proceed");

      if (!selectedTime || selectedSeats.length === 0) {
        return toast.error("Please select a time and seats");
      }

      const token = await getToken();

      const { data } = await axios.post(
        "/api/booking/create",
        { showId: selectedTime.showId, selectedSeats },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (id) getShow();
  }, [id]);

  useEffect(() => {
    if (selectedTime) {
      getOccupiedSeats();
    }
  }, [selectedTime]);

  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-3">
      {Array.from({ length: count }, (_, i) => {
        const seatId = `${row}${i + 1}`;
        const selected = isSeatSelected(seatId);
        const occupied = isSeatOccupied(seatId);

        return (
          <button
            key={seatId}
            onClick={() => handleSeatClick(seatId)}
            disabled={occupied}
            className={`h-9 w-9 rounded-md text-xs font-medium transition-all duration-200 border
              ${
                occupied
                  ? "bg-white/10 text-white/30 cursor-not-allowed"
                  : selected
                  ? "bg-primary text-black border-primary shadow-md shadow-primary/30"
                  : "bg-white/5 border-white/20 hover:border-primary/60 hover:scale-105"
              }
            `}
          >
            {seatId}
          </button>
        );
      })}
    </div>
  );

  if (!show) return <Loading />;

  return (
    <section className="relative flex flex-col md:flex-row px-6 md:px-16 lg:px-32 py-28 overflow-hidden">

      <BlurCircle top="100px" left="-120px" size="22rem" opacity={0.15} />
      <BlurCircle bottom="0" right="-100px" size="22rem" opacity={0.12} />

      {/* Timings Sidebar */}
      <div className="md:w-64 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-max md:sticky md:top-28">

        <p className="text-lg font-semibold mb-6">
          Available Timings
        </p>

        <div className="space-y-3">
          {show?.dateTime?.[date]?.map((item) => (
            <button
              key={item.showId}
              onClick={() => setSelectedTime(item)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all w-full
                ${
                  selectedTime?.showId === item.showId
                    ? "bg-primary text-black"
                    : "bg-white/5 hover:bg-white/10"
                }
              `}
            >
              <ClockIcon className="w-4 h-4" />
              {isoTimeFormat(item.time)}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 text-xs text-white/60 space-y-2">
          <p><span className="inline-block w-3 h-3 bg-white/20 rounded mr-2"></span>Available</p>
          <p><span className="inline-block w-3 h-3 bg-primary rounded mr-2"></span>Selected</p>
          <p><span className="inline-block w-3 h-3 bg-white/10 rounded mr-2"></span>Booked</p>
        </div>
      </div>

      {/* Seat Area */}
      <div className="flex-1 flex flex-col items-center mt-16 md:mt-0">

        <h1 className="text-2xl font-semibold mb-6">
          Select Your Seats
        </h1>

        <img
          src={assets.screenImage}
          alt="screen"
          className="mb-4"
        />

        <p className="text-white/50 text-xs mb-10">
          SCREEN SIDE
        </p>

        <div className="text-xs text-white/70">

          {groupRows.map((group, index) => (
            <div key={index} className="mb-6">
              {group.map((row) => renderSeats(row))}
            </div>
          ))}

        </div>

        <button
          onClick={bookTickets}
          disabled={loadingSeats}
          className="mt-16 flex items-center gap-2 px-10 py-3 text-sm bg-primary text-black hover:bg-primary-dull rounded-full font-medium transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50"
        >
          Proceed to Checkout
          <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
        </button>

      </div>
    </section>
  );
};

export default SeatLayout;
