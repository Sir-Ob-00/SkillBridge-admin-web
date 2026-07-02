import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'

interface DocumentViewerProps {
  isOpen: boolean
  onClose: () => void
  documentUrl: string
  documentName: string
  documentType?: string
}

export function DocumentViewer({
  isOpen,
  onClose,
  documentUrl,
  documentName,
  documentType = 'image',
}: DocumentViewerProps) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5))
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360)
  const handleReset = () => {
    setZoom(1)
    setRotation(0)
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = documentUrl
    link.download = documentName
    link.click()
  }

  const isImage = documentType === 'image' || documentUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)
  const isPdf = documentType === 'pdf' || documentUrl.match(/\.pdf$/i)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="truncate pr-4">{documentName}</DialogTitle>
          <div className="flex items-center gap-2">
            {isImage && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                >
                  <ZoomOut className="size-4" />
                </Button>
                <span className="text-sm font-medium w-12 text-center">{Math.round(zoom * 100)}%</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                >
                  <ZoomIn className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleRotate}>
                  <RotateCw className="size-4" />
                </Button>
                {(zoom !== 1 || rotation !== 0) && (
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    Reset
                  </Button>
                )}
              </>
            )}
            <Button variant="ghost" size="icon" onClick={handleDownload}>
              <Download className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-auto flex items-center justify-center bg-muted/20 rounded-lg min-h-[400px]">
          {isImage ? (
            <img
              src={documentUrl}
              alt={documentName}
              className="max-w-full object-contain transition-transform"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
              }}
            />
          ) : isPdf ? (
            <iframe
              src={documentUrl}
              title={documentName}
              className="w-full h-full min-h-[500px]"
            />
          ) : (
            <div className="text-center p-8">
              <p className="text-muted-foreground mb-4">Preview not available for this file type</p>
              <Button onClick={handleDownload}>
                <Download className="size-4 mr-2" />
                Download File
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
