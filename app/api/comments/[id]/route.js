import { query } from '../../../../lib/db'

export async function DELETE(req, { params }){
  try{
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 })
    }

    // First check if the comment exists
    const checkResult = await query(
      'SELECT * FROM comments WHERE id = $1',
      [id]
    )

    if (checkResult.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'not found' }), { status: 404 })
    }

    const removed = checkResult.rows[0]

    // Delete the comment
    await query(
      'DELETE FROM comments WHERE id = $1',
      [id]
    )

    return new Response(JSON.stringify({ ok: true, removed }), { status: 200 })
  }catch(e){
    console.error('Comment DELETE error:', e)
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 })
  }
}
