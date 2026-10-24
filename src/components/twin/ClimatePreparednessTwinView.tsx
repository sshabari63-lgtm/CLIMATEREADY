import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  Sliders,
  Flame,
  CloudRain,
  ZapOff,
  GraduationCap,
  Car,
  Compass,
} from 'lucide-react';
import {
  SavedLocation,
  ScenarioType,
  ScenarioSeverity,
  ScenarioSimulationResult,
} from '../../types';

interface ClimatePreparednessTwinViewProps {
  locations: SavedLocation[];
  activeLocationId: string;
  onScenarioCompleted?: () => void;
}

export const ClimatePreparednessTwinView: React.FC<ClimatePreparednessTwinViewProps> = ({
  locations,
  activeLocationId,
  onScenarioCompleted,
}) => {
  const [selectedLocId, setSelectedLocId] = useState(activeLocationId);
  const [scenarioType, setScenarioType] = useState<ScenarioType>('heavy_flood');
  const [severity, setSeverity] = useState<ScenarioSeverity>('severe');
  const [selectedResources, setSelectedResources] = useState<string[]>([
    'Battery Backup Inverter',
    '3-Day Potable Water Sump',
    'First Aid Go-Bag',
  ]);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([
    'Elderly Family Members',
    'Ground-Floor Electrical Panel',
  ]);
  const [hasSimulated, setHasSimulated] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [completedActionIds, setCompletedActionIds] = useState<string[]>(['act-1']);

  const currentLocation = locations.find((l) => l.id === selectedLocId) || locations[0];

  const SCENARIOS = [
    {
      id: 'heavy_flood' as ScenarioType,
      title: 'Heavy Rainfall & Severe Road Inundation',
      icon: CloudRain,
      desc: 'Simulate 120mm torrential rainfall causing urban street ponding and basement flooding.',
    },
    {
      id: 'heat_surge' as ScenarioType,
      title: 'Extreme Heat Surge (43°C Ambient / 48°C Heat Index)',
      icon: Flame,
      desc: 'Simulate a 3-day intense heat dome with humid night temperatures exceeding 28°C.',
    },
    {
      id: 'arterial_road_blocked' as ScenarioType,
      title: 'Critical Arterial Road / Evacuation Route Cut Off',
      icon: Car,
      desc: 'Simulate key subway or bridge underpass submergence blocking transit to general hospitals.',
    },
    {
      id: 'power_grid_failure' as ScenarioType,
      title: 'Prolonged Grid Power & Cellular Network Blackout',
      icon: ZapOff,
      desc: 'Simulate a 24-hour storm blackout with water pump failure and cellular base station outage.',
    },
    {
      id: 'school_emergency' as ScenarioType,
      title: 'School / Community Center Evacuation & Shelter',
      icon: GraduationCap,
      desc: 'Simulate emergency lockdown or safe evacuation of 400 students during an abrupt cloudburst.',
    },
  ];

  const RESOURCE_OPTIONS = [
    'Battery Backup Inverter',
    '3-Day Potable Water Sump',
    'First Aid Go-Bag',
    'High-Capacity Power Banks',
    'Waterproof Document Zip Envelopes',
    'Wet Khus / Bamboo Window Blinds',
    'Emergency Whistles & Glow Sticks',
    'Submersible Sump Water Pump',
  ];

  const ASSET_OPTIONS = [
    'Elderly Family Members (Limited Mobility)',
    'Infants / Toddlers Under 4',
    'Ground-Floor Electrical Panel',
    'Underground Drinking Water Sump',
    'Domestic Pets & Livestock Pens',
    'Daily Essential Refrigerated Insulin',
  ];

  const toggleResource = (item: string) => {
    setSelectedResources((prev) =>
      prev.includes(item) ? prev.filter((r) => r !== item) : [...prev, item]
    );
  };

  const toggleAsset = (item: string) => {
    setSelectedAssets((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setHasSimulated(true);
      onScenarioCompleted?.();
    }, 600);
  };

  const toggleActionDone = (id: string) => {
    setCompletedActionIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  // Generate dynamic simulation result based on inputs
  const getSimulationResult = (): ScenarioSimulationResult => {
    if (scenarioType === 'heavy_flood') {
      return {
        scenarioTitle: `Heavy Rainfall & Flash Inundation (${severity.toUpperCase()})`,
        severityLabel:
          severity === 'catastrophic'
            ? 'Catastrophic (180+ mm Cloudburst)'
            : severity === 'severe'
            ? 'Severe (90–130 mm Torrential Downpour)'
            : 'Moderate (45–70 mm Steady Heavy Rain)',
        summary: `In ${currentLocation.name}, a ${severity} flood scenario predicts rapid street runoff within 45 minutes, with lower depression zones experiencing 1.5 to 3.0 feet of water accumulation. Local stormwater inlets risk choking from street debris.`,
        potentialChallenges: [
          'Submersible pumps will fail if municipal power feeder trips as a safety protocol.',
          'Underground drinking water sumps will face sewage runoff backflow unless sealed.',
          'Ground-floor appliances and vehicles in basement parking will sustain direct water immersion damage.',
          'Emergency ambulance routes through low-lying underpasses will be impassable.',
        ],
        requiredResources: [
          'Minimum 4 fully charged 10,000mAh power banks and battery LED lanterns.',
          'Emergency 14-day supply of sealed water bottles and waterproof food rations.',
          'Sandbags or waterproof rubber flood gates at entrance thresholds.',
          'Manual hand-crank siphon pump for clearing indoor threshold pooling.',
        ],
        prioritizedActions: [
          {
            id: 'act-1',
            title: 'Immediate: Move medical kits & legal deeds to highest shelf (Above 4ft line)',
            timeframe: 'immediate_0_2h',
            priority: 'critical',
            isDone: completedActionIds.includes('act-1'),
            notes: 'Prevents irreparable damage to Aadhaar cards, property titles, and prescriptions.',
          },
          {
            id: 'act-2',
            title: 'Immediate: Seal drinking water sump inlet lid with heavy plastic wrap and tape',
            timeframe: 'immediate_0_2h',
            priority: 'critical',
            isDone: completedActionIds.includes('act-2'),
            notes: 'Avoids gastrointestinal epidemics caused by floodwater entering potable reserves.',
          },
          {
            id: 'act-3',
            title: 'Short-term: Move vehicle to designated elevated civic flyover or multi-tier garage',
            timeframe: 'short_term_2_12h',
            priority: 'high',
            isDone: completedActionIds.includes('act-3'),
            notes: 'Ensures mobility remains intact for post-storm evacuation.',
          },
          {
            id: 'act-4',
            title: 'Recovery: Do not switch main electrical breaker back on until wiring is thoroughly dry',
            timeframe: 'recovery_12_48h',
            priority: 'high',
            isDone: completedActionIds.includes('act-4'),
            notes: 'Prevents electrical fires and electrocution.',
          },
        ],
        questionsForAuthorities: [
          'Has the Greater Municipal Corporation scheduled de-silting of the nearest arterial canal?',
          'What is the designated flood relief camp with standby medical staff for this ward?',
          'Is the local sub-station planned for pre-emptive load shedding during heavy surges?',
        ],
        beforeAfterComparison: {
          withoutPreparedness: [
            'Electrical short circuits, total loss of power banks within 4 hours.',
            'Drinking water contaminated with street runoff, leading to dehydration.',
            'Stranded on ground floor with panic evacuation under dark torrential rain.',
          ],
          withPreparedness: [
            'Sealed drinking water reserve remains 100% sterile for 5 days.',
            'Critical documents & communications remain operational on upper floor.',
            'Family evacuated safely along verified high-ground path well before inundation peaked.',
          ],
        },
      };
    } else if (scenarioType === 'heat_surge') {
      return {
        scenarioTitle: `Extreme Heat Dome Surge (${severity.toUpperCase()})`,
        severityLabel:
          severity === 'catastrophic'
            ? 'Catastrophic (45°C Air / 50°C Heat Index)'
            : severity === 'severe'
            ? 'Severe (42°C Air / 46°C Heat Index)'
            : 'Moderate (38°C Air / 42°C Heat Index)',
        summary: `For ${currentLocation.name}, a ${severity} heatwave will stress the cardiovascular system within 20 minutes of outdoor exertion. High humidity impedes evaporative cooling through sweat.`,
        potentialChallenges: [
          'Peak thermal exhaustion risk between 11:30 AM and 4:30 PM.',
          'High demand triggers rolling brownouts, knocking out ceiling fans and air conditioning.',
          'Vulnerable household members (elderly, infants) dehydrate rapidly without thirst signals.',
        ],
        requiredResources: [
          'Minimum 5 liters clean drinking water per person per day stored in earthenware pots.',
          'Oral Rehydration Salts (ORS), electrolyte powders, and tender coconut reserves.',
          'Bamboo blinds or wet khus curtains to shade southwest-facing windows.',
        ],
        prioritizedActions: [
          {
            id: 'act-1',
            title: 'Immediate: Draw window curtains and bamboo blinds before 9:00 AM',
            timeframe: 'immediate_0_2h',
            priority: 'critical',
            isDone: completedActionIds.includes('act-1'),
            notes: 'Stops solar radiant heat gain, keeping interior 3–5°C cooler.',
          },
          {
            id: 'act-2',
            title: 'Short-term: Institute mandatory hourly water alarms for children and seniors',
            timeframe: 'short_term_2_12h',
            priority: 'high',
            isDone: completedActionIds.includes('act-2'),
            notes: 'Maintains blood volume and prevents heat syncope.',
          },
          {
            id: 'act-3',
            title: 'Recovery: Prepare cool water foot soaking buckets and damp cotton compresses',
            timeframe: 'recovery_12_48h',
            priority: 'medium',
            isDone: completedActionIds.includes('act-3'),
            notes: 'Accelerates core body cooling safely without thermal shock.',
          },
        ],
        questionsForAuthorities: [
          'Where is the nearest functioning civic air-conditioned cooling shelter or water fountain?',
          'What are the designated primary health centers equipped with heat stroke ice bath protocols?',
        ],
        beforeAfterComparison: {
          withoutPreparedness: [
            'Indoor room heats to 41°C, acute dehydration, hospital emergency room visit.',
            'Household members suffer from heat dizziness, insomnia, and heat exhaustion.',
          ],
          withPreparedness: [
            'Shaded rooms stay under 34°C, hydration levels remain optimal with zero clinical events.',
            'Backup battery fans provide ventilation during power interruptions.',
          ],
        },
      };
    } else {
      return {
        scenarioTitle: `Critical Infrastructure Disruption (${severity.toUpperCase()})`,
        severityLabel: `Scenario: ${scenarioType.replace(/_/g, ' ').toUpperCase()}`,
        summary: `Stress testing ${currentLocation.name} under an acute regional disruption. Tests continuity of drinking water, medical care, communication, and evacuation readiness.`,
        potentialChallenges: [
          'Loss of mobile cellular networks and digital payment UPI connectivity.',
          'Fuel station queues and municipal water supply shutoffs.',
        ],
        requiredResources: [
          'Cash emergency reserve in small denominations.',
          'Battery-operated AM/FM analog radio for official emergency broadcast bulletins.',
        ],
        prioritizedActions: [
          {
            id: 'act-1',
            title: 'Immediate: Test analog radio batteries and verify 112 emergency contacts',
            timeframe: 'immediate_0_2h',
            priority: 'critical',
            isDone: completedActionIds.includes('act-1'),
            notes: 'Guarantees reliable receipt of civil defense bulletins.',
          },
        ],
        questionsForAuthorities: [
          'What are the designated siren frequencies or local broadcast channels for civil warnings?',
        ],
        beforeAfterComparison: {
          withoutPreparedness: ['Panic, complete loss of situational awareness and access to food/water.'],
          withPreparedness: ['Calm execution of pre-staged family safety protocols.'],
        },
      };
    }
  };

  const sim = getSimulationResult();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-teal-950/40 border border-emerald-850 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Climate Preparedness Twin
                </h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 uppercase tracking-wider">
                  Signature Innovation
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Interactive digital scenario simulator. Stress-test your household, school, or community against hypothetical climate emergencies before they strike.
              </p>
            </div>
          </div>
        </div>

        {/* Location Dropdown */}
        <div className="flex items-center gap-2 bg-slate-850 p-1.5 rounded-xl border border-slate-700">
          <span className="text-xs text-slate-400 font-medium pl-2">Testing In:</span>
          <select
            value={selectedLocId}
            onChange={(e) => setSelectedLocId(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name} ({loc.region})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-3.5 bg-amber-950/40 border border-amber-900/50 rounded-xl flex items-start gap-3 text-xs text-amber-200">
        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-semibold">Hypothetical Simulation Disclaimer:</strong> The scenarios simulated in this Digital Twin are <em>exploratory tabletop drills</em> designed to expose preparedness vulnerabilities and guide checklist priorities. <strong>They are not official meteorological predictions or government evacuation orders.</strong>
        </div>
      </div>

      {/* Scenario Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {SCENARIOS.map((sc) => {
          const Icon = sc.icon;
          const isSelected = scenarioType === sc.id;
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => {
                setScenarioType(sc.id);
                setHasSimulated(true);
              }}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-950/50 border-emerald-500 text-white ring-1 ring-emerald-500/50 shadow-md shadow-emerald-950/40'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 ${
                    isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-xs text-white leading-snug">{sc.title}</h4>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">{sc.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Controls & Variables Drawer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">
              Simulation Parameters &amp; Assets
            </h3>
          </div>

          {/* Severity Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-850 p-1 rounded-xl border border-slate-700 text-xs">
            <span className="text-slate-400 px-2 font-medium">Severity:</span>
            {(['moderate', 'severe', 'catastrophic'] as const).map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setSeverity(sev)}
                className={`px-3 py-1 rounded-lg font-semibold uppercase tracking-wider transition-all text-[11px] ${
                  severity === sev
                    ? sev === 'catastrophic'
                      ? 'bg-rose-600 text-white shadow'
                      : sev === 'severe'
                      ? 'bg-amber-600 text-white shadow'
                      : 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Resources & Assets Pickers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Available Resources */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Available Household / Facility Resources:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {RESOURCE_OPTIONS.map((res) => {
                const active = selectedResources.includes(res);
                return (
                  <button
                    key={res}
                    type="button"
                    onClick={() => toggleResource(res)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                      active
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-medium'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {active ? '✓ ' : '+ '}
                    {res}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vulnerable Assets to Protect */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              High-Risk Assets &amp; Vulnerable Dependencies:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ASSET_OPTIONS.map((asset) => {
                const active = selectedAssets.includes(asset);
                return (
                  <button
                    key={asset}
                    type="button"
                    onClick={() => toggleAsset(asset)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                      active
                        ? 'bg-rose-950/60 border-rose-500 text-rose-200 font-medium'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {active ? '⚠ ' : '+ '}
                    {asset}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Run Simulation CTA */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={runSimulation}
            disabled={isSimulating}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
          >
            {isSimulating ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Simulating Digital Twin Dynamics...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Run Scenario Stress Test</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Simulation Result Presentation */}
      {hasSimulated && (
        <div className="space-y-6 animate-fadeIn">
          {/* Overview Banner */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-emerald-400 font-bold">
                Simulation Outcome: {sim.severityLabel}
              </span>
              <span className="text-[11px] text-slate-400">
                Location: {currentLocation.name}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">{sim.scenarioTitle}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-850 p-3.5 rounded-xl border border-slate-800">
              {sim.summary}
            </p>
          </div>

          {/* Potential Challenges & Required Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Challenges */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Potential Challenges &amp; Bottlenecks</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {sim.potentialChallenges.map((ch, idx) => (
                  <li key={idx} className="p-2.5 bg-rose-950/20 border border-rose-900/40 rounded-xl flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{ch}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Required */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Vital Resources Required for Continuity</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {sim.requiredResources.map((res, idx) => (
                  <li key={idx} className="p-2.5 bg-teal-950/20 border border-teal-900/40 rounded-xl flex items-start gap-2">
                    <span className="text-teal-400 font-bold">✓</span>
                    <span>{res}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Prioritized Actionable Checklist */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                  Prioritized Preparedness Actions
                </h4>
                <p className="text-xs text-slate-400">
                  Phased tasks dynamically generated for this scenario
                </p>
              </div>
              <span className="text-xs text-emerald-400 font-semibold">
                {completedActionIds.length} of {sim.prioritizedActions.length} Completed
              </span>
            </div>

            <div className="space-y-2.5">
              {sim.prioritizedActions.map((action) => {
                const isDone = completedActionIds.includes(action.id);
                return (
                  <div
                    key={action.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                      isDone
                        ? 'bg-slate-850/50 border-slate-800 opacity-70'
                        : 'bg-slate-850 border-slate-700/80'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => toggleActionDone(action.id)}
                      className="mt-1 w-4 h-4 rounded text-emerald-600 bg-slate-800 border-slate-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs sm:text-sm font-semibold ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
                          {action.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono font-medium border border-slate-700">
                          {action.timeframe.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-snug">{action.notes}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual Before & After Comparison */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Visual Before-and-After Preparedness Contrast
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Without Preparation */}
              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/60 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-300 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>Without Prior Preparation:</span>
                </div>
                <ul className="text-xs text-rose-200/90 space-y-1.5 list-disc list-inside">
                  {sim.beforeAfterComparison.withoutPreparedness.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>

              {/* With Preparedness */}
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-900/60 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>With ClimateReady Measures:</span>
                </div>
                <ul className="text-xs text-emerald-200/90 space-y-1.5 list-disc list-inside">
                  {sim.beforeAfterComparison.withPreparedness.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Questions for Local Authorities */}
          <div className="p-5 rounded-2xl bg-slate-850 border border-slate-700/80 space-y-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-sky-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-300">
                Critical Questions to Confirm with Municipal Authorities / Ward Office:
              </h4>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {sim.questionsForAuthorities.map((q, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-sky-400 font-bold">•</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
