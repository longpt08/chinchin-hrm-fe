import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  fullScreen?: boolean
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}

export function LoadingSpinner({ size = 'md', className, fullScreen }: LoadingSpinnerProps) {
  const spinner = (
    <Loader2
      className={clsx(
        'animate-spin text-brand-primary',
        sizeClasses[size],
        className,
      )}
    />
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-brand-bg/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    )
  }

  return spinner
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <LoadingSpinner size="lg" />
    </div>
  )
}
