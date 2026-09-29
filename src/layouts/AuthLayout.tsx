import { Outlet } from 'react-router-dom'
import { LanguageSwitcher } from '@/components/ui'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4 relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      {/* Language switcher */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      {/* Auth form container */}
      <div className="relative z-10 w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  )
}
