import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { forgotPassword } from '@/services/auth.service'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/forms/FormField'
import { EmailInput } from '@/components/forms/EmailInput'
import { APP_ROUTES } from '@/config/routes'
import type { AxiosError } from 'axios'
import type { ApiErrorResponse } from '@/types/api.types'

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { control, handleSubmit, formState: { isSubmitting } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true)
    try {
      const response = await forgotPassword(values)
      setIsSubmitted(true)
      toast.success(response.message || 'Reset link sent to your email.')
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>
      const message =
        axiosError.response?.data?.message ??
        'Unable to send reset link. Please try again.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="space-y-4 text-center">
        <h2 className="text-lg font-semibold">Check your email</h2>
        <p className="text-sm text-muted-foreground">
          If an account exists with that email, we&apos;ve sent password reset
          instructions.
        </p>
        <Link to={APP_ROUTES.LOGIN}>
          <Button variant="outline" className="mt-4 w-full">
            <ArrowLeft className="size-4" />
            Back to login
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Forgot password?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

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

        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading || isSubmitting}
        >
          Send reset link
        </Button>
      </form>

      <Link
        to={APP_ROUTES.LOGIN}
        className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
      >
        <ArrowLeft className="size-4" />
        Back to login
      </Link>
    </div>
  )
}
