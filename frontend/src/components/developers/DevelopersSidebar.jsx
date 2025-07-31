import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  CircleQuestionMark,
  UserSearch,
  Tags,
  Bookmark,
  User,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const menu = [
  // Main Navigation
  {
    section: "Main",
    items: [
      { to: "/user/home", icon: Home, label: "Home" },
      { to: "/user/questions", icon: CircleQuestionMark, label: "Questions" },
      { to: "/user/saved", icon: Bookmark, label: "Saved" },
    ],
  },
  // Content Management
  {
    section: "Content",
    items: [
      { to: "/user/tags", icon: Tags, label: "Tags" },
      { to: "/user/my-posts", icon: FileText, label: "My Posts" },
      { to: "/user/search", icon: UserSearch, label: "Search Users" },
    ],
  },
  // Account
  {
    section: "Account",
    items: [
      { to: "/user/profile", icon: User, label: "Profile" },
      // Removed Settings as requested
    ],
  },
];

export default function DeveloperSidebar() {
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Navigation Content */}
      <nav className="flex-1 py-6 gap-1 overflow-y-auto">
        {menu.map((section, sectionIndex) => (
          <div key={section.section}>
            {/* Section Header */}
            <div className="px-6 py-2 mb-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.section}
              </h3>
            </div>

            {/* Section Items */}
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  to={item.to}
                  key={item.to}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-6 py-3 mx-3 font-medium rounded-lg transition-all duration-200",
                      "hover:translate-x-1",
                      isActive || pathname === item.to
                        ? "bg-cyan-100 text-cyan-800 shadow-sm border-l-4 border-cyan-600"
                        : "text-gray-700 hover:bg-cyan-50 hover:text-cyan-700",
                    )
                  }
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              ))}
            </div>

            {/* Separator (except for last section) */}
            {sectionIndex < menu.length - 1 && (
              <div className="mx-6 my-4 border-b border-gray-200" />
            )}
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className={cn(
          "md:hidden fixed top-20 left-4 z-50 p-2 rounded-lg", // Fixed: Adjusted top position to be below navbar
          "bg-white border border-gray-200 shadow-sm",
          "hover:bg-gray-50 transition-colors",
        )}
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 top-[64px]" // Fixed: Start overlay below navbar
          onClick={closeMobileMenu}
        />
      )}

      {/* Desktop Sidebar - Works with your sticky layout */}
      <aside
        className={cn(
          "bg-white border-r border-gray-200 shadow-sm",
          "flex-shrink-0 transition-all duration-300",
          "w-64 hidden md:flex flex-col", // Fixed: Removed fixed positioning
          "h-full", // Fixed: Take full height of container
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "md:hidden fixed left-0 z-40", // Fixed: positioning for mobile
          "top-[64px] bottom-0", // Fixed: Position below navbar, extend to bottom
          "bg-white border-r border-gray-200 shadow-lg",
          "w-64 transform transition-transform duration-300",
          "h-[calc(100vh-64px)]", // Fixed: Height minus navbar height
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
