import React from 'react'
import { Link } from 'react-router-dom'

const AboutPage: React.FC = () => {
  return (
    <>
      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
            About IssueFinder
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Making open-source contribution accessible to everyone, one issue at a time.
          </p>
        </section>

        {/* Product Section */}
        <section className="mb-16">
          <div className="rounded-3xl border border-slate-200 bg-white px-8 py-12 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-6 text-3xl font-semibold text-slate-900 dark:text-slate-100">Our Product</h2>
            <div className="space-y-6 text-slate-600 dark:text-slate-300">
              <p className="text-lg leading-relaxed">
                IssueFinder is a curated platform designed to help developers find beginner-friendly open-source issues quickly and efficiently. We understand the frustration of sifting through thousands of issues to find something you can actually contribute to.
              </p>
              <p className="leading-relaxed">
                Our platform aggregates issues from GitHub repositories, filters them for quality and beginner-friendliness, and presents them in an easy-to-browse format. We use intelligent filtering to help you find issues that match your skills, interests, and experience level.
              </p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Mission</h3>
                  <p className="text-sm leading-relaxed">
                    To lower the barrier to entry for open-source contribution by curating high-quality, beginner-friendly issues and making them easily discoverable.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Vision</h3>
                  <p className="text-sm leading-relaxed">
                    A world where every developer, regardless of experience level, can easily find and contribute to meaningful open-source projects.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <div className="rounded-3xl border border-slate-200 bg-white px-8 py-12 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-8 text-3xl font-semibold text-slate-900 dark:text-slate-100">Key Features</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-gray-900">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">Curated Quality</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Every issue is reviewed to ensure it's beginner-friendly and ready for contribution.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-gray-900">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">Advanced Filtering</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Filter by language, difficulty, framework, license, and more to find the perfect match.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-gray-900">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">Real-time Updates</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Our catalog is updated hourly with fresh, unassigned issues from active repositories.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-gray-900">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">Community Focused</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Built by developers, for developers. We understand the challenges you face.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founders Section */}
        <section className="mb-16">
          <div className="rounded-3xl border border-slate-200 bg-white px-8 py-12 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-8 text-3xl font-semibold text-slate-900 dark:text-slate-100">The Team</h2>
            <div className="space-y-8">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-slate-900 text-2xl font-bold text-white dark:bg-slate-100 dark:text-gray-900">
                    SJ
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Sumit Jha</h3>
                    <p className="mt-1 text-slate-600 dark:text-slate-300">Founder & Developer</p>
                    <p className="mt-4 text-slate-600 dark:text-slate-300">
                      Sumit is a passionate developer who built IssueFinder out of frustration with the difficulty of finding beginner-friendly open-source issues. With a deep understanding of the challenges developers face when starting their open-source journey, he created this platform to make contribution more accessible.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
                      <a
                        href="https://github.com/devlopersumit"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-200 dark:hover:border-gray-600 dark:hover:text-white"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.424 2.865 8.178 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.952 0-1.093.39-1.988 1.03-2.688-.104-.253-.447-1.27.098-2.647 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.748-1.026 2.748-1.026.546 1.377.203 2.394.1 2.647.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.696-4.566 4.945.359.309.679.92.679 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.481A10.019 10.019 0 0 0 22 12.017C22 6.484 17.523 2 12 2Z" clipRule="evenodd" />
                        </svg>
                        GitHub
                      </a>
                      <a
                        href="https://www.linkedin.com/in/sumit-jha?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-200 dark:hover:border-gray-600 dark:hover:text-white"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8.98h5V24H0zM8.98 8.98H14v2.05h.07c.7-1.33 2.42-2.74 4.98-2.74 5.33 0 6.32 3.5 6.32 8.04V24h-5v-6.98c0-1.66-.03-3.8-2.32-3.8-2.32 0-2.68 1.8-2.68 3.68V24h-5z" />
                        </svg>
                        LinkedIn
                      </a>
                      <a
                        href="https://x.com/_sumitjha_?t=4nSWLPjfWOEhS06PoX9-Lg&s=09"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-200 dark:hover:border-gray-600 dark:hover:text-white"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 0 1-2.825.775 4.93 4.93 0 0 0 2.163-2.723 9.864 9.864 0 0 1-3.127 1.196 4.916 4.916 0 0 0-8.384 4.482 13.944 13.944 0 0 1-10.125-5.14 4.822 4.822 0 0 0-.664 2.475 4.92 4.92 0 0 0 2.188 4.1 4.902 4.902 0 0 1-2.229-.616v.06a4.923 4.923 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.224.084 4.936 4.936 0 0 0 4.604 3.417 9.867 9.867 0 0 1-6.102 2.105c-.396 0-.79-.023-1.175-.067a13.945 13.945 0 0 0 7.557 2.212c9.054 0 14-7.496 14-13.986 0-.21-.006-.423-.016-.633a9.935 9.935 0 0 0 2.46-2.548z" />
                        </svg>
                        Twitter
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-8 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-slate-900 text-2xl font-bold text-white dark:bg-slate-100 dark:text-gray-900">
                    HK
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Hamdan Khubaib</h3>
                    <p className="mt-1 text-slate-600 dark:text-slate-300">Contributor & MERN Stack Developer</p>
                    <p className="mt-4 text-slate-600 dark:text-slate-300">
                      With 4-5 years of experience in Python development and 2-3 years in web development, Hamdan specializes in creating robust and user-friendly applications using modern technologies. He's proficient in both backend development with Python and frontend development with React and other modern web technologies. He's passionate about solving complex problems and delivering high-quality solutions that meet client needs.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
                      <a
                        href="mailto:hamdankhubaib959@gmail.com"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-200 dark:hover:border-gray-600 dark:hover:text-white"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email
                      </a>
                      <a
                        href="https://github.com/GitCoder052023"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-200 dark:hover:border-gray-600 dark:hover:text-white"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.424 2.865 8.178 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.952 0-1.093.39-1.988 1.03-2.688-.104-.253-.447-1.27.098-2.647 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.748-1.026 2.748-1.026.546 1.377.203 2.394.1 2.647.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.696-4.566 4.945.359.309.679.92.679 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.481A10.019 10.019 0 0 0 22 12.017C22 6.484 17.523 2 12 2Z" clipRule="evenodd" />
                        </svg>
                        GitHub
                      </a>
                      <a
                        href="https://linkedin.com/in/hamdan-khubaib-3046b8331"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-200 dark:hover:border-gray-600 dark:hover:text-white"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8.98h5V24H0zM8.98 8.98H14v2.05h.07c.7-1.33 2.42-2.74 4.98-2.74 5.33 0 6.32 3.5 6.32 8.04V24h-5v-6.98c0-1.66-.03-3.8-2.32-3.8-2.32 0-2.68 1.8-2.68 3.68V24h-5z" />
                        </svg>
                        LinkedIn
                      </a>
                      <a
                        href="https://threads.com/@hamdankhubaib"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-200 dark:hover:border-gray-600 dark:hover:text-white"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.186 8.672 18.74.192h-2.916l-5.49 6.48L5.596.192H0l6.556 7.92L0 16.128h2.916l5.818-6.864 5.18 6.864H18.74L12.186 8.672zm-2.27 2.66-.783-.926-6.116-7.23h2.51l4.934 5.838.783.926 6.554 7.76h-2.51l-5.255-6.268z"/>
                        </svg>
                        Threads
                      </a>
                      <a
                        href="https://instagram.com/hamdankhubaib/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-200 dark:hover:border-gray-600 dark:hover:text-white"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        Instagram
                      </a>
                      <a
                        href="https://hamdankhubaib.in"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-200 dark:hover:border-gray-600 dark:hover:text-white"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        Portfolio
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-16">
          <div className="rounded-3xl border border-slate-200 bg-linear-to-br from-slate-50 via-white to-slate-100 px-8 py-12 text-center shadow-lg dark:border-gray-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">
              Ready to start contributing?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-600 dark:text-slate-300">
              Explore our curated catalog and find the perfect open-source issue to get started.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/home"
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-slate-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-slate-100 dark:text-gray-900 dark:hover:bg-slate-200"
              >
                Explore the Catalog
              </Link>
              <Link
                to="/bounty"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-8 py-3 text-base font-semibold text-slate-800 transition-colors duration-200 hover:border-slate-400 hover:text-slate-900 dark:border-gray-700 dark:text-slate-200 dark:hover:border-gray-500 dark:hover:text-white"
              >
                View Bounty Issues
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default AboutPage

