import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'
import type { TopRatedArtisan } from '@/types/dashboard.types'
import { Skeleton } from '@/components/ui/skeleton'

interface TopArtisansProps {
  artisans: TopRatedArtisan[]
  isLoading?: boolean
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getRatingBadge(rating: number): { label: string; variant: 'default' | 'secondary' | 'outline' } {
  if (rating >= 4.5) return { label: 'Excellent', variant: 'default' }
  if (rating >= 4.0) return { label: 'Great', variant: 'secondary' }
  if (rating >= 3.5) return { label: 'Good', variant: 'outline' }
  return { label: 'Average', variant: 'outline' }
}

export function TopArtisans({ artisans, isLoading }: TopArtisansProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Artisans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (artisans.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Artisans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground text-sm">
            No artisans data available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Artisans</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {artisans.map((artisan) => {
            const badge = getRatingBadge(artisan.rating)
            const initials = getInitials(artisan.name)

            return (
              <div key={artisan.artisanId} className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={undefined} alt={artisan.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{artisan.name}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="size-3 fill-warning text-warning" />
                    <span>{artisan.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{artisan.reviewCount}</p>
                  <p className="text-xs text-muted-foreground">reviews</p>
                </div>
                <Badge variant={badge.variant}>{badge.label}</Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
