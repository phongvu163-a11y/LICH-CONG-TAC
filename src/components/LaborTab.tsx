import React, { useState } from 'react';
import { 
  Users, 
  Briefcase, 
  Plus, 
  X, 
  Trash2, 
  Edit2, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  CreditCard 
} from 'lucide-react';
import { LaborRecord, Client } from '../types';

interface LaborTabProps {
  laborRecords: LaborRecord[];
  clients: Client[];
  darkMode: boolean;
  userRole: string;
  onRefresh: () => void;
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
  askConfirmation: (title: string, message: string, onConfirm: () => void) => void;
}

export default function LaborTab({
  laborRecords,
  clients,
  darkMode,
  userRole,
  onRefresh,
  showSuccess,
  showError,
  askConfirmation
}: LaborTabProps) {
  const [selectedClientFilter, setSelectedClientFilter] = useState<string>('ALL');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<LaborRecord | null>(null);

  // Form states
  const [clientId, setClientId] = useState('');
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [activeContracts, setActiveContracts] = useState(0);
  const [bhxhRegistered, setBhxhRegistered] = useState(0);
  const [bhxhPaidStatus, setBhxhPaidStatus] = useState<LaborRecord['bhxhPaidStatus']>('PENDING');
  const [notes, setNotes] = useState('');

  const openAddModal = () => {
    setEditingRecord(null);
    setClientId(clients[0]?.id || '');
    setTotalEmployees(0);
    setActiveContracts(0);
    setBhxhRegistered(0);
    setBhxhPaidStatus('PENDING');
    setNotes('');
    setIsOpenModal(true);
  };

  const openEditModal = (r: LaborRecord) => {
    setEditingRecord(r);
    setClientId(r.clientId);
    setTotalEmployees(r.totalEmployees);
    setActiveContracts(r.activeContracts);
    setBhxhRegistered(r.bhxhRegistered);
    setBhxhPaidStatus(r.bhxhPaidStatus);
    setNotes(r.notes || '');
    setIsOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      showError('Doanh nghiệp là mục bắt buộc.');
      return;
    }

    const payload = {
      clientId,
      totalEmployees,
      activeContracts,
      bhxhRegistered,
      bhxhPaidStatus,
      notes
    };

    try {
      let url = '/api/labor-records';
      let method = 'POST';

      if (editingRecord) {
        url = `/api/labor-records/${editingRecord.id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showSuccess(editingRecord ? 'Cập nhật hồ sơ lao động/BHXH thành công!' : 'Đã lập hồ sơ lao động/BHXH thành công!');
        setIsOpenModal(false);
        onRefresh();
      } else {
        const err = await res.json();
        showError(err.error || 'Thao tác lao động thất bại.');
      }
    } catch (_) {
      showError('Không thể đồng bộ dữ liệu mạng.');
    }
  };

  const handleDelete = (id: string) => {
    if (userRole !== 'ADMIN' && userRole !== 'MANAGER') {
      showError('Chỉ có Admin hoặc Trưởng phòng mới được quyền xóa các dữ liệu lao động và bảo hiểm xã hội.');
      return;
    }

    askConfirmation(
      'Xóa Hồ Sơ Lao Động & BHXH',
      'Bạn có thực sự muốn xóa số liệu tổng kết này? Hành động này sẽ loại bỏ hoàn toàn biểu hoạch đóng nộp BHXH của doanh nghiệp hằng kỳ.',
      async () => {
        try {
          const res = await fetch(`/api/labor-records/${id}`, { method: 'DELETE' });
          if (res.ok) {
            showSuccess('Đã hủy hồ sơ lao động suôn sẻ.');
            onRefresh();
          } else {
            showError('Lỗi máy chủ khi hủy bản ghi.');
          }
        } catch (_) {
          showError('Không có kết nối mạng ổn định.');
        }
      }
    );
  };

  const filtered = laborRecords.filter(r => {
    return selectedClientFilter === 'ALL' || r.clientId === selectedClientFilter;
  });

  return (
    <div className="space-y-4 text-xs animate-fade-in">
      
      {/* Top Filter Strip */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-3 ${
        darkMode ? 'bg-zinc-950/40 border-zinc-800' : 'bg-white border-slate-202 shadow-xs'
      }`}>
        <div className="w-full sm:w-80">
          <label className="block text-[9px] uppercase font-bold text-zinc-500 mb-1">Doanh Nghiệp Kiểm Tra Nhân Sự:</label>
          <select
            value={selectedClientFilter}
            onChange={(e) => setSelectedClientFilter(e.target.value)}
            className={`w-full p-2 border border-slate-250 rounded-lg outline-none font-semibold ${
              darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-350' : 'bg-white text-slate-800'
            }`}
          >
            <option value="ALL">🏢 [Tất cả doanh nghiệp]</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.taxCode})</option>
            ))}
          </select>
        </div>

        {(userRole === 'ADMIN' || userRole === 'MANAGER' || userRole === 'TEAM_LEADER') && (
          <button
            onClick={openAddModal}
            className="w-full md:w-auto p-2.5 px-4 bg-red-650 hover:bg-red-550 text-white font-extrabold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-red-100"
          >
            <Plus className="w-4 h-4" />
            <span>THIẾT LẬP HỒ SƠ LAO ĐỘNG</span>
          </button>
        )}
      </div>

      {/* Labor Records Table */}
      <div className={`border rounded-xl overflow-hidden ${
        darkMode ? 'border-zinc-800 bg-zinc-900/40' : 'bg-white border-slate-205 shadow-sm'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[10px] uppercase font-mono tracking-wider font-extrabold ${
                darkMode ? 'bg-zinc-950/50 border-zinc-805 text-zinc-400' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                <th className="p-3 sm:p-4">Doanh nghiệp khách hàng</th>
                <th className="p-3 text-center">Tổng nhân sự hiện hữu</th>
                <th className="p-3 text-center">Hợp đồng chính thức</th>
                <th className="p-3 text-center">Tỷ lệ đăng ký bảo hiểm (BHXH)</th>
                <th className="p-3 text-center">Trạng thái đóng nộp BHXH</th>
                <th className="p-3">Ghi chú nghiệp vụ lao động</th>
                <th className="p-3 text-right pr-4">Hành tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-550 font-medium">
                    Không tìm thấy thông tin quản lý lao động / trích nộp bảo hiểm nào.
                  </td>
                </tr>
              ) : (
                filtered.map(r => {
                  const cl = clients.find(c => c.id === r.clientId);
                  const isHealthy = r.bhxhPaidStatus === 'COMPLETED';
                  const isDanger = r.bhxhPaidStatus === 'OVERDUE';
                  const percent = r.totalEmployees > 0 ? Math.round((r.bhxhRegistered / r.totalEmployees) * 100) : 0;
                  
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-950/20 transition">
                      <td className="p-3 sm:p-4 max-w-xs">
                        <p className={`font-black uppercase text-xs truncate ${darkMode ? 'text-zinc-205' : 'text-slate-850'}`}>
                          {cl ? cl.name : 'N/A'}
                        </p>
                        <p className="font-mono text-[9px] text-zinc-500 mt-0.5">MST: {cl ? cl.taxCode : '—'}</p>
                      </td>
                      <td className="p-3 text-center font-bold text-xs">
                        {r.totalEmployees} người
                      </td>
                      <td className="p-3 text-center font-bold text-xs text-blue-650">
                        {r.activeContracts} HĐLD
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-mono font-black text-xs text-red-655">{r.bhxhRegistered} / {r.totalEmployees} ({percent}%)</span>
                          
                          {/* Mini progress bar */}
                          <div className={`w-20 h-1.5 rounded-full mt-1.5 overflow-hidden ${darkMode ? 'bg-zinc-880' : 'bg-slate-100'}`}>
                            <div 
                              className={`h-full rounded-full ${percent >= 75 ? 'bg-emerald-500' : percent >= 45 ? 'bg-amber-500' : 'bg-rose-500'}`}
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                          isHealthy
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50'
                            : isDanger
                              ? 'bg-rose-50 text-rose-700 border-rose-220 dark:bg-rose-955/20 dark:text-rose-450 dark:border-rose-900/40 animate-pulse'
                              : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-955/20 dark:text-amber-400 dark:border-amber-900/30'
                        }`}>
                          {isHealthy ? '🟢 ĐÃ KHỚP ĐÓNG' : isDanger ? '⚠️ QUÁ HẠN PHAT ĐÓNG' : '🟡 CHỜ TRÍCH NỘP (PENDING)'}
                        </span>
                      </td>
                      <td className={`p-3 font-medium ${darkMode ? 'text-zinc-400' : 'text-slate-600'} max-w-[200px] truncate`}>
                        {r.notes || <span className="text-zinc-500 italic">[Chưa có ghi chú]</span>}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end space-x-1 pr-1">
                          {(userRole === 'ADMIN' || userRole === 'MANAGER' || userRole === 'TEAM_LEADER' || userRole === 'STAFF') && (
                            <button
                              onClick={() => openEditModal(r)}
                              className={`p-1.5 rounded transition hover:scale-105 cursor-pointer ${
                                darkMode ? 'text-zinc-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {(userRole === 'ADMIN' || userRole === 'MANAGER') && (
                            <button
                              onClick={() => handleDelete(r.id)}
                              className={`p-1.5 rounded transition hover:scale-105 cursor-pointer ${
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

      {/* MODAL DIALOG LABOR */}
      {isOpenModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 z-50 animate-fade-in">
          <div className={`w-full max-w-sm rounded-xl border p-4 text-left animate-slide-up ${
            darkMode ? 'border-zinc-800 bg-zinc-900 text-zinc-100' : 'bg-white text-slate-900 border-slate-205 shadow-2xl'
          }`}>
            
            <div className={`flex justify-between items-center border-b pb-2.5 mb-3.5 ${
              darkMode ? 'border-zinc-800' : 'border-slate-150'
            }`}>
              <h3 className="font-black text-xs uppercase flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-500" />
                <span>{editingRecord ? 'CẬP NHẬT HỒ SƠ LAO ĐỘNG & BẢO HIỂM' : 'THIẾT LẬP TỔNG KẾT NHÂN SỰ & BHXH'}</span>
              </h3>
              <button onClick={() => setIsOpenModal(false)} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 font-sans font-medium text-xs">
              
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1">Doanh Nghiệp / Chủ sử dụng lao động:</label>
                <select
                  disabled={!!editingRecord}
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className={`w-full p-2.5 border border-slate-250 rounded-lg outline-none font-bold ${
                    darkMode ? 'bg-zinc-950 border-zinc-810 text-zinc-200' : 'bg-white'
                  }`}
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.taxCode})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[9px] uppercase font-bold text-zinc-550 mb-1">Tổng Nhân Sự:</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={totalEmployees}
                    onChange={(e) => setTotalEmployees(Number(e.target.value))}
                    className="w-full p-2 border border-slate-250 rounded-lg outline-none font-bold font-mono focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-bold text-zinc-550 mb-1">Số Hợp Đồng:</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={activeContracts}
                    onChange={(e) => setActiveContracts(Number(e.target.value))}
                    className="w-full p-2 border border-slate-250 rounded-lg outline-none font-bold font-mono focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-bold text-zinc-550 mb-1">Đã Đóng BHXH:</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={bhxhRegistered}
                    onChange={(e) => setBhxhRegistered(Number(e.target.value))}
                    className="w-full p-2 border border-slate-250 rounded-lg outline-none font-bold font-mono focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1">Trạng Thái Trích Đóng BHXH Hiện Kỳ:</label>
                <select
                  value={bhxhPaidStatus}
                  onChange={(e) => setBhxhPaidStatus(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-250 rounded-lg outline-none text-xs font-bold"
                >
                  <option value="COMPLETED">🟢 Đã trích nộp hoàn tất khớp (Completed)</option>
                  <option value="PENDING">🟡 Chờ trích đóng (Đang tích lũy quỹ)</option>
                  <option value="OVERDUE">🔴 Cảnh báo trễ đóng / Quá hạn nộp phạt</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1">Ghi chú / Trạng thái công đoàn chi tiết:</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ghi nhận hồ sơ phát sinh bổ sung hoặc nợ xấu..."
                  rows={2.5}
                  className="w-full p-2 border border-slate-250 rounded-lg outline-none text-xs font-sans"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="px-4 py-2 border rounded-lg text-xs font-bold cursor-pointer"
                >
                  HUỶ BỎ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-650 hover:bg-red-550 text-white font-extrabold rounded-lg text-xs cursor-pointer shadow-sm shadow-red-100"
                >
                  {editingRecord ? 'LƯU HỒ SƠ' : 'BỔ SUNG HỒ SƠ'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
