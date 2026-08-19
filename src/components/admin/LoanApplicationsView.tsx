import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LoanApplication, ApplicationStatus } from '../../types';
import { formatINR, formatDateTime } from '../../utils/formatters';
import {
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  User,
  Phone,
  Briefcase,
  AlertCircle,
  Check,
} from 'lucide-react';

export const LoanApplicationsView: React.FC = () => {
  const { loanApplications, updateApplicationStatus, disburseApplication } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
  const [feedback, setFeedback] = useState('');

  const filteredApps = loanApplications.filter(
    (a) => filterStatus === 'All' || a.status === filterStatus
  );

  const handleDisburse = (appId: string) => {
    const res = disburseApplication(appId);
    if (res.success) {
      setFeedback(res.message);
      setTimeout(() => setFeedback(''), 5000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Customer Loan Applications</h2>
          <p className="text-xs text-slate-500">
            Incoming public online applications, KYC verification, underwriting and instant disbursement
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            id="filter-app-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="All">All Applications ({loanApplications.length})</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Disbursed">Disbursed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Application #</th>
                <th className="py-3 px-3">Applicant Name</th>
                <th className="py-3 px-3">Mobile & City</th>
                <th className="py-3 px-3">Requested Amount</th>
                <th className="py-3 px-3">Tenure / Purpose</th>
                <th className="py-3 px-3">Income & Employment</th>
                <th className="py-3 px-3">Submission Date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No loan applications found.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      {app.applicationNumber}
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-slate-900">{app.fullName}</p>
                      <p className="text-[10px] text-slate-400">S/O {app.fatherName}</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-medium text-slate-800">{app.mobile}</p>
                      <p className="text-[10px] text-slate-400">{app.city}, {app.state}</p>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-900">
                      {formatINR(app.requestedAmount)}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-slate-700">{app.tenureMonths} Mos</span>
                      <span className="text-[10px] text-slate-500 block truncate max-w-[130px]">{app.purpose}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-medium text-slate-800">{app.employmentType}</span>
                      <span className="text-[10px] text-slate-500 block">{formatINR(app.monthlyIncome)}/mo</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">
                      {formatDateTime(app.submittedAt)}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === 'Disbursed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : app.status === 'Approved'
                            ? 'bg-blue-100 text-blue-700'
                            : app.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {app.status === 'Pending' && (
                          <button
                            type="button"
                            onClick={() => updateApplicationStatus(app.id, 'Under Review')}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition"
                          >
                            Review
                          </button>
                        )}
                        {app.status === 'Under Review' && (
                          <button
                            type="button"
                            onClick={() => updateApplicationStatus(app.id, 'Approved', 'Application verified and approved')}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition"
                          >
                            Approve
                          </button>
                        )}
                        {app.status === 'Approved' && (
                          <button
                            type="button"
                            onClick={() => handleDisburse(app.id)}
                            className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition shadow-xs"
                          >
                            Disburse
                          </button>
                        )}
                        {app.status !== 'Disbursed' && app.status !== 'Rejected' && (
                          <button
                            type="button"
                            onClick={() => updateApplicationStatus(app.id, 'Rejected', 'Credit criteria not met')}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Reject Application"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
