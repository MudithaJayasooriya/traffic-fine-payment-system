import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import API from "../api/axiosInstance";
import { FaMoneyBillWave, FaCheckCircle, FaExclamationTriangle, FaListAlt } from "react-icons/fa";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    paidFinesCount: 0,
    pendingFinesCount: 0,
    totalCategories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/dashboard/stats")
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching stats:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex" style={{ backgroundColor: "#021022", minHeight: "100vh", color: "#eaf6ff" }}>
        <Sidebar />
        <div className="flex-1 p-6 flex items-center justify-center" style={{ backgroundColor: "#021022", minHeight: "100vh" }}>
          <div className="flex items-center gap-3" style={{ color: "#4aa3ff" }}>
            <div className="w-5 h-5 border-2 border-[#4aa3ff] border-t-transparent rounded-full animate-spin"></div>
            <span>Loading Dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex" style={{ backgroundColor: "#021022", minHeight: "100vh", color: "#eaf6ff" }}>
      <Sidebar />
      <div className="flex-1 p-6" style={{ backgroundColor: "#021022", minHeight: "100vh" }}>
        <Header title="Admin Dashboard" subtitle="Real-time Traffic Fine System Overview" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <StatCard
            title="Total Revenue"
            value={`Rs. ${stats.totalRevenue.toLocaleString()}`}
            icon={FaMoneyBillWave}
            color="text-[#1fc97a]"
          />
          <StatCard
            title="Paid Fines"
            value={stats.paidFinesCount}
            icon={FaCheckCircle}
            color="text-[#4aa3ff]"
            onClick={() => navigate("/pending-fines?status=PAID")}
          />
          <StatCard
            title="Pending Fines"
            value={stats.pendingFinesCount}
            icon={FaExclamationTriangle}
            color="text-[#ff8a4d]"
            onClick={() => navigate("/pending-fines?status=NOT_PAID")}
          />
          <StatCard
            title="Fine Categories"
            value={stats.totalCategories}
            icon={FaListAlt}
            color="text-[#d7a46b]"
            onClick={() => navigate("/categories")}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;