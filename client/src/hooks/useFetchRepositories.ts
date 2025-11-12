import { useEffect, useRef, useState } from 'react'

type GithubRepository = {
  id: number
  full_name: string
  name: string
  owner: {
    login: string
    avatar_url: string
  }
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  open_issues_count: number
  updated_at: string
  topics: string[]
  license: {
    key: string | null
    name: string | null
    spdx_id: string | null
  } | null
}

type GithubRepositoriesResponse = {
  total_count: number
  incomplete_results: boolean
  items: GithubRepository[]
}

type UseFetchRepositoriesResult = {
  data: GithubRepositoriesResponse | null
  isLoading: boolean
  error: Error | null
}

export function useFetchRepositories(
  language: string | null,
  license: string | null,
  sort: 'stars' | 'updated' | 'forks' = 'stars',
  page: number = 1,
  perPage: number = 20
): UseFetchRepositoriesResult {
  const [data, setData] = useState<GithubRepositoriesResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (abortRef.current) {
      abortRef.current.abort()
    }
    const controller = new AbortController()
    abortRef.current = controller

    async function fetchRepositories() {
      setIsLoading(true)
      setError(null)
      try {
        let queryParts: string[] = []
        
        if (language) {
          queryParts.push(`language:${language}`)
        }

        if (license) {
          queryParts.push(`license:${license}`)
        }

        queryParts.push('forks:>=10')
        queryParts.push('stars:>=50')
        queryParts.push('archived:false')
        
        const query = queryParts.join(' ')
        const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=${sort}&order=desc&page=${page}&per_page=${perPage}`

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

        const json: GithubRepositoriesResponse = await response.json()
        setData(json)
      } catch (err: unknown) {
        if ((err as any)?.name === 'AbortError') return
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRepositories()

    return () => {
      controller.abort()
    }
  }, [language, license, sort, page, perPage])

  return { data, isLoading, error }
}

