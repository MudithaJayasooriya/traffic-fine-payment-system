import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function PendingFines() {
  const [pendingFines] = useState([
    {
      id: 1,
      referenceNumber: "RF20260001",
      driverNic: "200112345678",
      district: "Colombo",
      category: "Speeding",
      amount: 3000,
      issueDate: "2026-06-01",
      status: "PENDING",
    },
    {
      id: 2,
      referenceNumber: "RF20260002",
      driverNic: "199923456789",
      district: "Kandy",
      category: "Seat Belt",
      amount: 2000,
      issueDate: "2026-06-03",
      status: "PENDING",
    },
    {
      id: 3,
      referenceNumber: "RF20260003",
      driverNic: "198812345678",
      district: "Galle",
      category: "Signal Violation",
      amount: 5000,
      issueDate: "2026-06-05",
      status: "PENDING",
    },
  ]);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-slate-100 min-h-screen p-6">
        <Header title="Pending Fines" />

        {/* Summary Cards */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-gray-500">
              Total Pending Fines
            </h3>

            <p className="text-3xl font-bold mt-2">
              430
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-gray-500">
              Pending Amount
            </h3>

            <p className="text-3xl font-bold mt-2">
              Rs. 1,250,000
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-gray-500">
              Overdue Fines
            </h3>

            <p className="text-3xl font-bold mt-2">
              85
            </p>
          </div>
        </div>

        {/* Filters */}

        <div className="bg-white p-5 rounded-xl shadow mt-6">
          <h3 className="font-bold text-lg mb-4">
            Filter Pending Fines
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <input
              type="text"
              placeholder="Reference Number"
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              placeholder="Driver NIC"
              className="border p-3 rounded-lg"
            />

            <select className="border p-3 rounded-lg">
              <option>All Districts</option>
              <option>Colombo</option>
              <option>Kandy</option>
              <option>Galle</option>
            </select>

            <button className="bg-blue-600 text-white rounded-lg">
              Search
            </button>

          </div>
        </div>

        {/* Table */}

        <div className="bg-white rounded-xl shadow mt-6 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="p-3 text-left">
                  Reference No
                </th>

                <th className="p-3 text-left">
                  Driver NIC
                </th>

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
                  Issue Date
                </th>

                <th className="p-3 text-left">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {pendingFines.map((fine) => (
                <tr
                  key={fine.id}
                  className="border-b hover:bg-slate-50"
                >
                  <td className="p-3">
                    {fine.referenceNumber}
                  </td>

                  <td className="p-3">
                    {fine.driverNic}
                  </td>

                  <td className="p-3">
                    {fine.district}
                  </td>

                  <td className="p-3">
                    {fine.category}
                  </td>

                  <td className="p-3">
                    Rs. {fine.amount}
                  </td>

                  <td className="p-3">
                    {fine.issueDate}
                  </td>

                  <td className="p-3">
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                      {fine.status}
                    </span>
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

export default PendingFines;