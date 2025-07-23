'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefObject } from 'react'
export default function ResultCard({
  result,
  setShowDialog,
  resultRef
}: {
  result: string
  setShowDialog: (open: boolean) => void
  resultRef: RefObject<HTMLDivElement | null>
}) {
  return (
    <div ref={resultRef}>
      <Card className="bg-white/30 dark:bg-slate-800/30 border border-white/20 dark:border-white/10 backdrop-blur-lg rounded-3xl shadow-2xl transition">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground/80">Response From Groq</CardTitle>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowDialog(true)}
            className="hover:bg-pink-200 dark:hover:bg-slate-700 transition"
          >
            Save
          </Button>
        </CardHeader>
        <CardContent className="whitespace-pre-wrap p-4 max-h-[500px] overflow-y-auto text-sm text-foreground/90">
          {result}
        </CardContent>
      </Card>
    </div>
  )
}
