import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import API from "../api/axiosInstance";
import { FaMoneyBillWave, FaCheckCircle, FaCalendarDay } from "react-icons/fa";

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

    API.get(`/api/reports/revenue?${queryParams.toString()}`)
      .then((res) => {
        setReports(res.data.transactions || []);
        setDistrictCollections(res.data.districtBreakdown || []);
        setCategoryCollections(res.data.categoryBreakdown || []);
        setSummary(res.data.summary || { totalRevenue: 0, paidFines: 0, collectedToday: 0 });
      })
      .catch((err) => console.error("Error fetching revenue reports:", err));
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#021022", color: "#eaf6ff" }}>
      <Sidebar />
      <div className="flex-1 p-6" style={{ backgroundColor: "#021022", minHeight: "100vh" }}>
        <Header title="Revenue Reports" subtitle="Financial breakdown and settlement metrics across Sri Lanka" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <StatCard title="Total Revenue" value={`Rs. ${summary.totalRevenue.toLocaleString()}`} icon={FaMoneyBillWave} color="text-[#1fc97a]" />
          <StatCard title="Total Settled Fines" value={summary.paidFines} icon={FaCheckCircle} color="text-[#4aa3ff]" />
          <StatCard title="Collected Today" value={`Rs. ${summary.collectedToday.toLocaleString()}`} icon={FaCalendarDay} color="text-[#d7a46b]" />
        </div>

        {/* Filters Container */}
        <div className="p-6 rounded-3xl shadow-xl mt-6 border" style={{ backgroundColor: "#062033", borderColor: "rgba(31, 79, 120, 0.6)" }}>
          <h3 className="font-bold text-base mb-4" style={{ color: "#eaf6ff" }}>Generate Revenue Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="date"
              className="px-4 py-3 rounded-xl outline-none border text-sm"
              style={{ backgroundColor: "#06223b", borderColor: "#214f73", color: "#eaf6ff" }}
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
            <input
              type="date"
              className="px-4 py-3 rounded-xl outline-none border text-sm"
              style={{ backgroundColor: "#06223b", borderColor: "#214f73", color: "#eaf6ff" }}
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
            <select
              className="px-4 py-3 rounded-xl outline-none border text-sm"
              style={{ backgroundColor: "#06223b", borderColor: "#214f73", color: "#eaf6ff" }}
              value={filters.district}
              onChange={(e) => setFilters({ ...filters, district: e.target.value })}
            >
              <option style={{ backgroundColor: "#07223a", color: "#eaf6ff" }}>All Districts</option>
              <option style={{ backgroundColor: "#07223a", color: "#eaf6ff" }}>Ampara</option>
              <option style={{ backgroundColor: "#07223a", color: "#eaf6ff" }}>Anuradhapura</option>
              <option style={{ backgroundColor: "#07223a", color: "#eaf6ff" }}>Badulla</option>
              <option style={{ backgroundColor: "#07223a", color: "#eaf6ff" }}>Batticaloa</option>
              <option style={{ backgroundColor: "#07223a", color: "#eaf6ff" }}>Colombo</option>
              <option style={{ backgroundColor: "#07223a", color: "#eaf6ff" }}>Galle</option>
              <option style={{ backgroundColor: "#07223a", color: "#eaf6ff" }}>Gampaha</option>
              <option style={{ backgroundColor: "#07223a", color: "#eaf6ff" }}>Hambantota</option>
              <option style={{ backgroundColor: "#07223a", color: "#eaf6ff" }}>Jaffna</option>
              <option style={{ backgroundColor: "#07223a", color: "#eaf6ff" }}>Kalutara</option>
              <option style={{ backgroundColor: "#07223a", color: "#eaf6ff" }}>Kandy</option>
              <option style={{ backgroundColor: "#07223a", color: "#eaf6ff" }}>Kegalle</option>
              <option style={{ backgroundColor: "#07223a", color: "#eaf6ff" }}>Kilinochchi</option>
              <option style={{ backgroundColor: "#07223a", color: "#eaf6ff" }}>Kurunegala</option>
              <option style={{ backgroundColor: "#07223a", color: "#eaf6ff" }}>Mannar</option>
              <option style={{ backgroundColor: "#07223a", color: "#eaf6ff" }}>Matale</option>
              <option style={{ backgroundColor: "#07223a", color: "#eaf6ff" }}>Matara</option>
              <option style={{ backgroundColor: "#07223a", color: "#eaf6ff" }}>Moneragala</option>
              <option style={{ backgroundColor: "#07223a", color: "#eaf6ff" }}>Mullaitivu</option>
              <option style={{ backgroundColor: "#07223a", color: "#eaf6ff" }}>Nuwara Eliya</option>
              <option style={{ backgroundColor: "#07223a", color: "#eaf6ff" }}>Polonnaruwa</option>
              <option style={{ backgroundColor: "#07223a", color: "#eaf6ff" }}>Puttalam</option>
              <option style={{ backgroundColor: "#07223a", color: "#eaf6ff" }}>Ratnapura</option>
              <option style={{ backgroundColor: "#07223a", color: "#eaf6ff" }}>Trincomalee</option>
              <option style={{ backgroundColor: "#07223a", color: "#eaf6ff" }}>Vavuniya</option>
            </select>
            <button onClick={fetchReportData} className="font-bold py-3 rounded-xl transition cursor-pointer shadow-lg hover:brightness-110" style={{ backgroundColor: "#4aa3ff", color: "#021022" }}>
              Filter Reports
            </button>
          </div>
        </div>

        {/* District & Category Collections side-by-side split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="rounded-3xl shadow-xl p-6 border overflow-hidden" style={{ backgroundColor: "#062033", borderColor: "rgba(31, 79, 120, 0.6)" }}>
            <h3 className="font-bold text-base mb-4" style={{ color: "#eaf6ff" }}>District-wise Breakdown</h3>
            <table className="w-full text-left text-sm border-collapse" style={{ backgroundColor: "#062033" }}>
              <thead style={{ backgroundColor: "#07233f", color: "#eaf6ff" }}>
                <tr>
                  <th className="p-3 font-bold text-xs uppercase tracking-wider" style={{ color: "#9fcfff" }}>District</th>
                  <th className="p-3 font-bold text-xs uppercase tracking-wider text-right" style={{ color: "#9fcfff" }}>Collection</th>
                </tr>
              </thead>
              <tbody className="text-sm" style={{ backgroundColor: "#062033" }}>
                {districtCollections.length === 0 ? (
                  <tr><td colSpan="2" className="p-4 text-center" style={{ color: "#aacde9" }}>No district breakdown available.</td></tr>
                ) : (
                  districtCollections.map((item, index) => (
                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#071d31" : "#062033", borderBottom: "1px solid rgba(31, 79, 120, 0.4)" }}>
                      <td className="p-3 font-bold" style={{ color: "#eaf6ff" }}>{item.district}</td>
                      <td className="p-3 text-right font-extrabold" style={{ color: "#1fc97a" }}>Rs. {item.collection.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="rounded-3xl shadow-xl p-6 border overflow-hidden" style={{ backgroundColor: "#062033", borderColor: "rgba(31, 79, 120, 0.6)" }}>
            <h3 className="font-bold text-base mb-4" style={{ color: "#eaf6ff" }}>Category-wise Breakdown</h3>
            <table className="w-full text-left text-sm border-collapse" style={{ backgroundColor: "#062033" }}>
              <thead style={{ backgroundColor: "#07233f", color: "#eaf6ff" }}>
                <tr>
                  <th className="p-3 font-bold text-xs uppercase tracking-wider" style={{ color: "#9fcfff" }}>Category</th>
                  <th className="p-3 font-bold text-xs uppercase tracking-wider text-right" style={{ color: "#9fcfff" }}>Collection</th>
                </tr>
              </thead>
              <tbody className="text-sm" style={{ backgroundColor: "#062033" }}>
                {categoryCollections.length === 0 ? (
                  <tr><td colSpan="2" className="p-4 text-center" style={{ color: "#aacde9" }}>No category breakdown available.</td></tr>
                ) : (
                  categoryCollections.map((item, index) => (
                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#071d31" : "#062033", borderBottom: "1px solid rgba(31, 79, 120, 0.4)" }}>
                      <td className="p-3 font-bold" style={{ color: "#eaf6ff" }}>{item.category}</td>
                      <td className="p-3 text-right font-extrabold" style={{ color: "#4aa3ff" }}>Rs. {item.collection.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Transactions Table */}
        <div className="rounded-3xl shadow-2xl mt-6 overflow-hidden border" style={{ backgroundColor: "#062033", borderColor: "rgba(31, 79, 120, 0.6)" }}>
          <table className="w-full text-left border-collapse" style={{ backgroundColor: "#062033" }}>
            <thead style={{ backgroundColor: "#07233f", color: "#eaf6ff" }}>
              <tr>
                <th className="p-4 font-bold text-xs uppercase tracking-wider" style={{ color: "#9fcfff" }}>District</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider" style={{ color: "#9fcfff" }}>Category</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider" style={{ color: "#9fcfff" }}>Settled Amount</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider" style={{ color: "#9fcfff" }}>Settlement Date</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider" style={{ color: "#9fcfff" }}>Status</th>
              </tr>
            </thead>
            <tbody className="text-sm" style={{ backgroundColor: "#062033" }}>
              {reports.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center font-medium" style={{ color: "#aacde9", backgroundColor: "#062033" }}>No settlement transaction logs available.</td></tr>
              ) : (
                reports.map((report, index) => (
                  <tr key={report.id} style={{ backgroundColor: index % 2 === 0 ? "#071d31" : "#062033", borderBottom: "1px solid rgba(31, 79, 120, 0.4)" }}>
                    <td className="p-4 font-bold" style={{ color: "#eaf6ff" }}>{report.district}</td>
                    <td className="p-4 font-bold" style={{ color: "#eaf6ff" }}>{report.category}</td>
                    <td className="p-4 font-extrabold" style={{ color: "#1fc97a" }}>Rs. {report.amount?.toLocaleString()}</td>
                    <td className="p-4 font-medium" style={{ color: "#aacde9" }}>{report.date}</td>
                    <td className="p-4">
                      <span className="inline-flex rounded-full px-3 py-1 text-xs font-extrabold" style={{ backgroundColor: "#1fc97a", color: "#021022" }}>
                        SETTLED
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RevenueReports;