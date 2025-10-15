import { query } from '../../../../lib/db'

export async function GET(req, { params }){
  try{
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 })
    }

    const result = await query(
      'SELECT * FROM founders WHERE id = $1',
      [id]
    )

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'not found' }), { status: 404 })
    }

    return new Response(JSON.stringify(result.rows[0]), { status: 200 })
  }catch(e){
    console.error('Founder GET error:', e)
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 })
  }
}

export async function PUT(req, { params }){
  try{
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 })
    }

    const body = await req.json()

    // First check if the founder exists
    const checkResult = await query(
      'SELECT * FROM founders WHERE id = $1',
      [id]
    )

    if (checkResult.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'not found' }), { status: 404 })
    }

    // Update the founder
    const updateFields = Object.keys(body).map((key, index) => `${key} = $${index + 2}`).join(', ')
    const updateValues = Object.values(body)
    updateValues.unshift(id)

    const result = await query(
      `UPDATE founders SET ${updateFields}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      updateValues
    )

    return new Response(JSON.stringify(result.rows[0]), { status: 200 })
  }catch(e){
    console.error('Founder PUT error:', e)
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 })
  }
}

export async function DELETE(req, { params }){
  try{
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 })
    }

    // First check if the founder exists
    const checkResult = await query(
      'SELECT * FROM founders WHERE id = $1',
      [id]
    )

    if (checkResult.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'not found' }), { status: 404 })
    }

    // Delete the founder
    await query(
      'DELETE FROM founders WHERE id = $1',
      [id]
    )

    return new Response(JSON.stringify({ ok: true, id }), { status: 200 })
  }catch(e){
    console.error('Founder DELETE error:', e)
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 })
  }
}
