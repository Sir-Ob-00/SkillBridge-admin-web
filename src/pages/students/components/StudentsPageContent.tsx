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
import { StudentDetailsModal } from '@/components/students/StudentDetailsModal'
import {
  getStudents,
  getStudentById,
  updateStudentStatus,
  deleteStudent,
} from '@/services/students.service'
import type { Student, StudentFilters, StudentStatus } from '@/types/student.types'
import { studentStatus } from '@/types/student.types'
import { format } from 'date-fns'
import { Search, MoreVertical, Eye, Ban, Trash2, Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import toast from 'react-hot-toast'

export default function Students() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<StudentFilters>({
    page: 1,
    limit: 10,
    search: '',
    status: undefined,
  })
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setFilters((prev) => ({ ...prev, search: value, page: 1 }))
      }, 400),
    [],
  )

  const {
    data: studentsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['students', filters],
    queryFn: () => getStudents(filters),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'suspended' }) =>
      updateStudentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      toast.success('Student status updated successfully')
    },
    onError: () => {
      toast.error('Failed to update student status')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      toast.success('Student deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete student')
    },
  })

  const { data: studentDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['student-details', selectedStudent?.id],
    queryFn: () => getStudentById(selectedStudent!.id),
    enabled: !!selectedStudent && isModalOpen,
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    debouncedSearch(value)
  }

  const handleStatusFilterChange = (status: StudentStatus | undefined) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student)
    setIsModalOpen(true)
  }

  const handleStatusToggle = async (id: string, status: 'active' | 'suspended') => {
    await statusMutation.mutateAsync({ id, status })
    if (selectedStudent?.id === id) {
      setSelectedStudent((prev) =>
        prev ? { ...prev, isSuspended: status === 'suspended' } : null,
      )
    }
  }

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id)
    setIsModalOpen(false)
    setSelectedStudent(null)
  }

  const handleResetFilters = () => {
    setFilters({ page: 1, limit: 10, search: '', status: undefined })
  }

  const getInitials = (name: string) => {
    return name
      .split(/\s+/)
      .map((part) => part.charAt(0))
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  const getStatusVariant = (status: StudentStatus): 'success' | 'warning' => {
    return status === 'active' ? 'success' : 'warning'
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader
          title="Students"
          description="Manage all registered students"
        />
        <ErrorState
          title="Failed to load students"
          description="There was an error fetching the students list. Please try again."
          onRetry={() => refetch()}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Students"
        description="Manage all registered students"
      />

      {/* Filter Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              className="pl-9"
              defaultValue={filters.search}
              onChange={handleSearchChange}
            />
          </div>
          <Button
            variant="outline"
            onClick={handleResetFilters}
            disabled={!filters.search && !filters.status}
          >
            Reset
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={filters.status === undefined ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleStatusFilterChange(undefined)}
          >
            All
          </Button>
          <Button
            variant={filters.status === 'active' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleStatusFilterChange('active')}
          >
            Active
          </Button>
          <Button
            variant={filters.status === 'suspended' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleStatusFilterChange('suspended')}
          >
            Suspended
          </Button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
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
      ) : studentsData?.items && studentsData.items.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentsData.items.map((student) => {
                const status = studentStatus(student)
                return (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={student.profileImageUrl || undefined} alt={student.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials(student.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {student.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{student.phone || '—'}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={status}
                      variant={getStatusVariant(status)}
                    />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {format(new Date(student.createdAt), 'MMM dd, yyyy')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium capitalize">{student.role}</span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(student)}>
                          <Eye className="size-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {status === 'active' ? (
                          <DropdownMenuItem
                            onClick={() => handleStatusToggle(student.id, 'suspended')}
                          >
                            <Ban className="size-4 mr-2" />
                            Suspend
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleStatusToggle(student.id, 'active')}
                          >
                            <Check className="size-4 mr-2" />
                            Activate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleDelete(student.id)}
                          className="text-danger"
                        >
                          <Trash2 className="size-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <div className="mt-4">
            <Pagination
              page={studentsData.page}
              totalPages={studentsData.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <EmptyState
          title="No students found"
          description={
            filters.search || filters.status
              ? 'No students match your current filters.'
              : 'No students have registered yet.'
          }
          actionLabel={filters.search || filters.status ? 'Clear Filters' : undefined}
          onAction={filters.search || filters.status ? handleResetFilters : undefined}
        />
      )}

      {/* Student Details Modal */}
      <StudentDetailsModal
        student={studentDetails || null}
        isLoading={isLoadingDetails}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedStudent(null)
        }}
        onStatusChange={handleStatusToggle}
        onDelete={handleDelete}
      />
    </PageContainer>
  )
}
