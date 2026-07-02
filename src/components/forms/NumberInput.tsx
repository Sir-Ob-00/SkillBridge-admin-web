import { forwardRef, type InputHTMLAttributes } from 'react'
import { Input } from '@/components/ui/input'

export interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ ...props }, ref) => (
    <Input ref={ref} type="number" inputMode="numeric" {...props} />
  ),
)
NumberInput.displayName = 'NumberInput'
