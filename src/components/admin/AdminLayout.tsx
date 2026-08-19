import React, { useState } from 'react';
import { AdminSidebar, AdminTab } from './AdminSidebar';
import { AdminDashboard } from './AdminDashboard';
import { CustomerManagement } from './CustomerManagement';
import { CustomerDetailView } from './CustomerDetailView';
import { LoanManagement } from './LoanManagement';
import { LoanApplicationsView } from './LoanApplicationsView';
import { CollectionBoysManagement } from './CollectionBoysManagement';
import { CustomerAssignmentsView } from './CustomerAssignmentsView';
import { CollectionsManagement } from './CollectionsManagement';
import { DueOutstandingView } from './DueOutstandingView';
import { AdminReportsView } from './AdminReportsView';
import { ReceiptsView } from './ReceiptsView';
import { ActivityLogsView } from './ActivityLogsView';
import { AdminSettingsView } from './AdminSettingsView';

export const AdminLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  const handleViewCustomerDetail = (customerId: string) => {
    setSelectedCustomerId(customerId);
  };

  const handleBackToCustomers = () => {
    setSelectedCustomerId(null);
  };

  return (
    <div className="flex min-h-[calc(100vh-61px)] bg-slate-100">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={selectedCustomerId ? 'customers' : activeTab}
        setActiveTab={(tab) => {
          setSelectedCustomerId(null);
          setActiveTab(tab);
        }}
        onSelectTab={(tab) => {
          setSelectedCustomerId(null);
          setActiveTab(tab);
        }}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {selectedCustomerId ? (
          <CustomerDetailView
            customerId={selectedCustomerId}
            onBack={handleBackToCustomers}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <AdminDashboard
                onViewCustomerDetail={handleViewCustomerDetail}
                onSelectCustomer={handleViewCustomerDetail}
                onNavigate={(tab) => setActiveTab(tab)}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}
            {activeTab === 'customers' && (
              <CustomerManagement onViewCustomerDetail={handleViewCustomerDetail} />
            )}
            {activeTab === 'loans' && (
              <LoanManagement onSelectCustomer={handleViewCustomerDetail} />
            )}
            {activeTab === 'applications' && <LoanApplicationsView />}
            {(activeTab === 'collection_boys' || (activeTab as string) === 'collection-boys') && (
              <CollectionBoysManagement />
            )}
            {activeTab === 'assignments' && <CustomerAssignmentsView />}
            {activeTab === 'collections' && <CollectionsManagement />}
            {(activeTab === 'due_outstanding' || (activeTab as string) === 'due-outstanding') && (
              <DueOutstandingView onSelectCustomer={handleViewCustomerDetail} />
            )}
            {activeTab === 'reports' && <AdminReportsView />}
            {activeTab === 'receipts' && <ReceiptsView />}
            {(activeTab === 'activity_logs' || (activeTab as string) === 'logs') && (
              <ActivityLogsView />
            )}
            {(activeTab === 'settings' || activeTab === 'profile') && <AdminSettingsView />}
          </>
        )}
      </main>
    </div>
  );
};
