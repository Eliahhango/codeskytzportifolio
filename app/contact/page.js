"use client"
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { WhatsappLogo } from '../../lib/serviceLogos'
import { FontAwesomeIcon } from '../../lib/icons'

function EmailIcon(){
  return <FontAwesomeIcon icon={['fas','envelope']} />
}

export default function Contact(){
  const {register,handleSubmit,formState:{errors}} = useForm()
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function loadFounders() {
      setLoading(true)
      try {
        const res = await fetch('/api/founders')
        const data = await res.json()
        if (mounted) {
          const foundersArray = Array.isArray(data) ? data : []
          // canonicalize founders data (some entries use position/story)
          const processedStaff = foundersArray.map(f=>({
            id: f.id,
            name: f.name || f.fullName || 'Unnamed',
            role: f.role || f.position || 'Staff',
            bio: f.bio || f.story || '',
            image: f.image || f.imageUrl || '/images/placeholder.png',
            social: f.social || {}
          }))
          setStaff(processedStaff)
        }
      } catch (error) {
        console.error('Error loading founders:', error)
        if (mounted) setStaff([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadFounders()
    return () => { mounted = false }
  }, [])

  const onSubmit = async (data)=>{
    try{
      const res = await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})
      const json = await res.json()
      alert(json.message||'Sent')
    }catch(e){
      alert('Failed to send')
    }
  }

  // replace these with your real company links
  const companySocial = {
    linkedin: 'https://www.linkedin.com/company/your-company',
    twitter: 'https://twitter.com/yourcompany',
    instagram: 'https://instagram.com/yourcompany',
    whatsapp: 'https://wa.me/15551234567',
    email: 'contact@yourcompany.com'
  }

  return (
    <section id="contact" className="py-12">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h2 className="text-3xl font-semibold mb-2">Contact</h2>
        <p className="text-slate-600">Reach us on social media or contact our team directly. Click any icon to open the channel.</p>
      </div>

      <div className="mb-6 max-w-3xl mx-auto">
        <p className="mb-3">Reach us on social media or contact our team directly. Click any icon to open the channel.</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href={companySocial.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded bg-slate-100 hover:bg-slate-200">
            <FontAwesomeIcon icon={["fab","linkedin"]} className="w-5 h-5" />
            <span className="text-sm">LinkedIn</span>
          </a>
          <a href={companySocial.twitter} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded bg-slate-100 hover:bg-slate-200">
            <FontAwesomeIcon icon={["fab","twitter"]} className="w-5 h-5" />
            <span className="text-sm">Twitter</span>
          </a>
          <a href={companySocial.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded bg-slate-100 hover:bg-slate-200">
            <FontAwesomeIcon icon={["fab","instagram"]} className="w-5 h-5" />
            <span className="text-sm">Instagram</span>
          </a>
          <a href={companySocial.whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded bg-green-50 text-green-700 hover:bg-green-100">
            <FontAwesomeIcon icon={["fab","whatsapp"]} className="w-5 h-5" />
            <span className="text-sm">WhatsApp</span>
          </a>
          <a href={`mailto:${companySocial.email}`} className="inline-flex items-center gap-2 px-3 py-2 rounded bg-slate-100 hover:bg-slate-200">
            <EmailIcon />
            <span className="text-sm">Email</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="col-span-1 md:col-span-2 grid grid-cols-1 gap-4">
          <input {...register('name',{required:true})} placeholder="Name" className="w-full px-3 py-3 border rounded" />
          <input {...register('email',{required:true})} placeholder="Email" className="w-full px-3 py-3 border rounded" />
          <textarea {...register('message',{required:true})} placeholder="Message" className="w-full px-3 py-3 border rounded min-h-[120px]" />
          <div className="flex items-center gap-3">
            <button type="submit" className="px-4 py-2 bg-cyan text-primary rounded fast-action">Send</button>
            <a href={`mailto:${companySocial.email}`} className="px-4 py-2 border rounded fast-action">Email us</a>
          </div>
        </form>

        <aside className="col-span-1">
          <h3 className="font-semibold mb-3">Our Team</h3>
          <ul className="space-y-3">
            {loading ? (
              <li className="flex items-center justify-center p-6">
                <FontAwesomeIcon icon="gears" className="animate-spin text-2xl text-cyan" />
              </li>
            ) : staff.map(s=> (
              <li key={s.id} className="flex flex-col sm:flex-row items-start gap-3 p-3 border rounded">
                <img src={s.image} alt={s.name} className="w-14 h-14 rounded-full object-cover" />
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-slate-600">{s.role}</div>
                    </div>
                  </div>
                  <p className="text-sm mt-2 text-slate-700">{s.bio}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {s.social && s.social.linkedin && (
                      <a href={s.social.linkedin} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-slate-800">
                        <FontAwesomeIcon icon={["fab","linkedin"]} />
                      </a>
                    )}
                    {s.social && s.social.github && (
                      <a href={s.social.github} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-slate-800">
                        <FontAwesomeIcon icon={["fab","github"]} />
                      </a>
                    )}
                    {/* fallback: contact company email */}
                    <a href={`mailto:${companySocial.email}`} className="text-slate-600 hover:text-slate-800">
                      <EmailIcon />
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  )
}
