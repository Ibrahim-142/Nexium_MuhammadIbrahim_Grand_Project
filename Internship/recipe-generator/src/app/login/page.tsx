'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { initializeSession } from '@/lib/ai/webhook'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setToast(null)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    setToast({ type: 'error', message: 'Please enter a valid email address.' })
    setTimeout(() => setToast(null), 2000)
    return
  }
  setLoading(true)
  const redirectTo = process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  })

  setLoading(false)

  if (error) {
    setToast({ type: 'error', message: `Login failed: ${error.message}` })
    setTimeout(() => setToast(null), 2000)
  } else {
    setToast({ type: 'success', message: 'Magic link sent! Check your inbox.' })
    await initializeSession(email)
    setTimeout(() => setToast(null), 2000)
  }
}

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 dark:from-[#1a0b1f] dark:via-[#0e051d] dark:to-[#0d0a2b] overflow-hidden px-4 pb-16">
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-pink-300 dark:bg-pink-700 rounded-full mix-blend-overlay blur-2xl opacity-20 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-400 dark:bg-purple-800 rounded-full mix-blend-overlay blur-2xl opacity-20 animate-pulse" />
      <div className="relative z-10 max-w-4xl mx-auto pt-12 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white leading-tight"
        >
          Cook Smarter with{' '}
          <motion.span
            animate={{
              color: ['#ec4899', '#a855f7', '#f472b6', '#c084fc', '#ec4899'],
              transition: { duration: 6, repeat: Infinity },
            }}
            className="inline-block"
          >
            Groq AI
          </motion.span>
        </motion.h1>

        <p className="mt-3 text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto">
          Get instant recipe ideas from your ingredients. No signup, no fluff.
        </p>

        <AnimatePresence>
          {toast && (
            <motion.div
              key="toast"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className={`fixed top-16 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium shadow-lg border
        ${toast.type === 'success'
                  ? 'bg-green-100 dark:bg-green-800 text-green-900 dark:text-green-100 border-green-300 dark:border-green-700'
                  : 'bg-red-100 dark:bg-red-800 text-red-900 dark:text-red-100 border-red-300 dark:border-red-700'
                }`}
            >
              <div className="flex items-center gap-2">
                {toast.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-300" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-300" />
                )}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => setToast(null)}
                className="ml-4 text-xl font-bold  leading-none text-slate-600 dark:text-slate-300 hover:opacity-70 cursor-pointer"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>


        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 12 }}
          className="mt-10 w-full max-w-md mx-auto bg-white/90 dark:bg-[#1c1b2f]/90 backdrop-blur-md shadow-2xl rounded-3xl p-10 border border-slate-200 dark:border-[#2d2c45] space-y-6"
        >
          <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white">
            Sign in with Email
          </h2>

          <form onSubmit={handleLogin} className="space-y-5 text-left">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="dark:bg-[#131225] dark:border-[#2d2c45] dark:text-white dark:placeholder-slate-400"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full hover:cursor-pointer bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2.5 rounded-lg transition duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Magic Link'
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
