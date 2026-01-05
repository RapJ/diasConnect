
import React from 'react';
import { Compass, TrendingUp, Heart, ArrowRight, Play, Star, ShieldCheck, Globe, LogOut, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface LandingProps {
  user: User | null;
  onGetStarted: () => void;
  onLogin: () => void;
  onLogout: () => void;
  onNavigate: (tab: string) => void;
}

const Landing: React.FC<LandingProps> = ({ user, onGetStarted, onLogin, onLogout, onNavigate }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 h-20 glass z-50 px-6 lg:px-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 bg-[#2E7D32] rounded-full flex items-center justify-center text-white font-bold shadow-lg">DC</div>
          <span className="text-xl font-bold text-[#2E7D32] tracking-tighter">Diaspora Connect</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
          {/* Changed "About Us" to "Index" link in header as requested */}
          <button onClick={() => onNavigate('about')} className="hover:text-[#2E7D32] transition-colors font-bold">Index</button>
          <button onClick={() => scrollToSection('features')} className="hover:text-[#2E7D32] transition-colors">Features</button>
          <button onClick={() => onNavigate('investments')} className="hover:text-[#2E7D32] transition-colors">Invest</button>
          <button onClick={() => onNavigate('tours')} className="hover:text-[#2E7D32] transition-colors">Mission</button>
          
          {/* User details only show when logged in */}
          {user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
              <div className="text-right">
                <p className="text-xs font-black text-gray-900 leading-none">{user.name}</p>
                <button 
                  onClick={() => onNavigate('dashboard')} 
                  className="text-[10px] text-[#2E7D32] font-black uppercase tracking-widest mt-1 hover:underline"
                >
                  Dashboard
                </button>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-[#2E7D32]/20 overflow-hidden shadow-sm">
                <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <button 
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-red-500 transition-all"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <>
              <button onClick={onLogin} className="text-[#2E7D32] border border-[#2E7D32]/20 px-6 py-2 rounded-full hover:bg-[#2E7D32]/5 transition-all">Login</button>
              <button onClick={onGetStarted} className="bg-[#2E7D32] text-white px-6 py-2 rounded-full shadow-lg shadow-green-900/20 hover:scale-105 transition-all active:scale-95">Join Platform</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-20 px-6 lg:px-20 overflow-hidden bg-white">
        <div className="absolute top-40 right-[-10%] w-[500px] h-[500px] bg-[#FFD700]/10 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-20 left-[-5%] w-[400px] h-[400px] bg-[#2E7D32]/10 rounded-full blur-[80px] -z-10"></div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1]">
              Invest, Experience, and <span className="text-[#2E7D32]">Support Africa</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Bridge the gap between you and the continent. Discover verified investments, embark on spiritual missions, and contribute to transformative projects.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button 
                onClick={user ? () => onNavigate('investments') : onGetStarted}
                className="w-full sm:w-auto px-10 py-5 bg-[#2E7D32] text-white rounded-2xl font-bold text-lg shadow-xl shadow-green-900/20 hover:scale-105 transition-all flex items-center justify-center gap-3"
              >
                {user ? 'View Opportunities' : 'Explore Projects'} <ArrowRight size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 cursor-pointer">
              <img src="https://picsum.photos/seed/africa-modern/800/1000" alt="Africa Future" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 lg:px-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: TrendingUp, title: "Secure Investments", desc: "Vetted projects with competitive returns.", color: 'bg-green-100 text-green-700', id: 'investments' },
              { icon: Compass, title: "Faith & Tourism", desc: "Curated mission trips for spiritual growth.", color: 'bg-yellow-100 text-yellow-700', id: 'tours' },
              { icon: Heart, title: "Direct Support", desc: "Contribute aid to community projects.", color: 'bg-red-100 text-red-700', id: 'support' }
            ].map((f, idx) => (
              <div 
                key={idx} 
                className="bg-white p-10 rounded-[2rem] border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
                onClick={() => onNavigate(f.id)}
              >
                <div className={`w-16 h-16 ${f.color} rounded-2xl flex items-center justify-center mb-8`}>
                  <f.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed mb-6">{f.desc}</p>
                <span className="text-[#2E7D32] font-bold text-sm flex items-center gap-2">
                  Learn More <ArrowRight size={16} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-20 pb-10 px-6 lg:px-20 border-t mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#2E7D32] rounded-full flex items-center justify-center text-white font-bold text-xs">DC</div>
              <span className="text-lg font-bold text-[#2E7D32] tracking-tighter">Diaspora Connect</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">Connecting the African heart to its roots across the globe through prosperity and faith.</p>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase text-[10px] tracking-widest text-gray-400">Company</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-600">
              <li><button onClick={() => onNavigate('about')} className="hover:text-[#2E7D32] transition-colors">Index</button></li>
              <li><button onClick={() => onNavigate('careers')} className="hover:text-[#2E7D32] transition-colors">Careers</button></li>
              <li><button onClick={() => onNavigate('reports')} className="hover:text-[#2E7D32] transition-colors">Impact Report</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase text-[10px] tracking-widest text-gray-400">Support</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-600">
              <li><button onClick={() => onNavigate('help')} className="hover:text-[#2E7D32] transition-colors">Help Center</button></li>
              <li><button onClick={() => onNavigate('terms')} className="hover:text-[#2E7D32] transition-colors">Terms of Service</button></li>
              <li><button onClick={() => onNavigate('privacy')} className="hover:text-[#2E7D32] transition-colors">Privacy Policy</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase text-[10px] tracking-widest text-gray-400">Join the Collective</h4>
            <button onClick={user ? () => onNavigate('dashboard') : onGetStarted} className="w-full py-4 bg-[#2E7D32] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all">
              {user ? 'My Dashboard' : 'Sign Up Now'}
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto text-center border-t pt-10 text-[9px] text-gray-300 font-black uppercase tracking-[0.3em]">
          © 2024 Diaspora Connect. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
