"use client";

/**
 * AboutUs component
 * Props:
 * - className: optional additional classes for the section wrapper
 *
 * This component is intentionally self-contained and uses TailwindCSS classes
 * to match the project's styling. To customize colors or animation timing,
 * override the Tailwind classes or wrap the component and pass a different
 * `className`.
 */
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function AboutUs({ className = "" }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const reveal = (delay = 0) =>
    `transform transition-all duration-700 ease-out ${
      mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
    }` + ` delay-${delay}`;

  const coreValues = [
    {
      key: "innovation",
      title: "Innovation",
      text: "We pursue creative solutions and cutting-edge tech.",
      icon: (
        <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3v5h6v-5c0-1.657-1.343-3-3-3z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v3" />
        </svg>
      ),
    },
    {
      key: "integrity",
      title: "Integrity",
      text: "We are honest, transparent and dependable.",
      icon: (
        <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 20v-1a4 4 0 014-4h4a4 4 0 014 4v1" />
        </svg>
      ),
    },
    {
      key: "security",
      title: "Security",
      text: "We build secure systems and protect user data.",
      icon: (
        <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11V7a4 4 0 10-8 0v4" />
          <rect x="3" y="11" width="18" height="11" rx="2" />
        </svg>
      ),
    },
    {
      key: "collaboration",
      title: "Collaboration",
      text: "We work together and with our clients closely.",
      icon: (
        <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20H2v-2a4 4 0 013-3.87" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12a4 4 0 110-8 4 4 0 010 8z" />
        </svg>
      ),
    },
    {
      key: "excellence",
      title: "Excellence",
      text: "We deliver high-quality products and services.",
      icon: (
        <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="about-us" className={`py-12 lg:py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left column - content */}
          <div>
            <div className={`mb-4 ${mounted ? "" : "opacity-0"}`}>
              <p className="text-sm font-semibold text-indigo-400">About</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900 dark:text-white">
                Codeskytz
              </h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Innovation With No Limit</p>
            </div>

            <p className={`mt-6 text-gray-700 dark:text-gray-200 max-w-prose ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} transition-all duration-700`}> 
              Codeskytz is a multidisciplinary engineering studio specializing in web development, system security, AI solutions, WhatsApp bot automation and robust API services. We blend creativity with discipline to build scalable, secure and delightful digital products.
            </p>

            {/* Mission & Vision */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`p-6 rounded-2xl bg-white/80 dark:bg-gray-900/60 shadow-md ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} transition-all duration-700`}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-indigo-50 text-indigo-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v4a1 1 0 001 1h3v7h8v-7h3a1 1 0 001-1V7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Mission</h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Build reliable, secure and innovative software that empowers businesses and users.</p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-2xl bg-white/80 dark:bg-gray-900/60 shadow-md ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} transition-all duration-700 delay-75`}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-purple-50 text-purple-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7a4 4 0 100 8 4 4 0 000-8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Vision</h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Democratize powerful, secure and intelligent software that scales seamlessly across industries.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Values */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Core Values</h4>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {coreValues.map((v, i) => (
                  <div key={v.key} className={`p-4 rounded-2xl bg-gradient-to-br from-white/60 to-gray-50 dark:from-gray-900/60 dark:to-gray-800/60 shadow-sm hover:shadow-md transition transform hover:-translate-y-1` }>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-indigo-50 rounded-lg">{v.icon}</div>
                      <div>
                        <h5 className="font-semibold text-gray-900 dark:text-white">{v.title}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{v.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Company story */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Our Story</h4>
              <p className="mt-3 text-gray-700 dark:text-gray-300 max-w-prose">Founded by a small group of engineers with a shared love for craftsmanship, Codeskytz started as a web development studio and quickly expanded into security, AI and automation. Today we focus on building ethical, reliable systems and aiming to be a trusted partner as businesses embrace modern technology.</p>
            </div>

            {/* Team CTA */}
            <div className="mt-8 flex items-center gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Meet the people behind our work.</p>
                <p className="font-semibold text-gray-900 dark:text-white">A small, highly-focused team building big ideas.</p>
              </div>
              <div className="ml-auto">
                <Link href="/founders" className="inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition-transform">
                  Meet Founders
                </Link>
              </div>
            </div>
          </div>

          {/* Right column - illustration */}
          <div className="relative">
            <div className={`rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-gray-900 shadow-2xl p-8 sm:p-12 text-white ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} transition-all duration-700`}>
              <div className="w-full h-64 sm:h-80 lg:h-96 relative overflow-hidden rounded-xl">
                {/* Abstract SVG waves */}
                <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="g1" x1="0" x2="1">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="50%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#g1)" opacity="0.18" />
                  <g fillOpacity="0.9">
                    <path d="M0 400 C150 300 350 500 800 350 L800 600 L0 600 Z" fill="#8b5cf6" opacity="0.7" />
                    <path d="M0 300 C200 200 400 420 800 220 L800 600 L0 600 Z" fill="#06b6d4" opacity="0.5" />
                  </g>
                </svg>
                <div className="absolute left-6 bottom-6 bg-white/10 backdrop-blur px-4 py-3 rounded-xl shadow">
                  <p className="text-sm font-semibold">Fast APIs • Secure Systems • AI</p>
                  <p className="text-xs mt-1 opacity-90">Built for scale and reliability</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        /* small helper delays using Tailwind-compatible classes would require plugin; using inline style delays instead */
      `}</style>
    </section>
  );
}
