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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  Tag,
  AlertCircle,
  Check,
  ChevronsUpDown,
} from "lucide-react";

export default function AskQuestion() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form state
  const [questionForm, setQuestionForm] = useState({
    title: "",
    description: "",
    content: "",
    images: [],     // image URLs after upload
    tags: ["admin"], // `admin` tag always included
  });

  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Tags state & selection UI
  const [availableTags, setAvailableTags] = useState([]);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const [tagSelectorOpen, setTagSelectorOpen] = useState(false);

  // Load available tags from backend API on mount
  useEffect(() => {
    const loadTags = async () => {
      setTagsLoading(true);
      try {
        const res = await axios.get("/api/tags"); // Adjust URL if needed
        if (res.data.success) {
          setAvailableTags(res.data.data);
        } else {
          console.error("Failed to load tags", res.data.message);
        }
      } catch (err) {
        console.error("Error loading tags", err);
      } finally {
        setTagsLoading(false);
      }
    };
    loadTags();
  }, []);

  // Handle field changes
  const handleChange = (field, value) => {
    setQuestionForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle image file selection and upload images immediately
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploadError("");
    setUploadingImages(true);
    try {
      // Prepare FormData for multipart upload
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      // Upload to backend: expects response { data: [url, url, ...] }
      const res = await axios.post("/api/upload/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        // Append returned URLs to images array
        setQuestionForm((prev) => ({
          ...prev,
          images: [...prev.images, ...res.data.data],
        }));
      } else {
        setUploadError(res.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error", error);
      setUploadError("Failed to upload images");
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = null; // Reset file input
      }
    }
  };

  // Remove uploaded image URL from list
  const removeImage = (index) => {
    setQuestionForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Tags logic
  const filteredTags = availableTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(tagSearch.toLowerCase()) &&
      !questionForm.tags.includes(tag.name)
  );

  const addTag = (tagName) => {
    if (questionForm.tags.includes(tagName)) return;
    if (questionForm.tags.length >= 5) return; // Max 5 tags

    setQuestionForm((prev) => ({
      ...prev,
      tags: [...prev.tags, tagName],
    }));

    setTagSelectorOpen(false);
    setTagSearch("");
    if (formErrors.tags) {
      setFormErrors((prev) => ({ ...prev, tags: "" }));
    }
  };

  const removeTag = (tagName) => {
    if (tagName === "admin") return; // cannot remove admin tag
    setQuestionForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagName),
    }));
  };

  // Validate form before submit
  const validateForm = () => {
    const errors = {};
    if (!questionForm.title.trim()) {
      errors.title = "Title is required";
    } else if (questionForm.title.length < 10) {
      errors.title = "Title must be at least 10 characters";
    }

    if (!questionForm.description.trim()) {
      errors.description = "Description is required";
    }

    if (!questionForm.content.trim()) {
      errors.content = "Content is required";
    } else if (questionForm.content.length < 20) {
      errors.content = "Content must be at least 20 characters";
    }

    if (questionForm.tags.length === 0) {
      errors.tags = "At least one tag is required (admin tag is always included)";
    }

    // Check tags exist in availableTags
    const invalidTags = questionForm.tags.filter(
      (tag) => !availableTags.some((a) => a.name === tag)
    );
    if (invalidTags.length) {
      errors.tags = `Invalid tags: ${invalidTags.join(", ")}. Please select existing tags.`;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit question data to backend API
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        title: questionForm.title.trim(),
        description: questionForm.description.trim(),
        content: questionForm.content.trim(),
        images: questionForm.images,
        tagNames: questionForm.tags, // send tag names array
      };

      const res = await axios.post("/api/questions", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        // Navigate back with success message or to detail page
        navigate("/admin/questions", { state: { message: "Question posted successfully" } });
      } else {
        setFormErrors({ submit: res.data.message || "Failed to create question" });
      }
    } catch (error) {
      console.error("Submit question error", error);
      setFormErrors({ submit: "Server error while creating question" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/questions")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Questions
        </Button>
        <h1 className="text-3xl font-bold text-cyan-800">Ask a Question</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Question Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    value={questionForm.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Be specific and imagine you're asking a question"
                    className={cn(formErrors.title && "border-red-500")}
                  />
                  {formErrors.title && <p className="text-red-600 text-xs mt-1">{formErrors.title}</p>}
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                  <Input
                    id="description"
                    value={questionForm.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Briefly describe your question"
                    className={cn(formErrors.description && "border-red-500")}
                  />
                  {formErrors.description && <p className="text-red-600 text-xs mt-1">{formErrors.description}</p>}
                </div>

                {/* Tags */}
                <div>
                  <Label>Tags <span className="text-red-500">*</span></Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {questionForm.tags.map((tagName) => {
                      const isAdmin = tagName === "admin";
                      return (
                        <Badge
                          key={tagName}
                          className={cn(
                            "flex items-center gap-1 px-2 py-1 text-xs",
                            isAdmin ? "bg-cyan-100 text-cyan-800 border border-cyan-200" : "bg-gray-100 text-gray-800"
                          )}
                        >
                          <Tag className="w-3 h-3" />
                          {tagName}
                          {!isAdmin && (
                            <button
                              type="button"
                              onClick={() => removeTag(tagName)}
                              aria-label={`Remove tag ${tagName}`}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </Badge>
                      );
                    })}
                  </div>

                  {questionForm.tags.length < 5 && (
                    <Popover open={tagSelectorOpen} onOpenChange={setTagSelectorOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                          role="combobox"
                          aria-expanded={tagSelectorOpen}
                        >
                          {tagSearch || "Search and add tags"}
                          <ChevronsUpDown className="ml-2 w-4 h-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-full max-w-md">
                        <Command>
                          <CommandInput
                            placeholder="Search tags"
                            value={tagSearch}
                            onValueChange={(value) => {
                              setTagSearch(value);
                              if (value && !availableTags.some((t) => t.name.toLowerCase().includes(value.toLowerCase()))) {
                                setFormErrors({ ...formErrors, tags: `Tag "${value}" not found. Please check tags.` });
                              } else {
                                setFormErrors({ ...formErrors, tags: "" });
                              }
                            }}
                          />
                          <CommandList>
                            <CommandEmpty>No tags found.</CommandEmpty>
                            <CommandGroup>
                              {filteredTags.map((tag) => (
                                <CommandItem
                                  key={tag.id}
                                  onSelect={() => addTag(tag.name)}
                                  className="cursor-pointer"
                                >
                                  <Check className="mr-2 w-4 h-4 opacity-0" /> {/* for alignment */}
                                  <Tag className="w-4 h-4 mr-2" />
                                  <span>{tag.name}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                  {formErrors.tags && <p className="text-red-600 text-xs mt-1">{formErrors.tags}</p>}
                  <p className="text-gray-500 text-xs mt-1">
                    {questionForm.tags.length}/5 tags selected (Admin tag is always included)
                  </p>
                </div>

                {/* Content */}
                <div>
                  <Label htmlFor="content">Content <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="content"
                    value={questionForm.content}
                    onChange={(e) => handleChange("content", e.target.value)}
                    placeholder="Include code snippets, details, errors etc."
                    rows={8}
                    className={cn(formErrors.content && "border-red-500")}
                  />
                  {formErrors.content && <p className="text-red-600 text-xs mt-1">{formErrors.content}</p>}
                </div>

                {/* Image Upload */}
                <div>
                  <Label htmlFor="image-upload">Upload Images (Optional)</Label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <Button type="button" onClick={() => fileInputRef.current.click()} disabled={uploadingImages}>
                    <Upload className="w-4 h-4 mr-2" /> {uploadingImages ? "Uploading..." : "Select Images"}
                  </Button>
                  {uploadError && <p className="text-red-600 text-xs mt-1">{uploadError}</p>}

                  {/* Preview uploaded images */}
                  {questionForm.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 max-w-full overflow-x-auto">
                      {questionForm.images.map((imgUrl, idx) => (
                        <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden">
                          <img src={imgUrl} alt={`Upload preview ${idx + 1}`} className="object-cover w-full h-full" />
                          <button
                            type="button"
                            className="absolute top-0 right-0 bg-red-600 text-white rounded-bl px-1"
                            onClick={() => removeImage(idx)}
                            aria-label={`Remove image ${idx + 1}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-2 mt-6">
                  <Button type="button" variant="outline" onClick={() => navigate("/admin/questions")}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading || uploadingImages}>
                    {loading ? "Posting..." : "Post Question"}
                  </Button>
                </div>

                {formErrors.submit && <p className="text-red-600 mt-2">{formErrors.submit}</p>}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with Tips */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <p>The <strong>admin</strong> tag is always included for your posts.</p>
              <p>Select tags that are relevant to your question (up to 5 including admin).</p>
              <p>If you cannot find the tag you want, please check the <Button variant="link" onClick={() => navigate("/admin/tags")}>tags section</Button>.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Writing Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                <li>Be specific with your title and question details.</li>
                <li>Include code snippets and context where possible.</li>
                <li>Make sure to format your question clearly.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

