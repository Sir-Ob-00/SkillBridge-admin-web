import { debounce } from 'lodash-es'
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getArtisans, getArtisanById, updateArtisanStatus, deleteArtisan } from '@/services/artisans.service'
import type { Artisan, ArtisanFilters, ArtisanStatus, VerificationStatus } from '@/types/artisan.types'

const defaultFilters: ArtisanFilters = {
  page: 1,
  limit: 10,
  search: '',
  status: undefined,
  verificationStatus: undefined,
  category: undefined,
}

export function useArtisans() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<ArtisanFilters>(defaultFilters)
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setFilters((prev) => ({ ...prev, search: value, page: 1 })), 400),
    [],
  )

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch])

  const artisansQuery = useQuery({
    queryKey: ['artisans', filters],
    queryFn: () => getArtisans(filters),
  })

  const artisanDetailsQuery = useQuery({
    queryKey: ['artisan-details', selectedArtisan?.id],
    queryFn: () => getArtisanById(selectedArtisan!.id),
    enabled: !!selectedArtisan && isDrawerOpen,
  })

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedArtisan(null)
  }

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'suspended' }) => updateArtisanStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artisans'] })
      toast.success('Artisan status updated successfully')
    },
    onError: () => toast.error('Failed to update artisan status'),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteArtisan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artisans'] })
      toast.success('Artisan deleted successfully')
    },
    onError: () => toast.error('Failed to delete artisan'),
  })

  const handleSearchChange = (value: string) => {
    debouncedSearch(value)
  }

  const handleStatusFilterChange = (status: ArtisanStatus | undefined) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }))
  }

  const handleVerificationFilterChange = (status: VerificationStatus | undefined) => {
    setFilters((prev) => ({ ...prev, verificationStatus: status, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const handleViewDetails = (artisan: Artisan) => {
    setSelectedArtisan(artisan)
    setIsDrawerOpen(true)
  }

  const handleStatusToggle = async (id: string, status: 'active' | 'suspended') => {
    await statusMutation.mutateAsync({ id, status })
    if (selectedArtisan?.id === id) {
      setSelectedArtisan((prev) => (prev ? { ...prev, status } : null))
    }
  }

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id)
    closeDrawer()
  }

  const handleResetFilters = () => {
    setFilters(defaultFilters)
  }

  return {
    filters,
    artisansData: artisansQuery.data,
    isLoading: artisansQuery.isLoading,
    error: artisansQuery.error,
    refetch: artisansQuery.refetch,
    artisanDetails: artisanDetailsQuery.data,
    isLoadingDetails: artisanDetailsQuery.isLoading,
    isDrawerOpen,
    closeDrawer,
    handleSearchChange,
    handleStatusFilterChange,
    handleVerificationFilterChange,
    handlePageChange,
    handleViewDetails,
    handleStatusToggle,
    handleDelete,
    handleResetFilters,
  }
}
