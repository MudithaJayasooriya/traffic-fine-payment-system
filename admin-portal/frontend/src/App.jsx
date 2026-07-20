import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Pages/Login";
import AdminDashboard from "./Pages/AdminDashboard";
import ManageCategories from "./Pages/ManageCategories";
import ManageOfficers from "./Pages/ManageOfficers";
import RevenueReports from "./Pages/RevenueReports";
import PendingFines from "./Pages/PendingFines";
import Statistics from "./Pages/Statistics";

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