import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { AdminStatistics } from '@/types/admin.types'
import { Users, UserCheck, UserX, Shield } from 'lucide-react'

interface AdminStatisticsProps {
  statistics: AdminStatistics | null
  isLoading: boolean
}

export function AdminStatistics({ statistics, isLoading }: AdminStatisticsProps) {
  const stats = [
    {
      title: 'Total Admins',
      value: statistics?.totalAdmins || 0,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Active Admins',
      value: statistics?.activeAdmins || 0,
      icon: UserCheck,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Inactive Admins',
      value: statistics?.inactiveAdmins || 0,
      icon: UserX,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
    },
    {
      title: 'Super Admins',
      value: statistics?.superAdmins || 0,
      icon: Shield,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ]

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`size-10 rounded-full ${stat.bgColor} flex items-center justify-center ${stat.color}`}>
                  <Icon className="size-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
