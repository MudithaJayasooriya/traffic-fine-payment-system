import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import API from "../api/axiosInstance";
import { FaPlus, FaTimes, FaListAlt } from "react-icons/fa";

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    categoryCode: "",
    categoryName: "",
    defaultAmount: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await API.get("/api/admin/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to load fine categories", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/admin/categories", {
        categoryCode: formData.categoryCode,
        categoryName: formData.categoryName,
        defaultAmount: parseFloat(formData.defaultAmount),
        description: formData.description
      });
      
      setFormData({ categoryCode: "", categoryName: "", defaultAmount: "", description: "" });
      setShowForm(false);
      fetchCategories();
    } catch (error) {
      alert("Error adding category: " + (error.response?.data || error.message));
    }
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#021022", color: "#eaf6ff" }}>
      <Sidebar />

      <div className="flex-1 p-6" style={{ backgroundColor: "#021022", minHeight: "100vh" }}>
        <Header title="Fine Categories" subtitle="Manage official traffic violation categories & fine amounts" />

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setShowForm(true)}
            className="font-bold px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all duration-200 hover:brightness-110"
            style={{ backgroundColor: "#4aa3ff", color: "#021022" }}
          >
            <FaPlus /> Add New Category
          </button>
        </div>

        {/* Table Container - Driver Web Dark Theme */}
        <div className="mt-6 rounded-3xl overflow-hidden border shadow-2xl" style={{ backgroundColor: "#062033", borderColor: "rgba(31, 79, 120, 0.6)" }}>
          <table className="w-full text-left border-collapse" style={{ backgroundColor: "#062033" }}>
            <thead style={{ backgroundColor: "#07233f", color: "#eaf6ff" }}>
              <tr>
                <th className="p-4 font-bold text-xs uppercase tracking-wider" style={{ color: "#9fcfff" }}>Category Code</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider" style={{ color: "#9fcfff" }}>Violation Name</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-right" style={{ color: "#9fcfff" }}>Default Fine Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm" style={{ backgroundColor: "#062033" }}>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-8 text-center font-medium" style={{ color: "#aacde9", backgroundColor: "#062033" }}>
                    No fine categories configured yet.
                  </td>
                </tr>
              ) : (
                categories.map((category, index) => (
                  <tr
                    key={category.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#071d31" : "#062033",
                      borderBottom: "1px solid rgba(31, 79, 120, 0.4)"
                    }}
                  >
                    <td className="p-4 font-mono font-extrabold text-base" style={{ color: "#4aa3ff" }}>
                      {category.categoryCode}
                    </td>
                    <td className="p-4 font-bold text-base" style={{ color: "#eaf6ff" }}>
                      {category.categoryName}
                    </td>
                    <td className="p-4 text-right font-extrabold text-base" style={{ color: "#1fc97a" }}>
                      Rs. {category.defaultAmount?.toLocaleString()}
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
            <div className="w-full max-w-lg rounded-3xl p-6 shadow-2xl border" style={{ backgroundColor: "#07223a", borderColor: "#164e70", color: "#eaf6ff" }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#072b46] text-[#4aa3ff] border border-[#4aa3ff]/30">
                    <FaListAlt />
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: "#eaf6ff" }}>Create Fine Category</h2>
                </div>
                <button onClick={() => setShowForm(false)} style={{ color: "#aacde9" }} className="text-lg hover:text-red-400">
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#9fcfff" }}>Category Code</label>
                  <input
                    type="text"
                    name="categoryCode"
                    value={formData.categoryCode}
                    onChange={handleChange}
                    placeholder="e.g. SPD01"
                    required
                    className="w-full px-4 py-3 rounded-xl outline-none border"
                    style={{ backgroundColor: "#06223b", borderColor: "#214f73", color: "#eaf6ff" }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#9fcfff" }}>Category Name</label>
                  <input
                    type="text"
                    name="categoryName"
                    value={formData.categoryName}
                    onChange={handleChange}
                    placeholder="e.g. Exceeding Speed Limit"
                    required
                    className="w-full px-4 py-3 rounded-xl outline-none border"
                    style={{ backgroundColor: "#06223b", borderColor: "#214f73", color: "#eaf6ff" }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#9fcfff" }}>Fine Amount (Rs.)</label>
                  <input
                    type="number"
                    name="defaultAmount"
                    value={formData.defaultAmount}
                    onChange={handleChange}
                    placeholder="e.g. 3000"
                    required
                    className="w-full px-4 py-3 rounded-xl outline-none border"
                    style={{ backgroundColor: "#06223b", borderColor: "#214f73", color: "#eaf6ff" }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#9fcfff" }}>Description (Optional)</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Legal reference or notes"
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl outline-none border"
                    style={{ backgroundColor: "#06223b", borderColor: "#214f73", color: "#eaf6ff" }}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border font-semibold" style={{ backgroundColor: "#062033", borderColor: "#164e70", color: "#aacde9" }}>
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2.5 font-bold rounded-xl shadow-lg" style={{ backgroundColor: "#4aa3ff", color: "#021022" }}>
                    Save Category
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

export default ManageCategories;