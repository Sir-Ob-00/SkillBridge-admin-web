import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface CategoryIconPickerProps {
  selectedIcon?: string
  onSelect: (icon: string) => void
}

export function CategoryIconPicker({
  selectedIcon,
  onSelect,
}: CategoryIconPickerProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="icon">Icon Name (Lucide icon)</Label>
      <Input
        id="icon"
        placeholder="e.g., wrench, hammer, drill"
        value={selectedIcon || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSelect(e.target.value)}
      />
      <p className="text-xs text-muted-foreground">
        Enter a Lucide icon name. Visit lucide.dev/icons for available options.
      </p>
    </div>
  )
}
