import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

const rootEl = document.getElementById('root');
if (rootEl) {
  try {
    const root = createRoot(rootEl);
    root.render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>,
    );
  } catch (err: any) {
    console.error('Failed to initialize React application:', err);
    rootEl.innerHTML = `
      <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #020617; color: #f87171; padding: 24px; font-family: sans-serif; text-align: center;">
        <h2 style="font-size: 18px; margin-bottom: 8px; color: #f43f5e;">Lỗi khởi tạo React</h2>
        <p style="font-size: 13px; color: #94a3b8; margin-bottom: 16px;">${err?.message || 'Không thể render ứng dụng'}</p>
        <button onclick="window.location.reload()" style="background: #0284c7; color: #fff; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: bold;">Tải lại trang</button>
      </div>
    `;
  }
}
