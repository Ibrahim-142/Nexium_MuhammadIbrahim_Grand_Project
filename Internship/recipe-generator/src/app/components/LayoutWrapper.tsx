'use client'

import { useEffect, useState, createContext, useContext } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from './Navbar'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
})

export const useAuth = () => useContext(AuthContext)

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error || !session?.user) {
        setUser(null)
      } else {
        setUser(session.user)
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const isAuthenticated = !!user
  const hideNavbar =
    pathname === '/' ||
    pathname.startsWith('/login') ||
    !isAuthenticated

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname.startsWith('/dashboard')) {
      router.replace('/login')
    }
  }, [isLoading, isAuthenticated, pathname, router])

  if (isLoading) {
    return null 
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user }}>
      {!hideNavbar && <Navbar />}
      <main className="max-w-4xl mx-auto px-4">{children}</main>
    </AuthContext.Provider>
  )
}
