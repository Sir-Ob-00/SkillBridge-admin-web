import { useState } from 'react'
import { format } from 'date-fns'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerFooter,
  DrawerOverlay,
} from '@/components/ui/drawer'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/common/StatusBadge'
import { DocumentViewer } from './DocumentViewer'
import { VerificationTimeline } from './VerificationTimeline'
import { AdminNotes } from './AdminNotes'
import { DecisionPanel } from './DecisionPanel'
import type { VerificationRequest, VerificationStatus } from '@/types/verification.types'
import { Mail, Phone, MapPin, Briefcase, Calendar, FileText, Image as ImageIcon, Download, Eye } from 'lucide-react'

interface VerificationDrawerProps {
  verification: VerificationRequest | null
  isLoading?: boolean
  isOpen: boolean
  onClose: () => void
  onApprove: (id: string, note?: string) => void
  onReject: (id: string, reason: string) => void
  onRequestInfo: (id: string, message: string) => void
  onAddNote?: (id: string, content: string) => void
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}

function getStatusVariant(status: VerificationStatus): 'success' | 'warning' | 'danger' | 'secondary' {
  switch (status) {
    case 'approved':
      return 'success'
    case 'rejected':
      return 'danger'
    case 'requires_more_info':
      return 'warning'
    case 'pending':
      return 'secondary'
    default:
      return 'secondary'
  }
}

