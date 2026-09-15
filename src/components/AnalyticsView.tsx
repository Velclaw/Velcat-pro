import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Zap, 
  HardDrive, 
  Globe2, 
  FileDown, 
  CheckCircle2, 
  AlertCircle,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { AnalyticsDataPoint, Language } from '../types';
import { translations } from '../i18n';

interface AnalyticsViewProps {
  analytics: AnalyticsDataPoint[];
  onOpenReportModal: () => void;
  lang: Language;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  analytics,
  onOpenReportModal,
  lang,
}) => {
  const t = translations[lang];
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '24h'>('7d');

  const latest = analytics[analytics.length - 1];
  const maxVisitors = Math.max(...analytics.map((d) => d.visitors));

  const geoTraffic = [
    { country: 'Việt Nam', flag: '🇻🇳', share: 48, requests: '1.42M' },
    { country: 'Hoa Kỳ (USA)', flag: '🇺🇸', share: 24, requests: '710K' },
    { country: 'Nhật Bản (Japan)', flag: '🇯🇵', share: 14, requests: '414K' },
    { country: 'Singapore', flag: '🇸🇬', share: 10, requests: '296K' },
    { country: 'Khác', flag: '🌐', share: 4, requests: '118K' },
  ];

  const topRoutes = [
    { path: '/', hits: '1,280,490', avgLatency: '18ms', cacheHitRate: '98.2%' },
    { path: '/api/health', hits: '842,100', avgLatency: '4ms', cacheHitRate: 'N/A' },
    { path: '/dashboard', hits: '492,300', avgLatency: '24ms', cacheHitRate: '94.1%' },
    { path: '/api/ai/chat', hits: '194,500', avgLatency: '180ms', cacheHitRate: 'Dynamic' },
    { path: '/repo-velclaw/sync', hits: '92,100', avgLatency: '14ms', cacheHitRate: '99.5%' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header with Title & Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-cyan-400" />
            <span>{t.analytics.title}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi lưu lượng truy cập hàng ngày, độ trễ P95, băng thông và tỷ lệ phản hồi HTTP thời gian thực.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time range switcher */}
          <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900 p-1 text-xs">
            {(['24h', '7d', '30d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-cyan-500 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            id="analytics-export-pdf-btn"
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md hover:from-cyan-400 hover:to-blue-500 transition-all"
          >
            <FileDown className="h-4 w-4" />
            <span>{t.analytics.exportAuditReport}</span>
          </button>
        </div>
      </div>

      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
            <span>{t.analytics.dailyVisitors}</span>
            <Users className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {latest.visitors.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1">
            <TrendingUp className="h-3 w-3" />
            <span>+16.4% so với hôm qua</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
            <span>{t.analytics.p95Latency}</span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">
            {latest.latencyMs} ms
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Cực nhanh qua mạng 320 Edge PoPs
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
            <span>{t.analytics.bandwidth}</span>
            <HardDrive className="h-4 w-4 text-violet-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {latest.bandwidthGb} GB
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Tỷ lệ nén Brotli 74.2%
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
            <span>{t.analytics.uptime}</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            99.99%
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            0 sự cố downtime trong 90 ngày
          </div>
        </div>
      </div>

      {/* Traffic Trend Chart (SVG) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              <span>Biểu đồ Lưu Lượng Truy Cập Hàng Ngày</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Số lượt khách (Unique Visitors) & Số lượt xem trang (Pageviews)</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400"></span>
              <span className="text-slate-300">Lượt khách</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-500"></span>
              <span className="text-slate-400">Pageviews</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="grid grid-cols-7 gap-2 md:gap-4 items-end h-56 pt-6 px-2 border-b border-slate-800">
          {analytics.map((item, index) => {
            const heightPercent = Math.round((item.visitors / maxVisitors) * 100);
            return (
              <div key={index} className="flex flex-col items-center h-full justify-end group relative">
                
                {/* Tooltip on hover */}
                <div className="absolute -top-12 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
                  <div className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-[11px] text-white shadow-xl whitespace-nowrap">
                    <div className="font-bold text-cyan-300">{item.visitors.toLocaleString()} visitors</div>
                    <div className="text-slate-400">{item.pageviews.toLocaleString()} views • {item.latencyMs}ms</div>
                  </div>
                  <div className="w-2 h-2 bg-slate-950 border-r border-b border-slate-700 rotate-45 -mt-1"></div>
                </div>

                <div className="w-full flex items-end justify-center gap-1.5 h-full">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[28px] rounded-t-md bg-gradient-to-t from-cyan-600 to-cyan-400 group-hover:from-cyan-500 group-hover:to-cyan-300 transition-all shadow-lg shadow-cyan-500/10"
                  />
                </div>
                <span className="text-[11px] font-mono text-slate-400 mt-2">
                  {item.date}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two columns: Geo Distribution & Top Paths */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Geo Distribution (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-cyan-400" />
              <span>Phân Bổ Vùng Địa Lý (Geo)</span>
            </h2>
            <span className="text-xs text-slate-400">Toàn cầu</span>
          </div>

          <div className="space-y-3 text-xs">
            {geoTraffic.map((geo, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-200 font-medium">
                    <span>{geo.flag}</span>
                    <span>{geo.country}</span>
                  </div>
                  <div className="font-mono text-slate-400">
                    <span className="font-bold text-slate-200">{geo.share}%</span> ({geo.requests})
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${geo.share}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Request Routes (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-emerald-400" />
              <span>Đường Dẫn Truy Cập Phổ Biến (Top Endpoints)</span>
            </h2>
            <span className="text-xs text-slate-400">24 giờ qua</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2 font-medium">Route Path</th>
                  <th className="pb-2 font-medium">Lượt gọi (Hits)</th>
                  <th className="pb-2 font-medium">Avg Latency</th>
                  <th className="pb-2 font-medium">Edge Cache</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {topRoutes.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-800/30">
                    <td className="py-2.5 text-cyan-400 font-semibold">{r.path}</td>
                    <td className="py-2.5">{r.hits}</td>
                    <td className="py-2.5 text-emerald-400">{r.avgLatency}</td>
                    <td className="py-2.5 text-slate-400">{r.cacheHitRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
