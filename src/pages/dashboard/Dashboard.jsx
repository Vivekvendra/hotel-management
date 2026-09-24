import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  LogIn,
  LogOut,
  DollarSign,
  Clock,
  Crown,
  Share2,
  CheckCircle2,
  PlusCircle,
  Search,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const { bookings, createBooking } = useHotel();

  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Quick Action Modal
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);

  // Form state for quick booking modal
  const [newBookingData, setNewBookingData] = useState(() => ({
    guestName: '',
    guestEmail: '',
    roomNumber: 'PH-401',
    nights: 3,
    checkIn: '2026-09-24',
    checkOut: '2026-09-27'
  }));

  // Telemetry refresh simulation
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Live telemetry & occupancy outlook synchronized.');
    }, 500);
  };

  // Filtered Bookings for Ledger Table
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        b.guestName.toLowerCase().includes(q) ||
        b.guestEmail.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.roomNumber.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'All' ? true : b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);


  // Quick Reservation submission
  const handleQuickReservation = (e) => {
    e.preventDefault();
    if (!newBookingData.guestName || !newBookingData.guestEmail) {
      toast.error('Please enter guest details');
      return;
    }
    const res = createBooking({
      ...newBookingData,
      roomType: 'Deluxe Suite',
      amount: 1140
    });
    if (res.success) {
      setIsNewBookingModalOpen(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <Badge variant="info">Confirmed</Badge>;
      case 'Checked In':
        return <Badge variant="success">Checked In</Badge>;
      case 'Checked Out':
        return <Badge variant="default">Checked Out</Badge>;
      case 'Cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* ================= DASHBOARD HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8C6D3B]/10 text-[#8C6D3B] text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Grand Azure Telemetry Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-900 tracking-tight">
            Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-stone-500 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync Telemetry</span>
          </button>

          <button
            onClick={() => setIsNewBookingModalOpen(true)}
            className="px-5 py-2 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white text-xs font-semibold tracking-wide flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Reservation</span>
          </button>
        </div>
      </div>

      {/* ================= ROW 1: OCCUPANCY RATE HERO & 4 STAT CARDS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Large Prominent Card: Occupancy Rate with Wave Area Graph */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-medium text-stone-600 tracking-wide">
                  Occupancy Rate
                </span>
                <div className="flex items-baseline gap-3 mt-1.5">
                  <h2 className="text-4xl font-bold text-stone-900 tracking-tight font-serif-luxury">
                    84%
                  </h2>
                </div>
              </div>

              {/* Icon badge in top right (Luxury Bronze) */}
              <div className="w-10 h-10 rounded-2xl bg-[#8C6D3B] text-white flex items-center justify-center shadow-xs">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3 w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#8C6D3B] h-full rounded-full w-[84%]"></div>
            </div>

            <p className="text-xs text-stone-400 mt-2">
              128 of 152 rooms occupied
            </p>
          </div>

          {/* Smooth Continuous Wave Area Graph (Matching reference layout in Luxury Bronze) */}
          <div className="mt-4 pt-2 -mx-6 -mb-4">
            <svg
              className="w-full h-24 overflow-visible"
              viewBox="0 0 400 120"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="bronzeWaveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8C6D3B" stopOpacity="0.32" />
                  <stop offset="85%" stopColor="#8C6D3B" stopOpacity="0.03" />
                  <stop offset="100%" stopColor="#8C6D3B" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Gradient Area */}
              <path
                d="M0,85 C50,95 80,60 130,70 C180,80 210,40 260,50 C310,60 340,30 400,45 L400,120 L0,120 Z"
                fill="url(#bronzeWaveGrad)"
              />

              {/* Top Smooth Wave Curve Stroke */}
              <path
                d="M0,85 C50,95 80,60 130,70 C180,80 210,40 260,50 C310,60 340,30 400,45"
                fill="none"
                stroke="#8C6D3B"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Trend Bottom Note */}
          <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+3.2% from yesterday</span>
            </div>
            <span className="text-stone-400 text-[11px]">Daily Audit</span>
          </div>
        </div>

        {/* 4 Cards Grid Alongside Occupancy Rate (Col 8) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Card 1: Arrivals Today */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs flex items-start justify-between hover:border-[#8C6D3B]/40 transition-all">
            <div>
              <span className="text-xs font-medium text-stone-500 tracking-wide">
                Arrivals Today
              </span>
              <h3 className="text-3xl font-bold text-stone-900 mt-1 font-serif-luxury">
                16
              </h3>
              <p className="text-xs text-stone-400 mt-2 font-normal">
                6 check-in ready
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-[#8C6D3B] text-white flex items-center justify-center shrink-0 shadow-xs">
              <LogIn className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Departures Today */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs flex items-start justify-between hover:border-[#8C6D3B]/40 transition-all">
            <div>
              <span className="text-xs font-medium text-stone-500 tracking-wide">
                Departures Today
              </span>
              <h3 className="text-3xl font-bold text-stone-900 mt-1 font-serif-luxury">
                14
              </h3>
              <p className="text-xs text-stone-400 mt-2 font-normal">
                8 cleared
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-[#8C6D3B] text-white flex items-center justify-center shrink-0 shadow-xs">
              <LogOut className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: Todays Revenue */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs flex items-start justify-between hover:border-[#8C6D3B]/40 transition-all">
            <div>
              <span className="text-xs font-medium text-stone-500 tracking-wide">
                Todays Revenue
              </span>
              <h3 className="text-3xl font-bold text-stone-900 mt-1 font-serif-luxury">
                $24.800
              </h3>
              <div className="flex items-center gap-1 text-rose-500 text-xs font-medium mt-2">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>-3.2% from yesterday</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-[#8C6D3B] text-white flex items-center justify-center shrink-0 shadow-xs">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          {/* Card 4: Arrival Readiness */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs flex items-start justify-between hover:border-[#8C6D3B]/40 transition-all">
            <div>
              <span className="text-xs font-medium text-stone-500 tracking-wide">
                Arrival Readiness
              </span>
              <h3 className="text-3xl font-bold text-stone-900 mt-1 font-serif-luxury">
                75%
              </h3>
              <p className="text-xs text-stone-400 mt-2 font-normal">
                12 of 16 rooms ready
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <div className="w-11 h-11 rounded-2xl bg-[#8C6D3B] text-white flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold">
                4 in progress
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* ================= ROW 2: LIVE OPERATIONS, PRESSURE/PRIORITIES, ROOM READINESS DONUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Live Operations Timeline (Col 4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-stone-100 flex items-center justify-between">
              <h3 className="text-base font-serif-luxury font-bold text-stone-900">
                Live Operations
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            <div className="mt-4 relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {/* Event 1 */}
              <div className="relative group">
                <div className="absolute -left-[27px] top-1 w-2.5 h-2.5 rounded-full bg-[#8C6D3B] ring-4 ring-white"></div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-stone-400">09:30</span>
                  <span className="text-xs font-bold text-stone-800">VIP arrival</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Suite 504 • transfer confirmed
                </p>
              </div>

              {/* Event 2 */}
              <div className="relative group">
                <div className="absolute -left-[27px] top-1 w-2.5 h-2.5 rounded-full bg-[#8C6D3B] ring-4 ring-white"></div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-stone-400">11:00</span>
                  <span className="text-xs font-bold text-stone-800">Group departure</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  6 rooms • east wing
                </p>
              </div>

              {/* Event 3 */}
              <div className="relative group">
                <div className="absolute -left-[27px] top-1 w-2.5 h-2.5 rounded-full bg-stone-300 ring-4 ring-white"></div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-stone-400">13:30</span>
                  <span className="text-xs font-bold text-stone-800">Early check-in request</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Room 312 • pending housekeeping release
                </p>
              </div>

              {/* Event 4 */}
              <div className="relative group">
                <div className="absolute -left-[27px] top-1 w-2.5 h-2.5 rounded-full bg-stone-300 ring-4 ring-white"></div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-stone-400">15:00</span>
                  <span className="text-xs font-bold text-stone-800">Suite inspection</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Presidential suite • final readiness check
                </p>
              </div>

              {/* Event 5 */}
              <div className="relative group">
                <div className="absolute -left-[27px] top-1 w-2.5 h-2.5 rounded-full bg-stone-300 ring-4 ring-white"></div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-stone-400">16:30</span>
                  <span className="text-xs font-bold text-stone-800">Private dining setup</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Suite 601 • special menu requested
                </p>
              </div>

              {/* Event 6 */}
              <div className="relative group">
                <div className="absolute -left-[27px] top-1 w-2.5 h-2.5 rounded-full bg-[#8C6D3B] ring-4 ring-white"></div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-stone-400">18:30</span>
                  <span className="text-xs font-bold text-stone-800">Peak arrival window</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  3 VIP guests expected between 18:30-20:00
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Arrival Pressure, VIP Priorities, Service Coordination (Col 4) */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          
          {/* Card: Arrival Pressure */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs">
            <div className="flex items-center gap-2 text-stone-700 mb-2">
              <Clock className="w-4 h-4 text-[#8C6D3B]" />
              <span className="text-xs font-bold text-stone-800">Arrival Pressure</span>
            </div>
            <p className="text-sm font-bold text-stone-900">
              68% peak-window load
            </p>
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden my-2">
              <div className="bg-[#8C6D3B] h-full rounded-full w-[68%]"></div>
            </div>
            <p className="text-[11px] text-stone-500">
              3 VIP arrivals expected after 18:30
            </p>
          </div>

          {/* Card: VIP Service Priorities */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs">
            <div className="flex items-center gap-2 text-stone-700 mb-2">
              <Crown className="w-4 h-4 text-[#8C6D3B]" />
              <span className="text-xs font-bold text-stone-800">VIP Service Priorities</span>
            </div>
            <p className="text-sm font-bold text-stone-900">
              2 VIP service priorities active
            </p>
            <p className="text-[11px] text-stone-500 mt-2 leading-relaxed">
              Arrival and dining preparation currently in motion across premium suites
            </p>
          </div>

          {/* Card: Service Coordination */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs">
            <div className="flex items-center gap-2 text-stone-700 mb-2">
              <Share2 className="w-4 h-4 text-[#8C6D3B]" />
              <span className="text-xs font-bold text-stone-800">Service Coordination</span>
            </div>
            <p className="text-sm font-bold text-stone-900">
              74% evening service load
            </p>
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden my-2">
              <div className="bg-[#8C6D3B] h-full rounded-full w-[74%]"></div>
            </div>
            <p className="text-[11px] text-stone-500">
              Dining and service load rising after 19:00
            </p>
          </div>

        </div>

        {/* Right: Room Readiness Donut Chart (Col 4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-serif-luxury font-bold text-stone-900 mb-2">
              Room Readiness
            </h3>

            {/* Donut Chart Visual SVG (Matches Reference Image in Luxury Bronze/Gold Scheme) */}
            <div className="relative w-44 h-44 mx-auto my-3 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#FAF9F6"
                  strokeWidth="11"
                />

                {/* 1. Occupied segment (84%) -> strokeDasharray="200 238" strokeDashoffset="0" */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#8C6D3B"
                  strokeWidth="11"
                  strokeDasharray="180 238"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />

                {/* 2. Available Now segment (5%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#B89358"
                  strokeWidth="11"
                  strokeDasharray="20 238"
                  strokeDashoffset="-185"
                  strokeLinecap="round"
                />

                {/* 3. In Turnover segment (7%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#D8BA84"
                  strokeWidth="11"
                  strokeDasharray="16 238"
                  strokeDashoffset="-207"
                  strokeLinecap="round"
                />

                {/* 4. Unavailable segment (4%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#E8DAC8"
                  strokeWidth="11"
                  strokeDasharray="10 238"
                  strokeDashoffset="-225"
                  strokeLinecap="round"
                />
              </svg>

              {/* Center Stat */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold font-serif-luxury text-stone-900 leading-none">
                  46
                </span>
                <span className="text-[10px] text-stone-500 font-medium mt-1">
                  prepared rooms
                </span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-4 rounded-md bg-[#8C6D3B] text-[10px] text-white font-bold flex items-center justify-center">
                    84%
                  </span>
                  <span className="text-stone-700">Occupied</span>
                </div>
                <strong className="text-stone-900">128</strong>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-4 rounded-md bg-[#B89358] text-[10px] text-white font-bold flex items-center justify-center">
                    5%
                  </span>
                  <span className="text-stone-700">Available Now</span>
                </div>
                <strong className="text-stone-900">9</strong>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-4 rounded-md bg-[#D8BA84] text-[10px] text-stone-900 font-bold flex items-center justify-center">
                    7%
                  </span>
                  <span className="text-stone-700">In Turnover</span>
                </div>
                <strong className="text-stone-900">8</strong>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-4 rounded-md bg-[#E8DAC8] text-[10px] text-stone-800 font-bold flex items-center justify-center">
                    4%
                  </span>
                  <span className="text-stone-700">Unavailable</span>
                </div>
                <strong className="text-stone-900">7</strong>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ================= ROW 3: OCCUPANCY OUTLOOK & REVENUE PULSE COMPARATIVE GRAPHS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Occupancy Outlook Graph */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-serif-luxury font-bold text-stone-900">
                Occupancy Outlook
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">84% current</p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8C6D3B]"></span>
                <span className="text-stone-700 font-medium">This week</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D8BA84]"></span>
                <span className="text-stone-400 font-medium">Last week</span>
              </div>
            </div>
          </div>

          {/* Comparative Area Curve Graph */}
          <div className="pt-2">
            <svg
              className="w-full h-40 overflow-visible"
              viewBox="0 0 500 150"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="outlookGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8C6D3B" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#8C6D3B" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f0ec" strokeDasharray="4 4" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#f1f0ec" strokeDasharray="4 4" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f0ec" strokeDasharray="4 4" />

              {/* Last Week Line (Dashed lighter bronze) */}
              <path
                d="M10,95 Q80,110 160,85 T320,70 T500,60"
                fill="none"
                stroke="#D8BA84"
                strokeWidth="2"
                strokeDasharray="5 5"
              />

              {/* This Week Area */}
              <path
                d="M10,80 Q80,60 160,40 T320,35 T500,20 L500,150 L10,150 Z"
                fill="url(#outlookGrad)"
              />

              {/* This Week Solid Line */}
              <path
                d="M10,80 Q80,60 160,40 T320,35 T500,20"
                fill="none"
                stroke="#8C6D3B"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Data points */}
              <circle cx="160" cy="40" r="4" fill="#8C6D3B" stroke="#ffffff" strokeWidth="2" />
              <circle cx="320" cy="35" r="4" fill="#8C6D3B" stroke="#ffffff" strokeWidth="2" />
              <circle cx="500" cy="20" r="4" fill="#8C6D3B" stroke="#ffffff" strokeWidth="2" />
            </svg>

            {/* X-axis days */}
            <div className="flex justify-between text-[11px] text-stone-400 mt-2 px-2">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Revenue Pulse Graph */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-serif-luxury font-bold text-stone-900">
                Revenue Pulse
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-bold text-stone-800">$24.800 today</span>
                <span className="text-[11px] text-rose-500 font-semibold">-3.2% from yesterday</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8C6D3B]"></span>
                <span className="text-stone-700 font-medium">This week</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D8BA84]"></span>
                <span className="text-stone-400 font-medium">Last week</span>
              </div>
            </div>
          </div>

          {/* Revenue Bar / Area Pulse Graph */}
          <div className="pt-2">
            <svg
              className="w-full h-40 overflow-visible"
              viewBox="0 0 500 150"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="pulseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8C6D3B" stopOpacity="0.30" />
                  <stop offset="100%" stopColor="#8C6D3B" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f0ec" strokeDasharray="4 4" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#f1f0ec" strokeDasharray="4 4" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f0ec" strokeDasharray="4 4" />

              {/* Last Week Line */}
              <path
                d="M10,110 Q100,70 180,90 T350,65 T500,75"
                fill="none"
                stroke="#D8BA84"
                strokeWidth="2"
                strokeDasharray="5 5"
              />

              {/* This Week Pulse Curve */}
              <path
                d="M10,85 Q100,45 180,60 T350,30 T500,40 L500,150 L10,150 Z"
                fill="url(#pulseGrad)"
              />
              <path
                d="M10,85 Q100,45 180,60 T350,30 T500,40"
                fill="none"
                stroke="#8C6D3B"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Data Highlights */}
              <circle cx="180" cy="60" r="4" fill="#8C6D3B" stroke="#ffffff" strokeWidth="2" />
              <circle cx="350" cy="30" r="4" fill="#8C6D3B" stroke="#ffffff" strokeWidth="2" />
              <circle cx="500" cy="40" r="4" fill="#8C6D3B" stroke="#ffffff" strokeWidth="2" />
            </svg>

            {/* X-axis days */}
            <div className="flex justify-between text-[11px] text-stone-400 mt-2 px-2">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

      </div>

      {/* ================= RECENT BOOKINGS LEDGER ================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-100">
          <div>
            <h3 className="text-lg font-serif-luxury font-bold text-stone-900">
              Recent Bookings & Ledger
            </h3>
            <p className="text-xs text-stone-400">Live arrivals and reservations</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guest, ID, room..."
                className="w-full h-9 pl-9 pr-4 rounded-full bg-[#F7F7F6] border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
              />
            </div>

            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-full text-xs">
              {['All', 'Confirmed', 'Checked In', 'Checked Out'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
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
        </div>

        {filteredBookings.length === 0 ? (
          <EmptyState
            title="No Bookings Found"
            description="No reservations match the query criteria."
            actionText="Clear Filter"
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
                  <th className="py-3 px-4 font-semibold">Booking ID</th>
                  <th className="py-3 px-4 font-semibold">Guest</th>
                  <th className="py-3 px-4 font-semibold">Room & Type</th>
                  <th className="py-3 px-4 font-semibold">Dates</th>
                  <th className="py-3 px-4 font-semibold">Amount</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredBookings.slice(0, 5).map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-stone-50/80 transition-colors group cursor-pointer"
                    onClick={() => setSelectedBooking(b)}
                  >
                    <td className="py-3 px-4 font-semibold text-stone-900 font-mono">
                      {b.id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-stone-800">
                      {b.guestName}
                    </td>
                    <td className="py-3 px-4">
                      {b.roomNumber} ({b.roomType})
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      {b.checkIn} → {b.checkOut}
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-900">
                      ${b.amount?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(b.status)}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(b);
                        }}
                        className="px-3 py-1 rounded-full border border-stone-200 hover:border-[#8C6D3B] hover:bg-[#F6F1EA] text-[#8C6D3B] text-xs font-medium cursor-pointer"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODAL: BOOKING SUMMARY ================= */}
      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Reservation Details"
        subtitle={`Booking Ref: ${selectedBooking?.id}`}
      >
        {selectedBooking && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
              <p className="font-bold text-sm text-stone-900">{selectedBooking.guestName}</p>
              <p className="text-stone-500">{selectedBooking.guestEmail}</p>
              <div className="mt-2">{getStatusBadge(selectedBooking.status)}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-stone-200">
                <span className="text-stone-400 block mb-0.5">Assigned Room</span>
                <strong className="text-stone-800">{selectedBooking.roomNumber}</strong>
                <p className="text-[11px] text-stone-500">{selectedBooking.roomType}</p>
              </div>
              <div className="p-3 rounded-xl border border-stone-200">
                <span className="text-stone-400 block mb-0.5">Duration</span>
                <strong className="text-stone-800">{selectedBooking.nights} Nights</strong>
                <p className="text-[11px] text-stone-500">
                  {selectedBooking.checkIn} to {selectedBooking.checkOut}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F6F1EA] border border-[#E8DAC8] flex items-center justify-between">
              <div>
                <span className="text-stone-500 text-[11px] block">Total Tariff</span>
                <strong className="text-xl text-[#755B31]">
                  ${selectedBooking.amount?.toLocaleString()}
                </strong>
              </div>
              <Badge variant="success">Confirmed</Badge>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-5 py-2.5 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ================= MODAL: QUICK NEW RESERVATION ================= */}
      <Modal
        isOpen={isNewBookingModalOpen}
        onClose={() => setIsNewBookingModalOpen(false)}
        title="New Reservation"
        subtitle="Quick guest reservation entry"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleQuickReservation} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-stone-600 mb-1">Guest Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Lord Alistair Croft"
              value={newBookingData.guestName}
              onChange={(e) => setNewBookingData({ ...newBookingData, guestName: e.target.value })}
              className="w-full h-10 px-4 rounded-full bg-[#F7F7F6] border border-stone-300 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-600 mb-1">Guest Email *</label>
            <input
              type="email"
              required
              placeholder="name@domain.com"
              value={newBookingData.guestEmail}
              onChange={(e) => setNewBookingData({ ...newBookingData, guestEmail: e.target.value })}
              className="w-full h-10 px-4 rounded-full bg-[#F7F7F6] border border-stone-300 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-stone-600 mb-1">Check-In</label>
              <input
                type="date"
                value={newBookingData.checkIn}
                onChange={(e) => setNewBookingData({ ...newBookingData, checkIn: e.target.value })}
                className="w-full h-10 px-3 rounded-full bg-[#F7F7F6] border border-stone-300 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-600 mb-1">Check-Out</label>
              <input
                type="date"
                value={newBookingData.checkOut}
                onChange={(e) => setNewBookingData({ ...newBookingData, checkOut: e.target.value })}
                className="w-full h-10 px-3 rounded-full bg-[#F7F7F6] border border-stone-300 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewBookingModalOpen(false)}
              className="px-4 py-2 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white font-semibold shadow-md cursor-pointer"
            >
              Create
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
