import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/feedback/PageHeader'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { Pagination } from '@/components/common/Pagination'
import { ArtisanDetailsDrawer } from '@/components/artisans/ArtisanDetailsDrawer'
import { ArtisanFiltersBar } from './ArtisanFiltersBar'
import { ArtisanLoadingState } from './ArtisanLoadingState'
import { ArtisanMobileCards } from './ArtisanMobileCards'
import { ArtisanTable } from './ArtisanTable'
import { useArtisans } from '../hooks/useArtisans'
import { hasActiveArtisanFilters } from '../utils/artisanHelpers'

export function ArtisansPageContent() {
  const {
    filters,
    artisansData,
    isLoading,
    error,
    refetch,
    artisanDetails,
    isLoadingDetails,
    isDrawerOpen,
    closeDrawer,
    handleSearchChange,
    handleStatusFilterChange,
    handleVerificationFilterChange,
    handlePageChange,
    handleViewDetails,
    handleStatusToggle,
    handleVerify,
    handleDelete,
    handleResetFilters,
  } = useArtisans()

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Artisans" description="Manage verified and pending artisans" />
        <ErrorState
          title="Failed to load artisans"
          description="There was an error fetching the artisans list. Please try again."
          onRetry={() => refetch()}
        />
      </PageContainer>
    )
  }

  const artisans = artisansData?.data ?? []
  const meta = artisansData?.meta
  const hasFilters = hasActiveArtisanFilters(filters)

  return (
    <PageContainer>
      <PageHeader title="Artisans" description="Manage verified and pending artisans" />

      <ArtisanFiltersBar
        filters={filters}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusFilterChange}
        onVerificationChange={handleVerificationFilterChange}
        onReset={handleResetFilters}
      />

      {isLoading ? (
        <ArtisanLoadingState />
      ) : artisans.length > 0 ? (
        <>
          <div className="hidden md:block">
            <ArtisanTable
              artisans={artisans}
              onViewDetails={handleViewDetails}
              onStatusToggle={handleStatusToggle}
              onVerify={handleVerify}
              onDelete={handleDelete}
            />
          </div>

          <ArtisanMobileCards
            artisans={artisans}
            onViewDetails={handleViewDetails}
            onStatusToggle={handleStatusToggle}
            onVerify={handleVerify}
            onDelete={handleDelete}
          />

          {meta && (
            <div className="mt-4">
              <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No artisans found"
          description={hasFilters ? 'No artisans match your current filters.' : 'No artisans have registered yet.'}
          actionLabel={hasFilters ? 'Clear Filters' : undefined}
          onAction={hasFilters ? handleResetFilters : undefined}
        />
      )}

      <ArtisanDetailsDrawer
        artisan={artisanDetails || null}
        isLoading={isLoadingDetails}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        onStatusChange={handleStatusToggle}
        onVerify={handleVerify}
        onDelete={handleDelete}
      />
    </PageContainer>
  )
}
