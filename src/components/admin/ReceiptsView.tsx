import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDate, formatDateTime } from '../../utils/formatters';
import { Receipt, Search, Printer, Eye, CheckCircle2 } from 'lucide-react';

export const ReceiptsView: React.FC = () => {
  const { loanPayments, openReceiptModal } = useApp();
  const [search, setSearch] = useState('');

  const filteredReceipts = loanPayments.filter(
    (p) =>
      p.receiptNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.customerName.toLowerCase().includes(search.toLowerCase()) ||
      p.loanId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Receipts & Payment Acknowledgment</h2>
          <p className="text-xs text-slate-500">
            Digital verification archive, official computerized receipts with QR authentication
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Receipt Number, Customer Name, or Loan ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Receipts Grid / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Receipt #</th>
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3">Customer Name</th>
                <th className="py-3 px-3">Loan ID</th>
                <th className="py-3 px-3">Amount Received</th>
                <th className="py-3 px-3">Remaining Balance</th>
                <th className="py-3 px-3">Collected By</th>
                <th className="py-3 px-4 text-right">View / Print</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReceipts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-700">{p.receiptNumber}</td>
                  <td className="py-3.5 px-3 text-slate-500">{formatDateTime(p.createdAt)}</td>
                  <td className="py-3.5 px-3 font-bold text-slate-900">{p.customerName}</td>
                  <td className="py-3.5 px-3 font-mono text-slate-700">{p.loanId}</td>
                  <td className="py-3.5 px-3 font-bold text-emerald-600">{formatINR(p.amount)}</td>
                  <td className="py-3.5 px-3 font-semibold text-rose-600">{formatINR(p.newOutstanding)}</td>
                  <td className="py-3.5 px-3 text-slate-700">{p.collectionBoyName}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => openReceiptModal(p)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
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
