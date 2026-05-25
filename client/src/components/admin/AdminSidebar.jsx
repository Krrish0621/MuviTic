import { assets } from "../../assets/assets";
import {
  LayoutDashboardIcon,
  ListCollapseIcon,
  ListIcon,
  PlusSquareIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const user = {
    firstName: "Admin",
    lastName: "User",
    imageUrl: assets.profile,
  };

  const adminNavlinks = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboardIcon },
    { name: "Add Shows", path: "/admin/add-shows", icon: PlusSquareIcon },
    { name: "List Shows", path: "/admin/list-shows", icon: ListIcon },
    {
      name: "List Bookings",
      path: "/admin/list-bookings",
      icon: ListCollapseIcon,
    },
  ];

  return (
    <aside className="h-[calc(100vh-80px)] md:flex flex-col items-center pt-10 w-full max-w-16 md:max-w-72 border-r border-white/10 bg-black/35 backdrop-blur-2xl text-sm">

      {/* Profile */}
      <div className="flex flex-col items-center">
        <img
          className="h-10 w-10 md:h-16 md:w-16 rounded-full object-cover border border-white/10"
          src={user.imageUrl}
          alt="admin"
        />
        <p className="mt-3 text-base font-medium max-md:hidden text-white">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-xs text-white/50 max-md:hidden">Administrator</p>
      </div>

      {/* Navigation */}
      <nav className="w-full mt-10 flex flex-col gap-2 px-2">

        {adminNavlinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            end
            className={({ isActive }) =>
              `group relative flex items-center max-md:justify-center gap-3 w-full py-3 md:px-6 rounded-2xl transition-all duration-300
              ${
                isActive
                  ? "bg-primary text-black shadow-lg shadow-primary/20"
                  : "text-white/60 hover:bg-white/[0.07] hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon className="w-5 h-5" />

                <span className="max-md:hidden">
                  {link.name}
                </span>

                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-l-md" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
