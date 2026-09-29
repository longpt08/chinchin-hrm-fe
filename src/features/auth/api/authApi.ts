import { axiosInstance } from '@/lib/axios'
import type { LoginResponse } from '@/types'
import type { LoginManagerPayload, LoginEmployeePayload } from '../types'

/**
 * Authenticates a manager with phone + password credentials.
 */
export async function loginManager(
  payload: LoginManagerPayload,
): Promise<LoginResponse> {
  const { data } = await axiosInstance.post<LoginResponse>('/api/auth/login', {
    ...payload,
    role: 'manager',
  })
  return data
}

/**
 * Authenticates an employee with phone + PIN credentials.
 */
export async function loginEmployee(
  payload: LoginEmployeePayload,
): Promise<LoginResponse> {
  const { data } = await axiosInstance.post<LoginResponse>('/api/auth/login', {
    ...payload,
    role: 'employee',
  })
  return data
}
