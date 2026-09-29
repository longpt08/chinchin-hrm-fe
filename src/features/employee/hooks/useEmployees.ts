import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  fireEmployee,
  getRoles,
} from '../api/employeeApi'
import type { CreateEmployeePayload, UpdateEmployeePayload } from '../types'

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

export const employeeKeys = {
  all: ['employees'] as const,
  list: () => [...employeeKeys.all, 'list'] as const,
  detail: (id: string) => [...employeeKeys.all, 'detail', id] as const,
  roles: () => ['roles'] as const,
}

// ---------------------------------------------------------------------------
// Query hooks
// ---------------------------------------------------------------------------

export function useEmployees() {
  return useQuery({
    queryKey: employeeKeys.list(),
    queryFn: getEmployees,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => getEmployee(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 2,
  })
}

export function useRoles() {
  return useQuery({
    queryKey: employeeKeys.roles(),
    queryFn: getRoles,
    staleTime: 1000 * 60 * 10, // 10 minutes – roles change rarely
  })
}

// ---------------------------------------------------------------------------
// Mutation hooks
// ---------------------------------------------------------------------------

export function useCreateEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) => createEmployee(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.list() })
    },
  })
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateEmployeePayload) => updateEmployee(payload),
    onSuccess: (updatedEmployee) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.list() })
      queryClient.setQueryData(employeeKeys.detail(updatedEmployee.id), updatedEmployee)
    },
  })
}

export function useFireEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => fireEmployee(id),
    onSuccess: (updatedEmployee) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.list() })
      queryClient.setQueryData(employeeKeys.detail(updatedEmployee.id), updatedEmployee)
    },
  })
}
