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
import CheckInOut from './pages/checkin/CheckInOut';
import Payments from './pages/payments/Payments';
import BookingHistory from './pages/history/BookingHistory';
import Reports from './pages/reports/Reports';
import Settings from './pages/settings/Settings';

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

            {/* Protected Front Desk Check-In / Check-Out (Module 6) */}
            <Route
              path="/checkin-checkout"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CheckInOut />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Protected Billing & Payments (Module 7) */}
            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Payments />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Protected Booking History (Module 8) */}
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <BookingHistory />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Protected Reports & Analytics */}
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Reports />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Protected Hotel Settings */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Settings />
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
