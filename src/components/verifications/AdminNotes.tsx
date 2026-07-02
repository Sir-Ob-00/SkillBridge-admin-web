import { useState } from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MessageSquare, Send, Edit2, Trash2 } from 'lucide-react'
import type { AdminNote } from '@/types/verification.types'

interface AdminNotesProps {
  notes: AdminNote[]
  onAddNote: (content: string) => void
  onEditNote?: (noteId: string, content: string) => void
  onDeleteNote?: (noteId: string) => void
  isLoading?: boolean
}

export function AdminNotes({
  notes,
  onAddNote,
  onEditNote,
  onDeleteNote,
  isLoading = false,
}: AdminNotesProps) {
  const [newNote, setNewNote] = useState('')
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(newNote.trim())
      setNewNote('')
    }
  }

  const handleEditNote = (note: AdminNote) => {
    setEditingNoteId(note.id)
    setEditContent(note.content)
  }

  const handleSaveEdit = () => {
    if (editingNoteId && editContent.trim() && onEditNote) {
      onEditNote(editingNoteId, editContent.trim())
      setEditingNoteId(null)
      setEditContent('')
    }
  }

  const handleCancelEdit = () => {
    setEditingNoteId(null)
    setEditContent('')
  }

  const handleDeleteNote = (noteId: string) => {
    if (onDeleteNote) {
      onDeleteNote(noteId)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare className="size-4" />
          Admin Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Note */}
        <div className="space-y-2">
          <Input
            placeholder="Add an internal note (visible only to admins)..."
            value={newNote}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewNote(e.target.value)}
            disabled={isLoading}
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={handleAddNote}
              disabled={!newNote.trim() || isLoading}
            >
              <Send className="size-4 mr-2" />
              Add Note
            </Button>
          </div>
        </div>

        {/* Notes List */}
        {notes && notes.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notes.map((note) => (
              <div key={note.id} className="border border-border rounded-lg p-3 bg-muted/30">
                {editingNoteId === note.id ? (
                  <div className="space-y-2">
                    <Input
                      value={editContent}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditContent(e.target.value)}
                      autoFocus
                    />
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSaveEdit}>
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-3 mb-2">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials(note.author)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm">{note.author}</p>
                          <div className="flex items-center gap-1">
                            {onEditNote && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-6"
                                onClick={() => handleEditNote(note)}
                              >
                                <Edit2 className="size-3" />
                              </Button>
                            )}
                            {onDeleteNote && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-6 text-danger"
                                onClick={() => handleDeleteNote(note.id)}
                              >
                                <Trash2 className="size-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(note.createdAt), 'MMM dd, yyyy • HH:mm')}
                          {note.updatedAt && note.updatedAt !== note.createdAt && (
                            <span> (edited)</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground pl-11">{note.content}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="size-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notes yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
