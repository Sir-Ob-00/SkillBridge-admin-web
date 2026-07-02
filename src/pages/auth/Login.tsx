import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/forms/FormField'
import { EmailInput } from '@/components/forms/EmailInput'
import { PasswordInput } from '@/components/forms/PasswordInput'
import { APP_ROUTES } from '@/config/routes'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/auth.store'
import type { AxiosError } from 'axios'
import type { ApiErrorResponse } from '@/types/api.types'
import { ROLES } from '@/constants/roles'
import { PERMISSIONS } from '@/constants/permissions'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const { login } = useAuth()
  const { setAuth } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true)
    try {
      await login(values)
      toast.success('Welcome back!')
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>
      const message =
        axiosError.response?.data?.message ??
        'Invalid credentials. Please try again.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDummyLogin = () => {
    const dummyAdmin = {
      id: 'dummy-admin-1',
      email: 'admin@skillbridge.com',
      firstName: 'Admin',
      lastName: 'User',
      avatar: null,
      roles: [ROLES.SUPER_ADMIN],
      permissions: Object.values(PERMISSIONS),
    }
    setAuth('dummy-token-12345', dummyAdmin)
    toast.success('Dummy login successful!')
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(onSubmit)(e)}
      className="space-y-4"
      noValidate
    >
      <FormField control={control} name="email" label="Email address" required>
        {(field) => (
          <EmailInput
            id="email"
            placeholder="admin@skillbridge.com"
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            error={field.error}
          />
        )}
      </FormField>

      <FormField control={control} name="password" label="Password" required>
        {(field) => (
          <PasswordInput
            id="password"
            placeholder="Enter your password"
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            error={field.error}
          />
        )}
      </FormField>

      <div className="flex items-center justify-end">
        <Link
          to={APP_ROUTES.FORGOT_PASSWORD}
          className="text-sm text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading || isSubmitting}
      >
        Sign in
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleDummyLogin}
      >
        Dummy Login (Dev Only)
      </Button>
    </form>
  )
}
