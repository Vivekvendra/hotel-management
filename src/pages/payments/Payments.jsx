import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  Search,
  FileText,
  Plus,
  Clock,
  RotateCcw,
  ArrowUpRight,
  Receipt
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useHotel } from '../../context/HotelContext';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import InvoiceModal from '../../components/payments/InvoiceModal';

export default function Payments() {
  const { payments, recordPayment, updatePaymentStatus, bookings } = useHotel();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');

  // Active Invoice View
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // New Payment Modal State
  const [isNewPaymentModalOpen, setIsNewPaymentModalOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    bookingId: '',
    guestName: '',
    roomNumber: '',
    amount: '',
    method: 'Credit Card (Visa)',
    status: 'Paid',
    notes: 'Direct settlement at reception'
  });

  // Calculate Financial Summaries
  const totalRevenue = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const pendingPayments = payments
    .filter(p => p.status === 'Pending')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const refundedAmount = payments
    .filter(p => p.status === 'Refunded')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const todayCollections = payments
    .filter(p => p.status === 'Paid' && p.date === '2026-09-24')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  // Filter payments
  const filteredPayments = payments.filter((p) => {
    const matchSearch =
      (p.invoiceNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.guestName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.bookingId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.roomNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchMethod = methodFilter === 'All' || (p.method || '').includes(methodFilter);
    return matchSearch && matchStatus && matchMethod;
  });

  const handleCreatePayment = (e) => {
    e.preventDefault();
    if (!paymentForm.guestName || !paymentForm.amount) {
      toast.error('Please specify guest name and payment amount');
      return;
    }

    recordPayment({
      bookingId: paymentForm.bookingId || `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      guestName: paymentForm.guestName,
      roomNumber: paymentForm.roomNumber || 'DX-210',
      amount: Number(paymentForm.amount),
      method: paymentForm.method,
      status: paymentForm.status,
      notes: paymentForm.notes
    });

    setIsNewPaymentModalOpen(false);
    setPaymentForm({
      bookingId: '',
      guestName: '',
      roomNumber: '',
      amount: '',
      method: 'Credit Card (Visa)',
      status: 'Paid',
      notes: 'Direct settlement at reception'
    });
  };

  const handleBookingSelect = (bId) => {
    const target = bookings.find(b => b.id === bId);
    if (target) {
      setPaymentForm(prev => ({
        ...prev,
        bookingId: target.id,
        guestName: target.guestName,
        roomNumber: target.roomNumber,
        amount: target.amount
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#F6F1EA] text-[#8C6D3B]">
              <CreditCard className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Billing & Payment Operations
            </h1>
          </div>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Track transactions, inspect itemized tax invoices, and record guest settlements.
          </p>
        </div>

        <button
          onClick={() => setIsNewPaymentModalOpen(true)}
          className="px-4 py-2.5 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Payment</span>
        </button>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2 font-mono">
            ${totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Active cleared hospitality revenue</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Today's Collections</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2 font-mono">
            ${todayCollections.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-700 mt-1 font-medium">
            Settled today at reception
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Pending Payments</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2 font-mono">
            ${pendingPayments.toLocaleString()}
          </div>
          <div className="text-[11px] text-blue-600 mt-1 font-medium">
            Awaiting guest check-out
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Refunds Issued</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2 font-mono">
            ${refundedAmount.toLocaleString()}
          </div>
          <div className="text-[11px] text-rose-600 mt-1 font-medium">
            Cancellation chargebacks
          </div>
        </div>
      </div>

      {/* Payment Ledger Card */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search invoice #, guest, room #, booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-full bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/20 focus:border-[#8C6D3B]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-1.5 rounded-full bg-stone-50 border border-stone-200 text-xs text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/20"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Refunded">Refunded</option>
            </select>

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-3.5 py-1.5 rounded-full bg-stone-50 border border-stone-200 text-xs text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/20"
            >
              <option value="All">All Methods</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Apple Pay">Apple Pay</option>
              <option value="Bank">Bank / Wire</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
        </div>

        {/* Payments Table */}
        <div className="overflow-x-auto pt-3">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-200/60">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Guest Details</th>
                <th className="py-3 px-4">Room & Type</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{p.invoiceNo}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-stone-900">{p.guestName}</div>
                    <div className="text-[11px] text-stone-400">{p.bookingId}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-stone-800">{p.roomNumber}</div>
                    <div className="text-[11px] text-stone-400">{p.roomType}</div>
                  </td>
                  <td className="py-3.5 px-4 text-stone-700">{p.method}</td>
                  <td className="py-3.5 px-4 text-stone-500 font-mono text-[11px]">{p.date}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                    ${Number(p.amount).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        p.status === 'Paid'
                          ? 'success'
                          : p.status === 'Pending'
                          ? 'warning'
                          : 'error'
                      }
                    >
                      {p.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedInvoice(p)}
                        className="px-3 py-1.5 rounded-full border border-stone-200 hover:border-[#8C6D3B] hover:text-[#8C6D3B] text-stone-700 text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer"
                        title="View Official Invoice"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Invoice</span>
                      </button>

                      {p.status === 'Pending' && (
                        <button
                          onClick={() => updatePaymentStatus(p.id, 'Paid')}
                          className="px-2.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium transition-colors cursor-pointer"
                          title="Mark Cleared"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record New Payment Modal */}
      <Modal
        isOpen={isNewPaymentModalOpen}
        onClose={() => setIsNewPaymentModalOpen(false)}
        title="Record New Hospitality Settlement"
        size="md"
      >
        <form onSubmit={handleCreatePayment} className="space-y-4 text-xs">
          {/* Select Booking if available */}
          <div>
            <label className="block font-medium text-stone-700 mb-1">
              Link to Existing Reservation (Optional)
            </label>
            <select
              value={paymentForm.bookingId}
              onChange={(e) => handleBookingSelect(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/20"
            >
              <option value="">-- Manual Settlement / Custom --</option>
              {bookings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.id} - {b.guestName} ({b.roomNumber} • ${b.amount})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Guest Full Name *</label>
              <input
                type="text"
                required
                value={paymentForm.guestName}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, guestName: e.target.value }))}
                placeholder="e.g. Lady Sophia"
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/20"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Room Number</label>
              <input
                type="text"
                value={paymentForm.roomNumber}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, roomNumber: e.target.value }))}
                placeholder="e.g. PH-401"
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Payment Amount ($) *</label>
              <input
                type="number"
                required
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="e.g. 1850"
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/20 font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Payment Method</label>
              <select
                value={paymentForm.method}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, method: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/20"
              >
                <option value="Credit Card (Visa)">Credit Card (Visa)</option>
                <option value="Credit Card (Amex)">Credit Card (Amex)</option>
                <option value="Apple Pay">Apple Pay</option>
                <option value="Bank Wire">Bank Wire</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Payment Status</label>
            <div className="flex items-center gap-3">
              {['Paid', 'Pending'].map((st) => (
                <label key={st} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentStatus"
                    value={st}
                    checked={paymentForm.status === st}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, status: e.target.value }))}
                    className="accent-[#8C6D3B]"
                  />
                  <span>{st}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Remarks & Notes</label>
            <textarea
              rows={2}
              value={paymentForm.notes}
              onChange={(e) => setPaymentForm(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/20"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewPaymentModalOpen(false)}
              className="px-4 py-2 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white font-semibold shadow-xs"
            >
              Save & Generate Invoice
            </button>
          </div>
        </form>
      </Modal>

      {/* Invoice Modal Preview */}
      <InvoiceModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice}
      />
    </div>
  );
}
