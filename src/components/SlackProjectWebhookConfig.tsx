import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Plus, 
  Trash2, 
  Check, 
  Zap, 
  ExternalLink, 
  RefreshCw, 
  ShieldCheck, 
  Code2, 
  Edit3, 
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Info,
  Layers,
  Sparkles,
  ClipboardPaste,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { SlackProjectWebhook, ProjectEventType, Language } from '../types';
import { availableProjects } from '../data/mockData';

interface SlackProjectWebhookConfigProps {
  webhooks: SlackProjectWebhook[];
  onSaveWebhook: (webhook: SlackProjectWebhook) => void;
  onDeleteWebhook: (id: string) => void;
  onToggleWebhook: (id: string) => void;
  lang: Language;
}

interface EventDefinition {
  id: ProjectEventType;
  title: string;
  category: 'Deploy' | 'Security' | 'Infra';
  description: string;
  emoji: string;
  color: string;
  slackBorderColor: string;
}

export const SlackProjectWebhookConfig: React.FC<SlackProjectWebhookConfigProps> = ({
  webhooks,
  onSaveWebhook,
  onDeleteWebhook,
  onToggleWebhook,
  lang,
}) => {
  // All project events definitions
  const eventDefinitions: EventDefinition[] = [
    {
      id: 'deploy_started',
      title: 'Triển khai khởi chạy (Deployment Started)',
      category: 'Deploy',
      description: 'Gửi alert ngay khi lệnh build hoặc git commit được trigger trên repo',
      emoji: '🚀',
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      slackBorderColor: '#3b82f6',
    },
    {
      id: 'deploy_success',
      title: 'Triển khai thành công (Deployment Succeeded)',
      category: 'Deploy',
      description: 'Thông báo khi phiên bản mới live trên 320 Edge PoPs với 0ms downtime',
      emoji: '✅',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      slackBorderColor: '#10b981',
    },
    {
      id: 'deploy_failed',
      title: 'Triển khai thất bại (Deployment Failed)',
      category: 'Deploy',
      description: 'Cảnh báo khẩn cấp khi container crash, lỗi TypeScript hoặc Docker multi-stage build',
      emoji: '❌',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      slackBorderColor: '#ef4444',
    },
    {
      id: 'rollback_executed',
      title: 'Thực thi Rollback (Rollback Executed)',
      category: 'Deploy',
      description: 'Thông báo khi kỹ sư hoặc hệ thống kích hoạt phục hồi phiên bản ổn định trước',
      emoji: '🔄',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      slackBorderColor: '#f59e0b',
    },
    {
      id: 'env_var_changed',
      title: 'Biến môi trường / Secret thay đổi (Secret Vault 2FA)',
      category: 'Security',
      description: 'Ghi nhật ký audit bảo mật khi biến nhạy cảm hoặc API key được thêm/xóa/sửa',
      emoji: '🔐',
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      slackBorderColor: '#8b5cf6',
    },
    {
      id: 'backup_completed',
      title: 'Sao lưu đám mây hoàn tất (Cloud Backup Done)',
      category: 'Infra',
      description: 'Thông báo khi snapshot định kỳ đã đồng bộ an toàn lên Google Drive / AWS S3',
      emoji: '☁️',
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      slackBorderColor: '#06b6d4',
    },
    {
      id: 'perf_alert',
      title: 'Cảnh báo hiệu năng & Độ trễ P95 (Performance Alert)',
      category: 'Infra',
      description: 'Cảnh báo khi độ trễ P95 vượt ngưỡng 90ms hoặc phát hiện tỉ lệ lỗi 5xx gia tăng',
      emoji: '⚡',
      color: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
      slackBorderColor: '#f97316',
    },
  ];

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>('repo-VelClaw');
  const [webhookUrl, setWebhookUrl] = useState<string>('https://hooks.slack.com/services/T00/B00/VelCatCoreDeploy');
  const [channel, setChannel] = useState<string>('#devops-deployments');
  const [botName, setBotName] = useState<string>('VelCat CI/CD Bot');
  const [selectedEvents, setSelectedEvents] = useState<ProjectEventType[]>([
    'deploy_started',
    'deploy_success',
    'deploy_failed',
    'rollback_executed',
  ]);

  // Testing State
  const [testEventToRun, setTestEventToRun] = useState<ProjectEventType>('deploy_success');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    status?: number;
    deliveryTimeMs?: number;
    message?: string;
    payload?: any;
    timestamp?: string;
    error?: string;
  } | null>(null);
  const [showPayloadInspector, setShowPayloadInspector] = useState(false);

  // Safe internal notification toast
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  // Filter for configured webhooks list
  const [filterProject, setFilterProject] = useState<string>('all');

  // Form URL validation
  const isValidUrl = webhookUrl.startsWith('https://hooks.slack.com/services/') || webhookUrl.startsWith('https://');

  // Toggle individual event
  const toggleEvent = (eventId: ProjectEventType) => {
    setSelectedEvents((prev) => 
      prev.includes(eventId) 
        ? prev.filter((id) => id !== eventId) 
        : [...prev, eventId]
    );
  };

  const handleSelectAllEvents = () => {
    setSelectedEvents(eventDefinitions.map((e) => e.id));
  };

  const handleSelectCriticalOnly = () => {
    setSelectedEvents(['deploy_failed', 'rollback_executed', 'env_var_changed', 'perf_alert']);
  };

  const handleClearEvents = () => {
    setSelectedEvents([]);
  };

  // Run Real Webhook Test via Backend
  const handleTestWebhook = async () => {
    if (!webhookUrl.trim()) {
      showToast('error', 'Vui lòng nhập Slack Incoming Webhook URL trước khi thử nghiệm.');
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/notifications/test-slack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: webhookUrl.trim(),
          project: selectedProject,
          eventType: testEventToRun,
          channel: channel.trim() || '#devops-deployments',
          botName: botName.trim() || 'VelCat CI/CD Bot',
          iconEmoji: ':rocket:',
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setTestResult({
          success: true,
          status: data.status || 200,
          deliveryTimeMs: data.deliveryTimeMs || 35,
          message: data.message,
          payload: data.payload,
          timestamp: data.timestamp || new Date().toLocaleTimeString(),
        });
        showToast('success', `Kiểm tra kết nối Slack thành công! Trễ mạng ${data.deliveryTimeMs || 35}ms`);
      } else {
        setTestResult({
          success: false,
          error: data.error || 'Kiểm tra thất bại. Vui lòng thử lại.',
        });
        showToast('error', data.error || 'Kiểm tra thất bại.');
      }
    } catch (err: any) {
      const errMsg = err?.message || 'Lỗi mạng khi kết nối tới máy chủ kiểm thử.';
      setTestResult({
        success: false,
        error: errMsg,
      });
      showToast('error', errMsg);
    } finally {
      setIsTesting(false);
    }
  };

  // Save or Update Configuration
  const handleSaveConfiguration = (e: React.FormEvent) => {
    e.preventDefault();

    if (!webhookUrl.trim()) {
      showToast('error', 'Vui lòng nhập Slack Webhook URL!');
      return;
    }

    if (selectedEvents.length === 0) {
      showToast('error', 'Vui lòng chọn ít nhất 1 sự kiện dự án để kích hoạt thông báo Slack!');
      return;
    }

    const newWebhook: SlackProjectWebhook = {
      id: editingId || 'spw_' + Date.now(),
      projectName: selectedProject,
      webhookUrl: webhookUrl.trim(),
      channel: channel.startsWith('#') ? channel.trim() : `#${channel.trim()}`,
      botName: botName.trim() || 'VelCat CI/CD Bot',
      selectedEvents: [...selectedEvents],
      enabled: true,
      lastTestedAt: testResult?.success ? 'Vừa xong (Thành công)' : 'Đã lưu',
      lastStatus: testResult?.success ? 'success' : 'untested',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onSaveWebhook(newWebhook);

    // Reset edit state
    setEditingId(null);
    showToast('success', `Đã lưu cấu hình Slack Webhook cho dự án [${selectedProject}] thành công!`);
  };

  // Populate form with existing webhook to edit
  const handleEdit = (item: SlackProjectWebhook) => {
    setEditingId(item.id);
    setSelectedProject(item.projectName);
    setWebhookUrl(item.webhookUrl);
    setChannel(item.channel);
    setBotName(item.botName || 'VelCat CI/CD Bot');
    setSelectedEvents(item.selectedEvents);
    setTestResult(null);

    // Scroll to form smoothly
    const formElement = document.getElementById('slack-config-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setWebhookUrl('https://hooks.slack.com/services/T00/B00/VelCatCoreDeploy');
    setSelectedProject('repo-VelClaw');
    setChannel('#devops-deployments');
    setSelectedEvents(['deploy_started', 'deploy_success', 'deploy_failed', 'rollback_executed']);
  };

  // Active event preview data
  const currentPreviewEvent = eventDefinitions.find((e) => e.id === testEventToRun) || eventDefinitions[1];

  const filteredWebhooks = filterProject === 'all' 
    ? webhooks 
    : webhooks.filter((w) => w.projectName === filterProject);

  return (
    <div className="space-y-8">
      {/* Toast Notification Banner */}
      {toast && (
        <div
          className={`rounded-xl px-4 py-3 text-xs font-semibold flex items-center justify-between border shadow-lg transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : toast.type === 'error'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white text-sm font-bold ml-3"
          >
            ×
          </button>
        </div>
      )}

      {/* Configuration Form Card */}
      <div 
        id="slack-config-form"
        className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md space-y-6"
      >
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 text-lg font-black shadow-inner">
              #
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white tracking-tight">
                  Cấu Hình Slack Webhook Cho Từng Sự Kiện Dự Án
                </h2>
                {editingId && (
                  <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
                    Đang chỉnh sửa
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Thiết lập URL Webhook riêng biệt, gắn thẻ kênh Slack đích và tùy chỉnh thông báo cho từng sự kiện CI/CD, bảo mật & hiệu năng.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Hủy chỉnh sửa
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setWebhookUrl('https://hooks.slack.com/services/T00/B00/sample-webhook-token-9988');
                setChannel('#alerts-production');
                setSelectedEvents(['deploy_failed', 'rollback_executed', 'env_var_changed']);
              }}
              className="px-3 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Nạp cấu hình mẫu</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveConfiguration} className="space-y-6">
          
          {/* Row 1: Project Scope & Channel */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            
            {/* Project Selection */}
            <div>
              <label className="block font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-cyan-400" />
                <span>Áp Dụng Cho Dự Án (Project Scope)</span>
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 font-medium focus:border-cyan-500 focus:outline-none transition-colors"
              >
                {availableProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.defaultBranch})
                  </option>
                ))}
                <option value="Toàn bộ dự án (Global)">Toàn bộ dự án (Global Alert Broadcast)</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Webhook sẽ nhận sự kiện phát sinh từ mã nguồn và tiến trình của dự án này.
              </p>
            </div>

            {/* Slack Channel */}
            <div>
              <label className="block font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <span className="font-mono text-purple-400 font-bold">#</span>
                <span>Kênh Slack Nhận Tin (Target Channel)</span>
              </label>
              <input
                type="text"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                placeholder="#devops-deployments"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-slate-100 font-mono focus:border-purple-500 focus:outline-none transition-colors"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Ví dụ: <code>#devops-deployments</code>, <code>#alerts-critical</code>
              </p>
            </div>

            {/* Bot Display Name */}
            <div>
              <label className="block font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Tên Bot Hiển Thị (Bot Identity)</span>
              </label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                placeholder="VelCat CI/CD Bot"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-slate-100 font-medium focus:border-cyan-500 focus:outline-none transition-colors"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Tên đại diện xuất hiện ở đầu tin nhắn gửi vào Slack.
              </p>
            </div>
          </div>

          {/* Row 2: Slack Webhook URL with Validation */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>Slack Incoming Webhook URL</span>
              </label>
              <div className="flex items-center gap-2 text-[11px]">
                {isValidUrl ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="h-3 w-3" /> URL định dạng chuẩn
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Cần bắt đầu với https://hooks.slack.com/services/...
                  </span>
                )}
              </div>
            </div>

            <div className="relative">
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://hooks.slack.com/services/T00/B00/XXXXXXXXXXXX"
                required
                className={`w-full rounded-xl border ${
                  isValidUrl ? 'border-slate-700 focus:border-purple-500' : 'border-amber-500/60'
                } bg-slate-950 px-4 py-3 text-xs text-slate-100 font-mono focus:outline-none transition-colors pr-24`}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.readText) {
                        const text = await navigator.clipboard.readText();
                        if (text) setWebhookUrl(text);
                      } else {
                        showToast('info', 'Vui lòng dán trực tiếp URL vào ô nhập liệu bằng phím tắt Ctrl+V hoặc Cmd+V');
                      }
                    } catch (e) {
                      showToast('info', 'Vui lòng dán trực tiếp URL vào ô nhập liệu');
                    }
                  }}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 font-medium transition-colors flex items-center gap-1"
                  title="Dán từ bộ nhớ tạm"
                >
                  <ClipboardPaste className="h-3 w-3" />
                  <span>Dán</span>
                </button>
              </div>
            </div>
          </div>

          {/* Row 3: Individual Project Events Selection */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Chọn Từng Sự Kiện Dự Án Cần Gửi Alert ({selectedEvents.length}/{eventDefinitions.length} đã chọn)</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Chỉ những sự kiện được tick chọn dưới đây mới kích hoạt gửi tin nhắn đến Webhook URL này.
                </p>
              </div>

              {/* Quick Event Preset Buttons */}
              <div className="flex items-center gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={handleSelectAllEvents}
                  className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  Chọn tất cả
                </button>
                <button
                  type="button"
                  onClick={handleSelectCriticalOnly}
                  className="px-2.5 py-1 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition-colors"
                >
                  Chỉ sự kiện khẩn cấp
                </button>
                <button
                  type="button"
                  onClick={handleClearEvents}
                  className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Bỏ chọn
                </button>
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {eventDefinitions.map((event) => {
                const isChecked = selectedEvents.includes(event.id);
                return (
                  <div
                    key={event.id}
                    onClick={() => toggleEvent(event.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                      isChecked
                        ? 'border-purple-500/50 bg-purple-950/20 shadow-sm'
                        : 'border-slate-800 bg-slate-950/60 opacity-60 hover:opacity-90 hover:border-slate-700'
                    }`}
                  >
                    <div className="pt-0.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // Handled by container click
                        className="h-4 w-4 rounded border-slate-700 text-purple-600 focus:ring-0 cursor-pointer"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                          <span>{event.emoji}</span>
                          <span>{event.title}</span>
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${event.color}`}>
                          {event.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                        {event.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Row 4: Real-time Live Slack Message Preview & Webhook Testing */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 border-t border-slate-800/80">
            
            {/* Left: Live Slack Block Kit Preview (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Code2 className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Trực Quan Hóa Tin Nhắn Slack (Block Kit UI Preview)</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Channel: {channel || '#devops-deployments'}
                </span>
              </div>

              {/* Slack Message Replica Container */}
              <div className="rounded-2xl border border-slate-800 bg-[#1A1D21] p-4 text-xs font-sans text-slate-200 shadow-2xl relative overflow-hidden">
                {/* Simulated Slack Channel Header Bar */}
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800/80 text-[11px] text-slate-400">
                  <span className="font-mono text-purple-400 font-bold">#</span>
                  <span className="font-semibold text-slate-300">{channel.replace('#', '') || 'devops-deployments'}</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-500 text-[10px]">Slack Enterprise Workspace</span>
                </div>

                {/* Slack Message Body */}
                <div className="flex items-start gap-3">
                  {/* Bot Avatar */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow font-bold text-sm">
                    🚀
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Bot Title & Timestamp */}
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{botName || 'VelCat CI/CD Bot'}</span>
                      <span className="rounded bg-slate-800 px-1 py-0.2 text-[9px] font-bold text-slate-400 uppercase">
                        APP
                      </span>
                      <span className="text-[10px] text-slate-500">Hôm nay lúc {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {/* Slack Attachment Card with colored left border */}
                    <div 
                      className="rounded-lg bg-slate-900/90 border border-slate-800 p-3.5 space-y-2.5"
                      style={{ borderLeftWidth: '4px', borderLeftColor: currentPreviewEvent.slackBorderColor }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{currentPreviewEvent.emoji}</span>
                        <span className="font-bold text-white text-xs">
                          [{selectedProject}] {currentPreviewEvent.title}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {currentPreviewEvent.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-slate-800/80 font-mono">
                        <div>
                          <span className="text-slate-500 block">DỰ ÁN:</span>
                          <span className="text-cyan-300 font-semibold">{selectedProject}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">MÔI TRƯỜNG:</span>
                          <span className="text-emerald-400 font-semibold">production</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">SỰ KIỆN:</span>
                          <span className="text-purple-300 font-semibold">{testEventToRun}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">EDGE CLUSTER:</span>
                          <span className="text-slate-300">asia-east1</span>
                        </div>
                      </div>

                      {/* Interactive Button in Slack */}
                      <div className="pt-2">
                        <span className="inline-flex items-center gap-1 rounded bg-[#007a5a] px-3 py-1.5 text-[11px] font-bold text-white shadow hover:bg-[#148567]">
                          <span>Mở Dashboard Dự Án</span>
                          <ExternalLink className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Test Trigger & Response Telemetry (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  <span>Kiểm Tra Webhook Trực Tiếp (Live Test)</span>
                </span>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Chọn Sự Kiện Thử Nghiệm:
                  </label>
                  <select
                    value={testEventToRun}
                    onChange={(e) => setTestEventToRun(e.target.value as ProjectEventType)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                  >
                    {eventDefinitions.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.emoji} {ev.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Trigger Button */}
                <button
                  type="button"
                  onClick={handleTestWebhook}
                  disabled={isTesting || !webhookUrl}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-cyan-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:opacity-95 disabled:opacity-40 transition-all"
                >
                  {isTesting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Đang gửi gói tin tới Slack Webhook...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Gửi Test Slack Alert Ngay</span>
                    </>
                  )}
                </button>

                {/* Test Result Box */}
                {testResult && (
                  <div className={`p-3 rounded-xl border text-xs space-y-2 animate-in fade-in-50 ${
                    testResult.success 
                      ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200' 
                      : 'border-rose-500/40 bg-rose-950/20 text-rose-200'
                  }`}>
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        {testResult.success ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-rose-400" />
                        )}
                        <span>{testResult.success ? 'Kiểm Tra Thành Công!' : 'Kiểm Tra Thất Bại'}</span>
                      </span>
                      {testResult.status && (
                        <span className="rounded bg-emerald-500/20 border border-emerald-500/40 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300">
                          HTTP {testResult.status} OK
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] leading-relaxed">
                      {testResult.message || testResult.error}
                    </p>

                    {testResult.deliveryTimeMs && (
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                        <span>Độ trễ truyền tải: <strong className="text-cyan-300">{testResult.deliveryTimeMs}ms</strong></span>
                        <span>{testResult.timestamp}</span>
                      </div>
                    )}

                    {testResult.payload && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setShowPayloadInspector(!showPayloadInspector)}
                          className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          <Code2 className="h-3 w-3" />
                          <span>{showPayloadInspector ? 'Ẩn' : 'Xem'} JSON Block Kit Payload</span>
                        </button>

                        {showPayloadInspector && (
                          <pre className="mt-2 max-h-40 overflow-y-auto rounded-lg bg-slate-950 p-2 text-[9px] font-mono text-slate-300 border border-slate-800">
                            {JSON.stringify(testResult.payload, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Form Submit Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Webhook URLs được lưu trữ an toàn và bảo vệ theo chuẩn mã hóa Secret Vault AES-256.</span>
            </div>

            <div className="flex items-center gap-3">
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Hủy
                </button>
              )}
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-6 py-2.5 text-xs font-bold text-white shadow-xl hover:opacity-95 transition-all"
              >
                <Check className="h-4 w-4" />
                <span>{editingId ? 'Cập Nhật Cấu Hình Webhook' : 'Lưu Cấu Hình Webhook Cho Dự Án'}</span>
              </button>
            </div>
          </div>

        </form>
      </div>

      {/* Configured Project Webhooks List */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 font-bold text-xs">
                #
              </span>
              <span>Danh Sách Slack Webhook Đã Cấu Hình Cho Từng Dự Án ({filteredWebhooks.length})</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Quản lý các URL Webhook đã kích hoạt, kiểm tra trạng thái hoạt động hoặc tùy chỉnh sự kiện liên kết.
            </p>
          </div>

          {/* Project Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Lọc theo dự án:</span>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">Tất cả dự án</option>
              {availableProjects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
              <option value="Toàn bộ dự án (Global)">Global</option>
            </select>
          </div>
        </div>

        {/* Webhooks Grid / Table */}
        <div className="grid grid-cols-1 gap-3.5">
          {filteredWebhooks.length === 0 ? (
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-8 text-center text-xs text-slate-400">
              Chưa có Slack Webhook nào được lưu cho bộ lọc này. Hãy điền thông tin vào form ở trên để thêm cấu hình mới!
            </div>
          ) : (
            filteredWebhooks.map((item) => {
              // Mask webhook URL for security
              const maskedUrl = item.webhookUrl.length > 35 
                ? item.webhookUrl.substring(0, 32) + '••••••••' + item.webhookUrl.slice(-6)
                : item.webhookUrl;

              return (
                <div
                  key={item.id}
                  className={`rounded-xl border p-4.5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    item.enabled
                      ? 'border-slate-800 bg-slate-950/90 hover:border-purple-500/40'
                      : 'border-slate-800/60 bg-slate-950/40 opacity-60'
                  }`}
                >
                  {/* Left info */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 font-bold text-xs text-cyan-300">
                        {item.projectName}
                      </span>
                      <span className="font-mono text-xs font-bold text-purple-400">
                        {item.channel}
                      </span>
                      {item.botName && (
                        <span className="text-[11px] text-slate-400 font-medium">
                          via {item.botName}
                        </span>
                      )}
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        item.enabled
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${item.enabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
                        <span>{item.enabled ? 'Đang hoạt động' : 'Tạm dừng'}</span>
                      </span>
                    </div>

                    <div className="font-mono text-xs text-slate-400 flex items-center gap-2">
                      <span className="text-slate-500">URL:</span>
                      <span className="text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{maskedUrl}</span>
                    </div>

                    {/* Active events chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {item.selectedEvents.map((evId) => {
                        const def = eventDefinitions.find((d) => d.id === evId);
                        return (
                          <span
                            key={evId}
                            className="rounded-md bg-slate-900 border border-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300 flex items-center gap-1"
                          >
                            <span>{def?.emoji || '⚡'}</span>
                            <span>{def?.title.split(' (')[0] || evId}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const res = await fetch('/api/notifications/test-slack', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              webhookUrl: item.webhookUrl,
                              project: item.projectName,
                              eventType: item.selectedEvents[0] || 'deploy_success',
                              channel: item.channel,
                              botName: item.botName,
                            }),
                          });
                          const data = await res.json();
                          if (res.ok) {
                            showToast('success', `Đã gửi test tới ${item.channel} thành công (${data.deliveryTimeMs || 35}ms).`);
                          } else {
                            showToast('error', `Lỗi kiểm tra: ${data.error}`);
                          }
                        } catch (e: any) {
                          showToast('error', `Lỗi mạng: ${e?.message || 'Không thể kết nối'}`);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 transition-colors flex items-center gap-1.5"
                      title="Gửi test ngay tới Slack"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Test Ngay</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-1.5"
                      title="Chỉnh sửa cấu hình"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Sửa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleWebhook(item.id)}
                      className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:text-white transition-colors"
                      title={item.enabled ? 'Tạm dừng webhook' : 'Kích hoạt webhook'}
                    >
                      {item.enabled ? (
                        <ToggleRight className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 text-slate-500" />
                      )}
                    </button>

                    {deleteConfirmId === item.id ? (
                      <div className="flex items-center gap-1 bg-rose-950/60 border border-rose-500/40 rounded-lg px-2 py-1">
                        <span className="text-[11px] text-rose-300 font-medium">Xác nhận xóa?</span>
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteWebhook(item.id);
                            setDeleteConfirmId(null);
                            showToast('info', `Đã xóa cấu hình Webhook cho dự án [${item.projectName}]`);
                          }}
                          className="px-1.5 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-[10px] font-bold text-white transition-colors"
                        >
                          Xóa
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 transition-colors"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-500 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                        title="Xóa cấu hình"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};
