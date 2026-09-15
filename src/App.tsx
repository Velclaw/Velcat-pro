import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Deployment, 
  EnvVariable, 
  DomainRecord, 
  CloudBackup, 
  TeamMember, 
  ProjectTask, 
  Language, 
  AccentColor, 
  ThemeMode,
  ActiveTab,
  WebhookConfig,
  SlackProjectWebhook
} from './types';
import { 
  initialDeployments, 
  initialEnvVars, 
  initialDomains, 
  initialBackups, 
  initialTeamMembers, 
  initialTasks, 
  initialAnalytics, 
  initialNotificationSettings,
  initialSlackProjectWebhooks
} from './data/mockData';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HomeSetupView } from './components/HomeSetupView';
import { DocsView } from './components/DocsView';
import { CentralDashboardView } from './components/CentralDashboardView';
import { DeploymentsView } from './components/DeploymentsView';
import { AnalyticsView } from './components/AnalyticsView';
import { AIAgentView } from './components/AIAgentView';
import { EnvVarsView } from './components/EnvVarsView';
import { GitHubDockerView } from './components/GitHubDockerView';
import { SecurityView } from './components/SecurityView';
import { CloudBackupsView } from './components/CloudBackupsView';
import { DomainsView } from './components/DomainsView';
import { TeamView } from './components/TeamView';
import { NotificationsView } from './components/NotificationsView';
import { ReportModal } from './components/ReportModal';
import { FloatingAiAssistant } from './components/FloatingAiAssistant';

