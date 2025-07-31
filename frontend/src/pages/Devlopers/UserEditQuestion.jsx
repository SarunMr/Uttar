
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  Tag,
  Check,
  ChevronsUpDown,
  AlertCircle,
  Loader2,
  Save,
} from "lucide-react";

export default function UserEditQuestion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form state
  const [questionForm, setQuestionForm] = useState({
    title: "",
    content: "",
    description: "",
    images: [],
    tags: [],
  });

  // State to track actual File objects for upload
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [originalQuestion, setOriginalQuestion] = useState(null);

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Tags state
  const [availableTags, setAvailableTags] = useState([]);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const [tagSelectorOpen, setTagSelectorOpen] = useState(false);

  const API_BASE_URL = "http://localhost:5000";

  // Load question and tags on component mount
  useEffect(() => {
    loadQuestion();
    loadAvailableTags();
  }, [id]);

  const loadQuestion = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/questions/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        const question = response.data.data;
        setOriginalQuestion(question);
        setQuestionForm({
          title: question.title,
          content: question.content,
          description: question.description,
          images: question.images || [],
          tags: question.tags || [],
        });
      } else {
        navigate("/user/my-posts");
      }
    } catch (error) {
      console.error("Error loading question:", error);
      navigate("/user/my-posts");
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableTags = async () => {
    setTagsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/tags/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setAvailableTags(response.data.data);
      }
    } catch (error) {
      console.error("Error loading tags:", error);
      // Set fallback tags for users
      setAvailableTags([
        {
          id: 2,
          name: "request",
          description: "Special tag for user requests",
          isSpecial: true,
        },
        {
          id: 11,
          name: "unknown",
          description: "Tag for unclassified questions",
          isSpecial: true,
        },
        {
          id: 3,
          name: "react",
          description: "Questions related to React.js framework",
        },
        {
          id: 4,
          name: "nodejs",
          description: "Questions related to Node.js backend development",
        },
        {
          id: 5,
          name: "javascript",
          description: "General JavaScript programming questions",
        },
        {
          id: 6,
          name: "css",
          description: "Cascading Style Sheets questions",
        },
        {
          id: 7,
          name: "typescript",
          description: "TypeScript related questions",
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
          description: "MongoDB database questions",
        },
      ]);
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

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setSelectedFiles((prev) => [...prev, ...files]);

    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setQuestionForm((prev) => ({
      ...prev,
      images: [...prev.images, ...imageUrls],
    }));
  };

  // Remove image
  const removeImage = (index) => {
    const imageToRemove = questionForm.images[index];
    
    // If it's a blob URL (new upload), revoke it
    if (imageToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove);
      // Also remove from selectedFiles
      setSelectedFiles((prev) => prev.filter((_, i) => i === index));
    }

    setQuestionForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
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
    }
  };

  const removeTag = (tagName) => {
    setQuestionForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagName),
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!questionForm.title.trim()) errors.title = "Title is required";
    if (questionForm.title.length < 10)
      errors.title = "Title must be at least 10 characters";
    if (!questionForm.content.trim()) errors.content = "Content is required";
    if (questionForm.content.length < 20)
      errors.content = "Content must be at least 20 characters";  
    if (!questionForm.description.trim())
      errors.description = "Description is required";

    if (questionForm.tags.length === 0) {
      errors.tags = "At least one tag is required. Use 'unknown' if you're unsure.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit updated question
  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const formData = new FormData();

      formData.append("title", questionForm.title.trim());
      formData.append("description", questionForm.description.trim());
      formData.append("content", questionForm.content.trim());

      questionForm.tags.forEach((tag) => formData.append("tags", tag));

      // Append new image files
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      const response = await axios.put(
        `${API_BASE_URL}/api/questions/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        navigate("/user/my-posts", {
          state: { message: "Question updated successfully!" },
        });
      } else {
        setFormErrors({
          submit: response.data.message || "Failed to update question",
        });
      }
    } catch (error) {
      console.error("Error updating question:", error);
      setFormErrors({
        submit:
          error.response?.data?.message ||
          error.message ||
          "Server error while updating question",
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredTags = availableTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(tagSearch.toLowerCase()) &&
      !questionForm.tags.includes(tag.name),
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-600" />
          <p className="text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate("/user/my-posts")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Posts
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-cyan-800">Edit Question</h1>
          <p className="text-gray-600">Update your question details</p>
        </div>
      </div>

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
              <Label htmlFor="title" className="text-sm font-medium text-gray-800">
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
              <Label htmlFor="description" className="text-sm font-medium text-gray-800">
                Brief Description <span className="text-red-500">*</span>
              </Label>
              <Input
                id="description"
                placeholder="Summarize your question in one sentence"
                value={questionForm.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
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

            {/* Tags Section */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-800">
                Tags <span className="text-red-500">*</span>
              </Label>

              {/* Selected Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {questionForm.tags.map((tagName) => {
                  const tag = availableTags.find((t) => t.name === tagName);
                  const isSpecial = tag?.isSpecial || tagName === "request" || tagName === "unknown";
                  return (
                    <Badge
                      key={tagName}
                      variant="secondary"
                      className={cn(
                        "px-3 py-1 text-sm font-medium flex items-center gap-2",
                        tagName === "admin"
                          ? "bg-cyan-100 text-cyan-800 border border-cyan-200"
                          : tagName === "request"
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

              {/* Tag Selector */}
              {questionForm.tags.length < 5 && (
                <Popover open={tagSelectorOpen} onOpenChange={setTagSelectorOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={tagSelectorOpen}
                      className="w-full justify-between border-cyan-200 hover:border-cyan-300"
                      disabled={tagsLoading}
                    >
                      <span className="text-gray-500">
                        {tagsLoading ? "Loading tags..." : "Search and select tags..."}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search tags..."
                        value={tagSearch}
                        onValueChange={setTagSearch}
                      />
                      <CommandList>
                        <CommandEmpty>
                          <div className="text-center py-4">
                            <p className="text-sm text-gray-500 mb-2">
                              No tags found matching "{tagSearch}"
                            </p>
                            <p className="text-xs text-gray-400 mb-3">
                              Can't find the right tag? Use "unknown" for unclassified questions.
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
                          {filteredTags.map((tag) => (
                            <CommandItem
                              key={tag.id}
                              value={tag.name}
                              onSelect={() => addTag(tag.name)}
                              className="cursor-pointer"
                            >
                              <Check className="mr-2 h-4 w-4 opacity-0" />
                              <div className="flex items-center gap-2">
                                <Tag className="h-3 w-3" />
                                <span className="font-medium">{tag.name}</span>
                                {tag.isSpecial && (
                                  <Badge variant="outline" className="text-xs">
                                    SPECIAL
                                  </Badge>
                                )}
                              </div>
                              <div className="ml-auto text-xs text-gray-500 max-w-xs truncate">
                                {tag.description}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}

              {formErrors.tags && (
                <p className="text-red-600 text-xs flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors.tags}
                </p>
              )}

              <p className="text-xs text-gray-500">
                {questionForm.tags.length}/5 tags selected • Use "unknown" if you can't find a suitable category
              </p>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-medium text-gray-800">
                Question Details <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                rows={8}
                placeholder="Include all the information someone would need to answer your question"
                value={questionForm.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
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

            {/* Images */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-800">
                Images (Optional)
              </Label>
              <div className="border-2 border-dashed border-cyan-200 rounded-lg p-6 hover:border-cyan-300 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center gap-2 text-gray-600 hover:text-cyan-600"
                >
                  <Upload className="h-8 w-8" />
                  <span className="font-medium">Click to upload new images</span>
                  <span className="text-sm text-gray-500">
                    PNG, JPG, GIF, WebP up to 5MB each
                  </span>
                </label>
              </div>

              {/* Image Preview */}
              {questionForm.images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                  {questionForm.images.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <div className="w-full h-20 bg-gray-100 rounded border overflow-hidden">
                        <img
                          src={imageUrl.startsWith('blob:') ? imageUrl : `${API_BASE_URL}${imageUrl}`}
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
                onClick={() => navigate("/user/my-posts")}
                className="flex-1"
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-cyan-600 hover:bg-cyan-700 text-white flex-1"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
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
  );
}
