import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AuthLayout from "../layout/AuthLayout";
import AdminLayout from "../layout/AdminLayout.jsx";
import AdminHome from "../pages/Admin/Dashboard.jsx";
import AdminTags from "../pages/Admin/Tags.jsx";
import UserHome from "../pages/Devlopers/Dashboard";
import UserTags from "../pages/Devlopers/Tags.jsx";
import DeveloperLayout from "../layout/DevelopersLayout.jsx";

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
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="home" element={<AdminHome />} />
        <Route path="tags" element={<AdminTags />} />
      </Route>

      <Route path="/user" element={<DeveloperLayout />}>
        <Route path="home" element={<UserHome />} />
        <Route path="tags" element={<UserTags />} />
      </Route>
    </Routes>
  );
}
