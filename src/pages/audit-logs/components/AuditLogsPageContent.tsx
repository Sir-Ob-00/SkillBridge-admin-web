import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { debounce } from 'lodash-es'
import { format } from 'date-fns'
import { Download, Eye, MoreVertical, RefreshCw, Search } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/feedback/PageHeader'
import { AuditLogDrawer } from '@/components/audit-logs/AuditLogDrawer'
import { AuditLogStatistics } from '@/components/audit-logs/AuditLogStatistics'
import { AuditLogStatusBadge } from '@/components/audit-logs/AuditLogStatusBadge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/common/Table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { Pagination } from '@/components/common/Pagination'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import {
  AUDIT_ACTIONS,
  type AuditAction,
  type AuditFilters,
  type AuditLog,
} from '@/types/auditLog.types'
import { exportAuditLogs, getAuditLogById, getAuditLogs } from '@/services/auditLogs.service'
import toast from 'react-hot-toast'

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}

function formatActionLabel(action: string): string {
  return action
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

function buildFilterSummary(filters: AuditFilters): string {
  const activeParts = [
    filters.search ? `search: "${filters.search}"` : null,
    filters.admin ? `admin: "${filters.admin}"` : null,
    filters.action ? `action: ${formatActionLabel(filters.action)}` : null,
    filters.dateFrom ? `from: ${filters.dateFrom}` : null,
    filters.dateTo ? `to: ${filters.dateTo}` : null,
  ].filter(Boolean)

  return activeParts.length > 0 ? activeParts.join(', ') : 'none'
}

export default function AuditLogs() {
  const [filters, setFilters] = useState<AuditFilters>({
    page: 1,
    limit: 10,
    search: '',
    admin: '',
    action: undefined,
    dateFrom: '',
    dateTo: '',
  })
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setFilters((prev) => ({ ...prev, search: value, page: 1 }))
      }, 400),
    [],
  )

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  const {
    data: auditLogsData,
    isLoading: isLoadingLogs,
    error: logsError,
    refetch: refetchLogs,
  } = useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: () => getAuditLogs(filters),
  })

  const { data: logDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['audit-log-details', selectedLog?.id],
    queryFn: () => getAuditLogById(selectedLog!.id),
    enabled: !!selectedLog && isDrawerOpen,
  })

  const exportMutation = useMutation({
    mutationFn: () => exportAuditLogs(filters),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `audit-logs-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(anchor)
      anchor.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(anchor)
      toast.success('Audit logs exported successfully')
    },
    onError: () => {
      toast.error('Failed to export audit logs')
    },
  })

  const auditLogs = useMemo(() => auditLogsData?.data ?? [], [auditLogsData])
  const statistics = auditLogsData?.statistics
  const actionOptions = useMemo(() => Object.values(AUDIT_ACTIONS), [])
  const hasActiveFilters = Boolean(
    filters.search || filters.admin || filters.action || filters.dateFrom || filters.dateTo,
  )

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(event.target.value)
  }

  const handleAdminChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, admin: event.target.value, page: 1 }))
  }

  const handleActionChange = (action: AuditAction | undefined) => {
    setFilters((prev) => ({ ...prev, action, page: 1 }))
  }

  const handleDateChange = (field: 'dateFrom' | 'dateTo', value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const handleViewLog = (log: AuditLog) => {
    setSelectedLog(log)
    setIsDrawerOpen(true)
  }

  const handleExport = () => {
    exportMutation.mutate()
  }

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: '',
      admin: '',
      action: undefined,
      dateFrom: '',
      dateTo: '',
    })
  }

  if (logsError) {
    return (
      <PageContainer>
        <PageHeader
          title="Audit Logs"
          description="Read-only history of administrative actions across the platform."
          actions={
            <Button variant="outline" onClick={() => refetchLogs()}>
              <RefreshCw className="mr-2 size-4" />
              Retry
            </Button>
          }
        />
        <ErrorState
          title="Failed to load audit logs"
          description="There was an error fetching the audit log history. Please try again."
          onRetry={() => refetchLogs()}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Audit Logs"
        description="Read-only history of administrative actions across the platform."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={exportMutation.isPending}
            >
              <Download className="mr-2 size-4" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => refetchLogs()}
              disabled={isLoadingLogs}
            >
              <RefreshCw className={`mr-2 size-4 ${isLoadingLogs ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        }
      />

      {isLoadingLogs ? (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-24 rounded-lg" />
          ))}
        </div>
      ) : statistics ? (
        <div className="mb-6">
          <AuditLogStatistics statistics={statistics} />
        </div>
      ) : null}

      <div className="mb-6 space-y-4 rounded-lg border border-border bg-card p-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="audit-search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="audit-search"
                placeholder="Search admin, email, action, or resource..."
                className="pl-9"
                defaultValue={filters.search}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="audit-admin">Administrator</Label>
            <Input
              id="audit-admin"
              placeholder="Filter by admin name or email"
              defaultValue={filters.admin}
              onChange={handleAdminChange}
            />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>Action Type</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span>
                    {filters.action ? formatActionLabel(filters.action) : 'All actions'}
                  </span>
                  <MoreVertical className="size-4 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem onClick={() => handleActionChange(undefined)}>
                  All actions
                </DropdownMenuItem>
                {actionOptions.map((action) => (
                  <DropdownMenuItem
                    key={action}
                    onClick={() => handleActionChange(action as AuditAction)}
                  >
                    {formatActionLabel(action)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            <Label htmlFor="audit-date-from">From</Label>
            <Input
              id="audit-date-from"
              type="date"
              value={filters.dateFrom}
              onChange={(event) => handleDateChange('dateFrom', event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="audit-date-to">To</Label>
            <Input
              id="audit-date-to"
              type="date"
              value={filters.dateTo}
              onChange={(event) => handleDateChange('dateTo', event.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            Active filters: {buildFilterSummary(filters)}
          </div>
          <Button
            variant="outline"
            onClick={handleResetFilters}
            disabled={!hasActiveFilters}
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {isLoadingLogs ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="rounded-lg border border-border p-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="mt-3 h-4 w-2/3" />
              <Skeleton className="mt-4 h-20 w-full" />
            </div>
          ))}
        </div>
      ) : auditLogs.length > 0 ? (
        <>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Administrator</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">
                          {format(new Date(log.timestamp), 'MMM dd, yyyy')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(log.timestamp), 'HH:mm:ss')}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          {log.administrator.avatar ? (
                            <AvatarImage
                              src={log.administrator.avatar}
                              alt={`${log.administrator.firstName} ${log.administrator.lastName}`}
                            />
                          ) : null}
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {getInitials(log.administrator.firstName, log.administrator.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {log.administrator.firstName} {log.administrator.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">{log.administrator.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs capitalize">
                        {formatActionLabel(log.action)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{log.resource}</p>
                        {log.resourceId ? (
                          <p className="font-mono text-xs text-muted-foreground">{log.resourceId}</p>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <AuditLogStatusBadge status={log.status} />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{log.ipAddress ?? '—'}</span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewLog(log)}>
                            <Eye className="mr-2 size-4" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-4 md:hidden">
            {auditLogs.map((log) => (
              <Card key={log.id}>
                <CardContent className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-medium">
                        {format(new Date(log.timestamp), 'MMM dd, yyyy • HH:mm:ss')}
                      </p>
                      <p className="text-xs text-muted-foreground">{log.id}</p>
                    </div>
                    <AuditLogStatusBadge status={log.status} />
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">Administrator</span>
                      <span className="text-right font-medium">
                        {log.administrator.firstName} {log.administrator.lastName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">Action</span>
                      <span className="font-medium">{formatActionLabel(log.action)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">Resource</span>
                      <span className="font-medium">{log.resource}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">IP Address</span>
                      <span className="font-medium">{log.ipAddress ?? '—'}</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" onClick={() => handleViewLog(log)}>
                    <Eye className="mr-2 size-4" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-4">
            <Pagination
              page={auditLogsData?.meta.page ?? 1}
              totalPages={auditLogsData?.meta.totalPages ?? 0}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <EmptyState
          title="No audit logs found"
          description={
            hasActiveFilters
              ? 'No audit logs match your current search and filter criteria.'
              : 'No audit log entries have been recorded yet.'
          }
          actionLabel={hasActiveFilters ? 'Clear Filters' : undefined}
          onAction={hasActiveFilters ? handleResetFilters : undefined}
        />
      )}

      <AuditLogDrawer
        log={logDetails || selectedLog}
        isLoading={isLoadingDetails}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false)
          setSelectedLog(null)
        }}
      />
    </PageContainer>
  )
}
