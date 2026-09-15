import React, { useState } from 'react';
import { 
  Github, 
  Box, 
  GitBranch, 
  GitCommit, 
  ExternalLink, 
  CheckCircle2, 
  RefreshCw, 
  Server, 
  Terminal, 
  Copy, 
  Check,
  Play,
  Layers,
  Cpu,
  HardDrive
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n';

interface GitHubDockerViewProps {
  onTriggerDeploy: (branch: string, commitMessage: string) => void;
  lang: Language;
}

export const GitHubDockerView: React.FC<GitHubDockerViewProps> = ({
  onTriggerDeploy,
  lang,
}) => {
  const t = translations[lang];
  const [copiedDocker, setCopiedDocker] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'dockerfile' | 'compose'>('dockerfile');

  const commits = [
    {
      hash: 'a7b9c3e',
      branch: 'main',
      message: 'feat: tích hợp Gemini 3.8 Flash agent và tối ưu hóa Docker edge caching',
      author: 'Alex Tran',
      time: '10 phút trước',
      verified: true,
    },
    {
      hash: '9e41a2b',
      branch: 'staging',
      message: 'fix: sửa lỗi đồng bộ real-time webhook cho hệ thống sao lưu Google Drive & Dropbox',
      author: 'Sarah Chen',
      time: '1 giờ trước',
      verified: true,
    },
    {
      hash: 'f420c91',
      branch: 'feature/ai-agent',
      message: 'feat: thuật toán AI dự báo tiến độ và phân bổ công việc tự động',
      author: 'Minh Nguyen',
      time: '3 giờ trước',
      verified: true,
    },
    {
      hash: 'c8810b4',
      branch: 'main',
      message: 'chore: nâng cấp base image node:22-alpine và bảo mật CVE',
      author: 'Alex Tran',
      time: 'Hôm qua',
      verified: true,
    },
  ];

  const dockerfileCode = `# =============================================================================
# VelCat Pro Production Dockerfile for server: velclaw/repo-VelClaw
# Optimized for Next.js 14 / Vite & Node.js Edge Runtime
# =============================================================================

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Stage 1: Dependencies Resolution
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build

# Stage 3: High-Security Minimal Runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && \\
    adduser --system --uid 1001 velcat

COPY --from=builder /app/public ./public
COPY --from=builder --chown=velcat:nodejs /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER velcat
EXPOSE 3000

CMD ["node", "dist/server.cjs"]
`;

  const dockerComposeCode = `version: '3.8'

services:
  velcat-app:
    image: ghcr.io/velclaw/repo-velclaw:latest
    container_name: velclaw-production-node
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
      - GITHUB_REPO_URL=https://github.com/velclaw/repo-VelClaw
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 15s
      timeout: 5s
      retries: 3
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 2048M
        reservations:
          cpus: '0.5'
          memory: 512M
`;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedDocker(true);
    setTimeout(() => setCopiedDocker(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: GitHub Linkage */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 md:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 border border-slate-700 text-white shadow-md">
              <Github className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-extrabold text-white">
                  velclaw/repo-VelClaw
                </h1>
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold">
                  Đồng bộ tức thì
                </span>
              </div>
              <a
                href="https://github.com/velclaw/repo-VelClaw"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 mt-0.5"
              >
                <span>https://github.com/velclaw/repo-VelClaw</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onTriggerDeploy('main', 'Trigger manual sync from repo-VelClaw')}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:from-cyan-400 hover:to-blue-500 transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Đồng bộ & Deploy ngay</span>
            </button>
          </div>
        </div>

        {/* Server & Docker Specs summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400">Server Target:</span>
            <div className="font-semibold text-slate-200 mt-0.5">velclaw/repo-VelClaw</div>
          </div>
          <div>
            <span className="text-slate-400">Trình đóng gói:</span>
            <div className="font-semibold text-cyan-400 mt-0.5">Docker Multi-Stage</div>
          </div>
          <div>
            <span className="text-slate-400">Container Image:</span>
            <div className="font-semibold text-slate-200 font-mono text-[11px] mt-0.5">repo-velclaw:latest</div>
          </div>
          <div>
            <span className="text-slate-400">Webhook Triggers:</span>
            <div className="font-semibold text-emerald-400 mt-0.5">Push, PR, Release</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Commits stream & Dockerfile Config */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Commits Stream (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <GitCommit className="h-4 w-4 text-cyan-400" />
              <span>Nhật Ký Commits Gần Nhất</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">nhánh: main</span>
          </div>

          <div className="space-y-3">
            {commits.map((c, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-3.5 text-xs space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono text-cyan-400 font-bold">
                    <span>{c.hash}</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-slate-400">{c.branch}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">{c.time}</span>
                </div>

                <p className="text-slate-200 font-medium leading-relaxed">{c.message}</p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <span>Tác giả: <strong className="text-slate-300">{c.author}</strong></span>
                  <button
                    onClick={() => onTriggerDeploy(c.branch, c.message)}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    <Play className="h-3 w-3" />
                    <span>Deploy bản này</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dockerfile & Compose Editor (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Box className="h-4 w-4 text-cyan-400" />
              <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 p-1 text-xs">
                <button
                  onClick={() => setActiveCodeTab('dockerfile')}
                  className={`rounded-md px-3 py-1 font-mono font-medium transition-colors ${
                    activeCodeTab === 'dockerfile' ? 'bg-cyan-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Dockerfile
                </button>
                <button
                  onClick={() => setActiveCodeTab('compose')}
                  className={`rounded-md px-3 py-1 font-mono font-medium transition-colors ${
                    activeCodeTab === 'compose' ? 'bg-cyan-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  docker-compose.yml
                </button>
              </div>
            </div>

            <button
              onClick={() => handleCopyCode(activeCodeTab === 'dockerfile' ? dockerfileCode : dockerComposeCode)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300 hover:text-white"
            >
              {copiedDocker ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
              <span>{copiedDocker ? 'Đã chép' : 'Sao chép'}</span>
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto h-[440px]">
            <pre className="text-slate-300">
              {activeCodeTab === 'dockerfile' ? dockerfileCode : dockerComposeCode}
            </pre>
          </div>
        </div>

      </div>

    </div>
  );
};
