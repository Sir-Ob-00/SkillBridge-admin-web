import {
  type Control,
  type FieldPath,
  type FieldValues,
  Controller,
} from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  description?: string
  required?: boolean
  children: (field: {
    value: string
    onChange: (value: string) => void
    onBlur: () => void
    name: string
    error?: boolean
  }) => React.ReactNode
  className?: string
}

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  required,
  children,
  className,
}: FormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={cn('space-y-2', className)}>
          <Label htmlFor={name}>
            {label}
            {required && (
              <span className="ml-1 text-danger" aria-hidden="true">
                *
              </span>
            )}
          </Label>
          {children({
            value: field.value ?? '',
            onChange: field.onChange,
            onBlur: field.onBlur,
            name: field.name,
            error: !!fieldState.error,
          })}
          {fieldState.error && (
            <p className="text-sm text-danger" role="alert">
              {fieldState.error.message}
            </p>
          )}
          {description && !fieldState.error && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
    />
  )
}
