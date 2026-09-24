import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { initialMockData } from '../data/mockData';

const HotelContext = createContext(null);

const DEFAULT_ROOMS = [
  {
    id: "rm-101",
    roomNumber: "PH-401",
    roomType: "Presidential Suite",
    price: 850,
    capacity: 4,
    floor: 4,
    status: "Occupied",
    amenities: ["Ocean View", "Private Jacuzzi", "King Bed", "Butler Service", "Balcony", "Free Wi-Fi", "Espresso Bar"],
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80",
    description: "The pinnacle of Grand Azure opulence. Panoramic Mediterranean sea vistas, bespoke Italian marble bathroom, and 24-hour dedicated butler."
  },
  {
    id: "rm-102",
    roomNumber: "OV-104",
    roomType: "Ocean Villa",
    price: 650,
    capacity: 3,
    floor: 1,
    status: "Occupied",
    amenities: ["Ocean Front", "Private Plunge Pool", "King Bed", "Mini Bar", "Terrace", "Free Wi-Fi"],
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80",
    description: "Private secluded beachfront villa with direct access to azure waters, lush private garden, and sun loungers."
  },
  {
    id: "rm-103",
    roomNumber: "DX-210",
    roomType: "Deluxe Suite",
    price: 380,
    capacity: 2,
    floor: 2,
    status: "Available",
    amenities: ["Balcony", "King Bed", "Rain Shower", "Free Wi-Fi", "Smart TV", "Mini Fridge"],
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80",
    description: "Spacious contemporary luxury suite with floor-to-ceiling glass windows and custom ambient lighting."
  },
  {
    id: "rm-104",
    roomNumber: "EX-315",
    roomType: "Executive Room",
    price: 290,
    capacity: 2,
    floor: 3,
    status: "Available",
    amenities: ["Work Desk", "Queen Bed", "City View", "Free Wi-Fi", "Coffee Maker", "Safe"],
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop&q=80",
    description: "Designed for discerning business travelers and executive leaders featuring ergonomic workstation and high-speed fiber."
  },
  {
    id: "rm-105",
    roomNumber: "OV-108",
    roomType: "Ocean Villa",
    price: 650,
    capacity: 4,
    floor: 1,
    status: "Occupied",
    amenities: ["Ocean Front", "Private Plunge Pool", "Dual King Beds", "Outdoor Shower", "Free Wi-Fi"],
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&auto=format&fit=crop&q=80",
    description: "Expansive multi-room villa nestled on the coast with serene sunset exposures."
  },
  {
    id: "rm-106",
    roomNumber: "PH-402",
    roomType: "Presidential Suite",
    price: 920,
    capacity: 4,
    floor: 4,
    status: "Available",
    amenities: ["Ocean View", "Private Rooftop Pool", "King Bed", "Butler Service", "Wine Cellar", "Free Wi-Fi"],
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop&q=80",
    description: "Penthouse masterpiece with private infinity rooftop plunge pool and panoramic coastline views."
  },
  {
    id: "rm-107",
    roomNumber: "DX-212",
    roomType: "Deluxe Suite",
    price: 360,
    capacity: 2,
    floor: 2,
    status: "Available",
    amenities: ["Garden View", "King Bed", "Deep Soaking Tub", "Free Wi-Fi", "Balcony"],
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80",
    description: "Serene garden-facing suite overlooking the Grand Azure courtyard and botanical fountains."
  },
  {
    id: "rm-108",
    roomNumber: "DX-218",
    roomType: "Deluxe Suite",
    price: 390,
    capacity: 3,
    floor: 2,
    status: "Maintenance",
    amenities: ["Balcony", "Dual Queen Beds", "Rain Shower", "Free Wi-Fi"],
    image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&auto=format&fit=crop&q=80",
    description: "Undergoing scheduled luxury interior refresh and marble polishing."
  }
];

