import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Plus,
  Search,
  MessageSquare,
  Eye,
  Heart,
  Filter,
  User,
  Calendar,
  Tag,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function AdminQuestions() {
  const navigate = useNavigate();
  const location = useLocation();

  // Questions state
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Constants
  const questionsPerPage = 8;
  const API_BASE_URL = "http://localhost:5000";

  // Memoized date formatter to avoid recreation on every render
  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // ENHANCED: Better question transformation with proper tag handling
  const transformedQuestions = useMemo(() => {
    return questions.map((question) => {
      // Ensure tags is always an array
      let tags = question.tags || [];
      
      // Handle different tag formats that might come from backend
      if (typeof tags === 'string') {
        try {
          tags = JSON.parse(tags);
        } catch (e) {
          tags = [tags];
        }
      }
      
      if (!Array.isArray(tags)) {
        tags = [];
      }

      return {
        id: question.id,
        title: question.title || "",
        content: question.content || "",
        description: question.description || "",
        images: question.images || [],
        tags: tags, // Properly handled tags
        likes: question.likes || 0,
        views: question.views || 0,
        comments: question.commentsCount || 0,
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
        author: question.author || {
          id: question.authorId,
          username: "Unknown",
          firstName: "Unknown",
          lastName: "User",
        },
      };
    });
  }, [questions]);

  // FIXED: Enhanced filtering logic with better search handling
  const filteredQuestions = useMemo(() => {
    if (!transformedQuestions.length) return [];

    let filtered = transformedQuestions;

    // Only apply search filter if searchTerm exists and is not empty
    if (searchTerm && searchTerm.trim().length > 0) {
      const searchLower = searchTerm.toLowerCase().trim();
      
      filtered = transformedQuestions.filter((q) => {
        // Search in title (with null check)
        const titleMatch = q.title && q.title.toLowerCase().includes(searchLower);
        
        // Search in content (with null check)
        const contentMatch = q.content && q.content.toLowerCase().includes(searchLower);
        
        // Search in description (with null check)
        const descriptionMatch = q.description && q.description.toLowerCase().includes(searchLower);
        
        // Search in tags (with proper array check)
        const tagsMatch = Array.isArray(q.tags) && q.tags.length > 0 
          ? q.tags.some(tag => 
              typeof tag === 'string' && tag.toLowerCase().includes(searchLower)
            )
          : false;

        // Search in author name
        const authorMatch = (q.author?.firstName && q.author.firstName.toLowerCase().includes(searchLower)) ||
                           (q.author?.lastName && q.author.lastName.toLowerCase().includes(searchLower)) ||
                           (q.author?.username && q.author.username.toLowerCase().includes(searchLower));

        return titleMatch || contentMatch || descriptionMatch || tagsMatch || authorMatch;
      });
    }

    // Apply sorting filter
    switch (filterType) {
      case "newest":
        return [...filtered].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
      case "oldest":
        return [...filtered].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        );
      case "unanswered":
        return filtered.filter((q) => q.comments === 0);
      case "most_liked":
        return [...filtered].sort((a, b) => b.likes - a.likes);
      case "most_viewed":
        return [...filtered].sort((a, b) => b.views - a.views);
      case "all":
      default:
        return filtered;
    }
  }, [transformedQuestions, searchTerm, filterType]);

  // Memoized pagination calculations
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
    const paginatedQuestions = filteredQuestions.slice(
      (currentPage - 1) * questionsPerPage,
      currentPage * questionsPerPage,
    );

    return { totalPages, paginatedQuestions };
  }, [filteredQuestions, currentPage, questionsPerPage]);

  // Memoized pagination component
  const paginationComponent = useMemo(() => {
    const { totalPages } = paginationData;
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          className="px-3 py-1 rounded-md border border-cyan-300 text-cyan-700 hover:bg-cyan-100"
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>,
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-md border font-medium",
            i === currentPage
              ? "bg-cyan-600 text-white border-cyan-600"
              : "border-cyan-300 text-cyan-700 hover:bg-cyan-100",
          )}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>,
      );
    }

    // Next button
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          className="px-3 py-1 rounded-md border border-cyan-300 text-cyan-700 hover:bg-cyan-100"
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>,
      );
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        {pages}
      </div>
    );
  }, [paginationData.totalPages, currentPage]);

  // Optimized API call with useCallback
  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_BASE_URL}/api/questions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        console.log("Raw API response:", response.data.data); // Debug log
        setQuestions(response.data.data);
      } else {
        setError(response.data.message || "Failed to load questions");
      }
    } catch (error) {
      console.error("Error loading questions:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load questions",
      );
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  // Optimized refresh handler
  const handleRefresh = useCallback(() => {
    loadQuestions();
  }, [loadQuestions]);

  // Optimized navigation handlers
  const handleQuestionClick = useCallback(
    (questionId) => {
      navigate(`/admin/questions/${questionId}`);
    },
    [navigate],
  );

  const handleAskQuestionClick = useCallback(() => {
    navigate("/admin/questions/ask");
  }, [navigate]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  // Load questions on mount
  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  // Handle success message
  useEffect(() => {
    if (location.state?.message) {
      console.log("Success:", location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // DEBUG: Add debugging effect
  useEffect(() => {
    console.log("Search term:", searchTerm);
    console.log("Transformed questions:", transformedQuestions.length);
    console.log("Filtered questions:", filteredQuestions.length);
    
    if (transformedQuestions.length > 0) {
      console.log("Sample question:", {
        title: transformedQuestions[0]?.title,
        tags: transformedQuestions[0]?.tags,
      });
    }
  }, [searchTerm, transformedQuestions, filteredQuestions]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-cyan-800 mb-2">
            All Questions
          </h1>
          <p className="text-gray-600">
            Browse and manage questions from the community.
            {questions.length > 0 && (
              <span className="ml-2">({questions.length} questions)</span>
            )}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            className="border-cyan-200 text-cyan-700 hover:bg-cyan-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </Button>

          <Button
            onClick={handleAskQuestionClick}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ask Question
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {location.state?.message && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <p className="text-green-800">{location.state.message}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-800">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="ml-auto"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Input
              placeholder="Search questions, content, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 border-cyan-200 focus:border-cyan-400"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="w-48">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="border-cyan-200">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Questions</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="most_liked">Most Liked</SelectItem>
              <SelectItem value="most_viewed">Most Viewed</SelectItem>
              <SelectItem value="unanswered">Unanswered</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-600"></div>
              <p className="text-gray-600">Loading questions...</p>
            </div>
          </div>
        ) : error && questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <AlertCircle className="h-12 w-12 mb-4 text-red-300" />
            <p className="text-lg font-medium">Failed to load questions</p>
            <p className="text-sm mb-4">Please try refreshing the page</p>
            <Button onClick={handleRefresh} variant="outline">
              Refresh
            </Button>
          </div>
        ) : paginationData.paginatedQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <MessageSquare className="h-12 w-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium">
              {searchTerm
                ? "No questions match your search"
                : "No questions found"}
            </p>
            <p className="text-sm mb-4">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Be the first to ask a question!"}
            </p>
            {!searchTerm && (
              <Button
                onClick={handleAskQuestionClick}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ask Question
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {paginationData.paginatedQuestions.map((question) => (
              <Card
                key={question.id}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-cyan-100 hover:border-cyan-300 group"
                onClick={() => handleQuestionClick(question.id)}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-cyan-800 transition-colors">
                    {question.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {question.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* ENHANCED: Tags Section with better array handling */}
                  {question.tags && Array.isArray(question.tags) && question.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {question.tags.slice(0, 4).map((tagName, index) => (
                        <Badge
                          key={`${tagName}-${index}`}
                          variant="secondary"
                          className={cn(
                            "text-xs font-medium flex items-center gap-1",
                            tagName === "admin"
                              ? "bg-cyan-100 text-cyan-800 border border-cyan-200"
                              : tagName === "request"
                                ? "bg-blue-100 text-blue-800 border border-blue-200"
                                : "bg-gray-100 text-gray-800",
                          )}
                        >
                          <Tag className="h-2.5 w-2.5" />
                          {tagName}
                        </Badge>
                      ))}
                      {question.tags.length > 4 && (
                        <Badge
                          variant="outline"
                          className="text-xs text-gray-500"
                        >
                          +{question.tags.length - 4} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Images indicator */}
                  {question.images && question.images.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <ImageIcon className="h-3 w-3" />
                      <span>
                        {question.images.length} image
                        {question.images.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}

                  {/* Author and Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="h-4 w-4" />
                    <span className="font-medium text-gray-700">
                      {question.author.firstName} {question.author.lastName}
                    </span>
                    <span>@{question.author.username}</span>
                    <Calendar className="h-4 w-4 ml-2" />
                    <span>{formatDate(question.createdAt)}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Heart className="h-4 w-4" />
                      <span>{question.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Eye className="h-4 w-4" />
                      <span>{question.views}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <MessageSquare className="h-4 w-4" />
                      <span>{question.comments}</span>
                    </div>
                    {question.comments === 0 && (
                      <Badge
                        variant="secondary"
                        className="bg-orange-100 text-orange-800"
                      >
                        Unanswered
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {paginationComponent}
      </div>
    </div>
  );
}
