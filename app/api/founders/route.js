import { collection, addDoc, getDocs, serverTimestamp } from '../../../lib/firebaseClient'
import { db } from '../../../lib/firebaseClient'
import { adminDb, isAdmin } from '../../../lib/firebaseAdmin'

export async function GET(){
  try{
    if(isAdmin && adminDb){
      const snap = await adminDb.collection('founders').get()
      const arr = snap.docs.map(d=> ({ id: d.id, ...d.data() }))
      return new Response(JSON.stringify(arr), { status: 200 })
    }
    const col = collection(db, 'founders')
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
    const name = body.name || body.fullName || 'Unnamed'
    const position = body.position || body.role || ''
    const story = body.story || body.bio || ''
    const image = body.image || body.imageUrl || ''
    const entry = { name, position, role: position, story, bio: story, image, createdAt: serverTimestamp() }
    if(isAdmin && adminDb){
      const docRef = await adminDb.collection('founders').add({ ...entry, createdAt: new Date() })
      return new Response(JSON.stringify({ id: docRef.id, ...entry }), { status: 201 })
    }
    const col = collection(db, 'founders')
    const docRef = await addDoc(col, entry)
    return new Response(JSON.stringify({ id: docRef.id, ...entry }), { status: 201 })
  }catch(e){
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 })
  }
}
