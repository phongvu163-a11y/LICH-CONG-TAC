import React, { useState } from 'react';
import { Building2, CheckCircle, Info, HelpCircle, Compass, Calculator, FileText, ArrowRight, Clipboard } from 'lucide-react';

interface TradeUnionTabProps {
  darkMode: boolean;
}

export default function TradeUnionTab({ darkMode }: TradeUnionTabProps) {
  const [bizName, setBizName] = useState<string>('CONG TY TNHH ABC');
  const [mst, setMst] = useState<string>('0101234567');
  const [payrollSum, setPayrollSum] = useState<string>('50000000'); // 50 Million payroll
  const [selectMonth, setSelectMonth] = useState<string>('06/2026');
  const [bankType, setBankType] = useState<'vietin' | 'bidv'>('vietin');
  const [copied, setCopied] = useState<string | null>(null);

  const paySumVal = parseFloat(payrollSum) || 0;
  const unionFee = paySumVal * 0.02; // Trade Union Fund is 2% of total payroll sum used for Social Insurance

  // Generate Virtual Accounts details
  const getVirtualAccountInfo = () => {
    const formattedMst = mst.trim().replace(/\D/g, ''); // digit-only tax code
    if (bankType === 'vietin') {
      return {
        bankName: 'Ngân hàng TMCP Công thương Việt Nam (VietinBank)',
        accountName: `Công đoàn Việt Nam - ${bizName.toUpperCase()}`,
        accountNum: `1TLD${formattedMst}`,
        content: `${bizName.toUpperCase()} nop 2% KPCD thang ${selectMonth}`
      };
    } else {
      return {
        bankName: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)',
        accountName: 'Công đoàn Việt Nam',
        accountNum: `V2TT${formattedMst}`,
        content: `${bizName.toUpperCase()} nop 2% KPCD thang ${selectMonth}`
      };
    }
  };

  const accountInfo = getVirtualAccountInfo();

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-5 animate-fade-in text-left">
      {/* Header banner */}
      <div className={`p-4 rounded-xl border flex items-center gap-3 ${
        darkMode ? 'bg-zinc-950/40 border-sky-950/50' : 'bg-rose-50/20 border-rose-100'
      }`}>
        <div className="p-3 bg-red-655 text-white rounded-xl shrink-0">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-black text-sm uppercase tracking-tight text-red-655">
             Hướng Dẫn Khai Báo &amp; Đóng Kinh Phí Công Đoàn 2%
          </h3>
          <p className="text-[11px] font-medium mt-0.5 text-slate-505 dark:text-zinc-400">
            Quy trình khai báo hồ sơ, đăng ký dữ liệu phần mềm ngân hàng của Liên đoàn Lao động và tra cứu chuyển tiền định danh tự động bảo mật cao.
          </p>
        </div>
      </div>

      {/* 4 Steps Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        {[
          {
            step: 'BƯỚC 1',
            title: 'Khai báo thông tin',
            desc: 'Chọn 1 trong 3 biểu mẫu: BM 01 (Đã có tk nhưng chưa khai báo hệ thống); BM 02 (Chưa có tổ chức công đoàn); BM 03 (Thay đổi tài khoản).'
          },
          {
            step: 'BƯỚC 2',
            title: 'Gửi hồ sơ LĐLĐ',
            desc: 'Gửi văn bản cứng (đã ký tên đóng dấu) và file mềm excel qua hòm thư điện tử chính thức: bantaichinh.cdhn@gmail.com (Ban TC LĐLĐ Hà Nội).'
          },
          {
            step: 'BƯỚC 3',
            title: 'Kiểm tra duyệt mã',
            desc: 'Chờ từ 10 đến 14 ngày làm việc hành chính để cán bộ Tổng liên đoàn xử lý và liên thông dữ liệu mã số thuế của bạn lên hệ thống ngân hàng liên kết.'
          },
          {
            step: 'BƯỚC 4',
            title: 'Chuyển tiền kinh phí',
            desc: 'Nhận thông báo duyệt mã đơn vị từ Ban tài chính. Doanh nghiệp bắt đầu đóng khoản kinh phí công đoàn 2% theo luồng định danh tự động.'
          }
        ].map((item, idx) => (
          <div 
            key={idx}
            className={`p-3.5 rounded-xl border relative ${
              darkMode ? 'bg-[#0f172a] border-zinc-800' : 'bg-white border-slate-205 shadow-3xs'
            }`}
          >
            <span className="text-[9px] font-black uppercase tracking-wider text-rose-505 block mb-1">
              {item.step}
            </span>
            <h4 className="font-extrabold text-[12px] uppercase text-slate-900 dark:text-zinc-150 mb-1.5 border-b pb-1">
              {item.title}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-normal font-semibold">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Virtual Account payment constructor generator */}
      <div className={`p-5 rounded-xl border ${
        darkMode ? 'bg-zinc-950/30 border-stone-850' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="w-5 h-5 text-rose-555" />
          <h4 className="font-black text-xs uppercase tracking-tight text-slate-800 dark:text-zinc-150">
            Trình Khởi Tạo &amp; Tính Toán Khoản Đóng Kinh Phí Công Đoàn Hoàn Toàn Tự Động
          </h4>
        </div>
        <p className="text-[11px] text-slate-505 dark:text-zinc-400 font-medium mb-4">
          Nhập mã số thuế và quỹ lương đóng Bảo hiểm xã hội của đơn vị bạn, hệ thống sẽ tự động tính mức trích đóng 2% và xuất bản dữ liệu chuyển khoản định danh chuẩn chỉ:
        </p>

        {/* Form panel */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end mb-4 text-xs">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase text-slate-450 mb-1">
              Tên Doanh nghiệp / Hộ kinh doanh:
            </label>
            <input
              type="text"
              value={bizName}
              onChange={(e) => setBizName(e.target.value)}
              placeholder="Ví dụ: CONG TY TNHH THUONG MAI ABC"
              className={`w-full text-xs p-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-red-500 ${
                darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-250 text-slate-800'
              }`}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-450 mb-1">
              Mã số thuế đơn vị:
            </label>
            <input
              type="text"
              maxLength={13}
              value={mst}
              onChange={(e) => setMst(e.target.value)}
              placeholder="Mã số thuế doanh nghiệp"
              className={`w-full text-xs p-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-red-500 ${
                darkMode ? 'bg-zinc-900 border-zinc-800 text-white font-mono' : 'bg-white border-slate-250 text-slate-800 font-mono'
              }`}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-450 mb-1">
              Quỹ lương trích BHXH (VND):
            </label>
            <input
              type="number"
              value={payrollSum}
              onChange={(e) => setPayrollSum(e.target.value)}
              className={`w-full text-xs p-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-red-500 ${
                darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-250 text-slate-800'
              }`}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-450 mb-1">
              Kỳ trích đóng:
            </label>
            <input
              type="text"
              placeholder="Tháng nộp"
              value={selectMonth}
              onChange={(e) => setSelectMonth(e.target.value)}
              className={`w-full text-xs p-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-red-500 ${
                darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-250 text-slate-800'
              }`}
            />
          </div>
        </div>

        {/* Bank Type selection */}
        <div className="flex gap-4 mb-4 text-xs font-black uppercase text-slate-500 dark:text-zinc-400">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="bankType"
              checked={bankType === 'vietin'}
              onChange={() => setBankType('vietin')}
              className="accent-red-500"
            />
            <span>Đóng qua NH VietinBank (Cổng định danh)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="bankType"
              checked={bankType === 'bidv'}
              onChange={() => setBankType('bidv')}
              className="accent-red-500"
            />
            <span>Đóng qua NH BIDV (Cổng định danh)</span>
          </label>
        </div>

        {/* Calculated output ticket */}
        <div className={`p-4 rounded-xl border leading-relaxed ${
          darkMode ? 'bg-[#1e151a]/30 border-red-950/50' : 'bg-red-50/20 border-red-200'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Calculation receipt */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase text-slate-400 dark:text-zinc-500 tracking-wider">HÓA ĐƠN KINH PHÍ CÔNG ĐOÀN TẠM TÍNH (2%):</span>
              <div className="text-left font-mono mt-2 pr-4 space-y-1 text-[11.5px] border-r border-slate-200 dark:border-zinc-800">
                <p>• Quỹ lương kê đóng: {paySumVal.toLocaleString('vi-VN')} VNĐ</p>
                <div className="flex justify-between items-center bg-red-500/10 p-1.5 rounded text-red-600 dark:text-red-400">
                  <span className="font-extrabold text-xs">MỨC NỘP 2% KPCĐ:</span>
                  <span className="font-black text-md">{unionFee.toLocaleString('vi-VN')}đ</span>
                </div>
                <p className="text-[10px] text-slate-500 pl-1"><em>* Công thức đóng: {paySumVal.toLocaleString('vi-VN')} đ × 2%</em></p>
              </div>
            </div>

            {/* Account wire details */}
            <div className="space-y-2 text-xs">
              <span className="text-[10px] font-black uppercase text-slate-400 dark:text-zinc-500 tracking-wider">DỮ LIỆU ĐỊNH DANH COPY ĐỂ CHUYỂN KHOẢN APP NGÂN HÀNG:</span>
              <div className="space-y-2.5 mt-2.5">
                {/* Bank Name */}
                <div className="flex justify-between items-center bg-white dark:bg-zinc-950 p-2 rounded-lg border border-slate-150 dark:border-zinc-850">
                  <div>
                    <p className="text-[9px] uppercase tracking-wide text-slate-400">Ngân hàng thụ hưởng:</p>
                    <p className="font-extrabold text-slate-800 dark:text-zinc-200 text-[11px]">{accountInfo.bankName}</p>
                  </div>
                </div>

                {/* Account Name */}
                <div className="flex justify-between items-center bg-white dark:bg-zinc-950 p-2 rounded-lg border border-slate-150 dark:border-zinc-850">
                  <div>
                    <p className="text-[9px] uppercase tracking-wide text-slate-400">Tên đơn vị hưởng:</p>
                    <p className="font-extrabold text-slate-800 dark:text-zinc-200 text-[11px] font-mono">{accountInfo.accountName}</p>
                  </div>
                  <button 
                    onClick={() => handleCopyText(accountInfo.accountName, 'name')}
                    className="p-1 px-1.5 text-[9px] font-black uppercase bg-slate-100 dark:bg-zinc-900 border hover:bg-slate-150 dark:hover:bg-zinc-800 rounded font-sans cursor-pointer inline-flex items-center gap-1 shrink-0"
                  >
                    <Clipboard className="w-3 h-3" />
                    {copied === 'name' ? 'Đã sao chép' : 'Copy'}
                  </button>
                </div>

                {/* Account Number */}
                <div className="flex justify-between items-center bg-white dark:bg-zinc-950 p-2 rounded-lg border border-slate-150 dark:border-zinc-850">
                  <div>
                    <p className="text-[9px] uppercase tracking-wide text-slate-400">Số tài khoản định danh (Virtual Account):</p>
                    <p className="font-black text-rose-505 dark:text-rose-455 text-md font-mono">{accountInfo.accountNum}</p>
                  </div>
                  <button 
                    onClick={() => handleCopyText(accountInfo.accountNum, 'num')}
                    className="p-1 px-1.5 text-[9px] font-black uppercase bg-slate-100 dark:bg-zinc-900 border hover:bg-slate-150 dark:hover:bg-zinc-800 rounded font-sans cursor-pointer inline-flex items-center gap-1 shrink-0"
                  >
                    <Clipboard className="w-3 h-3" />
                    {copied === 'num' ? 'Đã sao chép' : 'Copy'}
                  </button>
                </div>

                {/* Content */}
                <div className="flex justify-between items-center bg-white dark:bg-zinc-950 p-2 rounded-lg border border-slate-150 dark:border-zinc-850">
                  <div>
                    <p className="text-[9px] uppercase tracking-wide text-slate-400">Nội dung chuyển khoản chuẩn:</p>
                    <p className="font-extrabold text-slate-800 dark:text-zinc-200 text-[11px] font-mono">{accountInfo.content}</p>
                  </div>
                  <button 
                    onClick={() => handleCopyText(accountInfo.content, 'cnt')}
                    className="p-1 px-1.5 text-[9px] font-black uppercase bg-slate-100 dark:bg-zinc-900 border hover:bg-slate-150 dark:hover:bg-zinc-800 rounded font-sans cursor-pointer inline-flex items-center gap-1 shrink-0"
                  >
                    <Clipboard className="w-3 h-3" />
                    {copied === 'cnt' ? 'Đã sao chép' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Warning guide footer */}
        <div className={`mt-3.5 p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2 ${
          darkMode ? 'bg-[#1a2331]/30 border-blue-900/30 text-blue-100/90' : 'bg-blue-50/15 border-blue-200 text-slate-705'
        }`}>
          <Compass className="w-4 h-4 text-blue-500 shrink-0 mt-0.5 animate-pulse" />
          <p>
            💡 <strong>Quy chuẩn chuyển khoản định danh:</strong> Bằng cách sử dụng số tài khoản định danh liên kết trực tiếp giữa ngân hàng doanh thương với hệ thống Tổng Liên đoàn Lao động Việt Nam, khoản nộp chuyển tiền của bạn sẽ được tự động ghi nhận trực tuyến (online) ngay trong ngày làm việc mà hoàn toàn không lo sợ nộp nhầm tài khoản, trễ hạn bị tính phí trễ luật thuế.
          </p>
        </div>
      </div>
    </div>
  );
}
