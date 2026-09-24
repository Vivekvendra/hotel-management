import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  Users,
  UserPlus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Mail,
  Phone,
  FileText,
  Globe
} from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';

export default function GuestManagement() {
  const { guests, addGuest, editGuest, deleteGuest, bookings } = useHotel();

  // Search & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [viewingGuest, setViewingGuest] = useState(null);
  const [deletingGuestId, setDeletingGuestId] = useState(null);

  // Form Hooks
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  // Open Add Modal
  const openAddModal = () => {
    reset({
      name: '',
      email: '',
      phone: '',
      address: '',
      idProof: '',
      nationality: '',
      vip: false,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (guest) => {
    setEditingGuest(guest);
    reset({
      name: guest.name,
      email: guest.email,
      phone: guest.phone,
      address: guest.address,
      idProof: guest.idProof,
      nationality: guest.nationality,
      vip: !!guest.vip,
      avatar: guest.avatar
    });
  };

  // Save Add/Edit
  const onSubmitForm = (data) => {
    if (editingGuest) {
      editGuest(editingGuest.id, data);
      setEditingGuest(null);
    } else {
      addGuest(data);
      setIsAddModalOpen(false);
    }
  };

  // Filtered Guests
  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      const query = searchQuery.toLowerCase();
      return (
        g.name.toLowerCase().includes(query) ||
        g.email.toLowerCase().includes(query) ||
        g.phone.toLowerCase().includes(query) ||
        g.nationality.toLowerCase().includes(query) ||
        g.idProof.toLowerCase().includes(query)
      );
    });
  }, [guests, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredGuests.length / itemsPerPage) || 1;
  const paginatedGuests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredGuests.slice(start, start + itemsPerPage);
  }, [filteredGuests, currentPage]);

  // Guest's bookings for profile view
  const guestBookings = useMemo(() => {
    if (!viewingGuest) return [];
    return bookings.filter(
      (b) =>
        b.guestEmail?.toLowerCase() === viewingGuest.email?.toLowerCase() ||
        b.guestName?.toLowerCase() === viewingGuest.name?.toLowerCase()
    );
  }, [bookings, viewingGuest]);

  return (
    <div className="space-y-7 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8C6D3B]/10 text-[#8C6D3B] text-xs font-semibold uppercase tracking-wider mb-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Module 4: Patron Dossiers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-900 tracking-tight">
            Guest Management
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
            Comprehensive guest directory, verified ID proof credentials, and personal profiles.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white text-xs font-semibold tracking-wide flex items-center gap-2 shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Guest</span>
        </button>
      </div>

      {/* Search & Counter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, email, phone, ID proof..."
            className="w-full h-10 pl-9 pr-4 rounded-full bg-[#F7F7F6] border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
          />
        </div>

        <div className="text-xs text-stone-500">
          Showing <strong className="text-stone-800">{paginatedGuests.length}</strong> of{' '}
          <strong className="text-stone-800">{filteredGuests.length}</strong> registered guests
        </div>
      </div>

      {/* Guests Ledger Table */}
      {filteredGuests.length === 0 ? (
        <EmptyState
          title="No Guests Found"
          description={`No guests matching "${searchQuery}" in directory.`}
          actionText="Register New Guest"
          onAction={openAddModal}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-100 bg-[#FAF9F6] text-stone-400 uppercase tracking-wider text-[11px]">
                  <th className="py-4 px-5 font-semibold">Guest Profile</th>
                  <th className="py-4 px-5 font-semibold">Contact Info</th>
                  <th className="py-4 px-5 font-semibold">ID Proof</th>
                  <th className="py-4 px-5 font-semibold">Nationality</th>
                  <th className="py-4 px-5 font-semibold">Status</th>
                  <th className="py-4 px-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paginatedGuests.map((guest) => (
                  <tr
                    key={guest.id}
                    className="hover:bg-stone-50/80 transition-colors group cursor-pointer"
                    onClick={() => setViewingGuest(guest)}
                  >
                    {/* Guest Profile */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={guest.avatar}
                          alt={guest.name}
                          className="w-10 h-10 rounded-full object-cover border border-[#8C6D3B]/30"
                        />
                        <div>
                          <p className="font-semibold text-stone-900 group-hover:text-[#755B31]">
                            {guest.name}
                          </p>
                          <p className="text-[11px] text-stone-400">
                            {guest.address || 'Address on file'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-5">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-stone-700">
                          <Mail className="w-3 h-3 text-stone-400" />
                          <span>{guest.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                          <Phone className="w-3 h-3 text-stone-400" />
                          <span>{guest.phone}</span>
                        </div>
                      </div>
                    </td>

                    {/* ID Proof Number */}
                    <td className="py-4 px-5">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 font-mono text-[11px] text-stone-700 font-semibold">
                        <FileText className="w-3 h-3 text-[#8C6D3B]" />
                        <span>{guest.idProof}</span>
                      </div>
                    </td>

                    {/* Nationality */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-1.5 text-stone-700">
                        <Globe className="w-3.5 h-3.5 text-stone-400" />
                        <span>{guest.nationality}</span>
                      </div>
                    </td>

                    {/* VIP Status */}
                    <td className="py-4 px-5">
                      {guest.vip ? (
                        <Badge variant="luxury">VIP Patron</Badge>
                      ) : (
                        <Badge variant="default">Verified Guest</Badge>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div
                        className="inline-flex items-center gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setViewingGuest(guest)}
                          title="View Profile"
                          className="p-2 rounded-full border border-stone-200 hover:border-[#8C6D3B] hover:bg-[#F6F1EA] text-[#8C6D3B] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => openEditModal(guest)}
                          title="Edit Profile"
                          className="p-2 rounded-full border border-stone-200 hover:border-stone-400 hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeletingGuestId(guest.id)}
                          title="Delete Guest"
                          className="p-2 rounded-full border border-stone-200 hover:border-red-300 hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
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

      {/* ================= MODAL: ADD / EDIT GUEST ================= */}
      <Modal
        isOpen={isAddModalOpen || !!editingGuest}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingGuest(null);
        }}
        title={editingGuest ? `Edit Guest: ${editingGuest.name}` : 'Register New Guest'}
        subtitle="Mandatory guest identification and contact details"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Lord Julian Vance"
                {...register('name', { required: 'Full name is required' })}
                className="w-full h-10 px-4 rounded-full bg-[#F7F7F6] border border-stone-300 text-stone-800 text-xs focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
              />
              {errors.name && (
                <p className="text-[11px] text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                placeholder="name@domain.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="w-full h-10 px-4 rounded-full bg-[#F7F7F6] border border-stone-300 text-stone-800 text-xs focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
              />
              {errors.email && (
                <p className="text-[11px] text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Mobile Number *
              </label>
              <input
                type="text"
                placeholder="+1 555 123 4567"
                {...register('phone', { required: 'Mobile number is required' })}
                className="w-full h-10 px-4 rounded-full bg-[#F7F7F6] border border-stone-300 text-stone-800 text-xs focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
              />
              {errors.phone && (
                <p className="text-[11px] text-red-500 mt-1">{errors.phone.message}</p>
              )}
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Nationality *
              </label>
              <input
                type="text"
                placeholder="e.g. British, French, American"
                {...register('nationality', { required: 'Nationality is required' })}
                className="w-full h-10 px-4 rounded-full bg-[#F7F7F6] border border-stone-300 text-stone-800 text-xs focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
              />
              {errors.nationality && (
                <p className="text-[11px] text-red-500 mt-1">{errors.nationality.message}</p>
              )}
            </div>
          </div>

          {/* ID Proof Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                ID Proof Number (Passport / National ID) *
              </label>
              <input
                type="text"
                placeholder="e.g. GB-PASS-9920148"
                {...register('idProof', { required: 'ID proof is required' })}
                className="w-full h-10 px-4 rounded-full bg-[#F7F7F6] border border-stone-300 text-stone-800 text-xs font-mono focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
              />
              {errors.idProof && (
                <p className="text-[11px] text-red-500 mt-1">{errors.idProof.message}</p>
              )}
            </div>

            {/* VIP Checkbox */}
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-stone-700">
                <input
                  type="checkbox"
                  {...register('vip')}
                  className="accent-[#8C6D3B] w-4 h-4 rounded"
                />
                <span className="font-semibold text-[#8C6D3B]">Award VIP Patron Status</span>
              </label>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">
              Residential Address *
            </label>
            <textarea
              rows="2"
              placeholder="e.g. 14 Kensington Palace Gardens, London, UK"
              {...register('address', { required: 'Address is required' })}
              className="w-full p-3 rounded-2xl bg-[#F7F7F6] border border-stone-300 text-stone-800 text-xs focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
            />
            {errors.address && (
              <p className="text-[11px] text-red-500 mt-1">{errors.address.message}</p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingGuest(null);
              }}
              className="px-5 py-2.5 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-100 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              {editingGuest ? 'Save Changes' : 'Register Guest'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL: GUEST PROFILE VIEW ================= */}
      <Modal
        isOpen={!!viewingGuest}
        onClose={() => setViewingGuest(null)}
        title={viewingGuest ? `Patron Dossier: ${viewingGuest.name}` : ''}
        subtitle="Confidential Guest Profile & Verified History"
        maxWidth="max-w-2xl"
      >
        {viewingGuest && (
          <div className="space-y-6">
            {/* Header Badge */}
            <div className="p-5 rounded-3xl bg-[#FAF9F6] border border-stone-200/80 flex items-center gap-4">
              <img
                src={viewingGuest.avatar}
                alt={viewingGuest.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#8C6D3B]"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif-luxury font-bold text-lg text-stone-900 truncate">
                    {viewingGuest.name}
                  </h3>
                  {viewingGuest.vip && <Badge variant="luxury">VIP</Badge>}
                </div>
                <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                  <Globe className="w-3.5 h-3.5 text-stone-400" />
                  <span>{viewingGuest.nationality} Citizen</span>
                </p>
              </div>
            </div>

            {/* Profile Dossier Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl border border-stone-200 bg-white">
                <span className="text-stone-400 block mb-0.5">Direct Email</span>
                <span className="font-medium text-stone-800 break-all">
                  {viewingGuest.email}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl border border-stone-200 bg-white">
                <span className="text-stone-400 block mb-0.5">Contact Telephone</span>
                <span className="font-medium text-stone-800">{viewingGuest.phone}</span>
              </div>
              <div className="p-3.5 rounded-2xl border border-stone-200 bg-white">
                <span className="text-stone-400 block mb-0.5">Verified ID Proof</span>
                <span className="font-mono font-bold text-stone-800">
                  {viewingGuest.idProof}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl border border-stone-200 bg-white">
                <span className="text-stone-400 block mb-0.5">Total Historical Stays</span>
                <span className="font-bold text-[#8C6D3B] text-sm">
                  {viewingGuest.totalStays || guestBookings.length || 1} Stays
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-stone-200 bg-white text-xs">
              <span className="text-stone-400 block mb-0.5">Permanent Residence</span>
              <span className="font-medium text-stone-800">{viewingGuest.address}</span>
            </div>

            {/* Recent Stays Associated with this Guest */}
            <div>
              <h4 className="text-xs uppercase font-semibold text-stone-400 tracking-wider mb-2">
                Booking Records for this Guest
              </h4>
              {guestBookings.length === 0 ? (
                <p className="text-xs text-stone-400 italic">No previous reservations recorded.</p>
              ) : (
                <div className="space-y-2">
                  {guestBookings.map((bk) => (
                    <div
                      key={bk.id}
                      className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-stone-900 mr-2">{bk.id}</span>
                        <span className="text-stone-600">
                          {bk.roomNumber} ({bk.roomType})
                        </span>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          {bk.checkIn} → {bk.checkOut} ({bk.nights} nights)
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-stone-900 block">${bk.amount}</span>
                        <span className="text-[10px] text-emerald-700 font-semibold">
                          {bk.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingGuest(null)}
                className="px-6 py-2.5 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white text-xs font-semibold cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ================= MODAL: DELETE CONFIRMATION ================= */}
      <Modal
        isOpen={!!deletingGuestId}
        onClose={() => setDeletingGuestId(null)}
        title="Confirm Guest Removal"
        subtitle="This action will permanently delete this patron record."
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-stone-600 leading-relaxed">
            Are you sure you want to remove this guest profile? Linked historical invoices will remain preserved for audit compliance.
          </p>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={() => setDeletingGuestId(null)}
              className="px-4 py-2 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-100 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                deleteGuest(deletingGuestId);
                setDeletingGuestId(null);
              }}
              className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              Delete Guest
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
