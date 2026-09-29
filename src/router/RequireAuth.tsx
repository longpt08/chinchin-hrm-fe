import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import type { UserRole } from '@/types'

interface RequireAuthProps {
  allowedRole: UserRole
}

export function RequireAuth({ allowedRole }: RequireAuthProps) {
  const { isAuthenticated, role } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to={allowedRole === 'manager' ? '/login/manager' : '/login/employee'} replace />
  }

  if (role !== allowedRole) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
