import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BedDouble,
  Users,
  CalendarCheck,
  KeyRound,
  CreditCard,
  History,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';
import { initialMockData } from '../../data/mockData';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Room Management', icon: BedDouble, path: '/rooms' },
    { name: 'Guest Directory', icon: Users, path: '/guests' },
    { name: 'Room Bookings', icon: CalendarCheck, path: '/bookings' },
    { name: 'Check-In / Out', icon: KeyRound, path: '/checkin-checkout', badge: '18 arrivals' },
    { name: 'Billing & Payments', icon: CreditCard, path: '/payments' },
    { name: 'Booking History', icon: History, path: '/history' },
    { name: 'Reports & Insights', icon: BarChart3, path: '/reports' },
    { name: 'Hotel Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-stone-200/90 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header with Brand Logo */}
          <div className="h-20 px-6 border-b border-stone-100 flex items-center justify-between">
            <Logo size="normal" />
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
            <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
              Operations & Management
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.active || location.pathname === item.path;

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    if (item.path !== '#') {
                      navigate(item.path);
                    }
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-[#8C6D3B] text-white shadow-xs font-semibold'
                      : 'text-stone-600 hover:bg-[#F6F1EA] hover:text-[#755B31]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? 'text-white'
                          : 'text-stone-400 group-hover:text-[#8C6D3B]'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-stone-100 text-stone-600 group-hover:bg-[#EAE0D2] group-hover:text-[#755B31]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* User Profile Card & Sign Out at Sidebar Bottom */}
          <div className="p-4 border-t border-stone-100 bg-[#FAF9F6]/60">
            <div className="p-3 bg-white rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={
                    user?.avatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={user?.name || 'User'}
                  className="w-9 h-9 rounded-full object-cover border border-[#8C6D3B]/30 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-stone-900 truncate">
                    {user?.name || 'Grand Azure Staff'}
                  </p>
                  <p className="text-[11px] text-stone-400 truncate">
                    {user?.role || 'Staff Member'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-stone-200/90 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
          {/* Left: Mobile Menu & Live Date */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:block">
              <h2 className="text-sm font-semibold text-stone-900">
                The Grand Azure Riviera
              </h2>
              <p className="text-xs text-stone-400">
                Luxury Resort & Suite Management Portal
              </p>
            </div>
          </div>

          {/* Right: Search, Notifications, Profile Menu */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative hidden md:block w-64 lg:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search guests, rooms, bookings..."
                className="w-full h-10 pl-9 pr-4 rounded-full bg-[#F7F7F6] border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B] transition-all"
              />
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="relative p-2.5 rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#8C6D3B] ring-2 ring-white"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-stone-200 p-4 z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <span className="text-xs font-semibold text-stone-800 uppercase tracking-wider">
                      Live Notifications
                    </span>
                    <span className="text-[11px] text-[#8C6D3B] font-medium cursor-pointer">
                      Mark all as read
                    </span>
                  </div>

                  <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                    {initialMockData.notifications.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-stone-50 hover:bg-[#F6F1EA] transition-colors border border-stone-100"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-stone-900">
                            {item.title}
                          </p>
                          <span className="text-[10px] text-stone-400">{item.time}</span>
                        </div>
                        <p className="text-xs text-stone-600 mt-1">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                <span className="text-xs font-medium text-stone-800 hidden sm:inline">
                  {user?.name?.split(' ')[0] || 'Admin'}
                </span>
                <img
                  src={
                    user?.avatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={user?.name || 'User'}
                  className="w-7 h-7 rounded-full object-cover border border-[#8C6D3B]/40"
                />
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 animate-in fade-in duration-150">
                  <div className="p-3 border-b border-stone-100">
                    <p className="text-xs font-semibold text-stone-900">{user?.name}</p>
                    <p className="text-[11px] text-stone-400 truncate">{user?.email}</p>
                    <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-[#8C6D3B] bg-[#F6F1EA] px-2 py-0.5 rounded-full">
                      <Sparkles className="w-3 h-3" />
                      <span>{user?.role}</span>
                    </div>
                  </div>

                  <div className="pt-2 space-y-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/settings');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-[#8C6D3B]" />
                      <span>Hotel Settings</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
