import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import API from "../api/axiosInstance";

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
      // Calls UserController's @GetMapping("/officers") endpoint
      const response = await API.get("/api/users/officers");
      setOfficers(response.data);
    } catch (error) {
      console.error("Could not trace registration lists", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Connects with AdminController's @PostMapping("/register-officer") route
      await API.post("/api/admin/register-officer", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: "OFFICER", // Enforces backend Enum match constraint
        nicNumber: formData.nicNumber,
        phoneNumber: formData.phoneNumber
      });

      setFormData({ username: "", email: "", password: "", nicNumber: "", phoneNumber: "" });
      setShowForm(false);
      fetchOfficers(); // Refresh view
    } catch (error) {
      alert("Registration failed: " + (error.response?.data || error.message));
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-slate-100 min-h-screen p-6">
        <Header title="Manage Officers" />
        
        <div className="mt-6 flex justify-end">
          <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
            + Add Officer
          </button>
        </div>

        <div className="mt-6 bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Username</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">NIC</th>
                <th className="p-3 text-left">Phone</th>
              </tr>
            </thead>
            <tbody>
              {officers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-3 text-center text-gray-500">No active traffic officers found.</td>
                </tr>
              ) : (
                officers.map((officer) => (
                  <tr key={officer.id} className="border-b hover:bg-slate-50">
                    <td className="p-3">{officer.id}</td>
                    <td className="p-3 font-semibold text-slate-700">{officer.username}</td>
                    <td className="p-3">{officer.email}</td>
                    <td className="p-3">{officer.nicNumber}</td>
                    <td className="p-3">{officer.phoneNumber}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white w-full max-w-md rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-5">Add New Officer</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required className="w-full border p-3 rounded-lg" />
                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="w-full border p-3 rounded-lg" />
                <input type="password" name="password" placeholder="System Password" value={formData.password} onChange={handleChange} required className="w-full border p-3 rounded-lg" />
                <input type="text" name="nicNumber" placeholder="NIC Number" value={formData.nicNumber} onChange={handleChange} required className="w-full border p-3 rounded-lg" />
                <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required className="w-full border p-3 rounded-lg" />
                
                <div className="flex justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setShowForm(false)} className="bg-gray-500 text-white px-5 py-2 rounded-lg">Cancel</button>
                  <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg">Save Officer</button>
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