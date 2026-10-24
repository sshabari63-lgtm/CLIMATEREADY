/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  WeatherData,
  SavedLocation,
  HouseholdProfile,
  FamilyPlan,
  ChecklistItem,
  AlertSubscription,
  Badge,
  UserProfile,
  ReadinessAssessmentData,
  GeneratedActionPlan,
} from './types';
import { fetchWeatherForecast } from './services/weatherService';
import {
  getSavedLocations,
  saveLocations,
  getActiveLocationId,
  setActiveLocationId,
  getHouseholdProfile,
  saveHouseholdProfile,
  deleteHouseholdProfile,
  getFamilyPlan,
  saveFamilyPlan,
  getChecklist,
  saveChecklist,
  getAlertSubscriptions,
  saveAlertSubscriptions,
  getBadges,
  saveBadges,
  getStreakInfo,
  recordStreakCheckIn,
  getUserProfile,
  saveUserProfile,
  getReadinessAssessment,
  saveReadinessAssessment,
  getActionPlans,
  saveActionPlans,
  resetDemoData,
  logAuditEvent,
} from './utils/storage';

// Navigation & Layout
import { Navbar } from './components/navigation/Navbar';

// Core Application Pages (Section 13)
import { DashboardView } from './components/dashboard/DashboardView';
import { ClimatePreparednessTwinView } from './components/twin/ClimatePreparednessTwinView';
import { ClimateReadinessAssessmentView } from './components/assessment/ClimateReadinessAssessmentView';
import { HeatSafetyView } from './components/heat/HeatSafetyView';
import { FloodSafetyView } from './components/flood/FloodSafetyView';
import { InteractiveMapView } from './components/maps/InteractiveMapView';
import { SmartChecklistGeneratorView } from './components/checklist/SmartChecklistGeneratorView';
import { PreparednessCalendarView } from './components/calendar/PreparednessCalendarView';
import { CompareLocationsView } from './components/compare/CompareLocationsView';
import { CommunityReportsView } from './components/community/CommunityReportsView';
import { CommunityScoreboardView } from './components/scoreboard/CommunityScoreboardView';
import { BadgesView } from './components/badges/BadgesView';
import { LearnView } from './components/learn/LearnView';
import { FAQView } from './components/faq/FAQView';
import { DataSourcesView } from './components/sources/DataSourcesView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { SettingsView } from './components/settings/SettingsView';

// Modals
import { AIAssistantModal } from './components/assistant/AIAssistantModal';
import { HackathonDemoTourModal } from './components/demo/HackathonDemoTourModal';
import { LoginModal } from './components/auth/LoginModal';
import { DownloadApkModal } from './components/apk/DownloadApkModal';
import { AlertSubscriptionsModal } from './components/alerts/AlertSubscriptionsModal';
import { HouseholdProfileModal } from './components/profile/HouseholdProfileModal';
import { EmergencyPlanModal } from './components/family/EmergencyPlanModal';
import { ShareableSafetyCardModal } from './components/safetycard/ShareableSafetyCardModal';
import { PosterGeneratorModal } from './components/infographic/PosterGeneratorModal';

// Floating bot & voice icons
import { Bot, Volume2, VolumeX, Sparkles, Smartphone } from 'lucide-react';

