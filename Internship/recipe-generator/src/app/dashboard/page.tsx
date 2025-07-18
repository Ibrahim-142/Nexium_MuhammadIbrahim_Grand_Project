'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [input, setInput] = useState('')
  const [response, setResponse] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/login')
      else setUser(data.user)
    })
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('http://localhost:5678/webhook/b0ca536a-92b9-4dc2-a2c6-2e3c1e506d52/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: user?.id,
        chatInput: input,
      }),
    })

    const data = await res.json()
    setResponse(data.output)
  }

  if (!user) return <p>Loading...</p>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">👋 Welcome, {user.email}</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your recipe idea..."
          className="w-full border rounded p-2"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Generate Recipe
        </button>
      </form>

      {response && (
        <div className="prose max-w-none bg-white p-4 rounded shadow">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {response}
          </ReactMarkdown>
        </div>
      )}

      <button
        className="mt-8 bg-red-600 text-white px-4 py-2 rounded"
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
