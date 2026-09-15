import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  TrendingUp, 
  Users, 
  Clock, 
  ShieldCheck, 
  Terminal, 
  Lightbulb, 
  ArrowRight,
  RefreshCw,
  Zap,
  Sliders
} from 'lucide-react';
import { TeamMember, ProjectTask, Language } from '../types';
import { translations } from '../i18n';

interface AIAgentViewProps {
  teamMembers: TeamMember[];
  tasks: ProjectTask[];
  onUpdateTasks: (updatedTasks: ProjectTask[]) => void;
  lang: Language;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

export const AIAgentView: React.FC<AIAgentViewProps> = ({
  teamMembers,
  tasks,
  onUpdateTasks,
  lang,
}) => {
  const t = translations[lang];
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'allocation' | 'forecast'>('chat');

  // Chatbot State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'agent',
      text: 'Xin chào! Tôi là VelCat AI - Trợ lý DevOps & Điều hành triển khai tự động thế hệ mới. Tôi đang giám sát repo https://github.com/velclaw/repo-VelClaw và cụm Docker Cloud. Bạn cần hỗ trợ gì hôm nay?',
      timestamp: 'Vừa xong',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);

  // Task Allocation State
  const [loadingAllocation, setLoadingAllocation] = useState(false);
  const [allocatedRecommendations, setAllocatedRecommendations] = useState<any[] | null>(null);

  // Forecasting State
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [forecastResult, setForecastResult] = useState<{
    predictedCompletionDate: string;
    confidencePercent: number;
    riskLevel: string;
    factors: string[];
    marketTrendInsight: string;
    actionableAdvice: string;
  } | null>(null);

