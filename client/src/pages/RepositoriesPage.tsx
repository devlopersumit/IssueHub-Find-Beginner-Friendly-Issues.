import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FiltersPanel from '../components/FiltersPanel'
import RepositoryList from '../components/RepositoryList'

const RepositoriesPage: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
  const [selectedLicense, setSelectedLicense] = useState<string | null>(null)
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false)

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-8 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Repository explorer</p>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Explore open-source repositories</h1>
            <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              Browse projects that meet our baseline quality thresholds and use filtering to narrow by language or license before diving into the details.
            </p>
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
      </header>

      <div className="mb-4 flex justify-end md:hidden">
        <button
          type="button"
          onClick={() => setShowMobileFilters((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-200 dark:hover:border-gray-600 dark:hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {showMobileFilters ? 'Hide filters' : 'Show filters'}
        </button>
      </div>

      {showMobileFilters && (
        <div className="mb-6 md:hidden">
          <FiltersPanel
            className="rounded-2xl"
            selectedLabels={[]}
            onToggleLabel={() => {}}
            selectedLanguage={selectedLanguage}
            onChangeLanguage={setSelectedLanguage}
            selectedLicense={selectedLicense}
            onChangeLicense={setSelectedLicense}
            showTags={false}
            selectedCategories={[]}
            onToggleCategory={() => {}}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <aside className="hidden md:block md:col-span-3">
          <FiltersPanel
            className="rounded-2xl md:sticky md:top-4"
            selectedLabels={[]}
            onToggleLabel={() => {}}
            selectedLanguage={selectedLanguage}
            onChangeLanguage={setSelectedLanguage}
            selectedLicense={selectedLicense}
            onChangeLicense={setSelectedLicense}
            showTags={false}
            selectedCategories={[]}
            onToggleCategory={() => {}}
          />
        </aside>
        <div className="md:col-span-9">
          <RepositoryList className="rounded-2xl" language={selectedLanguage} license={selectedLicense} />
        </div>
      </div>
    </main>
  )
}

export default RepositoriesPage
