import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  X, 
  FileSpreadsheet, 
  Check, 
  AlertTriangle, 
  Trash2, 
  Edit2, 
  TrendingUp, 
  RefreshCw,
  Eye
} from 'lucide-react';
import { AccountingRecord, Client } from '../types';

interface AccountingTabProps {
  accountingRecords: AccountingRecord[];
  clients: Client[];
  darkMode: boolean;
  userRole: string;
  onRefresh: () => void;
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
  askConfirmation: (title: string, message: string, onConfirm: () => void) => void;
}

export default function AccountingTab({
  accountingRecords,
  clients,
  darkMode,
  userRole,
  onRefresh,
  showSuccess,
  showError,
  askConfirmation
}: AccountingTabProps) {
  const [selectedClientFilter, setSelectedClientFilter] = useState<string>('ALL');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AccountingRecord | null>(null);

  // Form Fields
  const [clientId, setClientId] = useState('');
  const [period, setPeriod] = useState('');
  const [bctcStatus, setBctcStatus] = useState<AccountingRecord['bctcStatus']>('NOT_STARTED');
  const [bookkeepingStatus, setBookkeepingStatus] = useState<AccountingRecord['bookkeepingStatus']>('ALIGNED');
  const [documentCount, setDocumentCount] = useState<number>(0);
  const [doubleEntriesCount, setDoubleEntriesCount] = useState<number>(0);
  const [unalignedIssues, setUnalignedIssues] = useState('');

  // Active ledger simulation states
  const [simulatedLedger, setSimulatedLedger] = useState<{
    id: string;
    debitAccount: string;
    creditAccount: string;
    amount: number;
    description: string;
  }[]>([]);
  const [simDebit, setSimDebit] = useState('1111');
  const [simCredit, setSimCredit] = useState('5111');
  const [simAmount, setSimAmount] = useState(15000000);
  const [simDesc, setSimDesc] = useState('Doanh thu bán vàng gia công tháng này');

  const openAddModal = () => {
    setEditingRecord(null);
    setClientId(clients[0]?.id || '');
    const now = new Date();
    setPeriod(`${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`);
    setBctcStatus('NOT_STARTED');
    setBookkeepingStatus('ALIGNED');
    setDocumentCount(0);
    setDoubleEntriesCount(0);
    setUnalignedIssues('');
    setIsOpenModal(true);
  };

  const openEditModal = (r: AccountingRecord) => {
    setEditingRecord(r);
    setClientId(r.clientId);
    setPeriod(r.period);
    setBctcStatus(r.bctcStatus);
    setBookkeepingStatus(r.bookkeepingStatus);
    setDocumentCount(r.documentCount);
    setDoubleEntriesCount(r.doubleEntriesCount);
    setUnalignedIssues(r.unalignedIssues || '');
    setIsOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !period) {
      showError('Khách hàng và chu kỳ kiểm tra là bắt buộc.');
      return;
    }

    const payload = {
      clientId,
      period,
      bctcStatus,
      bookkeepingStatus,
      documentCount,
      doubleEntriesCount,
      unalignedIssues: bookkeepingStatus === 'UNALIGNED' ? unalignedIssues : undefined
    };

    try {
      let url = '/api/accounting-records';
      let method = 'POST';

      if (editingRecord) {
        url = `/api/accounting-records/${editingRecord.id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showSuccess(editingRecord ? 'Cập nhật sổ sách thành công!' : 'Tạo hồ sơ kế toán thành công!');
        setIsOpenModal(false);
        onRefresh();
      } else {
        const err = await res.json();
        showError(err.error || 'Thao tác kế toán thất bại.');
      }
    } catch (_) {
      showError('Lỗi kết nối máy chủ dữ liệu.');
    }
  };

  const handleDelete = (id: string) => {
    if (userRole !== 'ADMIN' && userRole !== 'MANAGER') {
      showError('Chỉ có Admin hoặc Trưởng phòng mới được quyền xóa số liệu kế toán pháp định.');
      return;
    }

    askConfirmation(
      'Xóa Hồ Sơ Kế Toán',
      'Bạn có chắc muốn xóa hồ sơ sổ sách kế toán của chu kỳ này không? Số liệu tổng hợp tài chính sẽ bị đảo ngược.',
      async () => {
        try {
          const res = await fetch(`/api/accounting-records/${id}`, { method: 'DELETE' });
          if (res.ok) {
            showSuccess('Đã xóa dữ liệu sổ sách kế toán thành công.');
            onRefresh();
          } else {
            showError('Lỗi hạ tầng khi xóa bản ghi.');
          }
        } catch (_) {
          showError('Lỗi đường truyền mạng.');
        }
      }
    );
  };

  const addSimulatedLedgerRow = (e: React.FormEvent) => {
    e.preventDefault();
    setSimulatedLedger(prev => [
      ...prev,
      {
        id: `sim-${Date.now()}`,
        debitAccount: simDebit,
        creditAccount: simCredit,
        amount: simAmount,
        description: simDesc
      }
    ]);
    showSuccess('Đã hạch toán bút toán định khoản thử nghiệm!');
  };

  const deleteSimLedgerRow = (id: string) => {
    setSimulatedLedger(prev => prev.filter(r => r.id !== id));
  };

  const filtered = accountingRecords.filter(r => {
    return selectedClientFilter === 'ALL' || r.clientId === selectedClientFilter;
  });

  return (
    <div className="space-y-5 text-xs animate-fade-in">
      
      {/* Top Controls */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-3 ${
        darkMode ? 'bg-zinc-950/40 border-zinc-800' : 'bg-white border-slate-202 shadow-xs'
      }`}>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
          <div className="w-full sm:w-80">
            <label className="block text-[9px] uppercase font-bold text-zinc-500 mb-1">Doanh Nghiệp Đối Soát Sổ Sách:</label>
            <select
              value={selectedClientFilter}
              onChange={(e) => setSelectedClientFilter(e.target.value)}
              className={`w-full p-2 border rounded-lg outline-none font-semibold ${
                darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-350' : 'bg-white border-slate-250 text-slate-800'
              }`}
            >
              <option value="ALL">🏢 [Tất cả khách hàng doanh nghiệp]</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.taxCode})</option>
              ))}
            </select>
          </div>
        </div>

        {(userRole === 'ADMIN' || userRole === 'MANAGER' || userRole === 'TEAM_LEADER') && (
          <button
            onClick={openAddModal}
            className="w-full md:w-auto p-2.5 px-4 bg-red-650 hover:bg-red-550 text-white font-extrabold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-98 transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>KHỞI TẠO ĐỐI SOÁT CHU KỲ KIỂM</span>
          </button>
        )}
      </div>

      {/* Grid: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Sổ sách kế toán list */}
        <div className="lg:col-span-7 space-y-4">
          <div className={`border rounded-xl overflow-hidden ${
            darkMode ? 'border-zinc-800 bg-zinc-900/40' : 'bg-white border-slate-205 shadow-sm'
          }`}>
            <div className="p-3 border-b animate-pulse font-extrabold text-[10px] uppercase font-mono tracking-wider flex items-center gap-1.5 text-red-650 bg-red-50/10 border-red-550/10">
              <RefreshCw className="w-3.5 h-3.5 shrink-0" />
              <span>Đối khớp số sách pháp định & báo cáo tài chính hằng chu kỳ</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-[9px] uppercase font-mono tracking-wider font-extrabold ${
                    darkMode ? 'bg-zinc-950/50 border-zinc-805 text-zinc-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}>
                    <th className="p-3">Doanh nghiệp khách hàng</th>
                    <th className="p-3">Chu kỳ hạch toán</th>
                    <th className="p-3">Chứng từ phát sinh</th>
                    <th className="p-3">Định khoản hạch toán</th>
                    <th className="p-3">Sổ Sách & BCTC</th>
                    <th className="p-3 text-right pr-4">Tác vụ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-zinc-550 font-medium">
                        Không tìm thấy đối soát số sách phù hợp với truy vấn.
                      </td>
                    </tr>
                  ) : (
                    filtered.map(r => {
                      const cl = clients.find(c => c.id === r.clientId);
                      const isUnaligned = r.bookkeepingStatus === 'UNALIGNED';
                      
                      return (
                        <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-950/20 transition">
                          <td className="p-3 max-w-[150px]">
                            <p className={`font-black uppercase text-xs truncate ${darkMode ? 'text-zinc-200' : 'text-slate-850'}`}>
                              {cl ? cl.name : 'N/A'}
                            </p>
                            <p className="font-mono text-[9px] text-zinc-500 mt-0.5">MST: {cl ? cl.taxCode : '—'}</p>
                          </td>
                          <td className="p-3 font-mono font-bold text-blue-650 text-[11px]">{r.period}</td>
                          <td className="p-3 font-sans font-bold text-[11px] text-red-655">{r.documentCount.toLocaleString('vi-VN')} hóa đơn</td>
                          <td className="p-3 font-mono font-medium">{r.doubleEntriesCount.toLocaleString('vi-VN')} bút toán</td>
                          <td className="p-3 space-y-1.5 min-w-[140px]">
                            <div className="flex items-center space-x-1">
                              <span className={`w-2 h-2 rounded-full inline-block ${
                                r.bctcStatus === 'COMPLETED' ? 'bg-emerald-500' : r.bctcStatus === 'IN_PROGRESS' ? 'bg-amber-500' : 'bg-zinc-450'
                              }`}></span>
                              <span className="font-semibold text-[10px]">
                                {r.bctcStatus === 'COMPLETED' ? 'BCTC ĐÃ HOÀN THÀNH' : r.bctcStatus === 'IN_PROGRESS' ? 'BCTC ĐẠT 40%' : 'BCTC CHƯA LÀM'}
                              </span>
                            </div>

                            <div className={`p-1 px-1.5 border rounded flex items-center gap-1 text-[9px] font-extrabold ${
                              isUnaligned 
                                ? 'bg-rose-50 border-rose-205 text-rose-700 dark:bg-rose-955/20 dark:text-rose-400' 
                                : 'bg-emerald-50 border-emerald-250 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                            }`}>
                              {isUnaligned ? <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" /> : <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                              <span className="uppercase">{isUnaligned ? 'PHÁT HIỆN LỆCH PHÁP LÝ' : 'ĐỒNG BỘ SUỐN SẺ'}</span>
                            </div>
                            
                            {isUnaligned && r.unalignedIssues && (
                              <p className="text-[10px] text-rose-500 italic max-w-[130px] font-sans truncate" title={r.unalignedIssues}>
                                * "{r.unalignedIssues}"
                              </p>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end space-x-0.5">
                              {(userRole === 'ADMIN' || userRole === 'MANAGER' || userRole === 'TEAM_LEADER' || userRole === 'STAFF') && (
                                <button
                                  onClick={() => openEditModal(r)}
                                  className={`p-1.5 rounded transition hover:scale-105 cursor-pointer ${
                                    darkMode ? 'text-zinc-400 hover:text-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
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
        </div>

        {/* Right Column: Sổ Thử Nghiệm Định Khoản (Dual-entry dynamic ledger simulator) */}
        <div className="lg:col-span-5 space-y-4">
          <div className={`p-4 rounded-xl border ${
            darkMode ? 'bg-zinc-950/40 border-zinc-c800 text-zinc-100' : 'bg-white border-slate-205 shadow-sm'
          }`}>
            <h3 className="font-extrabold text-xs text-red-650 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2.5 border-red-500/10">
              <TrendingUp className="w-4 h-4 text-red-500" />
              <span>Giao Diện Hạch Toán Kiểm Tra Thử Nghiệm (Ledger Sandbox)</span>
            </h3>

            <p className={`text-[11px] mb-3 leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-slate-550'}`}>
              Giả lập hạch toán bút toán định khoản chuẩn Bộ Tài chính (Nợ/Có) đối chứng với chứng từ thực tế của hộ kinh doanh/doanh nghiệp:
            </p>

            <form onSubmit={addSimulatedLedgerRow} className="grid grid-cols-2 gap-3 mb-4">
              <div className="col-span-2">
                <label className="block text-[9px] uppercase font-bold text-zinc-500 mb-1">Nội dung diễn giải nghiệp vụ hạch toán:</label>
                <input
                  type="text"
                  required
                  value={simDesc}
                  onChange={(e) => setSimDesc(e.target.value)}
                  placeholder="Ví dụ: Rút tiền gửi ngân hàng quốc doanh..."
                  className={`w-full p-2 border rounded-lg outline-none font-semibold ${
                    darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-slate-50 border-slate-250 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase font-bold text-zinc-500 mb-1">Tài khoản NỢ (Debit Acc):</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={simDebit}
                  onChange={(e) => setSimDebit(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="TK ví dụ: 1111"
                  className={`w-full p-2 border rounded-lg outline-none font-mono font-bold tracking-wider text-emerald-650 ${
                    darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-slate-50 border-slate-250'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase font-bold text-zinc-500 mb-1">Tài khoản CÓ (Credit Acc):</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={simCredit}
                  onChange={(e) => setSimCredit(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="TK ví dụ: 1121"
                  className={`w-full p-2 border rounded-lg outline-none font-mono font-bold tracking-wider text-rose-655 ${
                    darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-slate-50 border-slate-250'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase font-bold text-zinc-500 mb-1">Số tiền nghiệp vụ phát sinh (đ):</label>
                <input
                  type="number"
                  required
                  value={simAmount}
                  onChange={(e) => setSimAmount(Number(e.target.value))}
                  placeholder="Số tiền hạch toán..."
                  className={`w-full p-2 border rounded-lg outline-none font-mono font-bold text-red-655 ${
                    darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-slate-50 border-slate-250'
                  }`}
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full h-[34px] bg-red-650 hover:bg-red-550 text-white font-extrabold rounded-lg flex items-center justify-center gap-1 shadow-sm active:scale-98 transition duration-150 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>XUẤT BÚT TOÁN</span>
                </button>
              </div>
            </form>

            {/* Simulated ledger list */}
            <div className={`p-1 rounded-lg border max-h-[220px] overflow-y-auto ${
              darkMode ? 'bg-black/40 border-zinc-850' : 'bg-slate-50 border-slate-150'
            }`}>
              {simulatedLedger.length === 0 ? (
                <p className="p-6 text-center text-zinc-550 font-medium font-sans">
                  Sảnh: Nhập hóa đơn ở trên để mô phỏng bút toán Nợ/Có.
                </p>
              ) : (
                <div className="space-y-1.5 p-1.5">
                  {simulatedLedger.map(row => (
                    <div key={row.id} className={`p-2 rounded border flex items-center justify-between gap-2.5 font-mono text-[10px] sm:text-xs tracking-tight ${
                      darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
                    }`}>
                      <div className="space-y-1">
                        <p className={`font-semibold font-sans ${darkMode ? 'text-zinc-250' : 'text-slate-700'}`}>{row.description}</p>
                        <div className="flex items-center space-x-3 text-[10px]">
                          <span className="text-emerald-650 font-bold">Nợ TK {row.debitAccount}</span>
                          <span className="text-rose-655 font-bold">Có TK {row.creditAccount}</span>
                          <span className="text-zinc-500 font-extrabold">| Amount: {row.amount.toLocaleString('vi-VN')} đ</span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteSimLedgerRow(row.id)}
                        className={`p-1 shrink-0 rounded transition hover:bg-rose-50 text-slate-400 hover:text-rose-600`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  
                  {/* Balance ledger test status summary */}
                  <div className="border-t pt-1.5 mt-2 flex justify-between text-[10px] uppercase font-bold text-emerald-600">
                    <span>Tổng Bút toán giả định: {simulatedLedger.length}</span>
                    <span>Cân đối Ledger: 100% CÂN</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* COMPACT DIALOG FORM */}
      {isOpenModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 z-50 animate-fade-in">
          <div className={`w-full max-w-sm rounded-xl border p-4 text-left animate-slide-up ${
            darkMode ? 'border-zinc-800 bg-zinc-900 text-zinc-100' : 'bg-white text-slate-900 border-slate-205 shadow-2xl'
          }`}>
            
            <div className={`flex justify-between items-center border-b pb-2.5 mb-3.5 ${
              darkMode ? 'border-zinc-800' : 'border-slate-150'
            }`}>
              <h3 className="font-black text-xs uppercase flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-red-500" />
                <span>{editingRecord ? 'CẬP NHẬT CHI CHU KỲ KIỂM' : 'QUYẾT ĐỊNH KHẢI TẠO ĐỐI SOÁT'}</span>
              </h3>
              <button onClick={() => setIsOpenModal(false)} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 font-sans font-medium text-xs">
              
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1">Khách Hàng Khảo Sát Sổ Sách:</label>
                <select
                  disabled={!!editingRecord}
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className={`w-full p-2.5 border rounded-lg outline-none font-bold ${
                    darkMode ? 'bg-zinc-950 border-zinc-810 text-zinc-200' : 'bg-white border-slate-250'
                  }`}
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.taxCode})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1">Kỳ Hạch Toán:</label>
                  <input
                    type="text"
                    required
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    placeholder="Ví dụ: 06/2026"
                    className={`w-full p-2.5 border rounded-lg outline-none font-bold ${
                      darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-250'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1">Chứng Từ Phái Sinh (HĐ):</label>
                  <input
                    type="number"
                    value={documentCount}
                    onChange={(e) => setDocumentCount(Number(e.target.value))}
                    className={`w-full p-2.5 border rounded-lg outline-none font-mono font-bold text-red-655 ${
                      darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-250'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1">Định Khoản Bút Toán (Acc):</label>
                  <input
                    type="number"
                    value={doubleEntriesCount}
                    onChange={(e) => setDoubleEntriesCount(Number(e.target.value))}
                    className={`w-full p-2.5 border rounded-lg outline-none font-mono font-bold ${
                      darkMode ? 'bg-zinc-955 border-zinc-800' : 'bg-white border-slate-250'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1">Đồng Bộ Sổ Sách:</label>
                  <select
                    value={bookkeepingStatus}
                    onChange={(e) => setBookkeepingStatus(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-250 rounded-lg outline-none text-xs font-bold"
                  >
                    <option value="ALIGNED">🟢 [Đã cân đối khớp]</option>
                    <option value="UNALIGNED">🔴 [Có lệch hạch toán]</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1">Báo Cáo Tài Chính Năm (BCTC):</label>
                <select
                  value={bctcStatus}
                  onChange={(e) => setBctcStatus(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-250 rounded-lg outline-none text-xs font-bold"
                >
                  <option value="NOT_STARTED">❌ Chưa lập báo cáo năm</option>
                  <option value="IN_PROGRESS">⏳ Đang tiến hành (In Progress)</option>
                  <option value="COMPLETED">✅ Hoàn thành hoàn chỉnh</option>
                </select>
              </div>

              {bookkeepingStatus === 'UNALIGNED' && (
                <div>
                  <label className="block text-[10px] uppercase font-bold text-rose-500 mb-1">Chi Tiết Sai Lệch Hạch Toán:</label>
                  <textarea
                    required
                    value={unalignedIssues}
                    onChange={(e) => setUnalignedIssues(e.target.value)}
                    placeholder="Ví dụ: Hoá đơn đầu ra số 54 lệch tiền thuế GTGT so với tờ khai điện tử..."
                    rows={2}
                    className="w-full p-2 border border-slate-250 rounded-lg outline-none text-rose-655 font-bold"
                  />
                </div>
              )}

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
                  {editingRecord ? 'LƯU HỒ SƠ' : 'LẬP KHỞI BIÊN'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
