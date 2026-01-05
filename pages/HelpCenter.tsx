
import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, HelpCircle, Book, Shield, DollarSign, Map, MessageCircle, X, CheckCircle2, Loader2, Send, ChevronDown } from 'lucide-react';

const CATEGORIES = [
  { id: 'invest', icon: DollarSign, title: 'Investing', desc: 'Understanding risk, returns, and vetting.' },
  { id: 'logistics', icon: Map, title: 'Missions', desc: 'Travel requirements, visas, and safety.' },
  { id: 'security', icon: Shield, title: 'Security', desc: 'Capital protection and blockchain audits.' },
  { id: 'account', icon: MessageCircle, title: 'Support', desc: 'Managing aid commitments and kind-aid.' }
];

const HELP_ARTICLES = [
  { id: '1', category: 'invest', title: 'How are investment projects vetted?', answer: 'Every project goes through a rigorous 5-step verification process including land title checks, local government permits, financial audit of the parent company, and on-site inspection by our regional leads.' },
  { id: '2', category: 'invest', title: 'Can I invest in multiple projects at once?', answer: 'Yes, you can diversify your portfolio by investing in as many projects as you like across different sectors and countries. Many users maintain a balanced portfolio across Agriculture and Tech.' },
  { id: '3', category: 'invest', title: 'What is the minimum investment amount?', answer: 'Minimums vary by project, but most opportunities allow entries starting from $500 to $1,000 to ensure accessibility for the global diaspora.' },
  { id: '4', category: 'logistics', title: 'What happens if a mission trip is cancelled?', answer: 'In the rare event of a cancellation due to safety or logistics, you are entitled to a 100% refund of your mission seat fee or a credit towards a future trip within 24 months.' },
  { id: '5', category: 'logistics', title: 'Do I need a visa for my mission trip?', answer: 'Visa requirements depend on your citizenship and the destination country. Diaspora Connect provides a personalized Visa Guide for every booked mission seat.' },
  { id: '6', category: 'security', title: 'How is my capital protected?', answer: 'Capital is held in a secure escrow account and only disbursed to projects as they meet verified milestones. We also maintain a contingency fund for additional protection.' },
  { id: '7', category: 'security', title: 'What is a blockchain audit?', answer: 'Every transaction and milestone completion is recorded on a private ledger. This ensures that the history of project progress and fund usage is immutable and verifiable by any stakeholder.' },
  { id: '8', category: 'account', title: 'How do I track my in-kind aid shipment?', answer: 'Once your aid is logged, you will receive a tracking ID. Our regional partners update the status at every major milestone: arrival at port, customs clearing, and final delivery.' },
  { id: '9', category: 'account', title: 'Can I change my preferred currency?', answer: 'Yes, you can update your settlement currency in your Identity Settings at any time. This will update the display values across the registry.' }
];

