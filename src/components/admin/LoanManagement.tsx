import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Loan, LoanStatus } from '../../types';
import { formatINR, formatDate } from '../../utils/formatters';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  X,
  User,
} from 'lucide-react';

interface LoanManagementProps {
  onSelectCustomer: (customerId: string) => void;
}

export const LoanManagement: React.FC<LoanManagementProps> = ({ onSelectCustomer }) => {
  const { loans, customers, collectionBoys, addLoan, updateLoan } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Loan Form State
  const [formData, setFormData] = useState({
    customerId: '',
    principalAmount: 100000,
    interestRate: 12,
    interestAmount: 0,
    processingFee: 1000,
    tenureMonths: 12,
    purpose: 'Small Business Working Capital',
    startDate: new Date().toISOString().split('T')[0],
    assignedCollectionBoyId: 'cb-1',
  });

  const [formError, setFormError] = useState('');

  const openNewLoanModal = () => {
    setFormData({
      customerId: customers[0]?.id || '',
      principalAmount: 100000,
      interestRate: 12,
      interestAmount: 0,
      processingFee: 1000,
      tenureMonths: 12,
      purpose: 'Small Business Working Capital',
      startDate: new Date().toISOString().split('T')[0],
      assignedCollectionBoyId: collectionBoys[0]?.id || 'cb-1',
    });
    setFormError('');
    setShowCreateModal(true);
  };

  const handleCreateLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId) {
      setFormError('Please select a customer.');
      return;
    }
    if (formData.principalAmount <= 0) {
      setFormError('Principal amount must be greater than 0.');
      return;
    }

    const selectedCust = customers.find((c) => c.id === formData.customerId);
    if (!selectedCust) {
      setFormError('Selected customer not found.');
      return;
    }

    const totalPayable = formData.principalAmount + formData.interestAmount + formData.processingFee;
    const emi = Math.round(totalPayable / formData.tenureMonths);
    const start = new Date(formData.startDate);
    const end = new Date(start.getTime() + formData.tenureMonths * 30 * 24 * 3600 * 1000).toISOString().split('T')[0];
    const nextDue = new Date(start.getTime() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0];

    addLoan({
      customerId: selectedCust.id,
      customerName: selectedCust.name,
      customerMobile: selectedCust.mobile,
      principalAmount: formData.principalAmount,
      interestRate: formData.interestRate,
      interestAmount: formData.interestAmount,
      processingFee: formData.processingFee,
      totalPayable,
      tenureMonths: formData.tenureMonths,
      emiAmount: emi,
      startDate: formData.startDate,
      endDate: end,
      disbursementDate: formData.startDate,
      nextDueDate: nextDue,
      status: 'Active',
      purpose: formData.purpose,
      assignedCollectionBoyId: formData.assignedCollectionBoyId,
    });

    setShowCreateModal(false);
  };

  const filteredLoans = loans.filter((l) => {
    const matchesSearch =
      l.loanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.customerMobile.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Loan Management</h2>
          <p className="text-xs text-slate-500">
            Active credit facilities, disbursement schedules, and balances
          </p>
        </div>

        <button
          id="create-loan-btn"
          type="button"
          onClick={openNewLoanModal}
          className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Loan</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="search-loan-input"
            type="text"
            placeholder="Search by Loan ID, Customer Name or Mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-full sm:w-auto">
          <select
            id="filter-loan-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="All">All Loan Statuses</option>
            <option value="Active">Active</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Fully Paid">Fully Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Loan ID</th>
                <th className="py-3 px-3">Borrower / Customer</th>
                <th className="py-3 px-3">Principal</th>
                <th className="py-3 px-3">Total Payable</th>
                <th className="py-3 px-3">Paid Amount</th>
                <th className="py-3 px-3">Outstanding</th>
                <th className="py-3 px-3">Tenure / EMI</th>
                <th className="py-3 px-3">Next Due</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLoans.map((loan) => {
                const cb = collectionBoys.find((b) => b.id === loan.assignedCollectionBoyId);
                const percentPaid = Math.round((loan.totalPaid / (loan.totalPayable || 1)) * 100);
                return (
                  <tr key={loan.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                      {loan.loanId}
                    </td>
                    <td className="py-3.5 px-3">
                      <button
                        type="button"
                        onClick={() => onSelectCustomer(loan.customerId)}
                        className="font-bold text-slate-900 hover:text-blue-600 text-left block"
                      >
                        {loan.customerName}
                      </button>
                      <span className="text-[11px] text-slate-400">{loan.customerMobile}</span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-800">{formatINR(loan.principalAmount)}</td>
                    <td className="py-3.5 px-3 font-bold text-slate-900">{formatINR(loan.totalPayable)}</td>
                    <td className="py-3.5 px-3 font-semibold text-emerald-600">
                      <div>{formatINR(loan.totalPaid)}</div>
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${percentPaid}%` }} />
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-rose-600">{formatINR(loan.outstandingAmount)}</td>
                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-slate-700">{loan.tenureMonths} Mos</span>
                      <span className="text-[10px] text-slate-400 block">{formatINR(loan.emiAmount)}/mo</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-700 font-medium">{formatDate(loan.nextDueDate)}</td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          loan.status === 'Fully Paid'
                            ? 'bg-emerald-100 text-emerald-700'
                            : loan.status === 'Overdue'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {loan.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectCustomer(loan.customerId)}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Loan Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 text-slate-800 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Create New Loan Account</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="my-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateLoan} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Customer *</label>
                <select
                  required
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                >
                  <option value="">-- Choose Customer --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.customerCode}) - {c.mobile}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Principal Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={formData.principalAmount}
                    onChange={(e) => setFormData({ ...formData, principalAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tenure (Months) *</label>
                  <select
                    value={formData.tenureMonths}
                    onChange={(e) => setFormData({ ...formData, tenureMonths: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value={6}>6 Months</option>
                    <option value={10}>10 Months</option>
                    <option value={12}>12 Months</option>
                    <option value={18}>18 Months</option>
                    <option value={24}>24 Months</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Processing Fee (₹)</label>
                  <input
                    type="number"
                    value={formData.processingFee}
                    onChange={(e) => setFormData({ ...formData, processingFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Disbursement Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Loan Purpose</label>
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="e.g. Working Capital, Purchase of equipment"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assign Collection Boy</label>
                <select
                  value={formData.assignedCollectionBoyId}
                  onChange={(e) => setFormData({ ...formData, assignedCollectionBoyId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                >
                  {collectionBoys.map((cb) => (
                    <option key={cb.id} value={cb.id}>
                      {cb.name} ({cb.employeeCode})
                    </option>
                  ))}
                </select>
              </div>

              {/* Real-time calculated summary */}
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-slate-700 space-y-1">
                <div className="flex justify-between font-medium">
                  <span>Total Payable:</span>
                  <span className="font-bold text-slate-900">
                    {formatINR(formData.principalAmount + formData.interestAmount + formData.processingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>Estimated Monthly EMI:</span>
                  <span className="font-semibold text-blue-700">
                    {formatINR(
                      Math.round(
                        (formData.principalAmount + formData.interestAmount + formData.processingFee) /
                          formData.tenureMonths
                      )
                    )}
                    /mo
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  Disburse & Create Loan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
