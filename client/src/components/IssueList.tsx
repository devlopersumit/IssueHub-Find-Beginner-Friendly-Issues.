import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useFetchIssues } from '../hooks/useFetchIssues'
import DifficultyBadge from './DifficultyBadge'
import { detectDifficulty } from '../utils/difficulty'
import type { NaturalLanguage } from '../utils/languageDetection'
import { filterByLanguage } from '../utils/languageDetection'
import { fetchRepositoryLanguages } from '../utils/repoLanguages'

type IssueListProps = {
  className?: string
  query: string
  naturalLanguageFilter?: NaturalLanguage[]
}

const IssueList: React.FC<IssueListProps> = ({ className = '', query, naturalLanguageFilter = [] }) => {
  const [page, setPage] = useState<number>(1)
  const perPage = 20
  const [items, setItems] = useState<any[]>([])
  const [repoLanguages, setRepoLanguages] = useState<Record<string, string[]>>({})
  const languagesFetchedRef = useRef<Set<string>>(new Set())
  const { data, isLoading, error } = useFetchIssues(query, page, perPage)

  useEffect(() => {
    setPage(1)
    setItems([])
    languagesFetchedRef.current = new Set()
    setRepoLanguages({})
  }, [query])

  useEffect(() => {
    if (data?.items) {
      setItems(data.items)

      const newRepos = data.items
        .filter(item => item.repository_url && !languagesFetchedRef.current.has(item.repository_url))
        .map(item => item.repository_url)

      if (newRepos.length > 0) {
        const uniqueRepos = Array.from(new Set(newRepos))
        uniqueRepos.forEach(async (repoUrl) => {
          if (!languagesFetchedRef.current.has(repoUrl)) {
            languagesFetchedRef.current.add(repoUrl)
            const languages = await fetchRepositoryLanguages(repoUrl)
            if (languages.length > 0) {
              setRepoLanguages(prev => ({ ...prev, [repoUrl]: languages }))
            }
          }
        })
      }
    } else {
      setItems([])
    }
  }, [data])

  const filteredItems = useMemo(() => {
    if (naturalLanguageFilter.length === 0) {
      return items
    }
    return filterByLanguage(items, naturalLanguageFilter)
  }, [items, naturalLanguageFilter])

  const totalCount = data?.total_count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage))
  const hasPrevPage = page > 1
  const hasNextPage = page < totalPages
  const displayItems = filteredItems
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'opened today'
    if (diffDays === 1) return 'opened yesterday'
    if (diffDays < 7) return `opened ${diffDays} days ago`
    if (diffDays < 30) return `opened ${Math.floor(diffDays / 7)} weeks ago`
    return `opened ${Math.floor(diffDays / 30)} months ago`
  }

  const getLabelIcon = (labelName: string) => {
    const labelLower = labelName.toLowerCase()
    
    if (labelLower.includes('bug') || labelLower.includes('error')) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
      )
    }
    
    if (labelLower.includes('feature') || labelLower.includes('enhancement') || labelLower.includes('improvement')) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }
    
    if (labelLower.includes('doc') || labelLower.includes('documentation') || labelLower.includes('wiki')) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      )
    }
    
    if (labelLower.includes('refactor') || labelLower.includes('cleanup') || labelLower.includes('code quality')) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
      )
    }
    
    if (labelLower.includes('performance') || labelLower.includes('optimization') || labelLower.includes('speed')) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      )
    }
    
    if (labelLower.includes('test') || labelLower.includes('qa') || labelLower.includes('coverage')) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    }
    
    if (labelLower.includes('question') || labelLower.includes('discussion') || labelLower.includes('help')) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      )
    }
    
    if (labelLower.includes('good first issue') || labelLower.includes('beginner') || labelLower.includes('first-timers-only') || labelLower.includes('starter')) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      )
    }
    
    if (labelLower.includes('help wanted') || labelLower.includes('contributions welcome')) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      )
    }
    
    if (labelLower.includes('security') || labelLower.includes('vulnerability') || labelLower.includes('cve')) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    }
    
    if (labelLower.includes('ui') || labelLower.includes('ux') || labelLower.includes('design') || labelLower.includes('frontend')) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
        </svg>
      )
    }
    
    if (labelLower.includes('backend') || labelLower.includes('api') || labelLower.includes('server')) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
      )
    }
    
    return null
  }

  const shouldShowSkeleton = displayItems.length === 0 && isLoading

  return (
    <section className={`relative w-full max-w-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xs transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900 ${className}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-48 max-w-4xl rounded-b-[4rem] bg-linear-to-b from-emerald-200/40 via-slate-100/50 to-transparent dark:from-emerald-500/10 dark:via-gray-800/10" aria-hidden="true" />
      <div className="relative p-4 sm:p-6 md:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-300">Live issue feed</p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Spot contributor-friendly tickets fast</h2>
          </div>
          <div className="inline-flex max-w-sm items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-xs dark:border-gray-700 dark:bg-gray-800 dark:text-slate-300">
            {isLoading && displayItems.length === 0 ? (
              <>
                <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing opportunities…
              </>
            ) : error ? (
              <span className="text-red-600 dark:text-red-400">
                {error.message.includes('rate limit')
                  ? 'GitHub API rate limit reached. Try again shortly.'
                  : error.message.includes('forbidden')
                  ? 'GitHub API access blocked. Adjust filters or retry.'
                  : 'Error loading issues'}
              </span>
            ) : (
              <>
                <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10A8 8 0 112 10a8 8 0 0116 0zm-9-3a1 1 0 112 0v4a1 1 0 01-.293.707l-2 2a1 1 0 11-1.414-1.414L9 10.586V7z" clipRule="evenodd" />
                </svg>
                {totalCount.toLocaleString()} curated {totalCount === 1 ? 'issue' : 'issues'}
              </>
            )}
          </div>
        </div>

        {displayItems.length === 0 && !isLoading && !error && (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-12 text-center dark:border-gray-700 dark:bg-gray-800/40">
            <svg className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">No issues match your filters yet</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try loosening a filter or explore a different language category.</p>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {shouldShowSkeleton
            ? Array.from({ length: 6 }).map((_, idx) => (
                <article
                  key={`placeholder-${idx}`}
                  className="h-full w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-xs animate-pulse dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="h-4 w-2/3 rounded-sm bg-slate-200 dark:bg-gray-700" />
                    <div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-gray-700" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full rounded-sm bg-slate-200 dark:bg-gray-700" />
                    <div className="h-3 w-3/4 rounded-sm bg-slate-200 dark:bg-gray-700" />
                    <div className="h-3 w-1/2 rounded-sm bg-slate-200 dark:bg-gray-700" />
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="h-4 rounded-sm bg-slate-200 dark:bg-gray-700" />
                    <div className="h-4 rounded-sm bg-slate-200 dark:bg-gray-700" />
                    <div className="h-4 rounded-sm bg-slate-200 dark:bg-gray-700" />
                    <div className="h-4 rounded-sm bg-slate-200 dark:bg-gray-700" />
                  </div>
                </article>
              ))
            : displayItems.map((issue: any) => {
                const repo = issue.repository_url?.split('/').slice(-2).join('/')
                const difficulty = detectDifficulty(issue.labels || [])
                const repoLangs = repoLanguages[issue.repository_url] || []
                const primaryLanguage = repoLangs.length > 0 ? repoLangs[0] : null

                return (
                  <a
                    key={issue.id}
                    href={issue.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex h-full w-full flex-col rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md focus:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">{repo}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">Issue #{issue.number}</p>
                      </div>
                      <DifficultyBadge difficulty={difficulty} />
                    </div>

                    <h3 className="mt-3 w-full text-sm font-semibold leading-snug text-slate-900 transition group-hover:text-slate-600 dark:text-slate-100 dark:group-hover:text-slate-200 sm:text-base">
                      {issue.title}
                    </h3>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-300 sm:gap-3">
                      <span className="inline-flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Opened {formatDate(issue.created_at)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M18 13V5a3 3 0 00-3-3H5a3 3 0 00-3 3v8a3 3 0 003 3h1v2.382a.5.5 0 00.79.407L10.5 16H15a3 3 0 003-3z" />
                        </svg>
                        {issue.comments} comments
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                        </svg>
                        {issue.state === 'open' ? 'No assignee' : 'Closed'}
                      </span>
                      {primaryLanguage && (
                        <span className="inline-flex items-center gap-1">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                          </svg>
                          {primaryLanguage}
                        </span>
                      )}
                    </div>

                    {issue.labels && issue.labels.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1">
                        {issue.labels.slice(0, 3).map((l: any, i: number) => {
                          const labelLower = l.name.toLowerCase()
                          const icon = getLabelIcon(l.name || '')
                          const dotColors: Record<string, string> = {
                            'good first issue': 'bg-emerald-400',
                            'help wanted': 'bg-sky-400',
                            'enhancement': 'bg-violet-400',
                            'bug': 'bg-rose-400',
                            'feature': 'bg-indigo-400',
                            'documentation': 'bg-amber-400'
                          }
                          const dot = dotColors[labelLower] || 'bg-slate-400'

                          return (
                            <span
                              key={`${issue.id}-label-${i}`}
                              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-300"
                            >
                              {icon && <span className="shrink-0 text-slate-400">{icon}</span>}
                              <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                              {l.name}
                            </span>
                          )
                        })}
                        {issue.labels.length > 3 && (
                          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:border-gray-700 dark:bg-gray-700/60 dark:text-slate-300">
                            +{issue.labels.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </a>
                )
              })}
        </div>

        {totalCount > 0 && (
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-600 shadow-xs transition hover:border-emerald-300 hover:text-emerald-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 dark:border-emerald-900/40 dark:bg-gray-800 dark:text-emerald-300 dark:hover:border-emerald-700 dark:hover:text-emerald-200"
              disabled={!hasPrevPage || isLoading}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/10 dark:text-emerald-300">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h3.382a1 1 0 01.894.553l1.447 2.894A1 1 0 0010.618 7H19a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
              </svg>
              Page {page} of {totalPages}
              <span className="hidden text-slate-500 dark:text-slate-300 sm:inline">•</span>
              <span className="hidden text-slate-600 dark:text-slate-300 sm:inline">{totalCount.toLocaleString()} total issues</span>
            </div>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-600 shadow-xs transition hover:border-emerald-300 hover:text-emerald-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 dark:border-emerald-900/40 dark:bg-gray-800 dark:text-emerald-300 dark:hover:border-emerald-700 dark:hover:text-emerald-200"
              disabled={!hasNextPage || isLoading}
            >
              Next
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default IssueList


