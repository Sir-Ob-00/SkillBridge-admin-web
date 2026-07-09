import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { StudentVerification } from '@/types/artisanApplication.types'
import { ZoomIn, CheckCircle, XCircle, Clock } from 'lucide-react'

interface VerificationPanelProps {
  verification: StudentVerification
}

export function VerificationPanel({ verification }: VerificationPanelProps) {
  const [isImageOpen, setIsImageOpen] = useState(false)

  const getStatusIcon = () => {
    switch (verification.verificationStatus) {
      case 'verified':
        return <CheckCircle className="size-5 text-success" />
      case 'rejected':
        return <XCircle className="size-5 text-danger" />
      case 'pending':
      default:
        return <Clock className="size-5 text-warning" />
    }
  }

  const getStatusBadge = () => {
    switch (verification.verificationStatus) {
      case 'verified':
        return <Badge variant="success">Verified</Badge>
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>
      case 'pending':
      default:
        return <Badge variant="warning">Pending Review</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Student Verification</span>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            {getStatusBadge()}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Student ID:</span>
            <span className="font-medium">{verification.studentId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Institution:</span>
            <span className="font-medium">{verification.institution}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type:</span>
            <span className="font-medium capitalize">{verification.institutionType.replace(/_/g, ' ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Program:</span>
            <span className="font-medium">{verification.program}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Enrollment Year:</span>
            <span className="font-medium">{verification.enrollmentYear}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Expected Graduation:</span>
            <span className="font-medium">{verification.expectedGraduation}</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Verification Document</p>
          <div className="relative aspect-video rounded-lg border border-border overflow-hidden bg-muted">
            <img
              src={verification.verificationImage}
              alt="Verification document"
              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setIsImageOpen(true)}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
              <Button variant="ghost" size="icon" className="bg-background">
                <ZoomIn className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Verification Document</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <img
              src={verification.verificationImage}
              alt="Verification document"
              className="w-full rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
