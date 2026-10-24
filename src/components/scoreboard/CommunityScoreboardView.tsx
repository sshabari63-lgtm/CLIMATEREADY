import React, { useState } from 'react';
import {
  Users,
  Award,
  CheckCircle2,
  TrendingUp,
  Shield,
  MapPin,
  Flame,
  Droplets,
  Trophy,
  AlertTriangle,
} from 'lucide-react';
import { DEMO_COMMUNITY_METRICS } from '../../data/constants';
import { CommunityMetric } from '../../types';

export const CommunityScoreboardView: React.FC = () => {
  const [communities, setCommunities] = useState<CommunityMetric[]>(DEMO_COMMUNITY_METRICS);
  const [selectedCommunityId, setSelectedCommunityId] = useState(DEMO_COMMUNITY_METRICS[0].id);

  const selectedCommunity = communities.find((c) => c.id === selectedCommunityId) || communities[0];

  const totalTasksAll = communities.reduce((acc, c) => acc + c.tasksCompleted, 0);
  const totalReportsAll = communities.reduce((acc, c) => acc + c.reportsCount, 0);
  const totalResolvedAll = communities.reduce((acc, c) => acc + c.resolvedReports, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Community Resilience Scoreboard (Section 10)</h2>
              <p className="text-xs text-slate-400">
                Track collective disaster preparedness milestones, verified problem resolutions, and peer challenges
              </p>
            </div>
          </div>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 font-semibold border border-teal-500/20">
          Sample Demonstration Communities
        </span>
      </div>

      {/* High-level Aggregate Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-slate-850 border border-slate-700/80 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Total Tasks Completed
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{totalTasksAll.toLocaleString()}</span>
            <span className="text-xs text-emerald-400 font-semibold">+18% this month</span>
          </div>
          <p className="text-[11px] text-slate-400">Verified household &amp; community preparedness actions.</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-850 border border-slate-700/80 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-sky-400" />
            Community Reports Logged
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{totalReportsAll}</span>
            <span className="text-xs text-slate-400 font-semibold">citizen incidents</span>
          </div>
          <p className="text-[11px] text-slate-400">Drainage chokes, extreme heat islands, and waterlogging.</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-850 border border-slate-700/80 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-teal-400" />
            Verified Problem Resolutions
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{totalResolvedAll}</span>
            <span className="text-xs text-teal-400 font-semibold">({Math.round((totalResolvedAll / totalReportsAll) * 100)}% resolved)</span>
          </div>
          <p className="text-[11px] text-slate-400">Cleared drains and shaded rest canopies erected.</p>
        </div>
      </div>

      {/* Community Selector & Comparison */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
          Compare Participating Municipal Communities
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {communities.map((com) => {
            const isSelected = com.id === selectedCommunityId;
            return (
              <button
                key={com.id}
                type="button"
                onClick={() => setSelectedCommunityId(com.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-teal-950/40 border-teal-500 text-white ring-1 ring-teal-500/50 shadow-md'
                    : 'bg-slate-850 border-slate-700/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-sm text-white">{com.name}</h4>
                  <span className="text-xs font-mono font-bold text-teal-400">
                    {com.resilienceScore}/100
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{com.region} • Pop: {com.population}</p>
                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
                  <span>{com.tasksCompleted} Tasks</span>
                  <span>{com.resolvedReports} Resolved</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Community Active Challenges */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Active Community Challenges in {selectedCommunity.name}:
            </h4>
            <span className="text-xs text-slate-400">Public Resilience Drills</span>
          </div>

          <div className="space-y-3">
            {selectedCommunity.activeChallenges.map((ch) => (
              <div key={ch.id} className="p-3.5 bg-slate-850 rounded-xl border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{ch.title}</span>
                  <span className="font-mono text-teal-400 font-bold">{ch.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-500"
                    style={{ width: `${ch.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
