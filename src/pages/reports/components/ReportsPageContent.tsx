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
import { Pagination } from '@/components/common/Pagination'
import { ReportDetailsDrawer } from '@/components/reports/ReportDetailsDrawer'
import { ReportStatusBadge } from '@/components/reports/ReportStatusBadge'
import {
  getReports,
  getReportById,
  assignReport,
  resolveReport,
  dismissReport,
  getReportStatistics,
} from '@/services/reports.service'
import type { Report, ReportFilters, ReportStatus } from '@/types/report.types'
import { format } from 'date-fns'
import { Search, MoreVertical, Eye, RefreshCw, Flag, CheckCircle } from 'lucide-react'
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

const STATUS_FILTERS: (ReportStatus | undefined)[] = [undefined, 'open', 'escalated', 'resolved']
const STATUS_LABELS: Record<string, string> = {
  undefined: 'All',
  open: 'Open',
  escalated: 'Escalated',
  resolved: 'Resolved',
}

export function ReportsPageContent() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<ReportFilters>({
    page: 1,
    limit: 10,
    search: '',
    status: undefined,
  })
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setFilters((prev) => ({ ...prev, search: value, page: 1 })), 400),
    [],
  )

  const { data: reportsData, isLoading: isLoadingReports, error: reportsError, refetch: refetchReports } =
    useQuery({ queryKey: ['reports', filters], queryFn: () => getReports(filters) })

  const { data: statistics, isLoading: isLoadingStats } = useQuery({
    queryKey: ['report-statistics'],
    queryFn: getReportStatistics,
  })

  const { data: reportDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['report-details', selectedReport?.id],
    queryFn: () => getReportById(selectedReport!.id),
    enabled: !!selectedReport && isDrawerOpen,
  })

  const decisionMutation = useMutation({
    mutationFn: async (args: { id: string; action: 'assign' | 'resolve' | 'dismiss'; adminId?: string; resolution?: string; reason?: string; internalNote?: string }) => {
      if (args.action === 'assign') return assignReport(args.id, { adminId: args.adminId ?? '', note: args.internalNote })
      if (args.action === 'resolve') return resolveReport(args.id, { resolution: args.resolution ?? '', internalNote: args.internalNote })
      return dismissReport(args.id, { reason: args.reason ?? '', internalNote: args.internalNote })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      queryClient.invalidateQueries({ queryKey: ['report-statistics'] })
      toast.success('Report updated successfully')
    },
    onError: () => toast.error('Failed to update report'),
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => debouncedSearch(e.target.value)
  const handleStatusFilterChange = (status: ReportStatus | undefined) => setFilters((prev) => ({ ...prev, status, page: 1 }))
  const handlePageChange = (page: number) => setFilters((prev) => ({ ...prev, page }))
  const handleViewDetails = (report: Report) => {
    setSelectedReport(report)
    setIsDrawerOpen(true)
  }
  const handleDecision = (id: string, action: 'assign' | 'resolve' | 'dismiss', payload?: { adminId?: string; resolution?: string; reason?: string; internalNote?: string }) => {
    decisionMutation.mutate({ id, action, ...payload })
    setIsDrawerOpen(false)
    setSelectedReport(null)
  }
  const handleResetFilters = () => setFilters({ page: 1, limit: 10, search: '', status: undefined })

  const reports = reportsData?.items ?? []
  const hasFilters = Boolean(filters.search || filters.status)

  if (reportsError) {
    return (
      <PageContainer>
        <PageHeader title="Reports" description="Investigate and resolve incidents reported across the SkillBridge platform." />
        <ErrorState title="Failed to load reports" description="There was an error fetching the reports. Please try again." onRetry={() => refetchReports()} />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Reports"
        description="Investigate and resolve incidents reported across the SkillBridge platform."
        actions={
          <Button variant="outline" onClick={() => refetchReports()} disabled={isLoadingReports}>
            <RefreshCw className={`size-4 mr-2 ${isLoadingReports ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {isLoadingStats ? (
          [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24" />)
        ) : statistics ? (
          <>
            <StatCard label="Total" value={statistics.total} icon={<Flag className="size-8 text-primary" />} />
            <StatCard label="Open" value={statistics.open} icon={<Flag className="size-8 text-warning" />} />
            <StatCard label="Escalated" value={statistics.escalated} icon={<Flag className="size-8 text-danger" />} />
            <StatCard label="Resolved" value={statistics.resolved} icon={<CheckCircle className="size-8 text-success" />} />
          </>
        ) : null}
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by reason, reporter, or target..."
              className="pl-9"
              defaultValue={filters.search}
              onChange={handleSearchChange}
            />
          </div>
          <Button variant="outline" onClick={handleResetFilters} disabled={!hasFilters}>
            Reset
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map((status) => (
            <Button
              key={String(status)}
              variant={filters.status === status ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange(status)}
            >
              {STATUS_LABELS[String(status)]}
            </Button>
          ))}
        </div>
      </div>

      {isLoadingReports ? (
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
      ) : reports.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reporter</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={undefined} alt={report.reporter.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials(report.reporter.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{report.reporter.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{report.reporter.role}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{report.target.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{report.target.role}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{report.reason}</span>
                  </TableCell>
                  <TableCell>
                    <ReportStatusBadge status={report.status} />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{format(new Date(report.createdAt), 'MMM dd, yyyy')}</span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(report)}>
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
          {reportsData && (
            <div className="mt-4">
              <Pagination page={reportsData.page} totalPages={reportsData.totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No reports found"
          description={hasFilters ? 'No reports match your current filters.' : 'No reports have been submitted yet.'}
          actionLabel={hasFilters ? 'Clear Filters' : undefined}
          onAction={hasFilters ? handleResetFilters : undefined}
        />
      )}

      <ReportDetailsDrawer
        report={reportDetails || selectedReport}
        isLoading={isLoadingDetails}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false)
          setSelectedReport(null)
        }}
        onDecision={handleDecision}
        isActionLoading={decisionMutation.isPending}
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
