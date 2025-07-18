'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [recipePrompt, setRecipePrompt] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/login')
      else setUser(data.user)
    })
  }, [router])

  const handleGenerateRecipe = async () => {
    setLoading(true)
    setResponse('')

    try {
const res = await fetch('http://localhost:5678/webhook/b0ca536a-92b9-4dc2-a2c6-2e3c1e506d52/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chatInput: recipePrompt,     
    sessionId: user?.id || 'anonymous'
  }),
})


      if (!res.ok) throw new Error('Request failed')

      const data = await res.json()
      setResponse(data.reply || JSON.stringify(data))
    } catch  {
      setResponse('Error generating recipe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <p>Loading...</p>

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">👋 Welcome, {user.email}</h1>

      <div className="space-y-2">
        <input
          type="text"
          value={recipePrompt}
          onChange={(e) => setRecipePrompt(e.target.value)}
          placeholder="Enter ingredients or recipe idea..."
          className="w-full border p-2 rounded"
        />
        <button
          onClick={handleGenerateRecipe}
          className="bg-green-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Recipe'}
        </button>
        {response && (
          <div className="border p-4 rounded bg-gray-100 whitespace-pre-wrap">{response}</div>
        )}
      </div>

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