  // Quick Prompt Chips
  const promptChips = [
    'Cách tối ưu Dockerfile multi-stage cho repo-VelClaw?',
    'Kiểm tra tình trạng bảo mật 2FA và chuẩn ISO-27001',
    'Dự báo thời hạn hoàn thành sprint hiện tại',
    'Gợi ý cấu hình biến môi trường production an toàn',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || loadingChat) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoadingChat(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversationHistory: messages,
          context: {
            repo: 'https://github.com/velclaw/repo-VelClaw',
            activeBranch: 'main',
            teamSize: teamMembers.length,
            tasksCount: tasks.length,
          },
        }),
      });
      const data = await res.json();
      const agentReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: data.reply || 'Đã xử lý thông tin yêu cầu của bạn.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, agentReply]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          text: 'Hệ thống đã nhận thông tin. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleRunTaskAllocation = async () => {
    setLoadingAllocation(true);
    try {
      const res = await fetch('/api/ai/allocate-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamMembers, tasks }),
      });
      const data = await res.json();
      setAllocatedRecommendations(data.recommendations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAllocation(false);
    }
  };

  const handleApplyAllocation = () => {
    if (!allocatedRecommendations) return;
    const updated = tasks.map((task) => {
      const match = allocatedRecommendations.find((r) => r.taskId === task.id);
      if (match) {
        return {
          ...task,
          assignedTo: match.assignedTo,
          confidenceScore: match.confidence,
          aiReason: match.reason,
        };
      }
      return task;
    });
    onUpdateTasks(updated);
    alert('Đã áp dụng tự động phân bổ nhiệm vụ của AI cho toàn bộ đội ngũ thành công!');
  };

  const handleRunForecast = async () => {
    setLoadingForecast(true);
    try {
      const res = await fetch('/api/ai/forecast-deadlines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectData: {
            repo: 'https://github.com/velclaw/repo-VelClaw',
            activeTasks: tasks.filter((t) => t.status !== 'Done'),
            teamMembersCount: teamMembers.length,
          },
        }),
      });
      const data = await res.json();
      setForecastResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingForecast(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Sub-tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Bot className="h-6 w-6 text-cyan-400" />
            <span>{t.aiAgent.title}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.aiAgent.subtitle}
          </p>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 p-1 text-xs">
          <button
            id="ai-tab-chat"
            onClick={() => setActiveSubTab('chat')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
              activeSubTab === 'chat'
                ? 'bg-cyan-500 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="h-3.5 w-3.5" />
            <span>{t.aiAgent.chatTab}</span>
          </button>

          <button
            id="ai-tab-allocation"
            onClick={() => setActiveSubTab('allocation')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
              activeSubTab === 'allocation'
                ? 'bg-cyan-500 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>{t.aiAgent.allocationTab}</span>
          </button>

          <button
            id="ai-tab-forecast"
            onClick={() => setActiveSubTab('forecast')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
              activeSubTab === 'forecast'
                ? 'bg-cyan-500 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{t.aiAgent.forecastingTab}</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: 24/7 AI SUPPORT CHAT */}
      {activeSubTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Chat Box (8 cols) */}
          <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 flex flex-col justify-between h-[580px]">
            
            {/* Messages Scroll Area */}
            <div className="overflow-y-auto space-y-4 pr-2">
              {messages.map((m) => {
                const isAgent = m.sender === 'agent';
                return (
                  <div
                    key={m.id}
                    className={`flex items-start gap-3 ${isAgent ? 'justify-start' : 'justify-end'}`}
                  >
                    {isAgent && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-md">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] rounded-2xl p-4 text-xs leading-relaxed ${
                        isAgent
                          ? 'border border-slate-800 bg-slate-950/80 text-slate-200 shadow-sm'
                          : 'bg-cyan-600 text-white shadow-md'
                      }`}
                    >
                      <div className="whitespace-pre-line">{m.text}</div>
                      <div className={`mt-2 text-[10px] ${isAgent ? 'text-slate-500' : 'text-cyan-200'} text-right`}>
                        {m.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })}
              {loadingChat && (
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-600 text-white animate-pulse">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-400 flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
                    <span>VelCat AI đang phân tích dữ liệu từ repo-VelClaw...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input & Prompt Chips */}
            <div className="pt-3 border-t border-slate-800 space-y-2.5">
              {/* Quick Prompt Chips */}
              <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
                {promptChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip)}
                    className="rounded-full border border-slate-800 bg-slate-950 px-2.5 py-1 text-[11px] text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-colors whitespace-nowrap"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t.aiAgent.inputPlaceholder}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loadingChat || !inputText.trim()}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t.aiAgent.send}</span>
                </button>
              </form>
            </div>

          </div>

          {/* Right Column: AI Assistant Status & Server Context (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span>Mô Hình & Ngữ Cảnh AI</span>
              </div>
              
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Mô hình hoạt động:</span>
                  <span className="font-mono text-cyan-300 font-semibold">gemini-3.8-flash</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Máy chủ dự án:</span>
                  <a
                    href="https://github.com/velclaw/repo-VelClaw"
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline font-mono truncate max-w-[150px]"
                  >
                    repo-VelClaw
                  </a>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Thời gian phản hồi:</span>
                  <span className="text-emerald-400 font-semibold">180ms</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Trạng thái:</span>
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    24/7 Trực tuyến
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                <span>Tính Năng Trí Tuệ Nhân Tạo</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Tự động giải thích và sửa lỗi build log ngay tức thì.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Gợi ý lệnh cấu hình Dockerfile tối ưu kích thước image.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Khảo sát lỗ hổng bảo mật và đề xuất quy tắc CI/CD.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      )}

      {/* SUB-VIEW 2: AUTOMATED TASK ALLOCATION */}
      {activeSubTab === 'allocation' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 md:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-cyan-400" />
                <span>Tự Động Hóa Phân Bổ Nhiệm Vụ Cho Đội Ngũ (AI Task Allocation)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Thuật toán Gemini phân tích chuyên môn (DevOps, Security, Backend, Docker) và tải công việc để gán đầu việc tối ưu nhất.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-run-ai-allocation"
                onClick={handleRunTaskAllocation}
                disabled={loadingAllocation}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50"
              >
                <Sparkles className={`h-4 w-4 ${loadingAllocation ? 'animate-spin' : ''}`} />
                <span>{loadingAllocation ? 'Đang tính toán...' : t.aiAgent.autoAllocateBtn}</span>
              </button>

              {allocatedRecommendations && (
                <button
                  onClick={handleApplyAllocation}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-all"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Áp dụng vào Dự án</span>
                </button>
              )}
            </div>
          </div>

          {/* Tasks Table with AI Allocations */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-medium">
                  <th className="pb-3">Mã & Tiêu đề nhiệm vụ</th>
                  <th className="pb-3">Phân loại</th>
                  <th className="pb-3">Độ ưu tiên</th>
                  <th className="pb-3">Người đang phụ trách</th>
                  <th className="pb-3">AI Gợi ý phân bổ</th>
                  <th className="pb-3">Độ tin cậy</th>
                  <th className="pb-3">Lý do chuyên môn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-800/30">
                    <td className="py-3">
                      <div className="font-semibold text-white">{task.title}</div>
                      <div className="font-mono text-[10px] text-slate-500">{task.id}</div>
                    </td>
                    <td className="py-3">
                      <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] text-cyan-300 font-medium">
                        {task.category}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          task.priority === 'Urgent'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : task.priority === 'High'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3 text-slate-300 font-medium">
                      {task.assignedTo || 'Chưa gán'}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5 font-semibold text-cyan-300">
                        <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                        <span>{task.aiSuggestedAssignee || 'Alex Tran'}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-400 font-mono font-bold">
                        {task.confidenceScore || 94}%
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 max-w-xs text-[11px] leading-relaxed">
                      {task.aiReason || 'Phù hợp với kinh nghiệm hạ tầng Docker & Cloud.'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: DEADLINE & MARKET TREND FORECASTING */}
      {activeSubTab === 'forecast' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 md:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-cyan-400" />
                  <span>Dự Báo Thời Hạn Hoàn Thành & Xu Hướng Thị Trường</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Mô hình Gemini đánh giá lịch sử commit, tốc độ merge PR và lưu lượng người dùng của máy chủ repo-VelClaw.
                </p>
              </div>

              <button
                id="btn-run-ai-forecast"
                onClick={handleRunForecast}
                disabled={loadingForecast}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50"
              >
                <Sparkles className={`h-4 w-4 ${loadingForecast ? 'animate-spin' : ''}`} />
                <span>{loadingForecast ? 'Đang phân tích...' : t.aiAgent.forecastBtn}</span>
              </button>
            </div>

            {/* Forecast Outcome Box */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Dự kiến hoàn thành Sprint:</span>
                  <Calendar className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-extrabold text-white">
                  {forecastResult?.predictedCompletionDate || '28 Tháng 9, 2026'}
                </div>
                <div className="text-[11px] text-emerald-400 mt-1 font-semibold">
                  Sớm hơn 2 ngày so với kế hoạch ban đầu
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Độ tin cậy của thuật toán:</span>
                  <Zap className="h-4 w-4 text-amber-400" />
                </div>
                <div className="text-2xl font-extrabold text-cyan-400">
                  {forecastResult?.confidencePercent || 92}%
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Dựa trên 140 chu kỳ CI/CD gần nhất
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Mức độ rủi ro chậm trễ:</span>
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-extrabold text-emerald-400">
                  {forecastResult?.riskLevel || 'Thấp (Low)'}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Không có blocker kiến trúc container
                </div>
              </div>
            </div>

            {/* Factors & Market Trend Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-cyan-400" />
                  <span>Các yếu tố quyết định thời hạn (Factors)</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {(forecastResult?.factors || [
                    'Tốc độ xử lý PR trung bình của nhóm: 4.2 giờ / pull request',
                    'Tỷ lệ build thành công CI/CD của nhánh main: 98.4%',
                    'Hạ tầng Docker caching giảm 40% thời gian biên dịch',
                  ]).map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-4 space-y-3">
                <div className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-cyan-400" />
                  <span>Dự Báo Xu Hướng Thị Trường & Lưu Lượng</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {forecastResult?.marketTrendInsight ||
                    'Lưu lượng người dùng web app dự kiến tăng 35% trong quý tới sau khi kích hoạt tính năng Edge Caching toàn cầu và đồng bộ tự động từ repo-VelClaw.'}
                </p>
                <div className="rounded-lg bg-slate-900/80 p-2.5 text-[11px] text-cyan-200 border border-slate-800">
                  💡 Lời khuyên hành động: {forecastResult?.actionableAdvice || 'Nên cấu hình tự động mở rộng (Auto-scaling) thêm 2 replica pods vào giờ cao điểm.'}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
