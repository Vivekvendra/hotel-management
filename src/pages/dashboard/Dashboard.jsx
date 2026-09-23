import React, { useState, useMemo } from 'react';
import {
  BedDouble,
  DoorOpen,
  DoorClosed,
  Users,
  LogIn,
  LogOut,
  Calendar,
  DollarSign,
  TrendingUp,
  PlusCircle,
  Search,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Building2,
  UserCheck
} from 'lucide-react';
import StatsCard from '../../components/common/StatsCard';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import { initialMockData } from '../../data/mockData';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const [data, setData] = useState(initialMockData);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Quick Action Modals
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);

  // Simulation Form States
  const [checkInGuestName, setCheckInGuestName] = useState('');
  const [newBookingData, setNewBookingData] = useState({
    guestName: '',
    guestEmail: '',
    roomType: 'Deluxe Suite',
    nights: 3,
    checkIn: '2026-09-24',
    checkOut: '2026-09-27'
  });
  const [newRoomData, setNewRoomData] = useState({
    roomNumber: 'DX-304',
    roomType: 'Deluxe Suite',
    price: 350,
    floor: 3
  });

  // Refresh Simulation
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Analytics refreshed with latest hotel telemetry.');
    }, 600);
  };

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return data.recentBookings.filter((b) => {
      const matchesSearch =
        b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.guestEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' ? true : b.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data.recentBookings, searchQuery, statusFilter]);

  // Quick Check-In Handler
  const handleQuickCheckIn = (e) => {
    e.preventDefault();
    if (!checkInGuestName.trim()) {
      toast.error('Please enter or select a guest name');
      return;
    }

    const updatedBookings = data.recentBookings.map((b) => {
      if (b.guestName.toLowerCase().includes(checkInGuestName.toLowerCase())) {
        return { ...b, status: 'Checked In' };
      }
      return b;
    });

    setData((prev) => ({
      ...prev,
      recentBookings: updatedBookings,
      stats: {
        ...prev.stats,
        availableRooms: Math.max(0, prev.stats.availableRooms - 1),
        occupiedRooms: prev.stats.occupiedRooms + 1,
        todayCheckIns: prev.stats.todayCheckIns + 1,
        totalGuests: prev.stats.totalGuests + 1
      }
    }));

    toast.success(`Guest ${checkInGuestName} checked in successfully! Keycard issued.`);
    setCheckInGuestName('');
    setIsCheckInModalOpen(false);
  };

  // New Booking Handler
  const handleCreateBooking = (e) => {
    e.preventDefault();
    if (!newBookingData.guestName || !newBookingData.guestEmail) {
      toast.error('Please fill in required guest details');
      return;
    }

    const pricePerNight =
      newBookingData.roomType === 'Presidential Suite'
        ? 850
        : newBookingData.roomType === 'Ocean Villa'
        ? 650
        : 350;

    const newBooking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      guestName: newBookingData.guestName,
      guestEmail: newBookingData.guestEmail,
      guestAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      roomNumber: `RM-${Math.floor(200 + Math.random() * 200)}`,
      roomType: newBookingData.roomType,
      checkIn: newBookingData.checkIn,
      checkOut: newBookingData.checkOut,
      nights: Number(newBookingData.nights),
      amount: pricePerNight * Number(newBookingData.nights),
      status: 'Confirmed',
      paymentStatus: 'Paid'
    };

    setData((prev) => ({
      ...prev,
      recentBookings: [newBooking, ...prev.recentBookings],
      stats: {
        ...prev.stats,
        totalBookings: prev.stats.totalBookings + 1,
        revenueSummary: {
          ...prev.stats.revenueSummary,
          total: prev.stats.revenueSummary.total + newBooking.amount
        }
      }
    }));

    toast.success(`Reservation ${newBooking.id} created successfully!`);
    setIsNewBookingModalOpen(false);
    setNewBookingData({
      guestName: '',
      guestEmail: '',
      roomType: 'Deluxe Suite',
      nights: 3,
      checkIn: '2026-09-24',
      checkOut: '2026-09-27'
    });
  };

  // Add Room Handler
  const handleAddRoom = (e) => {
    e.preventDefault();
    setData((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        totalRooms: prev.stats.totalRooms + 1,
        availableRooms: prev.stats.availableRooms + 1
      }
    }));

    toast.success(`Room ${newRoomData.roomNumber} added to hotel inventory!`);
    setIsAddRoomModalOpen(false);
  };

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
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* ================= DASHBOARD HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8C6D3B]/10 text-[#8C6D3B] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Executive Operations Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-900 tracking-tight">
            Dashboard Analytics
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Real-time occupancy metrics, arrivals, revenue streams, and room reservations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="px-4 py-2.5 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-stone-500 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>

          <button
            onClick={() => setIsNewBookingModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white text-xs font-semibold tracking-wide flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Reservation</span>
          </button>
        </div>
      </div>

      {/* ================= 8 KPI STATS METRIC CARDS ================= */}
      {isLoading ? (
        <SkeletonLoader type="card" count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* 1. Total Rooms */}
          <StatsCard
            title="Total Rooms"
            value={data.stats.totalRooms}
            subtitle="Across 4 luxury wings"
            trend="+12 Wings"
            trendType="neutral"
            icon={BedDouble}
            iconBg="bg-stone-100"
            iconColor="text-stone-700"
          />

          {/* 2. Available Rooms */}
          <StatsCard
            title="Available Rooms"
            value={data.stats.availableRooms}
            subtitle={`${Math.round((data.stats.availableRooms / data.stats.totalRooms) * 100)}% of total capacity`}
            trend="Ready for check-in"
            trendType="up"
            icon={DoorOpen}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />

          {/* 3. Occupied Rooms */}
          <StatsCard
            title="Occupied Rooms"
            value={data.stats.occupiedRooms}
            subtitle={`${Math.round((data.stats.occupiedRooms / data.stats.totalRooms) * 100)}% current occupancy`}
            trend="+5.4% vs yesterday"
            trendType="up"
            icon={DoorClosed}
            iconBg="bg-amber-50"
            iconColor="text-amber-700"
          />

          {/* 4. Total Guests */}
          <StatsCard
            title="Total Guests"
            value={data.stats.totalGuests}
            subtitle="In-house luxury patrons"
            trend="+18 today"
            trendType="up"
            icon={Users}
            iconBg="bg-sky-50"
            iconColor="text-sky-700"
          />

          {/* 5. Today's Check-Ins */}
          <StatsCard
            title="Today's Check-Ins"
            value={data.stats.todayCheckIns}
            subtitle="Expected arrivals"
            trend="14 already arrived"
            trendType="neutral"
            icon={LogIn}
            iconBg="bg-[#8C6D3B]/10"
            iconColor="text-[#8C6D3B]"
          />

          {/* 6. Today's Check-Outs */}
          <StatsCard
            title="Today's Check-Outs"
            value={data.stats.todayCheckOuts}
            subtitle="Scheduled departures"
            trend="9 cleared inspection"
            trendType="neutral"
            icon={LogOut}
            iconBg="bg-purple-50"
            iconColor="text-purple-700"
          />

          {/* 7. Total Bookings */}
          <StatsCard
            title="Total Bookings"
            value={data.stats.totalBookings}
            subtitle="Current cycle reservations"
            trend="+8.2% this month"
            trendType="up"
            icon={Calendar}
            iconBg="bg-blue-50"
            iconColor="text-blue-700"
          />

          {/* 8. Revenue Summary */}
          <StatsCard
            title="Revenue Summary"
            value={`$${data.stats.revenueSummary.total.toLocaleString()}`}
            subtitle="Gross recognized revenue"
            trend={data.stats.revenueSummary.growth}
            trendType="up"
            icon={DollarSign}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-700"
          />
        </div>
      )}

      {/* ================= REVENUE ANALYTICS & QUICK ACTIONS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Revenue Summary Chart Breakdown (Col 8) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                  Financial Performance
                </span>
                <h3 className="text-xl font-serif-luxury font-bold text-stone-900 mt-0.5">
                  Revenue Summary & Monthly Distribution
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 font-medium bg-stone-100 px-3 py-1 rounded-full">
                  Dummy Analytics
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+14.2% YoY</span>
                </span>
              </div>
            </div>

            {/* Custom SVG / Bar Chart Representation */}
            <div className="pt-6">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <p className="text-xs text-stone-400">Total YTD Hotel Revenue</p>
                  <p className="text-3xl font-bold text-stone-900 tracking-tight">
                    ${data.stats.revenueSummary.total.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-[#8C6D3B]"></span>
                    <span className="text-stone-600">Suites & Rooms</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-[#C59B63]"></span>
                    <span className="text-stone-600">Fine Dining</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-stone-300"></span>
                    <span className="text-stone-600">Spa & Resort</span>
                  </div>
                </div>
              </div>

              {/* Visual Multi-Bar Monthly Chart */}
              <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-52 pt-4 pb-2 border-b border-stone-100">
                {data.stats.revenueSummary.breakdown.map((item) => {
                  const maxTotal = 70000;
                  const roomHeight = (item.rooms / maxTotal) * 100;
                  const diningHeight = (item.dining / maxTotal) * 100;
                  const spaHeight = (item.spa / maxTotal) * 100;

                  return (
                    <div key={item.month} className="flex flex-col items-center h-full justify-end group">
                      <div className="text-[11px] font-semibold text-stone-700 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        ${(item.total / 1000).toFixed(0)}k
                      </div>
                      <div className="w-full max-w-[42px] flex flex-col justify-end gap-0.5 rounded-t-xl overflow-hidden bg-stone-50 p-0.5">
                        <div
                          style={{ height: `${spaHeight}%` }}
                          className="w-full bg-stone-300 rounded-t-sm"
                          title={`Spa: $${item.spa.toLocaleString()}`}
                        ></div>
                        <div
                          style={{ height: `${diningHeight}%` }}
                          className="w-full bg-[#C59B63]"
                          title={`Dining: $${item.dining.toLocaleString()}`}
                        ></div>
                        <div
                          style={{ height: `${roomHeight}%` }}
                          className="w-full bg-[#8C6D3B] rounded-b-sm"
                          title={`Rooms: $${item.rooms.toLocaleString()}`}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-stone-500 mt-2">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Metrics Footer */}
          <div className="mt-6 pt-4 border-t border-stone-100 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-stone-400">Current Month</p>
              <p className="text-base font-bold text-stone-800 mt-0.5">
                ${data.stats.revenueSummary.thisMonth.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-400">Pending Billing</p>
              <p className="text-base font-bold text-amber-700 mt-0.5">
                ${data.stats.revenueSummary.pendingPayments.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-400">Occupancy Rate</p>
              <p className="text-base font-bold text-emerald-700 mt-0.5">
                {Math.round((data.stats.occupiedRooms / data.stats.totalRooms) * 100)}%
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action Cards (Col 4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-stone-100">
              <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                Instant Workflows
              </span>
              <h3 className="text-xl font-serif-luxury font-bold text-stone-900 mt-0.5">
                Quick Action Cards
              </h3>
            </div>

            <div className="mt-5 space-y-3">
              {/* Action 1: Quick Check-In */}
              <button
                onClick={() => setIsCheckInModalOpen(true)}
                className="w-full p-4 rounded-2xl border border-stone-200/80 hover:border-[#8C6D3B]/40 hover:bg-[#F6F1EA]/50 text-left transition-all group flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <LogIn className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-800 group-hover:text-[#755B31]">
                      Quick Guest Check-In
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Issue room keys & check in arriving patrons
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#8C6D3B] group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Action 2: New Reservation */}
              <button
                onClick={() => setIsNewBookingModalOpen(true)}
                className="w-full p-4 rounded-2xl border border-stone-200/80 hover:border-[#8C6D3B]/40 hover:bg-[#F6F1EA]/50 text-left transition-all group flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#8C6D3B]/10 text-[#8C6D3B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-800 group-hover:text-[#755B31]">
                      New Reservation
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Book suite with instant date validation
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#8C6D3B] group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Action 3: Add Room */}
              <button
                onClick={() => setIsAddRoomModalOpen(true)}
                className="w-full p-4 rounded-2xl border border-stone-200/80 hover:border-[#8C6D3B]/40 hover:bg-[#F6F1EA]/50 text-left transition-all group flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-800 group-hover:text-[#755B31]">
                      Add New Room
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Provision suites into active inventory
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#8C6D3B] group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Action 4: Guest Lookup */}
              <button
                onClick={() => {
                  const input = document.getElementById('recent-bookings-search');
                  if (input) input.focus();
                  toast.info('Search guests directly using the Recent Bookings search filter.');
                }}
                className="w-full p-4 rounded-2xl border border-stone-200/80 hover:border-[#8C6D3B]/40 hover:bg-[#F6F1EA]/50 text-left transition-all group flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-800 group-hover:text-[#755B31]">
                      Guest Directory Lookup
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Search profiles & booking histories
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#8C6D3B] group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-[#F6F1EA] border border-[#E5D7C3] flex items-center justify-between text-xs text-[#755B31]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8C6D3B]" />
              <span className="font-semibold">Concierge Desk Available</span>
            </div>
            <span className="font-medium text-[11px] bg-white px-2 py-0.5 rounded-full border border-[#E5D7C3]">
              Ext. 101
            </span>
          </div>
        </div>

      </div>

      {/* ================= RECENT BOOKINGS TABLE ================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs">
        
        {/* Table Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
          <div>
            <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
              Live Reservation Ledger
            </span>
            <h3 className="text-xl font-serif-luxury font-bold text-stone-900 mt-0.5">
              Recent Bookings & Activity
            </h3>
          </div>

          {/* Search & Filter Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="recent-bookings-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guest, ID, room..."
                className="w-full h-10 pl-9 pr-4 rounded-full bg-[#F7F7F6] border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B] transition-all"
              />
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-full text-xs">
              {['All', 'Confirmed', 'Checked In', 'Checked Out', 'Pending'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    statusFilter === status
                      ? 'bg-white text-stone-900 shadow-xs font-semibold'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings Table / Empty State */}
        {filteredBookings.length === 0 ? (
          <EmptyState
            title="No Bookings Found"
            description={`No reservations match the filter criteria "${searchQuery || statusFilter}".`}
            actionText="Clear Filters"
            onAction={() => {
              setSearchQuery('');
              setStatusFilter('All');
            }}
          />
        ) : (
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-100 text-stone-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 font-semibold">Booking ID</th>
                  <th className="py-3.5 px-4 font-semibold">Guest Name</th>
                  <th className="py-3.5 px-4 font-semibold">Room & Type</th>
                  <th className="py-3.5 px-4 font-semibold">Stay Dates</th>
                  <th className="py-3.5 px-4 font-semibold">Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-stone-50/80 transition-colors group cursor-pointer"
                    onClick={() => setSelectedBooking(b)}
                  >
                    {/* Booking ID */}
                    <td className="py-4 px-4 font-semibold text-stone-900 font-mono">
                      {b.id}
                    </td>

                    {/* Guest Name & Avatar */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={b.guestAvatar}
                          alt={b.guestName}
                          className="w-8 h-8 rounded-full object-cover border border-stone-200"
                        />
                        <div>
                          <p className="font-semibold text-stone-900">{b.guestName}</p>
                          <p className="text-[11px] text-stone-400">{b.guestEmail}</p>
                        </div>
                      </div>
                    </td>

                    {/* Room & Type */}
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold text-stone-800">{b.roomNumber}</p>
                        <p className="text-[11px] text-stone-500">{b.roomType}</p>
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-stone-700">
                          {b.checkIn} → {b.checkOut}
                        </p>
                        <p className="text-[11px] text-stone-400">{b.nights} Nights</p>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-4 font-semibold text-stone-900">
                      ${b.amount.toLocaleString()}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">{getStatusBadge(b.status)}</td>

                    {/* Action */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(b);
                        }}
                        className="px-3 py-1.5 rounded-full border border-stone-200 hover:border-[#8C6D3B] hover:bg-[#F6F1EA] text-[#8C6D3B] text-xs font-medium transition-all"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODAL: BOOKING DETAILS ================= */}
      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Reservation Details"
        subtitle={`Booking Reference: ${selectedBooking?.id}`}
      >
        {selectedBooking && (
          <div className="space-y-6">
            {/* Guest Summary Card */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center gap-4">
              <img
                src={selectedBooking.guestAvatar}
                alt={selectedBooking.guestName}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#8C6D3B]/40"
              />
              <div>
                <h4 className="text-base font-serif-luxury font-bold text-stone-900">
                  {selectedBooking.guestName}
                </h4>
                <p className="text-xs text-stone-500">{selectedBooking.guestEmail}</p>
                <div className="mt-2 flex items-center gap-2">
                  {getStatusBadge(selectedBooking.status)}
                  <Badge variant="luxury">VIP Patron</Badge>
                </div>
              </div>
            </div>

            {/* Room & Stay Details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl border border-stone-200 bg-white">
                <span className="text-stone-400 block mb-1">Room Assignment</span>
                <span className="font-bold text-stone-900 text-sm">
                  {selectedBooking.roomNumber} ({selectedBooking.roomType})
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-stone-200 bg-white">
                <span className="text-stone-400 block mb-1">Stay Duration</span>
                <span className="font-bold text-stone-900 text-sm">
                  {selectedBooking.nights} Nights
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-stone-200 bg-white">
                <span className="text-stone-400 block mb-1">Check-In Date</span>
                <span className="font-medium text-stone-800">
                  {selectedBooking.checkIn} (14:00)
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-stone-200 bg-white">
                <span className="text-stone-400 block mb-1">Check-Out Date</span>
                <span className="font-medium text-stone-800">
                  {selectedBooking.checkOut} (11:00)
                </span>
              </div>
            </div>

            {/* Billing Summary */}
            <div className="p-4 rounded-2xl bg-[#F6F1EA] border border-[#E5D7C3] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#755B31]">Total Booking Tariff</span>
                <p className="text-2xl font-bold text-[#755B31]">
                  ${selectedBooking.amount.toLocaleString()}
                </p>
              </div>
              <Badge variant="success">Payment Verified</Badge>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  toast.success(`Keycard for ${selectedBooking.roomNumber} reissued.`);
                  setSelectedBooking(null);
                }}
                className="flex-1 py-3 px-4 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white text-xs font-semibold tracking-wide transition-colors cursor-pointer"
              >
                Issue Smart Keycard
              </button>
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-5 py-3 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-100 text-xs font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ================= MODAL: QUICK CHECK-IN ================= */}
      <Modal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        title="Quick Guest Check-In"
        subtitle="Process arrival and issue room access key"
      >
        <form onSubmit={handleQuickCheckIn} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              Select or Enter Guest Name
            </label>
            <input
              type="text"
              placeholder="e.g. Lady Sophia Montgomery"
              value={checkInGuestName}
              onChange={(e) => setCheckInGuestName(e.target.value)}
              className="w-full h-11 px-5 rounded-full bg-[#F7F7F6] border border-stone-300 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
            />
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 text-xs text-stone-500">
            <p className="font-semibold text-stone-700 mb-1">Expected Arrivals Today:</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {['Lady Sophia Montgomery', 'Marcus Vance', 'Arthur Pendelton'].map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setCheckInGuestName(g)}
                  className="px-2.5 py-1 bg-white hover:bg-[#F6F1EA] hover:text-[#755B31] border border-stone-200 rounded-full text-[11px] transition-colors cursor-pointer"
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-11 mt-2 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white text-xs font-semibold tracking-wide transition-all shadow-md cursor-pointer"
          >
            Confirm Check-In
          </button>
        </form>
      </Modal>

      {/* ================= MODAL: NEW RESERVATION ================= */}
      <Modal
        isOpen={isNewBookingModalOpen}
        onClose={() => setIsNewBookingModalOpen(false)}
        title="New Reservation"
        subtitle="Book a luxury suite or villa"
      >
        <form onSubmit={handleCreateBooking} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              Guest Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Lord Alistair Croft"
              value={newBookingData.guestName}
              onChange={(e) =>
                setNewBookingData({ ...newBookingData, guestName: e.target.value })
              }
              className="w-full h-11 px-5 rounded-full bg-[#F7F7F6] border border-stone-300 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              Guest Email Address
            </label>
            <input
              type="email"
              placeholder="alistair.croft@estates.co.uk"
              value={newBookingData.guestEmail}
              onChange={(e) =>
                setNewBookingData({ ...newBookingData, guestEmail: e.target.value })
              }
              className="w-full h-11 px-5 rounded-full bg-[#F7F7F6] border border-stone-300 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">
                Suite Category
              </label>
              <select
                value={newBookingData.roomType}
                onChange={(e) =>
                  setNewBookingData({ ...newBookingData, roomType: e.target.value })
                }
                className="w-full h-11 px-4 rounded-full bg-[#F7F7F6] border border-stone-300 text-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
              >
                <option value="Presidential Suite">Presidential Suite ($850/nt)</option>
                <option value="Ocean Villa">Ocean Villa ($650/nt)</option>
                <option value="Deluxe Suite">Deluxe Suite ($350/nt)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">
                Number of Nights
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={newBookingData.nights}
                onChange={(e) =>
                  setNewBookingData({ ...newBookingData, nights: e.target.value })
                }
                className="w-full h-11 px-5 rounded-full bg-[#F7F7F6] border border-stone-300 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-11 mt-2 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white text-xs font-semibold tracking-wide transition-all shadow-md cursor-pointer"
          >
            Create Reservation
          </button>
        </form>
      </Modal>

      {/* ================= MODAL: ADD ROOM ================= */}
      <Modal
        isOpen={isAddRoomModalOpen}
        onClose={() => setIsAddRoomModalOpen(false)}
        title="Add New Room"
        subtitle="Provision an additional room into hotel inventory"
      >
        <form onSubmit={handleAddRoom} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              Room Number
            </label>
            <input
              type="text"
              value={newRoomData.roomNumber}
              onChange={(e) =>
                setNewRoomData({ ...newRoomData, roomNumber: e.target.value })
              }
              className="w-full h-11 px-5 rounded-full bg-[#F7F7F6] border border-stone-300 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">
                Room Category
              </label>
              <select
                value={newRoomData.roomType}
                onChange={(e) =>
                  setNewRoomData({ ...newRoomData, roomType: e.target.value })
                }
                className="w-full h-11 px-4 rounded-full bg-[#F7F7F6] border border-stone-300 text-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
              >
                <option value="Presidential Suite">Presidential Suite</option>
                <option value="Ocean Villa">Ocean Villa</option>
                <option value="Deluxe Suite">Deluxe Suite</option>
                <option value="Executive Room">Executive Room</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">
                Price Per Night ($)
              </label>
              <input
                type="number"
                value={newRoomData.price}
                onChange={(e) =>
                  setNewRoomData({ ...newRoomData, price: e.target.value })
                }
                className="w-full h-11 px-5 rounded-full bg-[#F7F7F6] border border-stone-300 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-11 mt-2 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white text-xs font-semibold tracking-wide transition-all shadow-md cursor-pointer"
          >
            Add to Inventory
          </button>
        </form>
      </Modal>

    </div>
  );
}
