import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import API from "../api/axiosInstance";
import { FaUserPlus, FaTimes, FaUserShield, FaTrash } from "react-icons/fa";

function ManageOfficers() {
  const [officers, setOfficers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    nicNumber: "",
    phoneNumber: ""
  });

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    try {
      const response = await API.get("/api/users/officers");
      setOfficers(response.data);
    } catch (error) {
      console.error("Could not fetch officers list", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this officer account?")) {
      try {
        await API.delete(`/api/admin/officers/${id}`);
        fetchOfficers();
      } catch (error) {
        alert("Failed to remove officer: " + (error.response?.data || error.message));
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/admin/register-officer", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: "OFFICER",
        nicNumber: formData.nicNumber,
        phoneNumber: formData.phoneNumber
      });

      setFormData({ username: "", email: "", password: "", nicNumber: "", phoneNumber: "" });
      setShowForm(false);
      fetchOfficers();
    } catch (error) {
      alert("Registration failed: " + (error.response?.data || error.message));
    }
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#021022", color: "#eaf6ff" }}>
      <Sidebar />
      <div className="flex-1 p-6" style={{ backgroundColor: "#021022", minHeight: "100vh" }}>
        <Header title="Manage Officers" subtitle="Register and manage police traffic officer accounts" />
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setShowForm(true)}
            className="font-bold px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all duration-200 hover:brightness-110"
            style={{ backgroundColor: "#4aa3ff", color: "#021022" }}
          >
            <FaUserPlus /> Register New Officer
          </button>
        </div>

        {/* Table Container - Driver Web Dark Theme */}
        <div className="mt-6 rounded-3xl overflow-hidden border shadow-2xl" style={{ backgroundColor: "#062033", borderColor: "rgba(31, 79, 120, 0.6)" }}>
          <table className="w-full text-left border-collapse" style={{ backgroundColor: "#062033" }}>
            <thead style={{ backgroundColor: "#07233f", color: "#eaf6ff" }}>
              <tr>
                <th className="p-4 font-bold text-xs uppercase tracking-wider" style={{ color: "#9fcfff" }}>ID</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider" style={{ color: "#9fcfff" }}>Officer Username</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider" style={{ color: "#9fcfff" }}>Email Address</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider" style={{ color: "#9fcfff" }}>NIC Number</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider" style={{ color: "#9fcfff" }}>Phone Number</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-center" style={{ color: "#9fcfff" }}>Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm" style={{ backgroundColor: "#062033" }}>
              {officers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center font-medium" style={{ color: "#aacde9", backgroundColor: "#062033" }}>
                    No active traffic officers registered yet.
                  </td>
                </tr>
              ) : (
                officers.map((officer, index) => (
                  <tr
                    key={officer.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#071d31" : "#062033",
                      borderBottom: "1px solid rgba(31, 79, 120, 0.4)"
                    }}
                  >
                    <td className="p-4 font-mono font-bold" style={{ color: "#aacde9" }}>#{officer.id}</td>
                    <td className="p-4 font-bold text-base" style={{ color: "#eaf6ff" }}>{officer.username}</td>
                    <td className="p-4 font-medium" style={{ color: "#4aa3ff" }}>{officer.email}</td>
                    <td className="p-4 font-mono font-bold" style={{ color: "#d7a46b" }}>{officer.nicNumber}</td>
                    <td className="p-4 font-medium" style={{ color: "#eaf6ff" }}>{officer.phoneNumber}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(officer.id)}
                        className="p-2 rounded-lg bg-red-950/40 border border-red-800/40 text-red-400 hover:bg-red-900/60 hover:text-red-300 transition duration-150 cursor-pointer"
                        title="Delete Officer Account"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}>
            <div className="w-full max-w-md rounded-3xl p-6 shadow-2xl border" style={{ backgroundColor: "#07223a", borderColor: "#164e70", color: "#eaf6ff" }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#072b46] text-[#4aa3ff] border border-[#4aa3ff]/30">
                    <FaUserShield />
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: "#eaf6ff" }}>Register Traffic Officer</h2>
                </div>
                <button onClick={() => setShowForm(false)} style={{ color: "#aacde9" }} className="text-lg hover:text-red-400">
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#9fcfff" }}>Username (e.g. officer_101)</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="officer_xxx"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl outline-none border"
                    style={{ backgroundColor: "#06223b", borderColor: "#214f73", color: "#eaf6ff" }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#9fcfff" }}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="officer@police.lk"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl outline-none border"
                    style={{ backgroundColor: "#06223b", borderColor: "#214f73", color: "#eaf6ff" }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#9fcfff" }}>Temporary Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl outline-none border"
                    style={{ backgroundColor: "#06223b", borderColor: "#214f73", color: "#eaf6ff" }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#9fcfff" }}>NIC Number</label>
                  <input
                    type="text"
                    name="nicNumber"
                    placeholder="e.g. 199012345678"
                    value={formData.nicNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl outline-none border"
                    style={{ backgroundColor: "#06223b", borderColor: "#214f73", color: "#eaf6ff" }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#9fcfff" }}>Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    placeholder="e.g. 0771234567"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl outline-none border"
                    style={{ backgroundColor: "#06223b", borderColor: "#214f73", color: "#eaf6ff" }}
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border font-semibold" style={{ backgroundColor: "#062033", borderColor: "#164e70", color: "#aacde9" }}>
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2.5 font-bold rounded-xl shadow-lg" style={{ backgroundColor: "#4aa3ff", color: "#021022" }}>
                    Save Officer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageOfficers;