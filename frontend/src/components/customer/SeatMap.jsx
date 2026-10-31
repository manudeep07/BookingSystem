import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Check, Clock, Ban } from 'lucide-react';
import { getShowSeats } from '../../api/shows';
import Alert from '../common/Alert';

export const SeatMap = ({ showId, showInfo, onBack, onSelectSeats }) => {
  const [showSeats, setShowSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]); // Array of showSeat.id

  const fetchSeats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getShowSeats(showId);
      setShowSeats(data);
    } catch (err) {
      setError(err.backendMessage || err.message || 'Failed to load seats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeats();
  }, [showId]);

  const toggleSeat = (showSeat) => {
    if (showSeat.seatStatus !== 'AVAILABLE') return;

    setSelectedSeatIds((prev) => {
      const exists = prev.includes(showSeat.id);
      if (exists) {
        return prev.filter((id) => id !== showSeat.id);
      } else {
        return [...prev, showSeat.id];
      }
    });
  };

  // Group seats by category
  const categories = [...new Set(showSeats.map((s) => s.seat?.category || 'STANDARD'))];

  const selectedSeatsList = showSeats.filter((s) => selectedSeatIds.includes(s.id));
  const totalAmount = selectedSeatsList.reduce(
    (sum, s) => sum + (parseFloat(s.price) || 0),
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#242f44]">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shows</span>
        </button>

        <div className="text-center">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {showInfo?.movieName || 'Select Your Seats'}
          </h2>
          {showInfo?.startTime && (
            <p className="text-xs text-rose-400 font-medium">
              {new Date(showInfo.startTime).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          )}
        </div>

        <button
          onClick={fetchSeats}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 bg-[#121722] border border-[#242f44] px-3 py-1.5 rounded-lg hover:border-slate-600 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} onClose={() => setError(null)} />
        </div>
      )}

      {/* Screen Representation */}
      <div className="mb-10 text-center">
        <div className="max-w-md mx-auto screen-curve mb-3"></div>
        <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold">
          All eyes this way • Cinema Screen
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-8 text-xs font-medium">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#181f2e] border border-slate-600 flex items-center justify-center text-[10px] text-slate-300">
            A1
          </div>
          <span className="text-slate-300">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/40">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="text-slate-300">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-amber-950/60 border border-amber-600/60 text-amber-400 flex items-center justify-center">
            <Clock className="w-3 h-3" />
          </div>
          <span className="text-amber-300">Reserved (5m Hold)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-slate-900 border border-slate-800 text-slate-600 flex items-center justify-center">
            <Ban className="w-3 h-3" />
          </div>
          <span className="text-slate-500">Booked</span>
        </div>
      </div>

      {/* Seat Layout by Category */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-rose-600/30 border-t-rose-600 rounded-full animate-spin mb-4" />
          <p className="text-sm text-slate-400">Loading screen seating plan...</p>
        </div>
      ) : showSeats.length === 0 ? (
        <div className="text-center py-16 bg-[#121722] rounded-2xl border border-[#242f44]">
          <p className="text-slate-400">No seats found for this show.</p>
        </div>
      ) : (
        <div className="space-y-8 mb-24">
          {categories.map((cat) => {
            const seatsInCat = showSeats.filter((s) => (s.seat?.category || 'STANDARD') === cat);
            const price = seatsInCat[0]?.price || 0;

            return (
              <div
                key={cat}
                className="bg-[#121722]/80 border border-[#242f44] rounded-2xl p-5 sm:p-6 backdrop-blur-sm"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#242f44]/80">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-1 rounded bg-slate-800 text-rose-400 border border-rose-500/20">
                      {cat}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({seatsInCat.length} seats)
                    </span>
                  </div>
                  <span className="text-sm font-bold text-emerald-400">
                    ₹{price} <span className="text-[10px] text-slate-400 font-normal">/ seat</span>
                  </span>
                </div>

                {/* Seat Grid */}
                <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 py-2">
                  {seatsInCat.map((ss) => {
                    const isSelected = selectedSeatIds.includes(ss.id);
                    const isAvailable = ss.seatStatus === 'AVAILABLE';
                    const isReserved = ss.seatStatus === 'RESERVED';
                    const isBooked = ss.seatStatus === 'BOOKED';

                    return (
                      <button
                        key={ss.id}
                        disabled={!isAvailable}
                        onClick={() => toggleSeat(ss)}
                        title={`Seat ${ss.seat?.name || 'N/A'} - ₹${ss.price} (${ss.seatStatus})`}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/50 scale-105 ring-2 ring-rose-400'
                            : isAvailable
                            ? 'bg-[#181f2e] text-slate-200 border border-slate-600 hover:border-rose-500 hover:bg-slate-800 hover:scale-105 active:scale-95'
                            : isReserved
                            ? 'bg-amber-950/40 text-amber-500 border border-amber-600/30 cursor-not-allowed opacity-80'
                            : 'bg-[#0a0d14] text-slate-600 border border-slate-800/80 cursor-not-allowed line-through opacity-40'
                        }`}
                      >
                        <span>{ss.seat?.name || '•'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Checkout Bar */}
      {selectedSeatIds.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto z-30">
          <div className="bg-[#121722]/95 border border-rose-500/40 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-2xl shadow-rose-950/40 flex flex-wrap items-center justify-between gap-4 animate-slideUp">
            <div>
              <p className="text-xs text-slate-400 font-medium">Selected Seats</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-base font-extrabold text-white">
                  {selectedSeatsList.map((s) => s.seat?.name).join(', ')}
                </span>
                <span className="text-xs text-rose-400 font-semibold px-2 py-0.5 rounded bg-rose-950/50 border border-rose-500/30">
                  {selectedSeatIds.length} {selectedSeatIds.length === 1 ? 'seat' : 'seats'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="text-right">
                <p className="text-xs text-slate-400 font-medium">Total Amount</p>
                <p className="text-xl font-extrabold text-emerald-400">
                  ₹{totalAmount.toFixed(2)}
                </p>
              </div>

              <button
                onClick={() => onSelectSeats(selectedSeatsList)}
                className="px-6 py-3 bg-gradient-to-r from-rose-600 to-brand-600 hover:from-rose-500 hover:to-brand-500 text-white font-bold rounded-xl shadow-lg shadow-rose-900/40 hover:shadow-rose-600/60 transition-all flex items-center gap-2 text-sm"
              >
                <span>Proceed to Pay</span>
                <span className="text-xs opacity-80">→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatMap;
