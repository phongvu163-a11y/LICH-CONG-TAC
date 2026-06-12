import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Info, Calculator, FileText, ArrowRight } from 'lucide-react';

interface FactorKTabProps {
  darkMode: boolean;
}

export default function FactorKTab({ darkMode }: FactorKTabProps) {
  const [invIn, setInvIn] = useState<string>('500000000'); // 500 Million
  const [stockIn, setStockIn] = useState<string>('150000000'); // 150 Million
  const [invoiceOut, setInvoiceOut] = useState<string>('800000000'); // 800 Million

  const inVal = parseFloat(invIn) || 0;
  const stockVal = parseFloat(stockIn) || 0;
  const outVal = parseFloat(invoiceOut) || 0;

  const totalInPool = inVal + stockVal;
  // Factor K calculation
  const factorK = totalInPool > 0 ? outVal / totalInPool : 0;
  const isTargeted = factorK > 1.0;

  return (
    <div className="space-y-5 animate-fade-in text-left">
      {/* Header banner */}
      <div className={`p-4 rounded-xl border flex items-center gap-3 ${
        darkMode ? 'bg-zinc-950/40 border-rose-950/50' : 'bg-red-50/20 border-red-100'
      }`}>
        <div className="p-3 bg-red-600 text-white rounded-xl shrink-0">
          <ShieldAlert className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h3 className="font-black text-sm uppercase tracking-tight text-red-650">
            Cảnh Báo Hệ Số K: Hàng Hóa, Dịch Vụ Bán Ra Vượt Quá Tồn Kho &amp; Mua Vào
          </h3>
          <p className="text-[11px] font-medium mt-0.5 text-slate-500 dark:text-zinc-400">
            Tìm hiểu bản chất của cảnh báo rủi ro hóa đơn tự động từ Cơ quan Thuế và cẩm nang soạn tờ giải trình giảm kịch khung lỗi hành chính hàng tồn.
          </p>
        </div>
      </div>

      {/* Concept layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Concept Card */}
        <div className={`p-4 rounded-xl border ${
          darkMode ? 'bg-[#0f172a] border-zinc-800' : 'bg-white border-slate-205 shadow-3xs'
        }`}>
          <h4 className="font-extrabold text-xs uppercase text-slate-900 dark:text-zinc-150 pb-2 border-b border-slate-100 dark:border-zinc-800 mb-2.5">
            1. Bản chất của Hệ số K là gì?
          </h4>
          <p className="text-[11px] leading-relaxed text-slate-655 dark:text-zinc-300 font-medium">
            Hệ số K là một chỉ số rà soát rủi ro được tính toán tự động bằng robot thu thập dữ liệu của Tổng cục Thuế. 
            Hệ thống so sánh tổng trị giá hóa đơn điện tử đầu ra (bán ra) với tổng trị giá hóa đơn điện tử đầu vào (mua vào) cộng với trị giá hàng hóa tồn kho thời kỳ trước.
          </p>
          <div className="p-3 rounded-lg bg-red-500/10 dark:bg-rose-950/20 border border-red-500/20 text-red-550 dark:text-rose-400 font-extrabold mt-3 text-center text-[11px] font-mono">
            HỆ SỐ K = Tổng giá trị hóa đơn bán ra / (Hóa đơn mua vào + Tồn kho đầu kỳ)
          </div>
          <p className="text-[10px] text-slate-505 dark:text-zinc-500 mt-2.5 italic">
            🚨 Nếu hệ số K &gt; 1.0 (Bán ra lớn hơn năng lực hàng hóa đầu vào thực tế), hệ thống sẽ lập tức gắn nhãn cảnh báo đỏ và tự động chuyển về chi cục Thuế để yêu cầu rà soát.
          </p>
        </div>

        {/* Cause Card */}
        <div className={`p-4 rounded-xl border ${
          darkMode ? 'bg-[#0f172a] border-zinc-800' : 'bg-white border-slate-205 shadow-3xs'
        }`}>
          <h4 className="font-extrabold text-xs uppercase text-slate-900 dark:text-zinc-150 pb-2 border-b border-slate-100 dark:border-zinc-800 mb-2.5">
            2. Các nguyên nhân gây treo lỗi K lành tính
          </h4>
          <ul className="list-decimal pl-5 text-[11px] leading-relaxed space-y-1.5 text-slate-600 dark:text-zinc-300 font-medium">
            <li>
              <strong>Hàng nhập khẩu hải quan:</strong> Dữ liệu từ TKHQ chưa kịp lập hóa đơn nội địa đồng bộ hoặc độ trễ hải quan khiến cơ quan thuế chưa cập nhật số liệu kho trực tuyến.
            </li>
            <li>
              <strong>Cung cấp dịch vụ:</strong> Doanh nghiệp kinh doanh dịch vụ xây lắp, vận chuyển, thuê mướn... không phát sinh kho nhưng cơ quan quản lý chưa phân tách đặc thù.
            </li>
            <li>
              <strong>Thu mua trực tiếp ko hóa đơn:</strong> Thu mua nông lâm thủy sản từ người dân dựa vào bảng kê thu mua hợp pháp mà không có hóa đơn điện tử.
            </li>
            <li>
              <strong>Lỗi định dạng hóa đơn:</strong> Ghi sai số lượng, sai đơn giá bán, điều chỉnh hóa đơn bị sai kỹ thuật số học.
            </li>
          </ul>
        </div>
      </div>

      {/* Calculator simulation element */}
      <div className={`p-5 rounded-xl border text-left ${
        darkMode ? 'bg-zinc-950/30 border-stone-850' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="w-5 h-5 text-red-550" />
          <h4 className="font-black text-xs uppercase tracking-tight text-slate-800 dark:text-zinc-100">
            Giả Lập &amp; Tính Toán Hệ Số K - Dự Đoán Rủi Ro Thanh Kiểm Tra
          </h4>
        </div>
        <p className="text-[11px] text-slate-505 dark:text-zinc-400 font-medium mb-4">
          Điền các số liệu tài chính kỳ khai thuế của đơn vị để đo lường độ an toàn trước máy quét rà soát của Tổng cục Thuế Hà Nội/TP.HCM:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4">
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-450 mb-1">
              Hóa đơn điện tử mua vào (VND):
            </label>
            <input
              type="number"
              value={invIn}
              onChange={(e) => setInvIn(e.target.value)}
              className={`w-full text-xs p-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-red-500 ${
                darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-250 text-slate-800'
              }`}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-450 mb-1">
              Giá trị tồn kho hợp pháp đầu kỳ (VND):
            </label>
            <input
              type="number"
              value={stockIn}
              onChange={(e) => setStockIn(e.target.value)}
              className={`w-full text-xs p-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-red-500 ${
                darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-250 text-slate-800'
              }`}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-450 mb-1">
              Hóa đơn điện tử bán ra trong kỳ (VND):
            </label>
            <input
              type="number"
              value={invoiceOut}
              onChange={(e) => setInvoiceOut(e.target.value)}
              className={`w-full text-xs p-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-red-500 ${
                darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-250 text-slate-800'
              }`}
            />
          </div>
        </div>

        {/* Calculation Result */}
        <div className={`p-4 rounded-xl border leading-relaxed ${
          isTargeted
            ? darkMode ? 'bg-rose-950/10 border-rose-900/40 text-rose-100' : 'bg-rose-50 border-rose-200'
            : darkMode ? 'bg-emerald-950/10 border-emerald-900/40 text-emerald-100' : 'bg-emerald-50 border-emerald-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-450">CHỈ SỐ HỆ SỐ K CỦA DOANH NGHIỆP:</p>
              <h4 className={`text-md font-black mt-1 ${isTargeted ? 'text-red-500' : 'text-emerald-600'}`}>
                K = {factorK.toFixed(3)}
              </h4>
              <p className="text-[11px] font-bold mt-1.5 leading-normal">
                {isTargeted 
                  ? '⚠️ CẢNH BÁO: Đã chạm ngưỡng báo động đỏ (K > 1.0)! Bạn cần lập tức rà soát kho và chuẩn bị giải trình chứng từ.'
                  : '✅ AN TOÀN: Năng lực kho và lượng mua vào đủ lớn để bảo đảm xuất hóa đơn hoàn toàn giải trình được (K <= 1.0).'
                }
              </p>
            </div>
            {isTargeted && (
              <div className="p-3 rounded-lg border border-red-500/15 bg-white dark:bg-zinc-950 space-y-1 text-[10.5px]">
                <p className="font-extrabold text-red-500 select-none">🚨 7 Bước xử lý giải trình khi bị gọi:</p>
                <ol className="list-decimal pl-4 text-slate-600 dark:text-zinc-400 space-y-0.5">
                  <li>Rà soát hóa đơn đầu vào, bán ra trong thời kỳ.</li>
                  <li>So sánh với số liệu kho thực tế hạch toán.</li>
                  <li>Tìm nguyên nhân chênh lệch (dịch vụ, bảng kê...).</li>
                  <li>Lập bảng đối chiếu thông minh dữ liệu hóa đơn.</li>
                  <li>Chuẩn bị sẵn hồ sơ thực tế gửi đi (hợp đồng, phiếu kho).</li>
                  <li>Soạn công văn lý do gửi Cơ quan Thuế quản lý.</li>
                  <li>Đề nghị Cục Thuế cập nhật kho gỡ chặn hóa đơn.</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
