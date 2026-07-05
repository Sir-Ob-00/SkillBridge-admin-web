import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { AdminFormValues, AdminRole } from '@/types/admin.types'

const adminFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['super_admin', 'admin', 'support_staff']),
  status: z.enum(['active', 'inactive']),
})

const ROLE_PERMISSION_MAP: Record<AdminRole, string[]> = {
  super_admin: [
    'Manage admins',
    'Change roles',
    'View audit logs',
    'Manage settings',
  ],
  admin: [
    'View administrators',
    'Manage platform content',
  ],
  support_staff: [
    'View and assist users',
    'Handle support workflows',
  ],
}

interface AdminFormProps {
  defaultValues?: AdminFormValues
  onSubmit: (data: z.infer<typeof adminFormSchema>) => void
  isLoading?: boolean
  readOnly?: boolean
}

export function AdminForm({ defaultValues, onSubmit, isLoading, readOnly = false }: AdminFormProps) {
  const {
    register,
    watch,
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

  const selectedRole = watch('role')
  const permissions = useMemo(() => ROLE_PERMISSION_MAP[selectedRole], [selectedRole])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" {...register('name')} placeholder="John Doe" disabled={readOnly} />
        {errors.name && <p className="text-sm text-danger">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register('email')} placeholder="admin@skillbridge.com" disabled={readOnly} />
        {errors.email && <p className="text-sm text-danger">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          {...register('role')}
          disabled={readOnly}
          className="w-full rounded-md border border-border bg-background px-3 py-2"
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
          disabled={readOnly}
          className="w-full rounded-md border border-border bg-background px-3 py-2"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {errors.status && <p className="text-sm text-danger">{errors.status.message}</p>}
      </div>

      <div className="space-y-2 pt-2">
        <Label>Role Permissions</Label>
        <div className="space-y-1 rounded-md bg-muted p-3 text-sm text-muted-foreground">
          {permissions.map((permission) => (
            <p key={permission}>• {permission}</p>
          ))}
        </div>
      </div>

      {!readOnly && (
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Admin'}
        </Button>
      )}
    </form>
  )
}

