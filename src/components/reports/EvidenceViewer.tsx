import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Download, Eye, FileImage, FileText, Video } from 'lucide-react'
import type { ReportEvidence } from '@/types/report.types'

interface EvidenceViewerProps {
  evidence: ReportEvidence[]
}

export function EvidenceViewer({ evidence }: EvidenceViewerProps) {
  const [selectedEvidence, setSelectedEvidence] = useState<ReportEvidence | null>(null)

  if (!evidence || evidence.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="size-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No evidence attached</p>
      </div>
    )
  }

  const getIcon = (type: ReportEvidence['type']) => {
    switch (type) {
      case 'image':
        return FileImage
      case 'pdf':
        return FileText
      case 'video':
        return Video
      case 'screenshot':
        return FileImage
      default:
        return FileText
    }
  }

  const handleDownload = (evidence: ReportEvidence) => {
    const link = document.createElement('a')
    link.href = evidence.url
    link.download = evidence.fileName
    link.click()
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {evidence.map((item) => {
          const Icon = getIcon(item.type)
          return (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-3">
                <div
                  className="relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer mb-2"
                  onClick={() => setSelectedEvidence(item)}
                >
                  {item.thumbnailUrl || item.type === 'image' || item.type === 'screenshot' ? (
                    <img
                      src={item.thumbnailUrl || item.url}
                      alt={item.fileName}
                      className="size-full object-cover hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center">
                      <Icon className="size-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Eye className="size-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium truncate flex-1">{item.fileName}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6"
                    onClick={() => handleDownload(item)}
                  >
                    <Download className="size-3" />
                  </Button>
                </div>
                <Badge variant="outline" className="text-xs mt-1">
                  {item.type}
                </Badge>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedEvidence && (
        <Dialog open={!!selectedEvidence} onOpenChange={() => setSelectedEvidence(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedEvidence.fileName}</DialogTitle>
            </DialogHeader>
            <div className="relative">
              {selectedEvidence.type === 'image' || selectedEvidence.type === 'screenshot' ? (
                <img
                  src={selectedEvidence.url}
                  alt={selectedEvidence.fileName}
                  className="w-full rounded-lg"
                />
              ) : selectedEvidence.type === 'pdf' ? (
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <FileText className="size-16 text-muted-foreground" />
                  <p className="ml-4 text-muted-foreground">PDF preview not available</p>
                </div>
              ) : selectedEvidence.type === 'video' ? (
                <video
                  src={selectedEvidence.url}
                  controls
                  className="w-full rounded-lg"
                />
              ) : (
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <FileText className="size-16 text-muted-foreground" />
                  <p className="ml-4 text-muted-foreground">Preview not available</p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => handleDownload(selectedEvidence)}
              >
                <Download className="size-4 mr-2" />
                Download
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
