import React, { useState } from 'react';
import { 
  Rocket, 
  Github, 
  ShieldCheck, 
  Globe2, 
  Sun, 
  Moon, 
  Palette, 
  FileDown, 
  ExternalLink,
  Activity,
  CheckCircle2,
  Server,
  Menu,
  X,
  Home,
  BookOpen,
  LayoutDashboard,
  Bot,
  Lock,
  Globe,
  Users,
  Cloud,
  KeyRound,
  BarChart3,
  Search,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Language, ThemeMode, AccentColor, ActiveTab } from '../types';
import { translations } from '../i18n';

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  twoFactorEnabled: boolean;
  onOpenDeployModal: () => void;
  onOpenReportModal: () => void;
  activeDeployCount: number;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  theme,
  setTheme,
  accent,
  setAccent,
  twoFactorEnabled,
  onOpenDeployModal,
  onOpenReportModal,
  activeDeployCount,
  activeTab,
  setActiveTab,
}) => {
  const t = translations[lang];
  const [showAccentPicker, setShowAccentPicker] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerSearch, setDrawerSearch] = useState('');

  const accentColors: { key: AccentColor; label: string; class: string }[] = [
    { key: 'cyan', label: 'Cyan Edge', class: 'bg-cyan-500' },
    { key: 'emerald', label: 'Emerald Flow', class: 'bg-emerald-500' },
    { key: 'violet', label: 'Cyber Violet', class: 'bg-violet-500' },
    { key: 'amber', label: 'Solar Amber', class: 'bg-amber-500' },
  ];

  const primaryTabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Trang Chủ', icon: <Home className="h-3.5 w-3.5" /> },
    { id: 'docs', label: 'Docs', icon: <BookOpen className="h-3.5 w-3.5" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-3.5 w-3.5" /> },
    { id: 'deployments', label: 'Triển Khai', icon: <Rocket className="h-3.5 w-3.5" /> },
    { id: 'aiAgent', label: 'AI Agent', icon: <Bot className="h-3.5 w-3.5" /> },
    { id: 'api', label: 'Slack & API', icon: <KeyRound className="h-3.5 w-3.5" /> },
    { id: 'security', label: 'Bảo Mật 2FA', icon: <ShieldCheck className="h-3.5 w-3.5" /> },
  ];

  const allDrawerItems: {
    category: string;
    items: { id: ActiveTab; label: string; icon: React.ReactNode; desc: string; badge?: string }[];
  }[] = [
    {
      category: 'Khởi đầu & Tài liệu kỹ thuật',
      items: [
        { id: 'home', label: t.nav.home || 'Trang Chủ & Cài Đặt', icon: <Home className="h-4 w-4 text-cyan-400" />, desc: 'Tổng quan hệ thống, roadmap và thiết lập nhanh', badge: 'Mới' },
        { id: 'docs', label: t.nav.docs || 'Tài Liệu Kỹ Thuật (Docs)', icon: <BookOpen className="h-4 w-4 text-blue-400" />, desc: 'Dockerfile, CLI, Slack Webhook và FAQ', badge: 'Docs' },
        { id: 'dashboard', label: t.nav.dashboard || 'Dashboard Tập Trung', icon: <LayoutDashboard className="h-4 w-4 text-indigo-400" />, desc: 'Giám sát hạ tầng, telemetry và logs thời gian thực', badge: 'Hub' },
      ],
    },
    {
      category: 'Triển khai & Vận hành CI/CD',
      items: [
        { id: 'deployments', label: t.nav.deployments, icon: <Rocket className="h-4 w-4 text-emerald-400" />, desc: 'Bản build live, rollback 1-click và build logs', badge: 'Live' },
        { id: 'github', label: t.nav.github, icon: <Github className="h-4 w-4 text-slate-300" />, desc: 'Đồng bộ nhánh main từ repo-VelClaw và Docker container' },
        { id: 'domains', label: t.nav.domains, icon: <Globe className="h-4 w-4 text-cyan-300" />, desc: 'Cấu hình DNS CNAME/A và tự động cấp chứng chỉ SSL' },
        { id: 'backups', label: t.nav.backups, icon: <Cloud className="h-4 w-4 text-blue-300" />, desc: 'Sao lưu snapshot đám mây Google Drive và AWS S3' },
      ],
    },
    {
      category: 'Trí tuệ nhân tạo & Hiệu năng',
      items: [
        { id: 'aiAgent', label: t.nav.aiAgent, icon: <Bot className="h-4 w-4 text-purple-400" />, desc: 'Trợ lý Gemini 3.8 Flash chẩn đoán lỗi và phân bổ sprint', badge: 'AI 24/7' },
        { id: 'analytics', label: t.nav.analytics, icon: <BarChart3 className="h-4 w-4 text-amber-400" />, desc: 'Thống kê lượng truy cập, độ trễ P95 và băng thông edge' },
      ],
    },
    {
      category: 'Bảo mật & Tích hợp',
      items: [
        { id: 'envVars', label: t.nav.envVars, icon: <Lock className="h-4 w-4 text-emerald-400" />, desc: 'Kho bí mật biến môi trường mã hóa AES-256' },
        { id: 'security', label: t.nav.security, icon: <ShieldCheck className="h-4 w-4 text-rose-400" />, desc: 'Xác thực hai yếu tố (2FA TOTP) và nhật ký kiểm toán' },
        { id: 'api', label: t.nav.api, icon: <KeyRound className="h-4 w-4 text-purple-400" />, desc: 'Cấu hình Slack Webhook và khóa REST API' },
        { id: 'team', label: t.nav.team, icon: <Users className="h-4 w-4 text-slate-300" />, desc: 'Quản trị thành viên và phân quyền RBAC' },
      ],
    },
  ];

  const filteredCategories = allDrawerItems.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.label.toLowerCase().includes(drawerSearch.toLowerCase()) ||
        item.desc.toLowerCase().includes(drawerSearch.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsDrawerOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md transition-colors">
      
      {/* Top Main Bar */}
      <div className="flex h-16 items-center justify-between px-3 sm:px-6 gap-2">
        
        {/* Left: Hamburger 3-Gạch Menu & Brand */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Hamburger 3-gạch button */}
          <button
            id="nav-hamburger-menu-btn"
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Mở menu điều hướng 3 gạch"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/90 text-slate-200 hover:bg-slate-800 hover:text-cyan-300 hover:border-cyan-500/40 transition-all shadow-sm focus:outline-none"
            title="Menu điều hướng hệ thống (3 gạch)"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-violet-600 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Rocket className="h-5 w-5 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white font-['Plus_Jakarta_Sans'] group-hover:text-cyan-300 transition-colors">
                  VelCat <span className="text-cyan-400">Pro</span>
                </span>
                <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-1.5 py-0.2 text-[10px] font-semibold text-cyan-300 hidden xs:inline-block">
                  v2.4
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-400 truncate max-w-xs">
                CI/CD Engine & DevOps Docs
              </p>
            </div>
          </div>

          {/* Git repo pill */}
          <div className="hidden xl:flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/90 px-3 py-1 text-xs text-slate-300 ml-2">
            <Github className="h-3.5 w-3.5 text-slate-400" />
            <a 
              href="https://github.com/velclaw/repo-VelClaw" 
              target="_blank" 
              rel="noreferrer" 
              className="font-mono text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
            >
              velclaw/repo-VelClaw
              <ExternalLink className="h-3 w-3 text-slate-500" />
            </a>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
            <span className="text-[11px] text-slate-400 font-mono">main</span>
          </div>
        </div>

        {/* Center: Quick Tabs Strip on Desktop/Tablet */}
        <nav className="hidden lg:flex items-center gap-1 rounded-xl border border-slate-800/80 bg-slate-950/70 p-1">
          {primaryTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Actions, Language, Theme, Deploy */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Export PDF Button */}
          <button
            id="nav-export-report-btn"
            onClick={onOpenReportModal}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-all hover:text-white"
            title={t.common.exportPdf}
          >
            <FileDown className="h-3.5 w-3.5 text-cyan-400" />
            <span>{t.common.exportPdf}</span>
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <Globe2 className="absolute left-2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <select
              id="nav-language-select"
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              aria-label="Chọn ngôn ngữ giao diện"
              className="appearance-none rounded-lg border border-slate-800 bg-slate-900/90 py-1.5 pl-7 pr-2.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none cursor-pointer hover:bg-slate-800/80"
            >
              <option value="vi">🇻🇳 VI</option>
              <option value="en">🇺🇸 EN</option>
              <option value="ja">🇯🇵 JA</option>
              <option value="fr">🇫🇷 FR</option>
            </select>
          </div>

          {/* Theme Mode Toggle */}
          <button
            id="nav-theme-toggle-btn"
            onClick={() => setTheme(theme === 'dark' ? 'twilight' : theme === 'twilight' ? 'light' : 'dark')}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            title="Đổi giao diện Dark / Twilight / Light"
          >
            {theme === 'dark' ? <Moon className="h-4 w-4 text-cyan-400" /> : <Sun className="h-4 w-4 text-amber-400" />}
          </button>

          {/* Accent Color Picker */}
          <div className="relative">
            <button
              id="nav-accent-picker-btn"
              onClick={() => setShowAccentPicker(!showAccentPicker)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              title="Tùy chỉnh màu chủ đạo"
            >
              <Palette className="h-4 w-4 text-violet-400" />
            </button>
            {showAccentPicker && (
              <div className="absolute right-0 mt-2 w-36 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-xl z-50">
                <div className="text-[11px] font-semibold text-slate-400 px-1 mb-1.5">Màu chủ đạo</div>
                <div className="space-y-1">
                  {accentColors.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => {
                        setAccent(item.key);
                        setShowAccentPicker(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs text-slate-300 hover:bg-slate-800 text-left"
                    >
                      <span className={`h-2.5 w-2.5 rounded-full ${item.class}`} />
                      <span>{item.label}</span>
                      {accent === item.key && <CheckCircle2 className="h-3 w-3 ml-auto text-cyan-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Deploy Button */}
          <button
            id="nav-deploy-now-btn"
            onClick={onOpenDeployModal}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 transition-all active:scale-95 shrink-0"
          >
            <Rocket className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">{t.common.deployNow}</span>
          </button>
        </div>

      </div>

      {/* Sub-bar: Mobile Quick Tabs Scrollable Strip */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto px-3 py-1.5 border-t border-slate-800/60 bg-slate-950/60 no-scrollbar">
        {primaryTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold shrink-0 transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3-Gạch Navigation Drawer Modal */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Slide-out Drawer Panel */}
          <div className="relative z-10 w-full max-w-md bg-slate-950 border-r border-slate-800 shadow-2xl flex flex-col h-full overflow-hidden">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 shadow-md">
                  <Rocket className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Menu Điều Hướng Toàn Diện</h2>
                  <p className="text-[11px] text-slate-400">13 phân hệ chuyên trách độc lập</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Drawer Search Filter */}
            <div className="p-3 border-b border-slate-800/80 bg-slate-950">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={drawerSearch}
                  onChange={(e) => setDrawerSearch(e.target.value)}
                  placeholder="Tìm trang hoặc tính năng..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  autoFocus
                />
              </div>
            </div>

            {/* Drawer Categorized Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {filteredCategories.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400/80 px-2 mb-1">
                    {cat.category}
                  </div>
                  <div className="space-y-1">
                    {cat.items.map((item) => {
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectTab(item.id)}
                          className={`w-full flex items-center justify-between rounded-xl p-2.5 text-left transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-cyan-600/20 to-blue-600/15 border border-cyan-500/40 text-cyan-200 shadow-sm'
                              : 'hover:bg-slate-900 text-slate-300 hover:text-white border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                              isActive ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-slate-900 border border-slate-800'
                            }`}>
                              {item.icon}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={`text-xs font-bold ${isActive ? 'text-cyan-300' : 'text-white'}`}>
                                  {item.label}
                                </span>
                                {item.badge && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 leading-tight mt-0.5 line-clamp-1">
                                {item.desc}
                              </p>
                            </div>
                          </div>

                          <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${
                            isActive ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600'
                          }`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Drawer Footer */}
            <div className="p-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">Cụm máy chủ: asia-east1 Edge</span>
              <button
                type="button"
                onClick={() => {
                  setIsDrawerOpen(false);
                  onOpenDeployModal();
                }}
                className="inline-flex items-center gap-1 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-cyan-500 transition-colors"
              >
                <Rocket className="h-3.5 w-3.5" />
                <span>Deploy ngay</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </header>
  );
};
