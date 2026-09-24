import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { HotelProvider } from './context/HotelContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import RoomManagement from './pages/rooms/RoomManagement';
import GuestManagement from './pages/guests/GuestManagement';
import BookingManagement from './pages/bookings/BookingManagement';

export default function App() {
  return (
    <AuthProvider>
      <HotelProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Hotel Management Dashboard (Module 2) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Protected Room Management (Module 3) */}
            <Route
              path="/rooms"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <RoomManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Protected Guest Management (Module 4) */}
            <Route
              path="/guests"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <GuestManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Protected Room Booking Management (Module 5) */}
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <BookingManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Default Redirect to Dashboard (which redirects to /login if unauthenticated) */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>

          {/* Global Toast Notifications Container */}
          <ToastContainer
            position="top-right"
            autoClose={3500}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            toastClassName="rounded-2xl shadow-lg border border-stone-100 font-sans text-xs"
          />
        </BrowserRouter>
      </HotelProvider>
    </AuthProvider>
  );
}
