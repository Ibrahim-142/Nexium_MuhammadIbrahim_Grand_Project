'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

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
    <nav className="bg-gray-100 border-b border-gray-300 px-4 py-3 flex justify-between items-center">
      <div className="text-lg font-semibold">🍳 AI Recipe Generator</div>

      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">Welcome, {user.email}</span>
          <button
            className="bg-red-600 text-white px-3 py-1 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}
