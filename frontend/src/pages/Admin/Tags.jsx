import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Dialog Components
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Search, Plus, Edit, Trash, Eye, X, AlertTriangle } from "lucide-react";
import {
  fetchTags as apiFetchTags,
  createTag as apiCreateTag,
  updateTag as apiUpdateTag,
  deleteTag as apiDeleteTag,
} from "../../api/tagsApi.jsx";

export default function AdminTags() {
  // List of tags (load from backend later)
  const [tags, setTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tagsPerPage = 9;

  const [modalOpen, setModalOpen] = useState(false);
  const [editTag, setEditTag] = useState(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTag, setPreviewTag] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);

  const [tagName, setTagName] = useState("");
  const [tagDescription, setTagDescription] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Filter tags by search term
  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );

  const totalPages = Math.ceil(filteredTags.length / tagsPerPage);
  const paginatedTags = filteredTags.slice(
    (currentPage - 1) * tagsPerPage,
    currentPage * tagsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Fetch tags from API on mount
  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    setLoading(true);
    try {
      const response = await apiFetchTags();
      if (response.data.success) {
        setTags(response.data.data);
      } else {
        alert("Failed to fetch tags from server.");
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
      alert("An error occurred while fetching tags.");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!tagName.trim()) {
      errs.name = "Tag name is required";
    } else if (
      tags.some(
        (tag) =>
          tag.name.toLowerCase() === tagName.trim().toLowerCase() &&
          tag.id !== (editTag ? editTag.id : null),
      )
    ) {
      errs.name = "Tag with this name already exists";
    }
    if (!tagDescription.trim()) {
      errs.description = "Tag description is required";
    } else {
      const wordCount = tagDescription.trim().split(/\s+/).length;
      if (wordCount < 5) {
        errs.description = "Description must have at least 5 words";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (editTag) {
        // Update tag API
        const response = await apiUpdateTag(editTag.id, {
          name: tagName.trim(),
          description: tagDescription.trim(),
        });
        if (response.data.success) {
          setTags((prev) =>
            prev.map((tag) =>
              tag.id === editTag.id ? response.data.data : tag,
            ),
          );
          setModalOpen(false);
          setErrors({});
        } else {
          alert(response.data.message || "Failed to update tag");
        }
      } else {
        // Create new tag API
        const response = await apiCreateTag({
          name: tagName.trim(),
          description: tagDescription.trim(),
        });
        if (response.data.success) {
          setTags((prev) => [...prev, response.data.data]);
          setModalOpen(false);
          setErrors({});
        } else {
          alert(response.data.message || "Failed to create tag");
        }
      }
    } catch (error) {
      console.error("Error saving tag:", error);
      alert("An error occurred while saving tag.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (tag) => {
    if (tag.isSpecial) {
      alert("Cannot delete special tags.");
      return;
    }
    setTagToDelete(tag);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!tagToDelete) return;
    setLoading(true);
    try {
      const response = await apiDeleteTag(tagToDelete.id);
      if (response.data.success) {
        setTags((prev) => prev.filter((tag) => tag.id !== tagToDelete.id));
        setDeleteOpen(false);
        setTagToDelete(null);
      } else {
        alert(response.data.message || "Failed to delete tag");
      }
    } catch (error) {
      console.error("Error deleting tag:", error);
      alert("An error occurred while deleting the tag.");
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteOpen(false);
    setTagToDelete(null);
  };

  const truncateDescription = (text, maxLength = 80) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

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
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-cyan-800 mb-2">Manage Tags</h1>
          <p className="text-gray-600 max-w-2xl">
            Tags help categorize and organize questions and posts effectively.
            Good tags are descriptive, concise, and widely understood.
          </p>
        </div>

        <div className="w-80 ml-8 p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
          <h2 className="font-semibold text-lg text-cyan-800 mb-3 flex items-center">
            <div className="w-2 h-2 rounded-full bg-cyan-500 mr-2"></div>
            Tag Guidelines
          </h2>
          <p className="text-gray-700 text-sm mb-3">A good tag should be:</p>
          <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
            <li>Clear and descriptive</li>
            <li>Not too broad or vague</li>
            <li>Widely understood</li>
            <li>Relevant to content</li>
          </ul>
          <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
            <strong>Note:</strong>{" "}
            <code className="bg-amber-100 px-1 rounded">admin</code> and{" "}
            <code className="bg-amber-100 px-1 rounded">request</code> tags are
            protected.
          </div>
        </div>
      </div>

      {/* Search and Add */}
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
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
              disabled={loading}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="flex items-end">
          <Button
            disabled={loading}
            onClick={() => {
              setEditTag(null);
              setTagName("");
              setTagDescription("");
              setErrors({});
              setModalOpen(true);
            }}
            className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Tag
          </Button>
        </div>
      </div>

      {/* Tags Grid */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto border rounded-lg p-4 bg-white shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-600">Loading tags...</p>
            </div>
          ) : paginatedTags.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Search className="h-12 w-12 mb-4 text-gray-300" />
              <p className="text-lg font-medium">No tags found</p>
              <p className="text-sm">
                Try adjusting your search or add a new tag
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedTags.map((tag) => (
                <Card
                  key={tag.id}
                  className={cn(
                    "p-4 transition-all duration-200 hover:shadow-md",
                    tag.isSpecial
                      ? "bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200"
                      : "bg-white hover:bg-cyan-25 border-gray-200 hover:border-cyan-300",
                  )}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                            tag.isSpecial
                              ? "bg-cyan-100 text-cyan-800 border border-cyan-200"
                              : "bg-gray-100 text-gray-800",
                          )}
                        >
                          {tag.name}
                        </span>
                        {tag.isSpecial && (
                          <span className="text-xs text-cyan-600 font-medium">
                            PROTECTED
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

                    <div className="flex gap-2 justify-end">
                      {!tag.isSpecial && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditTag(tag);
                              setTagName(tag.name);
                              setTagDescription(tag.description);
                              setErrors({});
                              setModalOpen(true);
                            }}
                            className="hover:bg-cyan-50 hover:border-cyan-300"
                            aria-label={`Edit tag ${tag.name}`}
                            disabled={loading}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteClick(tag)}
                            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                            aria-label={`Delete tag ${tag.name}`}
                            disabled={loading}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setPreviewTag(tag);
                          setPreviewOpen(true);
                        }}
                        className="hover:bg-gray-50"
                        aria-label={`Preview tag ${tag.name}`}
                        disabled={loading}
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

      {/* Add/Edit Tag Dialog */}
      <Dialog
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setErrors({});
        }}
      >
        <DialogContent className="sm:max-w-md border-cyan-200 shadow-xl">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 -m-6 mb-4 p-6 rounded-t-lg">
            <DialogTitle className="text-white text-xl font-semibold">
              {editTag ? "Edit Tag" : "Create New Tag"}
            </DialogTitle>
            <DialogDescription className="text-cyan-100 mt-1">
              {editTag
                ? "Update the tag details below"
                : "Fill in the details for the new tag"}
            </DialogDescription>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label
                htmlFor="tagName"
                className="text-cyan-800 font-medium mb-2 block"
              >
                Tag Name
              </Label>
              <Input
                id="tagName"
                type="text"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="e.g., javascript, react, nodejs"
                disabled={editTag?.isSpecial}
                className={cn(
                  "border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400",
                  errors.name && "border-red-500 focus:ring-red-500",
                )}
                required
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby={errors.name ? "tag-name-error" : undefined}
              />
              {errors.name && (
                <p id="tag-name-error" className="text-red-600 text-xs mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="tagDescription"
                className="text-cyan-800 font-medium mb-2 block"
              >
                Description
              </Label>
              <Textarea
                id="tagDescription"
                rows={4}
                value={tagDescription}
                onChange={(e) => setTagDescription(e.target.value)}
                placeholder="Describe when this tag should be used and what topics it covers..."
                className={cn(
                  "border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400 resize-none",
                  errors.description && "border-red-500 focus:ring-red-500",
                )}
                required
                aria-invalid={errors.description ? "true" : "false"}
                aria-describedby={
                  errors.description ? "tag-description-error" : undefined
                }
              />
              {errors.description && (
                <p
                  id="tag-description-error"
                  className="text-red-600 text-xs mt-1"
                >
                  {errors.description}
                </p>
              )}
            </div>

            <DialogFooter className="gap-3 pt-4">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  type="button"
                  className="border-gray-300"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-6"
              >
                {editTag ? "Save Changes" : "Create Tag"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md border-red-200 shadow-xl">
          <div className="bg-gradient-to-r from-red-500 to-red-600 -m-6 mb-4 p-6 rounded-t-lg">
            <DialogTitle className="text-white text-xl font-semibold flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Delete Tag
            </DialogTitle>
            <DialogDescription className="text-red-100 mt-1">
              This action cannot be undone
            </DialogDescription>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to delete the tag{" "}
              <span className="font-semibold text-red-600">
                "{tagToDelete?.name}"
              </span>
              ?
            </p>
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-red-800 text-sm">
                <strong>Warning:</strong> This will permanently remove the tag
                and it cannot be recovered.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-3 pt-4">
            <Button
              variant="outline"
              onClick={cancelDelete}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-md border-cyan-200 shadow-xl">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 -m-6 mb-4 p-6 rounded-t-lg">
            <DialogTitle className="text-white text-xl font-semibold">
              Preview Tag
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
              <h2 className="text-2xl font-bold text-cyan-700 capitalize">
                {previewTag.name}
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {previewTag.description}
              </p>
              {previewTag.isSpecial && (
                <p className="text-sm text-cyan-600 font-semibold">
                  This is a protected special tag.
                </p>
              )}
              {/* You can add more preview details here if needed */}
            </div>
          ) : (
            <p>No tag to preview</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
