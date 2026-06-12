import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Calendar as CalendarIcon, 
  X, 
  UserCheck, 
  DollarSign, 
  Check, 
  AlertTriangle, 
  ChevronRight,
  Filter,
  Trash2,
  Edit2,
  CalendarDays
} from 'lucide-react';
import { TaxFiling, FilingType, Client, Employee } from '../types';

interface TaxFilingsTabProps {
  taxFilings: TaxFiling[];
  clients: Client[];
  employees: Employee[];
  darkMode: boolean;
  userRole: string;
  onRefresh: () => void;
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
  askConfirmation: (title: string, message: string, onConfirm: () => void) => void;
}

export const FILING_TYPE_LABELS: Record<FilingType, string> = {
  GTGT_MONTH: 'Tờ khai Thuế GTGT Tháng',
  GTGT_QUARTER: 'Tờ khai Thuế GTGT Quý',
  TNCN_MONTH: 'Khai nộp Thuế TNCN Tháng',
  TNCN_QUARTER: 'Khai nộp Thuế TNCN Quý',
  TNDN_TEMP: 'Tạm tính thuế TNDN Quý',
  INVOICE_REPORT: 'Báo cáo sử dụng hoá đơn',
  YEAR_SETTLEMENT: 'Quyết toán thuế TNCN/TNDN Năm',
  BCTC_YEAR: 'Nộp BCTC hoàn chỉnh năm mấu 03'
};

