import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  onClick?: () => void
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({ children, className, padding = 'md', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        clsx(
          'glass rounded-md shadow-soft',
          paddingClasses[padding],
          onClick && 'cursor-pointer hover:shadow-medium transition-shadow duration-200',
          className,
        ),
      )}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-base font-semibold text-brand-textMain">{title}</h3>
        {subtitle && (
          <p className="text-sm text-brand-textMuted mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
