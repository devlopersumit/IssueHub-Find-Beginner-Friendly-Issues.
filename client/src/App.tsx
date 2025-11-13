import React from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import BountyIssuesPage from './pages/BountyIssuesPage'
import SearchResultsPage from './pages/SearchResultsPage'
import RepositoriesPage from './pages/RepositoriesPage'
import { useSearch } from './contexts/SearchContext'
import { useFiltersToggle } from './contexts/FiltersToggleContext'

const AppContent: React.FC = () => {
  const { searchTerm, setSearchTerm, submitSearch } = useSearch()
  const { toggleFilters } = useFiltersToggle()
  const navigate = useNavigate()
  const location = useLocation()

  const onSubmitSearch = () => {
    if (searchTerm.trim()) {
      submitSearch(searchTerm.trim())
      // Navigate to search results page
      navigate('/search')
    }
  }

  const isHomePage = location.pathname === '/home'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Header
        title="IssueFinder"
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSubmitSearch={onSubmitSearch}
        onToggleFilters={toggleFilters}
        showFiltersButton={isHomePage}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/bounty" element={<BountyIssuesPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/repositories" element={<RepositoriesPage />} />
      </Routes>
      <Footer
        githubUrl="https://github.com/devlopersumit"
        linkedinUrl="https://www.linkedin.com/in/sumit-jha?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
        twitterUrl="https://x.com/_sumitjha_?t=4nSWLPjfWOEhS06PoX9-Lg&s=09"
      />
    </div>
  )
}

const App: React.FC = () => {
  return <AppContent />
}

export default App
