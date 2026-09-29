import { Outlet } from 'react-router-dom'
import { LanguageSwitcher } from '@/components/ui'

export function KioskLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-bg via-brand-bg to-brand-secondary/20 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-secondary/20 rounded-full blur-3xl" />

      {/* Language switcher */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>

      {/* Kiosk content */}
      <div className="relative z-10 min-h-screen">
        <Outlet />
      </div>
    </div>
  )
}
