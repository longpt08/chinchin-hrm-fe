import axiosInstance from '@/lib/axios'
import type { User, Role, ApiResponse } from '@/types'
import type { CreateEmployeePayload, UpdateEmployeePayload } from '../types'

// ---------------------------------------------------------------------------
// Mock data – used while backend is not available
// ---------------------------------------------------------------------------

const mockRoles: Role[] = [
  { id: 'role-1', name: 'Barista' },
  { id: 'role-2', name: 'Cashier' },
  { id: 'role-3', name: 'Supervisor' },
  { id: 'role-4', name: 'Cleaner' },
]

const mockEmployees: User[] = [
  {
    id: 'emp-1',
    name: 'Nguyen Van An',
    phone: '0901234567',
    roleId: 'role-1',
    role: mockRoles[0],
    employmentType: 'Full-time',
    contractType: 'Official',
    onboardDate: '2024-01-15',
    baseSalary: 8000000,
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'emp-2',
    name: 'Tran Thi Bich',
    phone: '0912345678',
    roleId: 'role-2',
    role: mockRoles[1],
    employmentType: 'Part-time',
    contractType: 'Probation',
    onboardDate: '2024-06-01',
    baseSalary: 4500000,
    probationSalary: 3500000,
    isActive: true,
    createdAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'emp-3',
    name: 'Le Hoang Long',
    phone: '0923456789',
    roleId: 'role-3',
    role: mockRoles[2],
    employmentType: 'Full-time',
    contractType: 'Official',
    onboardDate: '2023-08-20',
    baseSalary: 12000000,
    isActive: false,
    createdAt: '2023-08-20T00:00:00Z',
  },
  {
    id: 'emp-4',
    name: 'Pham Thi Cam',
    phone: '0934567890',
    roleId: 'role-1',
    role: mockRoles[0],
    employmentType: 'Part-time',
    contractType: 'Official',
    onboardDate: '2024-03-10',
    baseSalary: 5000000,
    isActive: true,
    createdAt: '2024-03-10T00:00:00Z',
  },
]

let _employees = [...mockEmployees]
let _nextId = 5

function delay(ms = 400) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

export async function getEmployees(): Promise<User[]> {
  try {
    const { data } = await axiosInstance.get<ApiResponse<User[]>>('/api/users')
    return data.data
  } catch {
    // Fallback to mock data while backend is unavailable
    await delay()
    return [..._employees]
  }
}

export async function getEmployee(id: string): Promise<User> {
  try {
    const { data } = await axiosInstance.get<ApiResponse<User>>(`/api/users/${id}`)
    return data.data
  } catch {
    await delay()
    const employee = _employees.find((e) => e.id === id)
    if (!employee) throw new Error('Employee not found')
    return { ...employee }
  }
}

export async function createEmployee(payload: CreateEmployeePayload): Promise<User> {
  try {
    const { data } = await axiosInstance.post<ApiResponse<User>>('/api/users', payload)
    return data.data
  } catch {
    await delay()
    const role = mockRoles.find((r) => r.id === payload.roleId) ?? {
      id: payload.roleId,
      name: 'Unknown',
    }
    const newEmployee: User = {
      id: `emp-${_nextId++}`,
      ...payload,
      role,
      isActive: true,
      createdAt: new Date().toISOString(),
    }
    _employees = [..._employees, newEmployee]
    return { ...newEmployee }
  }
}

export async function updateEmployee({ id, ...payload }: UpdateEmployeePayload): Promise<User> {
  try {
    const { data } = await axiosInstance.put<ApiResponse<User>>(`/api/users/${id}`, payload)
    return data.data
  } catch {
    await delay()
    const index = _employees.findIndex((e) => e.id === id)
    if (index === -1) throw new Error('Employee not found')
    const role = payload.roleId
      ? (mockRoles.find((r) => r.id === payload.roleId) ?? _employees[index].role)
      : _employees[index].role
    const updated: User = { ..._employees[index], ...payload, role }
    _employees = _employees.map((e) => (e.id === id ? updated : e))
    return { ...updated }
  }
}

export async function fireEmployee(id: string): Promise<User> {
  try {
    const { data } = await axiosInstance.put<ApiResponse<User>>(`/api/users/${id}`, {
      isActive: false,
    })
    return data.data
  } catch {
    await delay()
    const index = _employees.findIndex((e) => e.id === id)
    if (index === -1) throw new Error('Employee not found')
    const updated: User = { ..._employees[index], isActive: false }
    _employees = _employees.map((e) => (e.id === id ? updated : e))
    return { ...updated }
  }
}

export async function getRoles(): Promise<Role[]> {
  try {
    const { data } = await axiosInstance.get<ApiResponse<Role[]>>('/api/roles')
    return data.data
  } catch {
    await delay()
    return [...mockRoles]
  }
}
