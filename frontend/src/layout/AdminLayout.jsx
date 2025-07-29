
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar.jsx";
import AdminSidebar from "../components/admin/AdminSidebar.jsx";
import AdminFooter from "../components/admin/AdminFooter.jsx";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-cyan-50">
      {/* Sticky navbar at the top */}
      <div className="sticky top-0 z-50">
        <AdminNavbar />
      </div>
      
      {/* Main content area with sidebar and main content */}
      <div className="flex flex-1">
        {/* Sidebar - sticky to top (below navbar) */}
        <div className="sticky top-[4rem] h-[calc(100vh-4rem)] overflow-y-auto">
          <AdminSidebar />
        </div>
        
        {/* Main content area - scrollable */}
        <main className="flex-1 p-4 md:p-8 bg-cyan-50 min-h-[calc(100vh-4rem)]">
          <div className="min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Footer - appears after content */}
      <AdminFooter />
    </div>
  );
}
