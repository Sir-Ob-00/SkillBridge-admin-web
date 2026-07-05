import { CalendarDays, CircleAlert, Users, FileClock } from 'lucide-react'
import { StatCard } from '@/components/common/StatCard'
import type { AuditLogStatistics } from '@/types/auditLog.types'

interface AuditLogStatisticsProps {
  statistics: AuditLogStatistics
}

export function AuditLogStatistics({ statistics }: AuditLogStatisticsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Logs"
        value={statistics.totalLogs}
        icon={FileClock}
      />
      <StatCard
        title="Today's Logs"
        value={statistics.todaysLogs}
        icon={CalendarDays}
      />
      <StatCard
        title="Failed Actions"
        value={statistics.failedActions}
        icon={CircleAlert}
      />
      <StatCard
        title="Active Admins Today"
        value={statistics.activeAdminsToday}
        icon={Users}
      />
    </div>
  )
}
