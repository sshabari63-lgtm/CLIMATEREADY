import React, { useState } from 'react';
import {
  Settings,
  User,
  Bell,
  Languages,
  Shield,
  Download,
  Trash2,
  RotateCcw,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { UserProfile, SavedLocation, AlertSubscription } from '../../types';
import {
  exportAllUserData,
  deleteAllUserData,
  resetDemoData,
} from '../../utils/storage';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (u: UserProfile) => void;
  locations: SavedLocation[];
  activeLocationId: string;
  onSelectLocation: (id: string) => void;
  onOpenAlerts: () => void;
  onOpenProfile: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  locations,
  activeLocationId,
  onSelectLocation,
  onOpenAlerts,
  onOpenProfile,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      email,
      role,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExport = () => {
    const data = exportAllUserData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ClimateReady_v2_Archive_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = () => {
    if (window.confirm('Delete all stored household profiles, checklists, and saved plans?')) {
      deleteAllUserData();
      alert('Local data purged. Reloading app.');
      window.location.reload();
    }
  };

  const handleResetDemo = () => {
    resetDemoData();
    alert('Demonstration benchmark restored.');
    window.location.reload();
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Platform Settings &amp; Preferences</h2>
            <p className="text-xs text-slate-400">Configure profile identity, alert thresholds, and data privacy</p>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Profile configuration saved successfully!</span>
        </div>
      )}

      {/* Profile Form */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <User className="w-4 h-4 text-teal-400" />
          <span>User Profile Identity</span>
        </h3>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Preparedness Role / Capacity</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-teal-500"
            >
              <option value="resident">Resident / Household Head</option>
              <option value="school_officer">School / College Safety Officer</option>
              <option value="outdoor_worker">Outdoor &amp; Construction Worker</option>
              <option value="community_volunteer">Community Disaster Volunteer</option>
              <option value="coordinator">Municipal Resilience Coordinator</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* Quick Configuration Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2.5">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Bell className="w-4 h-4 text-amber-400" />
            <span>Alert Subscriptions</span>
          </div>
          <p className="text-xs text-slate-400">
            Set custom temperature and rainfall threshold triggers for active locations.
          </p>
          <button
            type="button"
            onClick={onOpenAlerts}
            className="text-xs text-teal-400 hover:underline font-semibold"
          >
            Configure Alert Thresholds →
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2.5">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Shield className="w-4 h-4 text-sky-400" />
            <span>Household Vulnerability Profile</span>
          </div>
          <p className="text-xs text-slate-400">
            Configure elderly, infant, chronic illness, and livestock safety considerations.
          </p>
          <button
            type="button"
            onClick={onOpenProfile}
            className="text-xs text-teal-400 hover:underline font-semibold"
          >
            Manage Vulnerability Tags →
          </button>
        </div>
      </div>

      {/* Data Management & Demo Controls */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
          Data Sovereignty &amp; Demo Controls
        </h3>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <button
            type="button"
            onClick={handleExport}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-teal-300 border border-slate-700 font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download All Data as JSON</span>
          </button>

          <button
            type="button"
            onClick={handleResetDemo}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 border border-slate-700 font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Benchmarks</span>
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/60 font-medium flex items-center gap-2 transition-colors cursor-pointer ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Purge Local Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
