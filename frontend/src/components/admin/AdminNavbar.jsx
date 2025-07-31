import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Bookmark, FileText } from "lucide-react";
import LogoBlackText from "./../../assets/logo/LogoBlackText.png";
import axios from "axios";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "http://localhost:5000";

  // Load user profile on component mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // If no token, fallback to localStorage user
        const userStr = localStorage.getItem("user");
        if (userStr) {
          setUser(JSON.parse(userStr));
        }
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const userData = response.data.data;
        setUser(userData);
        // Update localStorage with fresh data
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        // Fallback to localStorage if API fails
        const userStr = localStorage.getItem("user");
        if (userStr) {
          setUser(JSON.parse(userStr));
        }
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      // Fallback to localStorage user
      const userStr = localStorage.getItem("user");
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    } finally {
      setLoading(false);
    }
  };

  // Generate avatar color based on name
  const getAvatarColor = (firstName, lastName) => {
    const colors = [
      "from-red-500 to-red-600",
      "from-blue-500 to-blue-600",
      "from-green-500 to-green-600",
      "from-yellow-500 to-yellow-600",
      "from-purple-500 to-purple-600",
      "from-pink-500 to-pink-600",
      "from-indigo-500 to-indigo-600",
      "from-cyan-500 to-cyan-600",
    ];
    const nameHash = ((firstName || "") + (lastName || "")).length;
    return colors[nameHash % colors.length];
  };

  const logout = () => {
    localStorage.clear();
    navigate("/auth/login");
  };

  // Display values with fallbacks
  const displayName = user 
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "Admin User"
    : "Admin User";
  
  const displayEmail = user?.email || "admin@example.com";
  const displayUsername = user?.username || "adminuser";
  
  // Avatar initials
  const avatarInitials = user 
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || user.username?.[0]?.toUpperCase() || "A"
    : "A";

  const avatarColorClass = user 
    ? getAvatarColor(user.firstName, user.lastName)
    : "from-cyan-500 to-blue-600";

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
              <AvatarFallback className={`bg-gradient-to-br ${avatarColorClass} text-white font-semibold`}>
                {avatarInitials}
              </AvatarFallback>
            </Avatar>
            {/* Online status indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-60">
          {/* User info */}
          <div className="px-4 py-3 select-none bg-gradient-to-r from-cyan-50 to-blue-50 border-b">
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="h-10 w-10">
                <AvatarFallback className={`bg-gradient-to-br ${avatarColorClass} text-white font-semibold text-sm`}>
                  {avatarInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div
                  className="font-semibold text-gray-900 text-sm truncate"
                  title={displayName}
                >
                  {displayName}
                </div>
                <div
                  className="text-gray-600 text-xs truncate"
                  title={`@${displayUsername}`}
                >
                  @{displayUsername}
                </div>
                <div
                  className="text-gray-500 text-xs truncate mt-0.5"
                  title={displayEmail}
                >
                  {displayEmail}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-green-600 text-xs font-medium">
                {loading ? "Loading..." : "Online"}
              </span>
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Profile - Added before My Posts */}
          <DropdownMenuItem
            onClick={() => navigate("/admin/profile")}
            className="cursor-pointer hover:bg-cyan-50 focus:bg-cyan-50"
          >
            <User className="mr-3 h-4 w-4 text-cyan-600" />
            <span>Profile</span>
          </DropdownMenuItem>

          {/* My Posts */}
          <DropdownMenuItem
            onClick={() => navigate("/admin/my-posts")}
            className="cursor-pointer hover:bg-cyan-50 focus:bg-cyan-50"
          >
            <FileText className="mr-3 h-4 w-4 text-blue-600" />
            <span>My Posts</span>
          </DropdownMenuItem>

          {/* Saved */}
          <DropdownMenuItem
            onClick={() => navigate("/admin/saved")}
            className="cursor-pointer hover:bg-cyan-50 focus:bg-cyan-50"
          >
            <Bookmark className="mr-3 h-4 w-4 text-amber-600" />
            <span>Saved</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

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
