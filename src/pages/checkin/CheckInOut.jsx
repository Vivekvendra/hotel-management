import React, { useState } from 'react';
import {
  KeyRound,
  LogIn,
  LogOut,
  Search,
  User,
  BedDouble,
  Star
} from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

export default function CheckInOut() {
  const {
    bookings,
    rooms,
    checkInLogs,
    checkOutLogs,
    checkInGuest,
    checkOutGuest
  } = useHotel();

  const [activeTab, setActiveTab] = useState('arrivals'); // 'arrivals' | 'inhouse' | 'checkin_history' | 'checkout_history'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRoomType, setFilterRoomType] = useState('All');

  // Check-In Modal State
  const [selectedBookingForCheckIn, setSelectedBookingForCheckIn] = useState(null);
  const [keyCardInput, setKeyCardInput] = useState('');
  const [luggageHelp, setLuggageHelp] = useState(true);
  const [checkInNotes, setCheckInNotes] = useState('');

  // Check-Out Modal State
  const [selectedBookingForCheckOut, setSelectedBookingForCheckOut] = useState(null);
  const [checkoutNotes, setCheckoutNotes] = useState('Key card received, room inspection passed.');
  const [guestRating, setGuestRating] = useState(5);

  // Derived collections
  const arrivalsList = bookings.filter(b => b.status === 'Confirmed');
  const inHouseList = bookings.filter(b => b.status === 'Checked In');

  // Filtered lists
  const filterList = (list) => {
    return list.filter(item => {
      const matchSearch =
        (item.guestName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.roomNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.id || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterRoomType === 'All' || item.roomType === filterRoomType;
      return matchSearch && matchType;
    });
  };

  const handleOpenCheckInModal = (booking) => {
    setSelectedBookingForCheckIn(booking);
    setKeyCardInput(`KEY-${Math.floor(1000 + Math.random() * 9000)}`);
    setLuggageHelp(true);
    setCheckInNotes('ID verified, welcome beverage presented.');
  };

  const handleConfirmCheckIn = () => {
    if (!selectedBookingForCheckIn) return;
    checkInGuest(selectedBookingForCheckIn.id, {
      keyCardNumber: keyCardInput,
      luggageAssistance: luggageHelp,
      notes: checkInNotes
    });
    setSelectedBookingForCheckIn(null);
  };

  const handleOpenCheckOutModal = (booking) => {
    setSelectedBookingForCheckOut(booking);
    setCheckoutNotes('All charges settled, minibar checked, key card returned.');
    setGuestRating(5);
  };

  const handleConfirmCheckOut = () => {
    if (!selectedBookingForCheckOut) return;
    checkOutGuest(selectedBookingForCheckOut.id, {
      notes: checkoutNotes,
      rating: guestRating
    });
    setSelectedBookingForCheckOut(null);
  };

  // KPIs
  const totalAvailable = rooms.filter(r => r.status === 'Available').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#F6F1EA] text-[#8C6D3B]">
              <KeyRound className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Front Desk Operations
            </h1>
          </div>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Real-time guest check-in, keycard issuing, departures, and room occupancy transitions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>{arrivalsList.length} Pending Arrivals</span>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{inHouseList.length} In-House Guests</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <LogIn className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">Arrivals Ready</div>
            <div className="text-xl font-bold text-stone-900">{arrivalsList.length}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">Currently In-House</div>
            <div className="text-xl font-bold text-stone-900">{inHouseList.length}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <LogOut className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">Check-Outs Logged</div>
            <div className="text-xl font-bold text-stone-900">{checkOutLogs.length}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <BedDouble className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">Rooms Available</div>
            <div className="text-xl font-bold text-stone-900">{totalAvailable} / {rooms.length}</div>
          </div>
        </div>
      </div>

      {/* Main Tabs & Search Bar */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100/80 rounded-2xl text-xs font-medium">
            <button
              onClick={() => setActiveTab('arrivals')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'arrivals'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Arrivals & Check-In ({arrivalsList.length})
            </button>
            <button
              onClick={() => setActiveTab('inhouse')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'inhouse'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              In-House & Check-Out ({inHouseList.length})
            </button>
            <button
              onClick={() => setActiveTab('checkin_history')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'checkin_history'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Check-In History ({checkInLogs.length})
            </button>
            <button
              onClick={() => setActiveTab('checkout_history')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'checkout_history'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Check-Out History ({checkOutLogs.length})
            </button>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search guest, room #, booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 rounded-full bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/20 focus:border-[#8C6D3B] w-56 sm:w-64"
              />
            </div>
            <select
              value={filterRoomType}
              onChange={(e) => setFilterRoomType(e.target.value)}
              className="px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200 text-xs text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/20"
            >
              <option value="All">All Room Types</option>
              <option value="Presidential Suite">Presidential</option>
              <option value="Ocean Villa">Ocean Villa</option>
              <option value="Deluxe Suite">Deluxe</option>
              <option value="Executive Room">Executive</option>
            </select>
          </div>
        </div>

        {/* Tab 1: Pending Arrivals */}
        {activeTab === 'arrivals' && (
          <div className="pt-4">
            {filterList(arrivalsList).length === 0 ? (
              <div className="py-12 text-center text-stone-400 text-xs">
                No scheduled arrivals matching the current filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-200/60">
                    <tr>
                      <th className="py-3 px-4">Booking ID</th>
                      <th className="py-3 px-4">Guest Details</th>
                      <th className="py-3 px-4">Room & Type</th>
                      <th className="py-3 px-4">Dates & Duration</th>
                      <th className="py-3 px-4">Billing Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filterList(arrivalsList).map((b) => (
                      <tr key={b.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-medium text-stone-900">{b.id}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={b.guestAvatar}
                              alt={b.guestName}
                              className="w-8 h-8 rounded-full object-cover border border-stone-200"
                            />
                            <div>
                              <div className="font-semibold text-stone-900">{b.guestName}</div>
                              <div className="text-[11px] text-stone-400">{b.guestEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-stone-900">{b.roomNumber}</div>
                          <div className="text-[11px] text-stone-500">{b.roomType}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-stone-800 font-medium">In: {b.checkIn}</div>
                          <div className="text-[11px] text-stone-500">
                            Out: {b.checkOut} ({b.nights} {b.nights === 1 ? 'night' : 'nights'})
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant={b.paymentStatus === 'Paid' ? 'success' : 'warning'}>
                            {b.paymentStatus} (${b.amount.toLocaleString()})
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleOpenCheckInModal(b)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white text-xs font-medium shadow-2xs transition-all cursor-pointer"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>Check-In Guest</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: In-House Guests */}
        {activeTab === 'inhouse' && (
          <div className="pt-4">
            {filterList(inHouseList).length === 0 ? (
              <div className="py-12 text-center text-stone-400 text-xs">
                No guests currently in-house matching the filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-200/60">
                    <tr>
                      <th className="py-3 px-4">Room #</th>
                      <th className="py-3 px-4">Guest</th>
                      <th className="py-3 px-4">Room Type</th>
                      <th className="py-3 px-4">Check-In / Out</th>
                      <th className="py-3 px-4">Key Issued</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filterList(inHouseList).map((b) => (
                      <tr key={b.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-stone-900">
                          <span className="px-2.5 py-1 rounded-lg bg-[#FAF9F6] border border-[#E8DAC8] text-[#8C6D3B]">
                            {b.roomNumber}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={b.guestAvatar}
                              alt={b.guestName}
                              className="w-8 h-8 rounded-full object-cover border border-stone-200"
                            />
                            <div>
                              <div className="font-semibold text-stone-900">{b.guestName}</div>
                              <div className="text-[11px] text-stone-400">{b.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-stone-700">{b.roomType}</td>
                        <td className="py-3.5 px-4">
                          <div className="text-stone-800 font-medium">Until {b.checkOut}</div>
                          <div className="text-[11px] text-stone-400">Total {b.nights} nights</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono text-stone-600 bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                            {b.keyCard || 'KEY-9011'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            In-House
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleOpenCheckOutModal(b)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium shadow-2xs transition-all cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Check-Out</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Check-In Logs */}
        {activeTab === 'checkin_history' && (
          <div className="pt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-200/60">
                  <tr>
                    <th className="py-3 px-4">Log ID</th>
                    <th className="py-3 px-4">Guest Name</th>
                    <th className="py-3 px-4">Room</th>
                    <th className="py-3 px-4">Check-In Timestamp</th>
                    <th className="py-3 px-4">Key Issued</th>
                    <th className="py-3 px-4">Luggage Assist</th>
                    <th className="py-3 px-4">Front Desk Agent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {checkInLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-stone-700">{log.id}</td>
                      <td className="py-3 px-4 font-semibold text-stone-900">{log.guestName}</td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-[#8C6D3B]">{log.roomNumber}</span>{' '}
                        <span className="text-stone-400">({log.roomType})</span>
                      </td>
                      <td className="py-3 px-4 text-stone-600 font-mono text-[11px]">{log.checkInTime}</td>
                      <td className="py-3 px-4 font-mono text-stone-700">{log.keyCardNumber}</td>
                      <td className="py-3 px-4">
                        {log.luggageAssistance ? (
                          <span className="text-emerald-700 font-medium">Yes</span>
                        ) : (
                          <span className="text-stone-400">No</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-stone-500">{log.agent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Check-Out Logs */}
        {activeTab === 'checkout_history' && (
          <div className="pt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-200/60">
                  <tr>
                    <th className="py-3 px-4">Log ID</th>
                    <th className="py-3 px-4">Guest Name</th>
                    <th className="py-3 px-4">Room</th>
                    <th className="py-3 px-4">Stay Duration</th>
                    <th className="py-3 px-4">Check-Out Timestamp</th>
                    <th className="py-3 px-4">Total Paid</th>
                    <th className="py-3 px-4">Guest Rating</th>
                    <th className="py-3 px-4">Agent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {checkOutLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-stone-700">{log.id}</td>
                      <td className="py-3 px-4 font-semibold text-stone-900">{log.guestName}</td>
                      <td className="py-3 px-4 text-[#8C6D3B] font-medium">{log.roomNumber}</td>
                      <td className="py-3 px-4 text-stone-700">{log.stayDuration}</td>
                      <td className="py-3 px-4 font-mono text-stone-600 text-[11px]">{log.checkOutTime}</td>
                      <td className="py-3 px-4 font-semibold text-emerald-700">${log.totalPaid?.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: log.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-stone-500">{log.agent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Check-In Action Modal */}
      <Modal
        isOpen={!!selectedBookingForCheckIn}
        onClose={() => setSelectedBookingForCheckIn(null)}
        title="Confirm Guest Arrival & Check-In"
        size="md"
      >
        {selectedBookingForCheckIn && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#F6F1EA] border border-[#E8DAC8] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-900 text-sm">
                  {selectedBookingForCheckIn.guestName}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#8C6D3B] text-white font-mono text-[11px]">
                  Room {selectedBookingForCheckIn.roomNumber}
                </span>
              </div>
              <div className="text-stone-600">
                {selectedBookingForCheckIn.roomType} • {selectedBookingForCheckIn.nights} Nights (
                {selectedBookingForCheckIn.checkIn} to {selectedBookingForCheckIn.checkOut})
              </div>
            </div>

            <div>
              <label className="block text-stone-600 font-medium mb-1">Assigned RFID Keycard #</label>
              <input
                type="text"
                value={keyCardInput}
                onChange={(e) => setKeyCardInput(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/20"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="luggage"
                checked={luggageHelp}
                onChange={(e) => setLuggageHelp(e.target.checked)}
                className="w-4 h-4 rounded text-[#8C6D3B] accent-[#8C6D3B]"
              />
              <label htmlFor="luggage" className="text-stone-700 cursor-pointer">
                Assign Porter for Luggage Assistance to room
              </label>
            </div>

            <div>
              <label className="block text-stone-600 font-medium mb-1">Check-In Notes</label>
              <textarea
                rows={2}
                value={checkInNotes}
                onChange={(e) => setCheckInNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/20"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedBookingForCheckIn(null)}
                className="px-4 py-2 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmCheckIn}
                className="px-5 py-2 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white font-semibold shadow-xs"
              >
                Issue Key & Check-In
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Check-Out Action Modal */}
      <Modal
        isOpen={!!selectedBookingForCheckOut}
        onClose={() => setSelectedBookingForCheckOut(null)}
        title="Process Guest Departure & Check-Out"
        size="md"
      >
        {selectedBookingForCheckOut && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-900 text-sm">
                  {selectedBookingForCheckOut.guestName}
                </span>
                <span className="font-bold text-[#8C6D3B]">
                  Room {selectedBookingForCheckOut.roomNumber}
                </span>
              </div>
              <div className="text-stone-600">
                Stay: {selectedBookingForCheckOut.checkIn} to {selectedBookingForCheckOut.checkOut} (
                {selectedBookingForCheckOut.nights} Nights)
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-stone-200/60 font-medium">
                <span>Total Tariff & Extras:</span>
                <span className="text-emerald-700 font-bold">${selectedBookingForCheckOut.amount.toLocaleString()} (Paid)</span>
              </div>
            </div>

            <div>
              <label className="block text-stone-600 font-medium mb-1">Guest Satisfaction Rating</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setGuestRating(star)}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= guestRating ? 'text-amber-400 fill-amber-400' : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-stone-600 font-medium mb-1">Departure & Inspection Remarks</label>
              <textarea
                rows={2}
                value={checkoutNotes}
                onChange={(e) => setCheckoutNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/20"
              />
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px]">
              ✓ Room {selectedBookingForCheckOut.roomNumber} will automatically transition to <strong>Available</strong> for housekeeping and new reservations.
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedBookingForCheckOut(null)}
                className="px-4 py-2 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmCheckOut}
                className="px-5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-semibold shadow-xs"
              >
                Clear Room & Complete Check-Out
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
