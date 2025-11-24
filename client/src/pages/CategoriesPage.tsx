import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

type Category = {
  key: string
  label: string
  description: string
  icon: string
  color: string
  count?: string
}

const CATEGORIES: Category[] = [
  {
    key: 'good first issue',
    label: 'Good First Issue',
    description: 'Perfect for beginners starting their open source journey',
    icon: '🌱',
    color: 'emerald',
    count: '500+'
  },
  {
    key: 'help wanted',
    label: 'Help Wanted',
    description: 'Projects actively seeking contributors',
    icon: '🤝',
    color: 'blue',
    count: '1.2k+'
  },
  {
    key: 'bug',
    label: 'Bug Fixes',
    description: 'Issues that need debugging and fixing',
    icon: '🐛',
    color: 'red',
    count: '800+'
  },
  {
    key: 'feature',
    label: 'Features',
    description: 'New functionality and enhancements',
    icon: '✨',
    color: 'purple',
    count: '900+'
  },
  {
    key: 'documentation',
    label: 'Documentation',
    description: 'Improve docs and write guides',
    icon: '📚',
    color: 'amber',
    count: '400+'
  },
  {
    key: 'refactor',
    label: 'Refactoring',
    description: 'Code improvements and optimizations',
    icon: '🔧',
    color: 'indigo',
    count: '300+'
  },
  {
    key: 'testing',
    label: 'Testing',
    description: 'Add tests and improve coverage',
    icon: '🧪',
    color: 'teal',
    count: '250+'
  }
]

const POPULAR_LANGUAGES = [
  { key: 'javascript', label: 'JavaScript', icon: '🟨' },
  { key: 'typescript', label: 'TypeScript', icon: '🔷' },
  { key: 'python', label: 'Python', icon: '🐍' },
  { key: 'java', label: 'Java', icon: '☕' },
  { key: 'go', label: 'Go', icon: '🐹' },
  { key: 'rust', label: 'Rust', icon: '🦀' },
  { key: 'php', label: 'PHP', icon: '🐘' },
  { key: 'ruby', label: 'Ruby', icon: '💎' },
  { key: 'cpp', label: 'C++', icon: '⚙️' },
  { key: 'csharp', label: 'C#', icon: '🎯' },
]

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate()

  const handleCategoryClick = (categoryKey: string) => {
    navigate('/', { state: { category: categoryKey } })
  }

  const handleLanguageClick = (languageKey: string) => {
    navigate('/repositories', { state: { language: languageKey } })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-gray-700 dark:bg-gray-900 dark:text-slate-300 mb-4">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            Browse by Category
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl lg:text-6xl mb-4">
            Discover Issues by Category
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Explore open source issues organized by type, difficulty, and technology stack. Find the perfect contribution opportunity for you.
          </p>
        </div>

        {/* Issue Categories */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Issue Categories</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category) => {
              const colorClasses = {
                emerald: 'border-emerald-200 bg-emerald-50 hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-900/10 dark:hover:border-emerald-800',
                blue: 'border-blue-200 bg-blue-50 hover:border-blue-300 hover:bg-blue-100 dark:border-blue-900/40 dark:bg-blue-900/10 dark:hover:border-blue-800',
                red: 'border-red-200 bg-red-50 hover:border-red-300 hover:bg-red-100 dark:border-red-900/40 dark:bg-red-900/10 dark:hover:border-red-800',
                purple: 'border-purple-200 bg-purple-50 hover:border-purple-300 hover:bg-purple-100 dark:border-purple-900/40 dark:bg-purple-900/10 dark:hover:border-purple-800',
                amber: 'border-amber-200 bg-amber-50 hover:border-amber-300 hover:bg-amber-100 dark:border-amber-900/40 dark:bg-amber-900/10 dark:hover:border-amber-800',
                indigo: 'border-indigo-200 bg-indigo-50 hover:border-indigo-300 hover:bg-indigo-100 dark:border-indigo-900/40 dark:bg-indigo-900/10 dark:hover:border-indigo-800',
                teal: 'border-teal-200 bg-teal-50 hover:border-teal-300 hover:bg-teal-100 dark:border-teal-900/40 dark:bg-teal-900/10 dark:hover:border-teal-800',
              }

              return (
                <button
                  key={category.key}
                  onClick={() => handleCategoryClick(category.key)}
                  className={`text-left rounded-xl border p-6 transition-all hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 ${colorClasses[category.color as keyof typeof colorClasses]}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{category.icon}</span>
                    {category.count && (
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-white/60 dark:bg-gray-800/60 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    {category.label}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {category.description}
                  </p>
                </button>
              )
            })}
          </div>
        </section>

        {/* Popular Languages */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Browse by Language</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10">
            {POPULAR_LANGUAGES.map((lang) => (
              <button
                key={lang.key}
                onClick={() => handleLanguageClick(lang.key)}
                className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 dark:hover:bg-gray-700"
              >
                <span className="text-2xl">{lang.icon}</span>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200 text-center">
                  {lang.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-slate-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 dark:hover:bg-gray-700"
            >
              <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">All Issues</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Browse all open issues</p>
              </div>
            </Link>
            <Link
              to="/repositories"
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-slate-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 dark:hover:bg-gray-700"
            >
              <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">Repositories</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Explore projects</p>
              </div>
            </Link>
            <Link
              to="/bounty"
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-slate-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 dark:hover:bg-gray-700"
            >
              <svg className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">Bounty Issues</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Paid opportunities</p>
              </div>
            </Link>
            <Link
              to="/beginner-guide"
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-slate-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 dark:hover:bg-gray-700"
            >
              <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">Beginner Guide</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Get started guide</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default CategoriesPage

