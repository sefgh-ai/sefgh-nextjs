'use client'

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { MagnifyingGlassIcon, XMarkIcon, ArrowPathIcon, SparklesIcon } from "@heroicons/react/24/outline"

export function SearchBox({ searchQuery, setSearchQuery, loading, handleSearch }) {
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [suggestionSource, setSuggestionSource] = useState('')
  const wrapperRef = useRef(null)
  const debounceTimer = useRef(null)

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch suggestions when user types
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    if (searchQuery.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    debounceTimer.current = setTimeout(async () => {
      setLoadingSuggestions(true)
      try {
        const response = await fetch('/api/ai/suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: searchQuery })
        })
        
        const data = await response.json()
        if (response.ok && data.suggestions) {
          setSuggestions(data.suggestions)
          setSuggestionSource(data.source)
          setShowSuggestions(data.suggestions.length > 0)
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error)
      } finally {
        setLoadingSuggestions(false)
      }
    }, 300) // 300ms debounce

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [searchQuery])

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    // Auto-trigger search after selecting suggestion
    setTimeout(() => {
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
      wrapperRef.current?.querySelector('form')?.dispatchEvent(submitEvent)
    }, 100)
  }

  return (
    <div className="mx-auto mb-8" ref={wrapperRef}>
      <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search repositories by name, topic, or user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true)
                }
              }}
              disabled={loading}
              suppressHydrationWarning
              className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl glass-premium border-white/10 focus:outline-none disabled:opacity-50 transition-smooth shadow-soft hover:shadow-soft-lg"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("")
                  setSuggestions([])
                  setShowSuggestions(false)
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-smooth"
              >
                <XMarkIcon className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-2xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Header */}
              <div className="px-4 py-2 border-b border-border/50 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {suggestionSource === 'ai-powered' && 'AI-Powered Suggestions'}
                  {suggestionSource === 'predefined' && 'Popular Searches'}
                  {suggestionSource === 'predefined-fallback' && 'Suggested Searches'}
                </span>
                {loadingSuggestions && (
                  <ArrowPathIcon className="h-3 w-3 animate-spin text-muted-foreground" />
                )}
              </div>

              {/* Suggestions List */}
              <div className="py-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-2.5 text-left hover:bg-accent transition-colors flex items-center gap-3 group"
                  >
                    <MagnifyingGlassIcon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                    <span className="text-sm group-hover:text-foreground transition-colors">
                      {suggestion}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Button type="submit" size="lg" className="w-full mt-4 rounded-2xl glass-premium hover:glow-border-blue transition-premium shadow-soft hover:shadow-soft-lg" disabled={loading}>
          {loading ? (
            <>
              <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
              Search Repositories
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
