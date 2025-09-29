"use client"
import { useEffect, useState } from 'react'

export default function Founders(){
  const [founders, setFounders] = useState([])

  useEffect(()=>{
    let mounted = true
    fetch('/api/founders')
      .then(r=> r.json())
      .then(data=>{ if(mounted) setFounders(Array.isArray(data)?data:[]) })
      .catch(()=>{})
    return ()=>{ mounted = false }
  },[])

  return (
    <section id="founders" className="py-12">
      <div className="max-w-5xl mx-auto text-center mb-6">
        <h2 className="text-3xl font-semibold">Founders</h2>
      </div>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {founders.map(f=> {
          const name = f.name || f.fullName || 'Unnamed'
          const position = f.position || f.role || ''
          const story = f.story || f.bio || ''
          const img = f.image || f.imageUrl || '/images/placeholder.png'
          return (
            <div key={f.id} className="border p-6 rounded bg-white dark:bg-slate-900 text-left">
              <div className="flex items-center gap-4">
                <img src={img} alt={name} className="w-20 h-20 rounded-full object-cover" />
                <div className="text-left">
                  <h3 className="font-bold text-lg">{name}</h3>
                  {position && <p className="text-sm text-slate-600 dark:text-slate-300">{position}</p>}
                </div>
              </div>
              {story && <p className="mt-3 text-sm">{story}</p>}
            </div>
          )
        })}
      </div>
    </section>
  )
}
