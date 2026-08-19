import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer, Loan, LoanPayment, PaymentMode } from '../../types';
import { formatINR, formatDate, formatDateTime } from '../../utils/formatters';
import {
  User,
  CreditCard,
  Receipt,
  FilePlus,
  Phone,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ShieldCheck,
  Send,
  Calendar,
  Sparkles,
  Calculator,
} from 'lucide-react';

export const CustomerPortal: React.FC = () => {
  const {
    customers,
    loans,
    loanPayments,
    collectionBoys,
    currentUser,
    submitLoanApplication,
    recordPayment,
    openReceiptModal,
  } = useApp();

  // Tab: 'overview' | 'pay' | 'receipts' | 'apply'
  const [activeTab, setActiveTab] = useState<'overview' | 'pay' | 'receipts' | 'apply'>('overview');

  // Customer selection
  const selectedCustomerId = currentUser?.customerId || customers[0]?.id;
  const currentCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];
  const customerLoan = loans.find((l) => l.customerId === currentCustomer?.id);
  const customerPayments = loanPayments.filter((p) => p.customerId === currentCustomer?.id);
  const assignedAgent = collectionBoys.find((b) => b.id === currentCustomer?.assignedCollectionBoyId);

  // Online Pay State
  const [payAmount, setPayAmount] = useState(customerLoan?.emiAmount || 5000);
  const [payMode, setPayMode] = useState<PaymentMode>('UPI');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Loan Application Form State
  const [appForm, setAppForm] = useState({
    fullName: currentCustomer?.name || 'Ramesh Singh',
    fatherName: currentCustomer?.fatherName || 'Gopal Singh',
    mobile: currentCustomer?.mobile || '9876543210',
    email: currentCustomer?.email || 'customer@email.com',
    dob: '1990-01-01',
    address: currentCustomer?.address || 'Gandhi Maidan Road, Fraser Road',
    city: 'Patna',
    state: 'Bihar',
    pincode: '800001',
    panNumber: 'ABCDE1234F',
    aadhaarNumber: '123456789012',
    employmentType: 'Self Employed' as 'Salaried' | 'Self Employed' | 'Business' | 'Other',
    monthlyIncome: 45000,
    requestedAmount: 50000,
    tenureMonths: 12,
    purpose: 'Business Expansion & Stock Purchase',
  });

  const [appSubmitted, setAppSubmitted] = useState<string | null>(null);

  // Online Payment handler
  const handleOnlinePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerLoan) return;

    const res = recordPayment({
      loanId: customerLoan.loanId,
      amount: payAmount,
      paymentMode: payMode,
      transactionReference: `ONLINE-TXN-${Date.now().toString().slice(-8)}`,
      remarks: 'Customer Portal Self-Service Payment',
      collectionBoyId: currentCustomer.assignedCollectionBoyId || 'cb-1',
    });

    if (res.success && res.payment) {
      setPaymentSuccess(true);
      openReceiptModal(res.payment);
      setTimeout(() => setPaymentSuccess(false), 5000);
    }
  };

  // Loan Application handler
  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = submitLoanApplication(appForm);
    if (res.success) {
      setAppSubmitted(`Your loan application has been submitted successfully! Application Reference: ${res.applicationNumber}`);
      setActiveTab('overview');
      setTimeout(() => setAppSubmitted(null), 8000);
    }
  };

  // Calculation for apply calculator
  const estimatedEmi = Math.round(
    (appForm.requestedAmount + appForm.requestedAmount * 0.12) / appForm.tenureMonths
  );

  return (
    <div className="min-h-[calc(100vh-61px)] bg-slate-100 p-3 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Customer Header Banner */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={currentCustomer?.photo || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'}
              alt={currentCustomer?.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-100 shrink-0"
            />
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                Customer Loan Portal
              </span>
              <h1 className="text-xl font-bold text-slate-900">{currentCustomer?.name}</h1>
              <p className="text-xs text-slate-500 font-mono">
                Customer ID: {currentCustomer?.customerCode} • {currentCustomer?.mobile}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('pay')}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition"
            >
              Pay EMI Online
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('apply')}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition"
            >
              + Apply New Loan
            </button>
          </div>
        </div>

        {appSubmitted && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{appSubmitted}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Loan Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pay')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'pay'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Pay Online</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('receipts')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'receipts'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>My Receipts ({customerPayments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('apply')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'apply'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FilePlus className="w-4 h-4" />
            <span>Apply For Loan</span>
          </button>
        </div>

        {/* TAB 1: Loan Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {customerLoan ? (
              <>
                {/* Outstanding Alert Card */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-3xl shadow-md relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                    <div>
                      <span className="text-xs text-slate-300 font-medium">Outstanding Balance</span>
                      <p className="text-3xl font-black text-white mt-1">
                        {formatINR(customerLoan.outstandingAmount)}
                      </p>
                      <p className="text-xs text-blue-300 mt-1">
                        Loan ID: <span className="font-mono">{customerLoan.loanId}</span> • Due Date: {formatDate(customerLoan.nextDueDate)}
                      </p>
                    </div>

                    <div className="text-left sm:text-right bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                      <span className="text-[11px] text-slate-300 font-medium">Monthly Installment (EMI)</span>
                      <p className="text-xl font-bold text-emerald-400 mt-0.5">{formatINR(customerLoan.emiAmount)}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                      <span>Repayment Progress</span>
                      <span className="font-bold text-white">
                        {Math.round((customerLoan.totalPaid / customerLoan.totalPayable) * 100)}% Repaid
                      </span>
                    </div>
                    <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-400 h-2.5 rounded-full"
                        style={{
                          width: `${Math.min(100, Math.round((customerLoan.totalPaid / customerLoan.totalPayable) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Loan Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] text-slate-400 font-medium block">Principal Amount</span>
                    <span className="text-base font-bold text-slate-900 mt-1 block">
                      {formatINR(customerLoan.principalAmount)}
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] text-slate-400 font-medium block">Total Payable</span>
                    <span className="text-base font-bold text-slate-900 mt-1 block">
                      {formatINR(customerLoan.totalPayable)}
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] text-slate-400 font-medium block">Total Paid So Far</span>
                    <span className="text-base font-bold text-emerald-600 mt-1 block">
                      {formatINR(customerLoan.totalPaid)}
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] text-slate-400 font-medium block">Tenure Term</span>
                    <span className="text-base font-bold text-slate-900 mt-1 block">
                      {customerLoan.tenureMonths} Months
                    </span>
                  </div>
                </div>

                {/* Dedicated Collection Officer Card */}
                {assignedAgent && (
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={assignedAgent.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                        alt={assignedAgent.name}
                        className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-200 shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-blue-600 uppercase">
                          Your Dedicated Field Officer
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{assignedAgent.name}</h4>
                        <p className="text-xs text-slate-500">
                          {assignedAgent.employeeCode} • {assignedAgent.address}
                        </p>
                      </div>
                    </div>

                    <a
                      href={`tel:${assignedAgent.mobile}`}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold transition"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Contact Officer ({assignedAgent.mobile})</span>
                    </a>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h3 className="font-bold text-sm text-slate-800">No active loans found</h3>
                <p className="text-xs text-slate-500 mt-1">You can apply for a new instant loan anytime.</p>
                <button
                  type="button"
                  onClick={() => setActiveTab('apply')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
                >
                  Apply Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Online Payment */}
        {activeTab === 'pay' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 max-w-lg mx-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">Instant Online EMI Payment</h3>
            <p className="text-xs text-slate-500 mb-4">
              Pay via UPI, Debit Card or Netbanking with immediate computerized receipt generation
            </p>

            <form onSubmit={handleOnlinePayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Amount (₹)</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={customerLoan?.outstandingAmount || 100000}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-2">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['UPI', 'Bank Transfer', 'Cash'] as PaymentMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPayMode(mode)}
                      className={`py-2.5 rounded-xl text-xs font-semibold border transition text-center ${
                        payMode === mode
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {payMode === 'UPI' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                  <div className="w-32 h-32 bg-white border border-slate-300 rounded-xl mx-auto flex items-center justify-center shadow-xs">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=lcms.nbfc@axisbank&pn=LCMS%20Finance&am=${payAmount}&cu=INR`}
                      alt="UPI QR"
                      className="w-28 h-28"
                    />
                  </div>
                  <p className="text-[11px] font-bold text-slate-800">Scan using Google Pay, PhonePe or Paytm</p>
                  <p className="text-[10px] text-slate-500 font-mono">UPI ID: lcms.nbfc@axisbank</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                Confirm Payment & Generate Receipt ({formatINR(payAmount)})
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: Receipts History */}
        {activeTab === 'receipts' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">Official Payment Receipts</h3>
              <p className="text-xs text-slate-500">Download or view all past loan repayments</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Receipt #</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Payment Mode</th>
                    <th className="py-3 px-3">Amount Paid</th>
                    <th className="py-3 px-3">Remaining Balance</th>
                    <th className="py-3 px-4 text-right">View / Print</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customerPayments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No receipts found.
                      </td>
                    </tr>
                  ) : (
                    customerPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-700">{p.receiptNumber}</td>
                        <td className="py-3.5 px-3">{formatDate(p.paymentDate)}</td>
                        <td className="py-3.5 px-3">{p.paymentMode}</td>
                        <td className="py-3.5 px-3 font-bold text-emerald-600">{formatINR(p.amount)}</td>
                        <td className="py-3.5 px-3 font-semibold text-rose-600">{formatINR(p.newOutstanding)}</td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => openReceiptModal(p)}
                            className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold transition"
                          >
                            View Receipt
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Apply for New Loan */}
        {activeTab === 'apply' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Apply for a New Loan</h3>
              <p className="text-xs text-slate-500">
                Submit an online application for personal, SME or business financing with fast underwriting
              </p>
            </div>

            <form onSubmit={handleApplicationSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={appForm.fullName}
                    onChange={(e) => setAppForm({ ...appForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Father's / Guardian's Name *</label>
                  <input
                    type="text"
                    required
                    value={appForm.fatherName}
                    onChange={(e) => setAppForm({ ...appForm, fatherName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={appForm.mobile}
                    onChange={(e) => setAppForm({ ...appForm, mobile: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={appForm.email}
                    onChange={(e) => setAppForm({ ...appForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">PAN Card Number</label>
                  <input
                    type="text"
                    maxLength={10}
                    value={appForm.panNumber}
                    onChange={(e) => setAppForm({ ...appForm, panNumber: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Aadhaar Card Number</label>
                  <input
                    type="text"
                    maxLength={12}
                    value={appForm.aadhaarNumber}
                    onChange={(e) => setAppForm({ ...appForm, aadhaarNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employment Type</label>
                  <select
                    value={appForm.employmentType}
                    onChange={(e) => setAppForm({ ...appForm, employmentType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Self Employed">Self Employed</option>
                    <option value="Salaried">Salaried</option>
                    <option value="Business">Business</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monthly Income (₹)</label>
                  <input
                    type="number"
                    value={appForm.monthlyIncome}
                    onChange={(e) => setAppForm({ ...appForm, monthlyIncome: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Requested Loan Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min={10000}
                    value={appForm.requestedAmount}
                    onChange={(e) => setAppForm({ ...appForm, requestedAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-blue-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Desired Tenure (Months)</label>
                  <select
                    value={appForm.tenureMonths}
                    onChange={(e) => setAppForm({ ...appForm, tenureMonths: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value={6}>6 Months</option>
                    <option value={12}>12 Months</option>
                    <option value={18}>18 Months</option>
                    <option value={24}>24 Months</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Loan Purpose</label>
                <input
                  type="text"
                  value={appForm.purpose}
                  onChange={(e) => setAppForm({ ...appForm, purpose: e.target.value })}
                  placeholder="e.g. Small business inventory / shop renovation"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Live EMI Calculator Box */}
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="font-bold text-slate-900 block">Estimated Monthly EMI</span>
                    <span className="text-[11px] text-slate-500">Based on standard 12% reducing interest</span>
                  </div>
                </div>
                <span className="text-lg font-black text-blue-700">{formatINR(estimatedEmi)}/mo</span>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition"
                >
                  Submit Application For Approval
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
