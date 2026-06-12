/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TaskGroup = 'THUE' | 'KE_TOAN' | 'BAO_HIEM' | 'LAO_DONG' | 'THONG_KE' | 'NOI_BO';

export type RecurrenceType = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

export interface Employee {
  id: string;
  name: string;
  role: string;
  phone?: string;
  email?: string;
  status: 'ACTIVE' | 'INACTIVE';
  leaves?: { id: string; startDate: string; endDate: string; reason: string; approved: boolean }[];
  lateLogs?: { id: string; date: string; minutes: number; reason: string }[];
  handoverNotes?: string;
  substituteEmployeeId?: string; // Người thay thế
}

export interface Task {
  id: string;
  title: string;
  group: TaskGroup;
  notes?: string;
  startDate: string; // YYYY-MM-DD
  dueDate: string;   // YYYY-MM-DD
  completed: boolean;
  completedAt?: string;
  recurrence: RecurrenceType;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  alertDays: number[]; // e.g., [30, 15, 7, 3, 1, 0]
  customAlertTime?: string; // HH:mm
  isVirtual?: boolean;
  assignedTo?: string; // ID of Employee
  kanbanStatus?: 'TODO' | 'DOING' | 'PENDING' | 'DONE';
  attachments?: { id: string; name: string; size: string; date: string }[];
  comments?: { id: string; author: string; text: string; date: string }[];
  client?: string; // Khách hàng
  destination?: string; // Địa điểm cho lịch tuần/tháng/năm
  timeSlot?: string; // Thời gian cụ thể (Ví dụ: 08:30)
  deadlineType?: 'KHACH_HANG' | 'HO_SO_THUE' | 'BHXH' | 'LAO_DONG' | 'PHAP_LY';
}

export type SystemUserRole = 'ADMIN' | 'MANAGER' | 'TEAM_LEADER' | 'STAFF' | 'CLIENT';

export type ClientType = 'ENTERPRISE' | 'HOUSEHOLD' | 'INDIVIDUAL';

export interface Client {
  id: string;
  name: string;
  type: ClientType;
  taxCode: string;
  representative?: string;
  phone?: string;
  email?: string;
  address?: string;
  industry?: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  dispatchedAt: string;
  read: boolean;
}

export interface AccountingRecord {
  id: string;
  clientId: string;
  period: string;
  bctcStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  bookkeepingStatus: 'ALIGNED' | 'UNALIGNED';
  documentCount: number;
  doubleEntriesCount: number;
  unalignedIssues?: string;
}

export interface LaborRecord {
  id: string;
  clientId: string;
  totalEmployees: number;
  activeContracts: number;
  bhxhRegistered: number;
  bhxhPaidStatus: 'COMPLETED' | 'PENDING' | 'OVERDUE' | 'PAID';
  notes?: string;
}

export type FilingType = 
  | 'GTGT_MONTH' 
  | 'GTGT_QUARTER' 
  | 'TNCN_MONTH' 
  | 'TNCN_QUARTER' 
  | 'TNDN_TEMP' 
  | 'INVOICE_REPORT' 
  | 'YEAR_SETTLEMENT' 
  | 'BCTC_YEAR';

export interface TaxFiling {
  id: string;
  clientId: string;
  type: FilingType;
  period: string;
  status: 'PENDING' | 'PREPARING' | 'SUBMITTED' | 'APPROVED' | 'OVERDUE';
  dueDate: string;
  amount?: number;
  notes?: string;
  handlerId?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  sqlStatement?: string; // SQL statement simulated for transparency
  userName?: string;
  userRole?: string;
  ipAddress?: string;
}

export interface BackupMetadata {
  id: string;
  timestamp: string;
  fileName: string;
  fileSize: number;
  encrypted: boolean;
  taskCount: number;
  isAuto?: boolean;
}

export interface AppState {
  tasks: Task[];
  logs: AuditLog[];
  backups: BackupMetadata[];
  settings: {
    darkMode: boolean;
    fontSize: 'normal' | 'large' | 'extra-large';
    dailyAlertTime: string; // HH:mm
    soundEnabled: boolean;
    encryptionKey: string;
  };
  employees?: Employee[];
  clients?: Client[];
  accountingRecords?: AccountingRecord[];
  laborRecords?: LaborRecord[];
  taxFilings?: TaxFiling[];
  notifications?: AppNotification[];
}

export const TASK_GROUP_LABELS: Record<TaskGroup, string> = {
  THUE: 'Thuế',
  KE_TOAN: 'Kế toán',
  BAO_HIEM: 'Bảo hiểm',
  LAO_DONG: 'Lao động',
  THONG_KE: 'Thống kê',
  NOI_BO: 'Nội bộ'
};

export const TASK_GROUP_COLORS: Record<TaskGroup, { bg: string; text: string; border: string; accent: string }> = {
  THUE: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-900/50',
    accent: 'bg-red-500'
  },
  KE_TOAN: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-900/50',
    accent: 'bg-blue-500'
  },
  BAO_HIEM: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-900/50',
    accent: 'bg-emerald-500'
  },
  LAO_DONG: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-900/50',
    accent: 'bg-amber-500'
  },
  THONG_KE: {
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    text: 'text-purple-700 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-900/50',
    accent: 'bg-purple-500'
  },
  NOI_BO: {
    bg: 'bg-slate-50 dark:bg-slate-950/40',
    text: 'text-slate-700 dark:text-slate-400',
    border: 'border-slate-200 dark:border-slate-800',
    accent: 'bg-slate-500'
  }
};
