'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import {
  LoadingScreen,
  PromptCard,
  ResultCard,
  SaveDialog
} from '../components/dashboard'
import { motion } from 'framer-motion'
import { generateRecipe } from '@/lib/ai/webhook'

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [recipeName, setRecipeName] = useState('')
  const [loadingUser, setLoadingUser] = useState(true)
  const [loadingGenerate, setLoadingGenerate] = useState(false)
  const [generating, setGenerating] = useState(false) // <-- NEW STATE
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
      setGenerating(true) // <-- START GENERATING

      const output = await generateRecipe(user?.email, prompt)
      setResult(output)

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 200)
    } catch {
      setErrorMessage('Failed to generate recipe. Please try again.')
    } finally {
      setLoadingGenerate(false)
      setGenerating(false) // <-- END GENERATING
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

  if (loadingUser) return <LoadingScreen />

  return (
    <div className="min-h-screen px-4 py-10 sm:p-10 bg-gradient-to-br from-indigo-100 via-white to-pink-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div
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
            generating={generating} // <-- PASSED DOWN
            errorMessage={errorMessage}
            successMessage={successMessage}
          />
        </motion.div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
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
