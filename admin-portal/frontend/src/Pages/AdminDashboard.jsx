import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    paidFinesCount: 0,
    pendingFinesCount: 0,
    totalCategories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/dashboard/stats") // Replace with your backend URL
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
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