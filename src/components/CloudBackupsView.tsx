import React, { useState } from 'react';
import { 
  Cloud, 
  HardDrive, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Plus, 
  RefreshCw, 
  Download,
  Database,
  Check
} from 'lucide-react';
import { CloudBackup, Language } from '../types';
import { translations } from '../i18n';

interface CloudBackupsViewProps {
  backups: CloudBackup[];
  onCreateBackup: (provider: 'Google Drive' | 'Dropbox' | 'AWS S3 Snapshot') => void;
  onRestoreBackup: (backup: CloudBackup) => void;
  lang: Language;
}

export const CloudBackupsView: React.FC<CloudBackupsViewProps> = ({
  backups,
  onCreateBackup,
  onRestoreBackup,
  lang,
}) => {
  const t = translations[lang];
  const [selectedProvider, setSelectedProvider] = useState<'Google Drive' | 'Dropbox' | 'AWS S3 Snapshot'>('Google Drive');
  const [syncing, setSyncing] = useState(false);

  const handleCreateNow = () => {
    setSyncing(true);
    setTimeout(() => {
      onCreateBackup(selectedProvider);
      setSyncing(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Cloud className="h-6 w-6 text-cyan-400" />
            <span>{t.backups.title}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.backups.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value as any)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="Google Drive">Google Drive Vault</option>
            <option value="Dropbox">Dropbox Cloud Storage</option>
            <option value="AWS S3 Snapshot">AWS S3 Snapshot Bucket</option>
          </select>

          <button
            onClick={handleCreateNow}
            disabled={syncing}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Đang sao lưu...' : t.backups.createSnapshot}</span>
          </button>
        </div>
      </div>

      {/* 3 Provider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Google Drive */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                GD
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Google Drive</h2>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Đang đồng bộ tự động
                </div>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400">OAuth 2.0</span>
          </div>
          <p className="text-xs text-slate-400">
            Thư mục: <code className="text-slate-300 font-mono">/VelCat_Enterprise_Backups/velclaw/</code>
          </p>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 flex justify-between">
            <span>Bản sao lưu gần nhất:</span>
            <span className="text-slate-300 font-mono">15 phút trước</span>
          </div>
        </div>

        {/* Dropbox */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                DB
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Dropbox Business</h2>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Đang đồng bộ tự động
                </div>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Active</span>
          </div>
          <p className="text-xs text-slate-400">
            Thư mục: <code className="text-slate-300 font-mono">/Apps/VelCatPro/repo-VelClaw/</code>
          </p>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 flex justify-between">
            <span>Bản sao lưu gần nhất:</span>
            <span className="text-slate-300 font-mono">14 phút trước</span>
          </div>
        </div>

        {/* AWS S3 / Cloud Bucket */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                S3
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">AWS S3 Cloud Bucket</h2>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Real-time Hot Mirror
                </div>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Glacier Deep</span>
          </div>
          <p className="text-xs text-slate-400">
            Bucket: <code className="text-slate-300 font-mono">s3://velcat-cloud-snapshots/</code>
          </p>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 flex justify-between">
            <span>Bản sao lưu gần nhất:</span>
            <span className="text-slate-300 font-mono">1 giờ trước</span>
          </div>
        </div>

      </div>

      {/* Snapshot History Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="h-4 w-4 text-cyan-400" />
            <span>{t.backups.snapshotHistory}</span>
          </h2>
          <span className="text-xs text-slate-400">Tự động sao lưu mỗi khi có commit mới</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium">
                <th className="pb-3">Tên tệp tin nén (Archive file)</th>
                <th className="pb-3">Nền tảng lưu trữ</th>
                <th className="pb-3">Dung lượng</th>
                <th className="pb-3">Commit Hash</th>
                <th className="pb-3">Thời gian chụp</th>
                <th className="pb-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200 font-mono">
              {backups.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/30">
                  <td className="py-3 text-cyan-300 font-semibold truncate max-w-xs">
                    {b.fileName}
                  </td>
                  <td className="py-3 font-sans">
                    <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">
                      {b.provider}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300">{b.sizeMb} MB</td>
                  <td className="py-3 text-slate-400">{b.commitHash}</td>
                  <td className="py-3 font-sans text-slate-400 text-[11px]">{b.timestamp}</td>
                  <td className="py-3 text-right font-sans">
                    <button
                      onClick={() => onRestoreBackup(b)}
                      className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
                      title="Khôi phục trạng thái website và container từ snapshot này"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>{t.backups.restoreSnapshot}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
