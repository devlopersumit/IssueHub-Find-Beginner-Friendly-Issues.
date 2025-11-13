import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'

type HeaderProps = {
  title?: string
  searchTerm: string
  onSearchTermChange: (value: string) => void
  onSubmitSearch: () => void
  onToggleFilters?: () => void
  showFiltersButton?: boolean
}

const Header: React.FC<HeaderProps> = ({ title = 'IssueFinder', searchTerm, onSearchTermChange, onSubmitSearch, onToggleFilters, showFiltersButton = false }) => {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/issuefinder-2.png" alt="IssueFinder" className="h-8 w-8" />
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100 sm:text-xl">{title}</h1>
        </Link>
        <div className="flex w-full gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/')
                  ? 'text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-gray-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-gray-800/50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/home"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/home')
                  ? 'text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-gray-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-gray-800/50'
              }`}
            >
              Catalog
            </Link>
            <Link
              to="/bounty"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/bounty')
                  ? 'text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-gray-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-gray-800/50'
              }`}
            >
              Bounty
            </Link>
            <Link
              to="/repositories"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/repositories')
                  ? 'text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-gray-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-gray-800/50'
              }`}
            >
              Repositories
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/about')
                  ? 'text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-gray-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-gray-800/50'
              }`}
            >
              About
            </Link>
          </nav>
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <form
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-xs dark:border-gray-700 dark:bg-gray-800 w-full sm:w-auto sm:max-w-md"
              onSubmit={(e) => {
                e.preventDefault()
                onSubmitSearch()
              }}
            >
              <svg className="h-4 w-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                placeholder="Search issues"
                className="w-full min-w-0 border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-hidden dark:text-slate-200"
              />
              <button
                type="submit"
                className="hidden rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-200 dark:text-gray-900 dark:hover:bg-slate-300 sm:inline-flex"
              >
                Go
              </button>
            </form>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {showFiltersButton && onToggleFilters && (
              <button
                type="button"
                onClick={onToggleFilters}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-300 dark:hover:border-gray-600 dark:hover:text-white sm:hidden"
                aria-label="Toggle filters"
                title="Toggle filters"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={() => setTimeout(toggleTheme, 0)}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-300 dark:hover:border-gray-600 dark:hover:text-white"
              aria-label="Toggle theme"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
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


