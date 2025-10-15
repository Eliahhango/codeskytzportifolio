import { query } from '../../../lib/db'

export async function GET(){
  try{
    const result = await query(
      'SELECT * FROM projects ORDER BY created_at DESC'
    )
    return new Response(JSON.stringify(result.rows), { status: 200 })
  }catch(e){
    console.error('Projects GET error:', e)
    return new Response(JSON.stringify([]), { status: 200 })
  }
}

export async function POST(req){
  try{
    const body = await req.json()
    // enforce minimal shape and normalize
    const entry = {
      title: body.title || 'Untitled',
      summary: body.summary || '',
      category: body.category || 'web',
      tags: body.techs || body.tags || [],
      live_url: body.live || '',
      github_url: body.github || '',
      front_image: body.front || '',
      gallery: body.gallery || []
    }

    const result = await query(
      `INSERT INTO projects (title, summary, category, tags, live_url, github_url, front_image, gallery)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        entry.title,
        entry.summary,
        entry.category,
        entry.tags,
        entry.live_url,
        entry.github_url,
        entry.front_image,
        entry.gallery
      ]
    )

    const created = result.rows[0]
    return new Response(JSON.stringify(created), { status: 201 })
  }catch(err){
    console.error('Projects POST error:', err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}
