'use client'

import { Button } from "@/components/ui/button"

export function PopularSearches({ setSearchQuery, handleSearch }) {
  const handleQuickSearch = (query) => {
    setSearchQuery(query)
    handleSearch({ preventDefault: () => {} })
  }

  return (
    <div className="mx-auto mt-16">
      <h2 className="text-2xl font-bold mb-6">Popular Searches</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          variant="outline" 
          className="h-auto py-4 px-6 flex flex-col items-start"
          onClick={() => handleQuickSearch('react')}
        >
          <span className="font-semibold mb-1">React Projects</span>
          <span className="text-sm text-muted-foreground">Frontend frameworks</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto py-4 px-6 flex flex-col items-start"
          onClick={() => handleQuickSearch('machine learning')}
        >
          <span className="font-semibold mb-1">Machine Learning</span>
          <span className="text-sm text-muted-foreground">AI & ML repositories</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto py-4 px-6 flex flex-col items-start"
          onClick={() => handleQuickSearch('blockchain')}
        >
          <span className="font-semibold mb-1">Web3 & Blockchain</span>
          <span className="text-sm text-muted-foreground">Decentralized apps</span>
        </Button>
      </div>
    </div>
  )
}
