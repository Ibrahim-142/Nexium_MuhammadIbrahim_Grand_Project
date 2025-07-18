'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [recipeName, setRecipeName] = useState('')
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/login')
      else setUser(data.user)
    })
  }, [router])

  const handleGenerate = async () => {
    const res = await fetch('http://localhost:5678/webhook/b0ca536a-92b9-4dc2-a2c6-2e3c1e506d52/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: user?.email,
        chatInput: prompt,
      }),
    })

    const data = await res.json()
    setResult(data.output)
  }

  const handleSave = async () => {
    if (!recipeName || !result) return alert('Enter recipe name and generate a recipe first')

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
    if (data.success) alert(' Recipe saved!')
    else alert('Failed to save recipe')
  }

  if (!user) return <p>Loading...</p>

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Welcome, {user.email}</h1>

      <input
        type="text"
        placeholder="Recipe name"
        className="border p-2 w-full mb-2"
        value={recipeName}
        onChange={(e) => setRecipeName(e.target.value)}
      />

      <textarea
        placeholder="What do you want to cook?"
        className="border p-2 w-full h-24 mb-2"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <div className="space-x-2">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleGenerate}
        >
          Generate
        </button>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSave}
        >
          Save
        </button>
      </div>

      {result && (
        <pre className="bg-gray-100 mt-4 p-4 rounded whitespace-pre-wrap">
          {result}
        </pre>
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
