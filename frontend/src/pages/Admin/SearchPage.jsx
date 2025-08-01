import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  User,
  Search,
  Mail,
  Calendar,
  Shield,
  FileText,
  Heart,
  Eye,
  MessageCircle,
  Trash2,
  UserX,
  Edit,
  Lock,
  Unlock,
  MoreVertical,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";

export default function AdminSearchUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);
  const [deletingPost, setDeletingPost] = useState(false);
  const [userAction, setUserAction] = useState("");

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
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/admin/users/search`,
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

  const loadUserProfile = async (userId) => {
    setProfileLoading(true);
    try {
      const [profileResponse, postsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
        axios.get(`${API_BASE_URL}/api/admin/users/${userId}/posts`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
      ]);

      if (profileResponse.data.success) {
        setSelectedUser(profileResponse.data.data);
      }

      if (postsResponse.data.success) {
        setUserPosts(postsResponse.data.data);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      setError("Failed to load user profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    setUserPosts([]);
    setProfileDialogOpen(true);
    await loadUserProfile(user.id);
  };

  const handleDeletePost = async (postId) => {
    setDeletingPost(true);
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/admin/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        setUserPosts((prev) => prev.filter((post) => post.id !== postId));
        setSuccess("Post deleted successfully");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response.data.message || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      setError("Failed to delete post");
    } finally {
      setDeletingPost(false);
      setDeletePostId(null);
    }
  };

  const handleUserAction = async (action, userId) => {
    setUserAction(action);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/admin/users/${userId}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        setSelectedUser((prev) => ({ ...prev, ...response.data.data }));
        setSuccess(`User ${action} successfully`);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response.data.message || `Failed to ${action} user`);
      }
    } catch (error) {
      console.error(`Error ${action} user:`, error);
      setError(`Failed to ${action} user`);
    } finally {
      setUserAction("");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Generate avatar color based on name
  const getAvatarColor = (firstName, lastName) => {
    const colors = [
      "bg-red-100 text-red-700",
      "bg-blue-100 text-blue-700",
      "bg-green-100 text-green-700",
      "bg-yellow-100 text-yellow-700",
      "bg-purple-100 text-purple-700",
      "bg-pink-100 text-pink-700",
      "bg-indigo-100 text-indigo-700",
      "bg-cyan-100 text-cyan-700",
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
          Find and manage users across the platform
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-green-700">{success}</p>
          </div>
        </div>
      )}

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
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
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
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                      className={cn(
                        user.role === "admin"
                          ? "bg-cyan-100 text-cyan-800"
                          : "bg-gray-100 text-gray-700",
                      )}
                    >
                      {user.role}
                    </Badge>
                    <Badge
                      variant={user.isActive ? "default" : "destructive"}
                      className={cn(
                        user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800",
                      )}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
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
          </CardContent>
        </Card>
      )}

      {/* User Profile Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-cyan-600" />
              User Profile & Management
            </DialogTitle>
            <DialogDescription>
              View user details and manage their content
            </DialogDescription>
          </DialogHeader>

          {profileLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-cyan-600" />
              <span className="ml-2 text-gray-600">Loading profile...</span>
            </div>
          ) : selectedUser ? (
            <div className="space-y-6">
              {/* User Info Section */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback
                          className={cn(
                            "text-xl font-bold",
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
                        <h3 className="font-semibold text-lg">
                          {selectedUser.firstName} {selectedUser.lastName}
                        </h3>
                        <p className="text-gray-600">
                          @{selectedUser.username}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{selectedUser.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="h-4 w-4 text-gray-500" />
                        <Badge
                          variant={
                            selectedUser.role === "admin"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {selectedUser.role}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>Joined {formatDate(selectedUser.createdAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Admin Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Admin Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedUser.isActive ? (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start border-red-200 text-red-700 hover:bg-red-50"
                              disabled={userAction === "deactivate"}
                            >
                              {userAction === "deactivate" ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Lock className="h-4 w-4 mr-2" />
                              )}
                              Deactivate User
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Deactivate User
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will deactivate the user account. They
                                won't be able to log in until reactivated.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleUserAction(
                                    "deactivate",
                                    selectedUser.id,
                                  )
                                }
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Deactivate
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full justify-start border-green-200 text-green-700 hover:bg-green-50"
                          onClick={() =>
                            handleUserAction("activate", selectedUser.id)
                          }
                          disabled={userAction === "activate"}
                        >
                          {userAction === "activate" ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Unlock className="h-4 w-4 mr-2" />
                          )}
                          Activate User
                        </Button>
                      )}

                      {selectedUser.role === "user" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start border-cyan-200 text-cyan-700 hover:bg-cyan-50"
                              disabled={userAction === "promote"}
                            >
                              {userAction === "promote" ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Shield className="h-4 w-4 mr-2" />
                              )}
                              Promote to Admin
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Promote to Admin
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will give the user admin privileges. They
                                will have access to admin features.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleUserAction("promote", selectedUser.id)
                                }
                              >
                                Promote
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}

                      <Button
                        variant="outline"
                        className="w-full justify-start border-gray-200 text-gray-700 hover:bg-gray-50"
                        onClick={() =>
                          window.open(`mailto:${selectedUser.email}`, "_blank")
                        }
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* User Posts Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-cyan-600" />
                    User Posts ({userPosts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userPosts.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {userPosts.map((post) => (
                        <div
                          key={post.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900 line-clamp-1">
                              {post.title}
                            </h4>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Post
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this post?
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeletePost(post.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={deletingPost}
                                  >
                                    {deletingPost ? (
                                      <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Deleting...
                                      </>
                                    ) : (
                                      "Delete"
                                    )}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {post.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
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
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No posts found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
