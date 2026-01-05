
import React from 'react';
import { Briefcase, MapPin, Globe, Sparkles, ArrowRight, Zap, Users, GraduationCap } from 'lucide-react';

const JOBS = [
  { id: 'j1', title: 'Director of Agri-Tech Operations', location: 'Accra, Ghana', type: 'Full-time', impact: 'High', salary: '$85k - $120k' },
  { id: 'j2', title: 'Senior Blockchain Engineer', location: 'Remote (Lagos Hub)', type: 'Contract', impact: 'Medium', salary: '$100k - $150k' },
  { id: 'j3', title: 'Solar Infrastructure Lead', location: 'Nairobi, Kenya', type: 'Field Mission', impact: 'Critical', salary: '$90k - $110k' },
  { id: 'j4', title: 'Diaspora Relations Manager', location: 'London / Remote', type: 'Full-time', impact: 'Medium', salary: '£60k - £85k' },
];

const Careers: React.FC = () => {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-6xl font-black text-gray-900 tracking-tighter">Build the <span className="text-[#2E7D32]">New Africa</span></h1>
        <p className="text-xl text-gray-500 font-medium">Join a global team of pioneers bridging the gap between talent and opportunity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Zap, title: "Impact Driven", desc: "Every line of code and every field visit directly affects local economies." },
          { icon: Users, title: "Diaspora First", desc: "We understand the unique perspective of returning and remote talent." },
          { icon: GraduationCap, title: "Growth Mindset", desc: "Continuous learning programs and leadership tracks for all members." }
        ].map((v, i) => (
          <div key={i} className="bg-white p-10 rounded-[3rem] border shadow-sm space-y-4">
            <div className="w-12 h-12 bg-green-50 text-[#2E7D32] rounded-2xl flex items-center justify-center">
              <v.icon size={24} />
            </div>
            <h3 className="text-xl font-black text-gray-900">{v.title}</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[4rem] border shadow-sm overflow-hidden">
        <div className="p-10 border-b flex justify-between items-center">
          <h2 className="text-2xl font-black text-gray-900">Open Opportunities</h2>
          <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 px-4 py-2 rounded-full text-gray-400">4 New Roles</span>
        </div>
        <div className="divide-y">
          {JOBS.map((job) => (
            <div key={job.id} className="p-10 hover:bg-gray-50 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 group-hover:text-[#2E7D32] transition-colors">{job.title}</h3>
                <div className="flex flex-wrap gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span className="flex items-center gap-2"><MapPin size={14} className="text-[#2E7D32]" /> {job.location}</span>
                  <span className="flex items-center gap-2"><Briefcase size={14} className="text-[#2E7D32]" /> {job.type}</span>
                  <span className="flex items-center gap-2"><Sparkles size={14} className="text-[#FFD700]" /> {job.impact} Impact</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-lg font-black text-gray-900">{job.salary}</span>
                <button className="px-8 py-4 bg-[#2E7D32] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3">
                  Apply Now <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Careers;
