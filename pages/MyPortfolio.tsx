
import React, { useState, useMemo } from 'react';
import { UserInvestment } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend } from 'recharts';
import { Briefcase, TrendingUp, ArrowUpRight, Clock, MapPin, DollarSign, Wallet, PieChart as PieIcon, CheckCircle2, Circle, ArrowDownRight, LayoutGrid, List, Layers, Globe } from 'lucide-react';

interface MyPortfolioProps {
  investments: UserInvestment[];
}

const PERFORMANCE_DATA = [
  { month: 'Jan', value: 10000, projected: 10000 },
  { month: 'Feb', value: 10200, projected: 10300 },
  { month: 'Mar', value: 10800, projected: 10700 },
  { month: 'Apr', value: 11500, projected: 11200 },
  { month: 'May', value: 12100, projected: 11800 },
  { month: 'Jun', value: 12500, projected: 12400 },
];

const COLORS = ['#2E7D32', '#FFD700', '#1B5E20', '#A5D6A7', '#FBC02D'];

const MyPortfolio: React.FC<MyPortfolioProps> = ({ investments }) => {
  const [activeView, setActiveView] = useState<'overview' | 'analytics'>('overview');
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amountInvested, 0);
  const totalReturns = investments.reduce((sum, inv) => sum + inv.returnsEarned, 0);

  const sectorAllocation = useMemo(() => {
    const counts: Record<string, number> = {};
    investments.forEach(inv => {
      counts[inv.type] = (counts[inv.type] || 0) + inv.amountInvested;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [investments]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Continental <span className="text-[#2E7D32]">Assets</span></h1>
          <p className="text-gray-500 mt-2 font-medium text-lg">Real-time performance tracking of your African holdings.</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border shadow-xl">
          <button 
            onClick={() => setActiveView('overview')}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeView === 'overview' ? 'bg-[#2E7D32] text-white shadow-lg scale-105' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Snapshot
          </button>
          <button 
            onClick={() => setActiveView('analytics')}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeView === 'analytics' ? 'bg-[#2E7D32] text-white shadow-lg scale-105' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Deep Analytics
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border group hover:shadow-2xl transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 text-[#2E7D32]/5"><Wallet size={120} /></div>
          <div className="relative z-10 space-y-8">
            <div className={`w-14 h-14 flex items-center justify-center bg-green-50 text-[#2E7D32] rounded-[1.5rem] group-hover:scale-110 transition-transform shadow-inner`}>
              <DollarSign size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-2">Aggregate Equity</p>
              <p className="text-5xl font-black text-gray-900">${(totalInvested + totalReturns).toLocaleString()}</p>
              <div className="flex items-center gap-2 text-sm font-black text-green-600 mt-3">
                <ArrowUpRight size={18} /> +12.4% Net Yield
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-sm border group hover:shadow-2xl transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 text-yellow-600/5"><TrendingUp size={120} /></div>
          <div className="relative z-10 space-y-8">
            <div className={`w-14 h-14 flex items-center justify-center bg-yellow-50 text-yellow-600 rounded-[1.5rem] group-hover:scale-110 transition-transform shadow-inner`}>
              <TrendingUp size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-2">Realized Gains</p>
              <p className="text-5xl font-black text-gray-900">${totalReturns.toLocaleString()}</p>
              <div className="flex items-center gap-2 text-sm font-black text-gray-400 mt-3">
                <Clock size={16} /> Disbursed Monthly
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-sm border group hover:shadow-2xl transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 text-blue-600/5"><Globe size={120} /></div>
          <div className="relative z-10 space-y-8">
            <div className={`w-14 h-14 flex items-center justify-center bg-blue-50 text-blue-600 rounded-[1.5rem] group-hover:scale-110 transition-transform shadow-inner`}>
              <PieIcon size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-2">Market Reach</p>
              <p className="text-5xl font-black text-gray-900">{investments.length}</p>
              <div className="flex items-center gap-2 text-sm font-black text-gray-400 mt-3">
                <Layers size={16} /> Across {new Set(investments.map(i => i.country)).size} Nations
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeView === 'analytics' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500">
          {/* Performance Area Chart */}
          <div className="bg-white p-12 rounded-[4rem] border shadow-sm space-y-10">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-gray-900">Yield Performance</h3>
                <p className="text-sm text-gray-400 font-medium">Monthly equity valuation tracking.</p>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PERFORMANCE_DATA}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={10} fontWeight="black" />
                  <YAxis axisLine={false} tickLine={false} fontSize={10} fontWeight="black" />
                  <Tooltip 
                    contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'}} 
                    labelStyle={{fontWeight: 'black', marginBottom: '8px'}}
                  />
                  <Area type="monotone" dataKey="value" stroke="#2E7D32" strokeWidth={5} fillOpacity={1} fill="url(#colorValue)" />
                  <Area type="monotone" dataKey="projected" stroke="#FFD700" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Allocation Pie Chart */}
          <div className="bg-white p-12 rounded-[4rem] border shadow-sm space-y-10">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-gray-900">Sector Allocation</h3>
                <p className="text-sm text-gray-400 font-medium">Diversification across African markets.</p>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectorAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {sectorAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'}} 
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[4rem] border shadow-sm p-12 space-y-16">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">Project Verification Status</h3>
              <p className="text-gray-500 font-medium">Live milestone tracking for all active holdings.</p>
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 text-[10px] font-black text-[#2E7D32] uppercase tracking-[0.2em] border-2 border-[#2E7D32]/10 px-6 py-3 rounded-2xl hover:bg-green-50 transition-all">
                Audit Trail <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
          
          <div className="space-y-20">
            {investments.map((inv) => (
              <div key={inv.id} className="space-y-10 animate-in fade-in slide-in-from-left-6 duration-500">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                  <div className="flex items-center gap-8">
                    <div className="w-24 h-24 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white rotate-3 hover:rotate-0 transition-all duration-500">
                      <img src={inv.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-2xl font-black text-gray-900 tracking-tight">{inv.title}</h4>
                      <div className="flex flex-wrap gap-4">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                          <MapPin size={12} className="text-[#2E7D32]" /> {inv.location}
                        </p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                          <Layers size={12} className="text-[#FFD700]" /> {inv.type}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#F9FAFB] px-10 py-5 rounded-[2.5rem] border shadow-inner text-right min-w-[200px]">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Committed Stake</p>
                    <p className="text-3xl font-black text-[#2E7D32]">${inv.amountInvested.toLocaleString()}</p>
                  </div>
                </div>

                <div className="relative px-8">
                  <div className="absolute top-6 left-12 right-12 h-1 bg-gray-100 -z-10 rounded-full"></div>
                  <div className="flex justify-between items-start">
                    {(inv.milestones || []).map((m, idx) => (
                      <div key={m.id} className="flex flex-col items-center gap-4 relative group">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 shadow-xl scale-100 group-hover:scale-110 ${m.status === 'Completed' ? 'bg-[#2E7D32] text-white' : m.status === 'In-Progress' ? 'bg-[#FFD700] text-[#2E7D32] animate-pulse' : 'bg-white border-4 border-gray-50 text-gray-200'}`}>
                          {m.status === 'Completed' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                        </div>
                        <div className="text-center w-32 space-y-1">
                          <p className={`text-[10px] font-black uppercase tracking-tighter leading-tight ${m.status === 'Completed' ? 'text-[#2E7D32]' : 'text-gray-400'}`}>{m.label}</p>
                          {m.date && <p className="text-[8px] text-gray-300 font-black uppercase tracking-widest">{m.date}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPortfolio;
