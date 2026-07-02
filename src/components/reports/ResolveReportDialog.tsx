import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface ResolveReportDialogProps {
  isOpen: boolean
  onClose: () => void
  onResolve: (resolution: string, internalNote?: string) => void
  isLoading?: boolean
}

export function ResolveReportDialog({
  isOpen,
  onClose,
  onResolve,
  isLoading = false,
}: ResolveReportDialogProps) {
  const [resolution, setResolution] = useState('')
  const [internalNote, setInternalNote] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!resolution.trim()) return

    onResolve(resolution, internalNote)
    setResolution('')
    setInternalNote('')
  }

  const handleClose = () => {
    setResolution('')
    setInternalNote('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Resolve Report</DialogTitle>
          <DialogDescription>
            Provide a resolution summary for this report. This will be visible to the reporter.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="resolution">Resolution Summary *</Label>
              <Input
                id="resolution"
                placeholder="Describe how this report was resolved..."
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="internalNote">Internal Note (Optional)</Label>
              <Input
                id="internalNote"
                placeholder="Add internal notes for future reference..."
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !resolution.trim()}>
              {isLoading ? 'Resolving...' : 'Resolve Report'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
