import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  User,
  FileText,
  Heart,
  Eye,
  MessageCircle,
  TrendingUp,
  Clock,
  Users,
  Bookmark,
  Activity,
  Calendar,
  ArrowRight,
  Loader2,
  Search,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserHome() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalLikes: 0,
    totalViews: 0,
    totalComments: 0,
    myQuestions: 0,
    bookmarkedQuestions: 0,
  });
  const [latestQuestions, setLatestQuestions] = useState([]);
  const [error, setError] = useState("");

  const API_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // Load user profile and dashboard stats
      const [profileResponse, statsResponse, questionsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/api/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/api/questions?limit=5`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (profileResponse.data.success) {
        setUser(profileResponse.data.data);
      }

      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }

      if (questionsResponse.data.success) {
        setLatestQuestions(questionsResponse.data.data);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError("Failed to load dashboard data");
      
      // Fallback to localStorage user
      const userStr = localStorage.getItem("user");
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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

  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "Developer"
    : "Developer";

  const avatarInitials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
      user.username?.[0]?.toUpperCase() ||
      "D"
    : "D";

  const avatarColorClass = user
    ? getAvatarColor(user.firstName, user.lastName)
    : "bg-cyan-100 text-cyan-700";

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 ring-4 ring-white/20">
            <AvatarFallback className={cn("text-2xl font-bold", avatarColorClass)}>
              {avatarInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold mb-1">Welcome back, {displayName}!</h1>
            <p className="text-cyan-100">
              Ready to explore, learn, and share your knowledge with the community?
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-cyan-600" />
            About Uttar Platform
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Community Learning</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Welcome to Uttar - your go-to platform for asking questions, sharing knowledge, and connecting 
                with fellow developers and learners. Discover solutions, contribute insights, and grow together.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Your Journey</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Whether you're seeking answers or sharing expertise, every interaction helps build a stronger 
                community. Ask questions, provide answers, and bookmark valuable content for future reference.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Questions */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Questions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalQuestions}</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  Active community
                </p>
              </div>
              <div className="p-3 bg-cyan-100 rounded-full">
                <FileText className="h-6 w-6 text-cyan-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Likes */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Likes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLikes}</p>
                <p className="text-xs text-pink-600 flex items-center gap-1 mt-1">
                  <Heart className="h-3 w-3" />
                  Engagement
                </p>
              </div>
              <div className="p-3 bg-pink-100 rounded-full">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Views */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
                <p className="text-xs text-teal-600 flex items-center gap-1 mt-1">
                  <Eye className="h-3 w-3" />
                  Reach
                </p>
              </div>
              <div className="p-3 bg-teal-100 rounded-full">
                <Eye className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Comments */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Comments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalComments}</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <MessageCircle className="h-3 w-3" />
                  Discussions
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personal Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-cyan-600" />
              Your Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-cyan-600" />
                  <span className="font-medium text-gray-900">My Questions</span>
                </div>
                <span className="text-2xl font-bold text-cyan-600">{stats.myQuestions}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bookmark className="h-5 w-5 text-amber-600" />
                  <span className="font-medium text-gray-900">Bookmarked</span>
                </div>
                <span className="text-2xl font-bold text-amber-600">{stats.bookmarkedQuestions}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-cyan-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/user/questions/ask")}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white justify-start"
              >
                <FileText className="h-4 w-4 mr-2" />
                Ask New Question
              </Button>
              <Button
                onClick={() => navigate("/user/my-posts")}
                variant="outline"
                className="w-full justify-start border-cyan-200 text-cyan-700 hover:bg-cyan-50"
              >
                <User className="h-4 w-4 mr-2" />
                Manage My Posts
              </Button>
              <Button
                onClick={() => navigate("/user/tags")}
                variant="outline"
                className="w-full justify-start border-cyan-200 text-cyan-700 hover:bg-cyan-50"
              >
                <Tag className="h-4 w-4 mr-2" />
                Browse Tags
              </Button>
              <Button
                onClick={() => navigate("/user/search")}
                variant="outline"
                className="w-full justify-start border-cyan-200 text-cyan-700 hover:bg-cyan-50"
              >
                <Search className="h-4 w-4 mr-2" />
                Search Users
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Latest Questions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-cyan-600" />
              Latest Questions
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/user/questions")}
              className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
            >
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {latestQuestions.length > 0 ? (
            <div className="space-y-4">
              {latestQuestions.map((question) => (
                <div
                  key={question.id}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/user/questions/${question.id}`)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={cn("text-sm font-semibold", 
                      getAvatarColor(question.author?.firstName, question.author?.lastName)
                    )}>
                      {question.author?.firstName?.[0]?.toUpperCase() || 'U'}
                      {question.author?.lastName?.[0]?.toUpperCase() || ''}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{question.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {question.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {question.author?.username || 'Unknown'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {question.likes || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {question.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {question.commentsCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(question.createdAt)}
                      </span>
                    </div>
                  </div>
                  {/* Question Tags */}
{/* Question Tags - Updated with color coding */}
{question.tags && question.tags.length > 0 && (
  <div className="flex flex-wrap gap-1">
    {question.tags.slice(0, 2).map((tag, index) => {
      // Function to get tag color based on tag name
      const getTagColor = (tagName) => {
        const lowerTag = tagName.toLowerCase();
        switch (lowerTag) {
          case 'admin':
            return "px-2 py-1 text-xs bg-cyan-100 text-cyan-800 rounded-full font-medium";
          case 'request':
            return "px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full font-medium";
          default:
            return "px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full";
        }
      };

      return (
        <span
          key={index}
          className={getTagColor(tag)}
        >
          {tag}
        </span>
      );
    })}
    {question.tags.length > 2 && (
      <span className="text-xs text-gray-500">
        +{question.tags.length - 2} more
      </span>
    )}
  </div>
)}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No questions available yet</p>
              <Button
                onClick={() => navigate("/user/questions/ask")}
                className="mt-3 bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                Ask First Question
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
