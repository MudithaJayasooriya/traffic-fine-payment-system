import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SearchFine from "./pages/SearchFine";
import FineDetails from "./pages/FineDetails";
import Payment from "./pages/Payment";
import Receipt from "./pages/Receipt";
import PaymentHistory from "./pages/PaymentHistory";
import Profile from "./pages/Profile";
import Help from "./pages/Help";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/search-fine" element={<SearchFine />} />
        <Route path="/fine/:id" element={<FineDetails />} />
        <Route path="/payment/:fineId" element={<Payment />} />
        <Route path="/receipt/:paymentId" element={<Receipt />} />
        <Route path="/history" element={<PaymentHistory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/help" element={<Help />} />
        <Route  path="/notifications"  element={<Notifications />}  />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;