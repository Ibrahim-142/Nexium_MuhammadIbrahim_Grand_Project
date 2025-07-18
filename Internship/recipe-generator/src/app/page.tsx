'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function HomePage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setChecking(false)

      if (session) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }

    handleSession()
  }, [router])

  if (checking) {
    return (
      <main className="flex justify-center items-center h-screen">
        <p>Redirecting...</p>
      </main>
    )
  }

  return null 
}
