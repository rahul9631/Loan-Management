import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDateTime } from '../../utils/formatters';
import { ArrowLeftRight, UserCheck, Search, CheckCircle2, History, AlertCircle } from 'lucide-react';

export const CustomerAssignmentsView: React.FC = () => {
  const { customers, loans, collectionBoys, assignments, assignCustomerToCollectionBoy } = useApp();
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]?.id || '');
  const [selectedCollectionBoy, setSelectedCollectionBoy] = useState(collectionBoys[0]?.id || '');
  const [remarks, setRemarks] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !selectedCollectionBoy) return;

    assignCustomerToCollectionBoy(selectedCustomer, selectedCollectionBoy, remarks);
    setFeedback('Customer territory successfully reassigned!');
    setRemarks('');
    setTimeout(() => setFeedback(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Customer Assignment & Portfolio Allocation</h2>
        <p className="text-xs text-slate-500">
          Assign borrowers to field collection officers, balance territory portfolios, and track transfer history
        </p>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Assignment Control Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
          <ArrowLeftRight className="w-4 h-4 text-blue-600" />
          <span>Assign / Transfer Customer Portfolio</span>
        </h3>

        <form onSubmit={handleAssign} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Customer</label>
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
            >
              {customers.map((c) => {
                const currentCB = collectionBoys.find((b) => b.id === c.assignedCollectionBoyId);
                return (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.customerCode}) — Currently: {currentCB ? currentCB.name : 'Unassigned'}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Assign to Field Officer (Collection Boy)</label>
            <select
              value={selectedCollectionBoy}
              onChange={(e) => setSelectedCollectionBoy(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
            >
              {collectionBoys.map((cb) => (
                <option key={cb.id} value={cb.id}>
                  {cb.name} ({cb.employeeCode}) — {cb.address}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Transfer Remarks</label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Area reallocation / Route change"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end">
            <button
              id="confirm-assignment-btn"
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Confirm & Transfer Customer</span>
            </button>
          </div>
        </form>
      </div>

      {/* Assignment Audit History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            <span>Assignment & Transfer Logs</span>
          </h3>
          <span className="text-xs text-slate-500">{assignments.length} Logged Events</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Loan ID</th>
                <th className="py-3 px-4">Assigned Collection Boy</th>
                <th className="py-3 px-4">Assigned By</th>
                <th className="py-3 px-4">Assigned Date & Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assignments.map((asgn) => (
                <tr key={asgn.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-bold text-slate-900">{asgn.customerName}</td>
                  <td className="py-3 px-4 font-mono text-blue-600">{asgn.loanId}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{asgn.collectionBoyName}</td>
                  <td className="py-3 px-4 text-slate-600">{asgn.assignedBy}</td>
                  <td className="py-3 px-4 text-slate-500">{formatDateTime(asgn.assignedAt)}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        asgn.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {asgn.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{asgn.remarks || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
