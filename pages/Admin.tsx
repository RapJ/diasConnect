
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  Search, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  FileText, 
  BarChart3, 
  ArrowUpRight, 
  AlertCircle,
  Settings,
  Database,
  RefreshCw,
  Edit,
  Trash2,
  Lock,
  History,
  ShieldAlert,
  Fingerprint
} from 'lucide-react';
import { dbService } from '../services/dbService';
import { User, Investment, SupportRecord, UserRole, ActivityLog } from '../types';

const Admin: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'users' | 'assets' | 'security'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');

  const refreshData = async () => {
    setIsLoading(true);
    const [u, i, l] = await Promise.all([
      dbService.getUsers(),
      dbService.getInvestments(),
      dbService.getAuditLogs()
    ]);
    setUsers(u);
    setInvestments(i);
    setLogs(l);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleKYCUpdate = async (id: string, status: any) => {
    await dbService.updateKYC(id, status);
    refreshData();
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Continental <span className="text-[#2E7D32]">Admin</span></h1>
          <p className="text-gray-500 font-medium">Governance, assets, and platform security oversight.</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border shadow-xl">
          {(['overview', 'users', 'assets', 'security'] as const).map(t => (
            <button 
              key={t}
              onClick={() => setActiveSubTab(t)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === t ? 'bg-[#2E7D32] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {t}
            </button>
          ))}
          <button onClick={refreshData} className="p-2.5 text-gray-400 hover:text-[#2E7D32]">
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { label: 'Active Capital', val: '$12.4M', icon: TrendingUp, color: 'text-green-600 bg-green-50' },
             { label: 'Network Size', val: users.length, icon: Users, color: 'text-blue-600 bg-blue-50' },
             { label: 'Verified Assets', val: '100%', icon: ShieldCheck, color: 'text-yellow-600 bg-yellow-50' },
             { label: 'Security Health', val: 'Optimal', icon: Lock, color: 'text-purple-600 bg-purple-50' },
           ].map((s, idx) => (
             <div key={idx} className="bg-white p-8 rounded-[2.5rem] border shadow-sm group hover:shadow-xl transition-all">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${s.color}`}>
                  <s.icon size={24} />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                <p className="text-3xl font-black text-gray-900 mt-1">{s.val}</p>
             </div>
           ))}
        </div>
      )}

      {activeSubTab === 'users' && (
        <div className="bg-white rounded-[4rem] border shadow-sm overflow-hidden">
          <div className="p-8 border-b bg-gray-50/50 flex justify-between items-center">
            <h3 className="text-xl font-black text-gray-900">Member Registry</h3>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
              <input type="text" placeholder="Search identity..." className="pl-12 pr-4 py-2 border rounded-xl outline-none w-64" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b">
                <tr>
                  <th className="px-10 py-6">Identity</th>
                  <th className="px-10 py-6">KYC Status</th>
                  <th className="px-10 py-6">Auth Role</th>
                  <th className="px-10 py-6 text-right">Sanctions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50/50">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <img src={u.avatar} className="w-10 h-10 rounded-full border" alt="" />
                        <div>
                          <p className="font-bold text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${u.kycStatus === 'Verified' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-yellow-50 text-yellow-600 border-yellow-200'}`}>
                          {u.kycStatus}
                        </span>
                        {u.kycStatus === 'Pending' && (
                          <button onClick={() => handleKYCUpdate(u.id, 'Verified')} className="text-[#2E7D32] hover:underline font-bold text-[10px] uppercase">Approve</button>
                        )}
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-[10px] font-black uppercase text-gray-500">{u.role}</span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button className="text-red-400 hover:text-red-600 font-black text-[10px] uppercase">Suspend</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'security' && (
        <div className="space-y-8 animate-in zoom-in-95">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-[3rem] border shadow-sm overflow-hidden">
              <div className="p-8 border-b bg-gray-900 text-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <History className="text-green-400" />
                  <h3 className="text-xl font-black">Immutable Audit Trail</h3>
                </div>
                <span className="text-[10px] font-black uppercase bg-white/10 px-4 py-2 rounded-full">Live Logs</span>
              </div>
              <div className="overflow-x-auto max-h-[600px] scrollbar-hide">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b">
                    <tr>
                      <th className="px-8 py-4">Event</th>
                      <th className="px-8 py-4">Principal</th>
                      <th className="px-8 py-4">IP Node</th>
                      <th className="px-8 py-4 text-right">Time (UTC)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-mono text-[11px]">
                    {logs.map(l => (
                      <tr key={l.id} className="hover:bg-gray-50">
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-3">
                            <span className={`w-2 h-2 rounded-full ${l.severity === 'high' ? 'bg-red-500' : l.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                            <span className="text-gray-900 font-bold">{l.action}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4 text-gray-500">{l.userName}</td>
                        <td className="px-8 py-4 text-gray-400">{l.ipAddress}</td>
                        <td className="px-8 py-4 text-right text-gray-400">{new Date(l.timestamp).toLocaleTimeString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="bg-[#2E7D32] p-10 rounded-[3rem] text-white space-y-6 shadow-2xl relative overflow-hidden">
                <ShieldCheck size={80} className="absolute top-0 right-0 p-4 text-white/10" />
                <h3 className="text-2xl font-black">Security Governance</h3>
                <div className="space-y-4">
                   {[
                     { label: 'Brute Force Shield', status: 'ACTIVE', icon: Fingerprint },
                     { label: 'Ledger Encryption', status: 'AES-256', icon: Database },
                     { label: 'KYC Threshold', status: '$10k+', icon: Lock }
                   ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-3">
                           <item.icon size={18} className="text-[#FFD700]" />
                           <span className="text-sm font-bold">{item.label}</span>
                        </div>
                        <span className="text-[10px] font-black uppercase">{item.status}</span>
                     </div>
                   ))}
                </div>
                <button className="w-full py-4 bg-white text-[#2E7D32] rounded-2xl font-black uppercase text-xs">Run Global Vulnerability Scan</button>
              </div>

              <div className="bg-white p-8 rounded-[3rem] border shadow-sm space-y-4">
                <div className="flex items-center gap-3 text-red-500">
                  <ShieldAlert size={24} />
                  <h4 className="font-black">Active Alerts</h4>
                </div>
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                  <p className="text-xs text-red-700 font-bold">No suspicious packet activity detected in the last 24h.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
