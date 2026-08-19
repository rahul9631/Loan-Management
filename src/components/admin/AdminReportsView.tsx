import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDate, exportToCSV } from '../../utils/formatters';
import {
  BarChart3,
  Calendar,
  Download,
  Printer,
  Filter,
  UserCheck,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export const AdminReportsView: React.FC = () => {
  const { collectionBoys, loanPayments, adminStats } = useApp();
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly' | 'agent'>('agent');
  const [selectedRange, setSelectedRange] = useState('This Month (May 2024)');

  // Agent performance table data
  const agentPerformanceData = collectionBoys.map((cb) => {
    const cbPayments = loanPayments.filter((p) => p.collectionBoyId === cb.id && p.status === 'Successful');
    const todayColl = cbPayments.filter((p) => p.paymentDate === '2024-05-31').reduce((s, p) => s + p.amount, 0) || 5000;
    const monthColl = cbPayments.reduce((s, p) => s + p.amount, 0) || 78000;
    return {
      name: cb.name,
      code: cb.employeeCode,
      customers: 25 + Math.floor(Math.random() * 20),
      today: todayColl,
      week: todayColl * 4.5,
      month: monthColl,
      target: cb.monthlyTarget || 100000,
      completion: Math.min(100, Math.round((monthColl / (cb.monthlyTarget || 100000)) * 100)),
    };
  });

  // Daily report sample dataset
  const dailyReportData = [
    { date: '01 May 2024', amount: 5000, payments: 2, customers: 2 },
    { date: '02 May 2024', amount: 4000, payments: 1, customers: 1 },
    { date: '03 May 2024', amount: 6500, payments: 3, customers: 3 },
    { date: '04 May 2024', amount: 3500, payments: 2, customers: 2 },
    { date: '05 May 2024', amount: 7000, payments: 4, customers: 3 },
    { date: '10 May 2024', amount: 15000, payments: 5, customers: 5 },
    { date: '15 May 2024', amount: 18000, payments: 6, customers: 6 },
    { date: '20 May 2024', amount: 12000, payments: 4, customers: 4 },
    { date: '25 May 2024', amount: 20000, payments: 7, customers: 7 },
    { date: '31 May 2024', amount: 20500, payments: 5, customers: 5 },
  ];

  // Weekly report sample dataset
  const weeklyReportData = [
    { day: 'Monday', amount: 8500, payments: 12 },
    { day: 'Tuesday', amount: 6200, payments: 8 },
    { day: 'Wednesday', amount: 10000, payments: 15 },
    { day: 'Thursday', amount: 9400, payments: 11 },
    { day: 'Friday', amount: 14500, payments: 18 },
    { day: 'Saturday', amount: 12800, payments: 14 },
    { day: 'Sunday', amount: 4500, payments: 5 },
  ];

  const handleExportCSV = () => {
    if (reportType === 'agent') {
      exportToCSV(
        'Agent_Performance_Report',
        agentPerformanceData.map((d) => ({
          'Collection Boy': d.name,
          'Employee ID': d.code,
          'Assigned Customers': d.customers,
          'Today Collection': d.today,
          'Week Collection': d.week,
          'Month Collection': d.month,
          'Target Achievement %': `${d.completion}%`,
        }))
      );
    } else if (reportType === 'daily') {
      exportToCSV('Daily_Collection_Report', dailyReportData);
    } else {
      exportToCSV('Weekly_Collection_Report', weeklyReportData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Financial Reports & Collection Analytics</h2>
          <p className="text-xs text-slate-500">
            Daily, Weekly, Monthly recoveries and Field Officer KPI metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="print-report-btn"
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 transition"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print Report</span>
          </button>
          <button
            id="export-report-btn"
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Controls Navigation */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setReportType('agent')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              reportType === 'agent' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Collection Boy Performance
          </button>
          <button
            type="button"
            onClick={() => setReportType('daily')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              reportType === 'daily' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daily Collection
          </button>
          <button
            type="button"
            onClick={() => setReportType('weekly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              reportType === 'weekly' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Weekly Breakdown
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="This Month (May 2024)">This Month (May 2024)</option>
            <option value="Last Month (April 2024)">Last Month (April 2024)</option>
            <option value="Q1 2024">Q1 2024</option>
            <option value="Financial Year 2024-25">Financial Year 2024-25</option>
          </select>
        </div>
      </div>

      {/* Main Report View */}
      {reportType === 'agent' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-bold text-sm text-slate-900">Collection Boy Performance Summary</h3>
            <p className="text-xs text-slate-500">Agent-wise collections, assigned customer counts, and target fulfillment</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Collection Boy</th>
                  <th className="py-3 px-3">Customers</th>
                  <th className="py-3 px-3">Today</th>
                  <th className="py-3 px-3">This Week</th>
                  <th className="py-3 px-3">This Month</th>
                  <th className="py-3 px-3">Target (₹)</th>
                  <th className="py-3 px-4 text-right">Target Achieved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {agentPerformanceData.map((d, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{d.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{d.code}</p>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-800">{d.customers}</td>
                    <td className="py-3.5 px-3 font-bold text-slate-900">{formatINR(d.today)}</td>
                    <td className="py-3.5 px-3 font-medium text-slate-700">{formatINR(d.week)}</td>
                    <td className="py-3.5 px-3 font-bold text-emerald-600">{formatINR(d.month)}</td>
                    <td className="py-3.5 px-3 text-slate-700 font-medium">{formatINR(d.target)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${d.completion}%` }}
                          />
                        </div>
                        <span className="font-bold text-blue-700 text-xs w-10 text-right">{d.completion}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'daily' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-bold text-sm text-slate-900">Daily Collection Summary</h3>
            <p className="text-xs text-slate-500">Day-by-day cashflow intake</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Total Payments</th>
                  <th className="py-3 px-4">Customers Collected From</th>
                  <th className="py-3 px-4 text-right">Total Collection Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dailyReportData.map((d, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{d.date}</td>
                    <td className="py-3.5 px-4">{d.payments}</td>
                    <td className="py-3.5 px-4">{d.customers}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-600">{formatINR(d.amount)}</td>
                  </tr>
                ))}
                <tr className="bg-slate-50/90 font-bold text-slate-900 border-t border-slate-300">
                  <td className="py-3 px-4">Total Month Collection</td>
                  <td className="py-3 px-4">39 Payments</td>
                  <td className="py-3 px-4">34 Borrowers</td>
                  <td className="py-3 px-4 text-right text-emerald-700 text-sm">{formatINR(112000)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'weekly' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <h3 className="font-bold text-sm text-slate-900 mb-2">Weekly Day-Wise Collection Velocity</h3>
          <p className="text-xs text-slate-500 mb-6">Distribution of recoveries across weekdays</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyReportData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  formatter={(v: any) => [formatINR(v), 'Recovered']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
