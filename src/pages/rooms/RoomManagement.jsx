import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  BedDouble,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Users,
  Layers
} from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const ALL_AMENITIES = [
  "Ocean View",
  "Balcony",
  "King Bed",
  "Private Jacuzzi",
  "Butler Service",
  "Free Wi-Fi",
  "Smart TV",
  "Mini Bar",
  "Espresso Bar",
  "Rain Shower",
  "Private Plunge Pool"
];

export default function RoomManagement() {
  const {
    rooms,
    loadingRooms,
    errorRooms,
    addRoom,
    editRoom,
    deleteRoom,
    fetchThirdPartyRooms
  } = useHotel();

  // Search, Filter, Sort, Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('none'); // 'none' | 'price-asc' | 'price-desc'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [viewingRoom, setViewingRoom] = useState(null);
  const [deletingRoomId, setDeletingRoomId] = useState(null);

  // Selected Amenities for Add/Edit Form
  const [selectedAmenities, setSelectedAmenities] = useState([
    "Free Wi-Fi",
    "King Bed",
    "Smart TV"
  ]);

  // Form Hooks
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  // Handle Open Add Modal
  const openAddModal = () => {
    reset({
      roomNumber: '',
      roomType: 'Deluxe Suite',
      price: 350,
      capacity: 2,
      floor: 2,
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
      description: ''
    });
    setSelectedAmenities(["Free Wi-Fi", "King Bed", "Smart TV"]);
    setIsAddModalOpen(true);
  };

  // Handle Open Edit Modal
  const openEditModal = (room) => {
    setEditingRoom(room);
    reset({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      price: room.price,
      capacity: room.capacity,
      floor: room.floor,
      status: room.status,
      image: room.image,
      description: room.description
    });
    setSelectedAmenities(room.amenities || []);
  };

  // Toggle Amenity Selection
  const toggleAmenity = (item) => {
    setSelectedAmenities(prev =>
      prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]
    );
  };

  // On Save (Add / Edit)
  const onSubmitForm = (data) => {
    const payload = {
      ...data,
      amenities: selectedAmenities
    };

    if (editingRoom) {
      editRoom(editingRoom.id, payload);
      setEditingRoom(null);
    } else {
      addRoom(payload);
      setIsAddModalOpen(false);
    }
  };

  // Filtered & Sorted Rooms
  const processedRooms = useMemo(() => {
    let result = rooms.filter(room => {
      const matchesSearch =
        room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.roomType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === 'All' ? true : room.roomType === typeFilter;
      const matchesStatus = statusFilter === 'All' ? true : room.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [rooms, searchQuery, typeFilter, statusFilter, sortBy]);

  // Pagination Slice
  const totalPages = Math.ceil(processedRooms.length / itemsPerPage) || 1;
  const paginatedRooms = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedRooms.slice(start, start + itemsPerPage);
  }, [processedRooms, currentPage]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return <Badge variant="success">Available</Badge>;
      case 'Occupied':
        return <Badge variant="danger">Occupied</Badge>;
      case 'Maintenance':
        return <Badge variant="warning">Maintenance</Badge>;
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
            <BedDouble className="w-3.5 h-3.5" />
            <span>Room Inventory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-900 tracking-tight">
            Room Management
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
            Manage suite allocations, floor capacities, pricing schedules, and live amenities.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white text-xs font-semibold tracking-wide flex items-center gap-2 shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Room</span>
        </button>
      </div>

      {/* Error Notice if API encountered issues */}
      {errorRooms && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-center justify-between">
          <span>{errorRooms}</span>
          <button
            onClick={fetchThirdPartyRooms}
            className="font-semibold text-amber-900 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filters, Search & Sort Bar */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5">
          {/* Search Input */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by room #, type, description..."
              className="w-full h-10 pl-9 pr-4 rounded-full bg-[#F7F7F6] border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
            />
          </div>

          {/* Filter by Room Type */}
          <div className="lg:col-span-3">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-10 px-4 rounded-full bg-[#F7F7F6] border border-stone-200 text-xs text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
            >
              <option value="All">All Room Types</option>
              <option value="Presidential Suite">Presidential Suite</option>
              <option value="Ocean Villa">Ocean Villa</option>
              <option value="Deluxe Suite">Deluxe Suite</option>
              <option value="Executive Room">Executive Room</option>
            </select>
          </div>

          {/* Filter by Availability */}
          <div className="lg:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-10 px-4 rounded-full bg-[#F7F7F6] border border-stone-200 text-xs text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
            >
              <option value="All">All Availabilities</option>
              <option value="Available">Available Only</option>
              <option value="Occupied">Occupied</option>
              <option value="Maintenance">Under Maintenance</option>
            </select>
          </div>

          {/* Sort by Price */}
          <div className="lg:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full h-10 px-4 rounded-full bg-[#F7F7F6] border border-stone-200 text-xs text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
            >
              <option value="none">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Quick Result Counter */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
          <span>
            Showing <strong className="text-stone-800">{paginatedRooms.length}</strong> of{' '}
            <strong className="text-stone-800">{processedRooms.length}</strong> rooms matching criteria
          </span>
          {(searchQuery || typeFilter !== 'All' || statusFilter !== 'All' || sortBy !== 'none') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('All');
                setStatusFilter('All');
                setSortBy('none');
                setCurrentPage(1);
              }}
              className="text-[#8C6D3B] hover:underline font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Loading Skeletons */}
      {loadingRooms ? (
        <SkeletonLoader type="card" count={6} />
      ) : processedRooms.length === 0 ? (
        <EmptyState
          title="No Rooms Found"
          description="No rooms in inventory match your current search or filter query."
          actionText="Create New Room"
          onAction={openAddModal}
        />
      ) : (
        /* Rooms Grid Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedRooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-lg hover:border-[#8C6D3B]/40 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image & Badges */}
              <div className="relative h-52 overflow-hidden bg-stone-100">
                <img
                  src={room.image}
                  alt={room.roomNumber}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute top-3.5 left-3.5">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-xs font-bold tracking-wider">
                    {room.roomNumber}
                  </span>
                </div>
                <div className="absolute top-3.5 right-3.5">
                  {getStatusBadge(room.status)}
                </div>
                <div className="absolute bottom-3 left-3.5">
                  <span className="px-3 py-1 rounded-full bg-white/95 text-stone-900 text-xs font-bold shadow-md">
                    ${room.price}{' '}
                    <span className="text-[10px] text-stone-500 font-normal">/ night</span>
                  </span>
                </div>
              </div>

              {/* Details Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-serif-luxury font-bold text-base text-stone-900 group-hover:text-[#755B31] transition-colors">
                      {room.roomType}
                    </h3>
                  </div>

                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-4">
                    {room.description || 'Luxurious accommodations overlooking pristine resort grounds.'}
                  </p>

                  {/* Attributes Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 mb-4 bg-[#FAF9F6] p-2.5 rounded-2xl border border-stone-100">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#8C6D3B]" />
                      <span>Capacity: {room.capacity} Patrons</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#8C6D3B]" />
                      <span>Floor: {room.floor}th Level</span>
                    </div>
                  </div>

                  {/* Amenities Tags (Up to 3) */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {room.amenities?.slice(0, 3).map((amenity) => (
                      <span
                        key={amenity}
                        className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                    {room.amenities?.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-[#F6F1EA] text-[#755B31] text-[10px] font-medium">
                        +{room.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setViewingRoom(room)}
                    className="flex-1 py-2 px-3 rounded-full border border-stone-200 hover:border-[#8C6D3B] hover:bg-[#F6F1EA] text-[#8C6D3B] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Room</span>
                  </button>

                  <button
                    onClick={() => openEditModal(room)}
                    title="Edit Room"
                    className="p-2 rounded-full border border-stone-200 hover:border-stone-400 hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeletingRoomId(room.id)}
                    title="Delete Room"
                    className="p-2 rounded-full border border-stone-200 hover:border-red-300 hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
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
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3.5 py-1.5 rounded-full border border-stone-200 text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT ROOM ================= */}
      <Modal
        isOpen={isAddModalOpen || !!editingRoom}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingRoom(null);
        }}
        title={editingRoom ? `Edit Room ${editingRoom.roomNumber}` : 'Add New Luxury Room'}
        subtitle="Specify room number, category, floor, and guest amenities."
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Room Number */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Room Number *
              </label>
              <input
                type="text"
                placeholder="e.g. PH-502"
                {...register('roomNumber', { required: 'Room number is required' })}
                className="w-full h-10 px-4 rounded-full bg-[#F7F7F6] border border-stone-300 text-stone-800 text-xs focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
              />
              {errors.roomNumber && (
                <p className="text-[11px] text-red-500 mt-1">{errors.roomNumber.message}</p>
              )}
            </div>

            {/* Room Type */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Room Category *
              </label>
              <select
                {...register('roomType')}
                className="w-full h-10 px-4 rounded-full bg-[#F7F7F6] border border-stone-300 text-stone-800 text-xs focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
              >
                <option value="Presidential Suite">Presidential Suite</option>
                <option value="Ocean Villa">Ocean Villa</option>
                <option value="Deluxe Suite">Deluxe Suite</option>
                <option value="Executive Room">Executive Room</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Price Per Night */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Price / Night ($) *
              </label>
              <input
                type="number"
                min="50"
                step="10"
                {...register('price', { required: 'Price is required' })}
                className="w-full h-10 px-4 rounded-full bg-[#F7F7F6] border border-stone-300 text-stone-800 text-xs focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
              />
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Capacity (Patrons)
              </label>
              <input
                type="number"
                min="1"
                max="8"
                {...register('capacity')}
                className="w-full h-10 px-4 rounded-full bg-[#F7F7F6] border border-stone-300 text-stone-800 text-xs focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
              />
            </div>

            {/* Floor */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Floor Level
              </label>
              <input
                type="number"
                min="1"
                max="25"
                {...register('floor')}
                className="w-full h-10 px-4 rounded-full bg-[#F7F7F6] border border-stone-300 text-stone-800 text-xs focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
              />
            </div>
          </div>

          {/* Availability Status & Image URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Availability Status
              </label>
              <select
                {...register('status')}
                className="w-full h-10 px-4 rounded-full bg-[#F7F7F6] border border-stone-300 text-stone-800 text-xs focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
              >
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Room Image URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                {...register('image')}
                className="w-full h-10 px-4 rounded-full bg-[#F7F7F6] border border-stone-300 text-stone-800 text-xs focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">
              Room Description
            </label>
            <textarea
              rows="2"
              placeholder="Describe view, ambiance, features..."
              {...register('description')}
              className="w-full p-3 rounded-2xl bg-[#F7F7F6] border border-stone-300 text-stone-800 text-xs focus:ring-2 focus:ring-[#8C6D3B]/30 focus:border-[#8C6D3B]"
            />
          </div>

          {/* Amenities Selector */}
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-2">
              Select Room Amenities
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_AMENITIES.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#8C6D3B] text-white shadow-2xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {amenity}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingRoom(null);
              }}
              className="px-5 py-2.5 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-100 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              {editingRoom ? 'Update Room' : 'Add Room'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL: ROOM DETAILS VIEW ================= */}
      <Modal
        isOpen={!!viewingRoom}
        onClose={() => setViewingRoom(null)}
        title={viewingRoom ? `${viewingRoom.roomNumber} - ${viewingRoom.roomType}` : ''}
        subtitle="Complete Room Portfolio & Specification Dossier"
        maxWidth="max-w-2xl"
      >
        {viewingRoom && (
          <div className="space-y-6">
            <div className="relative h-64 rounded-3xl overflow-hidden shadow-md">
              <img
                src={viewingRoom.image}
                alt={viewingRoom.roomNumber}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                {getStatusBadge(viewingRoom.status)}
              </div>
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-sm font-bold">
                ${viewingRoom.price} / night
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase font-semibold text-stone-400 tracking-wider">
                Overview & Architecture
              </h4>
              <p className="text-sm text-stone-700 leading-relaxed mt-1">
                {viewingRoom.description}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="text-[11px] text-stone-400 block">Floor Number</span>
                <span className="text-base font-bold text-stone-800">
                  Level {viewingRoom.floor}
                </span>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="text-[11px] text-stone-400 block">Maximum Capacity</span>
                <span className="text-base font-bold text-stone-800">
                  {viewingRoom.capacity} Guests
                </span>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="text-[11px] text-stone-400 block">Availability</span>
                <span className="text-base font-bold text-[#8C6D3B]">
                  {viewingRoom.status}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase font-semibold text-stone-400 tracking-wider mb-2">
                Included Luxury Amenities
              </h4>
              <div className="flex flex-wrap gap-2">
                {viewingRoom.amenities?.map((amenity) => (
                  <span
                    key={amenity}
                    className="px-3 py-1 rounded-full bg-[#F6F1EA] text-[#755B31] border border-[#E8DAC8] text-xs font-medium"
                  >
                    ✓ {amenity}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingRoom(null)}
                className="px-6 py-2.5 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white text-xs font-semibold cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ================= MODAL: DELETE ROOM CONFIRMATION ================= */}
      <Modal
        isOpen={!!deletingRoomId}
        onClose={() => setDeletingRoomId(null)}
        title="Confirm Room Deletion"
        subtitle="This action will permanently delete this room from the active inventory."
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-stone-600 leading-relaxed">
            Are you sure you want to remove this room from The Grand Azure? Existing historical records will remain archived.
          </p>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={() => setDeletingRoomId(null)}
              className="px-4 py-2 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-100 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                deleteRoom(deletingRoomId);
                setDeletingRoomId(null);
              }}
              className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              Delete Room
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
