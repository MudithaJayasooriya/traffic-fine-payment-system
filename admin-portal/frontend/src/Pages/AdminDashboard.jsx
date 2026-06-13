import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";

function AdminDashboard() {
  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 p-6 bg-slate-100 min-h-screen">

        <Header title="Admin Dashboard" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">

          <StatCard
            title="Total Revenue"
            value="Rs. 2,350,000"
          />

          <StatCard
            title="Paid Fines"
            value="1250"
          />

          <StatCard
            title="Pending Fines"
            value="430"
          />

          <StatCard
            title="Categories"
            value="15"
          />

        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;