import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDate } from '../../utils/formatters';
import {
  Users,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Wallet,
  Calendar,
  UserCheck,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Receipt as ReceiptIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { LoanPayment, Customer, Loan } from '../../types';

interface AdminDashboardProps {
  onSelectCustomer?: (customerId: string) => void;
  onViewCustomerDetail?: (customerId: string) => void;
  onNavigateTab?: (tab: any) => void;
  onNavigate?: (tab: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSelectCustomer,
  onViewCustomerDetail,
  onNavigateTab,
  onNavigate,
}) => {
  const handleSelectCustomer = (id: string) => {
    if (onSelectCustomer) onSelectCustomer(id);
    if (onViewCustomerDetail) onViewCustomerDetail(id);
  };

  const handleNavigate = (tab: any) => {
    if (onNavigateTab) onNavigateTab(tab);
    if (onNavigate) onNavigate(tab);
  };

  const { adminStats, loanPayments, loans, customers, openReceiptModal } = useApp();
  const [dateFilter, setDateFilter] = useState('01 May 2024 - 31 May 2024');
  const [filterPreset, setFilterPreset] = useState('this_month');

  // Chart 1: Collection Overview data
  const trendData = [
    { date: '01 May', collected: 15, outstanding: 75 },
    { date: '08 May', collected: 28, outstanding: 70 },
    { date: '15 May', collected: 45, outstanding: 62 },
    { date: '22 May', collected: 58, outstanding: 54 },
    { date: '31 May', collected: 72, outstanding: 46 },
  ];

  // Chart 2: Collection by Collection Boy Donut Data
  const pieData = [
    { name: 'Ramesh Kumar', value: 825000, color: '#3b82f6' },
    { name: 'Suresh Yadav', value: 675000, color: '#10b981' },
    { name: 'Mohan Singh', value: 550000, color: '#f59e0b' },
    { name: 'Pankaj Kumar', value: 425000, color: '#ef4444' },
    { name: 'Arvind Kumar', value: 375000, color: '#8b5cf6' },
    { name: 'Others', value: 700000, color: '#06b6d4' },
  ];

  const recentPayments = loanPayments.slice(0, 5);

  // Top outstanding loans
  const sortedOutstandingLoans = [...loans]
    .filter((l) => l.outstandingAmount > 0)
    .sort((a, b) => b.outstandingAmount - a.outstandingAmount)
    .slice(0, 5);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar: Title and Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard</h2>
          <p className="text-xs text-slate-500">Real-time Loan Portfolio & Collection Overview</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              id="admin-date-filter-select"
              value={filterPreset}
              onChange={(e) => {
                setFilterPreset(e.target.value);
                if (e.target.value === 'today') setDateFilter('Today (31 May 2024)');
                else if (e.target.value === 'this_week') setDateFilter('25 May 2024 - 31 May 2024');
                else if (e.target.value === 'this_month') setDateFilter('01 May 2024 - 31 May 2024');
                else setDateFilter('All Time');
              }}
              className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none pr-8 cursor-pointer"
            >
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">01 May 2024 - 31 May 2024</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <button
            id="admin-apply-filter-btn"
            type="button"
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-xs"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* 8 KPI Cards Grid - Matching visual reference */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Total Customers */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5 hover:border-blue-300 transition">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Customers</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900">{adminStats.totalCustomers.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Card 2: Total Loan Amount */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5 hover:border-emerald-300 transition">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Loan Amount</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900">{formatINR(adminStats.totalLoanAmount)}</p>
          </div>
        </div>

        {/* Card 3: Total Collected */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5 hover:border-green-300 transition">
          <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Collected</p>
            <p className="text-lg sm:text-xl font-bold text-emerald-700">{formatINR(adminStats.totalCollected)}</p>
          </div>
        </div>

        {/* Card 4: Total Outstanding */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5 hover:border-rose-300 transition">
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Outstanding</p>
            <p className="text-lg sm:text-xl font-bold text-rose-600">{formatINR(adminStats.totalOutstanding)}</p>
          </div>
        </div>

        {/* Card 5: Today Collection */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5 hover:border-emerald-300 transition">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Today Collection</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900">{formatINR(adminStats.todayCollection)}</p>
          </div>
        </div>

        {/* Card 6: This Week Collection */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5 hover:border-amber-300 transition">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">This Week Collection</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900">{formatINR(adminStats.thisWeekCollection)}</p>
          </div>
        </div>

        {/* Card 7: This Month Collection */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5 hover:border-blue-300 transition">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">This Month Collection</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900">{formatINR(adminStats.thisMonthCollection)}</p>
          </div>
        </div>

        {/* Card 8: Total Collection Boys */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5 hover:border-purple-300 transition">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Collection Boys</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900">{adminStats.totalCollectionBoys}</p>
          </div>
        </div>
      </div>

      {/* Charts Row: Collection Overview & Collection By Collection Boy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Collection Overview Line Chart */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Collection Overview</h3>
              <p className="text-xs text-slate-500">Monthly recovery velocity and dues reduction</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                Collected Amount
              </span>
              <span className="flex items-center gap-1.5 text-rose-500">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                Outstanding Amount
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `${val}L`}
                />
                <Tooltip
                  formatter={(val: any) => [`₹${val} Lakh`, '']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="collected"
                  name="Collected Amount"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10b981' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="outstanding"
                  name="Outstanding Amount"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#ef4444' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Collection By Collection Boy Donut Chart */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Collection By Collection Boy</h3>
            <p className="text-xs text-slate-500">Target fulfillment distribution</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 my-2">
            <div className="sm:col-span-6 relative h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [formatINR(val), 'Collected']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-xs font-bold text-slate-900 leading-tight">₹35,50,000</span>
                <span className="text-[10px] text-slate-500">This Month</span>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="sm:col-span-6 space-y-1.5 text-xs">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-600 truncate">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-800 shrink-0">
                    {formatINR(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            id="view-all-agents-btn"
            type="button"
            onClick={() => handleNavigate('collection_boys')}
            className="w-full text-center text-xs font-semibold text-blue-600 hover:text-blue-700 py-1.5 rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-1"
          >
            <span>View All Agent Performances</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Tables Row: Recent Collections & Top Outstanding Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Collections Table */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Recent Collections</h3>
              <p className="text-xs text-slate-500">Latest successful payment acknowledgments</p>
            </div>
            <button
              id="view-all-collections-btn"
              type="button"
              onClick={() => handleNavigate('collections')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              View All Collections &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Customer Name</th>
                  <th className="py-2.5 px-3">Loan ID</th>
                  <th className="py-2.5 px-3">Collection Boy</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Payment Date</th>
                  <th className="py-2.5 px-3">Remaining</th>
                  <th className="py-2.5 px-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentPayments.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-medium text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => handleSelectCustomer(p.customerId)}
                        className="font-semibold text-blue-600 hover:underline text-left"
                      >
                        {p.customerName}
                      </button>
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-slate-700">{p.loanId}</td>
                    <td className="py-3 px-3 text-slate-700">{p.collectionBoyName}</td>
                    <td className="py-3 px-3 font-bold text-emerald-600">{formatINR(p.amount)}</td>
                    <td className="py-3 px-3">{formatDate(p.paymentDate)}</td>
                    <td className="py-3 px-3 font-semibold text-rose-600">
                      {formatINR(p.newOutstanding)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => openReceiptModal(p)}
                        title="View Official Receipt"
                        className="p-1 rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition inline-flex items-center gap-1"
                      >
                        <ReceiptIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Outstanding Customers */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Top Outstanding</h3>
              <p className="text-xs text-slate-500">Highest loan balances</p>
            </div>
            <button
              id="view-due-btn"
              type="button"
              onClick={() => handleNavigate('due_outstanding')}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700"
            >
              Manage &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Customer Name</th>
                  <th className="py-2.5 px-3 text-right">Outstanding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedOutstandingLoans.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => handleSelectCustomer(l.customerId)}
                        className="font-semibold text-slate-800 hover:text-blue-600 text-left block"
                      >
                        {l.customerName}
                      </button>
                      <span className="text-[10px] text-slate-400 font-mono">{l.loanId}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-rose-600">
                      {formatINR(l.outstandingAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
