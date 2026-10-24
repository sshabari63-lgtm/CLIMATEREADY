import React, { useState } from 'react';
import {
  X,
  User,
  Lock,
  Mail,
  ShieldCheck,
  CheckCircle2,
  LogIn,
  GraduationCap,
  HardHat,
  Users,
  Building,
} from 'lucide-react';
import { UserProfile } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLogin: (user: UserProfile) => void;
}

const DEMO_PERSONAS: Array<{
  role: UserProfile['role'];
  name: string;
  email: string;
  org: string;
  desc: string;
  icon: any;
}> = [
  {
    role: 'resident',
    name: 'Dr. Anand Ramanathan',
    email: 'anand.ramanathan@resilience.org',
    org: 'Tamil Nadu Climate Action Network',
    desc: 'Household preparedness lead; cares for elderly parent and infant.',
    icon: Users,
  },
  {
    role: 'school_officer',
    name: 'Sister Malar V.',
    email: 'malar.safety@stjoseph.edu.in',
    org: "St. Joseph's Higher Secondary School",
    desc: 'School disaster safety coordinator managing 650 students and monsoon protocols.',
    icon: GraduationCap,
  },
  {
    role: 'outdoor_worker',
    name: 'Murugan K.',
    email: 'murugan.build@contractor.in',
    org: 'Chennai Metro Construction Labour Union',
    desc: 'Site safety supervisor enforcing heat break schedules and ORS hydration.',
    icon: HardHat,
  },
  {
    role: 'community_volunteer',
    name: 'Sangeetha R.',
    email: 'sangeetha.volunteer@redcross.org',
    org: 'District Disaster Youth Corps',
    desc: 'Community incident reporter and high-ground shelter mapper.',
    icon: Building,
  },
];

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
}) => {
  const [email, setEmail] = useState(currentUser.email || '');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState(currentUser.name || '');
  const [role, setRole] = useState<UserProfile['role']>(currentUser.role || 'resident');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSelectPersona = (p: typeof DEMO_PERSONAS[0]) => {
    setName(p.name);
    setEmail(p.email);
    setRole(p.role);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name || 'Demo Climate Officer',
      email: email || 'demo@climateready.org',
      role,
      isLoggedIn: true,
      organization: DEMO_PERSONAS.find((p) => p.role === role)?.org || 'Community Resident',
    };
    onLogin(updatedUser);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-850 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">ClimateReady Account Portal</h3>
              <p className="text-xs text-slate-400">Sign in or switch Hackathon Demo Personas</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Quick Demo Persona Switcher */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider">
              Quick Judge Demo Personas:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DEMO_PERSONAS.map((p) => {
                const Icon = p.icon;
                const active = role === p.role;
                return (
                  <button
                    key={p.role}
                    type="button"
                    onClick={() => handleSelectPersona(p)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                      active
                        ? 'bg-teal-950/60 border-teal-500 text-teal-100 ring-1 ring-teal-500/50'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="p-1.5 bg-slate-900 rounded-lg text-teal-400 shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold text-xs text-white block truncate">{p.name}</span>
                      <span className="text-[10px] text-teal-400 block capitalize">{p.role.replace('_', ' ')}</span>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{p.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-white text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-white text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Security PIN / Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-white text-xs"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-900/30 transition-all cursor-pointer"
              >
                {isSuccess ? <CheckCircle2 className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                <span>{isSuccess ? 'Signed In!' : 'Sign In as Selected Persona'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
