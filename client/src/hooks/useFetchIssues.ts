import { useEffect, useRef, useState } from 'react'

type GithubIssueItem = {
  id: number
  html_url: string
  title: string
  state: 'open' | 'closed'
  number: number
  repository_url: string
  labels: Array<{ name?: string; color?: string }>
  created_at: string
}

type GithubSearchResponse = {
  total_count: number
  incomplete_results: boolean
  items: GithubIssueItem[]
}

type UseFetchIssuesResult = {
  data: GithubSearchResponse | null
  isLoading: boolean
  error: Error | null
}

export function useFetchIssues(query: string, page: number = 1, perPage: number = 20): UseFetchIssuesResult {
  const [data, setData] = useState<GithubSearchResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    // Cancel any in-flight request when query changes or component unmounts
    if (abortRef.current) {
      abortRef.current.abort()
    }
    const controller = new AbortController()
    abortRef.current = controller

    async function fetchIssues() {
      setIsLoading(true)
      setError(null)
      try {
        const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/vnd.github+json'
          },
          signal: controller.signal
        })

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
        }

        const json: GithubSearchResponse = await response.json()
        setData(json)

        // Log to console for the exercise goal
        // eslint-disable-next-line no-console
        console.log('[IssueHub] GitHub search response:', json)
      } catch (err: unknown) {
        if ((err as any)?.name === 'AbortError') return
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchIssues()

    return () => {
      controller.abort()
    }
  }, [query, page, perPage])

  return { data, isLoading, error }
}


