import React, { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

type FiltersToggleContextType = {
  toggleFilters: () => void
  setToggleFilters: (fn: () => void) => void
}

const FiltersToggleContext = createContext<FiltersToggleContextType | undefined>(undefined)

export const FiltersToggleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toggleFn, setToggleFn] = useState<(() => void) | null>(null)

  const setToggleFilters = useCallback((fn: () => void) => {
    setToggleFn(() => fn)
  }, [])

  const toggleFilters = useCallback(() => {
    if (toggleFn) {
      toggleFn()
    }
  }, [toggleFn])

  return (
    <FiltersToggleContext.Provider value={{ toggleFilters, setToggleFilters }}>
      {children}
    </FiltersToggleContext.Provider>
  )
}

export const useFiltersToggle = () => {
  const context = useContext(FiltersToggleContext)
  if (context === undefined) {
    throw new Error('useFiltersToggle must be used within a FiltersToggleProvider')
  }
  return context
}

