import React, { useState } from 'react';
import {
  X,
  Play,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MapPin,
  ShieldCheck,
  FileCheck,
  ListChecks,
  AlertTriangle,
  Award,
} from 'lucide-react';

interface HackathonDemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStepTab: (tab: string) => void;
  onResetDemo: () => void;
}

const DEMO_STEPS = [
  {
    step: 1,
    title: 'Select a Sample Community',
    desc: 'Switch between demonstration wards (Chennai Central, Madurai Heat Resilience, Coimbatore Urban) to evaluate local climate metrics.',
    targetTab: 'dashboard',
    cta: 'Go to Dashboard & Location Picker',
  },
  {
    step: 2,
    title: 'Review Climate Preparedness Dashboard',
    desc: 'Audit real-time Open-Meteo forecasts, Heat Risk Scores, Flood Risk Scores, and personalized checklist readiness.',
    targetTab: 'dashboard',
    cta: 'View Live Dashboard Overview',
  },
  {
    step: 3,
    title: 'Complete a Climate Readiness Assessment',
    desc: 'Take the 7-dimension interactive audit (water reserve, 112 helplines, first-aid, passive cooling) to compute a transparent score.',
    targetTab: 'assessment',
    cta: 'Open Readiness Assessment',
  },
  {
    step: 4,
    title: 'Run Climate Preparedness Twin Simulation',
    desc: 'Stress test your household or school against hypothetical 120mm torrential flooding or 45°C heat dome scenarios.',
    targetTab: 'twin',
    cta: 'Launch Climate Twin Simulator',
  },
  {
    step: 5,
    title: 'Generate Personalized Preparedness Checklist',
    desc: 'Produce phased Before, During, and After actionable protocols tailored for households, schools, or outdoor workers.',
    targetTab: 'checklist_gen',
    cta: 'Open Smart Checklist Generator',
  },
  {
    step: 6,
    title: 'Submit a Sample Community Ground Report',
    desc: 'Submit a hyper-local street waterlogging or extreme heat report, receive reference ID CR-2026-XXXX, and review moderation.',
    targetTab: 'community',
    cta: 'View Community Reports',
  },
  {
    step: 7,
    title: 'Review Updated Dashboard & Community Scoreboard',
    desc: 'Verify that completed tasks, earned badges, and community resilience metrics synchronize across the platform.',
    targetTab: 'scoreboard',
    cta: 'Open Community Resilience Scoreboard',
  },
];

export const HackathonDemoTourModal: React.FC<HackathonDemoTourModalProps> = ({
  isOpen,
  onClose,
  onSelectStepTab,
  onResetDemo,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  if (!isOpen) return null;

  const step = DEMO_STEPS[currentStepIdx];

  const handleExecuteStep = () => {
    onSelectStepTab(step.targetTab);
    onClose();
  };

  const handleNext = () => {
    setCurrentStepIdx((prev) => (prev < DEMO_STEPS.length - 1 ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setCurrentStepIdx((prev) => (prev > 0 ? prev - 1 : 0));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-850 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-base">Hackathon Judge Demo Tour</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  Step {step.step} of 7
                </span>
              </div>
              <p className="text-xs text-slate-400">Interactive 7-step guided journey through ClimateReady 2.0</p>
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
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Progress indicators */}
          <div className="flex items-center gap-1.5">
            {DEMO_STEPS.map((s, idx) => (
              <button
                key={s.step}
                type="button"
                onClick={() => setCurrentStepIdx(idx)}
                className={`flex-1 h-2 rounded-full transition-all ${
                  idx === currentStepIdx
                    ? 'bg-emerald-500'
                    : idx < currentStepIdx
                    ? 'bg-emerald-800'
                    : 'bg-slate-800'
                }`}
                title={`Step ${s.step}: ${s.title}`}
              />
            ))}
          </div>

          {/* Current Step Card */}
          <div className="p-5 rounded-2xl bg-slate-850 border border-slate-700/80 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center border border-emerald-500/40">
                {step.step}
              </span>
              <h4 className="font-bold text-base text-white">{step.title}</h4>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {step.desc}
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleExecuteStep}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-950/40 transition-all cursor-pointer"
              >
                <span>{step.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Reset Demo Option */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Restore demo to original benchmark state:</span>
            <button
              type="button"
              onClick={() => {
                onResetDemo();
                alert('Demo benchmarks restored! All sample community metrics and checklists reset.');
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 font-medium flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo State</span>
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="px-5 py-4 bg-slate-850 border-t border-slate-700 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white disabled:opacity-30"
          >
            Previous
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentStepIdx === DEMO_STEPS.length - 1}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold disabled:opacity-30"
          >
            Next Step ({currentStepIdx + 2}/7)
          </button>
        </div>
      </div>
    </div>
  );
};
