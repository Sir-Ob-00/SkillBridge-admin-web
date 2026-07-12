import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerFooter,
  DrawerOverlay,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/StatusBadge'
import type { Skill } from '@/types/skill.types'

interface SkillDetailsDrawerProps {
  skill: Skill | null
  categoryName?: string
  isOpen: boolean
  onClose: () => void
  onEdit: (skill: Skill) => void
  onDelete: (id: string) => void
}

export function SkillDetailsDrawer({
  skill,
  categoryName,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: SkillDetailsDrawerProps) {
  if (!skill) return null

  return (
    <Drawer>
      <DrawerOverlay open={isOpen} onClose={onClose} />
      <DrawerContent open={isOpen}>
        <DrawerHeader>
          <DrawerTitle>Skill Details</DrawerTitle>
        </DrawerHeader>

        <DrawerBody>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{skill.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{categoryName ?? '—'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <StatusBadge
                status={skill.active ? 'active' : 'inactive'}
                variant={skill.active ? 'success' : 'secondary'}
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-medium">{new Date(skill.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ID</p>
              <p className="font-mono text-xs">{skill.id}</p>
            </div>
          </div>
        </DrawerBody>

        <DrawerFooter className="flex-col gap-3">
          <div className="flex gap-2 w-full">
            <Button
              variant="primary"
              onClick={() => onEdit(skill)}
              className="flex-1"
            >
              Edit Skill
            </Button>
            <Button
              variant="danger"
              onClick={() => onDelete(skill.id)}
              className="flex-1"
            >
              Delete Skill
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
