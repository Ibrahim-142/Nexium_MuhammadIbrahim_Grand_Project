'use client'
import { useState } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
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
        relative min-h-screen bg-[#f9fafb] dark:bg-slate-900
        text-slate-900 dark:text-white pt-16 transition-colors duration-300`}
    >
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur border-b border-slate-200 dark:border-slate-700">
        <div className="relative max-w-6xl mx-auto px-4 py-3 h-14 flex items-center justify-center">
          <div className="absolute left-4 flex items-center gap-2 text-sm italic text-slate-600 dark:text-slate-300">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce [animation-delay:0s]" />
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:0.15s]" />
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.3s]" />
            </div>
            <span className="font-medium text-base animate-text-flash bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Cooking meets AI
            </span>

          </div>


          <div>
            <ThemeToggle />
          </div>

          <div className="absolute right-4">
            <Button

              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-2 hover:cursor-pointer"
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

      <div className="absolute bottom-6 w-full text-center text-sm text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} AI Recipe Generator • Powered by Groq AI
      </div>
    </div>
  )
}
