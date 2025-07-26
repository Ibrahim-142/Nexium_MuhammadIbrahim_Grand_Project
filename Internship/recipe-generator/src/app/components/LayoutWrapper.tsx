'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from './Navbar'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      setIsAuthenticated(!!user && !error)
    }

    checkAuth()
  }, [])

  const hideNavbar =
    pathname === '/' ||
    pathname.startsWith('/login') ||
    isAuthenticated === false

  if (isAuthenticated === null) {
    return null 
  }

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main className="max-w-4xl mx-auto px-4">{children}</main>
    </>
  )
}
