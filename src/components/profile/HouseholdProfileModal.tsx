import React, { useState } from 'react';
import {
  X,
  Users,
  AlertCircle,
  Trash2,
  Check,
  Baby,
  HeartPulse,
  Activity,
  Briefcase,
  Dog,
  ShieldAlert,
} from 'lucide-react';
import { HouseholdProfile, VulnerableGroup } from '../../types';

interface HouseholdProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: HouseholdProfile;
  onSave: (profile: HouseholdProfile) => void;
  onDelete: () => void;
}

const VULNERABLE_OPTIONS: Array<{
  id: VulnerableGroup;
  title: string;
  desc: string;
  icon: any;
}> = [
  {
    id: 'elderly',
    title: 'Elderly Individuals (65+)',
    desc: 'Impaired thermoregulation, slower sweat response, cardiac and hypertension vulnerability.',
    icon: Users,
  },
  {
    id: 'infants',
    title: 'Infants & Toddlers (< 5 yrs)',
    desc: 'High surface-area-to-mass ratio, rapid dehydration, susceptibility to heat rash & fever.',
    icon: Baby,
  },
  {
    id: 'pregnancy',
    title: 'Pregnancy',
    desc: 'Increased core metabolic rate and fluid requirements. Risk of pre-term contractions under thermal distress.',
    icon: HeartPulse,
  },
  {
    id: 'chronic_illness',
    title: 'Chronic Illness (Cardio/Respiratory/Renal)',
    desc: 'Requires uninterrupted power for oxygen/nebulizers, temperature-controlled insulin, waterproof medicines.',
    icon: Activity,
  },
  {
    id: 'outdoor_workers',
    title: 'Outdoor & Construction Workers',
    desc: 'Direct peak radiant heat exposure, heat cramps, and dehydration from physical exertion.',
    icon: Briefcase,
  },
  {
    id: 'livestock',
    title: 'Livestock & Domestic Animals',
    desc: 'Vulnerable to heat stress in tin-shed pens, contaminated floodwater ingestion, and lack of aeration.',
    icon: Dog,
  },
];

export const HouseholdProfileModal: React.FC<HouseholdProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  onDelete,
}) => {
  const [selectedGroups, setSelectedGroups] = useState<VulnerableGroup[]>(
    profile.vulnerableGroups || []
  );
  const [membersCount, setMembersCount] = useState<number>(profile.membersCount || 3);
  const [notes, setNotes] = useState<string>(profile.notes || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const toggleGroup = (id: VulnerableGroup) => {
    setSelectedGroups((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    onSave({
      vulnerableGroups: selectedGroups,
      membersCount,
      notes,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 700);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your household profile and clear stored vulnerability data?')) {
      onDelete();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-850 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Vulnerable-Group Household Profile</h3>
              <p className="text-xs text-slate-400">Feature 10: Tailor precautions &amp; checklists to your family</p>
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

        {/* Disclaimer Bar */}
        <div className="px-5 py-2.5 bg-blue-950/40 border-b border-blue-900/40 flex items-center gap-2.5 text-xs text-blue-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-blue-400" />
          <span>
            <strong>Privacy &amp; Medical Disclaimer:</strong> Profile data stays completely private on your device and can be deleted at any time. Guidance is for <em>general household preparedness only</em>, never medical diagnosis or treatment.
          </span>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Members count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Total Household Members
              </label>
              <input
                type="number"
                min={1}
                max={25}
                value={membersCount}
                onChange={(e) => setMembersCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Dwelling Type / Floor Level
              </label>
              <input
                type="text"
                placeholder="e.g. Ground floor / High-rise with power backup"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Vulnerable Options Cards */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Vulnerable Household Members:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {VULNERABLE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedGroups.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleGroup(opt.id)}
                    className={`text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-teal-950/40 border-teal-500/80 ring-1 ring-teal-500/40 text-teal-100'
                        : 'bg-slate-800/60 border-slate-700 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-teal-600 text-white' : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm text-white">{opt.title}</span>
                        {isSelected && <Check className="w-4 h-4 text-teal-400 shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-snug">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 bg-slate-850 border-t border-slate-700 flex items-center justify-between">
          <button
            type="button"
            onClick={handleDelete}
            className="px-3.5 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/60 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Profile</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-teal-900/30"
            >
              {isSaved ? <Check className="w-4 h-4" /> : <Users className="w-4 h-4" />}
              <span>{isSaved ? 'Saved!' : 'Save Profile'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
