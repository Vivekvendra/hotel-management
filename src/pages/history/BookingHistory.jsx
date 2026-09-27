import React, { useState } from 'react';
import {
  History,
  Search,
  Eye,
  XCircle,
  FileSpreadsheet
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useHotel } from '../../context/HotelContext';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import BookingDetailModal from '../../components/history/BookingDetailModal';

export default function BookingHistory() {
  const { bookings, cancelBookingWithReason } = useHotel();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');

  // Modal states
  const [selectedBookingForDetail, setSelectedBookingForDetail] = useState(null);
  const [cancelModalBookingId, setCancelModalBookingId] = useState(null);
  const [cancelReason, setCancelReason] = useState('Guest requested schedule change');

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchSearch =
      (b.guestName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.roomNumber || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'All' || b.status === statusFilter;

    let matchDate = true;
    const today = '2026-09-24';
    if (dateFilter === 'Today') {
      matchDate = b.checkIn === today || b.checkOut === today;
    } else if (dateFilter === 'Active') {
      matchDate = b.status === 'Confirmed' || b.status === 'Checked In';
    } else if (dateFilter === 'Past') {
      matchDate = b.status === 'Checked Out' || b.status === 'Cancelled';
    }

    return matchSearch && matchStatus && matchDate;
  });

  const handleOpenCancelModal = (id) => {
    setSelectedBookingForDetail(null);
    setCancelModalBookingId(id);
    setCancelReason('Guest requested itinerary modification');
  };

  const handleConfirmCancel = () => {
    if (!cancelModalBookingId) return;
    cancelBookingWithReason(cancelModalBookingId, cancelReason);
    setCancelModalBookingId(null);
  };

  const handleExportCSV = () => {
    const headers = 'Booking ID,Guest Name,Room Number,Room Type,Check In,Check Out,Nights,Amount,Status,Payment Status\n';
    const rows = filteredBookings
      .map(
        (b) =>
          `"${b.id}","${b.guestName}","${b.roomNumber}","${b.roomType}","${b.checkIn}","${b.checkOut}",${b.nights},${b.amount},"${b.status}","${b.paymentStatus}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Grand_Azure_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Booking history ledger exported as CSV!');
  };

  // KPIs
  const totalCompleted = bookings.filter((b) => b.status === 'Checked Out' || b.status === 'Completed').length;
  const totalCancelled = bookings.filter((b) => b.status === 'Cancelled').length;
  const totalConfirmed = bookings.filter((b) => b.status === 'Confirmed').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#F6F1EA] text-[#8C6D3B]">
              <History className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Booking History & Archival
            </h1>
          </div>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Audit historical reservations, review guest stay durations, and manage cancellations.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-full border border-stone-200 hover:border-[#8C6D3B] bg-white text-stone-700 hover:text-[#8C6D3B] text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Export CSV Ledger</span>
        </button>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F6F1EA] text-[#8C6D3B] flex items-center justify-center font-bold">
            {bookings.length}
          </div>
          <div>
            <div className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">Total Stays Logged</div>
            <div className="text-base font-bold text-stone-900">All Reservations</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            {totalConfirmed}
          </div>
          <div>
            <div className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">Confirmed Bookings</div>
            <div className="text-base font-bold text-stone-900">Active Pipeline</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            {totalCompleted}
          </div>
          <div>
            <div className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">Completed Stays</div>
            <div className="text-base font-bold text-stone-900">Checked Out</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
            {totalCancelled}
          </div>
          <div>
            <div className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">Cancelled</div>
            <div className="text-base font-bold text-stone-900">Inventory Restored</div>
          </div>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by guest, room #, or BK-XXXX..."
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
              <option value="Confirmed">Confirmed</option>
              <option value="Checked In">Checked In</option>
              <option value="Checked Out">Checked Out</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3.5 py-1.5 rounded-full bg-stone-50 border border-stone-200 text-xs text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/20"
            >
              <option value="All">All Dates</option>
              <option value="Today">Today's Moves</option>
              <option value="Active">Currently Active</option>
              <option value="Past">Past & Completed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto pt-3">
          {filteredBookings.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-xs">
              No reservation history matching your filters.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-200/60">
                <tr>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Guest Details</th>
                  <th className="py-3 px-4">Room & Type</th>
                  <th className="py-3 px-4">Stay Dates</th>
                  <th className="py-3 px-4">Nights</th>
                  <th className="py-3 px-4">Tariff</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{b.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={b.guestAvatar}
                          alt={b.guestName}
                          className="w-7 h-7 rounded-full object-cover border border-stone-200"
                        />
                        <div>
                          <div className="font-semibold text-stone-900">{b.guestName}</div>
                          <div className="text-[11px] text-stone-400">{b.guestEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-900">{b.roomNumber}</div>
                      <div className="text-[11px] text-stone-400">{b.roomType}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-stone-800 font-medium">{b.checkIn}</div>
                      <div className="text-[11px] text-stone-400">to {b.checkOut}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-stone-700">{b.nights}n</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                      ${Number(b.amount).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          b.status === 'Checked In'
                            ? 'success'
                            : b.status === 'Confirmed'
                            ? 'info'
                            : b.status === 'Cancelled'
                            ? 'error'
                            : 'neutral'
                        }
                      >
                        {b.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedBookingForDetail(b)}
                          className="p-1.5 rounded-lg border border-stone-200 hover:border-[#8C6D3B] hover:text-[#8C6D3B] text-stone-600 transition-colors cursor-pointer"
                          title="View Full Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {b.status !== 'Cancelled' && b.status !== 'Checked Out' && (
                          <button
                            onClick={() => handleOpenCancelModal(b.id)}
                            className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Cancel Reservation"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      <BookingDetailModal
        isOpen={!!selectedBookingForDetail}
        onClose={() => setSelectedBookingForDetail(null)}
        booking={selectedBookingForDetail}
        onCancel={handleOpenCancelModal}
      />

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={!!cancelModalBookingId}
        onClose={() => setCancelModalBookingId(null)}
        title="Cancel Guest Reservation"
        size="md"
      >
        <div className="space-y-4 text-xs text-stone-800">
          <p className="text-stone-600">
            Are you sure you want to cancel reservation <strong>{cancelModalBookingId}</strong>?
            This will immediately release the assigned room back to <strong>Available</strong> inventory and update billing.
          </p>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Reason for Cancellation</label>
            <textarea
              rows={2}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/20"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setCancelModalBookingId(null)}
              className="px-4 py-2 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 font-medium"
            >
              Keep Reservation
            </button>
            <button
              type="button"
              onClick={handleConfirmCancel}
              className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-xs"
            >
              Confirm Cancellation
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
