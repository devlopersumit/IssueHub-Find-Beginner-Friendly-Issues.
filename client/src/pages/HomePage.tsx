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
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null)
  const [selectedLastActivity, setSelectedLastActivity] = useState<string | null>(null)

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
        {/* Beginner Guide CTA Section */}
        <div className="mb-10 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-8 shadow-lg">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-4 py-1.5 text-sm font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                New to Open Source?
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                Start Your Contribution Journey
              </h2>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl">
                Not sure where to start? Our comprehensive beginner's guide will walk you through everything you need to know - from setting up Git to making your first pull request. Perfect for all programming languages!
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Step-by-Step Guide
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  All Languages
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Beginner-Friendly
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Link
                to="/beginner-guide"
                className="inline-flex items-center gap-3 px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                View Beginner Guide
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <section className="mb-10 rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Explore repositories</p>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Find open-source projects you'll love</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Browse thousands of GitHub repositories. Filter by programming language and license to find projects that match your interests.
              </p>
            </div>
            <Link
              to="/repositories"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-200 dark:bg-slate-100 dark:text-gray-900 dark:hover:bg-slate-200"
            >
              Browse repositories
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Bounty Issues CTA Section */}
        <div className="mb-10 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-100/30 dark:from-amber-950/20 dark:via-orange-950/10 dark:to-amber-900/10 border border-amber-200/50 dark:border-amber-800/30 p-8 shadow-lg">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-900/30 px-4 py-1.5 text-sm font-semibold text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
                Earn While Contributing
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                Ready to <span className="text-amber-600 dark:text-amber-400">Start Contributing</span>?
              </h2>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl">
                Discover real bounty issues with cash prizes and rewards. Fix them, earn money, and build your reputation in the open-source community. Every contribution makes a difference!
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Real Bounty Issues
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified & Legitimate
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Updated Daily
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Link
                to="/bounty"
                className="inline-flex items-center gap-3 px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
                Explore Bounty Issues
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
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
              selectedLicense={viewMode === 'repositories' ? selectedLicense : null}
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

