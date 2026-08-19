import React, { Component, ErrorInfo } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopHeader } from './components/common/TopHeader';
import { ReceiptModal } from './components/common/ReceiptModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { CollectionBoyPanel } from './components/collection/CollectionBoyPanel';
import { CustomerPortal } from './components/customer/CustomerPortal';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public props: ErrorBoundaryProps;
  public state: ErrorBoundaryState;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('LCMS Error Boundary caught:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-white">Something went wrong</h1>
            <p className="text-xs text-slate-400">
              An unexpected error occurred. You can reset cached local data to restore system defaults.
            </p>
            {this.state.error?.message && (
              <div className="bg-slate-950 p-3 rounded-lg text-left text-xs font-mono text-rose-400 break-words max-h-32 overflow-y-auto">
                {this.state.error.message}
              </div>
            )}
            <button
              type="button"
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition shadow-lg shadow-blue-600/30"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset & Reload App</span>
            </button>
          </div>
        </div>
      );
    }
    return (this.props as ErrorBoundaryProps).children;
  }
}

const MainApp: React.FC = () => {
  const { currentView, activeReceipt, closeReceiptModal } = useApp();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* Top Application Switcher & Header */}
      <TopHeader />

      {/* Dynamic View Rendering based on active portal */}
      <div className="flex-1">
        {currentView === 'admin' && <AdminLayout />}
        {(currentView === 'collection_boy' || (currentView as string) === 'collection-boy') && <CollectionBoyPanel />}
        {currentView === 'customer' && <CustomerPortal />}
      </div>

      {/* Global Printable Computerized Payment Receipt Modal */}
      {activeReceipt && (
        <ReceiptModal payment={activeReceipt} onClose={closeReceiptModal} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </ErrorBoundary>
  );
}
