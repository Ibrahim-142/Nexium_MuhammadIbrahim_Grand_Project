'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Copy } from 'lucide-react'

export default function ResultCard({
  result,
  setShowDialog,
  resultRef
}: {
  result: string
  setShowDialog: (open: boolean) => void
  resultRef: React.RefObject<HTMLDivElement | null>
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  return (
    <div ref={resultRef} className="w-full">
      <div className="max-w-3xl mx-auto w-full">
        <Card className="bg-white/30 dark:bg-slate-800/30 border border-white/20 dark:border-white/10 backdrop-blur-lg rounded-3xl shadow-2xl transition w-full">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <CardTitle className="text-base sm:text-lg font-semibold text-foreground/80">
              Response From Groq
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="hover:bg-pink-200 dark:hover:bg-slate-700 transition text-xs sm:text-sm"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowDialog(true)}
                className="hover:bg-pink-200 dark:hover:bg-slate-700 transition text-xs sm:text-sm"
              >
                Save
              </Button>
            </div>
          </CardHeader>

          <CardContent className="whitespace-pre-wrap p-4 max-h-[500px] overflow-y-auto text-sm text-foreground/90">
            {result}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
