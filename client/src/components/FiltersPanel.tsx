import React, { useState } from 'react'

type FiltersPanelProps = {
  className?: string
  selectedLabels: string[]
  onToggleLabel: (label: string) => void
  selectedLanguage: string | null
  onChangeLanguage: (language: string | null) => void
  showTags?: boolean
  selectedCategories?: string[]
  onToggleCategory?: (category: string) => void
  isMobile?: boolean

  // Advanced filters
  selectedDifficulty?: string | null
  onChangeDifficulty?: (difficulty: string | null) => void
  selectedType?: string | null
  onChangeType?: (type: string | null) => void
  selectedFramework?: string | null
  onChangeFramework?: (framework: string | null) => void
  selectedLastActivity?: string | null
  onChangeLastActivity?: (activity: string | null) => void
  selectedLicense?: string | null
  onChangeLicense?: (license: string | null) => void
}

// Simplified categories 
const ISSUE_CATEGORIES = [
  { key: 'all', label: 'All Issues' },
  { key: 'good first issue', label: 'Good First Issue' },
  { key: 'help wanted', label: 'Help Wanted' },
  { key: 'bug', label: 'Bug' },
  { key: 'feature', label: 'Feature' },
  { key: 'documentation', label: 'Documentation' },
]

// Most popular languages only
const POPULAR_LANGUAGES = [
  { key: null, label: 'Any Language' },
  { key: 'javascript', label: 'JavaScript' },
  { key: 'typescript', label: 'TypeScript' },
  { key: 'python', label: 'Python' },
  { key: 'java', label: 'Java' },
  { key: 'go', label: 'Go' },
  { key: 'rust', label: 'Rust' },
  { key: 'cpp', label: 'C++' },
  { key: 'csharp', label: 'C#' },
  { key: 'php', label: 'PHP' },
  { key: 'ruby', label: 'Ruby' },
]

const DIFFICULTY_LEVELS = [
  { key: null, label: 'Any Difficulty', color: 'gray' },
  { key: 'beginner', label: 'Beginner', color: 'green' },
  { key: 'intermediate', label: 'Intermediate', color: 'yellow' },
  { key: 'advanced', label: 'Advanced', color: 'red' },
]

const ISSUE_TYPES = [
  { key: null, label: 'Any Type' },
  { key: 'bug', label: 'Bug' },
  { key: 'feature', label: 'Feature' },
  { key: 'documentation', label: 'Documentation' },
  { key: 'refactor', label: 'Refactor' },
  { key: 'testing', label: 'Testing' },
]

// Most popular frameworks only
const POPULAR_FRAMEWORKS = [
  { key: null, label: 'Any Framework' },
  { key: 'react', label: 'React' },
  { key: 'vue', label: 'Vue.js' },
  { key: 'angular', label: 'Angular' },
  { key: 'nextjs', label: 'Next.js' },
  { key: 'express', label: 'Express' },
  { key: 'django', label: 'Django' },
  { key: 'flask', label: 'Flask' },
  { key: 'rails', label: 'Rails' },
]

const LAST_ACTIVITY_OPTIONS = [
  { key: null, label: 'Any Time' },
  { key: 'last-week', label: 'Updated Last Week' },
  { key: 'last-month', label: 'Updated Last Month' },
  { key: 'last-3months', label: 'Updated Last 3 Months' },
  { key: 'active', label: 'Active Maintainers' },
]

const CURATED_LABELS = [
  { key: 'good first issue', label: 'Good First Issue', description: 'Perfect for first-time contributors' },
  { key: 'help wanted', label: 'Help Wanted', description: 'Maintainers actively looking for help' },
  { key: 'documentation', label: 'Documentation', description: 'Improve docs, guides, and examples' },
  { key: 'bug', label: 'Bug', description: 'Track down and fix critical bugs' },
  { key: 'feature', label: 'Feature', description: 'Build new functionality and enhancements' },
  { key: 'hacktoberfest', label: 'Hacktoberfest', description: 'Eligible for seasonal Hacktoberfest events' },
  { key: 'performance', label: 'Performance', description: 'Optimize code paths and benchmarks' },
  { key: 'security', label: 'Security', description: 'Hardening, audits, and vulnerability fixes' },
]

