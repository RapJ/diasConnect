
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { 
  BrainCircuit, 
  Send, 
  X, 
  Loader2, 
  Sparkles, 
  MessageSquare,
  Bot,
  User as UserIcon,
  ChevronRight,
  TrendingUp,
  Globe,
  Zap
} from 'lucide-react';

const GeminiAdvisor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: "Welcome to the Continental Insight Engine. I am your AI Investment Advisor. How can I assist your portfolio growth in Africa today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || isTyping) return;

    const userText = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are the Diaspora Connect AI Investment Advisor. Answer the following user question about investing in Africa or diaspora missions: "${userText}". Keep the tone professional, encouraging, and focused on sustainable growth and transparency. Maximum 3 paragraphs.`,
      });

      setMessages(prev => [...prev, { role: 'bot', text: response.text || "I'm currently recalibrating my data sets. Please try that question again." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "The network bridge is experiencing high latency. Let's try that again in a moment." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-24 z-[999] flex flex-col items-end pointer-events-none">
      {isOpen && (
        <div className="w-[380px] h-[550px] bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500 mb-6 pointer-events-auto">
          {/* Header */}
          <div className="bg-[#2E7D32] p-8 text-white relative overflow-hidden shrink-0">
             <div className="absolute top-0 right-0 p-8 text-white/5"><BrainCircuit size={100} /></div>
             <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                      <Bot size={28} className="text-[#FFD700]" />
                   </div>
                   <div>
                      <h3 className="font-black text-lg tracking-tight">AI Advisor</h3>
                      <div className="flex items-center gap-2">
                         <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                         <span className="text-[9px] font-black uppercase tracking-widest text-green-200">Live Engine</span>
                      </div>
                   </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-3 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
             </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-gray-50/30">
             {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                   <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${m.role === 'bot' ? 'bg-white text-[#2E7D32]' : 'bg-[#2E7D32] text-white'}`}>
                      {m.role === 'bot' ? <Bot size={16} /> : <UserIcon size={16} />}
                   </div>
                   <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${m.role === 'bot' ? 'bg-white text-gray-700' : 'bg-[#2E7D32] text-white'}`}>
                      {m.text}
                   </div>
                </div>
             ))}
             {isTyping && (
                <div className="flex gap-3 animate-in fade-in">
                   <div className="w-8 h-8 rounded-xl bg-white border flex items-center justify-center text-[#2E7D32]"><Bot size={16} /></div>
                   <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-200 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                   </div>
                </div>
             )}
          </div>

          {/* Input */}
          <div className="p-6 bg-white border-t">
             <div className="flex flex-wrap gap-2 mb-4">
                <button onClick={() => {setQuery("Why invest in Ghana?"); handleSend();}} className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 bg-gray-50 text-gray-500 rounded-lg border hover:bg-green-50 hover:text-[#2E7D32] transition-all">Ghana Focus</button>
                <button onClick={() => {setQuery("How is my capital protected?"); handleSend();}} className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 bg-gray-50 text-gray-500 rounded-lg border hover:bg-green-50 hover:text-[#2E7D32] transition-all">Security</button>
             </div>
             <form onSubmit={handleSend} className="relative group">
                <input 
                  type="text"
                  placeholder="Ask for advice..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-transparent focus:border-[#2E7D32]/20 rounded-2xl pl-6 pr-14 py-4 outline-none font-bold text-sm transition-all shadow-inner"
                />
                <button 
                  type="submit"
                  disabled={!query.trim() || isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-[#2E7D32] text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100"
                >
                   {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
             </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-[#2E7D32] text-white rounded-full shadow-2xl flex items-center justify-center group relative hover:scale-110 active:scale-90 transition-all pointer-events-auto overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#2E7D32] to-[#43a047] group-hover:rotate-180 transition-transform duration-1000"></div>
        {isOpen ? <X size={28} className="relative z-10" /> : <BrainCircuit size={28} className="relative z-10" />}
        {!isOpen && (
          <div className="absolute top-0 right-0 w-3 h-3 bg-[#FFD700] rounded-full border-2 border-[#2E7D32] z-20"></div>
        )}
      </button>
    </div>
  );
};

export default GeminiAdvisor;
