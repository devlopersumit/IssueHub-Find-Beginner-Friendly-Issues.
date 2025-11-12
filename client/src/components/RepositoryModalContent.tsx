import React from 'react'
import { useFetchRepositoryDetails } from '../hooks/useFetchRepositoryDetails'

type RepositoryModalContentProps = {
  repoFullName: string
  onClose: () => void
}

const RepositoryModalContent: React.FC<RepositoryModalContentProps> = ({ repoFullName, onClose }) => {
  const { repository, goodFirstIssues, isLoading, isLoadingIssues, error } = useFetchRepositoryDetails(repoFullName)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'today'
    if (diffDays === 1) return 'yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <svg className="animate-spin h-8 w-8 text-slate-600 dark:text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    )
  }

  if (error || !repository) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-600 dark:text-red-400">Error loading repository details</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 rounded-sm bg-slate-700 dark:bg-slate-600 text-white text-sm hover:bg-slate-800 dark:hover:bg-slate-500"
        >
          Close
        </button>
      </div>
    )
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-gray-300 dark:border-gray-700">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <img
            src={repository.owner.avatar_url}
            alt={repository.owner.login}
            className="h-12 w-12 rounded-full border border-gray-300 dark:border-gray-600 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {repository.full_name}
            </h2>
            <a
              href={repository.html_url}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:underline"
            >
              View on GitHub →
            </a>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-wide">Description</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {repository.description || <span className="text-gray-500 dark:text-gray-400 italic">No description provided</span>}
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">Statistics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-sm p-3 border border-gray-300 dark:border-gray-700">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Open Issues</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{repository.open_issues_count}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-sm p-3 border border-gray-300 dark:border-gray-700">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Stars</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{repository.stargazers_count.toLocaleString()}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-sm p-3 border border-gray-300 dark:border-gray-700">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Forks</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{repository.forks_count.toLocaleString()}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-sm p-3 border border-gray-300 dark:border-gray-700">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Watchers</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{repository.watchers_count.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">Recent Activity</h3>
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 dark:text-gray-400">Last updated:</span>
            <span>{formatDate(repository.updated_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 dark:text-gray-400">Last pushed:</span>
            <span>{formatDate(repository.pushed_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 dark:text-gray-400">Created:</span>
            <span>{new Date(repository.created_at).toLocaleDateString()}</span>
          </div>
          {repository.language && (
            <div className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-gray-400">Language:</span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                {repository.language}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Topics */}
      {repository.topics && repository.topics.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">Topics</h3>
          <div className="flex flex-wrap gap-2">
            {repository.topics.map((topic) => (
              <span
                key={topic}
                className="inline-flex items-center rounded-sm border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-2.5 py-1 text-xs font-normal text-gray-600 dark:text-gray-300"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Good First Issues */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">
          Good First Issues ({goodFirstIssues.length})
        </h3>
        {isLoadingIssues ? (
          <div className="flex items-center justify-center py-8">
            <svg className="animate-spin h-6 w-6 text-slate-600 dark:text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : goodFirstIssues.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
            No good first issues found
          </div>
        ) : (
          <div className="space-y-3">
            {goodFirstIssues.map((issue) => (
              <a
                key={issue.id}
                href={issue.html_url}
                target="_blank"
                rel="noreferrer"
                className="block p-3 border border-gray-300 dark:border-gray-700 rounded-sm hover:border-slate-500 dark:hover:border-slate-500 bg-white dark:bg-gray-800 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 line-clamp-2 mb-1">
                      #{issue.number}: {issue.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mt-2">
                      <span>Opened {formatDate(issue.created_at)}</span>
                      <span>•</span>
                      <span>{issue.comments} {issue.comments === 1 ? 'comment' : 'comments'}</span>
                    </div>
                  </div>
                  <span className="shrink-0 inline-flex items-center rounded-sm border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-300">
                    Open
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RepositoryModalContent

