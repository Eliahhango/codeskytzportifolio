import { query } from '../../../lib/db'
import { rateLimit } from '../../../lib/rateLimit'

export async function POST(req){
  try {
    const body = await req.json()
    const {name, email, subject, message} = body

    if(!name || !email || !message) {
      return new Response(JSON.stringify({error:'Missing fields'}), {status:400})
    }

    const rl = rateLimit('contact-'+(req.headers.get('x-forwarded-for')||'anon'), 20, 60)
    if(rl.limited) {
      return new Response(JSON.stringify({error:'Too many requests'}), {status:429})
    }

    // Save to database
    const result = await query(
      `INSERT INTO contact_submissions (name, email, subject, message, status)
       VALUES ($1, $2, $3, $4, 'new')
       RETURNING *`,
      [name, email, subject || '', message]
    )

    const submission = result.rows[0]

    // TODO: Send email via SMTP or third-party service
    console.log('Contact form submission saved:', submission)

    return new Response(JSON.stringify({
      ok: true,
      message: 'Message sent successfully',
      id: submission.id
    }), { status: 201 })
  } catch (error) {
    console.error('Contact POST error:', error)
    return new Response(JSON.stringify({error: 'Internal server error'}), {status:500})
  }
}
