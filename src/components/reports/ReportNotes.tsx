import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, Send } from 'lucide-react'
import type { ReportNote } from '@/types/report.types'
import { format } from 'date-fns'

interface ReportNotesProps {
  notes: ReportNote[]
  onAddNote: (content: string) => void
  isLoading?: boolean
}

export function ReportNotes({ notes, onAddNote, isLoading = false }: ReportNotesProps) {
  const [newNote, setNewNote] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return

    onAddNote(newNote)
    setNewNote('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare className="size-4" />
          Internal Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Add Note Form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder="Add an internal note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !newNote.trim()}>
              <Send className="size-4" />
            </Button>
          </form>

          {/* Notes List */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {notes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No notes yet
              </p>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">{note.authorName}</p>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(note.createdAt), 'MMM dd, yyyy • HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm">{note.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
