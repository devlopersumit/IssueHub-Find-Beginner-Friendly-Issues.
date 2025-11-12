import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

type HeaderProps = {
  title?: string
  searchTerm: string
  onSearchTermChange: (value: string) => void
  onSubmitSearch: () => void
}

const Header: React.FC<HeaderProps> = ({ title = 'IssueFinder', searchTerm, onSearchTermChange, onSubmitSearch }) => {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <img src="/issuefinder-2.png" alt="IssueFinder" className="h-8 w-8" />
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100 sm:text-xl">{title}</h1>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-2">
          <form
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-xs dark:border-gray-700 dark:bg-gray-800"
            onSubmit={(e) => {
              e.preventDefault()
              onSubmitSearch()
            }}
          >
            <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              placeholder="Search issues"
              className="w-full border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-hidden dark:text-slate-200"
            />
            <button
              type="submit"
              className="hidden rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-200 dark:text-gray-900 dark:hover:bg-slate-300 sm:inline-flex"
            >
              Go
            </button>
          </form>
          <div className="flex items-center gap-2">
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


