import React, { useEffect, useState } from 'react'
import { useFetchRepositories } from '../hooks/useFetchRepositories'
import { useSearchRepository } from '../hooks/useSearchRepository'
import RepositoryModal from './RepositoryModal'

type RepositoryListProps = {
  className?: string
  language: string | null
  license: string | null
}

const RepositoryList: React.FC<RepositoryListProps> = ({ className = '', language, license }) => {
  const [page, setPage] = useState<number>(1)
  const [sort, setSort] = useState<'stars' | 'updated' | 'forks'>('stars')
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const perPage = 20
  const { data, isLoading, error } = useFetchRepositories(language, license, sort, page, perPage)
  const { results: searchResults, isLoading: isSearching, error: searchError } = useSearchRepository(searchQuery.trim() || null)
  
  const isSearchMode = searchQuery.trim().length >= 2
  const repositoryItems = data?.items ?? []
  const displayItems = isSearchMode ? searchResults : repositoryItems
  const displayLoading = isSearchMode ? isSearching : isLoading
  const displayError = isSearchMode ? searchError : error
  useEffect(() => {
    setPage(1)
  }, [language, license, sort])

  const totalCount = data?.total_count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage))
  const hasPrevPage = page > 1
  const hasNextPage = page < totalPages && !isSearchMode

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'updated today'
    if (diffDays === 1) return 'updated yesterday'
    if (diffDays < 7) return `updated ${diffDays} days ago`
    if (diffDays < 30) return `updated ${Math.floor(diffDays / 7)} weeks ago`
    return `updated ${Math.floor(diffDays / 30)} months ago`
  }

  const shouldShowSkeleton = displayItems.length === 0 && displayLoading

  return (
    <section className={`relative w-full max-w-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xs transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900 ${className}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-48 max-w-4xl rounded-b-[4rem] bg-linear-to-b from-blue-200/40 via-slate-100/50 to-transparent dark:from-blue-500/10 dark:via-gray-800/10" aria-hidden="true" />
      <div className="relative p-4 sm:p-6 md:p-8">
        {/* Search Input */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search repository (e.g., facebook/react or just react)..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pl-11 text-sm text-slate-800 shadow-xs transition focus:border-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-gray-700"
            />
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-gray-700 dark:hover:text-slate-300"
                aria-label="Clear search"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {searchQuery.trim().length > 0 && searchQuery.trim().length < 2 && (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Type at least 2 characters to search</p>
          )}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {isSearchMode ? 'Repository search' : 'Curated repositories'}
            </p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {isSearchMode ? `Search results${searchResults.length > 0 ? ` (${searchResults.length})` : ''}` : 'Build with the right projects'}
            </h2>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            {!isSearchMode && (
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as 'stars' | 'updated' | 'forks')}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-xs focus:border-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-200 dark:focus:ring-gray-700"
              >
                <option value="stars">Most stars</option>
                <option value="updated">Recently updated</option>
                <option value="forks">Most forks</option>
              </select>
            )}
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-xs dark:border-gray-700 dark:bg-gray-800 dark:text-slate-300">
              {displayLoading && displayItems.length === 0 ? (
                <>
                  <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading…
                </>
              ) : displayError ? (
                <span className="text-red-600 dark:text-red-400">Error loading</span>
              ) : (
                <>
                  <svg className="h-4 w-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879 2.879c.566.566 1.489.181 1.489-.636V16h2.5a4.5 4.5 0 100-9h-1.025a6.5 6.5 0 10-12.9 1.5" />
                  </svg>
                  {totalCount.toLocaleString()} repos
                </>
              )}
            </span>
          </div>
        </div>

        {displayItems.length === 0 && !displayLoading && !displayError && (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-12 text-center dark:border-gray-700 dark:bg-gray-800/40">
            <svg className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isSearchMode ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              )}
            </svg>
            <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
              {isSearchMode ? 'No repositories match your search' : 'No repositories found'}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {isSearchMode ? 'Try a different repository name or keyword.' : 'Adjust the filters or pick another language to explore.'}
            </p>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {shouldShowSkeleton
            ? Array.from({ length: 6 }).map((_, idx) => (
                <article
                  key={`placeholder-${idx}`}
                  className="h-full w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-xs animate-pulse dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-gray-700" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 w-3/4 rounded-sm bg-slate-200 dark:bg-gray-700" />
                      <div className="h-3 w-2/3 rounded-sm bg-slate-200 dark:bg-gray-700" />
                      <div className="h-3 w-1/2 rounded-sm bg-slate-200 dark:bg-gray-700" />
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="h-4 rounded-sm bg-slate-200 dark:bg-gray-700" />
                    <div className="h-4 rounded-sm bg-slate-200 dark:bg-gray-700" />
                    <div className="h-4 rounded-sm bg-slate-200 dark:bg-gray-700" />
                    <div className="h-4 rounded-sm bg-slate-200 dark:bg-gray-700" />
                  </div>
                </article>
              ))
            : displayItems.map((repo: any) => (
                <article
                  key={repo.id}
                  className="group flex h-full w-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-slate-500"
                  onClick={() => setSelectedRepo(repo.full_name)}
                >
                  <div className="flex flex-1 flex-col gap-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={repo.owner.avatar_url}
                        alt={repo.owner.login}
                        className="h-12 w-12 shrink-0 rounded-full border border-slate-200 bg-white object-cover dark:border-gray-700"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-2">
                          <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {repo.full_name}
                          </div>
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                            aria-label="Open repository on GitHub"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                        <p className="mt-1 text-xs text-slate-500 line-clamp-3 dark:text-slate-300">{repo.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {repo.language && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium dark:border-gray-700 dark:bg-gray-700/60">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          {repo.language}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium dark:border-gray-700 dark:bg-gray-700/60">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {repo.stargazers_count.toLocaleString()}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium dark:border-gray-700 dark:bg-gray-700/60">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2A5 5 0 0011 9H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {repo.forks_count.toLocaleString()}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium dark:border-gray-700 dark:bg-gray-700/60">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        {repo.open_issues_count} issues
                      </span>
                      {repo.license?.spdx_id && repo.license.spdx_id !== 'NOASSERTION' && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium dark:border-gray-700 dark:bg-gray-700/60">
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {repo.license.spdx_id}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium dark:border-gray-700 dark:bg-gray-700/60">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10m-2 8H9a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v10a2 2 0 01-2 2z" />
                        </svg>
                        {formatDate(repo.updated_at)}
                      </span>
                    </div>

                    {repo.topics && repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {repo.topics.slice(0, 6).map((topic: string) => (
                          <span
                            key={topic}
                            className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 transition group-hover:bg-slate-200 dark:bg-gray-700 dark:text-slate-200 dark:group-hover:bg-gray-600"
                          >
                            #{topic}
                          </span>
                        ))}
                        {repo.topics.length > 6 && (
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-gray-700 dark:text-slate-300">
                            +{repo.topics.length - 6}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex items-center justify-between rounded-xl border border-transparent bg-slate-50 px-4 py-2 text-xs text-slate-500 transition group-hover:border-slate-200 group-hover:bg-slate-100 dark:bg-gray-700/40 dark:text-slate-300 dark:group-hover:border-gray-600 dark:group-hover:bg-gray-700/70">
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Maintainer-friendly contribution guidelines
                    </span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-200">Tap for deep dive</span>
                  </div>
                </article>
              ))}
        </div>

        {isSearchMode ? (
          <div className="mt-8 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500 dark:border-gray-700 dark:bg-gray-800/60 dark:text-slate-300">
            {displayLoading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refining search matches…
              </span>
            ) : (
              <span>{displayItems.length} repositories match this search snapshot</span>
            )}
          </div>
        ) : (
          totalCount > 0 && (
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-xs transition hover:border-slate-400 hover:text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-200 dark:hover:border-gray-600 dark:hover:text-white"
                disabled={!hasPrevPage || isLoading}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-xs dark:border-gray-700 dark:bg-gray-800 dark:text-slate-300">
                <svg className="h-4 w-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12M8 12h12m-7 5h7M3 7h.01M3 12h.01M3 17h.01" />
                </svg>
                Page {page} of {totalPages}
                <span className="hidden text-slate-400 dark:text-slate-500 sm:inline">•</span>
                <span className="hidden text-slate-600 dark:text-slate-300 sm:inline">{totalCount.toLocaleString()} curated repositories</span>
              </div>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-xs transition hover:border-slate-400 hover:text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-200 dark:hover:border-gray-600 dark:hover:text-white"
                disabled={!hasNextPage || isLoading}
              >
                Next
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )
        )}
      </div>
      <RepositoryModal repoFullName={selectedRepo} onClose={() => setSelectedRepo(null)} />
    </section>
  )
}

export default RepositoryList

