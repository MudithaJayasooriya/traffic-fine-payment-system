import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaListAlt,
  FaUserShield,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaChartBar,
  FaSignOutAlt,
  FaShieldAlt,
} from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminLoggedIn");
    navigate("/");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: FaTachometerAlt },
    { path: "/categories", label: "Categories", icon: FaListAlt },
    { path: "/officers", label: "Officers", icon: FaUserShield },
    { path: "/reports", label: "Revenue Reports", icon: FaMoneyBillWave },
    { path: "/pending-fines", label: "Pending Fines", icon: FaExclamationTriangle },
    { path: "/statistics", label: "Statistics", icon: FaChartBar },
  ];

  return (
    <div className="w-64 min-h-screen bg-[#06192d] border-r border-[#164e70] p-5 flex flex-col justify-between text-[#eaf6ff]">
      <div>
        {/* Title / Logo Header */}
        <div className="flex items-center gap-3 mb-8 px-2 pt-2">
          <div className="p-2.5 rounded-xl bg-[#072b46] border border-[#4aa3ff]/40 text-[#4aa3ff]">
            <FaShieldAlt className="text-xl" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#fff6ea] tracking-wider">TRAFFICPAY</h1>
            <p className="text-[10px] tracking-widest text-[#d7a46b] font-semibold">ADMIN TERMINAL</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? "bg-[#072b46] text-[#4aa3ff] border border-[#4aa3ff]/40 shadow-lg shadow-black/20 font-bold"
                    : "text-[#aacde9] hover:bg-[#07223a] hover:text-[#4aa3ff]"
                }`}
              >
                <Icon className={`text-base ${isActive ? "text-[#4aa3ff]" : "text-[#5aa3ff]"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-3 bg-red-950/40 hover:bg-red-900/60 text-[#ff8a8a] border border-red-800/50 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm mt-8 cursor-pointer"
      >
        <FaSignOutAlt />
        Log Out
      </button>
    </div>
  );
}

export default Sidebar;