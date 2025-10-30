import React, { useMemo, useState } from 'react'
import Header from './components/Header'
import FiltersPanel from './components/FiltersPanel'
import IssueList from './components/IssueList'

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [submittedSearch, setSubmittedSearch] = useState<string>('')
  const [selectedLabels, setSelectedLabels] = useState<string[]>(['good first issue'])
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>('javascript')
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false)

  const toggleLabel = (label: string) => {
    setSelectedLabels((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]))
  }

  const onSubmitSearch = () => {
    setSubmittedSearch(searchTerm.trim())
  }

  const query = useMemo(() => {
    const parts: string[] = []
    if (submittedSearch) parts.push(submittedSearch)
    parts.push('state:open')
    selectedLabels.forEach((l) => parts.push(`label:"${l}"`))
    if (selectedLanguage) parts.push(`language:${selectedLanguage}`)
    return parts.join(' ')
  }, [submittedSearch, selectedLabels, selectedLanguage])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="IssueHub"
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSubmitSearch={onSubmitSearch}
      />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="md:hidden mb-4 flex justify-between">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
            onClick={() => setShowMobileFilters((v) => !v)}
          >
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
            />
          </div>
          <div className="md:col-span-9">
            <IssueList className="rounded-md" query={query} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
