import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CollectionBoy } from '../../types';
import { formatINR } from '../../utils/formatters';
import {
  UserCheck,
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  XCircle,
  X,
  Target,
  Users,
} from 'lucide-react';

export const CollectionBoysManagement: React.FC = () => {
  const { collectionBoys, customers, loanPayments, addCollectionBoy, updateCollectionBoy, toggleCollectionBoyStatus } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBoy, setEditingBoy] = useState<CollectionBoy | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    mobile: '',
    email: '',
    address: '',
    joiningDate: '2024-01-01',
    status: 'Active' as 'Active' | 'Inactive',
    monthlyTarget: 100000,
  });

  const [errorMsg, setErrorMsg] = useState('');

  const openCreateModal = () => {
    setEditingBoy(null);
    setFormData({
      name: '',
      username: '',
      mobile: '',
      email: '',
      address: '',
      joiningDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      monthlyTarget: 100000,
    });
    setErrorMsg('');
    setShowAddModal(true);
  };

  const openEditModal = (boy: CollectionBoy) => {
    setEditingBoy(boy);
    setFormData({
      name: boy.name,
      username: boy.username,
      mobile: boy.mobile,
      email: boy.email,
      address: boy.address,
      joiningDate: boy.joiningDate,
      status: boy.status,
      monthlyTarget: boy.monthlyTarget || 100000,
    });
    setErrorMsg('');
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.username.trim() || !formData.mobile.trim()) {
      setErrorMsg('Name, Username, and Mobile Number are required.');
      return;
    }

    if (editingBoy) {
      updateCollectionBoy(editingBoy.id, formData);
    } else {
      addCollectionBoy(formData);
    }
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Collection Boy Management</h2>
          <p className="text-xs text-slate-500">
            Manage on-field collection staff credentials, assigned portfolios, and targets
          </p>
        </div>

        <button
          id="add-collection-boy-btn"
          type="button"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Collection Boy</span>
        </button>
      </div>

      {/* Main Table - Matching Screenshot "ADMIN - COLLECTION BOY MANAGEMENT" */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Collection Boys List</h3>
          <span className="text-xs text-slate-500 font-medium">{collectionBoys.length} Total Field Officers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Mobile Number</th>
                <th className="py-3 px-4">Assigned Customers</th>
                <th className="py-3 px-4">Monthly Target</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {collectionBoys.map((cb, idx) => {
                const assignedCount = customers.filter((c) => c.assignedCollectionBoyId === cb.id).length;
                return (
                  <tr key={cb.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-medium text-slate-400">{idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={cb.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                          alt={cb.name}
                          className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{cb.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{cb.employeeCode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">{cb.username}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{cb.mobile}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold text-[11px]">
                        <Users className="w-3 h-3" />
                        {assignedCount} Customers
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {formatINR(cb.monthlyTarget || 100000)}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => toggleCollectionBoyStatus(cb.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition ${
                          cb.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cb.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {cb.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(cb)}
                          title="Edit Collection Boy"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleCollectionBoyStatus(cb.id)}
                          title={cb.status === 'Active' ? 'Deactivate' : 'Activate'}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar from Screenshot: 1 2 3 Next */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Showing 1 to {collectionBoys.length} of {collectionBoys.length} entries</span>
          <div className="flex items-center gap-1">
            <button type="button" className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">1</button>
            <button type="button" className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 text-xs flex items-center justify-center">2</button>
            <button type="button" className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 text-xs flex items-center justify-center">3</button>
            <button type="button" className="px-2.5 h-7 rounded-lg hover:bg-slate-100 text-slate-600 text-xs flex items-center justify-center font-medium">Next</button>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-slate-800 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {editingBoy ? 'Edit Collection Boy' : 'Add New Collection Boy'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
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

            <form onSubmit={handleSubmit} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                    placeholder="e.g. ramesh123"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="10-digit mobile"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ramesh@lcms.in"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Territory / Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Patna Zone A / Fraser Road"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monthly Target (₹)</label>
                  <input
                    type="number"
                    value={formData.monthlyTarget}
                    onChange={(e) => setFormData({ ...formData, monthlyTarget: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  {editingBoy ? 'Save Changes' : 'Create Collection Boy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
