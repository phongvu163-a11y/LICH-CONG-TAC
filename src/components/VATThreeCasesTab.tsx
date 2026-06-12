import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Info, 
  ArrowRight, 
  Award, 
  FileText, 
  DollarSign, 
  Percent, 
  RefreshCw, 
  Scale, 
  BookOpen, 
  Database, 
  Calculator,
  Flame,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

interface VATThreeCasesTabProps {
  darkMode: boolean;
}

export default function VATThreeCasesTab({ darkMode }: VATThreeCasesTabProps) {
  const [selectedCase, setSelectedCase] = useState<1 | 2 | 3>(1);
  const [activeQuizIndex, setActiveQuizIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  // Quiz scenarios
  const quizQuestions = [
    {
      scenario: 'Doanh nghiệp thương mại A mua 10 tấn lúa tươi trực tiếp từ nông dân tự sản xuất, sau đó bán lại nguyên trạng lô lúa này cho đại lý gạo B.',
      options: [
        { label: 'Không chịu thuế GTGT (Exempt)', value: 1 },
        { label: 'Hàng hóa áp dụng thuế suất 0%', value: 2 },
        { label: 'Không phải kê khai, tính nộp thuế GTGT', value: 3 }
      ],
      correctValue: 3,
      explanation: 'Theo quy định, hoạt động kinh doanh thương mại đối với nông, thủy, hải sản chưa qua chế biến (hoặc chỉ qua sơ chế thông thường) khi bán cho doanh nghiệp, hợp tác xã khác thuộc trường hợp "Không phải kê khai, tính nộp thuế GTGT" nhằm tránh đánh thuế trùng lặp, và thuế đầu vào vẫn được tự do khấu trừ toàn bộ!'
    },
    {
      scenario: 'Đại lý phát triển phần mềm ABC sản xuất và bàn giao bộ phần mềm kế toán quản trị nội bộ ERP cho công ty xây dựng nội địa.',
      options: [
        { label: 'Không chịu thuế GTGT (Exempt)', value: 1 },
        { label: 'Hàng hóa áp dụng thuế suất 0%', value: 2 },
        { label: 'Không phải kê khai, tính nộp thuế GTGT', value: 3 }
      ],
      correctValue: 1,
      explanation: 'Phần mềm máy tính (bao gồm dịch vụ phần mềm và sản phẩm phần mềm) chịu điều phối đặc biệt thuộc đối tượng "Không chịu thuế GTGT" ở mọi khâu lưu thông thương mại nội địa.'
    },
    {
      scenario: 'Doanh nghiệp may mặc xuất khẩu container quần áo bảo hộ lao động trị giá 2 tỷ sang thị trường Liên minh Châu Âu (EU).',
      options: [
        { label: 'Không chịu thuế GTGT (Exempt)', value: 1 },
        { label: 'Hàng hóa áp dụng thuế suất 0%', value: 2 },
        { label: 'Không phải kê khai, tính nộp thuế GTGT', value: 3 }
      ],
      correctValue: 2,
      explanation: 'Theo nguyên tắc điểm đến trong thương mại quốc tế, tất cả hàng hóa xuất khẩu ra ngoài biên giới Việt Nam (hoặc bán vào khu phi thuế quan) đều được ưu đãi thuế suất 0% để khuyến khích xuất khẩu, và được khấu trừ/hoàn thuế GTGT đầu vào liên quan.'
    },
    {
      scenario: 'Trường học liên cấp tiểu học và trung học quốc tế Thuận An cung cấp dịch vụ giảng dạy, đào tạo chính quy học sinh.',
      options: [
        { label: 'Không chịu thuế GTGT (Exempt)', value: 1 },
        { label: 'Hàng hóa áp dụng thuế suất 0%', value: 2 },
        { label: 'Không phải kê khai, tính nộp thuế GTGT', value: 3 }
      ],
      correctValue: 1,
      explanation: 'Dịch vụ giáo dục, dạy học và dạy nghề theo quy định của pháp luật thuộc nhóm hoạt động an sinh xã hội, được xếp vào đối tượng "Không chịu thuế GTGT".'
    }
  ];

  const handleSelectAnswer = (idx: number, ansValue: number) => {
    if (selectedAnswer !== null) return; // Prevent multiple clicks
    setSelectedAnswer(ansValue);
    if (ansValue === quizQuestions[idx].correctValue) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    if (activeQuizIndex < quizQuestions.length - 1) {
      setActiveQuizIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleResetQuiz = () => {
    setActiveQuizIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="space-y-5 animate-fade-in text-left">
      
      {/* Top Banner */}
      <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
        darkMode ? 'bg-zinc-950/40 border-sky-950/50' : 'bg-emerald-50/20 border-emerald-100'
      }`}>
        <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-md shrink-0">
          <Scale className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h3 className="font-black text-sm uppercase tracking-tight text-emerald-600 dark:text-emerald-400">
            Phân Biệt 3 Trường Hợp Đặc Biệt Khống Chế Trong Thuế GTGT
          </h3>
          <p className="text-[11px] font-medium mt-0.5 text-slate-500 dark:text-zinc-400 leading-relaxed">
            Cơ chế so sánh và cẩm nang hạch toán chi tiết cho 3 trường hợp: <strong>Không chịu thuế</strong>, <strong>Thuế suất 0%</strong>, và <strong>Không phải kê khai, tính nộp thuế</strong>.
          </p>
        </div>
      </div>

      {/* Điểm giống nhau */}
      <div className={`p-4 rounded-xl border ${
        darkMode ? 'bg-zinc-950/30 border-zinc-800' : 'bg-slate-50 border-slate-205 shadow-3xs'
      }`}>
        <h4 className="font-extrabold text-xs uppercase text-slate-800 dark:text-zinc-150 mb-2 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-emerald-500 shrink-0" />
          Điểm Giống Nhau Cốt Lõi
        </h4>
        <div className="text-[11px] leading-relaxed text-slate-655 dark:text-zinc-350 font-medium">
          Cả 3 trường hợp này đều có một điểm chung cực kỳ quan trọng: <strong className="text-red-655 dark:text-red-405">Không phát sinh số thuế GTGT đầu ra phải nộp cho cơ quan Thuế</strong> tại thời điểm phát sinh giao dịch.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          <div className="p-2.5 rounded-lg border dark:border-zinc-850 bg-white/40 dark:bg-zinc-950/45 text-[10.5px]">
            <p className="font-bold text-slate-850 dark:text-zinc-200 uppercase mb-1">❌ Không Chịu Thuế GTGT</p>
            <p className="text-slate-500 dark:text-zinc-400 font-medium">Hoàn toàn không có thuế GTGT đầu ra phát sinh trên hóa đơn bán lẻ.</p>
          </div>
          <div className="p-2.5 rounded-lg border dark:border-zinc-850 bg-white/40 dark:bg-zinc-950/45 text-[10.5px]">
            <p className="font-bold text-slate-850 dark:text-zinc-200 uppercase mb-1">0️⃣ Thuế Suất 0%</p>
            <p className="text-slate-500 dark:text-zinc-400 font-medium">Vẫn ghi nhận tính thuế suất nhưng kết quả nhân ra tiền thuế đầu ra bằng 0.</p>
          </div>
          <div className="p-2.5 rounded-lg border dark:border-zinc-850 bg-white/40 dark:bg-zinc-950/45 text-[10.5px]">
            <p className="font-bold text-slate-850 dark:text-zinc-200 uppercase mb-1">🚫 Không Phải Kê Khai, Nộp Thuế</p>
            <p className="text-slate-500 dark:text-zinc-400 font-medium">Không phát sinh bất kỳ nghĩa vụ kê khai hay xác định nộp thuế nào đối với giao dịch.</p>
          </div>
        </div>
      </div>

      {/* Main interactive Tab Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        
        {/* Left Side: Buttons */}
        <div className="lg:col-span-1 space-y-2">
          <button
            onClick={() => setSelectedCase(1)}
            className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col cursor-pointer ${
              selectedCase === 1 
                ? 'bg-rose-500 border-rose-600 text-white shadow-md' 
                : darkMode ? 'bg-[#0f172a] border-zinc-800 hover:border-zinc-700 text-zinc-300' : 'bg-white border-slate-205 hover:bg-slate-50 text-slate-800'
            }`}
          >
            <span className="text-[9px] font-black uppercase tracking-wider opacity-85">TRƯỜNG HỢP 1</span>
            <span className="font-black text-xs uppercase mt-0.5">Không Chịu Thuế GTGT</span>
            <span className="text-[10px] mt-1 opacity-80 line-clamp-1 italic font-medium">Phần mềm, y tế, giáo dục...</span>
          </button>

          <button
            onClick={() => setSelectedCase(2)}
            className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col cursor-pointer ${
              selectedCase === 2 
                ? 'bg-sky-600 border-sky-700 text-white shadow-md' 
                : darkMode ? 'bg-[#0f172a] border-zinc-800 hover:border-zinc-700 text-zinc-300' : 'bg-white border-slate-205 hover:bg-slate-50 text-slate-800'
            }`}
          >
            <span className="text-[9px] font-black uppercase tracking-wider opacity-85">TRƯỜNG HỢP 2</span>
            <span className="font-black text-xs uppercase mt-0.5">Thuế Suất Ưu Đãi 0%</span>
            <span className="text-[10px] mt-1 opacity-80 line-clamp-1 italic font-medium">Xuất khẩu hàng hóa và dịch vụ</span>
          </button>

          <button
            onClick={() => setSelectedCase(3)}
            className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col cursor-pointer ${
              selectedCase === 3 
                ? 'bg-emerald-600 border-emerald-700 text-white shadow-md' 
                : darkMode ? 'bg-[#0f172a] border-zinc-800 hover:border-zinc-700 text-zinc-300' : 'bg-white border-slate-205 hover:bg-slate-50 text-slate-800'
            }`}
          >
            <span className="text-[9px] font-black uppercase tracking-wider opacity-85">TRƯỜNG HỢP 3</span>
            <span className="font-black text-xs uppercase mt-0.5">Không Phải Kê Khai, Nộp Thuế</span>
            <span className="text-[10px] mt-1 opacity-80 line-clamp-1 italic font-medium">Nông sản thương mại chuyển tiếp</span>
          </button>

          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl text-[10px] font-bold border border-amber-500/20 leading-relaxed">
            💡 <strong>Mẹo quyết toán:</strong> Đa phần kế toán nhầm lẫn giữa (1) và (3). Hãy nhấp để xem cách xử lý đầu vào khác nhau hoàn toàn!
          </div>
        </div>

        {/* Right Side: Case Content View */}
        <div className="lg:col-span-3 space-y-4">
          
          <div className={`p-5 rounded-2xl border ${
            darkMode ? 'bg-zinc-950/40 border-zinc-800' : 'bg-white border-slate-205 shadow-sm'
          }`}>
            
            {/* Header of Case */}
            {selectedCase === 1 && (
              <div className="space-y-4 animate-fade-in text-[11px]">
                <div className="flex items-center gap-2 pb-2.5 border-b dark:border-zinc-850">
                  <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase">TRƯỜNG HỢP 1</span>
                  <h4 className="font-black text-sm uppercase text-slate-900 dark:text-zinc-150">HÀNG HÓA, DỊCH VỤ KHÔNG CHỊU THUẾ GTGT</h4>
                </div>

                {/* Grid info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="font-bold text-slate-800 dark:text-zinc-200 text-xs">🎯 Đối Tượng Áp Dụng:</p>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-zinc-300">
                      <li>Sản phẩm trồng trọt, chăn nuôi, thủy hải sản chưa chế biến (hoặc mới chỉ qua sơ chế thông thường) ở khâu tự nhân giống, khai thác bán ra.</li>
                      <li>Dịch vụ y tế khám chữa bệnh, phòng bệnh cho người và vật nuôi.</li>
                      <li>Dịch vụ giáo dục, học tập, dạy nghề chính quy.</li>
                      <li>Phần mềm máy tính (sản phẩm &amp; dịch vụ thiết kế theo Thông tư quản lý).</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <p className="font-bold text-slate-800 dark:text-zinc-200 text-xs">📝 Khi Bán Ra (Hóa Đơn):</p>
                    <p className="text-slate-600 dark:text-zinc-300">
                      • Không tính thuế GTGT đầu ra bán lẻ. 
                      <span className="block mt-1 font-mono text-[10px] bg-slate-50 dark:bg-zinc-900 p-1 rounded">Trên hóa đơn GTGT: Dòng thuế suất và tiền thuế gạch chéo hoặc ghi rõ "Không chịu thuế".</span>
                    </p>
                  </div>
                </div>

                {/* Treatment of Input VAT & Accounting Entry */}
                <div className="p-3.5 rounded-xl border border-rose-500/15 bg-rose-500/5 mt-3">
                  <div className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-black text-rose-600 dark:text-rose-450 uppercase text-[11px]">Xử Lý Thuế GTGT Đầu Vào và Hạch Toán:</p>
                      <p className="text-slate-700 dark:text-zinc-300 font-semibold mt-1">
                        Thuế GTGT đầu vào mua phục vụ cho sản xuất kinh doanh hàng không chịu thuế <strong className="text-rose-600">KHÔNG ĐƯỢC KHẤU TRỪ</strong>. Phải tính toàn bộ khoản thuế này cộng trực tiếp vào chi phí hoạt động hoặc nguyên giá tài sản mua sắm!
                      </p>

                      {/* Code block accounting ledger entry */}
                      <div className="mt-2.5 p-3 bg-zinc-950 text-emerald-400 rounded-lg font-mono text-[10px] space-y-1">
                        <p className="text-slate-405 italic">// Ví dụ mua vật gia công 100tr, VAT đầu vào 10% (10tr). Hạch toán không được khấu trừ:</p>
                        <p><span className="text-pink-500">Nợ TK 156 / TK 642</span> (Hàng hóa / Chi phí): <span className="text-white">110.000.000 đ</span> <span className="text-slate-500">// Cộng gộp 10tr VAT</span></p>
                        <p><span className="text-pink-500">Có TK 111 / TK 331</span> (Tiền mặt / Phải trả): <span className="text-white">110.000.000 đ</span></p>
                        <p className="text-red-405 font-semibold">// Không hạch toán thuế GTGT đầu vào vào tài khoản kế toán TK 1331!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedCase === 2 && (
              <div className="space-y-4 animate-fade-in text-[11px]">
                <div className="flex items-center gap-2 pb-2.5 border-b dark:border-zinc-850">
                  <span className="bg-sky-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase">TRƯỜNG HỢP 2</span>
                  <h4 className="font-black text-sm uppercase text-slate-900 dark:text-zinc-150">HÀNG HÓA, DỊCH VỤ ÁP DỤNG THUẾ SUẤT 0%</h4>
                </div>

                {/* Grid info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="font-bold text-slate-800 dark:text-zinc-200 text-xs">🎯 Đối Tượng Áp Dụng:</p>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-zinc-300">
                      <li>Hàng hóa, dịch vụ xuất khẩu ra thị trường nước ngoài.</li>
                      <li>Hoạt động xây dựng, lắp đặt công trình ở nước ngoài hoặc nằm trong khu phi thuế quan.</li>
                      <li>Vận tải quốc tế (vận chuyển hàng hóa hành khách chặng bay đường biển nước ngoài).</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <p className="font-bold text-slate-800 dark:text-zinc-200 text-xs">📝 Khi Bán Ra (Hóa Đơn):</p>
                    <p className="text-slate-600 dark:text-zinc-300">
                      • Vẫn bắt buộc lập hóa đơn thương mại hoặc hóa đơn GTGT bình thường.
                      <span className="block mt-1 font-mono text-[10px] bg-slate-50 dark:bg-zinc-900 p-1 rounded">Trên hóa đơn: Ghi nhận mức thuế suất là "0%". Số tiền thuế GTGT phát sinh bằng 0.</span>
                    </p>
                  </div>
                </div>

                {/* Treatment of Input VAT & Accounting Entry */}
                <div className="p-3.5 rounded-xl border border-sky-500/15 bg-sky-500/5 mt-3">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-black text-sky-655 dark:text-sky-400 uppercase text-[11px]">Xử Lý Thuế GTGT Đầu Vào và Cơ Chế Hoàn thuế:</p>
                      <p className="text-slate-700 dark:text-zinc-300 font-semibold mt-1">
                        Doanh nghiệp chịu thuế 0% <strong className="text-sky-550">ĐƯỢC KHẤU TRỪ TOÀN BỘ</strong> thuế GTGT đầu vào và được xét duyệt làm thủ tục <strong className="text-sky-550">HOÀN THUẾ GTGT</strong> từ ngân sách nhà nước nếu đảm bảo thỏa mãn bộ hồ sơ chứng từ thanh toán ngân hàng quốc tế!
                      </p>

                      {/* Code block accounting ledger entry */}
                      <div className="mt-2.5 p-3 bg-zinc-950 text-emerald-400 rounded-lg font-mono text-[10px] space-y-1">
                        <p className="text-slate-405 italic">// Ví dụ xuất khẩu lô may mặc 5 tỷ đồng:</p>
                        <p><span className="text-pink-500">Nợ TK 131</span> (Phải thu khách hàng quốc tế): <span className="text-white">5.000.000.000 đ</span></p>
                        <p><span className="text-pink-500">Có TK 511</span> (Doanh thu bán hàng): <span className="text-white">5.000.000.000 đ</span></p>
                        <p><span className="text-pink-500">Có TK 3331</span> (Thuế GTGT đầu ra thuế suất 0%): <span className="text-white">0 đ</span></p>
                        <p className="text-emerald-405 font-semibold">// Toàn bộ thuế GTGT đầu vào liên quan được kê khai khấu trừ tại TK 1331 để nhận hoàn thuế.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedCase === 3 && (
              <div className="space-y-4 animate-fade-in text-[11px]">
                <div className="flex items-center gap-2 pb-2.5 border-b dark:border-zinc-850">
                  <span className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase">TRƯỜNG HỢP 3</span>
                  <h4 className="font-black text-sm uppercase text-slate-900 dark:text-zinc-150">KHÔNG PHẢI KÊ KHAI, TÍNH NỘP THUẾ GTGT</h4>
                </div>

                {/* Grid info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="font-bold text-slate-800 dark:text-zinc-200 text-xs">🎯 Đối Tượng Áp Dụng:</p>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-zinc-300">
                      <li>Hoạt động chuyển nhượng dự án đầu tư để sản xuất kinh doanh.</li>
                      <li>Thu tiền bồi thường, tiền thưởng, tiền hỗ trợ tài chính giữa các doanh nghiệp.</li>
                      <li><strong>Nông sản, thủy sản</strong> chưa chế biến khi doanh nghiệp hạch toán bán cho chính khác công ty thương mại, hợp tác xã (ở khâu trung gian chuyển thương).</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <p className="font-bold text-slate-800 dark:text-zinc-200 text-xs">📝 Khi Bán Ra (Hóa Đơn):</p>
                    <p className="text-slate-600 dark:text-zinc-300">
                      • Bán ra không phải tính thuế đầu ra.
                      <span className="block mt-1 font-mono text-[10px] bg-slate-50 dark:bg-zinc-900 p-1 rounded">Trên hóa đơn: Ghi giá bán thực tế. Phần dòng thuế suất và tiền thuế gạch chéo chéo hoàn toàn không ghi.</span>
                    </p>
                  </div>
                </div>

                {/* Treatment of Input VAT & Accounting Entry */}
                <div className="p-3.5 rounded-xl border border-emerald-500/15 bg-emerald-500/5 mt-3">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-black text-emerald-655 dark:text-emerald-400 uppercase text-[11px]">Xử Lý Thuế GTGT Đầu Vào Đặc Cách:</p>
                      <p className="text-slate-700 dark:text-zinc-300 font-semibold mt-1">
                        Mặc dù đầu ra không phải kê khai tính nộp thuế, nhưng doanh nghiệp ở khâu này vẫn cực kỳ quyền lợi khi <strong className="text-emerald-600">ĐƯỢC KHẤU TRỪ TOÀN BỘ</strong> thuế GTGT đầu vào liên kết hoạt động. Đây là điểm vượt trội pháp chế tuyệt đối so với nhóm Không Chịu Thuế (Trường hợp 1)!
                      </p>

                      {/* Code block accounting ledger entry */}
                      <div className="mt-2.5 p-3 bg-zinc-950 text-emerald-400 rounded-lg font-mono text-[10px] space-y-1">
                        <p className="text-slate-405 italic">// Mua nông sản từ HTX 100tr (đã được khấu trừ đầu vào các chi phí kho lạnh vận chuyển 5tr). Bán lại:</p>
                        <p><span className="text-pink-500">Nợ TK 1331</span> (Thuế GTGT khấu trừ đầu vào): <span className="text-white">5.000.000 đ</span> <span className="text-slate-500">// Giữ nguyên quyền khấu trừ</span></p>
                        <p><span className="text-pink-500">Nợ TK 156</span> (Mua nông sản gốc): <span className="text-white">100.000.000 đ</span></p>
                        <p><span className="text-pink-500 font-bold">// Khi bán ra cho DN thương mại khác:</span></p>
                        <p><span className="text-pink-500">Có TK 511</span> (Doanh thu thương mại): <span className="text-white">120.000.000 đ</span></p>
                        <p><span className="text-red-405 font-bold">Không phát sinh thuế đầu ra phải đóng!</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Quick core matrix comparison */}
          <div className={`p-4 rounded-xl border ${
            darkMode ? 'bg-zinc-950/20 border-zinc-800' : 'bg-slate-50 border-slate-205 shadow-3xs'
          }`}>
            <h4 className="font-black text-[11.5px] uppercase tracking-wider mb-2.5">
              Bảng Đối Chiếu Ma Trận Pháp Lý GTGT Rút Gọn
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[10.5px] border-collapse">
                <thead>
                  <tr className="border-b dark:border-zinc-800 text-zinc-400 font-mono text-[10px]">
                    <th className="pb-2 font-bold uppercase">Tiêu chí so sánh</th>
                    <th className="pb-2 text-rose-500 font-bold uppercase">1. Không chịu thuế</th>
                    <th className="pb-2 text-sky-500 font-bold uppercase">2. Thuế suất 0%</th>
                    <th className="pb-2 text-emerald-500 font-bold uppercase">3. Không kê khai nộp thuế</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-zinc-850 font-medium">
                  <tr>
                    <td className="py-2 text-slate-850 dark:text-zinc-200 font-bold">Kê khai thuế đầu ra?</td>
                    <td className="py-2 text-rose-600">Không nộp, không ghi</td>
                    <td className="py-2 text-sky-600">Có kê khai (0%)</td>
                    <td className="py-2 text-emerald-600">Không phải nộp</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-850 dark:text-zinc-200 font-bold">Khấu trừ đầu vào?</td>
                    <td className="py-2 text-slate-450 dark:text-zinc-500">❌ KHÔNG được khấu trừ</td>
                    <td className="py-2 text-emerald-600 font-extrabold">✅ ĐƯỢC khấu trừ</td>
                    <td className="py-2 text-emerald-600 font-extrabold">✅ ĐƯỢC khấu trừ toàn bộ</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-850 dark:text-zinc-200 font-bold">Trình bày trên hóa đơn?</td>
                    <td className="py-2 text-slate-500">Dòng thuế gạch chéo</td>
                    <td className="py-2 text-slate-800 dark:text-zinc-300">Ghi rõ số 0%</td>
                    <td className="py-2 text-slate-500">Gạch chéo / trống</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-850 dark:text-zinc-200 font-bold">Cơ hội hoàn thuế?</td>
                    <td className="py-2 text-slate-450 dark:text-zinc-500">❌ KHÔNG</td>
                    <td className="py-2 text-emerald-600 font-bold">✅ CÓ (Nếu đủ hồ sơ)</td>
                    <td className="py-2 text-slate-450 dark:text-zinc-500">❌ KHÔNG</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

      {/* Interactive Business Scenarios Quiz Widget */}
      <div className={`p-5 rounded-2xl border ${
        darkMode ? 'bg-zinc-950/30 border-stone-850' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b dark:border-zinc-850 pb-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-500" />
            <h4 className="font-black text-xs uppercase tracking-tight text-slate-800 dark:text-zinc-150">
              Trắc Nghiệm Nghiệp Vụ - Chọn Đúng Hành Vi Thuế
            </h4>
          </div>
          <span className="text-[10px] font-black uppercase bg-indigo-500 text-white px-2 py-0.5 rounded-full">
            Nâng tầm kế toán trưởng
          </span>
        </div>

        {!quizCompleted ? (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500">
              <span>CÂU HỎI {activeQuizIndex + 1} / {quizQuestions.length}</span>
              <span>ĐIỂM: {quizScore} / {quizQuestions.length}</span>
            </div>

            <div className={`p-4 rounded-xl border text-[11px] font-semibold leading-relaxed ${
              darkMode ? 'bg-zinc-900 border-zinc-810 text-zinc-150' : 'bg-white border-slate-205 text-slate-800 shadow-3xs'
            }`}>
              {quizQuestions[activeQuizIndex].scenario}
            </div>

            {/* Answer select */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {quizQuestions[activeQuizIndex].options.map((opt) => {
                const isSelected = selectedAnswer === opt.value;
                const isCorrect = opt.value === quizQuestions[activeQuizIndex].correctValue;
                
                let btnStyle = darkMode 
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700' 
                  : 'bg-white border-slate-250 text-slate-705 hover:bg-slate-50';

                if (selectedAnswer !== null) {
                  if (isSelected) {
                    btnStyle = isCorrect 
                      ? 'bg-emerald-500 text-white border-emerald-600' 
                      : 'bg-rose-500 text-white border-rose-600';
                  } else if (isCorrect) {
                    btnStyle = 'bg-emerald-500/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-extrabold';
                  } else {
                    btnStyle = 'opacity-50 border-transparent bg-transparent';
                  }
                }

                return (
                  <button
                    key={opt.value}
                    disabled={selectedAnswer !== null}
                    onClick={() => handleSelectAnswer(activeQuizIndex, opt.value)}
                    className={`p-3 rounded-lg border text-left font-bold text-[10.5px] transition duration-150 cursor-pointer ${btnStyle}`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Result disclosure */}
            {selectedAnswer !== null && (
              <div className={`p-3.5 rounded-xl border animate-slide-up text-[11px] leading-relaxed ${
                selectedAnswer === quizQuestions[activeQuizIndex].correctValue
                  ? darkMode ? 'bg-emerald-950/15 border-emerald-900/30 text-emerald-100' : 'bg-emerald-50 border-emerald-200'
                  : darkMode ? 'bg-rose-950/15 border-rose-900/30 text-rose-100' : 'bg-rose-50 border-rose-200'
              }`}>
                <p className="font-extrabold flex items-center gap-1.5 mb-1.5">
                  {selectedAnswer === quizQuestions[activeQuizIndex].correctValue ? (
                    <span className="text-emerald-500">✔ XÁC THỰC CHÍNH XÁC!</span>
                  ) : (
                    <span className="text-rose-500">❌ CHƯA CHÍNH XÁC!</span>
                  )}
                </p>
                <p className="font-medium text-[10.5px] mb-2">
                  {quizQuestions[activeQuizIndex].explanation}
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="px-3.5 py-1.5 bg-indigo-505 text-white font-extrabold rounded-md hover:bg-indigo-600 transition tracking-wider text-[10px] uppercase cursor-pointer"
                >
                  {activeQuizIndex === quizQuestions.length - 1 ? 'Xem kết quả chung cuộc' : 'Chuyển sang tình huống tiếp theo'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 space-y-4 animate-fade-in text-[11px]">
            <div className="text-3xl">🏆</div>
            <h5 className="font-black text-sm uppercase text-slate-800 dark:text-zinc-100">
              Hoàn Thành Chứng Chỉ Trắc Nghiệm Kế Toán Thuế GTGT!
            </h5>
            <p className="max-w-md mx-auto text-slate-500 dark:text-zinc-400 font-medium leading-relaxed">
              Bạn đã xử lý đúng <span className="font-black text-indigo-500 text-lg">{quizScore} / {quizQuestions.length}</span> tình huống pháp chế thực tế doanh nghiệp. Hãy duy trì tinh thần kế toán tự động và vững vàng pháp luật!
            </p>
            <button
              onClick={handleResetQuiz}
              className="px-4 py-2 bg-indigo-505 dark:bg-indigo-505 text-white font-extrabold text-[10.5px] uppercase rounded-md hover:bg-indigo-600 transition cursor-pointer"
            >
              Làm lại bài trắc nghiệm
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
