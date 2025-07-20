'use client'

import { useState } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import Link from 'next/link'
import '../globals.css'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { RotateCcw, Loader2 } from 'lucide-react'
import { ThemeToggle } from '../components/theme-toggle' 

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
      className={`${geistSans.variable} ${geistMono.variable}
        relative min-h-screen bg-[#f9fafb] dark:bg-slate-950
        text-slate-900 dark:text-white pt-16`}
    >
      <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
  <div className="relative max-w-6xl mx-auto px-4 py-3 h-14 flex items-center justify-center">
    
    <div className="absolute left-0">
      <Link
        href="/"
        className="font-semibold text-lg tracking-tight text-indigo-700 dark:text-indigo-400 hover:opacity-90 transition"
      >
        Groq AI Recipes
      </Link>
    </div>

    <div>
      <ThemeToggle />
    </div>

    <div className="absolute right-4 ">
      <Button
        variant="outline"
        onClick={handleRefresh}
        disabled={refreshing}
        className="gap-2 "
      >
        {refreshing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Refreshing...
          </>
        ) : (
          <>
            <RotateCcw className="w-4 h-4" />
            Refresh
          </>
        )}
      </Button>
    </div>
  </div>

  <Separator />
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
