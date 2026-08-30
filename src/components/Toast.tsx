import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-3 right-3 z-50 flex flex-col gap-1.5 max-w-xs w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className={`pointer-events-auto nb-box-sm flex items-center justify-between p-2 text-xs font-black ${
              toast.type === 'success'
                ? 'bg-[#BBF7D0] text-black'
                : toast.type === 'error'
                ? 'bg-[#FECDD3] text-black'
                : 'bg-[#FEF08A] text-black'
            }`}
          >
            <div className="flex items-center gap-1.5">
              {toast.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />}
              {toast.type === 'error' && <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />}
              {toast.type === 'info' && <Info className="w-3.5 h-3.5 stroke-[2.5]" />}
              <span>{toast.message}</span>
            </div>
            <button onClick={() => onDismiss(toast.id)} className="p-0.5 hover:bg-black/10 rounded">
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
