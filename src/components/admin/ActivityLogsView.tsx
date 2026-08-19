import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDateTime } from '../../utils/formatters';
import { History, Search, Shield, Filter, UserCheck, CreditCard, Wallet, Users } from 'lucide-react';

export const ActivityLogsView: React.FC = () => {
  const { activityLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');

  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = moduleFilter === 'All' || log.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">System Activity & Audit Trail</h2>
          <p className="text-xs text-slate-500">
            Immutable log of user logins, loan disbursements, payments, assignments, and adjustments
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search activity descriptions, user names or actions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="w-full sm:w-auto text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="All">All Modules</option>
            <option value="Payment">Payment</option>
            <option value="Loan">Loan</option>
            <option value="Customer">Customer</option>
            <option value="Assignment">Assignment</option>
            <option value="Auth">Auth</option>
            <option value="CollectionBoy">Collection Boy</option>
            <option value="Settings">Settings</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-3">User & Role</th>
                <th className="py-3 px-3">Module</th>
                <th className="py-3 px-3">Action</th>
                <th className="py-3 px-4">Event Description</th>
                <th className="py-3 px-3 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 text-slate-500 font-medium whitespace-nowrap">
                    {formatDateTime(log.createdAt)}
                  </td>
                  <td className="py-3.5 px-3">
                    <p className="font-bold text-slate-900">{log.userName}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{log.role.replace('_', ' ')}</p>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px]">
                      {log.module}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-semibold text-blue-700">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {log.description}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-400">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
