import fetch from 'node-fetch'

async function test(){
  console.log('Creating founder...')
  let res = await fetch('http://localhost:3000/api/founders', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ name: 'Test Founder', position: 'Tester', story: 'Auto-created' }) })
  console.log('Status', res.status)
  const j = await res.json().catch(()=>null)
  console.log('Response', j)

  console.log('Creating project...')
  res = await fetch('http://localhost:3000/api/projects', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ title: 'Test Project', summary: 'Created by test' }) })
  console.log('Status', res.status)
  console.log('Response', await res.json().catch(()=>null))
}

test().catch(e=>console.error(e))
