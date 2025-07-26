'use client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function SaveDialog({
  showDialog,
  setShowDialog,
  recipeName,
  setRecipeName,
  handleSave,
  loadingSave
}: {
  showDialog: boolean
  setShowDialog: (v: boolean) => void
  recipeName: string
  setRecipeName: (v: string) => void
  handleSave: () => void
  loadingSave: boolean
}) {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="rounded-xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-2xl border border-white/20 dark:border-white/10">
        <DialogHeader>
          <DialogTitle className="text-lg text-foreground">Save this recipe/response</DialogTitle>
          <DialogDescription className="text-sm">
            Don’t worry. We autodetect whether you are saving a Recipe or a Response based on the structure.
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Recipe name"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
          disabled={loadingSave}
          className="mt-2 text-sm sm:text-base"
        />

        <DialogFooter className="pt-4">
          <Button
            onClick={handleSave}
            disabled={loadingSave}
            className="bg-gradient-to-br hover:cursor-pointer from-indigo-500 via-pink-500 to-orange-400 text-white w-full hover:brightness-110 transition hover:bg-primary/90 text-sm sm:text-base py-2 sm:py-3"
          >
            {loadingSave && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
            {loadingSave ? 'Saving...' : 'Save Recipe/Response'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
