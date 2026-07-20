import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  FaBars,
  FaCarSide,
  FaChevronRight,
  FaHome,
  FaQuestionCircle,
  FaSearch,
  FaTimes,
  FaHistory,
  FaUserCircle,
  FaBell, 
  FaSignOutAlt
} from "react-icons/fa";
import { fetchNotificationData } from "../utils/notificationHelper";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const loadUnreadCount = async () => {
      const data = await fetchNotificationData();
      setUnreadCount(data.unreadCount);
    };

    loadUnreadCount();
    // Periodically update or re-check on location change
    const interval = setInterval(loadUnreadCount, 5000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  const navItems = [
    ["Dashboard", "/dashboard", FaHome],
    ["Search Fine", "/search-fine", FaSearch],
    ["Payment History", "/history", FaHistory],
    ["Profile", "/profile", FaUserCircle],
    ["Help", "/help", FaQuestionCircle],
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-[#042033]/45 bg-[#041026]/95 text-[#eaf6ff] shadow-[0_8px_24px_rgba(2,16,34,0.18)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-3 md:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0f4f78] text-[#eaf6ff] shadow-md">
              <FaCarSide className="text-base" />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#9fcfff]">
                Driver portal
              </p>
              <h1 className="text-base font-extrabold tracking-wide text-[#eaf6ff]">
                Traffic Fine Portal
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex items-center justify-center rounded-xl border border-transparent bg-transparent p-2 text-[#eaf6ff] transition hover:border-[#0f4f78] hover:bg-[#021622] md:hidden"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <div className="hidden items-center gap-2 text-xs font-semibold md:flex">
            {navItems.map(([label, path, Icon]) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  [
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition duration-200",
                    "hover:border-[#0f4f78] hover:bg-[#021622] hover:text-[#eaf6ff]",
                    isActive
                      ? "border-[#0f4f78] bg-[#0b3a5a] text-[#eaf6ff]"
                      : "border-transparent bg-transparent text-[#eaf6ff]",
                  ].join(" ")
                }
              >
                <Icon className="text-xs opacity-90" />
                {label}
              </NavLink>
            ))}

            <Link
              to="/notifications"
              className="relative p-1.5 ml-1"
              title="Notifications"
            >
              <FaBell className="text-base text-[#9fcfff]" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-extrabold text-white animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>

            <Link
              to="/"
              className="ml-2 inline-flex items-center gap-1.5 rounded-xl border border-[#0f4f78]/40 bg-transparent px-3 py-1.5 font-bold text-[#eaf6ff] transition duration-200 hover:bg-[#021622]"
            >
              <FaSignOutAlt className="text-xs" />
              Logout
            </Link>
          </div>
        </div>

        <div
          className={`mt-3 overflow-hidden rounded-2xl border border-[#042033]/55 bg-[#021622]/95 transition-all duration-300 md:hidden ${
            menuOpen ? "max-h-125 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-1.5 p-3">
            {navItems.map(([label, path, Icon]) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  [
                    "flex items-center justify-between rounded-xl border px-3 py-2.5 text-xs font-semibold transition",
                    isActive
                      ? "border-[#0f4f78] bg-[#0b3a5a] text-[#eaf6ff]"
                      : "border-transparent bg-transparent text-[#eaf6ff]",
                  ].join(" ")
                }
              >
                <span className="flex items-center gap-2">
                  <Icon className="text-xs" />
                  {label}
                </span>
                <FaChevronRight className="text-[10px] opacity-70" />
              </NavLink>
            ))}

            <Link
              to="/notifications"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between rounded-xl border px-3 py-2.5 text-xs font-semibold text-[#eaf6ff] hover:bg-[#021622]"
            >
              <span className="flex items-center gap-2">
                <FaBell className="text-xs text-[#9fcfff]" />
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-extrabold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>

            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[#0f4f78] bg-transparent px-3 py-2.5 text-xs font-bold text-[#eaf6ff] transition hover:bg-[#021622]"
            >
              <FaSignOutAlt className="text-xs" />
              Logout
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;