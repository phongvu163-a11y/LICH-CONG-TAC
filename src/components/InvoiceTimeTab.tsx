import React, { useState } from 'react';
import { FileText, CheckCircle, AlertTriangle, HelpCircle, ArrowRight, ShieldAlert, Award } from 'lucide-react';

interface InvoiceTimeTabProps {
  darkMode: boolean;
}

export default function InvoiceTimeTab({ darkMode }: InvoiceTimeTabProps) {
  const [txType, setTxType] = useState<'selling' | 'multi_delivery' | 'service' | 'prepayment'>('selling');
  const [actualDate, setActualDate] = useState<string>('');
  const [deadlineDate, setDeadlineDate] = useState<string>('');
  const [simResult, setSimResult] = useState<{ isOk: boolean; msg: string; penalty: string } | null>(null);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actualDate || !deadlineDate) {
      alert('Vui lòng chọn đầy đủ mốc thời gian!');
      return;
    }

    const actual = new Date(actualDate);
    const deadline = new Date(deadlineDate);

    // If actual date is greater than deadline, it's late
    if (actual > deadline) {
      const diffTime = Math.abs(actual.getTime() - deadline.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let penalty = 'Phạt cảnh cáo (nếu có tình tiết giảm nhẹ, quá hạn 1-5 ngày) hoặc phạt tiền từ 500.000đ đến 1.000.000đ.';
      if (diffDays > 5 && diffDays <= 15) {
        penalty = 'Phạt tiền từ 1.000.000đ đến 2.000.000đ (Xuất hóa đơn sai thời điểm nhưng không dẫn đến chậm nộp thuế).';
      } else if (diffDays > 15) {
        penalty = 'Phạt tiền từ 4.000.000đ đến 8.000.000đ (Xuất hóa đơn sai thời điểm quá hạn từ 16 ngày trở lên). Trường hợp vi phạm nặng có thể xử phạt kịch khung lên tới 70.000.000đ đối với hành vi trốn thuế.';
      }

      setSimResult({
        isOk: false,
        msg: `Bạn đã xuất hóa đơn TRỄ ${diffDays} ngày so với thời hạn quy định luật thuế!`,
        penalty
      });
    } else {
      setSimResult({
        isOk: true,
        msg: 'Tuyệt vời! Bạn đã xuất hóa đơn hoàn toàn ĐÚNG THỜI ĐIỂM quy định.',
        penalty: 'Không phát sinh bất kỳ khoản phạt nào. Doanh nghiệp an toàn pháp lý!'
      });
    }
  };

  return (
    <div className="space-y-5 animate-fade-in text-left">
      {/* Header banner */}
      <div className={`p-4 rounded-xl border flex items-center gap-3 ${
        darkMode ? 'bg-zinc-950/40 border-sky-950/50' : 'bg-amber-50/20 border-amber-100'
      }`}>
        <div className="p-3 bg-amber-550 text-white rounded-xl shrink-0">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-black text-sm uppercase tracking-tight text-amber-600">
            Hộ Kinh Doanh Xuất Hóa Đơn Lúc Nào Để Không Bị Phạt?
          </h3>
          <p className="text-[11px] font-medium mt-0.5 text-slate-500 dark:text-zinc-400">
            Cẩm nang xác định thời điểm lập hóa đơn điện tử cho 4 kịch bản giao dịch thực tế phục vụ hộ và cá nhân kinh doanh.
          </p>
        </div>
      </div>

      {/* Grid containing 4 basic rules according to Infographic */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {[
          {
            step: '1',
            title: 'BÁN HÀNG HOÁ',
            desc: 'Xuất khi bàn giao hàng',
            detail: 'Thời điểm chuyển giao quyền sở hữu hoặc quyền sử dụng hàng hóa cho người mua, không phân biệt đã thu được tiền hay chưa thu được tiền.',
            color: 'border-emerald-500/20'
          },
          {
            step: '2',
            title: 'GIAO HÀNG NHIỀU ĐỢT',
            desc: 'Mỗi lần giao xuất 1 lần',
            detail: 'Mỗi lần bàn giao hàng hóa hoặc nghiệm thu từng phần công trình, hạng mục bàn giao đều phải lập hóa đơn cho khối lượng, giá trị tương ứng.',
            color: 'border-blue-500/20'
          },
          {
            step: '3',
            title: 'CUNG CẤP DỊCH VỤ',
            desc: 'Xuất khi hoàn thành dịch vụ',
            detail: 'Thời điểm hoàn thành việc cung cấp dịch vụ, không phân biệt đã thu được tiền hay chưa. Nếu thu tiền trước/trong dịch vụ thì xuất tại ngày thu.',
            color: 'border-purple-500/20'
          },
          {
            step: '4',
            title: 'NGOẠI LỆ ĐẶC THÙ',
            desc: 'Thu tiền trước -> Xuất ngay',
            detail: 'Chỉ áp dụng với một số dịch vụ thu tiền trước như: học phí, dịch vụ đặt phòng, vé máy bay, dịch vụ định kỳ... Xuất hóa đơn ngay tại ngày thu tiền.',
            color: 'border-orange-500/20'
          }
        ].map((item) => (
          <div 
            key={item.step}
            className={`p-3.5 rounded-xl border flex flex-col justify-between ${
              darkMode ? 'bg-[#0f172a] border-zinc-800' : 'bg-white border-slate-205 shadow-3xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 roundedbg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400">
                  Kịch bản 0{item.step}
                </span>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </div>
              <h4 className="font-extrabold text-[12px] uppercase text-slate-800 dark:text-zinc-150">
                {item.title}
              </h4>
              <p className="text-red-500 dark:text-red-400 font-extrabold text-[11px] mt-1">
                {item.desc}
              </p>
              <p className="text-[10.5px] text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Warning Alert from image */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 ${
        darkMode ? 'bg-red-950/20 border-red-900/40 text-red-100/90' : 'bg-red-50/40 border-red-200 text-red-800'
      }`}>
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-550" />
        <div>
          <h4 className="font-black text-xs uppercase">Ghi chú pháp lý cực kỳ quan trọng:</h4>
          <ul className="list-disc pl-5 mt-1.5 space-y-1 text-[11px] leading-relaxed">
            <li>
              <strong>Bắt buộc lập hóa đơn đầy đủ:</strong> Một khi đã sử dụng hóa đơn điện tử, cho dù giá trị giao dịch lớn hay nhỏ, hoặc khách mua lẻ <strong>không lấy hóa đơn</strong> (hoặc không cung cấp thông tin), hộ kinh doanh vẫn bắt buộc phải xuất đầy đủ hóa đơn điện tử cho từng giao dịch.
            </li>
            <li>
              <strong>Hạn chế rủi ro xử phạt:</strong> Hành vi xuất hóa đơn sai thời điểm bị xử phạt hành chính rất nghiêm khắc theo <strong>Nghị định 125/2020/NĐ-CP</strong> với khung phạt tiền từ <strong>500.000 VNĐ đến 8.000.000 VNĐ</strong> (và đối với tổ chức DN có thể lên tới 70.000.000 VNĐ nếu có dấu hiệu trốn lậu thuế).
            </li>
          </ul>
        </div>
      </div>

      {/* Interaction simulator widget */}
      <div className={`p-4 rounded-xl border text-left ${
        darkMode ? 'bg-zinc-950/30 border-stone-850' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-2 mb-3.5">
          <ShieldAlert className="w-5 h-5 text-amber-500" />
          <h4 className="font-black text-xs uppercase tracking-tight text-slate-800 dark:text-zinc-200">
            Công Cụ Tra Cứu &amp; Giả Lập Rủi Ro Xuất Hóa Đơn Trễ Hạn
          </h4>
        </div>
        
        <form onSubmit={handleSimulate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-450 mb-1">
              Hình thức giao dịch bán mặt hàng/dịch vụ:
            </label>
            <select
              value={txType}
              onChange={(e) => {
                setTxType(e.target.value as any);
                setSimResult(null);
              }}
              className={`w-full text-xs p-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-250 text-slate-800'
              }`}
            >
              <option value="selling">Bán hàng hóa sỉ/lẻ thông thường</option>
              <option value="multi_delivery">Giao hàng thành nhiều đợt/nghiệm thu từng khối lượng</option>
              <option value="service">Cung cấp các gói dịch vụ, tư vấn</option>
              <option value="prepayment">Thu tiền dịch vụ trước (đào tạo, vé đặt trước, đặt cọc...)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-450 mb-1">
              Thời điểm hoàn thành việc giao hàng / Nghiệm thu dịch vụ:
            </label>
            <input
              type="date"
              value={deadlineDate}
              onChange={(e) => {
                setDeadlineDate(e.target.value);
                setSimResult(null);
              }}
              className={`w-full text-xs p-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-250 text-slate-800'
              }`}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-450 mb-1">
              Ngày thực tế lập hóa đơn điện tử trên hệ thống:
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={actualDate}
                onChange={(e) => {
                  setActualDate(e.target.value);
                  setSimResult(null);
                }}
                className={`w-full text-xs p-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                  darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-250 text-slate-800'
                }`}
              />
              <button
                type="submit"
                className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-lg shadow-xs cursor-pointer inline-flex items-center gap-1 shrink-0"
              >
                Kiểm tra <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>

        {simResult && (
          <div className={`mt-4 p-3.5 rounded-lg border ${
            simResult.isOk 
              ? darkMode ? 'bg-emerald-950/20 border-emerald-900/30' : 'bg-emerald-50/50 border-emerald-200'
              : darkMode ? 'bg-rose-950/10 border-rose-900/30' : 'bg-rose-50/50 border-rose-200'
          }`}>
            <div className="flex items-start gap-2.5">
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                simResult.isOk ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {simResult.isOk ? 'HỢP LỆ' : 'CẢNH BÁO'}
              </span>
              <div className="space-y-1">
                <p className={`font-black text-xs ${simResult.isOk ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-655 dark:text-red-400'}`}>
                  {simResult.msg}
                </p>
                <p className="text-[11px] text-slate-655 dark:text-zinc-300 font-medium leading-relaxed font-mono">
                  👉 Mức xử lý theo luật: {simResult.penalty}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
