import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export const Alert = ({ type = 'error', message, onClose }) => {
  if (!message) return null;

  const styles = {
    error: 'bg-rose-950/80 border-rose-600 text-rose-200',
    success: 'bg-emerald-950/80 border-emerald-600 text-emerald-200',
    warning: 'bg-amber-950/80 border-amber-600 text-amber-200',
    info: 'bg-blue-950/80 border-blue-600 text-blue-200',
  };

  const icons = {
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    success: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md transition-all shadow-lg ${styles[type]}`}
    >
      {icons[type]}
      <div className="flex-1 text-sm font-medium leading-relaxed break-words">
        {message}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
