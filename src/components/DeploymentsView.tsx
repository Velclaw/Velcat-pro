import React, { useState, useEffect, useRef } from 'react';
import { 
  Rocket, 
  ExternalLink, 
  Terminal, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Zap, 
  GitBranch, 
  GitCommit, 
  AlertTriangle, 
  Sparkles, 
  Play, 
  Copy, 
  Check, 
  Box,
  Layers,
  ChevronRight,
  RefreshCw,
  Search
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Deployment, Language } from '../types';
import { translations } from '../i18n';

interface DeploymentsViewProps {
  deployments: Deployment[];
  onTriggerDeploy: (branch: string, commitMessage: string) => void;
  onRollback: (deployment: Deployment) => void;
  lang: Language;
}

export const DeploymentsView: React.FC<DeploymentsViewProps> = ({
  deployments,
  onTriggerDeploy,
  onRollback,
  lang,
}) => {
  const t = translations[lang];
  const [selectedDeploy, setSelectedDeploy] = useState<Deployment>(deployments[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'pipeline'>('overview');
  const [copied, setCopied] = useState(false);
  
  // AI Log analysis states
  const [analyzingAi, setAnalyzingAi] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{
    analysis?: string;
    rootCause?: string;
    suggestedFix?: string;
    dockerOptimization?: string;
  } | null>(null);

  // Trigger New Deploy local form
  const [showDeployForm, setShowDeployForm] = useState(false);
  const [deployBranch, setDeployBranch] = useState('main');
  const [deployCommitNote, setDeployCommitNote] = useState('fix: tối ưu hóa hiệu năng & đồng bộ repo-VelClaw');

  const logsEndRef = useRef<HTMLDivElement>(null);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAnalyzeLogs = async () => {
    setAnalyzingAi(true);
    setAiAnalysis(null);
    try {
      const res = await fetch('/api/ai/analyze-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logs: selectedDeploy.buildLogs.join('\n'),
          framework: selectedDeploy.framework,
        }),
      });
      const data = await res.json();
      setAiAnalysis(data);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzingAi(false);
    }
  };

  const handleStartDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    onTriggerDeploy(deployBranch, deployCommitNote);
    setShowDeployForm(false);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  const prodDeploy = deployments.find((d) => d.environment === 'production') || deployments[0];

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Production Deployment Headline */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-5 md:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-64 w-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Production Live
              </span>
              <span className="rounded-md bg-slate-800 px-2 py-0.5 font-mono text-[11px] text-slate-300">
                {prodDeploy.framework}
              </span>
            </div>

            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>{prodDeploy.domain}</span>
                <a
                  href={prodDeploy.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </h1>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <GitBranch className="h-3.5 w-3.5 text-slate-500" />
                <span className="font-mono text-cyan-300">{prodDeploy.branch}</span>
                <span>•</span>
                <GitCommit className="h-3.5 w-3.5 text-slate-500" />
                <span className="font-mono text-slate-400">{prodDeploy.commitHash}</span>
                <span>•</span>
                <span className="text-slate-300 truncate max-w-sm">{prodDeploy.commitMessage}</span>
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>P95 Latency:</span>
                <span className="font-bold text-emerald-400">{prodDeploy.metrics.p95LatencyMs}ms</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                <span>Build:</span>
                <span className="font-bold text-slate-200">{prodDeploy.durationSeconds}s</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Cpu className="h-3.5 w-3.5 text-violet-400" />
                <span>RAM Node:</span>
                <span className="font-bold text-slate-200">{prodDeploy.metrics.ramUsageMb}MB</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Lighthouse:</span>
                <span className="font-bold text-emerald-400">{prodDeploy.metrics.lighthouseScore}/100</span>
              </div>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex flex-wrap lg:flex-col items-stretch gap-2.5">
            <button
              id="deploy-modal-trigger-btn"
              onClick={() => setShowDeployForm(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all active:scale-95"
            >
              <Rocket className="h-4 w-4" />
              <span>Deploy commit mới</span>
            </button>

            <button
              onClick={() => handleCopyUrl(prodDeploy.url)}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
              <span>{copied ? 'Đã sao chép link' : 'Sao chép Live URL'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Trigger New Deployment Modal */}
      {showDeployForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Rocket className="h-5 w-5 text-cyan-400" />
                <span>Kích hoạt triển khai mới (Instant Deploy)</span>
              </div>
              <button 
                onClick={() => setShowDeployForm(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleStartDeploy} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Kho mã nguồn liên kết (GitHub)
                </label>
                <div className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-slate-400 font-mono">
                  https://github.com/velclaw/repo-VelClaw
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Chọn nhánh git (Branch)
                </label>
                <select
                  value={deployBranch}
                  onChange={(e) => setDeployBranch(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="main">main (Production)</option>
                  <option value="staging">staging (Preview)</option>
                  <option value="feature/ai-agent">feature/ai-agent</option>
                  <option value="release/v2.4">release/v2.4</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Ghi chú commit (Commit message)
                </label>
                <input
                  type="text"
                  value={deployCommitNote}
                  onChange={(e) => setDeployCommitNote(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  placeholder="Mô tả các thay đổi triển khai..."
                  required
                />
              </div>

              <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-[11px] text-cyan-300">
                ⚡ Quy trình CI/CD tự động: Kéo code từ GitHub ➔ Kiểm tra kiểu TypeCheck ➔ Build Docker Container ➔ Phân phối tới 320 Edge nodes.
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeployForm(false)}
                  className="rounded-lg px-4 py-2 text-slate-400 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 font-bold text-white shadow-md hover:from-cyan-400 hover:to-blue-500"
                >
                  Bắt đầu Deploy ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CI/CD Pipeline Visualizer */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Quy trình CI/CD Tự Động (Pipeline Flow)</h2>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" /> All Checks Passed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            { step: '1. Git Sync', detail: 'velclaw/repo-VelClaw', status: 'done', icon: <GitBranch className="h-4 w-4" /> },
            { step: '2. Lint & Test', detail: 'TypeScript 5.8 0 errors', status: 'done', icon: <Terminal className="h-4 w-4" /> },
            { step: '3. Docker Build', detail: 'Multi-stage Next.js 14', status: 'done', icon: <Box className="h-4 w-4" /> },
            { step: '4. Health Check', detail: 'Probed /api/health (14ms)', status: 'done', icon: <Zap className="h-4 w-4" /> },
            { step: '5. Edge Propagation', detail: '320 PoPs Active', status: 'done', icon: <Rocket className="h-4 w-4" /> },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 text-xs relative group hover:border-cyan-500/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-cyan-400">{item.icon}</div>
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              </div>
              <div className="font-semibold text-slate-200">{item.step}</div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">{item.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Recent Deployments List & Active Log Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Deployments list (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>Lịch sử Deployments</span>
            </h2>
            <span className="text-xs text-slate-400">Tổng cộng: {deployments.length}</span>
          </div>

          <div className="space-y-2.5">
            {deployments.map((dpl) => {
              const isSelected = selectedDeploy.id === dpl.id;
              return (
                <div
                  key={dpl.id}
                  onClick={() => setSelectedDeploy(dpl)}
                  className={`rounded-xl border p-4 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-cyan-500/50 bg-slate-900/90 shadow-lg shadow-cyan-500/5 ring-1 ring-cyan-500/20'
                      : 'border-slate-800/80 bg-slate-950/60 hover:bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${dpl.status === 'ready' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      <span className="font-mono text-xs font-semibold text-slate-200">
                        {dpl.id}
                      </span>
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] uppercase font-bold text-slate-300">
                        {dpl.environment}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">{dpl.createdAt}</span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-1 mb-2 font-medium">
                    {dpl.commitMessage}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={dpl.author.avatar}
                        alt={dpl.author.name}
                        className="h-4 w-4 rounded-full object-cover"
                      />
                      <span>{dpl.author.name}</span>
                      <span>•</span>
                      <span className="font-mono text-cyan-400">{dpl.branch}</span>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <span>{dpl.durationSeconds}s</span>
                      <ChevronRight className={`h-3.5 w-3.5 transition-transform ${isSelected ? 'translate-x-0.5 text-cyan-400' : 'text-slate-600'}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Build Logs & AI Diagnostics (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Terminal Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-bold text-white">
                  Logs Deployment: <code className="text-cyan-300 font-mono">{selectedDeploy.id}</code>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-analyze-logs-ai"
                  onClick={handleAnalyzeLogs}
                  disabled={analyzingAi}
                  className="flex items-center gap-1.5 rounded-lg border border-violet-500/40 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300 hover:bg-violet-500/20 transition-all disabled:opacity-50"
                >
                  <Sparkles className={`h-3.5 w-3.5 ${analyzingAi ? 'animate-spin' : 'text-violet-400'}`} />
                  <span>{analyzingAi ? 'Đang phân tích...' : 'AI Chẩn đoán Logs'}</span>
                </button>

                <button
                  onClick={() => onRollback(selectedDeploy)}
                  className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all"
                  title="Khôi phục trạng thái website về bản build này"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
                  <span>Rollback</span>
                </button>
              </div>
            </div>

            {/* AI Diagnosis Result Box (if requested) */}
            {aiAnalysis && (
              <div className="rounded-xl border border-violet-500/30 bg-violet-950/30 p-4 text-xs space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2 text-violet-300 font-bold">
                  <Sparkles className="h-4 w-4 text-violet-400" />
                  <span>Kết quả Chẩn đoán từ Gemini 3.8 Flash:</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{aiAnalysis.analysis}</p>
                {aiAnalysis.suggestedFix && (
                  <div className="rounded-lg bg-slate-900/90 p-2.5 font-mono text-[11px] text-emerald-300 border border-slate-800">
                    💡 Khuyến nghị tối ưu: {aiAnalysis.suggestedFix}
                  </div>
                )}
                {aiAnalysis.dockerOptimization && (
                  <div className="text-[11px] text-cyan-300">
                    🐳 Docker Cache Tip: {aiAnalysis.dockerOptimization}
                  </div>
                )}
              </div>
            )}

            {/* Terminal Screen */}
            <div className="rounded-xl border border-slate-800/90 bg-slate-950 p-4 font-mono text-xs text-slate-300 h-80 overflow-y-auto space-y-1.5 shadow-inner">
              <div className="text-slate-500 text-[11px] pb-1 border-b border-slate-900">
                # Live stream output from cluster node [asia-east1-worker-04]
              </div>
              {selectedDeploy.buildLogs.map((log, index) => {
                const isError = log.toLowerCase().includes('error') || log.toLowerCase().includes('fail');
                const isSuccess = log.toLowerCase().includes('ready') || log.toLowerCase().includes('success');
                const isDocker = log.includes('[Docker]');
                const isEdge = log.includes('[Edge');

                return (
                  <div key={index} className="leading-relaxed flex items-start gap-2">
                    <span className="text-slate-600 select-none text-[10px]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={
                        isError
                          ? 'text-rose-400 font-semibold'
                          : isSuccess
                          ? 'text-emerald-400 font-semibold'
                          : isDocker
                          ? 'text-cyan-300'
                          : isEdge
                          ? 'text-violet-300'
                          : 'text-slate-300'
                      }
                    >
                      {log}
                    </span>
                  </div>
                );
              })}
              <div ref={logsEndRef} />
            </div>

            {/* Quick deployment details footer */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span>Commit:</span>
                <code className="text-cyan-400 font-mono">{selectedDeploy.commitHash}</code>
              </div>
              <div className="flex items-center gap-2">
                <span>Branch:</span>
                <span className="text-slate-200 font-mono">{selectedDeploy.branch}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Endpoint:</span>
                <a
                  href={selectedDeploy.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline truncate max-w-[200px]"
                >
                  {selectedDeploy.url}
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
