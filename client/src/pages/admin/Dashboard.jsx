import {
  ChartLineIcon,
  CircleDollarSignIcon,
  Clock3,
  PlayCircleIcon,
  StarIcon,
  Ticket,
  UsersIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import BlurCircle from "../../components/BlurCircle";
import { dateFormat } from "../../lib/dateFormat";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { axios, getToken, user, image_base_url } = useAppContext();

  const currency = import.meta.env.VITE_CURRENCY;

  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0,
  });

  const [loading, setLoading] = useState(true);

  const dashboardCards = [
    {
      title: "Total Bookings",
      value: dashboardData.totalBookings || "0",
      icon: ChartLineIcon,
    },
    {
      title: "Total Revenue",
      value: currency + dashboardData.totalRevenue || "0",
      icon: CircleDollarSignIcon,
    },
    {
      title: "Active Shows",
      value: dashboardData.activeShows.length || "0",
      icon: PlayCircleIcon,
    },
    {
      title: "Total Users",
      value: dashboardData.totalUser || "0",
      icon: UsersIcon,
    },
  ];

  const totalSeatsBooked = dashboardData.activeShows.reduce(
    (total, show) => total + Object.keys(show.occupiedSeats || {}).length,
    0
  );

  const topShow = [...dashboardData.activeShows].sort(
    (a, b) =>
      Object.keys(b.occupiedSeats || {}).length -
      Object.keys(a.occupiedSeats || {}).length
  )[0];

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setDashboardData(data.dashboardData);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  return !loading ? (
    <>
      <Title text1="Admin" text2="Dashboard" />
      <div className="relative flex flex-wrap gap-4 mt-6">
        <BlurCircle top="-100px" left="0" />
        <div className="flex flex-wrap gap-4 w-full">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.055] px-5 py-4 backdrop-blur-xl max-w-60 w-full hover:border-primary/40 transition"
            >
              <div>
                <h1 className="text-sm text-white/55">{card.title}</h1>
                <p className="text-xl font-medium mt-1">{card.value}</p>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary">
                <card.icon className="w-6 h-6" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1fr] max-w-5xl">
        <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl">
          <p className="flex items-center gap-2 text-sm text-primary">
            <Ticket className="h-4 w-4" />
            Live operations
          </p>
          <h2 className="mt-3 text-2xl font-semibold">
            {totalSeatsBooked} seats booked across active shows
          </h2>
          <p className="mt-2 text-sm text-white/55">
            This helps you judge demand before adding more late-night or weekend slots.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl">
          <p className="flex items-center gap-2 text-sm text-primary">
            <Clock3 className="h-4 w-4" />
            Best performing show
          </p>
          <h2 className="mt-3 truncate text-2xl font-semibold">
            {topShow?.movie?.title || "No active bookings yet"}
          </h2>
          <p className="mt-2 text-sm text-white/55">
            {topShow
              ? `${Object.keys(topShow.occupiedSeats || {}).length} seats booked for ${dateFormat(topShow.showDateTime)}`
              : "Once bookings start, your strongest show appears here."}
          </p>
        </div>
      </div>

      <p className="mt-10 text-lg font-medium">Active Shows</p>
      <div className="relative grid gap-6 mt-4 max-w-6xl sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <BlurCircle top="100px" left="-10%" />
        {dashboardData.activeShows.map((show) => (
          <div
            key={show._id}
            className="rounded-2xl overflow-hidden h-full bg-white/[0.055] border border-white/10 hover:-translate-y-1 hover:border-primary/40 transition duration-300"
          >
            <img
              src={image_base_url + show.movie.poster_path}
              alt="poster"
              className="h-60 w-full object-cover"
            />
            <p className="font-medium p-2 truncate">{show.movie.title}</p>
            <div className="flex items-center justify-between px-2">
              <p className="text-lg font-medium">
                {currency} {show.showPrice}
              </p>
              <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
                <StarIcon className="w-4 h-4 text-primary fill-primary" />
                {show.movie.vote_average.toFixed(1)}
              </p>
            </div>
            <p className="px-2 pt-2 text-sm text-gray-500">
              {dateFormat(show.showDateTime)}
            </p>
            <p className="px-2 pt-1 pb-3 text-sm text-white/50">
              {Object.keys(show.occupiedSeats || {}).length} seats booked
            </p>
          </div>
        ))}
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default Dashboard;
