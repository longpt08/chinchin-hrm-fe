// Employee feature – public API barrel export

// Types
export type {
  CreateEmployeePayload,
  UpdateEmployeePayload,
  EmployeeFilterStatus,
} from './types'

// API
export {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  fireEmployee,
  getRoles,
} from './api/employeeApi'

// Hooks
export {
  employeeKeys,
  useEmployees,
  useEmployee,
  useRoles,
  useCreateEmployee,
  useUpdateEmployee,
  useFireEmployee,
} from './hooks/useEmployees'

// Components
export { EmployeeCard } from './components/EmployeeCard'
export { EmployeeForm } from './components/EmployeeForm'
export { EmployeeList } from './components/EmployeeList'
