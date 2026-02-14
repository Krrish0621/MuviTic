import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import BlurCircle from "./BlurCircle";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const DateSelect = ({ dateTime, id }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const onBookHandler = () => {
    if (!selected) {
      return toast("Please select a date");
    }
    navigate(`/movies/${id}/${selected}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div id="dateSelect" className="pt-28 md:pt-32">
      <div className="relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 p-8 md:p-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">

        {/* Glow Background Effects */}
        <BlurCircle top="-120px" left="-120px" size="18rem" opacity={0.2} />
        <BlurCircle bottom="-120px" right="-80px" size="16rem" opacity={0.15} />

        {/* Date Selection */}
        <div className="w-full md:w-auto">
          <p className="text-xl font-semibold tracking-wide">
            Choose Date
          </p>

          <div className="flex items-center gap-6 mt-6 text-sm">
            <ChevronLeftIcon
              size={28}
              className="text-white/50 hover:text-primary transition-colors cursor-pointer"
            />

            <div className="grid grid-cols-3 sm:grid-cols-4 md:flex md:flex-wrap gap-4">
              {Object.keys(dateTime).map((date) => {
                const formattedDate = new Date(date);
                const isSelected = selected === date;

                return (
                  <button
                    key={date}
                    onClick={() => setSelected(date)}
                    className={`group relative flex flex-col items-center justify-center h-16 w-16 rounded-xl transition-all duration-300 cursor-pointer
                      ${
                        isSelected
                          ? "bg-primary text-black shadow-lg shadow-primary/30 scale-105"
                          : "bg-white/5 border border-white/10 hover:border-primary/60 hover:bg-primary/10"
                      }`}
                  >
                    <span className="text-base font-medium">
                      {formattedDate.getDate()}
                    </span>
                    <span className="text-xs opacity-70">
                      {formattedDate.toLocaleString("en-US", {
                        month: "short",
                      })}
                    </span>
                  </button>
                );
              })}
            </div>

            <ChevronRightIcon
              size={28}
              className="text-white/50 hover:text-primary transition-colors cursor-pointer"
            />
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onBookHandler}
          className="mt-6 md:mt-0 px-10 py-3 rounded-xl bg-primary text-black font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all duration-300"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default DateSelect;