export default function TaxFilingsTab({
  taxFilings,
  clients,
  employees,
  darkMode,
  userRole,
  onRefresh,
  showSuccess,
  showError,
  askConfirmation
}: TaxFilingsTabProps) {
  const [selectedClientFilter, setSelectedClientFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [editingFiling, setEditingFiling] = useState<TaxFiling | null>(null);

  // Form states
  const [boundClientId, setBoundClientId] = useState('');
  const [filingType, setFilingType] = useState<FilingType>('GTGT_MONTH');
  const [period, setPeriod] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<TaxFiling['status']>('PENDING');
  const [handlerId, setHandlerId] = useState('');
  const [notes, setNotes] = useState('');

  const openAddModal = () => {
    setEditingFiling(null);
    setBoundClientId(clients[0]?.id || '');
    setFilingType('GTGT_MONTH');
    
    // Default period & due date based on today
    const now = new Date();
    const curMonthStr = String(now.getMonth() + 1).padStart(2, '0');
    setPeriod(`${curMonthStr}/${now.getFullYear()}`);
    setDueDate(`${now.getFullYear()}-${curMonthStr}-20`);
    
    setAmount('');
    setStatus('PENDING');
    setHandlerId(employees[0]?.id || '');
    setNotes('');
    setIsOpenModal(true);
  };

  const openEditModal = (f: TaxFiling) => {
    setEditingFiling(f);
    setBoundClientId(f.clientId);
    setFilingType(f.type);
    setPeriod(f.period);
    setDueDate(f.dueDate);
    setAmount(f.amount !== undefined ? String(f.amount) : '');
    setStatus(f.status);
    setHandlerId(f.handlerId || '');
    setNotes(f.notes || '');
    setIsOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boundClientId || !period || !dueDate) {
      showError('Khách hàng, chu kỳ hạch toán và hạn nộp tờ khai là bắt buộc.');
      return;
    }

    const payload = {
      clientId: boundClientId,
      type: filingType,
      period,
      status,
      dueDate,
      amount: amount.trim() ? Number(amount) : undefined,
      notes,
      handlerId: handlerId || undefined
    };

    try {
      let url = '/api/tax-filings';
      let method = 'POST';

      if (editingFiling) {
        url = `/api/tax-filings/${editingFiling.id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showSuccess(editingFiling ? 'Cập nhật nghĩa vụ kê khai thành công!' : 'Tạo hồ sơ nghĩa vụ thuế thành công!');
        setIsOpenModal(false);
        onRefresh();
      } else {
        const err = await res.json();
        showError(err.error || 'Yêu cầu thất bại.');
      }
    } catch (_) {
      showError('Lỗi hạ tầng máy chủ cục bộ.');
    }
  };

  const handleDelete = (id: string) => {
    if (userRole !== 'ADMIN' && userRole !== 'MANAGER') {
      showError('Chỉ có Admin hoặc Trưởng phòng mới được quyền xóa các hồ sơ thuế pháp định.');
      return;
    }

    askConfirmation(
      'Xóa Nghĩa Vụ Thuế',
      'Bạn có chắc chắn muốn xóa hồ sơ nghĩa vụ tờ khai thuế này khỏi cơ sở dữ liệu doanh nghiệp không?',
      async () => {
        try {
          const res = await fetch(`/api/tax-filings/${id}`, { method: 'DELETE' });
          if (res.ok) {
            showSuccess('Đã hủy hồ sơ nghĩa vụ thành công.');
            onRefresh();
          } else {
            showError('Lỗi khi thực thi xóa cơ sở dữ liệu.');
          }
        } catch (_) {
          showError('Không có kết nối internet.');
        }
      }
    );
  };

  const filtered = taxFilings.filter(f => {
    const matchClient = selectedClientFilter === 'ALL' || f.clientId === selectedClientFilter;
    const matchStatus = selectedStatusFilter === 'ALL' || f.status === selectedStatusFilter;
    const matchType = selectedTypeFilter === 'ALL' || f.type === selectedTypeFilter;
    return matchClient && matchStatus && matchType;
  });

  return (
    <div className="space-y-4 text-xs animate-fade-in">
      
      {/* Filters and Control panel */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-3 ${
        darkMode ? 'bg-zinc-950/40 border-zinc-800' : 'bg-white border-slate-202 shadow-xs'
      }`}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full md:w-auto flex-1 max-w-2xl">
          
          {/* Client select filter */}
          <div>
            <label className="block text-[9px] uppercase font-bold text-zinc-500 mb-1">Lọc Theo Khách Hàng:</label>
            <select
              value={selectedClientFilter}
              onChange={(e) => setSelectedClientFilter(e.target.value)}
              className={`w-full p-2 border rounded-lg outline-none font-semibold ${
                darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-slate-250 text-slate-800'
              }`}
            >
              <option value="ALL">🏢 [Tất cả khách hàng]</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.taxCode})</option>
              ))}
            </select>
          </div>

          {/* Type filter */}
          <div>
            <label className="block text-[9px] uppercase font-bold text-zinc-500 mb-1">Phân Loại Tờ Khai:</label>
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className={`w-full p-2 border rounded-lg outline-none font-semibold ${
                darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-slate-250 text-slate-800'
              }`}
            >
              <option value="ALL">📁 [Tất cả tờ khai]</option>
              {Object.entries(FILING_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-[9px] uppercase font-bold text-zinc-500 mb-1">Trạng Thái Hồ Sơ:</label>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className={`w-full p-2 border rounded-lg outline-none font-semibold ${
                darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-slate-250 text-slate-800'
              }`}
            >
              <option value="ALL">⚡ [Tất cả trạng thái]</option>
              <option value="PENDING">🕒 Chờ xử lý (Pending)</option>
              <option value="PREPARING">📂 Đang thực hiện / Lập dữ liệu</option>
              <option value="SUBMITTED">📤 Đã trình nộp cơ quan Thuế</option>
              <option value="APPROVED">✅ Đã kiểm duyệt / Thông báo thành công</option>
              <option value="OVERDUE">🟥 Đã Quá Hạn Nộp Pháp Định</option>
            </select>
          </div>

        </div>

        {/* Action Button */}
        {(userRole === 'ADMIN' || userRole === 'MANAGER' || userRole === 'TEAM_LEADER') && (
          <button
            onClick={openAddModal}
            className="w-full md:w-auto p-2.5 px-4 bg-red-650 hover:bg-red-550 text-white font-extrabold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-98 transition duration-150 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>THIẾT LẬP NGHĨA VỤ MỚI</span>
          </button>
        )}
      </div>

      {/* Filings List Matrix */}
      <div className={`border rounded-xl overflow-hidden ${
        darkMode ? 'border-zinc-800 bg-zinc-900/40' : 'bg-white border-slate-205 shadow-sm'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[10px] uppercase font-mono tracking-wider font-extrabold ${
                darkMode ? 'bg-zinc-950/50 border-zinc-800 text-zinc-400' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                <th className="p-3 sm:p-4">Khách hàng pháp nhân</th>
                <th className="p-3">Nội dung tờ khai nghĩa vụ</th>
                <th className="p-3">Chu kỳ hạch toán</th>
                <th className="p-3">Hạn nộp pháp lý</th>
                <th className="p-3">Chi phí phát sinh</th>
                <th className="p-3">Chuyên viên phụ trách</th>
                <th className="p-3 text-center">Trạng thái</th>
                <th className="p-3 text-right pr-4">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-zinc-550 font-medium whitespace-nowrap">
                    Hiện chưa ghi nhận bất kỳ thông tin nghĩa vụ thuế nào thỏa mãn bộ lọc.
                  </td>
                </tr>
              ) : (
                filtered.map(f => {
                  const cl = clients.find(c => c.id === f.clientId);
                  const emp = employees.find(e => e.id === f.handlerId);
                  
                  // Due date calculator
                  const isOverdue = f.status !== 'APPROVED' && new Date(f.dueDate) < new Date();
                  
                  return (
                    <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-950/20 transition">
                      <td className="p-3 sm:p-4 max-w-xs">
                        <p className={`font-black uppercase text-xs truncate ${darkMode ? 'text-zinc-200' : 'text-slate-850'}`}>
                          {cl ? cl.name : 'N/A'}
                        </p>
                        <p className="font-mono text-[10px] text-zinc-500 mt-0.5">MST: {cl ? cl.taxCode : 'Chưa có'}</p>
                      </td>
                      <td className="p-3 font-semibold text-xs leading-relaxed max-w-[200px]">
                        <p className={darkMode ? 'text-zinc-350' : 'text-slate-700'}>
                          {FILING_TYPE_LABELS[f.type] || f.type}
                        </p>
                        {f.notes && <p className="text-[10px] text-zinc-500 line-clamp-1 italic mt-0.5">"{f.notes}"</p>}
                      </td>
                      <td className="p-3 font-mono font-bold text-[11px] text-blue-650">
                        {f.period}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-1.5 leading-none">
                          <CalendarIcon className={`w-3.5 h-3.5 ${isOverdue ? 'text-red-500 animate-pulse' : 'text-zinc-450'}`} />
                          <span className={`font-mono font-bold text-xs ${isOverdue ? 'text-red-600 dark:text-red-400 font-extrabold animate-pulse' : darkMode ? 'text-zinc-300' : 'text-slate-800'}`}>
                            {f.dueDate.split('-').reverse().join('/')}
                          </span>
                        </div>
                        {isOverdue && <span className="text-[9px] font-black text-red-600 block mt-1 animate-pulse">⚠️ QUÁ HẠN NỘP PHÁP ĐỊNH</span>}
                      </td>
                      <td className="p-3 font-mono font-black text-xs text-red-650">
                        {f.amount !== undefined ? `${f.amount.toLocaleString('vi-VN')} đ` : '—'}
                      </td>
                      <td className="p-3 font-semibold">
                        {emp ? (
                          <div className="flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0"></span>
                            <span className={darkMode ? 'text-zinc-300' : 'text-slate-800'}>{emp.name}</span>
                          </div>
                        ) : (
                          <span className="text-zinc-500 italic">[Chưa phân công]</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                          f.status === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50'
                            : f.status === 'SUBMITTED'
                              ? 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/50'
                              : f.status === 'PREPARING'
                                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-955/20 dark:text-amber-400 dark:border-amber-900/50'
                                : 'bg-zinc-100 text-zinc-650 border-zinc-250 dark:bg-zinc-950/20 dark:text-zinc-400 dark:border-zinc-800'
                        }`}>
                          {f.status === 'APPROVED' ? 'ĐÃ KÝ DUYỆT' : f.status === 'SUBMITTED' ? 'ĐÃ TRÌNH NỘP' : f.status === 'PREPARING' ? 'ĐANG LẬP HỒ SƠ' : 'CHỜ THỰC HIỆN'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end space-x-1 pr-1">
                          {(userRole === 'ADMIN' || userRole === 'MANAGER' || userRole === 'TEAM_LEADER' || userRole === 'STAFF') && (
                            <button
                              onClick={() => openEditModal(f)}
                              className={`p-1.5 rounded transition cursor-pointer hover:scale-105 ${
                                darkMode ? 'text-zinc-400 hover:text-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                              }`}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {(userRole === 'ADMIN' || userRole === 'MANAGER') && (
                            <button
                              onClick={() => handleDelete(f.id)}
                              className={`p-1.5 rounded transition cursor-pointer hover:scale-105 ${
                                darkMode ? 'text-zinc-500 hover:text-rose-400' : 'text-slate-450 hover:text-rose-655 hover:bg-rose-50'
                              }`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORM MODAL */}
      {isOpenModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 z-50 animate-fade-in">
          <div className={`w-full max-w-md rounded-xl border p-4 sm:p-5 text-left animate-slide-up ${
            darkMode ? 'border-zinc-800 bg-zinc-900 text-zinc-100' : 'bg-white text-slate-900 border-slate-205 shadow-2xl'
          }`}>
            
            <div className={`flex justify-between items-center border-b pb-3 mb-4 ${
              darkMode ? 'border-zinc-800' : 'border-slate-150'
            }`}>
              <h3 className="font-black text-xs sm:text-sm uppercase flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-rose-500" />
                <span>{editingFiling ? 'HỐ SƠ TỜ KHAI PHÁP ĐỊNH CẬP NHẬT TRẠNG THÁI' : 'THIẾT LẬP NGHĨA VỤ TỜ KHAI PHÁP ĐỊNH MỚI'}</span>
              </h3>
              <button
                onClick={() => setIsOpenModal(false)}
                className={`p-1 rounded transition cursor-pointer ${
                  darkMode ? 'text-zinc-400 hover:text-white' : 'text-slate-400 hover:text-slate-800'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 font-sans font-medium text-xs">
              
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1">Doanh Nghiệp Thụ Hưởng / Trách Nhiệm:</label>
                <select
                  disabled={!!editingFiling}
                  value={boundClientId}
                  onChange={(e) => setBoundClientId(e.target.value)}
                  className={`w-full p-2.5 border rounded-lg outline-none font-bold ${
                    darkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-250 text-slate-850'
                  }`}
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.taxCode})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1">Loại Hình Tờ Khai Pháp Định:</label>
                  <select
                    disabled={!!editingFiling}
                    value={filingType}
                    onChange={(e) => setFilingType(e.target.value as FilingType)}
                    className={`w-full p-2.5 border rounded-lg outline-none font-bold ${
                      darkMode ? 'bg-zinc-950 border-zinc-805 text-zinc-200' : 'bg-white border-slate-250 text-slate-800'
                    }`}
                  >
                    {Object.entries(FILING_TYPE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1">Kỳ Hạch Toán (Ví dụ: 06/2026):</label>
                  <input
                    type="text"
                    required
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    placeholder="MM/YYYY hoặc Qx/YYYY..."
                    className={`w-full p-2.5 border rounded-lg outline-none font-bold font-mono tracking-wider ${
                      darkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-slate-250'
                    }`}
                  />
                </div>

              </div>

              <div className="grid grid-cols-2 gap-3">
                
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1">Hạn Nộp Pháp Định (DueDate):</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={`w-full p-2.5 border rounded-lg outline-none font-mono font-bold ${
                      darkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-slate-250'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1">Dự Tính Thuế Phát Sinh (đ):</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Để trống nếu không có phát sinh"
                    className={`w-full p-2.5 border rounded-lg outline-none font-mono text-red-655 font-black ${
                      darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-250'
                    }`}
                  />
                </div>

              </div>

              <div className="grid grid-cols-2 gap-3">
                
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1">Mức Độ Tiến Độ Hồ Sơ:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className={`w-full p-2.5 border rounded-lg outline-none font-bold text-xs ${
                      darkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-250 text-slate-850'
                    }`}
                  >
                    <option value="PENDING">🕒 Chờ thực hiện (Pending)</option>
                    <option value="PREPARING">📂 Đang thực hiện / Lập số liệu</option>
                    <option value="SUBMITTED">📤 Đã trình nộp cơ quan Thuế</option>
                    <option value="APPROVED">✅ Đã kiểm duyệt thành công</option>
                    <option value="OVERDUE">🟥 Đã Quá Hạn Nộp Pháp Định</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1">Chuyên Viên Đảm Trách:</label>
                  <select
                    value={handlerId}
                    onChange={(e) => setHandlerId(e.target.value)}
                    className={`w-full p-2.5 border rounded-lg outline-none font-bold ${
                      darkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-250 text-slate-850'
                    }`}
                  >
                    <option value="">[Chưa phân công]</option>
                    {employees.map(e => (
                      <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
                    ))}
                  </select>
                </div>

              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1">Chi tiết công tác / Ghi chú lưu vụ:</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ghi nhận hồ sơ đính kèm hoặc bàn giao..."
                  rows={2}
                  className={`w-full p-2.5 border rounded-lg outline-none ${
                    darkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-250 text-slate-900'
                  }`}
                />
              </div>

              <div className={`flex justify-end gap-2.5 pt-3 border-t ${
                darkMode ? 'border-zinc-800' : 'border-slate-150'
              }`}>
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className={`px-4.5 py-2 border rounded-lg text-xs font-bold transition cursor-pointer ${
                    darkMode 
                      ? 'bg-zinc-955 border-zinc-800 text-zinc-400' 
                      : 'bg-white border-slate-255 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  HUỶ BỎ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-650 hover:bg-red-550 text-white font-extrabold rounded-lg text-xs cursor-pointer shadow-sm active:scale-98 transition duration-150"
                >
                  {editingFiling ? 'LƯU THAY ĐỔI' : 'LẬP NGHĨA VỤ PHÁP ĐỊNH'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
