
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar.jsx";
import AdminSidebar from "../components/admin/AdminSidebar.jsx";
import AdminFooter from "../components/admin/AdminFooter.jsx";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-cyan-50">
      <AdminNavbar />
      <div className="flex flex-1 w-full">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-8 bg-cyan-50">
          <Outlet />
        </main>
      </div>
      <AdminFooter />
    </div>
  );
}
