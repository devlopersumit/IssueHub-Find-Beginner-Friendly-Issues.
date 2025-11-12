import React from 'react'

type FooterProps = {
  githubUrl?: string
  linkedinUrl?: string
  twitterUrl?: string
}

const Footer: React.FC<FooterProps> = ({
  githubUrl = 'https://github.com/devlopersumit',
  linkedinUrl = 'https://www.linkedin.com/in/sumit-jha?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
  twitterUrl = 'https://x.com/_sumitjha_?t=4nSWLPjfWOEhS06PoX9-Lg&s=09'
}) => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white/90 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-slate-500 dark:text-slate-400 sm:flex-row sm:text-sm">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <img src="/issuefinder-2.png" alt="IssueFinder" className="h-5 w-5" />
          <span>© {new Date().getFullYear()} IssueFinder · Built by a frustrated developer, for developers.</span>
        </div>
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          <span>Enjoying IssueFinder? Share your thoughts:</span>
          <a href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub" className="transition hover:text-slate-800 dark:hover:text-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.424 2.865 8.178 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.952 0-1.093.39-1.988 1.03-2.688-.104-.253-.447-1.27.098-2.647 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.748-1.026 2.748-1.026.546 1.377.203 2.394.1 2.647.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.696-4.566 4.945.359.309.679.92.679 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.481A10.019 10.019 0 0 0 22 12.017C22 6.484 17.523 2 12 2Z" clipRule="evenodd" />
            </svg>
          </a>
          <a href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="transition hover:text-slate-800 dark:hover:text-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8.98h5V24H0zM8.98 8.98H14v2.05h.07c.7-1.33 2.42-2.74 4.98-2.74 5.33 0 6.32 3.5 6.32 8.04V24h-5v-6.98c0-1.66-.03-3.8-2.32-3.8-2.32 0-2.68 1.8-2.68 3.68V24h-5z" />
            </svg>
          </a>
          <a href={twitterUrl} target="_blank" rel="noreferrer" aria-label="Twitter" className="transition hover:text-slate-800 dark:hover:text-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M23.953 4.57a10 10 0 0 1-2.825.775 4.93 4.93 0 0 0 2.163-2.723 9.864 9.864 0 0 1-3.127 1.196 4.916 4.916 0 0 0-8.384 4.482 13.944 13.944 0 0 1-10.125-5.14 4.822 4.822 0 0 0-.664 2.475 4.92 4.92 0 0 0 2.188 4.1 4.902 4.902 0 0 1-2.229-.616v.06a4.923 4.923 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.224.084 4.936 4.936 0 0 0 4.604 3.417 9.867 9.867 0 0 1-6.102 2.105c-.396 0-.79-.023-1.175-.067a13.945 13.945 0 0 0 7.557 2.212c9.054 0 14-7.496 14-13.986 0-.21-.006-.423-.016-.633a9.935 9.935 0 0 0 2.46-2.548z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
