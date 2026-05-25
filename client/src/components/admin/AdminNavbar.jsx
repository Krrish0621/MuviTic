import { Link, useNavigate } from "react-router-dom";
import { Clapperboard, LogOutIcon, ShieldCheck } from "lucide-react";
import { useClerk } from "@clerk/clerk-react";

const AdminNavbar = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="flex h-20 items-center justify-between border-b border-white/10 bg-black/45 px-6 backdrop-blur-2xl md:px-10">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-black">
          <Clapperboard className="h-5 w-5" />
        </span>
        <span className="text-2xl font-black">
          Muvi<span className="text-primary">Tic</span>
        </span>
        <span className="hidden items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary md:flex">
          <ShieldCheck className="h-4 w-4" />
          Admin OS
        </span>
      </Link>

      {/* Right Side */}
      <div className="flex items-center gap-6">

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-sm text-white/70 hover:border-primary/45 hover:text-primary transition"
        >
          <LogOutIcon className="w-4 h-4" />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
