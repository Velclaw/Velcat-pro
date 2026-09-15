import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Terminal, 
  Minimize2, 
  Maximize2,
  HelpCircle,
  Zap,
  CheckCircle2,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { Language } from '../types';

interface FloatingAiAssistantProps {
  lang: Language;
  onNavigateTab: (tab: any) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

export const FloatingAiAssistant: React.FC<FloatingAiAssistantProps> = ({
  lang,
  onNavigateTab,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init',
      sender: 'agent',
      text: 'Xin chào! Tôi là Trợ lý DevOps AI 24/7 của VelCat Pro. Tôi có thể hỗ trợ bạn giải đáp thắc mắc về Next.js, cấu hình Docker, phân tích build logs, quản lý biến môi trường 2FA hoặc dự báo thời hạn dự án. Bạn cần giúp gì?',
      timestamp: 'Vừa xong',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickChips = [
    'Cách tối ưu Dockerfile cho repo-VelClaw?',
    'Cấu hình 2FA cho biến môi trường thế nào?',
    'Giải thích quy trình CI/CD tự động',
    'Hướng dẫn kết nối domain riêng & SSL',
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const text = queryText || input;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: 'u_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages,
          context: {
            source: 'floating_widget_247',
            repo: 'https://github.com/velclaw/repo-VelClaw',
            activeBranch: 'main',
          },
        }),
      });
      const data = await res.json();
      const botMsg: Message = {
        id: 'a_' + Date.now(),
        sender: 'agent',
        text: data.reply || 'Hệ thống đã ghi nhận. Bạn có thể kiểm tra trực tiếp trong các tab quản trị.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: 'a_err_' + Date.now(),
          sender: 'agent',
          text: 'Hệ thống đang hoạt động ở chế độ ngoại tuyến an toàn. Hãy mở tab "AI DevOps Agent" để sử dụng công cụ phân bổ nhiệm vụ và dự báo deadline!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 p-3.5 text-white shadow-2xl hover:scale-105 transition-all group"
          title="Trợ lý AI DevOps 24/7"
        >
          <div className="relative">
            <Bot className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse"></span>
          </div>
          <span className="hidden sm:inline font-bold text-xs pr-1">VelCat AI 24/7</span>
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md rounded-2xl border border-slate-800 bg-slate-900/95 shadow-2xl backdrop-blur-xl flex flex-col h-[560px] animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-gradient-to-r from-violet-950/40 via-slate-900 to-cyan-950/40 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 text-white shadow-md">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-sm text-white">VelCat AI Support 24/7</h2>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.2 text-[9px] font-bold text-emerald-400">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Tích hợp Gemini 3.8 Flash & Repo Knowledge</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onNavigateTab('aiAgent');
                }}
                className="text-[11px] font-medium text-cyan-400 hover:underline px-2 py-1"
                title="Mở toàn màn hình"
              >
                Mở rộng
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'agent' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-600/30 text-violet-300">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl p-3 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium rounded-tr-none shadow-md'
                      : 'bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded-tl-none whitespace-pre-wrap'
                  }`}
                >
                  {m.text}
                  <div
                    className={`mt-1.5 text-[9px] ${
                      m.sender === 'user' ? 'text-cyan-100/70' : 'text-slate-500'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 items-center text-xs text-cyan-300 py-1 font-medium animate-pulse">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>AI đang suy nghĩ câu trả lời tối ưu...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompts */}
          <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="shrink-0 rounded-full border border-slate-800 bg-slate-900 px-2.5 py-1 text-[10px] text-slate-400 hover:border-cyan-500/50 hover:text-cyan-300 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-slate-800 bg-slate-950/80 rounded-b-2xl flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi về Docker, Next.js, CI/CD, 2FA..."
              className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow hover:opacity-90 disabled:opacity-30 transition-all shrink-0"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
