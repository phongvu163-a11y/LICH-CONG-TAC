import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  BookOpen, 
  FileText, 
  Calendar, 
  HelpCircle,
  Building2,
  CheckCircle2,
  Award,
  ArrowRight,
  Info,
  Scale,
  AlertTriangle,
  Gavel,
  CheckCircle,
  AlertOctagon,
  Search,
  X,
  MapPin,
  FolderOpen,
  Plane,
  ChevronRight,
  User,
  ShieldAlert,
  ListChecks,
  Compass,
  FileSpreadsheet,
  RefreshCw,
  Globe,
  Briefcase
} from 'lucide-react';

import InvoiceTimeTab from './InvoiceTimeTab';
import RejectedExpensesTab from './RejectedExpensesTab';
import ReturnedGoodsTab from './ReturnedGoodsTab';
import Circular58Tab from './Circular58Tab';
import FactorKTab from './FactorKTab';
import DigitalCommerceTab from './DigitalCommerceTab';
import TradeUnionTab from './TradeUnionTab';
import SupplementaryFilingTab from './SupplementaryFilingTab';
import InvoiceAdjustmentTab from './InvoiceAdjustmentTab';
import ContractClassificationTab from './ContractClassificationTab';
import VATThreeCasesTab from './VATThreeCasesTab';

interface HouseholdBusinessGuideProps {
  darkMode: boolean;
}

