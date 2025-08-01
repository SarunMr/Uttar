
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Search,
  Calendar,
  Loader2,
  AlertCircle,
  ArrowRight,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserSearchUsers() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    if (searchTerm.trim()) {
      const debounceTimer = setTimeout(() => {
        searchUsers();
      }, 500);
      return () => clearTimeout(debounceTimer);
    } else {
      setUsers([]);
    }
  }, [searchTerm]);

  const searchUsers = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/users/search`, // Changed to user endpoint
        {
          params: { q: searchTerm },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        setError(response.data.message || "Failed to search users");
      }
    } catch (error) {
      console.error("Error searching users:", error);
      setError("Failed to search users");
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user) => {
    navigate(`/user/search/${user.id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Generate avatar color based on name
  const getAvatarColor = (firstName, lastName) => {
    const colors = [
      "bg-red-100 text-red-700",
      "bg-cyan-100 text-cyan-700",
      "bg-green-100 text-green-700",
      "bg-yellow-100 text-yellow-700",
      "bg-purple-100 text-purple-700",
      "bg-pink-100 text-pink-700",
      "bg-indigo-100 text-indigo-700",
      "bg-teal-100 text-teal-700",
    ];
    const nameHash = ((firstName || "") + (lastName || "")).length;
    return colors[nameHash % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-cyan-800">Search Users</h1>
        <p className="text-gray-600 mt-1">
          Discover and connect with fellow community members
        </p>
      </div>

      {/* Error Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-cyan-600" />
            User Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users by username, email, or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-cyan-200 focus:border-cyan-400"
            />
          </div>
          {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-cyan-600" />
              <span className="ml-2 text-gray-600">Searching...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {users.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                  onClick={() => handleUserClick(user)}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarFallback
                      className={cn(
                        "font-semibold",
                        getAvatarColor(user.firstName, user.lastName),
                      )}
                    >
                      {user.firstName?.[0]?.toUpperCase() || ""}
                      {user.lastName?.[0]?.toUpperCase() || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">@{user.username}</p>
                    {/* Removed email for privacy */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Calendar className="h-3 w-3" />
                      Joined {formatDate(user.createdAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Only show role if it's admin, hide regular users for cleaner UI */}
                    {user.role === "admin" && (
                      <Badge
                        variant="default"
                        className="bg-cyan-100 text-cyan-800"
                      >
                        Admin
                      </Badge>
                    )}
                    {/* Show activity level instead of admin controls */}
                    <Badge
                      variant="secondary"
                      className={cn(
                        user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600",
                      )}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-cyan-600 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {searchTerm && !loading && users.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No users found for "{searchTerm}"</p>
            <p className="text-gray-400 text-sm mt-2">
              Try searching with different keywords or check spelling
            </p>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {!searchTerm && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Find Community Members
            </h3>
            <p className="text-gray-500 mb-4">
              Search for users to view their profiles and connect with fellow learners
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-400">
              <span className="bg-gray-100 px-2 py-1 rounded">Username</span>
              <span className="bg-gray-100 px-2 py-1 rounded">First Name</span>
              <span className="bg-gray-100 px-2 py-1 rounded">Last Name</span>
            </div>
            <div className="mt-4 p-3 bg-cyan-50 rounded-lg">
              <p className="text-xs text-cyan-700">
                💡 Connect with other developers and learners in the community
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
