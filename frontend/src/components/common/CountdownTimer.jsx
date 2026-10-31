import React, { useState, useEffect } from 'react';
import { Timer, AlertTriangle } from 'lucide-react';

export const CountdownTimer = ({ expiryTime, onExpire, initialMinutes = 5 }) => {
  const calculateRemaining = () => {
    if (expiryTime) {
      const expiry = new Date(expiryTime).getTime();
      const now = new Date().getTime();
      return Math.max(0, Math.floor((expiry - now) / 1000));
    }
    return initialMinutes * 60;
  };

  const [secondsLeft, setSecondsLeft] = useState(calculateRemaining);

  useEffect(() => {
    setSecondsLeft(calculateRemaining());
  }, [expiryTime]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onExpire) onExpire();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onExpire) onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, onExpire]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isUrgent = secondsLeft < 60;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold transition-all ${
        isUrgent
          ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
          : 'bg-amber-950/50 border-amber-600/50 text-amber-300'
      }`}
    >
      {isUrgent ? (
        <AlertTriangle className="w-4 h-4 text-rose-400" />
      ) : (
        <Timer className="w-4 h-4 text-amber-400" />
      )}
      <span>Seat Hold:</span>
      <span className="font-mono text-base tracking-wider">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};

export default CountdownTimer;
