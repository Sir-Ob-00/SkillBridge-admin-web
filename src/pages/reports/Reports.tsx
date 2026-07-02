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
import { ReportStatistics } from '@/components/reports/ReportStatistics'
import { Badge } from '@/components/ui/badge'
import {
  getReports,
  getReportById,
  assignReport,
  resolveReport,
  dismissReport,
  addReportNote,
  getReportStatistics,
  exportReports,
} from '@/services/reports.service'
import type { Report, ReportFilters, ReportStatus, ReportPriority } from '@/types/report.types'
import { format } from 'date-fns'
import { Search, MoreVertical, Eye, Download, RefreshCw, AlertTriangle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import toast from 'react-hot-toast'

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}

export default function Reports() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<ReportFilters>({
    page: 1,
    limit: 10,
    search: '',
    status: undefined,
    priority: undefined,
    category: undefined,
    reporterType: undefined,
    entityType: undefined,
    assignedAdmin: undefined,
    sortBy: 'newest',
  })
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setFilters((prev) => ({ ...prev, search: value, page: 1 }))
      }, 400),
    [],
  )

  const {
    data: reportsData,
    isLoading: isLoadingReports,
    error: reportsError,
    refetch: refetchReports,
  } = useQuery({
    queryKey: ['reports', filters],
    queryFn: () => getReports(filters),
  })

  const { data: statistics, isLoading: isLoadingStats } = useQuery({
    queryKey: ['report-statistics'],
    queryFn: getReportStatistics,
  })

  const { data: reportDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['report-details', selectedReport?.id],
    queryFn: () => getReportById(selectedReport!.id),
    enabled: !!selectedReport && isDrawerOpen,
  })

  const assignMutation = useMutation({
    mutationFn: ({ id, adminId, note }: { id: string; adminId: string; note?: string }) => assignReport(id, { adminId, note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      queryClient.invalidateQueries({ queryKey: ['report-statistics'] })
      toast.success('Report assigned successfully')
    },
    onError: () => {
      toast.error('Failed to assign report')
    },
  })

  const resolveMutation = useMutation({
    mutationFn: ({ id, resolution, internalNote }: { id: string; resolution: string; internalNote?: string }) => resolveReport(id, { resolution, internalNote }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      queryClient.invalidateQueries({ queryKey: ['report-statistics'] })
      toast.success('Report resolved successfully')
    },
    onError: () => {
      toast.error('Failed to resolve report')
    },
  })

  const dismissMutation = useMutation({
    mutationFn: ({ id, reason, internalNote }: { id: string; reason: string; internalNote?: string }) => dismissReport(id, { reason, internalNote }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      queryClient.invalidateQueries({ queryKey: ['report-statistics'] })
      toast.success('Report dismissed successfully')
    },
    onError: () => {
      toast.error('Failed to dismiss report')
    },
  })

  const addNoteMutation = useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) => addReportNote(id, { content, isInternal: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      queryClient.invalidateQueries({ queryKey: ['report-details'] })
      toast.success('Note added successfully')
    },
    onError: () => {
      toast.error('Failed to add note')
    },
  })

  const exportMutation = useMutation({
    mutationFn: () => exportReports(filters),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reports-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Reports exported successfully')
    },
    onError: () => {
      toast.error('Failed to export reports')
    },
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    debouncedSearch(value)
  }

  const handleStatusFilterChange = (status: ReportStatus | undefined) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }))
  }

  const handlePriorityFilterChange = (priority: ReportPriority | undefined) => {
    setFilters((prev) => ({ ...prev, priority, page: 1 }))
  }

  const handleSortChange = (sortBy: 'newest' | 'oldest' | 'priority' | 'status' | 'last_updated') => {
    setFilters((prev) => ({ ...prev, sortBy, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report)
    setIsDrawerOpen(true)
  }

  const handleAssign = async (id: string, adminId: string, note?: string) => {
    await assignMutation.mutateAsync({ id, adminId, note })
  }

  const handleResolve = async (id: string, resolution: string, internalNote?: string) => {
    await resolveMutation.mutateAsync({ id, resolution, internalNote })
  }

  const handleDismiss = async (id: string, reason: string, internalNote?: string) => {
    await dismissMutation.mutateAsync({ id, reason, internalNote })
  }

  const handleAddNote = async (id: string, content: string) => {
    await addNoteMutation.mutateAsync({ id, content })
  }

  const handleExport = () => {
    exportMutation.mutate()
  }

  const handleRefresh = () => {
    refetchReports()
  }

  const handleResetFilters = () => {
    setFilters({ page: 1, limit: 10, search: '', status: undefined, priority: undefined, category: undefined, reporterType: undefined, entityType: undefined, assignedAdmin: undefined, sortBy: 'newest' })
  }

  if (reportsError) {
    return (
      <PageContainer>
        <PageHeader
          title="Reports"
          description="Investigate and resolve incidents reported across the SkillBridge platform."
        />
        <ErrorState
          title="Failed to load reports"
          description="There was an error fetching the reports. Please try again."
          onRetry={() => refetchReports()}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Reports"
        description="Investigate and resolve incidents reported across the SkillBridge platform."
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={exportMutation.isPending}
            >
              <Download className="size-4 mr-2" />
              Export Reports
            </Button>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoadingReports}
            >
              <RefreshCw className={`size-4 mr-2 ${isLoadingReports ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        }
      />

      {/* Statistics Cards */}
      {isLoadingStats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : statistics ? (
        <div className="mb-6">
          <ReportStatistics statistics={statistics} />
        </div>
      ) : null}

      {/* Filter Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by report ID, name, email, booking ID..."
              className="pl-9"
              defaultValue={filters.search}
              onChange={handleSearchChange}
            />
          </div>
          <Button
            variant="outline"
            onClick={handleResetFilters}
            disabled={!filters.search && !filters.status && !filters.priority && !filters.category && !filters.reporterType && !filters.entityType && !filters.assignedAdmin}
          >
            Reset
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 border-r border-border pr-2">
            <Button
              variant={filters.status === undefined ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange(undefined)}
            >
              All
            </Button>
            <Button
              variant={filters.status === 'open' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange('open')}
            >
              Open
            </Button>
            <Button
              variant={filters.status === 'under_investigation' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange('under_investigation')}
            >
              Investigation
            </Button>
            <Button
              variant={filters.status === 'pending_response' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange('pending_response')}
            >
              Pending
            </Button>
            <Button
              variant={filters.status === 'resolved' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange('resolved')}
            >
              Resolved
            </Button>
            <Button
              variant={filters.status === 'dismissed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange('dismissed')}
            >
              Dismissed
            </Button>
          </div>
          <div className="flex items-center gap-1 border-r border-border pr-2">
            <Button
              variant={filters.priority === 'critical' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handlePriorityFilterChange(filters.priority === 'critical' ? undefined : 'critical')}
            >
              <AlertTriangle className="size-3 mr-1" />
              Critical
            </Button>
            <Button
              variant={filters.priority === 'high' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handlePriorityFilterChange(filters.priority === 'high' ? undefined : 'high')}
            >
              High
            </Button>
            <Button
              variant={filters.priority === 'medium' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handlePriorityFilterChange(filters.priority === 'medium' ? undefined : 'medium')}
            >
              Medium
            </Button>
            <Button
              variant={filters.priority === 'low' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handlePriorityFilterChange(filters.priority === 'low' ? undefined : 'low')}
            >
              Low
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant={filters.sortBy === 'newest' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleSortChange('newest')}
            >
              Newest
            </Button>
            <Button
              variant={filters.sortBy === 'oldest' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleSortChange('oldest')}
            >
              Oldest
            </Button>
            <Button
              variant={filters.sortBy === 'priority' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleSortChange('priority')}
            >
              Priority
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
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
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="size-8" />
            </div>
          ))}
        </div>
      ) : reportsData?.data && reportsData.data.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Reported Entity</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Admin</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportsData.data.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <span className="text-sm font-mono">{report.id.slice(0, 8)}...</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm capitalize">{report.category.replace('_', ' ')}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={report.reporter.avatar || undefined} alt={`${report.reporter.firstName} ${report.reporter.lastName}`} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials(report.reporter.firstName, report.reporter.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {report.reporter.firstName} {report.reporter.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">{report.reporter.type}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={report.reportedEntity.avatar || undefined} alt={report.reportedEntity.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {report.reportedEntity.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{report.reportedEntity.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{report.reportedEntity.type}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={report.priority === 'critical' ? 'danger' : 'outline'} className="text-xs capitalize">
                      {report.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs capitalize">
                      {report.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {report.assignedAdminName || 'Unassigned'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {format(new Date(report.createdAt), 'MMM dd, yyyy')}
                    </span>
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
          <div className="mt-4">
            <Pagination
              page={reportsData.meta.page}
              totalPages={reportsData.meta.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <EmptyState
          title="No reports found"
          description={
            filters.search || filters.status || filters.priority || filters.category || filters.reporterType || filters.entityType || filters.assignedAdmin
              ? 'No reports match your current filters.'
              : 'No reports have been submitted yet.'
          }
          actionLabel={filters.search || filters.status || filters.priority || filters.category || filters.reporterType || filters.entityType || filters.assignedAdmin ? 'Clear Filters' : undefined}
          onAction={filters.search || filters.status || filters.priority || filters.category || filters.reporterType || filters.entityType || filters.assignedAdmin ? handleResetFilters : undefined}
        />
      )}

      {/* Report Details Drawer */}
      <ReportDetailsDrawer
        report={reportDetails || selectedReport}
        isLoading={isLoadingDetails}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false)
          setSelectedReport(null)
        }}
        onAssign={handleAssign}
        onResolve={handleResolve}
        onDismiss={handleDismiss}
        onAddNote={handleAddNote}
        availableAdmins={[
          { id: '1', name: 'Admin User' },
          { id: '2', name: 'Moderator User' },
        ]}
      />
    </PageContainer>
  )
}
