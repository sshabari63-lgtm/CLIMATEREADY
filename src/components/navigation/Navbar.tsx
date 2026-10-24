import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Flame,
  SunMedium,
  MapPin,
  Users,
  Compass,
  Award,
  HelpCircle,
  Settings,
  Bot,
  Contrast,
  Type,
  Download,
  Wifi,
  WifiOff,
  Bell,
  Sparkles,
  Smartphone,
  LogIn,
  ListChecks,
  CloudRain,
  Trophy,
  FileCheck,
  BookOpen,
  Menu,
  X,
} from 'lucide-react';
import { UserProfile, SavedLocation } from '../../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  streakCount: number;
  user: UserProfile;
  locations: SavedLocation[];
  activeLocationId: string;
  onSelectLocation: (id: string) => void;
  onOpenAssistant: () => void;
  onOpenAlerts: () => void;
  onOpenProfile: () => void;
  onOpenLogin: () => void;
  onOpenApk: () => void;
  onOpenDemoTour: () => void;
  onOpenPosterGenerator: () => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  isLargeText: boolean;
  toggleLargeText: () => void;
  activeAlertsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  streakCount,
  user,
  locations,
  activeLocationId,
  onSelectLocation,
  onOpenAssistant,
  onOpenAlerts,
  onOpenProfile,
  onOpenLogin,
  onOpenApk,
  onOpenDemoTour,
  onOpenPosterGenerator,
  isHighContrast,
  toggleHighContrast,
  isLargeText,
  toggleLargeText,
  activeAlertsCount,
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: ShieldAlert, badge: null },
    { id: 'twin', label: 'Climate Twin', icon: Sparkles, badge: 'Signature' },
    { id: 'assessment', label: 'Readiness Audit', icon: FileCheck, badge: null },
    { id: 'heat_safety', label: 'Heat Safety', icon: SunMedium, badge: null },
    { id: 'flood_safety', label: 'Flood Safety', icon: CloudRain, badge: null },
    { id: 'map', label: 'Satellite Map', icon: Compass, badge: null },
    { id: 'checklist_gen', label: 'Checklist Gen', icon: ListChecks, badge: null },
    { id: 'calendar', label: '7-Day Plan', icon: MapPin, badge: null },
    { id: 'family', label: 'Family Plan', icon: Users, badge: null },
    { id: 'community', label: 'Field Reports', icon: Users, badge: null },
    { id: 'scoreboard', label: 'Scoreboard', icon: Trophy, badge: null },
    { id: 'learn', label: 'Learn & IMD', icon: BookOpen, badge: null },
    { id: 'faq', label: 'Data Sources', icon: HelpCircle, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 transition-colors">
      {/* Top utility row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Brand + Location Selector */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-950/40 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-white text-base tracking-tight">ClimateReady</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">AI Heat &amp; Flood Preparedness</p>
            </div>
          </button>

          {/* Location Picker in top bar */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-850 pl-2 pr-1 py-1 rounded-xl border border-slate-700/80 text-xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <select
              value={activeLocationId}
              onChange={(e) => onSelectLocation(e.target.value)}
              className="bg-transparent border-none text-white text-xs font-semibold focus:outline-none cursor-pointer pr-1"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id} className="bg-slate-900 text-white">
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right utility buttons */}
        <div className="flex items-center gap-2">
          {/* Hackathon Demo Tour Guide button */}
          <button
            type="button"
            onClick={onOpenDemoTour}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/40 hover:to-teal-600/40 border border-emerald-500/50 text-emerald-300 text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Launch 7-step Hackathon Judge Demo Tour"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Judge Demo Tour</span>
            <span className="md:hidden">Tour</span>
          </button>

          {/* Streak indicator */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-950/40 border border-orange-800/60 text-orange-300 text-xs font-semibold"
            title="Active daily preparedness streak"
          >
            <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
            <span>{streakCount}d</span>
          </div>

          {/* Download APK / PWA button */}
          <button
            type="button"
            onClick={onOpenApk}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 border border-slate-700 text-xs font-semibold transition-colors"
            title="Download Android APK / Install App"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">APK &amp; PWA</span>
          </button>

          {/* Alerts Bell */}
          <button
            type="button"
            onClick={onOpenAlerts}
            className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Threshold Alert Subscriptions"
          >
            <Bell className="w-4 h-4" />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold animate-pulse">
                {activeAlertsCount}
              </span>
            )}
          </button>

          {/* Login / User Profile Avatar */}
          <button
            type="button"
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
            title="Account Login / Switch Persona"
          >
            <LogIn className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden lg:inline font-semibold">{user.name.split(' ')[0]}</span>
          </button>

          {/* Accessibility toggle */}
          <div className="hidden xl:flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700">
            <button
              type="button"
              onClick={toggleLargeText}
              className={`p-1.5 rounded text-xs transition-colors ${
                isLargeText ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Large Text Mode"
            >
              <Type className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={toggleHighContrast}
              className={`p-1.5 rounded text-xs transition-colors ${
                isHighContrast ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle High Contrast Mode"
            >
              <Contrast className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Climate Copilot AI Trigger */}
          <button
            type="button"
            onClick={onOpenAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-md shadow-teal-950/40 transition-all cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span>Copilot</span>
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 md:hidden"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs row */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 text-xs sm:text-sm border-t border-slate-800/60">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 uppercase tracking-tighter">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Location:</span>
            <select
              value={activeLocationId}
              onChange={(e) => {
                onSelectLocation(e.target.value);
                setMobileMenuOpen(false);
              }}
              className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2 py-1"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 ${
                  activeTab === item.id
                    ? 'bg-emerald-600/30 border-emerald-500 text-white font-bold'
                    : 'bg-slate-850 border-slate-700/80 text-slate-300'
                }`}
              >
                <item.icon className="w-4 h-4 text-emerald-400" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
