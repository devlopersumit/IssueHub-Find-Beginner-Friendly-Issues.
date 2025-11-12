import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSearch } from '../contexts/SearchContext'
import IssueList from '../components/IssueList'
import FiltersPanel from '../components/FiltersPanel'
import { buildGitHubQuery } from '../utils/queryBuilder'

const SearchResultsPage: React.FC = () => {
  const { submittedSearch, clearSearch } = useSearch()
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false)
  // Advanced filters
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null)
  const [selectedLastActivity, setSelectedLastActivity] = useState<string | null>(null)

  const toggleLabel = (label: string) => {
    setSelectedLabels((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]))
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      if (category === 'all') {
        return prev.includes('all') ? [] : ['all']
      }
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category)
      }
      return [...prev.filter((c) => c !== 'all'), category]
    })
  }

  const query = useMemo(() => {
    return buildGitHubQuery({
      searchTerm: submittedSearch || undefined,
      selectedLabels,
      selectedCategories,
      selectedLanguage,
      selectedDifficulty,
      selectedType,
      selectedFramework,
      selectedLastActivity,
    })
  }, [submittedSearch, selectedLabels, selectedCategories, selectedLanguage, selectedDifficulty, selectedType, selectedFramework, selectedLastActivity])

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Search Results
          </h1>
          {submittedSearch && (
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Results for: <span className="font-semibold text-gray-900 dark:text-gray-100">"{submittedSearch}"</span>
              </p>
              <button
                onClick={clearSearch}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>

      <div className="mb-4 md:hidden">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          onClick={() => setShowMobileFilters((v) => !v)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {showMobileFilters && (
        <div className="md:hidden mb-4">
          <FiltersPanel
            className="rounded-md"
            selectedLabels={selectedLabels}
            onToggleLabel={toggleLabel}
            selectedLanguage={selectedLanguage}
            onChangeLanguage={setSelectedLanguage}
            showTags={true}
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            isMobile={true}
            selectedDifficulty={selectedDifficulty}
            onChangeDifficulty={setSelectedDifficulty}
            selectedType={selectedType}
            onChangeType={setSelectedType}
            selectedFramework={selectedFramework}
            onChangeFramework={setSelectedFramework}
            selectedLastActivity={selectedLastActivity}
            onChangeLastActivity={setSelectedLastActivity}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="hidden md:block md:col-span-3">
          <FiltersPanel
            className="rounded-md md:sticky md:top-4"
            selectedLabels={selectedLabels}
            onToggleLabel={toggleLabel}
            selectedLanguage={selectedLanguage}
            onChangeLanguage={setSelectedLanguage}
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            selectedDifficulty={selectedDifficulty}
            onChangeDifficulty={setSelectedDifficulty}
            selectedType={selectedType}
            onChangeType={setSelectedType}
            selectedFramework={selectedFramework}
            onChangeFramework={setSelectedFramework}
            selectedLastActivity={selectedLastActivity}
            onChangeLastActivity={setSelectedLastActivity}
          />
        </div>
        <div className="md:col-span-9">
          <IssueList className="rounded-md" query={query} />
        </div>
      </div>
    </main>
  )
}

export default SearchResultsPage

