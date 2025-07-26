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
import { BookOpen, MessageCircle } from 'lucide-react'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [visible, setVisible] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY <= 200)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    setLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <TooltipProvider>
      <motion.nav
        initial={false}
        animate={{ y: visible ? 0 : -80, opacity: visible ? 1 : 0 }}
        transition={{
          duration: 0.25,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="fixed top-0 z-50 w-full h-16 px-4 sm:px-8 flex items-center justify-between border-b bg-white/30 dark:bg-slate-900/30 backdrop-blur-md border-white/20 dark:border-white/10 shadow-md transition-transform"
      >

        <div className="flex sm:hidden items-center justify-between w-full">
          <Link
            href="/dashboard"
            className="text-lg font-bold bg-gradient-to-r from-indigo-500 via-pink-500 to-orange-400 bg-clip-text text-transparent tracking-tight"
          >
            RG
          </Link>

          <div className="flex items-center gap-4 ml-auto">
            <Link
              href="/myrecipes"
              className={clsx(
                'text-muted-foreground hover:text-primary',
                pathname === '/myrecipes' && 'text-primary'
              )}
            >
              <BookOpen className="w-5 h-5" />
            </Link>
            <Link
              href="/myresponses"
              className={clsx(
                'text-muted-foreground hover:text-primary',
                pathname === '/myresponses' && 'text-primary'
              )}
            >
              <MessageCircle className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-pink-500 to-orange-400 bg-clip-text text-transparent hover:opacity-80 transition truncate max-w-[140px] lg:max-w-xs"
          >
            RecipeGen
          </Link>

          <NavigationMenu>
            <NavigationMenuList className="gap-4">
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
          <div className="hidden sm:flex items-center gap-2 sm:gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-8 w-8 bg-gradient-to-br from-indigo-400 via-pink-400 to-orange-300 shadow-md cursor-pointer">
                  <AvatarFallback>
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="bottom">{user.email}</TooltipContent>
            </Tooltip>

            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 max-w-[200px] truncate">
              <span className="font-medium truncate">{user.email}</span>
              <Button
                onClick={handleLogout}
                disabled={loggingOut}
                className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:opacity-90 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-60 shadow-md transition-all duration-200"
              >
                {loggingOut ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Logging out...
                  </>
                ) : (
                  'Logout'
                )}
              </Button>

            </div>
          </div>
        )}
      </motion.nav>
    </TooltipProvider>
  )
}
