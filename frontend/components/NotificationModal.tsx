"use client";

interface ModalProps {
  isOpen: boolean;
  type: 'confirm' | 'alert' | 'success';
  title: string;
  message: string;
  onConfirm?: () => void;
  onClose: () => void;
}

export default function NotificationModal({ isOpen, type, title, message, onConfirm, onClose }: ModalProps) {
  if (!isOpen) return null;

  const themes = {
    confirm: { 
      icon: (
        <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 15c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ), 
      color: 'rose', 
      btn: 'bg-rose-600 hover:bg-rose-700' 
    },
    alert: { 
      icon: (
        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ), 
      color: 'amber', 
      btn: 'bg-amber-600 hover:bg-amber-700' 
    },
    success: { 
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ), 
      color: 'emerald', 
      btn: 'bg-emerald-600 hover:bg-emerald-700' 
    }
  };

  const active = themes[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Animated Icon Container */}
        <div className={`w-12 h-12 bg-${active.color}-100 rounded-full flex items-center justify-center mb-4 mx-auto`}>
          {active.icon}
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 mb-2 text-center">{title}</h3>
        <p className="text-slate-500 text-sm mb-6 text-center">{message}</p>
        
        <div className="flex gap-3">
          {type === 'confirm' && (
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button 
            onClick={type === 'confirm' ? onConfirm : onClose}
            className={`flex-1 px-4 py-2 ${active.btn} text-white rounded-lg font-semibold transition cursor-pointer shadow-sm`}
          >
            {type === 'confirm' ? 'Confirm' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
}