
import React, { useState, useEffect } from 'react';
import { Investment } from '../types';
import { 
  X, 
  MapPin, 
  Globe, 
  Check, 
  Activity, 
  Zap, 
  Loader2, 
  ShieldCheck, 
  TrendingUp, 
  Target,
  BarChart3,
  Calendar,
  ChevronRight,
  Info,
  PieChart as PieIcon,
  ArrowUpRight,
  Lock
} from 'lucide-react';
import { getDetailedAnalysis } from '../services/geminiService';
import { EXCHANGE_RATES } from '../constants';

interface InvestmentModalProps {
  investment: Investment;
  onClose: () => void;
  onInvest: (inv: Investment, amount: number) => void;
  currency: string;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({ investment, onClose, onInvest, currency }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      const res = await getDetailedAnalysis(investment.title, investment.type, investment.location);
      setAnalysis(res);
      setLoading(false);
    };
    fetchAnalysis();
  }, [investment]);

  const convert = (amount: number) => {
    const rate = EXCHANGE_RATES[currency] || 1;
    return (amount * rate).toLocaleString(undefined, {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    });
  };

  const progress = (investment.currentFunding / investment.fundingGoal) * 100;
  
  // Mock financial metrics based on sector
  const financialMetrics = {
    irr: investment.type === 'Tech' ? '22%' : investment.type === 'Agriculture' ? '14%' : '9%',
    payback: investment.type === 'Tech' ? '3 Years' : investment.type === 'Agriculture' ? '5 Years' : '10 Years',
    risk: investment.type === 'Infrastructure' ? 'Low' : 'Medium',
    liquidity: 'Secondary Market (Q4 2024)'
  };

  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-[#F9FAFB] w-full max-w-6xl h-full max-h-[92vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-500 border border-white/20">
        
        {/* Fixed Header */}
        <div className="p-6 sm:p-8 md:px-10 border-b bg-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-[#2E7D32] shadow-inner">
              <BarChart3 size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">{investment.title}</h2>
                <span className="hidden sm:block bg-green-100 text-[#2E7D32] text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-green-200">Tier 1 Asset</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest mt-1.5">
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#2E7D32]" /> {investment.location}</span>
                <span className="flex items-center gap-1.5"><Globe size={14} className="text-[#2E7D32]" /> {investment.country}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-4 bg-gray-50 rounded-full hover:bg-gray-100 transition-all text-gray-400 hover:text-gray-900 group"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 md:p-10 space-y-12 scrollbar-hide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            
            {/* Left Column: Narrative & Roadmap */}
            <div className="lg:col-span-7 space-y-12">
              <div className="relative h-80 md:h-[450px] rounded-[3.5rem] overflow-hidden shadow-2xl border-8 border-white group">
                <img src={investment.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-10 right-10 flex justify-between items-end">
                  <div className="space-y-3">
                    <span className="inline-block bg-[#FFD700] text-[#2E7D32] text-[10px] font-black px-6 py-2.5 rounded-full uppercase tracking-widest shadow-xl">{investment.type} Sector Focus</span>
                    <h3 className="text-white font-black text-xl flex items-center gap-2">
                      <ShieldCheck className="text-[#FFD700]" size={20} /> Verified Contribution Target
                    </h3>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center min-w-[80px]">
                      <p className="text-[8px] font-black text-white/60 uppercase tracking-tighter">Growth</p>
                      <p className="text-sm font-black text-white">{financialMetrics.irr}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 md:p-12 rounded-[4rem] border shadow-sm space-y-8">
                <div className="flex items-center gap-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Market Narrative</h3>
                  <div className="h-px flex-1 bg-gray-100"></div>
                </div>
                <p className="text-xl text-gray-600 leading-relaxed font-medium">
                  {investment.description} This strategic venture focuses on driving long-term economic stability and technological advancement within the region, providing a foundation for scalable growth and community empowerment through direct diaspora involvement.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-3xl border border-transparent hover:border-gray-200 transition-all">
                    <div className="p-3 bg-white rounded-2xl text-[#2E7D32] shadow-sm"><PieIcon size={20} /></div>
                    <div>
                      <p className="text-xs font-black text-gray-900 uppercase">Impact Score</p>
                      <p className="text-sm text-gray-500 font-medium">9.2/10 Regional Stability</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-3xl border border-transparent hover:border-gray-200 transition-all">
                    <div className="p-3 bg-white rounded-2xl text-[#FFD700] shadow-sm"><Activity size={20} /></div>
                    <div>
                      <p className="text-xs font-black text-gray-900 uppercase">Employment</p>
                      <p className="text-sm text-gray-500 font-medium">150+ Direct Local Jobs</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 md:p-12 rounded-[4rem] border shadow-sm space-y-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Execution Roadmap</h3>
                  <span className="text-[9px] font-black uppercase tracking-widest bg-gray-50 text-gray-400 px-4 py-1.5 rounded-full border">Quarterly Verification</span>
                </div>
                <div className="space-y-10 relative pl-10">
                  <div className="absolute left-[59px] top-4 bottom-4 w-1 bg-gray-50 rounded-full"></div>
                  {(investment.milestones || []).map((m, idx) => (
                    <div key={m.id} className="flex items-start gap-10 relative">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 shadow-xl transition-all duration-500 ${m.status === 'Completed' ? 'bg-[#2E7D32] text-white' : m.status === 'In-Progress' ? 'bg-[#FFD700] text-[#2E7D32] animate-pulse' : 'bg-white border-4 border-gray-100 text-gray-200'}`}>
                        {m.status === 'Completed' ? <Check size={24} /> : <div className="w-2 h-2 rounded-full bg-current"></div>}
                      </div>
                      <div className="space-y-1.5 pt-1">
                        <p className={`text-xl font-black leading-tight ${m.status === 'Completed' ? 'text-gray-900' : 'text-gray-400'}`}>{m.label}</p>
                        <div className="flex items-center gap-4">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${m.status === 'Completed' ? 'bg-green-50 text-[#2E7D32]' : 'bg-gray-50 text-gray-400'}`}>{m.status}</span>
                          {m.date && <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5"><Calendar size={12} /> {m.date}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Financials & AI Insights */}
            <div className="lg:col-span-5 space-y-10">
              {/* Financial Analysis Card */}
              <div className="bg-[#1B5E20] p-10 md:p-12 rounded-[4rem] text-white shadow-2xl space-y-10 sticky top-10">
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-green-300">Capital Subscription</p>
                  <div className="flex items-end gap-3">
                    <span className="text-6xl font-black tracking-tighter">{convert(investment.currentFunding)}</span>
                    <span className="text-green-300 text-sm font-bold mb-3">/ {convert(investment.fundingGoal)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-4 bg-white/10 rounded-full overflow-hidden border border-white/5 p-1">
                    <div style={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-[#FFD700] via-yellow-200 to-white shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all duration-1500 ease-out rounded-full"></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-green-200">
                    <span className="flex items-center gap-2"><ArrowUpRight size={14} /> {progress.toFixed(1)}% Funded</span>
                    <span>Target: {convert(investment.fundingGoal)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Target Yield (IRR)', val: financialMetrics.irr },
                    { label: 'Payback Period', val: financialMetrics.payback },
                    { label: 'Risk Rating', val: financialMetrics.risk },
                    { label: 'Liquidity', val: 'High (Exit Ready)' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                      <p className="text-[8px] font-black uppercase tracking-widest text-green-200 mb-1.5">{stat.label}</p>
                      <p className="text-xl font-black">{stat.val}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-8 border-t border-white/10">
                  <div className="flex gap-4">
                    <button 
                      onClick={() => onInvest(investment, 5000)}
                      className="flex-1 py-5 bg-[#FFD700] text-[#1B5E20] rounded-[2rem] text-xs font-black uppercase tracking-widest hover:scale-[1.03] active:scale-95 transition-all shadow-xl shadow-yellow-900/20"
                    >
                      Commit $5k Capital
                    </button>
                    <button 
                      onClick={() => onInvest(investment, 1000)}
                      className="px-8 py-5 bg-white/10 border border-white/20 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all"
                    >
                      $1k
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-[9px] text-green-300/60 font-black uppercase tracking-[0.2em]">
                    <Lock size={12} /> ESCROW SECURED PROTOCOL
                  </div>
                </div>
              </div>

              {/* AI Deep Insights Section */}
              <div className="bg-white rounded-[4rem] border shadow-sm overflow-hidden flex flex-col group/ai">
                <div className="p-8 border-b flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FFD700]/20 rounded-xl flex items-center justify-center text-[#2E7D32]">
                      <Zap size={20} className="group-hover/ai:animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900 leading-none">Intelligence Report</h4>
                      <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">Real-time Analysis by Gemini</p>
                    </div>
                  </div>
                  {loading && <Loader2 className="animate-spin text-[#2E7D32]" size={20} />}
                </div>
                <div className="p-8 md:p-10 bg-gradient-to-b from-white to-gray-50/30">
                  {loading ? (
                    <div className="space-y-6 animate-pulse">
                      <div className="h-4 bg-gray-100 rounded-full w-3/4"></div>
                      <div className="h-4 bg-gray-100 rounded-full w-full"></div>
                      <div className="h-4 bg-gray-100 rounded-full w-2/3"></div>
                      <div className="h-32 bg-gray-50 rounded-[2rem] w-full"></div>
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-line text-gray-600 font-medium leading-relaxed bg-white p-8 rounded-[2.5rem] border shadow-inner">
                        {analysis}
                      </div>
                      <div className="mt-8 flex items-center gap-3 p-5 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                        <Info className="text-blue-500 shrink-0" size={20} />
                        <p className="text-[10px] text-blue-700 font-bold uppercase tracking-tight">This analysis considers current market volatility and regional GDP growth projections.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Fixed Actions */}
        <div className="p-8 bg-white border-t flex flex-col sm:flex-row items-center justify-between gap-6 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1,2,3].map(i => (
                <img key={i} src={`https://picsum.photos/seed/user${i}/100`} className="w-10 h-10 rounded-full border-2 border-white shadow-lg" alt="" />
              ))}
            </div>
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest">
              Join 124 other institutional investors
            </p>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <button 
              onClick={onClose}
              className="flex-1 sm:flex-none px-12 py-5 bg-gray-50 text-gray-500 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
            >
              Close Ledger
            </button>
            <button 
              onClick={() => onInvest(investment, 10000)}
              className="flex-1 sm:flex-none px-12 py-5 bg-[#2E7D32] text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              Large Entry ($10k) <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentModal;
