import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Search,
  Eye,
  X,
  Tag,
  HelpCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { fetchUserTags } from "@/api/tagsApi";

export default function UserTags() {
  // List of tags
  const [tags, setTags] = useState([]);

  // Search term & pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tagsPerPage = 9;

  // Preview modal state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTag, setPreviewTag] = useState(null);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Selected tags (for potential future use in question creation)
  const [selectedTags, setSelectedTags] = useState([]);

  // Filter tags by search term
  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredTags.length / tagsPerPage);
  const paginatedTags = filteredTags.slice(
    (currentPage - 1) * tagsPerPage,
    currentPage * tagsPerPage,
  );

  // Reset page if searchTerm changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Load tags from API on component mount
  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchUserTags();
      if (response.data.success) {
        setTags(response.data.data);
      } else {
        setError("Failed to load tags from server.");
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
      if (error.response?.status === 401) {
        setError("You need to be logged in to view tags.");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred while loading tags. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const truncateDescription = (text, maxLength = 80) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  // Handle tag selection (for future use in question creation)
  const toggleTagSelection = (tag) => {
    setSelectedTags((prev) =>
      prev.some((t) => t.id === tag.id)
        ? prev.filter((t) => t.id !== tag.id)
        : [...prev, tag],
    );
  };

  // Pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="mt-6 flex justify-center space-x-2 select-none">
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
                  : "border-cyan-300 text-cyan-700 hover:bg-cyan-100",
              )}
              onClick={() => setCurrentPage(pageNum)}
              aria-current={isActive ? "page" : undefined}
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
        <div className="flex-1 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <Tag className="h-8 w-8 text-cyan-600" />
            <h1 className="text-3xl font-bold text-cyan-800">Tags</h1>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">
            A tag is a keyword or label that categorizes your question with
            other, similar questions. Using the right tags makes it easier for
            others to find and answer your question.
          </p>
        </div>

        {/* How to use tags section */}
        <div className="w-80 ml-8 p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
          <h2 className="font-semibold text-lg text-cyan-800 mb-4 flex items-center">
            <HelpCircle className="h-5 w-5 mr-2 text-cyan-600" />
            How to use tags
          </h2>

          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-800">
                  Choose relevant tags
                </p>
                <p className="text-gray-600">
                  Select tags that accurately describe your question's topic
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-800">Use specific tags</p>
                <p className="text-gray-600">
                  Prefer specific tags over broad ones when possible
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-800">Maximum 5 tags</p>
                <p className="text-gray-600">
                  Use up to 5 tags per question for best results
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
            <p>
              <strong>Tip:</strong> Click the preview button to see detailed tag
              descriptions before using them.
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
          <Button
            size="sm"
            variant="outline"
            onClick={loadTags}
            className="mt-2 text-red-600 border-red-300 hover:bg-red-50"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Search Section */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Label
            htmlFor="searchTags"
            className="mb-2 text-cyan-800 font-medium"
          >
            Search Tags
          </Label>
          <div className="relative">
            <Input
              id="searchTags"
              type="text"
              placeholder="Search for tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
              disabled={loading}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Selected tags counter */}
        {selectedTags.length > 0 && (
          <div className="flex items-end">
            <div className="bg-cyan-100 text-cyan-800 px-3 py-2 rounded-md text-sm font-medium">
              {selectedTags.length} tag{selectedTags.length !== 1 ? "s" : ""}{" "}
              selected
            </div>
          </div>
        )}
      </div>

      {/* Tags Grid */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto border rounded-lg p-4 bg-white shadow-sm">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-600 mb-2" />
              <p className="text-gray-600">Loading tags...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <X className="h-12 w-12 mb-4 text-red-300" />
              <p className="text-lg font-medium">Failed to load tags</p>
              <p className="text-sm">
                Please check your connection and try again
              </p>
            </div>
          ) : paginatedTags.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Search className="h-12 w-12 mb-4 text-gray-300" />
              <p className="text-lg font-medium">No tags found</p>
              <p className="text-sm">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "No tags available"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedTags.map((tag) => (
                <Card
                  key={tag.id}
                  className={cn(
                    "p-4 transition-all duration-200 hover:shadow-md cursor-pointer",
                    selectedTags.some((t) => t.id === tag.id)
                      ? "bg-cyan-50 border-cyan-300 ring-2 ring-cyan-200"
                      : "bg-white hover:bg-cyan-25 border-gray-200 hover:border-cyan-300",
                    tag.isSpecial &&
                      "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200",
                  )}
                  onClick={() => toggleTagSelection(tag)}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                            tag.isSpecial
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : selectedTags.some((t) => t.id === tag.id)
                                ? "bg-cyan-200 text-cyan-900"
                                : "bg-gray-100 text-gray-800",
                          )}
                        >
                          {tag.name}
                        </span>
                        {tag.isSpecial && (
                          <span className="text-xs text-blue-600 font-medium">
                            SPECIAL
                          </span>
                        )}
                      </div>
                    </div>

                    <p
                      className="text-gray-600 text-sm flex-1 mb-4 leading-relaxed"
                      title={tag.description}
                    >
                      {truncateDescription(tag.description)}
                    </p>

                    <div className="flex gap-2 justify-between items-center">
                      <div className="flex items-center gap-2">
                        {selectedTags.some((t) => t.id === tag.id) && (
                          <span className="text-xs text-cyan-600 font-medium flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Selected
                          </span>
                        )}
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card selection
                          setPreviewTag(tag);
                          setPreviewOpen(true);
                        }}
                        className="hover:bg-gray-50"
                        aria-label={`Preview tag ${tag.name}`}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          {/* Pagination */}
          {renderPagination()}
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-md border-cyan-200 shadow-xl">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 -m-6 mb-4 p-6 rounded-t-lg">
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
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800 border border-cyan-200">
                  {previewTag.name}
                </span>
                {previewTag.isSpecial && (
                  <span className="text-xs text-blue-600 font-medium">
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
                  onClick={() => {
                    toggleTagSelection(previewTag);
                    setPreviewOpen(false);
                  }}
                  className={cn(
                    "w-full",
                    selectedTags.some((t) => t.id === previewTag.id)
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-cyan-600 hover:bg-cyan-700 text-white",
                  )}
                >
                  {selectedTags.some((t) => t.id === previewTag.id)
                    ? "Remove Tag"
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
