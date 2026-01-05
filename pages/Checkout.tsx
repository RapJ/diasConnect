
import React, { useState, useEffect } from 'react';
import { Investment, KYCStatus } from '../types';
import { 
  ArrowLeft, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Globe,
  MapPin,
  X,
  Fingerprint,
  Camera,
  FileText
} from 'lucide-react';
import { dbService } from '../services/dbService';

interface CheckoutProps {
  investment: Investment;
  amount: number;
  onBack: () => void;
  onSuccess: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ investment, amount, onBack, onSuccess }) => {
  const [method, setMethod] = useState<'stripe' | 'paystack' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [isDone, setIsDone] = useState(false);
  
  // KYC Enforcement for Production
  const [showKYC, setShowKYC] = useState(false);
  const [kycStage, setKycStage] = useState<'intro' | 'scanning' | 'verifying'>('intro');
  const user = dbService.getCurrentUser();
  const needsKYC = amount >= 10000 && user?.kycStatus !== 'Verified';

  const handleStripePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (needsKYC) {
      setShowKYC(true);
      return;
    }
    processPayment();
  };

  const processPayment = () => {
    setIsProcessing(true);
    const stages = ["Securing connection...", "Verifying funds...", "Broadcasting to Ledger...", "Finalizing ownership..."];
    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setProcessingStage(stages[currentStage]);
        currentStage++;
      } else {
        clearInterval(interval);
        completePayment();
      }
    }, 1000);
  };

  const completePayment = () => {
    setIsProcessing(false);
    setIsDone(true);
    setTimeout(onSuccess, 2000);
  };

  const simulateKYC = () => {
    setKycStage('scanning');
    setTimeout(() => {
      setKycStage('verifying');
      setTimeout(async () => {
        await dbService.updateKYC(user!.id, 'Verified');
        setShowKYC(false);
        processPayment();
      }, 3000);
    }, 3000);
  };

  if (showKYC) {
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6">
        <div className="bg-white w-full max-w-2xl rounded-[4rem] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-500">
           <div className="p-12 text-center space-y-10">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
                {kycStage === 'intro' ? <ShieldCheck size={48} /> : kycStage === 'scanning' ? <Camera className="animate-pulse" size={48} /> : <Fingerprint className="animate-bounce" size={48} />}
              </div>
              
              <div className="space-y-3">
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Institutional <span className="text-blue-600">KYC</span></h2>
                <p className="text-gray-500 font-medium leading-relaxed max-w-sm mx-auto">
                  {kycStage === 'intro' ? "Investments over $10,000 require institutional-grade identity verification." : kycStage === 'scanning' ? "Capturing document biometrics..." : "Verifying identity against global sanctions lists..."}
                </p>
              </div>

              {kycStage === 'intro' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                   <div className="p-6 bg-gray-50 rounded-3xl border space-y-3">
                      <FileText className="text-blue-600" size={20} />
                      <p className="text-xs font-black uppercase tracking-widest text-gray-400">Step 1</p>
                      <p className="text-sm font-bold text-gray-900">Upload Passport or National ID Card</p>
                   </div>
                   <div className="p-6 bg-gray-50 rounded-3xl border space-y-3">
                      <Camera className="text-blue-600" size={20} />
                      <p className="text-xs font-black uppercase tracking-widest text-gray-400">Step 2</p>
                      <p className="text-sm font-bold text-gray-900">Live Liveness Biometric Scan</p>
                   </div>
                </div>
              )}

              <div className="pt-6">
                {kycStage === 'intro' ? (
                  <button 
                    onClick={simulateKYC}
                    className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-blue-900/20 hover:-translate-y-1 transition-all"
                  >
                    Initiate Identity Check
                  </button>
                ) : (
                  <div className="py-4 space-y-4">
                     <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 transition-all duration-[3000ms] w-full"></div>
                     </div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Encryption Bridge: Active</p>
                  </div>
                )}
              </div>
           </div>
           <div className="p-6 bg-gray-50 border-t text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                 <Lock size={14} className="text-blue-600" /> SECURED BY COMPLY-WORLD AI
              </p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="lg:col-span-8 space-y-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 hover:bg-white rounded-2xl border border-transparent hover:border-gray-200 transition-all"><ArrowLeft size={20} /></button>
          <h1 className="text-3xl font-black text-gray-900">Capital Deployment</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            onClick={() => setMethod('stripe')}
            className={`p-10 rounded-[3rem] border-2 transition-all flex flex-col items-start gap-6 group relative overflow-hidden ${method === 'stripe' ? 'border-[#2E7D32] bg-white shadow-xl' : 'bg-white border-transparent hover:border-gray-200 shadow-sm'}`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all group-hover:scale-110 ${method === 'stripe' ? 'bg-[#635bff] text-white' : 'bg-gray-50'}`}>
              <CreditCard size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 leading-none">Global Ledger</h3>
              <p className="text-sm text-gray-400 font-medium mt-3 leading-relaxed">Direct settlement via major International Bank Cards.</p>
            </div>
            {method === 'stripe' && <CheckCircle2 className="absolute top-6 right-6 text-[#2E7D32]" size={24} />}
          </button>
        </div>

        {method === 'stripe' && (
          <form onSubmit={handleStripePayment} className="bg-white p-12 rounded-[4rem] border shadow-sm space-y-10 animate-in slide-in-from-top-4">
             <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Fingerprint className="text-[#2E7D32]" size={24} />
                  <h3 className="text-xl font-black text-gray-900">Institutional Access</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <input type="text" placeholder="Cardholder Legal Name" className="w-full bg-gray-50 border rounded-2xl px-6 py-5 font-bold outline-none focus:ring-4 focus:ring-[#2E7D32]/10" required />
                  <input type="text" placeholder="#### #### #### ####" className="w-full bg-gray-50 border rounded-2xl px-6 py-5 font-bold outline-none" required />
                </div>
                {needsKYC && (
                  <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-center gap-6">
                    <ShieldCheck className="text-blue-600 shrink-0" size={32} />
                    <p className="text-sm font-bold text-blue-800 leading-relaxed uppercase tracking-tight">Large Commitment Protection: High-value assets require KYC verification before execution.</p>
                  </div>
                )}
                <button 
                  type="submit" disabled={isProcessing}
                  className="w-full py-6 bg-[#2E7D32] text-white rounded-[2rem] font-black text-xl shadow-2xl flex items-center justify-center gap-4 disabled:opacity-50"
                >
                  {isProcessing ? <><Loader2 className="animate-spin" size={24} /> <span className="animate-pulse">{processingStage}</span></> : <><ShieldCheck size={28} /> Finalize — ${amount.toLocaleString()}</>}
                </button>
             </div>
          </form>
        )}
      </div>

      <div className="lg:col-span-4">
        <div className="bg-[#2E7D32] rounded-[3rem] text-white p-10 space-y-8 shadow-2xl sticky top-24">
           <h2 className="text-xl font-black uppercase tracking-widest text-green-200">Commitment Summary</h2>
           <div className="bg-white/10 p-6 rounded-3xl space-y-6">
              <div className="flex justify-between items-center">
                 <span className="text-sm font-bold text-green-100">Principal Stake</span>
                 <span className="text-xl font-black">${amount.toLocaleString()}</span>
              </div>
              <div className="h-px bg-white/10"></div>
              <div className="flex justify-between items-center">
                 <span className="text-base font-black">Total to Deploy</span>
                 <span className="text-3xl font-black text-[#FFD700]">${amount.toLocaleString()}</span>
              </div>
           </div>
           <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex gap-4">
              <Lock className="text-[#FFD700] shrink-0" size={20} />
              <p className="text-[10px] font-black text-green-50 uppercase tracking-widest leading-relaxed">Secured via institutional-grade blockchain ledger and milestone-based escrow.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
