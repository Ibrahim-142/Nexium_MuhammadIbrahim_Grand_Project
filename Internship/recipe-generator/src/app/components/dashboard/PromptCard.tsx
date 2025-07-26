'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function PromptCard({
  userEmail,
  prompt,
  setPrompt,
  handleGenerate,
  loadingGenerate,
}: {
  userEmail: string | undefined
  prompt: string
  setPrompt: (v: string) => void
  handleGenerate: () => void
  loadingGenerate: boolean
}) {
  const emailName = userEmail?.split('@')[0] || 'Guest'

  return (
    <div className="w-full mt-12">
      <div className="max-w-3xl mx-auto w-full">
        <Card className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-xl rounded-3xl transition w-full">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-400 via-pink-500 to-orange-400 bg-clip-text text-transparent animate-pulse tracking-tight">
              Welcome,
              <span
                className="ml-2 font-semibold italic truncate max-w-xs overflow-hidden whitespace-nowrap hidden sm:inline"
                title={emailName}
              >
                {emailName}
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Textarea
              placeholder="What do you want to cook?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loadingGenerate}
              className="min-h-[120px] rounded-xl border-accent focus:ring-2 focus:ring-primary/50 transition text-sm sm:text-base"
            />

            <Button
              className="w-full text-sm sm:text-base py-2 sm:py-3 bg-gradient-to-br from-indigo-500 via-pink-500 to-orange-400 text-white hover:cursor-pointer font-semibold shadow-md hover:brightness-110 transition"
              disabled={loadingGenerate || !prompt.trim()}
              onClick={handleGenerate}
            >
              {loadingGenerate && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
              {loadingGenerate ? 'Generating...' : 'Generate Recipe'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
