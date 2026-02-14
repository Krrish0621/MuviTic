import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Loading = () => {
  const { nextUrl } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let timer;

    if (nextUrl) {
      timer = setTimeout(() => {
        navigate("/" + nextUrl);
      }, 4000); // reduced from 8000 (8s is too long UX)
    }

    return () => clearTimeout(timer);
  }, [nextUrl, navigate]);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-black overflow-hidden">

      {/* Glow Background */}
      <div className="absolute w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse"></div>

      {/* Spinner */}
      <div className="h-16 w-16 rounded-full border-4 border-white/10 border-t-primary animate-spin"></div>

      {/* Text */}
      <p className="mt-6 text-white/60 tracking-wide text-sm">
        Loading your experience...
      </p>
    </div>
  );
};

export default Loading;
