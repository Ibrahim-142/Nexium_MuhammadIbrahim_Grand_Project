'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { Loader2 } from 'lucide-react'

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const [showSavePrompt, setShowSavePrompt] = useState(false)
  const [wantsToSave, setWantsToSave] = useState(false)
  const [recipeName, setRecipeName] = useState('')
  const [loadingUser, setLoadingUser] = useState(true)
  const [loadingGenerate, setLoadingGenerate] = useState(false)
  const [loadingSave, setLoadingSave] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

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
      setMessage({ type: 'error', text: '❗ Please enter something to generate a recipe.' })
      return
    }

    try {
      setMessage(null)
      setResult('')
      setShowSavePrompt(false)
      setWantsToSave(false)
      setLoadingGenerate(true)

      const res = await fetch('http://localhost:5678/webhook/b0ca536a-92b9-4dc2-a2c6-2e3c1e506d52/chat', {
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
      setShowSavePrompt(true)
    } catch {
      setMessage({ type: 'error', text: '❌ Error generating recipe. Please try again.' })
    } finally {
      setLoadingGenerate(false)
    }
  }

  const handleSave = async () => {
    if (!recipeName.trim() || !result.trim()) {
      return setMessage({ type: 'error', text: '❗ Enter a recipe name before saving.' })
    }

    try {
      setMessage(null)
      setLoadingSave(true)

      const res = await fetch('/api/save-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user?.email,
          recipeName,
          recipeContent: result,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setMessage({ type: 'success', text: '✅ Recipe saved successfully!' })
        setShowSavePrompt(false)
        setWantsToSave(false)
        setRecipeName('')
      } else {
        throw new Error(data.error || 'Unknown error')
      }
    } catch {
      setMessage({ type: 'error', text: '❌ Failed to save recipe. Please try again.' })
    } finally {
      setLoadingSave(false)
    }
  }

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Welcome, {user.email}</h1>

      {message && (
        <div
          className={`mb-4 p-3 rounded transition ${
            message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <textarea
        required
        placeholder="What do you want to cook?"
        className="border p-2 w-full h-24 mb-2 rounded"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={loadingGenerate}
      />

      <button
        className={`bg-green-600 text-white px-4 py-2 rounded mb-4 flex items-center justify-center gap-2 ${
          loadingGenerate || !prompt.trim() ? 'opacity-70 cursor-not-allowed' : ''
        }`}
        onClick={handleGenerate}
        disabled={loadingGenerate || !prompt.trim()}
      >
        {loadingGenerate && <Loader2 className="animate-spin w-5 h-5" />}
        Generate Recipe
      </button>

      {result && (
        <>
          <pre className="bg-gray-100 mt-4 p-4 rounded whitespace-pre-wrap overflow-auto max-h-[400px]">
            {result}
          </pre>

          {showSavePrompt && !wantsToSave && (
            <div className="mt-4">
              <p className="mb-2 font-medium">Do you want to save this recipe?</p>
              <div className="space-x-2">
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => setWantsToSave(true)}
                >
                  Yes
                </button>
                <button
                  className="bg-gray-400 text-white px-3 py-1 rounded"
                  onClick={() => {
                    setShowSavePrompt(false)
                    setWantsToSave(false)
                  }}
                >
                  No
                </button>
              </div>
            </div>
          )}

          {wantsToSave && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Enter recipe name"
                className="border p-2 w-full mb-2 rounded"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                disabled={loadingSave}
              />
              <button
                className={`bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 ${
                  loadingSave ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                onClick={handleSave}
                disabled={loadingSave}
              >
                {loadingSave && <Loader2 className="animate-spin w-4 h-4" />}
                Save Recipe
              </button>
            </div>
          )}
        </>
      )}

      <button
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded"
        onClick={async () => {
          await supabase.auth.signOut()
          router.push('/login')
        }}
      >
        Logout
      </button>
    </div>
  )
}
