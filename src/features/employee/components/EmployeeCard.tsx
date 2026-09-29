import { useTranslation } from 'react-i18next'
import { Pencil, UserX, Phone, CalendarDays, Banknote } from 'lucide-react'
import { clsx } from 'clsx'
import type { User } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface EmployeeCardProps {
  employee: User
  onEdit: (employee: User) => void
  onFire: (employee: User) => void
}

function EmployeeAvatar({ employee }: { employee: User }) {
  const initials = employee.name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  if (employee.avatarUrl) {
    return (
      <img
        src={employee.avatarUrl}
        alt={employee.name}
        className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-border"
      />
    )
  }

  return (
    <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center ring-2 ring-brand-border">
      <span className="text-white text-sm font-semibold">{initials}</span>
    </div>
  )
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateStr))
}

export function EmployeeCard({ employee, onEdit, onFire }: EmployeeCardProps) {
  const { t } = useTranslation()

  const employmentBadgeVariant = employee.employmentType === 'Full-time' ? 'info' : 'warning'
  const contractBadgeVariant = employee.contractType === 'Official' ? 'success' : 'warning'

  return (
    <div
      className={clsx(
        'glass rounded-md shadow-soft p-5 flex flex-col gap-4 transition-all duration-200',
        !employee.isActive && 'opacity-60',
      )}
    >
      {/* Header: avatar + name + status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <EmployeeAvatar employee={employee} />
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-brand-textMain truncate">{employee.name}</h3>
            <p className="text-xs text-brand-textMuted truncate">{employee.role?.name ?? '—'}</p>
          </div>
        </div>

        {/* Active / Fired badge */}
        <Badge variant={employee.isActive ? 'success' : 'danger'} className="shrink-0">
          {employee.isActive ? t('employees.active') : t('employees.fired')}
        </Badge>
      </div>

      {/* Type badges */}
      <div className="flex flex-wrap gap-1.5">
        <Badge variant={employmentBadgeVariant}>
          {employee.employmentType === 'Full-time'
            ? t('employees.fullTime')
            : t('employees.partTime')}
        </Badge>
        <Badge variant={contractBadgeVariant}>
          {employee.contractType === 'Official'
            ? t('employees.official')
            : t('employees.probation')}
        </Badge>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-xs text-brand-textMuted">
          <Phone className="w-3.5 h-3.5 shrink-0" />
          <span>{employee.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-brand-textMuted">
          <CalendarDays className="w-3.5 h-3.5 shrink-0" />
          <span>{formatDate(employee.onboardDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-brand-textMuted">
          <Banknote className="w-3.5 h-3.5 shrink-0" />
          <span>{formatCurrency(employee.baseSalary)}</span>
        </div>
      </div>

      {/* Actions – only visible for active employees */}
      {employee.isActive && (
        <div className="flex items-center gap-2 pt-1 border-t border-brand-border">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Pencil className="w-3.5 h-3.5" />}
            onClick={() => onEdit(employee)}
            className="flex-1 justify-center"
          >
            {t('common.edit')}
          </Button>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<UserX className="w-3.5 h-3.5" />}
            onClick={() => onFire(employee)}
            className="flex-1 justify-center"
          >
            {t('employees.fireEmployee')}
          </Button>
        </div>
      )}
    </div>
  )
}
