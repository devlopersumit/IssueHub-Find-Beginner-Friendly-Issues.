import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useSearch } from '../contexts/SearchContext'
import { useSearchHistory } from '../hooks/useSearchHistory'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'

type HeaderProps = {
  title?: string
  searchTerm: string
  onSearchTermChange: (value: string) => void
  onSubmitSearch: () => void
}

const Header: React.FC<HeaderProps> = ({ title = 'IssueFinder', searchTerm, onSearchTermChange, onSubmitSearch }) => {
  const { effectiveTheme, toggleTheme } = useTheme()
  const { isDebouncing, submitSearch } = useSearch()
  const { history, addToHistory } = useSearchHistory()
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useKeyboardShortcuts([
    {
      key: 'k',
      ctrlKey: true,
      handler: () => {
        searchInputRef.current?.focus()
      },
      description: 'Focus search'
    },
    {
      key: 'k',
      metaKey: true,
      handler: () => {
        searchInputRef.current?.focus()
      },
      description: 'Focus search'
    }
  ])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSearchSubmit = (term?: string) => {
    const searchValue = term || searchTerm.trim()
    if (searchValue) {
      addToHistory(searchValue)
      submitSearch(searchValue)
      onSubmitSearch()
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    onSearchTermChange(suggestion)
    handleSearchSubmit(suggestion)
  }

  const filteredHistory = history.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/issuefinder-2.png" alt="IssueFinder" className="h-8 w-8" />
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100 sm:text-xl">{title}</h1>
        </Link>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-2">
          <div className="relative w-full sm:w-auto">
            <form
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              onSubmit={(e) => {
                e.preventDefault()
                handleSearchSubmit()
              }}
            >
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  onSearchTermChange(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search by issue title, repo name, or keywords..."
                className="w-full border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none dark:text-slate-200"
                aria-label="Search issues"
              />
              {isDebouncing && (
                <svg className="h-4 w-4 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24" aria-label="Searching">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <div className="hidden items-center gap-1 text-xs text-slate-400 sm:flex">
                <kbd className="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono dark:border-gray-600 dark:bg-gray-700">⌘</kbd>
                <kbd className="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono dark:border-gray-600 dark:bg-gray-700">K</kbd>
              </div>
              <button
                type="submit"
                className="hidden rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-200 dark:text-gray-900 dark:hover:bg-slate-300 sm:inline-flex"
                aria-label="Submit search"
              >
                Go
              </button>
            </form>
            {showSuggestions && filteredHistory.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="p-2">
                  <div className="mb-2 px-2 text-xs font-semibold text-slate-500 dark:text-slate-400">Recent searches</div>
                  {filteredHistory.map((item, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(item)}
                      className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-gray-700"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/devlopersumit/IssueFinder-Find-Beginner-Friendly-Issues"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-300 dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white"
              aria-label="Star us on GitHub"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.424 2.865 8.178 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.952 0-1.093.39-1.988 1.03-2.688-.104-.253-.447-1.27.098-2.647 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.748-1.026 2.748-1.026.546 1.377.203 2.394.1 2.647.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.696-4.566 4.945.359.309.679.92.679 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.481A10.019 10.019 0 0 0 22 12.017C22 6.484 17.523 2 12 2Z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">Star us</span>
            </a>
            <button
              type="button"
              onClick={() => setTimeout(toggleTheme, 0)}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-300 dark:hover:border-gray-600 dark:hover:text-white dark:focus:ring-offset-gray-900"
              aria-label={`Switch to ${effectiveTheme === 'dark' ? 'light' : 'dark'} mode. Current theme: ${effectiveTheme}`}
              aria-pressed={effectiveTheme === 'dark'}
              title={`Current: ${effectiveTheme === 'dark' ? 'Dark' : 'Light'} mode. Click to toggle.`}
            >
              {effectiveTheme === 'dark' ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header


