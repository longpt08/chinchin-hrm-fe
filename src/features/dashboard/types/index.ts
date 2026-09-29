export interface DashboardStats {
  totalEmployees: number
  activeToday: number
  currentlyWorking: number
  pendingShiftApprovals: number
}

export interface EmployeeWorkStatus {
  userId: string
  userName: string
  avatarUrl?: string
  lastClockIn?: string
  lastClockOut?: string
  isWorking: boolean
  hoursToday: number
}