export default function App() {
  // Navigation & UI state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);

  // Core user & location state
  const [user, setUser] = useState<UserProfile>(getUserProfile());
  const [locations, setLocations] = useState<SavedLocation[]>(getSavedLocations());
  const [activeLocationId, setActiveLocId] = useState<string>(getActiveLocationId());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);

  // Preparedness state
  const [householdProfile, setHouseholdProfile] = useState<HouseholdProfile>(getHouseholdProfile());
  const [familyPlan, setFamilyPlan] = useState<FamilyPlan>(getFamilyPlan());
  const [checklist, setChecklist] = useState<ChecklistItem[]>(getChecklist());
  const [alertSubscriptions, setAlertSubscriptions] = useState<AlertSubscription[]>(getAlertSubscriptions());
  const [badges, setBadges] = useState<Badge[]>(getBadges());
  const [streakCount, setStreakCount] = useState<number>(getStreakInfo().currentStreak);
  const [assessmentData, setAssessmentData] = useState<ReadinessAssessmentData>(getReadinessAssessment());
  const [actionPlans, setActionPlans] = useState<GeneratedActionPlan[]>(getActionPlans());

  // Modals state
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isApkOpen, setIsApkOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFamilyPlanOpen, setIsFamilyPlanOpen] = useState(false);
  const [isSafetyCardOpen, setIsSafetyCardOpen] = useState(false);
  const [isPosterGeneratorOpen, setIsPosterGeneratorOpen] = useState(false);

  // Active audio speech text
  const [activeVoiceText, setActiveVoiceText] = useState<string | null>(null);

  const activeLocation = locations.find((l) => l.id === activeLocationId) || locations[0];

  // Fetch live weather data for active location
  const loadWeatherData = async (loc: SavedLocation) => {
    setIsLoadingWeather(true);
    try {
      const data = await fetchWeatherForecast(loc.id, loc.name, loc.lat, loc.lon);
      setWeather(data);
    } catch (err) {
      console.warn('Weather loading error:', err);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  useEffect(() => {
    if (activeLocation) {
      loadWeatherData(activeLocation);
    }
  }, [activeLocationId]);

  // Preparedness Score calculation
  const tailoredChecklist = checklist.filter((item) => {
    if (!item.relevantGroups || item.relevantGroups.length === 0) return true;
    return item.relevantGroups.some((g) => householdProfile.vulnerableGroups.includes(g));
  });

  const completedCount = tailoredChecklist.filter((c) => c.isCompleted).length;
  const preparednessScore = tailoredChecklist.length > 0
    ? Math.round((completedCount / tailoredChecklist.length) * 100)
    : 0;

  // Toggle checklist item
  const handleToggleChecklist = (id: string) => {
    const updated = checklist.map((c) => (c.id === id ? { ...c, isCompleted: !c.isCompleted } : c));
    setChecklist(updated);
    saveChecklist(updated);

    const newCompleted = updated.filter((c) => c.isCompleted).length;
    if (newCompleted >= 3) {
      const updatedBadges = badges.map((b) => (b.id === 'first_checklist' ? { ...b, unlocked: true } : b));
      setBadges(updatedBadges);
      saveBadges(updatedBadges);
    }
  };

  // Switch Location
  const handleSelectLocation = (id: string) => {
    setActiveLocId(id);
    setActiveLocationId(id);
    logAuditEvent('change_location', `Switched active observation center to ${id}.`);
  };

  // Voice speech synthesis
  const handleReadText = (text: string) => {
    if ('speechSynthesis' in window) {
      if (activeVoiceText) {
        window.speechSynthesis.cancel();
        setActiveVoiceText(null);
        return;
      }
      setActiveVoiceText(text);
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#]/g, ''));
      utterance.rate = 0.95;
      utterance.onend = () => setActiveVoiceText(null);
      utterance.onerror = () => setActiveVoiceText(null);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis is not supported on this browser.');
    }
  };

  // Assessment Completed
  const handleAssessmentCompleted = (data: ReadinessAssessmentData) => {
    setAssessmentData(data);
    saveReadinessAssessment(data);
  };

  // Save generated action plan
  const handleSaveActionPlan = (plan: GeneratedActionPlan) => {
    const updated = [plan, ...actionPlans];
    setActionPlans(updated);
    saveActionPlans(updated);
  };

  // Count active triggered alerts
  const activeAlertsCount = alertSubscriptions.filter((s) => {
    if (!s.enabled || !weather) return false;
    return (
      weather.current.temperature >= s.tempThreshold ||
      weather.current.apparentTemperature >= s.apparentTempThreshold ||
      (weather.daily[0] && weather.daily[0].precipitationSum >= s.rainThresholdMm)
    );
  }).length;

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-all ${
        isHighContrast ? 'contrast-125 bg-black' : ''
      } ${isLargeText ? 'text-lg' : 'text-sm'}`}
    >
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        streakCount={streakCount}
        user={user}
        locations={locations}
        activeLocationId={activeLocationId}
        onSelectLocation={handleSelectLocation}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenApk={() => setIsApkOpen(true)}
        onOpenDemoTour={() => setIsDemoTourOpen(true)}
        onOpenPosterGenerator={() => setIsPosterGeneratorOpen(true)}
        isHighContrast={isHighContrast}
        toggleHighContrast={() => setIsHighContrast(!isHighContrast)}
        isLargeText={isLargeText}
        toggleLargeText={() => setIsLargeText(!isLargeText)}
        activeAlertsCount={activeAlertsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-6">
        {/* 1. Dashboard */}
        {activeTab === 'dashboard' && (
          <DashboardView
            weather={weather}
            locations={locations}
            activeLocationId={activeLocationId}
            onSelectLocation={handleSelectLocation}
            householdProfile={householdProfile}
            plan={familyPlan}
            checklist={checklist}
            onToggleChecklistItem={handleToggleChecklist}
            preparednessScore={preparednessScore}
            assessmentData={assessmentData}
            alertSubscriptions={alertSubscriptions}
            onOpenAlerts={() => setIsAlertsOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenFamilyPlan={() => setIsFamilyPlanOpen(true)}
            onOpenSafetyCard={() => setIsSafetyCardOpen(true)}
            onOpenCalendar={() => setActiveTab('calendar')}
            onOpenAssessment={() => setActiveTab('assessment')}
            onOpenTwin={() => setActiveTab('twin')}
            onOpenChecklistGen={() => setActiveTab('checklist_gen')}
            onRefreshWeather={() => loadWeatherData(activeLocation)}
            isLoadingWeather={isLoadingWeather}
            onReadGuidance={handleReadText}
          />
        )}

        {/* 2. Signature Innovation: Climate Preparedness Twin */}
        {activeTab === 'twin' && (
          <ClimatePreparednessTwinView
            locations={locations}
            activeLocationId={activeLocationId}
            onScenarioCompleted={() => {
              const updatedBadges = badges.map((b) => (b.id === 'scenario_master' ? { ...b, unlocked: true } : b));
              setBadges(updatedBadges);
              saveBadges(updatedBadges);
            }}
          />
        )}

        {/* 3. Climate Readiness Assessment */}
        {activeTab === 'assessment' && (
          <ClimateReadinessAssessmentView
            onAssessmentCompleted={handleAssessmentCompleted}
            initialData={assessmentData}
          />
        )}

        {/* 4. Heat Safety Module */}
        {activeTab === 'heat_safety' && (
          <HeatSafetyView
            weather={weather}
            locationName={activeLocation.name}
            onReadGuidance={handleReadText}
          />
        )}

        {/* 5. Flood Safety & Inundation Map */}
        {activeTab === 'flood_safety' && (
          <FloodSafetyView
            weather={weather}
            location={activeLocation}
            reports={[]}
          />
        )}

        {/* 6. Interactive Satellite & Street Map */}
        {activeTab === 'map' && (
          <InteractiveMapView
            location={activeLocation}
            reports={[]}
          />
        )}

        {/* 7. Smart Preparedness Checklist Generator */}
        {activeTab === 'checklist_gen' && (
          <SmartChecklistGeneratorView
            onSavePlan={handleSaveActionPlan}
          />
        )}

        {/* 8. 7-Day Preparedness Calendar & .ICS Export */}
        {activeTab === 'calendar' && (
          <PreparednessCalendarView
            daily={weather?.daily || []}
            locationName={activeLocation.name}
            checklist={checklist}
            onToggleChecklistItem={handleToggleChecklist}
            onRecordStreak={() => setStreakCount(recordStreakCheckIn())}
          />
        )}

        {/* 9. Family Plan & Verified 112 Helplines */}
        {activeTab === 'family' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
              <div>
                <h2 className="text-xl font-bold text-white">Household Safety Plan &amp; Emergency Helplines</h2>
                <p className="text-xs text-slate-400">
                  Store emergency contacts, evacuation meeting points, and print your 1-page card
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSafetyCardOpen(true)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs shadow-md"
              >
                View Printable Safety Card
              </button>
            </div>
            <EmergencyPlanModal
              isOpen={true}
              onClose={() => setActiveTab('dashboard')}
              plan={familyPlan}
              onSave={(p) => {
                setFamilyPlan(p);
                saveFamilyPlan(p);
              }}
              onPrintCard={() => setIsSafetyCardOpen(true)}
            />
          </div>
        )}

        {/* 10. Community Field Reports */}
        {activeTab === 'community' && (
          <CommunityReportsView
            activeLocationName={activeLocation.name}
            activeLat={activeLocation.lat}
            activeLon={activeLocation.lon}
            onReportAdded={() => {
              const updatedBadges = badges.map((b) => (b.id === 'community_reporter' ? { ...b, unlocked: true } : b));
              setBadges(updatedBadges);
              saveBadges(updatedBadges);
            }}
          />
        )}

        {/* 11. Community Resilience Scoreboard */}
        {activeTab === 'scoreboard' && (
          <CommunityScoreboardView />
        )}

        {/* 12. Compare Locations with Data Completeness */}
        {activeTab === 'compare' && (
          <CompareLocationsView
            locations={locations}
            activeLocationId={activeLocationId}
            onSelectLocation={handleSelectLocation}
            preparednessScore={preparednessScore}
          />
        )}

        {/* 13. Learn & IMD Warning Codes */}
        {activeTab === 'learn' && (
          <LearnView />
        )}

        {/* 14. Data Sources, FAQ & Limitations */}
        {activeTab === 'faq' && (
          <div className="space-y-8">
            <FAQView onReadAloud={handleReadText} />
            <DataSourcesView />
          </div>
        )}

        {/* 15. Admin Operations Hub */}
        {activeTab === 'admin' && (
          <AdminDashboardView />
        )}

        {/* 16. Platform Settings & Preferences */}
        {activeTab === 'settings' && (
          <SettingsView
            user={user}
            onUpdateUser={(u) => {
              setUser(u);
              saveUserProfile(u);
            }}
            locations={locations}
            activeLocationId={activeLocationId}
            onSelectLocation={handleSelectLocation}
            onOpenAlerts={() => setIsAlertsOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
          />
        )}
      </main>

      {/* Floating Climate Copilot AI Action Button (Available on EVERY page) */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
        {activeVoiceText && (
          <div className="bg-slate-900/95 border border-emerald-500/50 p-2.5 rounded-xl shadow-2xl text-xs text-emerald-300 flex items-center gap-2 animate-pulse">
            <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Reading safety guidance aloud...</span>
            <button
              type="button"
              onClick={() => handleReadText('')}
              className="ml-2 text-slate-400 hover:text-white"
            >
              <VolumeX className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsAssistantOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-2xl shadow-emerald-950/60 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-emerald-400/40"
          title="Open Climate Copilot AI Assistant"
        >
          <Bot className="w-5 h-5 animate-bounce" />
          <span className="hidden sm:inline">Climate Copilot</span>
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>
        </button>
      </div>

      {/* Modals & Dialogs */}
      <AIAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        activeWeather={weather}
        householdProfile={householdProfile}
        preparednessScore={assessmentData.score || preparednessScore}
      />

      <HackathonDemoTourModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onSelectStepTab={(tab) => setActiveTab(tab)}
        onResetDemo={() => {
          resetDemoData();
          setLocations(getSavedLocations());
          setChecklist(getChecklist());
          setBadges(getBadges());
        }}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        currentUser={user}
        onLogin={(u) => {
          setUser(u);
          saveUserProfile(u);
        }}
      />

      <DownloadApkModal
        isOpen={isApkOpen}
        onClose={() => setIsApkOpen(false)}
      />

      <AlertSubscriptionsModal
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        subscriptions={alertSubscriptions}
        locations={locations}
        onSave={(subs) => {
          setAlertSubscriptions(subs);
          saveAlertSubscriptions(subs);
        }}
      />

      <HouseholdProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={householdProfile}
        onSave={(p) => {
          setHouseholdProfile(p);
          saveHouseholdProfile(p);
        }}
        onDelete={() => {
          deleteHouseholdProfile();
          setHouseholdProfile(getHouseholdProfile());
        }}
      />

      <EmergencyPlanModal
        isOpen={isFamilyPlanOpen}
        onClose={() => setIsFamilyPlanOpen(false)}
        plan={familyPlan}
        onSave={(p) => {
          setFamilyPlan(p);
          saveFamilyPlan(p);
        }}
        onPrintCard={() => {
          setIsFamilyPlanOpen(false);
          setIsSafetyCardOpen(true);
        }}
      />

      <ShareableSafetyCardModal
        isOpen={isSafetyCardOpen}
        onClose={() => setIsSafetyCardOpen(false)}
        weather={weather}
        profile={householdProfile}
        plan={familyPlan}
        checklist={tailoredChecklist}
        preparednessScore={assessmentData.score || preparednessScore}
      />

      <PosterGeneratorModal
        isOpen={isPosterGeneratorOpen}
        onClose={() => setIsPosterGeneratorOpen(false)}
        householdProfile={householdProfile}
        locationName={activeLocation.name}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 px-4 py-5 text-center text-xs text-slate-500 space-y-1.5">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="font-bold text-slate-400">ClimateReady 2.0 • AI-Powered Local Heat &amp; Flood Preparedness</span>
          <span>•</span>
          <button onClick={() => setIsDemoTourOpen(true)} className="hover:text-emerald-400 font-semibold underline">
            Judge Demo Tour
          </button>
          <span>•</span>
          <button onClick={() => setActiveTab('twin')} className="hover:text-emerald-400 font-semibold underline">
            Climate Twin Simulator
          </button>
          <span>•</span>
          <button onClick={() => setIsApkOpen(true)} className="hover:text-emerald-400 font-semibold underline">
            Download Mobile APK
          </button>
          <span>•</span>
          <button onClick={() => setActiveTab('faq')} className="hover:text-slate-300 underline">
            Sources &amp; IMD Guidelines
          </button>
        </div>
        <p className="text-[11px] text-slate-600 max-w-2xl mx-auto">
          Advisory platform for household and community climate preparedness. Not an official disaster warning agency. For statutory red/orange emergency alerts, consult the India Meteorological Department (IMD) and SDMA.
        </p>
      </footer>
    </div>
  );
}
