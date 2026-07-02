import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { TopArtisan } from '@/types/analytics.types'
import { Award, Star, DollarSign } from 'lucide-react'

interface TopArtisansTableProps {
  artisans: TopArtisan[] | null
  isLoading: boolean
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}

export function TopArtisansTable({ artisans, isLoading }: TopArtisansTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!artisans || artisans.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="size-4" />
            Top Artisans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Award className="size-4" />
          Top Artisans
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {artisans.map((artisan, index) => (
            <div
              key={artisan.id}
              className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                {index + 1}
              </div>
              <Avatar className="size-10">
                <AvatarImage src={artisan.avatar || undefined} alt={artisan.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(artisan.name, artisan.businessName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{artisan.name}</p>
                <p className="text-xs text-muted-foreground truncate">{artisan.businessName}</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Star className="size-3 text-yellow-500" />
                  <span className="font-medium">{artisan.averageRating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="size-3 text-success" />
                  <span className="font-medium">${artisan.totalRevenue.toLocaleString()}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {artisan.totalBookings} bookings
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
