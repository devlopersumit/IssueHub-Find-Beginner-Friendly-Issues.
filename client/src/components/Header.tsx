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
    <header className="w-full border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="IssueFinder" className="h-7 w-7" />
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-700 dark:text-slate-300">{title}</h1>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <form
            className="flex items-center gap-2 flex-1 sm:flex-initial"
            onSubmit={(e) => {
              e.preventDefault()
              onSubmitSearch()
            }}
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              placeholder="Search issues..."
              className="w-full sm:w-56 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500 dark:focus:ring-slate-400 focus:border-slate-500"
            />
            <button
              type="submit"
              className="rounded bg-slate-700 dark:bg-slate-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-800 dark:hover:bg-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            >
              Search
            </button>
          </form>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              console.log('Button clicked, current theme:', theme)
              toggleTheme()
              // Force check after toggle
              setTimeout(() => {
                console.log('After toggle, HTML has dark class:', document.documentElement.classList.contains('dark'))
                console.log('Current theme from state:', theme)
              }, 100)
            }}
            className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            aria-label="Toggle theme"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header


