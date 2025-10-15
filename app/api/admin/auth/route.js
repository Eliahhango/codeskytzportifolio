import { query } from '../../../../lib/db'

export async function POST(req) {
  try {
    const body = await req.json()
    const { username, password } = body

    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Username and password required' }), { status: 400 })
    }

    // Simple authentication check
    if (username === 'codeskytz' && password === 'codeskytz123') {
      // Create a simple session token (in production, use proper JWT)
      const sessionToken = Buffer.from(JSON.stringify({
        admin: true,
        exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      })).toString('base64')

      return new Response(JSON.stringify({
        success: true,
        token: sessionToken,
        user: { username: 'codeskytz' }
      }), { status: 200 })
    }

    return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 })
  } catch (error) {
    console.error('Admin auth error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    // In a real app, you'd invalidate the session token
    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    console.error('Admin logout error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}