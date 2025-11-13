import React, { useMemo, useState, useEffect } from 'react'
import FiltersPanel from '../components/FiltersPanel'
import IssueList from '../components/IssueList'
import RepositoryList from '../components/RepositoryList'
import MobileCategoryTabs from '../components/MobileCategoryTabs'
import { Link } from 'react-router-dom'
import { useSearch } from '../contexts/SearchContext'
import { useFilterPreferences } from '../contexts/FilterPreferencesContext'
import { useFiltersToggle } from '../contexts/FiltersToggleContext'
import { buildGitHubQuery } from '../utils/queryBuilder'

type ViewMode = 'issues' | 'repositories'

const HomePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('issues')
  const { submittedSearch } = useSearch()
  const { 
    preferences, 
    updateNaturalLanguages, 
    updateLocation,
    updateSelectedLanguage,
    updateSelectedDifficulty,
    updateSelectedType,
    updateSelectedFramework,
    updateSelectedLastActivity,
    updateSelectedLicense,
    isDetectingLocation
  } = useFilterPreferences()
  
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false)
  const { setToggleFilters } = useFiltersToggle()

  // Register toggle function with context
  useEffect(() => {
    setToggleFilters(() => {
      setShowMobileFilters((v) => !v)
    })
  }, [setToggleFilters])

  // Use preferences from context
  const selectedLanguage = preferences.selectedLanguage
  const selectedLicense = preferences.selectedLicense
  const selectedNaturalLanguages = preferences.naturalLanguages
  const selectedLocation = preferences.location
  const selectedDifficulty = preferences.selectedDifficulty
  const selectedType = preferences.selectedType
  const selectedFramework = preferences.selectedFramework
  const selectedLastActivity = preferences.selectedLastActivity

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
      selectedLanguage: selectedLanguage,
      selectedLicense: selectedLicense,
      selectedDifficulty: selectedDifficulty,
      selectedType: selectedType,
      selectedFramework: selectedFramework,
      selectedLastActivity: selectedLastActivity,
    })
  }, [submittedSearch, selectedLabels, selectedCategories, selectedLanguage, selectedLicense, selectedDifficulty, selectedType, selectedFramework, selectedLastActivity])

  return (
    <>
      <main id="catalog" className="mx-auto max-w-7xl px-4 py-8">
        {/* Show loading indicator when detecting location */}
        {isDetectingLocation && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Auto-detecting your location to configure filters...</span>
            </div>
          </div>
        )}
        
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
        </div>
        {showMobileFilters && (
          <div className="md:hidden mb-4">
            <FiltersPanel
              className="rounded-md"
              selectedLabels={selectedLabels}
              onToggleLabel={toggleLabel}
              selectedLanguage={selectedLanguage}
              onChangeLanguage={updateSelectedLanguage}
              selectedLicense={viewMode === 'repositories' ? selectedLicense : null}
              onChangeLicense={viewMode === 'repositories' ? updateSelectedLicense : undefined}
              showTags={viewMode === 'issues'}
              selectedCategories={selectedCategories}
              onToggleCategory={toggleCategory}
              isMobile={true}
              selectedDifficulty={selectedDifficulty}
              onChangeDifficulty={updateSelectedDifficulty}
              selectedType={selectedType}
              onChangeType={updateSelectedType}
              selectedFramework={selectedFramework}
              onChangeFramework={updateSelectedFramework}
              selectedLastActivity={selectedLastActivity}
              onChangeLastActivity={updateSelectedLastActivity}
              selectedLocation={viewMode === 'issues' ? selectedLocation : null}
              onChangeLocation={viewMode === 'issues' ? updateLocation : undefined}
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
                onChangeLanguage={updateSelectedLanguage}
                selectedCategories={selectedCategories}
                onToggleCategory={toggleCategory}
                selectedDifficulty={selectedDifficulty}
                onChangeDifficulty={updateSelectedDifficulty}
                selectedType={selectedType}
                onChangeType={updateSelectedType}
                selectedFramework={selectedFramework}
                onChangeFramework={updateSelectedFramework}
                selectedLastActivity={selectedLastActivity}
                onChangeLastActivity={updateSelectedLastActivity}
                selectedLocation={selectedLocation}
                onChangeLocation={updateLocation}
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
                onChangeLanguage={updateSelectedLanguage}
                selectedLicense={selectedLicense}
                onChangeLicense={updateSelectedLicense}
                showTags={false}
              />
            </div>
          )}
          <div className={viewMode === 'issues' ? 'md:col-span-9' : 'md:col-span-9'}>
            {viewMode === 'issues' ? (
              <IssueList 
                className="rounded-md" 
                query={query} 
                naturalLanguageFilter={selectedNaturalLanguages}
                locationFilter={selectedLocation}
              />
            ) : (
            <RepositoryList className="rounded-md" language={selectedLanguage} license={selectedLicense} />
            )}
          </div>
        </div>

        {/* Bounty Issues Section - Before Footer */}
        <section className="mt-16 mb-8 rounded-3xl border border-slate-200 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 px-6 py-12 shadow-lg dark:border-gray-700 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:border-amber-800 dark:bg-gray-800/80 dark:text-amber-400">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
              Earn While Contributing
            </div>
            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">
              Discover Paid Open Source Opportunities
            </h2>
            <p className="mb-8 text-lg text-slate-600 dark:text-slate-300">
              Find issues with bounties attached. Get paid for contributing to open source projects while building your portfolio and skills.
            </p>
            <Link
              to="/bounty"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-amber-500/30 transition-all duration-200 hover:from-amber-600 hover:to-orange-600 hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
              Check Bounty Issues
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}

export default HomePage

