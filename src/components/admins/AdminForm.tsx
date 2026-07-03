import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { AdminRole, AdminStatus } from '@/types/admin.types'

const adminFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['super_admin', 'admin', 'support_staff']),
  status: z.enum(['active', 'inactive']),
})

interface AdminFormProps {
  defaultValues?: {
    name: string
    email: string
    role: AdminRole
    status: AdminStatus
  }
  onSubmit: (data: z.infer<typeof adminFormSchema>) => void
  isLoading?: boolean
}

export function AdminForm({ defaultValues, onSubmit, isLoading }: AdminFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof adminFormSchema>>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: defaultValues || {
      name: '',
      email: '',
      role: 'admin',
      status: 'active',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" {...register('name')} placeholder="John Doe" />
        {errors.name && <p className="text-sm text-danger">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register('email')} placeholder="admin@skillbridge.com" />
        {errors.email && <p className="text-sm text-danger">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          {...register('role')}
          className="w-full px-3 py-2 border border-border rounded-md bg-background"
        >
          <option value="super_admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="support_staff">Support Staff</option>
        </select>
        {errors.role && <p className="text-sm text-danger">{errors.role.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          {...register('status')}
          className="w-full px-3 py-2 border border-border rounded-md bg-background"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {errors.status && <p className="text-sm text-danger">{errors.status.message}</p>}
      </div>

      <div className="space-y-2 pt-4">
        <Label>Permissions</Label>
        <div className="text-sm text-muted-foreground space-y-1 p-3 bg-muted rounded-md">
          <p>• Super Admin: Full system access, can manage other admins</p>
          <p>• Admin: Full platform access, cannot manage other admins</p>
          <p>• Support Staff: Limited access for support tasks</p>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Admin'}
      </Button>
    </form>
  )
}