export function VerificationDrawer({
  verification,
  isLoading,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onRequestInfo,
  onAddNote,
}: VerificationDrawerProps) {
  const [selectedDocument, setSelectedDocument] = useState<{ url: string; name: string; type?: string } | null>(null)
  const [isActionLoading, setIsActionLoading] = useState(false)

  const handleApprove = async (note?: string) => {
    if (!verification) return
    setIsActionLoading(true)
    try {
      await onApprove(verification.id, note)
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleReject = async (reason: string) => {
    if (!verification) return
    setIsActionLoading(true)
    try {
      await onReject(verification.id, reason)
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleRequestInfo = async (message: string) => {
    if (!verification) return
    setIsActionLoading(true)
    try {
      await onRequestInfo(verification.id, message)
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleAddNote = (content: string) => {
    if (!verification || !onAddNote) return
    onAddNote(verification.id, content)
  }

  if (isLoading) {
    return (
      <Drawer>
        <DrawerOverlay open={isOpen} onClose={onClose} />
        <DrawerContent open={isOpen}>
          <DrawerHeader>
            <Skeleton className="h-6 w-48" />
          </DrawerHeader>
          <DrawerBody>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Skeleton className="size-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    )
  }

  if (!verification) return null

  const identityDocuments = verification.documents.filter((doc) =>
    ['National ID', 'Passport', 'Driver License', 'Ghana Card'].includes(doc.type),
  )
  const professionalDocuments = verification.documents.filter((doc) =>
    ['Trade Certificate', 'Business Registration', 'Professional License', 'Training Certificate'].includes(doc.type),
  )

  return (
    <Drawer>
      <DrawerOverlay open={isOpen} onClose={onClose} />
      <DrawerContent open={isOpen} className="max-w-4xl">
        <DrawerHeader>
          <DrawerTitle>Verification Details</DrawerTitle>
        </DrawerHeader>

        <DrawerBody className="space-y-6">
          {/* Artisan Summary */}
          <div className="flex items-start gap-4">
            <Avatar className="size-16">
              <AvatarImage src={verification.artisanAvatar || undefined} alt={`${verification.artisanFirstName} ${verification.artisanLastName}`} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {getInitials(verification.artisanFirstName, verification.artisanLastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">
                {verification.artisanFirstName} {verification.artisanLastName}
              </h3>
              <p className="text-sm text-muted-foreground">{verification.artisanBusinessName}</p>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <StatusBadge
                  status={verification.status}
                  variant={getStatusVariant(verification.status)}
                />
                <Badge variant="outline">{verification.category}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <Mail className="size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{verification.artisanEmail}</p>
              </div>
            </div>
            {verification.artisanPhone && (
              <div className="flex items-center gap-3">
                <Phone className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{verification.artisanPhone}</p>
                </div>
              </div>
            )}
            {verification.location && (
              <div className="flex items-center gap-3">
                <MapPin className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium">{verification.location}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Submitted</p>
                <p className="text-sm font-medium">
                  {format(new Date(verification.submittedAt), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Identity Documents */}
          {identityDocuments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="size-4" />
                  Identity Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {identityDocuments.map((doc) => (
                    <div key={doc.id} className="border border-border rounded-lg p-3 bg-muted/30">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {doc.thumbnailUrl ? (
                            <img
                              src={doc.thumbnailUrl}
                              alt={doc.name}
                              className="size-12 object-cover rounded"
                            />
                          ) : (
                            <div className="size-12 bg-muted rounded flex items-center justify-center">
                              <FileText className="size-6 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.type}</p>
                          </div>
                        </div>
                        <StatusBadge
                          status={doc.status}
                          variant={doc.status === 'approved' ? 'success' : doc.status === 'rejected' ? 'danger' : 'warning'}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedDocument({ url: doc.url, name: doc.name })}
                          className="flex-1"
                        >
                          <Eye className="size-3 mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const link = document.createElement('a')
                            link.href = doc.url
                            link.download = doc.name
                            link.click()
                          }}
                        >
                          <Download className="size-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Professional Documents */}
          {professionalDocuments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="size-4" />
                  Professional Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {professionalDocuments.map((doc) => (
                    <div key={doc.id} className="border border-border rounded-lg p-3 bg-muted/30">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {doc.thumbnailUrl ? (
                            <img
                              src={doc.thumbnailUrl}
                              alt={doc.name}
                              className="size-12 object-cover rounded"
                            />
                          ) : (
                            <div className="size-12 bg-muted rounded flex items-center justify-center">
                              <FileText className="size-6 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.type}</p>
                          </div>
                        </div>
                        <StatusBadge
                          status={doc.status}
                          variant={doc.status === 'approved' ? 'success' : doc.status === 'rejected' ? 'danger' : 'warning'}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedDocument({ url: doc.url, name: doc.name })}
                          className="flex-1"
                        >
                          <Eye className="size-3 mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const link = document.createElement('a')
                            link.href = doc.url
                            link.download = doc.name
                            link.click()
                          }}
                        >
                          <Download className="size-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Portfolio Evidence */}
          {verification.portfolio && verification.portfolio.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ImageIcon className="size-4" />
                  Portfolio Evidence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {verification.portfolio.slice(0, 6).map((item) => (
                    <div
                      key={item.id}
                      className="relative aspect-square rounded-lg overflow-hidden border border-border cursor-pointer"
                      onClick={() => setSelectedDocument({ url: item.url, name: item.name, type: 'image' })}
                    >
                      <img
                        src={item.thumbnailUrl || item.url}
                        alt={item.name}
                        className="size-full object-cover hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Eye className="size-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Verification Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Verification Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <VerificationTimeline history={verification.history} />
            </CardContent>
          </Card>

          {/* Admin Notes */}
          <AdminNotes
            notes={verification.adminNotes}
            onAddNote={handleAddNote}
            isLoading={isActionLoading}
          />

          {/* Decision Panel */}
          <DecisionPanel
            currentStatus={verification.status}
            onApprove={handleApprove}
            onReject={handleReject}
            onRequestInfo={handleRequestInfo}
            isLoading={isActionLoading}
          />
        </DrawerBody>

        <DrawerFooter>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <DocumentViewer
          isOpen={!!selectedDocument}
          onClose={() => setSelectedDocument(null)}
          documentUrl={selectedDocument.url}
          documentName={selectedDocument.name}
          documentType={selectedDocument.type}
        />
      )}
    </Drawer>
  )
}
