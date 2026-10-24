import React, { useState } from 'react';
import {
  X,
  PhoneCall,
  MapPin,
  FileText,
  Printer,
  ShieldCheck,
  Plus,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { FamilyPlan, EmergencyContact } from '../../types';
import { STATIC_EMERGENCY_NUMBERS } from '../../data/constants';

interface EmergencyPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: FamilyPlan;
  onSave: (plan: FamilyPlan) => void;
  onPrintCard: () => void;
}

export const EmergencyPlanModal: React.FC<EmergencyPlanModalProps> = ({
  isOpen,
  onClose,
  plan,
  onSave,
  onPrintCard,
}) => {
  const [contacts, setContacts] = useState<EmergencyContact[]>(plan.contacts || []);
  const [meetingPointPrimary, setMeetingPointPrimary] = useState(plan.meetingPointPrimary || '');
  const [meetingPointSecondary, setMeetingPointSecondary] = useState(plan.meetingPointSecondary || '');
  const [specialInstructions, setSpecialInstructions] = useState(plan.specialInstructions || '');
  const [activeTab, setActiveTab] = useState<'plan' | 'helplines'>('plan');

  if (!isOpen) return null;

  const handleAddContact = () => {
    const newContact: EmergencyContact = {
      id: `cnt-${Date.now()}`,
      name: '',
      phone: '',
      relation: '',
      isPrimary: contacts.length === 0,
    };
    setContacts([...contacts, newContact]);
  };

  const handleUpdateContact = (id: string, field: keyof EmergencyContact, value: any) => {
    setContacts(contacts.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  const handleSave = () => {
    onSave({
      contacts,
      meetingPointPrimary,
      meetingPointSecondary,
      specialInstructions,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-850 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Household Emergency Contacts &amp; Family Plan</h3>
              <p className="text-xs text-slate-400">Feature 11: Contacts, evacuation meeting points &amp; verified helplines</p>
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

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-5 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('plan')}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'plan'
                ? 'border-teal-500 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Family Contacts &amp; Meeting Points
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('helplines')}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'helplines'
                ? 'border-teal-500 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Verified Indian Emergency Numbers (Static)
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeTab === 'plan' ? (
            <>
              {/* Meeting Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    Primary Meeting Point (High Ground / Nearby)
                  </label>
                  <input
                    type="text"
                    value={meetingPointPrimary}
                    onChange={(e) => setMeetingPointPrimary(e.target.value)}
                    placeholder="e.g. Higher ground Community Park / Sivan Temple Hall"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    Secondary Out-of-Area Meeting Point
                  </label>
                  <input
                    type="text"
                    value={meetingPointSecondary}
                    onChange={(e) => setMeetingPointSecondary(e.target.value)}
                    placeholder="e.g. Government Higher Secondary School, 2nd Floor"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Contacts List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Emergency Family &amp; Neighbor Contacts:
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddContact}
                    className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Contact</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {contacts.map((contact, idx) => (
                    <div
                      key={contact.id}
                      className="p-3 bg-slate-800/70 border border-slate-700 rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center"
                    >
                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={contact.name}
                          onChange={(e) => handleUpdateContact(contact.id, 'name', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <input
                          type="tel"
                          placeholder="Phone (e.g. +91 98401...)"
                          value={contact.phone}
                          onChange={(e) => handleUpdateContact(contact.id, 'phone', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          placeholder="Relationship"
                          value={contact.relation}
                          onChange={(e) => handleUpdateContact(contact.id, 'relation', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleDeleteContact(contact.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Remove contact"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Instructions */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-teal-400" />
                  Special Medical / Evacuation Instructions
                </label>
                <textarea
                  rows={2}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Grandfather requires wheelchair ramp; pack blood pressure medications and duplicate house keys."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-teal-500"
                />
              </div>
            </>
          ) : (
            /* Static Indian Emergency Numbers */
            <div className="space-y-3">
              <div className="p-3 bg-slate-850 rounded-xl border border-slate-700 text-xs text-slate-300">
                Static, verified government disaster reference lines. Toll-free across India.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STATIC_EMERGENCY_NUMBERS.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white text-sm">{item.name}</span>
                      <a
                        href={`tel:${item.number}`}
                        className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-mono font-bold text-xs flex items-center gap-1 shadow-sm"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>{item.number}</span>
                      </a>
                    </div>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">{item.description}</p>
                    <div className="mt-2 pt-2 border-t border-slate-700/60 text-[11px] text-teal-400 font-medium">
                      Source: {item.source}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 bg-slate-850 border-t border-slate-700 flex items-center justify-between">
          <button
            type="button"
            onClick={onPrintCard}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4 text-teal-400" />
            <span>Generate 1-Page Emergency Card</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-teal-900/30"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Save Plan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
