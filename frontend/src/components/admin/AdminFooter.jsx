import { Code, Home, Users, Settings, HelpCircle, Shield, FileText, Tag } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function AdminFooter() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { to: "/admin/home", label: "Home", icon: Home },
    { to: "/admin/questions", label: "Questions", icon: HelpCircle },
    { to: "/admin/my-posts", label: "My Posts", icon: FileText },
    { to: "/admin/tags", label: "Tags", icon: Tag },
    { to: "/admin/profile", label: "Profile", icon: Users },
  ];

  return (
    <footer className="w-full bg-cyan-700 border-t border-cyan-600">
      {/* Quick Links Section */}
      <div className="border-b border-cyan-600 bg-cyan-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2">
            {quickLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
                    "hover:bg-cyan-600 hover:shadow-sm",
                    isActive
                      ? "bg-cyan-600 text-white shadow-sm"
                      : "text-cyan-100 hover:text-white"
                  )
                }
              >
                <link.icon className="h-3 w-3" />
                <span className="hidden sm:inline">{link.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm">
            {/* Left side - Brand */}
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span className="text-cyan-100">
                <span className="font-semibold text-white">Uttar Admin</span> © {currentYear}
              </span>
            </div>

            {/* Center - Description */}
            <div className="text-cyan-200 text-xs hidden md:block">
              Internal admin panel for content management
            </div>

            {/* Right side - Additional info */}
            <div className="flex items-center gap-4 text-xs text-cyan-200">
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Secure Access
              </span>
              <span className="hidden sm:inline">v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
