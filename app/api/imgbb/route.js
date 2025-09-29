export async function POST(req){
  try{
    const body = await req.json()
    const img = body.image
    if(!img) return new Response(JSON.stringify({ error: 'no image' }), { status: 400 })

    // server-side key (set IMGBB_API_KEY in .env or hosting secrets)
    const key = process.env.IMGBB_API_KEY || process.env.NEXT_IMGBB_API || process.env.NEXT_PUBLIC_IMGBB_API
    if(!key) return new Response(JSON.stringify({ error: 'IMGBB API key not configured on server' }), { status: 500 })

    // imgbb expects raw base64 (no data: prefix)
    const cleaned = String(img).replace(/^data:.*;base64,/, '').replace(/\s+/g,'')

    const params = new URLSearchParams()
    params.append('key', key)
    params.append('image', cleaned)

    const res = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: params })
    const json = await res.json().catch(()=>null)
    if(!res.ok || !json || !json.data || !json.data.url) {
      const msg = json?.error?.message || json?.status_message || JSON.stringify(json) || 'Upload failed'
      return new Response(JSON.stringify({ error: msg }), { status: 500 })
    }

    return new Response(JSON.stringify({ url: json.data.url }), { status: 200 })
  }catch(e){
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 })
  }
}
