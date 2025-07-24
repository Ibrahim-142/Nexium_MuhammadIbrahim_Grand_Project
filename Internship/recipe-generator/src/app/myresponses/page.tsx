'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, ClipboardCopy } from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Recipe {
  _id: string
  userEmail: string
  recipeName: string
  recipeContent: string
  contentLabel: 'recipe' | 'response'
  createdAt?: string
  updatedAt?: string
}

export default function MyResponsesPage() {
  const [responses, setResponses] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResponses = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        setLoading(false)
        return
      }

      const res = await fetch(`/api/get-from-mongo?userEmail=${user.email}&contentLabel=response`)
      const data = await res.json()

      setResponses(data?.data || [])
      setLoading(false)
    }

    fetchResponses()
  }, [])

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  return (
    <div className="px-4 py-6 sm:p-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          My Responses
        </h1>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <Plus className="w-4 h-4" /> <span>Generate New</span>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow transition space-y-3"
            >
              <Skeleton className="h-6 w-3/4 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
            </div>
          ))}
        </div>
      ) : responses.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-base sm:text-lg">
            You haven&apos;t saved any responses yet.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition"
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate Your First Response
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {responses.map((response) => (
            <li
              key={response._id}
              className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow hover:shadow-md transition flex flex-col"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h2 className="text-base sm:text-lg font-semibold text-indigo-700 dark:text-indigo-400 break-words flex-1">
                  {response.recipeName}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(response.recipeContent)}
                  title="Copy to clipboard"
                >
                  <ClipboardCopy className="w-4 h-4 text-gray-500 hover:text-indigo-600" />
                </Button>
              </div>

              <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line overflow-y-auto max-h-48 pr-1">
                {response.recipeContent}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
