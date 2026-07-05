import { Search, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ArtisanFilters, ArtisanStatus, VerificationStatus } from '@/types/artisan.types'
import { hasActiveArtisanFilters } from '../utils/artisanHelpers'

interface ArtisanFiltersBarProps {
  filters: ArtisanFilters
  onSearchChange: (value: string) => void
  onStatusChange: (status: ArtisanStatus | undefined) => void
  onVerificationChange: (status: VerificationStatus | undefined) => void
  onReset: () => void
}

export function ArtisanFiltersBar({ filters, onSearchChange, onStatusChange, onVerificationChange, onReset }: ArtisanFiltersBarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, business, email, or phone..."
            className="pl-9"
            defaultValue={filters.search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
        <Button variant="outline" onClick={onReset} disabled={!hasActiveArtisanFilters(filters)}>
          Reset
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 border-r border-border pr-2">
          <Button variant={filters.status === undefined ? 'primary' : 'outline'} size="sm" onClick={() => onStatusChange(undefined)}>All</Button>
          <Button variant={filters.status === 'active' ? 'primary' : 'outline'} size="sm" onClick={() => onStatusChange('active')}>Active</Button>
          <Button variant={filters.status === 'suspended' ? 'primary' : 'outline'} size="sm" onClick={() => onStatusChange('suspended')}>Suspended</Button>
          <Button variant={filters.status === 'pending' ? 'primary' : 'outline'} size="sm" onClick={() => onStatusChange('pending')}>Pending</Button>
        </div>
        <div className="flex items-center gap-1">
          <Button variant={filters.verificationStatus === 'verified' ? 'primary' : 'outline'} size="sm" onClick={() => onVerificationChange('verified')}>
            <Shield className="mr-1 size-4" />
            Verified
          </Button>
          <Button variant={filters.verificationStatus === 'pending' ? 'primary' : 'outline'} size="sm" onClick={() => onVerificationChange('pending')}>
            Pending
          </Button>
        </div>
      </div>
    </div>
  )
}
