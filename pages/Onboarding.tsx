
import React, { useState } from 'react';
import { Sparkles, TrendingUp, Heart, Check, ArrowRight, DollarSign, Globe } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: any) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    interests: [] as string[],
    currency: 'USD',
    riskTolerance: 'Medium',
    investmentGoal: 5000
  });

  const interests = ['Agriculture', 'Tech', 'Infrastructure', 'Real Estate', 'Education', 'Healthcare'];

  const toggleInterest = (interest: string) => {
    setData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else onComplete(data);
  };

  return (
    <div className="fixed inset-0 z-[300] bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-12 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Progress Bar */}
        <div className="flex gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-[#2E7D32]' : 'bg-gray-100'}`}></div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-8 text-center animate-in slide-in-from-right-4">
            <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center text-[#2E7D32] mx-auto">
              <Sparkles size={40} />
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-black text-gray-900">What drives you?</h2>
              <p className="text-gray-500 font-medium">Select the sectors you are most interested in exploring.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {interests.map(i => (
                <button
                  key={i}
                  onClick={() => toggleInterest(i)}
                  className={`p-4 rounded-2xl border-2 font-bold transition-all text-sm ${data.interests.includes(i) ? 'border-[#2E7D32] bg-[#2E7D32]/5 text-[#2E7D32]' : 'border-gray-100 hover:border-gray-200 text-gray-500'}`}
                >
                  {data.interests.includes(i) && <Check size={14} className="inline mr-2" />}
                  {i}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 text-center animate-in slide-in-from-right-4">
            <div className="w-20 h-20 bg-yellow-100 rounded-3xl flex items-center justify-center text-[#FFD700] mx-auto">
              <TrendingUp size={40} />
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-black text-gray-900">Your Financial Profile</h2>
              <p className="text-gray-500 font-medium">Help us tailor opportunities to your goals.</p>
            </div>
            <div className="space-y-6 text-left max-w-md mx-auto">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Preferred Currency</label>
                <select 
                  value={data.currency}
                  onChange={(e) => setData({...data, currency: e.target.value})}
                  className="w-full bg-gray-50 border rounded-2xl px-6 py-4 font-bold outline-none"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="GHS">GHS - Ghana Cedi</option>
                  <option value="NGN">NGN - Nigeria Naira</option>
                  <option value="KES">KES - Kenya Shilling</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Risk Tolerance</label>
                <div className="flex gap-2">
                  {['Low', 'Medium', 'High'].map(r => (
                    <button
                      key={r}
                      onClick={() => setData({...data, riskTolerance: r as any})}
                      className={`flex-1 py-3 rounded-xl border-2 font-bold text-xs ${data.riskTolerance === r ? 'border-[#2E7D32] bg-[#2E7D32]/5 text-[#2E7D32]' : 'border-gray-100 text-gray-400'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 text-center animate-in slide-in-from-right-4">
            <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center text-red-500 mx-auto">
              <Heart size={40} />
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-black text-gray-900">Almost There!</h2>
              <p className="text-gray-500 font-medium">You're joining a community of over 5,000 changemakers.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-[2rem] text-left space-y-4">
              <h4 className="font-bold text-gray-900 flex items-center gap-2"><Globe size={18} className="text-[#2E7D32]" /> Commitment to Impact</h4>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                By joining Diaspora Connect, you agree to our community standards and direct-impact policies. We ensure 100% transparency in capital deployment.
              </p>
            </div>
          </div>
        )}

        <button 
          onClick={nextStep}
          className="w-full py-5 bg-[#2E7D32] text-white rounded-[1.5rem] font-black text-lg shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
        >
          {step === 3 ? 'Finalize Profile' : 'Continue'} <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
