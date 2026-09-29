import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

type BadgeVariant = 'default' | 'success' | 'danger' | 'warning' | 'info'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-brand-border text-brand-textMuted',
  success: 'bg-status-successBg text-status-success',
  danger: 'bg-status-dangerBg text-status-danger',
  warning: 'bg-amber-50 text-amber-700',
  info: 'bg-blue-50 text-blue-700',
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          variantClasses[variant],
          className,
        ),
      )}
    >
      {children}
    </span>
  )
}
