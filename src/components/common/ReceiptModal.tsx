import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDate, formatDateTime } from '../../utils/formatters';
import { Printer, Download, X, CheckCircle, ShieldCheck, QrCode } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { activeReceipt, closeReceiptModal, settings } = useApp();

  if (!activeReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto animate-in fade-in">
      <div className="bg-white text-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative my-6">
        {/* Top Header Bar */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-white">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">Payment Receipt</h3>
              <p className="text-[11px] text-slate-400">Official Computer-Generated Acknowledgment</p>
            </div>
          </div>
          <button
            id="close-receipt-btn"
            type="button"
            onClick={closeReceiptModal}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div id="printable-receipt-area" className="p-6 text-sm">
          {/* Company Brand Header */}
          <div className="text-center pb-4 border-b border-dashed border-slate-300">
            <h2 className="font-extrabold text-lg text-slate-900 tracking-tight">{settings.companyName}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{settings.companyAddress}</p>
            <p className="text-xs text-slate-500">
              Ph: {settings.companyPhone} | Email: {settings.companyEmail}
            </p>
          </div>

          {/* Receipt Meta */}
          <div className="grid grid-cols-2 gap-2 py-3 border-b border-dashed border-slate-200 text-xs bg-slate-50/80 -mx-6 px-6">
            <div>
              <span className="text-slate-500 block">Receipt No:</span>
              <span className="font-mono font-bold text-blue-700">{activeReceipt.receiptNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Date & Time:</span>
              <span className="font-semibold text-slate-800">{formatDateTime(activeReceipt.createdAt)}</span>
            </div>
          </div>

          {/* Customer & Loan Details */}
          <div className="py-3.5 space-y-2 border-b border-dashed border-slate-200 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Customer Name:</span>
              <span className="font-bold text-slate-900">{activeReceipt.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Loan ID:</span>
              <span className="font-mono font-semibold text-slate-800">{activeReceipt.loanId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Mobile Number:</span>
              <span className="font-medium text-slate-700">{activeReceipt.customerMobile}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Collected By:</span>
              <span className="font-semibold text-slate-800">{activeReceipt.collectionBoyName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Mode:</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">
                {activeReceipt.paymentMode} {activeReceipt.transactionReference ? `(${activeReceipt.transactionReference})` : ''}
              </span>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="py-4 space-y-2.5 bg-slate-50 rounded-xl p-4 my-3 border border-slate-200/80">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Previous Outstanding:</span>
              <span className="font-semibold">{formatINR(activeReceipt.previousOutstanding)}</span>
            </div>

            <div className="flex justify-between text-base font-extrabold text-emerald-700 pt-1 pb-1 border-y border-emerald-200">
              <span>Amount Received:</span>
              <span>{formatINR(activeReceipt.amount)}</span>
            </div>

            <div className="flex justify-between text-xs text-slate-600">
              <span>New Total Paid:</span>
              <span className="font-semibold text-slate-800">{formatINR(activeReceipt.newPaid)}</span>
            </div>

            <div className="flex justify-between text-xs font-bold text-rose-600">
              <span>Remaining Outstanding:</span>
              <span>{formatINR(activeReceipt.newOutstanding)}</span>
            </div>
          </div>

          {/* Remarks & QR Code simulation */}
          <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500 border-t border-slate-200">
            <div>
              <p><span className="font-semibold">Remarks:</span> {activeReceipt.remarks || 'Regular collection entry'}</p>
              <p className="mt-1 text-[10px] text-slate-400">Status: <strong className="text-emerald-600 uppercase">{activeReceipt.status}</strong></p>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="w-14 h-14 border border-slate-300 rounded p-1 bg-white flex items-center justify-center">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <span className="text-[9px] text-slate-400 mt-0.5">Scan to Verify</span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-[10px] text-slate-400 italic">
              {settings.receiptFooterNote}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-slate-100 px-6 py-3.5 border-t border-slate-200 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={closeReceiptModal}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 transition"
          >
            Close
          </button>
          <button
            id="print-receipt-action-btn"
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
