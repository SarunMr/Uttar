import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AuthLayout from "../layout/AuthLayout";
import Admin from "../pages/Admin/Dashboard.jsx";
import User from "../pages/Devlopers/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Home page - standalone */}
      <Route path="/" element={<Home />} />

      {/* Auth pages - wrapped in AuthLayout */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

 {/* Protected Dashboards */}
      <Route path="/user/dashboard" element={<User />} />
      <Route path="/admin/home" element={<Admin />} />
    </Routes>
  );
}
