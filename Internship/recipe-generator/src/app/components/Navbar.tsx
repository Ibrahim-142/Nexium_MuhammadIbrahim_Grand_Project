'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { ThemeToggle } from './theme-toggle'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="relative bg-gray-100 dark:bg-slate-900 border-b border-gray-300 dark:border-slate-700 h-16 flex items-center px-4">
      <div className="text-lg font-semibold text-indigo-700 dark:text-indigo-400">
        Recipe Generator
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <ThemeToggle />
      </div>

      {user && (
        <div className="ml-auto flex items-center gap-4 text-sm text-gray-700 dark:text-gray-300">
          <span className="hidden sm:inline">Welcome, {user.email}</span>
          <Button variant="destructive" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      )}
    </nav>
  )
}
