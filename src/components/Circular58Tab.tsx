import React, { useState } from 'react';
import { BookOpen, CheckCircle, Info, HelpCircle, Award, Scale, ChevronRight } from 'lucide-react';

interface Circular58TabProps {
  darkMode: boolean;
}

export default function Circular58Tab({ darkMode }: Circular58TabProps) {
  const [vatMethod, setVatMethod] = useState<'percent_revenue' | 'deduction'>('percent_revenue');
  const [citMethod, setCitMethod] = useState<'percent_revenue' | 'actual_income'>('percent_revenue');

  // Logic to calculate exact book templates based on Vietnamese MoF Circular 58/2026/TT-BTC
  const getBookRecommendation = () => {
    if (vatMethod === 'percent_revenue' && citMethod === 'percent_revenue') {
      return {
        books: ['Sổ kế toán tổng hợp S1-DNSN'],
        desc: 'Mẫu sổ tối giản nhất dành cho Doanh nghiệp siêu nhỏ & Hộ kinh doanh nộp thuế khoán/thuế tỷ lệ trực tiếp trên doanh thu thực tế. Giúp ghi chép đơn giản dòng thu và đối chiếu hóa đơn bán ra.'
      };
    } else if (vatMethod === 'percent_revenue' && citMethod === 'actual_income') {
      return {
        books: ['Sổ S2a-DNSN', 'Sổ S2b-DNSN', 'Sổ S2c-DNSN', 'Sổ S2d-DNSN', 'Sổ S2e-DNSN'],
        desc: 'Áp dụng cho đơn vị tính thuế GTGT theo tỷ lệ % doanh thu bán ra nhưng kê khai thuế Thu nhập doanh nghiệp / Thu nhập cá nhân trên thu nhập chịu thuế thực tế. Cần các sổ chi tiết để theo dõi biến động các khoản chi phí phát sinh để tính giảm trừ.'
      };
    } else if (vatMethod === 'deduction' && citMethod === 'percent_revenue') {
      return {
        books: ['Sổ S3a-DNSN', 'Sổ S3b-DNSN'],
        desc: 'Áp dụng cho đơn vị tính thuế GTGT theo phương pháp khấu trừ (phát sinh hóa đơn VAT đầu vào đầu ra khấu trừ) nhưng nộp thuế Thu nhập doanh nghiệp trực tiếp theo tỷ lệ % thu nhập doanh số.'
      };
    } else {
      return {
        books: ['Sổ S2b-DNSN', 'Sổ S2c-DNSN', 'Sổ S2d-DNSN', 'Sổ S2e-DNSN', 'Sổ S3b-DNSN'],
        desc: 'Hệ thống sổ đầy đủ nhất cho đơn vị siêu nhỏ hoạt động chuẩn chỉ: Tính thuế GTGT khấu trừ hóa đơn thuế và Thu nhập trên kết quả kinh doanh thực tế. Hệ thống sổ này giúp kiểm toán kiểm soát chặt chẽ giá thành kho đầu vào và chi phí quản lý.'
      };
    }
  };

  const { books, desc } = getBookRecommendation();

  return (
    <div className="space-y-5 animate-fade-in text-left">
      {/* Header banner */}
      <div className={`p-4 rounded-xl border flex items-center gap-3 ${
        darkMode ? 'bg-zinc-950/40 border-sky-950/50' : 'bg-emerald-50/20 border-emerald-100'
      }`}>
        <div className="p-3 bg-emerald-550 text-white rounded-xl shrink-0">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-black text-sm uppercase tracking-tight text-emerald-600">
             Thông Tư 58/2026/TT-BTC - Chế Độ Kế Toán Mới Cho Doanh Nghiệp Siêu Nhỏ &amp; Hộ Kinh Doanh
          </h3>
          <p className="text-[11px] font-medium mt-0.5 text-slate-505 dark:text-zinc-400">
            Cập nhật chế độ kế toán tinh gọn gàng, linh động hóa nhân sự bộ máy kế toán và gắn chặt ghi chép với phương pháp tính thuế nộp nộp ngân sách có hiệu lực từ ngày <strong>01/07/2026</strong>.
          </p>
        </div>
      </div>

      {/* 4 Points Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            title: '1. Mở rộng diện áp dụng linh hoạt',
            desc: 'Áp dụng chung thương hiệu cho doanh nghiệp siêu nhỏ, đồng thời cho phép cá nhân, hộ kinh doanh có nhu cầu tự nguyện áp dụng chế độ kế toán tinh gọn này để minh bạch hóa số liệu. Thời gian áp dụng tối thiểu liên tục 1 năm tài chính.'
          },
          {
            title: '2. Cách mạng hóa nhân sự kế toán',
            desc: 'Cho phép người thân bên cạnh (vợ, chồng, con, cha mẹ...), thủ quỹ, thủ kho hoặc người trực tiếp đại diện điều hành hộ/doanh nghiệp được phép kiêm nhiệm luôn nhiệm vụ Kế toán viên. Tuyệt đối không bắt buộc phải có Kế toán trưởng.'
          },
          {
            title: '3. Đồng bộ hóa hóa đơn điện tử',
            desc: 'Nếu doanh nghiệp siêu nhỏ hoặc chủ hộ thực hiện xuất hóa đơn điện tử đầy đủ qua app và được hệ thống Cơ quan Thuế tự động hóa tính toán thuế khoán nộp, sổ sách theo TT 58 được dùng làm căn cứ pháp lý để đối chiếu số liệu phản hồi.'
          },
          {
            title: '4. Biểu mẫu thiết kế tùy chỉnh',
            desc: 'Các đơn vị tự chủ thiết kế thêm hoặc sửa đổi biểu mẫu chứng từ, hệ thống biểu mục sổ kế toán chi tiết cho phù hợp với hoạt động giao dịch đặc thù của doanh nghiệp, cam kết tuân thủ Luật Kế toán cơ sở.'
          }
        ].map((item, idx) => (
          <div 
            key={idx} 
            className={`p-4 rounded-xl border flex gap-3 ${
              darkMode ? 'bg-[#0f172a] border-zinc-800' : 'bg-white border-slate-205 shadow-3xs'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 font-extrabold text-xs flex items-center justify-center shrink-0">
              {idx + 1}
            </div>
            <div>
              <h4 className="font-extrabold text-[12px] uppercase text-slate-900 dark:text-zinc-150 mb-1">
                {item.title}
              </h4>
              <p className="text-[11px] text-slate-555 dark:text-zinc-400 leading-relaxed font-semibold">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Book template wizard helper */}
      <div className={`p-5 rounded-xl border ${
        darkMode ? 'bg-zinc-950/30 border-stone-850' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-2 mb-3">
          <Scale className="w-5 h-5 text-emerald-555" />
          <h4 className="font-black text-xs uppercase tracking-tight text-slate-800 dark:text-zinc-100">
            Hỗ Trợ Chọn Mẫu Sổ Kế Toán Lập Theo Chế Độ Thuế &amp; Thông Tư 58/2026/TT-BTC
          </h4>
        </div>
        <p className="text-[11px] text-slate-505 dark:text-zinc-400 font-medium mb-4">
          Hãy khai báo phương thức nộp thuế Giá trị gia tăng (GTGT) và Thuế Thu nhập (TNDN/TNCN) hiện hành của đơn vị bạn, hệ thống sẽ đề xuất chính xác các mẫu biểu sổ kế toán cần thiết lập:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {/* VAT Selection */}
          <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-400 dark:text-zinc-500 tracking-wider">Hỏi 1: Cách tính Thuế GTGT (Giá trị gia tăng) của bạn:</span>
            <div className="flex flex-col gap-2 mt-2">
              <label className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-50 dark:hover:bg-zinc-900 cursor-pointer text-xs">
                <input
                  type="radio"
                  name="vatMethod"
                  checked={vatMethod === 'percent_revenue'}
                  onChange={() => setVatMethod('percent_revenue')}
                  className="accent-emerald-500"
                />
                <div>
                  <p className="font-extrabold text-slate-800 dark:text-zinc-200">Kê khai trực tiếp tỷ lệ % trên doanh thu</p>
                  <p className="text-[10.5px] text-slate-500 dark:text-zinc-400 mt-0.5">Áp dụng cho đa số hộ kinh doanh truyền thống, nộp thuế theo doanh số bán.</p>
                </div>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-50 dark:hover:bg-zinc-900 cursor-pointer text-xs">
                <input
                  type="radio"
                  name="vatMethod"
                  checked={vatMethod === 'deduction'}
                  onChange={() => setVatMethod('deduction')}
                  className="accent-emerald-500"
                />
                <div>
                  <p className="font-extrabold text-slate-800 dark:text-zinc-200">Phương pháp khấu trừ thuế (Có hóa đơn VAT đỏ)</p>
                  <p className="text-[10.5px] text-slate-500 dark:text-zinc-400 mt-0.5">Yêu cầu quản lý chặt chẽ hóa đơn mua vào hàng tháng và lập báo cáo VAT.</p>
                </div>
              </label>
            </div>
          </div>

          {/* CIT Selection */}
          <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-400 dark:text-zinc-500 tracking-wider">Hỏi 2: Cách tính Thuế Thu nhập của bạn:</span>
            <div className="flex flex-col gap-2 mt-2">
              <label className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-50 dark:hover:bg-zinc-900 cursor-pointer text-xs">
                <input
                  type="radio"
                  name="citMethod"
                  checked={citMethod === 'percent_revenue'}
                  onChange={() => setCitMethod('percent_revenue')}
                  className="accent-emerald-500"
                />
                <div>
                  <p className="font-extrabold text-slate-800 dark:text-zinc-200">Tỷ lệ % trực tiếp trên doanh thu bán ra</p>
                  <p className="text-[10.5px] text-slate-500 dark:text-zinc-400 mt-0.5">Tính thuế nhanh gọn bằng cách nhân Doanh thu với tỷ lệ quy định sắc thuế.</p>
                </div>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-50 dark:hover:bg-zinc-900 cursor-pointer text-xs">
                <input
                  type="radio"
                  name="citMethod"
                  checked={citMethod === 'actual_income'}
                  onChange={() => setCitMethod('actual_income')}
                  className="accent-emerald-500"
                />
                <div>
                  <p className="font-extrabold text-slate-800 dark:text-zinc-200">Tính trên thu nhập chịu thuế thực tế (Có giảm trừ chi phí)</p>
                  <p className="text-[10.5px] text-slate-500 dark:text-zinc-400 mt-0.5">Lấy doanh thu trừ đi chi phí hợp lệ để tính thu nhập chịu thuế sau thuế.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Wizard output */}
        <div className={`p-4 rounded-xl border leading-relaxed ${
          darkMode ? 'bg-emerald-950/10 border-emerald-900/30' : 'bg-emerald-50/50 border-emerald-200'
        }`}>
          <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider flex items-center gap-1">
            <span>✨ KHUYẾN NGHỊ HỆ THỐNG SỔ THEO THÔNG TƯ 58/2026/TT-BTC:</span>
          </span>
          <div className="mt-3 flex flex-wrap gap-2">
            {books.map((book) => (
              <span 
                key={book} 
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white font-extrabold text-xs rounded-lg shadow-3xs"
              >
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                {book}
              </span>
            ))}
          </div>
          <p className="text-[11.5px] text-slate-705 dark:text-zinc-300 font-medium leading-relaxed mt-3">
            <strong>Mô tả chi tiết:</strong> {desc}
          </p>
          <p className="text-[10px] text-slate-400 dark:text-zinc-550 mt-2 italic font-mono leading-tight">
            * Chú ý: Việc lựa chọn sổ và chế độ theo thông tư 58 phải được thực hiện nhất quán trong suốt cả niên độ năm tài chính và thông báo giải trình với quản lý thuế khi cơ quan thanh kiểm tra đột xuất.
          </p>
        </div>
      </div>
    </div>
  );
}
