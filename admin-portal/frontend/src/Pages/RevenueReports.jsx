import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";

function RevenueReports() {
  const [reports, setReports] = useState([]);
  const [districtCollections, setDistrictCollections] = useState([]);
  const [categoryCollections, setCategoryCollections] = useState([]);
  const [summary, setSummary] = useState({ totalRevenue: 0, paidFines: 0, collectedToday: 0 });
  
  const [filters, setFilters] = useState({ startDate: "", endDate: "", district: "All Districts" });

  const fetchReportData = () => {
    const queryParams = new URLSearchParams({
      startDate: filters.startDate,
      endDate: filters.endDate,
      district: filters.district,
    });

    fetch(`http://localhost:8080/api/reports/revenue?${queryParams.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setReports(data.transactions || []);
        setDistrictCollections(data.districtBreakdown || []);
        setCategoryCollections(data.categoryBreakdown || []);
        setSummary(data.summary || { totalRevenue: 0, paidFines: 0, collectedToday: 0 });
      })
      .catch((err) => console.error("Error fetching revenue reports:", err));
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-slate-100 min-h-screen p-6">
        <Header title="Revenue Reports" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
          <StatCard title="Total Revenue" value={`Rs. ${summary.totalRevenue.toLocaleString()}`} />
          <StatCard title="Paid Fines" value={summary.paidFines} />
          <StatCard title="Collected Today" value={`Rs. ${summary.collectedToday.toLocaleString()}`} />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-5 mt-6">
          <h3 className="font-bold text-lg mb-4 text-slate-800">Filter Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="date"
              className="border p-3 rounded-lg text-slate-800 bg-white"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
            <input
              type="date"
              className="border p-3 rounded-lg text-slate-800 bg-white"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
            <select
              className="border p-3 rounded-lg text-slate-800 bg-white"
              value={filters.district}
              onChange={(e) => setFilters({ ...filters, district: e.target.value })}
            >
              <option>All Districts</option>
              <option>Colombo</option>
              <option>Kandy</option>
              <option>Galle</option>
            </select>
            <button onClick={fetchReportData} className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Generate Report
            </button>
          </div>
        </div>

        {/* District & Category Collections side-by-side split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-bold text-lg mb-4 text-slate-800">District Wise Collections</h3>
            <table className="w-full text-slate-700">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="p-3 text-left">District</th>
                  <th className="p-3 text-left">Collection</th>
                </tr>
              </thead>
              <tbody>
                {districtCollections.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3">{item.district}</td>
                    <td className="p-3">Rs. {item.collection.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-bold text-lg mb-4 text-slate-800">Category Wise Collections</h3>
            <table className="w-full text-slate-700">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Collection</th>
                </tr>
              </thead>
              <tbody>
                {categoryCollections.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3">{item.category}</td>
                    <td className="p-3">Rs. {item.collection.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Logs Table */}
        <div className="bg-white rounded-xl shadow mt-6 overflow-hidden">
          <table className="w-full text-slate-700">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="p-3 text-left">District</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b hover:bg-slate-50">
                  <td className="p-3">{report.district}</td>
                  <td className="p-3">{report.category}</td>
                  <td className="p-3">Rs. {report.amount.toLocaleString()}</td>
                  <td className="p-3">{report.date}</td>
                  <td className="p-3 text-green-600 font-semibold">{report.status}</td>
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