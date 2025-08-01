import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Tag,
  Check,
  Search,
  ChevronsUpDown,
  Eye,
  Plus,
  Loader2,
} from "lucide-react";

export default function UserAskQuestion() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form state - NO admin tag for users
  const [questionForm, setQuestionForm] = useState({
    title: "",
    content: "",
    description: "",
    images: [], // For preview URLs only
    tags: [], // Empty array - users must select their own tags
  });

  // State to track actual File objects for upload
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Tags state
  const [availableTags, setAvailableTags] = useState([]);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const [tagSelectorOpen, setTagSelectorOpen] = useState(false);

  // Enhanced tag selection features
  const [tagBrowserOpen, setTagBrowserOpen] = useState(false);
  const [previewTag, setPreviewTag] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [tagBrowserSearch, setTagBrowserSearch] = useState("");
  const [tagBrowserPage, setTagBrowserPage] = useState(1);
  const tagsPerPage = 6;

  const API_BASE_URL = "http://localhost:5000";

  // Load available tags with proper error handling
  useEffect(() => {
    loadAvailableTags();
  }, []);

  // Helper function to set fallback tags
  const setFallbackTags = () => {
    console.log("Using fallback tags for users");
    setAvailableTags([
      {
        id: 2,
        name: "request",
        description: "Special tag for user requests and feature suggestions",
        isSpecial: true,
      },
      {
        id: 11,
        name: "unknown",
        description:
          "Tag for unclassified questions when you can't find a suitable category",
        isSpecial: true,
      },
      {
        id: 3,
        name: "react",
        description: "Questions related to React.js framework and ecosystem",
      },
      {
        id: 4,
        name: "nodejs",
        description: "Questions related to Node.js backend development",
      },
      {
        id: 5,
        name: "javascript",
        description: "General JavaScript programming questions and concepts",
      },
      {
        id: 6,
        name: "css",
        description: "Cascading Style Sheets questions and styling issues",
      },
      {
        id: 7,
        name: "typescript",
        description: "TypeScript related questions and type definitions",
      },
      {
        id: 8,
        name: "python",
        description: "Python programming language questions",
      },
      {
        id: 9,
        name: "docker",
        description: "Containerization and Docker questions",
      },
      {
        id: 10,
        name: "mongodb",
        description: "MongoDB database questions and queries",
      },
      {
        id: 12,
        name: "html",
        description: "HTML markup and structure questions",
      },
      {
        id: 13,
        name: "vue",
        description: "Vue.js framework questions",
      },
      {
        id: 14,
        name: "angular",
        description: "Angular framework questions",
      },
      {
        id: 15,
        name: "php",
        description: "PHP programming language questions",
      },
      {
        id: 16,
        name: "mysql",
        description: "MySQL database questions",
      },
      {
        id: 17,
        name: "postgresql",
        description: "PostgreSQL database questions",
      },
      {
        id: 18,
        name: "git",
        description: "Git version control questions",
      },
      {
        id: 19,
        name: "linux",
        description: "Linux operating system questions",
      },
      {
        id: 20,
        name: "api",
        description: "API development and integration questions",
      },
      {
        id: 21,
        name: "database",
        description: "General database questions",
      },
    ]);
  };

  // FIXED: Use the correct user tags endpoint
  const loadAvailableTags = async () => {
    setTagsLoading(true);
    try {
      console.log("Loading user tags from:", `${API_BASE_URL}/api/tags/user`);

      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No authentication token found, using fallback tags");
        setFallbackTags();
        return;
      }

      // Use the user-specific tags endpoint
      const response = await axios.get(`${API_BASE_URL}/api/tags/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("User tags API response:", response.data);

      if (response.data.success && Array.isArray(response.data.data)) {
        console.log("User tags loaded successfully:", response.data.data);
        setAvailableTags(response.data.data);
      } else {
        console.warn("Invalid tags response format, using fallback");
        setFallbackTags();
      }
    } catch (error) {
      console.error("Error loading user tags:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });

      // Use fallback tags on any error
      console.log("Using fallback tags due to API error");
      setFallbackTags();
    } finally {
      setTagsLoading(false);
    }
  };

  // Form handlers
  const handleInputChange = (field, value) => {
    setQuestionForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle image upload - track both files and preview URLs
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit

      if (!isValidType) {
        console.warn(`File ${file.name} is not a valid image type`);
        return false;
      }
      if (!isValidSize) {
        console.warn(`File ${file.name} exceeds 5MB size limit`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      setFormErrors((prev) => ({
        ...prev,
        images: "Please select valid image files under 5MB each",
      }));
      return;
    }

    // Clear any previous image errors
    if (formErrors.images) {
      setFormErrors((prev) => ({ ...prev, images: "" }));
    }

    // Add files to selectedFiles array for actual upload
    setSelectedFiles((prev) => [...prev, ...validFiles]);

    // Create preview URLs for UI display
    const imageUrls = validFiles.map((file) => URL.createObjectURL(file));
    setQuestionForm((prev) => ({
      ...prev,
      images: [...prev.images, ...imageUrls],
    }));
  };

  // Remove image - remove from both preview and file arrays
  const removeImage = (index) => {
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(questionForm.images[index]);

    // Remove from preview URLs
    setQuestionForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    // Remove from actual files array
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Tag handlers
  const addTag = (tagName) => {
    if (!questionForm.tags.includes(tagName) && questionForm.tags.length < 5) {
      setQuestionForm((prev) => ({
        ...prev,
        tags: [...prev.tags, tagName],
      }));
      setTagSelectorOpen(false);
      setTagSearch("");

      if (formErrors.tags) {
        setFormErrors((prev) => ({ ...prev, tags: "" }));
      }
    }
  };

  const removeTag = (tagName) => {
    setQuestionForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagName),
    }));
  };

  const handleTagInput = (value) => {
    setTagSearch(value);

    if (
      value &&
      !availableTags.some((tag) =>
        tag.name.toLowerCase().includes(value.toLowerCase()),
      )
    ) {
      setFormErrors((prev) => ({
        ...prev,
        tags: `Tag "${value}" not found. Use "unknown" tag if you can't find a suitable category.`,
      }));
    } else {
      setFormErrors((prev) => ({ ...prev, tags: "" }));
    }
  };

  // Enhanced tag browser functions
  const truncateDescription = (text, maxLength = 60) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const openTagPreview = (tag, e) => {
    e.stopPropagation();
    setPreviewTag(tag);
    setPreviewOpen(true);
  };

  const toggleTagFromPreview = (tag) => {
    if (questionForm.tags.includes(tag.name)) {
      removeTag(tag.name);
    } else {
      addTag(tag.name);
    }
    setPreviewOpen(false);
  };

  // Filter tags for browser
  const filteredBrowserTags = availableTags.filter((tag) =>
    tag.name.toLowerCase().includes(tagBrowserSearch.toLowerCase()),
  );

  // Pagination for tag browser
  const totalBrowserPages = Math.ceil(filteredBrowserTags.length / tagsPerPage);
  const paginatedBrowserTags = filteredBrowserTags.slice(
    (tagBrowserPage - 1) * tagsPerPage,
    tagBrowserPage * tagsPerPage,
  );

  // Reset page when search changes
  useEffect(() => {
    setTagBrowserPage(1);
  }, [tagBrowserSearch]);

  const validateForm = () => {
    const errors = {};

    // Title validation
    if (!questionForm.title.trim()) {
      errors.title = "Title is required";
    } else if (questionForm.title.length < 10) {
      errors.title = "Title must be at least 10 characters";
    } else if (questionForm.title.length > 150) {
      errors.title = "Title must be less than 150 characters";
    }

    // Content validation
    if (!questionForm.content.trim()) {
      errors.content = "Content is required";
    } else if (questionForm.content.length < 20) {
      errors.content = "Content must be at least 20 characters";
    }

    // Description validation
    if (!questionForm.description.trim()) {
      errors.description = "Description is required";
    } else if (questionForm.description.length > 200) {
      errors.description = "Description must be less than 200 characters";
    }

    // Tags validation
    if (questionForm.tags.length === 0) {
      errors.tags =
        "At least one tag is required. Use 'unknown' if you're unsure.";
    } else if (questionForm.tags.length > 5) {
      errors.tags = "Maximum 5 tags allowed";
    }

    // Check if all selected tags exist in available tags
    const invalidTags = questionForm.tags.filter(
      (tag) => !availableTags.some((availableTag) => availableTag.name === tag),
    );
    if (invalidTags.length > 0) {
      errors.tags = `Invalid tags: ${invalidTags.join(", ")}. Please select from available tags.`;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit question with FormData
  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Create FormData object for multipart/form-data
      const formData = new FormData();

      // Append text fields
      formData.append("title", questionForm.title.trim());
      formData.append("description", questionForm.description.trim());
      formData.append("content", questionForm.content.trim());

      // Append tags
      questionForm.tags.forEach((tag) => formData.append("tags", tag));

      // Append image files
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      console.log("Submitting user question with data:", {
        title: questionForm.title,
        description: questionForm.description,
        content: questionForm.content,
        tags: questionForm.tags,
        imageCount: selectedFiles.length,
      });

      // Send to backend
      const response = await axios.post(
        `${API_BASE_URL}/api/questions`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        console.log("Question created successfully:", response.data.data);

        // Clean up object URLs to prevent memory leaks
        questionForm.images.forEach((url) => URL.revokeObjectURL(url));

        navigate("/user/questions", {
          state: { message: "Question posted successfully!" },
        });
      } else {
        setFormErrors({
          submit: response.data.message || "Failed to create question",
        });
      }
    } catch (error) {
      console.error("Error creating question:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Server error while creating question";
      setFormErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Clean up object URLs on component unmount
  useEffect(() => {
    return () => {
      questionForm.images.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  const filteredTags = availableTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(tagSearch.toLowerCase()) &&
      !questionForm.tags.includes(tag.name),
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate("/user/questions")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Questions
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-cyan-800">Ask a Question</h1>
          <p className="text-gray-600">Get help from the community</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Question Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitQuestion} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-sm font-medium text-gray-800"
                  >
                    Question Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Be specific and imagine you're asking a question to another person"
                    value={questionForm.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className={cn(
                      "border-cyan-200 focus:border-cyan-400",
                      formErrors.title && "border-red-500",
                    )}
                    maxLength={150}
                  />
                  {formErrors.title && (
                    <p className="text-red-600 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.title}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    {questionForm.title.length}/150 characters (minimum 10)
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium text-gray-800"
                  >
                    Brief Description <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="description"
                    placeholder="Summarize your question in one sentence"
                    value={questionForm.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className={cn(
                      "border-cyan-200 focus:border-cyan-400",
                      formErrors.description && "border-red-500",
                    )}
                    maxLength={200}
                  />
                  {formErrors.description && (
                    <p className="text-red-600 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    {questionForm.description.length}/200 characters
                  </p>
                </div>

                {/* Tags Section with Browser */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-800">
                    Tags <span className="text-red-500">*</span>
                  </Label>

                  {/* Selected Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {questionForm.tags.map((tagName) => {
                      const tag = availableTags.find((t) => t.name === tagName);
                      const isSpecial =
                        tag?.isSpecial ||
                        tagName === "request" ||
                        tagName === "unknown";
                      return (
                        <Badge
                          key={tagName}
                          variant="secondary"
                          className={cn(
                            "px-3 py-1 text-sm font-medium flex items-center gap-2",
                            tagName === "request"
                              ? "bg-orange-100 text-orange-800 border border-orange-200"
                              : tagName === "unknown"
                                ? "bg-gray-100 text-gray-600 border border-gray-200"
                                : isSpecial
                                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                                  : "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
                          )}
                        >
                          <Tag className="h-3 w-3" />
                          {tagName}
                          {isSpecial && (
                            <span className="text-xs opacity-75">SPECIAL</span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeTag(tagName)}
                            className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      );
                    })}
                  </div>

                  {/* Tag Selection Options */}
                  <div className="flex gap-2 mb-3">
                    {/* Search Tags Dropdown */}
                    {questionForm.tags.length < 5 && (
                      <Popover
                        open={tagSelectorOpen}
                        onOpenChange={setTagSelectorOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={tagSelectorOpen}
                            className="flex-1 justify-between border-cyan-200 hover:border-cyan-300"
                            disabled={tagsLoading}
                          >
                            <span className="text-gray-500">
                              {tagsLoading
                                ? "Loading tags..."
                                : tagSearch || "Search and select tags..."}
                            </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search tags..."
                              value={tagSearch}
                              onValueChange={handleTagInput}
                            />
                            <CommandList>
                              <CommandEmpty>
                                <div className="text-center py-4">
                                  <p className="text-sm text-gray-500 mb-2">
                                    No tags found matching "{tagSearch}"
                                  </p>
                                  <p className="text-xs text-gray-400 mb-3">
                                    Can't find the right tag? Use "unknown" for
                                    unclassified questions.
                                  </p>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      addTag("unknown");
                                      setTagSelectorOpen(false);
                                    }}
                                    className="text-cyan-600"
                                  >
                                    Add "unknown" tag
                                  </Button>
                                </div>
                              </CommandEmpty>
                              <CommandGroup>
                                {filteredTags.slice(0, 10).map((tag) => (
                                  <CommandItem
                                    key={tag.id}
                                    value={tag.name}
                                    onSelect={() => addTag(tag.name)}
                                    className="cursor-pointer"
                                  >
                                    <Check className="mr-2 h-4 w-4 opacity-0" />
                                    <div className="flex items-center gap-2">
                                      <Tag className="h-3 w-3" />
                                      <span className="font-medium">
                                        {tag.name}
                                      </span>
                                      {tag.isSpecial && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          SPECIAL
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="ml-auto text-xs text-gray-500 max-w-xs truncate">
                                      {truncateDescription(tag.description, 40)}
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    )}

                    {/* Browse All Tags Button */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setTagBrowserOpen(true)}
                      className="border-cyan-200 hover:border-cyan-300 text-cyan-700"
                      disabled={tagsLoading}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Browse All
                    </Button>
                  </div>

                  {formErrors.tags && (
                    <p className="text-red-600 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.tags}
                    </p>
                  )}

                  <p className="text-xs text-gray-500">
                    {questionForm.tags.length}/5 tags selected • Use "unknown"
                    if you can't find a suitable category
                  </p>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label
                    htmlFor="content"
                    className="text-sm font-medium text-gray-800"
                  >
                    Question Details <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="content"
                    rows={8}
                    placeholder="Include all the information someone would need to answer your question. You can include code examples, what you've tried, and specific error messages."
                    value={questionForm.content}
                    onChange={(e) =>
                      handleInputChange("content", e.target.value)
                    }
                    className={cn(
                      "border-cyan-200 focus:border-cyan-400 resize-none",
                      formErrors.content && "border-red-500",
                    )}
                  />
                  {formErrors.content && (
                    <p className="text-red-600 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.content}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    {questionForm.content.length} characters (minimum 20)
                  </p>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-800">
                    Images (Optional)
                  </Label>
                  <div
                    className={cn(
                      "border-2 border-dashed border-cyan-200 rounded-lg p-6 hover:border-cyan-300 transition-colors",
                      uploadingImages && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={uploadingImages}
                    />
                    <label
                      htmlFor="image-upload"
                      className={cn(
                        "cursor-pointer flex flex-col items-center gap-2 transition-colors",
                        uploadingImages
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-600 hover:text-cyan-600",
                      )}
                    >
                      <Upload className="h-8 w-8" />
                      <span className="font-medium">
                        {uploadingImages
                          ? "Processing..."
                          : "Click to upload images"}
                      </span>
                      <span className="text-sm text-gray-500">
                        PNG, JPG, GIF, WebP up to 5MB each •{" "}
                        {selectedFiles.length} file(s) selected
                      </span>
                    </label>
                  </div>

                  {formErrors.images && (
                    <p className="text-red-600 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.images}
                    </p>
                  )}

                  {/* Image Preview */}
                  {questionForm.images.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                      {questionForm.images.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <div className="w-full h-20 bg-gray-100 rounded border overflow-hidden">
                            <img
                              src={imageUrl}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                            <div
                              className="w-full h-full flex items-center justify-center"
                              style={{ display: "none" }}
                            >
                              <ImageIcon className="h-8 w-8 text-gray-400" />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/questions")}
                    className="flex-1"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      loading ||
                      uploadingImages ||
                      !questionForm.title.trim() ||
                      !questionForm.content.trim() ||
                      !questionForm.description.trim() ||
                      questionForm.tags.length === 0
                    }
                    className="bg-cyan-600 hover:bg-cyan-700 text-white flex-1"
                  >
                    {loading ? "Posting..." : "Post Question"}
                  </Button>
                </div>

                {/* Error display */}
                {formErrors.submit && (
                  <p className="text-red-600 text-sm flex items-center gap-1 mt-4">
                    <AlertCircle className="h-4 w-4" />
                    {formErrors.submit}
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - User-focused tips */}
        <div className="space-y-6">
          {/* Tag Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Tag className="h-5 w-5 text-cyan-600" />
                About Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="bg-cyan-50 p-3 rounded border border-cyan-200">
                <p className="font-medium text-cyan-800 mb-1">Choose Wisely</p>
                <p className="text-cyan-700">
                  Select tags that best describe your question. Use "unknown" if
                  you can't find a suitable category.
                </p>
              </div>
              <div className="space-y-2 text-gray-700">
                <p>• Select up to 5 relevant tags</p>
                <p>• Use the "Browse All" button to see all available tags</p>
                <p>• "request" tag for feature requests</p>
                <p>• "unknown" for unclassified questions</p>
              </div>
            </CardContent>
          </Card>

          {/* Writing Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-cyan-600" />
                Writing Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Be specific</p>
                    <p className="text-gray-600">
                      Include relevant details and context
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Show your work</p>
                    <p className="text-gray-600">
                      Include code examples and what you've tried
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Search first</p>
                    <p className="text-gray-600">
                      Check if your question has been asked before
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Community Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• Search before asking to avoid duplicates</p>
                <p>• Use relevant tags to help others find your question</p>
                <p>• Be respectful and constructive</p>
                <p>• Accept helpful answers to build reputation</p>
                <p>• Use "request" tag for feature suggestions</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tag Browser Dialog */}
      <Dialog open={tagBrowserOpen} onOpenChange={setTagBrowserOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-indigo-600 -m-6 mb-4 p-6 rounded-t-lg">
            <DialogTitle className="text-white text-xl font-semibold">
              Browse All Tags
            </DialogTitle>
            <p className="text-cyan-100 text-sm mt-1">
              Select tags that best describe your question
            </p>
            <DialogClose asChild>
              <button
                aria-label="Close tag browser"
                className="absolute right-3 top-3 text-cyan-100 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </DialogClose>
          </div>

          <div className="space-y-4">
            {/* Search in browser */}
            <div className="relative">
              <Input
                placeholder="Search tags..."
                value={tagBrowserSearch}
                onChange={(e) => setTagBrowserSearch(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {/* Selected tags display */}
            {questionForm.tags.length > 0 && (
              <div className="bg-cyan-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-cyan-800 mb-2">
                  Selected tags ({questionForm.tags.length}/5):
                </p>
                <div className="flex flex-wrap gap-2">
                  {questionForm.tags.map((tagName) => (
                    <Badge key={tagName} className="bg-cyan-200 text-cyan-800">
                      {tagName}
                      <button
                        onClick={() => removeTag(tagName)}
                        className="ml-1 hover:bg-cyan-300 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Tags grid */}
            <div className="max-h-96 overflow-y-auto">
              {tagsLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin text-cyan-600" />
                  <span className="ml-2 text-gray-600">Loading tags...</span>
                </div>
              ) : paginatedBrowserTags.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No tags found matching "{tagBrowserSearch}"</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {paginatedBrowserTags.map((tag) => (
                    <Card
                      key={tag.id}
                      className={cn(
                        "p-3 cursor-pointer transition-all duration-200",
                        questionForm.tags.includes(tag.name)
                          ? "bg-cyan-50 border-cyan-300 ring-2 ring-cyan-200"
                          : "hover:bg-gray-50 hover:border-cyan-200",
                        tag.isSpecial &&
                          "bg-gradient-to-br from-cyan-50 to-indigo-50",
                      )}
                      onClick={() => {
                        if (questionForm.tags.includes(tag.name)) {
                          removeTag(tag.name);
                        } else if (questionForm.tags.length < 5) {
                          addTag(tag.name);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              className={cn(
                                "text-xs",
                                tag.name === "request"
                                  ? "bg-orange-100 text-orange-800"
                                  : tag.name === "unknown"
                                    ? "bg-gray-100 text-gray-800"
                                    : tag.isSpecial
                                      ? "bg-cyan-100 text-cyan-800"
                                      : "bg-gray-100 text-gray-800",
                              )}
                            >
                              {tag.name}
                            </Badge>
                            {tag.isSpecial && (
                              <span className="text-xs text-cyan-600 font-medium">
                                SPECIAL
                              </span>
                            )}
                            {questionForm.tags.includes(tag.name) && (
                              <CheckCircle className="h-4 w-4 text-cyan-600" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {truncateDescription(tag.description)}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => openTagPreview(tag, e)}
                          className="ml-2 p-1 h-auto"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalBrowserPages > 1 && (
              <div className="flex justify-center space-x-2">
                {[...Array(totalBrowserPages)].map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      className={cn(
                        "w-8 h-8 flex items-center justify-center rounded-md border font-medium text-sm",
                        pageNum === tagBrowserPage
                          ? "bg-cyan-600 text-white border-cyan-600"
                          : "border-cyan-300 text-cyan-700 hover:bg-cyan-100",
                      )}
                      onClick={() => setTagBrowserPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Tag Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-md border-cyan-200 shadow-xl">
          <div className="bg-gradient-to-r from-cyan-500 to-indigo-600 -m-6 mb-4 p-6 rounded-t-lg">
            <DialogTitle className="text-white text-xl font-semibold">
              Tag Preview
            </DialogTitle>
            <DialogClose asChild>
              <button
                aria-label="Close preview"
                className="absolute right-3 top-3 text-cyan-100 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </DialogClose>
          </div>

          {previewTag ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge
                  className={cn(
                    "text-sm font-medium",
                    previewTag.name === "request"
                      ? "bg-orange-100 text-orange-800 border border-orange-200"
                      : previewTag.name === "unknown"
                        ? "bg-gray-100 text-gray-600 border border-gray-200"
                        : previewTag.isSpecial
                          ? "bg-cyan-100 text-cyan-800 border border-cyan-200"
                          : "bg-gray-100 text-gray-800",
                  )}
                >
                  {previewTag.name}
                </Badge>
                {previewTag.isSpecial && (
                  <span className="text-xs text-cyan-600 font-medium">
                    SPECIAL TAG
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {previewTag.description}
                </p>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => toggleTagFromPreview(previewTag)}
                  className={cn(
                    "w-full",
                    questionForm.tags.includes(previewTag.name)
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : questionForm.tags.length >= 5
                        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                        : "bg-cyan-600 hover:bg-cyan-700 text-white",
                  )}
                  disabled={
                    !questionForm.tags.includes(previewTag.name) &&
                    questionForm.tags.length >= 5
                  }
                >
                  {questionForm.tags.includes(previewTag.name)
                    ? "Remove Tag"
                    : questionForm.tags.length >= 5
                      ? "Tag Limit Reached (5/5)"
                      : "Use This Tag"}
                </Button>
              </div>
            </div>
          ) : (
            <p>No tag to preview</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
