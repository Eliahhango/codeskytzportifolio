import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from '../../../../lib/firebaseClient'
import { db } from '../../../../lib/firebaseClient'
import { adminDb, isAdmin } from '../../../../lib/firebaseAdmin'

export async function GET(req, { params }){
  try{
    if(isAdmin && adminDb){
      const snap = await adminDb.collection('founders').doc(params.id).get()
      if(!snap.exists) return new Response(JSON.stringify({ error: 'not found' }), { status: 404 })
      return new Response(JSON.stringify({ id: snap.id, ...snap.data() }), { status: 200 })
    }
    const dref = doc(db, 'founders', params.id)
    const snap = await getDoc(dref)
    if(!snap.exists()) return new Response(JSON.stringify({ error: 'not found' }), { status: 404 })
    return new Response(JSON.stringify({ id: snap.id, ...snap.data() }), { status: 200 })
  }catch(e){ return new Response(JSON.stringify({ error: String(e) }), { status: 500 }) }
}

export async function PUT(req, { params }){
  try{
    const body = await req.json()
    if(isAdmin && adminDb){
      const ref = adminDb.collection('founders').doc(params.id)
      const snap = await ref.get()
      if(!snap.exists) return new Response(JSON.stringify({ error: 'not found' }), { status: 404 })
      const name = body.name || body.fullName || undefined
      const position = body.position || body.role || undefined
      const story = body.story || body.bio || undefined
      const image = body.image || body.imageUrl || undefined
      const payload = { ...body }
      if(name) payload.name = name
      if(position) payload.position = position
      if(position) payload.role = position
      if(story) payload.story = story
      if(story) payload.bio = story
      if(image) payload.image = image
      payload.updatedAt = new Date()
      await ref.update(payload)
      const updated = await ref.get()
      return new Response(JSON.stringify({ id: updated.id, ...updated.data() }), { status: 200 })
    }
    const dref = doc(db, 'founders', params.id)
    const body2 = await req.json()
    const snap = await getDoc(dref)
    if(!snap.exists()) return new Response(JSON.stringify({ error: 'not found' }), { status: 404 })
    // normalize fields on update
    const name = body2.name || body2.fullName || snap.data().name
    const position = body2.position || body2.role || snap.data().position || snap.data().role
    const story = body2.story || body2.bio || snap.data().story || snap.data().bio
    const image = body2.image || body2.imageUrl || snap.data().image
    const updated = { ...snap.data(), ...body2, name, position, role: position, story, bio: story, image }
    await updateDoc(dref, updated)
    const updatedSnap = await getDoc(dref)
    return new Response(JSON.stringify({ id: updatedSnap.id, ...updatedSnap.data() }), { status: 200 })
  }catch(e){ return new Response(JSON.stringify({ error: String(e) }), { status: 500 }) }
}

export async function DELETE(req, { params }){
  try{
    if(isAdmin && adminDb){
      const ref = adminDb.collection('founders').doc(params.id)
      const snap = await ref.get()
      if(!snap.exists) return new Response(JSON.stringify({ error: 'not found' }), { status: 404 })
      await ref.delete()
      return new Response(JSON.stringify({ ok: true, id: params.id }), { status: 200 })
    }
    const dref = doc(db, 'founders', params.id)
    const snap = await getDoc(dref)
    if(!snap.exists()) return new Response(JSON.stringify({ error: 'not found' }), { status: 404 })
    await deleteDoc(dref)
    return new Response(JSON.stringify({ ok: true, id: params.id }), { status: 200 })
  }catch(e){ return new Response(JSON.stringify({ error: String(e) }), { status: 500 }) }
}
