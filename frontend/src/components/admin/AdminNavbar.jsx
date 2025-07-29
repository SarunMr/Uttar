import { Button } from "@/components/ui/button";
import { Code, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/auth/login");
  };

  return (
    <nav className="w-full bg-white border-b border-cyan-200 px-6 h-16 flex items-center sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-cyan-700 rounded flex items-center justify-center">
          <Code className="text-white h-5 w-5" />
        </div>
        <span className="text-xl font-bold text-cyan-700">Admin Panel</span>
      </div>
      <div className="flex-1" />
      <Button
        variant="ghost"
        onClick={logout}
        className="text-cyan-700 hover:text-cyan-900"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </nav>
  );
}
