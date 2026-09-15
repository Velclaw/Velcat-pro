import React from 'react';
import { 
  Rocket, 
  GitBranch, 
  Github, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Activity, 
  Server, 
  Lock, 
  Bell, 
  Globe, 
  Bot, 
  Terminal, 
  ExternalLink, 
  Play, 
  Cpu, 
  Zap, 
  Clock, 
  Copy, 
  Check,
  ChevronRight,
  Database,
  Layers,
  Sparkles,
  LifeBuoy
} from 'lucide-react';
import { ActiveTab, Language, Deployment } from '../types';
import { translations } from '../i18n';

interface HomeSetupViewProps {
  onNavigateTab: (tab: ActiveTab) => void;
  onTriggerDeploy: () => void;
  deployments: Deployment[];
  lang: Language;
}

export const HomeSetupView: React.FC<HomeSetupViewProps> = ({
  onNavigateTab,
  onTriggerDeploy,
  deployments,
  lang,
}) => {
  const [copiedCmd, setCopiedCmd] = React.useState(false);
  const t = translations[lang];

  const latestDeploy = deployments[0];

  const handleCopyCmd = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2500);
  };

  const setupSteps = [
    {
      id: 1,
      title: 'Kết Nối Mã Nguồn GitHub',
      subtitle: 'Đồng bộ tự động nhánh main & preview với repo-VelClaw',
      status: 'completed',
      tab: 'github' as ActiveTab,
      actionText: 'Quản lý Git & Docker',
      icon: <Github className="h-5 w-5 text-emerald-400" />,
      detail: 'Webhook tự động bắt sự kiện git push và đồng bộ mã nguồn an toàn.',
    },
    {
      id: 2,
      title: 'Mã Hóa Biến Môi Trường (Vault AES-256)',
      subtitle: 'Đã lưu trữ 6 biến môi trường bảo mật phân quyền 2FA',
      status: 'completed',
      tab: 'envVars' as ActiveTab,
      actionText: 'Mở Kho Bí Mật .env',
      icon: <Lock className="h-5 w-5 text-emerald-400" />,
      detail: 'Bảo vệ API keys và Database credentials khỏi rò rỉ phía máy khách.',
    },
    {
      id: 3,
      title: 'Cấu Hình Kênh Báo Động Slack Webhook',
      subtitle: 'Gửi thông báo tức thì khi build hoàn thành, lỗi hoặc rollback',
      status: 'completed',
      tab: 'api' as ActiveTab,
      actionText: 'Kiểm tra Slack Webhook',
      icon: <Bell className="h-5 w-5 text-emerald-400" />,
      detail: 'Tích hợp Incoming Webhook chuẩn format blocks kèm nút xem live logs.',
    },
    {
      id: 4,
      title: 'Tên Miền Tùy Chỉnh & SSL Let\'s Encrypt',
      subtitle: 'Đang trỏ DNS velclaw.app vào cụm máy chủ Edge CDN',
      status: 'completed',
      tab: 'domains' as ActiveTab,
      actionText: 'Quản lý Bản Ghi DNS',
      icon: <Globe className="h-5 w-5 text-emerald-400" />,
      detail: 'Tự động gia hạn chứng chỉ SSL/TLS bảo mật cao cấp.',
    },
    {
      id: 5,
      title: 'Kích Hoạt Bảo Mật 2FA & Sao Lưu Định Kỳ',
      subtitle: 'Bảo vệ tài khoản quản trị bằng Authenticator và sao lưu snapshot',
      status: 'ready',
      tab: 'security' as ActiveTab,
      actionText: 'Thiết lập Bảo mật',
      icon: <ShieldCheck className="h-5 w-5 text-cyan-400" />,
      detail: 'Đồng bộ snapshot đám mây Google Drive / Dropbox định kỳ 24h.',
    },
  ];

  const quickHubs = [
    {
      tab: 'dashboard' as ActiveTab,
      title: 'Dashboard Tập Trung',
      desc: 'Giám sát telemetry máy chủ, logs real-time và widget tùy biến',
      icon: <Activity className="h-5 w-5 text-cyan-400" />,
      badge: 'Live Hub',
      borderHover: 'hover:border-cyan-500/50',
    },
    {
      tab: 'docs' as ActiveTab,
      title: 'Tài Liệu Hướng Dẫn (Docs)',
      desc: 'Chi tiết kiến trúc CI/CD, cấu hình Dockerfile, API và FAQ',
      icon: <FileText className="h-5 w-5 text-blue-400" />,
      badge: 'Tài liệu đầy đủ',
      borderHover: 'hover:border-blue-500/50',
    },
    {
      tab: 'deployments' as ActiveTab,
      title: 'Quản Lý Triển Khai',
      desc: 'Khởi chạy bản build mới, theo dõi tiến trình và rollback 1-click',
      icon: <Rocket className="h-5 w-5 text-emerald-400" />,
      badge: 'Edge Deploys',
      borderHover: 'hover:border-emerald-500/50',
    },
    {
      tab: 'aiAgent' as ActiveTab,
      title: 'Trợ Lý AI Gemini 3.8',
      desc: 'Tự động chẩn đoán lỗi build, phân bổ sprint và dự báo deadline',
      icon: <Bot className="h-5 w-5 text-purple-400" />,
      badge: 'AI DevOps 24/7',
      borderHover: 'hover:border-purple-500/50',
    },
    {
      tab: 'api' as ActiveTab,
      title: 'Webhook & Slack Notifications',
      desc: 'Định dạng thông điệp dự án, kiểm tra test payloads thời gian thực',
      icon: <Bell className="h-5 w-5 text-amber-400" />,
      badge: 'Slack Active',
      borderHover: 'hover:border-amber-500/50',
    },
    {
      tab: 'security' as ActiveTab,
      title: 'Bảo Mật & Tuân Thủ',
      desc: 'Xác thực hai bước (TOTP), quét lỗ hổng và nhật ký kiểm toán',
      icon: <ShieldCheck className="h-5 w-5 text-rose-400" />,
      badge: '2FA Enforced',
      borderHover: 'hover:border-rose-500/50',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900/90 p-6 md:p-8 shadow-2xl backdrop-blur-md">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute right-32 -bottom-16 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-300">
                <Sparkles className="h-3.5 w-3.5" />
                Nền Tảng Điều Hành CI/CD & Deploy Thông Minh
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Edge Cluster: 6 Nodes Online
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Bảng Thiết Lập Dự Án & Điều Hành Trung Tâm
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Chào mừng bạn đến với hệ thống điều phối triển khai tự động. Nền tảng được cấu hình sẵn sàng cho repository{' '}
              <span className="font-mono text-cyan-300 font-medium">github.com/velclaw/repo-VelClaw</span>, tích hợp Docker Engine, phân tích thời gian thực và trợ lý AI 24/7.
            </p>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onTriggerDeploy}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-900/40 hover:opacity-95 transition-all"
              >
                <Rocket className="h-4 w-4" />
                <span>Kích Hoạt Deploy Tức Thì</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('docs')}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
              >
                <FileText className="h-4 w-4 text-blue-400" />
                <span>Xem Tài Liệu Hướng Dẫn (Docs)</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('dashboard')}
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-950/40 px-4 py-2.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/50 transition-all"
              >
                <Activity className="h-4 w-4" />
                <span>Mở Dashboard Thời Gian Thực</span>
              </button>
            </div>
          </div>

          {/* Quick Status Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 shrink-0 lg:w-80 space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
              <span className="text-slate-400">Trạng Thái Bản Build</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Production Live
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Domain chính:</span>
                <a 
                  href="https://velclaw.app" 
                  target="_blank" 
                  rel="noreferrer"
                  className="font-mono text-cyan-400 hover:underline flex items-center gap-1"
                >
                  velclaw.app <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Commit hash:</span>
                <span className="font-mono text-slate-200">
                  {latestDeploy ? latestDeploy.commitHash.substring(0, 7) : 'c91bf42'}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Độ trễ P95:</span>
                <span className="font-mono text-emerald-400 font-semibold">22 ms (Asia Edge)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Bộ nhớ RAM:</span>
                <span className="font-mono text-slate-200">310 MB / 2048 MB</span>
              </div>
            </div>

            <div className="pt-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>Tiến độ thiết lập dự án</span>
                <span className="font-bold text-cyan-400">100% Sẵn Sàng</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Cụm Edge Container</span>
            <Server className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white">6 Nút Hoạt Động</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            Khu vực asia-east1 (Đài Loan & VN)
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Tốc Độ Phản Hồi</span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white">22 ms</div>
          <div className="text-[11px] text-cyan-300">Được tối ưu hóa bởi Edge Cache</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Kho Biến Môi Trường</span>
            <Lock className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white">6 Biến Bí Mật</div>
          <div className="text-[11px] text-slate-400">Mã hóa chuẩn AES-256 GCM</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Kênh Cảnh Báo Slack</span>
            <Bell className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-white">100% Hoạt Động</div>
          <div className="text-[11px] text-emerald-400">Đã kiểm tra tín hiệu thành công</div>
        </div>
      </div>

      {/* Setup Steps Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 md:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-cyan-400" />
              <span>Quy Trình Thiết Lập & Chuẩn Hóa Vận Hành</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Các bước cấu hình nền tảng đã được tự động hóa và tích hợp chặt chẽ.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-400 w-fit">
            5 / 5 Hạng mục Sẵn Sàng
          </span>
        </div>

        <div className="space-y-3">
          {setupSteps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 hover:border-slate-700 transition-all"
            >
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-slate-700">
                  {step.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{step.id}. {step.title}</span>
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                      <Check className="h-3 w-3" /> Đã kết nối
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{step.subtitle}</p>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">{step.detail}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab(step.tab)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-cyan-600 hover:text-white hover:border-cyan-500 transition-all shrink-0 self-start sm:self-center"
              >
                <span>{step.actionText}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Visual Diagram */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 md:p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-400" />
            <span>Kiến Trúc Luồng Triển Khai Khép Kín (Architecture Flow)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Dữ liệu và mã nguồn luân chuyển an toàn từ kho lưu trữ qua hạ tầng container ra mạng lưới CDN toàn cầu.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-center space-y-2">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-700 text-slate-200">
              <Github className="h-5 w-5" />
            </div>
            <div className="text-xs font-bold text-white">1. Git Push</div>
            <p className="text-[11px] text-slate-400">origin/main webhook phát hiện commit mới</p>
          </div>

          <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3.5 text-center space-y-2">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-900/40 border border-cyan-500/30 text-cyan-300">
              <Cpu className="h-5 w-5" />
            </div>
            <div className="text-xs font-bold text-cyan-300">2. CI/CD Build</div>
            <p className="text-[11px] text-slate-400">Node.js + Vite/Next compile & typecheck</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-center space-y-2">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-700 text-slate-200">
              <Server className="h-5 w-5" />
            </div>
            <div className="text-xs font-bold text-white">3. Docker Container</div>
            <p className="text-[11px] text-slate-400">Đóng gói multi-stage image siêu nhẹ</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-center space-y-2">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-700 text-slate-200">
              <Globe className="h-5 w-5" />
            </div>
            <div className="text-xs font-bold text-white">4. Edge CDN Global</div>
            <p className="text-[11px] text-slate-400">Định tuyến tên miền velclaw.app SSL</p>
          </div>

          <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-3.5 text-center space-y-2">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-300">
              <Bell className="h-5 w-5" />
            </div>
            <div className="text-xs font-bold text-purple-300">5. Slack Alert</div>
            <p className="text-[11px] text-slate-400">Báo tin tức thì về kênh trao đổi nhóm</p>
          </div>
        </div>
      </div>

      {/* Quick Jump Hubs to all full-screen pages */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Truy Cập Nhanh Các Phân Hệ Quản Trị</h2>
          <span className="text-xs text-slate-400">Mỗi phân hệ là một trang độc lập</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickHubs.map((hub) => (
            <div
              key={hub.tab}
              onClick={() => onNavigateTab(hub.tab)}
              className={`group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-all hover:bg-slate-900/90 ${hub.borderHover} hover:shadow-lg`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 border border-slate-700">
                  {hub.icon}
                </div>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 transition-colors">
                  {hub.badge}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                <span>{hub.title}</span>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-cyan-400" />
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {hub.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CLI Quick Start snippet */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 md:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-bold text-white">Chạy Thử Nghiệm Qua CLI</span>
          </div>
          <button
            type="button"
            onClick={() => handleCopyCmd('curl -X POST http://localhost:3000/api/deployments/trigger -H "Content-Type: application/json" -d \'{"branch":"main"}\'')}
            className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            {copiedCmd ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span>{copiedCmd ? 'Đã sao chép' : 'Sao chép lệnh'}</span>
          </button>
        </div>
        <div className="rounded-lg bg-slate-900 p-3 font-mono text-xs text-cyan-300 border border-slate-800/80 overflow-x-auto">
          curl -X POST http://localhost:3000/api/deployments/trigger -H &quot;Content-Type: application/json&quot; -d &#39;{`{"branch":"main"}`}&#39;
        </div>
      </div>

    </div>
  );
};
