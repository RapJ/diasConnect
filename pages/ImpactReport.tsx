
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Globe, Users, TrendingUp, ShieldCheck, Download, Zap, Heart, Activity, Loader2 } from 'lucide-react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const IMPACT_DATA = [
  { category: 'Agriculture', value: 3.2, color: '#2E7D32' },
  { category: 'Infrastructure', value: 4.8, color: '#1B5E20' },
  { category: 'Tech Hubs', value: 2.1, color: '#FFD700' },
  { category: 'Education', value: 1.5, color: '#A5D6A7' },
];

const ImpactReport: React.FC = () => {
  const [summary, setSummary] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      setIsStreaming(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const streamResponse = await ai.models.generateContentStream({
          model: 'gemini-3-flash-preview',
          contents: "Generate a powerful 3-sentence professional summary of the collective impact of the African Diaspora investing in sustainable agriculture and green energy in 2024. Start with 'The data shows...'",
        });

        let fullText = "";
        for await (const chunk of streamResponse) {
          const c = chunk as GenerateContentResponse;
          const chunkText = c.text;
          if (chunkText) {
            fullText += chunkText;
            setSummary(fullText);
          }
        }
      } catch (err) {
        setSummary("Our network continues to drive $100M+ in direct value creation across continental emerging markets, focusing on sustainable development goals and local empowerment.");
      } finally {
        setIsStreaming(false);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Impact <span className="text-[#2E7D32]">Manifesto</span></h1>
          <p className="text-gray-500 font-medium text-lg">Measurable change across the continent, verified by blockchain.</p>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-white border shadow-xl rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:-translate-y-1 transition-all">
          <Download size={18} /> Download Full Q2 Report
        </button>
      </div>

      <div className="bg-[#2E7D32] p-12 rounded-[4rem] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center shrink-0">
            <Activity size={40} className={`text-[#FFD700] ${isStreaming ? 'animate-pulse' : ''}`} />
          </div>
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-black uppercase tracking-widest text-green-100">AI Impact Synthesis</h3>
              {isStreaming && <Loader2 className="animate-spin text-[#FFD700]" size={20} />}
            </div>
            <div className="text-xl font-medium leading-relaxed italic text-white/90 min-h-[4rem]">
              {summary || "Analyzing network ledger for impact signals..."}
              {isStreaming && <span className="inline-block w-1.5 h-6 bg-[#FFD700] animate-pulse ml-1 align-middle"></span>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-12 rounded-[4rem] border shadow-sm space-y-10">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black text-gray-900">Capital Deployment ($M)</h3>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-[#2E7D32]"></span>
              <span className="w-3 h-3 rounded-full bg-[#FFD700]"></span>
            </div>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={IMPACT_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="category" axisLine={false} tickLine={false} fontSize={10} fontWeight="black" />
                <YAxis axisLine={false} tickLine={false} fontSize={10} fontWeight="black" />
                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="value" radius={[15, 15, 0, 0]}>
                  {IMPACT_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-12 rounded-[4rem] border shadow-sm space-y-8">
          <h3 className="text-2xl font-black text-gray-900">Verified Metrics</h3>
          <div className="space-y-6">
            {[
              { icon: Users, label: "Lives Touched", val: "1.2M", color: "text-blue-600 bg-blue-50" },
              { icon: Zap, label: "Renewable MWh", val: "42k", color: "text-yellow-600 bg-yellow-50" },
              { icon: Heart, label: "Community Aid", val: "$1.8M", color: "text-red-600 bg-red-50" },
              { icon: ShieldCheck, label: "Blockchain Audits", val: "100%", color: "text-green-600 bg-green-50" }
            ].map((m, i) => (
              <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] bg-gray-50 border border-transparent hover:border-gray-100 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl ${m.color}`}><m.icon size={20} /></div>
                  <span className="font-bold text-gray-600 text-sm uppercase tracking-widest">{m.label}</span>
                </div>
                <span className="text-2xl font-black text-gray-900">{m.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactReport;
