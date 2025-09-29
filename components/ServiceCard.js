"use client"
import Link from 'next/link'
import { FontAwesomeIcon } from '../lib/icons'

export default function ServiceCard({ service }){
  const { title, desc, slug, color, logo, icon } = service;

  const logoNode = icon ? (
    // let the icon take the service color (FontAwesome uses currentColor)
    <div className="w-16 h-16 flex items-center justify-center text-xl" style={{color: color}}>
      <FontAwesomeIcon icon={icon} />
    </div>
  ) : (
    <div className="w-16 h-16" aria-label={`${title} logo`}>{logo}</div>
  )

  return (
    <div className="rounded-2xl shadow-lg bg-white dark:bg-slate-900 p-6 flex flex-col sm:flex-row gap-6 items-center" style={{minHeight: 160}}>
        <div className="flex-shrink-0 flex items-center justify-center w-28 h-28 rounded-xl" style={{background: `${color}20`, border: `1px solid ${color}44`}} aria-hidden>
          {/* logo can be an icon spec or an SVG node/component */}
          {logoNode}
        </div>

      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{desc}</p>

        <div className="mt-4 flex gap-3">
          <Link href={`/services/${slug}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-slate-800 text-sm font-medium fast-action fast-focus">
            View
          </Link>

          <Link href="/contact" className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white fast-action fast-focus" style={{background: color}}>
            Get it
          </Link>
        </div>
      </div>
    </div>
  )
}
