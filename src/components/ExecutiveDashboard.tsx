import React, { useMemo } from 'react';
import { 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  Legend as ChartLegend, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  Building, 
  Users, 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  DollarSign,
  HelpCircle
} from 'lucide-react';
import { Client, TaxFiling, LaborRecord, Employee, Task } from '../types';

interface ExecutiveDashboardProps {
  clients: Client[];
  taxFilings: TaxFiling[];
  laborRecords: LaborRecord[];
  employees: Employee[];
  tasks: Task[];
  darkMode: boolean;
  onSelectTab: (tab: string) => void;
}

export default function ExecutiveDashboard({
  clients,
  taxFilings,
  laborRecords,
  employees,
  tasks,
  darkMode,
  onSelectTab
}: ExecutiveDashboardProps) {

  // 1. KPI COUNTERS SUMMARY MATHS
  const stats = useMemo(() => {
    const activeClients = clients.filter(c => c.status === 'ACTIVE').length;
    const overdueFilings = taxFilings.filter(f => f.status !== 'APPROVED' && new Date(f.dueDate) < new Date()).length;
    const totalTaxPayable = taxFilings.reduce((sum, f) => sum + (f.amount || 0), 0);
    const activeStaff = employees.filter(e => e.status === 'ACTIVE').length;
    
    // Complete filings ratios
    const completedFilings = taxFilings.filter(f => f.status === 'APPROVED').length;
    const totalFilings = taxFilings.length;
    const completeRatio = totalFilings > 0 ? Math.round((completedFilings / totalFilings) * 100) : 0;

    return {
      activeClients,
      overdueFilings,
      totalTaxPayable,
      activeStaff,
      completeRatio,
      totalFilings,
      completedFilings
    };
  }, [clients, taxFilings, employees]);

  // 2. PIE CHART DATA: Clients Business Types Distribution
  const clientTypeData = useMemo(() => {
    const enterpriseCount = clients.filter(c => c.type === 'ENTERPRISE').length;
    const householdCount = clients.filter(c => c.type === 'HOUSEHOLD').length;
    const individualCount = clients.filter(c => c.type === 'INDIVIDUAL').length;

    return [
      { name: 'Khối Doanh nghiệp', value: enterpriseCount, color: '#3b82f6' },
      { name: 'Hộ kinh doanh hạch toán', value: householdCount, color: '#f59e0b' },
      { name: 'Cá nhân cho thuê xưởng', value: individualCount, color: '#a855f7' }
    ].filter(item => item.value > 0);
  }, [clients]);

  // 3. BAR CHART DATA: Filings statuses
  const statusChartData = useMemo(() => {
    const pending = taxFilings.filter(f => f.status === 'PENDING').length;
    const preparing = taxFilings.filter(f => f.status === 'PREPARING').length;
    const submitted = taxFilings.filter(f => f.status === 'SUBMITTED').length;
    const approved = taxFilings.filter(f => f.status === 'APPROVED').length;
    const overdue = stats.overdueFilings;

    return [
      { name: 'Chưa làm', 'Số hồ sơ': pending, fill: '#64748b' },
      { name: 'Lập số liệu', 'Số hồ sơ': preparing, fill: '#fbbf24' },
      { name: 'Đã trình nộp', 'Số hồ sơ': submitted, fill: '#38bdf8' },
      { name: 'Thuế duyệt', 'Số hồ sơ': approved, fill: '#10b981' },
      { name: 'Quá hạn nộp', 'Số hồ sơ': overdue, fill: '#ef4444' }
    ];
  }, [taxFilings, stats.overdueFilings]);

  // 4. TAX PAYMENT OBLIGATION TRENDS (Grouped by filing period)
  const taxTrendData = useMemo(() => {
    // Group tax payable by period
    const map: Record<string, number> = {};
    taxFilings.forEach(f => {
      if (f.amount) {
        map[f.period] = (map[f.period] || 0) + f.amount;
      }
    });

    return Object.entries(map)
      .map(([period, sum]) => ({
        'Chu kỳ': period,
        'Tổng tiền thuế tạm đóng (đ)': sum / 1000000 // Convert to millions for elegant chart display
      }))
      .slice(0, 8); // Top 8 periods
  }, [taxFilings]);

  return (
    <div className="space-y-6 text-xs animate-fade-in font-sans leading-relaxed">
      
      {/* Bento Grid layout KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div 
          onClick={() => onSelectTab('CLIENTS')}
          className={`p-4 rounded-xl border flex items-center justify-between shadow-sm cursor-pointer hover:border-red-500 transition duration-150 ${
            darkMode ? 'bg-zinc-950/40 border-zinc-805' : 'bg-white border-slate-205'
          }`}
        >
          <div className="space-y-1 text-left">
            <span className="text-[10px] uppercase font-extrabold text-zinc-500 tracking-wider">THƯ THƯƠNG MẠI</span>
            <p className="font-mono text-xl sm:text-2xl font-black text-blue-600">{stats.activeClients} / {clients.length}</p>
            <p className="text-[10px] text-zinc-550">Khách hàng Đang phục vụ</p>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 shrink-0">
            <Building className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* KPI 2 */}
        <div 
          onClick={() => onSelectTab('TAX_FILINGS')}
          className={`p-4 rounded-xl border flex items-center justify-between shadow-sm cursor-pointer hover:border-red-500 transition duration-150 ${
            darkMode ? 'bg-zinc-950/40 border-zinc-805' : 'bg-white border-slate-205'
          }`}
        >
          <div className="space-y-1 text-left">
            <span className="text-[10px] uppercase font-extrabold text-zinc-500 tracking-wider">HỒ SƠ MẪU</span>
            <p className="font-mono text-xl sm:text-2xl font-black text-amber-600">{stats.completedFilings} / {stats.totalFilings}</p>
            <p className="text-[10px] text-zinc-550">Tiến độ tờ khai ({stats.completeRatio}%)</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-955/20 text-amber-600 shrink-0">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* KPI 3 */}
        <div 
          onClick={() => onSelectTab('ALERT_CENTER')}
          className={`p-4 rounded-xl border flex items-center justify-between shadow-sm cursor-pointer hover:border-red-500 transition duration-150 ${
            darkMode ? 'bg-zinc-950/40 border-zinc-805' : 'bg-white border-slate-205'
          }`}
        >
          <div className="space-y-1 text-left">
            <span className="text-[10px] uppercase font-extrabold text-zinc-500 tracking-wider">CẢNH CÁO KHẨN</span>
            <p className={`font-mono text-xl sm:text-2xl font-black ${stats.overdueFilings > 0 ? 'text-red-600 animate-pulse font-black' : 'text-zinc-600'}`}>
              {stats.overdueFilings} BIỂU
            </p>
            <p className="text-[10px] text-zinc-550">Quá hạn nộp pháp luật</p>
          </div>
          <div className={`p-3 rounded-xl shrink-0 ${stats.overdueFilings > 0 ? 'bg-red-50 dark:bg-red-955/20 text-red-655' : 'bg-slate-100 text-slate-500'}`}>
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* KPI 4 */}
        <div 
          className={`p-4 rounded-xl border flex items-center justify-between shadow-sm ${
            darkMode ? 'bg-zinc-950/40 border-zinc-805' : 'bg-white border-slate-205'
          }`}
        >
          <div className="space-y-1 text-left">
            <span className="text-[10px] uppercase font-extrabold text-zinc-500 tracking-wider font-mono">THUẾ PHÁT SINH</span>
            <p className="font-mono text-xs sm:text-base font-black text-rose-600">{stats.totalTaxPayable.toLocaleString('vi-VN')} đ</p>
            <p className="text-[10px] text-zinc-550">Tổng thuế tạm đóng nộp kỳ này</p>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 text-purple-650 shrink-0">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

      </div>

      {/* Recharts Analytics Matrices */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column Chart: Filings Progress (BarChart) */}
        <div className="lg:col-span-8">
          <div className={`p-4 rounded-xl border ${
            darkMode ? 'bg-zinc-950/40 border-zinc-805 text-zinc-100' : 'bg-white border-slate-205 shadow-sm'
          }`}>
            <h3 className="font-bold text-xs uppercase tracking-wider mb-4 border-b pb-2 border-red-500/10 text-slate-900 dark:text-zinc-200">
              ⚡ BIỂU ĐỒ TIẾN TRÌNH HOÀN TẤT TỜ KHAI NGHĨA VỤ PHÁP ĐỊNH
            </h3>

            <div className="h-64 sm:h-72 w-full font-mono text-[10px]">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={statusChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#27272a' : '#e2e8f0'} />
                  <XAxis dataKey="name" stroke={darkMode ? '#a1a1aa' : '#64748b'} />
                  <YAxis stroke={darkMode ? '#a1a1aa' : '#64748b'} allowDecimals={false} />
                  <ChartTooltip 
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#18181b' : '#ffffff', 
                      borderColor: darkMode ? '#27272a' : '#cbd5e1',
                      borderRadius: '8px',
                      color: darkMode ? '#ffffff' : '#000000'
                    }} 
                  />
                  <Bar dataKey="Số hồ sơ" radius={[4, 4, 0, 0]}>
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </ReBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column Chart: clientType Distribution (PieChart) */}
        <div className="lg:col-span-4">
          <div className={`p-4 rounded-xl border ${
            darkMode ? 'bg-zinc-950/40 border-zinc-805 text-zinc-100' : 'bg-white border-slate-205 shadow-sm'
          }`}>
            <h3 className="font-bold text-xs uppercase tracking-wider mb-4 border-b pb-2 border-red-500/10 text-slate-900 dark:text-zinc-200">
              🏢 CƠ CẤU PHÂN KHÚC KHÁCH HÀNG
            </h3>

            {clientTypeData.length === 0 ? (
              <p className="p-8 text-center text-zinc-550">Chưa ghi nhận danh mục để hiển thị biểu đồ.</p>
            ) : (
              <div className="flex flex-col items-center">
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={clientTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {clientTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend list */}
                <div className="w-full space-y-1.5 mt-3 text-[11px] leading-tight font-medium">
                  {clientTypeData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.color }}></span>
                        <span className={darkMode ? 'text-zinc-300' : 'text-slate-750'}>{item.name}</span>
                      </div>
                      <span className="font-mono font-bold">{item.value} đối tượng</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Tax obligations trend chart */}
      {taxTrendData.length > 0 && (
        <div className={`p-4 rounded-xl border ${
          darkMode ? 'bg-zinc-950/40 border-zinc-805 text-zinc-100' : 'bg-white border-slate-205 shadow-sm'
        }`}>
          <h3 className="font-bold text-xs uppercase tracking-wider mb-4 border-b pb-2 border-red-500/10 text-slate-900 dark:text-zinc-200">
            📊 BIỂU ĐỒ DÒNG TIỀN THUẾ ĐÓNG PHÁT SINH HẰNG CHU KỲ (Triệu đồng)
          </h3>

          <div className="h-64 sm:h-72 w-full font-mono text-[10px]">
            <ResponsiveContainer width="100%" height="105%">
              <LineChart data={taxTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#27272a' : '#e2e8f0'} />
                <XAxis dataKey="Chu kỳ" stroke={darkMode ? '#a1a1aa' : '#64748b'} />
                <YAxis stroke={darkMode ? '#a1a1aa' : '#64748b'} />
                <ChartTooltip />
                <Line type="monotone" dataKey="Tổng tiền thuế tạm đóng (đ)" stroke="#ef4444" strokeWidth={2.5} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  );
}
