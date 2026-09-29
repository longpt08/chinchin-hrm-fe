import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Search, Users } from 'lucide-react'
import { clsx } from 'clsx'
import type { User } from '@/types'
import type { EmployeeFilterStatus } from '../types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useEmployees, useFireEmployee } from '../hooks/useEmployees'
import { EmployeeCard } from './EmployeeCard'
import { EmployeeForm } from './EmployeeForm'

// ---------------------------------------------------------------------------
// Skeleton card for loading state
// ---------------------------------------------------------------------------

function SkeletonCard() {
  return (
    <div className="glass rounded-md shadow-soft p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-brand-border" />
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="h-3 w-32 bg-brand-border rounded-full" />
          <div className="h-3 w-20 bg-brand-border rounded-full" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-16 bg-brand-border rounded-full" />
        <div className="h-5 w-16 bg-brand-border rounded-full" />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="h-3 w-28 bg-brand-border rounded-full" />
        <div className="h-3 w-24 bg-brand-border rounded-full" />
        <div className="h-3 w-20 bg-brand-border rounded-full" />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Filter tab bar
// ---------------------------------------------------------------------------

interface FilterTabsProps {
  active: EmployeeFilterStatus
  onChange: (status: EmployeeFilterStatus) => void
  counts: Record<EmployeeFilterStatus, number>
}

function FilterTabs({ active, onChange, counts }: FilterTabsProps) {
  const { t } = useTranslation()

  const tabs: { key: EmployeeFilterStatus; label: string }[] = [
    { key: 'all', label: t('common.all') },
    { key: 'active', label: t('employees.active') },
    { key: 'fired', label: t('employees.fired') },
  ]

  return (
    <div className="flex gap-1 bg-brand-border/40 rounded-full p-1 w-fit">
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={clsx(
            'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
            active === key
              ? 'bg-white text-brand-primary shadow-soft'
              : 'text-brand-textMuted hover:text-brand-textMain',
          )}
        >
          {label}
          <span
            className={clsx(
              'ml-1.5 text-xs',
              active === key ? 'text-brand-primary' : 'text-brand-textMuted',
            )}
          >
            ({counts[key]})
          </span>
        </button>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Confirm Fire Dialog
// ---------------------------------------------------------------------------

interface ConfirmFireDialogProps {
  employee: User | null
  isLoading: boolean
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmFireDialog({
  employee,
  isLoading,
  onConfirm,
  onCancel,
}: ConfirmFireDialogProps) {
  const { t } = useTranslation()

  return (
    <Modal
      isOpen={Boolean(employee)}
      onClose={onCancel}
      title={t('employees.fireEmployee')}
      size="sm"
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-brand-textMuted">
          {t('employees.confirmFire')}
        </p>
        {employee && (
          <div className="bg-brand-bg rounded-sm px-4 py-3">
            <p className="text-sm font-semibold text-brand-textMain">{employee.name}</p>
            <p className="text-xs text-brand-textMuted">{employee.role?.name}</p>
          </div>
        )}
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
            {t('employees.fireEmployee')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export function EmployeeList() {
  const { t } = useTranslation()
  const { data: employees = [], isLoading, error } = useEmployees()
  const fireMutation = useFireEmployee()

  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<EmployeeFilterStatus>('all')
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<User | undefined>(undefined)
  const [firingEmployee, setFiringEmployee] = useState<User | null>(null)

  // ---------------------------------------------------------------------------
  // Derived state
  // ---------------------------------------------------------------------------

  const filtered = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && emp.isActive) ||
        (filterStatus === 'fired' && !emp.isActive)
      return matchesSearch && matchesStatus
    })
  }, [employees, searchQuery, filterStatus])

  const counts = useMemo<Record<EmployeeFilterStatus, number>>(() => {
    const active = employees.filter((e) => e.isActive).length
    const fired = employees.filter((e) => !e.isActive).length
    return { all: employees.length, active, fired }
  }, [employees])

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  function handleAddEmployee() {
    setEditingEmployee(undefined)
    setIsFormModalOpen(true)
  }

  function handleEditEmployee(employee: User) {
    setEditingEmployee(employee)
    setIsFormModalOpen(true)
  }

  function handleFormSuccess() {
    setIsFormModalOpen(false)
    setEditingEmployee(undefined)
  }

  function handleFormCancel() {
    setIsFormModalOpen(false)
    setEditingEmployee(undefined)
  }

  function handleFireEmployee(employee: User) {
    setFiringEmployee(employee)
  }

  function handleConfirmFire() {
    if (!firingEmployee) return
    fireMutation.mutate(firingEmployee.id, {
      onSuccess: () => setFiringEmployee(null),
    })
  }

  function handleCancelFire() {
    setFiringEmployee(null)
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-textMain">{t('employees.title')}</h1>
          <p className="text-sm text-brand-textMuted mt-0.5">
            {counts.all} {t('employees.title').toLowerCase()}
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleAddEmployee}
        >
          {t('employees.addEmployee')}
        </Button>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="w-full sm:w-72">
          <Input
            placeholder={`${t('common.search')} ${t('employees.title').toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftAddon={<Search className="w-4 h-4" />}
          />
        </div>
        <FilterTabs active={filterStatus} onChange={setFilterStatus} counts={counts} />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-status-danger">{t('common.error')}</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="w-8 h-8 text-brand-textMuted" />}
          title={t('common.noData')}
          description={
            searchQuery
              ? `No employees match "${searchQuery}"`
              : filterStatus !== 'all'
                ? `No ${filterStatus} employees`
                : undefined
          }
          action={
            !searchQuery && filterStatus === 'all' ? (
              <Button
                variant="primary"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={handleAddEmployee}
              >
                {t('employees.addEmployee')}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onEdit={handleEditEmployee}
              onFire={handleFireEmployee}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleFormCancel}
        title={editingEmployee ? t('common.edit') : t('employees.addEmployee')}
        size="lg"
      >
        <EmployeeForm
          employee={editingEmployee}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </Modal>

      {/* Fire Confirmation Dialog */}
      <ConfirmFireDialog
        employee={firingEmployee}
        isLoading={fireMutation.isPending}
        onConfirm={handleConfirmFire}
        onCancel={handleCancelFire}
      />
    </div>
  )
}
