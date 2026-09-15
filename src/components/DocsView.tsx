import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Terminal, 
  Code2, 
  Lock, 
  Bell, 
  Globe, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  Layers, 
  Server, 
  Cpu, 
  HelpCircle,
  FileCode,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { Language, ActiveTab } from '../types';

interface DocsViewProps {
  onNavigateTab: (tab: ActiveTab) => void;
  lang: Language;
}

type DocSection = 
  | 'quickstart'
  | 'docker'
  | 'env-vault'
  | 'slack-webhook'
  | 'domains-ssl'
  | 'rest-api'
  | 'security-2fa'
  | 'troubleshooting';

export const DocsView: React.FC<DocsViewProps> = ({ onNavigateTab, lang }) => {
  const [activeSection, setActiveSection] = useState<DocSection>('quickstart');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const navSections = [
    {
      id: 'quickstart' as DocSection,
      title: 'Bắt Đầu Nhanh (Quickstart)',
      desc: 'Quy trình khởi tạo & luồng CI/CD',
      icon: <Sparkles className="h-4 w-4" />,
      badge: 'Khởi đầu',
    },
    {
      id: 'docker' as DocSection,
      title: 'Cấu Hình Dockerfile & Next.js',
      desc: 'Multi-stage build & tối ưu hóa RAM',
      icon: <Server className="h-4 w-4" />,
    },
    {
      id: 'env-vault' as DocSection,
      title: 'Kho Bí Mật & Biến Môi Trường',
      desc: 'Mã hóa AES-256 & phân tách môi trường',
      icon: <Lock className="h-4 w-4" />,
    },
    {
      id: 'slack-webhook' as DocSection,
      title: 'Tích Hợp Slack Webhook',
      desc: 'JSON payload, blocks & các sự kiện',
      icon: <Bell className="h-4 w-4" />,
      badge: 'Phổ biến',
    },
    {
      id: 'domains-ssl' as DocSection,
      title: 'Tên Miền Tùy Chỉnh & SSL',
      desc: 'Bản ghi DNS CNAME/A & Let\'s Encrypt',
      icon: <Globe className="h-4 w-4" />,
    },
    {
      id: 'rest-api' as DocSection,
      title: 'Hệ Thống REST API & CLI',
      desc: 'Endpoints điều khiển & mẫu curl',
      icon: <Terminal className="h-4 w-4" />,
    },
    {
      id: 'security-2fa' as DocSection,
      title: 'Bảo Mật 2FA & Sao Lưu Đám Mây',
      desc: 'Authenticator TOTP & Google Drive / S3',
      icon: <ShieldCheck className="h-4 w-4" />,
    },
    {
      id: 'troubleshooting' as DocSection,
      title: 'Khắc Phục Sự Cố (Troubleshooting)',
      desc: 'Xử lý lỗi màn hình trắng, DNS, timeout',
      icon: <HelpCircle className="h-4 w-4" />,
      badge: 'Quan trọng',
    },
  ];

  const filteredNav = navSections.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      
      {/* Docs Header */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-lg bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-xs font-semibold text-blue-400">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Trung Tâm Tài Liệu & Hướng Dẫn Kỹ Thuật (Documentation)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Hướng Dẫn Vận Hành & Kiến Trúc VelCat Pro
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
              Tài liệu tra cứu toàn diện dành cho nhà phát triển và đội ngũ DevOps: từ tích hợp Git, biên dịch Docker, cấu hình Slack webhook cho đến xử lý bảo mật hai bước.
            </p>
          </div>

          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm tài liệu..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950/90 pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Docs Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sub-Navigation */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-3 space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Chủ đề tài liệu
          </div>
          {filteredNav.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/10 border border-blue-500/40 text-blue-200 font-bold shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-blue-400' : 'text-slate-400'}>
                    {sec.icon}
                  </span>
                  <div>
                    <div>{sec.title}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{sec.desc}</div>
                  </div>
                </div>
                {sec.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    isActive ? 'bg-blue-500/30 text-blue-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {sec.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Article Body */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 space-y-6 text-slate-200 text-xs sm:text-sm leading-relaxed">
          
          {/* SECTION 1: QUICKSTART */}
          {activeSection === 'quickstart' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-[11px] font-semibold uppercase text-cyan-400">Bắt đầu</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Khởi Tạo & Triển Khai Trong 60 Giây
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Quy trình đưa mã nguồn từ GitHub lên cụm máy chủ container Docker edge tự động.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs">1</div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-sm">Đẩy commit lên nhánh main</h3>
                    <p className="text-slate-300 text-xs">
                      Khi có code mới được merge hoặc push lên kho chứa <code className="bg-slate-800 px-1 py-0.5 rounded text-cyan-300 font-mono">github.com/velclaw/repo-VelClaw</code>, hệ thống webhook sẽ tự động bắt sự kiện.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs">2</div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-sm">Biên dịch mã nguồn & giải mã Secret Vault</h3>
                    <p className="text-slate-300 text-xs">
                      Hệ thống kéo biến môi trường từ Kho Bí Mật AES-256 và khởi chạy <code className="bg-slate-800 px-1 py-0.5 rounded text-cyan-300 font-mono">npm run build</code> trong môi trường container cô lập.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs">3</div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-sm">Kích hoạt chuyển giao Zero-Downtime</h3>
                    <p className="text-slate-300 text-xs">
                      Container mới được khởi động và kiểm tra health check. Khi đạt trạng thái <span className="text-emerald-400 font-semibold">200 OK</span>, lưu lượng mạng sẽ được trỏ tức thì sang bản build mới mà không làm gián đoạn người dùng.
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Link Action */}
              <div className="flex items-center justify-between rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4">
                <div>
                  <div className="font-bold text-white text-xs">Trải nghiệm ngay bản build</div>
                  <div className="text-[11px] text-slate-400">Xem tiến trình trực tiếp và logs tại trang Deployments</div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('deployments')}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-2 text-xs font-bold text-white hover:bg-cyan-500 transition-colors"
                >
                  <span>Mở Deployments</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* SECTION 2: DOCKERFILE & NEXTJS */}
          {activeSection === 'docker' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-[11px] font-semibold uppercase text-cyan-400">Hạ tầng</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Cấu Hình Dockerfile Đa Tầng (Multi-Stage)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Mẫu cấu hình tối ưu hóa dung lượng image dưới 150MB và giảm 60% thời gian khởi động.
                </p>
              </div>

              <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] text-slate-400">
                  <span>Dockerfile</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(
`# Stage 1: Build dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV PORT=3000
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
CMD ["npm", "start"]`,
                      'dockerfile'
                    )}
                    className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
                  >
                    {copiedKey === 'dockerfile' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey === 'dockerfile' ? 'Đã sao chép' : 'Sao chép'}</span>
                  </button>
                </div>
                <pre className="pt-3 text-slate-300 overflow-x-auto">
{`# Stage 1: Dependencies Cache
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Compile & Optimize
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build

# Stage 3: Minimal Production Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["npm", "start"]`}
                </pre>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
                <h4 className="font-bold text-white text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Điểm mấu chốt khi triển khai:</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                  <li>Luôn lắng nghe cổng <code className="text-cyan-300">PORT=3000</code> và host <code className="text-cyan-300">0.0.0.0</code>.</li>
                  <li>Sử dụng <code className="text-cyan-300">node:20-alpine</code> để giảm thiểu bề mặt tấn công bảo mật.</li>
                  <li>Tách dependencies dev ra khỏi production image.</li>
                </ul>
              </div>
            </div>
          )}

          {/* SECTION 3: ENV VAULT */}
          {activeSection === 'env-vault' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-[11px] font-semibold uppercase text-cyan-400">Bảo mật</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Kho Bí Mật & Biến Môi Trường (Secret Vault)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Cơ chế mã hóa AES-256-GCM bảo vệ an toàn cho khóa API và thông tin nhạy cảm.
                </p>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="font-bold text-white text-xs mb-1">Cơ chế tiêm biến (Injection) khi Build:</div>
                  <p className="text-xs text-slate-300">
                    Các biến bí mật không bao giờ được commit vào Git repo. Khi container khởi chạy trên máy chủ, hệ thống tự động giải mã khóa và tiêm trực tiếp vào tiến trình <code className="text-cyan-300 font-mono">process.env</code> mà không ghi ra ổ đĩa máy khách.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="font-bold text-white text-xs mb-1">Quy tắc đặt tên biến khuyến nghị:</div>
                  <div className="font-mono text-xs text-slate-300 space-y-1.5 pt-1">
                    <div><span className="text-purple-400">DATABASE_URL</span>=postgresql://user:pass@host:5432/velcat</div>
                    <div><span className="text-purple-400">GEMINI_API_KEY</span>=AIzaSy... (Chỉ dùng phía server)</div>
                    <div><span className="text-purple-400">SLACK_WEBHOOK_URL</span>=https://hooks.slack.com/services/...</div>
                    <div><span className="text-cyan-400">VITE_PUBLIC_APP_NAME</span>=VelCat Pro (Công khai phía client)</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs text-slate-300">
                  Muốn cấu hình hoặc cập nhật các khóa bí mật ngay bây giờ?
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('envVars')}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-colors"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Mở Kho Biến .env</span>
                </button>
              </div>
            </div>
          )}

          {/* SECTION 4: SLACK WEBHOOK */}
          {activeSection === 'slack-webhook' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-[11px] font-semibold uppercase text-cyan-400">Thông báo</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Tích Hợp Slack Incoming Webhook
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Cấu hình cảnh báo tự động gửi về kênh Slack nhóm của bạn khi có sự kiện CI/CD.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <h4 className="font-bold text-white text-xs">Cách lấy Webhook URL từ Slack:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-slate-300">
                    <li>Truy cập <a href="https://api.slack.com/apps" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">api.slack.com/apps</a> và tạo một App mới.</li>
                    <li>Bật tính năng <strong>Incoming Webhooks</strong>.</li>
                    <li>Bấm <strong>Add New Webhook to Workspace</strong> và chọn kênh nhận thông báo (ví dụ: <code className="text-purple-300 font-mono">#deployments-velclaw</code>).</li>
                    <li>Sao chép đường dẫn Webhook URL và dán vào tab <strong>API & Webhooks</strong> của VelCat Pro.</li>
                  </ol>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                    <span>Mẫu Payload JSON gửi tới Slack</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(
`{
  "text": "🚀 Triển khai thành công trên nhánh main!",
  "blocks": [
    {
      "type": "header",
      "text": { "type": "plain_text", "text": "🚀 VelCat CI/CD: Deploy Hoàn Tất" }
    },
    {
      "type": "section",
      "fields": [
        { "type": "mrkdwn", "text": "*Dự án:* repo-VelClaw" },
        { "type": "mrkdwn", "text": "*Độ trễ P95:* 22ms" }
      ]
    }
  ]
}`,
                        'slack-json'
                      )}
                      className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
                    >
                      {copiedKey === 'slack-json' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === 'slack-json' ? 'Đã sao chép' : 'Sao chép'}</span>
                    </button>
                  </div>
                  <pre className="pt-2 text-slate-300 overflow-x-auto">
{`{
  "text": "🚀 Triển khai thành công trên nhánh main!",
  "blocks": [
    {
      "type": "header",
      "text": { "type": "plain_text", "text": "🚀 VelCat CI/CD: Deploy Hoàn Tất" }
    },
    {
      "type": "section",
      "fields": [
        { "type": "mrkdwn", "text": "*Dự án:* repo-VelClaw" },
        { "type": "mrkdwn", "text": "*Môi trường:* Production" }
      ]
    }
  ]
}`}
                  </pre>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-purple-500/30 bg-purple-950/20 p-4">
                  <div className="text-xs text-slate-300">
                    Bạn muốn gửi thử tin nhắn test ngay lập tức tới Slack?
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('api')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-2 text-xs font-bold text-white hover:bg-purple-500 transition-colors"
                  >
                    <Bell className="h-3.5 w-3.5" />
                    <span>Quản lý Webhooks</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: DOMAINS & SSL */}
          {activeSection === 'domains-ssl' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-[11px] font-semibold uppercase text-cyan-400">Mạng lưới</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Cấu Hình Tên Miền Riêng & Chứng Chỉ SSL
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Cách trỏ tên miền chính và tên miền phụ về cụm máy chủ Edge CDN.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <div className="font-bold text-white text-xs">Các bản ghi DNS cần thiết:</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-2">Loại bản ghi</th>
                        <th className="pb-2">Tên (Host)</th>
                        <th className="pb-2">Giá trị đích (Value)</th>
                        <th className="pb-2">TTL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                      <tr>
                        <td className="py-2 text-cyan-400 font-bold">CNAME</td>
                        <td className="py-2">@ / www</td>
                        <td className="py-2 text-slate-100">cname.velcat-edge.net</td>
                        <td className="py-2">Auto (300)</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-emerald-400 font-bold">A</td>
                        <td className="py-2">@</td>
                        <td className="py-2 text-slate-100">35.220.142.88</td>
                        <td className="py-2">Auto (300)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                <h4 className="font-bold text-white text-xs">Tự động hóa SSL/TLS:</h4>
                <p className="text-xs text-slate-300">
                  Sau khi bản ghi DNS lan truyền thành công (thường mất 5-10 phút), hệ thống sẽ tự động cấp phát chứng chỉ SSL 2048-bit từ Let&apos;s Encrypt và gia hạn tự động mỗi 60 ngày.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 6: REST API */}
          {activeSection === 'rest-api' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-[11px] font-semibold uppercase text-cyan-400">Tích hợp</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Danh Sách REST API & CLI Endpoints
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Điều khiển hệ thống từ dòng lệnh (CLI), GitHub Actions hoặc script nội bộ.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-400">POST</span>
                    <span className="font-mono text-xs text-white">/api/deployments/trigger</span>
                  </div>
                  <p className="text-xs text-slate-300">Kích hoạt tiến trình build mới cho nhánh chỉ định.</p>
                  <pre className="bg-slate-900 p-2.5 rounded text-[11px] text-slate-300 font-mono overflow-x-auto">
curl -X POST http://localhost:3000/api/deployments/trigger \
  -H &quot;Content-Type: application/json&quot; \
  -d &apos;{`{"branch": "main", "commitMessage": "feat: release v2.4"}`}&apos;
                  </pre>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-blue-500/20 px-2 py-0.5 font-mono text-[11px] font-bold text-blue-400">GET</span>
                    <span className="font-mono text-xs text-white">/api/system/status</span>
                  </div>
                  <p className="text-xs text-slate-300">Lấy dữ liệu telemetry máy chủ, RAM heap, uptime và cụm Edge.</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-purple-500/20 px-2 py-0.5 font-mono text-[11px] font-bold text-purple-400">POST</span>
                    <span className="font-mono text-xs text-white">/api/notifications/slack/test</span>
                  </div>
                  <p className="text-xs text-slate-300">Kiểm tra kết nối và gửi tin nhắn mẫu đến webhook Slack.</p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: SECURITY & 2FA */}
          {activeSection === 'security-2fa' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-[11px] font-semibold uppercase text-cyan-400">Bảo mật</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Bảo Mật 2FA & Sao Lưu Snapshot Đám Mây
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Chính sách bảo vệ tài khoản quản trị và tự động sao lưu snapshot dự phòng.
                </p>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <h4 className="font-bold text-white text-xs mb-1">Xác thực hai bước (2FA):</h4>
                  <p className="text-xs text-slate-300">
                    Bảo vệ các thao tác nhạy cảm (như xem khóa bí mật .env, kích hoạt Rollback, xóa database) bằng mã số 6 chữ số qua Google Authenticator hoặc Authy.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <h4 className="font-bold text-white text-xs mb-1">Sao lưu đám mây đa vùng:</h4>
                  <p className="text-xs text-slate-300">
                    Mỗi lần triển khai thành công, hệ thống tự động chụp bản snapshot cơ sở dữ liệu và mã nguồn, đồng bộ hóa an toàn lên Google Drive và AWS S3 Snapshot với chuẩn lưu trữ lạnh.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 8: TROUBLESHOOTING */}
          {activeSection === 'troubleshooting' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-[11px] font-semibold uppercase text-rose-400">Khắc phục sự cố</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Hướng Dẫn Xử Lý Các Sự Cố Thường Gặp
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Giải pháp khắc phục lỗi màn trắng, chặn cookie iframe, timeout và phân giải DNS.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-rose-500/30 bg-slate-950 p-4 space-y-2">
                  <div className="font-bold text-rose-300 text-xs flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                    <span>1. Màn hình đen hoặc trắng khi xem trên điện thoại / Chrome mobile</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>Nguyên nhân:</strong> Tính năng chặn Third-party cookie của trình duyệt di động chặn cookie bảo mật trong iframe của AI Studio Preview.<br />
                    <strong>Giải pháp:</strong> Bấm vào nút <strong>&quot;Mở trong Tab Mới (Open in new tab)&quot;</strong> ở góc trên bên phải hoặc thanh điều hướng để mở trực tiếp ứng dụng với quyền First-party cookie.
                  </p>
                </div>

                <div className="rounded-xl border border-amber-500/30 bg-slate-950 p-4 space-y-2">
                  <div className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    <span>2. Lỗi Rollback không thành công</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>Giải pháp:</strong> Kiểm tra xem bản build đích có tương thích với phiên bản biến môi trường hiện tại hay không. Sử dụng tab <strong>Triển khai (Deployments)</strong> để xem chi tiết log build trước khi khôi phục.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <div className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                    <span>3. Webhook Slack không nhận được tin nhắn test</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>Giải pháp:</strong> Đảm bảo Webhook URL bắt đầu bằng <code className="text-cyan-300">https://hooks.slack.com/services/...</code> và bot có quyền gửi tin vào kênh chỉ định trong Slack Workspace.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="text-xs text-slate-300">
                  Cần trợ giúp trực tiếp từ AI DevOps 24/7?
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('aiAgent')}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-2 text-xs font-bold text-white hover:bg-cyan-500 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Hỏi AI DevOps Assistant</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
