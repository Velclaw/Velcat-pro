import React from 'react';
import { 
  Home,
  BookOpen,
  Rocket, 
  BarChart3, 
  Bot, 
  Lock, 
  Github, 
  Globe, 
  Users, 
  Cloud, 
  ShieldCheck, 
  KeyRound,
  Sparkles,
  Layers,
  LayoutDashboard
} from 'lucide-react';
import { Language, ActiveTab } from '../types';
import { translations } from '../i18n';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lang: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  lang,
}) => {
  const t = translations[lang];

  const sections: {
    title: string;
    items: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[];
  }[] = [
    {
      title: 'Khởi đầu & Tài liệu',
      items: [
        {
          id: 'home',
          label: t.nav.home || 'Trang Chủ & Cài Đặt',
          icon: <Home className="h-4 w-4" />,
          badge: 'Setup',
        },
        {
          id: 'docs',
          label: t.nav.docs || 'Tài Liệu (Docs)',
          icon: <BookOpen className="h-4 w-4" />,
          badge: 'Guides',
        },
        {
          id: 'dashboard',
          label: t.nav.dashboard || 'Dashboard Tập Trung',
          icon: <LayoutDashboard className="h-4 w-4" />,
          badge: 'Hub',
        },
      ],
    },
    {
      title: 'Triển khai & Vận hành',
      items: [
        {
          id: 'deployments',
          label: t.nav.deployments,
          icon: <Rocket className="h-4 w-4" />,
          badge: 'Live',
        },
        {
          id: 'github',
          label: t.nav.github,
          icon: <Github className="h-4 w-4" />,
          badge: 'repo-VelClaw',
        },
        {
          id: 'domains',
          label: t.nav.domains,
          icon: <Globe className="h-4 w-4" />,
        },
        {
          id: 'backups',
          label: t.nav.backups,
          icon: <Cloud className="h-4 w-4" />,
          badge: 'Cloud',
        },
      ],
    },
    {
      title: 'Trí tuệ nhân tạo & Số liệu',
      items: [
        {
          id: 'aiAgent',
          label: t.nav.aiAgent,
          icon: <Bot className="h-4 w-4" />,
          badge: 'Gemini 3.8',
        },
        {
          id: 'analytics',
          label: t.nav.analytics,
          icon: <BarChart3 className="h-4 w-4" />,
          badge: 'Realtime',
        },
      ],
    },
    {
      title: 'Bảo mật & Kết nối',
      items: [
        {
          id: 'envVars',
          label: t.nav.envVars,
          icon: <Lock className="h-4 w-4" />,
        },
        {
          id: 'security',
          label: t.nav.security,
          icon: <ShieldCheck className="h-4 w-4" />,
          badge: '2FA',
        },
        {
          id: 'api',
          label: t.nav.api,
          icon: <KeyRound className="h-4 w-4" />,
          badge: 'Slack',
        },
        {
          id: 'team',
          label: t.nav.team,
          icon: <Users className="h-4 w-4" />,
        },
      ],
    },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 border-r border-slate-800/80 bg-slate-950/60 p-3 md:min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      <div className="space-y-4">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {section.title}
            </div>
            {section.items.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm font-bold'
                      : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                        isActive
                          ? 'bg-cyan-400/20 text-cyan-300'
                          : item.badge.includes('Gemini')
                          ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                          : item.badge.includes('Setup')
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Infrastructure Card */}
      <div className="mt-6 rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 to-slate-950 p-3.5 text-xs">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-1">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Hạ tầng VelCat Cloud</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
          Cụm Docker container cho server <code className="text-cyan-300 font-mono">velclaw/repo-VelClaw</code> kết nối 320 Edge nodes.
        </p>
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-[10px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            CI/CD Auto-Pilot
          </span>
          <span className="font-mono text-slate-300">v2.4.0</span>
        </div>
      </div>
    </aside>
  );
};
