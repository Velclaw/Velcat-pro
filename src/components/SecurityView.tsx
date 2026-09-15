import React, { useState } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  Smartphone, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  RefreshCw,
  QrCode,
  FileCheck2,
  Users
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n';

interface SecurityViewProps {
  twoFactorEnabled: boolean;
  onToggle2FA: (enabled: boolean) => void;
  lang: Language;
}

export const SecurityView: React.FC<SecurityViewProps> = ({
  twoFactorEnabled,
  onToggle2FA,
  lang,
}) => {
  const t = translations[lang];
  const [showSetup2FA, setShowSetup2FA] = useState(false);
  const [totpCode, setTotpCode] = useState('');
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [activeTab, setActiveTab] = useState<'2fa' | 'compliance' | 'audit'>('2fa');

  const simulatedSecretKey = 'JBSWY3DPEHPK3PXP';
  const backupCodes = ['8291-0419', '3819-2041', '9102-4819', '1824-9102', '5521-8841'];

  const auditTrails = [
    { event: 'Xác thực 2FA thành công qua Google Authenticator', user: 'Alex Tran (Admin)', ip: '113.161.72.10', time: '5 phút trước', status: 'Success' },
    { event: 'Giải mã bí mật GEMINI_API_KEY trong Docker deployment', user: 'CI/CD Worker Pod #04', ip: '10.244.1.18', time: '10 phút trước', status: 'Success' },
    { event: 'Tạo snapshot bản sao lưu lên Google Drive & Dropbox', user: 'System Auto-Backup', ip: 'internal', time: '40 phút trước', status: 'Success' },
    { event: 'Cập nhật phân quyền nhóm DevOps cho Minh Nguyen', user: 'Alex Tran (Admin)', ip: '113.161.72.10', time: '2 giờ trước', status: 'Success' },
    { event: 'Yêu cầu kiểm tra DNS SSL Certificate Let\'s Encrypt', user: 'Edge Bot', ip: '76.76.21.21', time: 'Hôm qua', status: 'Success' },
  ];

  const complianceStandards = [
    { name: 'ISO/IEC 27001:2022', status: 'Đạt chuẩn (Certified)', score: '99.4%', detail: 'Quản lý an toàn thông tin & kiểm soát truy cập mã nguồn' },
    { name: 'SOC 2 Type II', status: 'Tuân thủ nghiêm ngặt', score: '100%', detail: 'Bảo mật dữ liệu, tính toàn vẹn và bảo mật lưu trữ đám mây' },
    { name: 'Zero Trust Network & TLS 1.3', status: 'Kích hoạt toàn diện', score: 'A+ SSL Labs', detail: 'Tất cả kết nối Edge PoP đều được mã hóa bắt buộc HTTPS' },
    { name: 'GDPR / NDPR Data Privacy', status: 'Compliant', score: 'Verified', detail: 'Không lưu trữ thông tin cá nhân nhạy cảm trái phép' },
  ];

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (totpCode.length === 6) {
      onToggle2FA(true);
      setShowSetup2FA(false);
      setTotpCode('');
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(simulatedSecretKey);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-cyan-400" />
            <span>{t.security.title}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Bảo vệ tài khoản và cụm triển khai repo-VelClaw bằng chuẩn bảo mật hai yếu tố và chứng chỉ quốc tế.
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1 text-xs">
          <button
            onClick={() => setActiveTab('2fa')}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
              activeTab === '2fa' ? 'bg-cyan-500 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Xác thực 2FA
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
              activeTab === 'compliance' ? 'bg-cyan-500 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tiêu chuẩn ISO/SOC2
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
              activeTab === 'audit' ? 'bg-cyan-500 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Trails
          </button>
        </div>
      </div>

      {/* 2FA SETUP SECTION */}
      {activeTab === '2fa' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Status Box (6 cols) */}
          <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${twoFactorEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Xác thực 2 bước (TOTP Authenticator)</h2>
                  <p className="text-xs text-slate-400">Google Authenticator, Authy hoặc 1Password</p>
                </div>
              </div>

              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                twoFactorEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {twoFactorEnabled ? 'Đã bật bảo vệ' : 'Chưa kích hoạt'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Xác thực 2 yếu tố (2FA) bổ sung lớp bảo mật bổ sung cho tài khoản quản trị VelCat Pro. Mỗi lần đăng nhập hoặc thay đổi biến môi trường, hệ thống yêu cầu mã 6 số thời gian thực.
            </p>

            <div className="pt-2">
              {twoFactorEnabled ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>Tài khoản của bạn đã được bảo vệ an toàn bằng 2FA. Bắt buộc đối với toàn bộ thành viên trong tổ chức.</span>
                  </div>
                  <button
                    onClick={() => onToggle2FA(false)}
                    className="text-xs text-rose-400 hover:underline font-semibold"
                  >
                    Vô hiệu hóa 2FA (Không khuyến nghị)
                  </button>
                </div>
              ) : (
                <button
                  id="btn-setup-2fa-trigger"
                  onClick={() => setShowSetup2FA(true)}
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:from-cyan-400 hover:to-blue-500 transition-all"
                >
                  {t.security.enable2FA}
                </button>
              )}
            </div>
          </div>

          {/* Backup Codes Box (6 cols) */}
          <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 md:p-6 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <KeyRound className="h-4 w-4 text-cyan-400" />
              <span>Mã dự phòng khẩn cấp (Backup Recovery Codes)</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Lưu lại các mã này ở nơi an toàn. Mỗi mã chỉ sử dụng một lần nếu bạn mất quyền truy cập vào điện thoại.
            </p>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs text-slate-300">
              {backupCodes.map((c, i) => (
                <div key={i} className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-center text-cyan-300">
                  {c}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 2FA SETUP MODAL WITH SIMULATED QR CODE */}
      {showSetup2FA && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h2 className="text-white font-bold text-sm flex items-center gap-2">
                <QrCode className="h-4 w-4 text-cyan-400" />
                <span>Cài Đặt Xác Thực Hai Bước (2FA)</span>
              </h2>
              <button onClick={() => setShowSetup2FA(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-slate-300">
                1. Mở ứng dụng xác thực (Google Authenticator / Authy) trên điện thoại và quét mã QR:
              </p>

              {/* Simulated QR Code Canvas */}
              <div className="flex flex-col items-center justify-center rounded-xl bg-white p-4 mx-auto w-44 h-44 shadow-lg">
                <div className="grid grid-cols-6 gap-1 w-full h-full p-2 bg-slate-100 rounded-lg">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-xs ${
                        (i % 2 === 0 && i % 3 === 0) || i === 0 || i === 5 || i === 30 || i === 35
                          ? 'bg-slate-950'
                          : i % 5 === 0
                          ? 'bg-cyan-600'
                          : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-[11px]">Hoặc nhập mã khóa thủ công (Secret key):</span>
                <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-cyan-300">
                  <span>{simulatedSecretKey}</span>
                  <button onClick={handleCopyKey} className="text-slate-400 hover:text-white">
                    {copiedSecret ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <form onSubmit={handleVerify2FA} className="space-y-3 pt-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    2. Nhập mã xác nhận 6 số từ ứng dụng:
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full text-center tracking-[0.5em] text-lg font-bold rounded-lg border border-slate-700 bg-slate-950 py-2.5 text-white focus:border-cyan-500 focus:outline-none font-mono"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSetup2FA(false)}
                    className="rounded-lg px-3 py-2 text-slate-400 hover:text-white"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={totpCode.length !== 6}
                    className="rounded-lg bg-cyan-500 px-5 py-2 font-bold text-white hover:bg-cyan-400 disabled:opacity-50"
                  >
                    Xác nhận & Bật 2FA
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* COMPLIANCE STANDARDS SECTION */}
      {activeTab === 'compliance' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-cyan-400" />
              <span>Chứng Chỉ & Tuân Thủ Chuẩn Bảo Mật Quốc Tế</span>
            </h2>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> 100% Passed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {complianceStandards.map((std, i) => (
              <div key={i} className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{std.name}</span>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-400 px-2 py-0.5 font-bold text-[10px]">
                    {std.status}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">{std.detail}</p>
                <div className="font-mono text-cyan-400 text-[11px] font-semibold pt-1 border-t border-slate-900">
                  Điểm đánh giá kiểm toán: {std.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AUDIT TRAILS SECTION */}
      {activeTab === 'audit' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              <span>Nhật Ký Truy Vết Bảo Mật (Security Audit Trails)</span>
            </h2>
            <span className="text-xs text-slate-400">Thời gian thực</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-medium">
                  <th className="pb-3">Sự kiện bảo mật</th>
                  <th className="pb-3">Người thực hiện</th>
                  <th className="pb-3">IP Nguồn</th>
                  <th className="pb-3">Thời gian</th>
                  <th className="pb-3 text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {auditTrails.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-800/30">
                    <td className="py-3 font-medium text-slate-100">{row.event}</td>
                    <td className="py-3 text-slate-300">{row.user}</td>
                    <td className="py-3 font-mono text-slate-400 text-[11px]">{row.ip}</td>
                    <td className="py-3 text-slate-400 text-[11px]">{row.time}</td>
                    <td className="py-3 text-right">
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-400 font-semibold text-[10px]">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
