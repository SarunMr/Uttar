import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Search,
  Edit,
  Trash2,
  Eye,
  Heart,
  MessageSquare,
  Calendar,
  Tag,
  Plus,
  AlertCircle,
  Loader2,
  FileText,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import axios from "axios";

export default function UserMyPosts() {
  const navigate = useNavigate();

  // State management
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortOrder, setSortOrder] = useState("newest"); // newest, oldest, recently_updated

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const API_BASE_URL = "http://localhost:5000";

  // Load questions on component mount and when dependencies change
  useEffect(() => {
    loadMyQuestions();
  }, [currentPage, searchTerm, sortOrder]);

  const loadMyQuestions = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/questions/my/posts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            page: currentPage,
            limit: 10,
            search: searchTerm,
            sort: sortOrder,
          },
        },
      );

      if (response.data.success) {
        setQuestions(response.data.data.questions);
        setTotalPages(response.data.data.pagination.totalPages);
        setTotalItems(response.data.data.pagination.totalItems);
      } else {
        setError(response.data.message || "Failed to load your questions");
      }
    } catch (error) {
      console.error("Error loading my questions:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load your questions",
      );
    } finally {
      setLoading(false);
    }
  };

  // Memoized filtered and sorted questions for client-side optimization
  const filteredAndSortedQuestions = useMemo(() => {
    let filtered = [...questions];

    // Additional client-side filtering if needed
    if (searchTerm) {
      filtered = filtered.filter(
        (question) =>
          question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          question.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Client-side sorting as backup
    filtered.sort((a, b) => {
      switch (sortOrder) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "recently_updated":
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  }, [questions, searchTerm, sortOrder]);

  // Handle search with debouncing
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle sort change
  const handleSortChange = (value) => {
    setSortOrder(value);
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Handle edit question
  const handleEdit = (questionId) => {
    navigate(`/user/my-posts/edit/${questionId}`);
  };

  // Handle delete question
  const handleDelete = (question) => {
    setQuestionToDelete(question);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!questionToDelete) return;

    setDeleting(true);
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/questions/${questionToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        // Remove question from local state
        setQuestions((prev) =>
          prev.filter((q) => q.id !== questionToDelete.id),
        );
        setTotalItems((prev) => prev - 1);

        // Close dialog
        setDeleteDialogOpen(false);
        setQuestionToDelete(null);

        // Show success message (you can implement toast notifications)
        console.log("Question deleted successfully");
      } else {
        setError(response.data.message || "Failed to delete question");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete question",
      );
    } finally {
      setDeleting(false);
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

  // Enhanced pagination component with ellipsis
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page and ellipsis
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-1 mx-1 rounded-md border font-medium text-sm bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
        >
          1
        </button>,
      );

      if (startPage > 2) {
        pages.push(
          <button
            key="start-ellipsis"
            onClick={() => handlePageChange(Math.max(1, startPage - 5))}
            className="px-3 py-1 mx-1 rounded-md border font-medium text-sm bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            ...
          </button>,
        );
      }
    }

    // Main page numbers
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

    // Last page and ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <button
            key="end-ellipsis"
            onClick={() => handlePageChange(Math.min(totalPages, endPage + 5))}
            className="px-3 py-1 mx-1 rounded-md border font-medium text-sm bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            ...
          </button>,
        );
      }

      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-1 mx-1 rounded-md border font-medium text-sm bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
        >
          {totalPages}
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
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center">{pages}</div>

        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          size="sm"
          className="flex items-center gap-1"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "recently_updated", label: "Recently Updated" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-cyan-800">My Posts</h1>
          <p className="text-gray-600 mt-1">
            Manage your questions ({totalItems} total)
          </p>
        </div>
        <Button
          onClick={() => navigate("/user/questions/ask")}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ask New Question
        </Button>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search your questions..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 border-cyan-200 focus:border-cyan-400"
          />
        </div>

        {/* Sort Filter */}
        <div className="flex items-center gap-2 min-w-fit">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={sortOrder} onValueChange={handleSortChange}>
            <SelectTrigger className="w-48 border-cyan-200 focus:border-cyan-400">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      {!loading && questions.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600 bg-cyan-50 px-4 py-2 rounded-lg border border-cyan-200">
          <span>
            Showing {(currentPage - 1) * 10 + 1} to{" "}
            {Math.min(currentPage * 10, totalItems)} of {totalItems} questions
          </span>
          <span>
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}

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
            <p className="text-gray-600">Loading your questions...</p>
          </div>
        </div>
      ) : filteredAndSortedQuestions.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16">
          <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No questions found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm
              ? "No questions match your search criteria"
              : "You haven't posted any questions yet"}
          </p>
          <Button
            onClick={() => navigate("/user/questions/ask")}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ask Your First Question
          </Button>
        </div>
      ) : (
        /* Questions List */
        <div className="space-y-4">
          {filteredAndSortedQuestions.map((question) => (
            <Card
              key={question.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle
                    className="text-lg font-semibold text-gray-900 hover:text-cyan-700 cursor-pointer"
                    onClick={() => navigate(`/user/questions/${question.id}`)}
                  >
                    {question.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(question.id)}
                      className="text-cyan-600 border-cyan-300 hover:bg-cyan-50"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(question)}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
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
                              : tagName === "unknown"
                                ? "bg-gray-100 text-gray-600 border border-gray-200"
                                : "bg-gray-100 text-gray-800 border border-gray-200",
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
                      <Calendar className="h-3 w-3" />
                      <span>Created: {formatDate(question.createdAt)}</span>
                    </div>
                    {question.updatedAt &&
                      question.updatedAt !== question.createdAt && (
                        <div className="flex items-center gap-1 text-gray-500 mt-1">
                          <span>Updated: {formatDate(question.updatedAt)}</span>
                        </div>
                      )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Enhanced Pagination */}
      {renderPagination()}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Question</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this question? This action cannot
              be undone.
            </p>
            {questionToDelete && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-gray-900">
                  {questionToDelete.title}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {truncateText(questionToDelete.description, 100)}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Question"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
