import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopHeader } from './components/common/TopHeader';
import { ReceiptModal } from './components/common/ReceiptModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { CollectionBoyPanel } from './components/collection/CollectionBoyPanel';
import { CustomerPortal } from './components/customer/CustomerPortal';

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
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
