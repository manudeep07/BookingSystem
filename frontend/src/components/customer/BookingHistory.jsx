import React, { useState } from 'react';
import { Ticket, Calendar, DollarSign, Ban, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useBookings } from '../../context/BookingContext';
import Alert from '../common/Alert';

export const BookingHistory = () => {
  const { bookings, cancelUserBooking } = useBookings();
  const [cancellingId, setCancellingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Confirmed seats will be released back to available.')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      setError(null);
      setSuccess(null);
      await cancelUserBooking(bookingId);
      setSuccess('Booking has been cancelled and tickets were released.');
    } catch (err) {
      setError(err.backendMessage || err.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const statusBadge = (status) => {
    switch (status) {
      case 'BOOKED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-600/40">
            <CheckCircle className="w-3 h-3" />
            Confirmed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-950/80 text-rose-300 border border-rose-600/40">
            <Ban className="w-3 h-3" />
            Cancelled
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-950/80 text-amber-300 border border-amber-600/40">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#242f44]">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Ticket className="w-6 h-6 text-rose-500" />
            <span>My Bookings</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            View your ticket history and cancel bookings
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} onClose={() => setError(null)} />
        </div>
      )}

      {success && (
        <div className="mb-6">
          <Alert type="success" message={success} onClose={() => setSuccess(null)} />
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-[#121722] rounded-2xl border border-[#242f44] p-8">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Bookings Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven't booked any movie tickets yet. Browse available movies to make your first booking!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isBooked = booking.status === 'BOOKED';
            const isCancelling = cancellingId === booking.bookingId;

            return (
              <div
                key={booking.bookingId}
                className="bg-[#121722] rounded-2xl border border-[#242f44] p-5 sm:p-6 shadow-md hover:border-slate-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                {/* Left: Movie & Showtime */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-bold text-white">
                      {booking.movieName}
                    </h3>
                    {statusBadge(booking.status)}
                  </div>

                  <p className="text-xs text-slate-400">
                    {booking.theaterName || 'Cinema'} • {booking.screenName || 'Auditorium'}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs pt-1 text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-rose-500" />
                      <span>
                        {booking.showTime
                          ? new Date(booking.showTime).toLocaleString('en-US', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })
                          : 'Showtime'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-400">Seats:</span>
                      <span className="text-rose-400 font-bold">
                        {Array.isArray(booking.seats)
                          ? booking.seats.join(', ')
                          : booking.seats || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-slate-500 pt-1 truncate">
                    Ref ID: {booking.bookingId}
                  </div>
                </div>

                {/* Right: Amount & Cancel Action */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 border-t sm:border-t-0 pt-4 sm:pt-0 border-[#242f44]">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      Paid
                    </span>
                    <span className="text-xl font-extrabold text-emerald-400">
                      ₹{booking.totalAmount ? parseFloat(booking.totalAmount).toFixed(2) : '0.00'}
                    </span>
                  </div>

                  {isBooked && (
                    <button
                      onClick={() => handleCancel(booking.bookingId)}
                      disabled={isCancelling}
                      className="px-4 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 hover:border-rose-600 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isCancelling ? (
                        <div className="w-3.5 h-3.5 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Ban className="w-3.5 h-3.5" />
                      )}
                      <span>Cancel Ticket</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
