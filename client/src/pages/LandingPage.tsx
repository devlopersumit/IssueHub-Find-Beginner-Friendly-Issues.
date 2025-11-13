import React from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'

type Highlight = {
  label: string
  value: string
  description: string
}

const highlights: Highlight[] = [
  {
    label: 'Fresh Issues',
    value: '1.2k+',
    description: 'Active tickets ready for contribution',
  },
  {
    label: 'Languages',
    value: '25',
    description: 'Auto-detected tech stacks and tags',
  },
  {
    label: 'Curated Repos',
    value: '320',
    description: 'Hand reviewed projects worth your time',
  },
  {
    label: 'Filters',
    value: '40+',
    description: 'Dial in difficulty, type, and frameworks',
  },
]

const LandingPage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-2xl border border-slate-200 bg-white/70 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-900/60 dark:shadow-black/20">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Platform Statistics</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Real numbers from our curated open-source catalog
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {highlights.map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50/70 p-6 text-center dark:border-gray-700 dark:bg-gray-800/60">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.label}</dt>
                <dd className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">{item.value}</dd>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-3xl border border-slate-200 bg-linear-to-br from-slate-50 via-white to-slate-100 px-8 py-12 text-center shadow-lg dark:border-gray-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl">
            Ready to start contributing?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Explore our curated catalog of beginner-friendly issues and find the perfect project to contribute to.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/home"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-slate-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-slate-100 dark:text-gray-900 dark:hover:bg-slate-200"
            >
              Explore the Catalog
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              to="/bounty"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-8 py-3 text-base font-semibold text-slate-800 transition-colors duration-200 hover:border-slate-400 hover:text-slate-900 dark:border-gray-700 dark:text-slate-200 dark:hover:border-gray-500 dark:hover:text-white"
            >
              View Bounty Issues
            </Link>
          </div>
        </div>
      </section>

      {/* About Section (CTA to About Page) */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-12 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
                Learn more about IssueFinder
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Discover the story behind IssueFinder, our mission to make open-source contribution easier, and meet the team that built this platform.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-200 dark:hover:border-gray-600 dark:hover:text-white"
              >
                Learn More
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 dark:border-gray-700 dark:bg-gray-800">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-gray-900">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Curated Quality</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      Every issue is hand-reviewed to ensure it's beginner-friendly and ready for contribution.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-gray-900">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Smart Filtering</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      Filter by language, difficulty, framework, and more to find exactly what you're looking for.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-gray-900">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Always Updated</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      Our catalog is updated hourly with fresh, unassigned issues ready for contribution.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default LandingPage

