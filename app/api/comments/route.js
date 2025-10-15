import { query } from '../../../lib/db'
import { rateLimit } from '../../../lib/rateLimit'

export async function GET(){
  try {
    const result = await query(
      'SELECT * FROM comments ORDER BY created_at DESC'
    )
    return new Response(JSON.stringify({data: result.rows}), { status: 200 })
  } catch (error) {
    console.error('Comments GET error:', error)
    return new Response(JSON.stringify({data: []}), { status: 200 })
  }
}

export async function POST(req){
  try {
    const body = await req.json()
    const {name, email, rating, comment} = body

    if(!name || !email || !comment) {
      return new Response(JSON.stringify({error:'Missing fields'}), {status:400})
    }

    const rl = rateLimit('comments-'+(req.headers.get('x-forwarded-for')||'anon'), 50, 60)
    if(rl.limited) {
      return new Response(JSON.stringify({error:'Too many requests'}), {status:429})
    }

    const result = await query(
      `INSERT INTO comments (name, rating, comment, date)
       VALUES ($1, $2, $3, CURRENT_DATE)
       RETURNING *`,
      [name, rating || 5, comment]
    )

    const newComment = result.rows[0]
    return new Response(JSON.stringify({data: newComment}), {status:201})
  } catch (error) {
    console.error('Comments POST error:', error)
    return new Response(JSON.stringify({error: 'Internal server error'}), {status:500})
  }
}
