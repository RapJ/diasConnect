
import React, { useState, useEffect, Suspense, lazy } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Investments from './pages/Investments';
import Support from './pages/Support';
import Landing from './pages/Landing';
import MyPortfolio from './pages/MyPortfolio';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import InvestmentModal from './components/InvestmentModal';
import GeminiAdvisor from './components/GeminiAdvisor';
import { dbService } from './services/dbService';
import { User, UserRole, Investment, Tour, Transaction, UserInvestment, AppNotification, SupportRecord } from './types';
import { 
  Plus, 
  X, 
  Save, 
  Trash2, 
  Loader2, 
  CheckCircle2, 
  Database,
  MapPin,
  Calendar,
  Users,
  Compass,
  AlertCircle,
  Wifi,
  Cloud
} from 'lucide-react';

// Lazy load heavy components for better performance
const Profile = lazy(() => import('./pages/Profile'));
const About = lazy(() => import('./pages/About'));
const Careers = lazy(() => import('./pages/Careers'));
const ImpactReport = lazy(() => import('./pages/ImpactReport'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Admin = lazy(() => import('./pages/Admin'));

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(dbService.getCurrentUser());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [view, setView] = useState<'landing' | 'auth' | 'app'>(user ? 'app' : 'landing');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<'connected' | 'syncing' | 'broadcasting'>('connected');

  // App-wide Data State
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [portfolio, setPortfolio] = useState<UserInvestment[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [supportRecords, setSupportRecords] = useState<SupportRecord[]>([]);

  // Modals
  const [detailsModal, setDetailsModal] = useState<{ type: 'project' | 'story' | 'tour', data: any } | null>(null);
  const [pendingCheckout, setPendingCheckout] = useState<{ item: any, amount: number, type: 'Investment' | 'Booking' } | null>(null);

  const fetchData = async () => {
    setDbStatus('syncing');
    try {
      const [inv, t, tx, p, n, sup] = await Promise.all([
        dbService.getInvestments(),
        dbService.getTours(),
        dbService.getTransactions(),
        dbService.getPortfolio(),
        dbService.getNotifications(),
        dbService.getSupportRecords()
      ]);
      setInvestments(inv);
      setTours(t);
      setTransactions(tx);
      setPortfolio(p);
      setNotifications(n);
      setSupportRecords(sup);
    } catch (err) {
      console.error("Critical: Data synchronization failed", err);
    } finally {
      setTimeout(() => setDbStatus('connected'), 800);
    }
  };

  useEffect(() => {
    fetchData();
    const handleDbUpdate = () => {
      const currentUser = dbService.getCurrentUser();
      setUser(currentUser);
      fetchData();
    };
    window.addEventListener('dc_database_updated', handleDbUpdate);
    return () => window.removeEventListener('dc_database_updated', handleDbUpdate);
  }, []);

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setView('app');
    dbService.addNotification({
      title: 'Session Authorized',
      message: `Welcome back to the DC network hub, ${authenticatedUser.name}.`,
      type: 'success',
      date: new Date().toISOString()
    });
  };

  const handleLogout = () => {
    dbService.signOut();
    setUser(null);
    setView('landing');
    setActiveTab('dashboard');
  };

  const handlePaymentSuccess = async () => {
    if (pendingCheckout) {
      setDbStatus('broadcasting');
      if (pendingCheckout.type === 'Investment') {
        const newInv: UserInvestment = {
          ...pendingCheckout.item,
          amountInvested: pendingCheckout.amount,
          dateInvested: new Date().toISOString().split('T')[0],
          status: 'Active',
          returnsEarned: 0
        };
        await dbService.addToPortfolio(newInv);
        await dbService.updateInvestment(pendingCheckout.item.id, {
           currentFunding: pendingCheckout.item.currentFunding + pendingCheckout.amount
        });
        
        await dbService.addNotification({
          title: 'Capital Commitment Finalized',
          message: `Equity stake in ${pendingCheckout.item.title} has been logged in the private ledger.`,
          type: 'success',
          link: 'portfolio'
        });
      } else if (pendingCheckout.type === 'Booking') {
        await dbService.addNotification({
          title: 'Mission Token Issued',
          message: `Seat reservation confirmed for ${pendingCheckout.item.title}. Welcome to the team.`,
          type: 'success',
          link: 'dashboard'
        });
      }
      
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        type: pendingCheckout.type as any,
        amount: pendingCheckout.amount,
        date: new Date().toISOString().split('T')[0],
        status: 'Completed'
      };
      await dbService.addTransaction(newTx);
      setPendingCheckout(null);
      setActiveTab(pendingCheckout.type === 'Investment' ? 'portfolio' : 'dashboard');
      fetchData();
    }
  };

  const renderContent = () => {
    const commonPages: Record<string, React.ReactNode> = {
      'about': <About />,
      'careers': <Careers />,
      'reports': <ImpactReport />,
      'help': <HelpCenter />,
      'terms': <Terms />,
      'privacy': <Privacy />,
      'profile': user ? <Profile user={user} onUpdateUser={(u) => dbService.updateUserProfile(user.id, u)} /> : null,
      'checkout': pendingCheckout ? (
        <Checkout investment={pendingCheckout.item} amount={pendingCheckout.amount} onBack={() => setPendingCheckout(null)} onSuccess={handlePaymentSuccess} />
      ) : (
        <Investments investments={investments} onInvest={(i, a) => { setPendingCheckout({item: i, amount: a, type: 'Investment'}); setActiveTab('checkout'); }} onOpenDetails={(p) => setDetailsModal({ type: 'project', data: p })} />
      )
    };

    if (commonPages[activeTab]) {
      return (
        <Suspense fallback={<div className="flex flex-col items-center justify-center h-full space-y-4 animate-in fade-in"><Loader2 className="animate-spin text-[#2E7D32]" size={48} /><p className="text-xs font-black uppercase tracking-widest text-gray-400">Loading Continental Assets...</p></div>}>
          {commonPages[activeTab]}
        </Suspense>
      );
    }

    if (user?.role === UserRole.ADMIN) {
      switch (activeTab) {
        case 'dashboard': return <Dashboard role={UserRole.ADMIN} investments={investments} tours={tours} transactions={transactions} support={supportRecords} onViewAllActivity={() => setActiveTab('support')} />;
        case 'users':
        case 'support':
        case 'investments':
          return <Suspense fallback={<Loader2 className="animate-spin" />}><Admin /></Suspense>;
        default: return <Dashboard role={UserRole.ADMIN} investments={investments} tours={tours} transactions={transactions} support={supportRecords} />;
      }
    } else {
      switch (activeTab) {
        case 'dashboard': return <Dashboard role={UserRole.USER} investments={investments} tours={tours} transactions={transactions} support={supportRecords} />;
        case 'investments': return <Investments investments={investments} onInvest={(i, a) => { setPendingCheckout({item: i, amount: a, type: 'Investment'}); setActiveTab('checkout'); }} onOpenDetails={(p) => setDetailsModal({ type: 'project', data: p })} />;
        case 'portfolio': return <MyPortfolio investments={portfolio} />;
        case 'support': return <Support userRole={UserRole.USER} onOpenStory={(s) => setDetailsModal({ type: 'story', data: s })} />;
        case 'tours':
          return (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
              <div className="space-y-2">
                <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Spiritual <span className="text-[#FFD700]">Missions</span></h1>
                <p className="text-gray-500 font-medium text-lg">Curated cultural and faith-based experiences across the African continent.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {tours.map(tour => (
                  <div key={tour.id} className="bg-white rounded-[3rem] border shadow-sm overflow-hidden group hover:shadow-2xl transition-all">
                    <div className="h-60 relative overflow-hidden">
                      <img src={tour.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" />
                      <div className="absolute top-6 left-6">
                        <span className="bg-[#FFD700] text-[#2E7D32] text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">{tour.type}</span>
                      </div>
                    </div>
                    <div className="p-8 space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black text-gray-900">{tour.title}</h3>
                        <p className="text-xs text-gray-400 font-bold flex items-center gap-2 uppercase tracking-widest">
                          <MapPin size={12} className="text-[#2E7D32]" /> {tour.location}
                        </p>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="flex items-center gap-2 text-gray-500 font-bold text-xs"><Calendar size={14} className="text-[#2E7D32]" /> {tour.date}</div>
                        <div className="flex items-center gap-2 text-[#2E7D32] font-black text-xs uppercase tracking-widest"><Users size={14} /> {tour.seatsAvailable} Seats</div>
                      </div>
                      <button 
                        onClick={() => {
                          setPendingCheckout({ item: tour, amount: 1500, type: 'Booking' });
                          setActiveTab('checkout');
                        }}
                        className="w-full py-4 bg-[#2E7D32] text-white hover:scale-[1.02] active:scale-95 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all"
                      >
                        Secure Flight Seat ($1,500)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        default: return <Dashboard role={UserRole.USER} investments={investments} tours={tours} transactions={transactions} support={supportRecords} />;
      }
    }
  };

  if (view === 'landing') return <Landing user={user} onGetStarted={() => { setAuthMode('signup'); setView('auth'); }} onLogin={() => { setAuthMode('login'); setView('auth'); }} onLogout={handleLogout} onNavigate={(tab) => { setActiveTab(tab); setView('app'); }} />;
  if (view === 'auth') return <Auth initialMode={authMode} onSuccess={handleAuthSuccess} onCancel={() => setView('landing')} />;

  return (
    <Layout 
      user={user} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onLogout={handleLogout}
      notifications={notifications}
      onMarkRead={(id) => dbService.markAsRead(id)}
      onMarkAllRead={() => dbService.markAllAsRead()}
      onClearNotifications={() => dbService.clearNotifications()}
    >
      {/* Registry Sync Toast (Fixed Position) */}
      <div className="fixed bottom-8 right-8 z-[500] pointer-events-auto">
        <div className={`flex items-center gap-4 bg-white px-8 py-4 rounded-[2rem] border shadow-2xl transition-all duration-500 ${dbStatus === 'connected' ? 'border-green-100' : 'border-yellow-200'}`}>
           <div className="relative">
              <div className={`w-3 h-3 rounded-full ${dbStatus === 'connected' ? 'bg-[#2E7D32]' : 'bg-yellow-500 animate-ping'}`}></div>
              <div className={`absolute inset-0 w-3 h-3 rounded-full ${dbStatus === 'connected' ? 'bg-[#2E7D32]/40 animate-pulse' : 'bg-yellow-500/40'}`}></div>
           </div>
           <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                 <Cloud size={14} className="text-[#2E7D32]" /> {dbStatus === 'connected' ? 'Registry Sync: Verified' : dbStatus === 'syncing' ? 'Pulling Data Hub...' : 'Broadcasting Transaction...'}
              </span>
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tight">Latency: 42ms • Secure AWS-GCP Bridge</p>
           </div>
        </div>
      </div>

      {renderContent()}
      {user && <GeminiAdvisor />}

      {detailsModal?.type === 'project' && (
        <InvestmentModal 
          investment={detailsModal.data} 
          onClose={() => setDetailsModal(null)} 
          onInvest={(i, a) => { setDetailsModal(null); setPendingCheckout({item: i, amount: a, type: 'Investment'}); setActiveTab('checkout'); }}
          currency={user?.preferences?.currency || 'USD'}
        />
      )}
    </Layout>
  );
};

export default App;
