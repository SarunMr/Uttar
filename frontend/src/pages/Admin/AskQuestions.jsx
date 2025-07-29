import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Tag,
  Plus,
  Check,
  ChevronsUpDown,
} from "lucide-react";

export default function AskQuestion() {
  const navigate = useNavigate();

  // Form state
  const [questionForm, setQuestionForm] = useState({
    title: "",
    content: "",
    description: "",
    images: [],
    tags: ["admin"], // Admin tag is always included for admin users
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Tags state
  const [availableTags, setAvailableTags] = useState([]);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const [tagSelectorOpen, setTagSelectorOpen] = useState(false);

  // Load available tags
  useEffect(() => {
    loadAvailableTags();
  }, []);

  const loadAvailableTags = async () => {
    setTagsLoading(true);
    try {
      // Mock data - replace with actual API call to fetch all tags including admin tag
      setTimeout(() => {
        setAvailableTags([
          { id: 1, name: "admin", description: "Special tag for admin panel only", isSpecial: true },
          { id: 2, name: "request", description: "Special tag for user requests", isSpecial: true },
          { id: 3, name: "react", description: "Questions related to React.js framework" },
          { id: 4, name: "nodejs", description: "Questions related to Node.js backend development" },
          { id: 5, name: "javascript", description: "General JavaScript programming questions" },
          { id: 6, name: "css", description: "Cascading Style Sheets questions" },
          { id: 7, name: "typescript", description: "TypeScript related questions" },
          { id: 8, name: "python", description: "Python programming language questions" },
          { id: 9, name: "docker", description: "Containerization and Docker questions" },
          { id: 10, name: "mongodb", description: "MongoDB database questions" },
        ]);
        setTagsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error loading tags:", error);
      setTagsLoading(false);
    }
  };

  // Form handlers
  const handleInputChange = (field, value) => {
    setQuestionForm(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setQuestionForm(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }));
  };

  const removeImage = (index) => {
    setQuestionForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Tag handlers
  const addTag = (tagName) => {
    if (!questionForm.tags.includes(tagName) && questionForm.tags.length < 5) {
      setQuestionForm(prev => ({
        ...prev,
        tags: [...prev.tags, tagName]
      }));
      setTagSelectorOpen(false);
      setTagSearch("");
      
      // Clear tag error if it exists
      if (formErrors.tags) {
        setFormErrors(prev => ({ ...prev, tags: "" }));
      }
    }
  };

  const removeTag = (tagName) => {
    // Prevent removing admin tag for admin users
    if (tagName === "admin") return;
    
    setQuestionForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagName)
    }));
  };

  const handleTagInput = (value) => {
    setTagSearch(value);
    
    // Check if user typed a tag that doesn't exist
    if (value && !availableTags.some(tag => tag.name.toLowerCase().includes(value.toLowerCase()))) {
      setFormErrors(prev => ({
        ...prev,
        tags: `Tag "${value}" not found. Check the tags section for available tags.`
      }));
    } else {
      setFormErrors(prev => ({ ...prev, tags: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!questionForm.title.trim()) errors.title = "Title is required";
    if (questionForm.title.length < 10) errors.title = "Title must be at least 10 characters";
    if (!questionForm.content.trim()) errors.content = "Content is required";
    if (questionForm.content.length < 20) errors.content = "Content must be at least 20 characters";
    if (!questionForm.description.trim()) errors.description = "Description is required";
    
    // Validate tags
    if (questionForm.tags.length === 0) {
      errors.tags = "At least one tag is required";
    } else if (questionForm.tags.length > 5) {
      errors.tags = "Maximum 5 tags allowed";
    }
    
    // Check if all selected tags exist in available tags
    const invalidTags = questionForm.tags.filter(tag => 
      !availableTags.some(availableTag => availableTag.name === tag)
    );
    if (invalidTags.length > 0) {
      errors.tags = `Invalid tags: ${invalidTags.join(", ")}. Check the tags section for available tags.`;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      console.log("Creating question:", questionForm);
      
      // Simulate API call
      setTimeout(() => {
        navigate("/admin/questions", { 
          state: { message: "Question posted successfully!" }
        });
      }, 1500);
      
    } catch (error) {
      console.error("Error creating question:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTags = availableTags.filter(tag =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase()) &&
    !questionForm.tags.includes(tag.name)
  );

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
        <div>
          <h1 className="text-3xl font-bold text-cyan-800">Ask a Question</h1>
          <p className="text-gray-600">Get help from the developer community</p>
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
                      formErrors.title && "border-red-500"
                    )}
                  />
                  {formErrors.title && (
                    <p className="text-red-600 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.title}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    {questionForm.title.length}/100 characters (minimum 10)
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
                      formErrors.description && "border-red-500"
                    )}
                  />
                  {formErrors.description && (
                    <p className="text-red-600 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.description}
                    </p>
                  )}
                </div>

                {/* Tags Section */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-800">
                    Tags <span className="text-red-500">*</span>
                  </Label>
                  
                  {/* Selected Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {questionForm.tags.map((tagName) => {
                      const tag = availableTags.find(t => t.name === tagName);
                      const isAdmin = tagName === "admin";
                      return (
                        <Badge
                          key={tagName}
                          variant="secondary"
                          className={cn(
                            "px-3 py-1 text-sm font-medium flex items-center gap-2",
                            isAdmin 
                              ? "bg-cyan-100 text-cyan-800 border border-cyan-200" 
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          )}
                        >
                          <Tag className="h-3 w-3" />
                          {tagName}
                          {isAdmin && (
                            <span className="text-xs text-cyan-600">REQUIRED</span>
                          )}
                          {!isAdmin && (
                            <button
                              type="button"
                              onClick={() => removeTag(tagName)}
                              className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
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
                        >
                          <span className="text-gray-500">
                            {tagSearch || "Search and select tags..."}
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
                                <p className="text-sm text-gray-500 mb-2">No tags found</p>
                                <Button
                                  variant="link"
                                  size="sm"
                                  onClick={() => {
                                    navigate("/admin/tags");
                                    setTagSelectorOpen(false);
                                  }}
                                  className="text-cyan-600"
                                >
                                  Check tags section for available tags →
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
                    {questionForm.tags.length}/5 tags selected • Admin tag is always included
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
                    placeholder="Include all the information someone would need to answer your question. You can include code examples, what you've tried, and specific error messages."
                    value={questionForm.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    className={cn(
                      "border-cyan-200 focus:border-cyan-400 resize-none",
                      formErrors.content && "border-red-500"
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
                  <div className="border-2 border-dashed border-cyan-200 rounded-lg p-6 hover:border-cyan-300 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center gap-2 text-gray-600 hover:text-cyan-600 transition-colors"
                    >
                      <Upload className="h-8 w-8" />
                      <span className="font-medium">Click to upload images</span>
                      <span className="text-sm text-gray-500">
                        PNG, JPG, GIF up to 5MB each
                      </span>
                    </label>
                  </div>

                  {/* Image Preview */}
                  {questionForm.images.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                      {questionForm.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="w-full h-20 bg-gray-100 rounded border flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-gray-400" />
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
                    onClick={() => navigate("/admin/questions")}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white flex-1"
                  >
                    {loading ? "Posting..." : "Post Question"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Tips */}
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
                <p className="font-medium text-cyan-800 mb-1">Admin Tag</p>
                <p className="text-cyan-700">
                  As an admin, the "admin" tag is automatically included in your questions.
                </p>
              </div>
              <div className="space-y-2 text-gray-700">
                <p>• Select up to 5 relevant tags</p>
                <p>• Use specific tags when possible</p>
                <p>• Tags help others find your question</p>
                <p>• Can't find a tag? Check the tags section</p>
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
                    <p className="text-gray-600">Include relevant details and context</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Show your work</p>
                    <p className="text-gray-600">Include code examples and what you've tried</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Format properly</p>
                    <p className="text-gray-600">Use clear formatting and code blocks</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• Search before asking to avoid duplicates</p>
                <p>• Use relevant tags to categorize your question</p>
                <p>• Be respectful and follow community guidelines</p>
                <p>• Accept the best answer to help others</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
