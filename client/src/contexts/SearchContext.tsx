import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useDebounce } from '../hooks/useDebounce'

type SearchContextType = {
  searchTerm: string
  setSearchTerm: (term: string) => void
  submittedSearch: string
  submitSearch: (term: string) => void
  clearSearch: () => void
  isDebouncing: boolean
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [submittedSearch, setSubmittedSearch] = useState<string>('')
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false)
  
  // Debounce the search term with 400ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 400)

  // Auto-submit search when debounced value changes
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setIsDebouncing(true)
    } else {
      setIsDebouncing(false)
      if (debouncedSearchTerm.trim()) {
        setSubmittedSearch(debouncedSearchTerm.trim())
      } else {
        setSubmittedSearch('')
      }
    }
  }, [searchTerm, debouncedSearchTerm])

  const submitSearch = (term: string) => {
    const trimmedTerm = term.trim()
    setSearchTerm(trimmedTerm)
    setSubmittedSearch(trimmedTerm)
    setIsDebouncing(false)
    // Search history is handled in Header component
  }

  const clearSearch = () => {
    setSearchTerm('')
    setSubmittedSearch('')
    setIsDebouncing(false)
  }

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        submittedSearch,
        submitSearch,
        clearSearch,
        isDebouncing,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

