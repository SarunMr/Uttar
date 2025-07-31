import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {  LogOut, Settings, Bookmark, FileText } from "lucide-react";
import LogoBlackText from "./../../assets/logo/LogoBlackText.png";

export default function DevelopersNavbar() {
  const navigate = useNavigate();
  // Get user from localStorage safely, provide placeholders if missing
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const usernameDisplay = user?.username?.trim() || "AdminUser";
  const emailDisplay = user?.email?.trim() || "admin@example.com";
  
  const logout = () => {
    localStorage.clear();
    navigate("/auth/login");
  };
  
  return (
    <nav className="w-full bg-white border-b border-cyan-200 px-6 h-16 flex items-center sticky top-0 z-40">
      {/* Left section: logo and title */}
      <div className="flex items-center gap-3">
            <img src={LogoBlackText} alt="Mentaro Logo" className="h-10" />
      </div>
      
      {/* Spacer */}
      <div className="flex-1" />
      
      {/* Right section: Avatar & Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="relative h-10 w-10 rounded-full p-0 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all duration-200 hover:scale-105">
            <Avatar className="h-10 w-10 ring-2 ring-white shadow-lg">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="Admin avatar"
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-semibold">
                {usernameDisplay[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {/* Online status indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
          </button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-60">
          {/* User info - now inside DropdownMenuContent */}
          <div className="px-4 py-3 select-none bg-gradient-to-r from-cyan-50 to-blue-50 border-b">
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="Admin avatar"
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-semibold text-sm">
                  {usernameDisplay[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm truncate" title={usernameDisplay}>
                  {usernameDisplay}
                </div>
                <div className="text-gray-600 text-xs truncate" title={emailDisplay}>
                  {emailDisplay}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-green-600 text-xs font-medium">Online</span>
            </div>
          </div>
          
          <DropdownMenuSeparator />
          
          {/* My Posts */}
          <DropdownMenuItem
            onClick={() => navigate("/user/my-posts")}
            className="cursor-pointer hover:bg-cyan-50 focus:bg-cyan-50"
          >
            <FileText className="mr-3 h-4 w-4 text-blue-600" />
            <span>My Posts</span>
          </DropdownMenuItem>
          
          {/* Saved */}
          <DropdownMenuItem
            onClick={() => navigate("/user/saved")}
            className="cursor-pointer hover:bg-cyan-50 focus:bg-cyan-50"
          >
            <Bookmark className="mr-3 h-4 w-4 text-amber-600" />
            <span>Saved</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Settings */}
          <DropdownMenuItem
            onClick={() => navigate("/admin/settings")}
            className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
          >
            <Settings className="mr-3 h-4 w-4 text-gray-600" />
            <span>Settings</span>
          </DropdownMenuItem>
          
          {/* Logout */}
          <DropdownMenuItem
            onClick={logout}
            className="cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50"
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
