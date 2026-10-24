import React from 'react';
import { X, Printer, ShieldAlert, PhoneCall, MapPin, AlertTriangle, CheckCircle, HeartHandshake } from 'lucide-react';
import { WeatherData, HouseholdProfile, FamilyPlan, ChecklistItem } from '../../types';
import { STATIC_EMERGENCY_NUMBERS } from '../../data/constants';

interface ShareableSafetyCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  weather: WeatherData | null;
  profile: HouseholdProfile;
  plan: FamilyPlan;
  checklist: ChecklistItem[];
  preparednessScore: number;
}

export const ShareableSafetyCardModal: React.FC<ShareableSafetyCardModalProps> = ({
  isOpen,
  onClose,
  weather,
  profile,
  plan,
  checklist,
  preparednessScore,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const printTimestamp = new Date().toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Controls Toolbar (hidden during print) */}
        <div className="px-5 py-3.5 bg-slate-850 border-b border-slate-700 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-teal-400" />
            <h3 className="font-semibold text-white text-base">Shareable Family Safety Card (Feature 14)</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-teal-900/30 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Card Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950 text-slate-100 print:p-2 print:bg-white print:text-black">
          <div className="border-2 border-teal-500/80 rounded-2xl p-6 bg-slate-900 print:bg-white print:border-black print:rounded-none space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 print:border-black pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white print:border print:border-black">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <h1 className="text-xl font-black uppercase tracking-tight text-white print:text-black">
                    ClimateReady Household Safety Card
                  </h1>
                </div>
                <p className="text-xs text-slate-400 print:text-gray-600 mt-1">
                  Location: <strong>{weather?.locationName || 'Assigned Household Location'}</strong>
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-mono text-teal-400 print:text-black block">
                  Generated: {printTimestamp}
                </span>
                <span className="text-xs text-slate-400 print:text-gray-600">
                  Resilience Score: <strong>{preparednessScore}%</strong>
                </span>
              </div>
            </div>

            {/* Weather & Hazard Snapshot */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-850 p-3.5 rounded-xl print:bg-gray-100 print:border print:border-gray-400">
              <div>
                <span className="text-slate-400 print:text-gray-600">Ambient Air Temp:</span>
                <p className="text-base font-bold text-white print:text-black">{weather?.current.temperature ?? 34}°C</p>
              </div>
              <div>
                <span className="text-slate-400 print:text-gray-600">Heat Index (Feels):</span>
                <p className="text-base font-bold text-rose-400 print:text-black">{weather?.current.apparentTemperature ?? 39}°C</p>
              </div>
              <div>
                <span className="text-slate-400 print:text-gray-600">Heat Risk Score:</span>
                <p className="text-base font-bold text-white print:text-black">{weather?.heatRiskScore ?? 65}/100</p>
              </div>
              <div>
                <span className="text-slate-400 print:text-gray-600">Flood Risk Score:</span>
                <p className="text-base font-bold text-sky-400 print:text-black">{weather?.floodRiskScore ?? 35}/100</p>
              </div>
            </div>

            {/* Evacuation & Meeting Points */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 print:text-black flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                Emergency Evacuation Meeting Points:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-800/80 print:bg-gray-50 border border-slate-700 print:border-gray-400">
                  <span className="font-semibold text-white print:text-black block">Primary Meeting Point:</span>
                  <span className="text-slate-300 print:text-black mt-0.5 block">{plan.meetingPointPrimary || 'Community High Ground Park'}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/80 print:bg-gray-50 border border-slate-700 print:border-gray-400">
                  <span className="font-semibold text-white print:text-black block">Secondary Meeting Point:</span>
                  <span className="text-slate-300 print:text-black mt-0.5 block">{plan.meetingPointSecondary || 'Government Higher Secondary School, 2nd Floor'}</span>
                </div>
              </div>
            </div>

            {/* Household Family Contacts */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 print:text-black flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4" />
                Family Emergency Contacts:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                {plan.contacts.map((c, i) => (
                  <div key={i} className="p-2.5 bg-slate-800/60 print:bg-gray-50 rounded-lg border border-slate-700 print:border-gray-300">
                    <span className="font-semibold text-white print:text-black block">{c.name} ({c.relation})</span>
                    <span className="font-mono text-teal-300 print:text-black font-bold mt-0.5 block">{c.phone}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tailored Vulnerability Precautions */}
            {profile.vulnerableGroups.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 print:text-black flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4" />
                  Tailored Household Care Precautions ({profile.vulnerableGroups.join(', ')}):
                </h3>
                <ul className="text-xs space-y-1 text-slate-300 print:text-black list-disc list-inside bg-slate-850 p-3 rounded-xl print:bg-gray-50 print:border print:border-gray-300">
                  {profile.vulnerableGroups.includes('elderly') && (
                    <li>Elderly: Hourly fluid intake reminder, monitor blood pressure, keep cool water footbath ready.</li>
                  )}
                  {profile.vulnerableGroups.includes('infants') && (
                    <li>Infants: Loose breathable cotton clothing, keep indoors during 11 AM - 4 PM sun surge.</li>
                  )}
                  {profile.vulnerableGroups.includes('pregnancy') && (
                    <li>Pregnancy: Avoid midday chores, drink coconut water/ORS, rest in coolest ground-level room.</li>
                  )}
                  {profile.vulnerableGroups.includes('chronic_illness') && (
                    <li>Chronic Illness: 14-day medication supply packed in waterproof zip bags with prescriptions.</li>
                  )}
                  {profile.vulnerableGroups.includes('outdoor_workers') && (
                    <li>Outdoor Workers: 15-minute shaded rest per work hour, carry oral rehydration salts.</li>
                  )}
                  {profile.vulnerableGroups.includes('livestock') && (
                    <li>Livestock: Provide ample drinking water troughs under shaded thatched shelter, avoid tin roofs.</li>
                  )}
                </ul>
              </div>
            )}

            {/* Static Emergency Numbers Reference */}
            <div className="space-y-2 pt-2 border-t border-slate-800 print:border-black">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-300 print:text-black">
                  Verified National Emergency Helplines (India):
                </span>
                <span className="text-[11px] text-slate-500 print:text-gray-500">Source: NDMA / MHA</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 bg-slate-800 print:bg-white print:border print:border-black rounded text-center">
                  <span className="text-slate-400 print:text-gray-600 block text-[10px]">National Emergency</span>
                  <span className="font-mono font-black text-sm text-teal-400 print:text-black">112</span>
                </div>
                <div className="p-2 bg-slate-800 print:bg-white print:border print:border-black rounded text-center">
                  <span className="text-slate-400 print:text-gray-600 block text-[10px]">Ambulance / Medical</span>
                  <span className="font-mono font-black text-sm text-sky-400 print:text-black">108</span>
                </div>
                <div className="p-2 bg-slate-800 print:bg-white print:border print:border-black rounded text-center">
                  <span className="text-slate-400 print:text-gray-600 block text-[10px]">Disaster Management</span>
                  <span className="font-mono font-black text-sm text-amber-400 print:text-black">1070 / 1078</span>
                </div>
                <div className="p-2 bg-slate-800 print:bg-white print:border print:border-black rounded text-center">
                  <span className="text-slate-400 print:text-gray-600 block text-[10px]">Fire &amp; Rescue</span>
                  <span className="font-mono font-black text-sm text-rose-400 print:text-black">101</span>
                </div>
              </div>
            </div>

            {/* Mandatory Disclaimer */}
            <div className="p-3 bg-slate-950 print:bg-gray-100 border border-slate-800 print:border-gray-400 rounded-xl text-[11px] text-slate-400 print:text-gray-700 leading-normal flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5 print:hidden" />
              <div>
                <strong>Mandatory Disclaimer:</strong> This document is an informational household safety summary generated by the ClimateReady platform. It is <strong>not an official evacuation order, meteorological alert, or medical guidance</strong>. Official severe weather warnings are issued exclusively by the India Meteorological Department (IMD) and State Disaster Management Authorities. Keep this card posted on your refrigerator or inside your emergency go-bag.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
