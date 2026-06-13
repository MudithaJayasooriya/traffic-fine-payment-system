import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function ManageCategories() {
  const [categories, setCategories] = useState([
    {
      id: 1,
      categoryCode: "SPD001",
      categoryName: "Speeding",
      defaultAmount: 3000,
      active: true,
    },
    {
      id: 2,
      categoryCode: "SEAT001",
      categoryName: "Seat Belt",
      defaultAmount: 2000,
      active: true,
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    categoryCode: "",
    categoryName: "",
    defaultAmount: "",
    description: "",
    active: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCategory = {
      id: Date.now(),
      ...formData,
    };

    setCategories([...categories, newCategory]);

    setFormData({
      categoryCode: "",
      categoryName: "",
      defaultAmount: "",
      description: "",
      active: true,
    });

    setShowForm(false);
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

        {/* Table */}

        <div className="mt-6 bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b hover:bg-slate-50"
                >
                  <td className="p-3">
                    {category.categoryCode}
                  </td>

                  <td className="p-3">
                    {category.categoryName}
                  </td>

                  <td className="p-3">
                    Rs. {category.defaultAmount}
                  </td>

                  <td className="p-3">
                    {category.active ? (
                      <span className="text-green-600 font-semibold">
                        Active
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Inactive
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}

        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white w-full max-w-lg rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-5">
                Create Fine Category
              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <input
                  type="text"
                  name="categoryCode"
                  value={formData.categoryCode}
                  onChange={handleChange}
                  placeholder="Category Code"
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
                  placeholder="Default Amount"
                  required
                  className="w-full border p-3 rounded-lg"
                />

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description"
                  rows="3"
                  className="w-full border p-3 rounded-lg"
                />

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                  />

                  <label>Active</label>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-5 py-2 bg-gray-400 text-white rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg"
                  >
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