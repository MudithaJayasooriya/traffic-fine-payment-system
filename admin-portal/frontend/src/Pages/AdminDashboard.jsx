import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import API from "../api/axiosInstance";

function AdminDashboard() {
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

  if (loading) return <div className="p-6">Loading Dashboard...</div>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-slate-100 min-h-screen">
        <Header title="Admin Dashboard" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          <StatCard
            title="Total Revenue"
            value={`Rs. ${stats.totalRevenue.toLocaleString()}`}
          />
          <StatCard
            title="Paid Fines"
            value={stats.paidFinesCount}
          />
          <StatCard
            title="Pending Fines"
            value={stats.pendingFinesCount}
          />
          <StatCard
            title="Categories"
            value={stats.totalCategories}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;