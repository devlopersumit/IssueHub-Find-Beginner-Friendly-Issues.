import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'auto'

interface ThemeContextType {
  theme: Theme
  effectiveTheme: 'light' | 'dark'
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'auto'
  
  try {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light' || saved === 'auto') {
      return saved as Theme
    }
  } catch (e) {
    console.error('Error reading theme from localStorage:', e)
  }
  
  return 'auto'
}

const getEffectiveTheme = (theme: Theme): 'light' | 'dark' => {
  if (theme === 'auto') {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }
  return theme
}

const applyTheme = (effectiveTheme: 'light' | 'dark') => {
  if (typeof window === 'undefined') return
  
  const root = document.documentElement
  
  if (effectiveTheme === 'dark') {
    root.classList.add('dark')
    root.setAttribute('data-theme', 'dark')
  } else {
    root.classList.remove('dark')
    root.setAttribute('data-theme', 'light')
  }
  
  root.setAttribute('aria-label', `Theme: ${effectiveTheme}`)
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(() => getEffectiveTheme(getInitialTheme()))

  useEffect(() => {
    const newEffectiveTheme = getEffectiveTheme(theme)
    setEffectiveTheme(newEffectiveTheme)
    applyTheme(newEffectiveTheme)
    
    try {
      localStorage.setItem('theme', theme)
    } catch (e) {
      console.error('Error saving theme to localStorage:', e)
    }
  }, [theme])

  useEffect(() => {
    if (theme === 'auto' && typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      
      const handleChange = (e: MediaQueryListEvent) => {
        const newEffectiveTheme = e.matches ? 'dark' : 'light'
        setEffectiveTheme(newEffectiveTheme)
        applyTheme(newEffectiveTheme)
      }
      
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  const setTheme = React.useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
  }, [])

  const toggleTheme = React.useCallback(() => {
    setThemeState((prevTheme) => {
      if (prevTheme === 'light') return 'dark'
      if (prevTheme === 'dark') return 'auto'
      return 'light'
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

