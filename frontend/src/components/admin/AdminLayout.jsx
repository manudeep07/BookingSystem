import React, { useState } from 'react';
import { Shield, Building2, LayoutGrid, Film, Languages, Calendar, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import TheatersTab from './TheatersTab';
import SeatLayoutTab from './SeatLayoutTab';
import MoviesTab from './MoviesTab';
import LanguagesTab from './LanguagesTab';
import ShowsTab from './ShowsTab';

export const AdminLayout = ({ onNavigateHome }) => {
  const { isAdmin, role } = useAuth();
  const [activeAdminTab, setActiveAdminTab] = useState('theaters');

  // Hard client-side route guard: block non-admin users
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-500/50 flex items-center justify-center text-rose-500 mx-auto mb-4 shadow-xl shadow-rose-950/50">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Admin Access Required</h2>
        <p className="text-sm text-slate-400 mb-6">
          Your current session role is <span className="font-bold text-rose-400 uppercase">{role}</span>.
          Access to cinema configuration, theater setup, screen layouts, and show scheduling is strictly restricted to users with the <span className="font-bold text-amber-400">ADMIN</span> role.
        </p>
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Movies</span>
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'theaters', label: 'Theaters & Screens', icon: Building2 },
    { id: 'seats', label: 'Seat Layout Creator', icon: LayoutGrid },
    { id: 'movies', label: 'Movies Catalog', icon: Film },
    { id: 'languages', label: 'Languages', icon: Languages },
    { id: 'shows', label: 'Schedule Shows', icon: Calendar },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#242f44]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Shield className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Cinema Admin Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage theaters, screens, seat maps, movie listings, and show schedules
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300">
          <span>Role: ADMIN</span>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex overflow-x-auto gap-2 pb-4 mb-8 border-b border-[#242f44]/80 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-900/30'
                  : 'bg-[#121722] text-slate-400 hover:text-slate-200 border border-[#242f44] hover:border-slate-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      <div>
        {activeAdminTab === 'theaters' && <TheatersTab />}
        {activeAdminTab === 'seats' && <SeatLayoutTab />}
        {activeAdminTab === 'movies' && <MoviesTab />}
        {activeAdminTab === 'languages' && <LanguagesTab />}
        {activeAdminTab === 'shows' && <ShowsTab />}
      </div>
    </div>
  );
};

export default AdminLayout;