const DEFAULT_GUESTS = [
  {
    id: "gst-001",
    name: "Lady Sophia Montgomery",
    email: "sophia.m@monterey.co.uk",
    phone: "+44 20 7946 0912",
    address: "14 Kensington Palace Gardens, London, UK",
    idProof: "GB-PASS-9920148",
    nationality: "British",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    vip: true,
    totalStays: 4
  },
  {
    id: "gst-002",
    name: "David Sterling",
    email: "d.sterling@vanguard.io",
    phone: "+1 (415) 892-3341",
    address: "742 Montgomery St, San Francisco, CA, USA",
    idProof: "US-PASS-4418290",
    nationality: "American",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    vip: true,
    totalStays: 6
  },
  {
    id: "gst-003",
    name: "Elena Rostova",
    email: "elena.rostova@aurora.de",
    phone: "+49 30 8921 4452",
    address: "Unter den Linden 42, Berlin, Germany",
    idProof: "DE-ID-8829104",
    nationality: "German",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    vip: false,
    totalStays: 2
  },
  {
    id: "gst-004",
    name: "Marcus Vance",
    email: "marcus.vance@techcorp.com",
    phone: "+1 (212) 555-0199",
    address: "350 5th Ave, New York, NY, USA",
    idProof: "US-PASS-1099238",
    nationality: "American",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    vip: false,
    totalStays: 1
  },
  {
    id: "gst-005",
    name: "Isabella Cruz",
    email: "isabella.cruz@cruzdesign.es",
    phone: "+34 91 442 8812",
    address: "Paseo de la Castellana 88, Madrid, Spain",
    idProof: "ES-DNI-7729104X",
    nationality: "Spanish",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
    vip: true,
    totalStays: 5
  },
  {
    id: "gst-006",
    name: "Arthur Pendelton",
    email: "arthur@pendelton-holdings.com",
    phone: "+44 131 496 0882",
    address: "18 Royal Mile, Edinburgh, Scotland",
    idProof: "GB-PASS-3382910",
    nationality: "British",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    vip: true,
    totalStays: 3
  }
];

