'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { X, Plus, GripVertical, Info } from 'lucide-react';
import { toast } from 'sonner';

const AVAILABLE_TAGS = {
  Programming: [
    { name: 'Python', icon: '🐍' },
    { name: 'Java', icon: '☕' },
    { name: 'C++', icon: '⚙️' },
    { name: 'JavaScript', icon: '⚡' },
    { name: 'Rust', icon: '🦀' },
    { name: 'Go', icon: '🔵' },
    { name: 'Swift', icon: '🔶' },
    { name: 'TypeScript', icon: '💠' },
    { name: 'C#', icon: '💚' },
    { name: 'C', icon: '🔧' },
    { name: 'Kotlin', icon: '🟣' },
    { name: 'PHP', icon: '🐘' },
    { name: 'Ruby', icon: '💎' },
    { name: 'Flutter', icon: '🦋' },
  ],
  Technology: [
    { name: 'AI', icon: '🤖' },
    { name: 'Algo', icon: '🧮' },
    { name: 'Spider', icon: '🕷️' },
    { name: 'Safe', icon: '🔒' },
    { name: 'Linux', icon: '🐧' },
    { name: 'DB', icon: '🗄️' },
    { name: 'Test', icon: '🧪' },
    { name: 'Embedded', icon: '🔌' },
    { name: 'Docker', icon: '🐳' },
    { name: 'Kubernetes', icon: '☸️' },
    { name: 'Vue', icon: '💚' },
    { name: 'React', icon: '⚛️' },
  ],
  Application: [
    { name: 'Game', icon: '🎮' },
    { name: 'Desktop', icon: '🖥️' },
    { name: 'Android', icon: '🤖' },
    { name: 'CLI', icon: '⌨️' },
    { name: 'Web App', icon: '🌐' },
    { name: 'Tool', icon: '🔨' },
    { name: 'macOS', icon: '🍎' },
    { name: 'Windows', icon: '🪟' },
    { name: 'Self-Hosted', icon: '🏠' },
  ],
  Other: [
    { name: 'Tutorial', icon: '📚' },
    { name: 'Book', icon: '📖' },
    { name: 'Collection', icon: '📦' },
    { name: 'Funny', icon: '😄' },
  ],
};

export function PreferencesDialog({ open, onOpenChange, onSave }) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [filterMode, setFilterMode] = useState('OR'); // OR or AND
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    // Load saved preferences from localStorage
    if (open) {
      const saved = localStorage.getItem('projectPreferences');
      if (saved) {
        const { tags, mode } = JSON.parse(saved);
        setSelectedTags(tags || []);
        setFilterMode(mode || 'OR');
      }
    }
  }, [open]);

  const handleTagClick = (tag) => {
    if (selectedTags.find((t) => t.name === tag.name)) {
      // Remove tag
      setSelectedTags(selectedTags.filter((t) => t.name !== tag.name));
    } else {
      // Add tag
      if (selectedTags.length >= 20) {
        toast.error('Maximum 20 tags allowed');
        return;
      }
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tagName) => {
    setSelectedTags(selectedTags.filter((t) => t.name !== tagName));
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
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
    localStorage.setItem('projectPreferences', JSON.stringify(preferences));
    onSave(preferences);
    toast.success('Preferences saved successfully!');
    onOpenChange(false);
  };

  const isTagSelected = (tagName) => {
    return selectedTags.some((t) => t.name === tagName);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[80vh] bg-slate-900 border-slate-800 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-100">
            Customize Your Feed Preferences
          </DialogTitle>
          <DialogDescription className="text-slate-400 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Click tags on the left to select, drag on the right to sort
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-6 h-full overflow-hidden">
          {/* Left Side - Available Tags */}
          <div className="flex-1">
            <ScrollArea className="h-[calc(80vh-200px)]">
              <div className="space-y-6 pr-4">
                {Object.entries(AVAILABLE_TAGS).map(([category, tags]) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-slate-300 mb-3">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag.name}
                          variant={isTagSelected(tag.name) ? 'default' : 'outline'}
                          className={`cursor-pointer transition-all ${
                            isTagSelected(tag.name)
                              ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                          }`}
                          onClick={() => handleTagClick(tag)}
                        >
                          <span className="mr-1">{tag.icon}</span>
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
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
                  <Label className="text-sm font-medium text-slate-200 mb-1">Filter Mode</Label>
                  <span className="text-xs text-slate-400">
                    {filterMode === 'OR'
                      ? 'Show projects matching ANY tag'
                      : 'Show projects matching ALL tags'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${filterMode === 'OR' ? 'text-blue-400' : 'text-slate-500'}`}>
                    OR
                  </span>
                  <Switch
                    checked={filterMode === 'AND'}
                    onCheckedChange={(checked) => setFilterMode(checked ? 'AND' : 'OR')}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <span className={`text-xs ${filterMode === 'AND' ? 'text-blue-400' : 'text-slate-500'}`}>
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
                        draggedIndex === index ? 'opacity-50' : ''
                      }`}
                    >
                      <GripVertical className="w-4 h-4 text-slate-500" />
                      <span className="flex items-center gap-2 flex-1">
                        <span className="text-lg">{tag.icon}</span>
                        <span className="text-sm font-medium text-slate-200">{tag.name}</span>
                      </span>
                      <span className="text-xs text-slate-500">#{index + 1}</span>
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
