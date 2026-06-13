import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ManageCategories from "./pages/ManageCategories";
import ManageOfficers from "./pages/ManageOfficers";
import RevenueReports from "./pages/RevenueReports";
import PendingFines from "./pages/PendingFines";
import Statistics from "./pages/Statistics";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<AdminDashboard />} />

        <Route path="/categories" element={<ManageCategories />} />

        <Route path="/officers" element={<ManageOfficers />} />

        <Route path="/reports" element={<RevenueReports />} />

        <Route path="/pending-fines" element={<PendingFines />} />

        <Route path="/statistics" element={<Statistics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;