import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaBars,
  FaCarSide,
  FaChevronRight,
  FaHome,
  FaQuestionCircle,
  FaSearch,
  FaSignOutAlt,
  FaTimes,
  FaHistory,
  FaUserCircle,
} from "react-icons/fa";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    ["Dashboard", "/dashboard", FaHome],
    ["Search Fine", "/search-fine", FaSearch],
    ["Payment History", "/history", FaHistory],
    ["Profile", "/profile", FaUserCircle],
    ["Help", "/help", FaQuestionCircle],
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-[#042033]/45 bg-[#041026]/95 text-[#eaf6ff] shadow-[0_8px_24px_rgba(2,16,34,0.18)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0f4f78] text-[#eaf6ff] shadow-[0_10px_18px_rgba(0,0,0,0.18)]">
              <FaCarSide className="text-lg" />
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#9fcfff]">
                Driver portal
              </p>
              <h1 className="mt-1 text-lg font-extrabold tracking-wide text-[#eaf6ff] md:text-xl">
                Traffic Fine Portal
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex items-center justify-center rounded-2xl border border-transparent bg-transparent p-3 text-[#eaf6ff] transition hover:border-[#0f4f78] hover:bg-[#021622] md:hidden"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <div className="hidden items-center gap-3 text-sm font-semibold md:flex">
            {navItems.map(([label, path, Icon]) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  [
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 transition duration-200",
                    "hover:-translate-y-0.5 hover:border-[#0f4f78] hover:bg-[#021622] hover:text-[#eaf6ff]",
                    isActive
                      ? "border-[#0f4f78] bg-[#0b3a5a] text-[#eaf6ff] shadow-[0_6px_18px_rgba(34,125,201,0.06)]"
                      : "border-transparent bg-transparent text-[#eaf6ff]",
                  ].join(" ")
                }
              >
                <Icon className="text-xs opacity-90" />
                {label}
              </NavLink>
            ))}

            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-2xl border border-[#0f4f78]/40 bg-transparent px-4 py-2 font-bold text-[#eaf6ff] shadow-[0_6px_18px_rgba(0,0,0,0.06)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#021622]"
            >
              <FaSignOutAlt className="text-sm" />
              Logout
            </Link>
          </div>
        </div>

        <div
          className={`mt-4 overflow-hidden rounded-[28px] border border-[#042033]/55 bg-[#021622]/95 transition-all duration-300 md:hidden ${
            menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-2 p-3">
            {navItems.map(([label, path, Icon]) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  [
                    "flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition",
                    isActive
                      ? "border-[#7fc3ff] bg-[#cfeeff] text-[#021022]"
                      : "border-transparent bg-transparent text-[#021022]",
                  ].join(" ")
                }
              >
                <span className="flex items-center gap-3">
                  <Icon className="text-xs" />
                  {label}
                </span>
                <FaChevronRight className="text-[10px] opacity-70" />
              </NavLink>
            ))}

            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-[#0f4f78] bg-transparent px-4 py-3 font-bold text-[#eaf6ff] transition hover:bg-[#021622]"
            >
              <FaSignOutAlt className="text-sm" />
              Logout
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;