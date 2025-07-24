'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { ThemeToggle } from './theme-toggle'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from '@/components/ui/navigation-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import clsx from 'clsx'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const pathname = usePathname()

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
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 h-16 px-4 sm:px-8 flex items-center justify-between border-b bg-white/30 dark:bg-slate-900/30 backdrop-blur-md border-white/20 dark:border-white/10 shadow-md"
    >
      {/* Left: Logo + Navigation */}
      <div className="flex items-center gap-6">
        <Link
          href="/dashboard"
          className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-pink-500 to-orange-400 bg-clip-text text-transparent hover:opacity-80 transition"
        >
          RecipeGen
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="gap-2">
            <NavigationMenuItem>
              <Link
                href="/myrecipes"
                className={clsx(
                  'px-2 py-1 text-sm transition hover:text-primary border-b-2',
                  pathname === '/myrecipes'
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-muted-foreground'
                )}
              >
                My Recipes
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                href="/myresponses"
                className={clsx(
                  'px-2 py-1 text-sm transition hover:text-primary border-b-2',
                  pathname === '/myresponses'
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-muted-foreground'
                )}
              >
                My Responses
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <ThemeToggle />
      </div>

      {user && (
        <div className="ml-auto flex items-center gap-4 text-sm text-gray-700 dark:text-gray-200">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 bg-gradient-to-br from-indigo-400 via-pink-400 to-orange-300 shadow-md">
              <AvatarFallback>
                {user.email?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium max-w-[200px] truncate">{user.email}</span>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            className="shadow-sm hover:cursor-pointer"
          >
            Logout
          </Button>
        </div>
      )}
    </motion.nav>
  )
}
