import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  UserCheck, 
  Server, 
  X, 
  Cpu, 
  Clock, 
  Search,
  Filter,
  RefreshCw,
  FileCode,
  Key,
  FileSpreadsheet
} from 'lucide-react';
import { AuditLog, SystemUserRole } from '../types';

interface RBACLogsTabProps {
  logs: AuditLog[];
  currentUserRole: SystemUserRole;
  onChangeRole: (newRole: SystemUserRole) => void;
  darkMode: boolean;
  onRefresh: () => void;
}

export default function RBACLogsTab({
  logs,
  currentUserRole,
  onChangeRole,
  darkMode,
  onRefresh
}: RBACLogsTabProps) {
  const [logSearch, setLogSearch] = useState('');
  const [logActionFilter, setLogActionFilter] = useState('ALL');

  const rbacSpecs = [
    {
      role: 'ADMIN',
      label: '👑 QUẢN TRỊ VIÊN CAO CẤP (ADMIN)',
      desc: 'Quyền lực tối cao trong ERP. Kiểm soát đối soát số liệu, thêm/sửa/xóa khách hàng, hạch toán, nhân viên, sao lưu dữ liệu, chỉnh sửa hệ thống cảnh báo.',
      clients: 'Full CRUD', filings: 'Full CRUD', books: 'Full CRUD', tasks: 'Full CRUD', backup: 'Hỗ trợ'
    },
    {
      role: 'MANAGER',
      label: '👔 TRƯỞNG PHÒNG DỊCH VỤ (MANAGER)',
      desc: 'Quản lý vận hành đại lý thuế. Được duyệt tờ khai thuế, phân nhiệm vụ, xem đối soát sổ sách kế toán, và can thiệp sửa đổi, trừ thao tác xóa vĩnh viễn khách hàng.',
      clients: 'View/Edit Only', filings: 'View/Save Only', books: 'Full CRUD', tasks: 'Full CRUD', backup: 'Không hỗ trợ'
    },
    {
      role: 'TEAM_LEADER',
      label: '💼 TRƯỞNG NHÓM NGHIỆP VỤ (TEAM LEADER)',
      desc: 'Phụ trách một tổ chuyên viên. Thêm mới khách hàng, giao việc cho nhân viên, lập hạch toán, lập nghĩa vụ, phê duyệt tạm thời thông số.',
      clients: 'View/Add Only', filings: 'View/Add Only', books: 'View/Add Only', tasks: 'View/Add Only', backup: 'Không hỗ trợ'
    },
    {
      role: 'STAFF',
      label: '👩‍💻 CHUYÊN VIÊN KẾ TOÁN (STAFF)',
      desc: 'Tác vụ nghiệp vụ hằng ngày. Chỉ được phân công công việc, viết báo cáo hạch toán, hoàn thành subtask checklist, xem dữ liệu khách hàng được phụ trách.',
      clients: 'Chỉ đọc (Read)', filings: 'Khai nộp thử', books: 'Định khoản riêng', tasks: 'Xử lý của mình', backup: 'Không hỗ trợ'
    },
    {
      role: 'CLIENT',
      label: '🤝 DOANH NGHIỆP/HỘ KINH DOANH (CLIENT)',
      desc: 'Cổng thông tin Clients Portal. Chỉ đọc dữ liệu của chính mình, tra cứu nghĩa vụ thuế riêng, nộp giấy truyền thông báo, tuyệt đối không được xem dữ liệu chéo.',
      clients: 'Chỉ xem Profile mình', filings: 'Xem số nộp riêng', books: 'Xem tiến độ hạch toán', tasks: 'Không quyền sửa', backup: 'Không hỗ trợ'
    }
  ];

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const term = logSearch.toLowerCase();
      const matchesSearch = log.action.toLowerCase().includes(term) || 
                            (log.details && log.details.toLowerCase().includes(term)) ||
                            (log.userName && log.userName.toLowerCase().includes(term)) ||
                            (log.sqlStatement && log.sqlStatement.toLowerCase().includes(term));
      const matchesAction = logActionFilter === 'ALL' || log.action === logActionFilter;
      return matchesSearch && matchesAction;
    }).slice(0, 100); // Limit to top 100 for responsive performance
  }, [logs, logSearch, logActionFilter]);

  const uniqueActions = useMemo(() => {
    const set = new Set<string>();
    logs.forEach(l => set.add(l.action));
    return Array.from(set);
  }, [logs]);

  return (
    <div className="space-y-4 text-xs animate-fade-in font-sans leading-relaxed">
      
      {/* 2 Split panes: Permissions Matrix + Syslogs audit */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Permissions Matrix Checker */}
        <div className="xl:col-span-4 space-y-4">
          <div className={`p-4 rounded-xl border ${
            darkMode ? 'bg-zinc-950/40 border-zinc-805 text-zinc-100' : 'bg-white border-slate-205 shadow-sm'
          }`}>
            <h3 className="font-extrabold text-xs text-red-655 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2.5 border-red-500/10 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Cấu trúc Phân Quyền (JWT RBAC Model)</span>
            </h3>

            <p className={`text-[11px] mb-4 text-zinc-550 leading-relaxed`}>
              Hệ thống giả lập cơ chế mã bảo mật <strong>JWT Tokens</strong> tích hợp thuộc tính <strong>claims.role</strong>. Chọn vai trò trực tiếp để chuyển đổi quyền hạn hiển thị phân tách:
            </p>

            {/* Simulated Active user role switch widgets */}
            <div className="space-y-2">
              <label className="block text-[9px] uppercase font-bold text-zinc-500 mb-1">Mô phỏng JWT Swapper:</label>
              <select
                value={currentUserRole}
                onChange={(e) => onChangeRole(e.target.value as SystemUserRole)}
                className={`w-full p-2.5 border rounded-lg outline-none font-bold text-xs ${
                  darkMode ? 'bg-zinc-900 border-zinc-800 text-emerald-400' : 'bg-red-50 border-red-200 text-red-700'
                }`}
              >
                <option value="ADMIN">👑 [ADMIN] Quản trị viên cao cấp</option>
                <option value="MANAGER">👔 [MANAGER] Trưởng phòng dịch vụ</option>
                <option value="TEAM_LEADER">💼 [TEAM_LEADER] Trưởng nhóm nghiệp vụ</option>
                <option value="STAFF">👩‍💻 [STAFF] Chuyên viên kế toán</option>
                <option value="CLIENT">🤝 [CLIENT] Khách hàng Doanh nghiệp / Hộ kinh doanh</option>
              </select>
            </div>

            {/* Matrix of capabilities description */}
            <div className="mt-4 space-y-3">
              {rbacSpecs.map(spec => (
                <div 
                  key={spec.role} 
                  className={`p-3 rounded-lg border text-[11px] transition ${
                    currentUserRole === spec.role 
                      ? 'bg-rose-50/20 border-red-550/40 dark:bg-rose-950/10' 
                      : 'bg-slate-50/40 border-zinc-200 opacity-60 dark:bg-zinc-900/10 dark:border-zinc-850'
                  }`}
                >
                  <p className="font-extrabold tracking-wide uppercase hover:text-red-500 leading-tight mb-1">{spec.label}</p>
                  <p className="text-zinc-500 leading-tight mb-2 text-[10px]">{spec.desc}</p>
                  
                  {/* Capabilities mini pills */}
                  <div className="grid grid-cols-2 gap-1.5 font-mono text-[9px] font-bold">
                    <span className="p-1 px-1.5 rounded bg-zinc-100 dark:bg-black/30 border">📁 Tờ khai: {spec.filings}</span>
                    <span className="p-1 px-1.5 rounded bg-zinc-100 dark:bg-black/30 border">🏢 Khách hàng: {spec.clients}</span>
                    <span className="p-1 px-1.5 rounded bg-zinc-100 dark:bg-black/30 border">📖 Sổ sách: {spec.books}</span>
                    <span className="p-1 px-1.5 rounded bg-zinc-100 dark:bg-black/30 border">🛡️ Backups: {spec.backup}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Security Auditing logs logs */}
        <div className="xl:col-span-8 space-y-4">
          <div className={`p-4 rounded-xl border ${
            darkMode ? 'bg-zinc-950/40 border-zinc-805 text-zinc-100' : 'bg-white border-slate-205 shadow-sm'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-3 border-slate-500/10 mb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-red-500 animate-pulse shrink-0" />
                <div>
                  <h3 className="font-extrabold text-xs uppercase tracking-widest text-red-655">Nhật Ký Hệ Thống & Hoạt Động SQL (Audit logs)</h3>
                  <p className="text-[10px] text-zinc-550 mt-0.5">Thời gian thực giám sát an ninh (syslog) đối chứng lỗi API và truy vấn SQL giả lập.</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <a
                  href="/api/export/logs/csv"
                  download
                  className="p-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-lg font-bold text-[10px] shrink-0 flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>XUẤT EXCEL NHẬT KÝ</span>
                </a>

                <button
                  onClick={onRefresh}
                  className={`p-1.5 px-3 border rounded-lg font-bold text-[10px] shrink-0 flex items-center space-x-1.5 cursor-pointer transition ${
                    darkMode 
                      ? 'bg-zinc-905 border-zinc-800 hover:bg-zinc-800 hover:text-white text-zinc-300' 
                      : 'bg-white border-slate-250 hover:bg-slate-50 text-slate-700 shadow-xs'
                  }`}
                >
                  <RefreshCw className="w-3 h-3 text-zinc-505 dark:text-zinc-400" />
                  <span>TẢI LẠI NHẬT KÝ</span>
                </button>
              </div>
            </div>

            {/* Filter Logs toolstrip */}
            <div className="flex flex-col sm:flex-row items-center gap-2 mb-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Tra cứu log, username, hành vi, SQL..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-250 rounded-lg outline-none font-medium text-[11px]"
                />
              </div>

              <select
                value={logActionFilter}
                onChange={(e) => setLogActionFilter(e.target.value)}
                className="w-full sm:w-44 p-1.5 border border-slate-250 rounded-lg outline-none text-[11px] font-semibold"
              >
                <option value="ALL">🔍 [Tất cả nghiệp vụ]</option>
                {uniqueActions.map(act => (
                  <option key={act} value={act}>{act}</option>
                ))}
              </select>
            </div>

            {/* Logs console window */}
            <div className={`p-3 rounded-lg border max-h-[380px] overflow-y-auto leading-normal font-mono text-[10px] md:text-xs select-all ${
              darkMode ? 'bg-black/80 border-zinc-850 text-green-400' : 'bg-[#121c2c] border-slate-900 text-emerald-450'
            }`}>
              <div className="space-y-4">
                {filteredLogs.length === 0 ? (
                  <p className="p-4 text-center text-zinc-500">
                    -- [Console]: Không ghi nhận tệp tin audit log logs khớp với tiêu chí tìm kiếm --
                  </p>
                ) : (
                  filteredLogs.map(log => (
                    <div key={log.id} className="border-b border-zinc-800/80 pb-3 last:border-0">
                      <div className="flex flex-wrap items-center gap-x-2.5 text-[9px] text-zinc-500 font-sans border-b border-zinc-800/30 pb-1 mb-1.5">
                        <span className="text-red-400 font-extrabold flex items-center gap-1">
                          <Cpu className="w-3 h-3 text-red-500" />
                          <span>[{log.userRole}]</span>
                        </span>
                        <span className="font-bold text-zinc-300">USER: {log.userName}</span>
                        <span className="text-blue-400 font-mono font-bold">IP: {log.ipAddress || '127.0.0.1'}</span>
                        <span className="text-zinc-500 shrink-0 text-[8px] flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{new Date(log.timestamp).toLocaleString('vi-VN')}</span>
                      </div>

                      <p className="font-bold font-sans text-xs text-white leading-relaxed mb-1">
                        👉 Action: <span className="text-amber-400">{log.action}</span> - {log.details}
                      </p>

                      {log.sqlStatement && (
                        <div className="mt-2 text-rose-300 font-medium">
                          <p className="text-[9px] text-zinc-500 uppercase font-sans font-black tracking-tight flex items-center gap-1 mb-1">
                            <FileCode className="w-3.5 h-3.5 text-zinc-450 shrink-0" />
                            <span>PostgreSQL Executed Query (Drizzle proxy simulation):</span>
                          </p>
                          <pre className="p-2 border rounded-md bg-black/60 max-w-full overflow-x-auto text-[9.5px] leading-relaxed text-blue-300 select-all border-zinc-900">
                            <code>{log.sqlStatement}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
