'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Loader2 } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setTimeout(() => {
        if (session) {
          router.push('/dashboard')
        } else {
          router.push('/login')
        }
      }, 1500)
    }

    handleSession()
  }, [router])
  return (
    <main className="flex flex-col justify-center items-center h-screen text-center px-4 animate-fade-in">
      <Loader2 className="w-6 h-6 animate-spin text-pink-500 mb-4" />
      <h1 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
        Checking your session...
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
        Hang tight, redirecting shortly.
      </p>
    </main>
  )
}
