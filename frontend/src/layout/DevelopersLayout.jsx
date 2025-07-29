import { Outlet } from "react-router-dom";
import DevelopersNavbar from "../components/developers/DevelopersNavbar.jsx";
import DevelopersSidebar from "../components/developers/DevelopersSidebar.jsx";
import DevelopersFooter from "../components/developers/DevelopersFooter.jsx";

export default function DeveloperLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-cyan-50">
      {/* Sticky navbar at the top */}
      <div className="sticky top-0 z-50">
        <DevelopersNavbar />
      </div>

      {/* Main content area with sidebar and main content */}
      <div className="flex flex-1">
        {/* Sidebar - sticky to top (below navbar) */}
        <div className="sticky top-[4rem] h-[calc(100vh-4rem)] overflow-y-auto">
          <DevelopersSidebar />
        </div>

        {/* Main content area - scrollable */}
        <main className="flex-1 p-4 md:p-8 bg-cyan-50 min-h-[calc(100vh-4rem)]">
          <div className="min-h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer - appears after content */}
      <DevelopersFooter />
    </div>
  );
}
