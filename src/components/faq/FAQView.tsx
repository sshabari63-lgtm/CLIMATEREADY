import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  BookOpen,
  ShieldCheck,
  PhoneCall,
  Volume2,
} from 'lucide-react';
import { STATIC_EMERGENCY_NUMBERS } from '../../data/constants';

interface FAQItem {
  question: string;
  answer: string;
  category: 'heat' | 'flood' | 'app' | 'safety';
}

const FAQ_DATA: FAQItem[] = [
  {
    category: 'app',
    question: 'What is ClimateReady and how does it work offline?',
    answer:
      'ClimateReady is an open, hyper-local climate resilience hub designed for heatwaves and extreme monsoon precipitation. It caches your latest location forecasts and safety cards locally in your browser through a Progressive Web App (PWA) service worker. Even if cellular data is severed during a cyclone or power cut, you can open ClimateReady to view your family plan, emergency numbers, and checklist.',
  },
  {
    category: 'heat',
    question: 'How is the Heat Risk Score (0-100) calculated?',
    answer:
      'The Heat Risk Score evaluates three critical factors over 48 hours: (1) Maximum dry-bulb temperature (scores increase sharply above 37°C), (2) Apparent Temperature / Heat Index combining humidity and temperature via Steadman\'s formula, and (3) Nocturnal temperature retention. When minimum night temperatures stay above 26°C, physiological rest is compromised and risk weight increases.',
  },
  {
    category: 'flood',
    question: 'How is the Flood Risk Score (0-100) calculated?',
    answer:
      'The Flood Risk Score combines 24-hour peak rainfall intensity (50% weight) and cumulative 7-day antecedent precipitation (25% weight) with local coastal/depression basin topography (25% weight). High antecedent rainfall saturates the soil sponge, causing rapid street ponding and surface waterlogging even under moderate downpours.',
  },
  {
    category: 'safety',
    question: 'What essential items belong in an Emergency Go-Bag?',
    answer:
      'A resilient household emergency kit includes: 3-5 liters of bottled water per person, ORS electrolyte packets, waterproof zip bag for Aadhaar cards and property deeds, 14-day supply of essential chronic medications, battery-powered radio, high-capacity power bank with cables, LED flashlights with extra batteries, whistle, and personal first-aid supplies.',
  },
  {
    category: 'heat',
    question: 'What specific precautions should be taken for vulnerable household members?',
    answer:
      'Elderly family members require scheduled hourly hydration reminders and cool footbaths because the sensation of thirst diminishes with age. Infants should be kept in loose, breathable cotton in shaded rooms. Outdoor workers must enforce 15-minute shaded breaks for every hour of physical exertion when the Heat Index exceeds 40°C.',
  },
  {
    category: 'app',
    question: 'Are community reports verified by meteorologists?',
    answer:
      'No. All community reports submitted via ClimateReady are unverified, peer-contributed field observations. They provide hyper-local situational awareness (e.g. fallen tree or clogged inlet), but must never be treated as official flood inundation maps or evacuation mandates.',
  },
];

export const FAQView: React.FC<{ onReadAloud?: (text: string) => void }> = ({ onReadAloud }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredFAQs = FAQ_DATA.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Help Center &amp; Offline FAQ (Section 20)</h2>
              <p className="text-xs text-slate-400">
                100% functional without internet connectivity or AI service availability
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guidance topics..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['all', 'heat', 'flood', 'safety', 'app'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg border font-medium capitalize transition-colors ${
              activeCategory === cat
                ? 'bg-teal-600/30 border-teal-500/60 text-teal-300'
                : 'bg-slate-850 border-slate-700/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat === 'all' ? 'All Questions' : cat}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFAQs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-slate-850 border border-slate-700/80 rounded-2xl overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-800/50 transition-colors"
              >
                <span className="font-semibold text-white text-sm sm:text-base">{faq.question}</span>
                <div className="flex items-center gap-2 shrink-0">
                  {onReadAloud && isOpen && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onReadAloud(`${faq.question}. ${faq.answer}`);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-teal-300"
                      title="Read answer aloud"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-teal-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
