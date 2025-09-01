import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { ToastMessage } from '../../types';

const Toast: React.FC = () => {
  const { toasts, removeToast } = useToast();

  const getToastStyles = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIcon = (type: ToastMessage['type']) => {
    const iconProps = { size: 20 };
    switch (type) {
      case 'success':
        return <CheckCircle {...iconProps} className="text-green-600" />;
      case 'error':
        return <AlertCircle {...iconProps} className="text-red-600" />;
      case 'warning':
        return <AlertTriangle {...iconProps} className="text-yellow-600" />;
      case 'info':
        return <Info {...iconProps} className="text-blue-600" />;
      default:
        return <Info {...iconProps} className="text-gray-600" />;
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            max-w-sm w-full border rounded-lg p-4 shadow-lg transform transition-all duration-300 ease-in-out
            ${getToastStyles(toast.type)}
          `}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getIcon(toast.type)}
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={() => removeToast(toast.id)}
                className="rounded-md inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toast;