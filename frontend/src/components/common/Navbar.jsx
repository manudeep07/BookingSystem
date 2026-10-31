import React from 'react';
import { Film, Ticket, Shield, LogOut, User as UserIcon, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ activeTab, setActiveTab, onOpenAuth }) => {
  const { user, isAuthenticated, isAdmin, role, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#0e131f]/90 backdrop-blur-md border-b border-[#242f44]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('movies')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-rose-400 flex items-center justify-center shadow-lg shadow-brand-600/30 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                CinePass
              </span>
              <span className="block text-[10px] uppercase font-semibold text-rose-500 tracking-widest -mt-1">
                Booking System
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('movies')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'movies'
                  ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Movies</span>
            </button>

            <button
              onClick={() => {
                if (!isAuthenticated) {
                  onOpenAuth();
                } else {
                  setActiveTab('bookings');
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'bookings'
                  ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>My Bookings</span>
            </button>

            {/* Admin Portal Tab - strictly only visible/accessible to ADMIN */}
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'admin'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-amber-400/80 hover:text-amber-300 hover:bg-amber-950/30'
                }`}
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Admin Panel</span>
              </button>
            )}
          </nav>

          {/* User Profile / Auth State */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden sm:flex flex-col items-end text-xs">
                  <span className="font-medium text-slate-200 truncate max-w-[140px]">
                    {user?.email}
                  </span>
                  <span
                    className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide ${
                      isAdmin
                        ? 'bg-amber-900/60 text-amber-300 border border-amber-600/40'
                        : 'bg-emerald-900/60 text-emerald-300 border border-emerald-600/40'
                    }`}
                  >
                    {role}
                  </span>
                </div>

                <button
                  onClick={logout}
                  title="Logout"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800/80 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 border border-slate-700 hover:border-rose-800/50 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-rose-600 to-brand-600 hover:from-rose-500 hover:to-brand-500 text-white shadow-lg shadow-rose-900/30 hover:shadow-rose-700/50 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
