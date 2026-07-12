import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { debounce } from 'lodash-es'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/feedback/PageHeader'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/common/Table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Pagination } from '@/components/common/Pagination'
import { VerificationDrawer } from '@/components/verifications/VerificationDrawer'
import {
  fetchVerificationArtisans,
  getVerificationDocuments,
  getVerificationStatistics,
  VERIFICATION_TABS,
  type VerificationTab,
  type VerificationRequest,
  type VerificationFilters,
} from '@/services/verifications.service'
import { artisanVerificationVariant } from '@/types/artisan.types'
import { format } from 'date-fns'
import { Search, MoreVertical, Eye, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import toast from 'react-hot-toast'

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const VERIFICATION_TAB_LABELS: Record<VerificationTab, string> = {
  ALL: 'All',
  PENDING: 'Pending',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CHANGES_REQUESTED: 'Changes Requested',
}

const VERIFICATION_TAB_EMPTY: Record<VerificationTab, { title: string; description: string }> = {
  ALL: {
    title: 'No artisan applications found',
    description: 'No artisan applications have been submitted yet.',
  },
  PENDING: {
    title: 'No pending artisan applications.',
    description: 'There are no pending artisan applications to review.',
  },
  UNDER_REVIEW: {
    title: 'No applications under review.',
    description: 'No applications are currently under review.',
  },
  APPROVED: {
    title: 'No approved artisans.',
    description: 'No artisans have been approved yet.',
  },
  REJECTED: {
    title: 'No rejected applications.',
    description: 'No applications have been rejected.',
  },
  CHANGES_REQUESTED: {
    title: 'No change requests.',
    description: 'No applications have pending change requests.',
  },
}

export function VerificationsPageContent() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<VerificationTab>('ALL')
  const [filters, setFilters] = useState<VerificationFilters>({
    page: 1,
    limit: 10,
    search: '',
    status: undefined,
  })
  const [selectedVerification, setSelectedVerification] = useState<VerificationRequest | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setFilters((prev) => ({ ...prev, search: value, page: 1 })), 400),
    [],
  )

  const selectedStatus = VERIFICATION_TABS[activeTab].status

  const { data: verificationsData, isLoading: isLoadingVerifications, error: verificationsError, refetch: refetchVerifications } =
    useQuery({
      queryKey: ['artisan-verifications', selectedStatus, filters],
      queryFn: () => fetchVerificationArtisans(activeTab, filters),
    })

  const { data: statistics, isLoading: isLoadingStats } = useQuery({
    queryKey: ['artisan-verifications-statistics'],
    queryFn: getVerificationStatistics,
  })

  const { data: verificationDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['artisan-verification-details', selectedVerification?.id],
    queryFn: () => getVerificationDocuments(selectedVerification!.id),
    enabled: !!selectedVerification && isDrawerOpen,
  })

  const decisionMutation = useMutation({
    mutationFn: async (args: { id: string; action: 'approve' | 'reject' | 'request' | 'note'; note?: string }) => {
      const { approveVerification, rejectVerification, requestMoreInformation, addVerificationNote } = await import('@/services/verifications.service')
      if (args.action === 'approve') return approveVerification(args.id, { note: args.note })
      if (args.action === 'reject') return rejectVerification(args.id, { note: args.note ?? '' })
      if (args.action === 'request') return requestMoreInformation(args.id, { note: args.note ?? '' })
      return addVerificationNote(args.id, args.note ?? '')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artisan-verifications'] })
      queryClient.invalidateQueries({ queryKey: ['artisan-verifications-statistics'] })
      toast.success('Verification updated successfully')
    },
    onError: () => toast.error('Failed to update verification'),
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => debouncedSearch(e.target.value)

  const handleTabChange = (tab: VerificationTab) => {
    setActiveTab(tab)
    setFilters((prev) => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (page: number) => setFilters((prev) => ({ ...prev, page }))

  const handleViewDetails = (verification: VerificationRequest) => {
    setSelectedVerification(verification)
    setIsDrawerOpen(true)
  }

  const handleDecision = async (id: string, action: 'approve' | 'reject' | 'request' | 'note', payload?: { note?: string }) => {
    await decisionMutation.mutateAsync({ id, action, note: payload?.note })
    setIsDrawerOpen(false)
    setSelectedVerification(null)
  }

  const handleResetFilters = () => {
    setFilters({ page: 1, limit: 10, search: '', status: undefined })
    setActiveTab('ALL')
  }

  if (verificationsError) {
    return (
      <PageContainer>
        <PageHeader title="Artisan Verification" description="Review artisan identity and business documents" />
        <ErrorState
          title="Failed to load verifications"
          description="There was an error fetching the verification requests. Please try again."
          onRetry={() => refetchVerifications()}
        />
      </PageContainer>
    )
  }

  const verifications = verificationsData?.items ?? []

  return (
    <PageContainer>
      <PageHeader title="Artisan Verification" description="Review artisan identity and business documents" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {isLoadingStats ? (
          [1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)
        ) : statistics ? (
          <>
            <StatCard label="Pending" value={statistics.pending} icon={<Clock className="size-8 text-warning" />} />
            <StatCard label="Under Review" value={statistics.underReview} icon={<AlertCircle className="size-8 text-secondary" />} />
            <StatCard label="Changes Requested" value={statistics.changesRequested} icon={<AlertCircle className="size-8 text-warning" />} />
            <StatCard label="Active" value={statistics.active} icon={<CheckCircle className="size-8 text-success" />} />
            <StatCard label="Rejected" value={statistics.rejected} icon={<XCircle className="size-8 text-danger" />} />
            <StatCard label="Total" value={statistics.total} icon={<Clock className="size-8 text-primary" />} />
          </>
        ) : null}
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by business, name, or email..."
              className="pl-9"
              defaultValue={filters.search}
              onChange={handleSearchChange}
            />
          </div>
          <Button variant="outline" onClick={handleResetFilters} disabled={!filters.search && activeTab === 'ALL'}>
            Reset
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(VERIFICATION_TABS) as VerificationTab[]).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleTabChange(tab)}
            >
              {VERIFICATION_TAB_LABELS[tab]}
            </Button>
          ))}
        </div>
      </div>

      {isLoadingVerifications ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 border border-border rounded-lg">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-8" />
            </div>
          ))}
        </div>
      ) : verifications.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Artisan</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {verifications.map((verification) => (
                <TableRow key={verification.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={verification.user.profileImageUrl || undefined} alt={verification.user.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials(verification.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{verification.user.name}</p>
                        <p className="text-xs text-muted-foreground">{verification.user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{verification.businessName || '—'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {verification.submittedAt ? format(new Date(verification.submittedAt), 'MMM dd, yyyy') : '—'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={verification.verification} variant={artisanVerificationVariant(verification.verification)} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(verification)}>
                          <Eye className="size-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {verificationsData && (
            <div className="mt-4">
              <Pagination page={verificationsData.page} totalPages={verificationsData.totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </>
      ) : (
        (() => {
          const empty = VERIFICATION_TAB_EMPTY[activeTab]
          const hasSearch = !!filters.search
          return (
            <EmptyState
              title={empty.title}
              description={hasSearch ? 'No results match your current search.' : empty.description}
              actionLabel={hasSearch ? 'Clear search' : undefined}
              onAction={hasSearch ? handleResetFilters : undefined}
            />
          )
        })()
      )}

      <VerificationDrawer
        verification={verificationDetails || selectedVerification}
        isLoading={isLoadingDetails}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false)
          setSelectedVerification(null)
        }}
        onDecision={handleDecision}
      />
    </PageContainer>
  )
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        {icon}
      </div>
    </div>
  )
}
