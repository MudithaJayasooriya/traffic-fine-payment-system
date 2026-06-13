import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";

function RevenueReports() {
  const [reports] = useState([
    {
      id: 1,
      district: "Colombo",
      category: "Speeding",
      amount: 3000,
      date: "2026-06-01",
      status: "PAID",
    },
    {
      id: 2,
      district: "Kandy",
      category: "Seat Belt",
      amount: 2000,
      date: "2026-06-02",
      status: "PAID",
    },
    {
      id: 3,
      district: "Galle",
      category: "Signal Violation",
      amount: 5000,
      date: "2026-06-03",
      status: "PAID",
    },
  ]);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-slate-100 min-h-screen p-6">
        <Header title="Revenue Reports" />

        {/* Summary Cards */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
          <StatCard
            title="Total Revenue"
            value="Rs. 2,350,000"
          />

          <StatCard
            title="Paid Fines"
            value="1250"
          />

          <StatCard
            title="Collected Today"
            value="Rs. 45,000"
          />
        </div>

        {/* Filters */}

        <div className="bg-white rounded-xl shadow p-5 mt-6">
          <h3 className="font-bold text-lg mb-4">
            Filter Reports
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <input
              type="date"
              className="border p-3 rounded-lg"
            />

            <input
              type="date"
              className="border p-3 rounded-lg"
            />

            <select className="border p-3 rounded-lg">
              <option>All Districts</option>
              <option>Colombo</option>
              <option>Kandy</option>
              <option>Galle</option>
            </select>

            <button className="bg-blue-600 text-white rounded-lg">
              Generate Report
            </button>

          </div>
        </div>

        {/* District Collections */}

        <div className="bg-white rounded-xl shadow p-5 mt-6">
          <h3 className="font-bold text-lg mb-4">
            District Wise Collections
          </h3>

          <table className="w-full">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="p-3 text-left">
                  District
                </th>

                <th className="p-3 text-left">
                  Collection
                </th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="p-3">Colombo</td>
                <td className="p-3">
                  Rs. 850,000
                </td>
              </tr>

              <tr className="border-b">
                <td className="p-3">Kandy</td>
                <td className="p-3">
                  Rs. 450,000
                </td>
              </tr>

              <tr>
                <td className="p-3">Galle</td>
                <td className="p-3">
                  Rs. 320,000
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Category Collections */}

        <div className="bg-white rounded-xl shadow p-5 mt-6">
          <h3 className="font-bold text-lg mb-4">
            Category Wise Collections
          </h3>

          <table className="w-full">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="p-3 text-left">
                  Category
                </th>

                <th className="p-3 text-left">
                  Collection
                </th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="p-3">Speeding</td>
                <td className="p-3">
                  Rs. 950,000
                </td>
              </tr>

              <tr className="border-b">
                <td className="p-3">Seat Belt</td>
                <td className="p-3">
                  Rs. 450,000
                </td>
              </tr>

              <tr>
                <td className="p-3">
                  Signal Violation
                </td>

                <td className="p-3">
                  Rs. 700,000
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Revenue Details */}

        <div className="bg-white rounded-xl shadow mt-6 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="p-3 text-left">
                  District
                </th>

                <th className="p-3 text-left">
                  Category
                </th>

                <th className="p-3 text-left">
                  Amount
                </th>

                <th className="p-3 text-left">
                  Date
                </th>

                <th className="p-3 text-left">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {reports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b hover:bg-slate-50"
                >
                  <td className="p-3">
                    {report.district}
                  </td>

                  <td className="p-3">
                    {report.category}
                  </td>

                  <td className="p-3">
                    Rs. {report.amount}
                  </td>

                  <td className="p-3">
                    {report.date}
                  </td>

                  <td className="p-3 text-green-600 font-semibold">
                    {report.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default RevenueReports;