import { useState, useEffect } from "react";
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Edit comment states
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  // Current user (mock - replace with your auth context)
  const currentUser = {
    id: 999,
    username: "admin",
    firstName: "Admin",
    lastName: "User",
  };

  useEffect(() => {
    loadQuestionDetail();
  }, [id]);

  const loadQuestionDetail = async () => {
    setLoading(true);
    // Mock data - replace with API call
    setTimeout(() => {
      setQuestion({
        id: parseInt(id),
        title: "How to optimize React performance with large datasets?",
        content: `I'm working with a React application that needs to display thousands of items in a list. The performance is getting really slow when users scroll through the data.

I've tried using React.memo and useMemo, but I'm still experiencing lag. Here's what I'm currently doing:

\`\`\`javascript
const ItemList = ({ items }) => {
  return (
    <div>
      {items.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};
\`\`\`

What are the best practices for handling such large datasets? Should I implement virtualization? Are there any other techniques I should consider?`,
        description: "Looking for best practices to handle large datasets in React applications.",
        author: {
          id: 1,
          username: "johndoe",
          firstName: "John",
          lastName: "Doe",
        },
        images: [
          "/api/images/react-performance.png",
          "/api/images/performance-chart.png",
        ],
        tags: ["admin", "react", "javascript", "performance"],
        likes: 15,
        views: 234,
        comments: 8,
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
      });

      setComments([
        {
          id: 1,
          content: "You should definitely look into React Window or React Virtualized for handling large lists. They only render visible items.",
          author: {
            id: 2,
            username: "reactexpert",
            firstName: "Sarah",
            lastName: "Johnson",
          },
          createdAt: "2024-01-15T11:15:00Z",
          updatedAt: null,
          likes: 5,
        },
        {
          id: 2,
          content: "Another approach is to implement pagination or infinite scrolling to avoid loading all data at once.",
          author: {
            id: 3,
            username: "performancedev",
            firstName: "Mike",
            lastName: "Chen",
          },
          createdAt: "2024-01-15T12:45:00Z",
          updatedAt: "2024-01-15T13:30:00Z",
          likes: 3,
        },
      ]);

      // Check if question is bookmarked (mock - replace with API call)
      setIsBookmarked(false); // This would come from your API/localStorage
      setLoading(false);
    }, 1000);
  };

  const handleBookmark = async () => {
    try {
      // API call to bookmark/unbookmark question
      const newBookmarkStatus = !isBookmarked;
      
      // Mock API call - replace with actual API
      console.log(newBookmarkStatus ? 'Bookmarking question...' : 'Removing bookmark...');
      
      setIsBookmarked(newBookmarkStatus);
      
      // You could also show a toast notification here
      const message = newBookmarkStatus ? 'Question bookmarked!' : 'Bookmark removed';
      console.log(message);
      
    } catch (error) {
      console.error('Error updating bookmark:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      content: newComment,
      author: currentUser,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      likes: 0,
    };

    setComments((prev) => [...prev, comment]);
    setNewComment("");
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentContent(comment.content);
  };

  const handleSaveEdit = () => {
    if (!editCommentContent.trim()) return;

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === editingCommentId
          ? {
              ...comment,
              content: editCommentContent,
              updatedAt: new Date().toISOString(),
            }
          : comment
      )
    );

    setEditingCommentId(null);
    setEditCommentContent("");
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditCommentContent("");
  };

  const handleDeleteComment = (comment) => {
    setCommentToDelete(comment);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setComments((prev) => prev.filter((comment) => comment.id !== commentToDelete.id));
    setDeleteDialogOpen(false);
    setCommentToDelete(null);
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
    return comment.author.id === currentUser.id;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading question...</p>
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
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/questions")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Questions
        </Button>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Bookmark Button */}
          <Button
            variant="outline"
            onClick={handleBookmark}
            className={cn(
              "flex items-center gap-2",
              isBookmarked 
                ? "bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100" 
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            )}
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </Button>

          {/* Ask Question Button */}
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
                      : "bg-gray-100 text-gray-800"
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

          {/* Stats */}
          <div className="flex items-center gap-6 mt-3">
            <div className="flex items-center gap-1 text-gray-600">
              <Heart className="h-5 w-5" />
              <span>{question.likes} likes</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Eye className="h-5 w-5" />
              <span>{question.views} views</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <MessageSquare className="h-5 w-5" />
              <span>{question.comments} comments</span>
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
          {question.images.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">Attachments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {question.images.map((image, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 bg-gray-50 flex items-center justify-center h-32"
                  >
                    <div className="text-center text-gray-500">
                      <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-xs">Image {index + 1}</p>
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
            Comments ({comments.length})
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
            />
            <Button
              type="submit"
              disabled={!newComment.trim()}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Post Comment
            </Button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => (
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
                          {comment.updatedAt && (
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
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEditComment(comment)}
                                className="flex items-center gap-2"
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteComment(comment)}
                                className="flex items-center gap-2 text-red-600"
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
                            onChange={(e) => setEditCommentContent(e.target.value)}
                            rows={3}
                            className="border-cyan-200 focus:border-cyan-400"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={handleSaveEdit}
                              className="bg-cyan-600 hover:bg-cyan-700"
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
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
                        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-cyan-600">
                          <Heart className="h-4 w-4" />
                          <span>{comment.likes}</span>
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
            Are you sure you want to delete this comment? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
