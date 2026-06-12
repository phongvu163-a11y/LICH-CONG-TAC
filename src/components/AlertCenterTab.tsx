import React, { useState } from 'react';
import { 
  Bell, 
  Settings, 
  Trash2, 
  Check, 
  MessageSquare, 
  Volume2, 
  Send, 
  Info, 
  AlertTriangle,
  Play
} from 'lucide-react';
import { AppNotification } from '../types';

interface AlertCenterTabProps {
  notifications: AppNotification[];
  darkMode: boolean;
  settings: {
    darkMode: boolean;
    fontSize: 'normal' | 'large' | 'extra-large';
    dailyAlertTime: string;
    soundEnabled: boolean;
  };
  onSaveSettings: (newSet: any) => void;
  onRefresh: () => void;
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
  playAlertSound: (sound: 'success' | 'warn' | 'beep') => void;
}

export default function AlertCenterTab({
  notifications,
  darkMode,
  settings,
  onSaveSettings,
  onRefresh,
  showSuccess,
  showError,
  playAlertSound
}: AlertCenterTabProps) {
  const [activeChannel, setActiveChannel] = useState<'TELEGRAM' | 'ZALO' | 'EMAIL'>('TELEGRAM');
  const [broadcastMsg, setBroadcastMsg] = useState('🚨 THÔNG BÁO KHẨN: Hạn cuối nộp tờ khai Thuế GTGT Tháng là ngày 20/06 hằng năm. Kế toán viên lưu ý hoàn thiện chứng từ số liệu!');
  const [alertDaysInput, setAlertDaysInput] = useState('30, 20, 15, 7, 3, 0');
  const [dailyAlertTime, setDailyAlertTime] = useState(settings.dailyAlertTime);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
      if (res.ok) {
        showSuccess('Đã đánh dấu thông báo đã xem.');
        onRefresh();
      }
    } catch (_) {
      showError('Đường truyền thất bại.');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications/read-all', { method: 'POST' });
      if (res.ok) {
        showSuccess('Đã đánh dấu xem tất cả thông báo hệ thống.');
        onRefresh();
      }
    } catch (_) {
      showError('Gửi gói tin lỗi.');
    }
  };

  const saveConfig = () => {
    // Save configuration settings
    onSaveSettings({
      ...settings,
      dailyAlertTime,
      soundEnabled
    });
    showSuccess('Cấu hình cảnh báo hệ thống hoàn tất!');
  };

  const triggerLiveBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;

    playAlertSound('success');
    showSuccess(`📢 [PHÁT SÓNG ĐỒNG BỘ THÀNH CÔNG] Đã bắn thông báo thời gian thực lên kênh API ${activeChannel} OA thành công!`);
  };

  const triggerBeepPreview = () => {
    playAlertSound('beep');
    showSuccess('🔊 Đã phát âm thanh thử nghiệm (Beep) kiểm tra màng loa!');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-5 text-xs animate-fade-in font-sans">
      
      {/* 2 Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Alerts List */}
        <div className="lg:col-span-7 space-y-4">
          <div className={`p-4 rounded-xl border ${
            darkMode ? 'bg-zinc-950/40 border-zinc-805 text-zinc-100' : 'bg-white border-slate-205 shadow-sm'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 mb-3 border-slate-500/10">
              <div className="flex items-center space-x-2">
                <Bell className={`w-5 h-5 text-red-500 ${unreadCount > 0 ? 'animate-bounce' : ''}`} />
                <div>
                  <h3 className="font-extrabold text-xs uppercase tracking-widest text-red-655">Hộp Cảnh Báo Bản Tin Nghiệp Vụ</h3>
                  <p className="text-[10px] text-zinc-550 mt-0.5">Lưu vết cảnh báo tự động thông báo thời gian thực của hệ thống.</p>
                </div>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className={`p-1.5 px-3 rounded-lg border font-bold text-[10px] transition cursor-pointer flex items-center space-x-1 ${
                    darkMode 
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-350 hover:text-white hover:bg-zinc-850' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>DANH DẤU ĐÃ XEM</span>
                </button>
              )}
            </div>

            {/* Notification logs scroll */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-zinc-550 font-medium">
                  Không có bất kỳ cảnh báo nghiệm thu hoặc thông báo chưa đọc nào trong hòm thư.
                </div>
              ) : (
                notifications.map(n => {
                  const isRead = n.read;
                  return (
                    <div 
                      key={n.id} 
                      className={`p-3 rounded-lg border flex items-start gap-2.5 transition relative ${
                        isRead 
                          ? darkMode ? 'bg-zinc-900/20 border-zinc-850 opacity-60' : 'bg-slate-50/50 border-slate-200' 
                          : darkMode ? 'bg-[#1e141a]/40 border-rose-950 text-rose-100' : 'bg-rose-50/40 border-rose-220 text-slate-900'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5 shrink-0" />
                      
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between gap-2.5">
                          <p className="font-bold text-xs uppercase tracking-tight">{n.title}</p>
                          <span className="font-mono text-[9px] text-zinc-500">{new Date(n.dispatchedAt).toLocaleString('vi-VN')}</span>
                        </div>
                        <p className={`text-[11px] leading-relaxed select-all ${isRead ? 'text-zinc-500' : 'text-slate-700 dark:text-zinc-350'}`}>{n.message}</p>
                      </div>

                      {!isRead && (
                        <button
                          onClick={() => handleMarkAsRead(n.id)}
                          className="p-1 rounded shrink-0 bg-red-650 hover:bg-red-550 text-white cursor-pointer"
                          title="Hủy cảnh báo này"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Simulated Broadcaster & Configuration Settings */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Broadcaster Simulator */}
          <div className={`p-4 rounded-xl border ${
            darkMode ? 'bg-zinc-950/40 border-zinc-800' : 'bg-white border-slate-205 shadow-sm'
          }`}>
            <h3 className="font-extrabold text-xs text-red-650 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2.5 border-red-500/10 mb-3">
              <MessageSquare className="w-4 h-4 text-red-500" />
              <span>Cầu Phát Cảnh Báo Đồng Bộ Đa Kênh (Dispatch Hub)</span>
            </h3>

            <p className={`text-[11px] mb-3 leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-slate-550'}`}>
              Trải nghiệm tích hợp kênh truyền dữ liệu bảo mật, tự động đẩy tín hiệu cảnh báo lịch nộp thuế, công tác hoàn công sổ sách lên mạng cộng tác:
            </p>

            {/* Channels toggle */}
            <div className="grid grid-cols-3 gap-1 mb-3.5 border p-1 rounded-lg">
              {[
                { id: 'TELEGRAM', label: 'Telegram Bot' },
                { id: 'ZALO', label: 'Zalo OA CRM' },
                { id: 'EMAIL', label: 'Email Server' }
              ].map(chan => (
                <button
                  key={chan.id}
                  onClick={() => setActiveChannel(chan.id as any)}
                  className={`py-1.5 rounded-md font-bold text-[10px] tracking-wide transition cursor-pointer ${
                    activeChannel === chan.id
                      ? 'bg-red-650 text-white font-extrabold shadow-sm'
                      : 'text-zinc-450 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  {chan.label}
                </button>
              ))}
            </div>

            <form onSubmit={triggerLiveBroadcast} className="space-y-3 font-medium">
              <div>
                <label className="block text-[9px] uppercase font-bold text-zinc-500 mb-1">Soạn mẫu tin phát sóng định dạng API:</label>
                <textarea
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  rows={2.5}
                  className="w-full p-2 border border-slate-250 rounded-lg outline-none text-xs font-sans focus:border-red-500"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-550 font-bold">● RESTful API Endpoint: Active / Live</span>
                <button
                  type="submit"
                  className="p-1 px-4.5 bg-red-650 hover:bg-red-550 text-white font-black rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-98 transition duration-150"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>BẮN CẢNH BÁO</span>
                </button>
              </div>
            </form>
          </div>

          {/* Configuration Settings */}
          <div className={`p-4 rounded-xl border ${
            darkMode ? 'bg-zinc-950/40 border-zinc-800' : 'bg-white border-slate-205 shadow-sm'
          }`}>
            <h3 className="font-extrabold text-xs text-red-650 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2.5 border-red-500/10 mb-3">
              <Settings className="w-4 h-4 text-zinc-500" />
              <span>Thiết Lập Ngưỡng & Âm Cảnh Cáo hằng ngày</span>
            </h3>

            <div className="space-y-3.5">
              <div>
                <label className="block text-[9px] uppercase font-bold text-zinc-500 mb-1">Mốc ngày cảnh cáo tự động trước hạn nộp (alertDays):</label>
                <input
                  type="text"
                  value={alertDaysInput}
                  onChange={(e) => setAlertDaysInput(e.target.value)}
                  placeholder="30, 15, 7, 3, 0"
                  className="w-full p-2 border border-slate-250 rounded-lg outline-none font-mono font-bold tracking-wider"
                />
                <span className="text-[9px] text-zinc-500">* Là các mốc ngày (cách hạn nộp t ngày) hệ thống tự động sinh cảnh báo.</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[9px] uppercase font-bold text-zinc-500 mb-1">Giờ đẩy thông báo:</label>
                  <input
                    type="time"
                    value={dailyAlertTime}
                    onChange={(e) => setDailyAlertTime(e.target.value)}
                    className="w-full p-2 border border-slate-250 rounded-lg outline-none font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-bold text-zinc-500 mb-1">Âm Cảnh Báo Toàn Cục:</label>
                  <div className="flex items-center justify-between p-1 px-2 border border-slate-250 rounded-lg h-[34px] bg-slate-50/50 dark:bg-black/30">
                    <span className="font-semibold">{soundEnabled ? '🔔 BẬT LOA BÁO' : '🔕 TẮT ÂM'}</span>
                    <input
                      type="checkbox"
                      checked={soundEnabled}
                      onChange={(e) => setSoundEnabled(e.target.checked)}
                      className="text-red-650 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center border-t pt-3 border-slate-500/10">
                <button
                  type="button"
                  onClick={triggerBeepPreview}
                  className="p-1 px-3.5 border border-slate-250 rounded-lg font-bold hover:bg-slate-100 flex items-center space-x-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-zinc-500" />
                  <span>TEST COI LOA</span>
                </button>

                <button
                  onClick={saveConfig}
                  className="p-1 px-4.5 bg-red-650 hover:bg-red-550 text-white font-extrabold rounded-lg flex items-center gap-1 cursor-pointer shadow-sm active:scale-98 transition duration-150"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>ÁP DỤNG THAY ĐỔI</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
