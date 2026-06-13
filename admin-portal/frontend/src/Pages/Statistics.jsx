import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function Statistics() {
  const districtData = [
    { district: "Colombo", revenue: 850000 },
    { district: "Kandy", revenue: 450000 },
    { district: "Galle", revenue: 320000 },
    { district: "Jaffna", revenue: 280000 },
  ];

  const categoryData = [
    { name: "Speeding", value: 950000 },
    { name: "Seat Belt", value: 450000 },
    { name: "Signal Violation", value: 700000 },
    { name: "Parking", value: 250000 },
  ];

  const COLORS = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#dc2626",
  ];

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-slate-100 min-h-screen p-6">
        <Header title="Statistics & Analytics" />

        {/* Top Cards */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-6">

          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-gray-500">
              Total Revenue
            </h3>

            <p className="text-3xl font-bold mt-2">
              Rs. 2.3M
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-gray-500">
              Total Fines
            </h3>

            <p className="text-3xl font-bold mt-2">
              1,250
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-gray-500">
              Paid Fines
            </h3>

            <p className="text-3xl font-bold mt-2">
              820
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-gray-500">
              Pending Fines
            </h3>

            <p className="text-3xl font-bold mt-2">
              430
            </p>
          </div>

        </div>

        {/* District Chart */}

        <div className="bg-white rounded-xl shadow p-5 mt-6">
          <h3 className="text-xl font-bold mb-4">
            District Wise Collections
          </h3>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={districtData}>
              <XAxis dataKey="district" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Chart */}

        <div className="bg-white rounded-xl shadow p-5 mt-6">
          <h3 className="text-xl font-bold mb-4">
            Category Wise Collections
          </h3>

          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="value"
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
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