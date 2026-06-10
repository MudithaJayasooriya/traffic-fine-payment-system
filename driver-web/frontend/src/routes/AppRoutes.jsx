import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import SearchFine from "../pages/SearchFine";

function AppRoutes() {

  return (
    <Routes>

      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/search-fine"
        element={<SearchFine />}
      />

    </Routes>
  );
}

export default AppRoutes;