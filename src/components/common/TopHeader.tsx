import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Smartphone,
  Globe,
  RotateCcw,
  Bell,
  CheckCircle2,
  ChevronDown,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { UserRole } from '../../types';

interface TopHeaderProps {
  currentView?: 'admin' | 'collection_boy' | 'customer';
  setCurrentView?: (view: 'admin' | 'collection_boy' | 'customer') => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentView: propCurrentView,
  setCurrentView: propSetCurrentView,
}) => {
  const {
    currentView: contextCurrentView,
    setCurrentView: contextSetCurrentView,
    currentUser,
    users,
    switchUser,
    switchRole,
    resetToInitialData,
  } = useApp();

  const currentView = propCurrentView || contextCurrentView;
  const setCurrentView = propSetCurrentView || contextSetCurrentView;

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleRoleTabClick = (role: 'admin' | 'collection_boy' | 'customer') => {
    setCurrentView(role);
    if (role === 'admin') {
      switchRole('admin');
    } else if (role === 'collection_boy') {
      switchRole('collection_boy', 'cb-1'); // default to Ramesh Kumar
    } else if (role === 'customer') {
      switchRole('customer', 'cust-1');
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Logo and System Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 shadow-inner font-bold text-white tracking-wider">
            <span className="text-lg">₹</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                <span>LCMS</span>
                <span className="hidden md:inline text-xs font-medium px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  LOAN COLLECTION SYSTEM
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Admin Panel • Collection Boy Panel • Customer Website
            </p>
          </div>
        </div>

        {/* 3 Primary Panel Switcher Buttons (As shown in screenshot) */}
        <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 shadow-inner">
          <button
            id="panel-btn-admin"
            type="button"
            onClick={() => handleRoleTabClick('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentView === 'admin'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>1. Admin Panel</span>
          </button>

          <button
            id="panel-btn-cb"
            type="button"
            onClick={() => handleRoleTabClick('collection_boy')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentView === 'collection_boy'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>2. Collection Boy</span>
          </button>

          <button
            id="panel-btn-customer"
            type="button"
            onClick={() => handleRoleTabClick('customer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentView === 'customer'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>3. Customer Website</span>
          </button>
        </div>

        {/* Right Tools: User switcher, demo reset, notification */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Demo Reset */}
          <button
            id="btn-reset-demo"
            type="button"
            onClick={() => setShowResetConfirm(true)}
            title="Reset data to initial state"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white hover:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700/60 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Reset Demo</span>
          </button>

          {/* User selector dropdown */}
          <div className="relative">
            <button
              id="user-profile-menu-btn"
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700/80 px-2.5 py-1.5 rounded-lg border border-slate-700 transition text-left"
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-blue-400"
              />
              <div className="hidden sm:block text-left leading-tight">
                <p className="text-xs font-semibold text-white truncate max-w-[110px]">{currentUser.name}</p>
                <p className="text-[10px] text-blue-300 capitalize">{currentUser.role.replace('_', ' ')}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 border-b border-slate-700/80">
                  <p className="text-xs font-medium text-slate-400">Switch Active Test Profile:</p>
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        switchUser(u.id);
                        if (u.role === 'admin') setCurrentView('admin');
                        else if (u.role === 'collection_boy') setCurrentView('collection_boy');
                        setShowUserMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-slate-700 transition ${
                        u.id === currentUser.id ? 'bg-blue-600/20 text-blue-300 font-semibold' : 'text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                        <div>
                          <p className="text-white">{u.name}</p>
                          <p className="text-[10px] text-slate-400">@{u.username} • {u.role === 'admin' ? 'Admin' : 'Agent'}</p>
                        </div>
                      </div>
                      {u.id === currentUser.id && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-5 text-slate-200 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-amber-400" />
              Reset All Demo Data?
            </h3>
            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              This will restore all default test customers (Rajesh Kumar, Suresh Yadav, etc.), collection boys, sample payments, and loans as specified in the PRD.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetToInitialData();
                  setShowResetConfirm(false);
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow"
              >
                Yes, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
