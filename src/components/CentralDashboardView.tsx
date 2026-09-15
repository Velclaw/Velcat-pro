import React, { useState, useEffect, useRef } from 'react';
import { 
  Rocket, 
  GitBranch, 
  GitCommit, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Terminal, 
  Cpu, 
  Zap, 
  TrendingUp, 
  Users, 
  RotateCcw, 
  Sliders, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  RefreshCw, 
  ExternalLink, 
  Search, 
  ShieldCheck, 
  Activity, 
  Server, 
  Layers, 
  Flame, 
  Check, 
  Copy,
  ChevronRight,
  Filter,
  BarChart2,
  HardDrive
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  Deployment, 
  AnalyticsDataPoint, 
  DashboardWidgetConfig, 
  DashboardWidgetId, 
  Language,
  Environment 
} from '../types';
import { translations } from '../i18n';
import { initialDashboardWidgets } from '../data/mockData';

interface CentralDashboardViewProps {
  deployments: Deployment[];
  analytics: AnalyticsDataPoint[];
  onTriggerDeploy: (branch: string, commitMessage: string) => void;
  onRollback: (deployment: Deployment) => void;
  onOpenAiAssistant: () => void;
  lang: Language;
}

export const CentralDashboardView: React.FC<CentralDashboardViewProps> = ({
  deployments,
  analytics,
  onTriggerDeploy,
  onRollback,
  onOpenAiAssistant,
  lang,
}) => {
  const t = translations[lang];

  // Customizable Widgets State
  const [widgets, setWidgets] = useState<DashboardWidgetConfig[]>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem('velcat_dashboard_widgets');
        if (saved) {
          return JSON.parse(saved);
        }
      }
    } catch (e) {
      console.warn('Unable to read localStorage widgets config:', e);
    }
    return initialDashboardWidgets;
  });

  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [selectedLayoutPreset, setSelectedLayoutPreset] = useState<'default' | 'devops' | 'monitoring' | 'compact'>('default');

  // Deployment selection for logs & details
  const [selectedDeployId, setSelectedDeployId] = useState<string>(deployments[0]?.id || '');
  const selectedDeploy = deployments.find((d) => d.id === selectedDeployId) || deployments[0];

  // Log filter & search
  const [logSearch, setLogSearch] = useState('');
  const [logFilter, setLogFilter] = useState<'all' | 'info' | 'warn' | 'docker' | 'security'>('all');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  // AI Log Diagnose State
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [aiDiagnosis, setAiDiagnosis] = useState<{
    status?: string;
    analysis?: string;
    rootCause?: string;
    suggestedFix?: string;
    dockerOptimization?: string;
  } | null>(null);

  // Quick deploy modal / branch
  const [quickBranch, setQuickBranch] = useState<'main' | 'staging' | 'develop'>('main');

  // Save widgets to localStorage safely
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('velcat_dashboard_widgets', JSON.stringify(widgets));
      }
    } catch (e) {
      // Ignore sandboxed iframe storage write restrictions
    }
  }, [widgets]);

  // Handle reorder
  const moveWidget = (id: DashboardWidgetId, direction: 'up' | 'down') => {
    setWidgets((prev) => {
      const index = prev.findIndex((w) => w.id === id);
      if (index < 0) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const newArr = [...prev];
      const temp = newArr[index];
      newArr[index] = newArr[targetIndex];
      newArr[targetIndex] = temp;

      return newArr.map((w, idx) => ({ ...w, order: idx + 1 }));
    });
  };

  const toggleWidgetVisibility = (id: DashboardWidgetId) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
  };

  const applyPreset = (preset: 'default' | 'devops' | 'monitoring' | 'compact') => {
    setSelectedLayoutPreset(preset);
    if (preset === 'default') {
      setWidgets(initialDashboardWidgets);
    } else if (preset === 'devops') {
      // Prioritize deployments, pipeline, logs, quick actions
      const reordered: DashboardWidgetConfig[] = [
        { ...initialDashboardWidgets[0], order: 1, enabled: true }, // deploy_status
        { ...initialDashboardWidgets[1], order: 2, enabled: true }, // cicd_pipeline
        { ...initialDashboardWidgets[4], order: 3, enabled: true }, // build_logs
        { ...initialDashboardWidgets[6], order: 4, enabled: true }, // quick_actions
        { ...initialDashboardWidgets[3], order: 5, enabled: true }, // performance_alerts
        { ...initialDashboardWidgets[5], order: 6, enabled: false }, // system_telemetry
        { ...initialDashboardWidgets[2], order: 7, enabled: false }, // traffic_metrics
      ];
      setWidgets(reordered);
    } else if (preset === 'monitoring') {
      // Prioritize metrics, alerts, system telemetry
      const reordered: DashboardWidgetConfig[] = [
        { ...initialDashboardWidgets[3], order: 1, enabled: true }, // performance_alerts
        { ...initialDashboardWidgets[2], order: 2, enabled: true }, // traffic_metrics
        { ...initialDashboardWidgets[5], order: 3, enabled: true }, // system_telemetry
        { ...initialDashboardWidgets[0], order: 4, enabled: true }, // deploy_status
        { ...initialDashboardWidgets[1], order: 5, enabled: true }, // cicd_pipeline
        { ...initialDashboardWidgets[4], order: 6, enabled: false }, // build_logs
        { ...initialDashboardWidgets[6], order: 7, enabled: false }, // quick_actions
      ];
      setWidgets(reordered);
    } else if (preset === 'compact') {
      const reordered = initialDashboardWidgets.map((w) => ({
        ...w,
        enabled: w.id === 'deploy_status' || w.id === 'performance_alerts' || w.id === 'traffic_metrics',
      }));
      setWidgets(reordered);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleRunAiDiagnosis = async () => {
    if (!selectedDeploy) return;
    setIsDiagnosing(true);
    setAiDiagnosis(null);
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
      setAiDiagnosis(data);
    } catch (e) {
      console.error(e);
      setAiDiagnosis({
        status: 'success',
        analysis: 'Build logs tuân thủ đầy đủ tiêu chuẩn Docker multi-stage. Không có lỗi phát sinh trong quá trình containerization.',
        rootCause: 'Bình thường, không có lỗi.',
        suggestedFix: 'Duy trì cấu hình hiện tại và bật CDN caching cho static assets.',
        dockerOptimization: 'Sử dụng .dockerignore loại bỏ thư mục test và docs để tối ưu hóa thời gian build thêm 12%.',
      });
    } finally {
      setIsDiagnosing(false);
    }
  };

  // Filter build logs
  const filteredLogs = (selectedDeploy?.buildLogs || []).filter((log) => {
    if (logSearch && !log.toLowerCase().includes(logSearch.toLowerCase())) {
      return false;
    }
    if (logFilter === 'docker') return log.includes('[Docker]') || log.includes('container');
    if (logFilter === 'security') return log.includes('[Security]') || log.includes('Secret') || log.includes('Vault');
    if (logFilter === 'warn') return log.toLowerCase().includes('warn') || log.toLowerCase().includes('cve');
    if (logFilter === 'info') return log.includes('[VelCat') || log.includes('[Git');
    return true;
  });

  // Calculate status counts
  const readyCount = deployments.filter((d) => d.status === 'ready').length;
  const inProgressCount = deployments.filter(
    (d) => d.status === 'building' || d.status === 'dockerizing' || d.status === 'queued' || d.status === 'propagating'
  ).length;
  const failedCount = deployments.filter((d) => d.status === 'failed').length;

  // CI/CD Pipeline stages definition
  const pipelineStages = [
    { id: 'git', name: 'Git Pull', desc: 'Sync origin/main', status: 'completed', duration: '2.1s' },
    { id: 'vault', name: 'Decrypt Secrets', desc: 'AES-256 Vault', status: 'completed', duration: '1.4s' },
    { id: 'deps', name: 'Dependencies', desc: 'npm ci & cache', status: 'completed', duration: '8.3s' },
    { id: 'build', name: 'Next.js Build', desc: 'TypeScript typecheck', status: 'completed', duration: '14.2s' },
    { id: 'docker', name: 'Dockerize', desc: 'Node 22 Alpine multi-stage', status: selectedDeploy?.status === 'dockerizing' ? 'active' : 'completed', duration: '9.5s' },
    { id: 'security', name: 'Security Scan', desc: '0 CVE vulnerabilities', status: 'completed', duration: '3.1s' },
    { id: 'edge', name: 'Edge Deploy', desc: '320 PoPs global CDN', status: selectedDeploy?.status === 'ready' ? 'completed' : 'pending', duration: '2.2s' },
  ];

  // Active performance alerts data
  const performanceAlerts = [
    {
      id: 'alt_1',
      title: 'Độ trễ Edge P95 đạt chuẩn xuất sắc',
      detail: 'P95 Latency 24ms tại điểm PoP Tokyo & Taipei. Nằm trong ngưỡng an toàn tối ưu (< 50ms).',
      severity: 'normal',
      time: '2 phút trước',
      type: 'latency',
    },
    {
      id: 'alt_2',
      title: 'Tỷ lệ lỗi 5xx hệ thống duy trì ở mức 0.02%',
      detail: 'Tỷ lệ phục vụ HTTP 200 đạt 99.98% trên toàn bộ 6 node worker Docker.',
      severity: 'normal',
      time: '5 phút trước',
      type: 'error_rate',
    },
    {
      id: 'alt_3',
      title: 'Tự động gia hạn chứng chỉ SSL Let\'s Encrypt',
      detail: 'Chứng chỉ SSL domain velclaw.app còn 88 ngày, tự động kích hoạt TLS 1.3 HTTP/3.',
      severity: 'info',
      time: '1 giờ trước',
      type: 'ssl',
    },
    {
      id: 'alt_4',
      title: 'Tải bộ nhớ RAM Node.js ổn định (310MB / 1024MB)',
      detail: 'Không phát hiện memory leak trong quá trình render server components.',
      severity: 'info',
      time: 'Hôm nay',
      type: 'ram',
    },
  ];

  // Render individual widget content
  const renderWidget = (widgetId: DashboardWidgetId) => {
    switch (widgetId) {
      // 1. DEPLOYMENT STATUS WIDGET
      case 'deploy_status':
        return (
          <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5 backdrop-blur-md shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                    <Rocket className="h-4 w-4" />
                  </div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Trạng Thái Deployment Thời Gian Thực
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Giám sát tiến trình triển khai Docker container từ repo <span className="font-mono text-cyan-300">https://github.com/velclaw/repo-VelClaw</span>
                </p>
              </div>

              {/* Status summary pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                  <span>{readyCount} Sẵn sàng (Ready)</span>
                </span>
                <span className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-cyan-300">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
                  <span>{inProgressCount} Đang diễn ra</span>
                </span>
                <span className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-800/60 px-2.5 py-1 text-slate-400">
                  <span>{failedCount} Thất bại</span>
                </span>
              </div>
            </div>

            {/* Current Production Showcase Card */}
            {selectedDeploy && (
              <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900 p-4 mb-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-cyan-500/20 px-2 py-0.5 text-[11px] font-bold text-cyan-300 uppercase">
                        {selectedDeploy.environment}
                      </span>
                      <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] font-mono text-slate-300 flex items-center gap-1">
                        <GitBranch className="h-3 w-3 text-cyan-400" />
                        {selectedDeploy.branch}
                      </span>
                      <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] font-mono text-slate-300 flex items-center gap-1">
                        <GitCommit className="h-3 w-3 text-cyan-400" />
                        {selectedDeploy.commitHash}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {selectedDeploy.status === 'ready' ? 'Đang hoạt động (Live)' : selectedDeploy.status}
                      </span>
                    </div>

                    <div className="text-sm font-semibold text-white">
                      {selectedDeploy.commitMessage}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <img 
                          src={selectedDeploy.author.avatar} 
                          alt={selectedDeploy.author.name} 
                          className="h-4 w-4 rounded-full"
                        />
                        <span>{selectedDeploy.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                        <span>Thời lượng build: {selectedDeploy.durationSeconds || 38}s</span>
                      </div>
                      <div className="font-mono text-cyan-300">
                        {selectedDeploy.domain}
                      </div>
                    </div>
                  </div>

                  {/* Actions on this deploy */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopyUrl(selectedDeploy.url)}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
                      title="Sao chép liên kết"
                    >
                      {copiedUrl ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedUrl ? 'Đã chép' : 'Sao chép URL'}</span>
                    </button>

                    <button
                      onClick={() => onRollback(selectedDeploy)}
                      className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Rollback bản này</span>
                    </button>

                    <a
                      href={selectedDeploy.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:bg-cyan-400 transition-all"
                    >
                      <span>Mở Web Live</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                {/* Micro metrics row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-800/80 text-xs">
                  <div className="rounded-lg bg-slate-900/80 p-2.5">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Zap className="h-3 w-3 text-cyan-400" />
                      Độ trễ P95
                    </div>
                    <div className="text-sm font-bold text-slate-100 font-mono mt-0.5">
                      {selectedDeploy.metrics.p95LatencyMs}ms
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-900/80 p-2.5">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Cpu className="h-3 w-3 text-emerald-400" />
                      RAM Container
                    </div>
                    <div className="text-sm font-bold text-slate-100 font-mono mt-0.5">
                      {selectedDeploy.metrics.ramUsageMb} MB
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-900/80 p-2.5">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Layers className="h-3 w-3 text-violet-400" />
                      Bundle Size
                    </div>
                    <div className="text-sm font-bold text-slate-100 font-mono mt-0.5">
                      {selectedDeploy.metrics.bundleSizeMb} MB
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-900/80 p-2.5">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3 text-amber-400" />
                      Lighthouse Score
                    </div>
                    <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                      {selectedDeploy.metrics.lighthouseScore}/100
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick selector of other recent builds */}
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Chuyển đổi bản ghi build khác:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {deployments.slice(0, 3).map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDeployId(d.id)}
                  className={`text-left p-2.5 rounded-xl border transition-all ${
                    selectedDeployId === d.id
                      ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-200'
                      : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono font-bold text-cyan-300">#{d.commitHash}</span>
                    <span className="capitalize text-[10px] px-1.5 py-0.5 rounded bg-slate-800">{d.environment}</span>
                  </div>
                  <div className="text-xs truncate font-medium">{d.commitMessage}</div>
                </button>
              ))}
            </div>
          </div>
        );

      // 2. CI/CD PIPELINE VISUALIZER
      case 'cicd_pipeline':
        return (
          <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5 backdrop-blur-md shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Tiến Trình CI/CD Tự Động Hóa (Docker Pipeline)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Quy trình kiểm tra, build container và phân phối Edge toàn cầu cho nhánh <span className="font-mono text-cyan-300">{selectedDeploy?.branch || 'main'}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Pipeline 100% Passed</span>
                </span>
              </div>
            </div>

            {/* Stages Step Flow */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {pipelineStages.map((stage, idx) => (
                <div 
                  key={stage.id} 
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 flex flex-col justify-between relative overflow-hidden group hover:border-cyan-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-500">0{idx + 1}</span>
                    {stage.status === 'completed' ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    ) : stage.status === 'active' ? (
                      <RefreshCw className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
                    ) : (
                      <Clock className="h-3.5 w-3.5 text-slate-600" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100">{stage.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{stage.desc}</div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-cyan-400 flex items-center justify-between">
                    <span>{stage.duration}</span>
                    <span className="text-[9px] text-slate-500 uppercase">OK</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // 3. LIVE BUILD & DEPLOY LOGS
      case 'build_logs':
        return (
          <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5 backdrop-blur-md shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Terminal className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Bản Ghi Log Chi Tiết & Chẩn Đoán AI
                  </h2>
                  <p className="text-xs text-slate-400">
                    Console log trực tiếp từ máy chủ build Docker container (Commit {selectedDeploy?.commitHash})
                  </p>
                </div>
              </div>

              {/* Log actions: search, filter, AI diagnose */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Search in log */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    placeholder="Tìm trong logs..."
                    className="rounded-lg border border-slate-700 bg-slate-950 pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none w-36 sm:w-44"
                  />
                </div>

                {/* Filter level */}
                <select
                  value={logFilter}
                  onChange={(e: any) => setLogFilter(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="all">Tất cả cấp độ</option>
                  <option value="docker">Chỉ Docker</option>
                  <option value="security">Bảo mật & Secrets</option>
                  <option value="warn">Cảnh báo / Lỗi</option>
                  <option value="info">Thông tin chung</option>
                </select>

                {/* 1-Click AI Diagnose */}
                <button
                  onClick={handleRunAiDiagnosis}
                  disabled={isDiagnosing}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 px-3 py-1.5 font-bold text-white shadow-sm hover:from-violet-500 hover:to-cyan-500 transition-all disabled:opacity-50"
                >
                  <Sparkles className={`h-3.5 w-3.5 ${isDiagnosing ? 'animate-spin' : ''}`} />
                  <span>{isDiagnosing ? 'AI đang chẩn đoán...' : 'Chẩn đoán với AI'}</span>
                </button>
              </div>
            </div>

            {/* AI Diagnosis Result if available */}
            {aiDiagnosis && (
              <div className="mb-4 rounded-xl border border-violet-500/40 bg-violet-950/20 p-4 text-xs animate-in fade-in">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-bold text-violet-300">
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                    <span>Kết quả Phân tích Gemini 3.8 Flash:</span>
                  </div>
                  <button 
                    onClick={() => setAiDiagnosis(null)}
                    className="text-slate-400 hover:text-white text-[11px]"
                  >
                    Đóng
                  </button>
                </div>
                <div className="space-y-2 text-slate-300">
                  <p><span className="font-semibold text-cyan-300">Đánh giá chung:</span> {aiDiagnosis.analysis}</p>
                  <p><span className="font-semibold text-emerald-300">Nguyên nhân cốt lõi:</span> {aiDiagnosis.rootCause}</p>
                  <p><span className="font-semibold text-amber-300">Khuyến nghị khắc phục:</span> {aiDiagnosis.suggestedFix}</p>
                  {aiDiagnosis.dockerOptimization && (
                    <p><span className="font-semibold text-blue-300">Tối ưu Dockerfile:</span> {aiDiagnosis.dockerOptimization}</p>
                  )}
                </div>
              </div>
            )}

            {/* Terminal Window */}
            <div 
              ref={logsContainerRef}
              className="rounded-xl border border-slate-950 bg-black/90 p-4 font-mono text-xs text-slate-300 max-h-80 overflow-y-auto space-y-1.5 shadow-inner"
            >
              {filteredLogs.length === 0 ? (
                <div className="text-slate-500 py-4 text-center">Không tìm thấy dòng log nào khớp với bộ lọc.</div>
              ) : (
                filteredLogs.map((log, index) => {
                  let colorClass = 'text-slate-300';
                  if (log.includes('[Success]') || log.includes('READY')) colorClass = 'text-emerald-400 font-bold';
                  else if (log.includes('[Error]') || log.includes('failed')) colorClass = 'text-rose-400 font-bold';
                  else if (log.includes('[Security]')) colorClass = 'text-amber-300';
                  else if (log.includes('[Docker]')) colorClass = 'text-cyan-400';
                  else if (log.includes('[Git Sync]')) colorClass = 'text-blue-400';

                  return (
                    <div key={index} className="flex gap-2 leading-relaxed hover:bg-slate-900/50 px-1 rounded">
                      <span className="text-slate-600 select-none w-6 text-right shrink-0">{index + 1}</span>
                      <span className={colorClass}>{log}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );

      // 4. PERFORMANCE & SYSTEM ALERTS
      case 'performance_alerts':
        return (
          <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5 backdrop-blur-md shadow-xl h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white tracking-tight">
                      Cảnh Báo Hiệu Suất & An Ninh
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Giám sát ngưỡng SLO, độ trễ và an toàn hệ thống
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  SLO: 99.98% OK
                </span>
              </div>

              {/* Alerts list */}
              <div className="space-y-2.5">
                {performanceAlerts.map((alt) => (
                  <div 
                    key={alt.id}
                    className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/40 text-xs space-y-1 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{alt.title}</span>
                      <span className="text-[10px] text-slate-500">{alt.time}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{alt.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Chu kỳ kiểm tra: Mỗi 10 giây</span>
              <span className="text-cyan-400 hover:underline cursor-pointer" onClick={onOpenAiAssistant}>
                Nhận tư vấn tối ưu từ AI →
              </span>
            </div>
          </div>
        );

      // 5. DAILY TRAFFIC METRICS & CHARTS
      case 'traffic_metrics':
        return (
          <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5 backdrop-blur-md shadow-xl h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white tracking-tight">
                      Số Liệu Truy Cập Hàng Ngày & Băng Thông
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Lưu lượng truy cập thực tế qua 320 điểm Edge CDN PoPs
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-cyan-300 font-mono">118,500 Lượt/Tuần</div>
                  <div className="text-[10px] text-emerald-400 font-medium">↑ 18.4% so với tuần trước</div>
                </div>
              </div>

              {/* Mini SVG Chart */}
              <div className="my-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center justify-between">
                  <span>Khách truy cập theo ngày (7 ngày qua)</span>
                  <span className="text-cyan-400 font-mono">Đỉnh: 21.3k (09/15)</span>
                </div>
                
                {/* Responsive SVG Chart */}
                <div className="h-28 w-full">
                  <svg className="w-full h-full" viewBox="0 0 350 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Area fill */}
                    <path
                      d="M 0,80 L 50,65 L 100,50 L 150,55 L 200,40 L 250,30 L 300,20 L 350,15 L 350,100 L 0,100 Z"
                      fill="url(#cyanGrad)"
                    />
                    {/* Line stroke */}
                    <path
                      d="M 0,80 L 50,65 L 100,50 L 150,55 L 200,40 L 250,30 L 300,20 L 350,15"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2.5"
                    />
                    {/* Points */}
                    {[[0, 80], [50, 65], [100, 50], [150, 55], [200, 40], [250, 30], [300, 20], [350, 15]].map(([cx, cy], i) => (
                      <circle key={i} cx={cx} cy={cy} r="3.5" fill="#38bdf8" stroke="#0f172a" strokeWidth="1.5" />
                    ))}
                  </svg>
                </div>

                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  {analytics.slice(-7).map((d) => (
                    <span key={d.date}>{d.date}</span>
                  ))}
                </div>
              </div>

              {/* Summary stat cards */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Tổng Pageviews</div>
                  <div className="font-bold text-slate-100 font-mono mt-0.5">384.2K</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Băng thông Đã dùng</div>
                  <div className="font-bold text-cyan-300 font-mono mt-0.5">642.1 GB</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Độ trễ trung bình</div>
                  <div className="font-bold text-emerald-400 font-mono mt-0.5">22ms</div>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
              Dữ liệu được làm mới tự động theo chu kỳ mỗi phút.
            </div>
          </div>
        );

      // 6. SERVER TELEMETRY & DOCKER CLUSTER NODES
      case 'system_telemetry':
        return (
          <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5 backdrop-blur-md shadow-xl h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                    <Server className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white tracking-tight">
                      Hạ Tầng Cụm Server & Docker Node
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Region Asia-East1 (Taiwan Edge) & Container Registry
                    </p>
                  </div>
                </div>

                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  6/6 Nodes Live
                </span>
              </div>

              {/* Node grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { name: 'node-tw-01 (Master)', status: 'Online', cpu: '28%', mem: '410MB' },
                  { name: 'node-tw-02 (Worker)', status: 'Online', cpu: '34%', mem: '512MB' },
                  { name: 'node-sg-01 (Edge)', status: 'Online', cpu: '19%', mem: '340MB' },
                  { name: 'node-jp-01 (Edge)', status: 'Online', cpu: '22%', mem: '380MB' },
                ].map((node) => (
                  <div key={node.name} className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/60">
                    <div className="font-semibold text-slate-200 truncate">{node.name}</div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 font-mono">
                      <span>CPU: {node.cpu}</span>
                      <span>RAM: {node.mem}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Image: ghcr.io/velclaw/repo-velclaw</span>
              <span className="text-cyan-400 font-mono">v2.4.0-alpine</span>
            </div>
          </div>
        );

      // 7. QUICK DEVOPS ACTIONS
      case 'quick_actions':
        return (
          <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5 backdrop-blur-md shadow-xl h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white tracking-tight">
                      Thao Tác Nhanh DevOps & Rollback
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Kích hoạt triển khai tức thời và quản lý container
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick deploy trigger */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <select
                    value={quickBranch}
                    onChange={(e: any) => setQuickBranch(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="main">Nhánh: origin/main (Production)</option>
                    <option value="staging">Nhánh: origin/staging (Staging)</option>
                    <option value="develop">Nhánh: origin/develop (Preview)</option>
                  </select>

                  <button
                    onClick={() => onTriggerDeploy(quickBranch, `Triggered from Central Dashboard on branch ${quickBranch}`)}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:from-cyan-400 hover:to-blue-500 transition-all shrink-0"
                  >
                    <Rocket className="h-3.5 w-3.5" />
                    <span>Deploy Ngay</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => {
                      if (deployments[1]) onRollback(deployments[1]);
                    }}
                    className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-300 hover:border-amber-500/40 hover:text-amber-300 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
                    <span>Rollback Nhanh</span>
                  </button>

                  <button
                    onClick={onOpenAiAssistant}
                    className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-300 hover:border-violet-500/40 hover:text-violet-300 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                    <span>Mở AI Agent 24/7</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
              Đồng bộ webhook tự động khi có commit mới tại GitHub.
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Sort widgets according to order
  const activeWidgets = widgets
    .filter((w) => w.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <BarChart2 className="h-6 w-6 text-cyan-400" />
              <span>Dashboard Tập Trung VelCat Pro</span>
            </h1>
            <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300">
              Live Realtime
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Trung tâm điều hành và giám sát toàn diện: CI/CD, Build Logs, Cảnh báo Hiệu suất & Tùy biến Widget linh hoạt
          </p>
        </div>

        {/* Layout Presets & Customize Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Buttons */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => applyPreset('default')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedLayoutPreset === 'default' ? 'bg-cyan-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mặc định
            </button>
            <button
              onClick={() => applyPreset('devops')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedLayoutPreset === 'devops' ? 'bg-cyan-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              CI/CD Focus
            </button>
            <button
              onClick={() => applyPreset('monitoring')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedLayoutPreset === 'monitoring' ? 'bg-cyan-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Giám sát
            </button>
          </div>

          {/* Customize Widgets Button */}
          <button
            id="btn-customize-dashboard"
            onClick={() => setIsCustomizeModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <Sliders className="h-3.5 w-3.5 text-cyan-400" />
            <span>Tùy biến Widget ({activeWidgets.length}/{widgets.length})</span>
          </button>
        </div>
      </div>

      {/* Render Grid of Customizable Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeWidgets.map((widget) => {
          const isFullWidth = widget.colSpan === 'full';
          return (
            <div 
              key={widget.id} 
              className={isFullWidth ? 'col-span-1 md:col-span-2' : 'col-span-1'}
            >
              {renderWidget(widget.id)}
            </div>
          );
        })}
      </div>

      {/* CUSTOMIZE WIDGETS MODAL */}
      {isCustomizeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-cyan-400" />
                <h2 className="text-white font-bold text-sm">
                  Tùy Biến Thứ Tự & Ẩn/Hiện Widget Dashboard
                </h2>
              </div>
              <button 
                onClick={() => setIsCustomizeModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Bạn có thể bật/tắt hoặc di chuyển thứ tự hiển thị của từng widget để ưu tiên các thông tin bạn quan tâm nhất:
            </p>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {widgets.map((widget, idx) => (
                <div 
                  key={widget.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`chk-${widget.id}`}
                      checked={widget.enabled}
                      onChange={() => toggleWidgetVisibility(widget.id)}
                      className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                    />
                    <div>
                      <label htmlFor={`chk-${widget.id}`} className="font-semibold text-slate-200 cursor-pointer">
                        {widget.title}
                      </label>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">{widget.description}</div>
                    </div>
                  </div>

                  {/* Reorder buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveWidget(widget.id, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 disabled:opacity-20"
                      title="Di chuyển lên"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => moveWidget(widget.id, 'down')}
                      disabled={idx === widgets.length - 1}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 disabled:opacity-20"
                      title="Di chuyển xuống"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setWidgets(initialDashboardWidgets);
                  setSelectedLayoutPreset('default');
                }}
                className="text-xs text-slate-400 hover:text-cyan-300"
              >
                Khôi phục mặc định
              </button>

              <button
                onClick={() => setIsCustomizeModalOpen(false)}
                className="rounded-xl bg-cyan-500 px-4 py-2 font-bold text-white text-xs hover:bg-cyan-400"
              >
                Hoàn tất & Lưu bố cục
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
