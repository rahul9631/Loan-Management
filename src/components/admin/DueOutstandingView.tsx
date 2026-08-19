import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDate } from '../../utils/formatters';
import {
  AlertTriangle,
  Clock,
  Send,
  Phone,
  Search,
  CheckCircle2,
  Filter,
  ArrowUpRight,
} from 'lucide-react';

interface DueOutstandingViewProps {
  onSelectCustomer: (customerId: string) => void;
}

export const DueOutstandingView: React.FC<DueOutstandingViewProps> = ({ onSelectCustomer }) => {
  const { loans, collectionBoys } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [agingFilter, setAgingFilter] = useState('All');
  const [reminderSuccess, setReminderSuccess] = useState<string | null>(null);

  const activeOutstandingLoans = loans.filter((l) => l.outstandingAmount > 0);

  // Aging calculations simulation
  const agingBuckets = {
    current: activeOutstandingLoans.filter((l) => l.status === 'Active').reduce((s, l) => s + l.outstandingAmount, 0),
    days1to7: 185000,
    days8to30: 340000,
    days31to60: 420000,
    days60plus: 510000,
  };

  const handleSendReminder = (customerName: string, mobile: string) => {
    setReminderSuccess(`Payment reminder SMS & WhatsApp dispatched to ${customerName} (${mobile})`);
    setTimeout(() => setReminderSuccess(null), 4000);
  };

  const filteredLoans = activeOutstandingLoans.filter((l) => {
    const match =
      l.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.loanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.customerMobile.includes(searchTerm);
    return match;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Due & Outstanding Analysis</h2>
          <p className="text-xs text-slate-500">
            Portfolio aging analysis, delinquency risk categorization, and automated borrower reminders
          </p>
        </div>
      </div>

      {reminderSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{reminderSuccess}</span>
        </div>
      )}

      {/* Aging Analysis Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500">1 - 7 Days Due</span>
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          </div>
          <p className="text-lg font-bold text-slate-900">{formatINR(agingBuckets.days1to7)}</p>
          <span className="text-[10px] text-amber-600 font-medium">Early Follow-up</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500">8 - 30 Days Due</span>
            <span className="w-2 h-2 rounded-full bg-orange-500" />
          </div>
          <p className="text-lg font-bold text-slate-900">{formatINR(agingBuckets.days8to30)}</p>
          <span className="text-[10px] text-orange-600 font-medium">Standard Dues</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500">31 - 60 Days Due</span>
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          </div>
          <p className="text-lg font-bold text-slate-900">{formatINR(agingBuckets.days31to60)}</p>
          <span className="text-[10px] text-rose-600 font-medium">Notice Phase</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500">60+ Days Overdue</span>
            <span className="w-2 h-2 rounded-full bg-red-700" />
          </div>
          <p className="text-lg font-bold text-red-700">{formatINR(agingBuckets.days60plus)}</p>
          <span className="text-[10px] text-red-700 font-bold">High Risk NPA</span>
        </div>
      </div>

      {/* Outstanding Customer List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search outstanding borrower..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">{filteredLoans.length} Outstanding Loans</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Borrower Name</th>
                <th className="py-3 px-3">Loan ID</th>
                <th className="py-3 px-3">Total Payable</th>
                <th className="py-3 px-3">Paid Amount</th>
                <th className="py-3 px-3">Outstanding Balance</th>
                <th className="py-3 px-3">Next Due Date</th>
                <th className="py-3 px-3">Assigned Officer</th>
                <th className="py-3 px-4 text-right">Send Alert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLoans.map((l) => {
                const cb = collectionBoys.find((b) => b.id === l.assignedCollectionBoyId);
                return (
                  <tr key={l.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => onSelectCustomer(l.customerId)}
                        className="font-bold text-slate-900 hover:text-blue-600 text-left block"
                      >
                        {l.customerName}
                      </button>
                      <span className="text-[11px] text-slate-400">{l.customerMobile}</span>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-semibold text-blue-600">{l.loanId}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-800">{formatINR(l.totalPayable)}</td>
                    <td className="py-3.5 px-3 font-semibold text-emerald-600">{formatINR(l.totalPaid)}</td>
                    <td className="py-3.5 px-3 font-bold text-rose-600">{formatINR(l.outstandingAmount)}</td>
                    <td className="py-3.5 px-3 text-slate-700 font-medium">{formatDate(l.nextDueDate)}</td>
                    <td className="py-3.5 px-3">{cb ? cb.name : 'Unassigned'}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleSendReminder(l.customerName, l.customerMobile)}
                        title="Send WhatsApp / SMS Reminder"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition"
                      >
                        <Send className="w-3 h-3" />
                        <span>Remind</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
