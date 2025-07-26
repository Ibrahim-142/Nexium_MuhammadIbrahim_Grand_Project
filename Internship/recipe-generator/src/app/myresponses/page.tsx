'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, ClipboardCopy, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useAuth } from '../components/LayoutWrapper'

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
  const { isAuthenticated, isLoading, user } = useAuth()
  const [responses, setResponses] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (!user) return

    const fetchResponses = async () => {
      try {
        const res = await fetch(
          `/api/get-from-mongo?userEmail=${user.email}&contentLabel=response`
        )
        const data = await res.json()
        setResponses(data?.data || [])
      } catch (err) {
        console.error('[FETCH_RESPONSES_ERROR]', err)
        toast.error('Failed to fetch responses.')
      } finally {
        setLoading(false)
      }
    }

    fetchResponses()
  }, [user])

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const handleDelete = async (_id: string) => {
    if (deletingId) return

    setDeletingId(_id)
    try {
      const res = await fetch(`/api/delete-from-mongo?_id=${_id}`, {
        method: 'DELETE',
      })

      const isJson = res.headers.get('content-type')?.includes('application/json')
      const responseData = isJson ? await res.json() : null

      if (!res.ok) {
        throw new Error(responseData?.error || res.statusText)
      }

      setResponses((prev) => prev.filter((r) => r._id !== _id))
      toast.success('Response deleted successfully!')
    } catch (err) {
      console.error('[DELETE_ERROR]', err)
      toast.error(
        `Error deleting response: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`
      )
    } finally {
      setDeletingId(null)
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
            href="/dashboard"
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
                <div className="flex gap-1">
                  <Button
                    className="cursor-pointer"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(response.recipeContent)}
                    title="Copy to clipboard"
                  >
                    <ClipboardCopy className="w-4 h-4 text-gray-500 hover:text-indigo-600" />
                  </Button>
                  <Button
                    className="cursor-pointer"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(response._id)}
                    disabled={deletingId === response._id}
                    title="Delete response"
                  >
                    <Trash2
                      className={`w-4 h-4 ${
                        deletingId === response._id
                          ? 'text-red-300 animate-pulse'
                          : 'text-red-500 hover:text-red-700'
                      }`}
                    />
                  </Button>
                </div>
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
