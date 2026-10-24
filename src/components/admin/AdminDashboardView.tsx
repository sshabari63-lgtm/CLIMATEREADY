import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Bot,
  Map,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Trash2,
  Activity,
  Layers,
} from 'lucide-react';
import { CommunityReport } from '../../types';

export const AdminDashboardView: React.FC = () => {
  const [stats, setStats] = useState<{
    assistantQueries: number;
    totalReports: number;
    pendingReports: number;
    featureFlags: { enableGoogleMaps: boolean; enableAIAssistant: boolean };
  }>({
    assistantQueries: 0,
    totalReports: 0,
    pendingReports: 0,
    featureFlags: { enableGoogleMaps: false, enableAIAssistant: true },
  });

  const [allReports, setAllReports] = useState<CommunityReport[]>([]);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, reportsRes, healthRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/reports'),
        fetch('/api/health'),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (reportsRes.ok) {
        const d = await reportsRes.json();
        setAllReports(d.reports || []);
      }
      if (healthRes.ok) setHealthStatus(await healthRes.json());
    } catch (e) {
      console.warn('Failed to fetch admin telemetry:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleFlag = async (flag: 'enableGoogleMaps' | 'enableAIAssistant') => {
    const updated = {
      ...stats.featureFlags,
      [flag]: !stats.featureFlags[flag],
    };
    try {
      const res = await fetch('/api/admin/flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setStats((prev) => ({ ...prev, featureFlags: updated }));
        setNotice(`Feature flag "${flag}" updated.`);
        setTimeout(() => setNotice(null), 3000);
      }
    } catch {
      alert('Failed to update feature flag on server.');
    }
  };

  const handleModerate = async (reportId: string, action: 'approve' | 'reject' | 'delete') => {
    try {
      const res = await fetch(`/api/admin/reports/${reportId}/moderate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        const d = await res.json();
        setAllReports(d.reports || []);
        fetchData();
      }
    } catch {
      alert('Moderation action failed.');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Admin Hub &amp; Operations Center (Section 20)</h2>
              <p className="text-xs text-slate-400">
                Feature flag controls, community moderation queue, and live API connectivity diagnostics
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchData}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {notice && (
        <div className="p-3 bg-teal-950/60 border border-teal-800 text-teal-300 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-teal-400" />
          <span>{notice}</span>
        </div>
      )}

      {/* Stats & Feature Flags Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Assistant Usage Statistics */}
        <div className="p-5 rounded-2xl bg-slate-850 border border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              AI Guide Telemetry
            </span>
            <Bot className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.assistantQueries}</span>
            <span className="text-xs text-slate-400">user queries processed</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Usage counts tracked anonymously. Zero prompt/chat text logged to disk.
          </p>
        </div>

        {/* Feature Flag: Google Maps */}
        <div className="p-5 rounded-2xl bg-slate-850 border border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Google Maps Provider
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
              Beta / Temp
            </span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-semibold text-white">Enable Provider Toggle</span>
            <button
              type="button"
              onClick={() => handleToggleFlag('enableGoogleMaps')}
              className={`w-12 h-6 rounded-full transition-colors p-0.5 relative ${
                stats.featureFlags.enableGoogleMaps ? 'bg-teal-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  stats.featureFlags.enableGoogleMaps ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            When disabled, UI hides Google Maps and locks to default OpenStreetMap.
          </p>
        </div>

        {/* Feature Flag: AI Assistant */}
        <div className="p-5 rounded-2xl bg-slate-850 border border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              AI Assistant Service
            </span>
            <Bot className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-semibold text-white">Assistant Enabled</span>
            <button
              type="button"
              onClick={() => handleToggleFlag('enableAIAssistant')}
              className={`w-12 h-6 rounded-full transition-colors p-0.5 relative ${
                stats.featureFlags.enableAIAssistant ? 'bg-teal-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  stats.featureFlags.enableAIAssistant ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            If turned off, users are redirected automatically to offline FAQ Help Center.
          </p>
        </div>
      </div>

      {/* API Health Checks */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-400" />
          <h3 className="text-base font-bold text-white">Live Service Health Checks (Section 20)</h3>
        </div>

        {healthStatus ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Open-Meteo */}
            <div className="p-4 bg-slate-850 rounded-xl border border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Open-Meteo API</span>
                <span
                  className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                    healthStatus.services.openMeteo.status === 'operational'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}
                >
                  {healthStatus.services.openMeteo.status}
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">Primary weather &amp; flood forecast pipeline</p>
            </div>

            {/* Gemini */}
            <div className="p-4 bg-slate-850 rounded-xl border border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Gemini 3.8 / 3 Pro</span>
                <span
                  className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                    healthStatus.services.geminiAI.status === 'operational'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  {healthStatus.services.geminiAI.status}
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">Server-side assistant, TTS &amp; poster engine</p>
            </div>

            {/* Maps */}
            <div className="p-4 bg-slate-850 rounded-xl border border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Google Maps Status</span>
                <span
                  className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                    healthStatus.services.googleMaps.status === 'operational'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {healthStatus.services.googleMaps.status}
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">Active Map: {healthStatus.services.googleMaps.activeProvider}</p>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-500">Checking remote endpoints...</div>
        )}
      </div>

      {/* Moderation Queue for Community Reports */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-bold text-white">Community Report Moderation Queue</h3>
          </div>
          <span className="text-xs text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-900 font-medium">
            {allReports.filter((r) => r.status === 'pending').length} Pending Review
          </span>
        </div>

        <div className="space-y-3">
          {allReports.map((report) => (
            <div
              key={report.id}
              className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{report.locationName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {report.type}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      report.status === 'approved'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : report.status === 'rejected'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {report.status}
                  </span>
                </div>
                <p className="text-slate-300 italic">"{report.description}"</p>
                <span className="text-[10px] text-slate-500 font-mono">
                  Coordinates: ({report.lat}, {report.lon}) • {new Date(report.timestamp).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {report.status !== 'approved' && (
                  <button
                    type="button"
                    onClick={() => handleModerate(report.id, 'approve')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center gap-1 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                )}
                {report.status !== 'rejected' && (
                  <button
                    type="button"
                    onClick={() => handleModerate(report.id, 'reject')}
                    className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium flex items-center gap-1 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleModerate(report.id, 'delete')}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
