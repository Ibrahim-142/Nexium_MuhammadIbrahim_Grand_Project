'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog'
import { Loader2, XCircle, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [recipeName, setRecipeName] = useState('')
  const [loadingUser, setLoadingUser] = useState(true)
  const [loadingGenerate, setLoadingGenerate] = useState(false)
  const [loadingSave, setLoadingSave] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const resultRef = useRef<HTMLDivElement | null>(null)

  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push('/login')
      } else {
        setUser(data.user)
      }
      setLoadingUser(false)
    }

    fetchUser()
  }, [router])

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setErrorMessage('Please enter something to generate a recipe.')
      return
    }

    try {
      setResult('')
      setErrorMessage('')
      setSuccessMessage('')
      setLoadingGenerate(true)

      const res = await fetch('http://localhost:5678/webhook/e01d3830-43bf-427e-9f4f-2314970979ba/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: user?.email,
          chatInput: prompt,
        }),
      })

      if (!res.ok) throw new Error('Failed to generate recipe.')

      const data = await res.json()
      setResult(data.output)

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 200)
    } catch {
      setErrorMessage('Failed to generate recipe. Please try again.')
    } finally {
      setLoadingGenerate(false)
    }
  }
const handleSave = async () => {
  if (!recipeName.trim()) {
    setErrorMessage('Please enter a recipe name before saving.')
    return
  }

  try {
    setLoadingSave(true)
    setErrorMessage('')
    setSuccessMessage('')

    const isRecipe = (() => {
      const lower = result.toLowerCase()
      return (
        lower.includes('ingredients:') &&
        lower.includes('instructions:') &&
        /(\d+\.\s)/.test(lower) &&
        lower.split('\n').some(line => line.trim().startsWith('-'))
      )
    })()

    const label = isRecipe ? 'recipe' : 'response'

    const res = await fetch('/api/save-recipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userEmail: user?.email,
        recipeName,
        recipeContent: result,
        contentLabel: label,
      }),
    })

    const data = await res.json()

    if (data.success) {
      setSuccessMessage('Saved successfully.')
      setShowDialog(false)
      setRecipeName('')
    } else {
      throw new Error(data.error || 'Unknown error')
    }
  } catch {
    setErrorMessage('Failed to save recipe. Please try again.')
  } finally {
    setLoadingSave(false)
  }
}



  if (loadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 transition-colors duration-300">
        <motion.div
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-10 sm:p-10 bg-gradient-to-br from-indigo-100 via-white to-pink-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-6">

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-xl rounded-3xl transition">
            <CardHeader>
<CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 via-pink-500 to-orange-400 bg-clip-text text-transparent animate-pulse tracking-tight">
  Welcome, <span className="font-semibold italic">{user?.email}</span>
</CardTitle>

            </CardHeader>

            <CardContent className="space-y-4">
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-sm text-red-600 font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-700 shadow"
                >
                  <XCircle className="w-4 h-4" />
                  {errorMessage}
                </motion.div>
              )}

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-sm text-green-600 font-medium bg-green-50 dark:bg-green-900/20 p-3 rounded-md border border-green-200 dark:border-green-700 shadow"
                >
                  <CheckCircle className="w-4 h-4" />
                  {successMessage}
                </motion.div>
              )}

              <Textarea
                placeholder="What do you want to cook?"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loadingGenerate}
                className="min-h-[120px] rounded-xl border-accent focus:ring-2 focus:ring-primary/50 transition"
              />

              <Button
                className="w-full bg-gradient-to-br from-indigo-500 via-pink-500 to-orange-400 text-white font-semibold shadow-md hover:brightness-110 transition"
                disabled={loadingGenerate || !prompt.trim()}
                onClick={handleGenerate}
              >
                {loadingGenerate && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                Generate Recipe
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {result && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white/30 dark:bg-slate-800/30 border border-white/20 dark:border-white/10 backdrop-blur-lg rounded-3xl shadow-2xl transition">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-foreground/80">
                  Response From Groq
                </CardTitle>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowDialog(true)}
                  className="hover:bg-pink-200 dark:hover:bg-slate-700 transition"
                >
                  Save
                </Button>
              </CardHeader>
              <CardContent className="whitespace-pre-wrap p-4 max-h-[500px] overflow-y-auto text-sm text-foreground/90">
                {result}
              </CardContent>
            </Card>
          </motion.div>
        )}

    <Dialog open={showDialog} onOpenChange={setShowDialog}>
  <DialogContent className="rounded-xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-2xl border border-white/20 dark:border-white/10">
    <DialogHeader>
      <DialogTitle className="text-lg text-foreground">Save this recipe</DialogTitle>
     <DialogDescription>
  Don’t worry. We autodetect whether you are saving a Recipe or a Response based on our predefined Groq response format, keywords, and structure.
</DialogDescription>

    </DialogHeader>

    <Input
      placeholder="Recipe name"
      value={recipeName}
      onChange={(e) => setRecipeName(e.target.value)}
      disabled={loadingSave}
      className="mt-2"
    />

    <DialogFooter className="pt-4">
      <Button
        onClick={handleSave}
        disabled={loadingSave}
        className="bg-gradient-to-br from-indigo-500 via-pink-500  to-orange-400  text-white w-full hover:bg-primary/90"
      >
        {loadingSave && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
        Save Recipe/Response
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>


      </div>
    </div>
  )
}
