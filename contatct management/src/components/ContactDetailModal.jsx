import React, { useState } from 'react';
import { X, Phone, MessageSquare, Mail, Star, Edit, Trash2, MapPin, Building, Briefcase, Calendar, Bell, Clock, Shield, Sparkles, ShieldCheck } from 'lucide-react';
import { makePhoneCall, launchWhatsApp, launchSms } from '../services/dialerService';
import { triggerTwilioRealCall } from '../services/twilioService';

export default function ContactDetailModal({
  contact,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite,
  onOpenEmailModal,
  onOpenWhatsAppModal,
  onLogActivity
}) {
  const [reminderNote, setReminderNote] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [reminderSaved, setReminderSaved] = useState(false);
  const [callStatusMsg, setCallStatusMsg] = useState('');

  if (!contact) return null;

  const handleCall = async () => {
    const res = await triggerTwilioRealCall(contact.phone);
    if (res && res.message) {
      setCallStatusMsg(res.message);
      setTimeout(() => setCallStatusMsg(''), 5000);
    }
    if (onLogActivity) {
      onLogActivity({
        contactName: contact.name,
        type: 'phone',
        target: contact.phone,
        status: res?.mode === 'twilio_live' ? 'Twilio Voice Dispatch' : 'Native Call Triggered',
        notes: res?.message || `Call to ${contact.name}`
      });
    }
  };

  const handleWhatsApp = () => {
    if (onOpenWhatsAppModal) {
      onOpenWhatsAppModal(contact);
    } else {
      launchWhatsApp(contact.phone);
    }
  };

  const handleEmail = () => {
    if (onOpenEmailModal) {
      onOpenEmailModal(contact);
    }
  };

  const handleSetReminder = (e) => {
    e.preventDefault();
    if (!reminderNote) return;
    setReminderSaved(true);
    setTimeout(() => {
      setReminderSaved(false);
      setShowReminderForm(false);
      setReminderNote('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl glass-panel rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header banner */}
        <div className="relative h-32 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-6 flex items-start justify-between">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-950/50 text-slate-300 hover:text-white hover:bg-slate-950/80 transition-colors ml-auto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="px-6 sm:px-8 pb-6 border-b border-slate-800/80 relative -mt-16 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-end space-x-4">
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-24 h-24 rounded-3xl object-cover border-4 border-slate-950 shadow-xl"
              onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=6366f1&color=fff`; }}
            />
            <div className="mb-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-extrabold text-white">{contact.name}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  contact.category === 'VIP' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                }`}>
                  {contact.category}
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-0.5">
                <p className="text-sm text-slate-400 font-mono">{contact.phone}</p>
                {contact.isVerified && (
                  <span className="inline-flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleFavorite(contact.id)}
              className={`p-2.5 rounded-2xl border transition-colors ${
                contact.isFavorite ? 'bg-amber-400/10 border-amber-400/30 text-amber-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Toggle Favorite"
            >
              <Star className={`w-5 h-5 ${contact.isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => onEdit(contact)}
              className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Edit Contact"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(contact.id)}
              className="p-2.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
              title="Delete Contact"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          
          {callStatusMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center space-x-2 animate-fade-in">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{callStatusMsg}</span>
            </div>
          )}

          {/* Quick Action Dispatchers */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={handleCall}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all active:scale-95"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>Mobile Call</span>
            </button>

            <button
              onClick={handleWhatsApp}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-bold text-sm shadow-lg shadow-green-600/20 flex items-center justify-center space-x-2 transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleEmail}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 transition-all active:scale-95"
            >
              <Mail className="w-4 h-4" />
              <span>Gmail Send</span>
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {contact.email && (
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                  <span className="text-sm font-medium text-white select-all">{contact.email}</span>
                </div>
              </div>
            )}

            {contact.secondaryPhone && (
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Secondary Phone</span>
                  <span className="text-sm font-medium text-white font-mono">{contact.secondaryPhone}</span>
                </div>
              </div>
            )}

            {contact.company && (
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Organization</span>
                  <span className="text-sm font-medium text-white">{contact.company}</span>
                </div>
              </div>
            )}

            {contact.jobTitle && (
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Job Title</span>
                  <span className="text-sm font-medium text-white">{contact.jobTitle}</span>
                </div>
              </div>
            )}

          </div>

          {contact.address && (
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start space-x-3">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Location / Address</span>
                <span className="text-sm font-medium text-white">{contact.address}</span>
              </div>
            </div>
          )}

          {contact.notes && (
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Personal Notes</span>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{contact.notes}</p>
            </div>
          )}

          {/* Callback Reminder Setter */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-purple-950/40 border border-indigo-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Callback Reminder</span>
              </div>
              <button
                onClick={() => setShowReminderForm(!showReminderForm)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                {showReminderForm ? 'Cancel' : '+ Set Reminder'}
              </button>
            </div>

            {showReminderForm && (
              <form onSubmit={handleSetReminder} className="space-y-3 pt-2">
                <input
                  type="text"
                  placeholder="e.g. Call regarding proposal feedback..."
                  value={reminderNote}
                  onChange={(e) => setReminderNote(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
                <div className="flex items-center justify-between">
                  <input
                    type="datetime-local"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="px-3 py-1.5 rounded-xl glass-input text-xs text-slate-300"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                  >
                    Save Reminder
                  </button>
                </div>
              </form>
            )}

            {reminderSaved && (
              <p className="text-xs text-emerald-400 font-medium">✓ Callback reminder scheduled!</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
