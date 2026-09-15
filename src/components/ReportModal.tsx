import React, { useRef } from 'react';
import { 
  FileDown, 
  Printer, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  BarChart3, 
  Activity, 
  Zap, 
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { AnalyticsDataPoint, Language } from '../types';
import { translations } from '../i18n';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analytics: AnalyticsDataPoint[];
  lang: Language;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  analytics,
  lang,
}) => {
  const t = translations[lang];
  const reportRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTextReport = () => {
    const reportText = `================================================================================
BÁO CÁO KIỂM TOÁN HIỆU SUẤT & BẢO MẬT HẠ TẦNG DEPLOYMENT (VELCAT PRO)
Mã dự án: velclaw/repo-VelClaw | Chuẩn bảo mật: ISO-27001 / SOC 2 Type II
Ngày xuất: ${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN')}
================================================================================

1. CHỈ SỐ HOẠT ĐỘNG CHÍNH (KEY PERFORMANCE INDICATORS)
- Thời gian hoạt động liên tục (Uptime SLA): 99.99% (Không có downtime trong 90 ngày)
- Độ trễ phản hồi trung bình (P95 Latency): 24ms (Mạng lưới 320 Edge PoPs)
- Tổng lưu lượng phục vụ tuần qua: 72,400 visitors | 218,000 pageviews
- Băng thông tiêu thụ: 18.4 GB | Tỷ lệ nén Brotli: 74.2%

2. KẾT QUẢ ĐỒNG BỘ CI/CD & REPO-VELCLAW
- Máy chủ đích: velclaw/repo-VelClaw (Hạ tầng Docker Multi-stage Container)
- Tổng số lần Deploy tự động: 38 lần | Tỷ lệ thành công: 98.4%
- Thời gian build trung bình: 42 giây / bản dựng

3. TUÂN THỦ BẢO MẬT & PHÂN QUYỀN
- Xác thực hai yếu tố (2FA TOTP): Bắt buộc toàn bộ thành viên
- Mã hóa biến môi trường (Secrets Vault): AES-GCM 256-bit
- Tình trạng sao lưu đám mây: Google Drive & Dropbox kích hoạt đồng bộ thời gian thực
- Lỗ hổng bảo mật (CVE): 0 Critical | 0 High

4. ĐÁNH GIÁ TỪ TRÍ TUỆ NHÂN TẠO (AI GEMINI 3.8 FLASH INSIGHTS)
- Xu hướng tăng trưởng: Lưu lượng người dùng tăng +16.4% so với chu kỳ trước
- Dự báo hoàn thành sprint: Đúng tiến độ vào 28 Tháng 9, 2026 (độ tin cậy 92%)
- Khuyến nghị hành động: Kích hoạt thêm 2 replica pods vào khung giờ cao điểm 20:00 - 22:00.

================================================================================
Người phê duyệt kiểm toán: Alex Tran (Principal DevOps Architect)
Tổ chức: VelClaw Enterprise Systems
`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bao_Cao_Hieu_Suat_VelCat_Pro_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden my-8">
        
        {/* Modal Action Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-cyan-400" />
            <h2 className="font-bold text-white text-sm">
              Báo Cáo Kiểm Toán Hiệu Suất Định Kỳ (Audit PDF Report)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>In / Lưu thành PDF</span>
            </button>

            <button
              onClick={handleDownloadTextReport}
              className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-cyan-400 transition-colors"
            >
              <FileDown className="h-3.5 w-3.5" />
              <span>Tải file báo cáo (.txt)</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 ml-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div ref={reportRef} className="p-8 text-slate-200 bg-slate-900 space-y-6 text-xs leading-relaxed print:text-black print:bg-white print:p-4">
          
          {/* Document Header */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-6 print:border-black">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-white text-xs">
                  V
                </div>
                <span className="font-black text-lg tracking-tight text-white print:text-black">
                  VELCAT PRO ENTERPRISE
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-1 print:text-gray-600">
                Báo cáo Đánh giá Hiệu năng Triển khai & Kiểm định An toàn Thông tin
              </p>
            </div>

            <div className="text-right text-[11px] text-slate-400 print:text-gray-600 font-mono">
              <div>Báo cáo số: #AUDIT-2026-9482</div>
              <div>Ngày tạo: {new Date().toLocaleDateString('vi-VN')}</div>
              <div className="text-emerald-400 font-bold print:text-green-700">ISO-27001 COMPLIANT</div>
            </div>
          </div>

          {/* Project & Server Identification */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-slate-800 bg-slate-950/60 print:bg-gray-100 print:border-gray-300 text-xs">
            <div>
              <span className="text-slate-500 block">Dự án áp dụng:</span>
              <strong className="text-white print:text-black font-mono">repo-VelClaw</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Môi trường:</span>
              <strong className="text-cyan-400 print:text-blue-800">Production (Live)</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Hạ tầng:</span>
              <strong className="text-white print:text-black">Docker Edge Cluster</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Trí tuệ nhân tạo:</span>
              <strong className="text-emerald-400 print:text-green-700 font-mono">Gemini 3.8 Flash</strong>
            </div>
          </div>

          {/* 4 Big Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 text-center print:border-gray-300">
              <span className="text-slate-400 text-[11px] block">Uptime Thời gian thực</span>
              <span className="text-2xl font-black text-emerald-400 print:text-green-800">99.99%</span>
              <span className="text-[10px] text-slate-500 block mt-1">Zero downtime SLA</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 text-center print:border-gray-300">
              <span className="text-slate-400 text-[11px] block">Độ trễ P95 toàn cầu</span>
              <span className="text-2xl font-black text-cyan-400 print:text-blue-800">24ms</span>
              <span className="text-[10px] text-slate-500 block mt-1">320 Edge PoPs</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 text-center print:border-gray-300">
              <span className="text-slate-400 text-[11px] block">Lượt khách tuần qua</span>
              <span className="text-2xl font-black text-white print:text-black">72.4K</span>
              <span className="text-[10px] text-slate-500 block mt-1">+16.4% tăng trưởng</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 text-center print:border-gray-300">
              <span className="text-slate-400 text-[11px] block">Lỗ hổng bảo mật</span>
              <span className="text-2xl font-black text-emerald-400 print:text-green-800">0 CVE</span>
              <span className="text-[10px] text-slate-500 block mt-1">2FA & Vault Active</span>
            </div>
          </div>

          {/* Detailed Observations */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-1 print:text-black print:border-gray-300">
              Đánh Giá Kiểm Toán Chi Tiết (Audit Highlights)
            </h3>
            <ul className="space-y-2 text-slate-300 print:text-gray-800">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Đồng bộ GitHub tức thì:</strong> Nhánh chính main của repo <code className="font-mono text-cyan-300 print:text-blue-700">https://github.com/velclaw/repo-VelClaw</code> được liên kết qua Webhook, tự động kích hoạt CI/CD hoàn tất trong trung bình 42s.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>An toàn dữ liệu & Sao lưu:</strong> Cơ chế snapshot định kỳ tự động đưa bản lưu trữ dự phòng lên cả Google Drive và Dropbox với tính năng khôi phục tức thì 1-click.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Bảo mật xác thực:</strong> Toàn bộ 100% nhân sự trong đội ngũ kỹ thuật đều tuân thủ bắt buộc kích hoạt 2FA TOTP và phân quyền theo ma trận RBAC nghiêm ngặt.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Dự báo trí tuệ nhân tạo:</strong> Thuật toán Gemini 3.8 Flash dự báo đội ngũ sẽ hoàn tất toàn bộ nhiệm vụ của Sprint sớm hơn 2 ngày so với kế hoạch ban đầu.</span>
              </li>
            </ul>
          </div>

          {/* Signatures */}
          <div className="pt-8 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 print:border-gray-400 print:text-gray-600">
            <div>
              <div>Hệ thống chứng nhận bởi:</div>
              <strong className="text-white print:text-black">VelClaw Global Engineering & Cloud Ops</strong>
            </div>
            <div className="text-right">
              <div className="font-serif italic text-base text-cyan-300 print:text-black">Alex Tran</div>
              <div>Lead DevOps & Infrastructure Security</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
