'use client'
import { motion } from 'framer-motion'
import { XCircle, CheckCircle } from 'lucide-react'

export default function FeedbackMessage({ type, message }: { type: 'error' | 'success'; message: string }) {
  if (!message) return null

  const isError = type === 'error'
  const Icon = isError ? XCircle : CheckCircle

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center gap-2 text-sm font-medium p-3 rounded-md border shadow ${
        isError
          ? 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
          : 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
      }`}
    >
      <Icon className="w-4 h-4" />
      {message}
    </motion.div>
  )
}
