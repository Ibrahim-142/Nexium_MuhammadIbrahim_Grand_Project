'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PromptCard, ResultCard, SaveDialog } from '../components/dashboard'
import { motion } from 'framer-motion'
import { generateRecipe } from '@/lib/ai/webhook'
import { toast } from 'sonner'
import { useAuth } from '@/app/components/LayoutWrapper'

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [recipeName, setRecipeName] = useState('')
  const [loadingGenerate, setLoadingGenerate] = useState(false)
  const [loadingSave, setLoadingSave] = useState(false)
  const resultRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isLoading, isAuthenticated, router])

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter something to generate a recipe.')
      return
    }

    try {
      setResult('')
      setLoadingGenerate(true)
      const output = await generateRecipe(user?.email, prompt)
      setResult(output)

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 200)
    } catch {
      toast.error('Failed to generate recipe. Please try again.')
    } finally {
      setLoadingGenerate(false)
    }
  }

  const handleSave = async () => {
    if (!recipeName.trim()) {
      toast.error('Please enter a recipe name before saving.')
      return
    }

    try {
      setLoadingSave(true)

      const isRecipe = (() => {
        const lower = result.toLowerCase()
        const hasIngredients = lower.includes('ingredients:')
        const hasInstructions = lower.includes('instructions:')
        const hasSteps = /(\d+\.\s)/.test(result)
        const hasBullets = result.split('\n').some(line =>
          line.trim().startsWith('-') || line.trim().startsWith('*')
        )
        return hasIngredients && hasInstructions && hasSteps && hasBullets
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
        toast.success('Saved successfully.')
        setShowDialog(false)
        setRecipeName('')
      } else {
        throw new Error(data.error || 'Unknown error')
      }
    } catch {
      toast.error('Failed to save recipe. Please try again.')
    } finally {
      setLoadingSave(false)
    }
  }

  if (isLoading || (!isAuthenticated && typeof window !== 'undefined')) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-600 dark:text-gray-300">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-10 sm:p-10 bg-gradient-to-br from-indigo-100 via-white to-pink-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 transition-colors duration-300 overflow-y-auto">
      <div className="max-w-3xl w-full mx-auto flex flex-col gap-6 sm:gap-8">
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <PromptCard
            userEmail={user?.email}
            prompt={prompt}
            setPrompt={setPrompt}
            handleGenerate={handleGenerate}
            loadingGenerate={loadingGenerate}
          />
        </motion.div>

        {result && (
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            ref={resultRef}
          >
            <ResultCard
              result={result}
              setShowDialog={setShowDialog}
              resultRef={resultRef}
            />
          </motion.div>
        )}

        <SaveDialog
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          recipeName={recipeName}
          setRecipeName={setRecipeName}
          handleSave={handleSave}
          loadingSave={loadingSave}
        />
      </div>
    </div>
  )
}
