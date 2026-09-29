import { forwardRef } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftAddon?: React.ReactNode
  rightAddon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftAddon, rightAddon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-brand-textMain"
          >
            {label}
            {props.required && <span className="text-status-danger ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <div className="absolute left-3 text-brand-textMuted">{leftAddon}</div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={twMerge(
              clsx(
                'w-full rounded-sm border border-brand-border bg-white px-3 py-2.5 text-sm text-brand-textMain placeholder:text-brand-textMuted',
                'outline-none transition-all duration-200',
                'focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20',
                'disabled:bg-brand-bg disabled:cursor-not-allowed disabled:opacity-70',
                error && 'border-status-danger focus:border-status-danger focus:ring-status-danger/20',
                leftAddon && 'pl-10',
                rightAddon && 'pr-10',
                className,
              ),
            )}
            {...props}
          />
          {rightAddon && (
            <div className="absolute right-3 text-brand-textMuted">{rightAddon}</div>
          )}
        </div>
        {error && (
          <p className="text-xs text-status-danger">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-brand-textMuted">{hint}</p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
