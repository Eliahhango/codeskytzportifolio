"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAdmin } from '../../../lib/adminContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

async function fetchComments() {
  const response = await fetch('/api/comments')
  if (!response.ok) return []
  const data = await response.json()
  return data || []
}

export default function AdminComments() {
  const { isAdmin, isLoading } = useAdmin()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!isAdmin) return

    const loadComments = async () => {
      setLoading(true)
      try {
        const commentsData = await fetchComments()
        setComments(commentsData)
      } catch (error) {
        console.error('Error loading comments:', error)
      } finally {
        setLoading(false)
      }
    }

    loadComments()
  }, [isAdmin])

  const filteredComments = comments.filter(comment =>
    comment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  async function deleteComment(id) {
    if (!confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setComments(comments => comments.filter(c => c.id !== id))
      } else {
        alert('Failed to delete comment')
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      alert('Error deleting comment')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon="gears" className="animate-spin text-4xl text-cyan mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-lg shadow">
          <FontAwesomeIcon icon="exclamation-triangle" className="text-red-500 text-6xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">You need administrator privileges to access this page.</p>
          <Link href="/admin" className="px-4 py-2 bg-cyan text-white rounded hover:bg-cyan/90 transition-colors">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Comments Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage user comments and reviews</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search comments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent dark:bg-slate-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FontAwesomeIcon icon="gears" className="animate-spin text-2xl text-cyan" />
        </div>
      ) : (
        <>
          {filteredComments.length === 0 ? (
            <div className="text-center py-12">
              <FontAwesomeIcon icon="comments" className="text-gray-400 text-6xl mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No comments found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm ? 'Try adjusting your search terms.' : 'No comments have been submitted yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredComments.map(comment => (
                <div key={comment.id} className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{comment.name}</h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{comment.email}</span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${i < (comment.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{comment.comment}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => deleteComment(comment.id)}
                        className="px-3 py-2 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-slate-700 pt-3">
                    Submitted on: {new Date(comment.created_at || comment.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Stats Footer */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Total Comments: {comments.length}</span>
          <span>Showing: {filteredComments.length}</span>
        </div>
      </div>
    </div>
  )
}