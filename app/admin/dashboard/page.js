"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAdmin } from '../../../lib/adminContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

async function fetchJSON(path){
  try {
    const r = await fetch(path)
    if(!r.ok) return []
    const j = await r.json()
    return j?.data || j || []
  } catch (error) {
    console.error(`Error fetching ${path}:`, error)
    return []
  }
}

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: 'chart-bar' },
  { name: 'Projects', href: '/admin/projects', icon: 'project-diagram' },
  { name: 'Founders', href: '/admin/founders', icon: 'users' },
  { name: 'Comments', href: '/admin/comments', icon: 'comments' },
  { name: 'Contact Forms', href: '/admin/contacts', icon: 'mail-bulk' },
  { name: 'Ads Management', href: '/admin/ads', icon: 'bullhorn' },
  { name: 'Settings', href: '/admin/settings', icon: 'gears' },
]

export default function AdminDashboard(){
  const { isAdmin, isLoading } = useAdmin()
  const [projects, setProjects] = useState([])
  const [founders, setFounders] = useState([])
  const [comments, setComments] = useState([])
  const [ads, setAds] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [dataLoaded, setDataLoaded] = useState(false)
  const pathname = usePathname()

  useEffect(()=>{
    if(!isAdmin || dataLoaded) return

    const loadData = async () => {
      setLoading(true)
      try {
        const [projectsData, foundersData, commentsData, adsData, contactsData] = await Promise.all([
          fetchJSON('/api/projects'),
          fetchJSON('/api/founders'),
          fetchJSON('/api/comments'),
          fetchJSON('/api/ads'),
          fetchJSON('/api/contact')
        ])

        setProjects(projectsData)
        setFounders(foundersData)
        setComments(commentsData)
        setAds(adsData)
        setContacts(contactsData)
        setDataLoaded(true)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  },[isAdmin, dataLoaded])

  async function deleteComment(id){
    if(!confirm('Delete comment?')) return
    try {
      const res = await fetch('/api/comments/'+id, { method: 'DELETE' })
      if(res.ok) {
        setComments(c=>c.filter(x=>x.id!==id))
      } else {
        alert('Failed to delete comment')
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      alert('Error deleting comment')
    }
  }

  if(isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <FontAwesomeIcon icon="gears" className="animate-spin text-4xl text-cyan mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if(!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-cyan rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CS</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Codeskytz Admin</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Management Portal</p>
              </div>
            </div>

            {/* Navigation Links - Desktop */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-cyan text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <FontAwesomeIcon icon={item.icon} className="text-lg" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* User Info and Mobile Back Button */}
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <FontAwesomeIcon icon="home" className="text-lg" />
                <span className="hidden sm:inline">Back to Site</span>
              </Link>
              <button
                onClick={async () => {
                  try {
                    await fetch('/api/admin/auth', { method: 'DELETE' })
                  } catch (error) {
                    console.error('Logout error:', error)
                  } finally {
                    sessionStorage.removeItem('admin_token')
                    window.dispatchEvent(new Event('admin-auth-update'))
                    window.location.href = '/admin'
                  }
                }}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <FontAwesomeIcon icon="sign-out-alt" className="text-lg" />
                <span className="hidden sm:inline">Logout</span>
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-cyan rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon="user" className="text-white text-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 dark:border-slate-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-cyan text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <FontAwesomeIcon icon={item.icon} className="text-lg" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Dashboard Header */}
        <div className="bg-gradient-to-r from-primary to-cyan rounded-lg p-6 text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-lg opacity-90">Welcome to the Codeskytz management portal</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FontAwesomeIcon icon="project-diagram" className="text-2xl text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{projects.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <FontAwesomeIcon icon="users" className="text-2xl text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Team Members</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{founders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <FontAwesomeIcon icon="comments" className="text-2xl text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Comments</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{comments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <FontAwesomeIcon icon="mail-bulk" className="text-2xl text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Contact Forms</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{contacts.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/projects/new"
              className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
            >
              <FontAwesomeIcon icon="plus" className="text-xl mr-2" />
              Add Project
            </Link>
            <Link
              href="/admin/founders/new"
              className="flex items-center justify-center p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
            >
              <FontAwesomeIcon icon="plus" className="text-xl mr-2" />
              Add Founder
            </Link>
            <Link
              href="/admin/contacts"
              className="flex items-center justify-center p-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200"
            >
              <FontAwesomeIcon icon="mail-bulk" className="text-xl mr-2" />
              View Contacts
            </Link>
            <Link
              href="/admin/ads"
              className="flex items-center justify-center p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
            >
              <FontAwesomeIcon icon="bullhorn" className="text-xl mr-2" />
              Manage Ads
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Recent Projects */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Projects</h3>
              <Link href="/admin/projects" className="text-cyan hover:text-cyan/80 text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {projects.slice(0, 3).map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white">{p.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 truncate">{p.summary}</div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link href={`/portfolio/${p.id}`} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                      View
                    </Link>
                    <Link href={`/admin/projects/edit/${p.id}`} className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-600 text-gray-700 dark:text-gray-300 rounded">
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No projects yet</p>
              )}
            </div>
          </div>

          {/* Recent Comments */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Comments</h3>
              <Link href="/admin/comments" className="text-cyan hover:text-cyan/80 text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {comments.slice(0, 3).map(c => (
                <div key={c.id} className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white">{c.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 truncate">{c.comment}</div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <div className="text-sm text-yellow-500">{c.rating || 0}★</div>
                      <button
                        onClick={() => deleteComment(c.id)}
                        className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No comments yet</p>
              )}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <FontAwesomeIcon icon="database" className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-400">Database</p>
                <p className="text-xs text-green-600 dark:text-green-500">Connected</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <FontAwesomeIcon icon="route" className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-400">API Routes</p>
                <p className="text-xs text-blue-600 dark:text-blue-500">Operational</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <FontAwesomeIcon icon="check-circle" className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-purple-800 dark:text-purple-400">Authentication</p>
                <p className="text-xs text-purple-600 dark:text-purple-500">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
