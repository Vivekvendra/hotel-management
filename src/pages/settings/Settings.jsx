import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Building2,
  DollarSign,
  Bell,
  Download,
  RotateCcw,
  Save,
  CheckCircle2,
  Database
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useHotel } from '../../context/HotelContext';

const DEFAULT_SETTINGS = {
  hotelName: 'The Grand Azure',
  tagline: 'Luxury Resort & Coastal Sanctuary',
  contactEmail: 'concierge@grandazure.com',
  phone: '+1 (800) 555-AZURE',
  address: '420 Azure Boulevard, Marina District',
  taxId: '07AAACG0128K1Z4',
  currency: 'USD ($)',
  checkInTime: '14:00',
  checkOutTime: '11:00',
  luxuryTaxRate: 12,
  serviceFee: 50,
  preventDoubleBooking: true,
  autoKeycards: true,
  emailNotifications: true,
  occupancyAlerts: true,
  autoHousekeeping: true,
  dailyDigest: false
};

export default function Settings() {
  const { rooms, guests, bookings, payments } = useHotel();
  const [activeTab, setActiveTab] = useState('property'); // 'property' | 'rates' | 'notifications' | 'data'

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('grand_azure_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      localStorage.setItem('grand_azure_settings', JSON.stringify(settings));
      toast.success('Hotel configuration & preferences saved successfully!');
    } catch (err) {
      toast.error('Failed to save settings: ' + err.message);
    } finally {
      setTimeout(() => setIsSaving(false), 400);
    }
  };

  const handleExportBackup = () => {
    try {
      const backupData = {
        exportedAt: new Date().toISOString(),
        settings,
        rooms,
        guests,
        bookings,
        payments
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Grand_Azure_System_Backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Complete system backup exported successfully!');
    } catch (err) {
      toast.error('Export failed: ' + err.message);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all hotel settings to default luxury values?')) {
      setSettings(DEFAULT_SETTINGS);
      localStorage.setItem('grand_azure_settings', JSON.stringify(DEFAULT_SETTINGS));
      toast.info('Settings restored to default luxury standards.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#F6F1EA] text-[#8C6D3B]">
              <SettingsIcon className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Hotel Settings & System Preferences
            </h1>
          </div>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Configure property profile, tariff calculation policies, operational rules, and database backups.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-medium transition-colors cursor-pointer"
          >
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* Tabs and Form Card */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-3 bg-stone-50/80 border-b border-stone-100">
          <button
            onClick={() => setActiveTab('property')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'property'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-[#8C6D3B]" />
            <span>Property Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('rates')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'rates'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <DollarSign className="w-4 h-4 text-[#8C6D3B]" />
            <span>Tariff & Operating Policies</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Bell className="w-4 h-4 text-[#8C6D3B]" />
            <span>Operational Alerts</span>
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'data'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Database className="w-4 h-4 text-[#8C6D3B]" />
            <span>Data & System Backup</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {/* TAB 1: Property Profile */}
          {activeTab === 'property' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Hotel Identity & Public Information</h3>
                <p className="text-stone-400 text-xs">These branding particulars appear on guest invoices, emails, and dossiers.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Hotel Property Name</label>
                  <input
                    type="text"
                    value={settings.hotelName}
                    onChange={(e) => handleChange('hotelName', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/20"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Brand Tagline</label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => handleChange('tagline', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/20"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Official Concierge Email</label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/20"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Reception Phone Line</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-stone-700 mb-1">Physical Resort Address</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/20"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">GSTIN / Tax Identification ID</label>
                  <input
                    type="text"
                    value={settings.taxId}
                    onChange={(e) => handleChange('taxId', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 font-mono focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/20"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Default Operating Currency</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/20"
                  >
                    <option value="USD ($)">USD ($)</option>
                    <option value="EUR (€)">EUR (€)</option>
                    <option value="GBP (£)">GBP (£)</option>
                    <option value="INR (₹)">INR (₹)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Rates & Policies */}
          {activeTab === 'rates' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Tariff Schedules & Check-In Windows</h3>
                <p className="text-stone-400 text-xs">Standard operating hours and automated tax computation parameters.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Standard Check-In Hour</label>
                  <input
                    type="time"
                    value={settings.checkInTime}
                    onChange={(e) => handleChange('checkInTime', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/20"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Standard Check-Out Hour</label>
                  <input
                    type="time"
                    value={settings.checkOutTime}
                    onChange={(e) => handleChange('checkOutTime', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/20"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Luxury Statutory Tax Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={settings.luxuryTaxRate}
                    onChange={(e) => handleChange('luxuryTaxRate', Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/20 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Concierge Resort Service Fee ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={settings.serviceFee}
                    onChange={(e) => handleChange('serviceFee', Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/20 font-mono"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-4 border-t border-stone-100 space-y-3">
                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-100 cursor-pointer">
                  <div>
                    <div className="font-semibold text-stone-900 text-xs">Strict Double-Booking Overlap Prevention</div>
                    <div className="text-[11px] text-stone-500">Block conflicting stay dates in real time across all room categories.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.preventDoubleBooking}
                    onChange={(e) => handleChange('preventDoubleBooking', e.target.checked)}
                    className="w-4 h-4 rounded text-[#8C6D3B] accent-[#8C6D3B]"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-100 cursor-pointer">
                  <div>
                    <div className="font-semibold text-stone-900 text-xs">Auto-Generate RFID Keycard Identifiers</div>
                    <div className="text-[11px] text-stone-500">Automatically assign unique KEY-XXXX on guest arrival check-in.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoKeycards}
                    onChange={(e) => handleChange('autoKeycards', e.target.checked)}
                    className="w-4 h-4 rounded text-[#8C6D3B] accent-[#8C6D3B]"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: Operational Alerts */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Front Desk & Concierge Alerts</h3>
                <p className="text-stone-400 text-xs">Manage system notification banners and internal operational triggers.</p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-100 cursor-pointer">
                  <div>
                    <div className="font-semibold text-stone-900 text-xs">New Reservation Instant Alerts</div>
                    <div className="text-[11px] text-stone-500">Display notification when a new guest booking is confirmed.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                    className="w-4 h-4 rounded text-[#8C6D3B] accent-[#8C6D3B]"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-100 cursor-pointer">
                  <div>
                    <div className="font-semibold text-stone-900 text-xs">High Occupancy Threshold Warnings</div>
                    <div className="text-[11px] text-stone-500">Trigger alert banner whenever hotel room occupancy surpasses 75%.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.occupancyAlerts}
                    onChange={(e) => handleChange('occupancyAlerts', e.target.checked)}
                    className="w-4 h-4 rounded text-[#8C6D3B] accent-[#8C6D3B]"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-100 cursor-pointer">
                  <div>
                    <div className="font-semibold text-stone-900 text-xs">Housekeeping Automatic Turnover Dispatch</div>
                    <div className="text-[11px] text-stone-500">Immediately transition room availability upon guest check-out clearance.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoHousekeeping}
                    onChange={(e) => handleChange('autoHousekeeping', e.target.checked)}
                    className="w-4 h-4 rounded text-[#8C6D3B] accent-[#8C6D3B]"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: Data & Backup */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Database Archival & System Integrity</h3>
                <p className="text-stone-400 text-xs">Export live operational data and manage local storage persistence.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50/60 space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F6F1EA] text-[#8C6D3B] flex items-center justify-center">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-xs">Export Full JSON System Backup</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Download a single JSON file containing all active rooms, guests, bookings, and billing history.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleExportBackup}
                    className="px-4 py-2 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JSON Backup</span>
                  </button>
                </div>

                <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50/60 space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-xs">Restore Factory Default Settings</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Reset brand parameters, tax percentages, and operational timings to default luxury configuration.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="px-4 py-2 rounded-full border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Restore Standard Defaults
                  </button>
                </div>
              </div>

              {/* Data Summary Stats */}
              <div className="p-4 rounded-2xl bg-[#F6F1EA] border border-[#E8DAC8] text-xs flex flex-wrap items-center justify-between gap-3 text-[#755B31]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold">Local Storage Synchronized</span>
                </div>
                <div className="flex items-center gap-4 text-[11px] font-mono">
                  <span>{rooms.length} Rooms</span>
                  <span>•</span>
                  <span>{guests.length} Guests</span>
                  <span>•</span>
                  <span>{bookings.length} Bookings</span>
                  <span>•</span>
                  <span>{payments.length} Payments</span>
                </div>
              </div>
            </div>
          )}

          {/* Form Submit Footer */}
          <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Configuration'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
