import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Coffee, Phone, Lock, AlertCircle } from 'lucide-react'

import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { loginManager } from '../api/authApi'

// ── Schema ────────────────────────────────────────────────────────────────────

const managerLoginSchema = z.object({
  phone: z
    .string()
    .min(1, 'auth.validation.phoneRequired')
    .min(10, 'auth.validation.phoneMin'),
  password: z
    .string()
    .min(1, 'auth.validation.passwordRequired')
    .min(6, 'auth.validation.passwordMin'),
})

type ManagerLoginFormValues = z.infer<typeof managerLoginSchema>

// ── Component ─────────────────────────────────────────────────────────────────

export function ManagerLogin() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ManagerLoginFormValues>({
    resolver: zodResolver(managerLoginSchema),
    defaultValues: { phone: '', password: '' },
  })

  const onSubmit = async (values: ManagerLoginFormValues) => {
    setServerError(null)
    try {
      const response = await loginManager(values)
      login(response.token, response.user)
      navigate('/manager/dashboard', { replace: true })
    } catch {
      setServerError(t('auth.loginError'))
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* ── Brand header ── */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center shadow-medium mb-4">
            <Coffee className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-brand-textMain tracking-tight">
            ChinChin HRM
          </h1>
          <p className="text-sm text-brand-textMuted mt-1">
            {t('auth.managerLogin')}
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

            {/* Password field */}
            <Input
              type="password"
              label={t('auth.password')}
              placeholder="••••••"
              autoComplete="current-password"
              required
              leftAddon={<Lock className="w-4 h-4" />}
              error={errors.password ? t(errors.password.message as string) : undefined}
              {...register('password')}
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

        {/* ── Switch to employee login ── */}
        <p className="text-center text-sm text-brand-textMuted mt-6">
          {t('auth.employeeLogin')}{' '}
          <button
            type="button"
            onClick={() => navigate('/login/employee')}
            className="text-brand-secondary font-medium hover:text-brand-primary underline-offset-2 hover:underline transition-colors"
          >
            {t('auth.loginBtn')} →
          </button>
        </p>
      </div>
    </div>
  )
}
