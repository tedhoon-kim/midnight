import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const toastConfig = {
  success: {
    icon: CheckCircle,
    bg: 'bg-status-success/10',
    border: 'border-status-success/30',
    iconColor: 'text-status-success',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-status-error/10',
    border: 'border-status-error/30',
    iconColor: 'text-status-error',
  },
  info: {
    icon: Info,
    bg: 'bg-status-info/10',
    border: 'border-status-info/30',
    iconColor: 'text-status-info',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-status-warning/10',
    border: 'border-status-warning/30',
    iconColor: 'text-status-warning',
  },
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4">
        {toasts.map((toast) => {
          const config = toastConfig[toast.type];
          const Icon = config.icon;
          
          return (
            <div
              key={toast.id}
              className={`flex items-center gap-3 p-4 rounded-xl border ${config.bg} ${config.border} shadow-lg animate-slide-up`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
              <p className="flex-1 text-midnight-text-secondary text-sm">{toast.message}</p>
              <button
                onClick={() => dismissToast(toast.id)}
                className="p-1 hover:bg-midnight-border rounded transition-colors"
              >
                <X className="w-4 h-4 text-midnight-text-muted" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
