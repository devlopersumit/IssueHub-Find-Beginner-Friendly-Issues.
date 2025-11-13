import React from 'react'
import { Link } from 'react-router-dom'

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

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800 bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      <div className="absolute -top-24 right-[-10%] h-64 w-64 rounded-full bg-slate-200/50 blur-3xl dark:bg-slate-600/10" aria-hidden="true" />
      <div className="absolute -bottom-16 left-[-5%] h-72 w-72 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-500/10" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-gray-700 dark:bg-gray-900 dark:text-slate-300">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              Live open source intelligence
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl lg:text-6xl">
                Find the right issues, join the right teams, build open source faster.
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-300 sm:text-lg lg:text-xl">
                IssueFinder curates the open-source universe into a focused catalog so you can discover high-impact repositories, filter by the skills you have, and ship value from day one.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                to="/home"
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-slate-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-slate-100 dark:text-gray-900 dark:hover:bg-slate-200"
              >
                Explore the catalog
              </Link>
              <Link
                to="/bounty"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-6 py-3 text-base font-semibold text-slate-800 transition-colors duration-200 hover:border-slate-400 hover:text-slate-900 dark:border-gray-700 dark:text-slate-200 dark:hover:border-gray-500 dark:hover:text-white"
              >
                View bounty issues
              </Link>
            </div>

            <div className="flex items-center justify-center gap-3 text-sm text-slate-500 dark:text-slate-400 lg:justify-start">
              <svg className="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Updated hourly with only unassigned, contributor-friendly work.
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-white/80 bg-white/70 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-900/60 dark:shadow-black/20">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Why developers choose IssueFinder</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Stay focused on shipping</h2>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  Skip the generic issue lists. Targeted filters and curated metadata put the right opportunities in front of you faster.
                </p>
              </div>
              <dl className="grid grid-cols-2 gap-4 sm:gap-6">
                {highlights.map((item) => (
                  <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-left dark:border-gray-700 dark:bg-gray-800/60">
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.label}</dt>
                    <dd className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{item.value}</dd>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{item.description}</p>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero