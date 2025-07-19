'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSent(false)
    setLoading(true)

    const redirectTo = process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    })

    setLoading(false)
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-indigo-100 via-white to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden px-4 pb-16 transition-colors">
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-400 dark:bg-indigo-800 rounded-full mix-blend-overlay filter blur-2xl opacity-20 animate-pulse z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-400 dark:bg-purple-800 rounded-full mix-blend-overlay filter blur-2xl opacity-20 animate-pulse z-0" />
      <div className="relative z-10 max-w-4xl mx-auto pt-12 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white leading-tight">
            Cook Smarter with <span className="text-indigo-600 dark:text-indigo-400">Groq AI</span>
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto">
            Get instant recipe ideas from your ingredients. No signup, no fluff.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mt-10 w-full max-w-md mx-auto bg-white dark:bg-slate-900 shadow-2xl rounded-2xl p-8 border border-slate-200 dark:border-slate-800"
        >
          <h2 className="text-2xl font-semibold mb-6 text-slate-800 dark:text-white">Sign in with Email</h2>
          <AnimatePresence>
            {sent && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-4 rounded-lg bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 flex items-center gap-2 text-sm border border-green-300 dark:border-green-700"
              >
                <CheckCircle className="w-4 h-4" /> Magic link sent! Check your inbox.
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-4 rounded-lg bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 flex items-center gap-2 text-sm border border-red-300 dark:border-red-700"
              >
                <XCircle className="w-4 h-4" /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-5 text-left">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:cursor-pointer hover:bg-indigo-700 text-white text-md transition duration-200"
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
