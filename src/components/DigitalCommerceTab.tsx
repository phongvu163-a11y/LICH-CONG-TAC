import React, { useState } from 'react';
import { 
  Globe, 
  CheckCircle, 
  Info, 
  Calculator, 
  MapPin, 
  Calendar, 
  Coins, 
  QrCode, 
  ArrowRight, 
  CornerDownRight, 
  Building, 
  FileCheck,
  Percent,
  HelpCircle
} from 'lucide-react';

interface DigitalCommerceTabProps {
  darkMode: boolean;
}

export default function DigitalCommerceTab({ darkMode }: DigitalCommerceTabProps) {
  const [hasPhysicalStore, setHasPhysicalStore] = useState<'yes' | 'no'>('no');
  const [shopeeRevenue, setShopeeRevenue] = useState<string>('1200000000'); // Default 1.2 Billion
  const [facebookRevenue, setFacebookRevenue] = useState<string>('300000000'); // Default 300 Million
  const [otherPlatformRevenue, setOtherPlatformRevenue] = useState<string>('0');
  const [offlineRevenue, setOfflineRevenue] = useState<string>('0');

  const shopeeVal = parseFloat(shopeeRevenue) || 0;
  const fbVal = parseFloat(facebookRevenue) || 0;
  const otherVal = parseFloat(otherPlatformRevenue) || 0;
  const offVal = parseFloat(offlineRevenue) || 0;

  // Aggregate total consolidated revenue
  const totalRevenue = shopeeVal + fbVal + otherVal + offVal;
  
  // Exemption threshold is 1 billion VND starting 2026/2027 (Nghị định 141)
  const isTaxable = totalRevenue > 1000000000; 

  // E-commerce trading taxation is standard 1.5% (1.0% GTGT + 0.5% TNCN of taxable revenue)
  const gtgtTax = isTaxable ? totalRevenue * 0.01 : 0;
  const tncnTax = isTaxable ? totalRevenue * 0.005 : 0;
  const totalTax = gtgtTax + tncnTax;

  // Sàn TMĐT auto deducts 1.5% (on Shopee, TikTok Shop, Lazada - covered by automated withholding)
  const autoWithheldRevenue = shopeeVal + otherVal;
  const deductedByPlatform = isTaxable ? autoWithheldRevenue * 0.015 : 0;
  
  // Facebook, Zalo, and Offline revenue must be self-declared & self-paid
  const selfPayRevenue = fbVal + offVal;
  const selfPayTax = isTaxable ? selfPayRevenue * 0.015 : 0;

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Header banner */}
      <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        darkMode ? 'bg-zinc-950/40 border-sky-950/50' : 'bg-[#e0f2fe]/40 border-sky-200'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-gradient-to-tr from-sky-600 to-sky-500 text-white rounded-2xl shrink-0 shadow-md">
            <Globe className="w-5.5 h-5.5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm uppercase tracking-tight text-sky-600 dark:text-sky-400">
              Thuế Thương Mại Điện Tử &amp; Nền Tảng Số Toàn Diện
            </h3>
            <p className="text-[11px] font-medium mt-0.5 text-slate-500 dark:text-zinc-400 leading-normal">
              Cẩm nang hành chính số hóa cập nhật từ <strong>Cục Thuế TP. Hà Nội</strong>. Hỗ trợ tra cứu eTax Mobile, kê khai và quyết toán sàn TMĐT chính chủ.
            </p>
          </div>
        </div>
        <span className="text-[9px] font-mono font-bold bg-amber-500 text-black px-2.5 py-1 rounded-md uppercase shrink-0">
          Chuyên Đề Thuế Số 2026
        </span>
      </div>

      {/* CORE GUIDE 1 & 2: TWO PRIMARY SCENARIOS IN THE SYSTEM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Case 1: Auto Withheld */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
          darkMode ? 'bg-[#0f172a] border-zinc-800' : 'bg-white border-slate-200 shadow-3xs'
        }`}>
          <div>
            <div className="flex items-center gap-2 pb-2.5 border-b border-dashed border-slate-100 dark:border-zinc-800 mb-3.5">
              <span className="flex items-center justify-center w-5 h-5 text-[10px] font-black rounded-full bg-blue-600 text-white font-mono">1</span>
              <h4 className="font-black text-[12px] uppercase text-slate-800 dark:text-zinc-200">
                TRƯỜNG HỢP 1: Bán Qua Sàn TMĐT Có Thanh Toán Trực Tuyến
              </h4>
            </div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mb-2.5 uppercase tracking-wider font-mono">
              Sàn áp dụng: Shopee, TikTok Shop, Lazada, Tiki...
            </p>
            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-zinc-350 mb-4">
              Nếu bạn đang kinh doanh trên các sàn có tích hợp chức năng đặt hàng và xử lý thanh toán trực tuyến toàn diện, hệ thống của các sàn sẽ <strong>tự động hoàn toàn</strong> các tác vụ sau:
            </p>
            <ul className="space-y-2.5 text-[11px] text-slate-600 dark:text-zinc-300 font-medium">
              <li className="flex gap-2.5 items-start">
                <span className="p-1 rounded bg-emerald-500/10 text-emerald-500 shrink-0">
                  <CheckCircle className="w-3.5 h-3.5" />
                </span>
                <p><strong>Khấu trừ thuế hằng kỳ:</strong> Tự trích thu 1.5% trực tiếp trên mỗi đơn hàng thành công giao cho khách.</p>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className="p-1 rounded bg-emerald-500/10 text-emerald-500 shrink-0">
                  <CheckCircle className="w-3.5 h-3.5" />
                </span>
                <p><strong>Kê khai &amp; nộp hộ ngân sách:</strong> Thay mặt hộ kinh doanh làm tờ khai định kỳ và nộp thẳng tiền thuế vào kho bạc nhà nước.</p>
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-50 dark:border-zinc-850 text-[10px] text-blue-500 font-bold font-mono">
            💡 Gợi ý: Chủ hộ chỉ cần tải biểu kế doanh thu tháng đối chứng.
          </div>
        </div>

        {/* Case 2: Self Declared */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
          darkMode ? 'bg-[#0f172a] border-zinc-800' : 'bg-white border-slate-200 shadow-3xs'
        }`}>
          <div>
            <div className="flex items-center gap-2 pb-2.5 border-b border-dashed border-slate-100 dark:border-zinc-800 mb-3.5">
              <span className="flex items-center justify-center w-5 h-5 text-[10px] font-black rounded-full bg-purple-600 text-white font-mono">2</span>
              <h4 className="font-black text-[12px] uppercase text-slate-800 dark:text-zinc-200">
                TRƯỜNG HỢP 2: Bán Sàn/Mạng Xã Hội Tự COD &amp; Chốt Đơn
              </h4>
            </div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mb-2.5 uppercase tracking-wider font-mono">
              Ví dụ: Facebook Profile, Fanpage, Zalo nhận chốt inbox, Telegram...
            </p>
            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-zinc-350 mb-4">
              Nền tảng mạng xã hội <strong>KHÔNG</strong> sắm vai trò thu tiền hay phân phối đơn hàng trực tiếp, nên nền tảng sẽ hoàn đóng vai trò trung gian và <strong>không khấu trừ thuế thay thế</strong>:
            </p>
            <ul className="space-y-2.5 text-[11px] text-purple-600 dark:text-purple-400 font-medium font-sans">
              <li className="flex gap-2.5 items-start">
                <span className="p-1 rounded bg-purple-500/10 text-purple-500 shrink-0">
                  <CheckCircle className="w-3.5 h-3.5" />
                </span>
                <p className="text-slate-600 dark:text-zinc-300"><strong>Hộ kinh doanh tự tổng hợp:</strong> Cộng dồn tất cả dữ liệu tiền nhận chuyển khoản, tiền ship COD toàn quốc để làm sớ doanh thu.</p>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className="p-1 rounded bg-purple-500/10 text-purple-500 shrink-0">
                  <CheckCircle className="w-3.5 h-3.5" />
                </span>
                <p className="text-slate-600 dark:text-zinc-300"><strong>Thực hiện nghĩa vụ nộp thuế:</strong> Tự giác tiến hành làm tờ khai gộp kèm hoạt động của cửa hàng (nếu có) và đi nộp trực tiếp tại chi cục thuế.</p>
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-50 dark:border-zinc-850 text-[10px] text-purple-500 font-bold font-mono">
            ⚠️ Lưu ý: Quét kiểm soát tài khoản ngân hàng liên tục từ cơ quan thanh tra.
          </div>
        </div>
      </div>

      {/* CORE GUIDE ARTICLE: REVENUE THRESHOLDS CONSOLIDATED (VỀ DOANH THU XÉT NGƯỠNG) */}
      <div className={`p-4 sm:p-5 rounded-2xl border ${
        darkMode ? 'bg-zinc-950/30 border-zinc-800' : 'bg-slate-50/50 border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 mb-4 border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-yellow-500 text-black rounded font-mono font-black text-[10px]">RULE</span>
            <h4 className="font-extrabold text-xs uppercase tracking-tight text-slate-800 dark:text-zinc-200">
              VỀ DOANH THU XÉT NGƯỠNG - TỔNG HỢP TOÀN DIỆN KÊ KHAI
            </h4>
          </div>
          <span className="text-[10px] font-bold text-red-500">
            Dù mỗi kênh dưới 1 tỷ nhưng Tổng gộp vượt 1 tỷ đồng vẫn thuộc diện nộp thuế!
          </span>
        </div>

        <p className="text-[11px] leading-relaxed text-slate-600 dark:text-zinc-300 mb-4">
          Quy định ngưỡng tính thuế TMĐT áp dụng thống nhất mức <strong>1 Tỷ đồng/Năm</strong> (bằng với ngưỡng phân loại hộ kinh doanh quy chuẩn mới). Doanh thu xét khấu trừ thuế của cá nhân là tổng hợp toàn bộ mảng kinh doanh, bao gồm:
        </p>

        {/* Aggregate Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-center mb-5">
          <div className={`p-3 rounded-xl border ${darkMode ? 'bg-zinc-950/40 border-zinc-850' : 'bg-white border-slate-150'}`}>
            <span className="text-[18px] block mb-1">🏪</span>
            <span className="font-black text-[10.5px] uppercase block text-slate-700 dark:text-zinc-300">1. Bán Tại Cửa Hàng</span>
            <span className="text-[9.5px] text-slate-400 mt-1 block">Khách mua trực tiếp hoặc mua COD qua hotline quán</span>
          </div>
          <div className={`p-3 rounded-xl border ${darkMode ? 'bg-zinc-950/40 border-zinc-850' : 'bg-white border-slate-150'}`}>
            <span className="text-[18px] block mb-1">🛒</span>
            <span className="font-black text-[10.5px] uppercase block text-slate-700 dark:text-zinc-300">2. Bán Trên Tất Cả Các Sàn</span>
            <span className="text-[9.5px] text-slate-400 mt-1 block">Tổng doanh số Shopee, Tiktok Shop, Lazada, Tiki...</span>
          </div>
          <div className={`p-3 rounded-xl border ${darkMode ? 'bg-zinc-950/40 border-zinc-850' : 'bg-white border-slate-150'}`}>
            <span className="text-[18px] block mb-1">💬</span>
            <span className="font-black text-[10.5px] uppercase block text-slate-700 dark:text-zinc-300">3. Bán Qua Facebook, Zalo...</span>
            <span className="text-[9.5px] text-slate-400 mt-1 block">Chốt đơn qua nhắn tin mxh, các hội nhóm cộng đồng</span>
          </div>
        </div>

        {/* QR Code and threshold selectors */}
        <div className="border-t pt-4 border-slate-200 dark:border-zinc-800">
          <p className="text-[10px] font-black uppercase text-slate-450 dark:text-zinc-500 mb-3 text-center">
            Mức Doanh Thu Vùng &amp; Mã QR Hướng Dẫn Tờ Khai Từ Cục Thuế Hà Nội
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* QR block 1 */}
            <div className={`p-3 rounded-xl border flex items-center gap-3 ${
              darkMode ? 'bg-zinc-900/40 border-zinc-850' : 'bg-emerald-50/10 border-emerald-100'
            }`}>
              <div className="p-1.5 bg-white rounded border border-slate-200 shrink-0">
                <QrCode className="w-9 h-9 text-slate-800" />
              </div>
              <div className="text-[10.5px]">
                <h5 className="font-extrabold text-emerald-600 uppercase">Doanh thu dưới 1 Tỷ/Năm</h5>
                <p className="text-slate-500 text-[9.5px] mt-0.5 leading-tight">Được miễn nộp thuế. Có thể đòi hoàn thuế nếu sàn TMĐT lỡ trích khấu trừ.</p>
              </div>
            </div>

            {/* QR block 2 */}
            <div className={`p-3 rounded-xl border flex items-center gap-3 ${
              darkMode ? 'bg-zinc-900/40 border-zinc-850' : 'bg-blue-50/10 border-blue-105'
            }`}>
              <div className="p-1.5 bg-white rounded border border-slate-200 shrink-0">
                <QrCode className="w-9 h-9 text-slate-800" />
              </div>
              <div className="text-[10.5px]">
                <h5 className="font-extrabold text-blue-600 uppercase font-mono">Doanh thu 1 Tỷ - 3 Tỷ</h5>
                <p className="text-slate-500 text-[9.5px] mt-0.5 leading-tight">Buộc kê khai thuế định kỳ hằng Quý. Được chọn nộp theo tỷ lệ % doanh thu.</p>
              </div>
            </div>

            {/* QR block 3 */}
            <div className={`p-3 rounded-xl border flex items-center gap-3 ${
              darkMode ? 'bg-zinc-900/40 border-zinc-850' : 'bg-red-50/10 border-red-105'
            }`}>
              <div className="p-1.5 bg-white rounded border border-slate-200 shrink-0">
                <QrCode className="w-9 h-9 text-slate-800" />
              </div>
              <div className="text-[10.5px]">
                <h5 className="font-extrabold text-red-500 uppercase font-mono">Doanh thu trên 3 Tỷ</h5>
                <p className="text-slate-500 text-[9.5px] mt-0.5 leading-tight">Áp dụng chế độ 4 sổ sách, hạch toán đối chứng chi phí và lưu giữ chứng từ 10 năm.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CASE 3, 4, 5 SPECIFIC SECTOR DETAILS IN THE INFORGRAPHIC */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Case 3: Nơi nộp hồ sơ */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          darkMode ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-5 h-5 text-[10px] font-black rounded-full bg-blue-600 text-white font-mono">3</span>
              <h5 className="font-bold text-[11px] uppercase tracking-tight text-slate-800 dark:text-zinc-200">
                Ý 3: ĐỊA ĐIỂM NỘP HỒ SƠ THỰC TẾ
              </h5>
            </div>
            <div className="space-y-2 text-[10.5px] leading-relaxed text-slate-600 dark:text-zinc-350">
              <p>• <strong>Bán Online 100% (Không có cửa hàng vật lý):</strong> Bạn tiến hành kê khai và nộp nghĩa vụ thuế tại <strong>Cơ quan thuế quản lý trực tiếp địa bàn cư trú hữu hạn</strong> (thường trú hoặc tạm trú, tạm vắng).</p>
              <p>• <strong>Kết hợp Cửa Hàng Vật Lý:</strong> Bạn bắt buộc nộp hồ sơ thuế tại <strong>Cơ quan thuế quản lý trực tiếp trụ sở cửa hàng vật lý</strong>.</p>
            </div>
          </div>
          <span className="text-[9px] font-semibold text-blue-500 mt-2 block font-mono">📍 Hạn nộp theo Quý</span>
        </div>

        {/* Case 4: Trách nhiệm quyết toán */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          darkMode ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-5 h-5 text-[10px] font-black rounded-full bg-emerald-600 text-white font-mono">4</span>
              <h5 className="font-bold text-[11px] uppercase tracking-tight text-slate-800 dark:text-zinc-200">
                Ý 4: TRÁCH NHIỆM QUYẾT TOÁN THUẾ
              </h5>
            </div>
            <div className="space-y-2 text-[10.5px] leading-relaxed text-slate-600 dark:text-zinc-350">
              <p>Đối với cá nhân, HKD nộp thuế TNCN theo hình thức thu nhập tính thuế, cuối năm bắt buộc phải lập sớ <strong>Quyết toán thuế TNCN</strong>.</p>
              <p>Trong đó, phần số thuế thu nhập cá nhân (0.5% TNCN) mà các sàn TMĐT đã khấu trừ trích nộp thay trong năm <strong>sẽ được cấn trừ sòng phẳng thẳng</strong> vào tổng nghĩa vụ thuế phải nộp của tờ quyết toán.</p>
            </div>
          </div>
          <span className="text-[9px] font-bold text-red-500 mt-2 block font-mono">📅 Hạn nộp muộn nhất: 31/03 năm sau</span>
        </div>

        {/* Case 5: Quyền lợi hoàn thuế */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          darkMode ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-5 h-5 text-[10px] font-black rounded-full bg-amber-500 text-black font-mono">5</span>
              <h5 className="font-bold text-[11px] uppercase tracking-tight text-slate-800 dark:text-zinc-200">
                Ý 5: QUYỀN LỢI HOÀN THUẾ CHÍNH CHỦ
              </h5>
            </div>
            <div className="space-y-2 text-[10.5px] leading-relaxed text-slate-600 dark:text-zinc-350">
              <p className="text-emerald-600 dark:text-emerald-400 font-extrabold">Đặc quyền tối ưu chi phí:</p>
              <p>Dù các sàn tự nộp hộ tiền, nhưng đến cuối năm nếu tổng doanh thu gột ròng (online + offline) của bạn <strong>từ 1 Tỷ đồng trở xuống</strong> (diện miễn thuế), bạn hoàn toàn có quyền làm hồ sơ đề nghị cơ quan Thuế <strong>hoàn trả 100%</strong> số thuế sàn đã tự ý khấu trừ trước đó!</p>
            </div>
          </div>
          <span className="text-[9px] font-bold text-emerald-600 mt-2 block font-mono">✔️ Thủ tục hoàn thuế hoàn chỉnh</span>
        </div>
      </div>

      {/* SIMULATOR CALCULATOR FOR 1 BILLION THRESHOLD */}
      <div className={`p-5 rounded-2xl border ${
        darkMode ? 'bg-zinc-950/30 border-zinc-800' : 'bg-white border-slate-200 shadow-md shadow-slate-100'
      }`}>
        <div className="flex items-center gap-2.5 mb-3">
          <Calculator className="w-5 h-5 text-sky-500" />
          <h4 className="font-black text-xs uppercase tracking-tight text-slate-800 dark:text-zinc-100">
            Ủy Thác &amp; Tạm Tính Nghĩa Vụ Thuế Thương Mại Điện Tử 2026
          </h4>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium leading-relaxed mb-4">
          Nhập doanh số dự toán cả năm phát sinh trên các kênh để mô phỏng chính xác số thuế bị trích khấu trừ, số thuế tự đóng và kiểm thử quyền hoàn thuế của bạn:
        </p>

        {/* Input grids */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-[9.5px] font-bold text-slate-400 mb-1.5 uppercase">1. Sàn Có Checkout (Shopee, TikTok) đ/năm:</label>
            <input 
              type="number" 
              value={shopeeRevenue} 
              onChange={e => setShopeeRevenue(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border font-mono focus:outline-none focus:ring-1 focus:ring-sky-500 dark:bg-zinc-900 dark:border-zinc-800" 
            />
          </div>

          <div>
            <label className="block text-[9.5px] font-bold text-slate-400 mb-1.5 uppercase">2. Mạng Xã Hội Tự Ship COD đ/năm:</label>
            <input 
              type="number" 
              value={facebookRevenue} 
              onChange={e => setFacebookRevenue(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border font-mono focus:outline-none focus:ring-1 focus:ring-sky-500 dark:bg-zinc-900 dark:border-zinc-800" 
            />
          </div>

          <div>
            <label className="block text-[9.5px] font-bold text-slate-400 mb-1.5 uppercase">3. Sàn TMĐT Khác (Lazada, Tiki) đ/năm:</label>
            <input 
              type="number" 
              value={otherPlatformRevenue} 
              onChange={e => setOtherPlatformRevenue(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border font-mono focus:outline-none focus:ring-1 focus:ring-sky-500 dark:bg-zinc-900 dark:border-zinc-800" 
            />
          </div>

          <div>
            <label className="block text-[9.5px] font-bold text-slate-400 mb-1.5 uppercase">4. Doanh Số Trực Tiếp Tại Quán đ/năm:</label>
            <input 
              type="number" 
              value={offlineRevenue} 
              onChange={e => setOfflineRevenue(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border font-mono focus:outline-none focus:ring-1 focus:ring-sky-500 dark:bg-zinc-900 dark:border-zinc-800" 
            />
          </div>
        </div>

        {/* Output panel */}
        <div className={`p-4 rounded-xl border leading-relaxed ${
          isTaxable 
            ? darkMode ? 'bg-amber-950/10 border-amber-900/30' : 'bg-amber-500/5 border-amber-250'
            : darkMode ? 'bg-emerald-950/10 border-emerald-900/30' : 'bg-emerald-50 border-emerald-200'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-[9px] font-black uppercase text-slate-400">TỔNG DOANH THU QUY ĐỔI TOÀN DIỆN CẢ NĂM:</p>
              <h4 className="text-md font-black text-slate-800 dark:text-zinc-100 mt-1 font-mono">
                {totalRevenue.toLocaleString('vi-VN')} VNĐ
              </h4>
              <p className="text-[11px] font-bold mt-1.5 leading-normal">
                {isTaxable ? (
                  <span className="text-red-500">⚠️ Bạn thuộc diện buộc đóng thuế (Doanh thu vượt ngưỡng 1 Tỷ đồng/Năm).</span>
                ) : (
                  <span className="text-emerald-600">🎉 Bạn được miễn 100% thuế (Doanh thu ≤ 1 Tỷ đồng/Năm).</span>
                )}
              </p>
              {isTaxable && (
                <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                  Ngành phân phối thương mại mua bán chịu thuế suất cơ bản <strong>1.5%</strong> doanh thu (1% thuế giá trị gia tăng &amp; 0.5% thuế thu nhập cá nhân).
                </p>
              )}
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-[10.5px] font-medium space-y-1.5">
              <p className="font-extrabold text-sky-600 border-b pb-1 select-none uppercase tracking-wide">Trạng Thái Khấu Trừ &amp; Chi Trả:</p>
              {isTaxable ? (
                <>
                  <p>• Tổng thuế phát sinh (1.5%): <span className="font-bold text-red-500">{totalTax.toLocaleString('vi-VN')} đ</span></p>
                  <p className="pl-3 text-slate-500">• Thuế GTGT (1.0%): {gtgtTax.toLocaleString('vi-VN')} đ</p>
                  <p className="pl-3 text-slate-500">• Thuế TNCN (0.5%): {tncnTax.toLocaleString('vi-VN')} đ</p>
                  <p className="pt-1.5 border-t text-blue-500 font-bold">
                    🛡️ Sàn TMĐT đã khấu trừ nộp hộ: ~{deductedByPlatform.toLocaleString('vi-VN')} đ
                  </p>
                  <p className="text-purple-600 font-bold">
                    ✍️ Số tiền bạn tự đi kê khai &amp; nộp trực tiếp: ~{selfPayTax.toLocaleString('vi-VN')} đ
                  </p>
                </>
              ) : (
                <>
                  <p className="text-emerald-600 dark:text-emerald-400 font-extrabold">✔️ Thuế phải nộp thực tế: 0 đ</p>
                  {autoWithheldRevenue > 0 && (
                    <div className="p-2 bg-yellow-500/5 border border-yellow-500/15 rounded text-amber-600 leading-normal text-[10px] font-bold">
                      💡 Sàn có thể đã khấu giữ tạm tính ~{(autoWithheldRevenue * 0.015).toLocaleString('vi-VN')} đ của bạn trong năm. Đầu năm sau, hãy làm bộ hồ sơ Hoàn thuế nộp Chi cục Thuế để được nhận lại 100% khoản này!
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Store Setup Selector Dropdown Helper */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 items-center gap-3.5 pt-3.5 border-t border-dashed border-slate-100 dark:border-zinc-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-450 dark:text-zinc-500 block mb-1">Thiết lập quy mô hoạt động:</span>
            <select
              value={hasPhysicalStore}
              onChange={(e) => setHasPhysicalStore(e.target.value as any)}
              className="text-[11px] p-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-sky-500 dark:bg-zinc-900 border-zinc-800 text-slate-700 dark:text-white"
            >
              <option value="no">Chỉ kinh doanh online qua TMĐT &amp; mạng xã hội</option>
              <option value="yes">Có cửa hàng bán trực tiếp kết hợp sàn TMĐT</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex items-start gap-1.5 text-[10.5px] leading-tight text-slate-500 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-900/50 p-2.5 rounded-lg">
            <CornerDownRight className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
            <p>
              📍 <strong>Hướng dẫn thủ tục nộp:</strong> {hasPhysicalStore === 'yes' 
                ? 'Thực hiện kê khai gộp toàn bộ doanh thu online và offline vào Tờ khai Mẫu 01/CNKD nộp trực tiếp tại Chi cục Thuế nơi đặt trụ sở cửa hàng vật lý của bạn.'
                : 'Tiến hành tải file XML đối chứng dữ liệu trên sàn TMĐT cá nhân và gửi tờ khai kèm CMND/CCCD trực diện tại Chi cục Thuế quản lý khu vực cư trú tạm trú hằng năm.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="text-center py-2 border-t border-slate-100 dark:border-zinc-850 font-black text-[11px] text-sky-650 dark:text-sky-400 font-mono tracking-widest uppercase">
        🇻🇳 HIỂU ĐÚNG - KÊ KHAI ĐÚNG - YÊN TÂM KINH DOANH
      </div>
    </div>
  );
}
