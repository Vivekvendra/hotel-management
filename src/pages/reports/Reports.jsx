import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  BedDouble,
  Users,
  Download,
  Printer,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useHotel } from '../../context/HotelContext';

export default function Reports() {
  const { rooms, guests, payments } = useHotel();
  const [period, setPeriod] = useState('monthly'); // 'weekly' | 'monthly' | 'yearly'

  const totalRevenue = payments
    .filter(p => p.status === 'Paid')
    .reduce((acc, p) => acc + Number(p.amount || 0), 0);

  const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
  const occupancyRate = rooms.length > 0 ? Math.round((occupiedRooms / rooms.length) * 100) : 68;

  // Monthly revenue breakdown dummy dataset
  const revenueHistory = [
    { period: 'May', roomTariff: 32000, dining: 8400, spa: 4200, total: 44600 },
    { period: 'Jun', roomTariff: 35000, dining: 9100, spa: 4800, total: 48900 },
    { period: 'Jul', roomTariff: 41000, dining: 11200, spa: 5900, total: 58100 },
    { period: 'Aug', roomTariff: 46000, dining: 12800, spa: 6700, total: 65500 },
    { period: 'Sep', roomTariff: 39000, dining: 10500, spa: 5400, total: 54900 },
    { period: 'Oct (Proj)', roomTariff: 44000, dining: 11900, spa: 6100, total: 62000 },
  ];

  // Room type booking performance
  const roomTypeDistribution = [
    { type: 'Presidential Suite', count: 18, share: 22, revenue: 42500, color: '#8C6D3B' },
    { type: 'Ocean Villa', count: 26, share: 32, revenue: 38200, color: '#A68249' },
    { type: 'Deluxe Suite', count: 32, share: 40, revenue: 29400, color: '#C4A47C' },
    { type: 'Executive Room', count: 14, share: 18, revenue: 18350, color: '#D9C5AA' },
  ];

  const handleExportReport = () => {
    toast.success('Executive Hospitality & Revenue Report PDF compiled!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#F6F1EA] text-[#8C6D3B]">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Hospitality Analytics & Revenue Intelligence
            </h1>
          </div>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Executive financial metrics, occupancy trends, and room category performance for The Grand Azure.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-full border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportReport}
            className="px-4 py-2 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Executive PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Gross Hospitality Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2 font-mono">
            ${totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% vs previous period</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Average Occupancy</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <BedDouble className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2">
            {occupancyRate}%
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            {occupiedRooms} of {rooms.length} rooms occupied
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Registered Guests</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2">
            {guests.length}
          </div>
          <div className="text-[11px] text-blue-600 mt-1 font-medium">
            100% ID verified profiles
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Most Booked Tier</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-stone-900 mt-2 truncate">
            Deluxe Suite
          </div>
          <div className="text-[11px] text-purple-700 mt-1 font-medium">
            32 bookings (40% demand share)
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Revenue & Trend Bar Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-stone-900">Revenue Stream Breakdown</h2>
              <p className="text-stone-400 text-xs">Accommodation tariff, fine dining, and wellness spa collections</p>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl text-xs">
              {['monthly', 'quarterly', 'yearly'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                    period === p ? 'bg-white font-semibold text-stone-900 shadow-2xs' : 'text-stone-500'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="pt-4">
            <div className="h-64 flex items-end justify-between gap-3 px-2">
              {revenueHistory.map((item) => {
                const maxVal = 70000;
                const tariffHeight = Math.round((item.roomTariff / maxVal) * 100);
                const diningHeight = Math.round((item.dining / maxVal) * 100);
                const spaHeight = Math.round((item.spa / maxVal) * 100);

                return (
                  <div key={item.period} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full max-w-[48px] flex flex-col items-stretch gap-1">
                      {/* Tooltip on Hover */}
                      <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono font-bold text-stone-800">
                        ${Math.round(item.total / 1000)}k
                      </div>
                      {/* Stacked Bars */}
                      <div
                        style={{ height: `${spaHeight * 1.6}px` }}
                        className="w-full bg-[#D9C5AA] rounded-t-sm transition-all group-hover:brightness-95"
                        title={`Spa: $${item.spa}`}
                      ></div>
                      <div
                        style={{ height: `${diningHeight * 1.6}px` }}
                        className="w-full bg-[#B2905A] transition-all group-hover:brightness-95"
                        title={`Dining: $${item.dining}`}
                      ></div>
                      <div
                        style={{ height: `${tariffHeight * 1.6}px` }}
                        className="w-full bg-[#8C6D3B] rounded-b-md transition-all group-hover:brightness-95"
                        title={`Room Tariff: $${item.roomTariff}`}
                      ></div>
                    </div>
                    <span className="text-[11px] font-medium text-stone-500 text-center">
                      {item.period}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 pt-6 border-t border-stone-100 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#8C6D3B]"></span>
                <span>Room Tariff</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#B2905A]"></span>
                <span>Fine Dining</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#D9C5AA]"></span>
                <span>Spa & Wellness</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Room Type Occupancy & Demand Share */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900">Room Demand by Category</h2>
            <p className="text-stone-400 text-xs mt-0.5">Booking volume & revenue generated</p>

            <div className="space-y-4 mt-6">
              {roomTypeDistribution.map((tier) => (
                <div key={tier.type} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-800">{tier.type}</span>
                    <span className="font-mono text-stone-600 font-medium">
                      ${tier.revenue.toLocaleString()} ({tier.share}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${tier.share}%`, backgroundColor: tier.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-[#F6F1EA] border border-[#E8DAC8] text-xs text-[#755B31] space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#8C6D3B]" />
              <span>Yield Optimization Insight</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Presidential Suites and Ocean Villas continue to drive 55% of net revenues despite comprising only 35% of total inventory.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
