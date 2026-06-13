import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function ManageOfficers() {
  const [officers, setOfficers] = useState([
    {
      id: 1,
      serviceNumber: "POL001",
      fullName: "Kasun Silva",
      rank: "Sergeant",
      stationName: "Colombo Central",
      district: "Colombo",
      phoneNumber: "0771234567",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    nic: "",
    phoneNumber: "",
    email: "",
    serviceNumber: "",
    rank: "",
    stationName: "",
    district: "",
    joinedDate: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newOfficer = {
      id: Date.now(),
      ...formData,
    };

    setOfficers([...officers, newOfficer]);

    setFormData({
      fullName: "",
      nic: "",
      phoneNumber: "",
      email: "",
      serviceNumber: "",
      rank: "",
      stationName: "",
      district: "",
      joinedDate: "",
    });

    setShowForm(false);
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-slate-100 min-h-screen p-6">
        <Header title="Manage Officers" />

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add Officer
          </button>
        </div>

        <div className="mt-6 bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="p-3 text-left">Service No</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Rank</th>
                <th className="p-3 text-left">Station</th>
                <th className="p-3 text-left">District</th>
                <th className="p-3 text-left">Phone</th>
              </tr>
            </thead>

            <tbody>
              {officers.map((officer) => (
                <tr
                  key={officer.id}
                  className="border-b hover:bg-slate-50"
                >
                  <td className="p-3">{officer.serviceNumber}</td>
                  <td className="p-3">{officer.fullName}</td>
                  <td className="p-3">{officer.rank}</td>
                  <td className="p-3">{officer.stationName}</td>
                  <td className="p-3">{officer.district}</td>
                  <td className="p-3">{officer.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white w-full max-w-2xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">

              <h2 className="text-2xl font-bold mb-5">
                Add New Officer
              </h2>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="border p-3 rounded-lg"
                />

                <input
                  type="text"
                  name="nic"
                  placeholder="NIC"
                  value={formData.nic}
                  onChange={handleChange}
                  required
                  className="border p-3 rounded-lg"
                />

                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="border p-3 rounded-lg"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border p-3 rounded-lg"
                />

                <input
                  type="text"
                  name="serviceNumber"
                  placeholder="Service Number"
                  value={formData.serviceNumber}
                  onChange={handleChange}
                  required
                  className="border p-3 rounded-lg"
                />

                <input
                  type="text"
                  name="rank"
                  placeholder="Rank"
                  value={formData.rank}
                  onChange={handleChange}
                  required
                  className="border p-3 rounded-lg"
                />

                <input
                  type="text"
                  name="stationName"
                  placeholder="Station Name"
                  value={formData.stationName}
                  onChange={handleChange}
                  required
                  className="border p-3 rounded-lg"
                />

                <input
                  type="text"
                  name="district"
                  placeholder="District"
                  value={formData.district}
                  onChange={handleChange}
                  required
                  className="border p-3 rounded-lg"
                />

                <input
                  type="date"
                  name="joinedDate"
                  value={formData.joinedDate}
                  onChange={handleChange}
                  className="border p-3 rounded-lg"
                />

                <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-500 text-white px-5 py-2 rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                  >
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