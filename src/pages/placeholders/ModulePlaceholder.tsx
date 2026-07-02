import { Construction } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/feedback/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { navItems } from '@/components/layout/Sidebar'

interface ModulePlaceholderProps {
  title?: string
  description?: string
}

export default function ModulePlaceholder({
  title,
  description,
}: ModulePlaceholderProps) {
  const location = useLocation()
  const navItem = navItems.find((item) => item.href === location.pathname)

  const moduleTitle = title ?? navItem?.label ?? 'Module'
  const moduleDescription =
    description ??
    `The ${moduleTitle} module is coming soon. This placeholder page will be replaced with full functionality in a future phase.`

  return (
    <PageContainer>
      <PageHeader
        title={moduleTitle}
        description={`Manage ${moduleTitle.toLowerCase()} from this section.`}
      />
      <EmptyState
        title={`${moduleTitle} — Coming Soon`}
        description={moduleDescription}
        icon={<Construction className="size-8" aria-hidden="true" />}
      />
    </PageContainer>
  )
}
