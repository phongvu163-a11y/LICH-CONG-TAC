/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Search,
  Trash2,
  Edit2,
  Check,
  X,
  Volume2,
  VolumeX,
  Download,
  Clock,
  ChevronLeft,
  ChevronRight,
  Info,
  ShieldCheck,
  FileSpreadsheet,
  AlertTriangle,
  Settings,
  Sliders,
  Bell,
  HelpCircle,
  Users,
  UserCheck,
  Edit3,
  Server
} from 'lucide-react';
import { Task, TaskGroup, RecurrenceType, TASK_GROUP_LABELS, TASK_GROUP_COLORS, Employee, AuditLog, SystemUserRole } from './types';
import { calculateAlertDetails, playAlertSound, formatDateLabel } from './utils';
import HouseholdBusinessGuide from './components/HouseholdBusinessGuide';
import RBACLogsTab from './components/RBACLogsTab';
import EnterpriseArchitectureTab from './components/EnterpriseArchitectureTab';

interface StatutoryItem {
  id: string;
  title: string;
  group: TaskGroup;
  notes: string;
  isStatutory: true;
}

function getStatutoryComplianceForDate(isoString: string): StatutoryItem[] {
  const parts = isoString.split('-');
  if (parts.length !== 3) return [];
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-indexed
  const day = parseInt(parts[2], 10);

  const items: StatutoryItem[] = [];

  // Check if it's the last day of the month
  const nextDay = new Date(year, month, day + 1);
  const isLastDay = nextDay.getDate() === 1;

  // 1. Ngày 10 hằng tháng: Báo cáo Thống kê (Phần này không cần thiết theo yêu cầu người dùng)

  // 2. Ngày 15: Báo cáo Lao động tháng 6 hoặc tháng 12
  if (day === 15) {
    if (month === 5) { // Tháng 6 (0-indexed 5)
      items.push({
        id: `stat-laodong-6t-${year}`,
        title: `⚖️ Báo cáo Lao động 6T đầu năm ${year}`,
        group: 'LAO_DONG',
        notes: `Nộp báo cáo tình hình sử dụng lao động định kỳ 6 tháng đầu năm ${year} lên Sở LĐTB&XH tỉnh/thành phố chậm nhất trước ngày 15/06 hằng năm theo Bộ luật Lao động.`,
        isStatutory: true
      });
    } else if (month === 11) { // Tháng 12 (0-indexed 11)
      items.push({
        id: `stat-laodong-12t-${year}`,
        title: `⚖️ Báo cáo Lao động 6T cuối năm ${year}`,
        group: 'LAO_DONG',
        notes: `Nộp báo cáo tình hình sử dụng lao động định kỳ 6 tháng cuối năm ${year} lên Sở LĐTB&XH tỉnh/thành phố chậm nhất trước ngày 15/12 hằng năm theo Bộ luật Lao động.`,
        isStatutory: true
      });
    }
  }

  // 3. Ngày 20 hằng tháng: Tờ khai thuế GTGT & TNCN
  if (day === 20) {
    items.push({
      id: `stat-gtgt-${year}-${month + 1}`,
      title: `⚖️ Tờ khai GTGT Tháng ${month === 0 ? 12 : month}/${month === 0 ? year - 1 : year}`,
      group: 'THUE',
      notes: `Nộp tờ khai Thuế GTGT định kỳ Tháng ${month === 0 ? 12 : month}/${month === 0 ? year - 1 : year} cho Chi cục Thuế quản lý trực tiếp. Hạn cuối ngày 20 hằng tháng đối với DN kê khai theo tháng.`,
      isStatutory: true
    });
    items.push({
      id: `stat-tncn-${year}-${month + 1}`,
      title: `⚖️ Tờ khai TNCN Tháng ${month === 0 ? 12 : month}/${month === 0 ? year - 1 : year}`,
      group: 'THUE',
      notes: `Khấu trừ thuế TNCN tạm nộp phát sinh từ chi trả tiền lương trong Tháng ${month === 0 ? 12 : month} trước đó cho người lao động. Hạn cuối là ngày 20 hằng tháng.`,
      isStatutory: true
    });
    // HKD Nhóm 4: Kê khai theo THÁNG
    items.push({
      id: `stat-hkd-n4-t-${year}-${month + 1}`,
      title: `⚖️ HKD Nhóm 4: Tờ khai Tháng ${month === 0 ? 12 : month}/${month === 0 ? year - 1 : year}`,
      group: 'THUE',
      notes: `Hộ kinh doanh Nhóm 4 (Doanh thu > 50 tỷ/năm): Bắt buộc kê khai thuế GTGT & TNCN theo Tháng. Sổ sách hoàn chỉnh như Doanh nghiệp. Hạn cuối cùng ngày 20 hằng tháng theo Nghị định 141 & Thông tư 152.`,
      isStatutory: true
    });
  }

  // 4. Ngày 30 của tháng đầu quý sau: Tạm nộp thuế TNDN Quý & Kinh phí công đoàn, Tờ khai Quý chung cho DN & HKD Nhóm 2 & Nhóm 3
  if (day === 30) {
    if (month === 0) { // Tháng 1 -> Tạm nộp Quý 4 năm trước
      items.push({
        id: `stat-tndn-q4-${year}`,
        title: `⚖️ Tạm nộp Thuế TNDN Quý 4/${year - 1}`,
        group: 'THUE',
        notes: `Tạm tính và nộp số thuế thu nhập doanh nghiệp (TNDN) phát sinh trong Quý 4 năm trước vào ngân sách nhà nước. Hạn cuối nộp là ngày 30 tháng 1 hằng năm.`,
        isStatutory: true
      });
      items.push({
        id: `stat-kpcd-q4-${year}`,
        title: `⚖️ Kinh phí Công đoàn Quý 4/${year - 1}`,
        group: 'LAO_DONG',
        notes: `Trích đóng kinh phí công đoàn tỷ lệ 2% quỹ tiền lương làm căn cứ đóng BHXH cho người lao động lên Liên đoàn lao động Quận/Huyện định kỳ Quý 4 năm trước.`,
        isStatutory: true
      });
      // Tờ khai thuế GTGT định kỳ Quý 4 năm trước (Doanh nghiệp & Hộ kinh doanh thuộc diện)
      items.push({
        id: `stat-gtgt-q4-${year}`,
        title: `⚖️ Tờ khai Thuế GTGT Quý 4/${year - 1}`,
        group: 'THUE',
        notes: `Nộp tờ khai thuế GTGT định kỳ Quý 4/${year - 1} cho cơ quan thuế quản lý trực tiếp. Áp dụng cho đối tượng doanh nghiệp/tổ chức kê khai thuế theo quý. Hạn cuối cùng là ngày 31/01 của năm sau.`,
        isStatutory: true
      });
      // Tờ khai thuế TNCN định kỳ Quý 4 năm trước
      items.push({
        id: `stat-tncn-q4-${year}`,
        title: `⚖️ Tờ khai Thuế TNCN Quý 4/${year - 1}`,
        group: 'THUE',
        notes: `Nộp tờ khai thuế TNCN định kỳ Quý 4/${year - 1} cho cơ quan thuế quản lý trực tiếp (nếu có phát sinh khấu trừ thuế TNCN). Hạn cuối cùng là ngày 31/01 của năm sau.`,
        isStatutory: true
      });
      // HKD Nhóm 2 & 3 Quý 4
      items.push({
        id: `stat-hkd-n23-q4-${year}`,
        title: `⚖️ HKD Nhóm 2&3: Tờ khai Quý 4/${year - 1}`,
        group: 'THUE',
        notes: `Hộ kinh doanh Nhóm 2 & Nhóm 3 (Doanh thu từ 1 - 50 tỷ/năm): Hạn kê khai theo Quý 4 của năm trước. Hạn cuối là ngày 31/01 năm sau. Kế toán cần hoàn tất sổ sách và tờ khai thuế theo quy định.`,
        isStatutory: true
      });
    } else if (month === 3) { // Tháng 4 -> Tạm nộp Quý 1
      items.push({
        id: `stat-tndn-q1-${year}`,
        title: `⚖️ Tạm nộp Thuế TNDN Quý 1/${year}`,
        group: 'THUE',
        notes: `Tạm tính và nộp số thuế thu nhập doanh nghiệp phát sinh trong Quý 1 vào kho bạc. Hạn cuối nộp là ngày 30 tháng 4 hằng năm.`,
        isStatutory: true
      });
      items.push({
        id: `stat-kpcd-q1-${year}`,
        title: `⚖️ Kinh phí Công đoàn Quý 1/${year}`,
        group: 'LAO_DONG',
        notes: `Trích đóng kinh phí công đoàn định kỳ Quý 1 lên Liên đoàn lao động chủ quản.`,
        isStatutory: true
      });
      // Tờ khai thuế GTGT định kỳ Quý 1
      items.push({
        id: `stat-gtgt-q1-${year}`,
        title: `⚖️ Tờ khai Thuế GTGT Quý 1/${year}`,
        group: 'THUE',
        notes: `Nộp tờ khai thuế GTGT định kỳ Quý 1/${year} cho cơ quan thuế quản lý trực tiếp. Áp dụng cho các doanh nghiệp và tổ chức kê khai theo quý. Hạn cuối ngày 30/04 hằng năm.`,
        isStatutory: true
      });
      // Tờ khai thuế TNCN định kỳ Quý 1
      items.push({
        id: `stat-tncn-q1-${year}`,
        title: `⚖️ Tờ khai Thuế TNCN Quý 1/${year}`,
        group: 'THUE',
        notes: `Nộp tờ khai thuế TNCN định kỳ Quý 1/${year} cho cơ quan thuế quản lý trực tiếp (nếu có phát sinh khấu trừ thuế TNCN). Hạn cuối ngày 30/04 hằng năm.`,
        isStatutory: true
      });
      // HKD Nhóm 2 & 3 Quý 1
      items.push({
        id: `stat-hkd-n23-q1-${year}`,
        title: `⚖️ HKD Nhóm 2&3: Tờ khai Quý 1/${year}`,
        group: 'THUE',
        notes: `Hộ kinh doanh Nhóm 2 & Nhóm 3 (Doanh thu từ 1 - 50 tỷ/năm): Hạn kê khai theo Quý 1. Hạn cuối là ngày 30/04 hằng năm theo Nghị định 141 & Thông tư 152.`,
        isStatutory: true
      });
    } else if (month === 6) { // Tháng 7 -> Tạm nộp Quý 2
      items.push({
        id: `stat-tndn-q2-${year}`,
        title: `⚖️ Tạm nộp Thuế TNDN Quý 2/${year}`,
        group: 'THUE',
        notes: `Tạm tính và nộp số thuế thu nhập doanh nghiệp phát sinh trong Quý 2 vào kho bạc. Hạn cuối nộp là ngày 30 tháng 7 hằng năm.`,
        isStatutory: true
      });
      items.push({
        id: `stat-kpcd-q2-${year}`,
        title: `⚖️ Kinh phí Công đoàn Quý 2/${year}`,
        group: 'LAO_DONG',
        notes: `Trích đóng kinh phí công đoàn định kỳ Quý 2 lên Liên đoàn lao động chủ quản.`,
        isStatutory: true
      });
      // Tờ khai thuế GTGT định kỳ Quý 2
      items.push({
        id: `stat-gtgt-q2-${year}`,
        title: `⚖️ Tờ khai Thuế GTGT Quý 2/${year}`,
        group: 'THUE',
        notes: `Nộp tờ khai thuế GTGT định kỳ Quý 2/${year} cho cơ quan thuế quản lý trực tiếp. Áp dụng cho các doanh nghiệp và tổ chức kê khai theo quý. Hạn cuối ngày 31/07 hằng năm.`,
        isStatutory: true
      });
      // Tờ khai thuế TNCN định kỳ Quý 2
      items.push({
        id: `stat-tncn-q2-${year}`,
        title: `⚖️ Tờ khai Thuế TNCN Quý 2/${year}`,
        group: 'THUE',
        notes: `Nộp tờ khai thuế TNCN định kỳ Quý 2/${year} cho cơ quan thuế quản lý trực tiếp (nếu có phát sinh khấu trừ thuế TNCN). Hạn cuối ngày 31/07 hằng năm.`,
        isStatutory: true
      });
      // HKD Nhóm 2 & 3 Quý 2
      items.push({
        id: `stat-hkd-n23-q2-${year}`,
        title: `⚖️ HKD Nhóm 2&3: Tờ khai Quý 2/${year}`,
        group: 'THUE',
        notes: `Hộ kinh doanh Nhóm 2 & Nhóm 3 (Doanh thu từ 1 - 50 tỷ/năm): Hạn kê khai theo Quý 2. Hạn cuối là ngày 30/07 hằng năm theo Nghị định 141 & Thông tư 152.`,
        isStatutory: true
      });
    } else if (month === 9) { // Tháng 10 -> Tạm nộp Quý 3
      items.push({
        id: `stat-tndn-q3-${year}`,
        title: `⚖️ Tạm nộp Thuế TNDN Quý 3/${year}`,
        group: 'THUE',
        notes: `Tạm tính và nộp số thuế thu nhập doanh nghiệp phát sinh trong Quý 3 vào kho bạc. Hạn cuối nộp là ngày 30 tháng 10 hằng năm.`,
        isStatutory: true
      });
      items.push({
        id: `stat-kpcd-q3-${year}`,
        title: `⚖️ Kinh phí Công đoàn Quý 3/${year}`,
        group: 'LAO_DONG',
        notes: `Trích đóng kinh phí công đoàn định kỳ Quý 3 lên Liên đoàn lao động chủ quản.`,
        isStatutory: true
      });
      // Tờ khai thuế GTGT định kỳ Quý 3
      items.push({
        id: `stat-gtgt-q3-${year}`,
        title: `⚖️ Tờ khai Thuế GTGT Quý 3/${year}`,
        group: 'THUE',
        notes: `Nộp tờ khai thuế GTGT định kỳ Quý 3/${year} cho cơ quan thuế quản lý trực tiếp. Áp dụng cho các doanh nghiệp và tổ chức kê khai theo quý. Hạn cuối ngày 31/10 hằng năm.`,
        isStatutory: true
      });
      // Tờ khai thuế TNCN định kỳ Quý 3
      items.push({
        id: `stat-tncn-q3-${year}`,
        title: `⚖️ Tờ khai Thuế TNCN Quý 3/${year}`,
        group: 'THUE',
        notes: `Nộp tờ khai thuế TNCN định kỳ Quý 3/${year} cho cơ quan thuế quản lý trực tiếp (nếu có phát sinh khấu trừ thuế TNCN). Hạn cuối ngày 31/10 hằng năm.`,
        isStatutory: true
      });
      // HKD Nhóm 2 & 3 Quý 3
      items.push({
        id: `stat-hkd-n23-q3-${year}`,
        title: `⚖️ HKD Nhóm 2&3: Tờ khai Quý 3/${year}`,
        group: 'THUE',
        notes: `Hộ kinh doanh Nhóm 2 & Nhóm 3 (Doanh thu từ 1 - 50 tỷ/năm): Hạn kê khai theo Quý 3. Hạn cuối là ngày 30/10 hằng năm theo Nghị định 141 & Thông tư 152.`,
        isStatutory: true
      });
    }
  }

  // HKD Nhóm 1: Kê khai theo NĂM hoặc 2 LẦN/NĂM
  if (day === 31) {
    if (month === 0) { // Tháng 1 -> Hạn nộp cho năm trước biệt lập
      items.push({
        id: `stat-hkd-n1-nam-${year}`,
        title: `⚖️ HKD Nhóm 1: Tờ khai thuế năm ${year - 1}`,
        group: 'THUE',
        notes: `Hộ kinh doanh Nhóm 1 (Doanh thu ≤ 1 tỷ/năm): Kê khai và nộp thuế định kỳ 1 lần/năm. Hạn nộp là ngày 31/01 của năm tiếp theo hằng năm.`,
        isStatutory: true
      });
      items.push({
        id: `stat-hkd-n1-moi-t1-${year}`,
        title: `⚖️ HKD Nhóm 1 mới: Tờ khai đợt 1`,
        group: 'THUE',
        notes: `Hộ kinh doanh Nhóm 1 mới thành lập kê khai 2 lần/năm: Hạn nộp đợt 1 là ngày 31/01 năm sau hằng năm.`,
        isStatutory: true
      });
      items.push({
        id: `stat-thue-taisan-nam-${year}`,
        title: `⚖️ Cho Thuê Tài Sản: Khai Năm / Đợt 2`,
        group: 'THUE',
        notes: `Cá nhân cho thuê tài sản khai thuế 1 lần/năm hoặc đợt 2 của phương pháp khai 2 lần/năm: Hạn nộp hồ sơ khai thuế chậm nhất là ngày 31/01 của năm tiếp theo (Năm nộp: ${year}). Đối với tổ chức khai thay: Nộp theo thời hạn thanh toán tiền thuê quy định trên hợp đồng.`,
        isStatutory: true
      });
    } else if (month === 6) { // Tháng 7 -> Hạn nộp đợt 2 của năm cho hộ mới
      items.push({
        id: `stat-hkd-n1-moi-t7-${year}`,
        title: `⚖️ HKD Nhóm 1 mới: Tờ khai đợt 2`,
        group: 'THUE',
        notes: `Hộ kinh doanh Nhóm 1 mới thành lập kê khai 2 lần/năm: Hạn nộp đợt 2 là ngày 31/07 hằng năm.`,
        isStatutory: true
      });
      items.push({
        id: `stat-thue-taisan-t7-${year}`,
        title: `⚖️ Cho Thuê Tài Sản: Tờ Khai Đợt 1`,
        group: 'THUE',
        notes: `Cá nhân cho thuê tài sản lựa chọn phương pháp khai 2 lần/năm: Hạn nộp hồ sơ khai thuế đợt 1 chậm nhất là ngày 31/07 hằng năm (Năm nộp: ${year}). Đối với tổ chức khai thay: Nộp theo thời hạn thanh toán tiền thuê quy định trên hợp đồng.`,
        isStatutory: true
      });
    }
  }

  // 5. Ngày 31/03 hằng năm: Quyết toán thuế & BCTC
  if (month === 2 && day === 31) {
    items.push({
      id: `stat-bctc-${year}`,
      title: `⚖️ Quyết toán Thuế & BCTC năm ${year - 1}`,
      group: 'KE_TOAN',
      notes: `Hạn nộp Báo cáo tài chính năm ${year - 1}, tờ khai Quyết toán thuế TNDN (mẫu 03/TNDN) và tờ khai Quyết toán thuế TNCN năm (mẫu 05/KK-TNCN) lên Cơ quan Thuế.`,
      isStatutory: true
    });
  }

  // 6. Ngày cuối tháng: Trích nộp BHXH, BHYT & BHTN
  if (isLastDay) {
    items.push({
      id: `stat-bhxh-${year}-${month + 1}`,
      title: `⚖️ Trích nộp BHXH Tháng ${month + 1}`,
      group: 'BAO_HIEM',
      notes: `Hạn đóng nộp BHXH, BHYT & BHTN bắt buộc Tháng ${month + 1}/${year}. Đóng chậm kể từ ngày tiếp theo sẽ tính lãi suất nộp chậm phạt của Nhà nước.`,
      isStatutory: true
    });
  }

  return items;
}

