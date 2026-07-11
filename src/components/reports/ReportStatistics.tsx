import { StatTileGrid, type StatTileItem } from '@/components/common/StatTile'
import type { ReportStatistics } from '@/types/report.types'
import { AlertTriangle, CheckCircle, Clock, XCircle, FileText, Calendar, ShieldAlert } from 'lucide-react'

interface ReportStatisticsProps {
  statistics: ReportStatistics
}

export function ReportStatistics({ statistics }: ReportStatisticsProps) {
  const items: StatTileItem[] = [
    { label: 'Total Reports', value: statistics.totalReports, icon: FileText },
    {
      label: 'Open',
      value: statistics.openReports,
      icon: Clock,
      valueClassName: 'text-warning',
      iconClassName: 'text-warning',
    },
    {
      label: 'Under Investigation',
      value: statistics.underInvestigation,
      icon: AlertTriangle,
      valueClassName: 'text-blue-500',
      iconClassName: 'text-blue-500',
    },
    {
      label: 'Pending Response',
      value: statistics.pendingResponse,
      icon: Clock,
      valueClassName: 'text-purple-500',
      iconClassName: 'text-purple-500',
    },
    {
      label: 'Resolved',
      value: statistics.resolved,
      icon: CheckCircle,
      valueClassName: 'text-success',
      iconClassName: 'text-success',
    },
    {
      label: 'Dismissed',
      value: statistics.dismissed,
      icon: XCircle,
      valueClassName: 'text-muted-foreground',
      iconClassName: 'text-muted-foreground',
    },
    {
      label: 'Critical',
      value: statistics.criticalReports,
      icon: ShieldAlert,
      valueClassName: 'text-danger',
      iconClassName: 'text-danger',
    },
    { label: "Today's Reports", value: statistics.todayReports, icon: Calendar },
  ]

  return <StatTileGrid items={items} />
}
