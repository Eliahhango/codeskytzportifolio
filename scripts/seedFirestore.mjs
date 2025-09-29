// Script: seedFirestore.mjs
// Usage: node scripts/seedFirestore.mjs
// This will read data/founders.json and data/portfolio.json and add documents
// to Firestore collections `founders` and `projects`. Run only once.

import { readFile } from 'fs/promises'
import path from 'path'

const base = path.resolve(process.cwd())
const libPath = path.join(base, 'lib', 'firebaseClient.js')

async function loadFirebaseClient(){
  // dynamic import to work in Node without changing package.json
  const mod = await import(libPath)
  return mod
}

async function loadJson(rel){
  try{
    const raw = await readFile(path.join(base, rel), 'utf-8')
    return JSON.parse(raw)
  }catch(e){
    console.error('Failed to read', rel, e)
    return []
  }
}

async function main(){
  const fb = await loadFirebaseClient()
  const { db, collection, addDoc, serverTimestamp } = fb

  const founders = await loadJson('data/founders.json')
  const projects = await loadJson('data/portfolio.json')

  console.log('Seeding', founders.length, 'founders and', projects.length, 'projects')

  for(const f of founders){
    try{
      const entry = {
        name: f.name || f.fullName || 'Unnamed',
        position: f.position || f.role || '',
        role: f.position || f.role || '',
        story: f.story || f.bio || '',
        bio: f.story || f.bio || '',
        image: f.image || f.imageUrl || '',
        createdAt: serverTimestamp()
      }
      const col = collection(db, 'founders')
      await addDoc(col, entry)
      console.log('Added founder', entry.name)
    }catch(e){ console.error('Founder add failed', e) }
  }

  for(const p of projects){
    try{
      const entry = {
        title: p.title || 'Untitled',
        summary: p.summary || '',
        category: p.category || 'web',
        tags: p.tags || p.techs || [],
        live: p.live || '',
        github: p.github || '',
        front: p.front || '',
        gallery: p.gallery || [],
        createdAt: serverTimestamp()
      }
      const col = collection(db, 'projects')
      await addDoc(col, entry)
      console.log('Added project', entry.title)
    }catch(e){ console.error('Project add failed', e) }
  }

  console.log('Seeding complete')
}

main().catch(e=>{ console.error(e); process.exit(1) })
