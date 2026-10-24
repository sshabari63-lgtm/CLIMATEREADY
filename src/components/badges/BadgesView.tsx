import React, { useState, useEffect } from 'react';
import {
  Award,
  Flame,
  CheckCircle,
  AlertTriangle,
  Download,
  Trash2,
  ShieldCheck,
  History,
  FileJson,
  Sparkles,
  Droplets,
  HeartPulse,
  Calendar,
  MapPin,
} from 'lucide-react';
import { Badge, AuditLogEntry } from '../../types';
import {
  exportAllUserData,
  deleteAllUserData,
  getAuditLogs,
  recordStreakCheckIn,
} from '../../utils/storage';

interface BadgesViewProps {
  badges: Badge[];
  streakCount: number;
  onRefreshData: () => void;
}

export const BadgesView: React.FC<BadgesViewProps> = ({
  badges,
  streakCount,
  onRefreshData,
}) => {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [checkInNotice, setCheckInNotice] = useState<string | null>(null);

  useEffect(() => {
    setAuditLogs(getAuditLogs());
  }, []);

  const handleManualCheckIn = () => {
    const newStreak = recordStreakCheckIn();
    setAuditLogs(getAuditLogs());
    onRefreshData();
    setCheckInNotice(`Preparedness streak maintained! Current streak: ${newStreak} days.`);
    setTimeout(() => setCheckInNotice(null), 4000);
  };

  const handleExportData = () => {
    const jsonData = exportAllUserData();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ClimateReady_User_Archive_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setAuditLogs(getAuditLogs());
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      'CRITICAL WARNING: This will permanently delete your saved locations, family plan, alert subscriptions, and checklist history. This action cannot be undone.\n\nProceed with full data purge?'
    );
    if (confirmed) {
      deleteAllUserData();
      alert('All local account data and cached telemetry have been purged. The page will reload.');
      window.location.reload();
    }
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'droplets':
        return Droplets;
      case 'heart-pulse':
        return HeartPulse;
      case 'calendar':
        return Calendar;
      case 'map-pin':
        return MapPin;
      case 'flame':
        return Flame;
      default:
        return ShieldCheck;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header card with Streak info */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-950/40 via-slate-900 to-slate-900 border border-orange-900/40 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-inner">
            <Flame className="w-7 h-7 fill-orange-500 text-orange-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{streakCount}-Day Preparedness Streak</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-semibold border border-orange-500/30">
                Active Habit
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Consistent daily verification of weather hazards and emergency readiness
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleManualCheckIn}
          className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-orange-900/30 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Daily Resilience Check-In</span>
        </button>
      </div>

      {checkInNotice && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{checkInNotice}</span>
        </div>
      )}

      {/* Mandatory Disclaimer Callout */}
      <div className="p-4 bg-amber-950/40 border border-amber-900/50 rounded-xl flex items-start gap-3 text-xs text-amber-200">
        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-semibold">Important Resilience Disclaimer:</strong> Earning badges and maintaining streaks rewards good disaster preparedness habits. However, <strong>checklist completion does NOT equal absolute safety</strong> during extreme catastrophic weather events. Always prioritize evacuation directives from district collectors, police, and disaster response teams.
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-teal-400" />
          <span>Resilience Badges &amp; Milestones:</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {badges.map((badge) => {
            const Icon = getBadgeIcon(badge.icon);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  badge.unlocked
                    ? 'bg-slate-850 border-teal-500/50 shadow-md shadow-teal-950/30'
                    : 'bg-slate-900/70 border-slate-800 opacity-75'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    badge.unlocked
                      ? 'bg-teal-600/20 text-teal-400 border border-teal-500/40'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white">{badge.title}</h4>
                    {badge.unlocked ? (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-semibold">
                        Earned
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-500">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-snug">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature 20: Data Export & Account Deletion Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <FileJson className="w-5 h-5 text-teal-400" />
          <h3 className="text-base font-bold text-white">Data Privacy &amp; Account Control (Feature 20)</h3>
        </div>
        <p className="text-xs text-slate-400">
          ClimateReady operates on privacy-first local storage. You retain complete sovereignty over your data and can download a full archive or purge all records with an immediate audit log entry.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportData}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download All Data as JSON</span>
          </button>

          <button
            type="button"
            onClick={handleDeleteAccount}
            className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/60 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account &amp; Purge All Local Data</span>
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-400" />
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Local Audit Log (Compliance &amp; Actions)
            </h4>
          </div>
          <span className="text-[11px] text-slate-500">Last {auditLogs.length} events recorded</span>
        </div>

        <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-800 divide-y divide-slate-800 bg-slate-950/50 text-xs">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-2.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold">
                  {log.action}
                </span>
                <span className="text-slate-300">{log.details}</span>
              </div>
              <span className="text-[10px] text-slate-500 whitespace-nowrap font-mono">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
