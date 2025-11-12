/**
 * Builds a GitHub API search query from filter parameters
 */

export type QueryBuilderParams = {
  searchTerm?: string
  selectedLabels?: string[]
  selectedCategories?: string[]
  selectedLanguage?: string | null
  selectedLicense?: string | null
  selectedDifficulty?: string | null
  selectedType?: string | null
  selectedFramework?: string | null
  selectedLastActivity?: string | null
}

/**
 * Maps difficulty level to GitHub label search terms
 * Uses only the most common labels that definitely exist on GitHub
 * Each difficulty level uses exclusive labels to avoid overlap
 */
function getDifficultyLabels(difficulty: string | null): { include: string[], exclude?: string[] } {
  if (!difficulty) return { include: [] }
  
  const difficultyMap: Record<string, { include: string[], exclude?: string[] }> = {
    beginner: {
      include: [
        'good first issue',      // Most common - used by thousands of repos
        'good-first-issue',      // Hyphenated version (also very common)
      ],
      // No excludes - show all beginner issues even if they have other labels
      // This ensures maximum results
    },
    intermediate: {
      include: [
        'help wanted',           // Most common - used by thousands of repos
        'help-wanted',           // Hyphenated version (also very common)
      ],
      exclude: [
        'good first issue',      // Exclude beginner labels to avoid overlap
        'good-first-issue',
      ]
    },
    advanced: {
      // Search for issues with explicit advanced labels
      // Using the most common variations found on GitHub
      // IMPORTANT: These labels must match exactly as they appear on GitHub
      include: [
        'expert',                // Common label for advanced issues
        'advanced',              // Direct label
        'hard',                  // Simple common label
        'difficult',             // Alternative
        'complex',               // Alternative
        'challenging',           // Alternative
      ],
      // Exclude beginner/intermediate to ensure we only get advanced issues
      exclude: [
        'good first issue',      // Exclude beginner labels
        'good-first-issue',
        'first-timers-only',
        'help wanted',           // Exclude intermediate labels
        'help-wanted',
      ]
    }
  }
  
  return difficultyMap[difficulty] || { include: [] }
}

/**
 * Maps framework to GitHub search terms
 * Since GitHub issues API doesn't support topic: directly, we search for
 * framework names as general search terms that will match in repo names and descriptions
 */
function getFrameworkSearch(framework: string | null): string {
  if (!framework) return ''
  
  // Map frameworks to their primary search terms
  // GitHub search will match these in repository names, descriptions, and labels
  const frameworkMap: Record<string, string> = {
    react: 'react',
    vue: 'vue',
    angular: 'angular',
    nextjs: 'next.js',
    nuxt: 'nuxt',
    svelte: 'svelte',
    express: 'express',
    django: 'django',
    flask: 'flask',
    rails: 'rails',
    spring: 'spring',
    laravel: 'laravel',
    fastapi: 'fastapi',
    nestjs: 'nestjs'
  }
  
  const searchTerm = frameworkMap[framework]
  if (!searchTerm) return ''
  
  // Return as a simple search term - GitHub will search in repo names, descriptions, etc.
  return searchTerm
}

/**
 * Maps last activity to GitHub updated date query
 * GitHub API format: updated:>YYYY-MM-DD
 */
function getLastActivityQuery(activity: string | null): string {
  if (!activity) return ''
  
  try {
    const now = new Date()
    let date: Date
    
    switch (activity) {
      case 'last-week':
        date = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'last-month':
        date = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'last-3months':
        date = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case 'active':
        // For active maintainers, use last month as a proxy
        date = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      default:
        return ''
    }
    
    // Format date as YYYY-MM-DD (GitHub API format)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    
    return `updated:>${dateStr}`
  } catch (error) {
    console.error('Error generating last activity query:', error)
    return ''
  }
}

/**
 * Builds a GitHub API search query from filter parameters
 */
