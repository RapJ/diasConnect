
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Investment, InvestmentAlert } from '../types';
import { 
  Search, 
  MapPin, 
  TrendingUp, 
  ChevronDown, 
  Check, 
  Globe, 
  Filter,
  ArrowUpDown,
  Activity,
  Zap,
  Loader2,
  X,
  RotateCcw,
  ShieldCheck,
  Bell,
  Plus,
  Trash2,
  Target,
  ChevronRight,
  Settings,
  DollarSign,
  Info,
  Layers,
  ArrowUpRight,
  BrainCircuit
} from 'lucide-react';
import { getInvestmentInsights } from '../services/geminiService';
import { EXCHANGE_RATES } from '../constants';
import { dbService } from '../services/dbService';
import InvestmentModal from '../components/InvestmentModal';

interface InvestmentsProps {
  investments: Investment[];
  onInvest: (inv: Investment, amount: number) => void;
  onOpenDetails: (inv: Investment) => void;
}

type SortOption = 'newest' | 'goal-high' | 'goal-low' | 'progress-high' | 'title' | 'title-desc';

const SearchableDropdown: React.FC<{
  label: string;
  options: string[];
  selected: string;
  onSelect: (val: string) => void;
  placeholder: string;
  icon?: React.ReactNode;
}> = ({ label, options, selected, onSelect, placeholder, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 mb-2 block">{label}</label>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-all group shadow-sm"
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-[#2E7D32]">{icon}</span>}
          <span className="font-bold text-gray-900 text-sm">{selected === 'All' ? `All ${label}s` : selected}</span>
        </div>
        <ChevronDown size={16} className={`text-gray-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white border rounded-[2rem] shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b bg-gray-50/50">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                autoFocus
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-xl pl-10 pr-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-[#2E7D32]/10"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto p-2 scrollbar-hide">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => {
                    onSelect(opt);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full flex items-center justify-between px-5 py-3 rounded-xl text-sm font-bold transition-all ${selected === opt ? 'bg-[#2E7D32] text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {opt}
                  {selected === opt && <Check size={14} />}
                </button>
              ))
            ) : (
              <div className="py-8 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Investments: React.FC<InvestmentsProps> = ({ investments, onInvest, onOpenDetails }) => {
  const [sectorFilter, setSectorFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  
  const [selectedProject, setSelectedProject] = useState<Investment | null>(null);
  const [insights, setInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Alert State
  const [alerts, setAlerts] = useState<InvestmentAlert[]>([]);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [newAlert, setNewAlert] = useState({ sector: 'All', country: 'All', minGoal: 0 });

  useEffect(() => {
    setAlerts(dbService.getAlerts());
  }, []);

  const sectors = ['All', 'Agriculture', 'Tech', 'Infrastructure', 'Real Estate'];
  
  const countries = useMemo(() => {
    const uniqueCountries = Array.from(new Set(investments.map(i => i.country))).sort();
    return ['All', ...uniqueCountries];
  }, [investments]);

  const convert = (amount: number) => {
    const rate = EXCHANGE_RATES[currency] || 1;
    return (amount * rate).toLocaleString(undefined, {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    });
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...investments];
    if (sectorFilter !== 'All') result = result.filter(i => i.type === sectorFilter);
    if (countryFilter !== 'All') result = result.filter(i => i.country === countryFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i => 
        i.title.toLowerCase().includes(q) || 
        i.location.toLowerCase().includes(q) ||
        i.country.toLowerCase().includes(q) ||
        i.type.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
      );
    }
    switch (sortOption) {
      case 'goal-high': result.sort((a, b) => b.fundingGoal - a.fundingGoal); break;
      case 'goal-low': result.sort((a, b) => a.fundingGoal - b.fundingGoal); break;
      case 'progress-high': result.sort((a, b) => (b.currentFunding / b.fundingGoal) - (a.currentFunding / a.fundingGoal)); break;
      case 'title': result.sort((a, b) => a.title.localeCompare(b.title)); break;
      case 'title-desc': result.sort((a, b) => b.title.localeCompare(a.title)); break;
      default: result.sort((a, b) => b.id.localeCompare(a.id)); break;
    }
    return result;
  }, [investments, sectorFilter, countryFilter, searchQuery, sortOption]);

  const matchedInvestments = useMemo(() => {
    if (alerts.length === 0) return [];
    return investments.filter(inv => {
      return alerts.some(alert => {
        const sectorMatch = alert.sector === 'All' || inv.type === alert.sector;
        const countryMatch = alert.country === 'All' || inv.country === alert.country;
        const goalMatch = inv.fundingGoal >= alert.minGoal;
        return sectorMatch && countryMatch && goalMatch;
      });
    });
  }, [investments, alerts]);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoadingInsights(true);
      const res = await getInvestmentInsights(sectorFilter === 'All' ? 'diverse' : sectorFilter);
      setInsights(res || null);
      setLoadingInsights(false);
    };
    fetchInsights();
  }, [sectorFilter]);

  const handleAddAlert = () => {
    const alert: InvestmentAlert = {
      id: `alert-${Date.now()}`,
      ...newAlert,
      active: true,
      createdAt: new Date().toISOString()
    };
    const updated = dbService.saveAlert(alert);
    setAlerts(updated);
    
    const matches = investments.filter(inv => {
      const sectorMatch = alert.sector === 'All' || inv.type === alert.sector;
      const countryMatch = alert.country === 'All' || inv.country === alert.country;
      const goalMatch = inv.fundingGoal >= alert.minGoal;
      return sectorMatch && countryMatch && goalMatch;
    });

    if (matches.length > 0) {
      dbService.addNotification({
        title: 'Intelligence Match Found',
        message: `Your tracking rule for ${alert.sector} in ${alert.country} has detected ${matches.length} matching assets.`,
        type: 'alert',
        link: 'investments'
      });
      window.dispatchEvent(new Event('dc_notifications_updated'));
    }

    setShowAlertModal(false);
    setNewAlert({ sector: 'All', country: 'All', minGoal: 0 });
  };

  const handleRemoveAlert = (id: string) => {
    const updated = dbService.deleteAlert(id);
    setAlerts(updated);
  };

  const clearFilters = () => {
    setSectorFilter('All');
    setCountryFilter('All');
    setSearchQuery('');
  };

  const hasActiveFilters = sectorFilter !== 'All' || countryFilter !== 'All' || searchQuery !== '';

  return (
    <div className="flex flex-col xl:flex-row gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Main Content Pane */}
      <div className="flex-1 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-gray-900 tracking-tight">Market <span className="text-[#2E7D32]">Registry</span></h1>
            <p className="text-gray-500 font-medium text-lg">Institutional-grade opportunities curated for the global diaspora.</p>
          </div>
          <div className="flex bg-white border rounded-2xl p-1 shadow-sm h-fit">
            {['USD', 'GHS', 'NGN'].map(curr => (
              <button key={curr} onClick={() => setCurrency(curr)} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${currency === curr ? 'bg-[#2E7D32] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>
                {curr}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Global Controls */}
        <div className="bg-white p-8 rounded-[3rem] border shadow-sm space-y-8">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#2E7D32] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search registry by project name, nation, or sector focus..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full bg-gray-50 border border-transparent rounded-[2rem] pl-16 pr-8 py-5 focus:bg-white focus:border-[#2E7D32]/20 outline-none transition-all font-bold text-gray-800 shadow-inner placeholder:text-gray-300" 
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <SearchableDropdown 
              label="Asset Sector"
              options={sectors}
              selected={sectorFilter}
              onSelect={setSectorFilter}
              placeholder="Filter sector..."
              icon={<TrendingUp size={16} />}
            />
            <SearchableDropdown 
              label="Target Nation"
              options={countries}
              selected={countryFilter}
              onSelect={setCountryFilter}
              placeholder="Search nation..."
              icon={<Globe size={16} />}
            />
            <div className="flex-1">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 mb-2 block">Priority Sort</label>
              <div className="relative">
                <ArrowUpDown className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <select 
                  value={sortOption} 
                  onChange={(e) => setSortOption(e.target.value as SortOption)} 
                  className="w-full bg-white border border-gray-100 rounded-2xl pl-16 pr-6 py-[1.125rem] font-bold text-sm outline-none cursor-pointer hover:bg-gray-50 transition-all appearance-none text-gray-900 shadow-sm"
                >
                  <option value="newest">Latest Entry</option>
                  <option value="progress-high">Completion Progress</option>
                  <option value="goal-high">Valuation: High to Low</option>
                  <option value="goal-low">Valuation: Low to High</option>
                  <option value="title">Project Identity (A-Z)</option>
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={16} />
              </div>
            </div>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="self-end px-6 py-4 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100">
                Reset
              </button>
            )}
          </div>
        </div>

        {/* AI Brief Bar */}
        <div className="bg-[#1B5E20] p-8 rounded-[3rem] text-white relative overflow-hidden shadow-xl">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
           <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 border border-white/20">
                <Zap size={28} className="text-[#FFD700]" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-black uppercase tracking-widest text-green-200">Sector Intelligence Brief</h3>
                  <span className="text-[8px] bg-[#FFD700] text-[#1B5E20] px-3 py-0.5 rounded-full uppercase font-black">Live</span>
                </div>
                <div className="text-base font-medium text-white/90 italic leading-relaxed">
                  {loadingInsights ? <Loader2 size={16} className="animate-spin" /> : insights}
                </div>
              </div>
           </div>
        </div>

        {/* Projects Grid */}
        {filteredAndSorted.length === 0 ? (
          <div className="bg-white p-24 rounded-[3rem] border border-dashed border-gray-200 text-center space-y-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-900">No Matching Assets</h3>
            <button onClick={clearFilters} className="px-10 py-4 bg-[#2E7D32] text-white rounded-2xl font-black text-xs uppercase tracking-widest">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredAndSorted.map((inv) => (
              <div key={inv.id} className="bg-white rounded-[3.5rem] overflow-hidden border shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col">
                <div 
                  className="h-64 relative overflow-hidden cursor-pointer"
                  onClick={() => setSelectedProject(inv)}
                >
                  <img src={inv.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" />
                  <div className="absolute top-8 left-8 flex flex-col gap-2">
                    <span className="bg-[#FFD700] text-[#2E7D32] text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl">{inv.type}</span>
                    <span className="bg-white text-gray-900 text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-2">
                      <MapPin size={10} className="text-[#2E7D32]" /> {inv.country}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-md px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-[#2E7D32] shadow-2xl flex items-center gap-3">
                      <Layers size={16} /> View Full Ledger
                    </div>
                  </div>
                </div>
                <div className="p-10 space-y-8 flex-1 flex flex-col">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-gray-900 group-hover:text-[#2E7D32] transition-colors leading-tight">{inv.title}</h3>
                    <p className="text-gray-500 text-sm font-medium line-clamp-2 leading-relaxed">{inv.description}</p>
                  </div>
                  
                  <div className="space-y-4 pt-2">
                     <div className="flex justify-between items-end">
                        <p className="text-[9px] font-black uppercase text-gray-400 tracking-[0.3em]">Capital Committed</p>
                        <p className="text-2xl font-black text-gray-900">{convert(inv.currentFunding)}</p>
                     </div>
                     <div className="relative h-2.5 bg-gray-50 rounded-full overflow-hidden border p-0.5">
                        <div 
                          style={{ width: `${(inv.currentFunding/inv.fundingGoal)*100}%` }} 
                          className="h-full bg-gradient-to-r from-[#2E7D32] to-[#A5D6A7] rounded-full transition-all duration-1500"
                        ></div>
                     </div>
                     <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-400">
                        <span className="text-[#2E7D32]">{Math.round((inv.currentFunding/inv.fundingGoal)*100)}% Subscribed</span>
                        <span>Target: {convert(inv.fundingGoal)}</span>
                     </div>
                  </div>

                  <div className="pt-6 mt-auto grid grid-cols-1 gap-3">
                     <button 
                      onClick={() => setSelectedProject(inv)} 
                      className="w-full py-4 bg-gray-50 text-[#2E7D32] rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-green-50 transition-all flex items-center justify-center gap-3 border border-transparent hover:border-[#2E7D32]/10"
                     >
                       <Info size={14} /> View Details
                     </button>
                     <button 
                        onClick={() => onInvest(inv, 5000)} 
                        className="w-full py-5 bg-[#2E7D32] text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-green-900/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                      >
                        Commit Capital <ChevronRight size={14} />
                      </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Intelligence Sidebar (Dedicated Notification Area) */}
      <aside className="w-full xl:w-96 space-y-8">
        {/* Alerts Control Panel */}
        <div className="bg-white p-8 rounded-[3rem] border shadow-sm space-y-8 sticky top-24">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-[#2E7D32] rounded-2xl flex items-center justify-center shadow-inner">
                <BrainCircuit size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 leading-none">Intelligence</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase mt-1.5 tracking-widest">Active Tracking</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAlertModal(true)}
              className="p-3 bg-gray-50 text-gray-400 hover:text-[#2E7D32] hover:bg-green-50 rounded-xl transition-all"
            >
              <Settings size={18} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Matching Assets</h3>
              <span className="text-[10px] bg-red-500 text-white px-2.5 py-0.5 rounded-full font-black animate-pulse">
                {matchedInvestments.length}
              </span>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-hide">
              {matchedInvestments.length === 0 ? (
                <div className="p-10 border-2 border-dashed border-gray-100 rounded-[2.5rem] text-center space-y-4">
                  <Bell size={24} className="mx-auto text-gray-200" />
                  <p className="text-xs font-bold text-gray-400 leading-relaxed">No assets currently match your active intelligence rules.</p>
                  <button 
                    onClick={() => setShowAlertModal(true)}
                    className="text-[10px] font-black uppercase text-[#2E7D32] hover:underline"
                  >
                    Deploy New Rule
                  </button>
                </div>
              ) : (
                matchedInvestments.map(inv => (
                  <div 
                    key={inv.id}
                    onClick={() => setSelectedProject(inv)}
                    className="p-5 bg-gray-50 rounded-[2rem] border border-transparent hover:border-green-100 hover:bg-white hover:shadow-xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white shadow-sm shrink-0">
                        <img src={inv.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-gray-900 truncate group-hover:text-[#2E7D32] transition-colors">{inv.title}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight mt-0.5 flex items-center gap-1.5">
                          <MapPin size={8} className="text-[#2E7D32]" /> {inv.country} • {inv.type}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                           <span className="text-[9px] font-black text-[#2E7D32] uppercase tracking-widest flex items-center gap-1">
                             View Insight <ArrowUpRight size={10} />
                           </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-8 border-t space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Active Rules</h3>
              <span className="text-[9px] text-gray-400 font-bold">{alerts.length} Deployed</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {alerts.map(a => (
                <div key={a.id} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border rounded-lg group">
                  <span className="text-[9px] font-black text-gray-600 uppercase">{a.sector} in {a.country}</span>
                  <button onClick={() => handleRemoveAlert(a.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                    <X size={10} />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => setShowAlertModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-[#2E7D32] rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-green-100 transition-all"
              >
                <Plus size={10} /> New Rule
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Asset Detail Modal */}
      {selectedProject && (
        <InvestmentModal 
          investment={selectedProject} 
          onClose={() => setSelectedProject(null)} 
          onInvest={onInvest}
          currency={currency}
        />
      )}

      {/* Intelligence Alert Configuration Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 z-[800] flex items-center justify-center p-6 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="bg-[#F9FAFB] w-full max-w-2xl rounded-[4rem] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-500 border border-white/20">
            <div className="p-10 pb-8 flex justify-between items-center border-b bg-white">
               <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-green-50 text-[#2E7D32] rounded-[2rem] flex items-center justify-center shadow-inner">
                    <Bell size={32} />
                 </div>
                 <div>
                    <h2 className="text-3xl font-black text-gray-900 leading-none">Intelligence Rules</h2>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-2">Deploy Automated Market Tracking</p>
                 </div>
               </div>
               <button 
                onClick={() => setShowAlertModal(false)} 
                className="p-5 bg-gray-50 rounded-full hover:bg-gray-100 transition-all text-gray-400 hover:text-gray-900"
               >
                 <X size={28} />
               </button>
            </div>
            
            <div className="p-10 space-y-12 overflow-y-auto max-h-[70vh] scrollbar-hide">
               <div className="bg-white p-10 rounded-[3rem] border shadow-2xl space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 text-gray-50/30"><BrainCircuit size={100} /></div>
                  <div className="relative z-10 space-y-8">
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-50 text-[#2E7D32] flex items-center justify-center"><Plus size={16} /></div>
                      Define Tracking Parameter
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Asset Sector</label>
                         <div className="relative">
                           <TrendingUp className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                           <select 
                            value={newAlert.sector} 
                            onChange={(e) => setNewAlert({...newAlert, sector: e.target.value})}
                            className="w-full bg-gray-50 border rounded-xl pl-12 pr-6 py-4 font-bold text-sm outline-none cursor-pointer hover:bg-gray-100 transition-all appearance-none"
                           >
                            {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                           </select>
                           <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Target Nation</label>
                         <div className="relative">
                           <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                           <select 
                            value={newAlert.country} 
                            onChange={(e) => setNewAlert({...newAlert, country: e.target.value})}
                            className="w-full bg-gray-50 border rounded-xl pl-12 pr-6 py-4 font-bold text-sm outline-none cursor-pointer hover:bg-gray-100 transition-all appearance-none"
                           >
                            {countries.map(c => <option key={c} value={c}>{c}</option>)}
                           </select>
                           <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                         </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Min. Entry Valuation ($)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-[#2E7D32]" size={18} />
                        <input 
                          type="number" 
                          placeholder="e.g. 100,000"
                          value={newAlert.minGoal || ''}
                          onChange={(e) => setNewAlert({...newAlert, minGoal: Number(e.target.value)})}
                          className="w-full bg-gray-50 border rounded-xl pl-12 pr-6 py-4 font-bold text-sm outline-none focus:ring-4 focus:ring-[#2E7D32]/10 transition-all"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={handleAddAlert} 
                      className="w-full py-5 bg-[#2E7D32] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                      Deploy Automated Auditor
                    </button>
                  </div>
               </div>

               <div className="space-y-6">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Active Intelligence Rules</h3>
                 {alerts.length === 0 ? (
                   <div className="p-12 border-2 border-dashed border-gray-100 rounded-[2.5rem] text-center bg-white/50">
                     <p className="text-gray-400 font-bold text-sm">No rules established.</p>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 gap-3">
                     {alerts.map(a => (
                       <div key={a.id} className="group relative flex items-center justify-between p-6 bg-white rounded-2xl border shadow-sm transition-all hover:shadow-lg">
                         <div className="flex items-center gap-6">
                            <div className="space-y-1">
                               <p className="text-base font-black text-gray-900 leading-none">{a.sector === 'All' ? 'Global Sectors' : a.sector}</p>
                               <div className="flex items-center gap-2 text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1">
                                  <Globe size={10} className="text-[#2E7D32]" /> {a.country === 'All' ? 'Pan-African' : a.country}
                               </div>
                            </div>
                            <div className="h-8 w-px bg-gray-100"></div>
                            <div>
                               <p className="text-[8px] font-black uppercase text-gray-300 tracking-widest mb-0.5">Threshold</p>
                               <p className="text-sm font-black text-[#2E7D32]">${a.minGoal.toLocaleString()}+</p>
                            </div>
                         </div>
                         <button 
                          onClick={() => handleRemoveAlert(a.id)} 
                          className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                         >
                           <Trash2 size={16} />
                         </button>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
            </div>

            <div className="p-8 bg-gray-50 border-t flex items-center justify-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
                <ShieldCheck size={16} className="text-[#2E7D32]" /> Institutional Grade Matching Protocol
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investments;
