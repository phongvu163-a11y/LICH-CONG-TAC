/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { AppState, Task, AuditLog, BackupMetadata, TaskGroup, Employee } from './src/types';

// Ensure data directory exists
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_FILE_PATH = path.join(DATA_DIR, 'sqlite_sim_encrypted.db');
const SYSTEM_LOG_PATH = path.join(DATA_DIR, 'system_log.txt');
const KEY_FILE_PATH = path.join(DATA_DIR, 'active_key.txt');

function getCurrentEncryptionKey(): string {
  try {
    if (fs.existsSync(KEY_FILE_PATH)) {
      return fs.readFileSync(KEY_FILE_PATH, 'utf8').trim() || 'X9#taxAgent!SecureKey_2026';
    }
  } catch (e) {
    console.error('Failed to read active encryption key file:', e);
  }
  return 'X9#taxAgent!SecureKey_2026';
}

function saveCurrentEncryptionKey(key: string) {
  try {
    fs.writeFileSync(KEY_FILE_PATH, key, 'utf8');
  } catch (e) {
    console.error('Failed to write active encryption key file:', e);
  }
}

// Simple secure string encryption using AES-256-CBC simulation or direct Node crypto
function encryptData(text: string, key: string): string {
  try {
    // Standard Node crypto AES encryption
    const salt = crypto.randomBytes(16);
    // Build binary key from key string
    const hashedKey = crypto.createHash('sha256').update(key).digest();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', hashedKey, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Return formatted bundle
    return JSON.stringify({
      salt: salt.toString('hex'),
      iv: iv.toString('hex'),
      payload: encrypted
    });
  } catch (e) {
    // Safe fallback if crypto issues occur
    return Buffer.from(text).toString('base64');
  }
}

