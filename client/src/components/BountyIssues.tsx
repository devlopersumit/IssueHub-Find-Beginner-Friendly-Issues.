import React, { useEffect, useState, useRef, useMemo } from 'react'
import DifficultyBadge from './DifficultyBadge'
import { detectDifficulty } from '../utils/difficulty'
import type { NaturalLanguage } from '../utils/languageDetection'
import { getBrowserLanguage, filterByLanguage } from '../utils/languageDetection'

type BountyIssuesProps = {
  className?: string
}

type GithubIssueItem = {
  id: number
  html_url: string
  title: string
  state: 'open' | 'closed'
  number: number
  repository_url: string
  labels: Array<{ name?: string; color?: string }>
  created_at: string
  body?: string
  assignee?: any | null
  assignees?: any[]
  pull_request?: any
}

type GithubSearchResponse = {
  total_count: number
  incomplete_results: boolean
  items: GithubIssueItem[]
}

const BountyIssues: React.FC<BountyIssuesProps> = ({ className = '' }) => {
  const [items, setItems] = useState<GithubIssueItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null)
  const [newItemsCount, setNewItemsCount] = useState<number>(0)
  const [repoLanguages, setRepoLanguages] = useState<Record<string, string[]>>({})
  const [fetchingLanguages, setFetchingLanguages] = useState<Set<string>>(new Set())
  const [rateLimited, setRateLimited] = useState<boolean>(false)
  const [selectedNaturalLanguages, setSelectedNaturalLanguages] = useState<NaturalLanguage[]>([])
  const abortRef = useRef<AbortController | null>(null)
  const intervalRef = useRef<number | null>(null)
  const seenIdsRef = useRef<Set<number>>(new Set())
  const itemsRef = useRef<GithubIssueItem[]>([])
  const rateLimitResetRef = useRef<number | null>(null)
  const languagesFetchedRef = useRef<Set<string>>(new Set())

  const bountyQueries = [
    'state:open no:assignee label:bounty',
    'state:open no:assignee label:bountysource',
    'state:open no:assignee bounty in:title',
  ]

  const getCachedData = (): GithubIssueItem[] | null => {
    try {
      const cached = localStorage.getItem('bountyIssuesCache')
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        const now = Date.now()
        const cacheAge = now - timestamp
        const cacheMaxAge = 5 * 60 * 1000
        
        if (cacheAge < cacheMaxAge && Array.isArray(data) && data.length > 0) {
          return data
        }
      }
    } catch (err) {
    }
    return null
  }

  const setCachedData = (data: GithubIssueItem[]) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      }
      localStorage.setItem('bountyIssuesCache', JSON.stringify(cacheData))
    } catch (err) {
    }
  }

  const fetchBountyIssues = async (isSilentRefresh: boolean = false, forceRefresh: boolean = false) => {
    if (!forceRefresh && !isSilentRefresh) {
      const cachedData = getCachedData()
      if (cachedData) {
        setItems(cachedData)
        itemsRef.current = cachedData
        setIsLoading(false)
        setError(null)
        setLastRefreshTime(new Date())
        loadCachedLanguagesForIssues(cachedData)
        if (cachedData.length > 0 && (!rateLimitResetRef.current || Date.now() >= rateLimitResetRef.current)) {
          fetchLanguagesForIssues(cachedData).catch(() => {
          })
        }
        return
      }
    }

      if (rateLimitResetRef.current && Date.now() < rateLimitResetRef.current) {
        const waitTime = Math.ceil((rateLimitResetRef.current - Date.now()) / 1000)
        const errorMsg = `Rate limited. Please wait ${waitTime} seconds before trying again.`
        setError(new Error(errorMsg))
      setIsLoading(false)
      setIsRefreshing(false)
      return
    }

    if (abortRef.current) {
      abortRef.current.abort()
    }
    const controller = new AbortController()
    abortRef.current = controller

    if (!isSilentRefresh) {
      setIsLoading(true)
      setItems([])
      itemsRef.current = []
    } else {
      setIsRefreshing(true)
    }
    setError(null)
    setRateLimited(false)
    const allIssues: GithubIssueItem[] = []
    const currentSeenIds = new Set<number>(seenIdsRef.current)
    let successCount = 0
    let rateLimitHit = false

    try {
      for (let i = 0; i < bountyQueries.length; i++) {
        if (rateLimitHit) {
          break
        }

        const query = bountyQueries[i]
        try {
          const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=30&sort=created&order=desc`
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              Accept: 'application/vnd.github+json'
            },
            signal: controller.signal
          })

          const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining')
          const rateLimitReset = response.headers.get('X-RateLimit-Reset')
          
          if (rateLimitReset) {
            rateLimitResetRef.current = parseInt(rateLimitReset) * 1000
          }

          if (response.ok) {
            const json: GithubSearchResponse = await response.json()
            if (json.items) {
              json.items.forEach((issue) => {
                if (!currentSeenIds.has(issue.id)) {
                  currentSeenIds.add(issue.id)
                  allIssues.push(issue)
                }
              })
              successCount++
            }
          } else if (response.status === 403) {
            rateLimitHit = true
            setRateLimited(true)
            
            let resetTime = rateLimitResetRef.current || Date.now() + 60000
            if (rateLimitReset) {
              resetTime = parseInt(rateLimitReset) * 1000
              rateLimitResetRef.current = resetTime
            }
            
            const waitSeconds = Math.ceil((resetTime - Date.now()) / 1000)
            const errorMsg = `GitHub API rate limit reached. Please wait ${waitSeconds} seconds or use cached results.`
            
            const cachedData = getCachedData()
            if (cachedData && cachedData.length > 0) {
              setItems(cachedData)
              itemsRef.current = cachedData
              setError(new Error(errorMsg))
            } else {
              setError(new Error(errorMsg))
            }
            break
          }

          if (rateLimitRemaining && parseInt(rateLimitRemaining) < 5) {
            break
          }
        } catch (err: unknown) {
          if ((err as any)?.name === 'AbortError') {
            return
          }
        }

        if (i < bountyQueries.length - 1 && !rateLimitHit) {
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      }
      

      const openUnassignedIssues = allIssues.filter(issue => {
        if (issue.state !== 'open') {
          return false
        }
        
        if (issue.assignee !== null && issue.assignee !== undefined) {
          return false
        }
        if (issue.assignees && issue.assignees.length > 0) {
          return false
        }
        
        if (issue.pull_request) {
          return false
        }
        if (issue.html_url && issue.html_url.includes('/pull/')) {
          return false
        }
        
        return true
      })

      const potentialBountyIssues = openUnassignedIssues.filter(issue => hasBountyDetails(issue))
      
      const shouldSkipRepoValidation = rateLimitHit || rateLimitResetRef.current && Date.now() < rateLimitResetRef.current
      
      let verifiedBountyIssues: GithubIssueItem[] = []
      
      if (shouldSkipRepoValidation) {
        verifiedBountyIssues = potentialBountyIssues
      } else {
        const batchSize = 2
        for (let i = 0; i < potentialBountyIssues.length; i += batchSize) {
          if (rateLimitResetRef.current && Date.now() < rateLimitResetRef.current) {
            verifiedBountyIssues.push(...potentialBountyIssues.slice(i))
            break
          }

          const batch = potentialBountyIssues.slice(i, i + batchSize)
          const batchPromises = batch.map(issue => 
            isBountyIssue(issue).then(isValid => ({ issue, isValid }))
          )
          
          const batchResults = await Promise.all(batchPromises)
          const validIssues = batchResults
            .filter(result => result.isValid)
            .map(result => result.issue)
          
          verifiedBountyIssues.push(...validIssues)
          
          if (i + batchSize < potentialBountyIssues.length) {
            await new Promise(resolve => setTimeout(resolve, 2000))
          }
        }
      }

      if (successCount === 0 && verifiedBountyIssues.length === 0 && !isSilentRefresh) {
        const errorMsg = 'Unable to fetch bounty issues. This might be due to rate limiting or network issues. Please try again in a moment.'
        setError(new Error(errorMsg))
      } else {
        setError(null)
        if (verifiedBountyIssues.length > 0) {
        }
      }

      verifiedBountyIssues.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      
      verifiedBountyIssues.forEach(issue => {
        seenIdsRef.current.add(issue.id)
      })

      const existingIds = new Set(itemsRef.current.map(item => item.id))
      const newItems = verifiedBountyIssues.filter(issue => !existingIds.has(issue.id))
      
      if (newItems.length > 0 && isSilentRefresh) {
        setNewItemsCount(newItems.length)
        setTimeout(() => setNewItemsCount(0), 5000)
      }

      const verifiedExistingItems = itemsRef.current.filter(issue => hasBountyDetails(issue))
      
      const mergedItems = [...newItems, ...verifiedExistingItems]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 30)
      
      itemsRef.current = mergedItems
      
      setItems(mergedItems)
      setLastRefreshTime(new Date())
      
      if (mergedItems.length > 0) {
        setCachedData(mergedItems)
        loadCachedLanguagesForIssues(mergedItems)
      }
      
      if (mergedItems.length > 0 && !rateLimitHit && (!rateLimitResetRef.current || Date.now() >= rateLimitResetRef.current)) {
          fetchLanguagesForIssues(mergedItems).catch(() => {
          })
        }
      
      setTimeout(() => {
        setIsLoading(false)
        setIsRefreshing(false)
      }, 300)
    } catch (err: unknown) {
      if ((err as any)?.name === 'AbortError') return
      if (itemsRef.current.length === 0) {
        setError(err as Error)
      }
      setTimeout(() => {
        setIsLoading(false)
        setIsRefreshing(false)
      }, 100)
    }
  }

  useEffect(() => {
    const browserLang = getBrowserLanguage()
    if (selectedNaturalLanguages.length === 0) {
      setSelectedNaturalLanguages([browserLang])
    }
  }, [])

  const filteredItems = useMemo(() => {
    if (selectedNaturalLanguages.length === 0) {
      return items
    }
    return filterByLanguage(items, selectedNaturalLanguages)
  }, [items, selectedNaturalLanguages])

  useEffect(() => {
    setError(null)

    const cachedData = getCachedData()
    if (cachedData && cachedData.length > 0) {
      setItems(cachedData)
      itemsRef.current = cachedData
      setIsLoading(false)
      setLastRefreshTime(new Date())
      loadCachedLanguagesForIssues(cachedData)
      if (!rateLimitResetRef.current || Date.now() >= rateLimitResetRef.current) {
        fetchLanguagesForIssues(cachedData).catch(() => {
        })
      }
    } else {
      setIsLoading(true)
      fetchBountyIssues(false)
    }

    intervalRef.current = setInterval(() => {
      if (!rateLimitResetRef.current || Date.now() >= rateLimitResetRef.current) {
        fetchBountyIssues(true)
      }
    }, 600000)

    return () => {
      if (abortRef.current) {
        abortRef.current.abort()
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleManualRefresh = () => {
    fetchBountyIssues(false, true)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    
    if (diffSeconds < 60) return 'just now'
    if (diffMinutes < 60) return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`
    const diffHours = Math.floor(diffMinutes / 60)
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
  }
  
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

  const loadCachedLanguagesForIssues = (issues: GithubIssueItem[]) => {
    const languageMap: Record<string, string[]> = {}
    
    issues.forEach(issue => {
      if (issue.repository_url && !languageMap[issue.repository_url]) {
        try {
          const cacheKey = `repoLanguages_${issue.repository_url}`
          const cached = localStorage.getItem(cacheKey)
          if (cached) {
            const { languages, timestamp } = JSON.parse(cached)
            const cacheAge = Date.now() - timestamp
            const cacheMaxAge = 30 * 60 * 1000
            if (cacheAge < cacheMaxAge && Array.isArray(languages) && languages.length > 0) {
              languageMap[issue.repository_url] = languages
              languagesFetchedRef.current.add(issue.repository_url)
            }
          }
        } catch (err) {
        }
      }
    })
    
    if (Object.keys(languageMap).length > 0) {
      setRepoLanguages(prev => ({ ...prev, ...languageMap }))
    }
  }

  const fetchRepositoryLanguages = async (repoUrl: string): Promise<string[]> => {
    try {
      const cacheKey = `repoLanguages_${repoUrl}`
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const { languages, timestamp } = JSON.parse(cached)
        const cacheAge = Date.now() - timestamp
        const cacheMaxAge = 30 * 60 * 1000
        if (cacheAge < cacheMaxAge && Array.isArray(languages)) {
          return languages
        }
      }
    } catch (err) {
    }

    try {
      const parts = repoUrl.replace('https://api.github.com/repos/', '').split('/')
      if (parts.length < 2) return []
      
      const owner = parts[0]
      const repo = parts[1]
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/languages`
      
      const response = await fetch(apiUrl, {
        headers: {
          Accept: 'application/vnd.github+json'
        }
      })
      
      const rateLimitReset = response.headers.get('X-RateLimit-Reset')
      
      if (rateLimitReset) {
        rateLimitResetRef.current = parseInt(rateLimitReset) * 1000
      }
      
      if (response.status === 403) {
        if (rateLimitReset) {
          rateLimitResetRef.current = parseInt(rateLimitReset) * 1000
        }
        return []
      }
      
      if (!response.ok) {
        return []
      }
      
      const languages: Record<string, number> = await response.json()
      
      const sortedLanguages = Object.entries(languages)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([lang]) => lang)
      
      if (sortedLanguages.length > 0) {
        try {
          const cacheKey = `repoLanguages_${repoUrl}`
          localStorage.setItem(cacheKey, JSON.stringify({
            languages: sortedLanguages,
            timestamp: Date.now()
          }))
        } catch (err) {
        }
      }
      
      return sortedLanguages
    } catch (error) {
      return []
    }
  }

  const fetchLanguagesForIssues = async (issues: GithubIssueItem[]) => {
    if (rateLimitResetRef.current && Date.now() < rateLimitResetRef.current) {
      return
    }

    const uniqueRepos = new Set<string>()
    issues.forEach(issue => {
      if (issue.repository_url && !languagesFetchedRef.current.has(issue.repository_url)) {
        uniqueRepos.add(issue.repository_url)
      }
    })
    
    if (uniqueRepos.size === 0) {
      return
    }

    setFetchingLanguages(prev => new Set([...prev, ...uniqueRepos]))
    
    for (const repoUrl of uniqueRepos) {
      if (rateLimitResetRef.current && Date.now() < rateLimitResetRef.current) {
        setFetchingLanguages(prev => {
          const next = new Set(prev)
          next.delete(repoUrl)
          return next
        })
        languagesFetchedRef.current.add(repoUrl)
        break
      }

      try {
        const languages = await fetchRepositoryLanguages(repoUrl)
        if (languages.length > 0) {
          setRepoLanguages(prev => ({ ...prev, [repoUrl]: languages }))
        }
        languagesFetchedRef.current.add(repoUrl)
      } catch (error) {
        languagesFetchedRef.current.add(repoUrl)
      }
      
      setFetchingLanguages(prev => {
        const next = new Set(prev)
        next.delete(repoUrl)
        return next
      })
      
      if (rateLimitResetRef.current && Date.now() < rateLimitResetRef.current) {
        uniqueRepos.forEach(url => {
          if (url !== repoUrl && !languagesFetchedRef.current.has(url)) {
            setFetchingLanguages(prev => {
              const next = new Set(prev)
              next.delete(url)
              return next
            })
            languagesFetchedRef.current.add(url)
          }
        })
        break
      }
      
      if (Array.from(uniqueRepos).indexOf(repoUrl) < uniqueRepos.size - 1) {
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    }
  }

  const getLanguageColor = (language: string): string => {
    const colors: Record<string, string> = {
      'JavaScript': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700',
      'TypeScript': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700',
      'Python': 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700',
      'Java': 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-700',
      'Go': 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-700',
      'Rust': 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600',
      'C++': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700',
      'C': 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600',
      'C#': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700',
      'PHP': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700',
      'Ruby': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700',
      'Swift': 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-700',
      'Kotlin': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700',
      'Dart': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700',
      'HTML': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700',
      'CSS': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700',
      'Scala': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700',
      'Lua': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700',
      'Shell': 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600',
      'R': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700',
    }
    
    return colors[language] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600'
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

  const hasBountyLabel = (labels: Array<{ name?: string; color?: string }>): boolean => {
    if (!labels || labels.length === 0) return false
    const bountyKeywords = ['bounty', 'bountysource', 'funded', 'cash-prize', 'sponsor', 'paid', 'bounty-ready', 'bounty-available', 'reward', 'prize', 'issuehunt']
    return labels.some(label => {
      const labelLower = label.name?.toLowerCase() || ''
      return bountyKeywords.some(keyword => labelLower.includes(keyword))
    })
  }

  const isLegitimateRepository = async (repoUrl: string): Promise<boolean> => {
    try {
      const cacheKey = `repoValidation_${repoUrl}`
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const { isValid, timestamp } = JSON.parse(cached)
        const cacheAge = Date.now() - timestamp
        const cacheMaxAge = 24 * 60 * 60 * 1000
        if (cacheAge < cacheMaxAge && typeof isValid === 'boolean') {
          return isValid
        }
      }
    } catch (err) {
    }

    if (rateLimitResetRef.current && Date.now() < rateLimitResetRef.current) {
      return true
    }

    try {
      const parts = repoUrl.replace('https://api.github.com/repos/', '').split('/')
      if (parts.length < 2) return false
      
      const owner = parts[0]
      const repo = parts[1]
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}`
      
      const response = await fetch(apiUrl, {
        headers: {
          Accept: 'application/vnd.github+json'
        }
      })
      
      const rateLimitReset = response.headers.get('X-RateLimit-Reset')
      
      if (rateLimitReset) {
        rateLimitResetRef.current = parseInt(rateLimitReset) * 1000
      }

      if (response.status === 403) {
        if (rateLimitReset) {
          rateLimitResetRef.current = parseInt(rateLimitReset) * 1000
        }
        return true
      }
      
      if (!response.ok) {
        try {
          const cacheKey = `repoValidation_${repoUrl}`
          localStorage.setItem(cacheKey, JSON.stringify({
            isValid: false,
            timestamp: Date.now()
          }))
        } catch (err) {
        }
        return false
      }
      
      const repoData = await response.json()
      
      const hasStars = repoData.stargazers_count > 0
      const hasForks = repoData.forks_count > 0
      const hasDescription = repoData.description && repoData.description.length > 10
      
      const createdAt = new Date(repoData.created_at)
      const daysOld = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
      const isNotTooNew = daysOld > 1
      
      const hasActivity = repoData.updated_at && 
        (Date.now() - new Date(repoData.updated_at).getTime()) < (90 * 24 * 60 * 60 * 1000)
      
      const isValid = isNotTooNew && (hasStars || hasForks || hasDescription) && hasActivity

      try {
        const cacheKey = `repoValidation_${repoUrl}`
        localStorage.setItem(cacheKey, JSON.stringify({
          isValid,
          timestamp: Date.now()
        }))
      } catch (err) {
      }

      return isValid
    } catch (error) {
      return true
    }
  }

  const hasBountyDetails = (issue: GithubIssueItem): boolean => {
    const title = (issue.title || '').toLowerCase()
    const body = (issue.body || '').toLowerCase()
    const combinedText = `${title} ${body}`
    
    const bountyKeywords = [
      'bounty', 'bountysource', 'issuehunt', 'bounties',
      'cash prize', 'cash reward', 'monetary reward',
      'sponsor', 'sponsorship', 'sponsored',
      'paid', 'payment', 'reward', 'prize', 'prize money',
      'funded', 'funding', 'compensation', 'compensated'
    ]
    
    const hasBountyKeyword = bountyKeywords.some(keyword => combinedText.includes(keyword))
    if (!hasBountyKeyword) return false
    
    const monetaryIndicators = [
      /\$\d+/,
      /\d+\s*(usd|dollar|dollars|eur|euro|euros|gbp|pound|pounds|btc|bitcoin)/i,
      /(reward|prize|bounty|payment).*?\$\d+/i,
      /(reward|prize|bounty|payment).*?\d+.*?(usd|dollar|btc)/i,
      /(bountysource|issuehunt|codefund)/i,
    ]
    
    const hasMonetaryValue = monetaryIndicators.some(pattern => pattern.test(combinedText))
    
    const hasMinimumContent = body.length > 50 || title.length > 20
    
    const spamPatterns = [
      /!{3,}/,
      /[A-Z]{20,}/,
      /(click|free|urgent|limited time|act now)/i,
    ]
    
    const hasSpamPatterns = spamPatterns.some(pattern => pattern.test(combinedText))
    
    const knownPlatforms = /(bountysource\.com|issuehunt\.io|codefund\.io)/i.test(combinedText)
    
    return hasBountyKeyword && (hasMonetaryValue || knownPlatforms || hasMinimumContent) && !hasSpamPatterns
  }

  const isBountyIssue = async (issue: GithubIssueItem): Promise<boolean> => {
    if (!hasBountyDetails(issue)) {
      return false
    }
    
    const shouldSkipRepoCheck = rateLimitResetRef.current && Date.now() < rateLimitResetRef.current

    if (hasBountyLabel(issue.labels || [])) {
      if (!shouldSkipRepoCheck) {
        const isLegit = await isLegitimateRepository(issue.repository_url)
        if (!isLegit) {
          return false
        }
      }
      return true
    }

    const titleLower = (issue.title || '').toLowerCase()
    const bodyLower = (issue.body || '').toLowerCase()
    const combinedText = `${titleLower} ${bodyLower}`
    
    const bountyKeywords = [
      'bounty', 'bounties', 'bountysource', 'issuehunt',
      'cash prize', 'cash reward', 'monetary reward',
      'sponsor', 'sponsorship', 'sponsored',
      'paid', 'payment', 'reward', 'prize', 'prize money',
      'funded', 'funding', 'compensation', 'compensated'
    ]
    
    const hasBountyKeyword = bountyKeywords.some(keyword => combinedText.includes(keyword))
    
    if (hasBountyKeyword) {
      if (!shouldSkipRepoCheck) {
        const isLegit = await isLegitimateRepository(issue.repository_url)
        if (!isLegit) {
          return false
        }
      }
      
      const hasSubstance = bodyLower.length > 100 || 
        /(fix|implement|add|create|build|develop)/i.test(combinedText)
      
      return hasSubstance
    }

    return false
  }

  return (
    <section className={`relative bg-linear-to-br from-amber-50/50 via-white to-orange-50/30 dark:from-amber-950/10 dark:via-gray-900 dark:to-orange-950/10 border-l-4 border-amber-500 dark:border-amber-600 border-t border-r border-b border-gray-200 dark:border-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <div className="absolute top-0 right-0 -mt-3 -mr-3">
        <div className="bg-amber-500 dark:bg-amber-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
          Featured
        </div>
      </div>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-1">
              <svg className="w-6 h-6 text-amber-600 dark:text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 flex items-center gap-2">
                Bounty Issues
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Unsolved bounty issues - fix them and earn rewards
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
            {newItemsCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md text-xs font-medium border border-green-200 dark:border-green-800 animate-pulse">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {newItemsCount} new
              </span>
            )}
            {isRefreshing && (
              <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs">
                <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing...
              </span>
            )}
            {lastRefreshTime && !isLoading && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Updated {formatTimeAgo(lastRefreshTime)}
              </span>
            )}
            {isLoading && items.length === 0 ? (
              <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : error && items.length === 0 ? (
              <span className="text-red-600 dark:text-red-400 text-xs">Unable to load</span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-lg font-medium border border-amber-200 dark:border-amber-800">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                {items.length} {items.length === 1 ? 'issue' : 'issues'}
              </span>
            )}
            {!isLoading && (
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Refresh now"
              >
                <svg className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            )}
          </div>
        </div>
        
        {items.length === 0 && !isLoading && error && (
          <div className="text-center py-10 border border-gray-200 dark:border-gray-700 rounded-lg">
            <svg className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-3 text-sm font-medium text-gray-900 dark:text-gray-100">Unable to load bounty issues</h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 mb-4">
                {error.message || 'Please check your connection and try again'}
              </p>
              {rateLimited && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mb-4">
                  Tip: Cached results are shown above. The API rate limit will reset automatically.
                </p>
              )}
            <button
              onClick={handleManualRefresh}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          </div>
        )}

        {/* Show loading spinner first - priority check */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="flex flex-col items-center justify-center">
              <svg className="animate-spin h-12 w-12 text-amber-500 dark:text-amber-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Fetching bounty issues
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Searching for open bounty issues with cash prizes and rewards...
              </p>
            </div>
          </div>
        )}

        {/* Only show "No bounty issues found" when NOT loading and no items */}
        {!isLoading && filteredItems.length === 0 && items.length > 0 && (
          <div className="text-center py-10 border border-gray-200 dark:border-gray-700 rounded-lg">
            <svg className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <h3 className="mt-3 text-sm font-medium text-gray-900 dark:text-gray-100">No issues match your language filter</h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Try selecting different languages or clearing the filter
            </p>
          </div>
        )}
        
        {!isLoading && items.length === 0 && !error && !isRefreshing && (
          <div className="text-center py-10 border border-gray-200 dark:border-gray-700 rounded-lg">
            <svg className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-3 text-sm font-medium text-gray-900 dark:text-gray-100">No bounty issues found</h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Check back later for new opportunities
            </p>
          </div>
        )}

        {!isLoading && filteredItems.length > 0 && (
          <div className="space-y-3">
            {filteredItems.map((issue) => {
              const repo = issue.repository_url?.split('/').slice(-2).join('/')
              const difficulty = detectDifficulty(issue.labels || [])
              const isBounty = hasBountyLabel(issue.labels || [])
              
              return (
                <article 
                  key={issue.id} 
                  className="group relative p-4 border-l-2 border-l-amber-400 dark:border-l-amber-600 border-t border-r border-b border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 hover:bg-amber-50/30 dark:hover:bg-amber-950/10 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-2">
                        <a 
                          href={issue.html_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-amber-600 dark:hover:text-amber-400 line-clamp-2 flex-1 transition-colors"
                        >
                          {issue.title}
                        </a>
                        <DifficultyBadge difficulty={difficulty} />
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                        <span className="font-mono">{repo}</span>
                        <span>•</span>
                        <span>#{issue.number}</span>
                        <span>•</span>
                        <span>{formatDate(issue.created_at)}</span>
                      </div>
                      {repoLanguages[issue.repository_url] && repoLanguages[issue.repository_url].length > 0 ? (
                        <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Languages:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {repoLanguages[issue.repository_url].slice(0, 3).map((lang, idx) => (
                              <span
                                key={`${issue.id}-lang-${idx}`}
                                className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium shadow-xs ${getLanguageColor(lang)}`}
                              >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : fetchingLanguages.has(issue.repository_url) ? (
                        <div className="mt-2.5 flex items-center gap-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400 italic">Languages: Loading...</span>
                        </div>
                      ) : null}
                      {issue.labels && issue.labels.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {issue.labels.slice(0, 5).map((l: any, i: number) => {
                            const labelLower = l.name?.toLowerCase() || ''
                            const isBountyLabel = labelLower.includes('bounty') || labelLower.includes('funded') || labelLower.includes('cash') || labelLower.includes('sponsor') || labelLower.includes('paid')
                            const icon = getLabelIcon(l.name || '')
                            
                            return (
                              <span 
                                key={`${issue.id}-label-${i}`} 
                                className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${
                                  isBountyLabel
                                    ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shadow-xs'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                              >
                                {icon && <span className="shrink-0">{icon}</span>}
                                {l.name}
                              </span>
                            )
                          })}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {isBounty && (
                        <span className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-xs border border-amber-600">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                          </svg>
                          Bounty
                        </span>
                      )}
                      <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                        Open
                      </span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default BountyIssues

