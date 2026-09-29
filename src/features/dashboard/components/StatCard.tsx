import React, { ReactNode } from 'react'
import { clsx } from 'clsx'
import { Card } from '@/components/ui/Card'

export interface StatCardProps {
  icon: ReactNode
  title: string
  value: number | string
  subtitle?: string
  color?: 'primary' | 'success' | 'danger' | 'warning'
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  color = 'primary',
}) => {
  const colorStyles = {
    primary: 'bg-brand-primary text-white',
    success: 'bg-status-successBg text-status-success',
    danger: 'bg-status-dangerBg text-status-danger',
    warning: 'bg-amber-100 text-amber-500',
  }

  return (
    <Card className="flex items-center p-6 gap-4">
      <div
        className={clsx(
          'flex items-center justify-center w-12 h-12 rounded-lg shrink-0',
          colorStyles[color]
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-brand-textMuted font-medium truncate">{title}</p>
        <h3 className="text-2xl font-bold text-brand-textMain truncate">{value}</h3>
        {subtitle && (
          <p className="text-xs text-brand-textMuted mt-1 truncate">{subtitle}</p>
        )}
      </div>
    </Card>
  )
}
