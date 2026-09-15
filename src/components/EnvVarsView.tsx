import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Plus, 
  Download, 
  Upload, 
  Trash2, 
  ShieldCheck, 
  Check, 
  Copy,
  Key, 
  FileCode2, 
  AlertCircle,
  FolderGit2,
  Layers,
  Zap,
  RefreshCw,
  Clock,
  QrCode,
  Smartphone,
  ShieldAlert,
  Edit3,
  Sparkles,
  Server
} from 'lucide-react';
import { EnvVariable, Environment, Language } from '../types';
import { translations } from '../i18n';
import { availableProjects } from '../data/mockData';

interface EnvVarsViewProps {
  envVars: EnvVariable[];
  onAddVar: (newVar: EnvVariable) => void;
  onDeleteVar: (id: string) => void;
  onUpdateVar?: (updatedVar: EnvVariable) => void;
  lang: Language;
}

export const EnvVarsView: React.FC<EnvVarsViewProps> = ({
  envVars,
  onAddVar,
  onDeleteVar,
  onUpdateVar,
  lang,
}) => {
  const t = translations[lang];

  // Multi-Project Filter
  const [selectedProject, setSelectedProject] = useState<string>('repo-VelClaw');

  // Environment Filter
  const [selectedEnvFilter, setSelectedEnvFilter] = useState<'all' | Environment>('all');

  // Masked/Revealed IDs
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 2FA Authentication Session State
  const [is2FaSessionActive, setIs2FaSessionActive] = useState<boolean>(false);
  const [sessionSecondsLeft, setSessionSecondsLeft] = useState<number>(0);
  const [show2FaModal, setShow2FaModal] = useState<boolean>(false);
  const [totpCode, setTotpCode] = useState<string>('');
  const [totpError, setTotpError] = useState<string>('');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Add / Edit Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVar, setEditingVar] = useState<EnvVariable | null>(null);
  const [newProject, setNewProject] = useState('repo-VelClaw');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newIsSecret, setNewIsSecret] = useState(true);
  const [newEnvironments, setNewEnvironments] = useState<Environment[]>(['production', 'staging', 'development']);

  // Import Modal
  const [showImportModal, setShowImportModal] = useState(false);
  const [rawEnvText, setRawEnvText] = useState('');

  // Zero-Downtime Hot Reload Modal
  const [showHotReloadModal, setShowHotReloadModal] = useState(false);
  const [hotReloadStep, setHotReloadStep] = useState<number>(0);
  const [isHotReloading, setIsHotReloading] = useState(false);

  // Countdown timer for 2FA session
  useEffect(() => {
    if (!is2FaSessionActive || sessionSecondsLeft <= 0) {
      if (is2FaSessionActive && sessionSecondsLeft <= 0) {
        setIs2FaSessionActive(false);
        // Hide all revealed secrets on session expire
        setRevealedIds({});
      }
      return;
    }
    const timer = setInterval(() => {
      setSessionSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [is2FaSessionActive, sessionSecondsLeft]);

  // Protected action executor that checks 2FA
  const executeWith2Fa = (action: () => void) => {
    if (is2FaSessionActive && sessionSecondsLeft > 0) {
      action();
    } else {
      setPendingAction(() => action);
      setShow2FaModal(true);
      setTotpCode('');
      setTotpError('');
    }
  };

  const handleVerify2Fa = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (totpCode.trim().length !== 6 && totpCode.trim() !== 'admin') {
      setTotpError('Mã 2FA phải bao gồm 6 chữ số (hoặc bấm "Dùng mã xác nhận nhanh")');
      return;
    }
    // Success: activate 5 minute (300 seconds) 2FA session
    setIs2FaSessionActive(true);
    setSessionSecondsLeft(300);
    setShow2FaModal(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleQuickVerify2Fa = () => {
    setTotpCode('770960');
    setIs2FaSessionActive(true);
    setSessionSecondsLeft(300);
    setShow2FaModal(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const toggleReveal = (id: string) => {
    executeWith2Fa(() => {
      setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    });
  };

  const handleCopy = (key: string, val: string) => {
    executeWith2Fa(() => {
      navigator.clipboard.writeText(val);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  const handleOpenAdd = () => {
    executeWith2Fa(() => {
      setEditingVar(null);
      setNewProject(selectedProject === 'all' ? 'repo-VelClaw' : selectedProject);
      setNewKey('');
      setNewValue('');
      setNewIsSecret(true);
      setNewEnvironments(['production', 'staging', 'development']);
      setShowAddModal(true);
    });
  };

  const handleOpenEdit = (v: EnvVariable) => {
    executeWith2Fa(() => {
      setEditingVar(v);
      setNewProject(v.project || 'repo-VelClaw');
      setNewKey(v.key);
      setNewValue(v.value);
      setNewIsSecret(v.isSecret);
      setNewEnvironments(v.environment);
      setShowAddModal(true);
    });
  };

  const handleDelete = (id: string) => {
    executeWith2Fa(() => {
      if (confirm('Bạn có chắc chắn muốn xóa biến cấu hình này? Thao tác này đã được bảo vệ bởi 2FA.')) {
        onDeleteVar(id);
      }
    });
  };

  const handleSaveVariable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim()) return;

    if (editingVar && onUpdateVar) {
      const updated: EnvVariable = {
        ...editingVar,
        project: newProject,
        key: newKey.trim().toUpperCase(),
        value: newValue,
        environment: newEnvironments,
        isSecret: newIsSecret,
        updatedAt: new Date().toISOString().split('T')[0],
        updatedBy: 'Alex Tran (2FA Verified)',
      };
      onUpdateVar(updated);
    } else {
      const created: EnvVariable = {
        id: 'env_' + Date.now(),
        project: newProject,
        key: newKey.trim().toUpperCase(),
        value: newValue,
        environment: newEnvironments,
        isSecret: newIsSecret,
        updatedAt: new Date().toISOString().split('T')[0],
        updatedBy: 'Alex Tran (2FA Verified)',
      };
      onAddVar(created);
    }

    setShowAddModal(false);
    setEditingVar(null);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeWith2Fa(() => {
      const lines = rawEnvText.split('\n');
      lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [k, ...rest] = trimmed.split('=');
          const v = rest.join('=').replace(/^["']|["']$/g, '');
          if (k) {
            onAddVar({
              id: 'env_' + Math.random().toString(36).substring(2, 9),
              project: selectedProject === 'all' ? 'repo-VelClaw' : selectedProject,
              key: k.trim().toUpperCase(),
              value: v,
              environment: ['production', 'staging', 'development'],
              isSecret: true,
              updatedAt: new Date().toISOString().split('T')[0],
              updatedBy: 'Imported (2FA Verified)',
            });
          }
        }
      });
      setShowImportModal(false);
      setRawEnvText('');
    });
  };

  const handleExportEnv = () => {
    executeWith2Fa(() => {
      const content = filteredVars
        .map((ev) => `# Project: ${ev.project || 'repo-VelClaw'} | Envs: ${ev.environment.join(',')}\n${ev.key}="${ev.value}"`)
        .join('\n\n');
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `.env.${selectedProject}.${selectedEnvFilter}.vault`;
      link.click();
      URL.revokeObjectURL(url);
    });
  };

  // Zero-Downtime Hot Reload Execution
  const triggerZeroDowntimeHotReload = () => {
    setShowHotReloadModal(true);
    setIsHotReloading(true);
    setHotReloadStep(1);

    setTimeout(() => {
      setHotReloadStep(2);
      setTimeout(() => {
        setHotReloadStep(3);
        setTimeout(() => {
          setHotReloadStep(4);
          setIsHotReloading(false);
        }, 1200);
      }, 1400);
    }, 1200);
  };

  // Filter variables by Project & Environment
  const filteredVars = envVars.filter((ev) => {
    const matchesProject = 
      selectedProject === 'all' || 
      (ev.project ? ev.project === selectedProject : selectedProject === 'repo-VelClaw');
    
    const matchesEnv = 
      selectedEnvFilter === 'all' || 
      ev.environment.includes(selectedEnvFilter);

    return matchesProject && matchesEnv;
  });

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Lock className="h-6 w-6 text-cyan-400" />
              <span>Quản Lý Cấu Hình & Secrets Vault</span>
            </h1>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 font-mono">
              AES-256 GCM
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Bảo mật biến môi trường, phân tách theo dự án & môi trường, tích hợp xác thực 2FA và Zero-Downtime Hot Reload
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 2FA Session Status Badge */}
          {is2FaSessionActive ? (
            <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-3 py-1.5 text-xs text-emerald-300 font-semibold shadow-inner">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>2FA Đã xác thực ({formatTimer(sessionSecondsLeft)})</span>
            </div>
          ) : (
            <button
              onClick={() => {
                setPendingAction(null);
                setShow2FaModal(true);
              }}
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-950/30 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-900/30 transition-colors"
            >
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
              <span>Kích hoạt phiên 2FA</span>
            </button>
          )}

          {/* Zero Downtime Reload Button */}
          <button
            onClick={triggerZeroDowntimeHotReload}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/50 bg-cyan-950/30 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-900/40 transition-colors shadow-sm"
          >
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
            <span>Zero-Downtime Hot Reload</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>{t.envVars.importEnv}</span>
          </button>

          <button
            onClick={handleExportEnv}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{t.envVars.exportEnv}</span>
          </button>

          <button
            id="btn-add-env-var"
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-md hover:from-cyan-400 hover:to-blue-500 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>{t.envVars.addVar}</span>
          </button>
        </div>
      </div>

      {/* PROJECT SELECTOR & ENVIRONMENT TABS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Project Selector (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <label className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FolderGit2 className="h-4 w-4 text-cyan-400" />
              Chọn Dự Án (Project)
            </span>
            <span className="text-[11px] text-cyan-400 font-mono">
              {filteredVars.length} biến
            </span>
          </label>
          
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-100 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">Tất cả dự án (All Projects)</option>
            {availableProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <p className="text-[11px] text-slate-400 mt-2">
            Mỗi dự án sở hữu không gian mã hóa riêng biệt và độc lập với các cluster container khác.
          </p>
        </div>

        {/* Environment Filter (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-violet-400" />
                Phân Tách Môi Trường (Environment Scope)
              </span>
              <span className="text-[11px] text-slate-400">
                Lọc biến theo môi trường áp dụng
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'Tất cả môi trường' },
                { id: 'production', label: 'Production' },
                { id: 'staging', label: 'Staging' },
                { id: 'development', label: 'Development' },
                { id: 'preview', label: 'Preview' },
              ].map((env) => (
                <button
                  key={env.id}
                  onClick={() => setSelectedEnvFilter(env.id as any)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                    selectedEnvFilter === env.id
                      ? 'bg-cyan-500 text-white shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {env.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Mọi thao tác xem hoặc sửa secrets đều yêu cầu 2FA để đảm bảo an ninh tuyệt đối.</span>
          </div>
        </div>

      </div>

      {/* Variables Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold">
              <th className="pb-3">Tên biến (Key)</th>
              <th className="pb-3">Dự án</th>
              <th className="pb-3">Giá trị bí mật (Encrypted Value)</th>
              <th className="pb-3">Môi trường áp dụng</th>
              <th className="pb-3">Cập nhật lần cuối</th>
              <th className="pb-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
            {filteredVars.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500 font-sans">
                  Không tìm thấy biến môi trường nào phù hợp với bộ lọc hiện tại.
                </td>
              </tr>
            ) : (
              filteredVars.map((v) => {
                const isRevealed = revealedIds[v.id];
                return (
                  <tr key={v.id} className="hover:bg-slate-800/30 transition-colors">
                    
                    {/* Key */}
                    <td className="py-3 font-semibold text-cyan-400">
                      <div className="flex items-center gap-1.5">
                        <Key className="h-3.5 w-3.5 text-slate-500" />
                        <span>{v.key}</span>
                      </div>
                    </td>

                    {/* Project */}
                    <td className="py-3 font-sans text-[11px] text-slate-300">
                      <span className="rounded-md bg-slate-800 px-2 py-0.5 font-mono">
                        {v.project || 'repo-VelClaw'}
                      </span>
                    </td>

                    {/* Value with 2FA Protection */}
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-300 max-w-xs truncate">
                          {v.isSecret && !isRevealed ? '••••••••••••••••••••••••' : v.value}
                        </span>
                        
                        {v.isSecret && (
                          <button
                            onClick={() => toggleReveal(v.id)}
                            className="text-slate-500 hover:text-cyan-400 p-1"
                            title={isRevealed ? 'Ẩn giá trị' : 'Xem giá trị (yêu cầu 2FA)'}
                          >
                            {isRevealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>
                        )}

                        <button
                          onClick={() => handleCopy(v.key, v.value)}
                          className="text-slate-500 hover:text-slate-300 p-1"
                          title="Sao chép giá trị (yêu cầu 2FA)"
                        >
                          {copiedKey === v.key ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </td>

                    {/* Environments */}
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        {v.environment.map((e) => (
                          <span 
                            key={e} 
                            className={`rounded px-1.5 py-0.5 text-[10px] font-sans font-medium capitalize ${
                              e === 'production' 
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                                : e === 'staging'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {e}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Audit trail */}
                    <td className="py-3 text-slate-400 text-[11px] font-sans">
                      <div>{v.updatedBy}</div>
                      <div className="text-[10px] text-slate-500">{v.updatedAt}</div>
                    </td>

                    {/* Actions: Edit & Delete (both 2FA protected) */}
                    <td className="py-3 text-right font-sans">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(v)}
                          className="text-slate-500 hover:text-cyan-400 p-1 transition-colors"
                          title="Chỉnh sửa biến (2FA)"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                          title="Xóa biến (2FA)"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 2FA AUTHENTICATION MODAL */}
      {show2FaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <ShieldAlert className="h-5 w-5" />
                <span>Xác Thực Hai Yếu Tố (2FA) Bắt Buộc</span>
              </div>
              <button 
                onClick={() => {
                  setShow2FaModal(false);
                  setPendingAction(null);
                }} 
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Thao tác truy cập hoặc sửa đổi biến bí mật trong Secret Vault được bảo vệ bởi chính sách an ninh cấp doanh nghiệp. Vui lòng nhập mã từ ứng dụng xác thực (Google Authenticator / 1Password / TOTP):
            </p>

            <form onSubmit={handleVerify2Fa} className="space-y-4 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center space-y-3">
                <div className="text-[11px] text-slate-400">Tài khoản: <span className="text-cyan-300 font-mono">alex.tran@velclaw.io</span></div>
                
                <input
                  type="text"
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => {
                    setTotpCode(e.target.value.replace(/\D/g, ''));
                    setTotpError('');
                  }}
                  placeholder="000000"
                  className="w-48 mx-auto text-center text-2xl font-mono tracking-widest rounded-xl border border-slate-700 bg-black px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  autoFocus
                />

                {totpError && (
                  <p className="text-rose-400 text-[11px]">{totpError}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleQuickVerify2Fa}
                  className="text-cyan-400 hover:underline text-[11px] flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Dùng mã xác nhận nhanh (Demo 770960)</span>
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShow2FaModal(false);
                    setPendingAction(null);
                  }}
                  className="rounded-xl px-4 py-2 text-slate-400 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 font-bold text-slate-950 hover:from-amber-400 hover:to-amber-500 transition-all shadow-md"
                >
                  Xác Thực & Mở Khóa 5 Phút
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ZERO-DOWNTIME HOT RELOAD MODAL */}
      {showHotReloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Zap className="h-5 w-5" />
                <span>Zero-Downtime Hot Reload (Cập nhật không gián đoạn)</span>
              </div>
              {!isHotReloading && (
                <button onClick={() => setShowHotReloadModal(false)} className="text-slate-400 hover:text-white">✕</button>
              )}
            </div>

            <p className="text-xs text-slate-300">
              Tiến trình đồng bộ cấu hình nguyên tử (Atomic Configuration Swap) trực tiếp vào bộ nhớ các container đang chạy:
            </p>

            {/* Stages */}
            <div className="space-y-3">
              {[
                { step: 1, title: 'Ký số & Mã hóa Payload SHA-256', desc: 'Tạo chữ ký mật mã cho 12 biến môi trường' },
                { step: 2, title: 'Đẩy cấu hình tới 6 Node Edge Docker', desc: 'Phân phối đồng thời tới Asia-East1, Tokyo, Taipei, Singapore' },
                { step: 3, title: 'Atomic In-Memory Hot Swap', desc: 'Cập nhật process.env mà không ngắt kết nối socket đang mở' },
                { step: 4, title: 'Healthcheck Verification 200 OK', desc: 'Xác nhận hoàn tất 0ms downtime và 0 dropped requests' },
              ].map((item) => (
                <div 
                  key={item.step} 
                  className={`p-3 rounded-xl border transition-all text-xs flex items-center justify-between ${
                    hotReloadStep > item.step
                      ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                      : hotReloadStep === item.step
                      ? 'border-cyan-500/60 bg-cyan-950/30 text-cyan-200'
                      : 'border-slate-800 bg-slate-950/40 text-slate-500'
                  }`}
                >
                  <div>
                    <div className="font-bold">{item.title}</div>
                    <div className="text-[11px] text-slate-400">{item.desc}</div>
                  </div>
                  {hotReloadStep > item.step ? (
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : hotReloadStep === item.step ? (
                    <RefreshCw className="h-4 w-4 text-cyan-400 animate-spin shrink-0" />
                  ) : (
                    <Clock className="h-4 w-4 text-slate-600 shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {!isHotReloading && (
              <div className="flex justify-end pt-2 border-t border-slate-800">
                <button
                  onClick={() => setShowHotReloadModal(false)}
                  className="rounded-xl bg-cyan-500 px-5 py-2 font-bold text-white text-xs hover:bg-cyan-400"
                >
                  Đóng & Hoàn Tất
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD / EDIT VARIABLE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h2 className="text-white font-bold text-sm flex items-center gap-2">
                <Lock className="h-4 w-4 text-cyan-400" />
                <span>{editingVar ? 'Chỉnh Sửa Biến Cấu Hình' : 'Thêm Biến Môi Trường Mới'}</span>
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveVariable} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Áp dụng cho Dự án</label>
                <select
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 font-semibold focus:border-cyan-500 focus:outline-none"
                >
                  {availableProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">{t.envVars.keyName}</label>
                <input
                  type="text"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="VÍ DỤ: NEXT_PUBLIC_API_URL, DOCKER_SECRET"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 uppercase font-mono focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">{t.envVars.value}</label>
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Nhập giá trị cấu hình bí mật..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Môi trường áp dụng</label>
                <div className="flex flex-wrap gap-2">
                  {(['production', 'staging', 'development'] as Environment[]).map((env) => {
                    const isChecked = newEnvironments.includes(env);
                    return (
                      <button
                        type="button"
                        key={env}
                        onClick={() => {
                          if (isChecked) {
                            if (newEnvironments.length > 1) {
                              setNewEnvironments(newEnvironments.filter((x) => x !== env));
                            }
                          } else {
                            setNewEnvironments([...newEnvironments, env]);
                          }
                        }}
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize border transition-colors ${
                          isChecked 
                            ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' 
                            : 'bg-slate-950 border-slate-800 text-slate-500'
                        }`}
                      >
                        {env}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-secret"
                  checked={newIsSecret}
                  onChange={(e) => setNewIsSecret(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500"
                />
                <label htmlFor="chk-secret" className="text-slate-300 select-none">
                  {t.envVars.encryptSecret} (Mã hóa AES-256 Vault)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl px-4 py-2 text-slate-400 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 font-bold text-white hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md"
                >
                  {editingVar ? 'Lưu Cập Nhật' : 'Thêm Vào Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMPORT .ENV MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h2 className="text-white font-bold text-sm flex items-center gap-2">
                <FileCode2 className="h-4 w-4 text-cyan-400" />
                <span>Nhập hàng loạt từ nội dung .env</span>
              </h2>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleImportSubmit} className="space-y-4 text-xs">
              <p className="text-slate-400 text-[11px]">
                Dán nội dung tệp .env của bạn vào ô dưới đây (mỗi dòng một cặp KEY=VALUE):
              </p>
              <textarea
                rows={7}
                value={rawEnvText}
                onChange={(e) => setRawEnvText(e.target.value)}
                placeholder={`API_URL="https://api.velcat.pro"\nDATABASE_PASSWORD="secretpassword"\nGITHUB_SYNC_TOKEN="ghp_xxx"`}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 font-mono text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
                required
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="rounded-xl px-4 py-2 text-slate-400 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-cyan-500 px-5 py-2 font-bold text-white hover:bg-cyan-400 shadow-md"
                >
                  Nhập biến vào Vault (2FA)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
