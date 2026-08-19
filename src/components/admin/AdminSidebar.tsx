import React from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FileSpreadsheet,
  UserCheck,
  UserPlus,
  ArrowLeftRight,
  Wallet,
  AlertTriangle,
  BarChart3,
  Receipt,
  History,
  Settings,
  UserCircle,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type AdminTab =
  | 'dashboard'
  | 'customers'
  | 'loans'
  | 'applications'
  | 'collection_boys'
  | 'assignments'
  | 'collections'
  | 'due_outstanding'
  | 'reports'
  | 'receipts'
  | 'activity_logs'
  | 'settings'
  | 'profile';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab?: (tab: AdminTab) => void;
  onSelectTab?: (tab: AdminTab) => void;
  isOpenMobile?: boolean;
  setIsOpenMobile?: (open: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab: propSetActiveTab,
  onSelectTab: propOnSelectTab,
  isOpenMobile = false,
  setIsOpenMobile = (_open: boolean) => {},
}) => {
  const { currentUser, loanApplications } = useApp();

  const handleSelectTab = (tab: AdminTab) => {
    if (propSetActiveTab) propSetActiveTab(tab);
    if (propOnSelectTab) propOnSelectTab(tab);
    setIsOpenMobile(false);
  };

  const pendingAppsCount = loanApplications.filter((a) => a.status === 'Pending' || a.status === 'Under Review').length;

  const navItems = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers' as AdminTab, label: 'Customers', icon: Users },
    { id: 'loans' as AdminTab, label: 'Loans', icon: CreditCard },
    {
      id: 'applications' as AdminTab,
      label: 'Applications',
      icon: FileSpreadsheet,
      badge: pendingAppsCount > 0 ? pendingAppsCount : undefined,
    },
    { id: 'collection_boys' as AdminTab, label: 'Collection Boys', icon: UserCheck },
    { id: 'assignments' as AdminTab, label: 'Assignments', icon: ArrowLeftRight },
    { id: 'collections' as AdminTab, label: 'Collections', icon: Wallet },
    { id: 'due_outstanding' as AdminTab, label: 'Due / Outstanding', icon: AlertTriangle },
    { id: 'reports' as AdminTab, label: 'Reports', icon: BarChart3 },
    { id: 'receipts' as AdminTab, label: 'Receipts', icon: Receipt },
    { id: 'activity_logs' as AdminTab, label: 'Activity Logs', icon: History },
    { id: 'settings' as AdminTab, label: 'Settings', icon: Settings },
    { id: 'profile' as AdminTab, label: 'Profile', icon: UserCircle },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-30 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand User Box */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
            ₹
          </div>
          <div className="overflow-hidden">
            <h2 className="font-bold text-sm text-white truncate">LCMS Admin</h2>
            <p className="text-xs text-blue-400 font-medium">Head Office Control</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`admin-nav-${item.id}`}
                type="button"
                onClick={() => {
                  handleSelectTab(item.id);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Footer info */}
        <div className="p-3 border-t border-slate-800 text-xs">
          <div className="flex items-center justify-between bg-slate-800/60 p-2.5 rounded-xl">
            <div className="flex items-center gap-2">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate max-w-[100px]">{currentUser.name}</p>
                <p className="text-[10px] text-emerald-400">Online • Super Admin</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
