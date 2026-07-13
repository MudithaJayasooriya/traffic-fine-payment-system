import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

function Statistics() {
  const [districtData, setDistrictData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [summary, setSummary] = useState({ totalRevenue: "0", totalFines: 0, paidFines: 0, pendingFines: 0 });

  useEffect(() => {
    fetch("http://localhost:8080/api/analytics/overview")
      .then((res) => res.json())
      .then((data) => {
        setDistrictData(data.districtData || []);
        setCategoryData(data.categoryData || []);
        setSummary(data.summary || { totalRevenue: "0", totalFines: 0, paidFines: 0, pendingFines: 0 });
      })
      .catch((err) => console.error("Error loading analytical charts:", err));
  }, []);

  const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626"];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-slate-100 min-h-screen p-6">
        <Header title="Statistics & Analytics" />

        {/* Top Summary Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-6">
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-gray-500">Total Revenue</h3>
            <p className="text-3xl font-bold mt-2 text-slate-800">{summary.totalRevenue}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-gray-500">Total Fines</h3>
            <p className="text-3xl font-bold mt-2 text-slate-800">{summary.totalFines.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-gray-500">Paid Fines</h3>
            <p className="text-3xl font-bold mt-2 text-slate-800">{summary.paidFines.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-gray-500">Pending Fines</h3>
            <p className="text-3xl font-bold mt-2 text-slate-800">{summary.pendingFines.toLocaleString()}</p>
          </div>
        </div>

        {/* Bar Chart Container */}
        <div className="bg-white rounded-xl shadow p-5 mt-6">
          <h3 className="text-xl font-bold mb-4 text-slate-800">District Wise Collections</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={districtData}>
              <XAxis dataKey="district" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart Container */}
        <div className="bg-white rounded-xl shadow p-5 mt-6">
          <h3 className="text-xl font-bold mb-4 text-slate-800">Category Wise Collections</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Statistics;