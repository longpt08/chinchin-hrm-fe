import type { User, Role } from '@/types'

// Re-export shared types for convenience
export type { User, Role }

export interface CreateEmployeePayload {
  name: string
  phone: string
  roleId: string
  employmentType: 'Full-time' | 'Part-time'
  contractType: 'Probation' | 'Official'
  onboardDate: string
  baseSalary: number
  probationSalary?: number
}

export interface UpdateEmployeePayload extends Partial<CreateEmployeePayload> {
  id: string
}

export type EmployeeFilterStatus = 'all' | 'active' | 'fired'