function servicesRecurrenceColor(recurrence: string, darkMode: boolean) {
  if (darkMode) {
    switch (recurrence) {
      case 'DAILY': return 'bg-amber-950/25 text-amber-400 border-amber-900/40';
      case 'WEEKLY': return 'bg-indigo-950/25 text-indigo-400 border-indigo-900/40';
      case 'MONTHLY': return 'bg-purple-950/25 text-purple-400 border-purple-900/45';
      case 'QUARTERLY': return 'bg-sky-950/25 text-sky-400 border-sky-900/40';
      case 'YEARLY': return 'bg-rose-950/25 text-rose-400 border-rose-900/40';
      default: return 'bg-zinc-950/30 text-zinc-400 border-zinc-900';
    }
  } else {
    switch (recurrence) {
      case 'DAILY': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'WEEKLY': return 'bg-indigo-50 text-indigo-850 border-indigo-200';
      case 'MONTHLY': return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'QUARTERLY': return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'YEARLY': return 'bg-red-50 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  }
}

function getTodayISOString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getTodayFormattedString(): string {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function App() {
  // Application tasks & settings states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [backups, setBackups] = useState<any[]>([]);
  const [settings, setSettings] = useState({
    darkMode: false,
    fontSize: 'large' as 'normal' | 'large' | 'extra-large',
    dailyAlertTime: '08:30',
    soundEnabled: true,
  });

  // UI Navigation / Filters
  const [activeAppSection, setActiveAppSection] = useState<'SCHEDULER' | 'AUDIT_LOGS'>('SCHEDULER');
  const [currentUserRole, setCurrentUserRole] = useState<SystemUserRole>('ADMIN');
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('ALL');
  
  // Date Focus for Monthly and Weekly layouts
  const [currYear, setCurrYear] = useState(() => new Date().getFullYear());
  const [currMonth, setCurrMonth] = useState(() => new Date().getMonth()); // June (0-indexed)
  const [selectedDayISO, setSelectedDayISO] = useState<string>(getTodayISOString()); // The tax timeline reference
  const [calendarViewType, setCalendarViewType] = useState<'WEEK' | 'MONTH' | 'YEAR'>('WEEK');
  const [isSyncingCalendar, setIsSyncingCalendar] = useState(false);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [interactingTask, setInteractingTask] = useState<Task | null>(null);
  const [commentText, setCommentText] = useState('');
  const [mockFileName, setMockFileName] = useState('');

  // Form Fields for Create / Edit
  const [formTitle, setFormTitle] = useState('');
  const [formGroup, setFormGroup] = useState<TaskGroup>('THUE');
  const [formNotes, setFormNotes] = useState('');
  const [formStartDate, setFormStartDate] = useState('2026-06-01');
  const [formDueDate, setFormDueDate] = useState('2026-06-20');
  const [formRecurrence, setFormRecurrence] = useState<RecurrenceType>('NONE');
  const [formPriority, setFormPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');
  const [formAlertDays, setFormAlertDays] = useState<number[]>([30, 15, 7, 3, 0]);
  const [formCustomAlertTime, setFormCustomAlertTime] = useState('09:00');
  const [formClient, setFormClient] = useState('');
  const [formDestination, setFormDestination] = useState('');
  const [formTimeSlot, setFormTimeSlot] = useState('');
  const [formDeadlineType, setFormDeadlineType] = useState<'KHACH_HANG' | 'HO_SO_THUE' | 'BHXH' | 'LAO_DONG' | 'PHAP_LY'>('HO_SO_THUE');
  const [formKanbanStatus, setFormKanbanStatus] = useState<'TODO' | 'DOING' | 'PENDING' | 'DONE'>('TODO');

  // Loading & Toasts
  const [isLoading, setIsLoading] = useState(true);
  const [isBackupProcessing, setIsBackupProcessing] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Employee Management State & Assignment Form State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formAssignedTo, setFormAssignedTo] = useState('');
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Employee Form fields
  const [empName, setEmpName] = useState('');
  const [empRole, setEmpRole] = useState('Chuyên viên Kế toán');
  const [empPhone, setEmpPhone] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empStatus, setEmpStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  // Digital clock
  const [currentTime, setCurrentTime] = useState(new Date());

  // Custom confirmation and alert state for iframe friendliness
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    isAlert?: boolean;
  } | null>(null);

  const showAlert = (title: string, message: string) => {
    setConfirmConfig({
      title,
      message,
      isAlert: true,
      confirmText: 'Đóng',
      onConfirm: () => setConfirmConfig(null),
    });
  };

  const askConfirmation = (title: string, message: string, onConfirm: () => void, confirmText = 'Xác nhận', cancelText = 'Hủy') => {
    setConfirmConfig({
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmConfig(null);
      },
      confirmText,
      cancelText,
      isAlert: false,
    });
  };

  // Initialize and load tasks from backend Express API
  const fetchState = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const response = await fetch('/api/state');
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks || []);
        setBackups(data.backups || []);
        setEmployees(data.employees || []);
        setLogs(data.logs || []);
        if (data.settings) {
          // Sync theme preference
          setSettings(prev => ({
            ...prev,
            darkMode: data.settings.darkMode ?? prev.darkMode,
            fontSize: data.settings.fontSize ?? prev.fontSize,
            dailyAlertTime: data.settings.dailyAlertTime ?? prev.dailyAlertTime,
            soundEnabled: data.settings.soundEnabled ?? prev.soundEnabled
          }));
        }
      } else {
        showError('Không tải được trạng thái dữ liệu từ máy chủ.');
      }
    } catch (_) {
      showError('Lỗi kết nối máy chủ dịch vụ offline.');
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  // Setup global fetch interceptor to append custom simulation headers
  useEffect(() => {
    const originalFetch = window.fetch;
    try {
      Object.defineProperty(window, 'fetch', {
        value: function(input: any, init: any) {
          if (typeof input === 'string' && input.startsWith('/api/')) {
            init = init || {};
            init.headers = init.headers || {};
            
            // Ensure accurate JSON payload Content-Type headers
            if (init.body && typeof init.body === 'string' && !(init.headers as any)['Content-Type']) {
              (init.headers as any)['Content-Type'] = 'application/json';
            }
            
            // Match specific Vietnamese human-readable names for realistic syslog context
            const personNameMap: Record<SystemUserRole, string> = {
              'ADMIN': 'Admin Đỗ Mạnh Hùng (CEO)',
              'MANAGER': 'Trần Thị Ngọc Mai (Manager)',
              'TEAM_LEADER': 'Phạm Thanh Sơn (Team Leader)',
              'STAFF': 'Nguyễn Hoàng Nam (STAFF)',
              'CLIENT': 'Hộ Kinh Doanh Tiến Phát (Client)'
            };

            // Append custom security headers for simulation context
            (init.headers as any)['x-sim-role'] = currentUserRole;
            (init.headers as any)['x-sim-user'] = encodeURIComponent(personNameMap[currentUserRole] || 'Hệ thống (Web App)');
            (init.headers as any)['x-sim-ip'] = currentUserRole === 'ADMIN' ? '192.168.1.100' :
                                                currentUserRole === 'MANAGER' ? '192.168.1.101' :
                                                currentUserRole === 'TEAM_LEADER' ? '192.168.1.102' :
                                                currentUserRole === 'STAFF' ? '192.168.1.103' : '192.168.1.250';
          }
          return originalFetch(input, init);
        },
        configurable: true,
        writable: true
      });
    } catch (err) {
      console.warn('Không thể cài đặt thuộc tính fetch toàn cục qua Object.defineProperty:', err);
    }
    return () => {
      try {
        Object.defineProperty(window, 'fetch', {
          value: originalFetch,
          configurable: true,
          writable: true
        });
      } catch (err) {}
    };
  }, [currentUserRole]);

  useEffect(() => {
    fetchState();
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const showSuccess = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const showError = (msg: string) => {
    setErrorToast(msg);
    setTimeout(() => setErrorToast(null), 5000);
  };

  // Create or Update task
  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showError('Vui lòng nhập tên công việc nghiệp vụ.');
      return;
    }

    const payload = {
      title: formTitle,
      group: formGroup,
      notes: formNotes,
      startDate: formStartDate,
      dueDate: formDueDate,
      recurrence: formRecurrence,
      priority: formPriority,
      alertDays: formAlertDays,
      customAlertTime: formCustomAlertTime,
      assignedTo: formAssignedTo || null,
      client: formClient,
      destination: formDestination,
      timeSlot: formTimeSlot,
      deadlineType: formDeadlineType,
      kanbanStatus: formKanbanStatus
    };

    try {
      let response;
      if (editingTask && !editingTask.isVirtual) {
        // Edit mode for normal real task
        response = await fetch(`/api/tasks/${editingTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Create mode or saving a virtual task (which saves as a new actual database task)
        response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          showSuccess(editingTask && !editingTask.isVirtual ? 'Cập nhật công việc thành công!' : 'Tạo lịch cảnh báo công việc thành công!');
          if (settings.soundEnabled) {
            playAlertSound(editingTask && !editingTask.isVirtual ? 'beep' : 'success');
          }
          setIsTaskModalOpen(false);
          setEditingTask(null);
          clearForm();
          fetchState(true);
        } else {
          showError(data.error || 'Đã xảy ra lỗi.');
        }
      } else {
        showError('Lỗi kết nối dịch vụ lưu trữ.');
      }
    } catch (_) {
      showError('Lỗi cập nhật máy chủ cơ sở dữ liệu local.');
    }
  };

  // Save Employee (Create or Edit)
  const handleSaveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName.trim() || !empRole.trim()) {
      showError('Vui lòng điền đầy đủ tên và chức vụ nhân viên.');
      return;
    }

    const payload = {
      name: empName,
      role: empRole,
      phone: empPhone,
      email: empEmail,
      status: empStatus
    };

    try {
      let response;
      if (editingEmployee) {
        response = await fetch(`/api/employees/${editingEmployee.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch('/api/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        showSuccess(editingEmployee ? 'Đã cập nhật thông tin nhân viên!' : 'Đã thêm nhân viên mới!');
        setIsEmployeeModalOpen(false);
        clearEmployeeForm();
        fetchState(true); // Refetch full state to update tasks & employees sync
      } else {
        const errData = await response.json();
        showError(errData.error || 'Thao tác nhân viên thất bại.');
      }
    } catch (_) {
      showError('Lỗi kết nối máy chủ dịch vụ.');
    }
  };

  // Delete Employee
  const handleDeleteEmployee = async (id: string) => {
    askConfirmation(
      'Xóa Nhân Viên',
      'Bạn có chắc muốn xóa nhân viên này? Tất cả phân công công việc của nhân viên này sẽ được gỡ bỏ.',
      async () => {
        try {
          const response = await fetch(`/api/employees/${id}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            showSuccess('Đã xóa nhân viên thành công.');
            fetchState(true);
          } else {
            showError('Không thể xóa nhân viên này.');
          }
        } catch (_) {
          showError('Lỗi kết nối dịch vụ.');
        }
      },
      'Đồng ý xóa',
      'Giữ lại'
    );
  };

  const openCreateEmployeeModal = () => {
    setEditingEmployee(null);
    clearEmployeeForm();
    setIsEmployeeModalOpen(true);
  };

  const openEditEmployeeModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setEmpName(emp.name);
    setEmpRole(emp.role);
    setEmpPhone(emp.phone || '');
    setEmpEmail(emp.email || '');
    setEmpStatus(emp.status);
    setIsEmployeeModalOpen(true);
  };

  const clearEmployeeForm = () => {
    setEmpName('');
    setEmpRole('Chuyên viên Kế toán');
    setEmpPhone('');
    setEmpEmail('');
    setEmpStatus('ACTIVE');
  };

  // Toggle complete state
  const handleToggleComplete = async (task: Task) => {
    const nextStatus = !task.completed;
    try {
      let response;
      if (task.isVirtual) {
        // Post the virtual task to database with toggled completeness
        response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: task.title,
            group: task.group,
            notes: task.notes.replace('\n\n[Hệ thống tự động lên lịch theo quy chuẩn Pháp định hằng ngày/tháng/quý/năm]', ''),
            startDate: task.startDate,
            dueDate: task.dueDate,
            recurrence: 'NONE',
            priority: task.priority || 'HIGH',
            alertDays: task.alertDays,
            customAlertTime: task.customAlertTime || '08:30',
            completed: nextStatus
          })
        });
      } else {
        response = await fetch(`/api/tasks/${task.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: nextStatus })
        });
      }

      if (response && response.ok) {
        showSuccess(`Đã đánh dấu ${nextStatus ? 'hoàn thành' : 'mở lại'} "${task.title}"`);
        if (settings.soundEnabled && nextStatus) {
          playAlertSound('success');
        }
        fetchState(true);
      }
    } catch (_) {
      showError('Lỗi cập nhật trạng thái công việc.');
    }
  };

  // Delete task
  const handleDeleteTask = async (id: string, name: string) => {
    if (id.startsWith('virtual')) {
      showAlert(
        'Lịch Pháp Định',
        'Đây là lịch pháp định tự động theo quy định nhà nước. Hệ thống luôn duy trì để nhắc nhở và ngăn ngừa sai sót cho Đại lý thuế.'
      );
      return;
    }
    askConfirmation(
      'Xác Nhận Xóa Công Việc',
      `Bạn có chắc chắn muốn xóa công việc: "${name}" không?`,
      async () => {
        try {
          const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
          if (response.ok) {
            showSuccess(`Đã xóa công việc: ${name}`);
            if (settings.soundEnabled) playAlertSound('beep');
            fetchState(true);
          }
        } catch (_) {
          showError('Lỗi gửi lệnh xóa lên hệ thống.');
        }
      },
      'Đồng ý xóa',
      'Hủy bỏ'
    );
  };

  // Update Settings
  const handleUpdateSettings = async (updates: Partial<typeof settings>) => {
    const updated = { ...settings, ...updates };
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (response.ok) {
        setSettings(updated);
        showSuccess('Cập nhật thiết lập thành công!');
      }
    } catch (_) {
      showError('Lỗi lưu cấu hình.');
    }
  };

  // Automatic Backup points
  const handleTriggerBackup = async () => {
    setIsBackupProcessing(true);
    try {
      const response = await fetch('/api/backup', { method: 'POST' });
      if (response.ok) {
        showSuccess('Đã tự động sao lưu dữ liệu SQLite thành công!');
        if (settings.soundEnabled) playAlertSound('success');
        fetchState(true);
      } else {
        showError('Sao lưu thất bại.');
      }
    } catch (_) {
      showError('Lỗi kết nối máy chủ sao lưu.');
    } finally {
      setIsBackupProcessing(false);
    }
  };

  // Restore backup
  const handleRestoreBackup = async (id: string, name: string) => {
    askConfirmation(
      'Xác Nhận Khôi Phục',
      `XÁC NHẬN: Khôi phục lại toàn bộ dữ liệu từ điểm sao lưu "${name}"?`,
      async () => {
        setIsBackupProcessing(true);
        try {
          const response = await fetch('/api/restore', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ backupId: id })
          });
          if (response.ok) {
            showSuccess('Đã phục hồi dữ liệu SQLite thành công!');
            if (settings.soundEnabled) playAlertSound('startup');
            fetchState(true);
          } else {
            showError('Lỗi phục hồi dữ liệu.');
          }
        } catch (_) {
          showError('Kết nối máy chủ khôi phục gặp lỗi.');
        } finally {
          setIsBackupProcessing(false);
        }
      },
      'Đồng ý phục hồi',
      'Hủy quay lại'
    );
  };

  // Drag and Drop Logic
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetDateISO: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Shift task to target Date
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dueDate: targetDateISO })
      });
      if (response.ok) {
        showSuccess(`Thao tác kéo thả: Đã dời "${task.title}" sang ngày ${formatDateLabel(targetDateISO)}`);
        if (settings.soundEnabled) playAlertSound('beep');
        fetchState(true);
      }
    } catch (_) {
      showError('Lỗi kéo thả cập nhật ngày.');
    }
  };

  const handleSyncCalendar = async (provider: 'GOOGLE' | 'OUTLOOK') => {
    setIsSyncingCalendar(true);
    showSuccess(`Đang thiết lập kênh truyền đồng bộ an toàn với ${provider === 'GOOGLE' ? 'Google Calendar API' : 'Outlook Live Exchange'}...`);
    
    setTimeout(async () => {
      try {
        let icsContent = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//TaxAgent//WeeklySchedule//VI\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\n";
        tasks.forEach(t => {
          const dStr = t.dueDate.replace(/-/g, '');
          icsContent += "BEGIN:VEVENT\r\n";
          icsContent += `UID:${t.id}@taxagent.vn\r\n`;
          icsContent += `DTSTART;VALUE=DATE:${dStr}\r\n`;
          icsContent += `DTEND;VALUE=DATE:${dStr}\r\n`;
          icsContent += `SUMMARY:${t.title.replace(/[,;]/g, '')}\r\n`;
          icsContent += `DESCRIPTION:${(t.notes || '').replace(/[,;]/g, '')}\r\n`;
          icsContent += "END:VEVENT\r\n";
        });
        icsContent += "END:VCALENDAR\r\n";

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `lich_cong_tac_${provider.toLowerCase()}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        await fetch('/api/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: `Đồng bộ lịch biểu sang ${provider}`,
            details: `Đã kết nối và xuất thành công ${tasks.length} đầu việc pháp định & nghiệp vụ sang định dạng ICS.`
          })
        });

        setIsSyncingCalendar(false);
        showSuccess(`Đồng bộ thành công! Đã tải file .ics để cập nhật vào lịch ${provider}.`);
        if (settings.soundEnabled) playAlertSound('success');
        fetchState(true);
      } catch (err) {
        setIsSyncingCalendar(false);
        showError('Không thể hoàn tất việc đồng bộ thông tin.');
      }
    }, 2000);
  };

  const handleKanbanDrop = async (e: React.DragEvent, targetStatus: 'TODO' | 'DOING' | 'PENDING' | 'DONE') => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;

    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const updatedKeys = {
        ...task,
        kanbanStatus: targetStatus,
        completed: targetStatus === 'DONE' ? true : task.completed,
        completedAt: targetStatus === 'DONE' ? (task.completedAt || new Date().toISOString()) : undefined
      };

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedKeys)
      });
      if (response.ok) {
        showSuccess(`Đã chuyển trạng thái sang cột: ${targetStatus === 'TODO' ? 'Chưa thực hiện' : targetStatus === 'DOING' ? 'Đang thực hiện' : targetStatus === 'PENDING' ? 'Chờ xử lý' : 'Hoàn thành'}`);
        if (settings.soundEnabled) playAlertSound('beep');
        fetchState(true);
      }
    } catch (_) {
      showError('Lỗi cập nhật cột Kanban.');
    }
  };

  const handleAddComment = async (taskId: string, text: string) => {
    if (!text.trim()) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newComment = {
      id: `c-${Date.now()}`,
      author: 'Đại lý Thuế (You)',
      text,
      date: new Date().toISOString()
    };

    const updatedComments = [...(task.comments || []), newComment];
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, comments: updatedComments })
      });
      if (response.ok) {
        setCommentText('');
        const resData = await response.json();
        if (resData.success) {
          showSuccess('Đã gửi bình luận thành công!');
          if (settings.soundEnabled) playAlertSound('beep');
          fetchState(true);
          setInteractingTask(resData.task);
        }
      }
    } catch (_) {
      showError('Lỗi lưu bình luận.');
    }
  };

  const handleAddAttachment = async (taskId: string, fileName: string) => {
    if (!fileName.trim()) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newAttach = {
      id: `a-${Date.now()}`,
      name: fileName,
      size: `${Math.floor(Math.random() * 5) + 1} MB`,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedAttaches = [...(task.attachments || []), newAttach];
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, attachments: updatedAttaches })
      });
      if (response.ok) {
        setMockFileName('');
        const resData = await response.json();
        if (resData.success) {
          showSuccess(`Đính kèm tập hồ sơ "${fileName}" thành công!`);
          if (settings.soundEnabled) playAlertSound('beep');
          fetchState(true);
          setInteractingTask(resData.task);
        }
      }
    } catch (_) {
      showError('Lỗi đính kèm tệp tin.');
    }
  };

  const handleQuickAssign = async (taskId: string, employeeId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, assignedTo: employeeId ? employeeId : undefined })
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.success) {
          showSuccess(employeeId ? 'Đã ủy quyền/giao việc cho nhân viên!' : 'Đã thu hồi ủy quyền công việc!');
          if (settings.soundEnabled) playAlertSound('success');
          fetchState(true);
          setInteractingTask(resData.task);
        }
      }
    } catch (_) {
      showError('Lỗi kết nối khi giao việc.');
    }
  };

  // Helpers for modals and form clearing
  const openCreateModal = (prefilledDate?: string, prefilledData?: { title: string; group: TaskGroup; notes: string }) => {
    setEditingTask(null);
    clearForm();
    if (prefilledDate) {
      setFormStartDate(prefilledDate);
      setFormDueDate(prefilledDate);
    }
    if (prefilledData) {
      setFormTitle(prefilledData.title);
      setFormGroup(prefilledData.group);
      setFormNotes(prefilledData.notes);
    }
    setIsTaskModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormGroup(task.group);
    setFormNotes(task.notes || '');
    setFormStartDate(task.startDate);
    setFormDueDate(task.dueDate);
    setFormRecurrence(task.recurrence);
    setFormPriority(task.priority || 'MEDIUM');
    setFormAlertDays(task.alertDays);
    setFormCustomAlertTime(task.customAlertTime || '09:00');
    setFormAssignedTo(task.assignedTo || '');
    setFormClient(task.client || '');
    setFormDestination(task.destination || '');
    setFormTimeSlot(task.timeSlot || '');
    setFormDeadlineType(task.deadlineType || 'HO_SO_THUE');
    setFormKanbanStatus(task.kanbanStatus || 'TODO');
    setIsTaskModalOpen(true);
  };

  const clearForm = () => {
    setFormTitle('');
    setFormGroup('THUE');
    setFormNotes('');
    setFormStartDate(getTodayISOString());
    setFormDueDate(getTodayISOString());
    setFormRecurrence('NONE');
    setFormPriority('MEDIUM');
    setFormAlertDays([15, 7, 3, 1, 0]);
    setFormCustomAlertTime('09:00');
    setFormAssignedTo('');
    setFormClient('');
    setFormDestination('');
    setFormTimeSlot('');
    setFormDeadlineType('HO_SO_THUE');
    setFormKanbanStatus('TODO');
  };

  const toggleAlertDaySelection = (days: number) => {
    if (formAlertDays.includes(days)) {
      setFormAlertDays(prev => prev.filter(d => d !== days));
    } else {
      setFormAlertDays(prev => [...prev, days].sort((a, b) => b - a));
    }
  };

  // Calculations & Computations
  const VN_MONTHS = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const calendarCells = useMemo(() => {
    const firstDayIndex = new Date(currYear, currMonth, 1).getDay(); // 0 is Sunday
    const totalDaysInMonth = new Date(currYear, currMonth + 1, 0).getDate();
    // Monday start offset alignment
    const offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const prevMonthDays = new Date(currYear, currMonth, 0).getDate();
    const cells = [];
    
    // Previous month padding
    for (let i = offset - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const m = currMonth === 0 ? 11 : currMonth - 1;
      const y = currMonth === 0 ? currYear - 1 : currYear;
      const isoString = `${y}-${String(m + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      cells.push({ dayNum, isoString, isCurrentMonth: false });
    }
    // Active month days
    for (let dayNum = 1; dayNum <= totalDaysInMonth; dayNum++) {
      const isoString = `${currYear}-${String(currMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      cells.push({ dayNum, isoString, isCurrentMonth: true });
    }
    // Next month padding standard 42 cell square grid representation
    const totalSlots = 42;
    const postCount = totalSlots - cells.length;
    for (let dayNum = 1; dayNum <= postCount; dayNum++) {
      const m = currMonth === 11 ? 0 : currMonth + 1;
      const y = currMonth === 11 ? currYear + 1 : currYear;
      const isoString = `${y}-${String(m + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      cells.push({ dayNum, isoString, isCurrentMonth: false });
    }
    return cells;
  }, [currYear, currMonth]);

  // Week schedule dates computation (KHU VỰC 4)
  const weeklyDays = useMemo(() => {
    const center = new Date(selectedDayISO);
    const dayOfWeek = center.getDay(); // 0 Sunday, 1 Monday...
    const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    
    const mon = new Date(center);
    mon.setDate(center.getDate() + distanceToMonday);

    const weekArr = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(mon);
      day.setDate(mon.getDate() + i);
      const isoStr = day.toISOString().split('T')[0];
      weekArr.push({
        label: i === 6 ? 'Chủ Nhật' : `Thứ ${i + 2}`,
        dateNum: day.getDate(),
        monthNum: day.getMonth() + 1,
        isoString: isoStr
      });
    }
    return weekArr;
  }, [selectedDayISO]);

  // Comprehensive Tasks combinations (merged virtual statutory regulation tasks with real tasks)
  const comprehensiveTasks = useMemo(() => {
    const uniqueDates = new Set<string>();
    calendarCells.forEach(c => uniqueDates.add(c.isoString));
    weeklyDays.forEach(w => uniqueDates.add(w.isoString));
    uniqueDates.add(getTodayISOString());
    uniqueDates.add(selectedDayISO);

    const virtuals: Task[] = [];
    uniqueDates.forEach(dateStr => {
      const statsForDate = getStatutoryComplianceForDate(dateStr);
      statsForDate.forEach(stat => {
        const hasActual = tasks.some(t => t.dueDate === dateStr && t.group === stat.group);
        if (!hasActual) {
          virtuals.push({
            id: `virtual-${stat.id}-${dateStr}`,
            title: stat.title.startsWith('⚖️ ') ? stat.title : `⚖️ ${stat.title}`,
            group: stat.group,
            notes: `${stat.notes}\n\n[Hệ thống tự động lên lịch theo quy chuẩn Pháp lý hằng ngày/tháng/quý/năm]`,
            startDate: dateStr,
            dueDate: dateStr,
            completed: false,
            recurrence: 'NONE',
            priority: 'HIGH',
            alertDays: [15, 7, 3, 1, 0],
            customAlertTime: '08:30',
            isVirtual: true
          });
        }
      });
    });

    return [...tasks, ...virtuals];
  }, [tasks, calendarCells, weeklyDays, selectedDayISO]);

  const filteredTasks = useMemo(() => {
    return comprehensiveTasks.filter(task => {
      const queryMatch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.notes && task.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      const groupMatch = selectedGroupFilter === 'ALL' || task.group === selectedGroupFilter;
      return queryMatch && groupMatch;
    });
  }, [comprehensiveTasks, searchQuery, selectedGroupFilter]);

  const stats = useMemo(() => {
    let overdue = 0;
    let dueToday = 0;
    let within7Days = 0;
    let completed = 0;

    comprehensiveTasks.forEach(task => {
      if (task.completed) {
        completed++;
        return;
      }
      const details = calculateAlertDetails(task.dueDate, task.completed);
      if (details.level === 'OVERDUE') {
        overdue++;
      } else if (details.level === 'BLINKING') {
        dueToday++;
      }
      // calculate if within 7 days
      const due = new Date(task.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diffTime = due.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0 && diffDays <= 7) {
        within7Days++;
      }
    });

    return {
      overdue,
      dueToday,
      within7Days,
      completed,
      total: comprehensiveTasks.length
    };
  }, [comprehensiveTasks]);

  // Today's tasks (KHU VỰC 2)
  const todayTasks = useMemo(() => {
    const todayStr = getTodayISOString();
    return comprehensiveTasks.filter(t => t.dueDate === todayStr);
  }, [comprehensiveTasks]);

  // Tasks due within next 7 days (including overdue for strict warning visibility - KHU VỰC 3)
  const upcoming7DaysTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(today.getDate() + 7);

    return comprehensiveTasks.filter(t => {
      if (t.completed) return false;
      const due = new Date(t.dueDate);
      due.setHours(0, 0, 0, 0);
      return due >= today && due <= sevenDaysLater;
    }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [comprehensiveTasks]);

  const tasksByDate = useMemo(() => {
    const bins: Record<string, Task[]> = {};
    comprehensiveTasks.forEach(t => {
      const dt = t.dueDate;
      if (!bins[dt]) bins[dt] = [];
      bins[dt].push(t);
    });
    return bins;
  }, [comprehensiveTasks]);

  // Overdue Tasks focus list
  const overdueTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return comprehensiveTasks.filter(t => !t.completed && new Date(t.dueDate) < today);
  }, [comprehensiveTasks]);

  const textScaleClass = {
    'normal': 'text-base',
    'large': 'text-base md:text-lg',
    'extra-large': 'text-lg md:text-xl'
  }[settings.fontSize];

  const inputStyle = settings.darkMode
    ? "w-full bg-[#090f19] border border-sky-950/80 p-2 text-xs rounded text-zinc-100 focus:outline-none focus:ring-1 focus:ring-red-500 placeholder-zinc-500"
    : "w-full bg-white border border-slate-250 p-2 text-xs rounded text-black focus:outline-none focus:ring-1 focus:ring-red-500 placeholder-slate-400 font-bold shadow-sm";

  const selectStyle = settings.darkMode
    ? "w-full bg-[#090f19] border border-sky-950/80 p-2 text-xs rounded text-zinc-100 focus:outline-none font-bold"
    : "w-full bg-white border border-slate-250 p-2 text-xs rounded text-black focus:outline-none font-bold shadow-sm";

  const labelStyle = `block font-bold mb-1 uppercase tracking-wider text-[10px] ${
    settings.darkMode ? 'text-zinc-400' : 'text-black'
  }`;

  return (
    <div className={`min-h-screen transition-colors duration-250 p-2 sm:p-4 text-left ${
      settings.darkMode ? 'dark bg-[#0a1220] text-zinc-100' : 'bg-white text-slate-900'
    } ${textScaleClass}`}>

      {/* Main Container Envelope */}
      <div className={`mx-auto max-w-full rounded-2xl border ${
        settings.darkMode ? 'border-sky-900/60 bg-[#121c2e] shadow-2xl shadow-black/90' : 'border-[#e2e8f0] bg-[#fcfdfe] shadow-lg shadow-slate-100/50'
      } overflow-hidden`}>

        {/* Global Banner & Digital Clock */}
        <div className={`p-5 border-b ${
          settings.darkMode ? 'bg-gradient-to-r from-[#1c2a41] via-[#111e32] to-[#1c2a41] border-sky-950' : 'bg-gradient-to-r from-slate-50 via-white to-slate-50 border-slate-205'
        } flex flex-col md:flex-row items-center justify-between gap-4`}>
          <div className="flex items-center space-x-3.5 w-full md:w-auto">
            <div className="text-left w-full">
              <h1 className="text-xl sm:text-[28px] md:text-[28px] lg:text-[28px] font-black tracking-tight text-red-600 dark:text-red-500 uppercase leading-tight">
                LỊCH CÔNG TÁC ĐẠI LÝ THUẾ THÀNH PHỐ
              </h1>
              <p className={`text-[10px] md:text-xs font-semibold ${settings.darkMode ? 'text-zinc-400' : 'text-slate-500'} mt-1`}>
                ⚡ HỆ THỐNG KIỂM SOÁT PHÁP LÝ TỰ ĐỘNG CẬP NHẬT THEO LUẬT ĐỊNH
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 shrink-0 w-full md:w-auto justify-end">
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-xl border font-mono font-bold text-xs ${
              settings.darkMode 
                ? 'bg-[#060a12] border-zinc-800 text-red-400' 
                : 'bg-red-50 border-red-200 text-red-600 shadow-sm'
            }`}>
              <Clock className="w-4 h-4 text-red-500 shrink-0" />
              <span>
                {currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          </div>
        </div>



        {/* STATS STRIP - Standard Colors Mapping Warn State */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-2.5 ${
          settings.darkMode ? 'bg-[#121c2c] border-sky-950' : 'bg-white border-slate-205'
        } border-b font-mono text-center font-bold text-[10px] md:text-xs`}>
          <div className={`py-2 rounded border transition ${settings.darkMode ? 'bg-red-500/15 text-red-400 border-red-500/10 hover:bg-red-500/25' : 'bg-red-50 text-red-700 border-red-150 hover:bg-red-100/50'}`}>
            🟥 QUÁ HẠN: {stats.overdue} VIỆC
          </div>
          <div className={`py-2 rounded border animate-pulse ${settings.darkMode ? 'bg-rose-500/15 text-rose-450 border-rose-500/10' : 'bg-rose-50 text-rose-700 border-rose-150'}`}>
            🚨 HÔM NAY: {stats.dueToday} VIỆC
          </div>
          <div className={`py-2 rounded border transition ${settings.darkMode ? 'bg-orange-500/15 text-orange-400 border-orange-500/10 hover:bg-orange-500/25' : 'bg-amber-50 text-amber-800 border-amber-150 hover:bg-amber-100/50'}`}>
            🟧 TRONG 7 NGÀY: {stats.within7Days} VIỆC
          </div>
          <div className={`py-2 rounded border transition ${settings.darkMode ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/10 hover:bg-emerald-500/25' : 'bg-emerald-50 text-emerald-800 border-emerald-150 hover:bg-emerald-100/50'}`}>
            🟩 HOÀN THÀNH: {stats.completed} / {stats.total}
          </div>
        </div>



          <div className="flex flex-col gap-5 p-4">
            
            {/* KHU VỰC 1: LỊCH THÁNG (MONTH CALENDAR) */}
            <div className={`p-4 rounded-xl border ${
              settings.darkMode ? 'bg-[#1a263c]/50 border-sky-900/40' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3.5 gap-2">
                <div>
                  <h3 className={`font-black text-[26px] uppercase tracking-tight flex items-center gap-1.5 ${
                    settings.darkMode ? 'text-sky-100' : 'text-slate-900'
                  }`}>
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block animate-ping shrink-0"></span>
                    <span>KHU VỰC 1: LỊCH CẢNH BÁO THÁNG</span>
                  </h3>
                </div>
                
                {/* Month navigation */}
                <div className="flex items-center space-x-1.5 self-end sm:self-auto">
                  <button
                    onClick={() => {
                      if (currMonth === 0) { setCurrMonth(11); setCurrYear(y => y-1); } else { setCurrMonth(m => m-1); }
                    }}
                    className={`p-1.5 rounded border transition cursor-pointer ${
                      settings.darkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-800' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
                    }`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className={`text-[12px] font-black font-mono min-w-[100px] text-center ${settings.darkMode ? 'text-zinc-200' : 'text-slate-800'}`}>
                    {VN_MONTHS[currMonth]} {currYear}
                  </span>
                  <button
                    onClick={() => {
                      if (currMonth === 11) { setCurrMonth(0); setCurrYear(y => y+1); } else { setCurrMonth(m => m+1); }
                    }}
                    className={`p-1.5 rounded border transition cursor-pointer ${
                      settings.darkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-800' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
                    }`}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Day of Week Labels */}
              <div className={`grid grid-cols-7 gap-1 text-[11px] font-mono font-bold text-center py-1.5 rounded border mb-2 ${
                settings.darkMode ? 'bg-zinc-950/40 border-zinc-800/50 text-zinc-400' : 'bg-slate-50 border-slate-150 text-slate-600'
              }`}>
                <div>T2</div><div>T3</div><div>T4</div><div>T5</div><div>T6</div><div>T7</div><div className="text-red-650">CN</div>
              </div>

              {/* Calendar Days Matrix */}
              <div className="grid grid-cols-7 gap-1 md:gap-1.5">
                {calendarCells.map((cell, idx) => {
                  const dayTasks = tasksByDate[cell.isoString] || [];
                  const statutoryItems = getStatutoryComplianceForDate(cell.isoString);
                  const isSimulatedToday = cell.isoString === getTodayISOString();
                  
                  // Color calculation based on tasks state
                  let cellAccentStyle = '';
                  let statusBorderColor = '';

                  if (dayTasks.length > 0) {
                    const uncompleted = dayTasks.filter(t => !t.completed);
                    const completed = dayTasks.filter(t => t.completed);

                    if (uncompleted.length > 0) {
                      // Check if any uncompleted task in this cell is overdue
                      const hasOverdue = uncompleted.some(t => {
                        const alert = calculateAlertDetails(t.dueDate, t.completed);
                        return alert.level === 'OVERDUE';
                      });
                      if (hasOverdue) {
                        cellAccentStyle = settings.darkMode ? 'bg-red-500/10 text-red-400 font-medium' : 'bg-red-50 text-red-700 font-semibold';
                        statusBorderColor = settings.darkMode ? 'border-red-500/40' : 'border-red-250';
                      } else {
                        cellAccentStyle = settings.darkMode ? 'bg-amber-500/10 text-amber-400 font-semibold' : 'bg-amber-50 text-amber-850 font-semibold';
                        statusBorderColor = settings.darkMode ? 'border-amber-500/40' : 'border-amber-250';
                      }
                    } else if (completed.length > 0) {
                      cellAccentStyle = settings.darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600 font-medium';
                      statusBorderColor = settings.darkMode ? 'border-emerald-500/30' : 'border-emerald-250';
                    }
                  } else if (statutoryItems.length > 0) {
                    // Highlight days with standard statutory regulations via styled dashed border outline
                    cellAccentStyle = settings.darkMode ? 'bg-sky-950/15 text-sky-300' : 'bg-sky-50/50 text-sky-850';
                    statusBorderColor = settings.darkMode ? 'border-sky-500/25 border-dashed' : 'border-sky-200 border-dashed';
                  }

                  const defaultBorder = settings.darkMode ? 'border-zinc-800' : 'border-sky-100';
                  const defaultBg = settings.darkMode ? 'bg-zinc-950/30' : 'bg-white';

                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedDayISO(cell.isoString);
                        // Open creation wizard quickly
                        if (dayTasks.length === 0 && statutoryItems.length === 0) {
                          openCreateModal(cell.isoString);
                        }
                      }}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, cell.isoString)}
                      className={`min-h-[95px] sm:min-h-[125px] p-2 rounded-lg border cursor-pointer hover:border-sky-400 flex flex-col justify-between transition-all ${
                        cell.isCurrentMonth ? '' : 'opacity-30'
                      } ${
                        isSimulatedToday 
                          ? settings.darkMode ? 'bg-zinc-900 border-red-500 ring-2 ring-red-500/20' : 'bg-red-50 border-red-500 ring-2 ring-red-500/20' 
                          : statusBorderColor || defaultBorder
                      } ${cellAccentStyle || defaultBg}`}
                      title={
                        (dayTasks.length > 0 ? `${dayTasks.length} nghiệp vụ thực tế. ` : '') +
                        (statutoryItems.length > 0 ? `${statutoryItems.length} cảnh báo pháp định.` : '')
                      }
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-black ${isSimulatedToday ? 'text-red-500 font-black' : settings.darkMode ? 'text-zinc-300' : 'text-slate-800'}`}>
                          {cell.dayNum}
                        </span>
                        {isSimulatedToday && (
                          <span className="text-[7px] px-1 bg-red-650 text-white rounded font-bold leading-tight uppercase scale-90 origin-right">Nay</span>
                        )}
                        {!isSimulatedToday && statutoryItems.length > 0 && dayTasks.length === 0 && (
                          <span className="text-[7.5px] px-0.5 bg-sky-500/20 text-sky-400 rounded leading-none shrink-0" title="Quy định pháp lý liên tục hằng tháng">⚖️ Luật</span>
                        )}
                      </div>

                      {/* Display task contents at warning date! */}
                      <div className="flex flex-col gap-1 mt-1.5 w-full text-left overflow-hidden">
                        
                        {/* 1. Actual tasks on this day */}
                        {dayTasks.map(t => {
                          const isOverdue = !t.completed && calculateAlertDetails(t.dueDate, t.completed).level === 'OVERDUE';
                          const isWarning = !t.completed && (
                            calculateAlertDetails(t.dueDate, t.completed).level === 'YELLOW' ||
                            calculateAlertDetails(t.dueDate, t.completed).level === 'ORANGE' ||
                            calculateAlertDetails(t.dueDate, t.completed).level === 'RED' ||
                            calculateAlertDetails(t.dueDate, t.completed).level === 'BLINKING'
                          );

                          let bgClr = '';
                          let txtClr = '';
                          if (t.completed) {
                            bgClr = settings.darkMode ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700';
                          } else if (isOverdue) {
                            bgClr = settings.darkMode ? 'bg-red-950/45 border-red-900/40 text-red-300 font-bold' : 'bg-red-50 border-red-200 text-red-600 font-semibold';
                          } else if (isWarning) {
                            bgClr = settings.darkMode ? 'bg-amber-950/40 border-amber-900/30 text-amber-300 font-medium' : 'bg-amber-50 border-amber-250 text-amber-700 font-medium';
                          } else {
                            bgClr = settings.darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700';
                          }

                          return (
                            <div
                              key={t.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(t);
                              }}
                              className={`text-[8px] sm:text-[8.5px] p-0.5 px-1 rounded border whitespace-normal break-words leading-tight transition-transform duration-100 hover:scale-[1.02] ${bgClr}`}
                              title={`[Thực tế] ${t.title}. Bấm để điều chỉnh.`}
                            >
                              <div className="flex flex-col">
                                <span className="font-semibold">{t.title}</span>
                                {t.assignedTo && (
                                  <div className={`mt-0.5 text-[7px] font-bold flex items-center gap-0.5 ${settings.darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>
                                    <span>👤 {employees.find(e => e.id === t.assignedTo)?.name}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {/* 2. Statutory recurring guide warns on this day (No database entry needed - automatic simulation) */}
                        {statutoryItems.map(stat => {
                          const alreadyCreated = dayTasks.some(t => t.group === stat.group);
                          if (alreadyCreated) return null; // Bỏ hoàn toàn mẫu cảnh báo khi đã có công việc thực tế được đăng ký
                          return (
                            <div
                              key={stat.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                openCreateModal(cell.isoString, {
                                  title: stat.title.replace('⚖️ ', ''),
                                  group: stat.group,
                                  notes: stat.notes
                                });
                              }}
                              className={`text-[8px] sm:text-[8.5px] p-0.5 px-1 rounded border border-dashed whitespace-normal break-words leading-tight transition-transform duration-100 hover:scale-[1.02] cursor-pointer ${
                                settings.darkMode ? 'bg-sky-950/10 border-sky-900/50 text-sky-400' : 'bg-sky-50/50 border-sky-200 text-sky-700 font-medium'
                              }`}
                              title={`[Cảnh báo Luật] ${stat.title}. Bấm để tự động tạo công việc cụ thể.`}
                            >
                              <div className="flex flex-col">
                                <span className="font-semibold italic">{stat.title}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-1 gap-6 mb-6">
              
              {/* KHU VỰC 2: BẢNG KANBAN TIẾN ĐỘ CÔNG VIỆC HÀNG NGÀY */}
              <div className={`p-4 rounded-xl border ${
                settings.darkMode ? 'bg-[#1a263c]/50 border-sky-900/40' : 'bg-white border-slate-200 shadow-xs'
              }`}>
                <div className={`flex flex-col md:flex-row md:items-center justify-between border-b pb-3 mb-4 gap-2 ${
                  settings.darkMode ? 'border-sky-950' : 'border-slate-150'
                }`}>
                  <div>
                    <h3 className={`font-black text-xs md:text-[13px] uppercase tracking-wider flex items-center gap-1.5 ${
                      settings.darkMode ? 'text-sky-100' : 'text-slate-900'
                    }`}>
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block animate-ping"></span>
                      <span>KHU VỰC 2: BẢNG KANBAN TIẾN ĐỘ CÔNG VIỆC HÀNG NGÀY TRỰC QUAN</span>
                    </h3>
                    <p className={`text-[10px] ${settings.darkMode ? 'text-zinc-450' : 'text-slate-500'} mt-0.5`}>
                      💡 Kéo thả thẻ công việc giữa các cột để cập nhật nhanh tiến độ. Bấm vào thẻ để thảo luận (Bình luận), đính kèm file, giao mốc việc.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openCreateModal()}
                      className="p-1 px-3 bg-red-650 hover:bg-red-550 text-white rounded font-bold text-[10px] transition uppercase cursor-pointer"
                    >
                      + Tạo việc đột xuất mới
                    </button>
                  </div>
                </div>

                {/* Kanban Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {(['TODO', 'DOING', 'PENDING', 'DONE'] as const).map(statusColumn => {
                    // Filter tasks for this column
                    const columnTasks = comprehensiveTasks.filter(t => {
                      const computedStatus = t.completed ? 'DONE' : (t.kanbanStatus || 'TODO');
                      return computedStatus === statusColumn;
                    });

                    // Styling for column headers
                    const colHeaders: Record<string, { title: string; color: string; bg: string; dot: string }> = {
                      'TODO': { title: 'Chưa thực hiện', color: 'text-zinc-500 dark:text-zinc-400', bg: 'bg-zinc-100 dark:bg-zinc-900/65', dot: 'bg-zinc-400' },
                      'DOING': { title: 'Đang thực hiện', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50/50 dark:bg-[#1a2035]/65', dot: 'bg-indigo-500' },
                      'PENDING': { title: 'Chờ xử lý / Check', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50/50 dark:bg-[#251f15]/65', dot: 'bg-amber-500 animate-pulse' },
                      'DONE': { title: 'Hồ sơ Hoàn thành', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50/50 dark:bg-[#12221e]/65', dot: 'bg-emerald-500' }
                    };

                    const styleInfo = colHeaders[statusColumn];

                    return (
                      <div
                        key={statusColumn}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleKanbanDrop(e, statusColumn)}
                        className={`p-3 rounded-xl border flex flex-col min-h-[360px] max-h-[480px] transition-all duration-150 ${
                          settings.darkMode 
                            ? 'bg-zinc-950/30 border-zinc-900/80 hover:border-zinc-800' 
                            : 'bg-slate-50/70 border-slate-205 hover:border-slate-300'
                        }`}
                      >
                        {/* Column Header */}
                        <div className="flex items-center justify-between mb-3 pb-1.5 border-b border-dashed dark:border-zinc-800 border-slate-200">
                          <div className="flex items-center space-x-1.5">
                            <span className={`w-2 h-2 rounded-full ${styleInfo.dot}`}></span>
                            <span className={`font-black text-xs uppercase tracking-wide ${styleInfo.color}`}>
                              {styleInfo.title}
                            </span>
                          </div>
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                            settings.darkMode ? 'bg-zinc-900 border-zinc-805 text-zinc-400' : 'bg-white border-slate-205 text-slate-500'
                          }`}>
                            {columnTasks.length}
                          </span>
                        </div>

                        {/* Column tasks scroll panel */}
                        <div className="space-y-2.5 overflow-y-auto pr-0.5 flex-1 select-none">
                          {columnTasks.length === 0 ? (
                            <div className="h-full py-16 flex flex-col items-center justify-center border border-dashed rounded-lg border-zinc-300/40 dark:border-zinc-850">
                              <span className={`text-[10px] italic font-mono ${settings.darkMode ? 'text-zinc-600' : 'text-slate-400'}`}>
                                Kéo việc vào đây
                              </span>
                            </div>
                          ) : (
                            columnTasks.map(task => {
                              const alert = calculateAlertDetails(task.dueDate, task.completed);
                              const groupColor = TASK_GROUP_COLORS[task.group];
                              
                              return (
                                <div
                                  key={task.id}
                                  draggable="true"
                                  onDragStart={(e) => handleDragStart(e, task.id)}
                                  onClick={() => setInteractingTask(task)}
                                  className={`p-3 rounded-lg border text-left cursor-grab active:cursor-grabbing hover:scale-[1.01] active:scale-[0.99] transition-all relative overflow-hidden group shadow-xs ${
                                    settings.darkMode 
                                      ? 'bg-zinc-950 border-zinc-850 hover:bg-zinc-900/60' 
                                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-slate-100/40 hover:shadow-md'
                                  }`}
                                  style={{
                                    borderLeft: `4px solid ${
                                      task.completed 
                                        ? '#10b981' 
                                        : alert.level === 'OVERDUE' 
                                          ? '#ef4444' 
                                          : alert.level === 'BLINKING' 
                                            ? '#f43f5e' 
                                            : task.priority === 'HIGH' 
                                              ? '#f97316' 
                                              : '#e4e4e7'
                                    }`
                                  }}
                                >
                                  {/* Task Tag Row */}
                                  <div className="flex items-center justify-between gap-1 mb-1.5 flex-wrap">
                                    <span className={`text-[8px] font-black tracking-wider px-1.5 py-0.2 rounded uppercase border ${groupColor.bg} ${groupColor.text} ${groupColor.border}`}>
                                      {TASK_GROUP_LABELS[task.group]}
                                    </span>
                                    
                                    <div className="flex items-center space-x-1">
                                      {/* Complete button */}
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleToggleComplete(task);
                                        }}
                                        className={`p-1 rounded transition-all duration-150 cursor-pointer ${
                                          task.completed 
                                            ? 'bg-emerald-500 text-white' 
                                            : 'bg-zinc-100 hover:bg-emerald-500 hover:text-white dark:bg-zinc-900 dark:hover:bg-emerald-605 text-zinc-500'
                                        }`}
                                        title={task.completed ? "Đánh dấu Chưa hoàn thành" : "Đánh dấu Hoàn thành"}
                                      >
                                        <Check className="w-2.5 h-2.5" />
                                      </button>

                                      {/* Delete button */}
                                      {!task.id.startsWith('virtual') && (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteTask(task.id, task.title);
                                          }}
                                          className="p-1 rounded bg-zinc-105 hover:bg-red-500 hover:text-white dark:bg-zinc-900 dark:hover:bg-red-600 text-zinc-500 transition-all duration-150 cursor-pointer"
                                          title="Xóa công việc"
                                        >
                                          <Trash2 className="w-2.5 h-2.5" />
                                        </button>
                                      )}

                                      {!task.completed && (
                                        <span className={`text-[8px] font-bold font-mono px-1 py-0.2 rounded border uppercase tracking-wider ${alert.badgeClass}`}>
                                          {alert.daysLeft !== null && alert.daysLeft < 0 ? 'Trễ ' : 'Còn '}{Math.abs(alert.daysLeft ?? 0)} ngày
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Task Title */}
                                  <h4 className={`font-bold text-xs leading-snug tracking-tight mb-2 select-text ${
                                    task.completed 
                                      ? 'line-through text-slate-400 dark:text-zinc-650' 
                                      : settings.darkMode ? 'text-zinc-150 group-hover:text-cyan-400' : 'text-slate-800'
                                  }`}>
                                    {task.title}
                                  </h4>

                                  {/* Client block */}
                                  {task.client && (
                                    <p className={`text-[9.5px] font-medium font-mono mb-2 truncate ${settings.darkMode ? 'text-cyan-500' : 'text-slate-600'}`}>
                                      🤝 KH: {task.client}
                                    </p>
                                  )}

                                  {/* Meta counts (comments & attachments) */}
                                  <div className="flex items-center justify-between border-t pt-2 dark:border-zinc-850/80 border-slate-100 mt-2 select-none text-[9.5px]">
                                    <div className="flex items-center space-x-2 text-zinc-400 dark:text-zinc-550">
                                      {task.comments && task.comments.length > 0 && (
                                        <span title="Bình luận trao đổi" className="flex items-center gap-0.5">
                                          💬 {task.comments.length}
                                        </span>
                                      )}
                                      {task.attachments && task.attachments.length > 0 && (
                                        <span title="File đính kèm hồ sơ" className="flex items-center gap-0.5">
                                          📎 {task.attachments.length}
                                        </span>
                                      )}
                                      {task.priority === 'HIGH' && (
                                        <span title="Ưu tiên cao" className="text-red-500 font-bold">
                                          ⚠️ CAO
                                        </span>
                                      )}
                                    </div>

                                    {/* Assigned To badge */}
                                    {task.assignedTo ? (
                                      <span className={`text-[8.5px] font-mono font-black px-1.5 py-0.2 rounded-full border ${
                                        settings.darkMode ? 'bg-cyan-950/30 text-cyan-400 border-cyan-800/40' : 'bg-cyan-50 text-cyan-700 border-cyan-200'
                                      }`} title="Người chịu trách nhiệm chính">
                                        👤 {employees.find(e => e.id === task.assignedTo)?.name?.split(' ').pop()}
                                      </span>
                                    ) : (
                                      <span className="text-[8.5px] italic text-zinc-400 dark:text-zinc-600">Chưa giao</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* KHU VỰC 3: BAN LIÊN TỤC THEO DÕI HẠN DEADLINE (COUNTDOWN REALTIME) */}
              <div className={`p-4 rounded-xl border ${
                settings.darkMode ? 'bg-[#1a263c]/50 border-sky-900/40' : 'bg-white border-slate-200 shadow-xs'
              }`}>
                <div className={`flex items-center justify-between border-b pb-2.5 mb-3.5 ${
                  settings.darkMode ? 'border-sky-950' : 'border-slate-150'
                }`}>
                  <div>
                    <h3 className={`font-black text-xs md:text-[13px] uppercase tracking-wider flex items-center gap-1.5 ${
                      settings.darkMode ? 'text-sky-100' : 'text-slate-900'
                    }`}>
                      <AlertTriangle className={`w-4 h-4 animate-pulse ${settings.darkMode ? 'text-orange-400' : 'text-orange-605'}`} />
                      <span>KHU VỰC 3: GIÁM SÁT DEADLINE KHẨN CẤP (REALTIME COUNTDOWN)</span>
                    </h3>
                    <p className={`text-[10px] ${settings.darkMode ? 'text-zinc-450' : 'text-slate-500'} mt-0.5`}>
                      ⏰ Đếm ngược thời gian thực (Giờ:Phút:Giây) cho mốc tờ khai/dossier gần nhất. Hỗ trợ kích hoạt Gửi SMS / Email nhắc việc tự động cho nhân viên & khách hàng.
                    </p>
                  </div>
                  
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    settings.darkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-slate-100 border-slate-200 text-slate-705'
                  }`}>
                    Live Active Mode
                  </span>
                </div>

                {/* Deadlines Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
                  {([
                    { type: 'KHACH_HANG', label: 'Deadline Khách Hàng', icon: '🤝', color: 'border-l-[#3b82f6]' },
                    { type: 'HO_SO_THUE', label: 'Hồ sơ Tờ khai Thuế', icon: '📂', color: 'border-l-[#ef4444]' },
                    { type: 'BHXH', label: 'Nghĩa vụ BHXH', icon: '🛡️', color: 'border-l-[#10b981]' },
                    { type: 'LAO_DONG', label: 'Hồ sơ Lao Động', icon: '💼', color: 'border-l-[#f59e0b]' },
                    { type: 'PHAP_LY', label: 'Báo cáo Pháp Lý', icon: '⚖️', color: 'border-l-[#8b5cf6]' }
                  ] as const).map(dlBoard => {
                    
                    // Filter non-completed tasks matching this deadlineType or associated group (fallback compatibility)
                    const matchedDeadlineTasks = comprehensiveTasks.filter(t => {
                      if (t.completed) return false;
                      if (t.deadlineType === dlBoard.type) return true;
                      
                      // Fallback maps
                      if (dlBoard.type === 'HO_SO_THUE' && (t.group === 'THUE' || t.group === 'KE_TOAN')) return true;
                      if (dlBoard.type === 'BHXH' && t.group === 'BAO_HIEM') return true;
                      if (dlBoard.type === 'LAO_DONG' && t.group === 'LAO_DONG') return true;
                      
                      return false;
                    });

                    // Sort to find the earliest deadline
                    const sortedMatchedTasks = [...matchedDeadlineTasks].sort((a, b) => {
                      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                    });

                    const imminentTask = sortedMatchedTasks[0];

                    // Countdown calculation
                    let countdownText = '-- : -- : -- : --';
                    let scaleLevelPr: 'EXP' | 'WAR' | 'OK' = 'OK';
                    let progressTaskName = 'Hoàn hảo - Không có hạn việc';
                    let alertHoursNum = 999;

                    if (imminentTask) {
                      progressTaskName = imminentTask.title;
                      const nowTime = currentTime.getTime();
                      // Setup date string at 09:00 AM (custom alert time or standard)
                      const targetDueStr = `${imminentTask.dueDate}T${imminentTask.customAlertTime || '09:00'}:00`;
                      const targetTime = new Date(targetDueStr).getTime();
                      const diffMs = targetTime - nowTime;

                      if (diffMs <= 0) {
                        countdownText = '⚠️ QUÁ HẠN NỘP BÁO CÁO';
                        scaleLevelPr = 'EXP';
                      } else {
                        const totalSec = Math.floor(diffMs / 1000);
                        const days = Math.floor(totalSec / (24 * 3600));
                        const hours = Math.floor((totalSec % (24 * 3600)) / 3600);
                        const mins = Math.floor((totalSec % 3600) / 60);
                        const secs = totalSec % 60;
                        countdownText = `${days}đ : ${hours.toString().padStart(2, '0')}g : ${mins.toString().padStart(2, '0')}p : ${secs.toString().padStart(2, '0')}s`;
                        
                        alertHoursNum = days * 24 + hours;

                        if (days <= 3) {
                          scaleLevelPr = 'EXP'; // urgent
                        } else if (days <= 7) {
                          scaleLevelPr = 'WAR'; // important
                        } else {
                          scaleLevelPr = 'OK'; // regular
                        }
                      }
                    }

                    // Simulated Reminder dispatchers
                    const executeSimulationAlert = (deliveryType: 'SMS' | 'EMAIL' | 'NOTIFICATION') => {
                      if (!imminentTask) {
                        showSuccess('Tuyệt vời! Không có deadline việc nào để gửi nhắc nhở.');
                        return;
                      }

                      const staffName = imminentTask.assignedTo 
                        ? employees.find(e => e.id === imminentTask.assignedTo)?.name || 'Chuyên viên quản lý'
                        : 'Toàn bộ Chuyên viên';
                      
                      const clientName = imminentTask.client || 'Hộ kinh doanh / Quý Doanh nghiệp';

                      if (deliveryType === 'SMS') {
                        showSuccess(`💬 [SMS SENT] Thao tác gửi tin nhắn Brandname BrandTax đến số khách hàng "${clientName}" và Phụ trách "${staffName}". Nội dung: "Cảnh báo hạn chót: ${imminentTask.title} cận hạn nộp báo cáo ${imminentTask.dueDate}!"`);
                      } else if (deliveryType === 'EMAIL') {
                        showSuccess(`✉️ [EMAIL DISPATCHED] Thư nhắc nhở từ động được gửi thành công đến địa chỉ Khách hàng và "${staffName}". Nội dung đính kèm danh mục tài liệu quy định.`);
                      } else {
                        showSuccess(`🔔 [APP NOTIFICATION BROADCASTED] Hệ thống ghi nhận phát thông báo đẩy thành công đến ứng dụng Chuyên viên di động, mã phản hồi: 200 OK.`);
                      }

                      if (settings.soundEnabled) playAlertSound('beep');
                    };

                    return (
                      <div
                        key={dlBoard.type}
                        className={`p-3 rounded-lg border-l-4 border relative overflow-hidden transition-all ${
                          settings.darkMode 
                            ? 'bg-zinc-950/70 border-zinc-850 hover:bg-zinc-900/40' 
                            : 'bg-slate-50/70 border-slate-205 hover:bg-slate-50 shadow-xs'
                        } ${dlBoard.color}`}
                      >
                        {/* Title and Icon */}
                        <div className="flex items-center space-x-1 mb-1 shadow-2xs pb-1 border-b dark:border-zinc-900 border-slate-200">
                          <span className="text-xs">{dlBoard.icon}</span>
                          <span className={`font-black text-[10.5px] uppercase tracking-wide truncate ${settings.darkMode ? 'text-zinc-200' : 'text-slate-805'}`}>
                            {dlBoard.label}
                          </span>
                        </div>

                        {/* Priority Badge */}
                        <div className="mb-2">
                          {!imminentTask ? (
                            <span className="text-[8px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold uppercase px-1.5 py-0.2 rounded">
                              ✓ Hoàn thành
                            </span>
                          ) : scaleLevelPr === 'EXP' ? (
                            <span className="text-[8px] bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 font-black uppercase px-1.5 py-0.2 rounded animate-pulse">
                              🔥 KHẨN CẤP
                            </span>
                          ) : scaleLevelPr === 'WAR' ? (
                            <span className="text-[8px] bg-amber-105 dark:bg-amber-955 text-amber-805 dark:text-amber-400 font-black uppercase px-1.5 py-0.2 rounded">
                              ⚡ QUAN TRỌNG
                            </span>
                          ) : (
                            <span className="text-[8px] bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-400 font-extrabold uppercase px-1.5 py-0.2 rounded">
                              💡 BÌNH THƯỜNG
                            </span>
                          )}
                        </div>

                        {/* Countdown display */}
                        <div className="my-2.5 text-center">
                          <div className={`font-mono text-[12.5px] md:text-[13.5px] font-black tracking-wider ${
                            !imminentTask 
                              ? 'text-zinc-405 dark:text-zinc-600' 
                              : scaleLevelPr === 'EXP' 
                                ? 'text-red-500 animate-pulse' 
                                : scaleLevelPr === 'WAR' 
                                  ? 'text-amber-500' 
                                  : 'text-zinc-800 dark:text-zinc-200'
                          }`}>
                            {countdownText}
                          </div>
                        </div>

                        {/* Approaching task info */}
                        <div className="mb-3.5 min-h-[36px] max-h-[36px] overflow-hidden">
                          <p className={`text-[9.5px] font-mono leading-tight line-clamp-2 ${settings.darkMode ? 'text-zinc-500' : 'text-slate-500'}`}>
                            {imminentTask ? `Sắp tới: ${progressTaskName}` : 'Chưa có sự vụ pháp lý sắp tới'}
                          </p>
                        </div>

                        {/* Reminder dispatch controls */}
                        <div className="grid grid-cols-3 gap-1 pt-2 border-t dark:border-zinc-900 border-slate-200">
                          <button
                            onClick={() => executeSimulationAlert('EMAIL')}
                            disabled={!imminentTask}
                            className={`p-1 py-1.2 rounded text-[8.5px] font-black tracking-wide uppercase cursor-pointer text-center transition ${
                              imminentTask 
                                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs' 
                                : 'bg-slate-200 dark:bg-zinc-900 opacity-30 text-zinc-400 hover:cursor-not-allowed'
                            }`}
                            title="Gửi Email Nhắc viễn tự động"
                          >
                            ✉️ EMAIL
                          </button>
                          <button
                            onClick={() => executeSimulationAlert('SMS')}
                            disabled={!imminentTask}
                            className={`p-1 py-1.2 rounded text-[8.5px] font-black tracking-wide uppercase cursor-pointer text-center transition ${
                              imminentTask 
                                ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-xs' 
                                : 'bg-slate-200 dark:bg-zinc-900 opacity-30 text-zinc-400 hover:cursor-not-allowed'
                            }`}
                            title="Gửi SMS thương hiệu"
                          >
                            💬 SMS
                          </button>
                          <button
                            onClick={() => executeSimulationAlert('NOTIFICATION')}
                            disabled={!imminentTask}
                            className={`p-1 py-1.2 rounded text-[8.5px] font-black tracking-wide uppercase cursor-pointer text-center transition ${
                              imminentTask 
                                ? 'bg-red-650 hover:bg-red-550 text-white shadow-xs' 
                                : 'bg-slate-200 dark:bg-zinc-900 opacity-30 text-zinc-400 hover:cursor-not-allowed'
                            }`}
                            title="Phát thông báo đẩy mobile"
                          >
                            🔔 NHẮC
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* KHU VỰC 4: LỊCH CÔNG TÁC PHÂN BỔ ĐA CHIỀU (WEEK / MONTH / YEAR & GOOGLE / OUTLOOK SYNC) */}
            <div className={`p-5 rounded-xl border ${
              settings.darkMode ? 'bg-[#1a263c]/50 border-sky-900/40' : 'bg-white border-slate-200 shadow-md'
            }`}>
              {/* Header block with Sync Controls and View Selector */}
              <div className="flex flex-col xl:flex-row xl:items-center justify-between border-b pb-4 mb-4 gap-4">
                <div>
                  <h3 className={`font-black text-xs md:text-[13px] uppercase tracking-wider flex items-center gap-1.5 ${
                    settings.darkMode ? 'text-sky-100' : 'text-slate-900'
                  }`}>
                    <Clock className="w-4 h-4 text-red-500 animate-pulse" />
                    <span>KHU VỰC 4: LỊCH TRÌNH CÔNG TÁC PHÂN BỔ ĐA CHIỀU & THEO SÁT LỘ TRÌNH DI CHUYỂN</span>
                  </h3>
                  <p className={`text-[10px] mt-0.5 ${settings.darkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
                    📅 Hỗ trợ theo dõi ai đi đâu, làm việc gì, ở khách hàng nào, chi tiết giờ giấc di chuyển. Đồng bộ cập nhật hai kênh chính: Google Calendar & Microsoft Outlook.
                  </p>
                </div>

                {/* Controls toolbar */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Sync Google & Outlook */}
                  <div className="flex items-center gap-1.5 border-r pr-2.5 border-slate-200 dark:border-zinc-805">
                    <button
                      onClick={() => handleSyncCalendar('GOOGLE')}
                      disabled={isSyncingCalendar}
                      className={`p-1.5 px-3 rounded font-mono text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                        isSyncingCalendar 
                          ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50' 
                          : 'bg-emerald-650 hover:bg-emerald-555 text-white shadow-xs'
                      }`}
                      title="Đồng bộ lịch công tác với tài khoản Google Calendar"
                    >
                      {isSyncingCalendar ? (
                        <span className="w-2.5 h-2.5 border-2 border-white/35 border-t-white rounded-full animate-spin"></span>
                      ) : '🤖'} GOOGLE CALENDAR
                    </button>
                    
                    <button
                      onClick={() => handleSyncCalendar('OUTLOOK')}
                      disabled={isSyncingCalendar}
                      className={`p-1.5 px-3 rounded font-mono text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                        isSyncingCalendar 
                          ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50' 
                          : 'bg-blue-650 hover:bg-blue-555 text-white shadow-xs'
                      }`}
                      title="Đồng bộ lịch công tác với hộp thư Microsoft Outlook Calendar"
                    >
                      {isSyncingCalendar ? (
                        <span className="w-2.5 h-2.5 border-2 border-white/35 border-t-white rounded-full animate-spin"></span>
                      ) : '📧'} OUTLOOK SYNC
                    </button>
                  </div>

                  {/* Scalar Switcher buttons */}
                  <div className="bg-slate-100 dark:bg-zinc-950 p-1 rounded-lg border dark:border-zinc-800 border-slate-200 flex items-center">
                    {(['WEEK', 'MONTH', 'YEAR'] as const).map(vType => (
                      <button
                        key={vType}
                        onClick={() => setCalendarViewType(vType)}
                        className={`p-1 px-3.5 rounded text-[10px] font-black tracking-wider uppercase transition cursor-pointer ${
                          calendarViewType === vType
                            ? settings.darkMode 
                              ? 'bg-sky-950/60 text-sky-450 border border-sky-900 font-bold shadow-xs' 
                              : 'bg-white text-slate-850 border border-slate-200 font-bold shadow-xs'
                            : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-200'
                        }`}
                      >
                        {vType === 'WEEK' ? 'Tuần' : vType === 'MONTH' ? 'Tháng' : 'Năm'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* View Rendering Matrix */}
              {calendarViewType === 'WEEK' && (
                <div>
                  <div className="flex items-center justify-between mb-3.5 gap-2 flex-wrap">
                    <span className={`text-[10px] font-mono ${settings.darkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
                      📍 Hiển thị tuần tâm điểm chứa ngày <strong className="font-bold text-red-500">{formatDateLabel(selectedDayISO)}</strong>
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => {
                          const d = new Date(selectedDayISO);
                          d.setDate(d.getDate() - 7);
                          setSelectedDayISO(d.toISOString().split('T')[0]);
                        }}
                        className={`p-1 px-3.5 rounded font-mono text-[10px] font-black border transition cursor-pointer ${
                          settings.darkMode
                            ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                            : 'bg-white border-slate-200 text-slate-705 hover:bg-slate-50 shadow-xs'
                        }`}
                      >
                        ◄ Tuần trước
                      </button>
                      <button
                        onClick={() => {
                          const d = new Date(selectedDayISO);
                          d.setDate(d.getDate() + 7);
                          setSelectedDayISO(d.toISOString().split('T')[0]);
                        }}
                        className={`p-1 px-3.5 rounded font-mono text-[10px] font-black border transition cursor-pointer ${
                          settings.darkMode
                            ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                            : 'bg-white border-slate-200 text-slate-705 hover:bg-slate-50 shadow-xs'
                        }`}
                      >
                        Tuần sau ►
                      </button>
                    </div>
                  </div>

                  {/* Mon to Sun columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-7 gap-2.5 overflow-x-auto pb-1">
                    {weeklyDays.map((day, dIdx) => {
                      const dayTasksList = tasksByDate[day.isoString] || [];
                      const isCurrentDayFocused = selectedDayISO === day.isoString;
                      const isActualTimelineDay = day.isoString === getTodayISOString();

                      let headerColorStyle = settings.darkMode 
                        ? 'text-zinc-405 bg-zinc-950/60 border-zinc-850' 
                        : 'text-slate-700 bg-slate-50 border-slate-205';
                      
                      if (isActualTimelineDay) {
                        headerColorStyle = settings.darkMode
                          ? 'text-yellow-405 bg-red-950/20 border-red-900/50 font-black'
                          : 'text-amber-800 bg-amber-50 border-amber-205 font-bold';
                      } else if (isCurrentDayFocused) {
                        headerColorStyle = settings.darkMode
                          ? 'text-red-400 bg-zinc-900 border-zinc-705 font-bold'
                          : 'text-red-700 bg-red-50 border-red-205 font-bold';
                      }

                      return (
                        <div
                          key={dIdx}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, day.isoString)}
                          onClick={() => setSelectedDayISO(day.isoString)}
                          className={`min-h-[220px] p-2.5 rounded-xl border text-center transition flex flex-col justify-between cursor-pointer ${
                            isCurrentDayFocused
                              ? settings.darkMode ? 'border-red-500 bg-red-950/5 ring-1 ring-red-500/20' : 'border-red-500 bg-red-50/25 ring-1 ring-red-300'
                              : settings.darkMode ? 'border-zinc-850 hover:border-zinc-755 bg-zinc-950/20 shadow-xs' : 'border-slate-205 hover:border-slate-300 bg-white shadow-xs'
                          }`}
                        >
                          <div>
                            {/* Day Header */}
                            <div className={`p-1.5 text-[9.5px] rounded border tracking-tight mb-2.5 uppercase ${headerColorStyle}`}>
                              <div>{day.label}</div>
                              <div className="text-[12px] font-mono font-black mt-0.5">{day.dateNum}/{day.monthNum}</div>
                            </div>

                            {/* Task List items */}
                            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-0.5">
                              {dayTasksList.length === 0 ? (
                                <span className={`text-[9.5px] block py-6 font-mono select-none ${settings.darkMode ? 'text-zinc-700' : 'text-slate-350'}`}>Trống</span>
                              ) : (
                                dayTasksList.map(task => {
                                  const alert = calculateAlertDetails(task.dueDate, task.completed);
                                  return (
                                    <div
                                      key={task.id}
                                      draggable="true"
                                      onDragStart={(e) => handleDragStart(e, task.id)}
                                      onClick={(e) => { e.stopPropagation(); openEditModal(task); }}
                                      className={`relative group/task p-2 pl-2 pr-6 rounded text-[9.5px] text-left leading-tight cursor-grab active:cursor-grabbing border hover:scale-[1.01] transition-transform duration-100 shadow-3xs ${
                                        task.completed
                                          ? settings.darkMode ? 'border-emerald-950 bg-emerald-950/15 text-emerald-400' : 'border-emerald-150 bg-emerald-50 text-emerald-800'
                                          : alert.level === 'OVERDUE'
                                            ? settings.darkMode ? 'border-red-950 bg-red-950/30 text-red-350 font-bold animate-pulse' : 'border-red-155 bg-red-50 text-red-700 font-semibold shadow-sm'
                                            : settings.darkMode ? 'border-zinc-850 bg-zinc-950/80 text-zinc-300 hover:bg-zinc-900' : 'border-slate-200 bg-white hover:border-slate-250 text-slate-800 hover:bg-slate-50/70 shadow-xs'
                                      }`}
                                      title={`Kéo thả đổi ca hoặc click chỉnh sửa. Công vụ: ${task.title}`}
                                    >
                                      <div>
                                        <div className={`font-bold line-clamp-2 leading-snug pr-0.5 ${task.completed ? 'line-through text-slate-400 dark:text-zinc-550' : ''}`}>
                                          {task.title}
                                        </div>
                                        
                                        {/* Client & destination attributes */}
                                        {task.client && (
                                          <div className="mt-1 text-[8px] font-mono font-medium truncate text-blue-550">
                                            🤝 {task.client}
                                          </div>
                                        )}
                                        {task.destination && (
                                          <div className={`mt-0.5 text-[8px] font-mono truncate ${settings.darkMode ? 'text-zinc-500' : 'text-slate-500'}`} title={`Địa bàn đi lại: ${task.destination}`}>
                                            📍 {task.destination}
                                          </div>
                                        )}
                                        {task.timeSlot && (
                                          <div className="mt-0.5 text-[8px] font-mono text-zinc-400 font-bold">
                                            ⏰ {task.timeSlot}
                                          </div>
                                        )}

                                        {task.assignedTo && (
                                          <div className={`mt-1 text-[8px] font-black flex items-center gap-0.5 ${settings.darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>
                                            <span>👤 {employees.find(e => e.id === task.assignedTo)?.name?.split(' ').pop()}</span>
                                          </div>
                                        )}
                                      </div>
                                      {!task.isVirtual && (
                                        <button
                                          draggable="false"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteTask(task.id, task.title);
                                          }}
                                          className={`absolute top-1 right-1 p-0.5 rounded transition opacity-0 group-hover/task:opacity-100 cursor-pointer ${
                                            settings.darkMode ? 'hover:bg-red-950/60 text-zinc-400 hover:text-red-400' : 'hover:bg-red-100 text-red-600'
                                          }`}
                                          title="Xóa công việc khỏi lịch"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      )}
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>

                          {/* Direct Click Add */}
                          <button
                            onClick={(e) => { e.stopPropagation(); openCreateModal(day.isoString); }}
                            className={`mt-2.5 w-full py-1 text-[8.5px] tracking-wider uppercase font-black rounded border cursor-pointer transition ${
                              settings.darkMode
                                ? 'bg-zinc-950 border-zinc-850 text-zinc-500 hover:border-zinc-755 hover:text-zinc-200'
                                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-800'
                            }`}
                          >
                            + Lịch trình
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MONTH VIEW: AGENDA SUMMARY LIST */}
              {calendarViewType === 'MONTH' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-mono font-bold ${settings.darkMode ? 'text-sky-350' : 'text-slate-650'}`}>
                      📅 NHẬT KÝ LỊCH TRÌNH CÔNG TÁC THÁNG {currMonth + 1} / {currYear}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => {
                          if (currMonth === 0) {
                            setCurrMonth(11);
                            setCurrYear(y => y - 1);
                          } else {
                            setCurrMonth(m => m - 1);
                          }
                        }}
                        className={`p-1 px-2.5 rounded font-mono text-[9px] font-black border transition cursor-pointer ${
                          settings.darkMode
                            ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-900'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        ◄ Tháng trước
                      </button>
                      <button
                        onClick={() => {
                          if (currMonth === 11) {
                            setCurrMonth(0);
                            setCurrYear(y => y + 1);
                          } else {
                            setCurrMonth(m => m + 1);
                          }
                        }}
                        className={`p-1 px-2.5 rounded font-mono text-[9px] font-black border transition cursor-pointer ${
                          settings.darkMode
                            ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-900'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Tháng sau ►
                      </button>
                    </div>
                  </div>

                  {/* Filter and categorize tasks of this current month */}
                  {(() => {
                    const monthTasks = comprehensiveTasks.filter(t => {
                      const d = new Date(t.dueDate);
                      return d.getMonth() === currMonth && d.getFullYear() === currYear;
                    });

                    // Sort
                    monthTasks.sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

                    if (monthTasks.length === 0) {
                      return (
                        <div className="py-12 text-center border border-dashed rounded-xl dark:border-zinc-800 border-slate-200">
                          <p className={`text-xs italic ${settings.darkMode ? 'text-zinc-600' : 'text-slate-400'}`}>
                            Chưa ghi nhận hoạt động công tác hay di chuyển nào trong Tháng {currMonth + 1} / {currYear}.
                          </p>
                          <button
                            onClick={() => openCreateModal()}
                            className="mt-3 text-[10px] bg-red-650 hover:bg-red-550 text-white rounded font-bold px-3 py-1 cursor-pointer transition uppercase"
                          >
                            + Đăng ký sự vụ mới
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div className="border rounded-xl divide-y dark:divide-zinc-900 divide-slate-200 max-h-[360px] overflow-y-auto pr-1">
                        {monthTasks.map(t => {
                          const alert = calculateAlertDetails(t.dueDate, t.completed);
                          return (
                            <div 
                              key={t.id} 
                              onClick={() => openEditModal(t)}
                              className="p-3 text-left transition flex flex-col md:flex-row md:items-center justify-between gap-2.5 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-zinc-900/20"
                            >
                              <div className="flex items-start gap-2.5">
                                <span className={`font-mono text-[11px] font-black px-2 py-0.5 rounded border mt-0.5 ${
                                  settings.darkMode ? 'bg-zinc-950 text-zinc-300 border-zinc-800' : 'bg-slate-100 text-slate-700 border-slate-205'
                                }`}>
                                  {t.dueDate}
                                </span>
                                <div>
                                  <h5 className={`text-xs font-black tracking-tight ${t.completed ? 'line-through text-slate-400' : settings.darkMode ? 'text-zinc-200' : 'text-slate-800'}`}>
                                    {t.title}
                                  </h5>
                                  <div className="flex flex-wrap gap-2.5 mt-1 text-[9px] font-mono text-zinc-400">
                                    {t.client && <span className="text-blue-500 font-bold">🤝 Khách hàng: {t.client}</span>}
                                    {t.destination && <span className="text-zinc-400">📍 Điểm đến: {t.destination}</span>}
                                    {t.timeSlot && <span className="text-amber-500 font-bold">⏰ Ca: {t.timeSlot}</span>}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                                {t.assignedTo && (
                                  <span className={`text-[8.5px] font-mono font-medium px-2 py-0.5 border rounded-full ${
                                    settings.darkMode ? 'bg-cyan-950/20 border-cyan-900 text-cyan-400' : 'bg-[#e0f2fe] border-[#bae6fd] text-sky-850'
                                  }`}>
                                    👤 Phụ trách: {employees.find(e => e.id === t.assignedTo)?.name}
                                  </span>
                                )}
                                <span className={`text-[8.5px] px-2 py-0.5 rounded border tracking-wider uppercase font-bold ${alert.badgeClass}`}>
                                  {t.completed ? 'Hoàn thành' : alert.daysLeft !== null && alert.daysLeft < 0 ? 'Quá hạn' : 'Đang xử lý'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* YEAR VIEW: 12 BENTO BOCKS */}
              {calendarViewType === 'YEAR' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-mono font-extrabold uppercase ${settings.darkMode ? 'text-zinc-300' : 'text-slate-800'}`}>
                      🗓️ TỔNG QUAN PHÂN BIỆT LỊCH QUYẾT TOÁN CẢ NĂM {currYear}
                    </span>
                    <span className="text-[9.5px] font-mono italic text-zinc-400">
                      Bấm vào từng bento tháng để lọc nhanh báo cáo hoặc chuyển giao diện.
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {Array.from({ length: 12 }).map((_, mIdx) => {
                      const mTasks = comprehensiveTasks.filter(t => {
                        const d = new Date(t.dueDate);
                        return d.getMonth() === mIdx && d.getFullYear() === currYear;
                      });

                      const completedCount = mTasks.filter(t => t.completed).length;
                      const activeCount = mTasks.length - completedCount;
                      const isFocusedMonth = currMonth === mIdx;

                      const pct = mTasks.length > 0 ? Math.round((completedCount / mTasks.length) * 100) : 100;

                      return (
                        <div
                          key={mIdx}
                          onClick={() => {
                            setCurrMonth(mIdx);
                            setCalendarViewType('WEEK');
                            showSuccess(`Đã định vị trọng điểm sang Tháng ${mIdx + 1}!`);
                          }}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all hover:scale-[1.01] ${
                            isFocusedMonth
                              ? settings.darkMode 
                                ? 'bg-sky-950/20 border-sky-450 shadow-sky-500/5' 
                                : 'bg-red-50/40 border-red-404 shadow-sm'
                              : settings.darkMode
                                ? 'bg-zinc-950/40 border-zinc-850 hover:bg-zinc-900/60'
                                : 'bg-slate-50/50 border-slate-205 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1 pb-1 border-b dark:border-zinc-900 border-dashed border-slate-200">
                            <span className={`text-xs font-black ${isFocusedMonth ? 'text-rose-500' : settings.darkMode ? 'text-zinc-200' : 'text-slate-800'}`}>
                              Tháng {mIdx +1}
                            </span>
                            <span className="text-[9px] font-mono font-bold dark:text-zinc-400 text-slate-500">
                              {mTasks.length} việc
                            </span>
                          </div>

                          <div className="space-y-1.5 my-2">
                            <div className="flex justify-between text-[9px] font-mono">
                              <span className="text-emerald-500">✓ {completedCount}</span>
                              <span className="text-red-500">⚡ {activeCount}</span>
                            </div>

                            {/* Mini progress bar */}
                            <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${pct === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                style={{ width: `${pct}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="text-[8.5px] font-mono dark:text-zinc-400 text-slate-700 italic text-center w-full">
                            Tỉ lệ duyệt: {pct}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>



            {/* KHU VỰC 5: PHÂN CÔNG ĐỘT XUẤT & PHÒNG QUẢN TRỊ NHÂN SỰ ĐẠI LÝ */}
            <div className={`p-4 rounded-xl border ${
              settings.darkMode ? 'bg-[#18263e]/50 border-sky-900/40' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2 border-b pb-3 border-slate-200 dark:border-zinc-800">
                <div>
                  <h3 className={`font-black text-xs md:text-[13px] uppercase tracking-wider flex items-center gap-1.5 ${
                    settings.darkMode ? 'text-sky-100' : 'text-slate-900'
                  }`}>
                    <Users className="w-4 h-4 text-red-500" />
                    <span>KHU VỰC 5: QUẢN LÝ NHÂN SỰ & ỦY THÁC CÔNG VIỆC ĐỘT XUẤT</span>
                  </h3>
                </div>
                <button
                  onClick={openCreateEmployeeModal}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-black rounded-lg text-xs font-black tracking-wider uppercase transition inline-flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-black" />
                  <span>THÊM NHÂN SỰ</span>
                </button>
              </div>

              {employees.length === 0 ? (
                <div className={`text-center py-10 rounded-xl border border-dashed flex flex-col items-center justify-center ${settings.darkMode ? 'border-zinc-800 text-zinc-500 bg-zinc-950/20' : 'border-slate-250 text-slate-400 bg-slate-50/50'}`}>
                  <UserCheck className="w-10 h-10 mb-2 opacity-60 text-red-500" />
                  <p className="text-xs font-bold font-mono tracking-wide mb-1 text-slate-705 dark:text-zinc-300">CHƯA CÓ NHÂN SỰ ĐẠI LÝ THUẾ NÀO</p>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-500">Khởi tạo nhân sự để phân công nhiệm vụ pháp lý đột xuất & định kỳ</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {employees.map(emp => {
                    const assignedTasks = tasks.filter(t => t.assignedTo === emp.id);
                    const pendingTasks = assignedTasks.filter(t => !t.completed);
                    return (
                      <div
                        key={emp.id}
                        className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                          settings.darkMode 
                            ? 'bg-zinc-950/40 border-zinc-800/80 hover:border-zinc-700' 
                            : 'bg-slate-50/50 border-slate-200 hover:border-slate-350 shadow-xs'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-9 h-9 rounded-full font-black text-xs flex items-center justify-center ${
                                settings.darkMode ? 'bg-zinc-900 text-cyan-400 border border-zinc-800' : 'bg-slate-200 text-slate-705'
                              }`}>
                                {emp.name.split(' ').pop()?.substring(0, 2).toUpperCase() || '👤'}
                              </div>
                              <div className="text-left">
                                <h4 className={`font-black text-sm tracking-tight ${settings.darkMode ? 'text-zinc-200' : 'text-slate-850'}`}>
                                  {emp.name}
                                </h4>
                                <p className={`text-[10px] uppercase font-bold font-mono tracking-wider ${settings.darkMode ? 'text-zinc-450' : 'text-slate-500'}`}>
                                  📌 {emp.role}
                                </p>
                              </div>
                            </div>

                            <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded font-mono border uppercase shrink-0 ${
                              emp.status === 'ACTIVE'
                                ? settings.darkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : settings.darkMode ? 'bg-zinc-800 text-zinc-400 border-zinc-700' : 'bg-slate-100 text-slate-500 border-slate-205'
                            }`}>
                              {emp.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm vắng'}
                            </span>
                          </div>

                          <div className={`mt-3 py-1.5 px-2 rounded-lg text-[11px] space-y-1 ${
                            settings.darkMode ? 'bg-[#0f172a] text-zinc-405' : 'bg-slate-105 text-slate-600'
                          }`}>
                            <div className="flex items-center justify-between">
                              <span>📞 Điện thoại:</span>
                              <span className="font-semibold font-mono">{emp.phone || 'Chưa cập nhật'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>📧 Email:</span>
                              <span className="font-semibold select-all font-mono truncate max-w-[150px]">{emp.email || 'Chưa cập nhật'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-150 dark:border-zinc-850 flex items-center justify-between">
                          <div className="text-left font-mono">
                            <span className={`text-[9px] block font-bold ${settings.darkMode ? 'text-zinc-550' : 'text-slate-450'}`}>
                              ỦY THÁC ĐỘT XUẤT:
                            </span>
                            <span className={`text-[11px] font-black ${pendingTasks.length > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                              {assignedTasks.length} việc ({pendingTasks.length} đang làm)
                            </span>
                          </div>

                          <div className="flex items-center space-x-1.5 shrink-0">
                            <button
                              onClick={() => openEditEmployeeModal(emp)}
                              className={`p-1.5 rounded transition cursor-pointer ${
                                settings.darkMode ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300' : 'bg-white hover:bg-slate-100 hover:text-slate-800 border border-slate-200'
                              }`}
                              title="Sửa thông tin nhân viên"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-blue-500 hover:text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteEmployee(emp.id)}
                              className={`p-1.5 rounded transition cursor-pointer ${
                                settings.darkMode ? 'bg-zinc-900 hover:bg-red-950/40 text-zinc-450' : 'bg-white hover:bg-red-50 border border-slate-200 shadow-sm'
                              }`}
                              title="Xóa nhân viên"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-500 hover:text-red-650" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>



            {/* HOUSEHOLD BUSINESS CLASSIFICATION COMPLIANCE (NĐ 141 & TT 152) */}
            <HouseholdBusinessGuide darkMode={settings.darkMode} />

            {/* KHU VỰC 6: KIẾN TRÚC HỆ THỐNG & TRIỂN KHAI RENDER */}
            <div className={`p-5 rounded-xl border ${
              settings.darkMode ? 'bg-[#152033]/50 border-sky-950/40' : 'bg-white border-slate-200 shadow-md'
            } mt-6`}>
              <h3 className={`font-black text-xs md:text-[13px] uppercase tracking-wider flex items-center gap-1.5 mb-2 ${
                settings.darkMode ? 'text-sky-100' : 'text-slate-900'
              }`}>
                <Server className="w-4 h-4 text-rose-500 animate-pulse" />
                <span>KHU VỰC 6: KIẾN TRÚC HỆ THỐNG & CƠ CHẾ TRIỂN KHAI RENDER</span>
              </h3>
              <p className={`text-[10px] mb-4 ${settings.darkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
                ⚙️ Hỗ trợ theo dõi sơ đồ cơ sở dữ liệu (PostgreSQL DDL / ERD), chiến lược sao lưu định kỳ, tài liệu hướng dẫn và kích hoạt triển khai ứng dụng trực tiếp lên hosting Render.
              </p>
              
              <EnterpriseArchitectureTab darkMode={settings.darkMode} />
            </div>

          </div>



      </div>

      {/* OVERLAY DIALOG 1: CREATE / EDIT TASK WIZARD */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 z-50 animate-fade-in">
          <div className={`w-full max-w-lg rounded-xl border ${
            settings.darkMode ? 'border-zinc-800 bg-zinc-900 text-zinc-100' : 'bg-white text-slate-900 border-slate-200 shadow-2xl'
          } p-4 sm:p-5 text-left`}>
            
            <div className={`flex justify-between items-center border-b pb-3.5 mb-4 ${settings.darkMode ? 'border-zinc-800' : 'border-slate-150'}`}>
              <h3 className="font-black text-xs sm:text-sm uppercase text-red-500 flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4" />
                <span>{editingTask ? 'CẬP NHẬT NGHIỆP VỤ THUẾ KẾ TOÁN' : 'THIẾT LẬP LỊCH THỜI HẠN PHÁP ĐỊNH'}</span>
              </h3>
              <button
                onClick={() => { setIsTaskModalOpen(false); setEditingTask(null); clearForm(); }}
                className={`p-1 rounded transition ${settings.darkMode ? 'text-zinc-400 hover:text-white hover:bg-[#1e293b]' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4 text-xs">
              
              <div>
                <label className={labelStyle}>Tên Công Việc Nghiệp Vụ:</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ví dụ: Nộp Tờ khai thuế GTGT tháng 5, báo tăng bảo hiểm cho Lao động A..."
                  className={inputStyle}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelStyle}>Phân Loại / Nhóm:</label>
                  <select
                    value={formGroup}
                    onChange={(e) => setFormGroup(e.target.value as TaskGroup)}
                    className={selectStyle}
                  >
                    <option value="THUE">📐 Thuế (GTGT, TNDN, TNCN)</option>
                    <option value="KE_TOAN">📊 Kế Toán (BCTC, Thống kê nội bộ)</option>
                    <option value="BAO_HIEM">🛡️ Bảo Hiểm (BHXH bắt buộc)</option>
                    <option value="LAO_DONG">💼 Lao Động (Thỏa ước, Thang lương)</option>
                    <option value="THONG_KE">📈 Thống Kê (Thành phố/Quận)</option>
                    <option value="NOI_BO">⏳ Nội Bộ (Họp, đào tạo pháp chế)</option>
                  </select>
                </div>

                <div>
                  <label className={labelStyle}>Chu Kỳ Lặp Lại:</label>
                  <select
                    value={formRecurrence}
                    onChange={(e) => setFormRecurrence(e.target.value as RecurrenceType)}
                    className={selectStyle}
                  >
                    <option value="NONE">Không lặp (Sự vụ riêng lẻ)</option>
                    <option value="DAILY">Hàng ngày</option>
                    <option value="WEEKLY">Hàng tuần</option>
                    <option value="MONTHLY">Hàng tháng</option>
                    <option value="QUARTERLY">Hàng quý</option>
                    <option value="YEARLY">Hàng năm</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelStyle}>Ngày Bắt Đầu Chuẩn Bị:</label>
                  <input
                    type="date"
                    required
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className={labelStyle}>Hạn Chót Tối Hạn (Due Date):</label>
                  <input
                    type="date"
                    required
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className={inputStyle}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelStyle}>Mức Độ Ưu Tiên:</label>
                  <select
                     value={formPriority}
                     onChange={(e) => setFormPriority(e.target.value as any)}
                     className={selectStyle}
                  >
                    <option value="HIGH">🟥 Cao (Khẩn cấp tối quan trọng)</option>
                    <option value="MEDIUM">🟧 Trung bình (Hạn tờ khai chuẩn)</option>
                    <option value="LOW">🟨 Thấp (Tuyển dụng hoặc sự vụ nội bộ)</option>
                  </select>
                </div>

                <div>
                  <label className={labelStyle}>Giờ Nhắc Tự Động Định Giờ:</label>
                  <input
                    type="time"
                    value={formCustomAlertTime}
                    onChange={(e) => setFormCustomAlertTime(e.target.value)}
                    className={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label className={labelStyle}>Khách Hàng / Đối Tác:</label>
                <input
                  type="text"
                  value={formClient}
                  onChange={(e) => setFormClient(e.target.value)}
                  placeholder="Ví dụ: Công ty TNHH ABC"
                  className={inputStyle}
                />
              </div>

              <div>
                <label className={labelStyle}>Nhân Viên Được Phân Công (Ủy thác công việc đột xuất):</label>
                <select
                  value={formAssignedTo}
                  onChange={(e) => setFormAssignedTo(e.target.value)}
                  className={selectStyle}
                >
                  <option value="">-- Chưa phân công (Chung/Chưa bàn giao) --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      👤 {emp.name} ({emp.role}) [{emp.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm vắng'}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelStyle}>Ghi Trú / Thông Tư Quy Định Pháp Luật:</label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Điền thông số quy định hoặc lưu ý chi tiết chứng từ hồ sơ đại lý..."
                  rows={2}
                  className={inputStyle}
                />
              </div>

              <div className={`p-3 rounded-lg border ${settings.darkMode ? 'bg-zinc-950 border-zinc-850' : 'bg-slate-50 border-slate-200'}`}>
                <label className={`block font-black tracking-wider uppercase text-[10px] mb-1.5 font-mono ${settings.darkMode ? 'text-cyan-400' : 'text-black'}`}>
                  Quản lý nhắc việc (Nhắc trước số ngày):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[30, 15, 7, 3, 1, 0].map(days => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => toggleAlertDaySelection(days)}
                      className={`px-2 py-1 text-[9px] font-mono font-bold rounded border transition ${
                        formAlertDays.includes(days)
                          ? 'bg-red-650 text-white border-red-500'
                          : settings.darkMode 
                            ? 'bg-zinc-900 border-zinc-805 text-zinc-500 hover:text-zinc-200'
                            : 'bg-white border-slate-200 text-black hover:bg-slate-100'
                      }`}
                    >
                      {days === 0 ? 'Hôm nay' : `Trước ${days} ngày`}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`flex justify-end space-x-2 pt-3 border-t ${settings.darkMode ? 'border-zinc-800' : 'border-slate-150'}`}>
                <button
                  type="button"
                  onClick={() => { setIsTaskModalOpen(false); setEditingTask(null); clearForm(); }}
                  className={`px-4 py-2 border rounded-lg text-xs font-bold transition ${
                    settings.darkMode 
                      ? 'bg-[#182235] border-zinc-750 text-zinc-400 hover:text-white' 
                      : 'bg-white border-slate-250 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  HUỶ BỎ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs transition animate-pulse"
                >
                  {editingTask ? 'CẬP NHẬT CÔNG VIỆC' : 'TẠO CÔNG VIỆC'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* OVERLAY DIALOG 1.5: EMPLOYEE DETAILS FORM MODAL */}
      {isEmployeeModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 z-50 animate-fade-in">
          <div className={`w-full max-w-md rounded-xl border ${
            settings.darkMode ? 'border-zinc-800 bg-zinc-900 text-zinc-100' : 'bg-white text-slate-900 border-slate-200 shadow-2xl'
          } p-4 sm:p-5 text-left animate-slide-up`}>
            
            <div className={`flex justify-between items-center border-b pb-3.5 mb-4 ${settings.darkMode ? 'border-zinc-800' : 'border-slate-150'}`}>
              <h3 className={`font-black text-xs sm:text-sm uppercase flex items-center gap-1.5 ${settings.darkMode ? 'text-zinc-100' : 'text-black'}`}>
                <Users className={`w-4 h-4 ${settings.darkMode ? 'text-zinc-400' : 'text-black'}`} />
                <span>{editingEmployee ? 'CẬP NHẬT THÔNG TIN NHÂN SỰ' : 'THÊM NHÂN SỰ'}</span>
              </h3>
              <button
                onClick={() => { setIsEmployeeModalOpen(false); setEditingEmployee(null); clearEmployeeForm(); }}
                className={`p-1 rounded transition ${settings.darkMode ? 'text-zinc-400 hover:text-white hover:bg-[#1e293b]' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="space-y-4 text-xs">
              
              <div>
                <label className={labelStyle}>Họ và Tên Nhân Viên:</label>
                <input
                  type="text"
                  required
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Hải, Lê Thị Thu..."
                  className={inputStyle}
                />
              </div>

              <div>
                <label className={labelStyle}>Chức Vụ / Vị Trí Công Tác:</label>
                <select
                  value={empRole}
                  onChange={(e) => setEmpRole(e.target.value)}
                  className={selectStyle}
                >
                  <option value="Chuyên viên Kế toán">📊 Chuyên viên Kế toán</option>
                  <option value="Chuyên viên Thuế">📐 Chuyên viên Thuế (Đại lý)</option>
                  <option value="Nhân viên Hồ sơ">📁 Nhân viên Hồ sơ / Tiếp nhận</option>
                  <option value="Kiểm soát viên Pháp chế">⚖️ Kiểm soát viên Pháp lý/Pháp chế</option>
                  <option value="Trưởng nhóm Nghiệp vụ">💼 Trưởng nhóm Nghiệp vụ</option>
                  <option value="Cộng tác viên Ngoài">⏳ Cộng tác viên Ngoài</option>
                </select>
              </div>

              <div>
                <label className={labelStyle}>Số Điện Thoại:</label>
                <input
                  type="tel"
                  value={empPhone}
                  onChange={(e) => setEmpPhone(e.target.value)}
                  placeholder="Ví dụ: 0912345xxx"
                  className={inputStyle}
                />
              </div>

              <div className={`flex justify-end space-x-2 pt-3 border-t ${settings.darkMode ? 'border-zinc-800' : 'border-slate-150'}`}>
                <button
                  type="button"
                  onClick={() => { setIsEmployeeModalOpen(false); setEditingEmployee(null); clearEmployeeForm(); }}
                  className={`px-4 py-2 border rounded-lg text-xs font-bold transition ${
                    settings.darkMode 
                      ? 'bg-[#182235] border-zinc-750 text-zinc-400 hover:text-white' 
                      : 'bg-white border-slate-250 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  HUỶ BỎ
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 font-bold rounded-lg text-xs transition ${
                    settings.darkMode 
                      ? 'bg-zinc-805 hover:bg-zinc-700 text-zinc-100 border border-zinc-750 font-bold' 
                      : 'bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-black border border-amber-500 font-extrabold cursor-pointer shadow-sm'
                  }`}
                >
                  {editingEmployee ? 'CẬP NHẬT' : 'THÊM NHÂN SỰ'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* OVERLAY DIALOG 2: SYSTEM CONFIGURATION & SQLITE BACKUP */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 z-50 animate-fade-in">
          <div className={`w-full max-w-md rounded-xl border ${
            settings.darkMode ? 'border-zinc-800 bg-zinc-900 text-zinc-100' : 'bg-white text-slate-800 border-slate-200 shadow-xl'
          } p-4 sm:p-5 text-left`}>
            
            <div className={`flex justify-between items-center border-b pb-3 mb-4 ${settings.darkMode ? 'border-zinc-850' : 'border-slate-150'}`}>
              <h3 className={`font-extrabold text-xs sm:text-sm uppercase flex items-center gap-1.5 font-mono ${settings.darkMode ? 'text-zinc-200' : 'text-slate-800'}`}>
                <Settings className={`w-4 h-4 ${settings.darkMode ? 'text-zinc-400' : 'text-slate-500'}`} />
                <span>Cấu Hình Tự Động Sao Lưu SQLite</span>
              </h3>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className={`p-1 rounded transition ${settings.darkMode ? 'text-zinc-400 hover:text-white' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Accessibility toggles */}
              <div className={`p-3 rounded border leading-relaxed space-y-2.5 ${settings.darkMode ? 'bg-zinc-950/60 border-zinc-855 text-zinc-300' : 'bg-slate-50 border-slate-205 text-slate-805'}`}>
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${settings.darkMode ? 'text-zinc-300' : 'text-slate-700'}`}>Giao diện sáng / tối:</span>
                  <button
                    onClick={() => handleUpdateSettings({ darkMode: !settings.darkMode })}
                    className={`p-1 px-2.5 text-[10px] rounded border font-bold transition ${
                      settings.darkMode 
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white' 
                        : 'bg-white border-slate-250 text-slate-700 hover:bg-slate-100 shadow-sm'
                    }`}
                  >
                    {settings.darkMode ? '🌙 TỐI (DARK)' : '☀️ SÁNG (LIGHT)'}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${settings.darkMode ? 'text-zinc-300' : 'text-slate-700'}`}>Độ lớn chữ Accessibility:</span>
                  <button
                    onClick={() => {
                      const next = settings.fontSize === 'normal' ? 'large' : settings.fontSize === 'large' ? 'extra-large' : 'normal';
                      handleUpdateSettings({ fontSize: next });
                    }}
                    className={`p-1 px-2.5 text-[10px] rounded border font-bold transition ${
                      settings.darkMode 
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white' 
                        : 'bg-white border-slate-250 text-slate-700 hover:bg-slate-100 shadow-sm'
                    } capitalize`}
                  >
                    {settings.fontSize === 'normal' ? 'Bình thường' : settings.fontSize === 'large' ? 'To rành mạch' : 'Cực lớn'}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${settings.darkMode ? 'text-zinc-300' : 'text-slate-700'}`}>Còi âm thanh cảnh báo:</span>
                  <button
                    onClick={() => handleUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                    className={`p-1 px-2.5 text-[10px] rounded border font-bold transition ${
                      settings.darkMode 
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white' 
                        : 'bg-white border-slate-250 text-slate-700 hover:bg-slate-100 shadow-sm'
                    } flex items-center gap-1`}
                  >
                    {settings.soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-500" />}
                    <span>{settings.soundEnabled ? 'ĐANG BẬT' : 'ĐANG TẮT'}</span>
                  </button>
                </div>
              </div>

              {/* Backups trigger layout */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className={`font-bold uppercase tracking-wider text-[10px] ${settings.darkMode ? 'text-zinc-300' : 'text-slate-700'}`}>Tự Động Sao Lưu Dữ Liệu (.BAK)</span>
                  <button
                    onClick={handleTriggerBackup}
                    disabled={isBackupProcessing}
                    className="p-1 px-3 bg-red-650 hover:bg-red-550 text-white rounded font-bold text-[10px] transition animate-pulse"
                  >
                    {isBackupProcessing ? 'ĐANG LƯU...' : '+ TẠO ĐIỂM SAO LƯU THỦ CÔNG'}
                  </button>
                </div>

                <p className={`text-[10px] leading-snug ${settings.darkMode ? 'text-zinc-500' : 'text-slate-500'}`}>
                  Hệ thống tự động sao lưu dữ liệu SQLite định kỳ hằng ngày, hằng tuần và hằng tháng lên đĩa cứng máy chủ cục bộ. Cho phép phục hồi chỉ bằng 1 nút bấm dưới đây.
                </p>

                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {backups.length === 0 ? (
                    <div className="p-4 text-center text-zinc-600 font-mono">Chưa có bản ghi điểm phục hồi nào.</div>
                  ) : (
                    backups.map(bk => (
                      <div key={bk.id} className={`p-2 rounded border flex items-center justify-between font-mono text-[10px] ${
                        settings.darkMode ? 'bg-zinc-950 border-zinc-850' : 'bg-slate-50 border-slate-200 shadow-sm'
                      }`}>
                        <div className="min-w-0 flex-1 pr-1.5">
                          <p className={`font-black truncate ${settings.darkMode ? 'text-zinc-300' : 'text-slate-850'}`}>{bk.fileName}</p>
                          <p className={`text-[9px] ${settings.darkMode ? 'text-zinc-500' : 'text-slate-505'}`}>{formatDateLabel(bk.timestamp)} | {bk.taskCount} công việc</p>
                        </div>
                        
                        <div className="flex items-center space-x-1 shrink-0">
                          <button
                            onClick={() => handleRestoreBackup(bk.id, bk.fileName)}
                            className={`px-2 py-0.5 rounded border font-bold font-sans text-[10px] transition ${
                              settings.darkMode 
                                ? 'bg-red-950/40 border-red-900 text-red-150 hover:bg-red-900/40' 
                                : 'bg-red-50 border-red-200 text-red-655 hover:bg-red-100/60'
                            }`}
                          >
                            RESTORE
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className={`flex justify-end pt-3 border-t ${settings.darkMode ? 'border-zinc-850' : 'border-slate-150'}`}>
                <button
                  type="button"
                  onClick={() => setIsSettingsModalOpen(false)}
                  className={`px-4 py-1.5 border rounded font-bold transition text-xs ${
                    settings.darkMode 
                      ? 'bg-[#182235] border-zinc-750 text-zinc-400 hover:text-white' 
                      : 'bg-white border-slate-250 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  ĐÓNG CỬA SỔ
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Custom Stateful Confirmation / Alert Dialog */}
      {confirmConfig && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 z-55">
          <div className={`relative w-full max-w-sm rounded-xl p-5 border shadow-2xl transition-all scale-102 ${
            settings.darkMode 
              ? 'bg-[#121c2e] border-sky-900/60 text-zinc-100 shadow-black/80' 
              : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
          }`}>
            <h3 className={`text-sm font-black uppercase tracking-wider mb-2 ${
              settings.darkMode ? 'text-red-400' : 'text-red-700'
            }`}>
              {confirmConfig.title}
            </h3>
            <p className={`text-xs leading-relaxed mb-5 ${
              settings.darkMode ? 'text-zinc-350' : 'text-slate-650'
            }`}>
              {confirmConfig.message}
            </p>
            <div className="flex justify-end gap-2.5">
              {!confirmConfig.isAlert && (
                <button
                  type="button"
                  onClick={() => setConfirmConfig(null)}
                  className={`px-3 py-1.5 border rounded text-xs font-bold transition hover:cursor-pointer ${
                    settings.darkMode 
                      ? 'bg-zinc-900 border-zinc-750 text-zinc-400 hover:text-white' 
                      : 'bg-white border-slate-250 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {confirmConfig.cancelText || 'Hủy'}
                </button>
              )}
              <button
                type="button"
                onClick={confirmConfig.onConfirm}
                className="px-3.5 py-1.5 bg-red-650 hover:bg-red-500 active:bg-red-700 text-white rounded text-xs font-black tracking-wider transition hover:cursor-pointer shadow-sm"
              >
                {confirmConfig.confirmText || 'Đồng ý'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating success and error warnings */}
      {successToast && (
        <div className="fixed bottom-4 right-4 bg-emerald-950/95 text-emerald-100 border border-emerald-500 p-4 rounded-xl shadow-2xl z-55 flex items-center space-x-3 cursor-pointer max-w-sm" onClick={() => setSuccessToast(null)}>
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-450 flex items-center justify-center font-bold">✓</div>
          <span className="text-[11px] font-bold leading-relaxed">{successToast}</span>
        </div>
      )}

      {errorToast && (
        <div className="fixed bottom-4 right-4 bg-red-950/95 text-red-100 border border-red-500 p-4 rounded-xl shadow-2xl z-55 flex items-center space-x-3 cursor-pointer max-w-sm" onClick={() => setErrorToast(null)}>
          <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-450 flex items-center justify-center font-bold">!</div>
          <span className="text-[11px] font-bold leading-relaxed">{errorToast}</span>
        </div>
      )}

    </div>
  );
}
