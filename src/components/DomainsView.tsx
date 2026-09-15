import React, { useState } from 'react';
import { 
  Globe, 
  ShieldCheck, 
  Plus, 
  CheckCircle2, 
  ExternalLink, 
  Trash2, 
  RefreshCw, 
  Copy, 
  Check,
  Server
} from 'lucide-react';
import { DomainRecord, Language } from '../types';
import { translations } from '../i18n';

interface DomainsViewProps {
  domains: DomainRecord[];
  onAddDomain: (name: string, type: 'Production' | 'Staging') => void;
  onDeleteDomain: (id: string) => void;
  lang: Language;
}

export const DomainsView: React.FC<DomainsViewProps> = ({
  domains,
  onAddDomain,
  onDeleteDomain,
  lang,
}) => {
  const t = translations[lang];
  const [showAddModal, setShowAddModal] = useState(false);
  const [domainName, setDomainName] = useState('');
  const [domainType, setDomainType] = useState<'Production' | 'Staging'>('Production');
  const [copiedTarget, setCopiedTarget] = useState<string | null>(null);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainName.trim()) return;
    onAddDomain(domainName.trim().toLowerCase(), domainType);
    setShowAddModal(false);
    setDomainName('');
  };

  const handleCopy = (target: string) => {
    navigator.clipboard.writeText(target);
    setCopiedTarget(target);
    setTimeout(() => setCopiedTarget(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Globe className="h-6 w-6 text-cyan-400" />
            <span>Tên Miền Riêng & Chứng Chỉ SSL (Custom Domains)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gán tên miền tùy chỉnh, tự động cấp phát SSL Let's Encrypt miễn phí và định tuyến toàn cầu qua 320 Edge PoPs.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:from-cyan-400 hover:to-blue-500 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm tên miền mới</span>
        </button>
      </div>

      {/* Domain Cards */}
      <div className="space-y-4">
        {domains.map((dom) => (
          <div
            key={dom.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3 hover:border-slate-700 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white">{dom.name}</span>
                    <a
                      href={`https://${dom.name}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-medium">
                      {dom.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-400 mt-0.5">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>SSL: {dom.sslStatus}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 text-xs font-bold">
                  {dom.status}
                </span>
                <button
                  onClick={() => onDeleteDomain(dom.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                  title="Xóa tên miền"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* DNS Records instruction */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs space-y-2">
              <div className="text-slate-400 text-[11px] font-medium">
                Cấu hình bản ghi DNS tại nhà cung cấp tên miền của bạn:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                <div className="rounded-lg bg-slate-900 px-3 py-1.5 text-slate-300">
                  Type: <strong className="text-cyan-400">{dom.dnsType}</strong>
                </div>
                <div className="rounded-lg bg-slate-900 px-3 py-1.5 text-slate-300 truncate">
                  Name: <strong className="text-white">@ hoặc sub</strong>
                </div>
                <div className="rounded-lg bg-slate-900 px-3 py-1.5 text-slate-300 flex items-center justify-between">
                  <span className="truncate">Target: <strong className="text-cyan-400">{dom.dnsTarget}</strong></span>
                  <button onClick={() => handleCopy(dom.dnsTarget)} className="text-slate-400 hover:text-white ml-1">
                    {copiedTarget === dom.dnsTarget ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL ADD DOMAIN */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h2 className="text-white font-bold text-sm flex items-center gap-2">
                <Globe className="h-4 w-4 text-cyan-400" />
                <span>Thêm Tên Miền Mới</span>
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Tên miền (Domain name)</label>
                <input
                  type="text"
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                  placeholder="vidu: myapp.com hoặc api.myapp.dev"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Môi trường định tuyến</label>
                <select
                  value={domainType}
                  onChange={(e) => setDomainType(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Production">Production (Nhánh main)</option>
                  <option value="Staging">Staging (Nhánh staging / preview)</option>
                </select>
              </div>

              <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-[11px] text-cyan-300">
                🔒 Chứng chỉ bảo mật SSL (Let's Encrypt) sẽ tự động được cấp phát trong vòng 60 giây sau khi bản ghi DNS trỏ thành công.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-cyan-500 px-4 py-1.5 font-bold text-white hover:bg-cyan-400"
                >
                  Thêm tên miền
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
