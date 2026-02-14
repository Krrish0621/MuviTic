import { Link, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { LogOutIcon } from "lucide-react";
import { useClerk } from "@clerk/clerk-react";

const AdminNavbar = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between px-6 md:px-10 h-16 backdrop-blur-xl bg-black/40 border-b border-white/10">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img src={assets.logo} alt="logo" className="w-32 h-auto" />
        <span className="hidden md:block text-sm text-white/50">
          Admin Panel
        </span>
      </Link>

      {/* Right Side */}
      <div className="flex items-center gap-6">

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-white/60 hover:text-primary transition"
        >
          <LogOutIcon className="w-4 h-4" />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
