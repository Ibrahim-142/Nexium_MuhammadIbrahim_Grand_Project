'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import FeedbackMessage from './FeedbackMessage'

export default function PromptCard({
  userEmail,
  prompt,
  setPrompt,
  handleGenerate,
  loadingGenerate,
  errorMessage,
  successMessage
}: {
  userEmail: string | undefined
  prompt: string
  setPrompt: (v: string) => void
  handleGenerate: () => void
  loadingGenerate: boolean
  errorMessage: string
  successMessage: string
}) {
  return (
    <Card className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-xl rounded-3xl transition">
      <CardHeader>
        <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 via-pink-500 to-orange-400 bg-clip-text text-transparent animate-pulse tracking-tight">
          Welcome, <span className="font-semibold italic">{userEmail}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {errorMessage && <FeedbackMessage type="error" message={errorMessage} />}
        {successMessage && <FeedbackMessage type="success" message={successMessage} />}

        <Textarea
          placeholder="What do you want to cook?"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loadingGenerate}
          className="min-h-[120px] rounded-xl border-accent focus:ring-2 focus:ring-primary/50 transition"
        />

        <Button
          className="w-full bg-gradient-to-br from-indigo-500 via-pink-500 to-orange-400 text-white font-semibold shadow-md hover:brightness-110 transition"
          disabled={loadingGenerate || !prompt.trim()}
          onClick={handleGenerate}
        >
          {loadingGenerate && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
          Generate Recipe
        </Button>
      </CardContent>
    </Card>
  )
}
