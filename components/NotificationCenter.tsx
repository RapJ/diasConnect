
import React, { useRef, useEffect } from 'react';
import { AppNotification } from '../types';
import { 
  Bell, 
  CheckCircle2, 
  Info, 
  AlertCircle, 
  Zap, 
  X, 
  Trash2, 
  ChevronRight,
  Clock
} from 'lucide-react';

interface NotificationCenterProps {
  notifications: AppNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClear: () => void;
  onNavigate: (link: string) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  notifications, 
  isOpen, 
  onClose, 
  onMarkRead, 
  onMarkAllRead, 
  onClear,
  onNavigate
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div 
      ref={containerRef}
      className="absolute top-24 right-6 lg:right-10 w-full max-w-[400px] bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 z-[100] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300"
    >
      {/* Header */}
      <div className="p-8 border-b bg-gray-50/50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell size={24} className="text-[#2E7D32]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 leading-none">Notifications</h3>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1.5">
              {unreadCount} Unread Message{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onMarkAllRead}
            className="p-2 text-gray-400 hover:text-[#2E7D32] transition-colors"
            title="Mark all as read"
          >
            <CheckCircle2 size={18} />
          </button>
          <button 
            onClick={onClear}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Clear all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-[500px] overflow-y-auto scrollbar-hide divide-y">
        {notifications.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
              <Bell size={32} />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No notifications yet</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div 
              key={n.id}
              onClick={() => {
                onMarkRead(n.id);
                if (n.link) onNavigate(n.link);
              }}
              className={`p-6 flex items-start gap-4 transition-all cursor-pointer group ${n.read ? 'opacity-60 grayscale-[0.5]' : 'bg-green-50/30 hover:bg-green-50'}`}
            >
              <div className={`mt-1 p-2.5 rounded-xl shrink-0 ${
                n.type === 'success' ? 'bg-green-100 text-[#2E7D32]' :
                n.type === 'alert' ? 'bg-red-100 text-red-500' :
                n.type === 'update' ? 'bg-yellow-100 text-yellow-600' :
                'bg-blue-100 text-blue-500'
              }`}>
                {n.type === 'success' ? <CheckCircle2 size={16} /> :
                 n.type === 'alert' ? <AlertCircle size={16} /> :
                 n.type === 'update' ? <Zap size={16} /> :
                 <Info size={16} />}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start gap-2">
                  <h4 className={`text-sm font-black leading-tight ${n.read ? 'text-gray-600' : 'text-gray-900'}`}>{n.title}</h4>
                  {!n.read && <span className="w-2 h-2 bg-[#2E7D32] rounded-full mt-1 shrink-0"></span>}
                </div>
                <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-2">{n.message}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-1.5">
                    <Clock size={10} /> {new Date(n.date).toLocaleDateString()}
                  </span>
                  {n.link && (
                    <span className="text-[9px] font-black text-[#2E7D32] uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      View <ChevronRight size={10} />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-4 bg-gray-50/50 border-t text-center">
          <button 
            onClick={onClose}
            className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-gray-900 transition-colors"
          >
            Close Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
