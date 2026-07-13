import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function PendingFines() {
  const [pendingFines, setPendingFines] = useState([]);
  const [summary, setSummary] = useState({ totalCount: 0, totalAmount: 0, overdueCount: 0 });
  const [filters, setFilters] = useState({ referenceNumber: "", driverNic: "", district: "All Districts" });

  const fetchPendingData = () => {
    // Build query params based on selected filters
    const queryParams = new URLSearchParams();
    if (filters.referenceNumber) queryParams.append("ref", filters.referenceNumber);
    if (filters.driverNic) queryParams.append("nic", filters.driverNic);
    if (filters.district !== "All Districts") queryParams.append("district", filters.district);

    fetch(`http://localhost:8080/api/fines/pending?${queryParams.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        // Expecting an object containing the array and metrics, or structure accordingly
        setPendingFines(data.fines || []);
        setSummary(data.summary || { totalCount: data.fines?.length || 0, totalAmount: 0, overdueCount: 0 });
      })
      .catch((err) => console.error("Error loading pending fines:", err));
  };

  useEffect(() => {
    fetchPendingData();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-slate-100 min-h-screen p-6">
        <Header title="Pending Fines" />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-gray-500">Total Pending Fines</h3>
            <p className="text-3xl font-bold mt-2">{summary.totalCount}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-gray-500">Pending Amount</h3>
            <p className="text-3xl font-bold mt-2">Rs. {summary.totalAmount.toLocaleString()}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-gray-500">Overdue Fines</h3>
            <p className="text-3xl font-bold mt-2">{summary.overdueCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-5 rounded-xl shadow mt-6">
          <h3 className="font-bold text-lg mb-4">Filter Pending Fines</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              name="referenceNumber"
              value={filters.referenceNumber}
              onChange={handleFilterChange}
              placeholder="Reference Number"
              className="border p-3 rounded-lg text-slate-800 bg-white"
            />
            <input
              type="text"
              name="driverNic"
              value={filters.driverNic}
              onChange={handleFilterChange}
              placeholder="Driver NIC"
              className="border p-3 rounded-lg text-slate-800 bg-white"
            />
            <select 
              name="district" 
              value={filters.district} 
              onChange={handleFilterChange} 
              className="border p-3 rounded-lg text-slate-800 bg-white"
            >
              <option>All Districts</option>
              <option>Colombo</option>
              <option>Kandy</option>
              <option>Galle</option>
            </select>
            <button onClick={fetchPendingData} className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Search
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow mt-6 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="p-3 text-left">Reference No</th>
                <th className="p-3 text-left">Driver NIC</th>
                <th className="p-3 text-left">District</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Issue Date</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingFines.map((fine) => (
                <tr key={fine.id} className="border-b hover:bg-slate-50 text-slate-700">
                  <td className="p-3">{fine.referenceNumber}</td>
                  <td className="p-3">{fine.driverNic}</td>
                  <td className="p-3">{fine.district}</td>
                  <td className="p-3">{fine.category}</td>
                  <td className="p-3">Rs. {fine.amount.toLocaleString()}</td>
                  <td className="p-3">{fine.issueDate}</td>
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