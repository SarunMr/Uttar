import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Search,
  Eye,
  Heart,
  MessageSquare,
  Calendar,
  Tag,
  AlertCircle,
  Loader2,
  BookmarkCheck,
} from "lucide-react";
import axios from "axios";

export default function SavedQuestions() {
  const navigate = useNavigate();

  // State management
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [bookmarkLoading, setBookmarkLoading] = useState({});

  const API_BASE_URL = "http://localhost:5000";

  // Load bookmarked questions
  useEffect(() => {
    loadBookmarkedQuestions();
  }, [currentPage, searchTerm]);

  const loadBookmarkedQuestions = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/questions/bookmarked`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            page: currentPage,
            limit: 10,
            search: searchTerm,
          },
        },
      );

      if (response.data.success) {
        setQuestions(response.data.data.questions);
        setTotalPages(response.data.data.pagination.totalPages);
        setTotalItems(response.data.data.pagination.totalItems);
      } else {
        setError(
          response.data.message || "Failed to load bookmarked questions",
        );
      }
    } catch (error) {
      console.error("Error loading bookmarked questions:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load bookmarked questions",
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle bookmark toggle (remove from bookmarks)
  const handleToggleBookmark = async (questionId) => {
    if (bookmarkLoading[questionId]) return;

    setBookmarkLoading((prev) => ({ ...prev, [questionId]: true }));

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/questions/${questionId}/bookmark`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        // Remove the question from the list since it's no longer bookmarked
        setQuestions((prev) => prev.filter((q) => q.id !== questionId));
        setTotalItems((prev) => prev - 1);
        console.log("Bookmark removed successfully");
      } else {
        setError(response.data.message || "Failed to remove bookmark");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to remove bookmark",
      );
    } finally {
      setBookmarkLoading((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Truncate text
  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  // Pagination component
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={cn(
            "px-3 py-1 mx-1 rounded-md border font-medium text-sm",
            i === currentPage
              ? "bg-cyan-600 text-white border-cyan-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
          )}
        >
          {i}
        </button>,
      );
    }

    return (
      <div className="flex justify-center items-center mt-8 space-x-2">
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          size="sm"
        >
          Previous
        </Button>
        {pages}
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          size="sm"
        >
          Next
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-cyan-800">Saved Questions</h1>
          <p className="text-gray-600 mt-1">
            Your bookmarked questions ({totalItems} total)
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search saved questions..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 border-cyan-200 focus:border-cyan-400"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-cyan-600" />
            <p className="text-gray-600">Loading saved questions...</p>
          </div>
        </div>
      ) : questions.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16">
          <BookmarkCheck className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No saved questions
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm
              ? "No saved questions match your search criteria"
              : "You haven't bookmarked any questions yet"}
          </p>
          <Button
            onClick={() => navigate("/admin/questions")}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            Browse Questions
          </Button>
        </div>
      ) : (
        /* Questions List */
        <div className="space-y-4">
          {questions.map((question) => (
            <Card
              key={question.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle
                    className="text-lg font-semibold text-gray-900 hover:text-cyan-700 cursor-pointer flex-1"
                    onClick={() => navigate(`/admin/questions/${question.id}`)}
                  >
                    {question.title}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleBookmark(question.id)}
                    disabled={bookmarkLoading[question.id]}
                    className="ml-4 bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                  >
                    {bookmarkLoading[question.id] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <BookmarkCheck className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Tags */}
                {question.tags && question.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {question.tags.map((tagName) => (
                      <Badge
                        key={tagName}
                        variant="secondary"
                        className={cn(
                          "text-xs font-medium flex items-center gap-1",
                          tagName === "admin"
                            ? "bg-cyan-100 text-cyan-800 border border-cyan-200"
                            : tagName === "request"
                              ? "bg-orange-100 text-orange-800 border border-orange-200"
                              : "bg-gray-100 text-gray-800",
                        )}
                      >
                        <Tag className="h-3 w-3" />
                        {tagName}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardHeader>

              <CardContent>
                <p className="text-gray-700 mb-4">
                  {truncateText(question.description)}
                </p>

                {/* Stats and Meta */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{question.likes || 0} likes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{question.views || 0} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{question.commentsCount || 0} comments</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end text-xs">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">
                        By {question.author.firstName}{" "}
                        {question.author.lastName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(question.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
}
