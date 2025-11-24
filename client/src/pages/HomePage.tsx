import React from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'

const HomePage: React.FC = () => {
  const problems = [
    {
      title: 'Too much time searching',
      description: 'Spending hours scrolling through GitHub looking for the right issue',
      solution: 'We filter and curate issues so you find matches in seconds, not hours'
    },
    {
      title: 'Can\'t find beginner-friendly issues',
      description: 'Hard to identify which issues are suitable for first-time contributors',
      solution: 'Smart difficulty detection and "good first issue" filtering makes it easy'
    },
    {
      title: 'Issues don\'t match your skills',
      description: 'Finding issues in languages or frameworks you don\'t know',
      solution: 'Filter by programming language, framework, and tech stack automatically'
    },
    {
      title: 'Stale or inactive issues',
      description: 'Wasting time on issues that haven\'t been updated in months',
      solution: 'Freshness indicators show only active issues updated recently'
    },
    {
      title: 'No clear difficulty levels',
      description: 'Uncertain if an issue is too easy, too hard, or just right for you',
      solution: 'Automatic difficulty classification: Beginner, Intermediate, or Advanced'
    },
    {
      title: 'Hard to discover new projects',
      description: 'Struggling to find interesting projects worth contributing to',
      solution: 'Browse curated repositories organized by category and popularity'
    }
  ]

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'Smart Filtering',
      description: 'Filter by language, difficulty, category, and freshness'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Fresh Issues Only',
      description: 'See only active issues updated in the last 60 days'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Beginner Friendly',
      description: 'Special focus on issues perfect for first-time contributors'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      title: 'Organized by Category',
      description: 'Browse bugs, features, documentation, and more by category'
    }
  ]

  return (
    <>
      <Hero />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        {/* Problems We Solve Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              The Problems We Solve
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Open source contributors face real challenges. Here's how IssueFinder helps you overcome them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((problem, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {problem.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {problem.description}
                    </p>
                    <div className="flex items-start gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        {problem.solution}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works / Features */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              How IssueFinder Helps
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to make your contribution journey smoother
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Ready to start contributing?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Stop wasting time searching. Find issues that match your skills in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/categories"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-8 py-3 text-base font-semibold text-white transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              Browse by Category
            </Link>
            <Link
              to="/issues"
              className="inline-flex items-center justify-center rounded-lg border-2 border-emerald-600 bg-white px-8 py-3 text-base font-semibold text-emerald-600 transition hover:bg-emerald-50 dark:border-emerald-500 dark:bg-gray-900 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
            >
              View All Issues
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}

export default HomePage
