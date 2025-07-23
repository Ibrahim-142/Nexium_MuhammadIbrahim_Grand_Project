'use client'
import { motion } from 'framer-motion'

export default function LoadingScreen() {
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
