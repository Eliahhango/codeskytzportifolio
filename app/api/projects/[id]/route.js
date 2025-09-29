import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from '../../../../lib/firebaseClient'
import { db } from '../../../../lib/firebaseClient'
import { adminDb, isAdmin } from '../../../../lib/firebaseAdmin'

export async function GET(req, { params }){
  try{
    const id = params.id
    if(isAdmin && adminDb){
      const snap = await adminDb.collection('projects').doc(id).get()
      if(!snap.exists) return new Response(JSON.stringify({ error: 'not found' }), { status: 404 })
      return new Response(JSON.stringify({ id: snap.id, ...snap.data() }), { status: 200 })
    }
    const dref = doc(db, 'projects', id)
    const snap = await getDoc(dref)
    if(!snap.exists()) return new Response(JSON.stringify({ error: 'not found' }), { status: 404 })
    return new Response(JSON.stringify({ id: snap.id, ...snap.data() }), { status: 200 })
  }catch(e){
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 })
  }
}

export async function PUT(req, { params }){
  try{
    const id = params.id
    const body = await req.json()
    if(isAdmin && adminDb){
      const ref = adminDb.collection('projects').doc(id)
      const docSnap = await ref.get()
      if(!docSnap.exists) return new Response(JSON.stringify({ error: 'not found' }), { status: 404 })
      await ref.update({ ...body, updatedAt: new Date() })
      const updated = await ref.get()
      return new Response(JSON.stringify({ id: updated.id, ...updated.data() }), { status: 200 })
    }
    const dref = doc(db, 'projects', id)
    const snap = await getDoc(dref)
    if(!snap.exists()) return new Response(JSON.stringify({ error: 'not found' }), { status: 404 })
    await updateDoc(dref, { ...body, updatedAt: serverTimestamp() })
    const updatedSnap = await getDoc(dref)
    return new Response(JSON.stringify({ id: updatedSnap.id, ...updatedSnap.data() }), { status: 200 })
  }catch(e){
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 })
  }
}

export async function DELETE(req, { params }){
  try{
    const id = params.id
    if(isAdmin && adminDb){
      const ref = adminDb.collection('projects').doc(id)
      const docSnap = await ref.get()
      if(!docSnap.exists) return new Response(JSON.stringify({ error: 'not found' }), { status: 404 })
      await ref.delete()
      return new Response(JSON.stringify({ ok: true, id }), { status: 200 })
    }
    const dref = doc(db, 'projects', id)
    const snap = await getDoc(dref)
    if(!snap.exists()) return new Response(JSON.stringify({ error: 'not found' }), { status: 404 })
    await deleteDoc(dref)
    return new Response(JSON.stringify({ ok: true, id }), { status: 200 })
  }catch(e){
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 })
  }
}
