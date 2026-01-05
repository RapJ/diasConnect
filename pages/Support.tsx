
import React, { useState, useEffect } from 'react';
import { SupportRecord, UserRole } from '../types';
import { dbService } from '../services/dbService';
import { 
  Heart, 
  Gift, 
  DollarSign, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Inbox, 
  Search, 
  XCircle, 
  MoreVertical, 
  MapPin, 
  MessageSquare,
  Check,
  ChevronRight,
  Globe,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface SupportProps {
  userRole?: UserRole;
  onOpenStory?: (s: any) => void;
}

const Support: React.FC<SupportProps> = ({ userRole = UserRole.USER, onOpenStory }) => {
  const [tab, setTab] = useState<'Cash' | 'Kind'>('Cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedMissionId, setSelectedMissionId] = useState<string>('gen');
  const [notes, setNotes] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [item, setItem] = useState('');
  const [supporterName, setSupporterName] = useState('');
  
  const [adminQueue, setAdminQueue] = useState<SupportRecord[]>([]);
  const [isLoadingQueue, setIsLoadingQueue] = useState(false);

  const isAdmin = userRole === UserRole.ADMIN;

  const stories = [
    { id: 'st1', title: "Education Mission in Benin", location: "Cotonou, Benin", description: "200 school kits delivered to rural villages, providing stationery, books, and uniforms for a full academic year.", image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop" },
    { id: 'st2', title: "Water Well Restoration", location: "Arusha, Tanzania", description: "Refurbishment of 3 traditional solar pumps serving 500+ residents in high-drought areas of the Arusha region.", image: "https://images.unsplash.com/photo-1541516166103-3ad06a96713d?q=80&w=800&auto=format&fit=crop" }
  ];

  const missions = [
    ...stories,
    { id: 'gen', title: "General Continent Fund", location: "Pan-African Focus", description: "Strategic impact deployment where it is needed most across the continent.", image: "https://images.unsplash.com/photo-1523813350249-c7ef482969e7?q=80&w=800&auto=format&fit=crop" }
  ];

  useEffect(() => {
    if (isAdmin) {
      fetchQueue();
    }
  }, [isAdmin]);

  const fetchQueue = async () => {
    setIsLoadingQueue(true);
    const records = await dbService.getSupportRecords();
    setAdminQueue(records);
    setIsLoadingQueue(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await dbService.addSupportRecord({
        type: tab,
        amount: tab === 'Cash' ? amount : undefined,
        item: tab === 'Kind' ? item : undefined,
        supporterName,
        supporterNotes: notes,
        missionId: selectedMissionId
      });

      await dbService.addNotification({
        title: 'Commitment Received',
        message: `Thank you, ${supporterName}. Your support for ${missions.find(m => m.id === selectedMissionId)?.title} has been logged for audit.`,
        type: 'success'
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setNotes('');
        setAmount(0);
        setItem('');
        setSelectedMissionId('gen');
      }, 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAction = async (id: string, action: 'verify' | 'reject') => {
    const status = action === 'verify' ? 'Verified' : 'Rejected';
    await dbService.updateSupportStatus(id, status);
    fetchQueue();
    
    dbService.addNotification({
      title: `Audit ${status}`,
      message: `Support record ${id} has been ${status.toLowerCase()} by the administration.`,
      type: action === 'verify' ? 'success' : 'alert'
    });
  };

  if (isAdmin) {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Impact <span className="text-[#2E7D32]">Registry</span></h1>
            <p className="text-gray-500 font-medium mt-1">Reviewing community contributions for transparency.</p>
          </div>
          <div className="flex bg-white border p-1 rounded-2xl shadow-sm">
             <button className="px-6 py-2.5 bg-[#2E7D32] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg">Pending Requests</button>
             <button onClick={fetchQueue} className="p-3 text-gray-400 hover:text-gray-600 transition-all"><Loader2 size={16} className={isLoadingQueue ? 'animate-spin' : ''} /></button>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] border shadow-sm overflow-hidden">
          <div className="p-8 border-b bg-gray-50/50 flex justify-between items-center">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-[#2E7D32] text-white rounded-xl flex items-center justify-center">
                 <Inbox size={20} />
               </div>
               <h3 className="text-lg font-black text-gray-900">Stewardship Queue</h3>
             </div>
             <div className="flex gap-4">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input type="text" placeholder="Filter donor..." className="pl-9 pr-4 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#2E7D32]/10 w-48" />
               </div>
             </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b">
                <tr>
                  <th className="px-10 py-6">Identity</th>
                  <th className="px-10 py-6">Impact Data</th>
                  <th className="px-10 py-6">Mission Target</th>
                  <th className="px-10 py-6">Notes</th>
                  <th className="px-10 py-6">Current Status</th>
                  <th className="px-10 py-6 text-right">Approval Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {adminQueue.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black">{item.supporterName.substring(0,2).toUpperCase()}</div>
                        <div>
                          <p className="font-bold text-gray-900">{item.supporterName}</p>
                          <p className="text-[10px] text-gray-400 font-bold">{new Date(item.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2">
                        {item.type === 'Cash' ? <DollarSign size={14} className="text-[#2E7D32]" /> : <Gift size={14} className="text-yellow-600" />}
                        <span className="font-black text-gray-900">{item.type === 'Cash' ? `$${item.amount?.toLocaleString()}` : item.item}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-gray-500 font-medium">{missions.find(m => m.id === item.missionId)?.title || 'General Fund'}</td>
                    <td className="px-10 py-6">
                      <div className="max-w-[150px] truncate text-xs text-gray-400" title={item.supporterNotes}>
                        {item.supporterNotes || '—'}
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`px-4 py-1.5 text-[9px] font-black uppercase rounded-full border ${
                        item.status === 'Verified' ? 'bg-green-50 text-green-600 border-green-100' : 
                        item.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' : 
                        'bg-yellow-50 text-yellow-600 border-yellow-100'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      {item.status === 'Pending' ? (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleAction(item.id, 'reject')}
                            className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <XCircle size={18} />
                          </button>
                          <button 
                            onClick={() => handleAction(item.id, 'verify')}
                            className="p-2 text-[#2E7D32] hover:bg-green-50 rounded-xl transition-all"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Finalized</span>
                      )}
                    </td>
                  </tr>
                ))}
                {adminQueue.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-10 py-20 text-center text-gray-400 font-bold">No impact records awaiting audit.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-black text-gray-900 tracking-tighter">Legacy <span className="text-[#2E7D32]">Support</span></h1>
        <p className="text-gray-500 font-medium text-xl max-w-2xl mx-auto leading-relaxed">Your bridge to direct community development. Empower local projects with absolute transparency.</p>
      </div>

      <div className="flex justify-center">
        <div className="bg-white p-2 rounded-[2rem] flex gap-2 border shadow-xl">
          <button onClick={() => setTab('Cash')} className={`flex items-center gap-4 px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${tab === 'Cash' ? 'bg-[#2E7D32] text-white shadow-2xl scale-105' : 'text-gray-400 hover:text-gray-600'}`}><DollarSign size={20} /> Capital Support</button>
          <button onClick={() => setTab('Kind')} className={`flex items-center gap-4 px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${tab === 'Kind' ? 'bg-[#2E7D32] text-white shadow-2xl scale-105' : 'text-gray-400 hover:text-gray-600'}`}><Gift size={20} /> Resource Aid</button>
        </div>
      </div>

      <div className="bg-white rounded-[4rem] border shadow-2xl p-10 md:p-16 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2E7D32]/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        {submitted ? (
          <div className="text-center py-20 space-y-8 animate-in zoom-in-95">
            <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mx-auto text-[#2E7D32] shadow-2xl">
              <CheckCircle2 size={64} className="animate-bounce" />
            </div>
            <div className="space-y-3">
              <h2 className="text-5xl font-black text-gray-900 tracking-tight">Impact Logged</h2>
              <p className="text-gray-500 text-lg max-w-md mx-auto font-medium">We've received your commitment. A dedicated stewardship officer will contact you within 24 hours to confirm impact details.</p>
            </div>
            <button onClick={() => setSubmitted(false)} className="text-[#2E7D32] font-black uppercase tracking-widest text-xs hover:underline">Support Another Mission</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-16">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 ml-2">Legacy Mission Target</h3>
                <span className="text-[9px] font-black uppercase text-[#2E7D32] bg-green-50 px-3 py-1 rounded-lg">Select One Asset</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {missions.map(m => (
                  <div 
                    key={m.id}
                    onClick={() => setSelectedMissionId(m.id)}
                    className={`relative cursor-pointer group transition-all duration-500 ${selectedMissionId === m.id ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
                  >
                    <div className={`h-full bg-white rounded-[2.5rem] border-2 overflow-hidden flex flex-col transition-all duration-500 ${selectedMissionId === m.id ? 'border-[#2E7D32] shadow-2xl shadow-green-900/10' : 'border-gray-100 hover:border-gray-200 shadow-sm'}`}>
                      <div className="h-40 relative overflow-hidden">
                        <img src={m.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                        <div className="absolute top-4 left-4">
                          <span className="bg-white/90 backdrop-blur-md text-[#2E7D32] text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-[#2E7D32]/10">{m.location}</span>
                        </div>
                        {selectedMissionId === m.id && (
                          <div className="absolute inset-0 bg-[#2E7D32]/10 backdrop-blur-[2px] flex items-center justify-center">
                            <div className="bg-[#2E7D32] text-white p-2 rounded-full shadow-2xl animate-in zoom-in">
                              <Check size={20} />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-6 space-y-2">
                        <h4 className={`font-black text-sm leading-tight transition-colors ${selectedMissionId === m.id ? 'text-[#2E7D32]' : 'text-gray-900'}`}>{m.title}</h4>
                        <p className="text-[10px] text-gray-400 font-medium line-clamp-2 leading-relaxed">{m.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div className="space-y-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-2">Contributor Signature</label>
                  <div className="relative">
                    <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      type="text" 
                      required 
                      value={supporterName}
                      onChange={(e) => setSupporterName(e.target.value)}
                      placeholder="Name as you want it on the impact wall" 
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-[#2E7D32]/20 rounded-3xl pl-16 pr-8 py-5 focus:ring-0 outline-none font-bold text-gray-900 transition-all" 
                    />
                  </div>
                </div>
                {tab === 'Cash' ? (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-2">Commitment Value (USD)</label>
                    <div className="relative group">
                      <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-[#2E7D32]" size={28} />
                      <input 
                        type="number" 
                        required 
                        min="10" 
                        value={amount || ''}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        placeholder="500" 
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-[#2E7D32]/20 rounded-3xl pl-16 pr-8 py-6 focus:ring-0 outline-none font-black text-3xl text-[#2E7D32] transition-all" 
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-2">Inventory Description</label>
                    <textarea 
                      required 
                      rows={5} 
                      value={item}
                      onChange={(e) => setItem(e.target.value)}
                      placeholder="What critical resources are you shipping? (e.g., 20 Refurbished Laptops for Arusha Hub)" 
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-[#2E7D32]/20 rounded-3xl px-8 py-6 focus:ring-0 outline-none font-bold text-gray-900 transition-all resize-none"
                    ></textarea>
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-between space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-2">Supporter Notes (Optional)</label>
                  <div className="relative group">
                    <MessageSquare className="absolute left-6 top-6 text-[#2E7D32]" size={20} />
                    <textarea 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Tell us more about your motivation or any specific requests..." 
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-[#2E7D32]/20 rounded-3xl pl-16 pr-8 py-6 focus:ring-0 outline-none font-bold text-gray-900 transition-all resize-none h-32"
                    ></textarea>
                  </div>
                </div>

                <div className="bg-[#F9FAFB] rounded-[3rem] p-8 space-y-6 border shadow-inner">
                  <h4 className="font-black text-gray-900 uppercase tracking-[0.2em] text-[10px] flex items-center gap-4"><ShieldCheck size={18} className="text-[#2E7D32]" /> Stewardship Charter</h4>
                  <div className="space-y-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                    <p className="flex justify-between items-center pb-3 border-b border-gray-200"><span>NGO Load</span> <span className="text-[#2E7D32]">0.00%</span></p>
                    <p className="flex justify-between items-center pb-3 border-b border-gray-200"><span>Protocol</span> <span className="text-[#2E7D32]">Blockchain Audit</span></p>
                    <p className="flex justify-between items-center"><span>Verification</span> <span className="text-[#2E7D32]">GPS Timestamped</span></p>
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-6 bg-[#2E7D32] text-white rounded-[2.5rem] font-black text-xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-5 disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
                  {isSubmitting ? 'Syncing commitment...' : 'Finalize Commitment'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      <div className="space-y-12 pb-12">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h3 className="text-4xl font-black text-gray-900 tracking-tight">Legacy Chronicles</h3>
            <p className="text-gray-500 font-medium">Real stories of impact verified by the Diaspora Connect network.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {stories.map((story) => (
            <div 
              key={story.id} 
              className="bg-white p-8 md:p-10 rounded-[4rem] border hover:shadow-2xl transition-all group cursor-pointer flex flex-col sm:flex-row gap-10" 
              onClick={() => onOpenStory?.(story)}
            >
              <div className="w-full sm:w-48 h-48 shrink-0 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white relative">
                <img src={story.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <h4 className="font-black text-gray-900 text-2xl group-hover:text-[#2E7D32] transition-colors leading-tight">{story.title}</h4>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] flex items-center gap-2"><MapPin size={12} className="text-[#2E7D32]" /> {story.location}</p>
                <p className="text-sm text-gray-500 font-medium line-clamp-2 leading-relaxed">{story.description}</p>
                <div className="flex items-center gap-4 pt-4">
                  <button className="text-[#2E7D32] text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                    Read Impact Audit <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Support;
