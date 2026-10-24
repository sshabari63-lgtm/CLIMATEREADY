import {
  SavedLocation,
  AlertSubscription,
  HouseholdProfile,
  FamilyPlan,
  ChecklistItem,
  AuditLogEntry,
  Badge,
  UserProfile,
  ReadinessAssessmentData,
  GeneratedActionPlan,
  CommunityReport,
} from '../types';
import {
  DEFAULT_LOCATIONS,
  DEFAULT_CHECKLIST,
  INITIAL_BADGES,
  INITIAL_COMMUNITY_REPORTS,
} from '../data/constants';

const KEYS = {
  LOCATIONS: 'cr_saved_locations',
  ACTIVE_LOCATION_ID: 'cr_active_location_id',
  ALERTS: 'cr_alert_subscriptions',
  PROFILE: 'cr_household_profile',
  FAMILY_PLAN: 'cr_family_plan',
  CHECKLIST: 'cr_checklist',
  AUDIT_LOG: 'cr_audit_log',
  BADGES: 'cr_badges',
  STREAK: 'cr_streak_info',
  SETTINGS: 'cr_ui_settings',
  USER: 'cr_user_profile',
  ASSESSMENT: 'cr_readiness_assessment',
  ACTION_PLANS: 'cr_action_plans',
  REPORTS: 'cr_community_reports',
  DEMO_MODE: 'cr_demo_mode_active',
};

