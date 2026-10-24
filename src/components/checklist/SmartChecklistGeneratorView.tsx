import React, { useState } from 'react';
import {
  ListChecks,
  Printer,
  Save,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building,
  GraduationCap,
  Users,
  Briefcase,
  Store,
  Sun,
  CloudRain,
  Shield,
  Bell,
  Sparkles,
} from 'lucide-react';
import { TargetAudience, PlanHazard, PlanTaskItem, GeneratedActionPlan } from '../../types';

interface SmartChecklistGeneratorViewProps {
  onSavePlan: (plan: GeneratedActionPlan) => void;
}

export const SmartChecklistGeneratorView: React.FC<SmartChecklistGeneratorViewProps> = ({
  onSavePlan,
}) => {
  const [audience, setAudience] = useState<TargetAudience>('household');
  const [hazard, setHazard] = useState<PlanHazard>('combined');
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Dynamic template generator
  const generateTasksForSelection = (aud: TargetAudience, haz: PlanHazard): PlanTaskItem[] => {
    const tasks: PlanTaskItem[] = [];

    // BEFORE Phase
    if (haz === 'heat' || haz === 'combined') {
      tasks.push({
        id: 'b-1',
        phase: 'before',
        title: aud === 'school' ? 'Install UV Shade Cloth over Assembly Ground' : 'Store 5L Potable Water & ORS Sachets per Person',
        explanation: 'Guarantees critical hydration reserve before ambient temperatures exceed 40°C.',
        priority: 'high',
        estTime: '30 mins',
        isCompleted: true,
      });
      tasks.push({
        id: 'b-2',
        phase: 'before',
        title: 'Fit Bamboo Blinds / Reflective Solar Curtains',
        explanation: 'Shields south- and west-facing windows to suppress indoor solar heat gain by 3–5°C.',
        priority: 'high',
        estTime: '45 mins',
        isCompleted: false,
      });
    }

    if (haz === 'flood' || haz === 'combined') {
      tasks.push({
        id: 'b-3',
        phase: 'before',
        title: 'Clear Rooftop Silt & Drainage Grates',
        explanation: 'Removes leaves and silt from parapet spouts to prevent structural pooling and ceiling leakage.',
        priority: 'high',
        estTime: '20 mins',
        isCompleted: true,
      });
      tasks.push({
        id: 'b-4',
        phase: 'before',
        title: aud === 'business' ? 'Elevate POS Terminals & Stock Above 3ft Flood Line' : 'Seal Deeds & Aadhaar Cards in Waterproof Zip Pouches',
        explanation: 'Prevents irreparable document loss or commercial inventory destruction from street runoff.',
        priority: 'high',
        estTime: '25 mins',
        isCompleted: false,
      });
    }

    // DURING Phase
    if (haz === 'heat' || haz === 'combined') {
      tasks.push({
        id: 'd-1',
        phase: 'during',
        title: 'Enforce Mandatory Hourly Hydration Bells',
        explanation: 'Ensures seniors, children, and workers drink clean fluids before thirst sensations onset.',
        priority: 'high',
        estTime: 'Hourly',
        isCompleted: false,
      });
      tasks.push({
        id: 'd-2',
        phase: 'during',
        title: 'Reschedule Outdoor Physical Activity to Early Morning',
        explanation: 'Avoid direct solar exertion during peak UV/thermal window (11:00 AM – 4:00 PM).',
        priority: 'high',
        estTime: 'Immediate',
        isCompleted: false,
      });
    }

    if (haz === 'flood' || haz === 'combined') {
      tasks.push({
        id: 'd-3',
        phase: 'during',
        title: 'Switch Off Ground-Level Main Circuit Breaker',
        explanation: 'Immediately eliminates deadly electrocution risks if water ingress approaches threshold.',
        priority: 'high',
        estTime: 'Immediate',
        isCompleted: false,
      });
      tasks.push({
        id: 'd-4',
        phase: 'during',
        title: 'Evacuate to Verified High-Ground Shelter via Designated Route',
        explanation: 'Follow static NDMA/SDMA guidelines; never wade through flooded subways with unseen manholes.',
        priority: 'high',
        estTime: '30 mins',
        isCompleted: false,
      });
    }

    // AFTER Phase
    tasks.push({
      id: 'a-1',
      phase: 'after',
      title: 'Boil All Tap & Sump Water for Minimum 3 Minutes',
      explanation: 'Flood surges frequently breach underground municipal potable pipes with sewage contamination.',
      priority: 'high',
      estTime: '15 mins',
      isCompleted: false,
    });
    tasks.push({
      id: 'a-2',
      phase: 'after',
      title: 'Photograph & Document Structural Damage for Relief / Insurance',
      explanation: 'Document watermarks, cracked masonry, and equipment damage before clean-up begins.',
      priority: 'medium',
      estTime: '30 mins',
      isCompleted: false,
    });

    return tasks;
  };

  const [currentTasks, setCurrentTasks] = useState<PlanTaskItem[]>(
    generateTasksForSelection('household', 'combined')
  );

  const handleAudienceChange = (newAudience: TargetAudience) => {
    setAudience(newAudience);
    setCurrentTasks(generateTasksForSelection(newAudience, hazard));
  };

  const handleHazardChange = (newHazard: PlanHazard) => {
    setHazard(newHazard);
    setCurrentTasks(generateTasksForSelection(audience, newHazard));
  };

  const toggleTask = (id: string) => {
    setCurrentTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const handleSave = () => {
    const newPlan: GeneratedActionPlan = {
      id: `plan-${Date.now()}`,
      title: `${audience.toUpperCase()} Climate Preparedness Plan (${hazard.toUpperCase()})`,
      audience,
      hazard,
      createdAt: new Date().toISOString(),
      tasks: currentTasks,
    };
    onSavePlan(newPlan);
    setSavedNotice('Plan successfully saved to your profile and active storage!');
    setTimeout(() => setSavedNotice(null), 3500);
  };

  const completedCount = currentTasks.filter((t) => t.isCompleted).length;
  const progressPercent = Math.round((completedCount / currentTasks.length) * 100);

  const AUDIENCE_OPTIONS: Array<{ id: TargetAudience; label: string; icon: any }> = [
    { id: 'household', label: 'Family / Household', icon: Users },
    { id: 'school', label: 'School / College', icon: GraduationCap },
    { id: 'business', label: 'Small Business / Shop', icon: Store },
    { id: 'outdoor_worker', label: 'Outdoor / Field Worker', icon: Briefcase },
    { id: 'community_org', label: 'Community Org / RWA', icon: Building },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <ListChecks className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Smart Preparedness Checklist Generator</h2>
              <p className="text-xs text-slate-400">
                Generate phased (Before, During, After) actionable disaster protocols for your target group
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4 text-teal-400" />
            <span>Print Checklist</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-teal-900/30 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Action Plan</span>
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Selectors Card */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        {/* Step 1: Target Audience */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Step 1: Select Target Audience
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {AUDIENCE_OPTIONS.map((item) => {
              const Icon = item.icon;
              const isSelected = audience === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleAudienceChange(item.id)}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    isSelected
                      ? 'bg-teal-950/60 border-teal-500 text-white ring-1 ring-teal-500/50 shadow-sm'
                      : 'bg-slate-850 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-teal-400' : 'text-slate-400'}`} />
                  <span className="text-xs font-semibold leading-tight">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Hazard Type */}
        <div className="pt-2 border-t border-slate-800">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Step 2: Select Hazard Focus
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'heat' as PlanHazard, label: 'Heatwave Resilience', icon: Sun, color: 'text-amber-400' },
              { id: 'flood' as PlanHazard, label: 'Monsoon & Flood Safety', icon: CloudRain, color: 'text-sky-400' },
              { id: 'combined' as PlanHazard, label: 'Combined Climate Multi-Hazard', icon: Shield, color: 'text-emerald-400' },
            ].map((haz) => {
              const Icon = haz.icon;
              const isSelected = hazard === haz.id;
              return (
                <button
                  key={haz.id}
                  type="button"
                  onClick={() => handleHazardChange(haz.id)}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-teal-500 text-white ring-1 ring-teal-500/50'
                      : 'bg-slate-850 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${haz.color}`} />
                  <span className="text-xs font-bold text-left">{haz.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <span>Preparedness Progress: <strong>{completedCount} of {currentTasks.length} Completed</strong></span>
        </div>
        <div className="w-48 bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-teal-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="font-mono text-xs font-bold text-teal-400">{progressPercent}%</span>
      </div>

      {/* Phased Tasks Display */}
      {(['before', 'during', 'after'] as const).map((phase) => {
        const phaseTasks = currentTasks.filter((t) => t.phase === phase);
        if (phaseTasks.length === 0) return null;

        const phaseLabels = {
          before: { title: 'BEFORE THE EMERGENCY: Preparation & Prevention', color: 'text-teal-400 border-teal-800' },
          during: { title: 'DURING THE EVENT: Immediate Safety & Life Preservation', color: 'text-amber-400 border-amber-800' },
          after: { title: 'AFTER THE EMERGENCY: Safe Recovery & Sanitation', color: 'text-sky-400 border-sky-800' },
        };

        return (
          <div key={phase} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <h3 className={`text-xs font-bold uppercase tracking-wider pb-2 border-b border-slate-800 ${phaseLabels[phase].color}`}>
              {phaseLabels[phase].title}
            </h3>

            <div className="space-y-2.5">
              {phaseTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                    task.isCompleted
                      ? 'bg-slate-850/50 border-slate-800 opacity-60'
                      : 'bg-slate-850 border-slate-700/80 hover:border-slate-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => toggleTask(task.id)}
                    className="mt-1 w-4 h-4 rounded text-teal-600 bg-slate-800 border-slate-600 focus:ring-teal-500 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs sm:text-sm font-semibold ${task.isCompleted ? 'line-through text-slate-500' : 'text-white'}`}>
                        {task.title}
                      </span>
                      {task.priority === 'high' && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-900 font-bold uppercase">
                          High
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {task.estTime}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-snug">{task.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
