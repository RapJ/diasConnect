
import React, { useState } from 'react';
import { User, UserRole, AppNotification } from '../types';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Map, 
  Heart, 
  LogOut, 
  Menu, 
  Bell, 
  Search, 
  Users,
  User as UserIcon,
  Info,
  BarChart3,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import NotificationCenter from './NotificationCenter';

interface LayoutProps {
  user: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
  onLogout: () => void;
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClearNotifications: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  user, 
  activeTab, 
  setActiveTab, 
  children, 
  onLogout,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onClearNotifications
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = user?.role === UserRole.ADMIN ? [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
    { id: 'users', icon: Users, label: 'Member Registry' },
    { id: 'investments', icon: TrendingUp, label: 'Asset Portfolio' },
    { id: 'reports', icon: BarChart3, label: 'Impact Data' },
    { id: 'support', icon: Heart, label: 'Audits' },
  ] : [
    { id: 'dashboard', icon: LayoutDashboard, label: 'My Dashboard' },
    { id: 'portfolio', icon: Briefcase, label: 'My Assets' },
    { id: 'investments', icon: TrendingUp, label: 'Opportunities' },
    { id: 'tours', icon: Map, label: 'Missions' },
    { id: 'support', icon: Heart, label: 'Support Aid' },
    { id: 'reports', icon: BarChart3, label: 'Our Impact' },
  ];

  const secondaryNav = [
    { id: 'help', icon: HelpCircle, label: 'Help Center' },
    /* Renamed "The Mission" to "Index" as requested */
    { id: 'about', icon: Info, label: 'Index' },
  ];

  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#2E7D32] text-white transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-[#2E7D32] font-black shadow-lg">DC</div>
            <h1 className="text-xl font-black tracking-tighter">Diaspora</h1>
          </div>

          <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto scrollbar-hide">
            <p className="px-4 text-[9px] font-black uppercase tracking-[0.3em] text-white/40 mb-4">Core Platform</p>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all mb-1
                  ${activeTab === item.id ? 'bg-[#FFD700] text-[#2E7D32] font-black shadow-xl scale-105' : 'hover:bg-white/10 opacity-70 hover:opacity-100'}
                `}
              >
                <item.icon size={18} />
                <span className="text-sm font-bold">{item.label}</span>
              </button>
            ))}

            <div className="pt-8 pb-4">
              <p className="px-4 text-[9px] font-black uppercase tracking-[0.3em] text-white/40 mb-4">Resources</p>
              {secondaryNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all mb-1
                    ${activeTab === item.id ? 'bg-[#FFD700] text-[#2E7D32] font-black shadow-xl scale-105' : 'hover:bg-white/10 opacity-70 hover:opacity-100'}
                  `}
                >
                  <item.icon size={18} />
                  <span className="text-sm font-bold">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>

          <div className="p-4 border-t border-white/10 bg-black/10">
            <button
              onClick={() => {
                setActiveTab('profile');
                setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all mb-1
                ${activeTab === 'profile' ? 'bg-[#FFD700] text-[#2E7D32] font-black shadow-xl' : 'hover:bg-white/10'}
              `}
            >
              <UserIcon size={18} />
              <span className="text-sm font-bold">My Identity</span>
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-red-500/20 text-red-100 transition-all"
            >
              <LogOut size={18} />
              <span className="text-sm font-bold">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Navbar */}
        <header className="bg-white h-20 border-b flex items-center justify-between px-6 lg:px-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-3 hover:bg-gray-100 rounded-2xl transition-all"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:flex items-center bg-gray-50 px-5 py-2.5 rounded-[1.5rem] border border-transparent focus-within:border-[#2E7D32]/20 transition-all">
              <Search size={18} className="text-gray-300" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="bg-transparent border-none focus:ring-0 ml-3 text-sm font-bold w-64 placeholder:text-gray-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`relative p-3 hover:bg-gray-50 rounded-2xl transition-all ${isNotifOpen ? 'bg-gray-100' : ''}`}
            >
              <Bell size={22} className={unreadCount > 0 ? 'text-[#2E7D32]' : 'text-gray-600'} />
              {unreadCount > 0 && (
                <span className="absolute top-3 right-3 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[8px] font-black text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <div className="h-10 w-px bg-gray-100"></div>
            <button 
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-4 hover:bg-gray-50 transition-all py-1.5 px-2 rounded-2xl"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-gray-900 leading-none">{user?.name}</p>
                <p className="text-[9px] text-[#2E7D32] font-black uppercase tracking-widest mt-1">{user?.role || ''}</p>
              </div>
              <div className="w-10 h-10 rounded-2xl border-2 border-[#2E7D32]/10 overflow-hidden shadow-sm">
                <img src={user?.avatar} alt="avatar" className="w-full h-full object-cover" />
              </div>
            </button>
          </div>
        </header>

        {/* Notification Overlay */}
        <NotificationCenter 
          notifications={notifications}
          isOpen={isNotifOpen}
          onClose={() => setIsNotifOpen(false)}
          onMarkRead={onMarkRead}
          onMarkAllRead={onMarkAllRead}
          onClear={onClearNotifications}
          onNavigate={(link) => {
            setActiveTab(link);
            setIsNotifOpen(false);
          }}
        />

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-12 scrollbar-hide">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
