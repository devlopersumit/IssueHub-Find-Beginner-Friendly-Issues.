import React, { useEffect, useState } from 'react'
import { useFetchIssues } from '../hooks/useFetchIssues'
import DifficultyBadge from './DifficultyBadge'
import { detectDifficulty } from '../utils/difficulty'

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

  const getLabelIcon = (labelName: string) => {
    const labelLower = labelName.toLowerCase()
    
    // Bug labels
    if (labelLower.includes('bug') || labelLower.includes('error')) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
      )
    }
    
    // Feature/Enhancement labels
    if (labelLower.includes('feature') || labelLower.includes('enhancement') || labelLower.includes('improvement')) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }
    
    // Documentation labels
    if (labelLower.includes('doc') || labelLower.includes('documentation') || labelLower.includes('wiki')) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      )
    }
    
    // Refactor labels
    if (labelLower.includes('refactor') || labelLower.includes('cleanup') || labelLower.includes('code quality')) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
      )
    }
    
    // Performance labels
    if (labelLower.includes('performance') || labelLower.includes('optimization') || labelLower.includes('speed')) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      )
    }
    
    // Testing labels
    if (labelLower.includes('test') || labelLower.includes('qa') || labelLower.includes('coverage')) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    }
    
    // Question labels
    if (labelLower.includes('question') || labelLower.includes('discussion') || labelLower.includes('help')) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      )
    }
    
    // Good first issue / Beginner labels
    if (labelLower.includes('good first issue') || labelLower.includes('beginner') || labelLower.includes('first-timers-only') || labelLower.includes('starter')) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      )
    }
    
    // Help wanted labels
    if (labelLower.includes('help wanted') || labelLower.includes('contributions welcome')) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      )
    }
    
    // Security labels
    if (labelLower.includes('security') || labelLower.includes('vulnerability') || labelLower.includes('cve')) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    }
    
    // UI/UX labels
    if (labelLower.includes('ui') || labelLower.includes('ux') || labelLower.includes('design') || labelLower.includes('frontend')) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
        </svg>
      )
    }
    
    // Backend/API labels
    if (labelLower.includes('backend') || labelLower.includes('api') || labelLower.includes('server')) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
      )
    }
    
    // Default: return null for no icon
    return null
  }

  const getIssueIcon = (labels: Array<{ name?: string; color?: string }>) => {
    if (!labels || labels.length === 0) {
      return (
        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      )
    }

    // Check labels in priority order
    const labelNames = labels.map(l => l.name?.toLowerCase() || '')
    
    // Priority order for main icon
    if (labelNames.some(l => l.includes('bug') || l.includes('error'))) {
      return (
        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
      )
    }
    
    if (labelNames.some(l => l.includes('feature') || l.includes('enhancement'))) {
      return (
        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }
    
    if (labelNames.some(l => l.includes('question') || l.includes('discussion'))) {
      return (
        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      )
    }
    
    if (labelNames.some(l => l.includes('good first issue') || l.includes('beginner'))) {
      return (
        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      )
    }
    
    // Default icon
    return (
      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    )
  }

  return (
    <section className={`bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded transition-colors duration-200 ${className}`}>
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
            const difficulty = detectDifficulty(issue.labels || [])
            const mainIcon = getIssueIcon(issue.labels || [])
            return (
              <article key={issue.id} className="p-4 border border-gray-300 dark:border-gray-700 rounded hover:border-slate-500 dark:hover:border-slate-500 bg-white dark:bg-gray-800 transition-colors duration-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1.5">
                      <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">
                        {mainIcon}
                      </span>
                      <a 
                        href={issue.html_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:underline line-clamp-2 block flex-1"
                      >
                        {issue.title}
                      </a>
                      <DifficultyBadge difficulty={difficulty} />
                    </div>
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
                          const labelLower = l.name.toLowerCase()
                          const icon = getLabelIcon(l.name || '')
                          const colors: Record<string, string> = {
                            'good first issue': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700',
                            'help wanted': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
                            'enhancement': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700',
                            'bug': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700',
                            'feature': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700',
                            'documentation': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700',
                            'refactor': 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700',
                            'performance': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700',
                            'testing': 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-700',
                            'question': 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-700',
                          }
                          // Check for exact match or contains match
                          let colorClass = 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                          for (const [key, value] of Object.entries(colors)) {
                            if (labelLower === key || labelLower.includes(key)) {
                              colorClass = value
                              break
                            }
                          }
                          return (
                            <span 
                              key={`${issue.id}-label-${i}`} 
                              className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-normal ${colorClass}`}
                            >
                              {icon && <span className="flex-shrink-0">{icon}</span>}
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


