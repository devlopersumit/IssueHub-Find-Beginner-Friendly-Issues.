import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light'
  
  try {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') {
      const root = document.documentElement
      if (saved === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
      return saved as Theme
    }
  } catch (e) {
    console.error('Error reading theme from localStorage:', e)
  }
  
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (prefersDark) {
    document.documentElement.classList.add('dark')
    return 'dark'
  }
  
  return 'light'
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    try {
      localStorage.setItem('theme', theme)
    } catch (e) {
      console.error('Error saving theme to localStorage:', e)
    }
  }, [theme])

  const toggleTheme = React.useCallback(() => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light'
      const root = document.documentElement
      
      // Apply immediately
      if (newTheme === 'dark') {
        root.classList.add('dark')
        root.setAttribute('data-theme', 'dark')
      } else {
        root.classList.remove('dark')
        root.setAttribute('data-theme', 'light')
      }
      
      console.log('Theme toggled to:', newTheme)
      console.log('HTML element classes:', root.className)
      console.log('HTML element has dark class:', root.classList.contains('dark'))
      
      try {
        localStorage.setItem('theme', newTheme)
      } catch (e) {
        console.error('Error saving theme:', e)
      }
      
      return newTheme
    })
  }, [])

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

