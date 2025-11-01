import React, { useEffect, useState } from 'react'
import { useFetchIssues } from '../hooks/useFetchIssues'

type IssueListProps = {
  className?: string
  query: string
}

const IssueList: React.FC<IssueListProps> = ({ className = '', query }) => {
  const [page, setPage] = useState<number>(1)
  const perPage = 20
  const [items, setItems] = useState<any[]>([])
  const { data, isLoading, error } = useFetchIssues(query, page, perPage)

  useEffect(() => {
    setPage(1)
    setItems([])
  }, [query])

  useEffect(() => {
    if (data?.items) {
      setItems((prev) => {
        const prevIds = new Set(prev.map((i) => i.id))
        const merged = [...prev]
        data.items.forEach((it) => {
          if (!prevIds.has(it.id)) merged.push(it)
        })
        return merged
      })
    }
  }, [data])

  const totalCount = data?.total_count ?? 0
  const canLoadMore = items.length < totalCount && !isLoading && !error
  
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

  return (
    <section className={`bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded ${className}`}>
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Issues</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            {isLoading && items.length === 0 ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading…
              </span>
            ) : error ? (
              <span className="text-red-600 dark:text-red-400">Error loading issues</span>
            ) : (
              <span className="font-medium">{totalCount.toLocaleString()} {totalCount === 1 ? 'result' : 'results'}</span>
            )}
          </div>
        </div>
        
        {items.length === 0 && !isLoading && !error && (
          <div className="text-center py-8">
            <svg className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No issues found</h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Try adjusting your filters or search terms.</p>
          </div>
        )}

        <div className="space-y-2">
          {(items.length ? items : [1, 2, 3]).map((item: any, idx: number) => {
            if (!items.length) {
              return (
                <article key={`placeholder-${idx}`} className="p-4 border border-gray-300 dark:border-gray-700 rounded animate-pulse">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                      <div className="flex flex-wrap gap-2">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                  </div>
                </article>
              )
            }
            const issue = item
            const repo = issue.repository_url?.split('/').slice(-2).join('/')
            return (
              <article key={issue.id} className="p-4 border border-gray-300 dark:border-gray-700 rounded hover:border-slate-500 dark:hover:border-slate-500 bg-white dark:bg-gray-800">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <a 
                      href={issue.html_url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:underline line-clamp-2 block"
                    >
                      {issue.title}
                    </a>
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 flex-wrap">
                      <span className="font-mono">{repo}</span>
                      <span>•</span>
                      <span>#{issue.number}</span>
                      <span>•</span>
                      <span>{formatDate(issue.created_at)}</span>
                    </div>
                    {issue.labels && issue.labels.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {issue.labels.slice(0, 4).map((l: any, i: number) => {
                          const colors: Record<string, string> = {
                            'good first issue': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700',
                            'help wanted': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
                          }
                          const colorClass = colors[l.name.toLowerCase()] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                          return (
                            <span 
                              key={`${issue.id}-label-${i}`} 
                              className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-normal ${colorClass}`}
                            >
                              {l.name}
                            </span>
                          )
                        })}
                        {issue.labels.length > 4 && (
                          <span className="inline-flex items-center rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-2 py-0.5 text-xs font-normal text-gray-600 dark:text-gray-300">
                            +{issue.labels.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="flex-shrink-0 inline-flex items-center rounded border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-300">
                    Open
                  </span>
                </div>
              </article>
            )
          })}
        </div>
        
        <div className="mt-4 flex justify-center items-center gap-3">
          {canLoadMore && (
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              className="rounded bg-slate-700 dark:bg-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:hover:bg-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </button>
          )}
          {isLoading && items.length > 0 && (
            <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading more issues...
            </span>
          )}
        </div>
      </div>
    </section>
  )
}

export default IssueList


