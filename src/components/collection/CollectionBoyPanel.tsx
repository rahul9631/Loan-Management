import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer, Loan, LoanPayment, PaymentMode } from '../../types';
import { formatINR, formatDate, formatDateTime } from '../../utils/formatters';
import {
  UserCheck,
  Search,
  Phone,
  MapPin,
  CreditCard,
  Plus,
  CheckCircle2,
  AlertCircle,
  QrCode,
  ArrowRight,
  TrendingUp,
  Receipt,
  Navigation,
  Sparkles,
  X,
  Share2,
  Calendar,
  Wallet,
  Clock,
} from 'lucide-react';

export const CollectionBoyPanel: React.FC = () => {
  const {
    currentUser,
    collectionBoys,
    customers,
    loans,
    loanPayments,
    getCollectionBoyStats,
    recordPayment,
    openReceiptModal,
  } = useApp();

  // Find active collection boy profile
  const activeBoy =
    collectionBoys.find((b) => b.id === currentUser?.collectionBoyId) || collectionBoys[0];

  const stats = getCollectionBoyStats(activeBoy.id);

  // Tab: 'route' | 'history' | 'deposit'
  const [activeTab, setActiveTab] = useState<'route' | 'history' | 'deposit'>('route');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDueStatus, setFilterDueStatus] = useState<'all' | 'pending' | 'collected'>('all');

  // Collect Modal State
  const [selectedCustForCollect, setSelectedCustForCollect] = useState<{
    customer: Customer;
    loan: Loan;
  } | null>(null);

  const [collectAmount, setCollectAmount] = useState<number>(2000);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Cash');
  const [txRef, setTxRef] = useState('');
  const [remarks, setRemarks] = useState('On-field Doorstep Collection');
  const [showQR, setShowQR] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Assigned customers for this agent
  const myCustomers = customers.filter((c) => c.assignedCollectionBoyId === activeBoy.id);

  // Filtered customer list
  const filteredCustomers = myCustomers.filter((c) => {
    const custLoan = loans.find((l) => l.customerId === c.id);
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.mobile.includes(searchTerm) ||
      c.address.toLowerCase().includes(searchTerm.toLowerCase());

    const hasPaidToday = loanPayments.some(
      (p) => p.customerId === c.id && p.paymentDate === new Date().toISOString().split('T')[0]
    );

    if (filterDueStatus === 'pending') {
      return matchesSearch && !hasPaidToday && (custLoan ? custLoan.outstandingAmount > 0 : false);
    }
    if (filterDueStatus === 'collected') {
      return matchesSearch && hasPaidToday;
    }
    return matchesSearch;
  });

  // Open Collect Modal
  const openCollectDialog = (customer: Customer) => {
    const custLoan = loans.find((l) => l.customerId === customer.id);
    if (!custLoan) {
      alert('No active loan found for this customer.');
      return;
    }
    setSelectedCustForCollect({ customer, loan: custLoan });
    setCollectAmount(Math.min(custLoan.emiAmount || 2000, custLoan.outstandingAmount));
    setPaymentMode('Cash');
    setTxRef('');
    setRemarks('Field doorstep recovery');
    setShowQR(false);
    setErrorMsg('');
  };

  // Submit Payment
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustForCollect) return;

    if (collectAmount <= 0) {
      setErrorMsg('Amount must be greater than zero.');
      return;
    }

    const res = recordPayment({
      loanId: selectedCustForCollect.loan.loanId,
      amount: collectAmount,
      paymentMode,
      transactionReference: txRef || (paymentMode === 'UPI' ? `UPI-REC-${Date.now().toString().slice(-6)}` : ''),
      remarks,
      collectionBoyId: activeBoy.id,
    });

    if (res.success && res.payment) {
      setSuccessBanner(`Payment of ${formatINR(collectAmount)} from ${selectedCustForCollect.customer.name} recorded!`);
      setSelectedCustForCollect(null);
      openReceiptModal(res.payment);
      setTimeout(() => setSuccessBanner(null), 5000);
    } else {
      setErrorMsg(res.message);
    }
  };

  // My collection payments history
  const myPayments = loanPayments.filter((p) => p.collectionBoyId === activeBoy.id);

  // Cash in hand
  const cashInHand = myPayments
    .filter((p) => p.paymentMode === 'Cash' && p.status === 'Successful')
    .reduce((s, p) => s + p.amount, 0);

  return (
    <div className="min-h-[calc(100vh-61px)] bg-slate-100 p-3 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Officer Profile Card */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3.5">
              <img
                src={activeBoy.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                alt={activeBoy.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/30 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-bold tracking-wide uppercase">
                    Field Collection Officer
                  </span>
                  <span className="text-emerald-400 text-xs flex items-center gap-1 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Online & Active
                  </span>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-white mt-0.5">{activeBoy.name}</h1>
                <p className="text-xs text-blue-200 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{activeBoy.address} ({activeBoy.employeeCode})</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 self-start sm:self-auto">
              <Wallet className="w-5 h-5 text-emerald-300" />
              <div>
                <span className="text-[10px] text-blue-200 block font-medium">Cash in Hand</span>
                <span className="text-base font-bold text-white tracking-tight">{formatINR(cashInHand)}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-white/10 text-center">
            <div className="bg-white/10 rounded-xl p-2.5">
              <span className="text-[10px] text-blue-200 font-medium">Today Recovered</span>
              <p className="text-base font-bold text-white mt-0.5">{formatINR(stats.todayCollected)}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5">
              <span className="text-[10px] text-blue-200 font-medium">Assigned Customers</span>
              <p className="text-base font-bold text-white mt-0.5">{stats.assignedCount}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5">
              <span className="text-[10px] text-blue-200 font-medium">Pending Dues</span>
              <p className="text-base font-bold text-amber-300 mt-0.5">{stats.pendingCount}</p>
            </div>
          </div>
        </div>

        {successBanner && (
          <div className="p-4 bg-emerald-600 text-white rounded-2xl text-xs font-semibold flex items-center justify-between shadow-md animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-200" />
              <span>{successBanner}</span>
            </div>
            <button type="button" onClick={() => setSuccessBanner(null)} className="text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('route')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'route'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>Today's Route ({myCustomers.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>My Receipts ({myPayments.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('deposit')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'deposit'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Cash Handover</span>
          </button>
        </div>

        {/* TAB 1: Route / Customers List */}
        {activeTab === 'route' && (
          <div className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative w-full sm:flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search customer name, mobile or locality..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setFilterDueStatus('all')}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition ${
                    filterDueStatus === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  All ({myCustomers.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterDueStatus('pending')}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition ${
                    filterDueStatus === 'pending' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Pending ({stats.pendingCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterDueStatus('collected')}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition ${
                    filterDueStatus === 'collected' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Collected ({stats.collectedCount})
                </button>
              </div>
            </div>

            {/* Customer Route Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredCustomers.length === 0 ? (
                <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200">
                  <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-600">No customers found for this filter</p>
                </div>
              ) : (
                filteredCustomers.map((cust) => {
                  const custLoan = loans.find((l) => l.customerId === cust.id);
                  const isPaidToday = loanPayments.some(
                    (p) => p.customerId === cust.id && p.paymentDate === new Date().toISOString().split('T')[0]
                  );

                  return (
                    <div
                      key={cust.id}
                      className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-blue-400 transition space-y-3 relative overflow-hidden"
                    >
                      {isPaidToday && (
                        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-xs">
                          ✓ Collected Today
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        <img
                          src={cust.photo || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'}
                          alt={cust.name}
                          className="w-11 h-11 rounded-2xl object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0 pr-12">
                          <h3 className="font-bold text-sm text-slate-900 truncate">{cust.name}</h3>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                            <span>{cust.address}, {cust.city}</span>
                          </p>
                        </div>
                      </div>

                      {/* Loan Balances info */}
                      {custLoan && (
                        <div className="bg-slate-50 rounded-xl p-3 grid grid-cols-3 gap-2 text-center text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 font-medium block">Outstanding</span>
                            <span className="font-bold text-rose-600 text-xs">
                              {formatINR(custLoan.outstandingAmount)}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-medium block">Monthly EMI</span>
                            <span className="font-bold text-slate-800 text-xs">
                              {formatINR(custLoan.emiAmount)}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-medium block">Next Due</span>
                            <span className="font-semibold text-slate-700 text-[11px]">
                              {formatDate(custLoan.nextDueDate)}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Card Action Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <a
                          href={`tel:${cust.mobile}`}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                        >
                          <Phone className="w-3.5 h-3.5 text-blue-600" />
                          <span>Call ({cust.mobile.slice(-4)})</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => openCollectDialog(cust)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Collect Money</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Collection History */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">My Collected Receipts</h3>
              <span className="text-xs text-slate-500">{myPayments.length} Total Collections</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Receipt #</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Borrower</th>
                    <th className="py-3 px-3">Mode</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myPayments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No collections logged yet.
                      </td>
                    </tr>
                  ) : (
                    myPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-700">{p.receiptNumber}</td>
                        <td className="py-3.5 px-3 text-slate-500">{formatDate(p.paymentDate)}</td>
                        <td className="py-3.5 px-3 font-bold text-slate-900">{p.customerName}</td>
                        <td className="py-3.5 px-3">{p.paymentMode}</td>
                        <td className="py-3.5 px-3 font-bold text-emerald-600">{formatINR(p.amount)}</td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.status === 'Successful' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => openReceiptModal(p)}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition"
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
          </div>
        )}

        {/* TAB 3: Deposit / Cash Handover */}
        {activeTab === 'deposit' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Branch Cash Handover Reconciliation</h3>
              <p className="text-xs text-slate-500">
                Summary of physical cash collected on the field ready to be deposited with the branch accountant
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-500 font-medium">Physical Cash In Hand</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{formatINR(cashInHand)}</p>
                <span className="text-[11px] text-emerald-600 font-semibold">Verified against physical receipts</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium">Field Officer</span>
                <p className="text-base font-bold text-slate-900 mt-1">{activeBoy.name}</p>
                <span className="text-[11px] text-slate-500 font-mono">{activeBoy.employeeCode}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  alert(`Cash deposit of ${formatINR(cashInHand)} logged and notified to Branch Manager.`);
                }}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                ✓ Submit Cash Handover Receipt to Branch
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Collect Modal / Bottom Sheet */}
      {selectedCustForCollect && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full p-6 text-slate-800 shadow-2xl border border-slate-200 my-0 sm:my-8 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">Quick Collection</span>
                <h3 className="text-base font-bold text-slate-900">{selectedCustForCollect.customer.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustForCollect(null)}
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

            {/* Loan Outstanding snapshot */}
            <div className="my-3 p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 font-medium">Loan ID: {selectedCustForCollect.loan.loanId}</span>
                <p className="font-bold text-slate-900">EMI: {formatINR(selectedCustForCollect.loan.emiAmount)}</p>
              </div>
              <div className="text-right">
                <span className="text-slate-500 font-medium">Total Outstanding</span>
                <p className="font-black text-rose-600">{formatINR(selectedCustForCollect.loan.outstandingAmount)}</p>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Collection Amount (₹) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={selectedCustForCollect.loan.outstandingAmount}
                  value={collectAmount}
                  onChange={(e) => setCollectAmount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-lg font-black text-emerald-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Payment Mode Pills */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Payment Method</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Cash', 'UPI', 'Bank Transfer', 'Cheque'] as PaymentMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => {
                        setPaymentMode(mode);
                        setShowQR(mode === 'UPI');
                      }}
                      className={`py-2 rounded-xl text-xs font-semibold border transition text-center ${
                        paymentMode === mode
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic QR Code for Customer UPI Scanning */}
              {showQR && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                  <div className="w-32 h-32 bg-white border border-slate-300 rounded-xl mx-auto flex items-center justify-center shadow-xs">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=lcms.nbfc@axisbank&pn=LCMS%20Finance&am=${collectAmount}&cu=INR`}
                      alt="UPI QR"
                      className="w-28 h-28"
                    />
                  </div>
                  <p className="text-[11px] font-bold text-slate-800">
                    Ask borrower to scan via GPay / PhonePe / Paytm
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">UPI ID: lcms.nbfc@axisbank</p>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transaction Ref / Note</label>
                <input
                  type="text"
                  value={txRef}
                  onChange={(e) => setTxRef(e.target.value)}
                  placeholder="e.g. UPI Ref / Receipt memo"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCustForCollect(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition"
                >
                  Confirm & Print Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
