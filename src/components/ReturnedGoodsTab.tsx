import React, { useState } from 'react';
import { RefreshCw, CheckCircle, Info, BookOpen, AlertTriangle, ArrowRight, HelpCircle, FileSpreadsheet } from 'lucide-react';

interface ReturnedGoodsTabProps {
  darkMode: boolean;
}

export default function ReturnedGoodsTab({ darkMode }: ReturnedGoodsTabProps) {
  const [buyerType, setBuyerType] = useState<'business' | 'individual'>('business');
  const [goodsValue, setGoodsValue] = useState<string>('10000000'); // 10 Million default
  const [cogsValue, setCogsValue] = useState<string>('6000000'); // 6 Million default

  const goodsVal = parseFloat(goodsValue) || 0;
  const cogsVal = parseFloat(cogsValue) || 0;
  const vatRate = 0.1; // Standard 10%
  const vatVal = goodsVal * vatRate;
  const totalRefundVal = goodsVal + vatVal;

  return (
    <div className="space-y-5 animate-fade-in text-left">
      {/* Header banner */}
      <div className={`p-4 rounded-xl border flex items-center gap-3 ${
        darkMode ? 'bg-zinc-950/40 border-sky-950/50' : 'bg-blue-50/20 border-blue-105'
      }`}>
        <div className="p-3 bg-blue-500 text-white rounded-xl shrink-0 animate-spin" style={{ animationDuration: '10s' }}>
          <RefreshCw className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-black text-sm uppercase tracking-tight text-blue-650">
            Cách Kê Khai Thuế &amp; Hạch Toán Khi Hàng Bán Bị Trả Lại
          </h3>
          <p className="text-[11px] font-medium mt-0.5 text-slate-500 dark:text-zinc-400">
            Cắt nghĩa bản chất nghiệp vụ và cập nhật quy chuẩn kê khai theo chế độ mới phát sinh, tránh rủi ro lập hồ sơ bổ sung (KHBS) sai lệch kỳ kế toán.
          </p>
        </div>
      </div>

      {/* Main rule notification alert */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 ${
        darkMode ? 'bg-amber-950/15 border-amber-900/30' : 'bg-amber-50/35 border-amber-200'
      }`}>
        <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-xs uppercase text-amber-600">Quy tắc vàng của nghiệp vụ:</h4>
          <p className="text-[11px] font-medium leading-relaxed mt-1 text-slate-700 dark:text-zinc-300">
            Hàng bán bị trả lại là một <strong>nghiệp vụ phát sinh mới thực tế</strong>. Khi nó xảy ra ở kỳ nào thì hai bên thực hiện kê khai thuế và hạch toán sổ sách đúng ở kỳ ấy!
          </p>
          <p className="text-[11px] text-red-500 font-extrabold mt-1.5 leading-relaxed">
            🚨 Tuyệt đối KHÔNG QUAY VỀ kỳ hóa đơn cũ để lập Hồ sơ kê khai bổ sung (KHBS), trừ khi hóa đơn ban đầu bị ghi nhận sai lệch số liệu thực tế ngay từ lúc xuất.
          </p>
        </div>
      </div>

      {/* Two cards of buyer scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Scenario 1: Buyer is Business */}
        <div className={`p-4 rounded-xl border ${
          darkMode ? 'bg-[#0f172a] border-zinc-800' : 'bg-white border-slate-205 shadow-3xs'
        }`}>
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-zinc-800 mb-3">
            <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-blue-500 text-white">TRƯỜNG HỢP 1</span>
            <h4 className="font-extrabold text-[12px] text-slate-900 dark:text-zinc-150 uppercase">Người mua là Doanh nghiệp / Tổ chức</h4>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <p className="font-extrabold text-blue-500 dark:text-blue-400">📝 Quy chuẩn lập hóa đơn:</p>
            <p className="leading-relaxed text-slate-600 dark:text-zinc-300">
              <strong>Bên Mua (Doanh nghiệp)</strong> có trách nhiệm lập hóa đơn trả lại hàng cho Bên Bán. Trên hóa đơn ghi rõ lý do trả lại một phần hay toàn bộ hàng hóa.
            </p>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-150 dark:border-zinc-850 mt-2 space-y-1.5">
              <p>🎯 <strong>Bên Bán:</strong> Hạch toán giảm doanh thu bán hàng &amp; giảm Thuế GTGT đầu ra song hành.</p>
              <p>🎯 <strong>Bên Mua:</strong> Hạch toán giảm giá trị hàng tồn kho/chi phí &amp; giảm Thuế GTGT đầu vào tương ứng đã khấu trừ.</p>
            </div>
          </div>
        </div>

        {/* Scenario 2: Buyer is Individual */}
        <div className={`p-4 rounded-xl border ${
          darkMode ? 'bg-[#0f172a] border-zinc-800' : 'bg-white border-slate-205 shadow-3xs'
        }`}>
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-zinc-800 mb-3">
            <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-purple-500 text-white">TRƯỜNG HỢP 2</span>
            <h4 className="font-extrabold text-[12px] text-slate-900 dark:text-zinc-150 uppercase">Người mua là Cá nhân lẻ (không xuất được HĐ)</h4>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <p className="font-extrabold text-purple-600 dark:text-purple-400">📝 Quy chuẩn lập hóa đơn:</p>
            <p className="leading-relaxed text-slate-600 dark:text-zinc-300">
              <strong>Bên Bán (Bạn)</strong> có trách nhiệm lập <strong>hóa đơn điều chỉnh giảm</strong> hoặc hóa đơn thay thế cho hóa đơn ban đầu đã lập, sau đó hoàn lại tiền cho khách hàng cá nhân.
            </p>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-150 dark:border-zinc-850 mt-2 space-y-1.5">
              <p>📂 <strong>Hồ sơ bắt buộc:</strong> Biên bản thỏa thuận nhận lại hàng trả ghi rõ lý do, hồ sơ chứng thực hoàn trả tiền thực tế để tránh bị cơ quan thuế nghi ngờ hóa đơn khống giảm doanh thu.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Double entry Simulator Widget */}
      <div className={`p-5 rounded-xl border ${
        darkMode ? 'bg-zinc-950/30 border-stone-850' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-emerald-500" />
          <h4 className="font-black text-xs uppercase tracking-tight text-slate-800 dark:text-zinc-100">
            Trình Giả Lập Hạch Toán Nghiệp Vụ Hàng Bán Bị Trả Lại (VAS/Thông tư 200/133)
          </h4>
        </div>
        <p className="text-[11px] text-slate-505 dark:text-zinc-400 font-medium mb-4">
          Nhập giá trị hàng hóa ghi nhận trên hóa đơn bán ra ban đầu và giá vốn kho tương ứng để xem bảng mô phỏng bút toán định khoản kế toán chính xác:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-450 mb-1">
              Phân loại đối tượng mua trả lại hàng:
            </label>
            <select
              value={buyerType}
              onChange={(e) => setBuyerType(e.target.value as any)}
              className={`w-full text-xs p-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-250 text-slate-800'
              }`}
            >
              <option value="business">Người mua là Doanh nghiệp (Xuất hóa đơn trả lại)</option>
              <option value="individual">Người mua là Cá nhân tự do (Phải lập hóa đơn điều chỉnh giảm)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-450 mb-1">
              Giá bán chưa VAT của hàng bị trả lại (VND):
            </label>
            <input
              type="number"
              value={goodsValue}
              onChange={(e) => setGoodsValue(e.target.value)}
              className={`w-full text-xs p-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-250 text-slate-800'
              }`}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-450 mb-1">
              Giá vốn kho tương ứng của lô hàng đó (VND):
            </label>
            <input
              type="number"
              value={cogsValue}
              onChange={(e) => setCogsValue(e.target.value)}
              className={`w-full text-xs p-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-250 text-slate-800'
              }`}
            />
          </div>
        </div>

        {/* Double entry results output chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {/* Box 1: Revenue Decrease Journal entry */}
          <div className={`p-4 rounded-lg border ${
            darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-slate-205 shadow-3xs'
          }`}>
            <span className="text-[10px] uppercase font-black text-rose-500 tracking-wider">BÚT TOÁN 1: GIẢM TRỪ DOANH THU &amp; HOÀN TIỀN</span>
            <div className="mt-3.5 space-y-2 text-[11.5px] font-mono leading-relaxed">
              <div className="flex justify-between border-b pb-1">
                <span>Nợ TK 5212 (Doanh thu hàng bán bị trả lại):</span>
                <span className="font-extrabold text-rose-500">{goodsVal.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span>Nợ TK 3331 (Thuế GTGT đầu ra giảm đi):</span>
                <span className="font-extrabold text-orange-500">{vatVal.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="flex justify-between">
                <span>Có TK 111/112/131 (Hoàn tiền hoặc giảm trừ nợ):</span>
                <span className="font-extrabold text-blue-500">{totalRefundVal.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-zinc-500 mt-3.5 italic leading-relaxed">
              💡 Giải thích: Doanh thu thực tế của bạn bị tụt giảm {goodsVal.toLocaleString('vi-VN')}đ, sắc thuế GTGT giảm nộp cho ngân sách là {vatVal.toLocaleString('vi-VN')}đ, bạn trả lại/cấn trừ công nợ cho khách hàng {totalRefundVal.toLocaleString('vi-VN')}đ.
            </p>
          </div>

          {/* Box 2: Inventory Return Journal entry */}
          <div className={`p-4 rounded-lg border ${
            darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-slate-205 shadow-3xs'
          }`}>
            <span className="text-[10px] uppercase font-black text-emerald-500 tracking-wider">BÚT TOÁN 2: NHẬP LẠI HÀNG HOÁ VÀO KHO TỒN</span>
            <div className="mt-3.5 space-y-2 text-[11.5px] font-mono leading-relaxed">
              <div className="flex justify-between border-b pb-1">
                <span>Nợ TK 156 (Hàng hóa nhập lại kho tồn):</span>
                <span className="font-extrabold text-emerald-500">{cogsVal.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="flex justify-between">
                <span>Có TK 632 (Hạch toán giảm giá vốn hàng bán):</span>
                <span className="font-extrabold text-purple-550">{cogsVal.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-505 dark:text-zinc-500 mt-4.5 italic leading-relaxed">
              💡 Giải thích: Lô hàng được hoàn trả quay về kho vật lý, do đó tăng tồn kho (Nợ 156) và bạn đồng thời thu giảm khoản chi phí giá vốn đã ghi nhận (Có 632) lúc bán đi là {cogsVal.toLocaleString('vi-VN')}đ.
            </p>
          </div>
        </div>

        {/* Action guidelines based on buyer selection */}
        <div className={`mt-4 p-3 rounded-lg border text-xs leading-relaxed ${
          buyerType === 'business'
            ? darkMode ? 'bg-blue-950/20 border-blue-900/30 text-blue-100' : 'bg-blue-50/50 border-blue-200'
            : darkMode ? 'bg-purple-950/15 border-purple-900/30 text-purple-100' : 'bg-purple-50/50 border-purple-200'
        }`}>
          <div className="flex items-center gap-1.5 mb-1">
            <FileSpreadsheet className="w-4.5 h-4.5" />
            <p className="font-bold">📋 Hồ sơ chứng từ bắt buộc phải chuẩn bị đầy đủ:</p>
          </div>
          {buyerType === 'business' ? (
            <ul className="list-decimal pl-4 space-y-1 text-[11px]">
              <li>Hóa đơn trả lại hàng hóa do <strong>bên mua doanh nghiệp</strong> phát hành, có trạng thái hoạt động bình thường trên tra cứu XML của tổng cục thuế.</li>
              <li>Biên bản bàn giao nhận lại hàng thực tế ghi rõ tình trạng hỏng/hủy sản phẩm có chữ ký đại diện hai bên đơn vị.</li>
              <li>Tờ khai và phụ lục mua vào - bán ra của kỳ thuế phát sinh thực hiện ghi nhận giảm ở chỉ tiêu bán ra giảm trừ doanh thu.</li>
            </ul>
          ) : (
            <ul className="list-decimal pl-4 space-y-1 text-[11px]">
              <li>Hóa đơn điện tử điều chỉnh giảm hoặc thay thế có <strong>mã số thuế và tên của bạn đại diện ký nhận</strong> phát hành.</li>
              <li>Biên bản nhận trả hàng hoặc thỏa thuận hủy bỏ đơn, có chữ ký xác nhận của <strong>cá nhân mua lẻ</strong> bàn giao.</li>
              <li>Chứng từ hoàn trả tiền mặt của thủ quỹ hoặc lịch sử chuyển tiền ngân hàng hoàn trả tương thích số tiền {totalRefundVal.toLocaleString('vi-VN')}đ để chứng minh không xuất hóa đơn ảo làm giảm thu nhập tính thuế.</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
