import React from 'react'

const ISSUE_CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'good first issue', label: 'Good First' },
  { key: 'help wanted', label: 'Help Wanted' },
  { key: 'bug', label: 'Bug' },
  { key: 'enhancement', label: 'Enhancement' },
  { key: 'feature', label: 'Feature' },
  { key: 'documentation', label: 'Docs' },
  { key: 'refactor', label: 'Refactor' },
  { key: 'performance', label: 'Performance' },
  { key: 'testing', label: 'Testing' },
  { key: 'question', label: 'Question' },
]

type MobileCategoryTabsProps = {
  selectedCategories: string[]
  onToggleCategory: (category: string) => void
}

const MobileCategoryTabs: React.FC<MobileCategoryTabsProps> = ({
  selectedCategories,
  onToggleCategory
}) => {
  const handleCategoryToggle = (category: string) => {
    if (category === 'all') {
      
      selectedCategories.forEach(c => onToggleCategory(c))
    } else {
      
      if (selectedCategories.includes('all')) {
        onToggleCategory('all')
      }
      onToggleCategory(category)
    }
  }

  return (
    <div className="md:hidden mb-4 -mx-4 px-4">
      <div className="overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          {ISSUE_CATEGORIES.map((cat) => {
            const active = selectedCategories.includes(cat.key) || (cat.key === 'all' && selectedCategories.length === 0)
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => handleCategoryToggle(cat.key)}
                className={`shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                  active 
                    ? 'bg-slate-700 dark:bg-slate-600 !text-white shadow-md' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                }`}
              >
                <span className={active ? 'text-white' : ''}>{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MobileCategoryTabs
