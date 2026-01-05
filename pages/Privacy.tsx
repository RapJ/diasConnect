
import React from 'react';
import { EyeOff, Lock, UserCheck } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in duration-700 pb-20">
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-gray-50 text-[#2E7D32] rounded-[2rem] flex items-center justify-center mx-auto shadow-sm">
          <Lock size={40} />
        </div>
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Privacy <span className="text-[#2E7D32]">Policy</span></h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Your data is yours. Period.</p>
      </div>

      <div className="bg-white p-16 rounded-[4rem] border shadow-sm space-y-12 prose prose-green max-w-none">
        <section className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-4">
            <ShieldIcon className="text-[#2E7D32]" /> Data Collection
          </h2>
          <p className="text-gray-600 leading-relaxed font-medium text-lg">
            We collect personal information necessary to facilitate investments and missions, including identity verification documents as required by international KYC/AML laws.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-4">
            <EyeOffIcon className="text-[#2E7D32]" /> Data Security
          </h2>
          <p className="text-gray-600 leading-relaxed font-medium text-lg">
            Your sensitive information is encrypted at rest and in transit using military-grade AES-256 protocols. Financial data is handled through our vetted partners, Stripe and Paystack.
          </p>
        </section>

        <div className="p-10 bg-green-50 rounded-[3rem] border border-green-100 text-center">
          <p className="text-[#2E7D32] font-black uppercase tracking-widest text-xs mb-4">Questions about your data?</p>
          <button className="px-10 py-4 bg-[#2E7D32] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">
            Request Data Archive
          </button>
        </div>
      </div>
    </div>
  );
};

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const EyeOffIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
);

export default Privacy;
