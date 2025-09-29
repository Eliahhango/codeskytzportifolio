"use client"
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function ProjectPage({ params }){
  const { id } = params
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    let mounted = true
    fetch(`/api/projects/${id}`)
      .then(r=> r.json())
      .then(data=>{ if(mounted) setProject(data) })
      .catch(()=>{})
      .finally(()=>{ if(mounted) setLoading(false) })
    return ()=>{ mounted = false }
  },[id])

  if(loading) return <div className="p-8">Loading...</div>
  if(!project || project.error) return <div className="p-8">Project not found</div>

  const gallery = project.gallery && project.gallery.length ? project.gallery : [
    `/images/projects/${id}-1.jpg`,
    `/images/projects/${id}-2.jpg`,
    `/images/projects/${id}-3.jpg`
  ]

  const storageKey = `project_${id}_data`
  const [data, setData] = useState({likes:0,rating:0,comments:[]})
  const [comment, setComment] = useState('')

  useEffect(()=>{
    try{
      const raw = localStorage.getItem(storageKey)
      if(raw) setData(JSON.parse(raw))
    }catch(e){}
  },[storageKey])

  useEffect(()=>{
    try{ localStorage.setItem(storageKey, JSON.stringify(data)) }catch(e){}
  },[data,storageKey])

  function addLike(){ setData(s=> ({...s, likes: s.likes+1})) }
  function setRating(r){ setData(s=> ({...s, rating: r})) }
  function postComment(){ if(!comment.trim()) return; setData(s=> ({...s, comments: [...s.comments, {id:Date.now(), text:comment}]})); setComment('') }

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{project.title}</h1>
            <p className="mt-2 text-gray-700 dark:text-gray-300">{project.summary}</p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {gallery.map((src,i)=> (
                <div key={i} className="rounded overflow-hidden bg-gray-50 dark:bg-slate-800">
                  <Image src={src} alt={`${project.title} ${i+1}`} width={800} height={450} className="object-cover w-full h-full"/>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <button onClick={addLike} className="px-4 py-2 rounded bg-green-500 text-white fast-action">Like ({data.likes})</button>
              <div className="flex items-center gap-1">
                <span className="text-sm mr-2">Rate:</span>
                {[1,2,3,4,5].map(n=> (
                  <button key={n} onClick={()=>setRating(n)} className={`px-2 ${data.rating>=n? 'text-yellow-400':'text-gray-400'}`}>★</button>
                ))}
                <span className="ml-2 text-sm">({data.rating})</span>
              </div>
              <Link href="/contact" className="ml-auto px-4 py-2 rounded bg-indigo-600 text-white">Take Yours</Link>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold">Comments</h3>
              <div className="mt-3 flex gap-2">
                <input value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="Write a comment..." className="flex-1 p-2 border rounded" />
                <button onClick={postComment} className="px-4 py-2 rounded bg-indigo-600 text-white fast-action">Post</button>
              </div>

              <div className="mt-4 space-y-3">
                {data.comments.length===0 && <p className="text-sm text-gray-500">Be the first to comment.</p>}
                {data.comments.map(c=> (
                  <div key={c.id} className="p-3 border rounded">{c.text}</div>
                ))}
              </div>
            </div>
          </div>

          <aside className="w-72 hidden lg:block">
            <div className="p-4 bg-white dark:bg-slate-900 rounded shadow">
              <h4 className="font-semibold">Project Details</h4>
              <p className="text-sm mt-2">Category: {project.category}</p>
              <p className="text-sm mt-1">Tags: {Array.isArray(project.tags)?project.tags.join(', '):''}</p>
              {project.live && <a href={project.live} target="_blank" rel="noreferrer" className="mt-3 block text-cyan underline">Open Live</a>}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
