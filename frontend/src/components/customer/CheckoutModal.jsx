import React, { useState, useEffect } from 'react';
import { X, CreditCard, CheckCircle2, AlertTriangle, ShieldCheck, Ticket, Calendar } from 'lucide-react';
import { createBooking, verifyPayment } from '../../api/bookings';
import { useBookings } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import CountdownTimer from '../common/CountdownTimer';
import Alert from '../common/Alert';

export const CheckoutModal = ({ showId, showInfo, selectedSeats, onClose, onBookingSuccess }) => {
  const { user } = useAuth();
  const { addBooking } = useBookings();

  const [loadingOrder, setLoadingOrder] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [expired, setExpired] = useState(false);

  // Initialize booking reservation and fetch Razorpay order from backend
  useEffect(() => {
    let isMounted = true;

    const initOrder = async () => {
      try {
        setLoadingOrder(true);
        setError(null);

        // seatIds must be the Seat entity IDs (s.seat.id)
        const seatIds = selectedSeats.map((s) => s.seat.id);
        const data = await createBooking(showId, seatIds);

        if (isMounted) {
          setOrderDetails(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.backendMessage || err.message || 'Failed to initiate seat hold and order');
        }
      } finally {
        if (isMounted) {
          setLoadingOrder(false);
        }
      }
    };

    initOrder();
    return () => {
      isMounted = false;
    };
  }, [showId, selectedSeats]);

  const handlePay = () => {
    if (!orderDetails || !window.Razorpay) {
      setError('Payment gateway is not ready. Please try again.');
      return;
    }

    if (expired) {
      setError('Your 5-minute seat hold has expired. Please select seats again.');
      return;
    }

    const options = {
      key: orderDetails.keyId,
      amount: orderDetails.amount,
      currency: 'INR',
      name: 'CinePass Cinema',
      description: `Tickets for ${showInfo?.movieName || 'Movie'}`,
      order_id: orderDetails.orderId,
      prefill: {
        email: user?.email || '',
      },
      theme: {
        color: '#e50914',
      },
      handler: async function (response) {
        try {
          setVerifying(true);
          setError(null);

          const verificationPayload = {
            bookingId: orderDetails.bookingId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          };

          const isVerified = await verifyPayment(verificationPayload);

          if (isVerified) {
            const newBookingRecord = {
              bookingId: orderDetails.bookingId,
              orderId: orderDetails.orderId,
              movieName: showInfo?.movieName || 'Movie',
              showTime: showInfo?.startTime,
              screenName: showInfo?.screenName || 'Main Screen',
              theaterName: showInfo?.theaterName || 'Cinema',
              seats: selectedSeats.map((s) => s.seat?.name),
              totalAmount: orderDetails.amount / 100,
              status: 'BOOKED',
              bookedAt: new Date().toISOString(),
            };

            addBooking(newBookingRecord);
            setConfirmedBooking(newBookingRecord);
            if (onBookingSuccess) onBookingSuccess(newBookingRecord);
          } else {
            setError('Payment verification failed on the server.');
          }
        } catch (verifyErr) {
          setError(
            verifyErr.backendMessage ||
              verifyErr.message ||
              'Payment verification failed'
          );
        } finally {
          setVerifying(false);
        }
      },
      modal: {
        ondismiss: function () {
          // User closed Razorpay modal without finishing
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (failResponse) {
      setError(
        failResponse.error?.description || 'Payment was unsuccessful or cancelled.'
      );
    });
    rzp.open();
  };

  const handleExpiry = () => {
    setExpired(true);
    setError(
      'Your 5-minute reservation hold has expired. Seats have been released back to available.'
    );
  };

  const totalAmountInInr = orderDetails?.amount
    ? (orderDetails.amount / 100).toFixed(2)
    : selectedSeats
        .reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0)
        .toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#121722] border border-[#242f44] rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedBooking ? (
          /* Confirmation State */
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500 text-emerald-400 mb-4 shadow-lg shadow-emerald-900/30 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-1">
              Booking Confirmed!
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Your tickets have been reserved and payment was successfully verified.
            </p>

            {/* Ticket Card */}
            <div className="bg-[#0a0d14] border border-[#242f44] rounded-xl p-5 text-left mb-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-extrabold text-white text-base">
                    {confirmedBooking.movieName}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {confirmedBooking.theaterName} • {confirmedBooking.screenName}
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-600/40">
                  CONFIRMED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-[#242f44]">
                <div>
                  <span className="text-slate-500 block">Show Time</span>
                  <span className="text-slate-200 font-medium">
                    {confirmedBooking.showTime
                      ? new Date(confirmedBooking.showTime).toLocaleString('en-US', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })
                      : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Seats</span>
                  <span className="text-rose-400 font-bold">
                    {confirmedBooking.seats.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Amount Paid</span>
                  <span className="text-emerald-400 font-bold">
                    ₹{confirmedBooking.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Booking Reference</span>
                  <span className="text-slate-300 font-mono text-[10px] truncate block">
                    {confirmedBooking.bookingId}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm transition-all"
            >
              Done & Close
            </button>
          </div>
        ) : (
          /* Checkout Payment State */
          <div>
            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-[#242f44]">
              <div>
                <h3 className="text-xl font-bold text-white">Booking Checkout</h3>
                <p className="text-xs text-slate-400">Complete payment to confirm seats</p>
              </div>
              {!loadingOrder && !error && !expired && (
                <CountdownTimer initialMinutes={5} onExpire={handleExpiry} />
              )}
            </div>

            {error && (
              <div className="mb-4">
                <Alert type="error" message={error} onClose={() => setError(null)} />
              </div>
            )}

            {/* Movie & Show Info */}
            <div className="bg-[#0a0d14] rounded-xl p-4 border border-[#242f44] mb-4">
              <div className="flex items-center gap-3 mb-2">
                <Ticket className="w-5 h-5 text-rose-500" />
                <span className="font-bold text-white text-base">
                  {showInfo?.movieName || 'Movie Show'}
                </span>
              </div>
              <div className="text-xs text-slate-400 space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    {showInfo?.startTime
                      ? new Date(showInfo.startTime).toLocaleString('en-US', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })
                      : 'Show time'}
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Seats Breakdown */}
            <div className="space-y-2 mb-6">
              <p className="text-xs font-semibold text-slate-300">Seats Breakdown</p>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {selectedSeats.map((s) => (
                  <div
                    key={s.id}
                    className="flex justify-between items-center text-xs py-1.5 px-3 bg-[#181f2e] rounded-lg border border-[#242f44]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-rose-400">
                        {s.seat?.name || 'Seat'}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase">
                        ({s.seat?.category || 'Standard'})
                      </span>
                    </div>
                    <span className="font-semibold text-slate-200">₹{s.price}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[#242f44] text-sm">
                <span className="font-bold text-slate-200">Total Payable</span>
                <span className="font-extrabold text-xl text-emerald-400">
                  ₹{totalAmountInInr}
                </span>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={loadingOrder || verifying || expired}
              className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-brand-600 hover:from-rose-500 hover:to-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-rose-900/40 hover:shadow-rose-600/60 transition-all flex items-center justify-center gap-2.5 text-sm"
            >
              {loadingOrder ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Holding Seats...</span>
                </>
              ) : verifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Payment...</span>
                </>
              ) : expired ? (
                <span>Hold Expired</span>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Pay ₹{totalAmountInInr} with Razorpay</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 mt-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Secured 256-bit encrypted Razorpay transaction</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
