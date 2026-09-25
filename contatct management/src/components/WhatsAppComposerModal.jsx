import React, { useState } from 'react';
import { X, MessageSquare, Send, Sparkles, ExternalLink } from 'lucide-react';
import { launchWhatsApp } from '../services/dialerService';

const WA_TEMPLATES = [
  "Hi [Name]! Are you available for a quick phone call today?",
  "Hey [Name], sending you a quick reminder about our upcoming meeting.",
  "Hi [Name], great connecting with you! Let me know when you have time to chat.",
  "Hey [Name], I've sent you an email. Please check your inbox when free!"
];

export default function WhatsAppComposerModal({ contact, onClose, onLogActivity }) {
  const [message, setMessage] = useState('');

  if (!contact) return null;

  const applyTemplate = (tpl) => {
    setMessage(tpl.replace(/\[Name\]/g, contact.name));
  };

  const handleLaunchWhatsApp = (e) => {
    e.preventDefault();
    launchWhatsApp(contact.phone, message);

    if (onLogActivity) {
      onLogActivity({
        contactName: contact.name,
        type: 'whatsapp',
        target: contact.phone,
        status: 'WhatsApp Chat Dispatched',
        notes: `Pre-filled message: ${message.slice(0, 40)}...`
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl glass-panel rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">WhatsApp Chat & Voice</h3>
              <p className="text-xs text-slate-400">Target: <span className="text-emerald-400 font-semibold">{contact.name}</span> ({contact.phone})</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLaunchWhatsApp} className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Quick Message Chips */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Quick WhatsApp Templates</span>
            </span>
            <div className="space-y-2">
              {WA_TEMPLATES.map((tpl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => applyTemplate(tpl)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 text-xs text-slate-300 transition-colors"
                >
                  "{tpl.replace(/\[Name\]/g, contact.name)}"
                </button>
              ))}
            </div>
          </div>

          {/* Message textarea */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">WhatsApp Message</label>
            <textarea
              rows={5}
              placeholder="Type WhatsApp message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl glass-input text-sm leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Opens WhatsApp Web or mobile app directly
            </span>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-2xl bg-slate-900 text-slate-300 hover:text-white text-sm font-semibold transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white text-sm font-bold shadow-lg shadow-green-600/20 flex items-center space-x-2 transition-all active:scale-95"
              >
                <span>Launch WhatsApp</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
