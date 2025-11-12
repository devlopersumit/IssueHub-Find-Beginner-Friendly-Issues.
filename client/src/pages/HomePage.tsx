import React, { useMemo, useState, useEffect } from 'react'
import Hero from '../components/Hero'
import FiltersPanel from '../components/FiltersPanel'
import IssueList from '../components/IssueList'
import RepositoryList from '../components/RepositoryList'
import MobileCategoryTabs from '../components/MobileCategoryTabs'
import { Link } from 'react-router-dom'
import { useSearch } from '../contexts/SearchContext'
import type { NaturalLanguage } from '../utils/languageDetection'
import { getBrowserLanguage } from '../utils/languageDetection'
import { buildGitHubQuery } from '../utils/queryBuilder'

type ViewMode = 'issues' | 'repositories'

const HomePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('issues')
  const { submittedSearch } = useSearch()
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
  const [selectedLicense, setSelectedLicense] = useState<string | null>(null)
  const [selectedNaturalLanguages, setSelectedNaturalLanguages] = useState<NaturalLanguage[]>([])
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false)
  // Advanced filters
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null)
  const [selectedLastActivity, setSelectedLastActivity] = useState<string | null>(null)

  // Auto-detect browser language and apply filter automatically (silently)
  useEffect(() => {
    const browserLang = getBrowserLanguage()
    setSelectedNaturalLanguages([browserLang])
  }, []) // Run only once on mount

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
      selectedLicense,
      selectedDifficulty,
      selectedType,
      selectedFramework,
      selectedLastActivity,
    })
  }, [submittedSearch, selectedLabels, selectedCategories, selectedLanguage, selectedLicense, selectedDifficulty, selectedType, selectedFramework, selectedLastActivity])

  return (
    <>
      <Hero />
      <main id="catalog" className="mx-auto max-w-7xl px-4 py-8">
        <section className="mb-10 rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Repository explorer</p>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Browse projects ready for contribution</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Jump into a dedicated repository directory with filters for language and license so you can evaluate projects quickly.
              </p>
            </div>
            <Link
              to="/repositories"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-200 dark:hover:border-gray-600 dark:hover:text-white"
            >
              Browse repositories
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Bounty Issues Button - Centered */}
        <div className="mb-8 flex justify-center">
          <Link
            to="/bounty"
            className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
            Check Bounty Issues
          </Link>
        </div>
        
        {/* Mobile Category Tabs - Always visible on mobile */}
        {viewMode === 'issues' && (
          <MobileCategoryTabs
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
          />
        )}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex gap-2 border-b border-gray-300 dark:border-gray-600">
            <button
              type="button"
              onClick={() => setViewMode('issues')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                viewMode === 'issues'
                  ? 'border-slate-700 dark:border-slate-400 text-slate-900 dark:text-slate-100'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              Issues
            </button>
            <button
              type="button"
              onClick={() => setViewMode('repositories')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                viewMode === 'repositories'
                  ? 'border-slate-700 dark:border-slate-400 text-slate-900 dark:text-slate-100'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              Repositories
            </button>
          </div>
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setShowMobileFilters((v) => !v)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>
        {showMobileFilters && (
          <div className="md:hidden mb-4">
            <FiltersPanel
              className="rounded-md"
              selectedLabels={selectedLabels}
              onToggleLabel={toggleLabel}
              selectedLanguage={selectedLanguage}
              onChangeLanguage={setSelectedLanguage}
              selectedLicense={selectedLicense}
              onChangeLicense={viewMode === 'repositories' ? setSelectedLicense : undefined}
              showTags={viewMode === 'issues'}
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
          {viewMode === 'issues' && (
            <div className="hidden md:block md:col-span-3">
              <FiltersPanel
                className="rounded-md md:sticky md:top-4"
                selectedLabels={selectedLabels}
                onToggleLabel={toggleLabel}
                selectedLanguage={selectedLanguage}
                onChangeLanguage={setSelectedLanguage}
              selectedLicense={selectedLicense}
              onChangeLicense={viewMode === 'repositories' ? setSelectedLicense : undefined}
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
          )}
          {viewMode === 'repositories' && (
            <div className="hidden md:block md:col-span-3">
              <FiltersPanel
                className="rounded-md md:sticky md:top-4"
                selectedLabels={[]}
                onToggleLabel={() => {}}
                selectedLanguage={selectedLanguage}
                onChangeLanguage={setSelectedLanguage}
              selectedLicense={selectedLicense}
              onChangeLicense={setSelectedLicense}
                showTags={false}
              />
            </div>
          )}
          <div className={viewMode === 'issues' ? 'md:col-span-9' : 'md:col-span-9'}>
            {viewMode === 'issues' ? (
              <IssueList className="rounded-md" query={query} naturalLanguageFilter={selectedNaturalLanguages} />
            ) : (
            <RepositoryList className="rounded-md" language={selectedLanguage} license={selectedLicense} />
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export default HomePage

