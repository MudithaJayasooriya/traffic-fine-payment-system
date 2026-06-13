import { Link, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaListAlt,
  FaUserShield,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaChartBar,
  FaSignOutAlt,
} from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear login session
    localStorage.removeItem("adminLoggedIn");

    // redirect to login page
    navigate("/");
  };

  return (
    <div className="w-64 min-h-screen bg-slate-900 text-white p-5 flex flex-col">

      {/* Title */}
      <h1 className="text-2xl font-bold mb-8">
        TrafficPay
      </h1>

      {/* Menu */}
      <nav className="flex flex-col gap-4 flex-1">

        <Link to="/dashboard" className="flex items-center gap-3 hover:text-cyan-400">
          <FaTachometerAlt />
          Dashboard
        </Link>

        <Link to="/categories" className="flex items-center gap-3 hover:text-cyan-400">
          <FaListAlt />
          Categories
        </Link>

        <Link to="/officers" className="flex items-center gap-3 hover:text-cyan-400">
          <FaUserShield />
          Officers
        </Link>

        <Link to="/reports" className="flex items-center gap-3 hover:text-cyan-400">
          <FaMoneyBillWave />
          Revenue Reports
        </Link>

        <Link to="/pending-fines" className="flex items-center gap-3 hover:text-cyan-400">
          <FaExclamationTriangle />
          Pending Fines
        </Link>

        <Link to="/statistics" className="flex items-center gap-3 hover:text-cyan-400">
          <FaChartBar />
          Statistics
        </Link>

      </nav>

      {/* Logout Button (Bottom) */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg mt-6"
      >
        <FaSignOutAlt />
        Logout
      </button>

    </div>
  );
}

export default Sidebar;