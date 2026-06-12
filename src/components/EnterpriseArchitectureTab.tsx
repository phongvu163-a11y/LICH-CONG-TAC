import React, { useState } from 'react';
import { 
  Database, 
  Terminal, 
  Server, 
  Network, 
  ShieldCheck, 
  RefreshCw, 
  CheckSquare, 
  Clipboard, 
  Check,
  ChevronRight
} from 'lucide-react';

interface EnterpriseArchitectureTabProps {
  darkMode: boolean;
}

export default function EnterpriseArchitectureTab({ darkMode }: EnterpriseArchitectureTabProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'SCHEMA' | 'ERD' | 'DEPLOY' | 'BACKUP'>('SCHEMA');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const postgresDDL = `-- =======================================================
-- SYSTEM ENTERPRISE POSTGRESQL SCHEMA FOR TAX AGENT CORP
-- AUTHOR: SENIOR ENTERPRISE ARCHITECT (30 YEARS ERP EXPERIENCE)
-- TARGET: CRITICAL SECURE CLOUD DATABASE (VITE + DRIZZLE/PRISMA COMPATIBLE)
-- =======================================================

-- CREATE ENUMS
CREATE TYPE client_type AS ENUM ('ENTERPRISE', 'HOUSEHOLD', 'INDIVIDUAL');
CREATE TYPE filing_status AS ENUM ('PENDING', 'PREPARING', 'SUBMITTED', 'APPROVED', 'OVERDUE');
CREATE TYPE bctc_status AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');
CREATE TYPE alignment_status AS ENUM ('ALIGNED', 'UNALIGNED');
CREATE TYPE payment_status AS ENUM ('COMPLETED', 'PENDING', 'OVERDUE');
CREATE TYPE user_role AS ENUM ('ADMIN', 'MANAGER', 'TEAM_LEADER', 'STAFF', 'CLIENT');
CREATE TYPE priority_level AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- 1. BASE SYSTEM SYSTEM_USERS TABLE
CREATE TABLE system_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role user_role DEFAULT 'STAFF',
    client_id UUID,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. EMPLOYEES TABLE (STAFF)
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    role VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(150) UNIQUE,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CLIENTS TABLE
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type client_type DEFAULT 'ENTERPRISE',
    tax_code VARCHAR(50) UNIQUE NOT NULL,
    representative VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(150),
    address TEXT,
    industry VARCHAR(255),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at DATE DEFAULT CURRENT_DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TAX_FILINGS TABLE (TAX CALENDAR & FILINGS OBLIGATIONS)
CREATE TABLE tax_filings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL, -- e.g., 'GTGT_MONTH', 'GTGT_QUARTER', 'BCTC_YEAR'
    period VARCHAR(50) NOT NULL, -- e.g., '05/2026', 'Q2/2026', '2025'
    status filing_status DEFAULT 'PENDING',
    due_date DATE NOT NULL,
    amount NUMERIC(15, 2), -- Tax Payable if generated
    submitted_at TIMESTAMP WITH TIME ZONE,
    handler_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. ACCOUNTING_RECORDS TABLE
CREATE TABLE accounting_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    period VARCHAR(50) NOT NULL,
    bctc_status bctc_status DEFAULT 'NOT_STARTED',
    bookkeeping_status alignment_status DEFAULT 'ALIGNED',
    document_count INT DEFAULT 0,
    double_entries_count INT DEFAULT 0,
    unaligned_issues TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (client_id, period)
);

-- 6. LABOR_RECORDS TABLE
CREATE TABLE labor_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID UNIQUE NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    total_employees INT DEFAULT 0,
    active_contracts INT DEFAULT 0,
    bhxh_registered INT DEFAULT 0,
    bhxh_paid_status payment_status DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. CORE TASKS TABLE WITH RECURRENCE MODEL
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    group_name VARCHAR(100) NOT NULL, -- e.g., 'THUE', 'KE_TOAN', 'BAO_HIEM'
    notes TEXT,
    start_date DATE NOT NULL,
    due_date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    recurrence VARCHAR(50) DEFAULT 'NONE', -- e.g., 'DAILY', 'MONTHLY'
    priority priority_level DEFAULT 'MEDIUM',
    alert_days INT[] DEFAULT '{30, 20, 15, 7, 3, 0}',
    custom_alert_time TIME DEFAULT '09:00:00',
    assigned_to UUID REFERENCES employees(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    subtasks_json JSONB DEFAULT '[]'::jsonb,
    comments_json JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. SYSTEM AUDIT LOGGING TABLE
CREATE TABLE system_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    username VARCHAR(100) DEFAULT 'ANONYMOUS',
    role VARCHAR(50) DEFAULT 'GUEST',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    device_info TEXT,
    sql_statement TEXT
);

-- =======================================================
-- SYSTEM PERFORMANCE INDEXES
-- =======================================================
CREATE INDEX idx_clients_tax_code ON clients(tax_code);
CREATE INDEX idx_tax_filings_due ON tax_filings(due_date);
CREATE INDEX idx_tax_filings_client ON tax_filings(client_id);
CREATE INDEX idx_tasks_due ON tasks(due_date);
CREATE INDEX idx_tasks_assigned_client ON tasks(assigned_to, client_id);
CREATE INDEX idx_audit_logs_timestamp ON system_audit_logs(timestamp DESC);

-- =======================================================
-- SQL TRIGGER: AUTOMATIC ROW UPDATE TRACKING & LOGS
-- =======================================================
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clients_timestamp BEFORE UPDATE ON clients FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON system_users FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER update_filings_timestamp BEFORE UPDATE ON tax_filings FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER update_tasks_timestamp BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- =======================================================
-- ROW LEVEL SECURITY (RLS) FOR INTERNAL AGENT PLATFORM
-- =======================================================
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_filings ENABLE ROW LEVEL SECURITY;

-- Policy 1: Full access for Admin / Partners / Managers
CREATE POLICY admin_full_access ON clients 
    FOR ALL TO authenticated USING (current_setting('app.role', true) IN ('ADMIN', 'MANAGER', 'TEAM_LEADER'));

-- Policy 2: Clients can only see their own registered profile
CREATE POLICY client_portal_read ON clients
    FOR SELECT TO authenticated USING (id = (SELECT client_id FROM system_users WHERE id = auth.uid()));`;

  return (
    <div className="space-y-6">
      {/* Tab bar header */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        darkMode ? 'bg-zinc-950/60 border-zinc-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-red-600 rounded-lg text-white">
            <Database className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider">HỒ SƠ THIẾT KẾ KIẾN TRÚC & DATABASE ERP</h2>
            <p className={`text-[10px] sm:text-xs font-mono font-bold mt-0.5 ${darkMode ? 'text-zinc-500' : 'text-slate-500'}`}>
              PLATFORM VER: 3.2.0 • POSTGRESQL ENGINE PLATFORM SPECIFICATION
            </p>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {[
            { id: 'SCHEMA', label: 'Postgres SQL DDL', icon: Terminal },
            { id: 'ERD', label: 'Mô hình ERD (Visual)', icon: Network },
            { id: 'DEPLOY', label: 'Cẩm nang Deploy', icon: Server },
            { id: 'BACKUP', label: 'Backup & Recovery', icon: ShieldCheck }
          ].map(it => (
            <button
              key={it.id}
              onClick={() => setActiveSubTab(it.id as any)}
              className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold font-mono transition flex items-center space-x-1 border cursor-pointer ${
                activeSubTab === it.id
                  ? 'bg-red-650 border-red-650 text-white shadow-sm'
                  : darkMode
                    ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-850 text-zinc-300'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <it.icon className="w-3.5 h-3.5 shrink-0" />
              <span>{it.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main rendering area of tabs */}
      {activeSubTab === 'SCHEMA' && (
        <div className="space-y-4 animate-fade-in text-xs">
          <div className={`p-4 rounded-xl border ${darkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex justify-between items-center mb-2.5">
              <span className="font-extrabold flex items-center gap-1.5 text-red-650 tracking-wide font-mono uppercase">
                <Terminal className="w-4 h-4 text-red-500" />
                <span>Production DDL Script (PostgreSQL v15+)</span>
              </span>
              <button
                onClick={() => copyToClipboard(postgresDDL, 'ddl')}
                className={`p-1 px-3.5 text-[10px] font-bold rounded-lg transition border flex items-center gap-1.5 cursor-pointer ${
                  copiedId === 'ddl'
                    ? 'bg-emerald-600 border-emerald-650 text-white'
                    : darkMode
                      ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                      : 'bg-white border-slate-250 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {copiedId === 'ddl' ? <Check className="w-3 h-3" /> : <Clipboard className="w-3 h-3" />}
                <span>{copiedId === 'ddl' ? 'ĐÃ SAO CHÉP' : 'SAO CHÉP CODE DDL'}</span>
              </button>
            </div>
            
            <p className={`text-[11px] mb-3 leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-slate-650'}`}>
              Hệ thống sử dụng cơ sở dữ liệu quan hệ doanh nghiệp <strong>PostgreSQL</strong> với tính toàn vẹn tham chiếu khóa ngoại chặt chẽ, tối ưu hóa lập chỉ mục B-Tree, Ràng buộc UNIQUE và Row Level Security bảo vệ rò rỉ dữ liệu chéo giữa các Doanh nghiệp bên ngoài.
            </p>

            <div className="relative">
              <pre className={`p-4 rounded-lg font-mono font-medium overflow-x-auto text-[10px] md:text-xs leading-relaxed border max-h-[480px] select-all ${
                darkMode ? 'bg-black/90 border-zinc-950 text-emerald-400' : 'bg-[#1e1e1e] border-slate-900 text-emerald-400'
              }`}>
                <code>{postgresDDL}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'ERD' && (
        <div className="space-y-4 animate-fade-in text-xs">
          <div className={`p-5 rounded-xl border ${darkMode ? 'bg-[#111e32]/30 border-sky-950' : 'bg-white border-slate-200'}`}>
            <h3 className="font-bold text-sm text-red-600 dark:text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Network className="w-4 h-4" />
              <span>Sơ Đồ Thực Thể Quan Hệ (ERD) - Mô Hình Chuẩn ERP</span>
            </h3>
            <p className={`mb-4 italic ${darkMode ? 'text-zinc-500' : 'text-slate-500'}`}>
              Phác họa các mối liên kết khoá ngoại (FK 1-N và 1-1) chuẩn hoá cao nhất chống redundance dữ liệu nghiệp vụ:
            </p>

            {/* SVG Interactive Map */}
            <div className={`p-4 rounded-xl border flex justify-center overflow-x-auto ${darkMode ? 'bg-zinc-950/40 border-zinc-850' : 'bg-slate-50 border-slate-150'}`}>
              <svg width="780" height="420" viewBox="0 0 780 420" className="max-w-full block shrink-0">
                {/* Defs for gradients */}
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
                  </marker>
                </defs>

                {/* ENTITY: clients */}
                <rect x="20" y="80" width="180" height="230" rx="8" fill={darkMode ? '#1e293b' : '#3b82f6'} fillOpacity="0.1" stroke={darkMode ? '#38bdf8' : '#3b82f6'} strokeWidth="1.5" />
                <rect x="20" y="80" width="180" height="30" rx="8" fill={darkMode ? '#1e293b' : '#3b82f6'} />
                <text x="110" y="100" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">🏢 CLIENTS (Khách Hàng)</text>
                <text x="30" y="130" fill={darkMode ? '#93c5fd' : '#1e3a8a'} fontSize="9" fontWeight="bold">🔑 id : UUID [PK]</text>
                <text x="30" y="150" fill={darkMode ? '#fff' : '#000'} fontSize="9">tax_code : VARCHAR [UNQ]</text>
                <text x="30" y="170" fill={darkMode ? '#fff' : '#000'} fontSize="9">name : VARCHAR</text>
                <text x="30" y="190" fill={darkMode ? '#fff' : '#000'} fontSize="9">type : client_type</text>
                <text x="30" y="210" fill={darkMode ? '#fff' : '#000'} fontSize="9">representative : VARCHAR</text>
                <text x="30" y="230" fill={darkMode ? '#fff' : '#000'} fontSize="9">phone | email: VARCHAR</text>
                <text x="30" y="250" fill={darkMode ? '#fff' : '#000'} fontSize="9">status : VARCHAR</text>
                <text x="30" y="270" fill={darkMode ? '#fff' : '#000'} fontSize="9">created_at : DATE</text>

                {/* ENTITY: tax_filings */}
                <rect x="290" y="10" width="190" height="180" rx="8" fill={darkMode ? '#1e293b' : '#ef4444'} fillOpacity="0.1" stroke={darkMode ? '#f43f5e' : '#ef4444'} strokeWidth="1.5" />
                <rect x="290" y="10" width="190" height="30" rx="8" fill={darkMode ? '#1e293b' : '#ef4444'} />
                <text x="385" y="29" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">📁 TAX_FILINGS (Tờ Khai Thuế)</text>
                <text x="300" y="60" fill={darkMode ? '#fda4af' : '#7f1d1d'} fontSize="9" fontWeight="bold">🔑 id : UUID [PK]</text>
                <text x="300" y="80" fill={darkMode ? '#fda4af' : '#7f1d1d'} fontSize="9">🔗 client_id : UUID [FK]</text>
                <text x="300" y="100" fill={darkMode ? '#fff' : '#000'} fontSize="9">type : VARCHAR</text>
                <text x="300" y="120" fill={darkMode ? '#fff' : '#000'} fontSize="9">period : VARCHAR</text>
                <text x="300" y="140" fill={darkMode ? '#fff' : '#000'} fontSize="9">due_date : DATE</text>
                <text x="300" y="160" fill={darkMode ? '#fff' : '#000'} fontSize="9">status : filing_status</text>
                <text x="300" y="180" fill={darkMode ? '#93c5fd' : '#111827'} fontSize="9">🔗 handler_id : UUID [FK]</text>

                {/* ENTITY: employees */}
                <rect x="580" y="10" width="180" height="150" rx="8" fill={darkMode ? '#1e293b' : '#10b981'} fillOpacity="0.1" stroke={darkMode ? '#34d399' : '#10b981'} strokeWidth="1.5" />
                <rect x="580" y="10" width="180" height="30" rx="8" fill={darkMode ? '#1e293b' : '#10b981'} />
                <text x="670" y="29" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">👥 EMPLOYEES (Nhân Viên)</text>
                <text x="590" y="62" fill={darkMode ? '#a7f3d0' : '#064e3b'} fontSize="9" fontWeight="bold">🔑 id : UUID [PK]</text>
                <text x="590" y="82" fill={darkMode ? '#fff' : '#000'} fontSize="9">name : VARCHAR</text>
                <text x="590" y="102" fill={darkMode ? '#fff' : '#000'} fontSize="9">role : VARCHAR</text>
                <text x="590" y="122" fill={darkMode ? '#fff' : '#000'} fontSize="9">phone | email : VARCHAR</text>
                <text x="590" y="142" fill={darkMode ? '#fff' : '#000'} fontSize="9">status : VARCHAR</text>

                {/* ENTITY: labor_records */}
                <rect x="290" y="235" width="190" height="170" rx="8" fill={darkMode ? '#1e293b' : '#f59e0b'} fillOpacity="0.1" stroke={darkMode ? '#fbbf24' : '#f59e0b'} strokeWidth="1.5" />
                <rect x="290" y="235" width="190" height="30" rx="8" fill={darkMode ? '#1e293b' : '#f59e0b'} />
                <text x="385" y="254" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">💼 BHXH & LAO ĐỘNG</text>
                <text x="300" y="285" fill={darkMode ? '#fef08a' : '#78350f'} fontSize="9" fontWeight="bold">🔑 id : UUID [PK]</text>
                <text x="300" y="305" fill={darkMode ? '#fef08a' : '#78350f'} fontSize="9">🔗 client_id : UUID [FK-1:1]</text>
                <text x="300" y="325" fill={darkMode ? '#fff' : '#000'} fontSize="9">total_employees : INT</text>
                <text x="300" y="345" fill={darkMode ? '#fff' : '#000'} fontSize="9">active_contracts : INT</text>
                <text x="300" y="365" fill={darkMode ? '#fff' : '#000'} fontSize="9">bhxh_registered : INT</text>
                <text x="300" y="385" fill={darkMode ? '#fff' : '#000'} fontSize="9">bhxh_paid_status : payment_status</text>

                {/* RELATIONSHIPS LINES */}
                {/* clients (200, 150) -> tax_filings (290, 80) */}
                <path d="M 200 150 L 245 150 Q 245 80 290 80" fill="none" stroke="#ef4444" strokeWidth="1.5" markerStart="url(#arrow)" />
                {/* clients (200, 250) -> labor_records (290, 305) */}
                <path d="M 200 250 L 245 250 Q 245 305 290 305" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
                {/* employees (580, 80) -> tax_filings (480, 140) */}
                <path d="M 580 80 L 530 80 Q 530 140 480 140" fill="none" stroke="#10b981" strokeWidth="1.2" />

                {/* Legend notes */}
                <text x="560" y="280" fill={darkMode ? '#a1a1aa' : '#4b5563'} fontSize="9" fontStyle="italic">Mối quan hệ chính:</text>
                <text x="560" y="300" fill={darkMode ? '#38bdf8' : '#3b82f6'} fontSize="9">● Red Lines: 1-N Client to Filings (Cascade)</text>
                <text x="560" y="320" fill={darkMode ? '#fbbf24' : '#f59e0b'} fontSize="9">● Amber Lines: 1-1 Client to Labor-Insurance</text>
                <text x="560" y="340" fill={darkMode ? '#34d399' : '#10b981'} fontSize="9">● Green Lines: Employee Assignment (Set Null)</text>
              </svg>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'DEPLOY' && (
        <div className="space-y-4 animate-fade-in text-xs leading-relaxed">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Deploy guide */}
            <div className={`p-4 rounded-xl border ${darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-slate-200'}`}>
              <h3 className="font-bold text-xs text-red-650 uppercase tracking-widest mb-3 flex items-center gap-1.5 border-b pb-2 border-red-500/10">
                <Server className="w-4 h-4 text-red-500" />
                <span>Quy Trình Deploy Cloud Run (Vercel + Render)</span>
              </h3>
              
              <ol className="space-y-3 pl-3 list-decimal">
                <li>
                  <strong className={darkMode ? 'text-zinc-200' : 'text-slate-900'}>Bước 1: Cloud SQL PostgreSQL Provisioning</strong>
                  <p className={darkMode ? 'text-zinc-400' : 'text-slate-500'}>
                    Tạo cơ sở dữ liệu Postgres trên AWS RDS hoặc Supabase. Lưu lại chuỗi kết nối an toàn: <code className="p-0.5 px-1 rounded bg-black/40 text-red-400">DATABASE_URL=postgresql://user:pass@host:5432/taxcorp</code>
                  </p>
                </li>
                <li>
                  <strong className={darkMode ? 'text-zinc-200' : 'text-slate-900'}>Bước 2: Cài Đặt Biến Môi Trường (Environment Variables)</strong>
                  <p className={darkMode ? 'text-zinc-400' : 'text-slate-500'}>
                    Đảm bảo trong trang cài đặt Server (Render or Railway) khai báo đủ các khóa mã hóa:
                  </p>
                  <pre className="p-2 border rounded bg-black/60 text-[9px] text-emerald-450 font-mono mt-1 leading-snug">
                    NODE_ENV=production{"\n"}
                    PORT=3000{"\n"}
                    JWT_SECRET=superSecretAgentKey2026_ERP{"\n"}
                    JWT_REFRESH_SECRET=anotherSuperSecretKey_2026{"\n"}
                    ENCRYPTION_KEY=X9#taxAgent!SecureKey_2026
                  </pre>
                </li>
                <li>
                  <strong className={darkMode ? 'text-zinc-200' : 'text-slate-900'}>Bước 3: Biên Dịch Build Thư Mục Tĩnh (Frontend & Backend)</strong>
                  <p className={darkMode ? 'text-zinc-400' : 'text-slate-500'}>
                    Chạy câu lệnh build sản phẩm: <code className="p-0.5 px-1 rounded bg-black/40 text-rose-400">npm run build</code>. Vite sẽ biên dịch frontend vào thư mục <code className="p-0.5 px-1 rounded bg-black/40 text-amber-400">dist/</code> và esbuild sẽ đóng gói <code className="p-0.5 px-1 rounded bg-black/40 text-green-400">server.ts</code> thành <code className="p-0.5 px-1 rounded bg-black/40 text-green-400">dist/server.cjs</code>.
                  </p>
                </li>
              </ol>
            </div>

            {/* Checklist */}
            <div className={`p-4 rounded-xl border ${darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-slate-200'}`}>
              <h3 className="font-bold text-xs text-red-650 uppercase tracking-widest mb-3 flex items-center gap-1.5 border-b pb-2 border-red-500/10">
                <CheckSquare className="w-4 h-4 text-emerald-500" />
                <span>Checklist Kiểm Tra An Toàn (SaaS Audit List)</span>
              </h3>
              
              <ul className="space-y-2.5">
                {[
                  { title: 'Row Level Security Policies', desc: 'Đảm bảo chính sách RLS ngăn dữ liệu khách hàng chéo đã được khởi động thành công trên PostgreSQL Production.', active: true },
                  { title: 'Mã Hóa AES Sổ Sách Nhà Nước', desc: 'Cấu hình khóa an toàn 256-bit CBC bảo mật chặt chẽ file lưu vết SQLite simulation local (.BAK) trên server.', active: true },
                  { title: 'Sao lưu định kỳ CronJob hằng giờ', desc: 'Có tiến trình cron tự động kích hoạt API /api/backup để ghi vào đĩa hoặc đẩy lên AWS S3 tự động.', active: true },
                  { title: 'Tích hợp kênh Zalo, Telegram API', desc: 'Bảo mật token bot và kênh thông báo của Đại lý thuế tại thiết lập môi trường để tránh lộ lọt API keys.', active: true }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-500 mt-0.5">
                      <Check className="w-3 h-3 font-bold" />
                    </div>
                    <div>
                      <span className={`font-semibold ${darkMode ? 'text-zinc-200' : 'text-slate-800'}`}>{item.title}</span>
                      <p className={`text-[10px] ${darkMode ? 'text-zinc-400' : 'text-slate-500'} mt-0.5`}>{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      )}

      {activeSubTab === 'BACKUP' && (
        <div className="space-y-4 animate-fade-in text-xs leading-relaxed">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Backup Strategy */}
            <div className={`p-4 rounded-xl border ${darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-slate-200'}`}>
              <h3 className="font-bold text-xs text-red-650 uppercase tracking-widest mb-3 flex items-center gap-1.5 border-b pb-2 border-red-500/10">
                <RefreshCw className="w-4 h-4 text-red-500" />
                <span>Chiến Lược Backup Định Kỳ 3 Lớp (Grandfather-Father-Son)</span>
              </h3>
              
              <div className="space-y-3.5">
                <div className={`p-2.5 rounded-lg border ${darkMode ? 'bg-black/40 border-zinc-850' : 'bg-slate-50 border-slate-150'}`}>
                  <strong className={darkMode ? 'text-blue-400' : 'text-blue-700'}>1. Lớp Ngày (Son):</strong>
                  <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-zinc-450' : 'text-slate-505'}`}>
                    Tự động sao lưu nhanh 24 giờ một lần vào lúc 00:05 đêm. Điểm lưu cục bộ dạng file <code className="text-red-400">.BAK</code> được mật mã hóa CBC đảm bảo an toàn nếu máy chủ bị rò rỉ đĩa.
                  </p>
                </div>

                <div className={`p-2.5 rounded-lg border ${darkMode ? 'bg-black/40 border-zinc-850' : 'bg-slate-50 border-slate-150'}`}>
                  <strong className={darkMode ? 'text-amber-400' : 'text-amber-700'}>2. Lớp Tuần (Father):</strong>
                  <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-zinc-450' : 'text-slate-505'}`}>
                    Gộp tất cả dữ liệu, mã hóa và đẩy tự động lên AWS S3 bucket định kỳ Chủ nhật hằng tuần lúc 02:00 sáng. Giữ tối đa 4 phiên bản gần nhất để giải phóng bộ nhớ.
                  </p>
                </div>

                <div className={`p-2.5 rounded-lg border ${darkMode ? 'bg-black/40 border-zinc-850' : 'bg-slate-50 border-slate-150'}`}>
                  <strong className={darkMode ? 'text-emerald-450' : 'text-emerald-700'}>3. Lớp Tháng (Grandfather):</strong>
                  <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-zinc-450' : 'text-slate-505'}`}>
                    Sao lưu nguội (Cold backup) định kỳ ngày 1 hằng tháng. Xuất tệp tin dữ liệu thô nén lại, chuyển lưu trữ ngoại tuyến hoặc gửi email báo cáo mật cho Ban quản lý Đại lý thuế.
                  </p>
                </div>
              </div>
            </div>

            {/* Disaster Recovery playbook */}
            <div className={`p-4 rounded-xl border ${darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-slate-200'}`}>
              <h3 className="font-bold text-xs text-red-650 uppercase tracking-widest mb-3 flex items-center gap-1.5 border-b pb-2 border-red-500/10">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Quy Trình Phục Hồi Khi Máy Chủ Sự Cố (Disaster Recovery)</span>
              </h3>
              
              <ul className="space-y-3.5">
                <li className="flex gap-2">
                  <div className="w-5 h-5 rounded bg-red-550 flex items-center justify-center font-bold text-white shrink-0">1</div>
                  <div>
                    <span className={`font-semibold ${darkMode ? 'text-zinc-200' : 'text-slate-800'}`}>Kích Hoạt Chế Độ Bảo Trì (Maintenance Mode)</span>
                    <p className={darkMode ? 'text-zinc-450' : 'text-slate-500'}>Chuyển cổng nginx phân tuyến về thông báo lỗi 503 tạm thời để khoanh vùng chặn ghi các phiên nghiệp vụ mới.</p>
                  </div>
                </li>

                <li className="flex gap-2">
                  <div className="w-5 h-5 rounded bg-blue-550 flex items-center justify-center font-bold text-white shrink-0">2</div>
                  <div>
                    <span className={`font-semibold ${darkMode ? 'text-zinc-200' : 'text-slate-800'}`}>Tải Điểm Phục Hồi .BAK An Toàn Gần Nhất</span>
                    <p className={darkMode ? 'text-zinc-450' : 'text-slate-500'}>Tải tệp tin sao lưu đã được kiểm tra tính khớp hash MD5 từ AWS S3 xuống ổ đĩa cục bộ tạm.</p>
                  </div>
                </li>

                <li className="flex gap-2">
                  <div className="w-5 h-5 rounded bg-emerald-550 flex items-center justify-center font-bold text-white shrink-0">3</div>
                  <div>
                    <span className={`font-semibold ${darkMode ? 'text-zinc-200' : 'text-slate-800'}`}>Khôi Phục State Qua Lệnh API Giải Mã</span>
                    <p className={darkMode ? 'text-zinc-450' : 'text-slate-500'}>Giải mã AES-256 đối chiếu khóa, chạy khôi phục tệp cơ sở dữ liệu và tái lập cấu trúc chỉ mục trong vòng dưới 2 phút bảo trì trực tuyến.</p>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
