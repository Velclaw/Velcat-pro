import React, { useState } from 'react';
import { 
  Bell, 
  Mail, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Plus,
  Trash2,
  Check,
  Zap,
  Sliders,
  ShieldAlert,
  Sparkles,
  Layers
} from 'lucide-react';
import { NotificationSetting, Language, SlackProjectWebhook } from '../types';
import { translations } from '../i18n';
import { SlackProjectWebhookConfig } from './SlackProjectWebhookConfig';
import { initialSlackProjectWebhooks } from '../data/mockData';

interface NotificationsViewProps {
  settings: NotificationSetting[];
  onUpdateSettings: (settings: NotificationSetting[]) => void;
  slackProjectWebhooks?: SlackProjectWebhook[];
  onSaveSlackWebhook?: (webhook: SlackProjectWebhook) => void;
  onDeleteSlackWebhook?: (id: string) => void;
  onToggleSlackWebhook?: (id: string) => void;
  lang: Language;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  settings,
  onUpdateSettings,
  slackProjectWebhooks = initialSlackProjectWebhooks,
  onSaveSlackWebhook,
  onDeleteSlackWebhook,
  onToggleSlackWebhook,
  lang,
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'slack_project_events' | 'email_overview' | 'event_rules'>('slack_project_events');
  
  // Local fallback state if not provided from parent
  const [localSlackWebhooks, setLocalSlackWebhooks] = useState<SlackProjectWebhook[]>(slackProjectWebhooks);

  // Synchronize when prop changes
  React.useEffect(() => {
    if (slackProjectWebhooks) {
      setLocalSlackWebhooks(slackProjectWebhooks);
    }
  }, [slackProjectWebhooks]);

  const handleSaveWebhook = (webhook: SlackProjectWebhook) => {
    if (onSaveSlackWebhook) {
      onSaveSlackWebhook(webhook);
    } else {
      setLocalSlackWebhooks((prev) => {
        const exists = prev.some((w) => w.id === webhook.id);
        if (exists) {
          return prev.map((w) => (w.id === webhook.id ? webhook : w));
        }
        return [webhook, ...prev];
      });
    }
  };

  const handleDeleteWebhook = (id: string) => {
    if (onDeleteSlackWebhook) {
      onDeleteSlackWebhook(id);
    } else {
      setLocalSlackWebhooks((prev) => prev.filter((w) => w.id !== id));
    }
  };

  const handleToggleWebhook = (id: string) => {
    if (onToggleSlackWebhook) {
      onToggleSlackWebhook(id);
    } else {
      setLocalSlackWebhooks((prev) =>
        prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
      );
    }
  };

  // Legacy email & general webhook states
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/T00/B00/VelCatAlerts');
  const [slackChannel, setSlackChannel] = useState('#devops-deployments');
  const [emails, setEmails] = useState<string[]>(['devops-lead@velclaw.io', 'security@velclaw.io']);
  const [newEmail, setNewEmail] = useState('');
  const [testSent, setTestSent] = useState<string | null>(null);

