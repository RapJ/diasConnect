
import React from 'react';
import { Shield, Scale, ScrollText } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in duration-700 pb-20">
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-gray-50 text-[#2E7D32] rounded-[2rem] flex items-center justify-center mx-auto shadow-sm">
          <Scale size={40} />
        </div>
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Terms of <span className="text-[#2E7D32]">Service</span></h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Last Updated: March 20, 2024</p>
      </div>

      <div className="bg-white p-16 rounded-[4rem] border shadow-sm space-y-12 prose prose-green max-w-none">
        <section className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-4">
            <span className="text-[#2E7D32]">1.</span> Agreement to Terms
          </h2>
          <p className="text-gray-600 leading-relaxed font-medium text-lg">
            By accessing or using the Diaspora Connect platform, you agree to be bound by these Terms of Service. If you do not agree, you must immediately cease use of the service.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-4">
            <span className="text-[#2E7D32]">2.</span> Investment Risk Disclosure
          </h2>
          <p className="text-gray-600 leading-relaxed font-medium text-lg">
            Investing in African markets involves inherent risks including currency volatility, political change, and economic shifts. Diaspora Connect provides a vetting service but does not guarantee returns. Users should perform their own due diligence.
          </p>
          <div className="bg-red-50 p-8 rounded-3xl border border-red-100">
            <p className="text-sm text-red-700 font-bold italic">Always consult with a financial advisor before committing substantial capital to emerging markets.</p>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-4">
            <span className="text-[#2E7D32]">3.</span> Code of Conduct
          </h2>
          <p className="text-gray-600 leading-relaxed font-medium text-lg">
            Our platform is built on respect and collective growth. Harassment, fraud, or misuse of mission trip facilities will lead to immediate account termination.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
