import React from 'react';
import {
  Calendar,
  BedDouble,
  DollarSign,
  XCircle
} from 'lucide-react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';

export default function BookingDetailModal({ isOpen, onClose, booking, onCancel }) {
  if (!booking) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Reservation Dossier • ${booking.id}`} size="lg">
      <div className="space-y-6 text-xs text-stone-800">
        
        {/* Header Profile Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#F6F1EA] border border-[#E8DAC8]">
          <div className="flex items-center gap-3">
            <img
              src={booking.guestAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={booking.guestName}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-stone-900 text-base">{booking.guestName}</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white text-stone-600 border border-stone-200">
                  {booking.id}
                </span>
              </div>
              <p className="text-stone-500 text-[11px]">{booking.guestEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={
                booking.status === 'Checked In'
                  ? 'success'
                  : booking.status === 'Confirmed'
                  ? 'info'
                  : booking.status === 'Cancelled'
                  ? 'error'
                  : 'neutral'
              }
            >
              {booking.status}
            </Badge>
            <span className="px-3 py-1 rounded-full bg-white text-[#8C6D3B] font-bold border border-[#E8DAC8]">
              Room {booking.roomNumber}
            </span>
          </div>
        </div>

        {/* Accommodation & Stay Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
            <div className="flex items-center gap-2 font-bold text-stone-900 text-xs">
              <BedDouble className="w-4 h-4 text-[#8C6D3B]" />
              <span>Room Information</span>
            </div>
            <div className="space-y-1 text-stone-600 text-[11px]">
              <div className="flex justify-between">
                <span>Room Number:</span>
                <span className="font-semibold text-stone-900">{booking.roomNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Room Type:</span>
                <span className="font-semibold text-stone-900">{booking.roomType}</span>
              </div>
              <div className="flex justify-between">
                <span>Keycard Assignment:</span>
                <span className="font-mono text-stone-700">{booking.keyCard || 'Standard RFID Issued'}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
            <div className="flex items-center gap-2 font-bold text-stone-900 text-xs">
              <Calendar className="w-4 h-4 text-[#8C6D3B]" />
              <span>Stay Duration & Dates</span>
            </div>
            <div className="space-y-1 text-stone-600 text-[11px]">
              <div className="flex justify-between">
                <span>Check-In Date:</span>
                <span className="font-semibold text-stone-900">{booking.checkIn}</span>
              </div>
              <div className="flex justify-between">
                <span>Check-Out Date:</span>
                <span className="font-semibold text-stone-900">{booking.checkOut}</span>
              </div>
              <div className="flex justify-between">
                <span>Calculated Nights:</span>
                <span className="font-semibold text-[#8C6D3B]">{booking.nights} Nights</span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Particulars */}
        <div className="p-4 rounded-xl border border-stone-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-stone-900 text-xs">
              <DollarSign className="w-4 h-4 text-[#8C6D3B]" />
              <span>Financial & Billing Particulars</span>
            </div>
            <Badge variant={booking.paymentStatus === 'Paid' ? 'success' : 'warning'}>
              {booking.paymentStatus || 'Paid'}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="p-2.5 rounded-lg bg-stone-50">
              <div className="text-[10px] text-stone-400 uppercase">Tariff per Night</div>
              <div className="font-bold text-stone-900 text-sm mt-0.5 font-mono">
                ${Math.round(booking.amount / (booking.nights || 1)).toLocaleString()}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-stone-50">
              <div className="text-[10px] text-stone-400 uppercase">Tax & Concierge</div>
              <div className="font-bold text-stone-900 text-sm mt-0.5 font-mono">Inclusive</div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#FAF9F6] border border-[#E8DAC8]">
              <div className="text-[10px] text-[#8C6D3B] font-bold uppercase">Total Settled</div>
              <div className="font-bold text-[#8C6D3B] text-sm mt-0.5 font-mono">
                ${Number(booking.amount).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Cancellation Information if Cancelled */}
        {booking.status === 'Cancelled' && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Reservation Cancelled</span>
            </div>
            <p className="text-[11px] text-rose-700">
              Reason: {booking.cancelReason || 'Guest requested early cancellation.'}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 font-medium"
          >
            Close Dossier
          </button>

          {booking.status !== 'Cancelled' && booking.status !== 'Checked Out' && (
            <button
              type="button"
              onClick={() => onCancel(booking.id)}
              className="px-4 py-2 rounded-full border border-rose-200 text-rose-700 hover:bg-rose-50 font-medium cursor-pointer"
            >
              Cancel Reservation
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
