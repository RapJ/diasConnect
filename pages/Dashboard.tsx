
import React, { useState } from 'react';
import { UserRole, Investment, Tour, Transaction, SupportRecord } from '../types';
import AfricaMap from '../components/AfricaMap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Map as MapIcon, 
  Heart, 
  ArrowUpRight, 
  Calendar,
  DollarSign,
  ChevronRight,
  Loader2,
  FileDown
} from 'lucide-react';

interface DashboardProps {
  role: UserRole;
  investments: Investment[];
  tours: Tour[];
  transactions: Transaction[];
  support: SupportRecord[];
  onViewAllActivity?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ role, investments, tours, transactions, support, onViewAllActivity }) => {
  const isAdmin = role === UserRole.ADMIN;
  const [isGenerating, setIsGenerating] = useState(false);

  // Dynamic Data
  const totalFunding = investments.reduce((acc, curr) => acc + curr.currentFunding, 0);
  const totalTransactions = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  const chartData = [
    { name: 'Jan', value: 4200 },
    { name: 'Feb', value: 3800 },
    { name: 'Mar', value: totalTransactions * 0.4 },
    { name: 'Apr', value: totalTransactions * 0.6 },
    { name: 'May', value: totalTransactions * 0.8 },
  ];

  const stats = isAdmin ? [
    { label: 'Total Managed', value: `$${(totalFunding / 1000000).toFixed(1)}M`, icon: TrendingUp, color: 'bg-green-100 text-green-600' },
    { label: 'Platform Transactions', value: `$${(totalTransactions / 1000).toFixed(0)}K`, icon: DollarSign, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Network Size', value: '1,248', icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Active Missions', value: tours.length.toString(), icon: Calendar, color: 'bg-red-100 text-red-600' },
  ] : [
    { label: 'Invested Capital', value: '$12,500', icon: TrendingUp, color: 'bg-green-100 text-green-600' },
    { label: 'Impact Contributions', value: '$850', icon: Heart, color: 'bg-red-100 text-red-600' },
    { label: 'Trips Booked', value: '2', icon: Calendar, color: 'bg-blue-100 text-blue-600' },
    { label: 'Realized Gains', value: '$120', icon: DollarSign, color: 'bg-yellow-100 text-yellow-600' },
  ];

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert('Your impact report (PDF) for Q2 2024 has been generated and is ready for download in your notifications.');
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            {isAdmin ? 'System Intelligence' : 'Your African Legacy'}
          </h1>
          <p className="text-gray-500 mt-1 font-medium">Tracking prosperity and impact across the continent.</p>
        </div>
        <button 
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="bg-[#2E7D32] text-white px-8 py-3 rounded-[1.5rem] text-sm font-black shadow-xl shadow-green-900/10 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70 flex items-center gap-3"
        >
          {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} />}
          {isGenerating ? 'Analyzing...' : 'Generate Q2 Report'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2rem] border shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between">
              <div className={`p-4 rounded-2xl ${s.color} group-hover:scale-110 transition-transform`}>
                <s.icon size={24} />
              </div>
              <span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest">+12.4%</span>
            </div>
            <div className="mt-6">
              <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest">{s.label}</h3>
              <p className="text-3xl font-black text-gray-900 mt-1">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border shadow-sm">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-black text-gray-900">Economic Participation</h3>
             <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-[#2E7D32]"></span>
                <span className="w-3 h-3 rounded-full bg-[#FFD700]"></span>
             </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} fontWeight="bold" />
                <YAxis axisLine={false} tickLine={false} fontSize={10} fontWeight="bold" />
                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#FFD700' : '#2E7D32'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
          <h3 className="text-xl font-black text-gray-900 mb-6">Recent Log</h3>
          <div className="space-y-4">
            {transactions.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${t.type === 'Investment' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                    {t.type === 'Investment' ? <TrendingUp size={18} /> : <MapIcon size={18} />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.type}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{t.date}</p>
                  </div>
                </div>
                <p className="font-black text-sm text-gray-900">${t.amount}</p>
              </div>
            ))}
          </div>
          <button onClick={onViewAllActivity} className="w-full mt-8 py-4 text-sm font-black text-[#2E7D32] border-2 border-[#2E7D32]/10 rounded-2xl hover:bg-[#2E7D32]/5 transition-all flex items-center justify-center gap-2">
            Audit Full History <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border shadow-sm">
        <div className="flex justify-between items-center mb-10">
           <div>
              <h3 className="text-2xl font-black text-gray-900">The Impact Map</h3>
              <p className="text-sm text-gray-400 font-medium">Visualizing your contribution and investments across the African continent.</p>
           </div>
           <div className="hidden sm:flex gap-3">
              <span className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 bg-gray-50 px-4 py-2 rounded-full border">
                 <span className="w-2 h-2 rounded-full bg-[#2E7D32]"></span> Projects
              </span>
              <span className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 bg-gray-50 px-4 py-2 rounded-full border">
                 <span className="w-2 h-2 rounded-full bg-[#FFD700]"></span> Missions
              </span>
           </div>
        </div>
        <AfricaMap projects={[...investments, ...tours]} />
      </div>
    </div>
  );
};

export default Dashboard;
