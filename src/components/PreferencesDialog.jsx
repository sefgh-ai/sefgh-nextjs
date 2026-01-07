"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X, Plus, GripVertical, Info, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useCategories } from "@/hooks/home/useCategories";
import { useAuth } from "@/contexts/AuthContext";

// Emoji picker for new categories
const EMOJI_OPTIONS = [
  "🏷️",
  "🎯",
  "🚀",
  "⭐",
  "💡",
  "🔥",
  "✨",
  "🎨",
  "🔧",
  "📱",
  "💻",
  "🌟",
  "🎪",
  "🎭",
  "🎬",
];

export function PreferencesDialog({ open, onOpenChange, onSave }) {
  const { user } = useAuth();
  const { categories, loading, addCategory, refreshCategories } =
    useCategories();
  const [selectedTags, setSelectedTags] = useState([]);
  const [filterMode, setFilterMode] = useState("OR"); // OR or AND
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("🏷️");
  const [newCategoryType, setNewCategoryType] = useState("custom");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    // Load saved preferences from localStorage
    if (open) {
      const saved = localStorage.getItem("projectPreferences");
      if (saved) {
        const { tags, mode } = JSON.parse(saved);
        setSelectedTags(tags || []);
        setFilterMode(mode || "OR");
      }
    }
  }, [open]);

  // Group categories by type
  const groupedCategories = categories.reduce((acc, cat) => {
    const type = cat.type.charAt(0).toUpperCase() + cat.type.slice(1);
    if (!acc[type]) acc[type] = [];
    acc[type].push(cat);
    return acc;
  }, {});

  const handleTagClick = (tag) => {
    if (selectedTags.find((t) => t.name === tag.name)) {
      // Remove tag
      setSelectedTags(selectedTags.filter((t) => t.name !== tag.name));
    } else {
      // Add tag
      if (selectedTags.length >= 20) {
        toast.error("Maximum 20 tags allowed");
        return;
      }
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCategory = async () => {
    if (!user) {
      toast.error("Please login to add custom categories");
      return;
    }

    if (!newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (
      categories.find(
        (cat) => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase()
      )
    ) {
      toast.error("Category already exists");
      return;
    }

    setIsAdding(true);
    const result = await addCategory(
      newCategoryName.trim(),
      newCategoryIcon,
      newCategoryType,
      `Custom category created by user`
    );

    setIsAdding(false);

    if (result.success) {
      toast.success("Category added successfully!");
      setNewCategoryName("");
      setNewCategoryIcon("🏷️");
      setNewCategoryType("custom");
      setShowAddCategory(false);
      refreshCategories();
    } else {
      toast.error(`Failed to add category: ${result.error}`);
    }
  };

  const handleRemoveTag = (tagName) => {
    setSelectedTags(selectedTags.filter((t) => t.name !== tagName));
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newTags = [...selectedTags];
    const draggedTag = newTags[draggedIndex];
    newTags.splice(draggedIndex, 1);
    newTags.splice(index, 0, draggedTag);

    setSelectedTags(newTags);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSave = () => {
    const preferences = {
      tags: selectedTags,
      mode: filterMode,
    };
    localStorage.setItem("projectPreferences", JSON.stringify(preferences));
    onSave(preferences);
    toast.success("Preferences saved successfully!");
    onOpenChange(false);
  };

  const isTagSelected = (tagName) => {
    return selectedTags.some((t) => t.name === tagName);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[80vh] bg-slate-900 border-slate-800 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-100 flex items-center gap-2">
            Customize Your Feed Preferences
            {loading && (
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            )}
          </DialogTitle>
          <DialogDescription className="text-slate-400 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Click tags to select, drag to reorder. {categories.length}{" "}
            categories available from database.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-6 h-full overflow-hidden">
          {/* Left Side - Available Tags */}
          <div className="flex-1">
            {/* Add Category Button */}
            <div className="mb-4">
              {!showAddCategory ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddCategory(true)}
                  disabled={!user}
                  className="w-full border-dashed border-slate-700 hover:border-blue-500 hover:bg-blue-950/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Custom Category
                  {!user && (
                    <span className="ml-2 text-xs">(Login required)</span>
                  )}
                </Button>
              ) : (
                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 space-y-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={newCategoryIcon}
                      onChange={(e) => setNewCategoryIcon(e.target.value)}
                      className="w-12 h-10 bg-slate-900 border border-slate-700 rounded text-xl text-center cursor-pointer"
                    >
                      {EMOJI_OPTIONS.map((emoji) => (
                        <option key={emoji} value={emoji}>
                          {emoji}
                        </option>
                      ))}
                    </select>
                    <Input
                      placeholder="Category name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="flex-1 bg-slate-900 border-slate-700"
                      maxLength={30}
                    />
                    <select
                      value={newCategoryType}
                      onChange={(e) => setNewCategoryType(e.target.value)}
                      className="w-32 h-10 bg-slate-900 border border-slate-700 rounded px-2 text-sm"
                    >
                      <option value="custom">Custom</option>
                      <option value="programming">Programming</option>
                      <option value="technology">Technology</option>
                      <option value="application">Application</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleAddCategory}
                      disabled={isAdding || !newCategoryName.trim()}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {isAdding ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 mr-2" />
                          Add to Database
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setShowAddCategory(false);
                        setNewCategoryName("");
                        setNewCategoryIcon("🏷️");
                        setNewCategoryType("custom");
                      }}
                      className="text-slate-400 hover:text-slate-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <ScrollArea className="h-[calc(80vh-280px)]">
              <div className="space-y-6 pr-4">
                {loading && categories.length === 0 ? (
                  <div className="flex items-center justify-center h-40 text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : Object.keys(groupedCategories).length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                    <Info className="w-8 h-8 mb-2" />
                    <p className="text-sm">No categories available</p>
                    <p className="text-xs">Add your first category above</p>
                  </div>
                ) : (
                  Object.entries(groupedCategories).map(
                    ([categoryType, tags]) => (
                      <div key={categoryType}>
                        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                          {categoryType}
                          <Badge variant="outline" className="text-xs">
                            {tags.length}
                          </Badge>
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <Badge
                              key={tag.id}
                              variant={
                                isTagSelected(tag.name) ? "default" : "outline"
                              }
                              className={`cursor-pointer transition-all ${
                                isTagSelected(tag.name)
                                  ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
                                  : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                              }`}
                              onClick={() => handleTagClick(tag)}
                            >
                              <span className="mr-1">{tag.icon}</span>
                              {tag.name}
                              {tag.usage_count > 0 && (
                                <span className="ml-1 text-xs opacity-70">
                                  ({tag.usage_count})
                                </span>
                              )}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )
                  )
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Vertical Divider */}
          <div className="w-px bg-slate-800"></div>

          {/* Right Side - Selected Tags */}
          <div className="w-80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-300">
                Selected: {selectedTags.length}/20
              </h3>
              {selectedTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTags([])}
                  className="text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Filter Mode Toggle */}
            <div className="mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <Label className="text-sm font-medium text-slate-200 mb-1">
                    Filter Mode
                  </Label>
                  <span className="text-xs text-slate-400">
                    {filterMode === "OR"
                      ? "Show projects matching ANY tag"
                      : "Show projects matching ALL tags"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs ${
                      filterMode === "OR" ? "text-blue-400" : "text-slate-500"
                    }`}
                  >
                    OR
                  </span>
                  <Switch
                    checked={filterMode === "AND"}
                    onCheckedChange={(checked) =>
                      setFilterMode(checked ? "AND" : "OR")
                    }
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <span
                    className={`text-xs ${
                      filterMode === "AND" ? "text-blue-400" : "text-slate-500"
                    }`}
                  >
                    AND
                  </span>
                </div>
              </div>
            </div>

            <ScrollArea className="h-[calc(80vh-340px)]">
              {selectedTags.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                  <Plus className="w-8 h-8 mb-2" />
                  <p className="text-sm">No tags selected</p>
                  <p className="text-xs">Click tags to add them</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedTags.map((tag, index) => (
                    <div
                      key={tag.name}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-center gap-2 p-3 bg-slate-800 rounded-lg border border-slate-700 cursor-move hover:bg-slate-750 transition-colors ${
                        draggedIndex === index ? "opacity-50" : ""
                      }`}
                    >
                      <GripVertical className="w-4 h-4 text-slate-500" />
                      <span className="flex items-center gap-2 flex-1">
                        <span className="text-lg">{tag.icon}</span>
                        <span className="text-sm font-medium text-slate-200">
                          {tag.name}
                        </span>
                      </span>
                      <span className="text-xs text-slate-500">
                        #{index + 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTag(tag.name)}
                        className="h-6 w-6 p-0 hover:bg-red-950/20"
                      >
                        <X className="w-4 h-4 text-slate-400 hover:text-red-400" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={selectedTags.length === 0}
          >
            Save Preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
