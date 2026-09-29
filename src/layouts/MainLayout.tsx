import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  BookOpen,
  LogOut,
  Coffee,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { LanguageSwitcher } from '@/components/ui'

interface NavItem {
  to: string
  label: string
  icon: React.ReactNode
}

export function MainLayout() {
  const { t } = useTranslation()
  const { user, role, logout } = useAuthStore()
  const navigate = useNavigate()

  const managerNavItems: NavItem[] = [
    { to: '/manager/dashboard', label: t('nav.dashboard'), icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/manager/employees', label: t('nav.employees'), icon: <Users className="w-4 h-4" /> },
    { to: '/manager/shifts', label: t('nav.shifts'), icon: <Calendar className="w-4 h-4" /> },
    { to: '/manager/payroll', label: t('nav.payroll'), icon: <DollarSign className="w-4 h-4" /> },
    { to: '/manager/handbook', label: t('nav.handbook'), icon: <BookOpen className="w-4 h-4" /> },
  ]

  const employeeNavItems: NavItem[] = [
    { to: '/employee/dashboard', label: t('nav.dashboard'), icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/employee/schedule', label: t('nav.schedule'), icon: <Calendar className="w-4 h-4" /> },
    { to: '/employee/payslips', label: t('nav.payslips'), icon: <DollarSign className="w-4 h-4" /> },
    { to: '/employee/handbook', label: t('nav.handbook'), icon: <BookOpen className="w-4 h-4" /> },
  ]

  const navItems = role === 'manager' ? managerNavItems : employeeNavItems

  const handleLogout = () => {
    logout()
    navigate('/login/manager')
  }

  return (
    <div className="flex min-h-screen bg-brand-bg">
      {/* Sidebar */}
      <aside className="w-60 flex flex-col glass border-r border-brand-border fixed inset-y-0 left-0 z-30">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-brand-border">
          <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center">
            <Coffee className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-semibold text-brand-textMain text-sm">ChinChin</span>
            <p className="text-xs text-brand-textMuted">HRM</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-primary text-white'
                    : 'text-brand-textMuted hover:bg-brand-border hover:text-brand-textMain'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User area */}
        <div className="p-4 border-t border-brand-border">
          {user && (
            <div className="flex items-center gap-3 mb-3">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-brand-secondary flex items-center justify-center text-brand-textMain text-sm font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brand-textMain truncate">{user.name}</p>
                <p className="text-xs text-brand-textMuted capitalize">{user.role}</p>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <LanguageSwitcher />
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-brand-textMuted hover:bg-brand-border hover:text-status-danger transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              {t('nav.logout')}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-60 p-6">
        <Outlet />
      </main>
    </div>
  )
}
