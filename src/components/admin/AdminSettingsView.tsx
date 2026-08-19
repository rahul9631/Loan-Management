import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Save, CheckCircle2, Building, ShieldCheck, Receipt, Sliders } from 'lucide-react';

export const AdminSettingsView: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">System Settings & Configuration</h2>
          <p className="text-xs text-slate-500">
            Company information, receipt numbering scheme, OTP controls, and lending policies
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Profile Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-200">
            <Building className="w-4 h-4 text-blue-600" />
            <span>Company Profile & Branding</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company / NBFC Name</label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Helpline Phone Number</label>
              <input
                type="text"
                value={form.companyPhone}
                onChange={(e) => setForm({ ...form, companyPhone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Support Email Address</label>
              <input
                type="email"
                value={form.companyEmail}
                onChange={(e) => setForm({ ...form, companyEmail: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Website URL</label>
              <input
                type="text"
                value={form.companyWebsite}
                onChange={(e) => setForm({ ...form, companyWebsite: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Head Office Address</label>
              <input
                type="text"
                value={form.companyAddress}
                onChange={(e) => setForm({ ...form, companyAddress: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Receipt & Verification Settings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-200">
            <Receipt className="w-4 h-4 text-blue-600" />
            <span>Receipts & Verification Controls</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Receipt Prefix</label>
              <input
                type="text"
                value={form.receiptPrefix}
                onChange={(e) => setForm({ ...form, receiptPrefix: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Due Grace Period (Days)</label>
              <input
                type="number"
                value={form.dueGracePeriodDays}
                onChange={(e) => setForm({ ...form, dueGracePeriodDays: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Receipt Footer Note</label>
              <textarea
                rows={2}
                value={form.receiptFooterNote}
                onChange={(e) => setForm({ ...form, receiptFooterNote: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-4 border-t border-slate-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.enableOtpVerification}
                onChange={(e) => setForm({ ...form, enableOtpVerification: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="font-semibold text-slate-800">Enable OTP Verification for Customer Portal Lookup</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.enableOverpayment}
                onChange={(e) => setForm({ ...form, enableOverpayment: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="font-semibold text-slate-800">Allow Collection Above Outstanding Balance</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            id="save-settings-btn"
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition"
          >
            <Save className="w-4 h-4" />
            <span>Save All Configurations</span>
          </button>
        </div>
      </form>
    </div>
  );
};