export function HotelProvider({ children }) {
  // Rooms State
  const [rooms, setRooms] = useState(() => {
    try {
      const saved = localStorage.getItem('grand_azure_rooms');
      return saved ? JSON.parse(saved) : DEFAULT_ROOMS;
    } catch {
      return DEFAULT_ROOMS;
    }
  });
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [errorRooms, setErrorRooms] = useState(null);

  // Guests State
  const [guests, setGuests] = useState(() => {
    try {
      const saved = localStorage.getItem('grand_azure_guests');
      return saved ? JSON.parse(saved) : DEFAULT_GUESTS;
    } catch {
      return DEFAULT_GUESTS;
    }
  });
  const loadingGuests = false;

  // Bookings State
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('grand_azure_bookings');
      return saved ? JSON.parse(saved) : initialMockData.recentBookings;
    } catch {
      return initialMockData.recentBookings;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('grand_azure_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('grand_azure_guests', JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem('grand_azure_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Integrate Third-Party API (DummyJSON / JSONPlaceholder) via Axios
  const fetchThirdPartyRooms = async () => {
    setLoadingRooms(true);
    setErrorRooms(null);
    try {
      // Third-party API integration using DummyJSON
      const response = await axios.get('https://dummyjson.com/products/category/furniture', {
        timeout: 8000
      });

      if (response.data && response.data.products) {
        // Map third party products with hotel room enhancement
        const luxuryImages = [
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&auto=format&fit=crop&q=80"
        ];
        const roomTypes = ["Presidential Suite", "Ocean Villa", "Deluxe Suite", "Executive Room"];

        const fetchedRooms = response.data.products.slice(0, 8).map((prod, index) => {
          const type = roomTypes[index % roomTypes.length];
          const price = type === 'Presidential Suite' ? 880 : type === 'Ocean Villa' ? 620 : type === 'Deluxe Suite' ? 360 : 280;
          return {
            id: `api-${prod.id}`,
            roomNumber: `${type.slice(0, 2).toUpperCase()}-${300 + index}`,
            roomType: type,
            price: price,
            capacity: (index % 3) + 2,
            floor: Math.floor(index / 2) + 1,
            status: index % 3 === 0 ? "Occupied" : index % 7 === 0 ? "Maintenance" : "Available",
            amenities: ["Ocean View", "Balcony", "King Bed", "Free Wi-Fi", "Smart TV", "Mini Bar"],
            image: luxuryImages[index % luxuryImages.length] || prod.thumbnail,
            description: `${prod.title} - ${prod.description}`
          };
        });

        // Merge keeping custom user rooms
        setRooms(fetchedRooms);
        toast.success("Synchronized room portfolio with Third-Party DummyJSON API!");
      }
    } catch (err) {
      console.warn("Third-Party API offline, using local luxury catalog:", err.message);
      setErrorRooms("Could not reach remote API, operating in local mode.");
    } finally {
      setLoadingRooms(false);
    }
  };

  // ROOM CRUD (Module 3)
  const addRoom = (roomData) => {
    const newRoom = {
      id: `rm-${Date.now()}`,
      roomNumber: roomData.roomNumber.toUpperCase().trim(),
      roomType: roomData.roomType,
      price: Number(roomData.price),
      capacity: Number(roomData.capacity || 2),
      floor: Number(roomData.floor || 1),
      status: roomData.status || "Available",
      amenities: Array.isArray(roomData.amenities) ? roomData.amenities : ["Free Wi-Fi", "King Bed", "Smart TV"],
      image: roomData.image || "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80",
      description: roomData.description || `Luxurious ${roomData.roomType} designed for elevated comfort.`
    };

    setRooms(prev => [newRoom, ...prev]);
    toast.success(`Room ${newRoom.roomNumber} created successfully!`);
    return { success: true, room: newRoom };
  };

  const editRoom = (id, updatedFields) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, ...updatedFields } : r));
    toast.success(`Room updated successfully!`);
    return { success: true };
  };

  const deleteRoom = (id) => {
    const target = rooms.find(r => r.id === id);
    setRooms(prev => prev.filter(r => r.id !== id));
    toast.info(`Room ${target ? target.roomNumber : ''} has been removed from inventory.`);
    return { success: true };
  };

  // GUEST CRUD (Module 4)
  const addGuest = (guestData) => {
    const newGuest = {
      id: `gst-${Date.now()}`,
      name: guestData.name.trim(),
      email: guestData.email.trim().toLowerCase(),
      phone: guestData.phone.trim(),
      address: guestData.address.trim(),
      idProof: guestData.idProof.trim().toUpperCase(),
      nationality: guestData.nationality.trim(),
      avatar: guestData.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      vip: !!guestData.vip,
      totalStays: 1
    };

    setGuests(prev => [newGuest, ...prev]);
    toast.success(`Guest ${newGuest.name} registered in directory.`);
    return { success: true, guest: newGuest };
  };

  const editGuest = (id, updatedFields) => {
    setGuests(prev => prev.map(g => g.id === id ? { ...g, ...updatedFields } : g));
    toast.success(`Guest profile updated successfully!`);
    return { success: true };
  };

  const deleteGuest = (id) => {
    const target = guests.find(g => g.id === id);
    setGuests(prev => prev.filter(g => g.id !== id));
    toast.info(`Guest ${target ? target.name : ''} deleted.`);
    return { success: true };
  };

  // BOOKING (Module 5)
  // Double Booking Prevention Check
  const checkRoomConflict = (roomNumber, newCheckIn, newCheckOut, excludeBookingId = null) => {
    const targetRoom = rooms.find(r => r.roomNumber === roomNumber);
    if (targetRoom && targetRoom.status === 'Maintenance') {
      return { hasConflict: true, reason: `Room ${roomNumber} is currently under scheduled maintenance.` };
    }

    const newStart = new Date(newCheckIn).getTime();
    const newEnd = new Date(newCheckOut).getTime();

    // Check active bookings for overlapping stay dates
    const conflict = bookings.find(b => {
      if (b.id === excludeBookingId) return false;
      if (b.roomNumber !== roomNumber) return false;
      if (b.status === 'Cancelled' || b.status === 'Checked Out') return false;

      const existingStart = new Date(b.checkIn).getTime();
      const existingEnd = new Date(b.checkOut).getTime();

      // Dates overlap if: (newStart < existingEnd) && (newEnd > existingStart)
      return (newStart < existingEnd && newEnd > existingStart);
    });

    if (conflict) {
      return {
        hasConflict: true,
        reason: `Room ${roomNumber} is already booked by ${conflict.guestName} from ${conflict.checkIn} to ${conflict.checkOut}. Double booking prevented!`
      };
    }

    return { hasConflict: false };
  };

  const createBooking = (bookingData) => {
    // Double Booking Prevention
    const conflictCheck = checkRoomConflict(bookingData.roomNumber, bookingData.checkIn, bookingData.checkOut);
    if (conflictCheck.hasConflict) {
      toast.error(conflictCheck.reason, { autoClose: 5000 });
      return { success: false, error: conflictCheck.reason };
    }

    const newBooking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      guestName: bookingData.guestName,
      guestEmail: bookingData.guestEmail,
      guestAvatar: bookingData.guestAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      roomNumber: bookingData.roomNumber,
      roomType: bookingData.roomType,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      nights: Number(bookingData.nights),
      amount: Number(bookingData.amount),
      status: bookingData.status || "Confirmed",
      paymentStatus: bookingData.paymentStatus || "Paid",
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);

    // Update room availability status if checkIn is today
    const todayStr = new Date().toISOString().split('T')[0];
    if (bookingData.checkIn === todayStr) {
      setRooms(prev => prev.map(r => r.roomNumber === bookingData.roomNumber ? { ...r, status: "Occupied" } : r));
    }

    toast.success(`Booking ${newBooking.id} successfully confirmed for ${newBooking.guestName}!`);
    return { success: true, booking: newBooking };
  };

  const updateBookingStatus = (id, newStatus) => {
    setBookings(prev => prev.map(b => {
      if (b.id === id) {
        // If checking out, release the room
        if (newStatus === 'Checked Out') {
          setRooms(rPrev => rPrev.map(r => r.roomNumber === b.roomNumber ? { ...r, status: "Available" } : r));
        } else if (newStatus === 'Checked In') {
          setRooms(rPrev => rPrev.map(r => r.roomNumber === b.roomNumber ? { ...r, status: "Occupied" } : r));
        }
        return { ...b, status: newStatus };
      }
      return b;
    }));
    toast.success(`Booking ${id} status updated to ${newStatus}.`);
  };

  const cancelBooking = (id) => {
    const target = bookings.find(b => b.id === id);
    if (target) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
      // Release room
      setRooms(rPrev => rPrev.map(r => r.roomNumber === target.roomNumber ? { ...r, status: "Available" } : r));
      toast.info(`Reservation ${id} has been cancelled.`);
    }
  };

  return (
    <HotelContext.Provider
      value={{
        // Rooms
        rooms,
        loadingRooms,
        errorRooms,
        addRoom,
        editRoom,
        deleteRoom,
        fetchThirdPartyRooms,

        // Guests
        guests,
        loadingGuests,
        addGuest,
        editGuest,
        deleteGuest,

        // Bookings
        bookings,
        createBooking,
        updateBookingStatus,
        cancelBooking,
        checkRoomConflict
      }}
    >
      {children}
    </HotelContext.Provider>
  );
}

export function useHotel() {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
}
