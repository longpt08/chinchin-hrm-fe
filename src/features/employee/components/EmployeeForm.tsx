import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import type { User } from '@/types'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useCreateEmployee, useUpdateEmployee, useRoles } from '../hooks/useEmployees'

// ---------------------------------------------------------------------------
// Zod schema
// ---------------------------------------------------------------------------

const employeeSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z
      .string()
      .min(9, 'Phone must be at least 9 digits')
      .max(15, 'Phone must be at most 15 digits')
      .regex(/^[0-9+\-\s]+$/, 'Invalid phone number'),
    roleId: z.string().min(1, 'Role is required'),
    employmentType: z.enum(['Full-time', 'Part-time']),
    contractType: z.enum(['Probation', 'Official']),
    onboardDate: z.string().min(1, 'Onboard date is required'),
    baseSalary: z.coerce.number().min(0, 'Salary must be positive'),
    probationSalary: z.coerce.number().min(0, 'Probation salary must be positive').optional(),
  })
  .superRefine((data, ctx) => {
    if (data.contractType === 'Probation' && !data.probationSalary) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Probation salary is required for probation contract',
        path: ['probationSalary'],
      })
    }
  })

type EmployeeFormValues = z.infer<typeof employeeSchema>

// ---------------------------------------------------------------------------
// Select field helper
// ---------------------------------------------------------------------------

interface SelectFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
  id: string
}

function SelectField({ label, error, required, children, id }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-brand-textMain">
        {label}
        {required && <span className="text-status-danger ml-1">*</span>}
      </label>
      <select
        id={id}
        className={`w-full rounded-sm border bg-white px-3 py-2.5 text-sm text-brand-textMain outline-none transition-all duration-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 ${
          error ? 'border-status-danger' : 'border-brand-border'
        }`}
      >
        {children}
      </select>
      {error && <p className="text-xs text-status-danger">{error}</p>}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface EmployeeFormProps {
  employee?: User
  onSuccess: () => void
  onCancel: () => void
}

export function EmployeeForm({ employee, onSuccess, onCancel }: EmployeeFormProps) {
  const { t } = useTranslation()
  const { data: roles = [], isLoading: rolesLoading } = useRoles()
  const createMutation = useCreateEmployee()
  const updateMutation = useUpdateEmployee()

  const isEditing = Boolean(employee)
  const isMutating = createMutation.isPending || updateMutation.isPending

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: employee?.name ?? '',
      phone: employee?.phone ?? '',
      roleId: employee?.roleId ?? '',
      employmentType: employee?.employmentType ?? 'Full-time',
      contractType: employee?.contractType ?? 'Official',
      onboardDate: employee?.onboardDate ?? '',
      baseSalary: employee?.baseSalary ?? 0,
      probationSalary: employee?.probationSalary,
    },
  })

  // Reset form whenever the employee prop changes
  useEffect(() => {
    reset({
      name: employee?.name ?? '',
      phone: employee?.phone ?? '',
      roleId: employee?.roleId ?? '',
      employmentType: employee?.employmentType ?? 'Full-time',
      contractType: employee?.contractType ?? 'Official',
      onboardDate: employee?.onboardDate ?? '',
      baseSalary: employee?.baseSalary ?? 0,
      probationSalary: employee?.probationSalary,
    })
  }, [employee, reset])

  const contractType = watch('contractType')

  const onSubmit = async (values: EmployeeFormValues) => {
    try {
      if (isEditing && employee) {
        await updateMutation.mutateAsync({ id: employee.id, ...values })
      } else {
        await createMutation.mutateAsync(values)
      }
      onSuccess()
    } catch {
      // Errors are surfaced via mutation state
    }
  }

  const mutationError = createMutation.error ?? updateMutation.error

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Name */}
      <Input
        label={t('employees.name')}
        required
        error={errors.name?.message}
        {...register('name')}
      />

      {/* Phone */}
      <Input
        label={t('employees.phone')}
        type="tel"
        required
        error={errors.phone?.message}
        {...register('phone')}
      />

      {/* Role */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="roleId" className="text-sm font-medium text-brand-textMain">
          {t('employees.role')}
          <span className="text-status-danger ml-1">*</span>
        </label>
        {rolesLoading ? (
          <div className="flex items-center gap-2 py-2">
            <LoadingSpinner size="sm" />
            <span className="text-sm text-brand-textMuted">{t('common.loading')}</span>
          </div>
        ) : (
          <Controller
            name="roleId"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id="roleId"
                className={`w-full rounded-sm border bg-white px-3 py-2.5 text-sm text-brand-textMain outline-none transition-all duration-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 ${
                  errors.roleId ? 'border-status-danger' : 'border-brand-border'
                }`}
              >
                <option value="">— {t('employees.role')} —</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            )}
          />
        )}
        {errors.roleId && (
          <p className="text-xs text-status-danger">{errors.roleId.message}</p>
        )}
      </div>

      {/* Employment Type */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="employmentType" className="text-sm font-medium text-brand-textMain">
          {t('employees.type')}
          <span className="text-status-danger ml-1">*</span>
        </label>
        <Controller
          name="employmentType"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              id="employmentType"
              className="w-full rounded-sm border border-brand-border bg-white px-3 py-2.5 text-sm text-brand-textMain outline-none transition-all duration-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
            >
              <option value="Full-time">{t('employees.fullTime')}</option>
              <option value="Part-time">{t('employees.partTime')}</option>
            </select>
          )}
        />
      </div>

      {/* Contract Type */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contractType" className="text-sm font-medium text-brand-textMain">
          {t('employees.contract')}
          <span className="text-status-danger ml-1">*</span>
        </label>
        <Controller
          name="contractType"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              id="contractType"
              className="w-full rounded-sm border border-brand-border bg-white px-3 py-2.5 text-sm text-brand-textMain outline-none transition-all duration-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
            >
              <option value="Official">{t('employees.official')}</option>
              <option value="Probation">{t('employees.probation')}</option>
            </select>
          )}
        />
      </div>

      {/* Onboard Date */}
      <Input
        label={t('employees.onboardDate')}
        type="date"
        required
        error={errors.onboardDate?.message}
        {...register('onboardDate')}
      />

      {/* Base Salary */}
      <Input
        label={t('employees.salary')}
        type="number"
        required
        min={0}
        step={100000}
        error={errors.baseSalary?.message}
        {...register('baseSalary')}
      />

      {/* Probation Salary – conditional */}
      {contractType === 'Probation' && (
        <Input
          label={`${t('employees.probation')} ${t('employees.salary')}`}
          type="number"
          required
          min={0}
          step={100000}
          error={errors.probationSalary?.message}
          {...register('probationSalary')}
        />
      )}

      {/* API Error */}
      {mutationError && (
        <p className="text-sm text-status-danger bg-status-dangerBg rounded-sm px-3 py-2">
          {(mutationError as Error).message ?? t('common.error')}
        </p>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isMutating}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" variant="primary" isLoading={isMutating}>
          {isEditing ? t('common.save') : t('employees.addEmployee')}
        </Button>
      </div>
    </form>
  )
}
