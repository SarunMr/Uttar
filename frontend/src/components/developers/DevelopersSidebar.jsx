import { NavLink, useLocation } from "react-router-dom";
import { Home, Users, FileText } from "lucide-react";
import { cn } from "@/lib/utils"; // use your utility for className merge

const menu = [
  { to: "/admin/home", icon: Home, label: "Dashboard" },
  { to: "/admin/users", icon: Users, label: "Manage Users" },
  { to: "/admin/posts", icon: FileText, label: "All Posts" },
];

export default function DevelopersSidebar() {
  const { pathname } = useLocation();
  
  return (
    <aside
      className={cn(
        "bg-white border-r border-cyan-200",
        "flex-shrink-0 transition-all",
        "w-64 hidden md:flex flex-col", // desktop: 256px sidebar, flex
        "h-full", // Let the parent container handle the height
      )}
    >
      <nav className="flex flex-col py-6 gap-2">
        {menu.map((item) => (
          <NavLink
            to={item.to}
            key={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-6 py-3 font-medium rounded-r-full transition-colors",
                isActive || pathname === item.to
                  ? "bg-cyan-100 text-cyan-800"
                  : "text-gray-700 hover:bg-cyan-50",
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
