import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import API from "../api/axiosInstance";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FaMoneyBillWave, FaChartPie, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

function Statistics() {
  const [categoryData, setCategoryData] = useState([]);
  const [summary, setSummary] = useState({ totalRevenue: "0", totalFines: 0, paidFines: 0, pendingFines: 0 });

  useEffect(() => {
    API.get("/api/analytics/overview")
      .then((res) => {
        setCategoryData(res.data.categoryData || []);
        setSummary(res.data.summary || { totalRevenue: "0", totalFines: 0, paidFines: 0, pendingFines: 0 });
      })
      .catch((err) => console.error("Error loading analytical charts:", err));
  }, []);

  const COLORS = ["#4aa3ff", "#1fc97a", "#d7a46b", "#ff8a4d", "#7bd5ff", "#ff5252"];

  return (
    <div className="flex" style={{ backgroundColor: "#021022", minHeight: "100vh", color: "#eaf6ff" }}>
      <Sidebar />
      <div className="flex-1 p-6" style={{ backgroundColor: "#021022", minHeight: "100vh" }}>
        <Header title="Statistics & Analytics" subtitle="Interactive fine distribution charts and system analytics" />

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <StatCard title="Total Revenue" value={`Rs. ${summary.totalRevenue}`} icon={FaMoneyBillWave} color="text-[#1fc97a]" />
          <StatCard title="Total Fines Issued" value={summary.totalFines.toLocaleString()} icon={FaChartPie} color="text-[#4aa3ff]" />
          <StatCard title="Settled Fines" value={summary.paidFines.toLocaleString()} icon={FaCheckCircle} color="text-[#7bd5ff]" />
          <StatCard title="Pending Fines" value={summary.pendingFines.toLocaleString()} icon={FaExclamationTriangle} color="text-[#ff8a4d]" />
        </div>

        {/* Category Wise Collections Chart Container */}
        <div className="rounded-2xl shadow-xl p-6 mt-6 border" style={{ backgroundColor: "#07223a", borderColor: "#164e70" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold" style={{ color: "#ffffff" }}>Violation Category Breakdown</h3>
              <p className="text-xs mt-0.5" style={{ color: "#aacde9" }}>Distribution of fines issued across category types</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full border" style={{ backgroundColor: "#072b46", color: "#4aa3ff", borderColor: "rgba(74, 163, 255, 0.3)" }}>
              REAL-TIME DATA
            </span>
          </div>

          <ResponsiveContainer width="100%" height={360}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={130}
                innerRadius={50}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="#07223a" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#06223b",
                  borderColor: "#214f73",
                  borderRadius: "12px",
                  color: "#ffffff",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Statistics;