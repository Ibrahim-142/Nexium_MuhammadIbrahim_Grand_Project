'use client'
import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'
import { useState } from 'react'
import { RotateCcw, Loader2 } from 'lucide-react'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
      window.location.reload()
  }

  return (
    <div
      className={`
        ${geistSans.variable} ${geistMono.variable}
        relative
        min-h-screen
        bg-[#f9fafb] dark:bg-slate-950
        text-slate-900 dark:text-white
        pt-16
      `}
    >
      <nav className="fixed top-0 left-0 w-full z-50 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight text-indigo-700 dark:text-indigo-400">
            Groq AI Recipes
          </span>

         <button
  onClick={handleRefresh}
  disabled={refreshing}
  className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700
    bg-white/80 dark:bg-slate-800/60 hover:cursor-pointer
    hover:bg-slate-100 dark:hover:bg-slate-700
    transition duration-150 ease-in-out
    ${refreshing ? 'opacity-60 cursor-wait' : ''}
  `}
>
  {refreshing ? (
    <>
      <Loader2 className="w-4 h-4 animate-spin" />
      Refreshing...
    </>
  ) : (
    <>
      <RotateCcw className="w-4 h-4 " />
      Refresh
    </>
  )}
</button>

        </div>
      </nav>
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] px-4">
        {children}
      </main>
      <div className="absolute bottom-6 w-full text-center text-sm text-slate-500 dark:text-slate-600">
        © {new Date().getFullYear()} AI Recipe Generator • Powered by Groq AI
      </div>
    </div>
  )
}
