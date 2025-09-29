// Server-side Firebase Admin initializer
// Provide a service account JSON via env var FIREBASE_SERVICE_ACCOUNT (base64 or raw JSON string)
import admin from 'firebase-admin'

let adminDb = null
let isAdmin = false

function initAdmin() {
  if(isAdmin) return
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT || ''
  if(!raw) return
  let sa
  try{
    // support base64-encoded JSON or plain JSON
    const maybe = raw.trim()
    if(maybe.startsWith('{')) sa = JSON.parse(maybe)
    else sa = JSON.parse(Buffer.from(maybe, 'base64').toString('utf-8'))
  }catch(e){
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT:', e)
    return
  }

  try{
    if(!admin.apps.length){
      admin.initializeApp({ credential: admin.credential.cert(sa) })
    }
    adminDb = admin.firestore()
    isAdmin = true
    console.log('Firebase Admin initialized (server)')
  }catch(e){
    console.error('Firebase Admin init error', e)
  }
}

initAdmin()

export { adminDb, isAdmin }
