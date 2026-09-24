import React, { useState, useMemo } from 'react';
import {
  CalendarCheck,
  Plus,
  Search,
  CheckCircle,
  AlertTriangle,
  Eye,
  Ban
} from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { toast } from 'react-toastify';

export default function BookingManagement() {
  const {
    bookings,
    rooms,
    guests,
    createBooking,
    updateBookingStatus,
    cancelBooking,
    checkRoomConflict
  } = useHotel();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Modals
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [viewingBooking, setViewingBooking] = useState(null);
  const [confirmedBookingData, setConfirmedBookingData] = useState(null);

  // New Booking Wizard Form States
  const [selectedGuestId, setSelectedGuestId] = useState('');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('');
  const [checkInDate, setCheckInDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const next = new Date();
    next.setDate(next.getDate() + 3);
    return next.toISOString().split('T')[0];
  });


  // Auto-calculated nights
  const numberOfNights = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 1;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [checkInDate, checkOutDate]);

  // Selected Room Object
  const selectedRoom = useMemo(() => {
    return rooms.find((r) => r.roomNumber === selectedRoomNumber) || null;
  }, [rooms, selectedRoomNumber]);

  // Selected Guest Object
  const selectedGuest = useMemo(() => {
    return guests.find((g) => g.id === selectedGuestId) || null;
  }, [guests, selectedGuestId]);

  // Auto-calculated Total Amount
  const financialBreakdown = useMemo(() => {
    const basePrice = selectedRoom ? selectedRoom.price : 350;
    const roomSubtotal = basePrice * numberOfNights;
    const luxuryTax = Math.round(roomSubtotal * 0.12); // 12% luxury tax
    const resortServiceFee = 50;
    const grandTotal = roomSubtotal + luxuryTax + resortServiceFee;

    return {
      basePrice,
      roomSubtotal,
      luxuryTax,
      resortServiceFee,
      grandTotal
    };
  }, [selectedRoom, numberOfNights]);

  // Real-time double booking conflict verification
  const conflictWarning = useMemo(() => {
    if (selectedRoomNumber && checkInDate && checkOutDate) {
      const result = checkRoomConflict(selectedRoomNumber, checkInDate, checkOutDate);
      return result.hasConflict ? result.reason : null;
    }
    return null;
  }, [selectedRoomNumber, checkInDate, checkOutDate, checkRoomConflict]);

  // Set default guest and room when opening new booking modal
  const openNewBooking = () => {
    if (guests.length > 0) setSelectedGuestId(guests[0].id);
    const availableRoom = rooms.find((r) => r.status === 'Available') || rooms[0];
    if (availableRoom) setSelectedRoomNumber(availableRoom.roomNumber);

    const today = new Date().toISOString().split('T')[0];
    const next = new Date();
    next.setDate(next.getDate() + 3);
    setCheckInDate(today);
    setCheckOutDate(next.toISOString().split('T')[0]);
    setIsNewBookingModalOpen(true);
  };

  // Submit Reservation
  const handleConfirmReservation = (e) => {
    e.preventDefault();

    if (!selectedGuest) {
      toast.error('Please select a registered guest.');
      return;
    }
    if (!selectedRoom) {
      toast.error('Please select a room.');
      return;
    }
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      toast.error('Check-out date must be after check-in date.');
      return;
    }

    if (conflictWarning) {
      toast.error(conflictWarning);
      return;
    }

    const payload = {
      guestName: selectedGuest.name,
      guestEmail: selectedGuest.email,
      guestAvatar: selectedGuest.avatar,
      roomNumber: selectedRoom.roomNumber,
      roomType: selectedRoom.roomType,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights: numberOfNights,
      amount: financialBreakdown.grandTotal,
      status: 'Confirmed',
      paymentStatus: 'Paid'
    };

    const res = createBooking(payload);
    if (res.success) {
      setIsNewBookingModalOpen(false);
      setConfirmedBookingData(res.booking);
    }
  };

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        b.id.toLowerCase().includes(q) ||
        b.guestName.toLowerCase().includes(q) ||
        b.roomNumber.toLowerCase().includes(q) ||
        b.roomType.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'All' ? true : b.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(start, start + itemsPerPage);
  }, [filteredBookings, currentPage]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <Badge variant="info">Confirmed</Badge>;
      case 'Checked In':
        return <Badge variant="success">Checked In</Badge>;
      case 'Checked Out':
        return <Badge variant="default">Checked Out</Badge>;
      case 'Pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'Cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-7 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8C6D3B]/10 text-[#8C6D3B] text-xs font-semibold uppercase tracking-wider mb-1.5">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Module 5: Room Booking & Allocation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-900 tracking-tight">
            Room Bookings
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
            Automated tariff calculation, dynamic stay schedules, and double-booking conflict prevention.
          </p>
        </div>

        <button
          onClick={openNewBooking}
          className="px-5 py-2.5 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white text-xs font-semibold tracking-wide flex items-center gap-2 shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Booking</span>
        </button>
      </div>

      {/* Search, Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search booking ref, guest, room #..."
            className="w-full h-10 pl-9 pr-4 rounded-full bg-[#F7F7F6] border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
          />
        </div>

        {/* Status Pill Filters */}
        <div className="flex flex-wrap items-center gap-1 bg-stone-100 p-1 rounded-full text-xs">
          {['All', 'Confirmed', 'Checked In', 'Checked Out', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      {filteredBookings.length === 0 ? (
        <EmptyState
          title="No Bookings Recorded"
          description={`No reservations match the filter query "${searchQuery || statusFilter}".`}
          actionText="Create Reservation"
          onAction={openNewBooking}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-100 bg-[#FAF9F6] text-stone-400 uppercase tracking-wider text-[11px]">
                  <th className="py-4 px-5 font-semibold">Booking Ref</th>
                  <th className="py-4 px-5 font-semibold">Guest</th>
                  <th className="py-4 px-5 font-semibold">Room & Category</th>
                  <th className="py-4 px-5 font-semibold">Stay Schedule</th>
                  <th className="py-4 px-5 font-semibold">Total Amount</th>
                  <th className="py-4 px-5 font-semibold">Status</th>
                  <th className="py-4 px-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paginatedBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-stone-50/80 transition-colors group cursor-pointer"
                    onClick={() => setViewingBooking(b)}
                  >
                    {/* ID */}
                    <td className="py-4 px-5 font-mono font-bold text-stone-900">
                      {b.id}
                    </td>

                    {/* Guest */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={b.guestAvatar}
                          alt={b.guestName}
                          className="w-9 h-9 rounded-full object-cover border border-stone-200"
                        />
                        <div>
                          <p className="font-semibold text-stone-900 group-hover:text-[#755B31]">
                            {b.guestName}
                          </p>
                          <p className="text-[11px] text-stone-400">{b.guestEmail}</p>
                        </div>
                      </div>
                    </td>

                    {/* Room */}
                    <td className="py-4 px-5">
                      <div>
                        <span className="font-mono font-bold text-stone-800">
                          {b.roomNumber}
                        </span>
                        <p className="text-[11px] text-stone-500">{b.roomType}</p>
                      </div>
                    </td>

                    {/* Schedule */}
                    <td className="py-4 px-5">
                      <div>
                        <p className="font-medium text-stone-700">
                          {b.checkIn} → {b.checkOut}
                        </p>
                        <p className="text-[11px] text-stone-400">{b.nights} Nights</p>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-5 font-bold text-stone-900">
                      ${b.amount?.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5">{getStatusBadge(b.status)}</td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div
                        className="inline-flex items-center gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setViewingBooking(b)}
                          title="View Summary"
                          className="p-2 rounded-full border border-stone-200 hover:border-[#8C6D3B] hover:bg-[#F6F1EA] text-[#8C6D3B] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {b.status === 'Confirmed' && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'Checked In')}
                            className="px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            Check In
                          </button>
                        )}

                        {b.status === 'Checked In' && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'Checked Out')}
                            className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            Check Out
                          </button>
                        )}

                        {b.status !== 'Cancelled' && b.status !== 'Checked Out' && (
                          <button
                            onClick={() => cancelBooking(b.id)}
                            title="Cancel Reservation"
                            className="p-2 rounded-full border border-stone-200 hover:border-red-300 hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <Ban className="w-3.5 h-3.5" />
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
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-stone-200 text-xs">
          <span className="text-stone-500">
            Page <strong className="text-stone-800">{currentPage}</strong> of{' '}
            <strong className="text-stone-800">{totalPages}</strong>
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-1.5 rounded-full border border-stone-200 text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium cursor-pointer"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-8 h-8 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  currentPage === num
                    ? 'bg-[#8C6D3B] text-white shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {num}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3.5 py-1.5 rounded-full border border-stone-200 text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE BOOKING (MODULE 5) ================= */}
      <Modal
        isOpen={isNewBookingModalOpen}
        onClose={() => setIsNewBookingModalOpen(false)}
        title="Create Room Reservation"
        subtitle="Step-by-step guest selection, room booking, and automatic tariff calculation"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleConfirmReservation} className="space-y-5">
          {/* Step 1: Select Guest */}
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              1. Select Registered Guest *
            </label>
            <select
              value={selectedGuestId}
              onChange={(e) => setSelectedGuestId(e.target.value)}
              className="w-full h-11 px-4 rounded-full bg-[#F7F7F6] border border-stone-300 text-stone-800 text-xs focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
            >
              {guests.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.nationality}) - {g.email}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Select Room */}
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              2. Select Room & Category *
            </label>
            <select
              value={selectedRoomNumber}
              onChange={(e) => setSelectedRoomNumber(e.target.value)}
              className="w-full h-11 px-4 rounded-full bg-[#F7F7F6] border border-stone-300 text-stone-800 text-xs focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.roomNumber}>
                  {r.roomNumber} - {r.roomType} (${r.price}/nt) [{r.status}]
                </option>
              ))}
            </select>
          </div>

          {/* Step 3: Check-In & Check-Out Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">
                3. Check-In Date *
              </label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full h-11 px-4 rounded-full bg-[#F7F7F6] border border-stone-300 text-stone-800 text-xs focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">
                4. Check-Out Date *
              </label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full h-11 px-4 rounded-full bg-[#F7F7F6] border border-stone-300 text-stone-800 text-xs focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
              />
            </div>
          </div>

          {/* Double Booking Warning Banner */}
          {conflictWarning ? (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Double Booking Conflict Prevented:</strong>
                <span>{conflictWarning}</span>
              </div>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Room {selectedRoomNumber} is free for the selected dates.</span>
            </div>
          )}

          {/* Automatic Calculation & Booking Summary */}
          <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#E8DAC8] space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 font-semibold text-stone-900">
              <span>Automatic Booking Summary</span>
              <span className="text-[#8C6D3B]">{numberOfNights} Nights Stay</span>
            </div>

            <div className="space-y-1.5 text-stone-600">
              <div className="flex justify-between">
                <span>
                  Room Tariff (${financialBreakdown.basePrice} × {numberOfNights} nights)
                </span>
                <span className="font-medium text-stone-900">
                  ${financialBreakdown.roomSubtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Resort Luxury Tax (12%)</span>
                <span className="font-medium text-stone-900">
                  ${financialBreakdown.luxuryTax.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span>VIP Concierge Service Fee</span>
                <span className="font-medium text-stone-900">
                  ${financialBreakdown.resortServiceFee}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline text-sm font-bold text-stone-900">
              <span>Total Amount</span>
              <span className="text-xl text-[#8C6D3B]">
                ${financialBreakdown.grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsNewBookingModalOpen(false)}
              className="px-5 py-2.5 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-100 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!!conflictWarning}
              className="px-7 py-2.5 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white text-xs font-semibold shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Reservation
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL: BOOKING CONFIRMATION SUCCESS ================= */}
      <Modal
        isOpen={!!confirmedBookingData}
        onClose={() => setConfirmedBookingData(null)}
        title="Reservation Confirmed!"
        subtitle="Official Grand Azure Stay Voucher"
        maxWidth="max-w-md"
      >
        {confirmedBookingData && (
          <div className="space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <p className="text-xs uppercase text-stone-400 tracking-wider">
                Booking Reference
              </p>
              <h3 className="font-mono text-2xl font-bold text-stone-900 mt-1">
                {confirmedBookingData.id}
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-stone-500">Guest:</span>
                <strong className="text-stone-800">{confirmedBookingData.guestName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Room:</span>
                <strong className="text-stone-800">
                  {confirmedBookingData.roomNumber} ({confirmedBookingData.roomType})
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Dates:</span>
                <span className="text-stone-800 font-medium">
                  {confirmedBookingData.checkIn} → {confirmedBookingData.checkOut}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200">
                <span className="text-stone-700 font-bold">Total Tariff:</span>
                <strong className="text-base text-[#8C6D3B]">
                  ${confirmedBookingData.amount?.toLocaleString()}
                </strong>
              </div>
            </div>

            <button
              onClick={() => setConfirmedBookingData(null)}
              className="w-full py-3 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white text-xs font-semibold shadow-md cursor-pointer"
            >
              Done & View Ledger
            </button>
          </div>
        )}
      </Modal>

      {/* ================= MODAL: VIEW BOOKING SUMMARY ================= */}
      <Modal
        isOpen={!!viewingBooking}
        onClose={() => setViewingBooking(null)}
        title={`Reservation: ${viewingBooking?.id}`}
        subtitle="Complete Booking Summary & Guest Schedule"
        maxWidth="max-w-lg"
      >
        {viewingBooking && (
          <div className="space-y-5 text-xs">
            <div className="flex items-center gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-100">
              <img
                src={viewingBooking.guestAvatar}
                alt={viewingBooking.guestName}
                className="w-12 h-12 rounded-full object-cover border border-[#8C6D3B]/30"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-stone-900 text-sm">
                  {viewingBooking.guestName}
                </h4>
                <p className="text-stone-400">{viewingBooking.guestEmail}</p>
                <div className="mt-1">{getStatusBadge(viewingBooking.status)}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-stone-200">
                <span className="text-stone-400 block mb-0.5">Room Number</span>
                <span className="font-bold text-stone-900 text-sm">
                  {viewingBooking.roomNumber}
                </span>
                <p className="text-[11px] text-stone-500">{viewingBooking.roomType}</p>
              </div>

              <div className="p-3 rounded-xl border border-stone-200">
                <span className="text-stone-400 block mb-0.5">Stay Length</span>
                <span className="font-bold text-stone-900 text-sm">
                  {viewingBooking.nights} Nights
                </span>
                <p className="text-[11px] text-stone-500">
                  {viewingBooking.checkIn} to {viewingBooking.checkOut}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F6F1EA] border border-[#E8DAC8] flex items-center justify-between">
              <div>
                <span className="text-stone-500 text-[11px] block">Total Settled Tariff</span>
                <span className="font-bold text-lg text-[#755B31]">
                  ${viewingBooking.amount?.toLocaleString()}
                </span>
              </div>
              <Badge variant="success">Payment Confirmed</Badge>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setViewingBooking(null)}
                className="px-5 py-2.5 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white font-semibold cursor-pointer"
              >
                Close Summary
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
