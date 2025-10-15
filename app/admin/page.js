"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin(){
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function submit(e){
    e.preventDefault()
    setLoading(true)
    setErr('')

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user, password: pass }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store session token
        sessionStorage.setItem('admin_token', data.token)
        router.push('/admin/dashboard')
      } else {
        setErr(data.error || 'Invalid credentials')
      }
    } catch (error) {
      setErr('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary to-cyan">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-lg shadow-xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-cyan rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">CS</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Login</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Access the Codesky admin dashboard</p>
          </div>

          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                value={user}
                onChange={e=>setUser(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent dark:bg-slate-800 dark:text-white transition-colors"
                placeholder="Enter your username"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                value={pass}
                onChange={e=>setPass(e.target.value)}
                type="password"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent dark:bg-slate-800 dark:text-white transition-colors"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            {err && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{err}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-primary to-cyan text-white font-semibold rounded-lg hover:from-primary/90 hover:to-cyan/90 focus:ring-2 focus:ring-cyan focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Codesky Admin Portal
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
