
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { dbService } from '../services/dbService';
import { 
  Save, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Bell, 
  Shield, 
  Loader2, 
  RotateCcw, 
  Upload,
  CheckCircle2,
  Image as ImageIcon,
  KeyRound,
  Fingerprint,
  FileText,
  FileUp,
  Trash2,
  Download,
  AlertCircle
} from 'lucide-react';

interface ProfileProps {
  user: User;
  onUpdateUser: (updatedUser: Partial<User>) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
  // Personal Info State
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });
  
  // Security State
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Startup Portal State
  const [businessPlan, setBusinessPlan] = useState<{name: string, date: string, status: string} | null>(() => {
    const saved = localStorage.getItem('dc_startup_plan');
    return saved ? JSON.parse(saved) : null;
  });
  const [isUploadingPlan, setIsUploadingPlan] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [activeSection, setActiveSection] = useState<'info' | 'security' | 'prefs' | 'startup'>('info');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const planInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (businessPlan) {
      localStorage.setItem('dc_startup_plan', JSON.stringify(businessPlan));
    } else {
      localStorage.removeItem('dc_startup_plan');
    }
  }, [businessPlan]);

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await dbService.updateUserProfile(user.id, formData);
      onUpdateUser(formData);
      triggerToast();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleResetToDefault = async () => {
    if (confirm("Reset to default identifier?")) {
      const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2E7D32&color=fff&size=200&bold=true`;
      await dbService.updateUserProfile(user.id, { avatar: defaultAvatar });
      onUpdateUser({ avatar: defaultAvatar });
      triggerToast();
    }
  };

  const processFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      alert("File is too large. Please select an image under 2MB.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      await dbService.updateUserProfile(user.id, { avatar: base64String });
      onUpdateUser({ avatar: base64String });
      setIsUploading(false);
      triggerToast();
    };
    reader.readAsDataURL(file);
  };

  const handlePlanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingPlan(true);
      setTimeout(() => {
        setBusinessPlan({
          name: file.name,
          date: new Date().toLocaleDateString(),
          status: 'Under Review'
        });
        setIsUploadingPlan(false);
        triggerToast();
      }, 1500);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative pb-20">
      
      {showToast && (
        <div className="fixed top-24 right-8 bg-white border border-green-100 shadow-2xl rounded-2xl p-4 flex items-center gap-3 z-50 animate-in slide-in-from-right-10">
          <div className="bg-green-100 text-[#2E7D32] p-2 rounded-full">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Sync Complete</p>
            <p className="text-xs text-gray-500">Registry has been updated.</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Identity Settings</h1>
          <p className="text-gray-500 mt-1">Manage your continental profile and startup credentials.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveSection('info')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeSection === 'info' ? 'bg-[#2E7D32] text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50 border'}`}
          >
            <UserIcon size={18} /> Personal Details
          </button>
          <button 
            onClick={() => setActiveSection('startup')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeSection === 'startup' ? 'bg-[#2E7D32] text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50 border'}`}
          >
            <FileText size={18} /> Startup Portal
          </button>
          <button 
            onClick={() => setActiveSection('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeSection === 'security' ? 'bg-[#2E7D32] text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50 border'}`}
          >
            <Lock size={18} /> Security
          </button>
        </div>

        <div className="lg:col-span-3 space-y-8">
          {activeSection === 'info' && (
            <div className="bg-white rounded-[2.5rem] border shadow-sm p-8 lg:p-10 space-y-10">
              <div className="flex flex-col sm:flex-row items-center gap-10 pb-10 border-b border-gray-100">
                <div 
                  className="relative group cursor-pointer"
                  onClick={handleAvatarClick}
                >
                  <div className={`relative w-40 h-40 overflow-hidden rounded-[2.5rem] border-4 border-[#2E7D32]/10`}>
                    <img src={user.avatar} className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${isUploading ? 'opacity-30 blur-sm' : ''}`} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 text-white transition-opacity">
                      <Upload size={32} />
                    </div>
                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                        <Loader2 className="animate-spin text-[#2E7D32]" size={40} />
                      </div>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} accept="image/*" className="hidden" />
                </div>
                
                <div className="text-center sm:text-left flex-1 space-y-4">
                  <h3 className="text-3xl font-black text-gray-900 leading-none">{user.name}</h3>
                  <p className="text-gray-500 font-medium">{user.email}</p>
                  <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                    <button onClick={handleAvatarClick} className="flex items-center gap-2 px-6 py-3 bg-[#2E7D32] text-white text-xs font-bold rounded-2xl">
                      <ImageIcon size={16} /> New Photo
                    </button>
                    <button onClick={handleResetToDefault} className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-600 text-xs font-bold rounded-2xl">
                      <RotateCcw size={16} /> Reset
                    </button>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSaveInfo} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700 ml-1">Legal Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-gray-50 border-gray-200 rounded-2xl px-12 py-5 font-bold text-gray-900" 
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700 ml-1">Primary Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-gray-50 border-gray-200 rounded-2xl px-12 py-5 font-bold text-gray-900" 
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={isSaving} className="w-full sm:w-auto px-12 py-5 bg-[#2E7D32] text-white rounded-2xl font-bold flex items-center justify-center gap-3">
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {isSaving ? 'Updating...' : 'Save Registry Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeSection === 'startup' && (
            <div className="bg-white rounded-[2.5rem] border shadow-sm p-8 lg:p-10 space-y-10 animate-in zoom-in-95 duration-300">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-yellow-50 rounded-[1.5rem] text-[#2E7D32]">
                  <FileText size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Startup Portal</h3>
                  <p className="text-sm text-gray-500 font-medium">Pitch your vision to institutional angel investors.</p>
                </div>
              </div>

              {!businessPlan ? (
                <div className="p-10 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 flex flex-col items-center text-center space-y-8">
                  <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-[#2E7D32] cursor-pointer" onClick={() => planInputRef.current?.click()}>
                    {isUploadingPlan ? <Loader2 className="animate-spin" size={40} /> : <FileUp size={40} />}
                  </div>
                  <h4 className="text-xl font-black text-gray-900">Deploy Business Plan</h4>
                  <button onClick={() => planInputRef.current?.click()} className="px-10 py-4 bg-[#2E7D32] text-white rounded-2xl font-bold">Select PDF</button>
                  <input type="file" ref={planInputRef} className="hidden" accept=".pdf" onChange={handlePlanUpload} />
                </div>
              ) : (
                <div className="w-full flex items-center justify-between bg-white p-6 rounded-[2.5rem] shadow-sm border">
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-gray-50 text-[#2E7D32] rounded-2xl"><FileText size={32} /></div>
                    <div>
                      <p className="font-black text-gray-900 text-lg leading-tight">{businessPlan.name}</p>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Status: {businessPlan.status}</p>
                    </div>
                  </div>
                  <button onClick={() => setBusinessPlan(null)} className="p-4 bg-red-50 text-red-400 rounded-2xl"><Trash2 size={22} /></button>
                </div>
              )}
            </div>
          )}

          {activeSection === 'security' && (
            <div className="bg-white rounded-[2.5rem] border shadow-sm p-8 lg:p-10 space-y-8">
              <div className="flex items-center gap-4 text-[#2E7D32]">
                <div className="p-4 bg-green-50 rounded-[1.5rem]"><Shield size={28} /></div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Registry Security</h3>
                  <p className="text-sm text-gray-500 font-medium">Manage credentials and 2FA protocols.</p>
                </div>
              </div>
              <div className="space-y-6 max-w-2xl">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700">Access Pin</label>
                  <input type="password" value="••••••••" disabled className="w-full bg-gray-50 border rounded-2xl px-5 py-5 font-bold" />
                </div>
                <button className="px-10 py-5 bg-[#2E7D32] text-white rounded-2xl font-bold">Cycle Registry Keys</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
