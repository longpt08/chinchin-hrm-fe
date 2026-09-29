import { createBrowserRouter, Navigate } from 'react-router-dom'
import { KioskLayout } from '@/layouts/KioskLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { MainLayout } from '@/layouts/MainLayout'
import { RequireAuth } from './RequireAuth'

// Lazy imports for features
import { lazy, Suspense } from 'react'
import { PageLoader } from '@/components/ui'

const KioskView = lazy(() => import('@/features/attendance/components/KioskView').then(m => ({ default: m.KioskView })))
const ManagerLogin = lazy(() => import('@/features/auth/components/ManagerLogin').then(m => ({ default: m.ManagerLogin })))
const EmployeeLogin = lazy(() => import('@/features/auth/components/EmployeeLogin').then(m => ({ default: m.EmployeeLogin })))
const ManagerDashboard = lazy(() => import('@/features/dashboard/components/ManagerDashboard').then(m => ({ default: m.ManagerDashboard })))
const EmployeeDashboard = lazy(() => import('@/features/dashboard/components/EmployeeDashboard').then(m => ({ default: m.EmployeeDashboard })))
const EmployeeList = lazy(() => import('@/features/employee/components/EmployeeList').then(m => ({ default: m.EmployeeList })))
const ShiftManagement = lazy(() => import('@/features/shift/components/ShiftManagement').then(m => ({ default: m.ShiftManagement })))
const EmployeeSchedule = lazy(() => import('@/features/shift/components/EmployeeSchedule').then(m => ({ default: m.EmployeeSchedule })))
const PayrollPage = lazy(() => import('@/features/payroll/components/PayrollPage').then(m => ({ default: m.PayrollPage })))
const EmployeePayslips = lazy(() => import('@/features/payroll/components/EmployeePayslips').then(m => ({ default: m.EmployeePayslips })))
const HandbookCMS = lazy(() => import('@/features/handbook/components/HandbookCMS').then(m => ({ default: m.HandbookCMS })))
const EmployeeHandbook = lazy(() => import('@/features/handbook/components/EmployeeHandbook').then(m => ({ default: m.EmployeeHandbook })))

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

export const router = createBrowserRouter([
  // Root redirect
  {
    path: '/',
    element: <Navigate to="/kiosk" replace />,
  },

  // Kiosk
  {
    element: <KioskLayout />,
    children: [
      {
        path: '/kiosk',
        element: <SuspenseWrapper><KioskView /></SuspenseWrapper>,
      },
    ],
  },

  // Auth routes
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login/manager',
        element: <SuspenseWrapper><ManagerLogin /></SuspenseWrapper>,
      },
      {
        path: '/login/employee',
        element: <SuspenseWrapper><EmployeeLogin /></SuspenseWrapper>,
      },
    ],
  },

  // Manager routes (protected)
  {
    element: <RequireAuth allowedRole="manager" />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/manager',
            element: <Navigate to="/manager/dashboard" replace />,
          },
          {
            path: '/manager/dashboard',
            element: <SuspenseWrapper><ManagerDashboard /></SuspenseWrapper>,
          },
          {
            path: '/manager/employees',
            element: <SuspenseWrapper><EmployeeList /></SuspenseWrapper>,
          },
          {
            path: '/manager/shifts',
            element: <SuspenseWrapper><ShiftManagement /></SuspenseWrapper>,
          },
          {
            path: '/manager/payroll',
            element: <SuspenseWrapper><PayrollPage /></SuspenseWrapper>,
          },
          {
            path: '/manager/handbook',
            element: <SuspenseWrapper><HandbookCMS /></SuspenseWrapper>,
          },
        ],
      },
    ],
  },

  // Employee routes (protected)
  {
    element: <RequireAuth allowedRole="employee" />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/employee',
            element: <Navigate to="/employee/dashboard" replace />,
          },
          {
            path: '/employee/dashboard',
            element: <SuspenseWrapper><EmployeeDashboard /></SuspenseWrapper>,
          },
          {
            path: '/employee/schedule',
            element: <SuspenseWrapper><EmployeeSchedule /></SuspenseWrapper>,
          },
          {
            path: '/employee/payslips',
            element: <SuspenseWrapper><EmployeePayslips /></SuspenseWrapper>,
          },
          {
            path: '/employee/handbook',
            element: <SuspenseWrapper><EmployeeHandbook /></SuspenseWrapper>,
          },
        ],
      },
    ],
  },

  // 404
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
