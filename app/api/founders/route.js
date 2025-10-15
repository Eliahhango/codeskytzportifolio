import { query } from '../../../lib/db'

export async function GET(){
  try{
    const result = await query(
      'SELECT * FROM founders ORDER BY created_at DESC'
    )
    return new Response(JSON.stringify(result.rows), { status: 200 })
  }catch(e){
    console.error('Founders GET error:', e)
    return new Response(JSON.stringify([]), { status: 200 })
  }
}

export async function POST(req){
  try{
    const body = await req.json()
    const name = body.name || body.fullName || 'Unnamed'
    const position = body.position || body.role || ''
    const story = body.story || body.bio || ''
    const image = body.image || body.imageUrl || ''

    const result = await query(
      `INSERT INTO founders (name, position, story, image)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, position, story, image]
    )

    const created = result.rows[0]
    return new Response(JSON.stringify(created), { status: 201 })
  }catch(e){
    console.error('Founders POST error:', e)
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 })
  }
}
