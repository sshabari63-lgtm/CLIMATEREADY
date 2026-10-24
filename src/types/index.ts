export type VulnerableGroup =
  | 'elderly'
  | 'infants'
  | 'pregnancy'
  | 'chronic_illness'
  | 'outdoor_workers'
  | 'livestock';

export interface SavedLocation {
  id: string;
  name: string;
  region: string;
  lat: number;
  lon: number;
  isDefault?: boolean;
}

export interface HourlyForecastItem {
  time: string;
  temperature: number;
  apparentTemperature: number;
  precipitation: number;
  relativeHumidity: number;
  uvIndex?: number;
  heatCategory: 'safe' | 'caution' | 'extreme_caution' | 'danger' | 'extreme_danger';
}

export interface DailyForecastItem {
  date: string;
  maxTemp: number;
  minTemp: number;
  apparentTempMax: number;
  precipitationSum: number;
  precipitationProbability: number;
  heatRiskScore: number;
  floodRiskScore: number;
}

export interface WeatherData {
  locationId: string;
  locationName: string;
  lat: number;
  lon: number;
  current: {
    temperature: number;
    apparentTemperature: number;
    relativeHumidity: number;
    precipitation: number;
    windSpeed: number;
    weatherCode: number;
    time: string;
  };
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  heatRiskScore: number;
  floodRiskScore: number;
  completeness: number; // Percentage 0 - 100
  fetchedAt: string;
  isCached?: boolean;
}

export interface AlertSubscription {
  id: string;
  locationId: string;
  locationName: string;
  tempThreshold: number; // e.g. 38 °C
  apparentTempThreshold: number; // e.g. 42 °C
  rainThresholdMm: number; // e.g. 40 mm/day
  enabled: boolean;
}

export interface HouseholdProfile {
  vulnerableGroups: VulnerableGroup[];
  membersCount: number;
  notes: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
  isPrimary?: boolean;
}

export interface FamilyPlan {
  contacts: EmergencyContact[];
  meetingPointPrimary: string;
  meetingPointSecondary: string;
  specialInstructions: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  category: 'heat' | 'flood' | 'general' | 'vulnerable';
  title: string;
  description: string;
  isCompleted: boolean;
  relevantGroups?: VulnerableGroup[];
  priority: 'high' | 'medium' | 'low';
}

export interface CommunityReport {
  id: string;
  referenceNumber: string; // e.g. CR-2026-8491
  type: 'waterlogging' | 'extreme_heat' | 'drain_blocked' | 'fallen_tree';
  locationName: string;
  lat: number;
  lon: number;
  description: string;
  timestamp: string;
  photoUrl?: string;
  status:
    | 'submitted'
    | 'under_review'
    | 'acknowledged'
    | 'action_in_progress'
    | 'resolved'
    | 'pending'
    | 'approved'
    | 'rejected';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export type MapProviderType = 'leaflet' | 'satellite' | 'google';

// ClimateReady 2.0 Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'resident' | 'school_officer' | 'outdoor_worker' | 'community_volunteer' | 'coordinator';
  avatar?: string;
  organization?: string;
  isLoggedIn: boolean;
}

export type ScenarioType =
  | 'heat_surge'
  | 'heavy_flood'
  | 'arterial_road_blocked'
  | 'power_grid_failure'
  | 'school_emergency';

export type ScenarioSeverity = 'moderate' | 'severe' | 'catastrophic';

export interface ScenarioInput {
  locationId: string;
  locationName: string;
  scenarioType: ScenarioType;
  severity: ScenarioSeverity;
  availableResources: string[];
  vulnerableAssets: string[];
  existingMeasures: string[];
}

export interface ScenarioAction {
  id: string;
  title: string;
  timeframe: 'immediate_0_2h' | 'short_term_2_12h' | 'recovery_12_48h';
  priority: 'critical' | 'high' | 'medium';
  isDone: boolean;
  notes: string;
}

export interface ScenarioSimulationResult {
  scenarioTitle: string;
  severityLabel: string;
  summary: string;
  potentialChallenges: string[];
  requiredResources: string[];
  prioritizedActions: ScenarioAction[];
  questionsForAuthorities: string[];
  beforeAfterComparison: {
    withoutPreparedness: string[];
    withPreparedness: string[];
  };
}

export type TargetAudience = 'household' | 'school' | 'business' | 'outdoor_worker' | 'community_org';
export type PlanHazard = 'heat' | 'flood' | 'combined';

export interface PlanTaskItem {
  id: string;
  phase: 'before' | 'during' | 'after';
  title: string;
  explanation: string;
  priority: 'high' | 'medium' | 'low';
  estTime: string;
  isCompleted: boolean;
  hasReminder?: boolean;
}

export interface GeneratedActionPlan {
  id: string;
  title: string;
  audience: TargetAudience;
  hazard: PlanHazard;
  createdAt: string;
  tasks: PlanTaskItem[];
}

export interface CommunityMetric {
  id: string;
  name: string;
  region: string;
  population: string;
  tasksCompleted: number;
  reportsCount: number;
  resolvedReports: number;
  resilienceScore: number;
  activeChallenges: Array<{ id: string; title: string; progress: number }>;
}

export interface ReadinessAssessmentData {
  completedAt?: string;
  score: number;
  breakdown: {
    drinkingWater: number; // 0 - 15
    emergencyContacts: number; // 0 - 15
    firstAidSupplies: number; // 0 - 15
    heatProtection: number; // 0 - 15
    floodEvacuation: number; // 0 - 15
    emergencySupplies: number; // 0 - 15
    warningsAwareness: number; // 0 - 10
  };
  strongAreas: string[];
  missingPreparations: string[];
  top3NextSteps: string[];
}
