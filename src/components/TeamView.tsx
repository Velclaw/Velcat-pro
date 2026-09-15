import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Key, 
  CheckCircle2, 
  Trash2, 
  Lock,
  Mail,
  Sliders
} from 'lucide-react';
import { TeamMember, Language } from '../types';
import { translations } from '../i18n';

interface TeamViewProps {
  teamMembers: TeamMember[];
  onAddMember: (member: TeamMember) => void;
  onUpdateRole: (id: string, newRole: TeamMember['role']) => void;
  lang: Language;
}

export const TeamView: React.FC<TeamViewProps> = ({
  teamMembers,
  onAddMember,
  onUpdateRole,
  lang,
}) => {
  const t = translations[lang];
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<TeamMember['role']>('Fullstack Dev');

  const permissionsMatrix = [
    { permission: 'Triển khai lên nhánh Production', admin: true, devops: true, dev: false, viewer: false },
    { permission: 'Xem & Sửa biến môi trường Vault', admin: true, devops: true, dev: false, viewer: false },
    { permission: 'Kích hoạt Rollback về bản trước', admin: true, devops: true, dev: true, viewer: false },
    { permission: 'Quản lý thành viên & Cấp quyền 2FA', admin: true, devops: false, dev: false, viewer: false },
    { permission: 'Xem Build Logs & Báo cáo Analytics', admin: true, devops: true, dev: true, viewer: true },
    { permission: 'Khôi phục Snapshot từ Google Drive / Dropbox', admin: true, devops: true, dev: false, viewer: false },
  ];

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const newMem: TeamMember = {
      id: 'mem_' + Date.now(),
      name: name || email.split('@')[0],
      email: email.trim(),
      role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      active2FA: true,
      lastActive: 'Vừa mời',
      assignedTasksCount: 0,
    };

    onAddMember(newMem);
    setShowInviteModal(false);
    setName('');
    setEmail('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-cyan-400" />
            <span>Đội Ngũ & Phân Quyền Quản Trị (RBAC)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Phân quyền theo nhóm cụ thể (Admin, Lead DevOps, Developer, Viewer) và kiểm soát truy cập dự án repo-VelClaw.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:from-cyan-400 hover:to-blue-500 transition-all"
        >
          <UserPlus className="h-4 w-4" />
          <span>Mời thành viên mới</span>
        </button>
      </div>

      {/* Members Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Danh sách Thành viên ({teamMembers.length})</h2>
          <span className="text-xs text-emerald-400 font-semibold">Tất cả thành viên đều bắt buộc bật 2FA</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium">
                <th className="pb-3">Thành viên</th>
                <th className="pb-3">Email liên hệ</th>
                <th className="pb-3">Vai trò (Role)</th>
                <th className="pb-3">Xác thực 2FA</th>
                <th className="pb-3">Hoạt động gần nhất</th>
                <th className="pb-3 text-right">Quyền hạn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {teamMembers.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/30">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <img src={m.avatar} alt={m.name} className="h-8 w-8 rounded-full object-cover border border-slate-700" />
                      <div>
                        <div className="font-bold text-white">{m.name}</div>
                        <div className="text-[10px] text-slate-400">{m.assignedTasksCount} nhiệm vụ được giao</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 font-mono text-slate-300">{m.email}</td>
                  <td className="py-3">
                    <select
                      value={m.role}
                      onChange={(e) => onUpdateRole(m.id, e.target.value as any)}
                      className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-cyan-300 font-semibold focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="Admin">Admin (Toàn quyền)</option>
                      <option value="DevOps Lead">DevOps Lead</option>
                      <option value="Fullstack Dev">Fullstack Dev</option>
                      <option value="Viewer">Viewer (Chỉ xem)</option>
                    </select>
                  </td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      m.active2FA ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      <ShieldCheck className="h-3 w-3" />
                      {m.active2FA ? '2FA Active' : 'Chưa kích hoạt'}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">{m.lastActive}</td>
                  <td className="py-3 text-right">
                    <span className="text-slate-500 hover:text-slate-300 cursor-pointer text-[11px]">
                      Chi tiết quyền
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="h-4 w-4 text-cyan-400" />
            <span>Ma Trận Quyền Hạn Chi Tiết (Role Permission Matrix)</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">RBAC Standard</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium">
                <th className="pb-2.5">Quyền hạn thao tác</th>
                <th className="pb-2.5 text-center">Admin</th>
                <th className="pb-2.5 text-center">DevOps Lead</th>
                <th className="pb-2.5 text-center">Fullstack Dev</th>
                <th className="pb-2.5 text-center">Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {permissionsMatrix.map((p, i) => (
                <tr key={i} className="hover:bg-slate-800/30">
                  <td className="py-2.5 font-medium text-slate-300">{p.permission}</td>
                  <td className="py-2.5 text-center">{p.admin ? <CheckCircle2 className="h-4 w-4 text-emerald-400 inline" /> : '—'}</td>
                  <td className="py-2.5 text-center">{p.devops ? <CheckCircle2 className="h-4 w-4 text-emerald-400 inline" /> : '—'}</td>
                  <td className="py-2.5 text-center">{p.dev ? <CheckCircle2 className="h-4 w-4 text-emerald-400 inline" /> : '—'}</td>
                  <td className="py-2.5 text-center">{p.viewer ? <CheckCircle2 className="h-4 w-4 text-emerald-400 inline" /> : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: INVITE MEMBER */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h2 className="text-white font-bold text-sm flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-cyan-400" />
                <span>Mời Thành Viên Vào Nhóm Dự Án</span>
              </h2>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Họ và tên</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Nguyen Van A"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Email doanh nghiệp</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@velclaw.io"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Vai trò trong dự án</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Admin">Admin (Quản trị viên tối cao)</option>
                  <option value="DevOps Lead">DevOps Lead (Deploy, Config, Docker)</option>
                  <option value="Fullstack Dev">Fullstack Dev (Push code, Preview)</option>
                  <option value="Viewer">Viewer (Chỉ xem số liệu)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="rounded-lg px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-cyan-500 px-4 py-1.5 font-bold text-white hover:bg-cyan-400"
                >
                  Gửi lời mời
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
