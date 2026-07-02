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

interface AssignReportDialogProps {
  isOpen: boolean
  onClose: () => void
  onAssign: (adminId: string, note?: string) => void
  isLoading?: boolean
  availableAdmins?: { id: string; name: string }[]
}

export function AssignReportDialog({
  isOpen,
  onClose,
  onAssign,
  isLoading = false,
  availableAdmins = [],
}: AssignReportDialogProps) {
  const [selectedAdmin, setSelectedAdmin] = useState('')
  const [note, setNote] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAdmin.trim()) return

    onAssign(selectedAdmin, note)
    setSelectedAdmin('')
    setNote('')
  }

  const handleClose = () => {
    setSelectedAdmin('')
    setNote('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Report</DialogTitle>
          <DialogDescription>
            Assign this report to an administrator for investigation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin">Administrator *</Label>
              <select
                id="admin"
                value={selectedAdmin}
                onChange={(e) => setSelectedAdmin(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                required
              >
                <option value="">Select an administrator</option>
                {availableAdmins.map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    {admin.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Input
                id="note"
                placeholder="Add any additional notes..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !selectedAdmin.trim()}>
              {isLoading ? 'Assigning...' : 'Assign'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
