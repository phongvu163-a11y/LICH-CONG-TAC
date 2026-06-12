import React, { useState } from 'react';
import { 
  FileText, 
  HelpCircle, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  ArrowRight, 
  ShieldCheck, 
  Search,
  BookOpen,
  Briefcase,
  Users,
  Layers,
  ChevronRight,
  Clipboard,
  Award,
  TrendingUp,
  FileCheck
} from 'lucide-react';

interface ContractClassificationTabProps {
  darkMode: boolean;
}

export default function ContractClassificationTab({ darkMode }: ContractClassificationTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'types' | 'compare'>('types');
  const [selectedType, setSelectedType] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const contractTypes = [
    {
      id: 1,
      title: "Loại hợp đồng 1: HỢP ĐỒNG THỬ VIỆC",
      appliesTo: "Áp dụng trong giai đoạn đánh giá năng lực của người lao động trước khi ký Hợp đồng lao động chính thức.",
      nature: "Quan hệ lao động ngắn hạn (Thử thách & Thử nghiệm năng lực)",
      durationTitle: "Thời Gian Thử Việc Tối Đa",
      durationRules: [
        { label: "Tối đa 180 ngày", desc: "đối với chức danh quản lý doanh nghiệp (theo quy định của Luật Doanh nghiệp, Luật quản lý, sử dụng vốn nhà nước...)." },
        { label: "Tối đa 60 ngày", desc: "đối với công việc yêu cầu trình độ chuyên môn kỹ thuật từ cao đẳng, đại học trở lên." },
        { label: "Tối đa 30 ngày", desc: "đối với công việc yêu cầu trình độ chuyên môn kỹ thuật trung cấp, công nhân kỹ thuật, nhân viên nghiệp vụ." },
        { label: "Tối đa 06 ngày làm việc", desc: "đối với các công việc khác không yêu cầu trình độ kỹ thuật." }
      ],
      characteristics: [
        "Hai bên thỏa thuận chi tiết về thời gian, nội dung công việc và mức lương thử việc (ít nhất bằng 85% mức lương của công việc đó khi ký chính thức).",
        "Trong thời gian thử việc, mỗi bên có quyền hủy bỏ hợp đồng thử việc mà không cần báo trước và không phải bồi thường nếu thấy không đạt yêu cầu.",
        "Sau khi kết thúc thử việc, nếu đạt yêu cầu thử thách, doanh nghiệp bắt buộc phải ký HĐLĐ chính thức ngay với người lao động.",
        "Thời gian thử việc được tính vào thời gian làm việc của người lao động để tính chế độ nếu sau đó hai bên ký HĐLĐ chính thức."
      ],
      warnings: [
        "Hết thời gian thử việc, doanh nghiệp và người lao động phải ký hợp đồng lao động mới nếu vẫn tiếp tục làm việc.",
        "Tuyệt đối không được thử việc quá 01 lần đối với cùng 01 công việc (Tránh lạm dụng thử việc liên tục nhiều lần)."
      ],
      documents: [
        "Hợp đồng thử việc (ký bằng giấy hoặc hợp đồng điện tử pháp lý)",
        "Bảng chấm công thử việc & Đánh giá năng lực của Trưởng bộ phận",
        "Bảng tính lương thử việc có chữ ký nhận",
        "Biên bản ghi nhận kết quả đạt/không đạt thử việc"
      ],
      slogan: "SỬ DỤNG ĐÚNG LOẠI HỢP ĐỒNG - DOANH NGHIỆP AN TÂM, HẠN CHẾ RỦI RO PHÁP LÝ",
      example: "Nhận tiền phong thử việc 2 tháng cho vị trí Lập trình viên tập sự, mức lương tối thiểu 85% lương chính thức và đánh giá trước khi chuyển giao hợp đồng lao động xác định thời hạn."
    },
    {
      id: 2,
      title: "Loại hợp đồng 2: HỢP ĐỒNG LAO ĐỘNG CHÍNH THỨC",
      appliesTo: "Áp dụng khi xác lập mối quan hệ tuyển dụng lâu dài, có sự ràng buộc quản lý của người sử dụng lao động đối với người lao động làm công ăn lương.",
      nature: "Quan hệ lao động chuẩn mực có ràng buộc pháp lý toàn diện",
      durationTitle: "Thời Hạn Ký Kết Hợp Đồng",
      durationRules: [
        { label: "Xác định thời hạn", desc: "Hai bên xác định thời hạn, thời điểm chấm dứt hiệu lực của hợp đồng trong thời gian không quá 36 tháng." },
        { label: "Không xác định thời hạn", desc: "Hai bên không xác định thời hạn, thời điểm chấm dứt hiệu lực của hợp đồng (Áp dụng cho nhân sự gắn bó lâu năm)." }
      ],
      characteristics: [
        "Chịu sự quản lý, giám sát, điều hành trực tiếp của người sử dụng lao động về thời giờ làm việc, kỷ luật lao động.",
        "Mức lương hưởng không được thấp hơn mức lương tối thiểu vùng quy định hiện hành.",
        "Bắt buộc tham gia đóng Bảo hiểm xã hội (BHXH), Bảo hiểm y tế (BHYT), Bảo hiểm thất nghiệp (BHTN).",
        "Có đầy đủ các quyền lợi về ngày nghỉ phép năm (tối thiểu 12 ngày/năm), nghỉ lễ tết hưởng nguyên lương, chế độ ốm đau thai sản."
      ],
      warnings: [
        "Phải tuân thủ quy chuẩn thời gian báo trước khi chấm dứt hợp đồng (30 ngày đối với HĐ xác định thời hạn, 45 ngày đối với HĐ không xác định thời hạn, và 3 ngày đối với lý do bất khả kháng).",
        "Mọi sửa đổi, bổ sung nội dung hợp đồng lao động phải thực hiện qua Phụ lục hợp đồng lao động chính thức hoặc ký mới."
      ],
      documents: [
        "Hợp đồng lao động chính thức (bản gốc có chữ ký, đóng dấu tươi)",
        "Hồ sơ cá nhân người lao động (bản sao công chứng CCCD, bằng cấp, sơ yếu lý lịch)",
        "Sổ quản lý lao động của doanh nghiệp tại nơi làm việc",
        "Quyết định đóng BHXH, BHYT, BHTN kèm danh sách báo tăng."
      ],
      slogan: "XÂY DỰNG QUAN HỆ LAO ĐỘNG BỀN VỮNG - ĐẢM BẢO QUYỀN LỢI & TRÁCH NHIỆM PHÁP LÝ",
      example: "Ký hợp đồng lao động thời hạn 2 năm với Nhân viên Kế toán, đóng BHXH bắt buộc đầy đủ theo thang bảng lương đăng ký với Sở LĐTB&XH."
    },
    {
      id: 3,
      title: "Loại hợp đồng 3: HỢP ĐỒNG GIAO KHOÁN",
      appliesTo: "Áp dụng khi doanh nghiệp giao cho một cá nhân hoặc tổ chức tự lực thực hiện một công việc cụ thể, có tính chất thời vụ, dứt điểm theo kết quả đầu ra.",
      nature: "Quan hệ dân sự - thương mại thực hiện theo kết quả sản phẩm bàn giao",
      durationTitle: "Căn Cứ Nghiệp Vụ Khoán",
      durationRules: [
        { label: "Khoán toàn bộ", desc: "Giao trọn gói bao gồm cả nguyên vật liệu, nhân công và chi phí công cụ dụng cụ để hoàn thành sản phẩm cuối." },
        { label: "Khoán nhân công", desc: "Doanh nghiệp cung cấp nguyên vật liệu, bên nhận khoán chỉ chịu trách nhiệm cung cấp sức lao động tinh chế." }
      ],
      characteristics: [
        "❌ Không quản lý thời gian làm việc: Bên nhận khoán hoàn toàn chủ động sắp xếp thời gian tự thực hiện công việc, không phải chấm công.",
        "❌ Không điều hành như quan hệ lao động: Doanh nghiệp không phân công công việc hàng ngày, không giám sát trực tiếp, không xử lý kỷ luật.",
        "Bên nhận khoán tự tổ chức lực lượng nhân sự, công cụ, phương tiện và quyết định cách thức thực hiện công việc hằng ngày.",
        "Thanh toán trực tiếp theo khối lượng hoặc kết quả hoàn thành thực tế đã được kiểm điểm nghiệm thu kỹ càng."
      ],
      warnings: [
        "Hợp đồng giao khoán đúng bản chất thì KHÔNG THUỘC DIỆN tham gia đóng BHXH bắt buộc.",
        "Nếu doanh nghiệp lách luật bằng tên gọi HĐ giao khoán nhưng thực tế lại quản lý chấm công, điều hành như nhân viên, thì cơ quan thanh tra sẽ truy thu BHXH và phạt hành chính nặng."
      ],
      documents: [
        "Hợp đồng giao khoán công việc chi tiết",
        "Phụ lục yêu cầu kỹ thuật và bảng tiêu chí chất lượng kết quả bàn giao",
        "Biên bản nghiệm thu bàn giao kết quả sản phẩm công việc hoàn thành",
        "Hóa đơn bán hàng điện tử (nếu có, hoặc chứng từ thanh toán ngân hàng chính chủ)"
      ],
      slogan: "MINH BẠCH TIÊU CHÍ ĐẦU RA - LINH HOẠT TỐI ƯU CHI PHÍ VẬN HÀNH",
      example: "Doanh nghiệp giao khoán thiết kế 1 website bán hàng cho cá nhân lập trình viên tự làm ở nhà, thanh toán trọn gói 15 triệu đồng sau khi chạy thử thành công."
    },
    {
      id: 4,
      title: "Loại hợp đồng 4: HỢP ĐỒNG DỊCH VỤ",
      appliesTo: "Áp dụng khi doanh nghiệp thuê một đối tác cá nhân hoặc tổ chức chuyên nghiệp bên ngoài cung cấp dịch vụ chuyên môn theo đề bài yêu cầu cụ thể.",
      nature: "Quan hệ cung ứng dịch vụ thương mại hai bên bình đẳng",
      durationTitle: "Định Hướng Dịch Vụ Thuê Ngoài",
      durationRules: [
        { label: "Cá nhân chuyên nghiệp", desc: "Ký kết với cá nhân tự do có năng lực thực hiện dịch vụ tư vấn, sáng tạo nghệ thuật, truyền thông." },
        { label: "Tổ chức / Doanh nghiệp", desc: "Ký với pháp nhân cung cấp dịch vụ vận tải, vệ sinh công nghiệp, bảo vệ an ninh chuyên trách." }
      ],
      characteristics: [
        "Không quản lý thời gian và địa điểm: Doanh nghiệp không kiểm soát thời giờ, địa điểm hoạt động làm việc của nhân viên bên dịch vụ.",
        "Bên cung ứng dịch vụ tự chủ 100%: Tự quyết định phương tiện, công nghệ, nhân lực phân bổ để hoàn thiện nghĩa vụ dịch vụ.",
        "Thanh toán theo tiến độ hoàn thành dịch vụ hoặc trọn gói dứt điểm sản phẩm bàn giao, không liên quan tới số công lao động.",
        "Mục tiêu tối thượng là nhận bàn giao kết quả và báo cáo chất lượng dịch vụ đạt yêu cầu theo thỏa thuận ban đầu."
      ],
      warnings: [
        "Không sử dụng hợp đồng dịch vụ để che giấu quan hệ lao động dài hạn thực tế.",
        "Phải quy định chặt chẽ điều khoản phạt vi phạm hợp đồng, bồi thường thiệt hại và bảo mật thông tin kinh doanh (NDA) của doanh nghiệp."
      ],
      documents: [
        "Hợp đồng dịch vụ thương mại pháp lý",
        "Bản mô tả yêu cầu công việc chi tiết (SOW - Scope of Work)",
        "Biên bản nghiệm thu nghiệm thu chất lượng dịch vụ bàn giao từng giai đoạn",
        "Hóa đơn giá trị gia tăng (VAT) hoặc hóa đơn bán hàng của bên cung cấp dịch vụ"
      ],
      slogan: "TẬP TRUNG CHUYÊN MÔN HÓA - KÝ KẾT MINH BẠCH - HẠN CHẾ TRANH CHẤP",
      example: "Ký hợp đồng dịch vụ viết 20 bài viết chuẩn SEO và quay 2 video marketing thương hiệu với một đơn vị Agency, thanh toán dựa trên kết quả nghiệm thu bài đăng đạt top."
    },
    {
      id: 5,
      title: "Loại hợp đồng 5: HỢP ĐỒNG THỰC TẬP / TIẾP NHẬN KIẾN TẬP",
      appliesTo: "Áp dụng đối với sinh viên đang theo học tại các trường đại học, cao đẳng hoặc cơ sở nghề nghiệp cần trải nghiệm thực tế công việc chuyên môn.",
      nature: "Quan hệ dân sự đào tạo kết hợp hỗ trợ thực tế làm việc",
      durationTitle: "Thời Hạn Thực Tập",
      durationRules: [
        { label: "Theo học trình", desc: "Thời gian thông thường kéo dài từ 2 đến 6 tháng tùy theo yêu cầu của học phần hoặc khóa luận tốt nghiệp." },
        { label: "Bán thời gian (Part-time)", desc: "Lịch thực tập linh hoạt, điều chỉnh phù hợp lịch học tập chính thức của sinh viên tại giảng đường." }
      ],
      characteristics: [
        "Gắn kết chặt chẽ với chương trình đào tạo của nhà trường; có chỉ tiêu, báo cáo thực tập làm căn cứ chấm điểm tốt nghiệp.",
        "Được doanh nghiệp phân công chuyên viên kèm cặp, hướng dẫn nghiệp vụ thực tế, tiếp cận quy trình và văn hóa làm việc.",
        "Mức chi phí hỗ trợ (Stipend / hỗ trợ xăng xe, ăn trưa nếu có) do hai bên tự nguyện thỏa thuận, không mang tính chất lương cứng.",
        "Nội dung công việc mang tính chất học hỏi, làm quen, hỗ trợ xử lý nghiệp vụ đơn giản theo năng lực thực tập sinh."
      ],
      warnings: [
        "Nghiêm cấm lạm dụng thực tập sinh để thay thế cho lao động chính thức dài hạn nhằm trốn tránh trách nhiệm và chi phí phúc lợi lao động.",
        "Doanh nghiệp cần phối hợp tốt với nhà trường, cung cấp nhận xét trung thực, đánh giá chính xác kết quả rèn luyện của sinh viên."
      ],
      documents: [
        "Hợp đồng thực tập hoặc Quyết định tiếp nhận thực tập của công ty",
        "Đơn xin thực tập và Giấy giới thiệu có đóng dấu của trường chủ quản",
        "Kế hoạch thực tập phân bổ công việc chi tiết được phê duyệt",
        "Báo cáo kết quả thực tập kèm Bản nhận xét, đánh giá năng lực của người hướng dẫn"
      ],
      slogan: "ƯƠM MẦM NHÂN LỰC TRẺ - TRÁCH NHIỆM KÈM CẶP KHÔNG THỂ BỎ QUA",
      example: "Doanh nghiệp tiếp nhận sinh viên năm cuối Đại học Ngoại thương vào thực tập bộ phận Xuất nhập khẩu trong 3 tháng, hỗ trợ tiền xăng xe 2 triệu đồng/tháng."
    },
    {
      id: 6,
      title: "Loại hợp đồng 6: HỢP ĐỒNG CỘNG TÁC VIÊN HƯỞNG HOA HỒNG",
      appliesTo: "Áp dụng khi doanh nghiệp thiết lập mạng lưới cá nhân làm đại lý kinh doanh, cộng tác viên bán hàng tự do để thúc đẩy doanh số thương mại.",
      nature: "Quan hệ dân sự tính hoa hồng môi giới bán hàng theo doanh thu thực",
      durationTitle: "Định Mức Doanh Số",
      durationRules: [
        { label: "CTV Tự Do", desc: "Không áp doanh số tối thiểu, hoa hồng tính phẳng theo tỷ lệ phần trăm trên mỗi giao dịch thành công." },
        { label: "CTV Chuyên nghiệp", desc: "Có cam kết chỉ tiêu doanh số hàng tháng để hưởng thang bậc hoa hồng lũy tiến cao hơn." }
      ],
      characteristics: [
        "Tự chủ thời gian và địa điểm tuyệt đối: CTV tự do lựa chọn thời điểm, địa bàn hoạt động tìm kiếm kết nối khách hàng.",
        "Tự quyết cách thức tiếp cận: Doanh nghiệp không can thiệp cách thức tư vấn sản phẩm, không điều hành trực tiếp quy trình.",
        "Thu nhập hoàn toàn phụ thuộc vào kết quả: Chỉ phát sinh trả tiền hoa hồng khi giao dịch bán hàng được hoàn tất dứt điểm.",
        "Mối quan hệ đôi bên cùng có lợi: Doanh nghiệp mở rộng kênh phân phối không tốn lương cứng, CTV có nguồn thu nhập thụ động."
      ],
      warnings: [
        "Quy định cực kỳ rõ ràng công thức tính hoa hồng và mốc thời gian đối chiếu thanh toán (tránh mập mờ dẫn tới khiếu kiện).",
        "Cần kiểm soát chặt chẽ thông tin CTV truyền tải tới khách hàng để bảo vệ uy tín thương hiệu dịch vụ của doanh nghiệp."
      ],
      documents: [
        "Hợp đồng cộng tác viên dịch vụ / môi giới thương mại",
        "Chính sách chiết khấu hoa hồng được ban lãnh đạo thông qua đóng dấu",
        "Báo cáo doanh số bán hàng thành công có xác nhận đối chiếu định kỳ",
        "Bảng tính tiền hoa hồng chi tiết và chứng từ chuyển khoản ngân hàng"
      ],
      slogan: "CHIA SẺ LỢI ÍCH ĐỒNG HÀNH - BÙNG NỔ DOANH SỐ HIỆU QUẢ",
      example: "Cộng tác viên giới thiệu khách mua căn hộ chung cư của chủ đầu tư, hưởng hoa hồng môi giới 1.5% giá trị hợp đồng mua bán ngay sau khi khách nộp tiền đợt 1."
    }
  ];

  const filteredTypes = contractTypes.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.appliesTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.nature.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedTypeData = contractTypes.find(c => c.id === selectedType) || contractTypes[0];

  return (
    <div className="space-y-5 animate-fade-in text-left">
      
      {/* Banner Tiêu đề Chuyên đề */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        darkMode ? 'bg-zinc-950/40 border-sky-950/50' : 'bg-red-50/20 border-red-100'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-600 text-white rounded-xl shadow-md shrink-0">
            <Briefcase className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase tracking-tight text-red-650">
              Chuyên đề Pháp chế: Cẩm nang Phân loại &amp; Quản trị Hợp đồng Lao động (Mới)
            </h3>
            <p className="text-[11px] font-medium mt-0.5 text-slate-500 dark:text-zinc-400">
              Kiểm tra chi tiết 6 loại hợp đồng phổ biến trong doanh nghiệp. Hướng dẫn phân biệt rõ bản chất, thời hạn pháp lý, tránh rủi ro thanh kiểm tra lao động &amp; BHXH.
            </p>
          </div>
        </div>

        {/* Chuyển đổi Sub-tab */}
        <div className="flex p-0.5 rounded-lg bg-slate-100 dark:bg-zinc-900 border dark:border-zinc-800 w-full md:w-auto">
          <button
            onClick={() => setActiveSubTab('types')}
            className={`flex-1 md:flex-none py-1.5 px-4 text-[11px] font-extrabold uppercase rounded-md tracking-wider transition cursor-pointer ${
              activeSubTab === 'types'
                ? 'bg-amber-450 text-black shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400'
            }`}
          >
            Chi tiết 6 Loại HĐ
          </button>
          <button
            onClick={() => setActiveSubTab('compare')}
            className={`flex-1 md:flex-none py-1.5 px-4 text-[11px] font-extrabold uppercase rounded-md tracking-wider transition cursor-pointer ${
              activeSubTab === 'compare'
                ? 'bg-amber-450 text-black shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400'
            }`}
          >
            Bảng Đối Chiếu Bản Chất
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: TRƯỜNG HỢP CHI TIẾT 6 LOẠI HỢP ĐỒNG */}
      {activeSubTab === 'types' && (
        <div className="space-y-4 animate-fade-in text-left">
          
          {/* Hộp Tìm kiếm nhanh */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Tìm nhanh loại hợp đồng cần rà soát (ví dụ: 'thử việc', 'giao khoán', 'dịch vụ', 'hoa hồng')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full text-xs p-2.5 pl-9 rounded-xl border outline-none transition focus:ring-1 focus:ring-amber-500 ${
                darkMode ? 'bg-zinc-955 border-zinc-800 text-white' : 'bg-white border-slate-250 text-slate-800'
              }`}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-5">
            
            {/* Cột trái: Danh sách nút chọn loại hợp đồng */}
            <div className="w-full lg:w-80 shrink-0 space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
              {filteredTypes.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedType(c.id)}
                  className={`w-full p-2 py-2.5 px-3.5 rounded-xl transition duration-150 text-left border flex items-center justify-between text-[11px] font-black cursor-pointer ${
                    selectedType === c.id
                      ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-650/20'
                      : darkMode
                        ? 'bg-[#0f172a] border-zinc-850 text-zinc-350 hover:border-zinc-700'
                        : 'bg-white border-slate-200 text-slate-750 hover:border-slate-350 shadow-3xs'
                  }`}
                >
                  <span className="truncate">{c.title}</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${selectedType === c.id ? 'text-white' : 'text-slate-405'}`} />
                </button>
              ))}
              {filteredTypes.length === 0 && (
                <p className="text-[11px] text-slate-500 italic text-center p-4">Không tìm thấy trường mẫu phù hợp.</p>
              )}
            </div>

            {/* Cột phải: Chi tiết hiển thị thông tin loại hợp đồng */}
            <div className="flex-1 min-w-0 space-y-4">
              <div className={`p-5 rounded-xl border ${
                darkMode ? 'bg-zinc-950/40 border-stone-850' : 'bg-white border-slate-205 shadow-2xs'
              }`}>
                
                {/* Header Case */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b dark:border-zinc-850 mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex flex-col items-center justify-center bg-red-600 text-white rounded-xl px-3.5 py-2 font-mono shadow-sm shrink-0 select-none">
                      <span className="text-[9px] font-black tracking-widest opacity-85 uppercase">LOẠI</span>
                      <span className="text-xl font-black mt-0.5">{selectedTypeData.id}</span>
                    </div>
                    <div>
                      <span className="inline-block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                        Cẩm nang Phân loại &amp; Hạn chế Rủi ro Pháp chế
                      </span>
                      <h4 className="font-extrabold text-sm uppercase text-red-650 dark:text-red-500 mt-0.5 leading-snug">
                        {selectedTypeData.title.split(': ')[1]}
                      </h4>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 text-[10px] shrink-0 lg:items-end">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold tracking-wider border bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50 shadow-3xs text-[10px]">
                      <Layers className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      {selectedTypeData.nature}
                    </span>
                  </div>
                </div>

                {/* appliesTo */}
                <p className="text-[11px] leading-relaxed text-slate-700 dark:text-zinc-300 font-medium pb-4 border-b border-dashed dark:border-zinc-850">
                  🎯 <strong>Đối tượng áp dụng:</strong> {selectedTypeData.appliesTo}
                </p>

                {/* 2 Cột: Thời gian quy định & Đặc điểm */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                  {/* Cột 1: Quy định thời hạn tối đa */}
                  <div className="space-y-3">
                    <h5 className="text-[11px] font-black uppercase text-red-650 border-l-2 border-red-600 pl-2 leading-none">
                      {selectedTypeData.durationTitle}
                    </h5>
                    <div className="space-y-2">
                      {selectedTypeData.durationRules.map((rule, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg border dark:border-zinc-850 bg-slate-50/50 dark:bg-zinc-900/40 text-[10.5px]">
                          <span className="font-black text-rose-500 block">{rule.label}</span>
                          <span className="text-slate-500 dark:text-zinc-400 leading-normal mt-0.5 block">{rule.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cột 2: Đặc điểm nhận diện cốt lõi */}
                  <div className="space-y-3">
                    <h5 className="text-[11px] font-black uppercase text-blue-600 border-l-2 border-blue-600 pl-2 leading-none">
                      Đặc điểm kỹ trị cốt lõi
                    </h5>
                    <ul className="space-y-2 text-[10.5px]">
                      {selectedTypeData.characteristics.map((char, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-650 dark:text-zinc-300 leading-relaxed">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{char}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Lưu ý phòng tránh rủi ro */}
                <div className="mt-5 p-3.5 rounded-xl bg-orange-550/5 border border-orange-550/25 text-[11px] leading-relaxed">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" />
                    <span className="text-orange-500 font-black uppercase tracking-widest text-[9.5px]">Cảnh báo rủi ro &amp; Lưu ý cốt lõi:</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 mt-1 text-slate-700 dark:text-zinc-300">
                    {selectedTypeData.warnings.map((warn, idx) => (
                      <li key={idx}><strong>{warn.split(': ')[0]}:</strong>{warn.split(': ')[1] || ''}</li>
                    ))}
                  </ul>
                </div>

                {/* Thành phần hồ sơ thanh kiểm tra */}
                <div className="mt-4 p-4 rounded-xl bg-slate-100/50 dark:bg-zinc-900/40 border dark:border-zinc-850 text-[11px] leading-relaxed">
                  <div className="flex items-center gap-2 mb-2 pb-1 border-b border-dashed dark:border-zinc-800">
                    <Clipboard className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="text-slate-500 dark:text-zinc-400 font-extrabold uppercase tracking-widest text-[9px]">Hồ sơ, chứng từ cần lưu trữ phục vụ thanh kiểm tra định kỳ:</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                    {selectedTypeData.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[10.5px] text-slate-650 dark:text-zinc-300 bg-white dark:bg-zinc-950 p-2 rounded-lg border dark:border-zinc-900 shadow-3xs">
                        <FileCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="truncate font-semibold">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Slogan */}
                <div className="mt-4 text-center py-2 px-3 bg-red-650 text-white rounded-lg text-[10px] font-black tracking-wider uppercase">
                  {selectedTypeData.slogan}
                </div>

              </div>
              
              {/* Ví dụ thực tế */}
              <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl text-[10px] text-slate-655 dark:text-zinc-300 leading-normal font-medium">
                💡 <strong>Ví dụ thực tế áp dụng tại doanh nghiệp:</strong> {selectedTypeData.example}
              </div>

            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 2: BẢNG SO SÁNH THUẬN LỢI & BẢN CHẤT PHÁP LÝ */}
      {activeSubTab === 'compare' && (
        <div className="space-y-4 animate-fade-in text-left">
          
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800">
            <table className="w-full text-left text-[11px] border-collapse min-w-[700px]">
              <thead>
                <tr className={`${darkMode ? 'bg-zinc-900 text-zinc-100 border-b border-zinc-800' : 'bg-slate-100 text-slate-800 border-b border-slate-200'} font-black text-[10px] tracking-wider uppercase`}>
                  <th className="p-3 border-r dark:border-zinc-800 w-44">Tên loại hợp đồng</th>
                  <th className="p-3 border-r dark:border-zinc-800">Bản chất pháp lý</th>
                  <th className="p-3 border-r dark:border-zinc-800 w-32 text-center">Quản lý thời gian</th>
                  <th className="p-3 border-r dark:border-zinc-800 w-32 text-center">Nghĩa vụ đóng BHXH</th>
                  <th className="p-3 w-40">Mục tiêu hạch toán chi phí</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-zinc-850 leading-relaxed">
                <tr className={darkMode ? 'hover:bg-zinc-900/10 text-zinc-300' : 'hover:bg-slate-50/50 text-slate-700'}>
                  <td className="p-3 border-r dark:border-zinc-800 font-extrabold text-red-650 dark:text-red-400">1. Hợp đồng Thử Việc</td>
                  <td className="p-3 border-r dark:border-zinc-800 font-medium">Đánh giá kỹ năng làm việc, mức lương đạt tối thiểu 85% lương chính thức.</td>
                  <td className="p-3 border-r dark:border-zinc-800 text-center text-rose-500 font-bold">✓ Có chấm công</td>
                  <td className="p-3 border-r dark:border-zinc-800 text-center text-slate-400">❌ Không bắt buộc</td>
                  <td className="p-3 font-semibold text-slate-500 dark:text-zinc-400">Tính vào chi phí quản lý vận hành DN trực tiếp.</td>
                </tr>
                <tr className={darkMode ? 'hover:bg-zinc-900/10 text-zinc-300' : 'hover:bg-slate-50/50 text-slate-700'}>
                  <td className="p-3 border-r dark:border-zinc-800 font-extrabold text-red-650 dark:text-red-400">2. Hợp đồng Lao động</td>
                  <td className="p-3 border-r dark:border-zinc-800 font-medium">Quan hệ tuyển dụng chính thức, ràng buộc pháp lý toàn diện, trả lương định kỳ.</td>
                  <td className="p-3 border-r dark:border-zinc-800 text-center text-rose-500 font-bold">✓ Có giám sát giờ</td>
                  <td className="p-3 border-r dark:border-zinc-800 text-center text-emerald-500 font-black">✓ Bắt buộc 100%</td>
                  <td className="p-3 font-semibold text-slate-500 dark:text-zinc-400">Chi phí lương nhân sự, được khấu trừ thuế TNCN/TNDN.</td>
                </tr>
                <tr className={darkMode ? 'hover:bg-zinc-900/10 text-zinc-300' : 'hover:bg-slate-50/50 text-slate-700'}>
                  <td className="p-3 border-r dark:border-zinc-800 font-extrabold text-indigo-650 dark:text-indigo-400">3. Hợp đồng Giao khoán</td>
                  <td className="p-3 border-r dark:border-zinc-800 font-medium">Giao phó công việc hoàn chỉnh theo khối lượng sản phẩm, thanh toán nghiệm thu sản phẩm.</td>
                  <td className="p-3 border-r dark:border-zinc-800 text-center text-slate-400">❌ Tự chủ sắp xếp</td>
                  <td className="p-3 border-r dark:border-zinc-800 text-center text-slate-400">❌ Không đóng BHXH</td>
                  <td className="p-3 font-semibold text-slate-500 dark:text-zinc-400">Thanh toán theo khối lượng nghiệm thu bàn giao (không đóng BH).</td>
                </tr>
                <tr className={darkMode ? 'hover:bg-zinc-900/10 text-zinc-300' : 'hover:bg-slate-50/50 text-slate-700'}>
                  <td className="p-3 border-r dark:border-zinc-800 font-extrabold text-indigo-655 dark:text-indigo-400">4. Hợp đồng Dịch vụ</td>
                  <td className="p-3 border-r dark:border-zinc-800 font-medium">Bên thuê nhận bàn giao kết quả của một hoạt động dịch vụ chuyên biệt cung cấp ngoài.</td>
                  <td className="p-3 border-r dark:border-zinc-800 text-center text-slate-400">❌ Tự chủ hoàn toàn</td>
                  <td className="p-3 border-r dark:border-zinc-800 text-center text-slate-400">❌ Không đóng BHXH</td>
                  <td className="p-3 font-semibold text-slate-500 dark:text-zinc-400">Chi phí mua ngoài hợp lý khi có hóa đơn VAT đi kèm của đối tác.</td>
                </tr>
                <tr className={darkMode ? 'hover:bg-zinc-900/10 text-zinc-300' : 'hover:bg-slate-50/50 text-slate-700'}>
                  <td className="p-3 border-r dark:border-zinc-800 font-extrabold text-amber-600 dark:text-amber-400">5. Hợp đồng Thực tập</td>
                  <td className="p-3 border-r dark:border-zinc-800 font-medium">Hỗ trợ trải nghiệm và học tập quy trình của trường đại học, phụ cấp do thỏa thuận.</td>
                  <td className="p-3 border-r dark:border-zinc-800 text-center text-rose-500 font-bold">✓ Theo lịch học</td>
                  <td className="p-3 border-r dark:border-zinc-800 text-center text-slate-400">❌ Không đóng BHXH</td>
                  <td className="p-3 font-semibold text-slate-500 dark:text-zinc-400">Chi phí hỗ trợ sinh viên, cần có quyết định của nhà trường.</td>
                </tr>
                <tr className={darkMode ? 'hover:bg-zinc-900/10 text-zinc-300' : 'hover:bg-slate-50/50 text-slate-700'}>
                  <td className="p-3 border-r dark:border-zinc-800 font-extrabold text-amber-600 dark:text-amber-400">6. Hợp đồng CTV Hoa hồng</td>
                  <td className="p-3 border-r dark:border-zinc-800 font-medium">Môi giới bán hàng thúc đẩy doanh số, hưởng thu nhập tỷ lệ thuận doanh số đạt được.</td>
                  <td className="p-3 border-r dark:border-zinc-800 text-center text-slate-400">❌ CTV tự do giờ</td>
                  <td className="p-3 border-r dark:border-zinc-800 text-center text-slate-400">❌ Không đóng BHXH</td>
                  <td className="p-3 font-semibold text-slate-500 dark:text-zinc-400">Chi hoa hồng môi giới bán hàng theo bảng đối chiếu bán thành công.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`p-4 rounded-xl border flex items-start gap-3 bg-blue-500/5 border-blue-500/20 text-slate-700 dark:text-zinc-350`}>
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <span className="font-extrabold uppercase text-blue-600 block mb-1">GHI NHỚ ĐẶC BIỆT CỦA BAN PHÁP CHẾ:</span>
              Mấu chốt của các hợp đồng dân sự hoặc hợp đồng thương mại (Giao khoán, Dịch vụ, CTV) để được cơ quan Thuế và BHXH công nhận là <strong>bản chất hoạt động thực tế</strong>. Nếu có bất kỳ sự cưỡng bức về mặt quản lý thời gian làm việc trực tiếp, giám sát chấm công kỷ luật định kỳ, thì hợp đồng sẽ bị định danh lại là Hợp đồng lao động và bị truy thu BHXH toàn bộ. Hãy phối hợp chặt chẽ với ban Cố vấn để soạn thảo biên bản nghiệm thu sản phẩm thật chuẩn chỉ!
            </div>
          </div>
          
        </div>
      )}

    </div>
  );
}
