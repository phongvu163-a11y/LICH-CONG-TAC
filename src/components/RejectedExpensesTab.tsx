import React, { useState } from 'react';
import { AlertOctagon, CheckCircle2, ChevronRight, HelpCircle, Info, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

interface RejectedExpensesTabProps {
  darkMode: boolean;
}

export default function RejectedExpensesTab({ darkMode }: RejectedExpensesTabProps) {
  // 10 categories
  const expenseCategories = [
    {
      id: 1,
      title: '1. Chi phí không đáp ứng điều kiện cơ bản',
      reasons: [
        'Không liên quan đến hoạt động sản xuất, thương mại, điều hành kinh doanh thực tế.',
        'Thiếu hóa đơn hợp lệ hoặc chứng từ thanh toán hợp pháp đi kèm.',
        'Thiếu chứng từ thanh toán không dùng tiền mặt (chuyển khoản bank) đối với hóa đơn từ 20 triệu đồng trở lên.'
      ]
    },
    {
      id: 2,
      title: '2. Các khoản tiền phạt vi phạm hành chính',
      reasons: [
        'Phạt vi phạm hành chính về thuế, hải quan, kế toán, lao động.',
        'Phạt vi phạm luật giao thông đường bộ, đường thủy của nhân lực.',
        'Tiền phạt chậm nộp thuế hạch toán sai vào chi phí được phép giảm trừ.'
      ]
    },
    {
      id: 3,
      title: '3. Thiệt hại đã được bồi thường, hỗ trợ từ nguồn khác',
      reasons: [
        'Hàng hóa, vật tư, tài sản bị tổn thất thiên tai, tai nạn... đã được bảo hiểm chi trả bồi thường.',
        'Chi phí khắc phục đã được đối tác chịu trách nhiệm hoàn trả sòng phẳng.',
        'Hoạt động chi tiêu đã được hỗ trợ từ nguồn quỹ phúc lợi của cộng đồng/tổ chức phi lợi nhuận.'
      ]
    },
    {
      id: 4,
      title: '4. Tiền lương, thưởng & phụ cấp thiếu hồ sơ pháp lý',
      reasons: [
        'Có thanh toán tiền lương trên thực tế nhưng không đóng bảo hiểm, thiếu Hợp đồng lao động hợp pháp.',
        'Nhận thưởng nhưng thiếu Quy chế tài chính hoặc Quyết định phê duyệt của Ban Giám đốc.',
        'Dữ liệu bảng chấm công và bảng phát lương không trùng khớp với số liệu ghi nhận trên tờ khai thuế TNCN & BHXH.'
      ]
    },
    {
      id: 5,
      title: '5. Phúc lợi nhân sự vượt hạn mức quy chế',
      reasons: [
        'Các khoản chi: Quà tặng tết, nghỉ mát hè, hiếu hỷ cá nhân, trích nộp đóng bảo hiểm nhân thọ cho quản lý...',
        'Chi vượt tổng mức khống chế trần: 01 tháng lương bình quân thực tế thực hiện hằng năm của doanh nghiệp.',
        'Chi tiêu phúc lợi nhưng không làm sẵn Quy chế chi tiêu nội bộ / quyết định ban nội chính.'
      ]
    },
    {
      id: 6,
      title: '6. Chi phí lãi vay sai bản chất hoặc vượt khống chế',
      reasons: [
        'Vốn điều lệ của chủ sở hữu / cổ đông sáng lập chưa được góp đủ theo thời hạn cam kết đăng ký thuế.',
        'Khoản vay không ghi chép chứng minh phục vụ đúng mục tiêu sản xuất dịch vụ dòng kinh doanh nội bộ.',
        'Lãi suất vay cá nhân vượt quá 150% lãi suất cơ bản của Ngân hàng Nhà nước hoặc lãi vay vượt 30% EBITDA đối với DN có giao dịch liên kết.'
      ]
    },
    {
      id: 7,
      title: '7. Khấu hao tài sản cố định (TSCĐ) sai quy trình kỹ thuật',
      reasons: [
        'Trích khấu hao đối với tài sản chưa có đầy đủ hồ sơ sở hữu, biên bản nghiệm thu đưa vào vận hành.',
        'Tài sản không trực tiếp đóng góp tạo lập doanh thu sản xuất của hộ/doanh nghiệp.',
        'Vượt mức khống chế đặc khu: Ô tô dưới 9 chỗ ngồi phục vụ quản lý có nguyên giá vượt ngưỡng 1,6 tỷ đồng.'
      ]
    },
    {
      id: 8,
      title: '8. Hạch toán trùng hoặc sai sắc thuế đóng nộp',
      reasons: [
        'Tính thuế TNDN phải nộp vào chi phí trừ thuế.',
        'Hạch toán thuế GTGT đầu vào đã được ngân sách khấu trừ hoàn thuế hoàn tất.',
        'Mọi loại tiền thuế, tiền phí mang tính chất tiêu dùng cá nhân của thành viên sáng lập hộ kinh doanh.'
      ]
    },
    {
      id: 9,
      title: '9. Thiếu hồ sơ chứng minh tính hiệu quả cốt lõi của giao dịch',
      reasons: [
        'Gói chi tiêu quảng cáo, tư vấn rủi ro pháp lý nhưng hoàn toàn không có báo cáo nghiệm thu sản phẩm bàn giao kèm theo.',
        'Thuê lao động thời vụ ngoài nhưng thiếu biên bản thanh lý hợp đồng và bảng kê kê khai 01/QLT.',
        'Các dịch vụ trung gian phân phối không làm rõ được hợp đồng liên can đến hoạt động bán hàng.'
      ]
    },
    {
      id: 10,
      title: '10. Các khoản chi tài trợ, xã hội không đúng đối tượng',
      reasons: [
        'Chi tài trợ cho tổ chức, cá nhân nhưng không thuộc diện hỗ trợ giáo dục, y tế, khắc phục thiên tai quy định.',
        'Thiếu hồ sơ xác nhận ký đóng dấu của đơn vị tiếp nhận tài trợ chính sách.',
        'Ghi nhận chi phí cho các dự án quy hoạch đầu tư hình thành tài sản cố định ngay trong kỳ chi tiêu.'
      ]
    }
  ];

  // CEO 7 questions state
  const questions = [
    { id: 1, text: 'Doanh nghiệp có bất kỳ khoản chi lớn nào (>20 triệu VAT) thanh toán bằng tiền mặt thay vì chuyển khoản không?' },
    { id: 2, text: 'Có các khoản vi phạm hành chính, phạt chậm nộp thuế nào đang được kế toán hạch toán trực tiếp vào chi phí nộp thuế không?' },
    { id: 3, text: 'Hệ thống hồ sơ lương thưởng, phụ cấp, hợp đồng, bảng công định kỳ hạch toán có khớp với tờ khai thuế TNCN và BHXH chưa?' },
    { id: 4, text: 'Các gói chi phí tư vấn, marketing thuê ngoài của đơn vị đã có đầy đủ Biên bản bàn giao, báo nghiệm thu thực tế chưa?' },
    { id: 5, text: 'Các khoản vay vốn cá nhân hoặc vay ngân hàng của bạn đã có đầy đủ hồ sơ chứng minh giải ngân cho hoạt động kinh doanh chưa?' },
    { id: 6, text: 'Tài sản cố định lớn hay ô tô công vụ của công ty đã có đầy đủ giấy đăng ký sở hữu mang tên pháp nhân chưa?' },
    { id: 7, text: 'Còn hoạt động chi tiêu nào thuộc diện "chỉ giải thích bằng lời, không thể xuất trình biên bản hay giấy tờ chứng minh" không?' }
  ];

  const [answers, setAnswers] = useState<Record<number, 'yes' | 'no' | 'unsure'>>({});
  const [showScore, setShowScore] = useState(false);

  const handleSelectAnswer = (qId: number, option: 'yes' | 'no' | 'unsure') => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
    setShowScore(false);
  };

  const getReviewReport = () => {
    let warningCount = 0;
    // Questions where "Yes" is BAD: 1, 2, 7 (representing lack of compliance or cash payment > 20M)
    // Questions where "No" is BAD: 3, 4, 5, 6 (representing missing records)
    if (answers[1] === 'yes') warningCount++;
    if (answers[2] === 'yes') warningCount++;
    if (answers[3] === 'no') warningCount++;
    if (answers[4] === 'no') warningCount++;
    if (answers[5] === 'no') warningCount++;
    if (answers[6] === 'no') warningCount++;
    if (answers[7] === 'yes') warningCount++;

    // Add unsure cases as warning triggers too
    Object.values(answers).forEach((ans) => {
      if (ans === 'unsure') warningCount += 0.5;
    });

    if (warningCount === 0) {
      return {
        level: 'AN TOÀN',
        desc: 'Hồ sơ chi phí của doanh nghiệp bạn hoạt động hết sức chuẩn chỉ, sạch sẽ. Rủi ro bị loại trừ khi quyết toán thuế ở mức cực thấp!',
        color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
      };
    } else if (warningCount <= 2.5) {
      return {
        level: 'RỦI RO TRUNG BÌNH',
        desc: `Cần lưu ý: Phát hiện khoảng ${warningCount} dấu hiệu thiếu sót hồ sơ hoặc vi phạm thanh toán. Hãy chủ động rà soát ngay các khoản hạch toán để chuẩn bị phương án bổ sung kịp thời.`,
        color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
      };
    } else {
      return {
        level: 'RỦI RO CAO 🚨',
        desc: `Cảnh báo đặc biệt: Phát hiện trên ${warningCount} lỗ hổng có nguy cơ bị loại trừ chi phí rất cao khi Cơ quan Thuế vào kiểm tra thực tế. Doanh nghiệp cần tiến hành kiểm toán nội bộ lập trình điều chỉnh chứng từ khẩn cấp để tránh phạt chậm nộp và truy thu!`,
        color: 'text-red-500 bg-red-500/10 border-red-500/20'
      };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Header element */}
      <div className={`p-4 rounded-xl border flex items-center gap-3 ${
        darkMode ? 'bg-zinc-950/40 border-sky-950/50' : 'bg-red-50/20 border-red-100'
      }`}>
        <div className="p-3 bg-red-600 text-white rounded-xl shrink-0">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-black text-sm uppercase tracking-tight text-red-650">
            10 Nhóm Chi Phí Doanh Nghiệp Dễ Bị Loại Khi Thanh Tra Thuế
          </h3>
          <p className="text-[11px] font-medium mt-0.5 text-slate-500 dark:text-zinc-400">
            Nguyên tắc cốt lõi: Không phải cứ có hóa đơn là được trừ. Cần rà soát kỹ quy chuẩn hồ sơ, quy chế nội bộ và giao dịch thực tế.
          </p>
        </div>
      </div>

      {/* Grid of 10 items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {expenseCategories.map((cat) => (
          <div 
            key={cat.id} 
            className={`p-4 rounded-xl border transition-all ${
              darkMode ? 'bg-[#0f172a] border-zinc-850 hover:border-zinc-700' : 'bg-white border-slate-205 shadow-2xs hover:border-slate-350'
            }`}
          >
            <h4 className="font-extrabold text-xs uppercase tracking-tight text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-zinc-800">
              {cat.title}
            </h4>
            <ul className="mt-3 space-y-2 text-[11px] leading-relaxed">
              {cat.reasons.map((reason, idx) => (
                <li key={idx} className="flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <p className={darkMode ? 'text-zinc-300' : 'text-slate-750'}>{reason}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* CEO 7 questions checklist interactive widget */}
      <div className={`p-5 rounded-xl border text-left ${
        darkMode ? 'bg-zinc-950/30 border-stone-850' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h4 className="font-black text-xs uppercase tracking-tight text-slate-800 dark:text-zinc-100">
            CEO Tự Kiểm Tra Khẩn Cấp - Hệ Thống Đánh Giá Rủi Ro Thuế
          </h4>
        </div>
        <p className="text-[11px] text-slate-505 dark:text-zinc-400 font-medium mb-4">
          Trả lời nhanh 7 câu hỏi rà soát dựa trên kinh nghiệm thanh tra thực tế của cơ quan tài chính thành phố để kiểm nghiệm sức khỏe doanh nghiệp bạn:
        </p>

        {/* List of questions */}
        <div className="space-y-3.5">
          {questions.map((q) => (
            <div 
              key={q.id}
              className={`p-3 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                darkMode ? 'bg-zinc-900/60 border-zinc-800/60' : 'bg-white border-slate-200 shadow-3xs'
              }`}
            >
              <div className="flex gap-2.5 items-start">
                <span className="w-5 h-5 rounded-full bg-red-100 text-red-650 font-black text-[10px] flex items-center justify-center shrink-0 font-mono mt-0.5">
                  {q.id}
                </span>
                <p className={`text-[11.5px] font-semibold leading-relaxed ${darkMode ? 'text-zinc-250' : 'text-slate-800'}`}>
                  {q.text}
                </p>
              </div>

              {/* Answer options button group */}
              <div className="flex gap-1.5 shrink-0">
                {[
                  { value: 'yes', label: 'Có', color: 'bg-red-500 text-white' },
                  { value: 'no', label: 'Không', color: 'bg-emerald-500 text-white' },
                  { value: 'unsure', label: 'Chưa rõ', color: 'bg-amber-500 text-black' }
                ].map((opt) => {
                  const isActive = answers[q.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectAnswer(q.id, opt.value as any)}
                      className={`text-[10px] uppercase font-black px-3.5 py-1.5 rounded-md transition ease-out cursor-pointer border ${
                        isActive
                          ? opt.color + ' border-transparent scale-102 font-black shadow-xs'
                          : darkMode 
                            ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800' 
                            : 'bg-slate-50 border-slate-200 text-slate-505 hover:bg-slate-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Generate Report Button */}
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() => setShowScore(true)}
            disabled={Object.keys(answers).length < 4}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tight inline-flex items-center gap-1.5 transition duration-150 cursor-pointer ${
              Object.keys(answers).length < 4
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-650'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-xs'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Xuất báo cáo chẩn đoán ({Object.keys(answers).length}/7)</span>
          </button>
        </div>

        {/* Report Result Container */}
        {showScore && Object.keys(answers).length >= 4 && (
          <div className={`mt-5 p-4 rounded-xl border leading-relaxed animate-fade-in ${getReviewReport().color}`}>
            <div className="flex items-start gap-3">
              <RefreshCw className="w-5 h-5 shrink-0 mt-0.5 animate-spin" style={{ animationDuration: '6s' }} />
              <div>
                <h5 className="font-black text-xs uppercase tracking-tight">
                  Kết quả đánh giá: <span className="underline">{getReviewReport().level}</span>
                </h5>
                <p className="text-[11.5px] font-bold mt-1.5 leading-normal">
                  {getReviewReport().desc}
                </p>
                <p className="text-[10.5px] opacity-80 mt-2 font-mono">
                  * Khuyến nghị: Doanh nghiệp nên chuẩn bị đầy đủ hợp đồng, phiếu thanh toán không dùng tiền mặt, quy chế nhân sự, và biên bản quyết toán phục vụ giải trình thuế.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
