"use client"
import { useState, useEffect } from 'react'

export default function Reviews(){
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({name:'',email:'',comment:'',rating:5})

  useEffect(()=>{
    let mounted = true
    async function load(){
      setLoading(true)
      try{
        const r = await fetch('/api/comments')
        const j = await r.json()
        if(!mounted) return
        setComments(Array.isArray(j) ? j : [])
      }catch(e){
        console.error(e)
      }finally{
        if(mounted) setLoading(false)
      }
    }
    load()
    return ()=>{ mounted = false }
  },[])

  async function handleSubmit(e){
    e.preventDefault()
    const payload = {...form}
    // optimistic UI
    const tmp = { id: `tmp_${Date.now()}`, ...payload, date: new Date().toISOString().slice(0,10) }
    setComments(c=>[tmp,...c])
    setForm({name:'',email:'',comment:'',rating:5})
    try{
      const res = await fetch('/api/comments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
      if(res.ok){
        const j = await res.json()
        setComments(c=>[j,...c.filter(x=>x.id!==tmp.id)])
      }
    }catch(e){
      console.error(e)
    }
  }

  return (
    <section id="reviews" className="py-12">
      <div className="max-w-4xl mx-auto text-center mb-6">
        <h2 className="text-3xl font-semibold">Reviews</h2>
        <p className="text-slate-600">Share your experience with us.</p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <form onSubmit={handleSubmit} className="p-4 border rounded bg-white dark:bg-slate-900">
            <div className="grid grid-cols-1 gap-3">
              <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name" className="w-full px-3 py-2 border rounded" />
              <input required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Your email" className="w-full px-3 py-2 border rounded" />
              <textarea required value={form.comment} onChange={e=>setForm({...form,comment:e.target.value})} placeholder="Tell us about your experience" className="w-full px-3 py-2 border rounded min-h-[120px]" />
              <div className="flex items-center gap-3">
                <label className="text-sm">Rating</label>
                <select value={form.rating} onChange={e=>setForm({...form,rating:parseInt(e.target.value)})} className="px-2 py-1 border rounded">
                  <option value={5}>5</option>
                  <option value={4}>4</option>
                  <option value={3}>3</option>
                  <option value={2}>2</option>
                  <option value={1}>1</option>
                </select>
                <button className="ml-auto px-4 py-2 bg-cyan text-primary rounded fast-action" type="submit">Submit</button>
              </div>
            </div>
          </form>
        </div>

        <div>
          <div className="space-y-4">
            {comments.map(c=> (
              <div key={c.id} className="border p-4 rounded bg-white dark:bg-slate-900 text-left">
                <div className="font-bold">{c.name} <span className="text-sm">— {c.rating}★</span></div>
                <div className="text-sm text-slate-600 dark:text-slate-300">{c.comment}</div>
                <div className="text-xs mt-2 text-slate-400">{c.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
