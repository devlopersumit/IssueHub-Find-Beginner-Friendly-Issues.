import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext'
import { SearchProvider } from './contexts/SearchContext'
import { FilterPreferencesProvider } from './contexts/FilterPreferencesContext'
import { FiltersToggleProvider } from './contexts/FiltersToggleContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <SearchProvider>
        <FilterPreferencesProvider>
          <FiltersToggleProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </FiltersToggleProvider>
        </FilterPreferencesProvider>
      </SearchProvider>
    </ThemeProvider>
  </StrictMode>,
)
