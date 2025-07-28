import React, { useState } from "react";
import NavbarComponent from "./../components/common/NavbarComponent";
import SidebarComponent from "./../components/common/SidebarComponent";
import LoginComponent from "../components/common/LoginComponent";

export default function Loginpage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarComponent onToggleSidebar={toggleSidebar} />

      <div className="flex flex-1 relative">
        {/* Sidebar (overlaps on top of LoginComponent) */}
        {isSidebarOpen && (
          <div
            className="fixed inset-y-0 left-0 w-64 bg-gray-50 border-r border-gray-200 pt-6 z-40"
            style={{ top: '4rem' }} // offset for Navbar
          >
            <SidebarComponent />
          </div>
        )}
        {/* Main content */}
        <main className="flex-1 flex items-center justify-center p-4">
          <LoginComponent />
        </main>
      </div>
    </div>
  );
}