// Safe JSON parser
function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Storage quota exceeded for key ${key}:`, e);
  }
}

// Audit logger
export function logAuditEvent(action: string, details: string): void {
  const currentLogs = getStored<AuditLogEntry[]>(KEYS.AUDIT_LOG, []);
  const newEntry: AuditLogEntry = {
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action,
    details,
  };
  setStored(KEYS.AUDIT_LOG, [newEntry, ...currentLogs.slice(0, 49)]);
}

export function getAuditLogs(): AuditLogEntry[] {
  return getStored<AuditLogEntry[]>(KEYS.AUDIT_LOG, [
    {
      id: 'init',
      timestamp: new Date().toISOString(),
      action: 'system_initialized',
      details: 'ClimateReady 2.0 platform session initialized securely.',
    },
  ]);
}

// User Profile & Authentication Simulation
export function getUserProfile(): UserProfile {
  return getStored<UserProfile>(KEYS.USER, {
    id: 'usr-demo-1',
    name: 'Dr. Anand Ramanathan',
    email: 'anand.ramanathan@resilience.org',
    role: 'resident',
    organization: 'Tamil Nadu Climate Action Network',
    isLoggedIn: true,
  });
}

export function saveUserProfile(user: UserProfile): void {
  setStored(KEYS.USER, user);
  logAuditEvent('auth_profile_update', `Updated profile for ${user.name} (Role: ${user.role}).`);
}

// Locations
export function getSavedLocations(): SavedLocation[] {
  return getStored<SavedLocation[]>(KEYS.LOCATIONS, DEFAULT_LOCATIONS);
}

export function saveLocations(locations: SavedLocation[]): void {
  setStored(KEYS.LOCATIONS, locations);
}

export function getActiveLocationId(): string {
  return getStored<string>(KEYS.ACTIVE_LOCATION_ID, DEFAULT_LOCATIONS[0].id);
}

export function setActiveLocationId(id: string): void {
  setStored(KEYS.ACTIVE_LOCATION_ID, id);
}

// Alert Subscriptions
export function getAlertSubscriptions(): AlertSubscription[] {
  return getStored<AlertSubscription[]>(KEYS.ALERTS, [
    {
      id: 'alert-1',
      locationId: 'loc-chennai',
      locationName: 'Chennai Central',
      tempThreshold: 38,
      apparentTempThreshold: 42,
      rainThresholdMm: 45,
      enabled: true,
    },
    {
      id: 'alert-2',
      locationId: 'loc-madurai',
      locationName: 'Madurai North',
      tempThreshold: 40,
      apparentTempThreshold: 43,
      rainThresholdMm: 35,
      enabled: true,
    },
  ]);
}

export function saveAlertSubscriptions(alerts: AlertSubscription[]): void {
  setStored(KEYS.ALERTS, alerts);
  logAuditEvent('update_alerts', `Updated alert thresholds for ${alerts.length} locations.`);
}

// Household Profile
export function getHouseholdProfile(): HouseholdProfile {
  return getStored<HouseholdProfile>(KEYS.PROFILE, {
    vulnerableGroups: ['elderly', 'infants'],
    membersCount: 4,
    notes: 'Ground floor residence near stormwater canal; backup power inverter and infant supply.',
  });
}

export function saveHouseholdProfile(profile: HouseholdProfile): void {
  setStored(KEYS.PROFILE, profile);
  logAuditEvent('update_profile', `Updated household profile: ${profile.vulnerableGroups.join(', ') || 'Standard'}.`);
}

export function deleteHouseholdProfile(): void {
  localStorage.removeItem(KEYS.PROFILE);
  logAuditEvent('delete_profile', 'Deleted vulnerable group household profile.');
}

// Family Emergency Plan
export function getFamilyPlan(): FamilyPlan {
  return getStored<FamilyPlan>(KEYS.FAMILY_PLAN, {
    contacts: [
      { id: 'cnt-1', name: 'Ravi Kumar', phone: '+91 98401 23456', relation: 'Father / Head of Household', isPrimary: true },
      { id: 'cnt-2', name: 'Priya Kumar', phone: '+91 94440 98765', relation: 'Spouse', isPrimary: false },
      { id: 'cnt-3', name: 'Karthik (Neighbor)', phone: '+91 98840 11223', relation: 'Adjacent Neighborhood Contact', isPrimary: false },
    ],
    meetingPointPrimary: 'Community High Ground Park (Near Sivan Temple)',
    meetingPointSecondary: 'Govt. Higher Secondary School Campus, 2nd Floor',
    specialInstructions: 'Bring waterproof envelope containing property deeds, Aadhaar cards, and blood pressure medications.',
    updatedAt: new Date().toISOString(),
  });
}

export function saveFamilyPlan(plan: FamilyPlan): void {
  plan.updatedAt = new Date().toISOString();
  setStored(KEYS.FAMILY_PLAN, plan);
  logAuditEvent('update_family_plan', 'Updated family emergency contacts and evacuation meeting points.');
}

// Checklist & Badges & Streak
export function getChecklist(): ChecklistItem[] {
  return getStored<ChecklistItem[]>(KEYS.CHECKLIST, DEFAULT_CHECKLIST);
}

export function saveChecklist(items: ChecklistItem[]): void {
  setStored(KEYS.CHECKLIST, items);
}

export function getBadges(): Badge[] {
  return getStored<Badge[]>(KEYS.BADGES, INITIAL_BADGES);
}

export function saveBadges(badges: Badge[]): void {
  setStored(KEYS.BADGES, badges);
}

export function getStreakInfo(): { currentStreak: number; lastActiveDate: string } {
  return getStored(KEYS.STREAK, {
    currentStreak: 3,
    lastActiveDate: new Date().toISOString().split('T')[0],
  });
}

export function recordStreakCheckIn(): number {
  const today = new Date().toISOString().split('T')[0];
  const info = getStreakInfo();

  if (info.lastActiveDate === today) {
    return info.currentStreak;
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  let newStreak = info.currentStreak;
  if (info.lastActiveDate === yesterday) {
    newStreak += 1;
  } else {
    newStreak = 1;
  }

  setStored(KEYS.STREAK, { currentStreak: newStreak, lastActiveDate: today });
  logAuditEvent('streak_checkin', `Recorded daily resilience check-in (Streak: ${newStreak} days).`);
  return newStreak;
}

// Readiness Assessment Data
export function getReadinessAssessment(): ReadinessAssessmentData {
  return getStored<ReadinessAssessmentData>(KEYS.ASSESSMENT, {
    completedAt: '2026-10-23T14:00:00.000Z',
    score: 82,
    breakdown: {
      drinkingWater: 15,
      emergencyContacts: 15,
      firstAidSupplies: 15,
      heatProtection: 8,
      floodEvacuation: 15,
      emergencySupplies: 7,
      warningsAwareness: 7,
    },
    strongAreas: [
      '5-Day Safe Drinking Water Buffer & ORS Packets',
      'Verified 112 / NDMA Helpline Directory on Printed Card',
      'Designated High-Ground Evacuation Meeting Point',
    ],
    missingPreparations: [
      'Need passive window shades / wet khus blinds on west-facing facade',
      'Need dedicated secondary waterproof pouch for identification documents',
    ],
    top3NextSteps: [
      'Install reflective heat film or bamboo blinds before next heatwave surge',
      'Pack 14-day supply of essential family prescriptions in waterproof container',
      'Run a 15-minute mock flood evacuation drill with family members',
    ],
  });
}

export function saveReadinessAssessment(data: ReadinessAssessmentData): void {
  setStored(KEYS.ASSESSMENT, data);
  logAuditEvent('assessment_completed', `Completed Climate Readiness Assessment with score ${data.score}/100.`);
}

// Smart Action Plans
export function getActionPlans(): GeneratedActionPlan[] {
  return getStored<GeneratedActionPlan[]>(KEYS.ACTION_PLANS, [
    {
      id: 'plan-1',
      title: 'Monsoon Flooding & Inundation Action Plan for Households',
      audience: 'household',
      hazard: 'flood',
      createdAt: new Date().toISOString(),
      tasks: [
        {
          id: 't-1',
          phase: 'before',
          title: 'Elevate Ground-Floor Inverters & Electronics',
          explanation: 'Move sensitive power backups and computer equipment above the 3-foot flood line.',
          priority: 'high',
          estTime: '30 mins',
          isCompleted: true,
        },
        {
          id: 't-2',
          phase: 'before',
          title: 'Clear Terrace Silt & Rooftop Rain Spouts',
          explanation: 'Inspect drain grates to prevent rooftop water pooling and seepage.',
          priority: 'high',
          estTime: '20 mins',
          isCompleted: true,
        },
        {
          id: 't-3',
          phase: 'during',
          title: 'Switch Off Main Circuit Breaker if Water Enters Ground Level',
          explanation: 'Prevent severe electrical short-circuiting and electrocution hazards.',
          priority: 'high',
          estTime: 'Immediate',
          isCompleted: false,
        },
        {
          id: 't-4',
          phase: 'after',
          title: 'Disinfect Stored Water Containers & Sump',
          explanation: 'Floodwater frequently contaminates underground groundwater sumps. Boil all drinking water.',
          priority: 'high',
          estTime: '45 mins',
          isCompleted: false,
        },
      ],
    },
  ]);
}

export function saveActionPlans(plans: GeneratedActionPlan[]): void {
  setStored(KEYS.ACTION_PLANS, plans);
  logAuditEvent('action_plan_saved', `Saved ${plans.length} smart action plans.`);
}

// Community Reports
export function getStoredCommunityReports(): CommunityReport[] {
  return getStored<CommunityReport[]>(KEYS.REPORTS, INITIAL_COMMUNITY_REPORTS);
}

export function saveStoredCommunityReports(reports: CommunityReport[]): void {
  setStored(KEYS.REPORTS, reports);
}

// Demo Mode
export function isDemoModeActive(): boolean {
  return getStored<boolean>(KEYS.DEMO_MODE, true);
}

export function setDemoModeActive(val: boolean): void {
  setStored(KEYS.DEMO_MODE, val);
}

export function resetDemoData(): void {
  localStorage.setItem(KEYS.LOCATIONS, JSON.stringify(DEFAULT_LOCATIONS));
  localStorage.setItem(KEYS.ACTIVE_LOCATION_ID, JSON.stringify(DEFAULT_LOCATIONS[0].id));
  localStorage.setItem(KEYS.CHECKLIST, JSON.stringify(DEFAULT_CHECKLIST));
  localStorage.setItem(KEYS.BADGES, JSON.stringify(INITIAL_BADGES));
  localStorage.setItem(KEYS.REPORTS, JSON.stringify(INITIAL_COMMUNITY_REPORTS));
  logAuditEvent('demo_reset', 'Demonstration state reset to baseline benchmark.');
}

// Export All User Data
export function exportAllUserData(): string {
  const data = {
    exportTimestamp: new Date().toISOString(),
    version: 'ClimateReady 2.0 Hackathon Release',
    user: getUserProfile(),
    locations: getSavedLocations(),
    profile: getHouseholdProfile(),
    familyPlan: getFamilyPlan(),
    alertSubscriptions: getAlertSubscriptions(),
    checklist: getChecklist(),
    badges: getBadges(),
    streak: getStreakInfo(),
    assessment: getReadinessAssessment(),
    actionPlans: getActionPlans(),
    auditLog: getAuditLogs(),
  };

  logAuditEvent('export_data', 'Full ClimateReady 2.0 data package exported as JSON.');
  return JSON.stringify(data, null, 2);
}

// Complete Account & Data Deletion
export function deleteAllUserData(): void {
  Object.values(KEYS).forEach((k) => {
    localStorage.removeItem(k);
  });
  logAuditEvent('delete_account', 'Purged all local user profiles, plans, checklist items, and cached telemetry.');
}
