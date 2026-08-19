import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LoanPayment, PaymentMode } from '../../types';
import { formatINR, formatDate, formatDateTime, exportToCSV } from '../../utils/formatters';
import {
  Wallet,
  Plus,
  Search,
  Receipt,
  Download,
  Filter,
  Ban,
  CheckCircle,
  AlertTriangle,
  X,
} from 'lucide-react';

export const CollectionsManagement: React.FC = () => {
  const { loanPayments, loans, collectionBoys, recordPayment, voidPayment, openReceiptModal } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [modeFilter, setModeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [showCollectModal, setShowCollectModal] = useState(false);
  const [showVoidModal, setShowVoidModal] = useState<LoanPayment | null>(null);
  const [voidReason, setVoidReason] = useState('Data entry error correction');

  // New Collection Form
  const [formData, setFormData] = useState({
    loanId: '',
    amount: 5000,
    paymentMode: 'Cash' as PaymentMode,
    transactionReference: '',
    remarks: 'Office Walk-in Collection',
    collectionBoyId: 'cb-1',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.loanId) {
      setErrorMsg('Please select a loan.');
      return;
    }

    const res = recordPayment({
      loanId: formData.loanId,
      amount: formData.amount,
      paymentMode: formData.paymentMode,
      transactionReference: formData.transactionReference,
      remarks: formData.remarks,
      collectionBoyId: formData.collectionBoyId,
    });

    if (res.success && res.payment) {
      setSuccessMsg(res.message);
      setShowCollectModal(false);
      openReceiptModal(res.payment);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleVoidPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showVoidModal) return;
    const res = voidPayment(showVoidModal.id, voidReason);
    if (res.success) {
      setSuccessMsg(res.message);
      setShowVoidModal(null);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleExportCSV = () => {
    const rows = loanPayments.map((p) => ({
      'Receipt Number': p.receiptNumber,
      'Loan ID': p.loanId,
      'Customer Name': p.customerName,
      'Mobile': p.customerMobile,
      'Collected By': p.collectionBoyName,
      'Amount': p.amount,
      'Payment Date': p.paymentDate,
      'Payment Mode': p.paymentMode,
      'Previous Outstanding': p.previousOutstanding,
      'New Outstanding': p.newOutstanding,
      'Status': p.status,
    }));
    exportToCSV('LCMS_Collections_Report', rows);
  };

  const filteredPayments = loanPayments.filter((p) => {
    const matchesSearch =
      p.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.loanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.collectionBoyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode = modeFilter === 'All' || p.paymentMode === modeFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesMode && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Collections & Payments Management</h2>
          <p className="text-xs text-slate-500">
            Real-time receipt ledger, payment reconciliations, and financial adjustments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="export-collections-btn"
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            id="record-collection-btn"
            type="button"
            onClick={() => {
              setFormData({
                loanId: loans[0]?.loanId || '',
                amount: 5000,
                paymentMode: 'Cash',
                transactionReference: '',
                remarks: 'Office Counter Collection',
                collectionBoyId: collectionBoys[0]?.id || 'cb-1',
              });
              setErrorMsg('');
              setShowCollectModal(true);
            }}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Record Collection</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full md:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="search-collections-input"
            type="text"
            placeholder="Search by Receipt #, Customer Name, Loan ID or Agent..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="All">All Modes</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Successful">Successful</option>
            <option value="Voided">Voided</option>
          </select>
        </div>
      </div>

      {/* Collections Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Receipt #</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Customer & Loan</th>
                <th className="py-3 px-3">Collected By</th>
                <th className="py-3 px-3">Mode</th>
                <th className="py-3 px-3">Amount Received</th>
                <th className="py-3 px-3">Remaining Outstanding</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((p) => (
                <tr key={p.id} className={`hover:bg-slate-50/80 transition ${p.status === 'Voided' ? 'opacity-60 bg-rose-50/30' : ''}`}>
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                    {p.receiptNumber}
                  </td>
                  <td className="py-3.5 px-3">{formatDate(p.paymentDate)}</td>
                  <td className="py-3.5 px-3">
                    <p className="font-bold text-slate-900">{p.customerName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{p.loanId}</p>
                  </td>
                  <td className="py-3.5 px-3 font-medium text-slate-700">{p.collectionBoyName}</td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      {p.paymentMode}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-emerald-600">
                    {formatINR(p.amount)}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-rose-600">
                    {formatINR(p.newOutstanding)}
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'Successful'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openReceiptModal(p)}
                        title="View Official Printable Receipt"
                        className="px-2.5 py-1 text-[11px] font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition inline-flex items-center gap-1"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                      {p.status === 'Successful' && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowVoidModal(p);
                            setVoidReason('Data entry error correction');
                          }}
                          title="Admin Void Payment"
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Payment Modal */}
      {showCollectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-slate-800 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Record Payment Collection</h3>
              <button
                type="button"
                onClick={() => setShowCollectModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="my-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleRecordPayment} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Active Loan *</label>
                <select
                  required
                  value={formData.loanId}
                  onChange={(e) => setFormData({ ...formData, loanId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                >
                  <option value="">-- Choose Loan --</option>
                  {loans
                    .filter((l) => l.outstandingAmount > 0)
                    .map((l) => (
                      <option key={l.id} value={l.loanId}>
                        {l.customerName} ({l.loanId}) — Outstanding: {formatINR(l.outstandingAmount)}
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Mode</label>
                  <select
                    value={formData.paymentMode}
                    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Collection Officer / Agent</label>
                <select
                  value={formData.collectionBoyId}
                  onChange={(e) => setFormData({ ...formData, collectionBoyId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                >
                  {collectionBoys.map((cb) => (
                    <option key={cb.id} value={cb.id}>
                      {cb.name} ({cb.employeeCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transaction Ref / Cheque No (Optional)</label>
                <input
                  type="text"
                  value={formData.transactionReference}
                  onChange={(e) => setFormData({ ...formData, transactionReference: e.target.value })}
                  placeholder="e.g. UPI Ref / Cheque 40921"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Remarks</label>
                <input
                  type="text"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCollectModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  Record & Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Void Payment Modal */}
      {showVoidModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 text-slate-800 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Ban className="w-5 h-5 text-rose-600" />
              Void Payment Receipt?
            </h3>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              You are about to void receipt <strong>{showVoidModal.receiptNumber}</strong> of <strong>{formatINR(showVoidModal.amount)}</strong>. The customer's loan outstanding balance will be automatically recalculated.
            </p>

            <form onSubmit={handleVoidPayment} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Voiding *</label>
                <textarea
                  required
                  value={voidReason}
                  onChange={(e) => setVoidReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVoidModal(null)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
                >
                  Confirm Void
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
