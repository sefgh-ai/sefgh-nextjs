"use client";

import { Button } from "@/components/ui/button";
import { CodeBracketIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Header } from "@/components/Header";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SubmitProjectDialog } from "@/components/SubmitProjectDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SearchNavbar({
  language,
  setLanguage,
  stars,
  setStars,
  sort,
  setSort,
}) {
  const sortOptions = [
    { label: "All", value: "all" },
    { label: "Best Match", value: "best-match" },
    { label: "Most Stars", value: "stars" },
    { label: "Recently Updated", value: "updated" },
  ];

  return (
    <div className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-sm">
      <div className="flex h-14 items-center px-4 gap-3">
        <SidebarTrigger className="hover:bg-white/10 rounded-xl transition-smooth" />

        {/* Search Filter Dropdowns */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-xl glass-premium hover:glow-border-slate transition-smooth shadow-soft"
              >
                {sortOptions.find((f) => f.value === (sort || "all"))?.label ||
                  "All"}
                <ChevronDownIcon className="ml-2 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl glass-premium border-white/10 shadow-premium">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSort(option.value)}
                  className="rounded-lg"
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-xl glass-premium hover:glow-border-grey transition-smooth shadow-soft"
              >
                <span className="hidden sm:inline">Language: </span>
                {language || "All"}
                <ChevronDownIcon className="ml-2 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl glass-premium border-white/10 shadow-premium">
              <DropdownMenuLabel>Select Language</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={() => setLanguage("")}
                className="rounded-lg"
              >
                All
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage("JavaScript")}
                className="rounded-lg"
              >
                JavaScript
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage("TypeScript")}
                className="rounded-lg"
              >
                TypeScript
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage("Python")}
                className="rounded-lg"
              >
                Python
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage("Java")}
                className="rounded-lg"
              >
                Java
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage("Go")}
                className="rounded-lg"
              >
                Go
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage("Rust")}
                className="rounded-lg"
              >
                Rust
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage("C++")}
                className="rounded-lg"
              >
                C++
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-xl glass-premium hover:glow-border-cyan transition-smooth shadow-soft"
              >
                <span className="hidden sm:inline">Stars: </span>
                {stars ? `>${stars}` : "Any"}
                <ChevronDownIcon className="ml-2 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl glass-premium border-white/10 shadow-premium">
              <DropdownMenuLabel>Minimum Stars</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={() => setStars("")}
                className="rounded-lg"
              >
                Any
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStars(">100")}
                className="rounded-lg"
              >
                &gt; 100
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStars(">1000")}
                className="rounded-lg"
              >
                &gt; 1,000
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStars(">10000")}
                className="rounded-lg"
              >
                &gt; 10,000
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStars(">50000")}
                className="rounded-lg"
              >
                &gt; 50,000
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <SubmitProjectDialog>
            <Button
              variant="outline"
              className="glass-premium border border-white/10 rounded-xl hover:glow-border-blue transition-smooth shadow-soft hover:shadow-soft-lg"
            >
              <CodeBracketIcon className="h-4 w-4 mr-2" />
              Submit
            </Button>
          </SubmitProjectDialog>
          <Header showProfileDropdown={false} />
        </div>
      </div>
    </div>
  );
}
