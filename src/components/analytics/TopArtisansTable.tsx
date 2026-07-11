import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { TopRatedArtisan } from '@/types/analytics.types'
import { Award, Star } from 'lucide-react'

interface TopArtisansTableProps {
  artisans: TopRatedArtisan[] | null
  isLoading: boolean
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
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
            Top Rated Artisans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
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
          Top Rated Artisans
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {artisans.map((artisan, index) => (
            <div
              key={artisan.artisanId}
              className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                {index + 1}
              </div>
              <Avatar className="size-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(artisan.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{artisan.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {artisan.reviewCount} reviews
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <Star className="size-3 text-yellow-500" />
                <span className="font-medium">{artisan.rating.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
