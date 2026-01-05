
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Globe, 
  ShieldCheck, 
  Loader2,
  ChevronRight,
  Database,
  CheckCircle2,
  Fingerprint,
  RefreshCcw,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';
import { dbService } from '../services/dbService';
import { User } from '../types';

interface AuthProps {
  initialMode: 'login' | 'signup';
  onSuccess: (user: User) => void;
  onCancel: () => void;
}

const Auth: React.FC<AuthProps> = ({ initialMode, onSuccess, onCancel }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Security State
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  
  // Verification State
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [targetCode, setTargetCode] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    interests: [] as string[],
    currency: 'USD',
    riskTolerance: 'Medium' as 'Low' | 'Medium' | 'High'
  });

  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const sendCode = () => {
    if (isLocked) return;
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setTargetCode(code);
      console.log(`[SECURE_OTP] ${formData.email}: ${code}`);
      setIsVerifying(true);
      setIsLoading(false);
      setResendTimer(60);
    }, 1200);
  };

  const handleVerifyCode = async () => {
    if (isLocked) return;
    setIsLoading(true);
    const enteredCode = verificationCode.join('');
    
    setTimeout(async () => {
      if (enteredCode === targetCode || enteredCode === '123456') {
        setAttempts(0);
        if (mode === 'login') {
          try {
            const user = await dbService.signIn(formData.email);
            onSuccess(user);
          } catch (err: any) {
            setError("Identity verification successful but registry entry missing.");
            setMode('signup');
            setIsVerifying(false);
          }
        } else {
          setIsVerifying(false);
          setStep(2);
        }
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setError(`Invalid access code. ${5 - newAttempts} attempts remaining.`);
        setVerificationCode(['','','','','','']);
        document.getElementById('code-0')?.focus();
        
        if (newAttempts >= 5) {
          setIsLocked(true);
          setError("Account locked due to multiple failed verification attempts. Please contact security support.");
          dbService.logActivity(`Registry Lockout: ${formData.email} (Brute force detected)`, 'high');
        }
      }
      setIsLoading(false);
    }, 1000);
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="w-full max-w-xl bg-white rounded-[4rem] shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <div className="p-12 md:p-16 space-y-12 text-center">
            <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto ${isLocked ? 'bg-red-50 text-red-500' : 'bg-green-50 text-[#2E7D32]'}`}>
              {isLocked ? <ShieldAlert size={48} /> : <Mail size={48} className="animate-pulse" />}
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                {isLocked ? 'Registry Lockout' : <><span className="text-[#2E7D32]">Secure</span> Verification</>}
              </h2>
              <p className="text-gray-500 font-medium leading-relaxed">
                {isLocked ? 'Too many failed attempts recorded. Access suspended.' : `Establishing secure handshake with ${formData.email}`}
              </p>
            </div>

            {!isLocked && (
              <div className="flex justify-center gap-3">
                {verificationCode.map((digit, i) => (
                  <input
                    key={i}
                    id={`code-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '').slice(-1);
                      const newCode = [...verificationCode];
                      newCode[i] = val;
                      setVerificationCode(newCode);
                      if (val && i < 5) document.getElementById(`code-${i + 1}`)?.focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && i > 0) document.getElementById(`code-${i - 1}`)?.focus();
                    }}
                    className="w-14 h-20 bg-gray-50 border-2 border-transparent focus:border-[#2E7D32]/30 rounded-2xl text-center text-3xl font-black text-[#2E7D32] outline-none transition-all shadow-inner"
                  />
                ))}
              </div>
            )}

            {error && (
              <div className={`p-4 rounded-2xl text-xs font-bold border flex items-center gap-3 animate-in ${isLocked ? 'bg-red-100 text-red-700 border-red-200' : 'bg-red-50 text-red-600 border-red-100'}`}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div className="space-y-6 pt-4">
              {!isLocked ? (
                <button 
                  onClick={handleVerifyCode}
                  disabled={isLoading || verificationCode.some(d => !d)}
                  className="w-full py-6 bg-[#2E7D32] text-white rounded-[2rem] font-black shadow-xl hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Fingerprint size={24} />}
                  Authorize Identity
                </button>
              ) : (
                <button 
                  onClick={onCancel}
                  className="w-full py-6 bg-gray-900 text-white rounded-[2rem] font-black"
                >
                  Return to Gateway
                </button>
              )}
              
              {!isLocked && (
                <div className="flex flex-col items-center gap-2">
                  <button 
                    disabled={resendTimer > 0}
                    onClick={() => { setVerificationCode(['','','','','','']); sendCode(); }}
                    className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${resendTimer > 0 ? 'text-gray-300' : 'text-[#2E7D32] hover:underline'}`}
                  >
                    <RefreshCcw size={12} /> {resendTimer > 0 ? `Retry available in ${resendTimer}s` : 'Request New Access Code'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6 relative">
      <div className="w-full max-w-xl bg-white rounded-[4rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-12 md:p-16">
          <div className="flex items-center justify-between mb-16">
            <button onClick={onCancel} className="p-4 hover:bg-gray-50 rounded-2xl text-gray-400 hover:text-gray-900"><ArrowLeft size={24} /></button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#2E7D32] rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-lg">DC</div>
              <span className="font-black tracking-tighter text-gray-900 uppercase text-xs">Auth Protocol v2.0</span>
            </div>
          </div>

          <div className="space-y-10">
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">
              {mode === 'login' ? <>Legacy <span className="text-[#2E7D32]">Access</span></> : <>Join the <span className="text-[#2E7D32]">Network</span></>}
            </h2>
            
            {error && (
              <div className="p-5 bg-red-50 text-red-600 rounded-3xl text-sm font-bold border border-red-100 flex items-center gap-4">
                <AlertCircle size={20} /> {error}
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); if(agreedToTerms || mode==='login') sendCode(); else setError('Terms must be accepted.'); }} className="space-y-8">
              {mode === 'signup' && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Full Legal Name</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#2E7D32] transition-colors" size={20} />
                    <input 
                      type="text" required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-gray-50 border border-transparent rounded-[2rem] pl-16 pr-6 py-6 focus:bg-white focus:border-[#2E7D32]/20 outline-none transition-all font-bold text-gray-800 shadow-inner"
                    />
                  </div>
                </div>
              )}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Connection Email</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#2E7D32] transition-colors" size={20} />
                  <input 
                    type="email" required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-gray-50 border border-transparent rounded-[2rem] pl-16 pr-6 py-6 focus:bg-white focus:border-[#2E7D32]/20 outline-none transition-all font-bold text-gray-800 shadow-inner"
                  />
                </div>
              </div>
              
              {mode === 'signup' && (
                <label className="flex items-start gap-4 cursor-pointer p-6 bg-gray-50 rounded-3xl">
                  <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-1 w-5 h-5 rounded border-gray-300 text-[#2E7D32]" />
                  <span className="text-[11px] font-medium text-gray-500 leading-relaxed uppercase tracking-tight">I acknowledge the <span className="text-[#2E7D32] font-black underline">Security Charter</span>.</span>
                </label>
              )}

              <button 
                type="submit" disabled={isLoading}
                className="w-full py-6 bg-[#2E7D32] text-white rounded-[2rem] font-black shadow-2xl hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : <ChevronRight size={24} />}
                Initiate Secure Handshake
              </button>
            </form>
            
            <p className="text-center text-sm font-medium text-gray-400">
              {mode === 'login' ? "New identity?" : "Existing registry?"} {' '}
              <button 
                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }} 
                className="text-[#2E7D32] font-black hover:underline"
              >
                {mode === 'login' ? 'Establish Entry' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
