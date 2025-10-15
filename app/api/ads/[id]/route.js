import { query } from '../../../../lib/db'

export async function DELETE(req,{ params }){
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 })
    }

    // First check if the ad exists
    const checkResult = await query(
      'SELECT * FROM ads WHERE id = $1',
      [id]
    )

    if (checkResult.rows.length === 0) {
      return new Response(JSON.stringify({error:'Not found'}), {status:404})
    }

    // Delete the ad
    await query(
      'DELETE FROM ads WHERE id = $1',
      [id]
    )

    return new Response(JSON.stringify({data:{id}}), { status: 200 })
  } catch (error) {
    console.error('Ad DELETE error:', error)
    return new Response(JSON.stringify({error: 'Internal server error'}), {status:500})
  }
}

export async function PUT(req,{ params }){
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 })
    }

    const body = await req.json()

    // First check if the ad exists
    const checkResult = await query(
      'SELECT * FROM ads WHERE id = $1',
      [id]
    )

    if (checkResult.rows.length === 0) {
      return new Response(JSON.stringify({error:'Not found'}), {status:404})
    }

    // Update the ad
    const updateFields = Object.keys(body).map((key, index) => `${key} = $${index + 2}`).join(', ')
    const updateValues = Object.values(body)
    updateValues.unshift(id)

    const result = await query(
      `UPDATE ads SET ${updateFields} WHERE id = $1 RETURNING *`,
      updateValues
    )

    return new Response(JSON.stringify({data: result.rows[0]}), { status: 200 })
  } catch (error) {
    console.error('Ad PUT error:', error)
    return new Response(JSON.stringify({error: 'Internal server error'}), {status:500})
  }
}
