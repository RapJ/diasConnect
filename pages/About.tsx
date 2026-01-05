
import React from 'react';
import { Globe, Users, ShieldCheck, Heart, Award, ArrowUpRight } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto">
        <h1 className="text-6xl font-black text-gray-900 leading-tight">
          Bridging the <span className="text-[#2E7D32]">Divide</span>, Building the <span className="text-[#FFD700]">Future</span>.
        </h1>
        <p className="text-xl text-gray-600 font-medium leading-relaxed">
          Diaspora Connect is a mission-driven platform dedicated to reuniting the global African diaspora with their roots through sustainable investment, transformative missions, and community impact.
        </p>
      </section>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white p-12 rounded-[3rem] border shadow-sm space-y-6">
          <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-[#2E7D32]">
            <Globe size={32} />
          </div>
          <h3 className="text-3xl font-black text-gray-900">Our Mission</h3>
          <p className="text-gray-500 leading-relaxed font-medium">
            To create a transparent, secure, and impactful ecosystem where every diaspora member can contribute to Africa's growth story while realizing financial and spiritual returns.
          </p>
        </div>
        <div className="bg-white p-12 rounded-[3rem] border shadow-sm space-y-6">
          <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center text-[#FFD700]">
            <Award size={32} />
          </div>
          <h3 className="text-3xl font-black text-gray-900">Our Vision</h3>
          <p className="text-gray-500 leading-relaxed font-medium">
            A world where geographical distance is no longer a barrier to African participation, fostering a united global community driving the continent's prosperity.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-4xl font-black text-gray-900">Our Core Values</h2>
          <p className="text-gray-500 mt-2">The principles that guide every connection we make.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: ShieldCheck, title: "Integrity", desc: "Vetted projects only." },
            { icon: Users, title: "Community", desc: "Roots-focused growth." },
            { icon: Heart, title: "Purpose", desc: "Impact beyond profit." },
            { icon: Award, title: "Excellence", desc: "World-class standards." }
          ].map((v, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] border text-center space-y-4 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-[#2E7D32] mx-auto">
                <v.icon size={24} />
              </div>
              <h4 className="font-black text-gray-900">{v.title}</h4>
              <p className="text-sm text-gray-500 font-medium">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-[#2E7D32] rounded-[4rem] p-16 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          <div className="space-y-2">
            <p className="text-5xl font-black">$4.2M+</p>
            <p className="text-green-100 font-bold uppercase tracking-widest text-xs">Capital Deployed</p>
          </div>
          <div className="space-y-2">
            <p className="text-5xl font-black">150+</p>
            <p className="text-green-100 font-bold uppercase tracking-widest text-xs">Local Jobs Created</p>
          </div>
          <div className="space-y-2">
            <p className="text-5xl font-black">20+</p>
            <p className="text-green-100 font-bold uppercase tracking-widest text-xs">Missions Completed</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
