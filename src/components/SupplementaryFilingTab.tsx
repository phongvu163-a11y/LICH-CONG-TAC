import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle, 
  Info, 
  HelpCircle, 
  AlertTriangle, 
  Calculator, 
  ArrowRight, 
  FileText, 
  Layers, 
  BookOpen, 
  Terminal, 
  Activity, 
  CheckSquare, 
  FileSpreadsheet, 
  TrendingUp, 
  TrendingDown, 
  ExternalLink 
} from 'lucide-react';

interface SupplementaryFilingTabProps {
  darkMode: boolean;
}

export default function SupplementaryFilingTab({ darkMode }: SupplementaryFilingTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'duration' | 'indicators'>('duration');
  
  // States for sub-tab 1 (Duration)
  const [targetPeriod, setTargetPeriod] = useState<string>('2021-03-31'); 
  const [correctionDate, setCorrectionDate] = useState<string>('2026-06-15'); 
  const [result, setResult] = useState<{
    allowed: boolean;
    law: string;
    finalLimitDate: string;
    isOverLimit: boolean;
  } | null>(null);

  // States for sub-tab 2 (Indicators [37]/[38])
  const [selectedCase, setSelectedCase] = useState<'38' | '37'>('38');
  const [checklist, setChecklist] = useState({
    originChecked: false,
    supplementaryFiled: false,
    explanationMatched: false,
    amountsCrossMatched: false
  });

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPeriod || !correctionDate) {
      alert('Vui lòng điền đủ mốc thời gian!');
      return;
    }

    const targetLimit = new Date(targetPeriod);
    const corrDate = new Date(correctionDate);
    const splitLawDate = new Date('2026-07-01'); 

    let yearLimit = 10;
    let lawText = 'Điểm a Khoản 6 Điều 6 Luật số 56/2024/QH15 (Thời hạn khai bổ sung tối đa 10 NĂM)';

    if (corrDate >= splitLawDate) {
      yearLimit = 5;
      lawText = 'Khoản 5 Điều 12 Luật Quản lý thuế mới sửa đổi 2025 (Thời hạn khai bổ sung rút xuống 05 NĂM)';
    }

    const finalLimitDate = new Date(targetLimit);
    finalLimitDate.setFullYear(targetLimit.getFullYear() + yearLimit);

    const isOverLimit = corrDate > finalLimitDate;

    setResult({
      allowed: !isOverLimit,
      law: lawText,
      finalLimitDate: finalLimitDate.toLocaleDateString('vi-VN'),
      isOverLimit
    });
  };

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const checklistScore = Object.values(checklist).filter(Boolean).length;

  return (
    <div className="space-y-5 animate-fade-in text-left">
      
      {/* Tab Header Banner */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        darkMode ? 'bg-zinc-950/40 border-sky-950/50' : 'bg-red-50/20 border-red-100'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-650 text-white rounded-xl shadow-md shrink-0">
            <Calendar className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase tracking-tight text-red-650">
              Nghiệp Vụ Kê Khai Bổ Sung KHBS &amp; Điều Chỉnh Chỉ Tiêu Thuế GTGT
            </h3>
            <p className="text-[11px] font-medium mt-0.5 text-slate-500 dark:text-zinc-400">
              Quản trị rủi ro hành chính thuế, thời hạn phục hồi dữ liệu sai lệch 10 năm/5 năm và quy án điều chỉnh chỉ tiêu [37], [38].
            </p>
          </div>
        </div>

        {/* Sub tab toggles */}
        <div className="flex p-0.5 rounded-lg bg-slate-100 dark:bg-zinc-900 border dark:border-zinc-800 w-full md:w-auto">
          <button
            onClick={() => setActiveSubTab('duration')}
            className={`flex-1 md:flex-none py-1.5 px-4 text-[11px] font-extrabold uppercase rounded-md tracking-wider transition cursor-pointer ${
              activeSubTab === 'duration'
                ? 'bg-amber-450 text-black shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400'
            }`}
          >
            Thời Hạn Kê Khai Bổ Sung
          </button>
          <button
            onClick={() => setActiveSubTab('indicators')}
            className={`flex-1 md:flex-none py-1.5 px-4 text-[11px] font-extrabold uppercase rounded-md tracking-wider transition cursor-pointer ${
              activeSubTab === 'indicators'
                ? 'bg-amber-450 text-black shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400'
            }`}
          >
            Chỉ tiêu [37] / [38] GTGT
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: THỜI HẠN KÊ KHAI BỔ SUNG */}
      {activeSubTab === 'duration' && (
        <div className="space-y-5 animate-fade-in">
          {/* Two timeline comparison columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phase 1 card */}
            <div className={`p-4 rounded-xl border ${
              darkMode ? 'bg-[#0f172a] border-zinc-805' : 'bg-white border-slate-205 shadow-3xs'
            }`}>
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-zinc-850 mb-3">
                <span className="px-2.5 py-0.5 text-[9px] font-black uppercase rounded bg-sky-500 text-white">GIAI ĐOẠN 1</span>
                <h4 className="font-extrabold text-[12px] text-slate-900 dark:text-zinc-150 uppercase">Đến hết ngày 30/06/2026</h4>
              </div>
              <p className="text-sky-600 dark:text-sky-400 font-extrabold text-xs mb-2">🏷️ Thời hạn khai bổ sung: TOÀN BỘ 10 NĂM</p>
              <p className="text-[11px] leading-relaxed text-slate-555 dark:text-zinc-305 font-semibold mb-3">
                Tính từ ngày hết hạn nộp hồ sơ khai thuế của kỳ tính thuế có sai sót, với điều kiện trước khi cơ quan quản lý thuế phát sinh thông báo thanh tra, kiểm tra thực tế tại trụ sở.
              </p>
              <div className="p-3 rounded bg-slate-50/50 dark:bg-zinc-950 font-mono text-[10.5px] border border-slate-150 dark:border-zinc-850 leading-relaxed">
                <strong>• Ví dụ minh họa:</strong> Tờ khai GTGT Tháng 05/2025 có hạn nộp gốc là ngày 20/06/2025. Hạn nộp KHBS điều chỉnh được kéo dài đến tận ngày <strong className="text-sky-500">20/06/2035</strong>!
              </div>
            </div>

            {/* Phase 2 card */}
            <div className={`p-4 rounded-xl border ${
              darkMode ? 'bg-[#0f172a] border-zinc-805' : 'bg-white border-slate-205 shadow-3xs'
            }`}>
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-zinc-850 mb-3">
                <span className="px-2.5 py-0.5 text-[9px] font-black uppercase rounded bg-rose-500 text-white">GIAI ĐOẠN 2</span>
                <h4 className="font-extrabold text-[12px] text-slate-900 dark:text-zinc-150 uppercase">Từ ngày 01/07/2026 trở đi</h4>
              </div>
              <p className="text-rose-500 dark:text-rose-400 font-extrabold text-xs mb-2">🚨 Thời hạn bổ sung rút xuống: CHỈ CÒN 05 NĂM</p>
              <p className="text-[11px] leading-relaxed text-slate-555 dark:text-zinc-305 font-semibold mb-3">
                Luật sửa đổi Quản lý thuế mới chính thức thu hẹp thời hạn điều chỉnh hồ sơ xuống chỉ còn 5 năm nhằm thắt chặt dữ liệu lưu trữ hồ sơ và kích thích tính tự giác kế toán của doanh nghiệp.
              </p>
              <div className="p-3 rounded bg-slate-50/50 dark:bg-zinc-950 font-mono text-[10.5px] border border-slate-150 dark:border-zinc-850 leading-relaxed">
                <strong>• Ví dụ minh họa:</strong> Tờ khai GTGT Tháng 08/2026 có hạn nộp gốc là ngày 20/09/2026. Thời điểm chót được phép nộp bổ sung sửa sai chỉ khống chế đến ngày <strong className="text-rose-500">20/09/2031</strong>!
              </div>
            </div>
          </div>

          {/* Warning highlight message box */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            darkMode ? 'bg-amber-955/25 border-amber-900/45 text-amber-100/90' : 'bg-amber-50/40 border-amber-200 text-slate-705'
          }`}>
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-xs uppercase text-amber-600">🚨 CẢNH BÁO RỦI RO MẤT QUYỀN SỬA SAI:</h4>
              <p className="text-[11px] leading-relaxed mt-1.5 font-semibold">
                Xem xét trường hợp hồ sơ Báo cáo tài chính năm 2020 (hạn nộp gốc 31/03/2021). 
                Nếu doanh nghiệp nộp bổ sung điều chỉnh vào ngày 30/06/2026, luật cũ 10 năm còn hiệu lực; nhưng nếu chần chừ đến ngày 01/07/2026 mới nộp, luật mới áp dụng co thời hạn chỉ còn 5 năm (khi này năm 2020 đã hết hạn lùi từ 31/03/2026). Khi đó, tờ khai của bạn <strong>LẬP TỨC BỊ KHÓA</strong> không cho nộp sửa chữa nữa và bạn mất hoàn toàn quyền thu giảm mức thuế đóng!
              </p>
            </div>
          </div>

          {/* Calculator tool simulation widget */}
          <div className={`p-5 rounded-xl border ${
            darkMode ? 'bg-zinc-950/30 border-stone-850' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-5 h-5 text-rose-505" />
              <h4 className="font-black text-xs uppercase tracking-tight text-slate-800 dark:text-zinc-150">
                Phần Mềm Tra Cứu Tự Động Định Hạn Nộp Tờ Khai KHBS
              </h4>
            </div>
            <p className="text-[11px] text-slate-505 dark:text-zinc-400 font-medium mb-4">
              Nhập chính xác mốc thời hạn nộp gốc của tờ khai thuế phát sinh lỗi và thời điểm bạn dự án nộp hồ sơ bổ sung sửa đổi để hệ thống tính toán tính hợp hiệu lực:
            </p>

            <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-450 mb-1">
                  Hạn nộp gốc tờ khai bị lỗi (Ví dụ: 31/03/2021):
                </label>
                <input
                  type="date"
                  value={targetPeriod}
                  onChange={(e) => {
                    setTargetPeriod(e.target.value);
                    setResult(null);
                  }}
                  className={`w-full text-xs p-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-red-500 ${
                    darkMode ? 'bg-zinc-900 border-zinc-805 text-white' : 'bg-white border-slate-250 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-450 mb-1">
                  Thời điểm dự kiến nộp bổ sung (Ví dụ: 15/06/2026):
                </label>
                <input
                  type="date"
                  value={correctionDate}
                  onChange={(e) => {
                    setCorrectionDate(e.target.value);
                    setResult(null);
                  }}
                  className={`w-full text-xs p-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-red-500 ${
                    darkMode ? 'bg-zinc-900 border-zinc-805 text-white' : 'bg-white border-slate-250 text-slate-800'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-red-655 hover:bg-red-550 text-white font-extrabold text-xs uppercase rounded-lg shadow-xs cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                Kiểm tra khả dụng <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Output outcome */}
            {result && (
              <div className={`mt-5 p-4 rounded-xl border leading-relaxed ${
                result.allowed 
                  ? darkMode ? 'bg-emerald-950/15 border-emerald-900/30 text-emerald-100' : 'bg-emerald-50 border-emerald-200'
                  : darkMode ? 'bg-rose-950/15 border-rose-900/30 text-rose-100' : 'bg-rose-50 border-rose-200'
              }`}>
                <div className="flex items-start gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-white ${
                    result.allowed ? 'bg-emerald-500' : 'bg-red-500'
                  }`}>
                    {result.allowed ? 'KHẢ DỤNG' : 'HẾT HẠN'}
                  </span>
                  <div>
                    <p className="font-extrabold text-xs">
                      {result.allowed 
                        ? '🎉 Chúc mừng! Tờ khai này vẫn hạch toán nằm trong thời hạn vàng được nộp sửa đổi.'
                        : '🚨 QUÁ HẠN: Hồ sơ của bạn đã quá hạn mức sửa đổi hồi tố theo quy luật mới.'
                      }
                    </p>
                    <div className="mt-2 pl-3 border-l-2 border-slate-350 dark:border-zinc-800 text-[11px] font-medium leading-relaxed font-mono">
                      <p>• Cơ sở pháp lý áp dụng: {result.law}</p>
                      <p>• Hạn nộp cuối cùng tương ứng: <span className="font-extrabold text-sm underline">{result.finalLimitDate}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CHỈ TIÊU [37] VÀ [38] TRÊN TỜ KHAI THUẾ GTGT */}
      {activeSubTab === 'indicators' && (
        <div className="space-y-5 animate-fade-in text-left">
          
          {/* Lời tựa từ cơ quan Thuế Thanh Hóa */}
          <div className="p-4 rounded-xl border bg-amber-500/5 border-amber-500/25 flex items-start gap-3.5 text-slate-700 dark:text-zinc-300">
            <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-[11.5px] leading-relaxed">
              <span className="font-extrabold text-red-655 dark:text-red-405 block mb-1 uppercase tracking-tight text-xs">
                ⚠️ LƯU Ý QUAN TRỌNG KHI KÊ KHAI CHỈ TIÊU [37], [38] TRÊN TỜ KHAI THUẾ GTGT:
              </span>
              Trong quá trình thực hiện khai bổ sung hồ sơ khai thuế GTGT, việc ghi nhận số liệu tại <strong>chỉ tiêu [37] (Điều chỉnh giảm)</strong> hoặc <strong>chỉ tiêu [38] (Điều chỉnh tăng)</strong> thuế GTGT còn được khấu trừ của các kỳ trước chuyển sang trên tờ khai hiện tại <strong>BẮT BUỘC PHẢI CÓ CĂN CỨ từ hồ sơ khai bổ sung (KHBS)</strong> của chính kỳ tính thuế phát sinh sai sót thực tế. Tuyệt đối không được điều chỉnh số liệu tự phát độc lập khi chưa lập tờ khai bổ sung tương ứng!
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* Cột Trái & Giữa: Nguyên tắc và Ví dụ thực tế */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* 1. Nguyên tắc thực hiện */}
              <div className={`p-4 rounded-xl border ${
                darkMode ? 'bg-zinc-950/40 border-slate-850' : 'bg-white border-slate-205 shadow-2xs'
              }`}>
                <h4 className="font-black text-xs uppercase text-red-655 flex items-center gap-2 mb-2 pb-2 border-b dark:border-zinc-850">
                  <span className="bg-red-600 text-white rounded-full w-5 h-5 inline-flex items-center justify-center font-mono text-[11px]">1</span>
                  Nguyên Tắc Thực Hiện Pháp Định
                </h4>
                <div className="text-[11px] leading-relaxed space-y-2 text-slate-655 dark:text-zinc-350 font-medium">
                  <p>
                    • Theo quy định về quản lý thuế hiện hành, khi doanh nghiệp thực hiện kê khai bổ sung dẫn đến làm tăng hoặc giảm số thuế GTGT còn được khấu trừ chuyển kỳ sau, hoặc thuộc trường hợp liên quan đến dừng hoàn thuế GTGT, thì số liệu chỉ tiêu [37] hoặc [38] trên tờ khai kỳ hiện tại phải được tiếp nhận tự động hoặc chủ động từ <strong>chỉ tiêu [43]</strong> trên tờ khai bổ sung của đúng kỳ gốc bị sai.
                  </p>
                  <p className="p-2.5 rounded bg-blue-500/5 border border-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
                    💡 Nói cách khác: Chỉ tiêu [37] và [38] không được điều chỉnh độc lập, tự ý, mà phải phản ánh chính xác kết quả xử lý của toàn bộ hồ sơ khai bổ sung tương ứng đã nộp thành công!
                  </p>
                </div>
              </div>

              {/* 2. Trình mô phỏng / Ví dụ thực tế */}
              <div className={`p-4 rounded-xl border ${
                darkMode ? 'bg-zinc-950/40 border-slate-850' : 'bg-white border-slate-205 shadow-2xs'
              }`}>
                <h4 className="font-black text-xs uppercase text-emerald-655 flex items-center gap-2 mb-3 pb-2 border-b dark:border-zinc-850">
                  <span className="bg-emerald-600 text-white rounded-full w-5 h-5 inline-flex items-center justify-center font-mono text-[11px]">2</span>
                  Ví Dụ Thực Tế Minh Họa &amp; Cách Thức Làm
                </h4>

                {/* Case Selector inside simulated guide */}
                <div className="flex rounded-lg bg-slate-100 dark:bg-zinc-900 border dark:border-zinc-850 p-1 mb-4 gap-1">
                  <button
                    onClick={() => setSelectedCase('38')}
                    className={`flex-1 py-1.5 rounded-md font-bold text-[10.5px] uppercase transition flex items-center justify-center gap-1 cursor-pointer ${
                      selectedCase === '38'
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" /> Điều chỉnh tăng [38]
                  </button>
                  <button
                    onClick={() => setSelectedCase('37')}
                    className={`flex-1 py-1.5 rounded-md font-bold text-[10.5px] uppercase transition flex items-center justify-center gap-1 cursor-pointer ${
                      selectedCase === '37'
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400'
                    }`}
                  >
                    <TrendingDown className="w-3.5 h-3.5" /> Điều chỉnh giảm [37]
                  </button>
                </div>

                {selectedCase === '38' ? (
                  <div className="space-y-3 animate-fade-in text-[11px]">
                    <p className="leading-relaxed text-slate-700 dark:text-zinc-300">
                      🏢 <strong>Tình huống:</strong> Người nộp thuế lập tờ khai thuế GTGT tháng <strong>01/2026</strong>. Phát hiện bỏ sót hóa đơn mua vào của tháng <strong>01/2023</strong> và <strong>05/2025</strong> được quyền khấu trừ bổ sung.
                    </p>
                    <div className="p-3 bg-slate-50 dark:bg-zinc-900 border dark:border-zinc-850 rounded-lg font-semibold space-y-1 text-[11px]">
                      <p className="text-emerald-600 dark:text-emerald-400 font-extrabold">Các Bước Thực Hiện Bắt Buộc:</p>
                      <p>1. Lập và gửi tờ khai bổ sung KHBS của kỳ <strong>Tháng 01/2023</strong> (tăng thuế khấu trừ).</p>
                      <p>2. Lập và gửi tờ khai bổ sung KHBS của kỳ <strong>Tháng 05/2025</strong>.</p>
                      <p>3. Tại tờ khai chính thức của kỳ hiện tại (Tháng 01/2026), điền tổng số thuế tăng tương ứng vào <strong>Chỉ tiêu [38]</strong>.</p>
                    </div>
                    <p className="italic text-[10px] text-slate-500 text-center">
                      * Nội dung giải trình tại chỉ tiêu [38] trên tờ khai tháng 01/2026 phải ghi chi tiết số tiền hình thành từ tờ khai bổ sung 01/2023 và 05/2025.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 animate-fade-in text-[11px]">
                    <p className="leading-relaxed text-slate-700 dark:text-zinc-300">
                      🏢 <strong>Tình huống:</strong> Cơ quan thuế thanh tra phát hiện bạn kê khai thừa số thuế được khấu trừ chuyển kỳ sau của kỳ tháng <strong>08/2024</strong>, buộc phải điều chỉnh giảm.
                    </p>
                    <div className="p-3 bg-slate-50 dark:bg-zinc-900 border dark:border-zinc-850 rounded-lg font-semibold space-y-1 text-[11px]">
                      <p className="text-rose-600 dark:text-rose-400 font-extrabold">Các Bước Thực Hiện Bắt Buộc:</p>
                      <p>1. Lập và nộp tờ khai bổ sung KHBS cho kỳ <strong>Tháng 08/2024</strong> để tự động hạch toán ghi nhận giảm chỉ tiêu [43].</p>
                      <p>2. Trên tờ khai GTGT kỳ thanh tra lập hiện tại, ghi nhận số liệu điều chỉnh giảm tương tự bù trừ vào <strong>Chỉ tiêu [37]</strong> của tờ khai hiện tại.</p>
                      <p>3. Tính toán và nộp bổ sung tiền phạt chậm nộp phát sinh (nếu có) đối với số tiền nợ đọng phát hiện.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Rủi ro thường gặp & Khuyên nghị */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-orange-500/20 bg-orange-500/5 text-[11px]">
                  <h5 className="font-black text-orange-500 uppercase mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> RỦI RO THƯỜNG GẶP
                  </h5>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-zinc-300">
                    <li>Kê khai chỉ tiêu [37]/[38] tự phát nhưng không lập hoặc gửi hồ sơ khai bổ sung kỳ gốc.</li>
                    <li>Không đồng nhất thông tin giữa nội dung giải trình với dữ liệu hạch toán thực tế.</li>
                    <li>Bị khóa tờ khai hoặc bị cơ quan Thuế yêu cầu giải trình, từ chối quyền bù trừ thuế.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-sky-500/20 bg-sky-500/5 text-[11px]">
                  <h5 className="font-black text-sky-600 dark:text-sky-400 uppercase mb-2 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> KHUYẾN NGHỊ BAN PHÁP CHẾ
                  </h5>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-zinc-300">
                    <li>Trước khi kê khai, bắt buộc rà soát kỹ kỳ tuyển dụng gốc sai sót.</li>
                    <li>Thiết tập hạch toán dữ liệu khớp 100% giữa KHBS với [37]/[38] tờ khai hiện tại.</li>
                    <li>Ghi nhận rõ số công văn, lý do giải trình để cơ quan thanh tra dễ dàng đối chiếu.</li>
                  </ul>
                </div>
              </div>

            </div>

            {/* Cột Phải: Tool tự duyệt checklist hóa đơn [37]/[38] */}
            <div className="space-y-4">
              
              <div className={`p-4 rounded-xl border ${
                darkMode ? 'bg-zinc-950/40 border-stone-855' : 'bg-white border-slate-205 shadow-2xs'
              }`}>
                <h4 className="font-black text-xs uppercase text-slate-800 dark:text-zinc-150 flex items-center gap-1.5 mb-3">
                  <CheckSquare className="w-4 h-4 text-indigo-500" />
                  Rà Soát Tự Kiểm Tra 4 Bước [37]/[38]
                </h4>
                <p className="text-[10.5px] text-slate-500 dark:text-zinc-400 mb-4 leading-relaxed">
                  Hãy nhấn đánh dấu kiểm tra các hạng mục pháp lý dưới đây trước khi bấm truyền nhận nộp tờ khai lên hệ thống thuế:
                </p>

                {/* Score badge */}
                <div className="mb-4 text-center py-2 bg-slate-50 dark:bg-zinc-900 border dark:border-zinc-850 rounded-lg">
                  <div className="text-[10px] font-black text-zinc-400 uppercase">TIẾN ĐỘ THỦ TỤC PHÁP LÝ</div>
                  <div className="text-xl font-mono font-black text-indigo-500 mt-1">{checklistScore} / 4 HOÀN THÀNH</div>
                  <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-2 max-w-[150px] mx-auto">
                    <div 
                      className="bg-indigo-500 h-full transition-all duration-300"
                      style={{ width: `${(checklistScore / 4) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => toggleCheck('originChecked')}
                    className="w-full text-left p-2.5 rounded-lg border dark:border-zinc-850 flex items-start gap-2.5 hover:bg-slate-50 dark:hover:bg-zinc-900 transition cursor-pointer"
                  >
                    <input 
                      type="checkbox" 
                      checked={checklist.originChecked} 
                      onChange={() => {}} 
                      className="mt-0.5 pointer-events-none accent-indigo-500" 
                    />
                    <div className="text-[10.5px]">
                      <span className="font-bold text-slate-800 dark:text-zinc-200 block">1. Xác định kỳ sai sót gốc</span>
                      <span className="text-slate-500 dark:text-zinc-400 text-[10px]">Đã xác định chính xác tháng/quý gốc bị sai sót số liệu khấu trừ GTGT?</span>
                    </div>
                  </button>

                  <button
                    onClick={() => toggleCheck('supplementaryFiled')}
                    className="w-full text-left p-2.5 rounded-lg border dark:border-zinc-850 flex items-start gap-2.5 hover:bg-slate-50 dark:hover:bg-zinc-900 transition cursor-pointer"
                  >
                    <input 
                      type="checkbox" 
                      checked={checklist.supplementaryFiled} 
                      onChange={() => {}} 
                      className="mt-0.5 pointer-events-none accent-indigo-500" 
                    />
                    <div className="text-[10.5px]">
                      <span className="font-bold text-slate-800 dark:text-zinc-200 block">2. Đã nộp tờ khai bổ sung (KHBS)</span>
                      <span className="text-slate-500 dark:text-zinc-400 text-[10px]">Đã truyền nhận thành công tờ khai bổ sung KHBS của kỳ gốc bị sai?</span>
                    </div>
                  </button>

                  <button
                    onClick={() => toggleCheck('explanationMatched')}
                    className="w-full text-left p-2.5 rounded-lg border dark:border-zinc-850 flex items-start gap-2.5 hover:bg-slate-50 dark:hover:bg-zinc-900 transition cursor-pointer"
                  >
                    <input 
                      type="checkbox" 
                      checked={checklist.explanationMatched} 
                      onChange={() => {}} 
                      className="mt-0.5 pointer-events-none accent-indigo-500" 
                    />
                    <div className="text-[10.5px]">
                      <span className="font-bold text-slate-800 dark:text-zinc-200 block">3. Soạn nội dung giải trình chi tiết</span>
                      <span className="text-slate-500 dark:text-zinc-400 text-[10px]">Đã ghi chú rõ số tiền điều chỉnh hình thành từ tờ khai bổ sung tháng/quý nào?</span>
                    </div>
                  </button>

                  <button
                    onClick={() => toggleCheck('amountsCrossMatched')}
                    className="w-full text-left p-2.5 rounded-lg border dark:border-zinc-850 flex items-start gap-2.5 hover:bg-slate-50 dark:hover:bg-zinc-900 transition cursor-pointer"
                  >
                    <input 
                      type="checkbox" 
                      checked={checklist.amountsCrossMatched} 
                      onChange={() => {}} 
                      className="mt-0.5 pointer-events-none accent-indigo-500" 
                    />
                    <div className="text-[10.5px]">
                      <span className="font-bold text-slate-800 dark:text-zinc-200 block">4. Khớp số liệu [37]/[38]</span>
                      <span className="text-slate-500 dark:text-zinc-400 text-[10px]">Số tiền điền tại [37]/[38] khớp 100% với số chênh lệch chỉ tiêu [43]?</span>
                    </div>
                  </button>
                </div>

                {checklistScore === 4 ? (
                  <div className="mt-4 p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-center font-black text-[10.5px] animate-pulse">
                    🚀 THỦ TỤC PHÁP LÝ HỢP LỆ, KHÔNG LO PHẠT HẬU KIỂM!
                  </div>
                ) : (
                  <div className="mt-4 p-2.5 rounded-lg bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 text-center font-bold text-[10px]">
                    * Hãy hoàn thành đủ 4 bước rà soát để đảm bảo an toàn tài chính.
                  </div>
                )}

              </div>

              {/* Slogan của chi cục thuế Thanh Hóa */}
              <div className="p-3 bg-red-650 text-white rounded-xl text-center text-[10px] font-black uppercase tracking-wider">
                ĐỒNG HÀNH CÙNG NGƯỜI NỘP THUẾ — AN TÂM PHÁT TRIỂN
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
