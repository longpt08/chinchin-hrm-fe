import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Coffee, Phone, Hash, AlertCircle } from 'lucide-react'

import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/authStore'
import { loginEmployee } from '../api/authApi'

// ── Schema ────────────────────────────────────────────────────────────────────

const employeeLoginSchema = z.object({
  phone: z
    .string()
    .min(1, 'auth.validation.phoneRequired')
    .min(10, 'auth.validation.phoneMin'),
  pin: z
    .string()
    .min(1, 'auth.validation.pinRequired')
    .min(4, 'auth.validation.pinMin')
    .max(6, 'auth.validation.pinMax')
    .regex(/^\d+$/, 'auth.validation.pinNumeric'),
})

type EmployeeLoginFormValues = z.infer<typeof employeeLoginSchema>

// ── Component ─────────────────────────────────────────────────────────────────

export function EmployeeLogin() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeLoginFormValues>({
    resolver: zodResolver(employeeLoginSchema),
    defaultValues: { phone: '', pin: '' },
  })

  const onSubmit = async (values: EmployeeLoginFormValues) => {
    setServerError(null)
    try {
      const response = await loginEmployee(values)
      login(response.token, response.user)
      navigate('/employee/dashboard', { replace: true })
    } catch {
      setServerError(t('auth.loginError'))
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* ── Brand header ── */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-brand-secondary flex items-center justify-center shadow-medium mb-4">
            <Coffee className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-brand-textMain tracking-tight">
            ChinChin HRM
          </h1>
          <p className="text-sm text-brand-textMuted mt-1">
            {t('auth.employeeLogin')}
          </p>
        </div>

        {/* ── Login card ── */}
        <Card padding="lg">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
            {/* Server-side error banner */}
            {serverError && (
              <div className="flex items-center gap-2 rounded-sm bg-status-dangerBg border border-status-danger/30 px-4 py-3">
                <AlertCircle className="w-4 h-4 text-status-danger shrink-0" />
                <p className="text-sm text-status-danger">{serverError}</p>
              </div>
            )}

            {/* Phone field */}
            <Input
              type="tel"
              label={t('auth.phone')}
              placeholder="0901 234 567"
              autoComplete="tel"
              required
              leftAddon={<Phone className="w-4 h-4" />}
              error={errors.phone ? t(errors.phone.message as string) : undefined}
              {...register('phone')}
            />

            {/* PIN field */}
            <Input
              type="password"
              label={t('auth.pin')}
              placeholder="••••"
              autoComplete="current-password"
              inputMode="numeric"
              maxLength={6}
              required
              leftAddon={<Hash className="w-4 h-4" />}
              hint="4–6 digit PIN"
              error={errors.pin ? t(errors.pin.message as string) : undefined}
              {...register('pin')}
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full mt-1"
            >
              {isSubmitting ? t('common.loading') : t('auth.loginBtn')}
            </button>
          </form>
        </Card>

        {/* ── Switch to manager login ── */}
        <p className="text-center text-sm text-brand-textMuted mt-6">
          {t('auth.managerLogin')}{' '}
          <button
            type="button"
            onClick={() => navigate('/login/manager')}
            className="text-brand-secondary font-medium hover:text-brand-primary underline-offset-2 hover:underline transition-colors"
          >
            {t('auth.loginBtn')} →
          </button>
        </p>
      </div>
    </div>
  )
}