  const toggleEvent = (settingId: string, eventIndex: number) => {
    const updated = settings.map((s) => {
      if (s.id === settingId) {
        const events = [...s.events];
        events[eventIndex] = { ...events[eventIndex], enabled: !events[eventIndex].enabled };
        return { ...s, events };
      }
      return s;
    });
    onUpdateSettings(updated);
  };

  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || emails.includes(newEmail.trim())) return;
    setEmails([...emails, newEmail.trim()]);
    setNewEmail('');
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter((e) => e !== emailToRemove));
  };

  const handleSendTest = (channel: 'Slack' | 'Email') => {
    setTestSent(channel);
    setTimeout(() => {
      setTestSent(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>{t?.notifications?.title || 'Thông Báo & Webhooks'}</span>
                <span className="rounded-full bg-purple-500/10 border border-purple-500/30 px-2.5 py-0.5 text-[10px] font-bold text-purple-300">
                  Slack Pro
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Quản lý cảnh báo qua Slack và Email cho từng tiến trình build, deploy, mã hóa bảo mật và lỗi hiệu năng.
              </p>
            </div>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('slack_project_events')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'slack_project_events'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span className="font-mono text-sm">#</span>
            <span>Slack Webhook Từng Dự Án</span>
            <span className="h-2 w-2 rounded-full bg-cyan-300 animate-pulse"></span>
          </button>

          <button
            onClick={() => setActiveTab('email_overview')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'email_overview'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Email Alerts</span>
          </button>

          <button
            onClick={() => setActiveTab('event_rules')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'event_rules'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Quy Tắc Sự Kiện</span>
          </button>
        </div>
      </div>

      {/* Main View Area based on Active Tab */}
      {activeTab === 'slack_project_events' && (
        <SlackProjectWebhookConfig
          webhooks={localSlackWebhooks}
          onSaveWebhook={handleSaveWebhook}
          onDeleteWebhook={handleDeleteWebhook}
          onToggleWebhook={handleToggleWebhook}
          lang={lang}
        />
      )}

      {activeTab === 'email_overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Email Integration Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">Email Digest & Critical Alerts</h2>
                    <div className="text-[11px] text-slate-400">Gửi thông báo tức thì khi build thất bại hoặc 2FA kích hoạt</div>
                  </div>
                </div>

                <button
                  onClick={() => handleSendTest('Email')}
                  className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                >
                  {testSent === 'Email' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Send className="h-3.5 w-3.5" />}
                  <span>{testSent === 'Email' ? 'Đã gửi email test!' : 'Gửi Email Test'}</span>
                </button>
              </div>

              <form onSubmit={handleAddEmail} className="flex gap-2 text-xs">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Thêm email nhận thông báo khẩn cấp..."
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-cyan-600 px-4 py-2.5 font-bold text-white hover:bg-cyan-500 transition-colors"
                >
                  Thêm
                </button>
              </form>

              {/* Email Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {emails.map((em) => (
                  <div
                    key={em}
                    className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-3.5 py-1.5 text-xs text-slate-300 font-mono"
                  >
                    <span>{em}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(em)}
                      className="text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* General Webhook Info Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Chính Sách Chuyển Tiếp Cảnh Báo</h2>
                  <div className="text-[11px] text-slate-400">Độ tin cậy 99.99% qua hàng đợi Kafka / RabbitMQ</div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Mọi cảnh báo quan trọng từ hệ thống CI/CD, phân tích container và audit 2FA sẽ được tự động gửi đồng thời tới các kênh Slack Webhook theo dự án và danh sách email quản trị viên được chỉ định.
              </p>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 font-mono text-slate-400">
                <div>• Cơ chế thử lại: Exponential Backoff (3 lần)</div>
                <div>• Mã hóa Payload: TLS 1.3 / HTTPS POST</div>
                <div>• Tỷ lệ phân phối thành công: 100% trong 24h qua</div>
              </div>
            </div>

          </div>
        </div>
      )}

      {activeTab === 'event_rules' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span>Quy Tắc Kích Hoạt Sự Kiện Hệ Thống (Global Event Trigger Rules)</span>
            </h2>
            <span className="text-xs text-slate-400">Tự động hóa CI/CD</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settings.map((setting) => (
              <div key={setting.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <div className="font-bold text-slate-200 text-xs flex items-center justify-between">
                  <span>Kênh: {setting.channel || setting.platform}</span>
                  <span className="text-[10px] text-cyan-400 font-mono">Trạng thái: Kích hoạt</span>
                </div>

                <div className="space-y-2 text-xs">
                  {setting.events.map((ev, i) => (
                    <label
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 cursor-pointer select-none"
                    >
                      <span className="text-slate-300 font-medium">{ev.name}</span>
                      <input
                        type="checkbox"
                        checked={ev.enabled}
                        onChange={() => toggleEvent(setting.id, i)}
                        className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