const HelpCenter: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const filteredArticles = useMemo(() => {
    return HELP_ARTICLES.filter(article => {
      const matchesCategory = activeCategory ? article.category === activeCategory : true;
      const matchesSearch = article.title.toLowerCase().includes(search.toLowerCase()) || 
                           article.answer.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setTimeout(() => {
        setShowContactModal(false);
        setIsSent(false);
      }, 2000);
    }, 1500);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="text-center space-y-8 py-10">
        <h1 className="text-6xl font-black text-gray-900 tracking-tighter">How can we <span className="text-[#2E7D32]">Help?</span></h1>
        <div className="max-w-2xl mx-auto relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#2E7D32] transition-colors" size={24} />
          <input 
            type="text" 
            placeholder="Search our knowledge base..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-[2.5rem] pl-16 pr-8 py-6 shadow-xl focus:ring-4 focus:ring-[#2E7D32]/5 outline-none font-bold text-lg transition-all"
          />
        </div>
      </div>

      {/* Category Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {CATEGORIES.map((cat) => (
          <div 
            key={cat.id} 
            onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
            className={`p-10 rounded-[3rem] border shadow-sm transition-all group cursor-pointer ${activeCategory === cat.id ? 'bg-[#2E7D32] text-white shadow-2xl scale-105 border-transparent' : 'bg-white hover:shadow-xl'}`}
          >
            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 transition-transform ${activeCategory === cat.id ? 'bg-white/20 text-[#FFD700]' : 'bg-green-50 text-[#2E7D32] group-hover:scale-110'}`}>
              <cat.icon size={28} />
            </div>
            <h3 className={`text-2xl font-black mb-2 ${activeCategory === cat.id ? 'text-white' : 'text-gray-900'}`}>{cat.title}</h3>
            <p className={`text-sm font-medium leading-relaxed ${activeCategory === cat.id ? 'text-green-50' : 'text-gray-500'}`}>{cat.desc}</p>
            <button className={`mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-transform ${activeCategory === cat.id ? 'text-[#FFD700]' : 'text-[#2E7D32] group-hover:translate-x-2'}`}>
              {activeCategory === cat.id ? 'Selected' : 'Browse Articles'} <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[4rem] border shadow-sm p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Dynamic Article List */}
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-gray-900">
              {activeCategory ? `${CATEGORIES.find(c => c.id === activeCategory)?.title} Questions` : 'Popular Questions'}
            </h2>
            {activeCategory && (
              <button 
                onClick={() => setActiveCategory(null)}
                className="text-[10px] font-black uppercase text-[#2E7D32] hover:underline"
              >
                Clear Filter
              </button>
            )}
          </div>
          <div className="space-y-4">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <div key={article.id} className="border-b border-gray-100 last:border-0 pb-4">
                  <button 
                    onClick={() => toggleExpand(article.id)}
                    className="w-full text-left p-6 bg-gray-50 rounded-2xl flex items-center justify-between group hover:bg-white border border-transparent hover:border-gray-100 transition-all"
                  >
                    <span className="font-bold text-gray-700">{article.title}</span>
                    <ChevronDown size={18} className={`text-gray-300 group-hover:text-[#2E7D32] transition-all ${expandedId === article.id ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedId === article.id && (
                    <div className="p-8 animate-in slide-in-from-top-2 duration-300">
                      <p className="text-gray-600 font-medium leading-relaxed">
                        {article.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center space-y-4 text-gray-400">
                <HelpCircle size={48} className="mx-auto opacity-20" />
                <p className="font-bold">No articles match your current criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Support CTA */}
        <div className="bg-[#2E7D32] rounded-[3rem] p-8 md:p-12 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="space-y-6 relative z-10">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <HelpCircle size={28} className="text-[#FFD700]" />
            </div>
            <h2 className="text-3xl font-black leading-tight">Can't find what you're looking for?</h2>
            <p className="font-medium opacity-80">Our support team is available 24/7 to help you with your journey back to the roots. Direct access to regional specialists.</p>
          </div>
          <button 
            onClick={() => setShowContactModal(true)}
            className="w-full py-5 bg-white text-[#2E7D32] rounded-2xl font-black text-xs uppercase tracking-widest mt-12 hover:scale-[1.02] transition-all shadow-2xl relative z-10"
          >
            Contact Support Team
          </button>
        </div>
      </div>

      {/* Contact Support Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#2E7D32] text-white rounded-xl flex items-center justify-center shadow-lg">
                  <MessageCircle size={20} />
                </div>
                <h3 className="text-xl font-black text-gray-900">Direct Message</h3>
              </div>
              <button onClick={() => setShowContactModal(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <X size={24} />
              </button>
            </div>

            <div className="p-10">
              {isSent ? (
                <div className="text-center py-12 space-y-6 animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-green-50 text-[#2E7D32] rounded-full flex items-center justify-center mx-auto shadow-xl">
                    <CheckCircle2 size={40} className="animate-bounce" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black text-gray-900">Message Sent!</h4>
                    <p className="text-gray-500 font-medium">A support specialist will respond within 2-4 hours.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Inquiry Category</label>
                    <select className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-[#2E7D32]/20 transition-all appearance-none cursor-pointer">
                      <option>General Support</option>
                      <option>Investment Verification</option>
                      <option>Travel & Mission Logistics</option>
                      <option>Account & Billing</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Your Message</label>
                    <textarea 
                      required
                      placeholder="How can we assist your continental journey today?" 
                      rows={5}
                      className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 font-bold outline-none focus:bg-white focus:border-[#2E7D32]/20 transition-all resize-none"
                    ></textarea>
                  </div>
                  <button 
                    disabled={isSubmitting}
                    className="w-full py-5 bg-[#2E7D32] text-white rounded-[1.5rem] font-black shadow-xl hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    {isSubmitting ? 'Transmitting...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
            <div className="p-6 bg-gray-50/50 border-t text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                <Shield size={14} className="text-[#2E7D32]" /> Encrypted Support Channel
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpCenter;
