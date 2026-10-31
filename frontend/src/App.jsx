import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import Navbar from './components/common/Navbar';
import AuthModal from './components/auth/AuthModal';
import MovieList from './components/customer/MovieList';
import SeatMap from './components/customer/SeatMap';
import CheckoutModal from './components/customer/CheckoutModal';
import BookingHistory from './components/customer/BookingHistory';
import AdminLayout from './components/admin/AdminLayout';

const MainContent = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('movies'); // 'movies' | 'bookings' | 'admin'
  const [activeShow, setActiveShow] = useState(null); // { showId, movieName, startTime, endTime }
  const [checkoutSeats, setCheckoutSeats] = useState(null); // Array<ShowSeat>
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authRoleHint, setAuthRoleHint] = useState('CUSTOMER');

  const handleOpenAuth = (roleHint = 'CUSTOMER') => {
    setAuthRoleHint(roleHint);
    setAuthModalOpen(true);
  };

  const handleSelectShow = (show) => {
    setActiveShow(show);
  };

  const handleBackToMovies = () => {
    setActiveShow(null);
    setCheckoutSeats(null);
  };

  const handleProceedToCheckout = (selectedSeats) => {
    setCheckoutSeats(selectedSeats);
  };

  const handleBookingSuccess = () => {
    // Keep modal open so user sees confirmation ticket; on close, return to movie view
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0d14] text-slate-100">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveShow(null);
          setCheckoutSeats(null);
          setActiveTab(tab);
        }}
        onOpenAuth={() => handleOpenAuth('CUSTOMER')}
      />

      {/* Main Body */}
      <main className="flex-1">
        {activeTab === 'movies' && (
          <>
            {activeShow ? (
              <SeatMap
                showId={activeShow.showId}
                showInfo={activeShow}
                onBack={handleBackToMovies}
                onSelectSeats={handleProceedToCheckout}
              />
            ) : (
              <MovieList
                onSelectShow={handleSelectShow}
                onRequireAuth={() => handleOpenAuth('CUSTOMER')}
              />
            )}
          </>
        )}

        {activeTab === 'bookings' && <BookingHistory />}

        {activeTab === 'admin' && (
          <AdminLayout onNavigateHome={() => setActiveTab('movies')} />
        )}
      </main>

      {/* Checkout Modal (Seat Hold + Razorpay + Verification) */}
      {checkoutSeats && activeShow && (
        <CheckoutModal
          showId={activeShow.showId}
          showInfo={activeShow}
          selectedSeats={checkoutSeats}
          onClose={() => {
            setCheckoutSeats(null);
            setActiveShow(null);
          }}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultRoleHint={authRoleHint}
      />

      {/* Footer */}
      <footer className="border-t border-[#242f44] py-8 text-center text-xs text-slate-500 bg-[#0e131f]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 CinePass Cinema System. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Spring Boot 4.0 Backend</span>
            <span>•</span>
            <span>Optimistic Locking Enabled</span>
            <span>•</span>
            <span>Razorpay Integrated</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <MainContent />
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
