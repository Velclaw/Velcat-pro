export type Language = 'vi' | 'en' | 'ja' | 'fr';

export type ThemeMode = 'dark' | 'twilight' | 'light';
export type AccentColor = 'cyan' | 'emerald' | 'violet' | 'amber';

export type DeploymentStatus = 'building' | 'dockerizing' | 'propagating' | 'ready' | 'failed' | 'queued';
export type Environment = 'production' | 'staging' | 'preview' | 'development';
export type Framework = 'Next.js 14' | 'Vite React' | 'Node.js' | 'Docker';

export interface Deployment {
  id: string;
  url: string;
  domain: string;
  branch: string;
  commitHash: string;
  commitMessage: string;
  author: {
    name: string;
    avatar: string;
  };
  environment: Environment;
  status: DeploymentStatus;
  framework: Framework;
  durationSeconds: number;
  createdAt: string;
  buildLogs: string[];
  metrics: {
    buildTimeMs: number;
    bundleSizeMb: number;
    p95LatencyMs: number;
    lighthouseScore: number;
    ramUsageMb: number;
  };
}

export interface EnvVariable {
  id: string;
  project: string;
  key: string;
  value: string;
  environment: Environment[];
  isSecret: boolean;
  updatedAt: string;
  updatedBy: string;
}

export type DashboardWidgetId = 
  | 'deploy_status' 
  | 'cicd_pipeline' 
  | 'build_logs' 
  | 'performance_alerts' 
  | 'traffic_metrics' 
  | 'system_telemetry' 
  | 'quick_actions';

export interface DashboardWidgetConfig {
  id: DashboardWidgetId;
  title: string;
  description: string;
  enabled: boolean;
  order: number;
  colSpan?: 'full' | 'half' | 'third';
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'DevOps Lead' | 'Fullstack Dev' | 'Viewer';
  avatar: string;
  active2FA: boolean;
  lastActive: string;
  assignedTasksCount: number;
}

export interface ProjectTask {
  id: string;
  title: string;
  category: 'DevOps' | 'Security' | 'Frontend' | 'Backend' | 'Docker';
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  status: 'Backlog' | 'In Progress' | 'In Review' | 'Done';
  assignedTo?: string;
  estimatedHours: number;
  deadline: string;
  confidenceScore?: number;
  aiSuggestedAssignee?: string;
  aiReason?: string;
}

export interface DomainRecord {
  id: string;
  name: string;
  type: 'Production' | 'Staging' | 'Redirect';
  status: 'Valid' | 'Pending DNS' | 'Error';
  sslStatus: 'Active (Let\'s Encrypt)' | 'Issuing' | 'Self-Signed';
  dnsType: 'CNAME' | 'A';
  dnsTarget: string;
  createdAt: string;
}

export interface CloudBackup {
  id: string;
  provider: 'Google Drive' | 'Dropbox' | 'AWS S3 Snapshot';
  fileName: string;
  sizeMb: number;
  commitHash: string;
  timestamp: string;
  status: 'Completed' | 'Syncing' | 'Failed';
  snapshotUrl: string;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  tokenMasked: string;
  rawToken?: string;
  permissions: 'Full Access' | 'Read Only' | 'Deploy Only';
  lastUsed: string;
  createdAt: string;
}

export interface WebhookEventItem {
  id: string;
  name: string;
  enabled: boolean;
}

export type ProjectEventType = 
  | 'deploy_started'
  | 'deploy_success'
  | 'deploy_failed'
  | 'rollback_executed'
  | 'env_var_changed'
  | 'backup_completed'
  | 'perf_alert';

export interface SlackProjectWebhook {
  id: string;
  projectName: string;
  webhookUrl: string;
  channel: string;
  botName?: string;
  selectedEvents: ProjectEventType[];
  enabled: boolean;
  lastTestedAt?: string;
  lastStatus?: 'success' | 'failed' | 'untested';
  createdAt: string;
}

export interface WebhookConfig {
  id: string;
  platform: 'Slack' | 'Email' | 'Discord' | 'Custom Webhook';
  channel?: string;
  url: string;
  events: WebhookEventItem[];
  enabled: boolean;
}

export interface AnalyticsDataPoint {
  date: string;
  visitors: number;
  pageviews: number;
  latencyMs: number;
  bandwidthGb: number;
  errorRatePercent: number;
}

export type ActiveTab = 
  | 'home'
  | 'docs'
  | 'dashboard'
  | 'deployments' 
  | 'analytics' 
  | 'aiAgent' 
  | 'envVars' 
  | 'github' 
  | 'domains' 
  | 'team' 
  | 'backups' 
  | 'security' 
  | 'api';

export type AppView = ActiveTab;
export type DeploymentRecord = Deployment;
export type NotificationSetting = WebhookConfig;
