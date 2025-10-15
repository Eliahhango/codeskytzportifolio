import { query } from '../../../lib/db'

export async function GET(){
  try {
    const result = await query(
      'SELECT * FROM ads WHERE active = true ORDER BY created_at DESC'
    )
    return new Response(JSON.stringify({data: result.rows}), { status: 200 })
  } catch (error) {
    console.error('Ads GET error:', error)
    return new Response(JSON.stringify({data: []}), { status: 200 })
  }
}

export async function POST(req){
  try {
    const body = await req.json()
    const { url, alt } = body

    if(!url) {
      return new Response(JSON.stringify({error:'Missing url'}), {status:400})
    }

    const result = await query(
      `INSERT INTO ads (url, alt, active)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [url, alt || '', true]
    )

    const newAd = result.rows[0]
    return new Response(JSON.stringify({data: newAd}), {status:201})
  } catch (error) {
    console.error('Ads POST error:', error)
    return new Response(JSON.stringify({error: 'Internal server error'}), {status:500})
  }
}
