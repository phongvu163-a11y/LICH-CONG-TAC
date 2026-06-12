import React, { useState } from 'react';
import { 
  FileText, 
  HelpCircle, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  ArrowRight, 
  List, 
  ChevronRight, 
  Layers, 
  MessageSquare, 
  Search,
  BookOpen,
  DollarSign
} from 'lucide-react';

interface InvoiceAdjustmentTabProps {
  darkMode: boolean;
}

export default function InvoiceAdjustmentTab({ darkMode }: InvoiceAdjustmentTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'flow' | 'cases'>('flow');
  const [selectedCase, setSelectedCase] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // 14 cases data from infographics
  const adjustmentCases = [
    {
      id: 1,
      title: "Trường hợp 1: Giá trị không đổi - Đơn vị tính thay đổi",
      valueChange: "Không thay đổi",
      elementsChanged: "Đơn vị tính (ĐVT) hàng hóa dịch vụ",
      vesselDesc: "Khớp đúng thông tin cũ nhưng viết bổ sung dòng điều chỉnh ĐVT.",
      stt: "01",
      itemName: "Điều chỉnh đơn vị tính của mặt hàng [Tên hàng hóa] từ \"cái\" thành \"hộp\"",
      unit: "Hộp",
      quantity: "",
      price: "",
      totalPrice: 0,
      vatPercent: "10%",
      vatAmount: 0,
      totalAmount: 0,
      wordsAmount: "Không đồng.",
      guideText: "Điều chỉnh cho hóa đơn Mẫu số 1, ký hiệu [KH], số HĐ [Số], ngày... tháng... năm...: Điều chỉnh đơn vị tính của hàng hóa.",
      note: "Hữu ích khi nhập sai quy cách hoặc chuyển đổi lô quy đổi bao bì đóng gói thực tế."
    },
    {
      id: 2,
      title: "Trường hợp 2: Giá trị không đổi - Tên hàng hóa thay đổi",
      valueChange: "Không thay đổi",
      elementsChanged: "Tên hàng hóa, dịch vụ",
      vesselDesc: "Chỉnh sửa tên danh mục bị gõ phím viết sai lỗi chính tả.",
      stt: "01",
      itemName: "Điều chỉnh tên hàng hóa từ mặt hàng \"A\" thành mặt hàng \"B\"",
      unit: "...",
      quantity: "",
      price: "",
      totalPrice: 0,
      vatPercent: "10%",
      vatAmount: 0,
      totalAmount: 0,
      wordsAmount: "Không đồng.",
      guideText: "Điều chỉnh cho hóa đơn Mẫu số 1, ký hiệu [KH], số HĐ [Số], ngày... tháng... năm...: Điều chỉnh thông tin tên hàng hóa.",
      note: "Áp dụng khi xuất nhầm mã hàng nhưng đúng số lượng bán và đơn giá trị."
    },
    {
      id: 3,
      title: "Trường hợp 3: Giá trị không đổi - MST người mua thay đổi",
      valueChange: "Không thay đổi",
      elementsChanged: "Mã số thuế (MST) bên mua hàng",
      vesselDesc: "Sử dụng mẫu thông tin thay đổi MST bên mua.",
      stt: "01",
      itemName: "Điều chỉnh mã số thuế người mua hàng từ [MST_cũ] thành [MST_mới]",
      unit: "",
      quantity: "",
      price: "",
      totalPrice: 0,
      vatPercent: "10%",
      vatAmount: 0,
      totalAmount: 0,
      wordsAmount: "Không đồng.",
      guideText: "Điều chỉnh cho hóa đơn Mẫu số 1, ký hiệu [KH], số HĐ [Số], ngày... tháng... năm...: Điều chỉnh mã số thuế người mua hàng.",
      note: "Phải đính kèm biên bản xác nhận sai sót MST với khách hàng doanh nghiệp đối tác."
    },
    {
      id: 4,
      title: "Trường hợp 4: Giá trị tăng - Tăng số lượng hàng bán",
      valueChange: "Tăng (Dương)",
      elementsChanged: "Số lượng tăng (+), Thành tiền tăng, Thuế suất không đổi",
      vesselDesc: "Tăng số lượng [Tên hàng hóa] từ 100 lên 120 (Tăng 20 cái)",
      stt: "01",
      itemName: "Xuất điều chỉnh bổ sung số lượng [Tên hàng hóa]",
      unit: "Cái",
      quantity: 20,
      price: 20000,
      totalPrice: 400000,
      vatPercent: "10%",
      vatAmount: 40000,
      totalAmount: 440000,
      wordsAmount: "Điều chỉnh tăng bốn trăm bốn mươi ngàn đồng chẵn.",
      guideText: "Điều chỉnh cho hóa đơn Mẫu số 1, ký hiệu [KH], số HĐ [Số], ngày... tháng... năm...: Điều chỉnh tăng số lượng hàng hóa từ 100 lên 120.",
      note: "Tính tiền thuế = số lượng tăng x đơn giá x thuế suất (20 x 20.000 x 10% = 40.000 đ)."
    },
    {
      id: 5,
      title: "Trường hợp 5: Giá trị giảm - Giảm số lượng hàng bán",
      valueChange: "Giảm (Âm)",
      elementsChanged: "Số lượng giảm (-), Thành tiền giảm, Thuế suất không đổi",
      vesselDesc: "Giảm số lượng [Tên hàng hóa] từ 100 xuống 90 (Giảm 10 cái)",
      stt: "01",
      itemName: "Xuất điều chỉnh giảm số lượng mặt hàng [Tên hàng hóa]",
      unit: "Cái",
      quantity: -10,
      price: 20000,
      totalPrice: -200000,
      vatPercent: "10%",
      vatAmount: -20000,
      totalAmount: -220000,
      wordsAmount: "Điều chỉnh giảm hai trăm hai mươi ngàn đồng chẵn.",
      guideText: "Điều chỉnh cho hóa đơn Mẫu số 1, ký hiệu [KH], số HĐ [Số], ngày... tháng... năm...: Điều chỉnh giảm số lượng từ 100 xuống còn 90.",
      note: "Ghi số lượng âm, thành tiền âm, tiền thuế âm đúng quy chuẩn thuế số."
    },
    {
      id: 6,
      title: "Trường hợp 6: Giá trị tăng - Tăng đơn giá bán",
      valueChange: "Tăng (Dương)",
      elementsChanged: "Đơn giá tăng, Số lượng không đổi, Thuế suất không đổi",
      vesselDesc: "Tăng đơn giá [Tên hàng hóa] từ 20.000đ lên 25.000đ (Vẫn bán 10 cái)",
      stt: "01",
      itemName: "Điều chỉnh chênh lệch tăng đơn giá của mặt hàng [Tên hàng hóa]",
      unit: "Cái",
      quantity: 10,
      price: 5000,
      totalPrice: 50000,
      vatPercent: "10%",
      vatAmount: 5000,
      totalAmount: 55000,
      wordsAmount: "Điều chỉnh tăng năm mươi lăm ngàn đồng chẵn.",
      guideText: "Điều chỉnh cho hóa đơn Mẫu số 1, ký hiệu [KH], số HĐ [Số], ngày... tháng... năm...: Kê khai chênh lệch tăng đơn giá từ 20.000đ lên 25.000đ.",
      note: "Tính bằng chênh lệch giá tăng x số lượng thực tế trong kỳ."
    },
    {
      id: 7,
      title: "Trường hợp 7: Giá trị giảm - Giảm đơn giá bán",
      valueChange: "Giảm (Âm)",
      elementsChanged: "Đơn giá giảm, Số lượng không đổi, Thuế suất không đổi",
      vesselDesc: "Giảm đơn giá [Tên hàng hóa] từ 20.000đ xuống 15.000đ (Vẫn bán 10 cái)",
      stt: "01",
      itemName: "Điều chỉnh chênh lệch giảm đơn giá của mặt hàng [Tên hàng hóa]",
      unit: "Cái",
      quantity: 10,
      price: -5000,
      totalPrice: -50000,
      vatPercent: "10%",
      vatAmount: -5000,
      totalAmount: -55000,
      wordsAmount: "Điều chỉnh giảm năm mươi lăm ngàn đồng chẵn.",
      guideText: "Điều chỉnh cho hóa đơn Mẫu số 1, ký hiệu [KH], số HĐ [Số], ngày... tháng... năm...: Kê khai chênh lệch giảm đơn giá từ 20.000đ xuống còn 15.000đ.",
      note: "Thành tiền và VAT đều mang dấu trừ âm tương hỗ."
    },
    {
      id: 8,
      title: "Trường hợp 8: Giá trị giảm - Giảm thuế suất GTGT",
      valueChange: "Giảm (Âm)",
      elementsChanged: "Thuế suất GTGT giảm nộp, Doanh thu không đổi",
      vesselDesc: "Giảm thuế suất từ 10% xuống 8% (Giá trị hàng chưa thuế là 100.000 VNĐ)",
      stt: "01",
      itemName: "Điều chỉnh giảm chênh lệch thuế suất GTGT cho [Tên hàng hóa]",
      unit: "",
      quantity: "",
      price: "",
      totalPrice: "",
      vatPercent: "8% (Giảm)",
      vatAmount: -2000,
      totalAmount: -2000,
      wordsAmount: "Điều chỉnh giảm hai ngàn đồng chẵn.",
      guideText: "Điều chỉnh cho hóa đơn Mẫu số 1, ký hiệu [KH], số HĐ [Số], ngày... tháng... năm...: Giảm thuế suất GTGT từ 10% xuống còn 8%.",
      note: "Chỉ giảm thuế và tổng tiền thanh toán, doanh thu chưa thuế giữ nguyên."
    },
    {
      id: 9,
      title: "Trường hợp 9: Giá trị tăng - Tăng thuế suất GTGT",
      valueChange: "Tăng (Dương)",
      elementsChanged: "Thuế suất GTGT tăng nộp, Doanh thu không đổi",
      vesselDesc: "Tăng thuế suất từ 8% lên 10% (Giá trị hàng chưa thuế là 100.000 VNĐ)",
      stt: "01",
      itemName: "Điều chỉnh tăng chênh lệch thuế suất GTGT cho [Tên hàng hóa]",
      unit: "",
      quantity: "",
      price: "",
      totalPrice: "",
      vatPercent: "10% (Tăng)",
      vatAmount: 2000,
      totalAmount: 2000,
      wordsAmount: "Điều chỉnh tăng hai ngàn đồng chẵn.",
      guideText: "Điều chỉnh cho hóa đơn Mẫu số 1, ký hiệu [KH], số HĐ [Số], ngày... tháng... năm...: Tăng thuế suất GTGT từ 8% lên thành 10%.",
      note: "Yêu cầu thu thêm tiền thuế lệch từ người mua nộp ngân sách."
    },
    {
      id: 10,
      title: "Trường hợp 10: Giá trị giảm - Điều chỉnh giảm thành tiền dứt điểm",
      valueChange: "Giảm (Âm)",
      elementsChanged: "Thành tiền giảm trực tiếp, Số lượng/Đơn giá giữ nguyên",
      vesselDesc: "Điều chỉnh giảm thành tiền của [Tên hàng hóa] từ 100.000đ thành 90.000đ (Chiết khấu bổ sung)",
      stt: "01",
      itemName: "Điều chỉnh giảm thành tiền mặt hàng [Tên hàng hóa] từ 100.000đ xuống 90.000đ",
      unit: "",
      quantity: "",
      price: "",
      totalPrice: -10000,
      vatPercent: "10%",
      vatAmount: -1000,
      totalAmount: -11000,
      wordsAmount: "Điều chỉnh giảm mười một ngàn đồng chẵn.",
      guideText: "Điều chỉnh cho hóa đơn Mẫu số 1, ký hiệu [KH], số HĐ [Số], ngày... tháng... năm...: Điều chỉnh giảm thành tiền từ 100.000đ thành 90.000đ.",
      note: "Không ghi số hiệu lượng, chỉ can thiệp điều chỉnh giảm giá trị tiền thu."
    },
    {
      id: 11,
      title: "Trường hợp 11: Giá trị tăng - Điều chỉnh tăng thành tiền dứt điểm",
      valueChange: "Tăng (Dương)",
      elementsChanged: "Thành tiền tăng trực tiếp, Số lượng/Đơn giá giữ nguyên",
      vesselDesc: "Điều chỉnh tăng thành tiền của [Tên hàng hóa] từ 90.000đ thành 100.000đ (Phụ thu sau bán hàng)",
      stt: "01",
      itemName: "Điều chỉnh tăng thành tiền mặt hàng [Tên hàng hóa] từ 90.000đ lên 100.000đ",
      unit: "",
      quantity: "",
      price: "",
      totalPrice: 10000,
      vatPercent: "10%",
      vatAmount: 1000,
      totalAmount: 11000,
      wordsAmount: "Điều chỉnh tăng mười một ngàn đồng chẵn.",
      guideText: "Điều chỉnh cho hóa đơn Mẫu số 1, ký hiệu [KH], số HĐ [Số], ngày... tháng... năm...: Điều chỉnh tăng thành tiền từ 90.000đ thành 100.000đ.",
      note: "Thu thêm chênh lệch bổ sung phần thiếu hụt tài chính."
    },
    {
      id: 12,
      title: "Trường hợp 12: Giảm toàn bộ do bị trả lại toàn bộ lô hàng",
      valueChange: "Giảm (Âm tối đa)",
      elementsChanged: "Doanh thu giảm 100%, Thuế đầu ra giảm 100% (Bên bán xuất HĐ điều chỉnh)",
      vesselDesc: "Khách trả lại sạch toàn bộ hàng hóa. Hủy bỏ nghĩa vụ nợ tương ứng.",
      stt: "01",
      itemName: "Điều chỉnh giảm toàn bộ trị giá do khách trả lại mặt hàng [Tên hàng hóa 1]",
      unit: "Cái",
      quantity: -10,
      price: 20000,
      totalPrice: -200000,
      vatPercent: "10%",
      vatAmount: -20000,
      totalAmount: -220000,
      wordsAmount: "Điều chỉnh giảm hai trăm hai mươi ngàn đồng chẵn.",
      guideText: "Điều chỉnh giảm toàn bộ cho hóa đơn Mẫu số 1, ký hiệu [KH], số HĐ [Số] do khách trả lại toàn bộ sản phẩm.",
      note: "Khấu trừ triệt để doanh thu phát sinh và thuế phải nộp trong kỳ."
    },
    {
      id: 13,
      title: "Trường hợp 13: Giảm một phần do trả lại một phần lô hàng",
      valueChange: "Giảm (Âm)",
      elementsChanged: "Sản lượng trả lại một phần được hạch toán giảm tương xứng",
      vesselDesc: "Mặt hàng 1 trả lại 5 cái (Trị giá 100.000 VNĐ chưa thuế)",
      stt: "01",
      itemName: "Điều chỉnh giảm một phần hàng bán trả lại của mặt hàng [Tên hàng hóa 1]",
      unit: "Cái",
      quantity: -5,
      price: 20000,
      totalPrice: -100000,
      vatPercent: "10%",
      vatAmount: -10000,
      totalAmount: -110000,
      wordsAmount: "Điều chỉnh giảm một trăm mười ngàn đồng chẵn.",
      guideText: "Điều chỉnh giảm một phần do khách trả lại hàng cho hóa đơn Mẫu số 1, ký hiệu [KH], số HĐ [Số].",
      note: "Doanh nghiệp có biên bản kiểm lỗi ghi rõ số lượng thực nhận hoàn kho."
    },
    {
      id: 14,
      title: "Trường hợp 14: Người mua là doanh nghiệp tự lập hóa đơn trả lại",
      valueChange: "Không lập điều chỉnh",
      elementsChanged: "Người mua lập hóa đơn thay vì người bán",
      vesselDesc: "Hai bên có thỏa thuận bên mua là doanh nghiệp tự xuất hóa đơn trả lại hàng.",
      stt: "01",
      itemName: "Bàn giao trả lại sản phẩm do không đúng thông số kỹ thuật",
      unit: "Cái",
      quantity: 10,
      price: 20000,
      totalPrice: 200000,
      vatPercent: "10%",
      vatAmount: 20000,
      totalAmount: 220000,
      wordsAmount: "Hai trăm hai mươi ngàn đồng chẵn.",
      guideText: "Hóa đơn trả lại hàng cho hóa đơn Mẫu số 1, ký hiệu [KH], số HĐ [Số] bên bán đã giao.",
      note: "Bên mua xuất hóa đơn dương bình thường, bên bán coi đây là hóa đơn đầu vào giảm trừ doanh số thu."
    }
  ];

  const filteredCases = adjustmentCases.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.elementsChanged.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCaseData = adjustmentCases.find(c => c.id === selectedCase) || adjustmentCases[0];

  return (
    <div className="space-y-5 animate-fade-in text-left">
      
      {/* Banner Tiêu đề Chuyên đề */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        darkMode ? 'bg-zinc-950/40 border-sky-950/50' : 'bg-red-50/20 border-red-10s'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-600 text-white rounded-xl shadow-md shrink-0">
            <FileText className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase tracking-tight text-red-650">
              Chuyên đề: Lập Hóa Đơn Điều Chỉnh &amp; Thay Thế (Nghị định 70/2025/NĐ-CP)
            </h3>
            <p className="text-[11px] font-medium mt-0.5 text-slate-500 dark:text-zinc-400">
              Ban pháp chế hướng dẫn chi tiết sơ đồ nghiệp vụ xử lý hóa đơn điện tử sai sót và cẩm nang hạch toán 14 tình huống điều chỉnh thực tế.
            </p>
          </div>
        </div>

        {/* Chuyển đổi Sub-tab */}
        <div className="flex p-0.5 rounded-lg bg-slate-100 dark:bg-zinc-900 border dark:border-zinc-800 w-full md:w-auto">
          <button
            onClick={() => setActiveSubTab('flow')}
            className={`flex-1 md:flex-none py-1.5 px-4 text-[11px] font-extrabold uppercase rounded-md tracking-wider transition ${
              activeSubTab === 'flow'
                ? 'bg-amber-450 text-black shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400'
            }`}
          >
            Sơ đồ Xử lý Sai sót
          </button>
          <button
            onClick={() => setActiveSubTab('cases')}
            className={`flex-1 md:flex-none py-1.5 px-4 text-[11px] font-extrabold uppercase rounded-md tracking-wider transition ${
              activeSubTab === 'cases'
                ? 'bg-amber-450 text-black shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400'
            }`}
          >
            Mẫu 14 Ca Điều Chỉnh
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: TRƯỜNG HỢP FLOW SƠ ĐỒ SAI SÓT (Nghị định 70/2025/NĐ-CP) */}
      {activeSubTab === 'flow' && (
        <div className="space-y-4 animate-fade-in text-left">
          
          {/* Note của ban cố vấn Pháp lý */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            darkMode ? 'bg-amber-955/15 border-amber-900/30 text-amber-300' : 'bg-amber-50/30 border-amber-205 text-amber-850'
          }`}>
            <Info className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
            <div>
              <h4 className="font-bold text-xs uppercase text-amber-600">Trọng điểm thay đổi cốt lõi tại Nghị định 70/2025/NĐ-CP:</h4>
              <p className="text-[11px] font-medium leading-relaxed mt-1">
                Sửa đổi, bổ sung quy chế xử lý hóa đơn điện tử đã có mã hoặc không có mã của cơ quan thuế đã lập sai sót. Mang lại hai luồng pháp lý tách bạch hỗ trợ đại lý thuế &amp; doanh nghiệp tối ưu sổ sách kế toán:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2.5 text-[10.5px]">
                <div className="p-2.5 rounded bg-amber-500/5 border border-amber-500/20">
                  <span className="font-extrabold block text-amber-500 uppercase">📝 LUỒNG A: SAI TÊN &amp; ĐỊA CHỈ NGƯỜI MUA</span>
                  <p className="mt-1 leading-normal text-slate-650 dark:text-zinc-400">
                    Chỉ cần lập <strong>Thông báo sai sót Mẫu 04/SS-HĐĐT</strong> gửi Cơ quan Thuế và thông báo cho người mua. 
                    <span className="font-bold text-emerald-500 block mt-1">✓ KHÔNG PHẢI LẬP LẠI/ĐIỀU CHỈNH HÓA ĐƠN.</span>
                  </p>
                </div>
                <div className="p-2.5 rounded bg-amber-500/5 border border-amber-500/20">
                  <span className="font-extrabold block text-amber-500 uppercase">📊 LUỒNG B: SAI MST / SỐ TIỀN / THUẾ SUẤT</span>
                  <p className="mt-1 leading-normal text-slate-650 dark:text-zinc-400">
                    Bắt buộc lập biên bản thỏa thuận sai sót (nếu có) + Thực hiện lựa chọn 1 trong 2 giải pháp độc lập pháp vụ: <br/>
                    <strong className="text-red-500">1. Lập Hóa đơn điều chỉnh</strong> hoặc <strong className="text-blue-500 font-bold">2. Lập Hóa đơn thay thế</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quy trình chi tiết từng bước */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Box 1: Luồng phát hiện */}
            <div className={`p-4 rounded-xl border ${
              darkMode ? 'bg-zinc-950/20 border-zinc-900' : 'bg-white border-slate-205 shadow-2xs'
            }`}>
              <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-dashed dark:border-zinc-800">
                <span className="w-5 h-5 rounded-full bg-red-650 text-white font-mono font-bold text-xs flex items-center justify-center">1</span>
                <h4 className="font-extrabold text-[12px] uppercase">Bước 1: Phân Loại Sai Sót</h4>
              </div>
              <p className="text-[10.5px] leading-relaxed text-slate-600 dark:text-zinc-400">
                Người bán tự phát hiện hóa đơn điện tử (đã cấp mã CQT hoặc gửi dữ liệu rồi) bị sai lệch thông tin giao dịch. Tiến hành đối chiếu loại trừ:
              </p>
              <ul className="list-disc pl-4 space-y-1.5 mt-3 text-[10px] text-slate-500 dark:text-zinc-400">
                <li><strong className="text-slate-800 dark:text-zinc-200">Nhóm Nhẹ:</strong> Sai tên, địa chỉ người mua, đảm bảo viết đúng MST doanh nghiệp.</li>
                <li><strong className="text-orange-550">Nhóm Nghiêm Trọng:</strong> Sai MST, sai tên hàng, sai quy cách, sai đơn giá, sai tiền thuế,...</li>
              </ul>
            </div>

            {/* Box 2: Luồng hành động */}
            <div className={`p-4 rounded-xl border ${
              darkMode ? 'bg-zinc-950/20 border-zinc-900' : 'bg-white border-slate-205 shadow-2xs'
            }`}>
              <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-dashed dark:border-zinc-800">
                <span className="w-5 h-5 rounded-full bg-red-650 text-white font-mono font-bold text-xs flex items-center justify-center">2</span>
                <h4 className="font-extrabold text-[12px] uppercase">Bước 2: Chọn Phương Án Vận Hành</h4>
              </div>
              <div className="space-y-2.5 text-[10.5px]">
                <div>
                  <p className="font-bold text-emerald-500 uppercase">Đối với Nhóm Sai Tên/Địa chỉ:</p>
                  <p className="text-slate-505 dark:text-zinc-400 leading-snug">Gửi thông báo 04/SS-HĐĐT ngay trên hệ thống thuế số. Giữ nguyên số hóa đơn cũ để hạch toán bình thường.</p>
                </div>
                <div>
                  <p className="font-bold text-blue-500 uppercase">Đối với Nhóm Nghiêm Trọng:</p>
                  <p className="text-slate-505 dark:text-zinc-400 leading-snug">Lập biên bản sai sót (đồng ký điện tử 2 bên). Kế toán chọn xuất hóa đơn có dòng chú giải rõ: "Điều chỉnh cho..." hoặc "Thay thế cho..." hóa đơn số...</p>
                </div>
              </div>
            </div>

            {/* Box 3: Quy tắc kê khai quyết toán */}
            <div className={`p-4 rounded-xl border ${
              darkMode ? 'bg-zinc-950/20 border-zinc-900' : 'bg-white border-slate-205 shadow-2xs'
            }`}>
              <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-dashed dark:border-zinc-800">
                <span className="w-5 h-5 rounded-full bg-red-650 text-white font-mono font-bold text-xs flex items-center justify-center">3</span>
                <h4 className="font-extrabold text-[12px] uppercase">Bước 3: Quy tắc Kê khai Thuế</h4>
              </div>
              <p className="text-[10.5px] leading-relaxed text-slate-600 dark:text-zinc-400">
                Quy định hạch toán kê khai rất chặt chẽ theo hướng dẫn của Nghị định 70/2025/NĐ-CP:
              </p>
              <div className="p-2.5 rounded bg-slate-50 dark:bg-zinc-900 border mt-2.5 text-[10px] space-y-1">
                <p>📍 <strong>Người Bán:</strong> Kê khai khấu trừ điều chỉnh vào <strong className="text-red-500">kỳ phát sinh hóa đơn điều chỉnh/thay thế</strong>.</p>
                <p>📍 <strong>Người Mua:</strong> Kê khai vào <strong className="text-emerald-500">kỳ nhận được hóa đơn điều chỉnh/thay thế</strong> từ người bán.</p>
              </div>
              <p className="text-[9.5px] mt-2.5 text-orange-500 italic">
                * Lưu ý: Nếu lập hóa đơn điều chỉnh sai thông tin của chính hóa đơn điều chỉnh trước đó, phải lập thông báo 04/SS-HĐĐT và lập tiếp hóa đơn điều chỉnh tiếp theo.
              </p>
            </div>
          </div>

          {/* Đồng bộ gộp hóa đơn sai sót */}
          <div className={`p-3.5 rounded-xl border ${
            darkMode ? 'bg-zinc-950/40 border-stone-850' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[10px] uppercase font-black text-rose-500 tracking-wider">💡 ĐẶC QUYỀN ĐỒNG BỘ CHO KHÁCH HÀNG THÂN THIẾT</span>
            <p className="text-[11px] leading-relaxed mt-1 text-slate-700 dark:text-zinc-300">
              Trong tháng, nếu người bán lập sai liên tục nhiều hóa đơn của <strong>CÙNG MỘT NGƯỜI MUA</strong>, Nghị định 70/2025 cho phép <strong>lập duy nhất 01 hóa đơn điều chỉnh hoặc thay thế chung</strong>, đính kèm kèm theo <strong>Bảng kê danh sách hóa đơn điện tử lập sai (Mẫu 01/BK-ĐCTT)</strong>. Điều này giúp giảm 90% chi phí hóa đơn và công sức kế toán đại lý!
            </p>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: 14 CÁC TRƯỜNG HỢP CHI TIẾT (Interactive Showcase) */}
      {activeSubTab === 'cases' && (
        <div className="space-y-4 animate-fade-in text-left">
          
          {/* Hộp Tìm kiếm nhanh */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Tìm kiếm nhanh trong 14 trường hợp lập hóa đơn điều chỉnh (ví dụ: 'giảm đơn giá', 'thuế suất', 'trả lại hàng')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full text-xs p-2.5 pl-9 rounded-xl border outline-none transition focus:ring-1 focus:ring-amber-500 ${
                darkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-250 text-slate-800'
              }`}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-5">
            
            {/* Cột trái: Danh sách các ca để select */}
            <div className="w-full lg:w-80 shrink-0 space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
              {filteredCases.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCase(c.id)}
                  className={`w-full p-2 py-2 px-3 rounded-xl transition duration-150 text-left border flex items-center justify-between text-[11px] font-black cursor-pointer ${
                    selectedCase === c.id
                      ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-650/20'
                      : darkMode
                        ? 'bg-[#0f172a] border-zinc-850 text-zinc-300 hover:border-zinc-700'
                        : 'bg-white border-slate-200 text-slate-750 hover:border-slate-350 shadow-3xs'
                  }`}
                >
                  <span className="truncate">{c.title}</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${selectedCase === c.id ? 'text-white' : 'text-slate-400'}`} />
                </button>
              ))}
              {filteredCases.length === 0 && (
                <p className="text-[11px] text-slate-500 italic text-center p-4">Không tìm thấy trường hợp phù hợp với từ khóa.</p>
              )}
            </div>

            {/* Cột phải: View cụ thể chi tiết hóa đơn mẫu */}
            <div className="flex-1 min-w-0 space-y-4">
              <div className={`p-4 rounded-xl border ${
                darkMode ? 'bg-zinc-950/40 border-stone-800' : 'bg-white border-slate-205 shadow-2xs'
              }`}>
                
                {/* Case Metadata */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b dark:border-zinc-850 mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex flex-col items-center justify-center bg-red-600 text-white rounded-xl px-3.5 py-2 font-mono shadow-sm shrink-0 select-none">
                      <span className="text-[9px] font-black tracking-widest opacity-85 uppercase">CASE</span>
                      <span className="text-xl font-black mt-0.5">{selectedCaseData.id.toString().padStart(2, '0')}</span>
                    </div>
                    <div>
                      <span className="inline-block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                        Cẩm nang Nghiệp vụ Điều chỉnh &amp; Thay thế Hóa đơn
                      </span>
                      <h4 className="font-extrabold text-sm uppercase text-red-650 dark:text-red-500 mt-0.5 leading-snug">
                        {selectedCaseData.title.split(': ')[1] || selectedCaseData.title}
                      </h4>
                    </div>
                  </div>
                  
                  <div className="flex flex-row lg:flex-col lg:items-end flex-wrap items-center gap-2 shrink-0">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-extrabold tracking-wider uppercase border shadow-3xs ${
                      selectedCaseData.valueChange.includes('Tăng')
                        ? 'bg-emerald-500/10 text-emerald-650 border-emerald-500/20 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50'
                        : selectedCaseData.valueChange.includes('Giảm')
                          ? 'bg-rose-500/10 text-rose-650 border-rose-500/20 dark:bg-rose-955/20 dark:text-rose-400 dark:border-rose-900/50'
                          : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-[#1e293b]/50 dark:text-zinc-300 dark:border-zinc-805'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0 animate-pulse" />
                      Mức: {selectedCaseData.valueChange}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold border bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50 shadow-3xs max-w-xs text-right whitespace-normal">
                      <Layers className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      {selectedCaseData.elementsChanged}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-zinc-400 font-medium mb-4">
                  💡 <strong>Chi tiết mô tả nghiệp vụ:</strong> {selectedCaseData.vesselDesc}
                </p>

                {/* BẢNG HÓA ĐƠN ĐIỀU CHỈNH CHUẨN INH-IMAGE */}
                <div className="overflow-x-auto rounded-lg border dark:border-zinc-800">
                  <table className="w-full text-left text-[11px] border-collapse min-w-[500px]">
                    <thead>
                      <tr className={`${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-slate-100 border-slate-200 text-slate-800'} border-b font-bold font-mono`}>
                        <th className="p-2 border-r dark:border-zinc-800 w-12 text-center">STT</th>
                        <th className="p-2 border-r dark:border-zinc-800">Tên hàng hóa, dịch vụ</th>
                        <th className="p-2 border-r dark:border-zinc-800 w-16 text-center">ĐVT</th>
                        <th className="p-2 border-r dark:border-zinc-800 w-16 text-center">Số lượng</th>
                        <th className="p-2 border-r dark:border-zinc-800 w-24 text-right">Đơn giá</th>
                        <th className="p-2 w-28 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-zinc-850 font-mono">
                      <tr>
                        <td className="p-2 border-r dark:border-zinc-800 text-center">{selectedCaseData.stt}</td>
                        <td className="p-2 border-r dark:border-zinc-800 whitespace-normal font-sans font-medium text-slate-700 dark:text-zinc-200">
                          {selectedCaseData.itemName}
                        </td>
                        <td className="p-2 border-r dark:border-zinc-800 text-center">{selectedCaseData.unit || '—'}</td>
                        <td className="p-2 border-r dark:border-zinc-800 text-center font-bold">
                          {selectedCaseData.quantity === "" ? "—" : selectedCaseData.quantity}
                        </td>
                        <td className="p-2 border-r dark:border-zinc-800 text-right">
                          {selectedCaseData.price === "" ? "—" : selectedCaseData.price.toLocaleString('vi-VN')}
                        </td>
                        <td className="p-2 text-right font-bold">
                          {selectedCaseData.totalPrice === "" ? "—" : selectedCaseData.totalPrice.toLocaleString('vi-VN')}
                        </td>
                      </tr>
                      {/* Empty filler row for neat look */}
                      <tr className="bg-slate-50/20 dark:bg-zinc-900/10">
                        <td className="p-2 border-r dark:border-zinc-800 text-center text-slate-350">...</td>
                        <td className="p-2 border-r dark:border-zinc-800 text-slate-350 italic">Cộng tiền hàng...</td>
                        <td className="p-2 border-r dark:border-zinc-800 text-center">—</td>
                        <td className="p-2 border-r dark:border-zinc-800 text-center">—</td>
                        <td className="p-2 border-r dark:border-zinc-800 text-right">—</td>
                        <td className="p-2 text-right font-bold">
                          {selectedCaseData.totalPrice === "" ? "—" : selectedCaseData.totalPrice.toLocaleString('vi-VN')}
                        </td>
                      </tr>
                      {/* Taxes and totals */}
                      <tr className={`${darkMode ? 'bg-zinc-900/60' : 'bg-slate-50/50'} border-t`}>
                        <td colSpan={2} className="p-2 border-r dark:border-zinc-800 text-right font-bold font-sans">
                          Thuế suất GTGT:
                        </td>
                        <td colSpan={3} className="p-2 border-r dark:border-zinc-800 text-center font-bold">
                          {selectedCaseData.vatPercent}
                        </td>
                        <td className="p-2 text-right font-bold text-orange-500">
                          {selectedCaseData.vatAmount.toLocaleString('vi-VN')}
                        </td>
                      </tr>
                      <tr className={darkMode ? 'bg-zinc-900/60' : 'bg-slate-50/50'}>
                        <td colSpan={5} className="p-2 border-r dark:border-zinc-800 text-right font-bold font-sans">
                          Tổng cộng tiền thanh toán trên hóa đơn:
                        </td>
                        <td className="p-2 text-right font-black text-rose-500">
                          {selectedCaseData.totalAmount.toLocaleString('vi-VN')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Số tiền viết bằng chữ */}
                <div className="mt-3.5 p-3 rounded-lg border border-dashed dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-950/20 text-[11px] leading-relaxed">
                  <p className="text-slate-500 dark:text-zinc-500 font-extrabold uppercase tracking-widest text-[9.5px]">Số tiền viết bằng chữ:</p>
                  <p className="font-extrabold text-indigo-650 dark:text-indigo-400 mt-1 font-mono">{selectedCaseData.wordsAmount}</p>
                </div>

                {/* Nội dung dòng điều chỉnh bắt buộc */}
                <div className="mt-3 p-3 rounded-lg bg-orange-500/5 border border-orange-500/20 text-[11px] leading-relaxed">
                  <p className="text-orange-500 font-extrabold uppercase tracking-widest text-[9.5px]">Dòng ghi chú điều chỉnh bắt buộc trên hóa đơn:</p>
                  <p className="font-extrabold text-orange-600 dark:text-orange-400 mt-1 italic">
                    "{selectedCaseData.guideText}"
                  </p>
                </div>

              </div>
              
              {/* Note của chuyên viên */}
              <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl text-[10px] text-slate-650 dark:text-zinc-300 leading-normal font-medium">
                🛡️ <strong>Lưu ý nghiệp vụ ({selectedCaseData.title.split(":")[0]}):</strong> {selectedCaseData.note}
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
