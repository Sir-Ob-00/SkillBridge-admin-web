import { Card, CardContent } from '@/components/ui/card'
import type { ReportStatistics } from '@/types/report.types'
import { AlertTriangle, CheckCircle, Clock, XCircle, FileText, Calendar, ShieldAlert } from 'lucide-react'

interface ReportStatisticsProps {
  statistics: ReportStatistics
}

export function ReportStatistics({ statistics }: ReportStatisticsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Reports</p>
              <p className="text-2xl font-bold">{statistics.totalReports}</p>
            </div>
            <FileText className="size-8 text-primary" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Open</p>
              <p className="text-2xl font-bold text-warning">{statistics.openReports}</p>
            </div>
            <Clock className="size-8 text-warning" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Under Investigation</p>
              <p className="text-2xl font-bold text-blue-500">{statistics.underInvestigation}</p>
            </div>
            <AlertTriangle className="size-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Response</p>
              <p className="text-2xl font-bold text-purple-500">{statistics.pendingResponse}</p>
            </div>
            <Clock className="size-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Resolved</p>
              <p className="text-2xl font-bold text-success">{statistics.resolved}</p>
            </div>
            <CheckCircle className="size-8 text-success" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Dismissed</p>
              <p className="text-2xl font-bold text-muted-foreground">{statistics.dismissed}</p>
            </div>
            <XCircle className="size-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Critical</p>
              <p className="text-2xl font-bold text-danger">{statistics.criticalReports}</p>
            </div>
            <ShieldAlert className="size-8 text-danger" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today's Reports</p>
              <p className="text-2xl font-bold">{statistics.todayReports}</p>
            </div>
            <Calendar className="size-8 text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
