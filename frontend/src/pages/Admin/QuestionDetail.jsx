import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Heart,
  Eye,
  MessageSquare,
  Calendar,
  User,
  Send,
  Image as ImageIcon,
  Tag,
  Edit,
  Trash2,
  MoreHorizontal,
  Bookmark,
  BookmarkCheck,
  Plus,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const viewTrackedRef = useRef(false); // Track if view has been recorded

  // Question and comments state
  const [question, setQuestion] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Bookmark state
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Edit comment states
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  // Loading states
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState({});

  // API Base URL
  const API_BASE_URL = "http://localhost:5000";

  // Debug effect to log question state changes
  useEffect(() => {
    if (question) {
      console.log("=== QUESTION STATE UPDATED ===");
      console.log("Question isLiked in state:", question.isLiked);
      console.log("Question likes in state:", question.likes);
      console.log("=== END STATE UPDATE ===");
    }
  }, [question?.isLiked, question?.likes]);

  useEffect(() => {
    // Reset view tracking when question ID changes
    viewTrackedRef.current = false;
    loadQuestionDetail();
  }, [id]);

  // Separate effect to track view after question loads
  useEffect(() => {
    if (question && !viewTrackedRef.current) {
      trackView();
      viewTrackedRef.current = true;
    }
  }, [question, id]); // Added id dependency

  const loadQuestionDetail = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(`${API_BASE_URL}/api/questions/${id}`, {
        headers,
      });

      if (response.data.success) {
        const questionData = response.data.data;
        console.log("=== QUESTION DATA LOADED ===");
        console.log("Question ID:", questionData.id);
        console.log("Question isLiked:", questionData.isLiked);
        console.log("Question likes count:", questionData.likes);
        console.log(
          "Comments with like status:",
          questionData.questionComments?.map((c) => ({
            id: c.id,
            content: c.content.substring(0, 30) + "...",
            likes: c.likes,
            isLiked: c.isLiked,
          })),
        );
        console.log("=== END QUESTION DATA ===");

        setQuestion(questionData);
        setIsBookmarked(questionData.isBookmarked || false);
      } else {
        setError(response.data.message || "Failed to load question");
      }
    } catch (error) {
      console.error("Error loading question:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load question",
      );
    } finally {
      setLoading(false);
    }
  };

  // Track view count
  const trackView = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, skipping view tracking");
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/questions/${id}/view`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        // Update the view count in the question
        setQuestion((prev) =>
          prev
            ? {
                ...prev,
                views: response.data.views,
              }
            : prev,
        );
      }
    } catch (error) {
      console.error("Error tracking view:", error);
      // Don't show error to user for view tracking
    }
  };

  // Toggle question like with proper state management
  const handleToggleQuestionLike = async () => {
    if (likeLoading.question || !question) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    // Store current state for potential rollback
    const wasLiked = question.isLiked;
    const currentLikes = question.likes || 0;

    // Optimistic update
    setQuestion((prev) => ({
      ...prev,
      isLiked: !wasLiked,
      likes: wasLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1,
    }));

    setLikeLoading((prev) => ({ ...prev, question: true }));

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/questions/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        // Update with server response
        setQuestion((prev) => ({
          ...prev,
          isLiked: response.data.isLiked,
          likes: Math.max(0, response.data.likes || 0),
        }));
        console.log("Question like updated:", {
          isLiked: response.data.isLiked,
          likes: response.data.likes,
        });
      } else {
        console.error("Server returned error:", response.data.message);
        // Revert optimistic update on failure
        setQuestion((prev) => ({
          ...prev,
          isLiked: wasLiked,
          likes: currentLikes,
        }));
      }
    } catch (error) {
      console.error("Error toggling question like:", error);
      console.error("Error details:", error.response?.data);
      // Revert optimistic update on error
      setQuestion((prev) => ({
        ...prev,
        isLiked: wasLiked,
        likes: currentLikes,
      }));
    } finally {
      setLikeLoading((prev) => ({ ...prev, question: false }));
    }
  };

  // Toggle bookmark
  const handleBookmark = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/questions/${id}/bookmark`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        setIsBookmarked(response.data.isBookmarked);
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("Error updating bookmark:", error);
    }
  };

  // Add comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || commentLoading) return;

    setCommentLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/comments/question/${id}`,
        { content: newComment.trim() },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        const newCommentData = response.data.data;

        // Update question with new comment
        setQuestion((prev) => ({
          ...prev,
          questionComments: [...(prev.questionComments || []), newCommentData],
          commentsCount: (prev.commentsCount || 0) + 1,
        }));

        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setCommentLoading(false);
    }
  };

  // Edit comment
  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentContent(comment.content);
  };

  const handleSaveEdit = async () => {
    if (!editCommentContent.trim() || commentLoading) return;

    setCommentLoading(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/comments/${editingCommentId}`,
        { content: editCommentContent.trim() },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        const updatedComment = response.data.data;

        setQuestion((prev) => ({
          ...prev,
          questionComments: prev.questionComments.map((comment) =>
            comment.id === editingCommentId ? updatedComment : comment,
          ),
        }));

        setEditingCommentId(null);
        setEditCommentContent("");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditCommentContent("");
  };

  // Delete comment
  const handleDeleteComment = (comment) => {
    setCommentToDelete(comment);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!commentToDelete || commentLoading) return;

    setCommentLoading(true);
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/comments/${commentToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        setQuestion((prev) => ({
          ...prev,
          questionComments: prev.questionComments.filter(
            (comment) => comment.id !== commentToDelete.id,
          ),
          commentsCount: Math.max(0, (prev.commentsCount || 0) - 1),
        }));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setCommentLoading(false);
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    }
  };

  // Toggle comment like with optimistic updates
  const handleToggleCommentLike = async (commentId) => {
    if (likeLoading[commentId] || !question) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    // Find the comment to get current state
    const comment = question.questionComments.find((c) => c.id === commentId);
    if (!comment) {
      console.error("Comment not found:", commentId);
      return;
    }

    const wasLiked = comment.isLiked;
    const currentLikes = comment.likes || 0;

    // Optimistic update
    setQuestion((prev) => ({
      ...prev,
      questionComments: prev.questionComments.map((c) =>
        c.id === commentId
          ? {
              ...c,
              isLiked: !wasLiked,
              likes: wasLiked
                ? Math.max(0, currentLikes - 1)
                : currentLikes + 1,
            }
          : c,
      ),
    }));

    setLikeLoading((prev) => ({ ...prev, [commentId]: true }));

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/comments/${commentId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        // Update with server response
        setQuestion((prev) => ({
          ...prev,
          questionComments: prev.questionComments.map((c) =>
            c.id === commentId
              ? {
                  ...c,
                  isLiked: response.data.isLiked,
                  likes: Math.max(0, response.data.likes || 0),
                }
              : c,
          ),
        }));
        console.log("Comment like updated:", {
          commentId,
          isLiked: response.data.isLiked,
          likes: response.data.likes,
        });
      } else {
        console.error("Server returned error:", response.data.message);
        // Revert optimistic update on failure
        setQuestion((prev) => ({
          ...prev,
          questionComments: prev.questionComments.map((c) =>
            c.id === commentId
              ? { ...c, isLiked: wasLiked, likes: currentLikes }
              : c,
          ),
        }));
      }
    } catch (error) {
      console.error("Error toggling comment like:", error);
      console.error("Error details:", error.response?.data);
      // Revert optimistic update on error
      setQuestion((prev) => ({
        ...prev,
        questionComments: prev.questionComments.map((c) =>
          c.id === commentId
            ? { ...c, isLiked: wasLiked, likes: currentLikes }
            : c,
        ),
      }));
    } finally {
      setLikeLoading((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canEditComment = (comment) => {
    // Get current user ID from token or context
    const currentUserId = JSON.parse(localStorage.getItem("user") || "{}")?.id;
    return comment.author.id === currentUserId;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-600"></div>
          <p className="text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => navigate("/admin/questions")} className="mt-4">
          Back to Questions
        </Button>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">Question not found</p>
        <Button onClick={() => navigate("/admin/questions")} className="mt-4">
          Back to Questions
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with Navigation and Actions */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate("/admin/questions")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Questions
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleBookmark}
            className={cn(
              "flex items-center gap-2",
              isBookmarked
                ? "bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                : "border-gray-300 text-gray-700 hover:bg-gray-50",
            )}
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </Button>

          <Button
            onClick={() => navigate("/admin/questions/ask")}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ask Question
          </Button>
        </div>
      </div>

      {/* Question Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {question.title}
          </CardTitle>

          {/* Tags Section */}
          {question.tags && question.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {question.tags.map((tagName) => (
                <Badge
                  key={tagName}
                  variant="secondary"
                  className={cn(
                    "text-sm font-medium flex items-center gap-1",
                    tagName === "admin"
                      ? "bg-cyan-100 text-cyan-800 border border-cyan-200"
                      : tagName === "request"
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : "bg-gray-100 text-gray-800",
                  )}
                >
                  <Tag className="h-3 w-3" />
                  {tagName}
                </Badge>
              ))}
            </div>
          )}

          {/* Author and Meta Info */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mt-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium">
                {question.author.firstName} {question.author.lastName}
              </span>
              <span className="text-gray-500">@{question.author.username}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(question.createdAt)}</span>
            </div>
          </div>

          {/* Stats with Like Button */}
          <div className="flex items-center gap-6 mt-3">
            <button
              onClick={handleToggleQuestionLike}
              disabled={likeLoading.question}
              className={cn(
                "flex items-center gap-1 transition-colors",
                question.isLiked
                  ? "text-red-600 hover:text-red-700"
                  : "text-gray-600 hover:text-red-600",
              )}
            >
              <Heart
                className={cn("h-5 w-5", question.isLiked && "fill-current")}
              />
              <span>{Math.max(0, question.likes || 0)} likes</span>
            </button>
            <div className="flex items-center gap-1 text-gray-600">
              <Eye className="h-5 w-5" />
              <span>{Math.max(0, question.views || 0)} views</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <MessageSquare className="h-5 w-5" />
              <span>{question.questionComments?.length || 0} comments</span>
            </div>
            {isBookmarked && (
              <div className="flex items-center gap-1 text-yellow-600">
                <BookmarkCheck className="h-4 w-4" />
                <span className="text-sm">Bookmarked</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Description */}
          <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
            <p className="text-gray-700 font-medium">{question.description}</p>
          </div>

          {/* Content */}
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {question.content}
            </div>
          </div>

          {/* Images */}
          {question.images && question.images.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">Attachments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {question.images.map((image, index) => (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden bg-gray-50"
                  >
                    <img
                      src={`${API_BASE_URL}${image}`}
                      alt={`Attachment ${index + 1}`}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div
                      className="w-full h-32 flex items-center justify-center text-gray-500"
                      style={{ display: "none" }}
                    >
                      <div className="text-center">
                        <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-xs">Image {index + 1}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments ({question.questionComments?.length || 0})
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="space-y-4">
            <Textarea
              placeholder="Write your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="border-cyan-200 focus:border-cyan-400"
              disabled={commentLoading}
            />
            <Button
              type="submit"
              disabled={!newComment.trim() || commentLoading}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              <Send className="h-4 w-4 mr-2" />
              {commentLoading ? "Posting..." : "Post Comment"}
            </Button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {!question.questionComments ||
            question.questionComments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              question.questionComments.map((comment) => (
                <div
                  key={comment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-cyan-100 text-cyan-700">
                        {comment.author.firstName[0]}
                        {comment.author.lastName[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-gray-900">
                            {comment.author.firstName} {comment.author.lastName}
                          </span>
                          <span className="text-gray-500">
                            @{comment.author.username}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                          {comment.updatedAt &&
                            comment.updatedAt !== comment.createdAt && (
                              <>
                                <span className="text-gray-400">•</span>
                                <span className="text-xs text-gray-500 italic">
                                  updated {formatDate(comment.updatedAt)}
                                </span>
                              </>
                            )}
                        </div>

                        {/* Comment Actions */}
                        {canEditComment(comment) && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEditComment(comment)}
                                className="flex items-center gap-2"
                                disabled={commentLoading}
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteComment(comment)}
                                className="flex items-center gap-2 text-red-600"
                                disabled={commentLoading}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>

                      {/* Comment Content */}
                      {editingCommentId === comment.id ? (
                        <div className="space-y-3">
                          <Textarea
                            value={editCommentContent}
                            onChange={(e) =>
                              setEditCommentContent(e.target.value)
                            }
                            rows={3}
                            className="border-cyan-200 focus:border-cyan-400"
                            disabled={commentLoading}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={handleSaveEdit}
                              className="bg-cyan-600 hover:bg-cyan-700"
                              disabled={
                                commentLoading || !editCommentContent.trim()
                              }
                            >
                              {commentLoading ? "Saving..." : "Save"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                              disabled={commentLoading}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-800 leading-relaxed">
                          {comment.content}
                        </p>
                      )}

                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleToggleCommentLike(comment.id)}
                          disabled={likeLoading[comment.id]}
                          className={cn(
                            "flex items-center gap-1 text-sm transition-colors",
                            comment.isLiked
                              ? "text-red-600 hover:text-red-700"
                              : "text-gray-500 hover:text-red-600",
                          )}
                        >
                          <Heart
                            className={cn(
                              "h-4 w-4",
                              comment.isLiked && "fill-current",
                            )}
                          />
                          <span>{Math.max(0, comment.likes || 0)}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to delete this comment? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={commentLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={commentLoading}
            >
              {commentLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
