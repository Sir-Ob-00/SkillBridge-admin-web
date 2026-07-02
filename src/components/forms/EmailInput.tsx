import { forwardRef, type InputHTMLAttributes } from 'react'
import { Input } from '@/components/ui/input'

export interface EmailInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean
}

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  ({ ...props }, ref) => (
    <Input
      ref={ref}
      type="email"
      autoComplete="email"
      inputMode="email"
      {...props}
    />
  ),
)
EmailInput.displayName = 'EmailInput'