function decryptData(encryptedStr: string, key: string): string {
  try {
    if (!encryptedStr.startsWith('{')) {
      // Decode fallback base64
      return Buffer.from(encryptedStr, 'base64').toString('utf8');
    }
    const data = JSON.parse(encryptedStr);
    const hashedKey = crypto.createHash('sha256').update(key).digest();
    const iv = Buffer.from(data.iv, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', hashedKey, iv);
    
    let decrypted = decipher.update(data.payload, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (e) {
    // If decryption fails due to wrong key, we handle gracefully
    throw new Error('Đăng nhập giải mã thất bại. Vui lòng kiểm tra khóa bảo mật.');
  }
}

// Initial realistic Vietnamese compliance tasks for June 2026 (centered around current time 2026-06-03)
const DEFAULT_TASKS: Task[] = [
  {
    id: 't-1',
    title: 'Nộp báo cáo sử dụng lao động 6 tháng đầu năm 2026',
    group: 'LAO_DONG',
    notes: 'Quy định nộp báo cáo tình hình sử dụng lao động định kỳ cho Sở LĐTB&XH trước ngày 15/06 hằng năm.',
    startDate: '2026-06-01',
    dueDate: '2026-06-15',
    completed: false,
    recurrence: 'YEARLY',
    priority: 'HIGH',
    alertDays: [30, 15, 7, 3, 0],
    customAlertTime: '08:30'
  },
  {
    id: 't-2',
    title: 'Tờ khai Thuế GTGT Tháng 5/2026',
    group: 'THUE',
    notes: 'Nộp tờ khai thuế GTGT định kỳ tháng 5 cho chi cục quản lý trực tiếp. Áp dụng cho doanh nghiệp kê khai theo tháng.',
    startDate: '2026-06-01',
    dueDate: '2026-06-20',
    completed: false,
    recurrence: 'MONTHLY',
    priority: 'HIGH',
    alertDays: [30, 15, 7, 3, 0],
    customAlertTime: '09:00'
  },
  {
    id: 't-3',
    title: 'Nộp tờ khai thuế TNCN tạm nộp Tháng 5/2026',
    group: 'THUE',
    notes: 'Kê khai thuế TNCN khấu trừ chi trả lương trong tháng trước cho toàn bộ CBNV tối đa hạn 20 hàng tháng.',
    startDate: '2026-06-01',
    dueDate: '2026-06-20',
    completed: false,
    recurrence: 'MONTHLY',
    priority: 'MEDIUM',
    alertDays: [15, 7, 3, 0],
    customAlertTime: '09:00'
  },
  {
    id: 't-4',
    title: 'Trích nộp tiền đóng BHXH, BHYT & BHTN Tháng 5/2026',
    group: 'BAO_HIEM',
    notes: 'Trích nộp chi phí bảo hiểm bắt buộc tỷ lệ 32% (DN nộp + NLĐ trích lương) nộp cho cơ quan bảo hiểm địa bàn chậm nhất ngày cuối tháng.',
    startDate: '2026-06-01',
    dueDate: '2026-06-30',
    completed: false,
    recurrence: 'MONTHLY',
    priority: 'MEDIUM',
    alertDays: [15, 7, 3, 0],
    customAlertTime: '10:00'
  },
  {
    id: 't-5',
    title: 'Nộp báo cáo Thống kê Định kỳ Tháng 5/2026',
    group: 'THONG_KE',
    notes: 'Thu thập số liệu doanh thu, sản xuất và nộp báo cáo lên Cục thống kê Quận/Huyện trước hạn ngày 10.',
    startDate: '2026-06-01',
    dueDate: '2026-06-10',
    completed: false,
    recurrence: 'MONTHLY',
    priority: 'LOW',
    alertDays: [7, 3, 0],
    customAlertTime: '08:00'
  },
  {
    id: 't-6',
    title: 'Trích nộp kinh phí công đoàn Quý 2/2026',
    group: 'LAO_DONG',
    notes: 'Trích đóng 2% quỹ lương làm căn cứ đóng BHXH nộp cơ quan Công đoàn quận/huyện quản lý.',
    startDate: '2026-06-01',
    dueDate: '2026-06-30',
    completed: false,
    recurrence: 'QUARTERLY',
    priority: 'LOW',
    alertDays: [15, 7, 3, 0],
    customAlertTime: '09:30'
  },
  {
    id: 't-7',
    title: 'Nộp kiểm toán báo cáo tài chính năm 2025 (Quá hạn)',
    group: 'KE_TOAN',
    notes: 'Hạn chót gửi báo cáo kiểm toán cho cơ quan thuế và bộ phận Thống kê vốn đầu tư nước ngoài (FDI). Phải giải trình gấp.',
    startDate: '2025-01-01',
    dueDate: '2026-05-31', // Overdue relative to current time 2026-06-03
    completed: false,
    recurrence: 'NONE',
    priority: 'HIGH',
    alertDays: [30, 15, 7, 3, 0],
    customAlertTime: '14:00'
  },
  {
    id: 't-8',
    title: 'Rà soát và lưu trữ chứng từ kế toán các dự án đã quyết toán năm 2025',
    group: 'KE_TOAN',
    notes: 'Tập hợp hạch toán và lưu trữ hóa đơn, tài liệu hồ sơ thầu, quyết toán chi phí công trình bổ sung.',
    startDate: '2026-05-01',
    dueDate: '2026-06-05', // Imminent task list
    completed: false,
    recurrence: 'NONE',
    priority: 'MEDIUM',
    alertDays: [15, 7, 3, 0],
    customAlertTime: '15:30'
  }
];

const DEFAULT_SETTINGS = {
  darkMode: false,
  fontSize: 'large' as const,
  dailyAlertTime: '08:30',
  soundEnabled: true,
  encryptionKey: 'X9#taxAgent!SecureKey_2026'
};

const DEFAULT_METADATA: BackupMetadata[] = [];
const DEFAULT_LOGS: AuditLog[] = [
  {
    id: 'log-init',
    timestamp: new Date().toISOString(),
    action: 'INIT_DB',
    details: 'Khởi tạo cơ sở dữ liệu SQLite thành công.',
    sqlStatement: 'CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY, title TEXT, group_name TEXT, start_date TEXT, due_date TEXT, completed INTEGER, recurrence TEXT, notes TEXT, alert_days TEXT);'
  }
];

const DEFAULT_EMPLOYEES: Employee[] = [];

// Helper to load application state
let currentState: AppState = {
  tasks: DEFAULT_TASKS,
  logs: DEFAULT_LOGS,
  backups: DEFAULT_METADATA,
  settings: DEFAULT_SETTINGS,
  employees: DEFAULT_EMPLOYEES
};

// Sync load database from disk
function loadDatabaseFromFile() {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const encryptedRaw = fs.readFileSync(DB_FILE_PATH, 'utf8');
      const activeKey = getCurrentEncryptionKey();
      const decryptedJson = decryptData(encryptedRaw, activeKey);
      currentState = JSON.parse(decryptedJson);
      currentState.employees = currentState.employees || [];
      // Clean up any old demo employees that might remain in decrypted db
      if (Array.isArray(currentState.employees)) {
        currentState.employees = currentState.employees.filter((emp: any) => !['emp-1', 'emp-2', 'emp-3', 'emp-4'].includes(emp.id));
      }
      console.log('Database decrypted and loaded successfully.');
    } else {
      saveDatabaseToDisk('System auto-initialization');
    }
  } catch (err) {
    console.error('Error loading encrypted database, using base defaults:', err);
    // Backup corrupted db
    if (fs.existsSync(DB_FILE_PATH)) {
      fs.renameSync(DB_FILE_PATH, `${DB_FILE_PATH}.corrupted.${Date.now()}`);
    }
    saveDatabaseToDisk('SQLite simulation rebuild due to corrupt decryption');
  }
}

// Auto-backup change tracking state
let hasUnsavedChangesForBackup = false;

// Trigger Automatic Scheduled Secure Encrypted Backup
function triggerSharedAutoBackup(reason: string) {
  try {
    const backupId = `bk-auto-${crypto.randomBytes(4).toString('hex')}`;
    const timestamp = new Date().toISOString();
    const fileName = `sqlite_autobackup_${timestamp.replace(/[:.-]/g, '')}.db.bak`;
    
    // Maintain maximum 5 automatic backups to avoid excessive disk use
    const autoBackups = currentState.backups.filter(b => b.fileName.includes('autobackup'));
    if (autoBackups.length >= 5) {
      const oldest = autoBackups[autoBackups.length - 1];
      const oldestPath = path.join(DATA_DIR, oldest.fileName);
      if (fs.existsSync(oldestPath)) {
        try { fs.unlinkSync(oldestPath); } catch (_) {}
      }
      currentState.backups = currentState.backups.filter(b => b.id !== oldest.id);
    }

    const payloadString = JSON.stringify(currentState);
    const encryptedBackup = encryptData(payloadString, currentState.settings.encryptionKey);
    const backupPath = path.join(DATA_DIR, fileName);
    fs.writeFileSync(backupPath, encryptedBackup, 'utf8');

    const fileSize = fs.statSync(backupPath).size;

    const newBackup = {
      id: backupId,
      timestamp,
      fileName,
      fileSize,
      encrypted: true,
      taskCount: currentState.tasks.length,
      isAuto: true
    };

    currentState.backups.unshift(newBackup);
    
    const rawStr = JSON.stringify(currentState, null, 2);
    const encryptedStr = encryptData(rawStr, currentState.settings.encryptionKey);
    fs.writeFileSync(DB_FILE_PATH, encryptedStr, 'utf8');
    
    fs.appendFileSync(SYSTEM_LOG_PATH, `[${timestamp}] REASON: Auto Backup - ${reason} | FILE: ${fileName}\n`);
    console.log(`[AutoBackup] Background backup compiled: ${fileName}`);
  } catch (err: any) {
    console.error('Trigger automatic backup failure:', err);
  }
}

// Sync save status to disk using security AES
function saveDatabaseToDisk(reason: string, sqlQuerySimulated?: string, req?: any) {
  try {
    // Mark changes for automatic background backing up
    hasUnsavedChangesForBackup = true;

    // Auto-create log write
    const timestampStr = new Date().toISOString();
    const logId = `l-${crypto.randomBytes(4).toString('hex')}`;
    
    const userRole = req ? (req.simRole || 'ADMIN') : 'ADMIN';
    const userName = req ? (req.simUser || 'Hệ thống (Web App)') : 'Hệ thống (Web App)';
    const ipAddress = req ? (req.simIp || '127.0.0.1') : '127.0.0.1';

    const newLog: AuditLog = {
      id: logId,
      timestamp: timestampStr,
      action: sqlQuerySimulated ? 'SQLITE_QUERY' : 'SQLITE_SAVE',
      details: reason,
      sqlStatement: sqlQuerySimulated || `COMMIT TRANSACTION; -- Auto-sync state persistent store change`,
      userName,
      userRole,
      ipAddress
    };
    
    // Add logging
    currentState.logs.unshift(newLog);
    if (currentState.logs.length > 300) {
      currentState.logs = currentState.logs.slice(0, 300);
    }

    const rawStr = JSON.stringify(currentState, null, 2);
    const encryptedStr = encryptData(rawStr, currentState.settings.encryptionKey);
    fs.writeFileSync(DB_FILE_PATH, encryptedStr, 'utf8');
    
    // Append plain action write to system text log
    fs.appendFileSync(SYSTEM_LOG_PATH, `[${timestampStr}] REASON: ${reason} | USER: ${userName} (${userRole}) | IP: ${ipAddress} | SQL: ${sqlQuerySimulated || 'NONE'}\n`);
  } catch (err) {
    console.error('Save database disk error:', err);
  }
}

// Call first load
loadDatabaseFromFile();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body limit
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Simulated User Roles & Audit Tracking Middleware
  app.use((req, res, next) => {
    (req as any).simRole = req.headers['x-sim-role'] || 'ADMIN';
    const rawVal = req.headers['x-sim-user'];
    (req as any).simUser = rawVal ? decodeURIComponent(rawVal as string) : 'Hệ thống (Web App)';
    (req as any).simIp = (req.headers['x-sim-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1') as string;
    next();
  });

  // API Endpoints
  app.get('/api/state', (req, res) => {
    res.json(currentState);
  });

  // Create Task
  app.post('/api/tasks', (req, res) => {
    const { title, group, notes, startDate, dueDate, recurrence, priority, alertDays, customAlertTime, completed, assignedTo, kanbanStatus, attachments, comments, client, destination, timeSlot, deadlineType } = req.body;
    
    if (!title || !group || !startDate || !dueDate) {
      return res.status(400).json({ error: 'Thiếu thông tin công nghiệp vụ bắt buộc.' });
    }

    const newTask: Task = {
      id: `t-${crypto.randomBytes(4).toString('hex')}`,
      title,
      group: group as TaskGroup,
      notes: notes || '',
      startDate,
      dueDate,
      completed: completed !== undefined ? !!completed : false,
      recurrence: recurrence || 'NONE',
      priority: priority || 'MEDIUM',
      alertDays: Array.isArray(alertDays) ? alertDays : [30, 15, 7, 3, 1, 0],
      customAlertTime: customAlertTime || '09:00',
      completedAt: completed ? new Date().toISOString() : undefined,
      assignedTo: assignedTo || undefined,
      kanbanStatus: kanbanStatus || 'TODO',
      attachments: attachments || [],
      comments: comments || [],
      client: client || '',
      destination: destination || '',
      timeSlot: timeSlot || '',
      deadlineType: deadlineType || undefined
    };

    currentState.tasks.push(newTask);
    
    const sqlSim = `INSERT INTO tasks (id, title, category, notes, start_date, due_date, completed, recurrence, priority, alert_days, custom_time, assigned_to, kanban_status, client, destination, time_slot, deadline_type) \nVALUES ('${newTask.id}', '${title.replace(/'/g, "''")}', '${group}', '${(notes || '').replace(/'/g, "''")}', '${startDate}', '${dueDate}', ${newTask.completed ? 1 : 0}, '${recurrence}', '${newTask.priority}', '${JSON.stringify(alertDays)}', '${newTask.customAlertTime}', ${assignedTo ? `'${assignedTo}'` : 'NULL'}, '${newTask.kanbanStatus}', '${(client || '').replace(/'/g, "''")}', '${(destination || '').replace(/'/g, "''")}', '${(timeSlot || '').replace(/'/g, "''")}', '${deadlineType || ''}');`;
    
    saveDatabaseToDisk(`Thêm công việc đột xuất/định kỳ mới: "${title}"`, sqlSim, req);
    res.json({ success: true, task: newTask });
  });

  // Edit Task
  app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const taskIndex = currentState.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Không tìm thấy công việc tương ứng.' });
    }

    const originalTask = currentState.tasks[taskIndex];
    const { title, group, notes, startDate, dueDate, recurrence, priority, alertDays, completed, customAlertTime, assignedTo, kanbanStatus, attachments, comments, client, destination, timeSlot, deadlineType } = req.body;

    const updatedTask: Task = {
      ...originalTask,
      title: title ?? originalTask.title,
      group: (group ?? originalTask.group) as TaskGroup,
      notes: notes ?? originalTask.notes,
      startDate: startDate ?? originalTask.startDate,
      dueDate: dueDate ?? originalTask.dueDate,
      recurrence: recurrence ?? originalTask.recurrence,
      priority: priority ?? originalTask.priority ?? 'MEDIUM',
      alertDays: Array.isArray(alertDays) ? alertDays : originalTask.alertDays,
      completed: completed ?? originalTask.completed,
      completedAt: completed ? (originalTask.completedAt || new Date().toISOString()) : undefined,
      assignedTo: (assignedTo === null || assignedTo === '') ? undefined : (assignedTo ?? originalTask.assignedTo),
      kanbanStatus: kanbanStatus ?? originalTask.kanbanStatus ?? 'TODO',
      attachments: attachments ?? originalTask.attachments ?? [],
      comments: comments ?? originalTask.comments ?? [],
      client: client ?? originalTask.client ?? '',
      destination: destination ?? originalTask.destination ?? '',
      timeSlot: timeSlot ?? originalTask.timeSlot ?? '',
      deadlineType: deadlineType ?? originalTask.deadlineType
    };

    currentState.tasks[taskIndex] = updatedTask;

    const sqlSim = `UPDATE tasks SET \n  title = '${updatedTask.title.replace(/'/g, "''")}', \n  category = '${updatedTask.group}', \n  notes = '${(updatedTask.notes || '').replace(/'/g, "''")}', \n  start_date = '${updatedTask.startDate}', \n  due_date = '${updatedTask.dueDate}', \n  completed = ${updatedTask.completed ? 1 : 0}, \n  recurrence = '${updatedTask.recurrence}', \n  priority = '${updatedTask.priority}', \n  alert_days = '${JSON.stringify(updatedTask.alertDays)}', \n  custom_time = '${updatedTask.customAlertTime}',\n  assigned_to = ${updatedTask.assignedTo ? `'${updatedTask.assignedTo}'` : 'NULL'},\n  kanban_status = '${updatedTask.kanbanStatus}',\n  client = '${(updatedTask.client || '').replace(/'/g, "''")}',\n  destination = '${(updatedTask.destination || '').replace(/'/g, "''")}',\n  time_slot = '${(updatedTask.timeSlot || '').replace(/'/g, "''")}',\n  deadline_type = '${updatedTask.deadlineType || ''}' \nWHERE id = '${id}';`;

    saveDatabaseToDisk(`Cập nhật công việc: "${updatedTask.title}"`, sqlSim, req);
    res.json({ success: true, task: updatedTask });
  });

  // Delete Task
  app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const task = currentState.tasks.find(t => t.id === id);
    if (!task) {
      return res.status(404).json({ error: 'Không tìm thấy công việc để xóa.' });
    }

    currentState.tasks = currentState.tasks.filter(t => t.id !== id);
    const sqlSim = `DELETE FROM tasks WHERE id = '${id}';`;
    saveDatabaseToDisk(`Xóa công việc: "${task.title}"`, sqlSim, req);
    res.json({ success: true, id });
  });

  // GET Employees
  app.get('/api/employees', (req, res) => {
    res.json(currentState.employees || []);
  });

  // Create Employee
  app.post('/api/employees', (req, res) => {
    const { name, role, phone, email, status, leaves, lateLogs, handoverNotes, substituteEmployeeId } = req.body;
    if (!name || !role) {
      return res.status(400).json({ error: 'Thiếu tên hoặc chức vụ nhân viên.' });
    }
    const newEmployee: Employee = {
      id: `emp-${crypto.randomBytes(4).toString('hex')}`,
      name,
      role,
      phone: phone || '',
      email: email || '',
      status: status || 'ACTIVE',
      leaves: leaves || [],
      lateLogs: lateLogs || [],
      handoverNotes: handoverNotes || '',
      substituteEmployeeId: substituteEmployeeId || ''
    };
    currentState.employees = currentState.employees || [];
    currentState.employees.push(newEmployee);
    const sqlSim = `INSERT INTO employees (id, name, role, phone, email, status, handover_notes, substitute_id) VALUES ('${newEmployee.id}', '${name.replace(/'/g, "''")}', '${role.replace(/'/g, "''")}', '${(phone || '').replace(/'/g, "''")}', '${(email || '').replace(/'/g, "''")}', '${newEmployee.status}', '${(handoverNotes || '').replace(/'/g, "''")}', '${substituteEmployeeId || ''}');`;
    saveDatabaseToDisk(`Thêm nhân viên mới: "${name}"`, sqlSim, req);
    res.json({ success: true, employee: newEmployee });
  });

  // Update Employee
  app.put('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    currentState.employees = currentState.employees || [];
    const empIndex = currentState.employees.findIndex(e => e.id === id);
    if (empIndex === -1) {
      return res.status(444).json({ error: 'Không tìm thấy thông tin nhân viên.' });
    }
    const originalEmp = currentState.employees[empIndex];
    const { name, role, phone, email, status, leaves, lateLogs, handoverNotes, substituteEmployeeId } = req.body;

    const updatedEmp: Employee = {
      ...originalEmp,
      name: name ?? originalEmp.name,
      role: role ?? originalEmp.role,
      phone: phone ?? originalEmp.phone,
      email: email ?? originalEmp.email,
      status: status ?? originalEmp.status,
      leaves: leaves ?? originalEmp.leaves ?? [],
      lateLogs: lateLogs ?? originalEmp.lateLogs ?? [],
      handoverNotes: handoverNotes ?? originalEmp.handoverNotes ?? '',
      substituteEmployeeId: substituteEmployeeId ?? originalEmp.substituteEmployeeId ?? ''
    };
    currentState.employees[empIndex] = updatedEmp;

    const sqlSim = `UPDATE employees SET name = '${updatedEmp.name.replace(/'/g, "''")}', role = '${updatedEmp.role.replace(/'/g, "''")}', phone = '${(updatedEmp.phone || '').replace(/'/g, "''")}', email = '${(updatedEmp.email || '').replace(/'/g, "''")}', status = '${updatedEmp.status}', handover_notes = '${(updatedEmp.handoverNotes || '').replace(/'/g, "''")}', substitute_id = '${updatedEmp.substituteEmployeeId || ''}' WHERE id = '${id}';`;
    saveDatabaseToDisk(`Cập nhật nhân viên: "${updatedEmp.name}"`, sqlSim, req);
    res.json({ success: true, employee: updatedEmp });
  });

  // Delete Employee
  app.delete('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    currentState.employees = currentState.employees || [];
    const emp = currentState.employees.find(e => e.id === id);
    if (!emp) {
      return res.status(444).json({ error: 'Không tìm thấy thông tin nhân viên để xóa.' });
    }
    
    // Unassign tasks assigned to this employee
    currentState.tasks = currentState.tasks.map(t => {
      if (t.assignedTo === id) {
        return { ...t, assignedTo: undefined };
      }
      return t;
    });

    currentState.employees = currentState.employees.filter(e => e.id !== id);
    const sqlSim = `DELETE FROM employees WHERE id = '${id}';`;
    saveDatabaseToDisk(`Xóa nhân viên: "${emp.name}"`, sqlSim, req);
    res.json({ success: true, id });
  });

  // POST Settings
  app.post('/api/settings', (req, res) => {
    const { darkMode, fontSize, dailyAlertTime, soundEnabled, encryptionKey } = req.body;
    
    // Check key change to re-encrypt
    const oldKey = currentState.settings.encryptionKey;
    let oldKeyNotice = '';
    
    if (encryptionKey && encryptionKey !== oldKey) {
      oldKeyNotice = ` (Mã hóa lại toàn bộ SQLite với khóa mới!)`;
      saveCurrentEncryptionKey(encryptionKey);
    }

    currentState.settings = {
      darkMode: darkMode ?? currentState.settings.darkMode,
      fontSize: fontSize ?? currentState.settings.fontSize,
      dailyAlertTime: dailyAlertTime ?? currentState.settings.dailyAlertTime,
      soundEnabled: soundEnabled ?? currentState.settings.soundEnabled,
      encryptionKey: encryptionKey ?? currentState.settings.encryptionKey
    };

    saveDatabaseToDisk(`Thay đổi thiết lập hệ thống${oldKeyNotice}`, `UPDATE settings SET dark_mode = ${currentState.settings.darkMode ? 1 : 0}, font_size = '${currentState.settings.fontSize}', sys_key = 'ENCRYPTED';`, req);
    res.json({ success: true, settings: currentState.settings });
  });

  // Create SQLite Simulated Backup
  app.post('/api/backup', (req, res) => {
    try {
      const backupId = `bk-${crypto.randomBytes(4).toString('hex')}`;
      const timestamp = new Date().toISOString();
      const fileName = `sqlite_backup_${timestamp.replace(/[:.-]/g, '')}.db.bak`;
      
      const payloadString = JSON.stringify(currentState);
      const encryptedBackup = encryptData(payloadString, currentState.settings.encryptionKey);
      
      const backupPath = path.join(DATA_DIR, fileName);
      fs.writeFileSync(backupPath, encryptedBackup, 'utf8');

      const fileSize = fs.statSync(backupPath).size;

      const newBackup: BackupMetadata = {
        id: backupId,
        timestamp,
        fileName,
        fileSize,
        encrypted: true,
        taskCount: currentState.tasks.length
      };

      currentState.backups.unshift(newBackup);
      saveDatabaseToDisk(`Tạo bản sao lưu mã hóa SQLite: ${fileName}`, `INSERT INTO backups (id, file_name, created_at, size_bytes) VALUES ('${backupId}', '${fileName}', '${timestamp}', ${fileSize});`, req);

      res.json({ success: true, backups: currentState.backups });
    } catch (err: any) {
      res.status(500).json({ error: `Sao lưu hệ thống thất bại: ${err.message}` });
    }
  });

  // Restore SQLite Simulated Backup
  app.post('/api/restore', (req, res) => {
    try {
      const { backupId, customBackupData } = req.body;
      
      if (customBackupData) {
        // Safe check for imported backups
        const decryptedJson = decryptData(customBackupData, currentState.settings.encryptionKey);
        const parsedState = JSON.parse(decryptedJson);
        
        if (!parsedState.tasks || !Array.isArray(parsedState.tasks)) {
          throw new Error('Dữ liệu khôi phục không đúng định dạng chuẩn.');
        }

        currentState = parsedState;
        currentState.employees = currentState.employees || [];
        saveDatabaseToDisk('Khôi phục cơ sở dữ liệu từ file ngoài thành công', `PRAGMA read_backup_stream; -- Imported client restore`, req);
        return res.json({ success: true, state: currentState });
      }

      const backup = currentState.backups.find(b => b.id === backupId);
      if (!backup) {
        return res.status(444).json({ error: 'Không tìm thấy bản sao lưu cần thiết.' });
      }

      const backupPath = path.join(DATA_DIR, backup.fileName);
      if (!fs.existsSync(backupPath)) {
        return res.status(404).json({ error: 'Tệp bản sao lưu trên đĩa máy chủ không khả dụng hoặc đã bị xóa.' });
      }

      const encryptedDataStr = fs.readFileSync(backupPath, 'utf8');
      const decryptedJson = decryptData(encryptedDataStr, currentState.settings.encryptionKey);
      const parsedState = JSON.parse(decryptedJson);

      currentState = parsedState;
      currentState.employees = currentState.employees || [];
      saveDatabaseToDisk(`Khôi phục cơ sở dữ liệu thành công từ tệp: ${backup.fileName}`, `RESTORE DATABASE FROM '${backup.fileName}';`, req);

      res.json({ success: true, state: currentState });
    } catch (err: any) {
      res.status(500).json({ error: `Khôi phục cơ sở dữ liệu thất bại: ${err.message}` });
    }
  });

  // Delete Backup
  app.delete('/api/backup/:id', (req, res) => {
    const { id } = req.params;
    const backupIndex = currentState.backups.findIndex(b => b.id === id);
    if (backupIndex === -1) {
      return res.status(404).json({ error: 'Không tìm thấy thông tin tệp sao lưu.' });
    }

    const backup = currentState.backups[backupIndex];
    const backupPath = path.join(DATA_DIR, backup.fileName);

    try {
      if (fs.existsSync(backupPath)) {
        fs.unlinkSync(backupPath);
      }
    } catch (_) {}

    currentState.backups.splice(backupIndex, 1);
    saveDatabaseToDisk(`Xóa tệp sao lưu: ${backup.fileName}`, `DELETE FROM backups WHERE id = '${id}';`, req);

    res.json({ success: true, id });
  });

  // Download raw encrypted database
  app.get('/api/backup/download/:id', (req, res) => {
    const { id } = req.params;
    const backup = currentState.backups.find(b => b.id === id);
    if (!backup) {
      return res.status(404).send('Không tìm thấy tệp sao lưu.');
    }
    const backupPath = path.join(DATA_DIR, backup.fileName);
    if (!fs.existsSync(backupPath)) {
      return res.status(404).send('Tệp dữ liệu hỏng.');
    }
    res.setHeader('Content-Disposition', `attachment; filename=${backup.fileName}`);
    res.setHeader('Content-Type', 'application/octet-stream');
    fs.createReadStream(backupPath).pipe(res);
  });

  // Export Data formatted for Excel CSV
  app.get('/api/export/csv', (req, res) => {
    try {
      const BOM = '\uFEFF';
      let csvContent = BOM + 'MÃ CÔNG VIỆC,TIÊU ĐỀ CÔNG VIỆC,DANH MỤC,NỘI DUNG,NGÀY BẮT ĐẦU,HẠN CUỐI,QUY CHUẨN LẶP LẠI,TRẠNG THÁI\n';
      
      currentState.tasks.forEach(t => {
        const categoryLabels: Record<string, string> = {
          'THUE': 'Thuế',
          'KE_TOAN': 'Kế toán',
          'BAO_HIEM': 'Bảo hiểm',
          'LAO_DONG': 'Lao động',
          'THONG_KE': 'Thống kê'
        };

        const recurrenceLabels: Record<string, string> = {
          'NONE': 'Không lặp',
          'MONTHLY': 'Hàng tháng',
          'QUARTERLY': 'Hàng quý',
          'YEARLY': 'Hàng năm'
        };

        const escapeCSV = (str: string) => `"${(str || '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;

        csvContent += [
          t.id,
          escapeCSV(t.title),
          escapeCSV(categoryLabels[t.group] || t.group),
          escapeCSV(t.notes || ''),
          t.startDate,
          t.dueDate,
          recurrenceLabels[t.recurrence] || t.recurrence,
          t.completed ? 'Đã hoàn thành' : 'Chưa hoàn thành'
        ].join(',') + '\n';
      });

      res.setHeader('Content-Disposition', 'attachment; filename=Lich_Canh_Bao_Nghiep_Vu_Dai_Ly_Thue.csv');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.send(csvContent);
    } catch (err: any) {
      res.status(500).send(`Xuất dữ liệu Excel thất bại: ${err.message}`);
    }
  });

  // Create simulated client audit record
  app.post('/api/audit', (req, res) => {
    try {
      const { action, details, userRole, userName, ipAddress, sqlStatement } = req.body;
      const logId = `l-${crypto.randomBytes(4).toString('hex')}`;
      const timestampStr = new Date().toISOString();
      
      const newLog: AuditLog = {
        id: logId,
        timestamp: timestampStr,
        action: action || 'ACTION',
        details: details || '',
        sqlStatement: sqlStatement || '',
        userName: userName || (req as any).simUser || 'Hệ thống (Web App)',
        userRole: userRole || (req as any).simRole || 'ADMIN',
        ipAddress: ipAddress || (req as any).simIp || '127.0.0.1'
      };

      currentState.logs.unshift(newLog);
      if (currentState.logs.length > 300) {
        currentState.logs = currentState.logs.slice(0, 300);
      }

      const rawStr = JSON.stringify(currentState, null, 2);
      const encryptedStr = encryptData(rawStr, currentState.settings.encryptionKey);
      fs.writeFileSync(DB_FILE_PATH, encryptedStr, 'utf8');

      res.json({ success: true, logs: currentState.logs });
    } catch (err: any) {
      res.status(500).json({ error: `Ghi log thất bại: ${err.message}` });
    }
  });

  // Export Audit Logs to Excel CSV with UTF-8 BOM
  app.get('/api/export/logs/csv', (req, res) => {
    try {
      const BOM = '\uFEFF';
      let csvContent = BOM + 'MÃ NHẬT KÝ,THỜI GIAN CHẠY,VAI TRÒ VAI JWT,TÊN NGƯỜI DÙNG,ĐỊA CHỈ IP TRUY CẬP,TÊN HÀNH VI,MÔ TẢ CHI TIẾT,CÂU LỆNH SQL GIẢ LẬP\n';
      
      currentState.logs.forEach(log => {
        const escapeCSV = (str: string) => `"${(str || '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;
        
        csvContent += [
          log.id,
          new Date(log.timestamp).toLocaleString('vi-VN'),
          escapeCSV(log.userRole || 'SYSTEM'),
          escapeCSV(log.userName || 'Hệ thống'),
          escapeCSV(log.ipAddress || '127.0.0.1'),
          escapeCSV(log.action),
          escapeCSV(log.details || ''),
          escapeCSV(log.sqlStatement || '')
        ].join(',') + '\n';
      });

      res.setHeader('Content-Disposition', 'attachment; filename=Nhat_Ky_Hoat_Dong_Security_Audit.csv');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.send(csvContent);
    } catch (err: any) {
      res.status(500).send(`Xuất bản ghi nhật ký Excel thất bại: ${err.message}`);
    }
  });

  // Start Automatic background backup tracker: checks for modifications every 10 minutes
  setInterval(() => {
    if (hasUnsavedChangesForBackup) {
      triggerSharedAutoBackup('Hệ thống tự động sao lưu định kỳ');
      hasUnsavedChangesForBackup = false;
    }
  }, 10 * 60 * 1000);

  // Initialize initial recovery point backup if no backups exist on startup
  if (!currentState.backups || currentState.backups.length === 0) {
    setTimeout(() => {
      triggerSharedAutoBackup('Hệ thống khởi tạo điểm khôi phục ban đầu');
    }, 4500);
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
