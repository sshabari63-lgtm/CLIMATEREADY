import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Volume2,
  VolumeX,
  AlertTriangle,
  HelpCircle,
  RotateCcw,
  Languages,
} from 'lucide-react';
import { WeatherData, HouseholdProfile } from '../../types';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeWeather: WeatherData | null;
  householdProfile: HouseholdProfile;
  preparednessScore: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isFallback?: boolean;
}

const QUICK_CHIPS = [
  'How can my family prepare for a heatwave?',
  'Create a flood preparedness checklist for my school.',
  'What should I prepare before heavy rainfall?',
  'Help my community create a climate emergency plan.',
  'How can I make my home more heat-resilient?',
  'What does my heat score mean?',
  'வெப்ப அலை பாதுகாப்பு குறிப்புகள் (Tamil Tips)',
];

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  activeWeather,
  householdProfile,
  preparednessScore,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I am **Climate Copilot**, your intelligent climate preparedness companion. I can help families, schools, and outdoor workers prepare for heatwaves and floods, explain risk calculation methodology, and guide sustainability actions in English or தமிழ் (Tamil).\n\n*Safety Disclaimer: I am an AI assistant and can make mistakes. I do not issue statutory meteorological warnings or medical advice. For emergencies, dial 112 or 108 immediately.*',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ta'>('en');
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare current assessment context
    const assessmentPayload = activeWeather
      ? {
          location: activeWeather.locationName,
          temperature: activeWeather.current.temperature,
          apparentTemperature: activeWeather.current.apparentTemperature,
          humidity: activeWeather.current.relativeHumidity,
          heatRiskScore: activeWeather.heatRiskScore,
          floodRiskScore: activeWeather.floodRiskScore,
          preparednessScore,
          vulnerableGroups: householdProfile.vulnerableGroups,
          membersCount: householdProfile.membersCount,
        }
      : null;

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversationHistory: messages.map((m) => ({ role: m.role, content: m.content })),
          assessment: assessmentPayload,
          language,
        }),
      });

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Thank you for checking in with ClimateReady Guide.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFallback: data.isFallback,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          'Network connection issue: The AI Assistant is temporarily unreachable. Please consult the built-in FAQ section or dial 112 for local emergency services.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFallback: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // TTS Read-aloud function
  const handleReadAloud = async (msgId: string, text: string) => {
    if (isPlayingAudio === msgId) {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(null);
      return;
    }

    setIsPlayingAudio(msgId);

    // Try server-side Gemini 3.8 Flash TTS first
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 300), language }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
          audioElementRef.current = audio;
          audio.onended = () => setIsPlayingAudio(null);
          audio.onerror = () => fallbackBrowserSpeech(msgId, text);
          await audio.play();
          return;
        }
      }
    } catch {
      // ignore and use fallback
    }

    fallbackBrowserSpeech(msgId, text);
  };

  const fallbackBrowserSpeech = (msgId: string, text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#]/g, ''));
      utterance.lang = language === 'ta' ? 'ta-IN' : 'en-US';
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(null);
      utterance.onerror = () => setIsPlayingAudio(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(null);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content:
          'Chat session refreshed. How can I help you prepare for heat or monsoon conditions today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl h-[90vh] max-h-[720px] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-base">Climate Copilot</h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-medium border border-teal-500/30">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400">Grounded in app methodology &amp; your assessment</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLanguage((l) => (l === 'en' ? 'ta' : 'en'))}
              title="Toggle language English / தமிழ்"
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 flex items-center gap-1.5 transition-colors"
            >
              <Languages className="w-3.5 h-3.5 text-teal-400" />
              <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>

            <button
              type="button"
              onClick={resetChat}
              title="Clear chat"
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="px-4 py-2 bg-amber-950/40 border-b border-amber-900/40 flex items-center gap-2 text-xs text-amber-300/90">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            AI advice only. Not an official disaster warning. In emergencies, call <strong>112</strong> immediately.
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-teal-900/60 border border-teal-700/50 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-teal-600 text-white rounded-tr-none'
                    : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                <div className="mt-2 pt-1 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {msg.role === 'assistant' && (
                    <button
                      type="button"
                      onClick={() => handleReadAloud(msg.id, msg.content)}
                      className="hover:text-teal-300 flex items-center gap-1 transition-colors"
                      title="Read aloud"
                    >
                      {isPlayingAudio === msg.id ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                          <span className="text-amber-400">Stop voice</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Voice</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-blue-900/60 border border-blue-700/50 flex items-center justify-center text-blue-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-lg bg-teal-900/60 border border-teal-700/50 flex items-center justify-center text-teal-400 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400 animate-spin" />
                <span>Formulating grounded response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Chips */}
        <div className="px-4 py-2 bg-slate-850 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] text-slate-400 font-medium shrink-0 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-teal-400" />
            Quick:
          </span>
          {QUICK_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(chip)}
              className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-800/90 border-t border-slate-700">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                language === 'ta'
                  ? 'காலநிலை அல்லது தயார்நிலை பற்றி கேட்கவும்...'
                  : 'Ask about heat risk, flood calculations, emergency packing...'
              }
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-medium text-sm flex items-center gap-1.5 transition-colors shadow-md shadow-teal-900/30"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Query counts logged anonymously • Zero personal data retention</span>
            <span>English &amp; தமிழ் Supported</span>
          </div>
        </div>
      </div>
    </div>
  );
};