const POPULAR_LICENSES = [
  { key: null, label: 'Any License' },
  { key: 'mit', label: 'MIT' },
  { key: 'apache-2.0', label: 'Apache 2.0' },
  { key: 'gpl-3.0', label: 'GPL 3.0' },
  { key: 'bsd-3-clause', label: 'BSD 3-Clause' },
  { key: 'mpl-2.0', label: 'Mozilla 2.0' },
  { key: 'agpl-3.0', label: 'AGPL 3.0' },
  { key: 'lgpl-3.0', label: 'LGPL 3.0' },
]

const FiltersPanel: React.FC<FiltersPanelProps> = ({ 
  className = '', 
  selectedLabels, 
  onToggleLabel, 
  selectedLanguage, 
  onChangeLanguage, 
  showTags = true,
  selectedCategories = [],
  onToggleCategory,
  isMobile = false,
  selectedDifficulty = null,
  onChangeDifficulty,
  selectedType = null,
  onChangeType,
  selectedFramework = null,
  onChangeFramework,
  selectedLastActivity = null,
  onChangeLastActivity,
  selectedLicense = null,
  onChangeLicense,
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    difficulty: true,
    type: false,
    category: false,
    language: false,
    framework: false,
    activity: false,
    tags: true,
    license: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleCategoryToggle = (category: string) => {
    if (!onToggleCategory) return
    
    if (category === 'all') {
      selectedCategories.forEach(c => onToggleCategory(c))
    } else {
      if (selectedCategories.includes('all')) {
        onToggleCategory('all')
      }
      onToggleCategory(category)
    }
  }

  const getDifficultyColor = (difficulty: string | null) => {
    if (!difficulty) return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
    if (difficulty === 'beginner') return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700'
    if (difficulty === 'intermediate') return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700'
    if (difficulty === 'advanced') return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700'
    return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
  }

  const handleClearFilters = () => {
    if (onChangeDifficulty) onChangeDifficulty(null)
    if (onChangeType) onChangeType(null)
    if (onChangeFramework) onChangeFramework(null)
    if (onChangeLastActivity) onChangeLastActivity(null)
    if (onChangeLicense) onChangeLicense(null)
    onChangeLanguage(null)
    if (onToggleCategory) {
      selectedCategories.forEach(c => onToggleCategory(c))
    }
    if (onToggleLabel) {
      selectedLabels.forEach(label => onToggleLabel(label))
    }
  }

  const hasActiveFilters =
    !!selectedDifficulty ||
    !!selectedType ||
    !!selectedFramework ||
    !!selectedLastActivity ||
    !!selectedLanguage ||
    (!!onChangeLicense && !!selectedLicense) ||
    (selectedCategories && selectedCategories.length > 0 && !selectedCategories.includes('all')) ||
    (selectedLabels && selectedLabels.length > 0)

  return (
    <aside className={`rounded-2xl border border-slate-200 bg-white/95 shadow-xs transition-colors duration-200 dark:border-gray-700 dark:bg-gray-900 ${className}`}>
      <div className="p-5 sm:p-6">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </h2>

        <div className="space-y-5">
          {/* Curated Tags */}
          {showTags && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
              <button
                type="button"
                onClick={() => toggleSection('tags')}
                className="flex w-full items-center justify-between text-sm font-semibold text-slate-800 transition hover:text-slate-900 dark:text-slate-100 dark:hover:text-slate-200"
              >
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a2 2 0 012-2h3.586a1 1 0 01.707.293l9.414 9.414a2 2 0 010 2.828l-3.172 3.172a2 2 0 01-2.828 0L4.293 8.121A1 1 0 014 7.414V5z" />
                  </svg>
                  High-signal tags
                </span>
                <svg
                  className={`h-4 w-4 transition-transform ${expandedSections.tags ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {expandedSections.tags && (
                <div className="mt-3 space-y-2">
                  {CURATED_LABELS.map((tag) => {
                    const active = selectedLabels.includes(tag.key)
                    return (
                      <button
                        key={tag.key}
                        type="button"
                        onClick={() => onToggleLabel(tag.key)}
                        className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                          active
                            ? 'border-slate-600 bg-slate-900 text-white shadow-xs dark:border-slate-500 dark:bg-slate-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:border-gray-700 dark:bg-gray-900 dark:text-slate-300 dark:hover:border-gray-600 dark:hover:bg-gray-800'
                        }`}
                      >
                        <div className="text-sm font-semibold leading-tight">{tag.label}</div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{tag.description}</p>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Difficulty Filter - Always Visible, Most Important */}
          {showTags && onChangeDifficulty && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => toggleSection('difficulty')}
                className="flex w-full items-center justify-between text-sm font-semibold text-gray-900 transition hover:text-slate-800 dark:text-gray-100 dark:hover:text-slate-200"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Difficulty Level
                </span>
                <svg 
                  className={`w-4 h-4 transition-transform ${expandedSections.difficulty ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSections.difficulty && (
                <div className="grid grid-cols-2 gap-2">
                  {DIFFICULTY_LEVELS.map((opt) => (
                    <button
                      key={String(opt.key)}
                      type="button"
                      onClick={() => onChangeDifficulty(opt.key ?? null)}
                      className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                        (selectedDifficulty ?? '') === (opt.key ?? '')
                          ? `${getDifficultyColor(opt.key)} shadow-xs`
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-slate-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-slate-500'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Type Filter */}
          {showTags && onChangeType && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => toggleSection('type')}
                className="flex w-full items-center justify-between text-sm font-semibold text-gray-900 transition hover:text-slate-800 dark:text-gray-100 dark:hover:text-slate-200"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Issue Type
                </span>
                <svg 
                  className={`w-4 h-4 transition-transform ${expandedSections.type ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSections.type && (
                <div className="flex flex-wrap gap-2">
                  {ISSUE_TYPES.map((opt) => (
                    <button
                      key={String(opt.key)}
                      type="button"
                      onClick={() => onChangeType(opt.key ?? null)}
                      className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${
                        (selectedType ?? '') === (opt.key ?? '')
                          ? 'border-slate-600 bg-slate-700 text-white dark:border-slate-500 dark:bg-slate-600'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-slate-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-slate-500'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Categories */}
          {showTags && onToggleCategory && !isMobile && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => toggleSection('category')}
                className="flex w-full items-center justify-between text-sm font-semibold text-gray-900 transition hover:text-slate-800 dark:text-gray-100 dark:hover:text-slate-200"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Categories
                </span>
                <svg 
                  className={`w-4 h-4 transition-transform ${expandedSections.category ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSections.category && (
                <div className="flex flex-wrap gap-2">
                  {ISSUE_CATEGORIES.map((cat) => {
                    const active = selectedCategories.includes(cat.key) || (cat.key === 'all' && selectedCategories.length === 0)
                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => handleCategoryToggle(cat.key)}
                        className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${
                          active
                            ? 'border-slate-600 bg-slate-700 text-white dark:border-slate-500 dark:bg-slate-600'
                            : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-slate-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-slate-500'
                        }`}
                      >
                        {cat.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Language Filter */}
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xs dark:border-gray-700 dark:bg-gray-900">
            <button
              type="button"
              onClick={() => toggleSection('language')}
              className="flex w-full items-center justify-between text-sm font-semibold text-slate-800 hover:text-slate-900 dark:text-slate-100 dark:hover:text-slate-200"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Language
              </span>
              <svg 
                className={`w-4 h-4 transition-transform ${expandedSections.language ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.language && (
              <div className="mt-3 grid max-h-48 grid-cols-2 gap-2 overflow-y-auto pr-1 custom-scrollbar">
                {POPULAR_LANGUAGES.map((opt) => (
                  <button
                    key={String(opt.key)}
                    type="button"
                    onClick={() => onChangeLanguage(opt.key ?? null)}
                    className={`rounded-md border px-3 py-1.5 text-xs font-medium transition text-left ${
                      (selectedLanguage ?? '') === (opt.key ?? '')
                        ? 'border-slate-600 bg-slate-700 text-white dark:border-slate-500 dark:bg-slate-600'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-slate-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-slate-500'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* License Filter */}
          {onChangeLicense && (
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xs dark:border-gray-700 dark:bg-gray-900">
              <button
                type="button"
                onClick={() => toggleSection('license')}
                className="flex w-full items-center justify-between text-sm font-semibold text-slate-800 hover:text-slate-900 dark:text-slate-100 dark:hover:text-slate-200"
              >
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 7l7-4 7 4m-2 4l-5 3-5-3m0 4l5 3 5-3" />
                  </svg>
                  License
                </span>
                <svg
                  className={`h-4 w-4 transition-transform ${expandedSections.license ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSections.license && (
                <div className="mt-3 grid grid-cols-1 gap-2">
                  {POPULAR_LICENSES.map((opt) => (
                    <button
                      key={String(opt.key)}
                      type="button"
                      onClick={() => onChangeLicense(opt.key ?? null)}
                      className={`flex items-center justify-between rounded-md border px-3 py-1.5 text-xs font-medium transition ${
                        (selectedLicense ?? '') === (opt.key ?? '')
                          ? 'border-slate-600 bg-slate-900 text-white shadow-xs dark:border-slate-500 dark:bg-slate-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-100 dark:border-gray-700 dark:bg-gray-900 dark:text-slate-300 dark:hover:border-gray-600 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {(selectedLicense ?? '') === (opt.key ?? '') && (
                        <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Framework Filter */}
          {showTags && onChangeFramework && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => toggleSection('framework')}
                className="flex w-full items-center justify-between text-sm font-semibold text-gray-900 transition hover:text-slate-800 dark:text-gray-100 dark:hover:text-slate-200"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Framework
                </span>
                <svg 
                  className={`w-4 h-4 transition-transform ${expandedSections.framework ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSections.framework && (
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {POPULAR_FRAMEWORKS.map((opt) => (
                    <button
                      key={String(opt.key)}
                      type="button"
                      onClick={() => onChangeFramework(opt.key ?? null)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all text-left ${
                        (selectedFramework ?? '') === (opt.key ?? '')
                          ? 'bg-slate-700 dark:bg-slate-600 text-white border-slate-700 dark:border-slate-600'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Last Activity Filter */}
          {showTags && onChangeLastActivity && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => toggleSection('activity')}
                className="flex w-full items-center justify-between text-sm font-semibold text-gray-900 transition hover:text-slate-800 dark:text-gray-100 dark:hover:text-slate-200"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Last Activity
                </span>
                <svg 
                  className={`w-4 h-4 transition-transform ${expandedSections.activity ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSections.activity && (
                <div className="space-y-1">
                  {LAST_ACTIVITY_OPTIONS.map((opt) => (
                    <button
                      key={String(opt.key)}
                      type="button"
                      onClick={() => onChangeLastActivity(opt.key ?? null)}
                      className={`w-full rounded-md border px-3 py-1.5 text-xs font-medium transition text-left ${
                        (selectedLastActivity ?? '') === (opt.key ?? '')
                          ? 'border-slate-600 bg-slate-700 text-white dark:border-slate-500 dark:bg-slate-600'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-slate-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-slate-500'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-200 dark:hover:border-gray-600 dark:hover:text-white"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}

export default FiltersPanel
