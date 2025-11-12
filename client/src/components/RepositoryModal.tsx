import React, { useEffect } from 'react'
import RepositoryModalContent from './RepositoryModalContent'

type RepositoryModalProps = {
  repoFullName: string | null
  onClose: () => void
}

const RepositoryModal: React.FC<RepositoryModalProps> = ({ repoFullName, onClose }) => {
  useEffect(() => {
    if (repoFullName) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [repoFullName])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && repoFullName) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [repoFullName, onClose])

  if (!repoFullName) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-gray-300 dark:border-gray-700 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <RepositoryModalContent repoFullName={repoFullName} onClose={onClose} />
        </div>
      </div>
    </div>
  )
}

export default RepositoryModal

