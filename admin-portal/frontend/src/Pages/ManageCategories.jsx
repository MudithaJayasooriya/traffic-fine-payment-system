import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import API from "../api/axiosInstance";

function ManageCategories() {
  const [categories, setCategories] = useState([]); // Removed static array data initialization
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    categoryCode: "",
    categoryName: "",
    defaultAmount: "",
    description: "",
  });

  // Fetch initial collections upon rendering
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await API.get("/api/admin/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to load backend traffic code schemas", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Maps to @PostMapping("/api/admin/categories") inside backend
      await API.post("/api/admin/categories", {
        categoryCode: formData.categoryCode,
        categoryName: formData.categoryName,
        defaultAmount: parseFloat(formData.defaultAmount),
        description: formData.description
      });
      
      setFormData({ categoryCode: "", categoryName: "", defaultAmount: "", description: "" });
      setShowForm(false);
      fetchCategories(); // Refresh table view directly from database
    } catch (error) {
      alert("Error adding tracking definition payload: " + (error.response?.data || error.message));
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-slate-100 min-h-screen p-6">
        <Header title="Fine Categories" />

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add Category
          </button>
        </div>

        {/* Table container view */}
        <div className="mt-6 bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-3 text-center text-gray-500">No category profiles created yet.</td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="border-b hover:bg-slate-50">
                    <td className="p-3 font-medium">{category.categoryCode}</td>
                    <td className="p-3">{category.categoryName}</td>
                    <td className="p-3 text-cyan-700 font-semibold">Rs. {category.defaultAmount?.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal form markup */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white w-full max-w-lg rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-5">Create Fine Category</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="categoryCode"
                  value={formData.categoryCode}
                  onChange={handleChange}
                  placeholder="Category Code (e.g. SPD01)"
                  required
                  className="w-full border p-3 rounded-lg"
                />
                <input
                  type="text"
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleChange}
                  placeholder="Category Name"
                  required
                  className="w-full border p-3 rounded-lg"
                />
                <input
                  type="number"
                  name="defaultAmount"
                  value={formData.defaultAmount}
                  onChange={handleChange}
                  placeholder="Default Fine Amount (Rs.)"
                  required
                  className="w-full border p-3 rounded-lg"
                />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description details"
                  rows="3"
                  className="w-full border p-3 rounded-lg"
                />
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 bg-gray-400 text-white rounded-lg">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg">
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