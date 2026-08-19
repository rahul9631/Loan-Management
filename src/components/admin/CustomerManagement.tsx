import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer, Loan } from '../../types';
import { formatINR, formatDate } from '../../utils/formatters';
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  Phone,
  CreditCard,
  UserCheck,
  CheckCircle,
  XCircle,
  X,
  Upload,
} from 'lucide-react';

interface CustomerManagementProps {
  onViewCustomerDetail: (customerId: string) => void;
}

export const CustomerManagement: React.FC<CustomerManagementProps> = ({ onViewCustomerDetail }) => {
  const { customers, loans, collectionBoys, addCustomer, updateCustomer, deleteCustomer } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [agentFilter, setAgentFilter] = useState('All');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    mobile: '',
    alternateMobile: '',
    email: '',
    dob: '1990-01-01',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    address: '',
    city: 'Patna',
    state: 'Bihar',
    pincode: '800001',
    status: 'Active' as 'Active' | 'Inactive',
    assignedCollectionBoyId: 'cb-1',
  });

  const [formError, setFormError] = useState('');

  const openCreateModal = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      fatherName: '',
      mobile: '',
      alternateMobile: '',
      email: '',
      dob: '1990-01-01',
      gender: 'Male',
      address: '',
      city: 'Patna',
      state: 'Bihar',
      pincode: '800001',
      status: 'Active',
      assignedCollectionBoyId: collectionBoys[0]?.id || 'cb-1',
    });
    setFormError('');
    setShowAddModal(true);
  };

  const openEditModal = (c: Customer) => {
    setEditingCustomer(c);
    setFormData({
      name: c.name,
      fatherName: c.fatherName,
      mobile: c.mobile,
      alternateMobile: c.alternateMobile || '',
      email: c.email,
      dob: c.dob,
      gender: c.gender,
      address: c.address,
      city: c.city,
      state: c.state,
      pincode: c.pincode,
      status: c.status,
      assignedCollectionBoyId: c.assignedCollectionBoyId || 'cb-1',
    });
    setFormError('');
    setShowAddModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.mobile.trim()) {
      setFormError('Customer Full Name and Mobile Number are required.');
      return;
    }

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, formData);
    } else {
      addCustomer(formData);
    }
    setShowAddModal(false);
  };

  // Filter list
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.mobile.includes(searchTerm) ||
      c.customerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesAgent = agentFilter === 'All' || c.assignedCollectionBoyId === agentFilter;

    return matchesSearch && matchesStatus && matchesAgent;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Customer Management</h2>
          <p className="text-xs text-slate-500">
            Total {customers.length} registered borrowers and profile records
          </p>
        </div>

        <button
          id="add-customer-main-btn"
          type="button"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Customer</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="search-customer-input"
            type="text"
            placeholder="Search by Name, Mobile, Customer ID or City..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-auto flex items-center gap-2">
          <select
            id="filter-cust-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            id="filter-cust-agent"
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="All">All Collection Boys</option>
            {collectionBoys.map((cb) => (
              <option key={cb.id} value={cb.id}>
                {cb.name} ({cb.employeeCode})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Customer List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-3">Mobile & Email</th>
                <th className="py-3 px-3">Loan ID</th>
                <th className="py-3 px-3">Loan Amount</th>
                <th className="py-3 px-3">Total Paid</th>
                <th className="py-3 px-3">Outstanding</th>
                <th className="py-3 px-3">Assigned Agent</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No customers match your criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const custLoan = loans.find((l) => l.customerId === cust.id);
                  const cb = collectionBoys.find((b) => b.id === cust.assignedCollectionBoyId);
                  return (
                    <tr key={cust.id} className="hover:bg-slate-50/80 transition">
                      {/* Customer info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={cust.photo || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'}
                            alt={cust.name}
                            className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                          />
                          <div>
                            <button
                              type="button"
                              onClick={() => onViewCustomerDetail(cust.id)}
                              className="font-bold text-slate-900 hover:text-blue-600 text-left block"
                            >
                              {cust.name}
                            </button>
                            <span className="text-[11px] text-slate-400 font-mono">{cust.customerCode}</span>
                          </div>
                        </div>
                      </td>

                      {/* Mobile & Email */}
                      <td className="py-3.5 px-3">
                        <p className="font-medium text-slate-800">{cust.mobile}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{cust.email}</p>
                      </td>

                      {/* Loan ID */}
                      <td className="py-3.5 px-3 font-mono font-semibold text-blue-600">
                        {custLoan ? custLoan.loanId : '-'}
                      </td>

                      {/* Loan Amount */}
                      <td className="py-3.5 px-3 font-semibold text-slate-800">
                        {custLoan ? formatINR(custLoan.principalAmount) : '-'}
                      </td>

                      {/* Paid */}
                      <td className="py-3.5 px-3 font-semibold text-emerald-600">
                        {custLoan ? formatINR(custLoan.totalPaid) : '₹0'}
                      </td>

                      {/* Outstanding */}
                      <td className="py-3.5 px-3 font-bold text-rose-600">
                        {custLoan ? formatINR(custLoan.outstandingAmount) : '₹0'}
                      </td>

                      {/* Collection Agent */}
                      <td className="py-3.5 px-3">
                        {cb ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            {cb.name}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Unassigned</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            cust.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {cust.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onViewCustomerDetail(cust.id)}
                            title="View Full Profile & Payment History"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(cust)}
                            title="Edit Customer"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteCustomer(cust.id)}
                            title="Delete Customer"
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 text-slate-800 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {editingCustomer ? 'Edit Customer Information' : 'Add New Customer'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
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

            <form onSubmit={handleFormSubmit} className="space-y-3.5 mt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Singh"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Father's / Guardian Name</label>
                  <input
                    type="text"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    placeholder="e.g. Shri Gopal Singh"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="customer@email.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
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

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Residential Address</label>
                <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="House number, Street, Locality"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
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
                      {cb.name} ({cb.employeeCode}) - {cb.address}
                    </option>
                  ))}
                </select>
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
                  {editingCustomer ? 'Save Changes' : 'Create Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