export function buildGitHubQuery(params: QueryBuilderParams): string {
  const parts: string[] = []
  
  // Always include these base filters
  parts.push('state:open')
  parts.push('type:issue')
  parts.push('no:assignee')
  
  // Handle difficulty filter FIRST - this is the most important filter
  // Add it early so it has priority in the search
  if (params.selectedDifficulty) {
    const difficultyConfig = getDifficultyLabels(params.selectedDifficulty)
    
    // Special handling for advanced filter - use hardcoded query to ensure it works
    if (params.selectedDifficulty === 'advanced') {
      // Clear any existing parts and build advanced query from scratch
      // This ensures the query is exactly what we need
      parts.length = 0
      parts.push('state:open')
      parts.push('type:issue')
      parts.push('no:assignee')
      parts.push('(label:"expert" OR label:"advanced" OR label:"hard" OR label:"difficult" OR label:"complex" OR label:"challenging")')
      parts.push('-label:"good first issue"')
      parts.push('-label:"good-first-issue"')
      parts.push('-label:"first-timers-only"')
      parts.push('-label:"help wanted"')
      parts.push('-label:"help-wanted"')
      // Don't add other filters for advanced - keep it simple
      console.log('Advanced filter: Using hardcoded query structure')
    } else {
      // For beginner and intermediate, use normal logic
      if (difficultyConfig.include.length > 0) {
        if (difficultyConfig.include.length === 1) {
          // Single label - no need for parentheses
          parts.push(`label:"${difficultyConfig.include[0]}"`)
        } else {
          // Multiple labels - use OR grouping with parentheses
          const includeLabels = difficultyConfig.include.map(label => `label:"${label}"`).join(' OR ')
          parts.push(`(${includeLabels})`)
        }
        
        // Exclude labels from other difficulty levels
        if (difficultyConfig.exclude && difficultyConfig.exclude.length > 0) {
          difficultyConfig.exclude.forEach(label => {
            parts.push(`-label:"${label}"`)
          })
        }
      }
    }
  }
  
  // Add search term if provided (skip for advanced to keep query simple)
  if (params.selectedDifficulty !== 'advanced' && params.searchTerm && params.searchTerm.trim()) {
    parts.push(params.searchTerm.trim())
  }
  
  // Handle framework filter (add as search term) - skip for advanced
  if (params.selectedDifficulty !== 'advanced' && params.selectedFramework) {
    const frameworkQuery = getFrameworkSearch(params.selectedFramework)
    if (frameworkQuery) {
      parts.push(frameworkQuery)
    }
  }
  
  // Handle language filter - skip for advanced to keep query simple
  if (params.selectedDifficulty !== 'advanced' && params.selectedLanguage) {
    parts.push(`language:${params.selectedLanguage}`)
  }
  
  // Handle categories (issue types) - these are labels
  // Skip if difficulty filter is selected to avoid conflicts
  if (!params.selectedDifficulty && params.selectedCategories && params.selectedCategories.length > 0 && !params.selectedCategories.includes('all')) {
    const categoryQueries = params.selectedCategories.map((cat) => `label:"${cat}"`)
    if (categoryQueries.length === 1) {
      parts.push(categoryQueries[0])
    } else if (categoryQueries.length > 1) {
      parts.push(`(${categoryQueries.join(' OR ')})`)
    }
  }
  
  // Handle type filter (if not already in categories)
  // Skip if difficulty filter is selected to avoid conflicts
  if (!params.selectedDifficulty && params.selectedType) {
    // Check if type is already in selectedCategories to avoid duplication
    if (!params.selectedCategories || !params.selectedCategories.includes(params.selectedType)) {
      parts.push(`label:"${params.selectedType}"`)
    }
  }
  
  // Handle legacy labels
  if (params.selectedLabels && params.selectedLabels.length > 0) {
    params.selectedLabels.forEach((l) => parts.push(`label:"${l}"`))
  }
  
  // Handle last activity filter - skip for advanced to keep query simple
  if (params.selectedDifficulty !== 'advanced' && params.selectedLastActivity) {
    const activityQuery = getLastActivityQuery(params.selectedLastActivity)
    if (activityQuery) {
      parts.push(activityQuery)
    }
  }
  
  const query = parts.join(' ')
  
  // Debug: Log the query when difficulty filter is used (always log for debugging)
  if (params.selectedDifficulty) {
    console.log('=== Difficulty Filter Debug ===')
    console.log('Selected difficulty:', params.selectedDifficulty)
    const difficultyConfig = getDifficultyLabels(params.selectedDifficulty)
    console.log('Include labels:', difficultyConfig.include)
    console.log('Exclude labels:', difficultyConfig.exclude)
    console.log('Query parts:', parts)
    console.log('Final query:', query)
    console.log('Encoded URL:', `https://api.github.com/search/issues?q=${encodeURIComponent(query)}`)
    
    // For advanced, verify the query includes the label requirement
    if (params.selectedDifficulty === 'advanced') {
      const hasAdvancedLabel = query.includes('label:"expert"') || 
                               query.includes('label:"advanced"') || 
                               query.includes('label:"hard"') || 
                               query.includes('label:"difficult"') ||
                               query.includes('label:"complex"') ||
                               query.includes('label:"challenging"')
      console.log('Advanced label check:', hasAdvancedLabel ? '✓ Query includes advanced labels' : '✗ Query missing advanced labels!')
      if (!hasAdvancedLabel) {
        console.error('ERROR: Advanced filter query does not include any advanced labels!')
        console.error('This should not happen - the query should include advanced labels')
      }
      
      // Also verify the query structure is correct
      const hasOrGroup = query.includes('(label:') && query.includes(' OR ')
      console.log('OR group check:', hasOrGroup ? '✓ Query has OR group' : '✗ Query missing OR group')
      
      // Verify excludes are present
      const hasExcludes = query.includes('-label:"good first issue"') || query.includes('-label:"help wanted"')
      console.log('Excludes check:', hasExcludes ? '✓ Query has excludes' : '✗ Query missing excludes')
    }
    console.log('==============================')
  }
  
  // If query is too restrictive (only base filters), add a default to show issues
  // This ensures we always show some results, but only if no other filters are applied
  const hasAnyFilter = params.selectedDifficulty || 
                       params.selectedType || 
                       params.selectedFramework || 
                       params.selectedLanguage ||
                       params.selectedLicense ||
                       params.selectedLastActivity ||
                       (params.selectedCategories && params.selectedCategories.length > 0 && !params.selectedCategories.includes('all')) ||
                       (params.selectedLabels && params.selectedLabels.length > 0) ||
                       (params.searchTerm && params.searchTerm.trim())
  
  // IMPORTANT: Never override the query if a difficulty filter is selected
  // This ensures advanced filter works correctly
  if (!hasAnyFilter && query === 'state:open type:issue no:assignee') {
    // Default: show good first issues and help wanted
    return 'state:open type:issue no:assignee (label:"good first issue" OR label:"help wanted")'
  }
  
  // Final verification and fix for advanced filter
  if (params.selectedDifficulty === 'advanced') {
    // For advanced, ALWAYS use the hardcoded query to ensure it works
    const advancedQuery = 'state:open type:issue no:assignee (label:"expert" OR label:"advanced" OR label:"hard" OR label:"difficult" OR label:"complex" OR label:"challenging") -label:"good first issue" -label:"good-first-issue" -label:"first-timers-only" -label:"help wanted" -label:"help-wanted"'
    console.log('Advanced filter: Using guaranteed query:', advancedQuery)
    return advancedQuery
  }
  
  return query
}

