"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAdmin } from '../../../lib/adminContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

async function fetchContacts() {
  const response = await fetch('/api/contact')
  if (!response.ok) return []
  const data = await response.json()
  return data || []
}

export default function AdminContacts() {
  const { isAdmin, isLoading } = useAdmin()
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!isAdmin) return

    const loadContacts = async () => {
      setLoading(true)
      try {
        const contactsData = await fetchContacts()
        setContacts(contactsData)
      } catch (error) {
        console.error('Error loading contacts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadContacts()
  }, [isAdmin])

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  async function deleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact message? This action cannot be undone.')) {
      return
    }

    try {
      // Note: This would need a DELETE endpoint in the API
      const response = await fetch(`/api/contact/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setContacts(contacts => contacts.filter(c => c.id !== id))
      } else {
        alert('Failed to delete contact message')
      }
    } catch (error) {
      console.error('Error deleting contact:', error)
      alert('Error deleting contact message')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon="cog" className="animate-spin text-4xl text-cyan mx-auto mb-4" />
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Messages</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage contact form submissions</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent dark:bg-slate-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Contacts List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FontAwesomeIcon icon="cog" className="animate-spin text-2xl text-cyan" />
        </div>
      ) : (
        <>
          {filteredContacts.length === 0 ? (
            <div className="text-center py-12">
              <FontAwesomeIcon icon="mail-bulk" className="text-gray-400 text-6xl mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No messages found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm ? 'Try adjusting your search terms.' : 'No contact messages have been received yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContacts.map(contact => (
                <div key={contact.id} className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{contact.name}</h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{contact.email}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          contact.status === 'read'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        }`}>
                          {contact.status === 'read' ? 'Read' : 'Unread'}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{contact.subject}</h4>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{contact.message}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        className="px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        Mark Read
                      </button>
                      <button
                        onClick={() => deleteContact(contact.id)}
                        className="px-3 py-2 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-slate-700 pt-3">
                    Received on: {new Date(contact.created_at || contact.date).toLocaleDateString()}
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
          <span>Total Messages: {contacts.length}</span>
          <span>Unread: {contacts.filter(c => c.status !== 'read').length}</span>
          <span>Showing: {filteredContacts.length}</span>
        </div>
      </div>
    </div>
  )
}