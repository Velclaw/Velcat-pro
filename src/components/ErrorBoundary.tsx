import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    try {
      localStorage.removeItem('velcat_dashboard_widgets');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-lg w-full rounded-2xl border border-rose-500/30 bg-slate-900/95 p-6 md:p-8 shadow-2xl backdrop-blur-md space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Khắc Phục Sự Cố Hiển Thị</h1>
                <p className="text-xs text-slate-400">Ứng dụng vừa phát hiện sự cố và đã tự động cách ly an toàn.</p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 text-xs font-mono text-rose-300 space-y-1 overflow-x-auto max-h-40">
              <div className="font-bold flex items-center gap-1.5 text-rose-400">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Chi tiết lỗi:</span>
              </div>
              <div className="text-[11px] text-slate-300">
                {this.state.error?.message || 'Lỗi không xác định'}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:opacity-95 transition-all"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Tải Lại Trang (Reload)</span>
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
              >
                <Home className="h-4 w-4 text-cyan-400" />
                <span>Quay Lại Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
