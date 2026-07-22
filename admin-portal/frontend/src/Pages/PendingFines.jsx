import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import API from "../api/axiosInstance";

function PendingFines() {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get("status") || "NOT_PAID";

  const [pendingFines, setPendingFines] = useState([]);
  const [summary, setSummary] = useState({ totalCount: 0, totalAmount: 0, overdueCount: 0 });
  const [filters, setFilters] = useState({ 
    referenceNumber: "", 
    driverNic: "", 
    district: "All Districts",
    status: initialStatus
  });

  const fetchPendingData = () => {
    const queryParams = new URLSearchParams();
    if (filters.referenceNumber) queryParams.append("ref", filters.referenceNumber);
    if (filters.driverNic) queryParams.append("nic", filters.driverNic);
    if (filters.district !== "All Districts") queryParams.append("district", filters.district);
    queryParams.append("status", filters.status);

    API.get(`/api/fines/pending?${queryParams.toString()}`)
      .then((res) => {
        setPendingFines(res.data.fines || []);
        setSummary(res.data.summary || { totalCount: res.data.fines?.length || 0, totalAmount: 0, overdueCount: 0 });
      })
      .catch((err) => console.error("Error loading pending fines:", err));
  };

  useEffect(() => {
    fetchPendingData();
  }, [filters.status]);

  useEffect(() => {
    const paramStatus = searchParams.get("status");
    if (paramStatus) {
      setFilters((prev) => ({ ...prev, status: paramStatus }));
    }
  }, [searchParams]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#021022", color: "#eaf6ff" }}>
      <Sidebar />
      <div className="flex-1 p-6" style={{ backgroundColor: "#021022", minHeight: "100vh" }}>
        <Header title="Fines List" subtitle="Track and filter traffic citation tickets across Sri Lanka" />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="p-6 rounded-3xl shadow-xl border" style={{ backgroundColor: "#062033", borderColor: "rgba(31, 79, 120, 0.6)" }}>
            <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#aacde9" }}>Fines Displayed</h3>
            <p className="text-3xl font-extrabold mt-2" style={{ color: "#ff8a4d" }}>{summary.totalCount}</p>
          </div>
          <div className="p-6 rounded-3xl shadow-xl border" style={{ backgroundColor: "#062033", borderColor: "rgba(31, 79, 120, 0.6)" }}>
            <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#aacde9" }}>Total Fine Value</h3>
            <p className="text-3xl font-extrabold mt-2" style={{ color: "#4aa3ff" }}>Rs. {summary.totalAmount.toLocaleString()}</p>
          </div>
          <div className="p-6 rounded-3xl shadow-xl border" style={{ backgroundColor: "#062033", borderColor: "rgba(31, 79, 120, 0.6)" }}>
            <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#aacde9" }}>Action Scope</h3>
            <p className="text-3xl font-extrabold mt-2" style={{ color: "#ff5252" }}>
              {filters.status === "ALL" ? "All Records" : filters.status === "PAID" ? "Paid Fines" : "Unpaid Fines"}
            </p>
          </div>
        </div>

        {/* Filters Container */}
        <div className="p-6 rounded-3xl shadow-xl mt-6 border" style={{ backgroundColor: "#062033", borderColor: "rgba(31, 79, 120, 0.6)" }}>
          <h3 className="font-bold text-base mb-4" style={{ color: "#eaf6ff" }}>Filter Citations</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              name="referenceNumber"
              value={filters.referenceNumber}
              onChange={handleFilterChange}
              placeholder="Reference (e.g. FINE-XXXX)"
              className="px-4 py-3 rounded-xl outline-none border text-sm"
              style={{ backgroundColor: "#06223b", borderColor: "#214f73", color: "#eaf6ff" }}
            />
            <input
              type="text"
              name="driverNic"
              value={filters.driverNic}
              onChange={handleFilterChange}
              placeholder="Driver NIC"
              className="px-4 py-3 rounded-xl outline-none border text-sm"
              style={{ backgroundColor: "#06223b", borderColor: "#214f73", color: "#eaf6ff" }}
            />
            <select 
              name="district" 
              value={filters.district} 
              onChange={handleFilterChange} 
              className="px-4 py-3 rounded-xl outline-none border text-sm"
              style={{ backgroundColor: "#06223b", borderColor: "#214f73", color: "#eaf6ff" }}
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
            <select 
              name="status" 
              value={filters.status} 
              onChange={handleFilterChange} 
              className="px-4 py-3 rounded-xl outline-none border text-sm"
              style={{ backgroundColor: "#06223b", borderColor: "#214f73", color: "#eaf6ff" }}
            >
              <option value="ALL" style={{ backgroundColor: "#07223a", color: "#eaf6ff" }}>All Statuses</option>
              <option value="NOT_PAID" style={{ backgroundColor: "#07223a", color: "#eaf6ff" }}>Pending (Unpaid)</option>
              <option value="PAID" style={{ backgroundColor: "#07223a", color: "#eaf6ff" }}>Paid (Settled)</option>
            </select>
            <button onClick={fetchPendingData} className="font-bold py-3 rounded-xl transition cursor-pointer shadow-lg hover:brightness-110" style={{ backgroundColor: "#4aa3ff", color: "#021022" }}>
              Apply Filters
            </button>
          </div>
        </div>

        {/* Table Container - Driver Web Dark Theme */}
        <div className="mt-6 rounded-3xl overflow-hidden border shadow-2xl" style={{ backgroundColor: "#062033", borderColor: "rgba(31, 79, 120, 0.6)" }}>
          <table className="w-full text-left border-collapse" style={{ backgroundColor: "#062033" }}>
            <thead style={{ backgroundColor: "#07233f", color: "#eaf6ff" }}>
              <tr>
                <th className="p-4 font-bold text-xs uppercase tracking-wider" style={{ color: "#9fcfff" }}>Reference No</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider" style={{ color: "#9fcfff" }}>Driver NIC</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider" style={{ color: "#9fcfff" }}>District</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider" style={{ color: "#9fcfff" }}>Category</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider" style={{ color: "#9fcfff" }}>Fine Amount</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider" style={{ color: "#9fcfff" }}>Issue Date</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider" style={{ color: "#9fcfff" }}>Status</th>
              </tr>
            </thead>
            <tbody className="text-sm" style={{ backgroundColor: "#062033" }}>
              {pendingFines.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center font-medium" style={{ color: "#aacde9", backgroundColor: "#062033" }}>
                    No matching fines found.
                  </td>
                </tr>
              ) : (
                pendingFines.map((fine, index) => (
                  <tr
                    key={fine.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#071d31" : "#062033",
                      borderBottom: "1px solid rgba(31, 79, 120, 0.4)"
                    }}
                  >
                    <td className="p-4 font-mono font-extrabold text-base" style={{ color: "#4aa3ff" }}>{fine.referenceNumber}</td>
                    <td className="p-4 font-mono font-bold" style={{ color: "#aacde9" }}>{fine.driverNic}</td>
                    <td className="p-4 font-medium" style={{ color: "#eaf6ff" }}>{fine.district}</td>
                    <td className="p-4 font-bold" style={{ color: "#eaf6ff" }}>{fine.category}</td>
                    <td className="p-4 font-extrabold" style={{ color: "#1fc97a" }}>Rs. {fine.amount?.toLocaleString()}</td>
                    <td className="p-4 font-medium" style={{ color: "#aacde9" }}>{fine.issueDate}</td>
                    <td className="p-4">
                      <span 
                        className="inline-flex rounded-full px-3 py-1 text-xs font-extrabold" 
                        style={{ 
                          backgroundColor: fine.status === "PAID" ? "#1fc97a" : "#ff8a4d", 
                          color: "#021022" 
                        }}
                      >
                        {fine.status === "PAID" ? "PAID" : "UNPAID"}
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

export default PendingFines;