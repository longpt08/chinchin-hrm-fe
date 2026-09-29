export interface CreateShiftTemplatePayload {
  name: string
  startTime: string
  endTime: string
  allowedLateMinutes: number
  isActive: boolean
}

export interface RegisterShiftPayload {
  userId: string
  shifts: Array<{
    date: string
    templateId?: string
    startTime: string
    endTime: string
  }>
}
