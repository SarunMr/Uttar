import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  FileText,
  Heart,
  Eye,
  MessageCircle,
  Loader2,
  AlertCircle,
  Clock,
  ArrowLeft,
  BarChart3,
  ExternalLink,
  User as UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function UserProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    if (id) {
      loadUserProfile();
    }
  }, [id]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const loadUserProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const [profileResponse, postsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/users/${id}`, {
          // Changed to user endpoint
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
        axios.get(`${API_BASE_URL}/api/users/${id}/posts`, {
          // Changed to user endpoint
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
      ]);

      if (profileResponse.data.success) {
        setSelectedUser(profileResponse.data.data);
      } else {
        setError(profileResponse.data.message || "Failed to load user profile");
      }

      if (postsResponse.data.success) {
        setUserPosts(postsResponse.data.data);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      if (error.response?.status === 404) {
        setError("User not found");
      } else {
        setError("Failed to load user profile");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle post click navigation
  const handlePostClick = (postId) => {
    navigate(`/user/questions/${postId}`);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-600" />
          <span className="text-gray-600">Loading user profile...</span>
        </div>
      </div>
    );
  }

  if (error && !selectedUser) {
    return (
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/user/search")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Button>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-red-600">{error}</p>
          <Button onClick={loadUserProfile} variant="outline" className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/user/search")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-cyan-800">User Profile</h1>
            <p className="text-gray-600">
              View community member profile and posts
            </p>
          </div>
        </div>
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

      {selectedUser && (
        <div className="space-y-6">
          {/* User Info Section */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Basic Info */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback
                      className={cn(
                        "text-2xl font-bold",
                        getAvatarColor(
                          selectedUser.firstName,
                          selectedUser.lastName,
                        ),
                      )}
                    >
                      {selectedUser.firstName?.[0]?.toUpperCase() || ""}
                      {selectedUser.lastName?.[0]?.toUpperCase() || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-xl">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h3>
                    <p className="text-gray-600 text-lg">
                      @{selectedUser.username}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {selectedUser.role === "admin" && (
                        <Badge
                          variant="default"
                          className="bg-cyan-100 text-cyan-800"
                        >
                          Admin
                        </Badge>
                      )}
                      <Badge
                        variant={
                          selectedUser.isActive ? "default" : "secondary"
                        }
                        className={cn(
                          selectedUser.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600",
                        )}
                      >
                        {selectedUser.isActive ? "Active Member" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Removed email for privacy */}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>
                      Member since {formatDate(selectedUser.createdAt)}
                    </span>
                  </div>
                </div>

                {/* User Stats */}
                {selectedUser.stats && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Community Activity
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-600">
                          {selectedUser.stats.questionCount}
                        </div>
                        <div className="text-sm text-gray-600">Questions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-pink-600">
                          {selectedUser.stats.totalLikes}
                        </div>
                        <div className="text-sm text-gray-600">Total Likes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-teal-600">
                          {selectedUser.stats.totalViews}
                        </div>
                        <div className="text-sm text-gray-600">Total Views</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedUser.stats.totalComments}
                        </div>
                        <div className="text-sm text-gray-600">Comments</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Connect Section (Instead of Admin Actions) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Connect</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-cyan-200 text-cyan-700 hover:bg-cyan-50"
                    onClick={() => navigate("/user/questions/ask")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Ask a Question
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start border-gray-200 text-gray-700 hover:bg-gray-50"
                    onClick={() => navigate("/user/questions")}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Browse Questions
                  </Button>

                  {/* Optional: Contact via external email if public */}
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                      Connect through community discussions and questions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Posts Section - View Only (No Delete) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-600" />
                Public Posts ({userPosts.length})
                {userPosts.length > 0 && (
                  <span className="text-sm font-normal text-gray-500">
                    (Click posts to view details)
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userPosts.length > 0 ? (
                <div className="space-y-4">
                  {userPosts.map((post) => (
                    <div
                      key={post.id}
                      className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 hover:border-cyan-300 transition-colors group relative"
                      onClick={() => handlePostClick(post.id)}
                    >
                      {/* Visual indicator for clickable posts */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="h-4 w-4 text-cyan-600" />
                      </div>

                      <div className="flex-1 pr-8">
                        <h4 className="font-medium text-gray-900 line-clamp-2 group-hover:text-cyan-700 transition-colors mb-2">
                          {post.title}
                        </h4>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-3 mb-3 group-hover:text-gray-700 transition-colors">
                        {post.description}
                      </p>

                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.tags.slice(0, 3).map((tag, index) => {
                            // Apply same tag color logic as in UserHome
                            const getTagColor = (tagName) => {
                              const lowerTag = tagName.toLowerCase();
                              switch (lowerTag) {
                                case "admin":
                                  return "px-2 py-1 text-xs bg-cyan-100 text-cyan-800 rounded-full font-medium";
                                case "request":
                                  return "px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full font-medium";
                                default:
                                  return "px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full";
                              }
                            };

                            return (
                              <span key={index} className={getTagColor(tag)}>
                                {tag}
                              </span>
                            );
                          })}
                          {post.tags.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{post.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {post.likes || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.views || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {post.commentsCount || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(post.createdAt)}
                        </span>
                        <span className="flex items-center gap-1 ml-auto text-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="h-3 w-3" />
                          Read More
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Public Posts
                  </h3>
                  <p className="text-gray-500">
                    This user hasn't shared any public posts yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
