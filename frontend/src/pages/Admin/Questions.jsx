// src/pages/admin/Questions.jsx
import { useState, useEffect } from "react";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminQuestions() {
  const navigate = useNavigate();

  // Questions state
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 8;

  // Mock data - replace with API calls
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    // Mock data - replace with actual API call
    setTimeout(() => {
      setQuestions([
        {
          id: 1,
          title: "How to optimize React performance with large datasets?",
          content: "I'm working with a React application that needs to display thousands of items...",
          description: "Looking for best practices to handle large datasets in React applications.",
          author: {
            id: 1,
            username: "johndoe",
            firstName: "John",
            lastName: "Doe",
          },
          images: ["/api/images/react-performance.png"],
          tags: ["admin", "react", "javascript"], // Added tags
          likes: 15,
          views: 234,
          comments: 8,
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-15T10:30:00Z",
        },
        {
          id: 2,
          title: "Node.js memory leak debugging techniques",
          content: "I've been experiencing memory leaks in my Node.js application...",
          description: "Need help identifying and fixing memory leaks in a production Node.js app.",
          author: {
            id: 2,
            username: "janedeveloper",
            firstName: "Jane",
            lastName: "Developer",
          },
          images: [],
          tags: ["nodejs", "javascript"], // Added tags
          likes: 23,
          views: 456,
          comments: 12,
          createdAt: "2024-01-14T15:20:00Z",
          updatedAt: "2024-01-14T15:20:00Z",
        },
        {
          id: 3,
          title: "CSS Grid vs Flexbox for complex layouts",
          content: "I'm trying to decide between CSS Grid and Flexbox for a complex dashboard layout...",
          description: "Comparison needed between CSS Grid and Flexbox for dashboard layouts.",
          author: {
            id: 3,
            username: "cssmaster",
            firstName: "Alex",
            lastName: "Smith",
          },
          images: ["/api/images/css-layout1.png", "/api/images/css-layout2.png"],
          tags: ["css"], // Added tags
          likes: 8,
          views: 167,
          comments: 0,
          createdAt: "2024-01-13T09:15:00Z",
          updatedAt: "2024-01-13T09:15:00Z",
        },
        {
          id: 4,
          title: "Docker deployment best practices",
          content: "What are the current best practices for deploying Docker containers in production?",
          description: "Seeking advice on production Docker deployment strategies.",
          author: {
            id: 4,
            username: "devopsexpert",
            firstName: "Mike",
            lastName: "Johnson",
          },
          images: [],
          tags: ["docker"], // Added tags
          likes: 31,
          views: 789,
          comments: 0,
          createdAt: "2024-01-12T14:45:00Z",
          updatedAt: "2024-01-12T14:45:00Z",
        },
        {
          id: 5,
          title: "TypeScript generic constraints best practices",
          content: "I'm struggling with TypeScript generic constraints...",
          description: "Need help with advanced TypeScript generic patterns.",
          author: {
            id: 5,
            username: "tsdev",
            firstName: "Sarah",
            lastName: "Wilson",
          },
          images: [],
          tags: ["typescript", "javascript"], // Added tags
          likes: 12,
          views: 98,
          comments: 3,
          createdAt: "2024-01-11T08:30:00Z",
          updatedAt: "2024-01-11T08:30:00Z",
        },
        {
          id: 6,
          title: "GraphQL vs REST API comparison",
          content: "When should I choose GraphQL over REST API?",
          description: "Comparing GraphQL and REST for modern web applications.",
          author: {
            id: 6,
            username: "apidev",
            firstName: "Tom",
            lastName: "Brown",
          },
          images: [],
          tags: ["admin", "react", "nodejs"], // Added tags with admin tag
          likes: 18,
          views: 321,
          comments: 5,
          createdAt: "2024-01-10T16:22:00Z",
          updatedAt: "2024-01-10T16:22:00Z",
        },
        {
          id: 7,
          title: "MongoDB aggregation pipeline optimization",
          content: "My MongoDB queries are running slow...",
          description: "Optimizing complex aggregation pipelines in MongoDB.",
          author: {
            id: 7,
            username: "dbadmin",
            firstName: "Lisa",
            lastName: "Davis",
          },
          images: [],
          tags: ["mongodb"], // Added tags
          likes: 9,
          views: 156,
          comments: 2,
          createdAt: "2024-01-09T11:45:00Z",
          updatedAt: "2024-01-09T11:45:00Z",
        },
        {
          id: 8,
          title: "Webpack 5 module federation setup",
          content: "Having trouble setting up module federation...",
          description: "Module federation configuration for micro-frontends.",
          author: {
            id: 8,
            username: "frontend",
            firstName: "Chris",
            lastName: "Taylor",
          },
          images: [],
          tags: ["javascript", "react"], // Added tags
          likes: 14,
          views: 203,
          comments: 7,
          createdAt: "2024-01-08T13:18:00Z",
          updatedAt: "2024-01-08T13:18:00Z",
        },
        {
          id: 9,
          title: "AWS Lambda cold start optimization",
          content: "How to reduce Lambda cold start times?",
          description: "Strategies for minimizing AWS Lambda cold starts.",
          author: {
            id: 9,
            username: "clouddev",
            firstName: "Emma",
            lastName: "Garcia",
          },
          images: [],
          tags: ["nodejs", "javascript"], // Added tags
          likes: 22,
          views: 445,
          comments: 11,
          createdAt: "2024-01-07T09:33:00Z",
          updatedAt: "2024-01-07T09:33:00Z",
        },
        {
          id: 10,
          title: "React Native performance optimization",
          content: "My React Native app is laggy on Android...",
          description: "Improving React Native app performance on Android devices.",
          author: {
            id: 10,
            username: "mobiledev",
            firstName: "David",
            lastName: "Martinez",
          },
          images: [],
          tags: ["admin", "react", "javascript"], // Added tags with admin tag
          likes: 16,
          views: 289,
          comments: 4,
          createdAt: "2024-01-06T14:27:00Z",
          updatedAt: "2024-01-06T14:27:00Z",
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  // Filter questions based on search and filter type
  useEffect(() => {
    let filtered = questions.filter((q) =>
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) // Added tag search
    );

    switch (filterType) {
      case "newest":
        filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "unanswered":
        filtered = filtered.filter((q) => q.comments === 0);
        break;
      case "all":
      default:
        break;
    }

    setFilteredQuestions(filtered);
    setCurrentPage(1);
  }, [questions, searchTerm, filterType]);

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center space-x-2 mt-8">
        {[...Array(totalPages)].map((_, idx) => {
          const pageNum = idx + 1;
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-md border font-medium",
                isActive
                  ? "bg-cyan-600 text-white border-cyan-600"
                  : "border-cyan-300 text-cyan-700 hover:bg-cyan-100"
              )}
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-cyan-800 mb-2">All Questions</h1>
          <p className="text-gray-600">
            Browse and manage questions from the community.
          </p>
        </div>
        
        {/* Ask Question Button - Navigate to separate page */}
        <Button 
          onClick={() => navigate("/admin/questions/ask")}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ask Question
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
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

        {/* Filter */}
        <div className="w-48">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="border-cyan-200">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Questions</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="unanswered">Unanswered</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-600">Loading questions...</p>
          </div>
        ) : paginatedQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <MessageSquare className="h-12 w-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No questions found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {paginatedQuestions.map((question) => (
              <Card
                key={question.id}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-cyan-100 hover:border-cyan-300"
                onClick={() => navigate(`/admin/questions/${question.id}`)}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {question.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {question.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Tags Section */}
                  {question.tags && question.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {question.tags.slice(0, 4).map((tagName) => (
                        <Badge
                          key={tagName}
                          variant="secondary"
                          className={cn(
                            "text-xs font-medium flex items-center gap-1",
                            tagName === "admin" 
                              ? "bg-cyan-100 text-cyan-800 border border-cyan-200" 
                              : tagName === "request"
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : "bg-gray-100 text-gray-800"
                          )}
                        >
                          <Tag className="h-2.5 w-2.5" />
                          {tagName}
                        </Badge>
                      ))}
                      {question.tags.length > 4 && (
                        <Badge variant="outline" className="text-xs text-gray-500">
                          +{question.tags.length - 4} more
                        </Badge>
                      )}
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
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
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
        {renderPagination()}
      </div>
    </div>
  );
}
