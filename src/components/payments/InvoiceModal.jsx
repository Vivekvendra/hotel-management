import React from 'react';
import { Printer, Download, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import Modal from '../common/Modal';

export default function InvoiceModal({ isOpen, onClose, invoice }) {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.success(`Invoice ${invoice.invoiceNo} PDF downloaded successfully!`);
  };

  const subtotal = invoice.tariff || invoice.amount * 0.85;
  const taxAmount = invoice.tax || invoice.amount * 0.12;
  const serviceCharge = invoice.serviceFee || 50;
  const grandTotal = invoice.amount;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tax Invoice Dossier" size="lg">
      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 space-y-6 text-xs text-stone-800">
        
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#8C6D3B] text-white flex items-center justify-center font-bold text-sm">
                GA
              </span>
              <div>
                <h2 className="text-lg font-bold text-stone-900 tracking-tight">THE GRAND AZURE</h2>
                <p className="text-[11px] text-stone-400">Luxury Resort & Coastal Sanctuary</p>
              </div>
            </div>
            <div className="mt-3 text-stone-500 text-[11px] space-y-0.5">
              <p>420 Azure Boulevard, Marina District</p>
              <p>concierge@grandazure.com • +1 (800) 555-AZURE</p>
              <p>GSTIN / Tax ID: 07AAACG0128K1Z4</p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
              {invoice.status}
            </span>
            <div className="font-mono text-stone-900 font-bold text-base">{invoice.invoiceNo}</div>
            <div className="text-[11px] text-stone-400 mt-1">Date: {invoice.date || '2026-09-24'}</div>
            <div className="text-[11px] text-stone-400">Booking Ref: {invoice.bookingId}</div>
          </div>
        </div>

        {/* Bill To & Stay Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-100">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
              Billed To Guest
            </div>
            <div className="font-bold text-stone-900 text-sm">{invoice.guestName}</div>
            <div className="text-stone-500 text-[11px]">{invoice.guestEmail}</div>
            <div className="text-stone-500 text-[11px] mt-1">Payment Method: {invoice.method || 'Credit Card'}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
              Accommodation Particulars
            </div>
            <div className="font-semibold text-stone-900">
              Room {invoice.roomNumber} ({invoice.roomType})
            </div>
            <div className="text-stone-500 text-[11px] mt-0.5">Luxury hospitality tier with private balcony</div>
            <div className="text-stone-500 text-[11px]">Settlement Status: Authorized & Cleared</div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-stone-200 text-stone-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5">Item Description</th>
                <th className="py-2.5 text-center">Category</th>
                <th className="py-2.5 text-right">Rate</th>
                <th className="py-2.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              <tr>
                <td className="py-3">
                  <div className="font-semibold text-stone-900">Room Accommodation Tariff</div>
                  <div className="text-[11px] text-stone-400">Scheduled accommodation stay</div>
                </td>
                <td className="py-3 text-center text-stone-500">Tariff</td>
                <td className="py-3 text-right font-mono text-stone-700">${Math.round(subtotal).toLocaleString()}</td>
                <td className="py-3 text-right font-mono font-medium text-stone-900">${Math.round(subtotal).toLocaleString()}</td>
              </tr>
              <tr>
                <td className="py-3">
                  <div className="font-semibold text-stone-900">Luxury State & Hospitality Tax (12%)</div>
                  <div className="text-[11px] text-stone-400">Statutory municipal luxury assessment</div>
                </td>
                <td className="py-3 text-center text-stone-500">Tax</td>
                <td className="py-3 text-right font-mono text-stone-700">12%</td>
                <td className="py-3 text-right font-mono font-medium text-stone-900">${Math.round(taxAmount).toLocaleString()}</td>
              </tr>
              <tr>
                <td className="py-3">
                  <div className="font-semibold text-stone-900">Concierge & Resort Amenities Fee</div>
                  <div className="text-[11px] text-stone-400">Infinity pool, high-speed fiber, wellness suite access</div>
                </td>
                <td className="py-3 text-center text-stone-500">Service</td>
                <td className="py-3 text-right font-mono text-stone-700">$50.00</td>
                <td className="py-3 text-right font-mono font-medium text-stone-900">${serviceCharge.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="flex justify-end pt-2 border-t border-stone-100">
          <div className="w-64 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-500">
              <span>Subtotal:</span>
              <span className="font-mono text-stone-800">${Math.round(subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Luxury Tax (12%):</span>
              <span className="font-mono text-stone-800">${Math.round(taxAmount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Service Charge:</span>
              <span className="font-mono text-stone-800">${serviceCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-900 font-bold text-sm pt-2 border-t border-stone-200">
              <span>Grand Total:</span>
              <span className="font-mono text-[#8C6D3B] text-base">${grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Certified Official Digital Tax Invoice</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="px-3.5 py-2 rounded-full border border-stone-200 text-stone-700 hover:bg-stone-50 font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              type="button"
              className="px-4 py-2 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
