import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer, Loan, LoanPayment } from '../../types';
import { formatINR, formatDate, formatDateTime } from '../../utils/formatters';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Receipt,
  FileText,
  User,
  Trash2,
  Edit,
  CheckCircle,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';

interface CustomerDetailViewProps {
  customerId: string;
  onBack: () => void;
  onEditCustomer: (customer: Customer) => void;
  onCollectPayment?: (loanId: string) => void;
}

export const CustomerDetailView: React.FC<CustomerDetailViewProps> = ({
  customerId,
  onBack,
  onEditCustomer,
  onCollectPayment,
}) => {
  const { customers, loans, loanPayments, deleteCustomer, openReceiptModal } = useApp();
  const [activeTab, setActiveTab] = useState<'loan_details' | 'payment_history' | 'edit_profile' | 'documents'>('payment_history');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const customer = customers.find((c) => c.id === customerId);
  const customerLoans = loans.filter((l) => l.customerId === customerId);
  const primaryLoan = customerLoans[0];
  const customerPayments = loanPayments.filter((p) => p.customerId === customerId);

  if (!customer) {
    return (
      <div className="bg-white p-8 rounded-2xl text-center border border-slate-200">
        <p className="text-slate-500 mb-4">Customer not found.</p>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Customer List
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    const success = deleteCustomer(customer.id);
    if (!success) {
      setFeedbackMsg('Cannot delete customer with active outstanding loan balances.');
      setShowDeleteConfirm(false);
    } else {
      onBack();
    }
  };

  return (
    <div className="space-y-5">
      {/* Top breadcrumb navigation */}
      <div className="flex items-center justify-between">
        <button
          id="back-to-cust-list-btn"
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Customers</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            id="edit-cust-btn"
            type="button"
            onClick={() => onEditCustomer(customer)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Customer</span>
          </button>
          <button
            id="delete-cust-btn"
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Main Customer Detail Card - Matching Screenshot "ADMIN - CUSTOMER DETAIL" */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Customer Header Info */}
        <div className="p-6 bg-slate-50/70 border-b border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Left: Avatar + Contact Info */}
            <div className="flex items-start gap-4">
              <img
                src={customer.photo || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'}
                alt={customer.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/20 shadow-sm shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{customer.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                    {customer.customerCode}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-slate-600">
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Mobile: {customer.mobile}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Email: {customer.email}</span>
                  </p>
                  <p className="flex items-center gap-1.5 sm:col-span-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Address: {customer.address}, {customer.city}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Loan Summary Meta */}
            {primaryLoan ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-3.5 rounded-xl border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Loan ID</span>
                  <span className="font-mono font-bold text-slate-900">{primaryLoan.loanId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Loan Amount</span>
                  <span className="font-bold text-slate-900">{formatINR(primaryLoan.principalAmount)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Approved Date</span>
                  <span className="font-semibold text-slate-700">{formatDate(primaryLoan.startDate)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Status</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-700">
                    <CheckCircle className="w-3 h-3" />
                    {primaryLoan.status}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                No active loan associated.
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50/30 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('payment_history')}
            className={`py-3 px-4 border-b-2 transition ${
              activeTab === 'payment_history'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Payment History ({customerPayments.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('loan_details')}
            className={`py-3 px-4 border-b-2 transition ${
              activeTab === 'loan_details'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Loan Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className={`py-3 px-4 border-b-2 transition ${
              activeTab === 'documents'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Documents & KYC
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'payment_history' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Payment Date</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Collected By</th>
                      <th className="py-2.5 px-3">Payment Mode</th>
                      <th className="py-2.5 px-3">Remaining</th>
                      <th className="py-2.5 px-3 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customerPayments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-slate-400">
                          No payment records found for this customer.
                        </td>
                      </tr>
                    ) : (
                      customerPayments.map((p, index) => (
                        <tr key={p.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-3 font-medium text-slate-400">{index + 1}</td>
                          <td className="py-3 px-3 font-medium">{formatDate(p.paymentDate)}</td>
                          <td className="py-3 px-3 font-bold text-emerald-600">{formatINR(p.amount)}</td>
                          <td className="py-3 px-3">{p.collectionBoyName}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                              {p.paymentMode}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-semibold text-rose-600">
                            {formatINR(p.newOutstanding)}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => openReceiptModal(p)}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bottom Summary Bar (Matching Screenshot: Total Paid: ₹35,000, Outstanding: ₹65,000) */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 text-xs">
                <div className="flex items-center gap-6 font-bold">
                  <span className="text-slate-800">
                    Total Paid: <span className="text-emerald-600 text-sm">{formatINR(primaryLoan?.totalPaid || 0)}</span>
                  </span>
                  <span className="text-slate-800">
                    Outstanding: <span className="text-rose-600 text-sm">{formatINR(primaryLoan?.outstandingAmount || 0)}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEditCustomer(customer)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition"
                  >
                    Edit Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition"
                  >
                    Delete Customer
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'loan_details' && (
            <div className="space-y-4 text-xs">
              {customerLoans.map((loan) => (
                <div key={loan.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="font-mono font-bold text-sm text-blue-700">{loan.loanId}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                      {loan.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-slate-400 block">Principal Amount</span>
                      <span className="font-bold text-slate-800">{formatINR(loan.principalAmount)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Total Payable</span>
                      <span className="font-bold text-slate-800">{formatINR(loan.totalPayable)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Tenure</span>
                      <span className="font-semibold text-slate-700">{loan.tenureMonths} Months</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Monthly EMI</span>
                      <span className="font-semibold text-slate-700">{formatINR(loan.emiAmount)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Next Due Date</span>
                      <span className="font-semibold text-slate-700">{formatDate(loan.nextDueDate)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Purpose</span>
                      <span className="font-medium text-slate-700">{loan.purpose}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="text-xs text-slate-600 space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-semibold text-slate-800">Aadhaar Card Copy</p>
                    <p className="text-[10px] text-slate-400">Verified via e-KYC</p>
                  </div>
                </div>
                <span className="text-emerald-600 font-semibold">Verified</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-semibold text-slate-800">PAN Card</p>
                    <p className="text-[10px] text-slate-400">Tax ID authenticated</p>
                  </div>
                </div>
                <span className="text-emerald-600 font-semibold">Verified</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 text-slate-800 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-600" />
              Delete Customer Profile?
            </h3>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Are you sure you want to delete <strong>{customer.name}</strong> ({customer.customerCode})? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
