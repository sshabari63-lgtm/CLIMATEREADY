import React, { useState, useEffect } from 'react';
import {
  Users,
  AlertTriangle,
  Plus,
  MapPin,
  Clock,
  CheckCircle,
  Filter,
  Send,
  Droplets,
  Flame,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { CommunityReport } from '../../types';

interface CommunityReportsViewProps {
  onReportAdded?: () => void;
  activeLocationName?: string;
  activeLat?: number;
  activeLon?: number;
}

export const CommunityReportsView: React.FC<CommunityReportsViewProps> = ({
  onReportAdded,
  activeLocationName = 'Chennai Central',
  activeLat = 13.0827,
  activeLon = 80.2707,
}) => {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  // Submit form state
  const [reportType, setReportType] = useState<CommunityReport['type']>('waterlogging');
  const [locName, setLocName] = useState(activeLocationName);
  const [lat, setLat] = useState(activeLat);
  const [lon, setLon] = useState(activeLon);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/community-reports');
      const data = await res.json();
      setReports(data.reports || []);
    } catch (e) {
      console.warn('Failed to load community reports:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/community-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: reportType,
          locationName: locName,
          lat,
          lon,
          description,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitSuccess(data.message || 'Report submitted for moderation!');
        setDescription('');
        setTimeout(() => {
          setShowSubmitModal(false);
          setSubmitSuccess(null);
          fetchReports();
          onReportAdded?.();
        }, 1500);
      }
    } catch {
      alert('Failed to submit report. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReports = filterType === 'all'
    ? reports
    : reports.filter((r) => r.type === filterType);

  const getTypeBadge = (type: CommunityReport['type']) => {
    switch (type) {
      case 'waterlogging':
        return { label: 'Waterlogging / Drain Flood', bg: 'bg-sky-950/70 text-sky-300 border-sky-800' };
      case 'extreme_heat':
        return { label: 'Extreme Heat Island', bg: 'bg-rose-950/70 text-rose-300 border-rose-800' };
      case 'drain_blocked':
        return { label: 'Blocked Inlets / Debris', bg: 'bg-amber-950/70 text-amber-300 border-amber-800' };
      case 'fallen_tree':
        return { label: 'Fallen Tree / Blocked Road', bg: 'bg-emerald-950/70 text-emerald-300 border-emerald-800' };
      default:
        return { label: 'Ground Incident', bg: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Community Climate Reports (Feature 18)</h2>
              <p className="text-xs text-slate-400">
                Peer-contributed, moderated field incidents for localized heat and waterlogging awareness
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowSubmitModal(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-teal-900/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Ground Report</span>
        </button>
      </div>

      {/* Mandatory Disclaimer Callout */}
      <div className="p-4 bg-amber-950/40 border border-amber-900/50 rounded-xl flex items-start gap-3 text-xs text-amber-200">
        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-semibold">User-Reported &amp; Unverified Notice:</strong> All incident posts are crowdsourced community reports. They are labeled as <strong>user-reported and unverified</strong>. Never rely on community pins as official flood inundation boundaries or designated emergency evacuation routes. Personal information is strictly scrubbed.
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-medium flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5 text-teal-400" />
          Filter:
        </span>
        {[
          { id: 'all', label: 'All Reports' },
          { id: 'waterlogging', label: 'Waterlogging' },
          { id: 'extreme_heat', label: 'Extreme Heat' },
          { id: 'drain_blocked', label: 'Blocked Drains' },
          { id: 'fallen_tree', label: 'Fallen Trees' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilterType(f.id)}
            className={`px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-colors ${
              filterType === f.id
                ? 'bg-teal-600/30 border-teal-500/60 text-teal-300'
                : 'bg-slate-850 border-slate-700/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Reports Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((report) => {
          const typeBadge = getTypeBadge(report.type);
          const timeFormatted = new Date(report.timestamp).toLocaleString([], {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={report.id}
              className="p-5 rounded-2xl bg-slate-850 border border-slate-700/80 hover:border-slate-600 transition-all space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${typeBadge.bg}`}>
                    {typeBadge.label}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold uppercase">
                    User-reported, unverified
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>{report.locationName}</span>
                </h4>

                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  "{report.description}"
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {timeFormatted}
                </span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  Moderated
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Report Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-5 py-4 bg-slate-850 border-b border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold text-white text-base">Submit Local Incident Report</h3>
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {submitSuccess ? (
                <div className="p-4 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-center text-xs space-y-2">
                  <CheckCircle className="w-8 h-8 mx-auto text-emerald-400" />
                  <p className="font-semibold">{submitSuccess}</p>
                  <p className="text-slate-300">To maintain accuracy, submissions are queued for admin moderation before public display.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Incident Category
                    </label>
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value as any)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                    >
                      <option value="waterlogging">Waterlogging / Street Flooding</option>
                      <option value="extreme_heat">Extreme Heat Island / No Water Access</option>
                      <option value="drain_blocked">Blocked Storm Drain / Debris</option>
                      <option value="fallen_tree">Fallen Tree / Power Line Hazard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Location / Landmark Name
                    </label>
                    <input
                      type="text"
                      value={locName}
                      onChange={(e) => setLocName(e.target.value)}
                      placeholder="e.g. Near Velachery Railway Bridge"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-slate-400">Latitude</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={lat}
                        onChange={(e) => setLat(parseFloat(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400">Longitude</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={lon}
                        onChange={(e) => setLon(parseFloat(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Field Notes (Keep factual, no personal phone numbers or names)
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g. Water is 8 inches deep under the bridge; vehicles moving slowly. Drain outlet clogged with tree branches."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-teal-500"
                      required
                    />
                  </div>

                  <div className="text-[11px] text-slate-400 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700">
                    * By submitting, you agree this report will be displayed publicly as <strong>unverified</strong> following moderation.
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowSubmitModal(false)}
                      className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-teal-900/30"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submitting ? 'Submitting...' : 'Submit for Moderation'}</span>
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
