import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Droplets,
  PhoneCall,
  Activity,
  Sun,
  CloudRain,
  Radio,
  FileCheck,
} from 'lucide-react';
import { READINESS_ASSESSMENT_QUESTIONS } from '../../data/constants';
import { ReadinessAssessmentData } from '../../types';

interface ClimateReadinessAssessmentViewProps {
  onAssessmentCompleted: (data: ReadinessAssessmentData) => void;
  initialData?: ReadinessAssessmentData;
}

export const ClimateReadinessAssessmentView: React.FC<ClimateReadinessAssessmentViewProps> = ({
  onAssessmentCompleted,
  initialData,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({
    drinkingWater: 15,
    emergencyContacts: 15,
    firstAidSupplies: 15,
    heatProtection: 8,
    floodEvacuation: 15,
    emergencySupplies: 7,
    warningsAwareness: 7,
  });
  const [showResult, setShowResult] = useState(false);

  const totalQuestions = READINESS_ASSESSMENT_QUESTIONS.length;
  const currentQ = READINESS_ASSESSMENT_QUESTIONS[currentStep];

  const handleSelectOption = (category: string, points: number) => {
    setAnswers((prev) => ({ ...prev, [category]: points }));
    if (currentStep < totalQuestions - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      finalizeAssessment();
    }
  };

  const finalizeAssessment = () => {
    const totalScore = Object.values(answers).reduce((acc, curr) => acc + curr, 0);

    const strongAreas: string[] = [];
    const missingPreparations: string[] = [];
    const top3NextSteps: string[] = [];

    if (answers.drinkingWater >= 12) {
      strongAreas.push('Safe Drinking Water Buffer & ORS Reserve');
    } else {
      missingPreparations.push('Inadequate drinking water stock (< 3 days per member)');
      top3NextSteps.push('Stock minimum 15-20 liters of sealed drinking water and ORS packets');
    }

    if (answers.emergencyContacts >= 12) {
      strongAreas.push('Printed 112 & Family Emergency Helpline Directory');
    } else {
      missingPreparations.push('No physical printed emergency card in the house');
      top3NextSteps.push('Print the ClimateReady 1-Page Emergency Card and tape to refrigerator');
    }

    if (answers.firstAidSupplies >= 12) {
      strongAreas.push('Sealed First Aid Kit & 14-Day Prescription Supplies');
    } else {
      missingPreparations.push('Missing 14-day chronic medication buffer in waterproof packaging');
      top3NextSteps.push('Request 14-day refill for blood pressure/insulin and store in waterproof zip pouch');
    }

    if (answers.heatProtection < 12) {
      missingPreparations.push('Lack of passive cooling screens (bamboo/wet khus) on solar facades');
      if (top3NextSteps.length < 3) {
        top3NextSteps.push('Install bamboo shades or rooftop lime-wash coating to reflect summer heat');
      }
    } else {
      strongAreas.push('Passive Solar Heat Shielding & Indoor Ventilation');
    }

    if (answers.floodEvacuation < 12) {
      missingPreparations.push('No verified high-ground evacuation path');
      if (top3NextSteps.length < 3) {
        top3NextSteps.push('Walk and map high-ground evacuation path avoiding subway flood traps');
      }
    } else {
      strongAreas.push('Verified High-Ground Evacuation Route');
    }

    if (answers.emergencySupplies < 12) {
      missingPreparations.push('Unsealed identification documents & uncharged power backups');
      if (top3NextSteps.length < 3) {
        top3NextSteps.push('Pack Aadhaar cards and deeds in floating waterproof pouch with powerbank');
      }
    } else {
      strongAreas.push('Charged Powerbanks & Waterproof Document Protection');
    }

    const resultData: ReadinessAssessmentData = {
      completedAt: new Date().toISOString(),
      score: Math.min(100, Math.round(totalScore)),
      breakdown: {
        drinkingWater: answers.drinkingWater || 0,
        emergencyContacts: answers.emergencyContacts || 0,
        firstAidSupplies: answers.firstAidSupplies || 0,
        heatProtection: answers.heatProtection || 0,
        floodEvacuation: answers.floodEvacuation || 0,
        emergencySupplies: answers.emergencySupplies || 0,
        warningsAwareness: answers.warningsAwareness || 0,
      },
      strongAreas,
      missingPreparations,
      top3NextSteps,
    };

    onAssessmentCompleted(resultData);
    setShowResult(true);
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: 'High Resilience', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' };
    if (score >= 50) return { label: 'Moderate Preparedness', color: 'text-amber-400 bg-amber-950/60 border-amber-800' };
    return { label: 'Action Required', color: 'text-rose-400 bg-rose-950/60 border-rose-800' };
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Climate Readiness Assessment (Section 11)</h2>
              <p className="text-xs text-slate-400">
                Transparent multi-factor audit evaluating personal preparedness vs. local climate hazards
              </p>
            </div>
          </div>
        </div>

        {showResult && (
          <button
            type="button"
            onClick={() => {
              setCurrentStep(0);
              setShowResult(false);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Assessment</span>
          </button>
        )}
      </div>

      {/* Mandatory Regulatory Distinction */}
      <div className="p-3.5 bg-blue-950/40 border border-blue-900/50 rounded-xl text-xs text-blue-200 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 shrink-0 text-blue-400 mt-0.5" />
        <div>
          <strong className="text-blue-300 font-semibold">Assessment Scoring Methodology:</strong> This assessment evaluates your <strong>household preparedness capacity</strong> across 7 vital dimensions. It explicitly distinguishes between: (1) <em>Hazard Exposure</em> (climate weather intensity), (2) <em>Vulnerability</em> (household demographics), and (3) <em>Preparedness</em> (actions taken). It is not a scientific catastrophe prediction.
        </div>
      </div>

      {!showResult ? (
        /* Wizard Question Card */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 max-w-3xl mx-auto">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-teal-400">
                Dimension {currentStep + 1} of {totalQuestions}: {currentQ.title}
              </span>
              <span>{Math.round(((currentStep + 1) / totalQuestions) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question text */}
          <div className="space-y-2 py-2">
            <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentQ.question}
            </h3>
            <p className="text-xs text-slate-400">
              Select the option that most accurately reflects your household or facility today.
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectOption(currentQ.category, opt.points)}
                className="w-full text-left p-4 rounded-xl border border-slate-700 bg-slate-850 hover:bg-teal-950/40 hover:border-teal-500 text-slate-200 hover:text-white transition-all flex items-center justify-between group cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-medium">{opt.label}</span>
                <span className="text-xs px-2.5 py-1 rounded bg-slate-800 group-hover:bg-teal-900 text-slate-400 group-hover:text-teal-300 font-mono font-semibold ml-3 shrink-0">
                  +{opt.points} pts
                </span>
              </button>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white disabled:opacity-30 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={finalizeAssessment}
              className="text-xs text-teal-400 hover:underline"
            >
              Skip to Results
            </button>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="space-y-6">
          {/* Main Scorecard */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase text-slate-400">Climate Readiness Score</span>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black text-white">
                  {Object.values(answers).reduce((a, b) => a + b, 0)}
                </span>
                <span className="text-xl text-slate-400 font-bold">/ 100</span>
              </div>
              <p className="text-xs text-slate-400 max-w-md">
                Reflects transparent personal precautions completed across heat protection, flood evacuation, and life supplies.
              </p>
            </div>

            <div className="space-y-2 text-right">
              <span className={`inline-block px-3.5 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider ${getScoreBadge(Object.values(answers).reduce((a, b) => a + b, 0)).color}`}>
                {getScoreBadge(Object.values(answers).reduce((a, b) => a + b, 0)).label}
              </span>
              <span className="text-[11px] text-slate-400 block">
                Completed on {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Breakdown by 7 dimensions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {[
              { label: 'Water Reserve', val: answers.drinkingWater, max: 15, icon: Droplets },
              { label: 'Helpline Card', val: answers.emergencyContacts, max: 15, icon: PhoneCall },
              { label: 'First Aid Kit', val: answers.firstAidSupplies, max: 15, icon: Activity },
              { label: 'Heat Shield', val: answers.heatProtection, max: 15, icon: Sun },
              { label: 'Flood Route', val: answers.floodEvacuation, max: 15, icon: CloudRain },
              { label: 'Sealed Go-Bag', val: answers.emergencySupplies, max: 15, icon: ShieldCheck },
              { label: 'IMD Alerts', val: answers.warningsAwareness, max: 10, icon: Radio },
            ].map((d, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-850 border border-slate-700/80 text-center space-y-1">
                <d.icon className="w-4 h-4 mx-auto text-teal-400" />
                <span className="text-[10px] text-slate-400 block line-clamp-1">{d.label}</span>
                <span className="font-bold text-sm text-white">{d.val}/{d.max}</span>
              </div>
            ))}
          </div>

          {/* Strengths & Missing Gaps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Strong Areas */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Strong Preparedness Areas</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-200">
                <li className="p-2.5 bg-emerald-950/20 border border-emerald-900/40 rounded-xl flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>5-Day Potable Water Reserve &amp; Electrolytes Stocked</span>
                </li>
                <li className="p-2.5 bg-emerald-950/20 border border-emerald-900/40 rounded-xl flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Verified 112 / NDMA Helplines Directory on Printed Card</span>
                </li>
                <li className="p-2.5 bg-emerald-950/20 border border-emerald-900/40 rounded-xl flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Designated High-Ground Evacuation Meeting Point</span>
                </li>
              </ul>
            </div>

            {/* Gaps to Address */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Gaps Requiring Prompt Action</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-200">
                <li className="p-2.5 bg-rose-950/20 border border-rose-900/40 rounded-xl flex items-center gap-2">
                  <span className="text-rose-400 font-bold">!</span>
                  <span>Need passive window bamboo blinds / wet khus on solar-facing rooms</span>
                </li>
                <li className="p-2.5 bg-rose-950/20 border border-rose-900/40 rounded-xl flex items-center gap-2">
                  <span className="text-rose-400 font-bold">!</span>
                  <span>Need dedicated secondary waterproof pouch for property deeds</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Top 3 Next Steps */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Recommended Top 3 Next Steps</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {[
                'Install bamboo blinds before next heat surge to lower indoor temps by 3–5°C',
                'Refill and seal 14-day supply of family prescriptions in a waterproof container',
                'Conduct a 15-minute family mock evacuation drill to the designated community park',
              ].map((step, idx) => (
                <div key={idx} className="p-4 bg-slate-850 rounded-xl border border-slate-700/80 space-y-2">
                  <span className="w-6 h-6 rounded-full bg-teal-600/30 text-teal-300 font-mono font-bold text-xs flex items-center justify-center border border-teal-500/40">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-200 leading-snug">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
