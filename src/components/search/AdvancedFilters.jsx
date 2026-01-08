"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const licenseOptions = [
  { value: "any", label: "Any License" },
  { value: "mit", label: "MIT" },
  { value: "apache-2.0", label: "Apache 2.0" },
  { value: "gpl-3.0", label: "GPL 3.0" },
  { value: "bsd-3-clause", label: "BSD 3-Clause" },
  { value: "unlicense", label: "Unlicense" },
  { value: "mpl-2.0", label: "MPL 2.0" },
];

const dateOptions = [
  { value: "any", label: "Any Time" },
  { value: "day", label: "Past 24 hours" },
  { value: "week", label: "Past week" },
  { value: "month", label: "Past month" },
  { value: "year", label: "Past year" },
];

const topicOptions = [
  "react",
  "vue",
  "angular",
  "nodejs",
  "python",
  "machine-learning",
  "api",
  "cli",
  "docker",
  "kubernetes",
  "database",
  "security",
  "testing",
  "devops",
  "web",
  "mobile",
];

export function AdvancedFilters({
  filters,
  setFilters,
  isExpanded: externalIsExpanded,
  hideToggle = false,
}) {
  const [internalIsExpanded, setInternalIsExpanded] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState([]);

  // Use external control if provided, otherwise use internal state
  const isExpanded = hideToggle ? externalIsExpanded : internalIsExpanded;
  const setIsExpanded = hideToggle ? () => {} : setInternalIsExpanded;

  const handleTopicToggle = (topic) => {
    const newTopics = selectedTopics.includes(topic)
      ? selectedTopics.filter((t) => t !== topic)
      : [...selectedTopics, topic];
    setSelectedTopics(newTopics);
    setFilters({ ...filters, topics: newTopics });
  };

  const clearAllFilters = () => {
    setSelectedTopics([]);
    setFilters({
      license: "",
      dateRange: "",
      hasWiki: false,
      hasIssues: false,
      topics: [],
      forks: "",
    });
  };

  const activeFilterCount =
    (filters.license ? 1 : 0) +
    (filters.dateRange ? 1 : 0) +
    (filters.hasWiki ? 1 : 0) +
    (filters.hasIssues ? 1 : 0) +
    selectedTopics.length +
    (filters.forks ? 1 : 0);

  return (
    <div className="mb-6">
      {!hideToggle && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="rounded-xl glass-premium hover:glow-border-slate transition-smooth mb-3"
        >
          <Filter className="h-4 w-4 mr-2" />
          Advanced Filters
          {activeFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 bg-blue-500/20 text-blue-400"
            >
              {activeFilterCount}
            </Badge>
          )}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 ml-2" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-2" />
          )}
        </Button>
      )}

      {isExpanded && (
        <div className="p-4 rounded-xl glass-premium border border-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Filter Options</h3>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* License Filter */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                License
              </label>
              <Select
                value={filters.license || "any"}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    license: value === "any" ? "" : value,
                  })
                }
              >
                <SelectTrigger className="rounded-lg glass-premium border-white/10">
                  <SelectValue placeholder="Any License" />
                </SelectTrigger>
                <SelectContent className="rounded-lg glass-premium border-white/10">
                  {licenseOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Updated
              </label>
              <Select
                value={filters.dateRange || "any"}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    dateRange: value === "any" ? "" : value,
                  })
                }
              >
                <SelectTrigger className="rounded-lg glass-premium border-white/10">
                  <SelectValue placeholder="Any Time" />
                </SelectTrigger>
                <SelectContent className="rounded-lg glass-premium border-white/10">
                  {dateOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Forks Filter */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Min Forks
              </label>
              <Select
                value={filters.forks || "any"}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    forks: value === "any" ? "" : value,
                  })
                }
              >
                <SelectTrigger className="rounded-lg glass-premium border-white/10">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent className="rounded-lg glass-premium border-white/10">
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="10">&gt; 10</SelectItem>
                  <SelectItem value="50">&gt; 50</SelectItem>
                  <SelectItem value="100">&gt; 100</SelectItem>
                  <SelectItem value="500">&gt; 500</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hasWiki}
                onChange={(e) =>
                  setFilters({ ...filters, hasWiki: e.target.checked })
                }
                className="rounded border-white/20 bg-white/5"
              />
              <span className="text-sm">Has Wiki</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hasIssues}
                onChange={(e) =>
                  setFilters({ ...filters, hasIssues: e.target.checked })
                }
                className="rounded border-white/20 bg-white/5"
              />
              <span className="text-sm">Has Issues</span>
            </label>
          </div>

          {/* Topics */}
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">
              Topics
            </label>
            <div className="flex flex-wrap gap-2">
              {topicOptions.map((topic) => (
                <Badge
                  key={topic}
                  variant="outline"
                  className={`cursor-pointer transition-all ${
                    selectedTopics.includes(topic)
                      ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                      : "hover:bg-white/10"
                  }`}
                  onClick={() => handleTopicToggle(topic)}
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
