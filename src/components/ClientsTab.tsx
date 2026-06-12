import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Building, 
  User, 
  Briefcase, 
  Edit2, 
  Trash2, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Hash,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import { Client, ClientType } from '../types';

interface ClientsTabProps {
  clients: Client[];
  darkMode: boolean;
  userRole: string;
  onRefresh: () => void;
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
  askConfirmation: (title: string, message: string, onConfirm: () => void) => void;
}

export default function ClientsTab({
  clients,
  darkMode,
  userRole,
  onRefresh,
  showSuccess,
  showError,
  askConfirmation
}: ClientsTabProps) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [type, setType] = useState<ClientType>('ENTERPRISE');
  const [taxCode, setTaxCode] = useState('');
  const [representative, setRepresentative] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [industry, setIndustry] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'SUSPENDED'>('ACTIVE');

  const openAddModal = () => {
    setEditingClient(null);
    setName('');
    setType('ENTERPRISE');
    setTaxCode('');
    setRepresentative('');
    setPhone('');
    setEmail('');
    setAddress('');
    setIndustry('');
    setStatus('ACTIVE');
    setIsOpenModal(true);
  };

  const openEditModal = (cl: Client) => {
    setEditingClient(cl);
    setName(cl.name);
    setType(cl.type);
    setTaxCode(cl.taxCode);
    setRepresentative(cl.representative);
    setPhone(cl.phone || '');
    setEmail(cl.email || '');
    setAddress(cl.address || '');
    setIndustry(cl.industry || '');
    setStatus(cl.status);
    setIsOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !taxCode.trim() || !representative.trim()) {
      showError('Họ tên, Mã số thuế và Đại diện pháp luật là bắt buộc.');
      return;
    }

    const payload = { name, type, taxCode, representative, phone, email, address, industry, status };

    try {
      let url = '/api/clients';
      let method = 'POST';
      
      if (editingClient) {
        url = `/api/clients/${editingClient.id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showSuccess(editingClient ? 'Cập nhật khách hàng thành công!' : 'Thêm khách hàng thành công!');
        setIsOpenModal(false);
        onRefresh();
      } else {
        const err = await res.json();
        showError(err.error || 'Có lỗi xảy ra.');
      }
    } catch (_) {
      showError('Lỗi kết nối máy chủ dịch vụ.');
    }
  };

  const handleDelete = (id: string, clientName: string) => {
    if (userRole !== 'ADMIN' && userRole !== 'MANAGER') {
      showError('Chỉ có vai trò Admin hoặc Trưởng phòng (Manager) mới có quyền xóa khách hàng.');
      return;
    }

    askConfirmation(
      'Xóa Khách Hàng',
      `Bạn có thực sự muốn xóa khách hàng "${clientName}" không? Hành động này sẽ tự động xóa tất cả các Tờ khai thuế, Sổ hạch toán kế toán và Báo cáo bảo hiểm (BHXH) liên kết với doanh nghiệp này hằng tháng/quý.`,
      async () => {
        try {
          const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
          if (res.ok) {
            showSuccess('Đã xóa dữ liệu khách hàng thành công.');
            onRefresh();
          } else {
            showError('Lỗi máy chủ khi xóa khách hàng.');
          }
        } catch (_) {
          showError('Không thể kết nối mạng.');
        }
      }
    );
  };

  const filtered = clients.filter(c => {
    const term = search.toLowerCase();
    const matchesSearch = c.name.toLowerCase().includes(term) || 
                          c.taxCode.includes(term) || 
                          c.representative.toLowerCase().includes(term);
    const matchesType = filterType === 'ALL' || c.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4 text-xs animate-fade-in">
      
      {/* Search and Filters Strip */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-3 ${
        darkMode ? 'bg-zinc-950/40 border-zinc-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
          
          {/* Custom interactive search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Tìm theo Tên, MST, Đại diện..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 border rounded-lg outline-none font-medium transition ${
                darkMode 
                  ? 'bg-zinc-900 border-zinc-800 focus:border-red-600 text-zinc-100' 
                  : 'bg-white border-slate-250 focus:border-red-500 text-slate-800'
              }`}
            />
          </div>

          {/* Type filters */}
          <div className="flex items-center space-x-1 w-full sm:w-auto overflow-x-auto">
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: 'ENTERPRISE', label: 'Doanh nghiệp' },
              { id: 'HOUSEHOLD', label: 'Hộ kinh doanh' },
              { id: 'INDIVIDUAL', label: 'Cá nhân cho thuê' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`p-1.5 px-3.5 rounded-lg border font-bold font-sans transition cursor-pointer text-[10px] sm:text-xs shrink-0 ${
                  filterType === tab.id
                    ? 'bg-red-650 border-red-650 text-white'
                    : darkMode
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions bar (create client) */}
        {(userRole === 'ADMIN' || userRole === 'MANAGER' || userRole === 'TEAM_LEADER') && (
          <button
            onClick={openAddModal}
            className="w-full md:w-auto self-stretch md:self-auto p-2 px-4 bg-red-650 hover:bg-red-550 text-white font-extrabold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-98 transition duration-150"
          >
            <Plus className="w-4 h-4" />
            <span>THÊM KHÁCH HÀNG MỚI</span>
          </button>
        )}
      </div>

      {/* Clients Table */}
      <div className={`border rounded-xl overflow-hidden ${
        darkMode ? 'border-zinc-800 bg-zinc-900/40' : 'bg-white border-slate-205 shadow-sm'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[10px] uppercase font-mono tracking-wider font-extrabold ${
                darkMode ? 'bg-zinc-950/50 border-zinc-800 text-zinc-400' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                <th className="p-3 sm:p-4">Khách hàng</th>
                <th className="p-3">Mã số thuế</th>
                <th className="p-3">Pháp nhân & Đại điện</th>
                <th className="p-3">Lĩnh vực hoạt động</th>
                <th className="p-3">Liên lạc</th>
                <th className="p-3 text-center">Trạng thái</th>
                <th className="p-3 text-right pr-4">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-550 font-medium font-sans">
                    Nhiệm vụ: Không tìm thấy hồ sơ doanh nghiệp khách hàng nào khớp.
                  </td>
                </tr>
              ) : (
                filtered.map(c => {
                  const isEnterprise = c.type === 'ENTERPRISE';
                  const isHousehold = c.type === 'HOUSEHOLD';
                  
                  return (
                    <tr key={c.id} className={`hover:bg-slate-50/50 dark:hover:bg-zinc-950/20 transition ${
                      c.status === 'SUSPENDED' ? 'opacity-65' : ''
                    }`}>
                      <td className="p-3 sm:p-4 max-w-xs">
                        <div className="flex items-center space-x-2.5">
                          <div className={`p-2 rounded-lg shrink-0 ${
                            isEnterprise 
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' 
                              : isHousehold 
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' 
                                : 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400'
                          }`}>
                            {isEnterprise ? <Building className="w-4 h-4" /> : isHousehold ? <Briefcase className="w-4 h-4" /> : <User className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className={`font-black text-xs uppercase leading-snug tracking-tight ${
                              darkMode ? 'text-zinc-200' : 'text-slate-900'
                            }`}>{c.name}</p>
                            <span className={`text-[9px] font-mono rounded px-1.5 py-0.5 mt-1 inline-block border ${
                              isEnterprise 
                                ? 'bg-blue-50/50 dark:bg-blue-950/10 text-blue-650 border-blue-200/50' 
                                : isHousehold 
                                  ? 'bg-amber-50/50 dark:bg-amber-950/10 text-amber-700 border-amber-200/50' 
                                  : 'bg-purple-50/50 dark:bg-purple-950/10 text-purple-650 border-purple-200/50'
                            }`}>
                              {isEnterprise ? '💼 DOANH NGHIỆP' : isHousehold ? '🏪 HỘ KINH DOANH' : '👤 CÁ NHÂN KINH DOANH'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-mono font-bold tracking-wider text-red-650">
                        {c.taxCode}
                      </td>
                      <td className="p-3">
                        <p className={`font-semibold ${darkMode ? 'text-zinc-300' : 'text-slate-850'}`}>{c.representative}</p>
                        <p className={`text-[10px] ${darkMode ? 'text-zinc-500' : 'text-slate-500'}`}>Người đại diện pháp luật</p>
                      </td>
                      <td className={`p-3 font-medium ${darkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
                        {c.industry || 'Chưa cập nhật'}
                      </td>
                      <td className="p-3 space-y-0.5 font-sans leading-tight">
                        {c.phone && <div className="flex items-center gap-1 text-[11px] text-zinc-550"><Phone className="w-3 h-3 text-zinc-400 shrink-0" /><span>{c.phone}</span></div>}
                        {c.email && <div className="flex items-center gap-1 text-[11px] text-zinc-550"><Mail className="w-3 h-3 text-zinc-400 shrink-0" /><span>{c.email}</span></div>}
                        {c.address && <div className="flex items-center gap-1 text-[10px] text-zinc-500 truncate max-w-[150px]"><MapPin className="w-3 h-3 text-zinc-450 shrink-0" /><span>{c.address}</span></div>}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                          c.status === 'ACTIVE' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50' 
                            : 'bg-rose-50 text-rose-700 border-rose-205 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50'
                        }`}>
                          {c.status === 'ACTIVE' ? 'ĐANG HOẠT ĐỘNG' : 'TẠM NGƯNG'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5 pr-1">
                          {(userRole === 'ADMIN' || userRole === 'MANAGER' || userRole === 'TEAM_LEADER') && (
                            <button
                              onClick={() => openEditModal(c)}
                              className={`p-1.5 rounded transition hover:scale-105 cursor-pointer ${
                                darkMode ? 'text-zinc-400 hover:text-white hover:bg-[#1e293b]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                              }`}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {(userRole === 'ADMIN' || userRole === 'MANAGER') && (
                            <button
                              onClick={() => handleDelete(c.id, c.name)}
                              className={`p-1.5 rounded transition hover:scale-105 cursor-pointer ${
                                darkMode ? 'text-zinc-500 hover:text-rose-400 hover:bg-rose-950/20' : 'text-slate-400 hover:text-rose-655 hover:bg-rose-50'
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

      {/* CREATE & EDIT MODAL DIALOG */}
      {isOpenModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 z-50 animate-fade-in">
          <div className={`w-full max-w-lg rounded-xl border p-4 sm:p-5 text-left animate-slide-up ${
            darkMode ? 'border-zinc-800 bg-zinc-900 text-zinc-100' : 'bg-white text-slate-900 border-slate-205 shadow-2xl'
          }`}>
            
            <div className={`flex justify-between items-center border-b pb-3 mb-4 ${
              darkMode ? 'border-zinc-800' : 'border-slate-150'
            }`}>
              <h3 className="font-black text-xs sm:text-sm uppercase flex items-center gap-1.5">
                <Users className="w-4 h-4 text-red-500" />
                <span>{editingClient ? 'CẬP NHẬT THÔNG TIN KHÁCH HÀNG' : 'THÊM KHÁCH HÀNG PHÁP NHÂN MỚI'}</span>
              </h3>
              <button
                onClick={() => setIsOpenModal(false)}
                className={`p-1 rounded transition cursor-pointer ${
                  darkMode ? 'text-zinc-400 hover:text-white' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 font-sans font-medium text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1">Tên Doanh Nghiệp / Hộ Kinh Doanh:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Công ty TNHH Thương mại Hoàng Phát, Tiệm vàng Long..."
                    className={`w-full p-2.5 border rounded-lg outline-none font-semibold ${
                      darkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-250 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1">Loại Hình Hạch Toán:</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ClientType)}
                    className={`w-full p-2.5 border rounded-lg outline-none font-bold ${
                      darkMode ? 'bg-zinc-950 border-zinc-805 text-zinc-200' : 'bg-white border-slate-250 text-slate-850'
                    }`}
                  >
                    <option value="ENTERPRISE">🏢 Doanh Nghiệp (Doanh thu & Sổ sách)</option>
                    <option value="HOUSEHOLD">🏪 Hộ Kinh Doanh (Thương gia / Kê khai)</option>
                    <option value="INDIVIDUAL">👤 Cá nhân cho thuê bất động sản</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1">Mã Số Thuế (MST - Sổ vàng):</label>
                  <input
                    type="text"
                    required
                    maxLength={14}
                    value={taxCode}
                    onChange={(e) => setTaxCode(e.target.value.replace(/[^0-9-]/g, ''))}
                    placeholder="Ví dụ: 0108345129"
                    className={`w-full p-2.5 border rounded-lg outline-none font-bold tracking-widest text-red-650 ${
                      darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-250 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1">Đại Diện Pháp Luật:</label>
                  <input
                    type="text"
                    required
                    value={representative}
                    onChange={(e) => setRepresentative(e.target.value)}
                    placeholder="Họ tên chủ sở hữu / Thẻ CCCD..."
                    className={`w-full p-2.5 border rounded-lg outline-none ${
                      darkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-250 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1">Lĩnh vực hoạt động chính:</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="Bán buôn, Gia công vàng, Cho thuê xưởng..."
                    className={`w-full p-2.5 border rounded-lg outline-none ${
                      darkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-250 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1">Số điện thoại liên lạc:</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Đầu số di động hoặc cố định..."
                    className={`w-full p-2.5 border rounded-lg outline-none ${
                      darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-250'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1">Địa chỉ Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ketoan@example.com"
                    className={`w-full p-2.5 border rounded-lg outline-none ${
                      darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-250'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1">Địa chỉ thường trú / Trụ sở hợp lệ:</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ghi rõ Số nhà, Đường, Phường, Quận, Thành phố..."
                  className={`w-full p-2.5 border rounded-lg outline-none ${
                    darkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-250 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] uppercase font-bold text-zinc-550">Trạng Thái Pháp Lý Hoạt Động:</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input
                        type="radio"
                        checked={status === 'ACTIVE'}
                        onChange={() => setStatus('ACTIVE')}
                        className="text-red-650"
                      />
                      <span className="font-bold text-emerald-650 text-[11px]">ĐANG HOẠT ĐỘNG</span>
                    </label>
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input
                        type="radio"
                        checked={status === 'SUSPENDED'}
                        onChange={() => setStatus('SUSPENDED')}
                      />
                      <span className="font-bold text-rose-655 text-[11px]">TẠM NGƯNG DỊCH VỤ</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className={`flex justify-end gap-2.5 pt-3 border-t ${
                darkMode ? 'border-zinc-800' : 'border-slate-150'
              }`}>
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className={`px-4.5 py-2 border rounded-lg text-xs font-bold transition cursor-pointer ${
                    darkMode 
                      ? 'bg-zinc-955 border-zinc-800 text-zinc-400 hover:text-white' 
                      : 'bg-white border-slate-255 text-slate-600 hover:bg-slate-100/80 hover:text-slate-850 shadow-xs'
                  }`}
                >
                  HUỶ BỎ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-650 hover:bg-red-550 text-white font-extrabold rounded-lg text-xs cursor-pointer shadow-sm active:scale-98 transition duration-150"
                >
                  {editingClient ? 'CẬP NHẬT DOANH NGHIỆP' : 'LƯU HỒ SƠ KHÁCH HÀNG'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