export default function App() {
  const [currentView, setCurrentView] = useState<ActiveTab>('home');
  const [lang, setLang] = useState<Language>('vi');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [accent, setAccent] = useState<AccentColor>('cyan');

  // Application Data States
  const [deployments, setDeployments] = useState<Deployment[]>(initialDeployments);
  const [envVars, setEnvVars] = useState<EnvVariable[]>(initialEnvVars);
  const [domains, setDomains] = useState<DomainRecord[]>(initialDomains);
  const [backups, setBackups] = useState<CloudBackup[]>(initialBackups);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [tasks, setTasks] = useState<ProjectTask[]>(initialTasks);
  const [notificationSettings, setNotificationSettings] = useState<WebhookConfig[]>(initialNotificationSettings);
  const [slackProjectWebhooks, setSlackProjectWebhooks] = useState<SlackProjectWebhook[]>(initialSlackProjectWebhooks);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Notification Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Trigger New Deployment
  const handleTriggerDeploy = async (branch: string = 'main', commitMsg?: string) => {
    const newId = 'dpl_' + Math.random().toString(36).substring(2, 9);
    const shortCommit = Math.random().toString(36).substring(2, 9);
    const message = commitMsg || `feat: release to Docker edge cluster on branch ${branch}`;

    const newDep: Deployment = {
      id: newId,
      url: `https://repo-velclaw-${shortCommit.substring(0, 5)}.velcat.app`,
      domain: 'velclaw.app',
      branch,
      commitHash: shortCommit,
      commitMessage: message,
      author: {
        name: 'Alex Tran',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      },
      environment: branch === 'main' ? 'production' : 'preview',
      status: 'building',
      framework: 'Next.js 14',
      durationSeconds: 0,
      createdAt: 'Vừa xong',
      buildLogs: [
        '2026-09-15T04:45:00Z [VelCat Engine] Đang khởi tạo môi trường build cho repository https://github.com/velclaw/repo-VelClaw',
        `2026-09-15T04:45:02Z [Git Sync] Đã kéo commit ${shortCommit} từ origin/${branch}`,
        '2026-09-15T04:45:05Z [Environment] Đã giải mã an toàn 6 biến môi trường từ Secret Vault AES-256',
        '2026-09-15T04:45:08Z [Docker Engine] Khởi chạy container image velclaw/repo-velclaw:latest...',
      ],
      metrics: {
        buildTimeMs: 0,
        bundleSizeMb: 1.42,
        p95LatencyMs: 22,
        lighthouseScore: 99,
        ramUsageMb: 310,
      },
    };

    setDeployments((prev) => [newDep, ...prev]);
    showToast(`Đã bắt đầu tiến trình Build cho nhánh ${branch}!`);

    // Call server simulation endpoint
    try {
      fetch('/api/deployments/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch, commitMessage: message }),
      }).catch((e) => console.error(e));
    } catch (e) {
      // benign
    }

    // Step-by-step log updater
    setTimeout(() => {
      setDeployments((prev) =>
        prev.map((d) =>
          d.id === newId
            ? {
                ...d,
                status: 'dockerizing',
                buildLogs: [
                  ...d.buildLogs,
                  '2026-09-15T04:45:15Z [Builder] npm run build --production (Next.js 14 / Vite)',
                  '2026-09-15T04:45:22Z [TypeScript] Typecheck hoàn tất 0 lỗi',
                  '2026-09-15T04:45:28Z [Docker Stage] Đóng gói image ghcr.io/velclaw/repo-velclaw:latest',
                ],
              }
            : d
        )
      );
    }, 2000);

    setTimeout(() => {
      setDeployments((prev) =>
        prev.map((d) =>
          d.id === newId
            ? {
                ...d,
                status: 'ready',
                durationSeconds: 38,
                metrics: {
                  ...d.metrics,
                  buildTimeMs: 38000,
                },
                buildLogs: [
                  ...d.buildLogs,
                  '2026-09-15T04:45:34Z [Security] Quét an ninh container: 0 CVE vulnerabilities (ISO-27001 Clean)',
                  '2026-09-15T04:45:37Z [Edge Network] Triển khai tới 320 điểm Edge PoPs hoàn tất',
                  '2026-09-15T04:45:38Z [Success] READY! Live tại: ' + d.url,
                ],
              }
            : d
        )
      );
      showToast('🎉 Triển khai phiên bản mới thành công rực rỡ!');
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // confetti fallback
      }
    }, 4500);
  };

  // Rollback to specific deployment
  const handleRollback = (deployment: Deployment) => {
    handleTriggerDeploy(deployment.branch, `Rollback về bản snapshot ${deployment.commitHash}`);
    showToast(`Đang thực hiện Rollback về bản dựng ${deployment.commitHash}...`);
  };

  // Environment Variable actions
  const handleAddEnvVar = (newVar: EnvVariable) => {
    setEnvVars((prev) => [newVar, ...prev]);
    showToast(`Đã thêm biến môi trường ${newVar.key} vào Vault an toàn.`);
  };

  const handleUpdateEnvVar = (updatedVar: EnvVariable) => {
    setEnvVars((prev) => prev.map((v) => (v.id === updatedVar.id ? updatedVar : v)));
    showToast(`Đã cập nhật biến môi trường ${updatedVar.key} vào Vault.`);
  };

  const handleDeleteEnvVar = (id: string) => {
    setEnvVars((prev) => prev.filter((v) => v.id !== id));
    showToast('Đã xóa biến môi trường thành công.');
  };

  // Domain actions
  const handleAddDomain = (name: string, type: 'Production' | 'Staging') => {
    const newDomain: DomainRecord = {
      id: 'dom_' + Date.now(),
      name,
      status: 'Valid',
      sslStatus: "Active (Let's Encrypt)",
      dnsType: name.includes('.') && name.split('.').length > 2 ? 'CNAME' : 'A',
      dnsTarget: 'cname.velcat.app',
      createdAt: '2026-09-15',
      type,
    };
    setDomains((prev) => [...prev, newDomain]);
    showToast(`Đã kết nối tên miền riêng ${name} thành công.`);
  };

  const handleDeleteDomain = (id: string) => {
    setDomains((prev) => prev.filter((d) => d.id !== id));
    showToast('Đã ngắt kết nối tên miền.');
  };

  // Cloud Backup actions
  const handleCreateBackup = (provider: 'Google Drive' | 'Dropbox' | 'AWS S3 Snapshot') => {
    const newB: CloudBackup = {
      id: 'bk_' + Date.now(),
      provider,
      fileName: `velclaw_snapshot_${Date.now()}.tar.gz`,
      sizeMb: 42.8,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'Completed',
      commitHash: 'a7b9c3e',
      snapshotUrl: '#',
    };
    setBackups((prev) => [newB, ...prev]);
    showToast(`Đã tạo snapshot dự phòng và đồng bộ lên ${provider} an toàn!`);
  };

  const handleRestoreBackup = (backup: CloudBackup) => {
    showToast(`Đang nạp lại snapshot ${backup.fileName} từ ${backup.provider}...`);
    setTimeout(() => {
      showToast(`Đã khôi phục trạng thái hệ thống từ snapshot ${backup.commitHash} thành công!`);
    }, 2000);
  };

  // Team actions
  const handleAddMember = (member: TeamMember) => {
    setTeamMembers((prev) => [...prev, member]);
    showToast(`Đã gửi lời mời tham gia dự án đến ${member.email}`);
  };

  const handleUpdateRole = (id: string, newRole: TeamMember['role']) => {
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role: newRole } : m))
    );
    showToast('Đã cập nhật phân quyền người dùng.');
  };

  // Slack Project Webhook actions
  const handleSaveSlackWebhook = (webhook: SlackProjectWebhook) => {
    setSlackProjectWebhooks((prev) => {
      const exists = prev.some((w) => w.id === webhook.id);
      if (exists) {
        return prev.map((w) => (w.id === webhook.id ? webhook : w));
      }
      return [webhook, ...prev];
    });
    showToast(`Đã lưu cấu hình Slack Webhook cho dự án [${webhook.projectName}]!`);
  };

  const handleDeleteSlackWebhook = (id: string) => {
    setSlackProjectWebhooks((prev) => prev.filter((w) => w.id !== id));
    showToast('Đã xóa cấu hình Slack Webhook thành công.');
  };

  const handleToggleSlackWebhook = (id: string) => {
    setSlackProjectWebhooks((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
    showToast('Đã cập nhật trạng thái hoạt động của Webhook.');
  };

  const activeDeployCount = deployments.filter(
    (d) => d.status === 'building' || d.status === 'dockerizing' || d.status === 'queued'
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-cyan-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 rounded-xl border border-cyan-500/40 bg-slate-900/95 px-4 py-3 text-xs font-semibold text-cyan-200 shadow-2xl backdrop-blur-md flex items-center gap-2.5 animate-in slide-in-from-bottom-3">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        accent={accent}
        setAccent={setAccent}
        twoFactorEnabled={twoFactorEnabled}
        onOpenDeployModal={() => handleTriggerDeploy('main')}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        activeDeployCount={activeDeployCount}
        activeTab={currentView}
        setActiveTab={setCurrentView}
      />

      {/* Main Container Layout */}
      <div className="flex-1 flex flex-col md:flex-row max-w-[1600px] w-full mx-auto px-2 sm:px-4 lg:px-6 py-4 gap-6">
        
        {/* Left Sidebar */}
        <Sidebar
          activeTab={currentView}
          setActiveTab={setCurrentView}
          lang={lang}
        />

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {currentView === 'home' && (
            <HomeSetupView
              onNavigateTab={setCurrentView}
              lang={lang}
              onTriggerDeploy={handleTriggerDeploy}
              deployments={deployments}
            />
          )}

          {currentView === 'docs' && (
            <DocsView
              onNavigateTab={setCurrentView}
              lang={lang}
            />
          )}

          {currentView === 'dashboard' && (
            <CentralDashboardView
              deployments={deployments}
              analytics={initialAnalytics}
              onTriggerDeploy={handleTriggerDeploy}
              onRollback={handleRollback}
              onOpenAiAssistant={() => setCurrentView('aiAgent')}
              lang={lang}
            />
          )}

          {currentView === 'deployments' && (
            <DeploymentsView
              deployments={deployments}
              onTriggerDeploy={handleTriggerDeploy}
              onRollback={handleRollback}
              lang={lang}
            />
          )}

          {currentView === 'analytics' && (
            <AnalyticsView
              analytics={initialAnalytics}
              onOpenReportModal={() => setIsReportModalOpen(true)}
              lang={lang}
            />
          )}

          {currentView === 'aiAgent' && (
            <AIAgentView
              teamMembers={teamMembers}
              tasks={tasks}
              onUpdateTasks={setTasks}
              lang={lang}
            />
          )}

          {currentView === 'envVars' && (
            <EnvVarsView
              envVars={envVars}
              onAddVar={handleAddEnvVar}
              onDeleteVar={handleDeleteEnvVar}
              onUpdateVar={handleUpdateEnvVar}
              lang={lang}
            />
          )}

          {currentView === 'github' && (
            <GitHubDockerView
              onTriggerDeploy={handleTriggerDeploy}
              lang={lang}
            />
          )}

          {currentView === 'security' && (
            <SecurityView
              twoFactorEnabled={twoFactorEnabled}
              onToggle2FA={setTwoFactorEnabled}
              lang={lang}
            />
          )}

          {currentView === 'backups' && (
            <CloudBackupsView
              backups={backups}
              onCreateBackup={handleCreateBackup}
              onRestoreBackup={handleRestoreBackup}
              lang={lang}
            />
          )}

          {currentView === 'domains' && (
            <DomainsView
              domains={domains}
              onAddDomain={handleAddDomain}
              onDeleteDomain={handleDeleteDomain}
              lang={lang}
            />
          )}

          {currentView === 'team' && (
            <TeamView
              teamMembers={teamMembers}
              onAddMember={handleAddMember}
              onUpdateRole={handleUpdateRole}
              lang={lang}
            />
          )}

          {currentView === 'api' && (
            <NotificationsView
              settings={notificationSettings}
              onUpdateSettings={setNotificationSettings}
              slackProjectWebhooks={slackProjectWebhooks}
              onSaveSlackWebhook={handleSaveSlackWebhook}
              onDeleteSlackWebhook={handleDeleteSlackWebhook}
              onToggleSlackWebhook={handleToggleSlackWebhook}
              lang={lang}
            />
          )}
        </main>
      </div>

      {/* PDF / Audit Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        analytics={initialAnalytics}
        lang={lang}
      />

      {/* Floating 24/7 AI DevOps Assistant */}
      <FloatingAiAssistant
        lang={lang}
        onNavigateTab={setCurrentView}
      />

    </div>
  );
}