export default function HouseholdBusinessGuide({ darkMode }: HouseholdBusinessGuideProps) {
  // Navigation & interaction states
  const [activeTab, setActiveTab] = useState<
    | 'setup_steps' 
    | 'classification' 
    | 'model_compare' 
    | 'location_noti' 
    | 'document_file' 
    | 'rental_tax' 
    | 'penalties' 
    | 'labor_penalties' 
    | 'travel_ban'
    | 'invoice_time'
    | 'rejected_expenses'
    | 'returned_goods'
    | 'circular_58'
    | 'factor_k'
    | 'digital_commerce'
    | 'trade_union'
    | 'supplementary_filing'
    | 'invoice_adjustment'
    | 'labor_contracts'
    | 'vat_cases'
  >('setup_steps');

  const [rentalRevenue, setRentalRevenue] = useState<string>('');
  const [selectedGroupIndex, setSelectedGroupIndex] = useState<number>(0);
  const [classDetailTab, setClassDetailTab] = useState<'info' | 'books' | 'calc'>('info');

  // Interactive Calculator states for Classification
  const [g1AnnRev, setG1AnnRev] = useState<string>('800000000'); // 800M
  const [g1Q1, setG1Q1] = useState<string>('200000000');
  const [g1Q2, setG1Q2] = useState<string>('250000000');
  const [g1Q3, setG1Q3] = useState<string>('400000000');
  const [g1Q4, setG1Q4] = useState<string>('300000000');

  const [g2Sector, setG2Sector] = useState<string>('dist'); // retail distribution
  const [g2Method, setG2Method] = useState<'method1' | 'method2'>('method1');
  const [g2Rev, setG2Rev] = useState<string>('2000000000'); // 2B
  const [g2Expenses, setG2Expenses] = useState<string>('800000000'); // 800M

  const [g3Sector, setG3Sector] = useState<string>('dist'); // retail distribution
  const [g3Rev, setG3Rev] = useState<string>('15000000000'); // 15B
  const [g3Expenses, setG3Expenses] = useState<string>('11500000000'); // 11.5B

  const [penaltySearch, setPenaltySearch] = useState<string>('');
  const [docSearch, setDocSearch] = useState<string>('');
  
  // Interactive checklist tracking for the 7 steps
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
  });

  const toggleStep = (stepNum: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepNum]: !prev[stepNum]
    }));
  };

  // Category definitions for professional structured navigation
  const categories = [
    { id: 'hkd', label: '💼 CHUYÊN ĐỀ HỘ KINH DOANH (HKD) & THUẾ KHỐI SỐ' },
    { id: 'enterprise', label: '🏢 CHUYÊN ĐỀ DOANH NGHIỆP & KẾ TOÁN CHUYÊN SÂU' },
    { id: 'risk', label: '⚠️ THỂ CHẾ PHÁP CHẾ, THANH TRA & HẬU KIỂM' }
  ] as const;

  // Tab definitions with matching metadata, icons, and categories
  const listTabs = [
    // --- HỘ KINH DOANH & THUẾ SỐ ---
    { id: 'setup_steps', label: '📋 Mới thành lập', icon: ListChecks, brief: '7 bước khởi sự, ngưỡng & thời hạn nộp', category: 'hkd' },
    { id: 'location_noti', label: '📍 Địa điểm KD', icon: MapPin, brief: 'Thời hạn 10 ngày kê khai & 5 trường hợp', category: 'hkd' },
    { id: 'classification', label: '📊 Phân loại HKD', icon: Award, brief: 'Quy mô 4 nhóm doanh thu và chế độ sổ sách', category: 'hkd' },
    { id: 'circular_58', label: '📘 Thông tư 58/2026', icon: BookOpen, brief: 'Chế độ kế toán Micro-DN & Hộ kinh doanh', category: 'hkd' },
    { id: 'digital_commerce', label: '🌐 Thuế nền tảng số', icon: Globe, brief: 'Kê khai Shopee, TikTok Shop, Facebook', category: 'hkd' },
    { id: 'rental_tax', label: '🏠 Cho thuê tài sản', icon: FileSpreadsheet, brief: 'Công thức & Tính thời hạn nộp thuế cho thuê', category: 'hkd' },

    // --- DOANH NGHIỆP & KẾ TOÁN CHUYÊN SÂU ---
    { id: 'model_compare', label: '⚖️ Chọn mô hình', icon: Scale, brief: 'Duy trì mô hình HKD hay lên doanh nghiệp', category: 'enterprise' },
    { id: 'document_file', label: '📁 Sắp xếp chứng từ', icon: FolderOpen, brief: '11 nhóm hồ sơ kế toán lưu trữ khoa học', category: 'enterprise' },
    { id: 'invoice_time', label: '🧾 Thời điểm Hóa đơn', icon: FileText, brief: 'Hạn mốc xuất hóa đơn đúng luật hợp lệ', category: 'enterprise' },
    { id: 'vat_cases', label: '⚖️ 3 Trường hợp GTGT', icon: Scale, brief: 'Phân biệt Không chịu thuế, Thuế 0%, Không kê khai', category: 'enterprise' },
    { id: 'returned_goods', label: '🔄 Hàng bán trả lại', icon: RefreshCw, brief: 'Thủ tục xuất hóa đơn hoàn trả đúng kỳ thuế', category: 'enterprise' },
    { id: 'invoice_adjustment', label: '🛠️ Điều chỉnh hóa đơn', icon: FileText, brief: 'Quy trình Hóa đơn Điều chỉnh & Thay thế theo NĐ 70/2025', category: 'enterprise' },
    { id: 'rejected_expenses', label: '💸 10 Chi phí bị loại', icon: AlertOctagon, brief: 'Điều kiện khấu trừ & chi phí không hợp lệ', category: 'enterprise' },
    { id: 'supplementary_filing', label: '📅 Khai bổ sung', icon: Calendar, brief: 'Kế hoạch bổ sung sai sót thời hạn tới 10 năm', category: 'enterprise' },
    { id: 'trade_union', label: '🏦 Kinh phí Công đoàn', icon: Building2, brief: 'Nghĩa vụ nộp 2% phí công đoàn định danh', category: 'enterprise' },

    // --- AN NINH PHÁP CHẾ & TÀI CHÍNH ---
    { id: 'factor_k', label: '⚠️ Warning Hệ số K', icon: ShieldAlert, brief: 'Quản trị rủi ro hóa đơn ảo vượt tồn kho', category: 'risk' },
    { id: 'penalties', label: '⚠️ Phạt HC Thuế', icon: AlertTriangle, brief: 'Nghị định 125 & 310 về hóa đơn sai sót', category: 'risk' },
    { id: 'labor_contracts', label: '📝 Phân loại Hợp đồng', icon: Briefcase, brief: 'Phân biệt 6 loại HĐ tránh rủi ro bảo hiểm & pháp lý', category: 'risk' },
    { id: 'labor_penalties', label: '💼 Phạt TB Lao động', icon: Gavel, brief: 'Rủi ro vi phạm đăng ký, báo cáo nhân sự', category: 'risk' },
    { id: 'travel_ban', label: '✈️ Hoãn xuất cảnh', icon: Plane, brief: 'Rủi ro tạm hoãn xuất cảnh do nợ đọng thuế', category: 'risk' },
  ] as const;

  // Tab 2 content: Revenue bands
  const groups = [
    {
      index: 1,
      title: 'NHÓM 1 – DOANH THU ≤ 1 TỶ/NĂM',
      scale: 'Quy mô: Nhỏ',
      bgHeader: 'bg-emerald-700 text-white',
      bgHeaderDark: 'bg-emerald-900 border-emerald-850 text-emerald-100',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/50',
      tax: {
        title: 'Chính sách thuế',
        items: ['GTGT: Miễn nghĩa vụ nộp', 'TNCN: Miễn nghĩa vụ nộp']
      },
      books: {
        title: 'Chế độ Sổ sách',
        items: ['Ghi chép đơn giản', 'Sổ mẫu S1a-HKD (Doanh thu)']
      },
      invoice: {
        title: 'Hóa đơn',
        items: ['Không bắt buộc phát hành hóa đơn điện tử']
      },
      declaration: {
        title: 'Hạn Kê khai',
        items: [
          'Khai báo 1 lần hằng năm (Hạn 31/01 năm sau)',
          'Nếu mới mở: 2 lần/năm (Lần 1: 31/07 cùng năm, Lần 2: 31/01 năm sau)'
        ]
      }
    },
    {
      index: 2,
      title: 'NHÓM 2 – DOANH THU > 1 – 3 TỶ/NĂM',
      scale: 'Quy mô: Trung bình',
      bgHeader: 'bg-orange-600 text-white',
      bgHeaderDark: 'bg-orange-955 border-orange-900 text-orange-105',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-600 dark:text-orange-400',
      tagColor: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-900/50',
      tax: {
        title: 'Chính sách thuế',
        items: [
          'GTGT: Tính trực tiếp theo tỷ lệ % doanh thu',
          'TNCN: Tính theo tỷ lệ % doanh thu quy định'
        ]
      },
      books: {
        title: 'Chế độ Sổ sách',
        items: [
          'Mức cơ bản bắt buộc',
          'Sổ S2a-HKD tổng hợp',
          'Nếu chọn nộp theo lợi nhuận thực tế: Mẫu S2b, S2c, S2d, S2e, S3a'
        ]
      },
      invoice: {
        title: 'Hóa đơn',
        items: ['Bắt buộc sử dụng hóa đơn điện tử liên thông']
      },
      declaration: {
        title: 'Hạn Kê khai',
        items: ['Thực hiện kê khai định kỳ theo Quý']
      }
    },
    {
      index: 3,
      title: 'NHÓM 3 – DOANH THU > 3 – 50 TỶ/NĂM',
      scale: 'Quy mô: Lớn',
      bgHeader: 'bg-blue-700 text-white',
      bgHeaderDark: 'bg-blue-900 border-blue-950 text-blue-100',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-600 dark:text-blue-400',
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-900/50',
      tax: {
        title: 'Chính sách thuế',
        items: [
          'GTGT: Tỷ lệ % trên doanh thu thực tế',
          'TNCN: Tính dựa trên lợi nhuận thuần (Doanh thu - Chi phí hợp lệ)',
          'Thuế suất TNCN: Thu mức cố định 17% trên thu nhập chịu thuế'
        ]
      },
      books: {
        title: 'Chế độ Sổ sách',
        items: ['Bắt buộc hệ thống các sổ S2b, S2c, S2d, S2e, S3a chi tiết']
      },
      invoice: {
        title: 'Hóa đơn',
        items: ['Bắt buộc phát hành hóa đơn điện tử theo quý / theo lần phát sinh']
      },
      declaration: {
        title: 'Hạn Kê khai',
        items: ['Thực hiện kê khai định kỳ theo Quý']
      }
    },
    {
      index: 4,
      title: 'NHÓM 4 – DOANH THU > 50 TỶ/NĂM',
      scale: 'Quy mô: Rất lớn',
      bgHeader: 'bg-purple-700 text-white',
      bgHeaderDark: 'bg-purple-900 border-purple-950 text-purple-100',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-600 dark:text-purple-400',
      tagColor: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-900/50',
      tax: {
        title: 'Chính sách thuế',
        items: [
          'GTGT: Kê khai kê khai thuế như tổ chức doanh nghiệp',
          'TNCN: Tính theo lợi nhuận thực tế thu được',
          'Thuế suất TNCN: Mức 20% trên thu nhập chịu thuế sau khi trừ các khoản giảm trừ'
        ]
      },
      books: {
        title: 'Chế độ Sổ sách',
        items: [
          'Sử dụng các mẫu sổ quy định S2b, S2c, S2d, S2e, S3a',
          'Áp dụng chế độ kế toán chi tiết như Doanh nghiệp (Sổ nhật ký chung, Sổ cái, Báo cáo tài chính, Bảng cân đối tài khoản)'
        ]
      },
      invoice: {
        title: 'Hóa đơn',
        items: ['Bắt buộc áp dụng hóa đơn điện tử có mã của cơ quan thuế']
      },
      declaration: {
        title: 'Hạn Kê khai',
        items: ['Thực hiện kê khai định kỳ theo Tháng']
      }
    }
  ];

  // Tab 7 content: Penalties dictionary
  const penalties = [
    {
      stt: 1,
      behavior: 'Nộp hồ sơ khai thuế quá thời hạn từ 01 ngày đến 05 ngày và có tình tiết giảm nhẹ.',
      penaltyType: 'Phạt cảnh cáo',
      penaltyDesc: 'Cảnh cáo bằng văn bản hành chính quy định.',
      consequence: 'Buộc nộp đủ số tiền thuế chậm nộp vào ngân sách nhà nước nếu có phát sinh muộn.',
      severity: 'cảnh cáo',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
    },
    {
      stt: 2,
      behavior: 'Nộp hồ sơ khai thuế quá thời hạn từ 01 ngày đến 30 ngày (trừ trường hợp nộp thuế hoặc khai thuế quá thời hạn từ 01 đến 05 ngày có tình tiết giảm nhẹ).',
      penaltyType: 'Phạt tiền từ 2.000.000đ đến 5.000.000đ',
      penaltyDesc: 'Mức phạt trung bình chung là 3.500.000đ.',
      consequence: 'Buộc nộp đủ số tiền thuế còn nợ và tiền chậm nộp thuế vào quỹ ngân sách.',
      severity: 'nhẹ',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-305 dark:border-amber-800'
    },
    {
      stt: 3,
      behavior: 'Nộp hồ sơ khai thuế quá thời hạn quy định từ 31 ngày đến 60 ngày.',
      penaltyType: 'Phạt tiền từ 5.000.000đ đến 8.000.000đ',
      penaltyDesc: 'Mức phạt trung bình chung là 6.500.000đ.',
      consequence: 'Buộc nộp đủ số tiền thuế và phí chậm nộp phát sinh vào ngân sách.',
      severity: 'trung bình',
      badgeColor: 'bg-orange-100 text-orange-850 dark:bg-orange-955 dark:text-orange-300 border border-orange-300 dark:border-orange-900'
    },
    {
      stt: 4,
      behavior: 'Nộp hồ sơ khai thuế quá hạn từ 61 đến 90 ngày; Nộp từ 91 ngày trở lên nhưng không phát sinh số thuế phải nộp; Không nộp hồ sơ khai thuế nhưng không làm phát sinh số thuế phải nộp; Không nộp các phụ lục về thông tin giao dịch liên kết khi quyết toán.',
      penaltyType: 'Phạt tiền từ 8.000.000đ đến 15.000.000đ',
      penaltyDesc: 'Mức phạt trung bình chung là 11.500.000đ.',
      consequence: 'Buộc nộp tờ khai thuế, nộp bổ sung hồ sơ phụ lục giao dịch liên kết và ngân sách số tiền chậm nộp.',
      severity: 'nặng',
      badgeColor: 'bg-rose-100 text-rose-850 dark:bg-rose-955 dark:text-rose-300 border border-rose-300 dark:border-rose-900'
    },
    {
      stt: 5,
      behavior: 'Nộp hồ sơ khai thuế quá thời hạn trên 90 ngày, có phát sinh số thuế phải nộp và người nộp thuế đã nộp đủ số tiền thuế, tiền chậm nộp trước thời điểm cơ quan thuế công bố quyết định thanh tra, kiểm tra hoặc lập biên bản hành vi.',
      penaltyType: 'Phạt tiền từ 15.000.000đ đến 25.000.000đ',
      penaltyDesc: 'Mức xử phạt kịch khung hành chính cho hành vi nộp chậm tờ khai. Trung bình phạt 20.000.000đ.',
      consequence: 'Buộc hoàn thành mọi nghĩa vụ nộp thuế chậm nộp và khắc phục các sai phạm kê khai.',
      severity: 'nghiêm trọng',
      badgeColor: 'bg-red-200 text-red-900 dark:bg-red-950 dark:text-red-300 border border-red-400 dark:border-red-900/60'
    }
  ];

  // Tab 5 content: 11 categories of bookkeeping documents
  const docGuideCategories = [
    {
      id: 1,
      title: '1. CHỨNG TỪ GỐC',
      desc: 'Sắp xếp theo phát sinh của Tháng/Quý và đồng bộ theo Tờ khai Thuế GTGT nộp định kỳ.',
      elements: [
        'Kẹp chung: Hóa đơn đỏ mua vào - bán ra kèm Tờ khai thuế GTGT đã ký nộp thành công.',
        'Chi tiết bên Bán ra: Hóa đơn, Phiếu thu tiền mặt hoặc Giấy báo Có ngân hàng, Phiếu xuất kho hàng hóa, Hợp đồng kinh tế.',
        'Chi tiết bên Mua vào: Hóa đơn mua, Ủy nhiệm chi (UNC) / Phiếu chi thanh toán, Phiếu nhập kho dự trữ, Hợp đồng / cam kết.',
        '💡 Nguyên tắc vàng: Mỗi tháng đóng gói thành 1 tệp riêng biệt kèm chữ ký và con dấu pháp định để dễ dàng kiểm tra bất thình lình.'
      ]
    },
    {
      id: 2,
      title: '2. HỒ SƠ THUẾ PHÁP CHẾ',
      desc: 'Thiết lập lưu trữ phân biệt theo Năm dương lịch - mỗi loại sắc thuế làm 1 tệp tài liệu riêng.',
      elements: [
        'Bộ tờ khai thuế định kỳ (GTGT, thu nhập cá nhân TNCN, thu nhập doanh nghiệp TNDN).',
        'Báo cáo tài chính năm chính thức, quyết toán thuế năm.',
        'Mọi loại thông báo hành chính, biên bản làm việc hoặc công văn hướng dẫn của cơ quan thuế quản lý.',
        'Đi kèm: Chứng từ nộp tiền điện tử (giấy nộp tiền vào NSNN) và bảng kê chi tiết phụ lục.',
        '⚠️ Lưu ý: Tách riêng tệp lưu trữ hồ sơ giải trình, đối thoại thanh tra thuế qua các năm.'
      ]
    },
    {
      id: 3,
      title: '3. HỢP ĐỒNG KINH TẾ',
      desc: 'Bản gốc pháp lý của các hợp đồng phải luôn được quản lý tại bộ phận kế toán.',
      elements: [
        'Sắp xếp phân loại logic theo mã Khách hàng, Nhà cung cấp hoặc theo từng Dự án triển khai.',
        'Kẹp kèm theo hợp đồng: Bảng báo giá thầu, Biên bản nghiệm thu dự án, Biên bản thanh lý hợp đồng, Hóa đơn giao dịch tương ứng.',
        '🔒 Tuyệt đối không tự ý cho mượn hoặc bàn giao tài liệu gốc nếu chưa được sự kiểm duyệt và ký giấy biên nhận của ban lãnh đạo.'
      ]
    },
    {
      id: 4,
      title: '4. CHỨNG TỪ TIỀN LƯƠNG NHÂN SỰ',
      desc: 'Lưu trữ tài liệu theo từng Năm hành chính và phân chia chi tiết theo 12 tháng.',
      elements: [
        'Bảng chấm công lao động định kỳ, bảng tính hiệu suất và bảng thanh toán lương.',
        'Ủy nhiệm chi ngân hàng trả lương hoặc bảng lương có chữ ký nhận trực tiếp của người lao động.',
        'Hợp đồng lao động cá nhân, quyết định điều chỉnh tăng/giảm lương thưởng.',
        'Hồ sơ trích nộp đóng bảo hiểm xã hội (BHXH) của cơ sở.',
        '🔍 Check kỹ: Các số liệu lương, trích bảo hiểm và tờ khai quyết toán thuế TNCN bắt buộc phải hoàn toàn khớp nhau.'
      ]
    },
    {
      id: 5,
      title: '5. CHỨNG TỪ XUẤT NHẬP KHO',
      desc: 'Quản lý toàn bộ vòng đời hàng hóa, nguyên vật liệu di chuyển qua kho bãi.',
      elements: [
        'Phiếu nhập kho (PNK): Bắt buộc đi kèm hóa đơn mua hàng đầu vào, biên bản giao nhận hàng hóa thực tế và hợp đồng mua bán.',
        'Phiếu xuất kho (PXK): Đi kèm văn bản yêu cầu xuất kho của bộ phận sản xuất/kinh doanh, biên bản bàn giao bàn giao.',
        'Tệp báo cáo: Thẻ kho chi tiết, Sổ tổng hợp xuất nhập tồn (NXT) của toàn bộ mã vật tư.'
      ]
    },
    {
      id: 6,
      title: '6. CHỨNG TỪ THANH TOÁN TIỀN MẶT / BANK',
      desc: 'Theo dõi chi tiết các luồng tiền tệ hoạt động giao dịch nội bộ.',
      elements: [
        'Phiếu chi quỹ / Ủy nhiệm chi (UNC) ngân hàng.',
        'Đi kèm: Giấy đề nghị thanh toán được phê duyệt, hóa đơn chứng từ gốc hoặc kế hoạch chi ngân sách được phê duyệt duyệt.',
        '💼 Trường hợp thanh toán nhiều lần: Phải kẹp kèm bảng theo dõi thanh toán lũy kế và bản photo hợp đồng mẹ.'
      ]
    },
    {
      id: 7,
      title: '7. TIỀN MẶT QUỸ & SỐ DƯ NGÂN HÀNG',
      desc: 'Công cụ giám sát dòng tiền thực tế định kỳ.',
      elements: [
        'Biên bản kiểm kê quỹ tiền mặt đột xuất và định kỳ cuối ngày/tuần/tháng.',
        'Thư xác nhận số dư tài khoản của các ngân hàng giao dịch tại ngày khóa sổ kế toán.',
        'Hồ sơ vay vốn thế chấp/tín chấp, hợp đồng tiền gửi có kỳ hạn.'
      ]
    },
    {
      id: 8,
      title: '8. TÀI SẢN CỐ ĐỊNH (TSCĐ)',
      desc: 'Thiết lập mỗi một tài sản cố định làm một tệp hồ sơ lý lịch chuyên biệt.',
      elements: [
        'Hợp đồng mua bán, hóa đơn VAT mua tài sản, biên bản giao nhận lắp đặt chạy thử sản phẩm.',
        'Kế toán bắt buộc theo dõi: Quyết định trích khấu hao tài sản, Bảng kê chi phí khấu hao phân bổ hàng tháng.',
        'Thành phần: Hồ sơ nâng cấp, cải tạo lớn hoặc biên bản thanh lý TSCĐ thu hồi vốn.'
      ]
    },
    {
      id: 9,
      title: '9. CÔNG CỤ DỤNG CỤ (CCDC)',
      desc: 'Quản lý các tài sản nhỏ không đủ điều kiện ghi nhận TSCĐ.',
      elements: [
        'Hóa đơn mua vào, phiếu xuất-nhập sỉ của công cụ dùng chung.',
        'Bảng phân bổ giá trị CCDC vào chi phí vận hành định kỳ.',
        'Báo cáo phân loại: Ghi nhận phân bổ 100% giá trị một lần hoặc các CCDC có vòng đời dài phân bổ thành nhiều kỳ riêng.'
      ]
    },
    {
      id: 10,
      title: '10. QUẢN LÝ CÔNG NỢ',
      desc: 'Biện pháp phòng ngừa rủi ro nợ xấu và tranh chấp tài chính.',
      elements: [
        'Biên bản đối chiếu công nợ phải thu - phải trả định kỳ (tháng/quý/năm) có chữ ký xác nhận của hai bên đối tác.',
        'Văn bản đôn đốc nợ, thông báo yêu cầu gia hạn hoặc biên bản cấn trừ công nợ giữa các pháp nhân.',
        'Hồ sơ pháp lý xử lý các khoản công nợ khó đòi, nợ xấu xóa sổ.'
      ]
    },
    {
      id: 11,
      title: '11. PHÁP LÝ & ĐĂNG KÝ KINH DOANH',
      desc: 'Nền tảng tư cách pháp nhân hoạt động và tuân thủ các điều kiện luật định.',
      elements: [
        'Giấy chứng nhận đăng ký hộ kinh doanh / Đăng ký doanh nghiệp.',
        'Điều lệ hoạt động (đối với mô hình doanh nghiệp), các biên bản họp sáng lập viên.',
        'Văn bản ủy quyền giao dịch tài chính ngân hàng, ký tá chứng từ kế toán chính thức.'
      ]
    }
  ];

  // Filtering for penalties dictionary
  const filteredPenalties = useMemo(() => {
    return penalties.filter(p => {
      if (!penaltySearch) return true;
      const s = penaltySearch.toLowerCase();
      return (
        p.behavior.toLowerCase().includes(s) ||
        p.penaltyType.toLowerCase().includes(s) ||
        p.consequence.toLowerCase().includes(s) ||
        p.severity.toLowerCase().includes(s)
      );
    });
  }, [penaltySearch]);

  // Filtering for documents dictionary
  const filteredDocs = useMemo(() => {
    return docGuideCategories.filter(cat => {
      if (!docSearch) return true;
      const s = docSearch.toLowerCase();
      return (
        cat.title.toLowerCase().includes(s) ||
        cat.desc.toLowerCase().includes(s) ||
        cat.elements.some(el => el.toLowerCase().includes(s))
      );
    });
  }, [docSearch]);

  // Step completion calculations
  const verifiedStepsCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((verifiedStepsCount / 7) * 100);

  return (
    <div id="legal-guidebook" className={`p-4 sm:p-6 rounded-2xl border transition-all ${
      darkMode ? 'bg-[#152238]/80 border-sky-950/60 text-zinc-100 shadow-lg shadow-black/20' : 'bg-gradient-to-br from-white to-slate-50/50 border-slate-205 shadow-sm text-slate-800'
    } mt-6`}>
      
      {/* Title Header with Modern Badging */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-5 mb-5 border-b border-slate-200 dark:border-sky-950/60 gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs font-black tracking-widest bg-red-650 text-white px-2.5 py-0.5 rounded-full uppercase">
              THƯ CỦA BAN PHÁP CHẾ
            </span>
            <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
              Cập nhật 2026/2027
            </span>
          </div>
          <h2 className={`text-lg sm:text-2xl font-black tracking-tight mt-1.5 uppercase ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
             CẨM NANG NGHIỆP VỤ PHÁP LÝ &amp; THUẾ ĐẠI LÝ
          </h2>
          <p className={`text-[11px] sm:text-xs mt-1 font-medium ${darkMode ? 'text-sky-300/80' : 'text-slate-500'}`}>
            Tư vấn chiến lược, thời hạn và định hướng quản lý tài chính doanh nghiệp &amp; hộ kinh doanh tự động hóa.
          </p>
        </div>

        {/* Mobile dropdown selector with smart optgroup categorization */}
        <div className="w-full lg:hidden">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1">
            Chọn chuyên đề cẩm nang:
          </label>
          <select 
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as any)}
            className={`w-full text-xs p-2.5 font-bold rounded-lg border focus:outline-none focus:ring-1 focus:ring-amber-500 ${
              darkMode ? 'bg-zinc-900 border-zinc-850 text-white' : 'bg-white border-slate-200 text-slate-850'
            }`}
          >
            {categories.map((cat) => (
              <optgroup key={cat.id} label={cat.label}>
                {listTabs
                  .filter((tab) => tab.category === cat.id)
                  .map((tab) => (
                    <option key={tab.id} value={tab.id}>
                      {tab.label}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      {/* Main Structural Body */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar for Desktop navigation - Categorized & Structured */}
        <div className="hidden lg:flex flex-col w-72 shrink-0 border-r border-slate-200 dark:border-sky-950/40 pr-5 space-y-5 text-left select-none">
          {categories.map((category) => (
            <div key={category.id} className="space-y-1.5">
              <span className="text-[9px] font-extrabold uppercase text-slate-400 dark:text-zinc-500 tracking-wider pl-2.5 block leading-none select-none">
                {category.label}
              </span>
              <div className="space-y-1">
                {listTabs
                  .filter((tab) => tab.category === category.id)
                  .map((tab) => {
                    const Icon = tab.icon;
                    const isTabActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full p-2 py-1.5 px-3 rounded-xl transition-all duration-150 flex items-start gap-2.5 text-left cursor-pointer border ${
                          isTabActive
                            ? 'bg-amber-450 hover:bg-amber-450/90 text-black border-amber-500 font-extrabold shadow-sm'
                            : 'bg-transparent border-transparent text-slate-600 dark:text-zinc-400 hover:bg-slate-100/60 dark:hover:bg-zinc-900/30'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isTabActive ? 'text-black' : 'text-red-650'}`} />
                        <div>
                          <h4 className="text-[11px] font-black tracking-tight leading-tight uppercase">
                            {tab.label.split(' ').slice(1).join(' ')}
                          </h4>
                          <p className={`text-[9.5px] font-medium leading-tight mt-0.5 ${
                            isTabActive ? 'text-zinc-900/80' : 'text-slate-500 dark:text-zinc-550'
                          }`}>
                            {tab.brief}
                          </p>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* Content Showcase Area */}
        <div className="flex-1 min-w-0">
          
          {/* TAB 1: NEWLY ESTABLISHED SETUP STEPS (IMAGE 1) */}
          {activeTab === 'setup_steps' && (
            <div className="space-y-5 animate-fade-in text-left">
              <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                darkMode ? 'bg-zinc-950/40 border-sky-950/50' : 'bg-red-50/20 border-red-100'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-650 text-white rounded-xl shadow-md shadow-red-950/20 shrink-0">
                    <ListChecks className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-tight text-red-650">
                      Hộ Kinh Doanh Mới Thành Lập Cần Làm Gì?
                    </h3>
                    <p className={`text-[11px] font-medium mt-0.5 ${darkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
                      Kế hoạch chuẩn chỉnh 7 bước theo cơ chế <strong>"Tự khai – Tự nộp – Tự chịu trách nhiệm"</strong> áp dụng từ năm 2026.
                    </p>
                  </div>
                </div>

                {/* Progress bar tracking */}
                <div className="shrink-0 w-full md:w-44 text-left">
                  <div className="flex items-center justify-between text-[10px] font-bold font-mono text-slate-500 mb-1">
                    <span>TIẾN ĐỘ THIẾT LẬP:</span>
                    <span className="text-red-650">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-red-650 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              </div>

              {/* 7 step interactive list */}
              <div className="space-y-3">
                {[
                  {
                    num: 1,
                    title: 'Đăng Ký Thành Lập Hộ Kinh Doanh',
                    desc: 'Đăng ký trực tuyến thông qua Cổng Dịch vụ công hoặc thực hiện nộp trực tiếp tại Trung tâm hành chính công cấp quận/huyện, cấp xã/phường có thẩm quyền.',
                    note: '⚠️ Cá nhân chỉ được đăng ký tối đa 01 hộ kinh doanh trên phạm vị toàn quốc.'
                  },
                  {
                    num: 2,
                    title: 'Thủ Tục Đăng Ký Thuế Lần Đầu',
                    desc: 'Thực hiện song song đồng thời khi làm hồ sơ đăng ký hộ kinh doanh theo cơ chế mô hình liên thông "Một cửa" tiện lợi.',
                    note: '⚠️ Trường hợp cá nhân kinh doanh không thuộc diện bắt buộc đăng ký HKD thì phải tự đăng ký thuế trực tiếp với chi cục cơ quan thuế quản lý.'
                  },
                  {
                    num: 3,
                    title: 'Tải Ứng Dụng Thuế eTax Mobile',
                    desc: 'Lên kho ứng dụng CH Play hoặc App Store để tải app eTax Mobile chính thức của Tổng cục Thuế. Thực hiện đăng ký tài khoản giao dịch thuế điện tử.',
                    note: '🔐 Đăng nhập nhanh bằng tài khoản giao dịch số của Tổng cục Thuế hoặc liên thông bằng tài khoản VNeID cấp độ 2.'
                  },
                  {
                    num: 4,
                    title: 'Mở Tài Khoản Ngân Hàng Giao Dịch',
                    desc: 'Bắt buộc mở tài khoản ngân hàng riêng phục vụ riêng biệt cho dòng hoạt động kinh doanh để quản trị minh bạch, kê khai thuế thuận lợi.',
                    note: '👉 Thực hiện đăng ký thông báo số tài khoản / ví thanh toán điện tử cho cơ quan thuế bằng Mẫu số 01/BK-STK thông qua app eTax Mobile.'
                  },
                  {
                    num: 5,
                    title: 'Đăng Ký Sử Dụng Hóa Đơn Điện Tử (HĐĐT)',
                    desc: 'Xin cấp quyền sử dụng hóa đơn điện tử có mã của cơ quan Thuế để xuất giao cho khách hàng giao dịch mua bán sỉ/lẻ.',
                    note: '📊 Quy định ngưỡng: Doanh thu > 1 tỷ đồng/năm bắt buộc sử dụng HĐĐT. Từ 1 tỷ trở xuống được tự chọn đăng ký. Phải đăng ký trong vòng 30 ngày kể từ cuối kỳ doanh thu lũy kế vượt ngưỡng.'
                  },
                  {
                    num: 6,
                    title: 'Thiết Lập Ghi Sổ Sách Kế Toán',
                    desc: 'Triển khai chế độ ghi chép chứng từ kế toán, sổ sách chi tiết theo định hướng chuẩn mực tại Thông tư số 152/2025/TT-BTC ban hành mới nhất.',
                    note: '📚 Hộ kinh doanh phải lưu trữ, ghi đầy đủ thông tin báo cáo về dòng Thu nhập, tổng chi phí phát sinh và nghĩa vụ trích nộp ngân sách.'
                  },
                  {
                    num: 7,
                    title: 'Kê Khai & Nộp Thuế Đúng Hạn Quy Định',
                    desc: 'Nghĩa vụ đóng nộp được xác định cụ thể trên cơ sở doanh thu thực tế ghi nhận của đơn vị phát sinh trong kỳ tính thuế hằng năm.',
                    note: '🚀 Kê khai trực tuyến linh hoạt thông qua Ứng dụng eTax Mobile của Tổng cục hoặc qua trang https://dichvucong.gdt.gov.vn'
                  }
                ].map((step) => {
                  const isDone = !!completedSteps[step.num];
                  return (
                    <div 
                      key={step.num}
                      onClick={() => toggleStep(step.num)}
                      className={`p-3.5 rounded-xl border text-left transition duration-200 cursor-pointer flex gap-3 items-start select-none ${
                        isDone 
                          ? darkMode ? 'bg-emerald-950/20 border-emerald-900/60' : 'bg-emerald-50/40 border-emerald-200'
                          : darkMode ? 'bg-[#0f172a] border-zinc-800 hover:border-zinc-700' : 'bg-white border-slate-200 hover:border-slate-350 shadow-2xs'
                      }`}
                    >
                      <button className={`w-6 h-6 rounded-full font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5 border ${
                        isDone 
                          ? 'bg-emerald-500 text-white border-emerald-600'
                          : 'bg-red-100 text-red-650 border-red-200 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400'
                      }`}>
                        {isDone ? '✓' : step.num}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-xs font-black tracking-tight ${isDone ? 'line-through text-slate-400 dark:text-zinc-500' : darkMode ? 'text-zinc-250' : 'text-slate-800'}`}>
                            Bước {step.num}: {step.title}
                          </h4>
                          <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded font-mono ${
                            isDone ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 text-slate-500 dark:bg-zinc-800'
                          }`}>
                            {isDone ? 'Đã hoàn thành' : 'Cần làm'}
                          </span>
                        </div>
                        <p className={`text-[10px] mt-1 leading-normal ${darkMode ? 'text-zinc-400' : 'text-slate-650'}`}>
                          {step.desc}
                        </p>
                        <p className={`text-[10px] mt-1.5 font-bold font-mono pl-2 border-l border-orange-500/50 text-orange-550 dark:text-orange-400`}>
                          {step.note}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Threshold & Deadline Highlights (Image 1 Bottom Row) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Threshold card */}
                <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                  darkMode ? 'bg-zinc-950/40 border-stone-800' : 'bg-white border-slate-205 shadow-2xs'
                }`}>
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Ngưỡng doanh thu cần lưu ý đặc biệt</span>
                    <div className="mt-3 space-y-3">
                      <div className="flex items-start gap-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black font-mono tracking-wider ${
                          darkMode ? 'bg-emerald-950 text-emerald-350' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>Doanh thu ≤ 1 Tỷ/năm</span>
                        <p className="text-[11px] leading-snug">Không chịu thuế GTGT & không phải trích nộp đóng thuế TNCN.</p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black font-mono tracking-wider ${
                          darkMode ? 'bg-amber-950 text-amber-350' : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>Doanh thu &gt; 1 Tỷ/năm</span>
                        <p className="text-[11px] leading-snug">Bắt buộc khai nộp cả hai sắc thuế GTGT & TNCN theo mức quy định.</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[9.5px] mt-4 text-slate-400 dark:text-zinc-500 leading-normal pl-2.5 border-l-2 border-red-500 italic">
                    * Lưu ý: Hộ kinh doanh có phát sinh loại thuế đặc thù (Nhập khẩu, TTĐB, BVMT, Đất đai) thì áp dụng theo các luật thuế sắc biệt hành chính cụ thể.
                  </p>
                </div>

                {/* Deadlines card */}
                <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                  darkMode ? 'bg-zinc-950/40 border-stone-800' : 'bg-white border-slate-205 shadow-2xs'
                }`}>
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Thời hạn kê khai doanh thu HKD mới</span>
                    <div className="mt-3 space-y-2.5">
                      <div className="text-[11px] leading-relaxed">
                        <p className="font-extrabold text-blue-500">🗓️ Ra kinh doanh trong 6 tháng đầu năm:</p>
                        <p className="text-[11px] text-slate-650 dark:text-zinc-400 pl-3">
                          Báo cáo doanh thu theo <strong>Mẫu 01/TKN-CNKD</strong> 02 lần hằng năm: <br/>
                          - Lần 1: Chậm nhất ngày <span className="font-bold underline">31/07</span> cùng năm dương lịch. <br/>
                          - Lần 2: Chậm nhất ngày <span className="font-bold underline">31/01</span> năm dương lịch tiếp theo.
                        </p>
                      </div>
                      <div className="text-[11px] leading-relaxed">
                        <p className="font-extrabold text-teal-555">🗓️ Ra kinh doanh trong 6 tháng cuối năm:</p>
                        <p className="text-[11px] text-slate-650 dark:text-zinc-400 pl-3">
                          Thông báo tình hình doanh thu chậm nhất ngày <span className="font-bold underline">31/01</span> năm tiếp tuần dương lịch kế tiếp.
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] mt-3 font-mono font-bold text-red-505 bg-red-500/10 p-2 rounded text-center">
                    📢 ĐỌC KỸ: Nếu doanh thu lũy kế vượt 1 tỷ đồng, bắt buộc phải khai thuế ngay từ quý phát sinh sự kiện vượt ngưỡng đó.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOUSEHOLD BUSINESS CLASSIFICATION COMPLIANCE (NĐ 141 & TT 152) */}
          {activeTab === 'classification' && (
            <div className="space-y-4 animate-fade-in text-left">
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                darkMode ? 'bg-zinc-950/40 border-sky-950/50' : 'bg-emerald-50/20 border-emerald-100'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-600 text-white rounded-xl shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-tight text-emerald-600">
                      Bảng Phân Loại Hộ Kinh Doanh (Áp Dụng 2026/2027)
                    </h3>
                    <p className={`text-[11px] font-medium mt-0.5 ${darkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
                      Tuyệt đối tuân thủ theo <strong>Nghị định 141/2026/NĐ-CP</strong> và chế độ sổ sách Thông tư số <strong>152/2025/TT-BTC</strong>.
                    </p>
                  </div>
                </div>
                <div className="text-[10px] bg-red-500/10 text-red-500 font-bold px-2.5 py-1 rounded-md border border-red-500/20 text-center select-none font-mono">
                  Hỗ trợ eTax Mobile &amp; Sinh trắc học
                </div>
              </div>

              {/* Grid selectors */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
                {groups.map((group, idx) => {
                  const isHighlighted = selectedGroupIndex === idx;
                  return (
                    <div
                      key={group.index}
                      onClick={() => {
                        setSelectedGroupIndex(idx);
                        setClassDetailTab('info');
                      }}
                      className={`rounded-xl border transition-all duration-150 overflow-hidden text-left flex flex-col justify-between cursor-pointer ${
                        isHighlighted
                          ? 'ring-2 ring-red-500 scale-[1.01] shadow-xs border-transparent'
                          : 'hover:border-slate-350 dark:hover:border-zinc-700 shadow-3xs'
                      } ${
                        darkMode ? 'bg-[#0f172a] border-zinc-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className={`p-2.5 text-center font-black text-[11px] ${darkMode ? group.bgHeaderDark : group.bgHeader} tracking-tight uppercase`}>
                        {group.title}
                        <span className="block text-[9px] opacity-90 mt-0.5 font-bold font-mono">{group.scale}</span>
                      </div>
                      
                      <div className="p-3 space-y-2 text-[11px]">
                        <div className="flex justify-between items-center border-b pb-1 border-slate-100 dark:border-zinc-850">
                          <span className="text-slate-400">Thuế GTGT:</span>
                          <span className="font-bold text-amber-500">{group.index === 1 ? 'Miễn nộp' : 'Tính tỷ lệ %'}</span>
                        </div>
                        <div className="flex justify-between items-center border-b pb-1 border-slate-100 dark:border-zinc-850">
                          <span className="text-slate-400">Thuế TNCN:</span>
                          <span className="font-bold text-blue-500">{group.index === 1 ? 'Miễn nộp' : group.index === 2 ? 'Doanh Thu / 15%' : group.index === 3 ? 'Lợi nhuận × 17%' : 'Lợi nhuận × 20%'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Sổ sách:</span>
                          <span className="font-bold text-emerald-500">{group.index === 1 ? 'Sổ S1a' : group.index === 2 ? 'Sổ S2a / 4 Sổ' : 'Trọn bộ 4 Sổ'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Handbooks card details mapping Image 1, 2, 3 details */}
              <div className={`p-4 rounded-xl border ${
                darkMode ? 'bg-[#0c1322]/80 border-sky-950/45' : 'bg-slate-50 border-slate-200'
              }`}>
                {/* Panel head subtabs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 border-slate-200 dark:border-zinc-800 gap-3 mb-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-amber-500 text-black rounded uppercase">
                      Chuyên đề {selectedGroupIndex + 1}
                    </span>
                    <h4 className="font-extrabold text-[11.5px] uppercase tracking-tight text-slate-800 dark:text-zinc-200">
                      Nghề &amp; Pháp Lý {groups[selectedGroupIndex].scale}
                    </h4>
                  </div>

                  <div className="flex bg-slate-200/60 dark:bg-zinc-900 p-0.5 rounded-lg border text-[10.5px] font-bold">
                    <button
                      onClick={() => setClassDetailTab('info')}
                      className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                        classDetailTab === 'info' ? 'bg-amber-450 text-black font-extrabold' : 'text-slate-500 dark:text-zinc-400'
                      }`}
                    >
                      🛡️ Thuế &amp; Khai báo
                    </button>
                    <button
                      onClick={() => setClassDetailTab('books')}
                      className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                        classDetailTab === 'books' ? 'bg-amber-450 text-black font-extrabold' : 'text-slate-500 dark:text-zinc-400'
                      }`}
                    >
                      📘 Sổ gốc &amp; HĐĐT
                    </button>
                    <button
                      onClick={() => setClassDetailTab('calc')}
                      className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                        classDetailTab === 'calc' ? 'bg-amber-450 text-black font-extrabold' : 'text-slate-500 dark:text-zinc-400'
                      }`}
                    >
                      🧮 So sánh &amp; Tạm Tính
                    </button>
                  </div>
                </div>

                {/* Subtab content 1: Tax & declare */}
                {classDetailTab === 'info' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] leading-relaxed text-slate-600 dark:text-zinc-300">
                    <div className="p-3 bg-white dark:bg-zinc-950 border rounded-lg border-slate-150 dark:border-zinc-850">
                      <h5 className="font-black text-emerald-600 uppercase border-b pb-1 mb-2">1. Quy định Nghĩa vụ thuế</h5>
                      {selectedGroupIndex === 0 && (
                        <div className="space-y-1">
                          <p className="font-bold text-slate-800 dark:text-zinc-100">🎉 Miễn nộp Thuế GTGT &amp; TNCN hoàn toàn:</p>
                          <p>Ngưỡng miễn thuế được kéo rộng lên mức <strong>1 Tỷ đồng/Năm</strong> (trưng dụng theo chính sách cải cách thông tin mới 2026).</p>
                          <p className="bg-emerald-50 dark:bg-emerald-950/20 p-2 text-emerald-600 rounded text-[10.5px] font-semibold mt-1">✔️ Hành động: Yên tâm buôn bán, không sợ đóng thuế hằng tháng.</p>
                        </div>
                      )}
                      {selectedGroupIndex === 1 && (
                        <div className="space-y-1">
                          <p>Bắt buộc nộp thuế GTGT &amp; TNCN. Được lựa chọn 1 trong 2 cơ chế tính hữu dụng:</p>
                          <p>• <strong>Cơ chế 1 (Trên doanh thu):</strong> Thuế GTGT nộp toàn phần. Thuế TNCN nộp bằng: <span className="font-bold text-amber-500">(Doanh thu thực tế - 1 Tỷ) × tỷ lệ % TNCN ngành nghề</span>.</p>
                          <p>• <strong>Cơ chế 2 (Khoán theo Lập Sổ Chi Phí):</strong> Đóng thuế trực tiếp: <span className="font-bold text-pink-500">Lợi nhuận ròng (Doanh thu - Chi phí) × 15%</span>.</p>
                        </div>
                      )}
                      {selectedGroupIndex === 2 && (
                        <div className="space-y-1">
                          <p>Chính thức áp dụng thuế GTGT hằng quý. Thuế TNCN thu cố định kịch khung <span className="text-red-500 font-bold font-mono">17%</span> tính dựa trên Lợi nhuận thuần chịu thuế của cơ sở:</p>
                          <p className="p-2 bg-blue-50 dark:bg-zinc-900 border text-blue-600 rounded font-mono text-[10px] mt-1.5">Công thức: TNCN = (Doanh thu - Chi phí được khấu trừ hợp lý) × 17%</p>
                        </div>
                      )}
                      {selectedGroupIndex === 3 && (
                        <div className="space-y-1 font-semibold">
                          <p className="text-red-500">Nhóm siêu lớn chịu sự quản lý tương đồng khối Doanh nghiệp:</p>
                          <p>• Thuế GTGT tính theo tỷ lệ luật định tương ứng của mảng hoạt động.</p>
                          <p>• Thuế TNCN tính nộp cố định ở mức <span className="text-red-500 font-bold font-mono">20%</span> trực diện trên tổng thu nhập chịu thuế.</p>
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-white dark:bg-zinc-950 border rounded-lg border-slate-150 dark:border-zinc-850">
                      <h5 className="font-black text-rose-500 uppercase border-b pb-1 mb-2">2. Cách thức &amp; Thời hạn kê khai</h5>
                      {selectedGroupIndex === 0 && (
                        <div className="space-y-1.5">
                          <p>💡 <strong>Hình thức kê khai hằng năm:</strong> Nộp thông báo ước lượng doanh thu kèm <strong>Mẫu 01/TKN-CNKD</strong> muộn nhất ngày <strong>31/01 năm tiếp theo</strong>.</p>
                          <p>⚠️ <strong>Đối với hộ mới khởi sự:</strong> Nộp tờ khai 2 kỳ. Đợt 1 (6 tháng đầu năm) hạn chót là <strong>31/07</strong> và Đợt 2 (6 tháng cuối) hạn cuối <strong>31/01 năm sau</strong>.</p>
                          <p>📱 Gửi số tài khoản thanh toán và thông tin các ví điện tử giao dịch qua áp eTax Mobile hằng tuần.</p>
                        </div>
                      )}
                      {selectedGroupIndex === 1 && (
                        <div className="space-y-1.5">
                          <p>• <strong>Kê khai theo doanh thu:</strong> Kê khai và nộp tờ trình <strong>Mẫu 01/CNKD</strong> định kỳ hằng <strong>Quý</strong> trước ngày cuối cùng tháng đầu tiên quý sau.</p>
                          <p>• <strong>Kê khai theo chi phí thực tế:</strong> Khai tạm nộp thuế theo Quý (Mẫu 01/CNKD). Cuối năm thực hiện lập sớ Quyết toán cả năm thuế TNCN bằng <strong>Mẫu 02/CNKD-TNCN-QTT</strong> nộp chậm nhất ngày <strong>31/03 sang năm</strong>.</p>
                        </div>
                      )}
                      {selectedGroupIndex >= 2 && (
                        <div className="space-y-1.5">
                          <p>👉 Hạn nộp tờ trình kê khai giao dịch:</p>
                          <p>• <strong>Doanh thu 3-50 Tỷ:</strong> Nộp tờ trình thuế định kỳ theo từng <strong>Quý</strong>.</p>
                          <p>• <strong>Doanh thu trên 50 Tỷ:</strong> Bắt buộc kê khai định kỳ hằng <strong>Tháng</strong> để quản lý chặt chẽ.</p>
                          <p>⏳ Chậm nhất ngày <strong>31/03 hằng năm</strong>, buộc nộp Quyết toán QTT TNCN hằng năm (Mẫu 02/CNKD-TNCN-QTT).</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Subtab content 2: Books & invoices */}
                {classDetailTab === 'books' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] leading-relaxed text-slate-600 dark:text-zinc-350">
                    <div className="p-3 bg-white dark:bg-zinc-950 border rounded-lg border-slate-150 dark:border-zinc-850">
                      <h5 className="font-black text-sky-600 uppercase border-b pb-1 mb-2">📖 Chế độ Sổ sách Kế toán</h5>
                      {selectedGroupIndex === 0 && (
                        <p>Chỉ cần ghi duy nhất 01 quyển sổ: <strong>Sổ doanh thu (Mẫu S1a-HKD)</strong>. Không cần hạch toán kho hàng hay chi phí của cửa hàng.</p>
                      )}
                      {selectedGroupIndex === 1 && (
                        <>
                          <p>• <strong>Nếu tính thuế theo doanh thu:</strong> Ghi chép sổ doanh thu mua bán <strong>Mẫu S2a-HKD</strong> rút gọn.</p>
                          <p className="mt-1 bg-amber-500/10 p-2 rounded text-slate-500">• <strong>Nếu nộp thuế trên chi phí thực thế:</strong> Buộc duy trì và ghi chép hệ thống toàn diện <strong>4 quyển sổ kế toán: S2b, S2c, S2d, S2e</strong> nhằm đối chứng chi phí.</p>
                        </>
                      )}
                      {selectedGroupIndex >= 2 && (
                        <div className="space-y-1.5">
                          <p className="font-bold text-red-500">🚫 BẮT BUỘC KHÔNG NGOẠI LỆ 4 LOẠI SỔ KẾ TOÁN:</p>
                          <ul className="list-decimal pl-4">
                            <li><strong>S2b</strong> Sổ doanh thu bán lẻ</li>
                            <li><strong>S2c</strong> Sổ hạch toán chi phí đầu ra/đầu vào</li>
                            <li><strong>S2d</strong> Sổ phân loại tồn kho vật liệu hàng hóa</li>
                            <li><strong>S2e</strong> Sổ quản trị dòng tiền mặt sòng phẳng</li>
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-white dark:bg-zinc-950 border rounded-lg border-slate-150 dark:border-zinc-850">
                      <h5 className="font-black text-emerald-600 uppercase border-b pb-1 mb-2">🧾 Chế độ Hóa đơn Điện tử (HĐĐT)</h5>
                      {selectedGroupIndex === 0 && (
                        <p>Không ép buộc dập mã HĐĐT hằng tháng. Khi có khách yêu cầu lấy hóa đơn, lên chi cục thuế trực thuộc đăng ký xuất <strong>hóa đơn lẻ từng đợt lẻ</strong> (chịu nộp thuế phát sinh).</p>
                      )}
                      {selectedGroupIndex >= 1 && (
                        <div className="space-y-1.5">
                          <p>Bắt buộc kích hoạt dùng hóa đơn điện tử có mã liên thông trực tiếp.</p>
                          <div className="p-2 border border-amber-500/20 bg-amber-500/5 text-amber-600 rounded text-[10px] font-semibold">
                            ⚠️ <strong>Quy định Sinh trắc học &amp; Gương mặt:</strong> Thay đổi đại diện, đăng ký luồng xuất phải xác minh biometric và quét căn cước CCCD trực diện trên áp <strong>eTax Mobile</strong> để đề phòng rủi ro hóa đơn ảo.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Subtab content 3: Interactive Tax Calculator */}
                {classDetailTab === 'calc' && (
                  <div className="text-[11px] leading-relaxed text-slate-600 dark:text-zinc-350 bg-white dark:bg-zinc-950 p-3.5 border rounded-lg border-slate-200 dark:border-zinc-850">
                    
                    {/* CALCULATOR 1 */}
                    {selectedGroupIndex === 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-bold mb-1">Nhập ước toán doanh thu cả năm (VND):</label>
                          <div className="flex gap-1">
                            <input type="number" value={g1AnnRev} onChange={e => setG1AnnRev(e.target.value)} className="border rounded px-2 py-1 font-mono w-full dark:bg-zinc-900" />
                            <span className="font-bold self-center">đ</span>
                          </div>
                          <div className="mt-2.5 p-2 rounded bg-amber-500/5 border border-amber-500/10 font-bold block">
                            {parseFloat(g1AnnRev) <= 1000000000 ? (
                              <span className="text-emerald-500">🎉 MIỄN 100% THUẾ GTGT &amp; TNCN. Không nộp đồng nào!</span>
                            ) : (
                              <span className="text-red-500">⚠️ ĐÃ VƯỢT NGƯỠNG 1 TỶ! Bạn buộc phải nộp thuế theo mốc Nhóm 2.</span>
                            )}
                          </div>
                        </div>

                        <div className="p-2 bg-slate-50 dark:bg-zinc-900 rounded-lg">
                          <label className="font-bold block text-[10px] uppercase text-slate-500 border-b pb-1 mb-1.5">Kiểm nghiệm dòng dồn ép luỹ kế 4 Quý (Kinh phí vượt ngưỡng 1 Tỷ):</label>
                          <div className="grid grid-cols-4 gap-1.5">
                            <div><span className="text-[9px] font-bold">Q1 (Tr):</span><input type="number" value={parseFloat(g1Q1)/1000000} onChange={e => setG1Q1((parseFloat(e.target.value)*1000000).toString())} className="w-full text-center border p-0.5 font-mono dark:bg-zinc-905" /></div>
                            <div><span className="text-[9px] font-bold">Q2 (Tr):</span><input type="number" value={parseFloat(g1Q2)/1000000} onChange={e => setG1Q2((parseFloat(e.target.value)*1000000).toString())} className="w-full text-center border p-0.5 font-mono dark:bg-zinc-905" /></div>
                            <div><span className="text-[9px] font-bold">Q3 (Tr):</span><input type="number" value={parseFloat(g1Q3)/1000000} onChange={e => setG1Q3((parseFloat(e.target.value)*1000000).toString())} className="w-full text-center border p-0.5 font-mono dark:bg-zinc-905" /></div>
                            <div><span className="text-[9px] font-bold">Q4 (Tr):</span><input type="number" value={parseFloat(g1Q4)/1000000} onChange={e => setG1Q4((parseFloat(e.target.value)*1000000).toString())} className="w-full text-center border p-0.5 font-mono dark:bg-zinc-905" /></div>
                          </div>
                          {(() => {
                            const q1 = parseFloat(g1Q1) || 0;
                            const q2 = parseFloat(g1Q2) || 0;
                            const q3 = parseFloat(g1Q3) || 0;
                            const q4 = parseFloat(g1Q4) || 0;
                            const cumVal = [q1, q1+q2, q1+q2+q3, q1+q2+q3+q4];
                            const crossIdx = cumVal.findIndex(v => v > 1000000000);
                            return (
                              <p className="mt-2 text-[9.5px] leading-snug font-semibold text-slate-500">
                                {crossIdx !== -1 
                                  ? `⚠️ Lũy kế vượt ngưỡng 1 tỷ đồng tại Quý ${crossIdx+1} (Tổng: ${cumVal[crossIdx].toLocaleString('vi-VN')} đ). Kể từ quý này, bạn buộc chuyển hóa hạch toán sang Nhóm 2!`
                                  : `✔️ Hoàn hảo: Tổng cộng lũy kế cả năm ${(q1+q2+q3+q4).toLocaleString('vi-VN')} đ < 1 Tỷ. Bạn nộp báo cáo Mẫu 01 trước 31/01 năm sau miễn thuế hoàn toàn!`
                                }
                              </p>
                            );
                          })()}
                        </div>
                      </div>
                    )}

                    {/* CALCULATOR 2 */}
                    {selectedGroupIndex === 1 && (
                      <div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left mb-3">
                          <div className="sm:col-span-2">
                            <span className="text-[9px] font-bold text-slate-400">Chọn Ngành để tra cứu thuế GTGT &amp; TNCN:</span>
                            <select value={g2Sector} onChange={e => setG2Sector(e.target.value)} className="w-[100%] border p-1 text-[11px] rounded dark:bg-zinc-900 mt-0.5">
                              <option value="dist">Cung cấp hàng hóa sỉ/bán lẻ tiêu dùng (GTGT: 1% | TNCN: 0.5%)</option>
                              <option value="service">Dịch vụ, cơ khí xây lắp không cung thầu NVL (GTGT: 5% | TNCN: 2.0%)</option>
                              <option value="prod">Sản xuất lắp vận, lắp xây móng có mướn thầu NVL (GTGT: 3% | TNCN: 1.5%)</option>
                              <option value="rental">Cho thuê khách sạn bãi, bất động sản hữu hình (GTGT: 5% | TNCN: 5.0%)</option>
                              <option value="other">Tất cả ngành nghề thương mại hỗn hợp khác (GTGT: 2% | TNCN: 1.0%)</option>
                            </select>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-slate-400">Doanh thu năm (đ):</span>
                            <input type="number" value={g2Rev} onChange={e => setG2Rev(e.target.value)} className="border rounded p-1 font-mono w-full text-[11px] mt-0.5 dark:bg-zinc-900" />
                          </div>
                        </div>

                        {(() => {
                          const rev = parseFloat(g2Rev) || 0;
                          const exp = parseFloat(g2Expenses) || 0;
                          const rates: Record<string, { gtgt: number, tncn: number }> = {
                            dist: { gtgt: 0.01, tncn: 0.005 },
                            service: { gtgt: 0.05, tncn: 0.02 },
                            prod: { gtgt: 0.03, tncn: 0.015 },
                            rental: { gtgt: 0.05, tncn: 0.05 },
                            other: { gtgt: 0.02, tncn: 0.01 }
                          };
                          const rt = rates[g2Sector] || { gtgt: 0.01, tncn: 0.005 };
                          
                          const gtgtT = rev * rt.gtgt;
                          const tncnOnRev = Math.max(0, rev - 1000000000) * rt.tncn;
                          const totalOnRev = gtgtT + tncnOnRev;

                          return (
                            <div className="p-3 bg-slate-50 dark:bg-zinc-900 border rounded-lg">
                              <p className="font-extrabold text-[#0284c7] uppercase text-[10px]">Tạm tính dòng thuế theo Mẫu 01/CNKD Hà Nội:</p>
                              <div className="grid grid-cols-2 gap-3 mt-2 font-mono text-[10px]">
                                <div>
                                  <p className="font-bold underline text-slate-800 dark:text-white">Phương Pháp 1 (Kê khai Doanh Thu):</p>
                                  <p>• GTGT nộp: {gtgtT.toLocaleString('vi-VN')} đ</p>
                                  <p>• TNCN nộp: {tncnOnRev.toLocaleString('vi-VN')} đ <span className="text-[9px] text-slate-550">(Miễn 1 Tỷ ban đầu)</span></p>
                                  <p className="font-extrabold text-blue-600 mt-1">⚡ Tổng thuế: {totalOnRev.toLocaleString('vi-VN')} đ</p>
                                </div>
                                <div className="text-slate-500 leading-normal">
                                  <p className="font-bold underline text-slate-705 dark:text-zinc-350">Lợi ích kiểm định nghiệp vụ:</p>
                                  <p>Được tư vấn đề cử dùng <strong>Phương pháp 1</strong> bởi chế độ hóa đơn kế toán vô cùng thông thoáng gọn gàng (chỉ ghi chép duy nhất Sổ doanh thu S2a-HKD, không bao thấu thẩm định chi phí chứng từ).</p>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* CALCULATOR 3 & 4 */}
                    {selectedGroupIndex >= 2 && (
                      <div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left mb-3">
                          <div>
                            <span className="text-[9px] font-bold text-slate-400">Ngành nghề cốt lõi:</span>
                            <select value={g3Sector} onChange={e => setG3Sector(e.target.value)} className="w-full border p-1 rounded text-[11px] dark:bg-zinc-900 mt-0.5">
                              <option value="dist">Bán buôn, bán lẻ phân phối hàng hóa (GTGT: 1%)</option>
                              <option value="service">Dịch vụ, gia công thầu xây dựng không sắm thầu NVL (GTGT: 5%)</option>
                              <option value="prod">Sản xuất hàng hóa, thầu móng có mua sắm NVL (GTGT: 3%)</option>
                              <option value="other">Tất cả ngành nghề thương mại cơ khí khác (GTGT: 2%)</option>
                            </select>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-slate-400">Doanh thu năm (đ):</span>
                            <input type="number" value={g3Rev} onChange={e => setG3Rev(e.target.value)} className="border rounded p-1 font-mono w-full text-[11px] mt-0.5 dark:bg-zinc-900" />
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-slate-400">Chi phí hợp thức được trừ (đ):</span>
                            <input type="number" value={g3Expenses} onChange={e => setG3Expenses(e.target.value)} className="border rounded p-1 font-mono w-full text-[11px] mt-0.5 dark:bg-zinc-900" />
                          </div>
                        </div>

                        {(() => {
                          const rev = parseFloat(g3Rev) || 0;
                          const exp = parseFloat(g3Expenses) || 0;
                          const isG4 = selectedGroupIndex === 3;
                          const rateTNCN = isG4 ? 0.20 : 0.17;
                          
                          const rates: Record<string, number> = { dist: 0.01, service: 0.05, prod: 0.03, other: 0.02 };
                          const gtgtRate = rates[g3Sector] || 0.01;
                          
                          const gtgtT = rev * gtgtRate;
                          const netRent = Math.max(0, rev - exp);
                          const tncnT = netRent * rateTNCN;
                          const totalT = gtgtT + tncnT;

                          return (
                            <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg text-left">
                              <p className="font-extrabold text-red-650 uppercase text-[10px]">Kết quả tạm tính {isG4 ? 'Áp mức kịch khung 20%' : 'Áp biểu 17%'}:</p>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1.5 font-mono text-[10.5px]">
                                <div>• Thuế GTGT ({gtgtRate*100}%): <strong>{gtgtT.toLocaleString('vi-VN')} đ</strong></div>
                                <div>• Thuế TNCN ({rateTNCN*100}%): <strong>{tncnT.toLocaleString('vi-VN')} đ</strong></div>
                                <div className="text-emerald-600 font-extrabold">• Tổng thuế nộp: {totalT.toLocaleString('vi-VN')} đ</div>
                              </div>
                              <p className="mt-2 text-[9.5px] leading-relaxed text-slate-500 border-t pt-1.5 font-sans">
                                <strong>💡 Lời khuyên vàng:</strong> Hộ kinh doanh mốc to này buộc duy trì chế độ trọn vẹn <strong>4 sổ sách hạch toán nguyên bản</strong>. Ngoài ra, do tính chịu trách nhiệm vô hạn toàn bộ gia sản cá nhân của Hộ kinh doanh, khuyến nghị nên sớm làm bộ hồ sơ chuyển biến thành lập <strong>Công ty TNHH / Cổ phần</strong> để bảo toàn dòng tiền, tăng uy quyền xuất hóa đơn đỏ khấu trừ VAT 10% sòng phẳng cho các đối tác Doanh nghiệp lớn!
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                  </div>
                )}

              </div>
            </div>
          )}

          {/* TAB 3: HỘ KINH DOANH HAY DOANH NGHIỆP? (IMAGE 3) */}
          {activeTab === 'model_compare' && (
            <div className="space-y-5 animate-fade-in text-left">
              <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                darkMode ? 'bg-zinc-950/40 border-sky-950/50' : 'bg-orange-50/20 border-orange-100'
              }`}>
                <div className="p-3 bg-orange-600 text-white rounded-xl shrink-0">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-tight text-orange-650">
                    Nên Duy Trì Hộ Kinh Doanh Hay Chuyển Đổi Doanh Nghiệp?
                  </h3>
                  <p className={`text-[11px] font-medium mt-0.5 ${darkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
                    Nhận diện đúng mô hình giúp chủ hộ kinh doanh tối ưu thuế, bảo vệ tài sản và xây giá trị bền vững lâu dài.
                  </p>
                </div>
              </div>

              {/* Side-by-Side Comparison Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Keep Household Business */}
                <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                  darkMode ? 'bg-[#0f172a] border-emerald-950/60' : 'bg-emerald-50/25 border-emerald-200'
                }`}>
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-sm tracking-tight text-emerald-600 flex items-center gap-1.5 uppercase">
                      🟢 Nên tiếp tục duy trì Hộ Kinh Doanh khi:
                    </h4>
                    
                    <div className="space-y-3 mt-4 text-[11px]">
                      <div>
                        <p className="font-bold">👥 Tệp khách hàng chủ yếu là cá nhân (B2C):</p>
                        <p className="text-slate-600 dark:text-zinc-400 mt-0.5">Phù hợp mở cửa hàng bán lẻ, quán ăn nhỏ, salon spa, tiệm tạp hóa hoặc các đơn vị dịch vụ gia đình. Khách hàng hiếm khi yêu cầu lấy hóa đơn đầu ra VAT khấu trừ.</p>
                      </div>
                      <div>
                        <p className="font-bold">🌱 Quy mô hoạt động thực tế nhỏ gọn:</p>
                        <p className="text-slate-600 dark:text-zinc-400 mt-0.5">Doanh thu ở mức trung bình, nhân lực tận dụng người thân trong gia đình hoặc thuê ít nhân sự ngoài. Hoạt động độc lập, chưa cần nhu cầu gọi vốn dự án lớn.</p>
                      </div>
                      <div>
                        <p className="font-bold">💼 Muốn bộ máy bộ máy vận hành đơn giản nhất:</p>
                        <p className="text-slate-600 dark:text-zinc-400 mt-0.5">Mặc dù luật mới yêu cầu kiểm soát ghi chép sổ sách chặt chẽ hơn, nhưng nhìn chung hệ thống sổ sác, giấy tờ vẫn tinh giản hơn các loại hình doanh nghiệp rất nhiều.</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-[10px] italic font-mono text-emerald-600 dark:text-emerald-400 mt-4 border-t border-emerald-205 dark:border-emerald-900/40 pt-2 font-semibold">
                    💡 Thích hợp tích lũy nguồn lực nội tại thời kỳ đầu khởi sự.
                  </p>
                </div>

                {/* Move to Enterprise */}
                <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                  darkMode ? 'bg-[#0f172a] border-red-950/60' : 'bg-red-50/25 border-red-200'
                }`}>
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-sm tracking-tight text-red-600 flex items-center gap-1.5 uppercase">
                      🔴 Nên bắt tay chuyển thành Doanh Nghiệp khi:
                    </h4>

                    <div className="space-y-3 mt-4 text-[11px]">
                      <div>
                        <p className="font-bold font-mono">🏢 Đối tác giao dịch là Doanh nghiệp (B2B):</p>
                        <p className="text-slate-600 dark:text-zinc-400 mt-0.5">Yêu cầu khắt khe xuất hóa đơn điện tử GTGT khấu trừ 10%, mong muốn cơ sở có tư cách pháp nhân đầy đủ, năng lực cung ứng độc lập và thanh quyết toán minh bạch.</p>
                      </div>
                      <div>
                        <p className="font-bold">🛡️ Muốn bảo đảm an toàn, quản trị tài sản cá nhân:</p>
                        <p className="text-slate-600 dark:text-zinc-400 mt-0.5">Hộ kinh doanh phải chịu trách nhiệm vô hạn bằng <strong>toàn bộ tài sản cá nhân</strong> khi nợ nần. Doanh nghiệp (TNHH, Cổ phần) chỉ chịu trách nhiệm hữu hạn trong phạm vi vốn góp đã đăng ký.</p>
                      </div>
                      <div>
                        <p className="font-bold">🚀 Đã có sẵn kế hoạch bứt phá, mở rộng quy mô:</p>
                        <p className="text-slate-600 dark:text-zinc-400 mt-0.5">Lộ trình xây dựng hệ thống chuỗi cửa hàng, nhượng quyền, có nhu cầu vay vốn tín dụng hạn mức lớn, hoặc tham gia đấu thầu cung cấp.</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] italic font-mono text-red-600 dark:text-red-400 mt-4 border-t border-red-205 dark:border-red-900/45 pt-2 font-semibold">
                    💡 Đi trước đón đầu, chuyên nghiệp hóa bộ máy kế toán pháp lý.
                  </p>
                </div>
              </div>

              {/* Accounting "Coat" Guidelines */}
              <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                darkMode ? 'bg-zinc-950/40 border-stone-800' : 'bg-slate-50 border-slate-200 shadow-2xs'
              }`}>
                <h5 className="font-black text-xs uppercase tracking-tight text-slate-800 dark:text-zinc-200 mb-2">
                  👗 Chọn chế độ kế toán như chọn "Chiếc áo" phù hợp với Doanh nghiệp:
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-3.5">
                  <div className={`p-3 rounded-lg border text-left ${darkMode ? 'bg-zinc-900/60 border-zinc-800/80' : 'bg-white border-slate-200 shadow-3xs'}`}>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">Kịch bản 1: Giữ Hộ kinh doanh</p>
                    <p className="text-[10.5px] text-slate-500 dark:text-zinc-400 mt-1">Chế độ kế toán hộ kinh doanh <strong>Thông tư 152</strong>. Sổ sách ở mức tối giản, không cần thực hiện lập báo cáo tài chính hằng năm, tiết kiệm chi phí thuê chuyên viên.</p>
                  </div>
                  <div className={`p-3 rounded-lg border text-left ${darkMode ? 'bg-zinc-900/60 border-zinc-800/80' : 'bg-white border-slate-200 shadow-3xs'}`}>
                    <p className="font-bold text-blue-500">Kịch bản 2: Doanh nghiệp Siêu nhỏ</p>
                    <p className="text-[10.5px] text-slate-500 dark:text-zinc-400 mt-1">Sổ sách gọn nhẹ theo Thông tư riêng cho DN siêu nhỏ. Đầy đủ tư cách pháp nhân xuất hóa đơn đỏ, dễ nắm bắt quy tắc kế toán cơ bản.</p>
                  </div>
                  <div className={`p-3 rounded-lg border text-left ${darkMode ? 'bg-zinc-900/60 border-zinc-800/80' : 'bg-white border-slate-200 shadow-3xs'}`}>
                    <p className="font-bold text-purple-500">Kịch bản 3: DN Nhỏ và Vừa (SME)</p>
                    <p className="text-[10.5px] text-slate-500 dark:text-zinc-400 mt-1">Áp dụng Thông tư 133/200. Báo cáo tài chính chuẩn chỉ công khai, dễ dàng thuận tiện khi làm việc vay vốn Ngân hàng hoặc thu hút Nhà đầu tư đầu tư.</p>
                  </div>
                </div>
                <div className={`mt-3.5 p-3 rounded-lg flex items-center gap-2 text-[10.5px] ${
                  darkMode ? 'bg-[#1c2331] text-zinc-300' : 'bg-amber-50 text-slate-705 border border-amber-100'
                }`}>
                  <Info className="w-4 h-4 text-amber-505 shrink-0" />
                  <span>
                    <strong>Lời khuyên bách khoa:</strong> Đừng bao giờ chọn mô hình kinh doanh chỉ vì mục tiêu đóng thuế ít hơn. Hãy chọn mô hình giúp bạn làm việc thuận lợi với nhóm <strong>Khách hàng mục tiêu</strong> và kiểm soát tốt rủi ro tài chính của mình.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GUIDANCE ON BUSINESS LOCATION NOTIFICATION (IMAGE 2) */}
          {activeTab === 'location_noti' && (
            <div className="space-y-4 animate-fade-in text-left">
              <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                darkMode ? 'bg-zinc-950/40 border-sky-950/50' : 'bg-cyan-50/20 border-cyan-100'
              }`}>
                <div className="p-3 bg-cyan-600 text-white rounded-xl shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-tight text-cyan-650">
                    Hướng Dẫn Thông Báo Địa Điểm Kinh Doanh (Mới Nhất)
                  </h3>
                  <p className={`text-[11px] font-medium mt-0.5 ${darkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
                    Quy trình tuân thủ khai báo địa điểm mới thành lập, tạm dừng hoặc chấm dứt hoạt động đối với hộ và cá nhân kinh doanh.
                  </p>
                </div>
              </div>

              {/* Timeframe Warning Banner */}
              <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                darkMode ? 'bg-[#0f172a] border-amber-950/60' : 'bg-amber-50/50 border-amber-200'
              }`}>
                <AlertOctagon className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-xs uppercase tracking-tight text-amber-605">
                     Bắt buộc thông báo trong thời hạn luật định:
                  </h4>
                  <p className="text-[11.5px] font-bold text-red-500 mt-1 dark:text-red-400 font-mono">
                    ⏰ CHẬM NHẤT TRONG VÒNG 10 NGÀY LÀM VIỆC
                  </p>
                  <p className="text-[10.5px] text-slate-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                    Kể từ ngày địa điểm kinh doanh chính thức đi vào hoạt động, tạm ngừng hoạt động hoặc phát sinh sự kiện tương ứng quy định trong mẫu kê khai hành chính.
                  </p>
                </div>
              </div>

              {/* 5 cases of required notification */}
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase text-slate-400 dark:text-zinc-500 tracking-wider">
                  🔍 05 trường hợp bắt buộc phải nộp hồ sơ gửi cơ quan thuế:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {[
                    { title: '1. Thành lập mới', desc: 'Chủ động thông báo thiết lập địa điểm mới hỗ trợ mở rộng luồng bán hàng.', color: 'hover:border-emerald-500/50' },
                    { title: '2. Thay đổi thông tin', desc: 'Cập nhật thay đổi vị trí, diện tích hoạt động, ngành nghề kinh doanh.', color: 'hover:border-blue-500/50' },
                    { title: '3. Tạm ngừng', desc: 'Thông báo tạm dừng hoạt động kinh doanh tại địa điểm trong thời gian quy định.', color: 'hover:border-amber-500/50' },
                    { title: '4. Khôi phục sớm', desc: 'Khai báo mở cửa hoạt động lại trước thời hạn tạm ngừng đã đăng ký.', color: 'hover:border-cyan-500/50' },
                    { title: '5. Chấm dứt', desc: 'Đóng hẳn địa điểm, chấm dứt toàn bộ hoạt động kinh tế liên quan.', color: 'hover:border-red-500/50' },
                  ].map((item, idx) => (
                    <div 
                      key={idx}
                      className={`p-3 rounded-xl border text-left transition ${item.color} ${
                        darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-205 shadow-3xs'
                      }`}
                    >
                      <span className="block text-[11px] font-black uppercase tracking-tight text-red-505">{item.title}</span>
                      <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1 leading-normal">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Composition of document & submission methods */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                
                {/* File Composition */}
                <div className={`p-4 rounded-xl border text-left ${darkMode ? 'bg-zinc-950/40 border-stone-850' : 'bg-white border-slate-205 shadow-2xs'}`}>
                  <span className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Thành phần hồ sơ hồ sơ</span>
                  <div className="mt-3.5 space-y-3 text-[11px]">
                    <p className="font-extrabold text-blue-500 font-mono">📋 Mẫu biểu nộp:</p>
                    <p className="text-slate-650 dark:text-zinc-300 pl-2 leading-relaxed">
                      Sử dụng <strong>Mẫu số 01/TB-ĐĐKD</strong> ban hành chính thức kèm theo <strong>Thông tư số 18/2026/TT-BTC</strong> của Bộ Tài chính.
                    </p>
                    <p className="font-extrabold text-blue-500 font-mono">✍️ Nội dung quan trọng cần khai báo:</p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-500 dark:text-zinc-400 text-[10.5px]">
                      <li>Tên gọi và địa chỉ hoạt động của ĐĐKD.</li>
                      <li>Ngành học ngành nghề kinh doanh cùng ngày ra hoạt động.</li>
                      <li>Mã số thuế địa điểm (nếu đã được cấp phát).</li>
                      <li>Lưu ý: Nếu kinh doanh trên sàn TMĐT thì tích chọn đúng mục hướng dẫn.</li>
                    </ul>
                  </div>
                </div>

                {/* Place to Submit */}
                <div className={`p-4 rounded-xl border text-left ${darkMode ? 'bg-zinc-950/40 border-stone-850' : 'bg-white border-slate-205 shadow-2xs'}`}>
                  <span className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Phương thức &amp; Nơi tiếp nhận</span>
                  <div className="mt-3.5 space-y-3.5 text-[11px]">
                    <div>
                      <p className="font-extrabold text-teal-600">📍 Nơi nộp chính thức:</p>
                      <p className="text-slate-650 dark:text-zinc-300 pl-2 leading-relaxed mt-0.5">
                        Lưu ý cực kỳ đặc biệt: Trực tiếp nộp hồ sơ tại cơ quan quản lý nơi chủ hộ/cá nhân đặt <strong>Trụ sở chính</strong>. <br/>
                        <span className="text-red-500 font-bold dark:text-red-400">❌ Tuyệt đối KHÔNG nộp tại nơi đặt địa điểm kinh doanh.</span>
                      </p>
                    </div>
                    <div>
                      <p className="font-extrabold text-teal-600">💻 Cách thức thực hiện:</p>
                      <ul className="list-decimal pl-5 space-y-1 text-slate-500 dark:text-zinc-400 text-[10.5px] mt-0.5">
                        <li><strong>Trực tiếp:</strong> Mang lên Trung tâm hành chính công một cửa cấp huyện hoặc thông qua đường dịch vụ bưu chính.</li>
                        <li><strong>Trực tuyến:</strong> Kê khai nhanh qua Cổng dịch vụ công của cơ quan Thuế quản lý hoặc nộp nhanh trên app eTax Mobile.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Online submission benefits */}
                <div className={`p-4 rounded-xl border text-left flex flex-col justify-between ${
                  darkMode ? 'bg-zinc-950/40 border-stone-850' : 'bg-white border-slate-205 shadow-2xs'
                }`}>
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Lợi ích kê khai trực tuyến</span>
                    <div className="mt-3.5 space-y-3 text-[11px]">
                      <div className="flex items-start gap-2 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                        <p className="font-bold">Quy trình xử lý hồ sơ đơn giản, dễ theo dõi.</p>
                      </div>
                      <div className="flex items-start gap-2 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                        <p className="font-bold">Tiết kiệm công sức, hoàn toàn miễn phí giao dịch giấy tờ.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2.5 rounded bg-amber-500/10 text-amber-550 dark:text-amber-400 font-mono font-bold text-[10px] text-center mt-4">
                    📝 Cơ quan Thuế tỉnh khuyến khích các hộ, cá nhân chủ động rà soát, thông báo kịp thời đúng luật quy định!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: METHOD FOR BOOKKEEPING DOCUMENTS FOLDER FILING (IMAGE 4) */}
          {activeTab === 'document_file' && (
            <div className="space-y-4 animate-fade-in text-left">
              <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                darkMode ? 'bg-zinc-950/40 border-sky-950/50' : 'bg-rose-50/20 border-rose-100'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-rose-600 text-white rounded-xl shrink-0">
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-tight text-rose-605">
                      Cách Sắp Xếp Chứng Từ Kế Toán Khoa Học
                    </h3>
                    <p className={`text-[11px] font-medium mt-0.5 ${darkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
                      Kỹ năng tổ chức cấu trúc dữ liệu lưu giữ sổ sách chuẩn chỉ <strong>"Khoa học - Dễ tìm kiếm - Tránh thiếu hụt"</strong>.
                    </p>
                  </div>
                </div>

                {/* Filter and Search box inside folders */}
                <div className="relative w-full md:w-64">
                  <Search className={`absolute left-2.5 top-2 w-3.5 h-3.5 ${darkMode ? 'text-zinc-500' : 'text-slate-400'}`} />
                  <input
                    type="text"
                    value={docSearch}
                    onChange={(e) => setDocSearch(e.target.value)}
                    placeholder="Tìm nhanh thư mục chứng từ..."
                    className={`w-full text-[11px] pl-8 pr-7 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-rose-500 ${
                      darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-205 text-slate-800 placeholder-slate-400'
                    }`}
                  />
                  {docSearch && (
                    <button onClick={() => setDocSearch('')} className="absolute right-2.5 top-2.5 text-zinc-400">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Folders List Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocs.length > 0 ? (
                  filteredDocs.map((cat) => (
                    <div 
                      key={cat.id}
                      className={`p-4 rounded-xl border flex flex-col justify-between hover:scale-[1.01] transition duration-150 ${
                        darkMode 
                          ? 'bg-zinc-950 border-zinc-855 hover:border-zinc-700' 
                          : 'bg-white border-slate-200 hover:border-slate-350 shadow-3xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <FolderOpen className="w-4 h-4 text-amber-500 shrink-0" />
                          <h4 className="font-extrabold text-[12px] tracking-tight uppercase text-slate-950 dark:text-white">
                            {cat.title}
                          </h4>
                        </div>
                        <p className={`text-[10.5px] italic mb-3 font-medium leading-normal ${darkMode ? 'text-zinc-440' : 'text-slate-500'}`}>
                          {cat.desc}
                        </p>
                        
                        <div className="space-y-1.5">
                          {cat.elements.map((el, index) => (
                            <div key={index} className="flex items-start gap-1.5 text-[10.5px] leading-relaxed">
                              {el.startsWith('💡') || el.startsWith('⚠️') || el.startsWith('🔒') || el.startsWith('🔍') || el.startsWith('🔐') || el.startsWith('🏢') || el.startsWith('💻') ? (
                                <span className="pl-1 text-orange-600 dark:text-orange-400 font-bold">{el}</span>
                              ) : (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                  <p className={darkMode ? 'text-zinc-300' : 'text-slate-700'}>{el}</p>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer Badge of folder */}
                      <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-zinc-900 flex items-center justify-between text-[9px] font-mono uppercase font-bold text-slate-400 dark:text-zinc-500">
                        <span>FOLDER PHÁP QUY SỐ: {cat.id < 10 ? `0${cat.id}` : cat.id}</span>
                        <span className="text-emerald-500">Bảo mật</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-slate-400 dark:text-zinc-500 font-bold">
                    🚫 Không tìm thấy mục sắp xếp chứng từ khớp với từ khóa tìm kiếm.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: PROPERTY RENTAL TAX CALCULATIONS (CARRIED OVER AND ENHANCED) */}
          {activeTab === 'rental_tax' && (
            <div className="space-y-6 animate-fade-in text-left">
              {/* Main Header Card */}
              <div className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                darkMode ? 'bg-[#1e293b]/70 border-sky-900/45' : 'bg-gradient-to-r from-teal-50/30 to-emerald-50/15 border-emerald-100'
              }`}>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl shadow-md shrink-0">
                    <FileSpreadsheet className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-xs font-black tracking-widest bg-emerald-650 text-white px-2 py-0.5 rounded-full uppercase">
                      LUẬT THUẾ MỚI 2026/2027
                    </span>
                    <h3 className={`font-black text-base sm:text-xl uppercase tracking-tight mt-1.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      10 Điều Cần Lưu Ý Cho Thuê Bất Động Sản
                    </h3>
                    <p className={`text-[11px] sm:text-xs font-medium mt-1 ${darkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
                      Tổng hợp quy định pháp lý, mức giảm trừ thuế TNCN 1 Tỷ/năm &amp; Cơ chế tự kê khai trực tuyến.
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid of 10 points matching the exact infographic contents */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    num: 1,
                    title: "Bản chất Cho thuê BĐS & Tài sản",
                    icon: Building2,
                    badge: "Phân biệt",
                    color: "border-sky-500/30",
                    badgeColor: "bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300",
                    points: [
                      "Cho thuê BĐS: đất, nhà ở, mặt bằng, cửa hàng, văn phòng, kho xưởng...",
                      "Cho thuê tài sản: ô tô, xe máy, xà lan, máy móc thiết bị, loa đài...",
                      "Dịch vụ lưu trú: Khách sạn, nhà nghỉ, homestay, villa kèm phục vụ ăn uống..."
                    ],
                    note: "Mỗi loại hình có sắc thuế, thủ tục khai báo bổ trợ khác nhau."
                  },
                  {
                    num: 2,
                    title: "Sắc thuế áp dụng & Mức miễn nộp",
                    icon: Award,
                    badge: "Loại Thuế",
                    color: "border-emerald-500/30",
                    badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
                    points: [
                      "Doanh thu ≤ 1 Tỷ đồng/năm: Không phải nộp thuế GTGT & TNCN.",
                      "Doanh thu > 1 Tỷ đồng/năm: Bắt đầu chịu thuế suất quy định:",
                      "• Thuế GTGT = Doanh thu x 5%",
                      "• Thuế TNCN = (Doanh thu - 1 Tỷ đồng) x 5%"
                    ],
                    note: "Được áp dụng mức giảm trừ 1 Tỷ đồng thẳng trực tiếp cho Thuế TNCN."
                  },
                  {
                    num: 3,
                    title: "Ngưỡng phát sinh Kê khai thuế",
                    icon: CheckCircle2,
                    badge: "Nguyên tắc",
                    color: "border-purple-500/30",
                    badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300",
                    points: [
                      "Chỉ phải thực sự ĐÓNG thuế khi tổng doanh thu cả năm vượt trên 1 Tỷ đồng.",
                      "Tuy nhiên, nếu phát sinh hoạt động cho thuê BĐS: Vẫn BẮT BUỘC thực hiện làm hồ sơ kê khai thuế đầy đủ kể cả khi chưa đạt ngưỡng."
                    ],
                    note: "Tuyệt đối không nhầm lẫn giữa 'Kê khai' và 'Thực nộp'."
                  },
                  {
                    num: 4,
                    title: "Khai bằng MST Cá nhân trực tiếp",
                    icon: User,
                    badge: "Thủ tục",
                    color: "border-amber-500/30",
                    badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
                    points: [
                      "Được phép tự kê khai thẳng bằng mã số thuế cá nhân tiện lợi.",
                      "Không bắt buộc phải có mã số thuế hộ kinh doanh riêng biệt (Thay đổi vượt bậc so với các văn bản quy định trước năm 2025)."
                    ],
                    note: "Tinh giảm toàn bộ khâu đăng ký khai bổ sung rườm rà."
                  },
                  {
                    num: 5,
                    title: "Quản lý nhiều BĐS ở nhiều nơi",
                    icon: MapPin,
                    badge: "BĐS rải rác",
                    color: "border-blue-500/30",
                    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300",
                    points: [
                      "Tổng mức giảm trừ áp dụng cho Thuế TNCN tối đa là 1 Tỷ đồng/năm tính gộp chung.",
                      "Được linh hoạt phân bổ hạn mức cho 1 hoặc nhiều hợp đồng khác nhau.",
                      "Hợp đồng trước chưa trừ hết 1 tỷ thì chuyển tiếp sang hợp đồng sau."
                    ],
                    note: "Quản lý dữ liệu hệ thống tập trung theo mã định danh căn cước."
                  },
                  {
                    num: 6,
                    title: "Tính giảm trừ riêng biệt 2 mảng",
                    icon: Scale,
                    badge: "Độc lập",
                    color: "border-rose-500/30",
                    badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300",
                    points: [
                      "Vừa kinh doanh cửa hàng vừa cho nhà thuê được giảm trừ riêng?",
                      "ĐƯỢC. Mảng hộ kinh doanh áp dụng miễn thuế riêng theo ngưỡng quy mô.",
                      "Mảng cho thuê áp dụng mức giảm trừ 1 Tỷ đồng độc lập cho hoạt động thuê."
                    ],
                    note: "Không tính cộng gộp chồng chéo để làm thiệt hại phần của người nộp."
                  },
                  {
                    num: 7,
                    title: "Doanh nghiệp khai thay / nộp thay",
                    icon: ShieldAlert,
                    badge: "Ủy thác",
                    color: "border-teal-500/30",
                    badgeColor: "bg-teal-100 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300",
                    points: [
                      "Công ty thuê nhà có thể thay chủ nhà kê khai & đóng thuế.",
                      "Hợp đồng thuê bắt buộc phải ghi rõ điều khoản khai thay & nộp thay.",
                      "Lưu ý ghi nhận số tiền trừ TNCN & phân bổ cụ thể nếu có nhiều tài sản."
                    ],
                    note: "Đây là cách thức phổ biến nhất khi cá nhân cho tổ chức thuê văn phòng."
                  },
                  {
                    num: 8,
                    title: "Cổng kê khai & thành phần Hồ sơ",
                    icon: FileText,
                    badge: "Công nghệ",
                    color: "border-indigo-500/30",
                    badgeColor: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300",
                    points: [
                      "Thực hiện kê khai trực tuyến siêu nhanh tại Cổng Dịch vụ công Tổng cục Thuế hoặc app eTax Mobile.",
                      "Hồ sơ cơ bản: Tờ khai thuế, Phụ lục bảng kê chi tiết hợp đồng và Thông báo tài khoản/ví ngân hàng điện tử."
                    ],
                    note: "Xem và nộp tờ thuế điện tử, không cần xếp hàng tại chi cục."
                  },
                  {
                    num: 9,
                    title: "Lựa chọn Thời hạn Kê khai linh hoạt",
                    icon: Calendar,
                    badge: "Thời hạn",
                    color: "border-orange-500/30",
                    badgeColor: "bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300",
                    points: [
                      "Có thể chọn 1 trong 2 phương án tùy nhu cầu tài chính:",
                      "• Khai 2 lần/năm: Lần 1 trước 31/07; Lần 2 trước 31/01 năm sau.",
                      "• Khai gộp 1 lần hằng năm: Thời hạn chậm nhất 31/01 sang năm kế tiếp.",
                      "Tổ chức kinh doanh nộp thay: Theo thời hạn thanh toán hợp đồng."
                    ],
                    note: "Quá thời hạn khai báo sẽ bị phạt chậm nộp rất nặng theo Luật thuế."
                  },
                  {
                    num: 10,
                    title: "Xử lý Hợp đồng ký trước năm 2026",
                    icon: FolderOpen,
                    badge: "Chuyển tiếp",
                    color: "border-emerald-500/30",
                    badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
                    points: [
                      "Để được hưởng lợi từ quy định giảm trừ mới 1 Tỷ/năm:",
                      "• Hợp đồng phát sinh trước ngày 01/01/2026.",
                      "• Thời hạn còn hạn có hiệu lực trên 6 tháng kể từ khi quy định có hiệu lực.",
                      "Nộp thừa thuế sẽ được hoàn hoặc tự động cộng dồn bù trừ kỳ sau."
                    ],
                    note: "Hỗ trợ tuyệt vời cho các hợp đồng thuê văn phòng dài hạn."
                  }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={item.num}
                      className={`p-4 rounded-xl border flex flex-col justify-between text-left transition-all hover:translate-y-[-2px] ${item.color} ${
                        darkMode ? 'bg-[#18263e]/40' : 'bg-white shadow-2xs'
                      }`}
                    >
                      <div>
                        {/* Title group */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-red-600 text-white font-black text-[10px] flex items-center justify-center font-mono">
                              {item.num}
                            </span>
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                              {item.badge}
                            </span>
                          </div>
                          <Icon className={`w-4 h-4 ${darkMode ? 'text-teal-400' : 'text-emerald-600'}`} />
                        </div>

                        {/* Title text */}
                        <h4 className={`text-xs font-black tracking-tight mb-2.5 uppercase ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                          {item.title}
                        </h4>

                        {/* Points bullets */}
                        <ul className={`space-y-1.5 text-[11px] leading-relaxed mb-4 ${darkMode ? 'text-zinc-300' : 'text-slate-650'}`}>
                          {item.points.map((pt, id) => (
                            <li key={id} className="flex items-start gap-1.5">
                              <span className="text-emerald-500 shrink-0 mt-1">✓</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Footer Note */}
                      <div className={`p-2 rounded bg-opacity-40 text-[10px] font-medium leading-normal italic font-sans flex items-start gap-1.5 ${
                        darkMode ? 'bg-zinc-900 border border-zinc-800 text-zinc-400' : 'bg-slate-50 border border-slate-100 text-slate-550'
                      }`}>
                        <span className="text-amber-500 shrink-0">💡</span>
                        <span>{item.note}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* INTERACTIVE TAX CALCULATOR ACCORDING TO INFOGRAPHIC RULES */}
              {(() => {
                const priceVal = parseFloat(rentalRevenue) || 0;
                
                // Doanh thu <= 1 tỷ đồng/năm: không phải nộp thuế GTGT, không phải nộp thuế TNCN
                const exemptThreshold = 1000000000; // 1 Billion VND
                const isExempt = priceVal <= exemptThreshold;
                
                // GTGT Tax is 5% of total revenue if revenue > 1 billion
                const gtgtTaxVal = isExempt ? 0 : priceVal * 0.05;
                
                // TNCN Tax is 5% of (revenue - 1 billion) if revenue > 1 billion
                const tncnTaxVal = isExempt ? 0 : (priceVal - exemptThreshold) * 0.05;
                const totalTaxVal = gtgtTaxVal + tncnTaxVal;

                // Human readable text helper
                const getReadableVnd = (val: number) => {
                  if (val <= 0) return '0 đ';
                  if (val >= 1000000000) {
                    return `${(val / 1000000000).toFixed(2).replace(/\.00$/, '')} Tỷ đồng`;
                  }
                  if (val >= 1000000) {
                    return `${(val / 1000000).toFixed(1).replace(/\.0$/, '')} Triệu đồng`;
                  }
                  return `${val.toLocaleString('vi-VN')} đ`;
                };

                return (
                  <div className={`p-5 rounded-2xl border text-left ${
                    darkMode ? 'bg-zinc-950/70 border-sky-950/40 text-zinc-100' : 'bg-slate-50 border-slate-205 shadow-sm'
                  }`}>
                    <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-dashed border-slate-200 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-emerald-500 shrink-0" />
                        <h4 className="font-extrabold text-xs uppercase tracking-tight">
                          Công Cụ Tính Thuế Cho Thuê Bất Động Sản (Luật Mới)
                        </h4>
                      </div>
                      <span className="text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-500 px-2.5 py-0.5 rounded">
                        Mức giảm trừ 1 Tỷ TNCN
                      </span>
                    </div>

                    {/* Quick shortcuts presets */}
                    <div className="mb-4">
                      <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1.5">
                        Chọn nhanh doanh thu năm mô phỏng:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: '500 Triệu/năm (Miễn nộp)', val: 500000000 },
                          { label: '1.0 Tỷ/năm (Chạm ngưỡng)', val: 1000000000 },
                          { label: '1.2 Tỷ/năm', val: 1200000000 },
                          { label: '1.5 Tỷ/năm', val: 1.5 * 1000000000 },
                          { label: '2.0 Tỷ/năm', val: 2000000000 },
                          { label: '5.0 Tỷ/năm', val: 5000000000 }
                        ].map((preset) => (
                          <button
                            key={preset.val}
                            onClick={() => setRentalRevenue(preset.val.toString())}
                            className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg border cursor-pointer select-none transition-all ${
                              priceVal === preset.val
                                ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                                : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-slate-350 dark:hover:border-zinc-700'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-5 items-end">
                      <div className="flex-1 w-full">
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-zinc-500">
                            Tổng doanh thu từ hoạt động cho thuê trong năm (VND):
                          </label>
                          {priceVal > 0 && (
                            <span className="text-[10.5px] font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                              ≃ {getReadableVnd(priceVal)}
                            </span>
                          )}
                        </div>
                        <input
                          type="number"
                          placeholder="Nhập doanh thu năm tài khóa, Ví dụ: 1200000000 (1.2 tỷ)"
                          className={`w-full text-xs p-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-emerald-550 ${
                            darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-600' : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                          }`}
                          value={rentalRevenue}
                          onChange={(e) => setRentalRevenue(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Results analysis box */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5">
                      <div className={`p-4 rounded-xl border text-center ${darkMode ? 'bg-[#0f172a] border-zinc-800' : 'bg-white border-slate-200 shadow-3xs'}`}>
                        <span className="text-[9px] font-black uppercase text-slate-400 dark:text-zinc-500">
                          Thuế GTGT Trích Nộp (5%)
                        </span>
                        <p className="font-black text-emerald-600 dark:text-emerald-400 mt-2 text-md sm:text-lg">
                          {isExempt ? '0 đ (Miễn nộp)' : `${gtgtTaxVal.toLocaleString('vi-VN')} đ`}
                        </p>
                        <p className="text-[9px] text-slate-400 mt-1">
                          {isExempt ? 'Doanh thu ≤ 1 Tỷ/năm' : 'Công thức: Doanh thu × 5%'}
                        </p>
                      </div>

                      <div className={`p-4 rounded-xl border text-center ${darkMode ? 'bg-[#0f172a] border-zinc-800' : 'bg-white border-slate-200 shadow-3xs'}`}>
                        <span className="text-[9px] font-black uppercase text-slate-400 dark:text-zinc-500">
                          Thuế TNCN Trích Nộp (5%)
                        </span>
                        <p className="font-black text-sky-600 dark:text-sky-400 mt-2 text-md sm:text-lg">
                          {isExempt ? '0 đ (Miễn nộp)' : `${tncnTaxVal.toLocaleString('vi-VN')} đ`}
                        </p>
                        <p className="text-[9px] text-slate-400 mt-1">
                          {isExempt ? 'Doanh thu ≤ 1 Tỷ/năm' : 'Công thức: (Doanh thu - 1 Tỷ) × 5%'}
                        </p>
                      </div>

                      <div className={`p-4 rounded-xl border text-center ${
                        isExempt
                          ? darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'
                          : darkMode ? 'bg-emerald-950/20 border-emerald-900/40' : 'bg-emerald-100/10 border-emerald-200'
                      }`}>
                        <span className="text-[9px] font-black uppercase text-emerald-700 dark:text-emerald-300">
                          TỔNG CỘNG TIỀN THUẾ
                        </span>
                        <p className="font-black text-emerald-600 dark:text-emerald-500 mt-2 text-md sm:text-lg">
                          {totalTaxVal.toLocaleString('vi-VN')} đ
                        </p>
                        <p className="text-[9px] text-slate-400 mt-1 font-semibold">
                          {isExempt ? 'Không phát sinh tiền thuế' : 'Thuế GTGT + Thuế TNCN'}
                        </p>
                      </div>
                    </div>

                    {/* Step-by-Step Explanation Banner */}
                    {!isExempt && (
                      <div className={`mt-4 p-3.5 rounded-xl border text-xs leading-normal space-y-1.5 ${
                        darkMode ? 'bg-emerald-950/10 border-emerald-900/30 text-emerald-100/90' : 'bg-emerald-50/40 border-emerald-100 text-emerald-800'
                      }`}>
                        <p className="font-black uppercase tracking-wider text-[10px] flex items-center gap-1">
                          <span>📊 Chi tiết công thức tính thuế cho {getReadableVnd(priceVal)}:</span>
                        </p>
                        <div className="pl-3.5 space-y-1 font-mono text-[10.5px]">
                          <p>1. Thuế GTGT: {priceVal.toLocaleString('vi-VN')} đ × 5% = <span className="font-bold underline">{gtgtTaxVal.toLocaleString('vi-VN')} đ</span></p>
                          <p>2. Thuế TNCN: ({priceVal.toLocaleString('vi-VN')} đ - 1,000,000,000 đ) × 5% = <span className="font-bold underline">{tncnTaxVal.toLocaleString('vi-VN')} đ</span></p>
                          <p>3. Tổng cộng thực hiện nộp: {gtgtTaxVal.toLocaleString('vi-VN')} đ + {tncnTaxVal.toLocaleString('vi-VN')} đ = <span className="font-bold underline text-md">{totalTaxVal.toLocaleString('vi-VN')} đ</span></p>
                        </div>
                      </div>
                    )}

                    <p className="text-[10px] text-slate-500 dark:text-zinc-500 mt-3.5 italic font-semibold leading-normal pl-2 border-l border-emerald-500">
                      {isExempt 
                        ? '💡 Lưu ý: Hệ thống tính theo quy định miễn thuế cho doanh thu từ hoạt động cho thuê nhà, bất động sản và các tài sản khác có tổng mức phát sinh tối đa trong năm 1 Tỷ đồng trở xuống. Khi đạt mốc này hoàn toàn không phát sinh nghĩa vụ trích nộp.'
                        : `💡 Lưu ý: Với tổng doanh thu vượt 1 tỷ đồng/năm, phần Thuế GTGT tính trên toàn bộ doanh thu, trong khi Thuế TNCN được hưởng mức giảm trừ trừ thẳng 1 tỷ đồng, tối ưu hóa lợi ích tài chính của cá nhân cho thuê hợp quy.`
                      }
                    </p>
                  </div>
                );
              })()}

            <div className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                darkMode ? 'bg-zinc-950 border-zinc-850 text-zinc-300' : 'bg-amber-50/40 border-amber-205 text-slate-705'
              }`}>
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-emerald-600 dark:text-emerald-400">🏢 Trường hợp Tổ chức/Doanh nghiệp nộp thay thuế:</p>
                  <p className="text-[11px] mt-0.5 font-medium">Nếu có thỏa thuận thỏa đáng trong hợp đồng về việc Doanh nghiệp đi thuê nộp thay thuế cho cá nhân, Doanh nghiệp của bạn sẽ thực hiện kê khai theo <strong>thời hạn thanh toán tiền thuê</strong> định kỳ quy định trên văn bản ký kết.</p>
                </div>
              </div>

              {/* Calculator Panel */}
              {(() => {
                const priceVal = parseFloat(rentalRevenue) || 0;
                const isExempt = priceVal <= 100000000;
                // Tax rates for property rental in Vietnam are: GTGT: 5%, TNCN: 5% (Total 10% on rental revenue if > 100 million/year)
                const gtgtTaxVal = isExempt ? 0 : priceVal * 0.05;
                const tncnTaxVal = isExempt ? 0 : priceVal * 0.05;
                const totalTaxVal = gtgtTaxVal + tncnTaxVal;

                return (
                  <div className={`p-4 rounded-xl border text-left ${
                    darkMode ? 'bg-zinc-950/55 border-zinc-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <h5 className="font-bold text-xs uppercase tracking-tight mb-3 flex items-center gap-1.5">
                      <Calculator className="w-4 h-4 text-emerald-505" />
                      <span>Công cụ tính nhanh Thuế Cho Thuê Tài Sản</span>
                    </h5>
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                      <div className="flex-1 w-full">
                        <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-zinc-500 mb-1">
                          Tổng doanh thu nhận từ hoạt động cho thuê trong năm (VND):
                        </label>
                        <input
                          type="number"
                          placeholder="Nhập doanh thu năm tài khóa, Ví dụ: 120000000"
                          className={`w-full text-xs p-2.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-emerald-550 ${
                            darkMode ? 'bg-zinc-900 border-zinc-805 text-zinc-150' : 'bg-white border-slate-250 text-slate-800'
                          }`}
                          value={rentalRevenue}
                          onChange={(e) => setRentalRevenue(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Results table */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4 text-[11px]">
                      <div className={`p-3 rounded-lg border text-center ${darkMode ? 'bg-[#0f172a] border-zinc-90 w-full' : 'bg-white border-slate-200 shadow-3xs'}`}>
                        <span className="text-[9px] font-black uppercase text-slate-400 dark:text-zinc-500">Thuế GTGT Trích Nộp (5%):</span>
                        <p className="font-extrabold text-emerald-600 dark:text-emerald-400 mt-1.5 text-md">
                          {isExempt ? '0đ (Miễn nộp)' : `${gtgtTaxVal.toLocaleString('vi-VN')} đ`}
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg border text-center ${darkMode ? 'bg-[#0f172a] border-zinc-90 w-full' : 'bg-white border-slate-200 shadow-3xs'}`}>
                        <span className="text-[9px] font-black uppercase text-slate-400 dark:text-zinc-500">Thuế TNCN Trích Nộp (5%):</span>
                        <p className="font-extrabold text-sky-600 dark:text-sky-400 mt-1.5 text-md">
                          {isExempt ? '0đ (Miễn nộp)' : `${tncnTaxVal.toLocaleString('vi-VN')} đ`}
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg border text-center w-full ${darkMode ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-100' : 'bg-emerald-500/10 border-emerald-200'}`}>
                        <span className="text-[9px] font-black uppercase text-emerald-700 dark:text-emerald-300">Tổng cộng Sắc Thuế và Phí:</span>
                        <p className="font-black text-emerald-600 dark:text-emerald-400 mt-1.5 text-md">
                          {totalTaxVal.toLocaleString('vi-VN')} đ
                        </p>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-500 dark:text-zinc-500 mt-3 italic font-semibold leading-normal pl-2 border-l border-emerald-500">
                      {isExempt 
                        ? '💡 Thuế cho thuê tài sản: Chỉ áp dụng đối với cá nhân có tổng doanh thu từ hoạt động cho thuê nhà, tài sản vượt quá 100 Tr đồng trong năm dương lịch. Trường hợp ở mức này, được hoàn toàn miễn đóng.'
                        : '💡 Thuế cho thuê tài sản: Với doanh thu trên 100 triệu/năm, mức trích nộp đóng là 10% tổng thu (với tỷ lệ GTGT: 5% và TNCN: 5%), tuyệt đối không trừ giảm gia cảnh.'
                      }
                    </p>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 7: TAX FILING DELAYS DICTIONARY (CARRIED OVER - IMAGE 5 RELEVANT) */}
          {activeTab === 'penalties' && (
            <div className="space-y-4 animate-fade-in text-left">
              
              {/* Table search bar */}
              <div className="relative">
                <Search className={`absolute left-3 top-2.5 w-4 h-4 ${darkMode ? 'text-zinc-500' : 'text-slate-400'}`} />
                <input
                  type="text"
                  value={penaltySearch}
                  onChange={(e) => setPenaltySearch(e.target.value)}
                  placeholder="Tra cứu nhanh vi phạm muộn tờ khai thuế: quá hạn 30 ngày, 90 ngày, phụ lục, phạt cảnh cáo..."
                  className={`w-full text-xs pl-9 pr-8 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors ${
                    darkMode 
                      ? 'bg-zinc-950 border-zinc-850 text-zinc-150 placeholder-zinc-650' 
                      : 'bg-slate-50/50 border-slate-202 text-slate-900 placeholder-slate-400'
                  }`}
                />
                {penaltySearch && (
                  <button 
                    onClick={() => setPenaltySearch('')}
                    className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-155 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Table rendering penalties code */}
              <div className="overflow-x-auto rounded-xl border border-slate-150 dark:border-zinc-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className={`${
                      darkMode ? 'bg-zinc-950 text-zinc-350 border-b border-zinc-805' : 'bg-slate-50 text-slate-650 border-b border-slate-150'
                    } font-black uppercase text-[10px] tracking-wider`}>
                      <th className="p-3 text-center w-12">STT</th>
                      <th className="p-3 w-1/2">Hành vi vi phạm liên quan đến thời hạn</th>
                      <th className="p-3 w-1/4">Hình thức &amp; Mức xử lý phạt</th>
                      <th className="p-3 w-1/4">Biện pháp điều trị khắc phục</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-zinc-800">
                    {filteredPenalties.length > 0 ? (
                      filteredPenalties.map((item) => (
                        <tr 
                          key={item.stt}
                          className={`transition-colors leading-relaxed ${
                            darkMode ? 'hover:bg-zinc-900/45 text-zinc-300' : 'hover:bg-slate-50/60 text-slate-700'
                          }`}
                        >
                          <td className="p-3.5 text-center font-bold">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white font-extrabold text-[11px] shadow-xs mx-auto animate-pulse">
                              {item.stt}
                            </div>
                          </td>
                          <td className="p-3.5 font-semibold text-[11px] max-w-xs sm:max-w-md">
                            <p className={item.stt === 4 ? '' : 'text-slate-900 dark:text-zinc-100 font-extrabold'}>
                              {item.behavior}
                            </p>
                          </td>
                          <td className="p-3.5">
                            <div className="space-y-1">
                              <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-black tracking-wide uppercase ${item.badgeColor}`}>
                                {item.penaltyType}
                              </span>
                              <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono italic">
                                {item.penaltyDesc}
                              </p>
                            </div>
                          </td>
                          <td className="p-3.5 text-[10.5px] text-slate-600 dark:text-zinc-400 font-medium">
                            <div className="flex items-start gap-1">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-505 shrink-0 mt-0.5" />
                              <span>{item.consequence}</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-10 text-center text-slate-500 dark:text-zinc-400 font-bold">
                          🚫 Không có quy chế xử phạt trùng khớp với yêu cầu của bạn.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="text-right text-[10px] text-slate-400 dark:text-zinc-500 font-mono italic">
                * Lưu ý: Mức phạt quy đổi áp dụng trên đây cho Cá nhân/Hộ kinh doanh. Với các Tổ chức doanh nghiệp, mức tiền phạt gấp đôi tương ứng.
              </div>
            </div>
          )}

          {/* TAB 8: LABOR RECRUITMENT AND REPORTING (IMAGE 3 RELEVANT) */}
          {activeTab === 'labor_penalties' && (
            <div className="space-y-4 animate-fade-in text-left">
              <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                darkMode ? 'bg-zinc-950/40 border-sky-950/50' : 'bg-red-50/20 border-red-100'
              }`}>
                <div className="p-3 bg-red-650 text-white rounded-xl shrink-0">
                  <Gavel className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-tight text-red-650">
                    Mức Xử Phạt Chậm Nộp Báo Cáo Tình Hình Lao Động
                  </h3>
                  <p className={`text-[11px] font-medium mt-0.5 ${darkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
                    Quy chế hành chính xử phạt nghiêm khắc đối với hành vi nộp chậm báo cáo nhân lực thay đổi định kỳ hằng năm.
                  </p>
                </div>
              </div>

              {/* Decree definitions details based on image 3 */}
              <div className={`p-4 rounded-xl border text-left flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                darkMode ? 'bg-[#0f172a] border-sky-905/40' : 'bg-[#f7fafc] border-slate-205 shadow-3xs'
              }`}>
                <div className="space-y-1.5 flex-1 text-xs">
                  <h4 className="font-black uppercase text-slate-800 dark:text-zinc-200">
                     Hành vi chậm trễ (Nghị định 12/2022/NĐ-CP)
                  </h4>
                  <p className="text-slate-600 dark:text-zinc-300 leading-relaxed pr-2">
                    Cơ sở kinh tế không nộp thông báo khai trình hoặc báo cáo thay đổi lao động trước thời hạn theo quy định sẽ bị áp dụng chế tài tiền mặt cụ thể:
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 shrink-0 w-full md:w-auto">
                  <div className={`p-3.5 rounded-lg border text-center ${darkMode ? 'bg-zinc-950/65' : 'bg-white'}`}>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-extrabold block">Tài khoản cá nhân / HKD:</span>
                    <span className="text-sm font-black text-rose-500 block mt-1">Từ 5.000.000đ - 10.000.000đ</span>
                  </div>
                  <div className={`p-3.5 rounded-lg border text-center ${darkMode ? 'bg-zinc-950/65' : 'bg-white'}`}>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-extrabold block">Tổ chức Doanh nghiệp:</span>
                    <span className="text-sm font-black text-rose-550 block mt-1">Từ 10.000.000đ - 20.000.000đ</span>
                  </div>
                </div>
              </div>

              {/* Exact Rules table */}
              <div className="overflow-x-auto rounded-xl border border-slate-150 dark:border-zinc-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className={`${
                      darkMode ? 'bg-zinc-950 text-zinc-350 border-b border-zinc-800' : 'bg-slate-50 text-slate-650 border-b border-slate-150'
                    } font-black uppercase text-[10px] tracking-wider`}>
                      <th className="p-3 text-center w-12">Hạng mục</th>
                      <th className="p-3 w-1/3">Nội dung hành vi vi phạm</th>
                      <th className="p-3">Hộ kinh doanh / Cá nhân</th>
                      <th className="p-3">Doanh nghiệp / Tổ chức</th>
                      <th className="p-3">Mốc thời hạn chuẩn</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-zinc-800 leading-relaxed">
                    <tr className={darkMode ? 'hover:bg-zinc-900/20 text-zinc-300' : 'hover:bg-slate-50/50 text-slate-700'}>
                      <td className="p-3 text-center font-bold font-mono">01</td>
                      <td className="p-3 font-semibold text-[11px]">
                        <span className="text-red-500 font-black">Chậm nộp hoặc không nộp</span> văn bản báo cáo tình hình thay đổi nhân sự lao động định kỳ (Theo khoản 2 Điều 8).
                      </td>
                      <td className="p-3">
                        <span className="inline-block text-[10px] px-2.5 py-1 bg-amber-100 text-amber-850 dark:bg-amber-950 dark:text-amber-300 rounded font-black">
                          5.000.000đ - 10.000.000đ
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="inline-block text-[10px] px-2.5 py-1 bg-rose-100 text-rose-850 dark:bg-rose-950 dark:text-rose-305 rounded font-black">
                          10.000.000đ - 20.000.000đ
                        </span>
                      </td>
                      <td className="p-3 text-[11px] text-slate-500 dark:text-zinc-400 font-mono leading-tight whitespace-nowrap">
                        📅 Định kỳ trước <strong className="text-blue-500">05/06</strong> (6T đầu năm)<br/>
                        📅 Định kỳ trước <strong className="text-blue-500">05/12</strong> (6T cuối năm)
                      </td>
                    </tr>
                    <tr className={darkMode ? 'hover:bg-zinc-900/20 text-zinc-300' : 'hover:bg-slate-50/50 text-slate-700'}>
                      <td className="p-3 text-center font-bold font-mono">02</td>
                      <td className="p-3 font-semibold text-[11px]">
                        Không thực hiện khai trình tình hình nhân sự với cơ quan Nhà nước đúng thời hạn kể từ ngày đi vào hoạt động (Khoản 1 Điều 8).
                      </td>
                      <td className="p-3">
                        <span className="inline-block text-[10px] px-2.5 py-1 bg-orange-100 text-orange-850 dark:bg-orange-950 dark:text-orange-300 rounded font-bold">
                          1.000.000đ - 3.000.000đ
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="inline-block text-[10px] px-2.5 py-1 bg-rose-50 text-rose-800 dark:bg-rose-955/35 dark:text-rose-300 rounded font-bold">
                          2.000.000đ - 6.000.000đ
                        </span>
                      </td>
                      <td className="p-3 text-[11px] text-slate-500 dark:text-zinc-400 font-mono font-medium">
                        📅 Trong thời hạn <strong className="text-blue-500">30 ngày</strong> kể từ khi bắt đầu tuyển dụng.
                      </td>
                    </tr>
                    <tr className={darkMode ? 'hover:bg-zinc-900/20 text-zinc-300' : 'hover:bg-slate-50/50 text-slate-705'}>
                      <td className="p-3 text-center font-bold font-mono">03</td>
                      <td className="p-3 font-semibold text-[11px]">
                        Lập sổ quản lý lao động nhưng không lưu trữ tại nơi làm việc, nội dung sổ thiếu mẫu thông tin bắt buộc theo Luật.
                      </td>
                      <td className="p-3">
                        <span className="inline-block text-[10px] px-2.5 py-1 bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-zinc-300 rounded font-medium">
                          1.000.000đ - 3.000.000đ
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="inline-block text-[10px] px-2.5 py-1 bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-zinc-300 rounded font-medium">
                          2.000.000đ - 6.000.000đ
                        </span>
                      </td>
                      <td className="p-3 text-[11px] text-slate-500 dark:text-zinc-400 font-mono font-medium">
                        📂 Tiếp đón ban thanh kiểm tra lao động đột xuất.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Online submission info helper */}
              <div className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
                darkMode ? 'bg-zinc-950 border-zinc-900 text-zinc-400' : 'bg-slate-50 text-slate-650 hover:bg-slate-100/40 border-slate-205'
              }`}>
                <Info className="w-4.5 h-4.5 text-sky-505 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-slate-850 dark:text-zinc-200">🔍 Cổng dịch vụ công trực tiếp báo cáo:</p>
                  <p className="text-[11px] mt-0.5">Báo cáo lao động thay đổi định kỳ được các cơ sở gửi online trực tiếp qua **Cổng dịch vụ công Quốc gia** (<em>dichvucong.gov.vn</em>) hoặc được nộp liên thông trực tiếp hệ thống với cơ quan BHXH tỉnh thành. Bộ phận ĐLT cần giám sát chuẩn hai cột mốc vàng (<strong>05/06</strong> và <strong>05/12</strong>) hằng năm.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: TAX-DEBT EXIT RESTRICTIONS TRAVEL SUSPENSION (IMAGE 5) */}
          {activeTab === 'travel_ban' && (
            <div className="space-y-4 animate-fade-in text-left">
              <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                darkMode ? 'bg-zinc-950/40 border-sky-950/50' : 'bg-red-50/20 border-red-100'
              }`}>
                <div className="p-3 bg-red-650 text-white rounded-xl shrink-0">
                  <Plane className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-tight text-red-655">
                     Tạm Hoãn Xuất Cảnh Do Nợ Thuế (Nghị định 49/2025/NĐ-CP)
                  </h3>
                  <p className={`text-[11px] font-medium mt-0.5 ${darkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
                    Quy chế hoãn xuất cảnh do nợ đọng ngân sách ban hành có hiệu lực chính thức từ ngày <strong>28/02/2025</strong>.
                  </p>
                </div>
              </div>

              {/* Debt Threshold metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Individual threshold */}
                <div className={`p-4 rounded-xl border flex items-start gap-4 ${
                  darkMode ? 'bg-[#0f172a] border-amber-950/70' : 'bg-amber-50/15 border-amber-205 shadow-3xs'
                }`}>
                  <div className="p-3 rounded-full bg-amber-500/10 text-amber-500 shrink-0">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 dark:text-zinc-500 tracking-wider">Cá nhân &amp; Chủ Hộ Kinh Doanh</span>
                    <h4 className="text-md font-black text-red-500 mt-1 dark:text-red-400 font-mono">
                      🔴 NỢ THUẾ TỪ 50 TRIỆU ĐỒNG TRỞ LÊN
                    </h4>
                    <p className="text-[10.5px] text-slate-500 dark:text-zinc-400 mt-1 leading-normal">
                      Và đã quá thời hạn trích nộp đóng thuế quy định trên <strong>120 ngày liên tục</strong>.
                    </p>
                  </div>
                </div>

                {/* Company legal representative threshold */}
                <div className={`p-4 rounded-xl border flex items-start gap-4 ${
                  darkMode ? 'bg-[#0f172a] border-red-950/70' : 'bg-red-50/15 border-red-205 shadow-3xs'
                }`}>
                  <div className="p-3 rounded-full bg-red-500/10 text-red-600 shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 dark:text-zinc-500 tracking-wider">Người Đại Diện Pháp Luật DN (Doanh Nghiệp)</span>
                    <h4 className="text-md font-black text-red-600 mt-1 dark:text-red-400 font-mono">
                      🔴 NỢ THUẾ TỪ 500 TRIỆU ĐỒNG TRỞ LÊN
                    </h4>
                    <p className="text-[10.5px] text-slate-500 dark:text-zinc-400 mt-1 leading-normal">
                      Và đã quá thời hạn hoàn thành nghĩa vụ trích nộp tiền thuế trên <strong>120 ngày liên tục</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Self-run status / missing address case */}
              <div className={`p-4 rounded-xl border ${
                darkMode ? 'bg-zinc-950 border-stone-850' : 'bg-slate-50/50 border-slate-205'
              }`}>
                <h4 className="font-extrabold text-xs uppercase tracking-tight mb-2.5 text-slate-905 dark:text-zinc-200">
                  ⚠️ Các trường hợp đặc khu áp dụng ngặt nghèo khác:
                </h4>
                <ul className="list-decimal pl-5 space-y-2 text-[11px] leading-relaxed text-slate-600 dark:text-zinc-400">
                  <li>
                    <strong>Tự ý dời bỏ địa điểm kinh doanh:</strong> Cá nhân/chủ hộ kinh doanh hoặc người đại diện pháp luật không còn hoạt động tại địa điểm hành chính đã đăng ký với Thuế, nhưng vẫn đang treo nợ đính kèm quá hạn.
                  </li>
                  <li>
                    <strong>Người xuất cảnh định cư ở nước ngoài:</strong> Cá nhân là người Việt Nam ra định cư hoặc là người nước ngoài dời Việt Nam mà chưa tất toán hết toàn bộ nghĩa vụ thuế nợ đọng.
                  </li>
                </ul>
              </div>

              {/* Exit Restriction Process - 3 steps and cancel steps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Restriction Flow */}
                <div className={`p-4 rounded-xl border text-left ${darkMode ? 'bg-zinc-950/40 border-stone-850' : 'bg-white border-slate-205'}`}>
                  <span className="text-[10px] font-black uppercase text-slate-450 tracking-wider border-b pb-1.5 block">Quy trình áp dụng hoãn xuất cảnh</span>
                  <div className="mt-3.5 space-y-3 text-[11px] leading-relaxed">
                    <div className="flex gap-2">
                      <span className="w-5 h-5 rounded-full bg-red-650 text-white font-extrabold flex items-center justify-center text-[10px] shrink-0 font-mono">1</span>
                      <p><strong>Cơ quan Thuế rà soát:</strong> Phát hiện nợ đọng vượt ngưỡng 50Tr/500Tr quá hạn trên 120 ngày.</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="w-5 h-5 rounded-full bg-red-650 text-white font-extrabold flex items-center justify-center text-[10px] shrink-0 font-mono">2</span>
                      <p><strong>Ban hành thông báo:</strong> Phát hành quyết định gửi NNT báo hiệu về việc áp dụng biện pháp cưỡng chế tạm thời.</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="w-5 h-5 rounded-full bg-red-650 text-white font-extrabold flex items-center justify-center text-[10px] shrink-0 font-mono">3</span>
                      <p><strong>Liên thông Công an:</strong> Gửi ngay văn bản đề nghị cấm xuất cảnh chính thức đến **Cục Quản lý xuất nhập cảnh (Bộ Công an)** để kích hoạt khóa hộ chiếu tại cửa khẩu.</p>
                    </div>
                  </div>
                </div>

                {/* Cancel Flow */}
                <div className={`p-4 rounded-xl border text-left ${darkMode ? 'bg-zinc-950/40 border-stone-850' : 'bg-white border-slate-205'}`}>
                  <span className="text-[10px] font-black uppercase text-slate-450 tracking-wider border-b pb-1.5 block">Quy trình xử lý gỡ lệnh hoãn</span>
                  <div className="mt-3.5 space-y-3 text-[11px] leading-relaxed">
                    <div className="flex gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-extrabold flex items-center justify-center text-[10px] shrink-0 font-mono">1</span>
                      <p><strong>NNT nộp đủ tiền nợ:</strong> Người nộp hoàn thành đóng sòng phẳng nợ thuế hoặc thiết lập tài sản đảm bảo.</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-extrabold flex items-center justify-center text-[10px] shrink-0 font-mono">2</span>
                      <p><strong>Cơ quan Thuế ban hành:</strong> Ký quyết định Thông báo hủy bỏ biện pháp tạm hoãn xuất cảnh ngay lập tức.</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-extrabold flex items-center justify-center text-[10px] shrink-0 font-mono">3</span>
                      <p><strong>Gỡ chặn tự động:</strong> Dữ liệu giải trình lập tức được liên thông số gỡ khóa dữ liệu tại tất cả các hải quan cửa khẩu không chậm trễ.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification channels & eTax Mobile Guide */}
              <div className={`p-4 rounded-xl border text-left ${darkMode ? 'bg-[#1a2331]/30 border-blue-900/30' : 'bg-blue-50/20 border-blue-200'}`}>
                <h5 className="font-black text-xs uppercase tracking-tight text-blue-600 mb-2 flex items-center gap-1.5">
                  <Compass className="w-5 h-5 animate-pulse" />
                  <span>Kênh Nhận Quyết Định &amp; Hướng Dẫn Kê Khai Tra Cứu Số:</span>
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-xs leading-normal">
                  <div className="space-y-2">
                    <p className="font-bold underline text-slate-700 dark:text-zinc-200">📬 Các kênh cơ quan thuế gửi thông báo:</p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-500 dark:text-zinc-400 text-[10.5px]">
                      <li>Gửi trực tiếp vào Tài khoản giao dịch thuế điện tử (thuedientu.gdt.gov.vn).</li>
                      <li>Hiển thị nổi bật trên box Ứng dụng thuế di động eTax Mobile.</li>
                      <li>Gửi email theo địa chỉ thư điện tử đã liên kết xác thực công vụ.</li>
                      <li>Đăng tin công khai trên website nếu không liên lạc được theo luồng số.</li>
                    </ul>
                  </div>
                  <div className="p-3 rounded-lg border bg-white dark:bg-zinc-950 border-slate-205 dark:border-zinc-800 space-y-1.5 text-[10.5px]">
                    <p className="font-bold text-red-500 dark:text-red-400">📱 5 Bước tra cứu nhanh trên eTax Mobile của bạn:</p>
                    <ol className="list-decimal pl-5 space-y-1 text-slate-600 dark:text-zinc-400">
                      <li>Đăng nhập ứng dụng <strong>eTax Mobile</strong> di động.</li>
                      <li>Chọn danh mục <strong>"Tra cứu Thông báo"</strong>.</li>
                      <li>Click tính năng <strong>"Tìm kiếm nâng cao"</strong>.</li>
                      <li>Truy cập danh mục xổ xuống <strong>"Danh mục Thông báo"</strong>.</li>
                      <li>Chọn dòng <strong>"Thông báo về việc sẽ áp dụng tạm hoãn xuất cảnh"</strong> để kiểm diện.</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'invoice_time' && <InvoiceTimeTab darkMode={darkMode} />}
          {activeTab === 'rejected_expenses' && <RejectedExpensesTab darkMode={darkMode} />}
          {activeTab === 'returned_goods' && <ReturnedGoodsTab darkMode={darkMode} />}
          {activeTab === 'invoice_adjustment' && <InvoiceAdjustmentTab darkMode={darkMode} />}
          {activeTab === 'labor_contracts' && <ContractClassificationTab darkMode={darkMode} />}
          {activeTab === 'circular_58' && <Circular58Tab darkMode={darkMode} />}
          {activeTab === 'factor_k' && <FactorKTab darkMode={darkMode} />}
          {activeTab === 'digital_commerce' && <DigitalCommerceTab darkMode={darkMode} />}
          {activeTab === 'trade_union' && <TradeUnionTab darkMode={darkMode} />}
          {activeTab === 'supplementary_filing' && <SupplementaryFilingTab darkMode={darkMode} />}
          {activeTab === 'vat_cases' && <VATThreeCasesTab darkMode={darkMode} />}

        </div>
      </div>
    </div>
  );
}
