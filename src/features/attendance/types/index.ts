export interface ClockInPayload {
  userId: string;
  photo?: string; // base64
}

export interface ClockOutPayload {
  userId: string;
  photo?: string;
}

export interface TimeLog {
  id: string;
  userId: string;
  clockInTime: string;
  clockOutTime?: string;
  clockInPhoto?: string;
  clockOutPhoto?: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EARLY_LEAVE';
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  status?: string;
}
