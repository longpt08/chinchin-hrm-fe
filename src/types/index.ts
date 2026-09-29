// Global type definitions for ChinChin HRM

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// User/Employee types
export type EmploymentType = 'Full-time' | 'Part-time'
export type ContractType = 'Probation' | 'Official'
export type UserRole = 'manager' | 'employee'

export interface Role {
  id: string
  name: string
}

export interface SalaryHistoryEntry {
  date: string
  baseSalary: number
  note?: string
}

export interface User {
  id: string
  name: string
  phone: string
  roleId: string
  role: Role
  employmentType: EmploymentType
  contractType: ContractType
  onboardDate: string
  probationEndDate?: string
  officialContractDate?: string
  avatarUrl?: string
  baseSalary: number
  probationSalary?: number
  salaryHistory?: SalaryHistoryEntry[]
  isActive: boolean
  createdAt: string
}

// Auth types
export interface AuthUser {
  id: string
  name: string
  phone: string
  role: UserRole
  avatarUrl?: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

// Time log types
export type TimeLogType = 'IN' | 'OUT'

export interface TimeLog {
  id: string
  userId: string
  logType: TimeLogType
  timestamp: string
  photoUrl?: string
  user?: Pick<User, 'id' | 'name' | 'avatarUrl'>
}

// Shift types
export type ShiftStatus = 'registered' | 'published'

export interface ShiftTemplate {
  id: string
  name: string
  startTime: string
  endTime: string
  allowedLateMinutes: number
  isActive: boolean
  order?: number
}

export interface Shift {
  id: string
  userId: string
  templateId?: string
  date: string
  startTime: string
  endTime: string
  status: ShiftStatus
  user?: Pick<User, 'id' | 'name' | 'avatarUrl'>
  template?: ShiftTemplate
}

export interface ShiftRequirement {
  templateId: string
  [dayOfWeek: string]: number | string
}

export interface ScheduleRequest {
  id: string
  userId: string
  weekStart: string
  requestedShifts: Omit<Shift, 'id' | 'userId' | 'status'>[]
}

// Salary/Payroll types
export type AdjustmentType = 'allowance' | 'punishment' | 'advance'

export interface SalaryAdjustment {
  id: string
  userId: string
  type: AdjustmentType
  amount: number
  date: string
  description: string
}

export interface PunishmentTemplate {
  id: string
  name: string
  amount: number
  addToFund: boolean
}

export interface Payslip {
  id: string
  userId: string
  month: number
  year: number
  baseSalary: number
  totalHours: number
  allowances: number
  punishments: number
  advances: number
  finalTotal: number
  status: string
  user?: Pick<User, 'id' | 'name'>
}

export interface FundLog {
  id: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  createdAt: string
}

// Handbook types
export interface HandbookArticle {
  id: string
  title: string
  category: string
  content: string
  targetRoles: string[]
  status: 'draft' | 'published'
  acknowledgedBy: string[]
  createdAt: string
  updatedAt: string
}
