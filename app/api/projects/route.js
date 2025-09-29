import { collection, addDoc, getDocs, serverTimestamp } from '../../../lib/firebaseClient'
import { db } from '../../../lib/firebaseClient'
import { adminDb, isAdmin } from '../../../lib/firebaseAdmin'

export async function GET(){
  try{
    if(isAdmin && adminDb){
      const snap = await adminDb.collection('projects').get()
      const arr = snap.docs.map(d=> ({ id: d.id, ...d.data() }))
      return new Response(JSON.stringify(arr), { status: 200 })
    }
    const col = collection(db, 'projects')
    const snap = await getDocs(col)
    const arr = snap.docs.map(d=> ({ id: d.id, ...d.data() }))
    return new Response(JSON.stringify(arr), { status: 200 })
  }catch(e){
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
      live: body.live || '',
      github: body.github || '',
      front: body.front || '',
      gallery: body.gallery || [],
      createdAt: serverTimestamp()
    }
    if(isAdmin && adminDb){
      const docRef = await adminDb.collection('projects').add({ ...entry, createdAt: new Date() })
      const created = { id: docRef.id, ...entry }
      return new Response(JSON.stringify(created), { status: 201 })
    }
    const col = collection(db, 'projects')
    const docRef = await addDoc(col, entry)
    const created = { id: docRef.id, ...entry }
    return new Response(JSON.stringify(created), { status: 201 })
  }catch(err){
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}
