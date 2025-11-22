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

function getDifficultyLabels(difficulty: string | null): { include: string[], exclude?: string[] } {
  if (!difficulty) return { include: [] }
  
  const difficultyMap: Record<string, { include: string[], exclude?: string[] }> = {
    beginner: {
      include: [
        'good first issue',      // Most common - used by thousands of repos
        'good-first-issue',
      ],
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
      include: [
        'expert',                // Common label for advanced issues
        'advanced',              // Direct label
        'hard',                  // Simple common label
        'difficult',             // Alternative
        'complex',               // Alternative
        'challenging',
      ],
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

function getFrameworkSearch(framework: string | null): string {
  if (!framework) return ''
  
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
  
  return searchTerm
}

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
        date = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      default:
        return ''
    }
    
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

export function buildGitHubQuery(params: QueryBuilderParams): string {
  const parts: string[] = []
  
  parts.push('state:open')
  parts.push('type:issue')
  parts.push('no:assignee')
  
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const year = thirtyDaysAgo.getFullYear()
  const month = String(thirtyDaysAgo.getMonth() + 1).padStart(2, '0')
  const day = String(thirtyDaysAgo.getDate()).padStart(2, '0')
  const dateStr = `${year}-${month}-${day}`
  
  if (params.selectedLastActivity) {
    const activityQuery = getLastActivityQuery(params.selectedLastActivity)
    if (activityQuery) {
      parts.push(activityQuery)
    } else {
      parts.push(`created:>${dateStr}`)
    }
  } else {
    parts.push(`created:>${dateStr}`)
  }
  
  if (params.selectedDifficulty) {
    const difficultyConfig = getDifficultyLabels(params.selectedDifficulty)
    
    if (params.selectedDifficulty === 'advanced') {
      parts.length = 0
      parts.push('state:open')
      parts.push('type:issue')
      parts.push('no:assignee')
      
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const year = thirtyDaysAgo.getFullYear()
      const month = String(thirtyDaysAgo.getMonth() + 1).padStart(2, '0')
      const day = String(thirtyDaysAgo.getDate()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}`
      parts.push(`created:>${dateStr}`)
      parts.push('(label:"expert" OR label:"advanced" OR label:"hard" OR label:"difficult" OR label:"complex" OR label:"challenging")')
      parts.push('-label:"good first issue"')
      parts.push('-label:"good-first-issue"')
      parts.push('-label:"first-timers-only"')
      parts.push('-label:"help wanted"')
      parts.push('-label:"help-wanted"')
    } else {
      if (difficultyConfig.include.length > 0) {
        if (difficultyConfig.include.length === 1) {
          parts.push(`label:"${difficultyConfig.include[0]}"`)
        } else {
          const includeLabels = difficultyConfig.include.map(label => `label:"${label}"`).join(' OR ')
          parts.push(`(${includeLabels})`)
        }
        
        if (difficultyConfig.exclude && difficultyConfig.exclude.length > 0) {
          difficultyConfig.exclude.forEach(label => {
            parts.push(`-label:"${label}"`)
          })
        }
      }
    }
  }
  
  if (params.selectedDifficulty !== 'advanced' && params.searchTerm && params.searchTerm.trim()) {
    parts.push(params.searchTerm.trim())
  }
  
  if (params.selectedDifficulty !== 'advanced' && params.selectedFramework) {
    const frameworkQuery = getFrameworkSearch(params.selectedFramework)
    if (frameworkQuery) {
      parts.push(frameworkQuery)
    }
  }
  
  if (params.selectedDifficulty !== 'advanced' && params.selectedLanguage) {
    parts.push(`language:${params.selectedLanguage}`)
  }
  
  if (!params.selectedDifficulty && params.selectedCategories && params.selectedCategories.length > 0 && !params.selectedCategories.includes('all')) {
    const categoryQueries = params.selectedCategories.map((cat) => `label:"${cat}"`)
    if (categoryQueries.length === 1) {
      parts.push(categoryQueries[0])
    } else if (categoryQueries.length > 1) {
      parts.push(`(${categoryQueries.join(' OR ')})`)
    }
  }
  
  if (!params.selectedDifficulty && params.selectedType) {
    if (!params.selectedCategories || !params.selectedCategories.includes(params.selectedType)) {
      parts.push(`label:"${params.selectedType}"`)
    }
  }
  
  if (params.selectedLabels && params.selectedLabels.length > 0) {
    params.selectedLabels.forEach((l) => parts.push(`label:"${l}"`))
  }
  
  
  const query = parts.join(' ')
  
  const hasAnyFilter = params.selectedDifficulty || 
                       params.selectedType || 
                       params.selectedFramework || 
                       params.selectedLanguage ||
                       params.selectedLicense ||
                       params.selectedLastActivity ||
                       (params.selectedCategories && params.selectedCategories.length > 0 && !params.selectedCategories.includes('all')) ||
                       (params.selectedLabels && params.selectedLabels.length > 0) ||
                       (params.searchTerm && params.searchTerm.trim())
  
  const baseDateFilter = `created:>${dateStr}`
  
  if (!hasAnyFilter && query === `state:open type:issue no:assignee ${baseDateFilter}`) {
    return `state:open type:issue no:assignee ${baseDateFilter} (label:"good first issue" OR label:"help wanted")`
  }

  if (params.selectedDifficulty === 'advanced') {
    const advancedQuery = `state:open type:issue no:assignee ${baseDateFilter} (label:"expert" OR label:"advanced" OR label:"hard" OR label:"difficult" OR label:"complex" OR label:"challenging") -label:"good first issue" -label:"good-first-issue" -label:"first-timers-only" -label:"help wanted" -label:"help-wanted"`
    return advancedQuery
  }
  
  return query
}

