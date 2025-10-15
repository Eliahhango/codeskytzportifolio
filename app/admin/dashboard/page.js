"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAdmin } from '../../../lib/adminContext'

async function fetchJSON(path){
  const r = await fetch(path)
  if(!r.ok) return []
  const j = await r.json()
  // API responses may be array or { data: [] }
  return j?.data || j || []
}

export default function AdminDashboard(){
  const { isAdmin, isLoading } = useAdmin()
  const [projects, setProjects] = useState([])
  const [founders, setFounders] = useState([])
  const [comments, setComments] = useState([])
  const [ads, setAds] = useState([])
  const [contacts, setContacts] = useState([])
  const [newAdUrl, setNewAdUrl] = useState('')
  const [newAdAlt, setNewAdAlt] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    if(!isAdmin) {
      setLoading(false)
      return
    }

    let mounted = true

    const loadData = async () => {
      if (!mounted) return

      setLoading(true)
      try {
        const [projectsData, foundersData, commentsData, adsData, contactsData] = await Promise.all([
          fetchJSON('/api/projects'),
          fetchJSON('/api/founders'),
          fetchJSON('/api/comments'),
          fetchJSON('/api/ads'),
          fetchJSON('/api/contact')
        ])

        if (mounted) {
          setProjects(projectsData)
          setFounders(foundersData)
          setComments(commentsData)
          setAds(adsData)
          setContacts(contactsData)
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadData()

    // poll comments every 30s so newly submitted reviews appear
    const iv = setInterval(()=>{
      if (mounted) {
        fetchJSON('/api/comments').then(data => {
          if (mounted) setComments(data)
        })
      }
    }, 30000)

    return ()=>{
      mounted = false
      clearInterval(iv)
    }
  },[isAdmin])

  if(isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading admin dashboard...</p>
      </div>
    </div>
  )

  if(!isAdmin) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-lg shadow">
        <div className="text-red-500 text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">You need administrator privileges to access this page.</p>
        <Link href="/admin" className="px-4 py-2 bg-cyan text-white rounded hover:bg-cyan/90 transition-colors">
          Go to Login
        </Link>
      </div>
    </div>
  )

  async function deleteProject(id){
    if(!confirm('Delete project?')) return
    const res = await fetch('/api/projects/'+id, { method: 'DELETE' })
    if(!res.ok) return alert('Failed to delete')
    setProjects(p=>p.filter(x=>x.id!==id))
  }

  async function deleteComment(id){
    if(!confirm('Delete comment?')) return
    const res = await fetch('/api/comments/'+id, { method: 'DELETE' })
    if(!res.ok) return alert('Failed to delete comment')
    setComments(c=>c.filter(x=>x.id!==id))
  }

  async function deleteFounder(id){
    if(!confirm('Delete founder?')) return
    const res = await fetch('/api/founders/'+id, { method: 'DELETE' })
    if(!res.ok) return alert('Failed to delete founder')
    setFounders(f=>f.filter(x=>x.id!==id))
  }

  async function createAd(){
    if(!newAdUrl) return alert('Provide image URL')
    try{
      const res = await fetch('/api/ads', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ url: newAdUrl, alt: newAdAlt }) })
      if(!res.ok) throw new Error('create failed')
      const j = await res.json()
      setAds(a=>[j.data, ...a])
      setNewAdUrl('')
      setNewAdAlt('')
    }catch(e){ console.error(e); alert('Failed to create ad') }
  }

  async function deleteAd(id){
    if(!confirm('Delete ad?')) return
    const res = await fetch('/api/ads/'+id, { method: 'DELETE' })
    if(!res.ok) return alert('Failed to delete ad')
    setAds(a=>a.filter(x=>x.id!==id))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-cyan rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-lg opacity-90">Welcome to the Codesky management portal</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <span className="text-2xl">🚀</span>
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
              <span className="text-2xl">👥</span>
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
              <span className="text-2xl">💬</span>
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
              <span className="text-2xl">📧</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Contact Forms</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{contacts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/projects/new"
            className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
          >
            <span className="text-2xl mr-2">➕</span>
            Add Project
          </Link>
          <Link
            href="/admin/founders/new"
            className="flex items-center justify-center p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
          >
            <span className="text-2xl mr-2">➕</span>
            Add Founder
          </Link>
          <Link
            href="/admin/ads"
            className="flex items-center justify-center p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
          >
            <span className="text-2xl mr-2">🎯</span>
            Manage Ads
          </Link>
          <Link
            href="/admin/contacts"
            className="flex items-center justify-center p-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200"
          >
            <span className="text-2xl mr-2">📧</span>
            View Contacts
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-400">Database</p>
              <p className="text-xs text-green-600 dark:text-green-500">Connected</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-400">API Routes</p>
              <p className="text-xs text-blue-600 dark:text-blue-500">Operational</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-purple-800 dark:text-purple-400">Authentication</p>
              <p className="text-xs text-purple-600 dark:text-purple-500">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
