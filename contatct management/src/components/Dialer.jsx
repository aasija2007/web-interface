import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, Mail, Delete, User, Volume2, ShieldCheck, Zap, PhoneCall, PhoneOff, Video } from 'lucide-react';
import { playDtmfTone, makePhoneCall, launchWhatsApp, launchSms } from '../services/dialerService';
import { triggerTwilioRealCall, getTwilioConfig } from '../services/twilioService';

const KEYPAD_KEYS = [
  { digit: '1', letters: '' },
  { digit: '2', letters: 'ABC' },
  { digit: '3', letters: 'DEF' },
  { digit: '4', letters: 'GHI' },
  { digit: '5', letters: 'JKL' },
  { digit: '6', letters: 'MNO' },
  { digit: '7', letters: 'PQRS' },
  { digit: '8', letters: 'TUV' },
  { digit: '9', letters: 'WXYZ' },
  { digit: '*', letters: '' },
  { digit: '0', letters: '+' },
  { digit: '#', letters: '' }
];

export default function Dialer({ contacts = [], onLogActivity, onOpenEmailModal, onSelectContact }) {
  const [dialedNumber, setDialedNumber] = useState('');
  const [matchedContacts, setMatchedContacts] = useState([]);
  const [activeCallState, setActiveCallState] = useState(null); // null | { contactName, phone, duration, isConnected, twilioInfo }
  const [callTimer, setCallTimer] = useState(0);

  // T9 & Digit match filtering
  useEffect(() => {
    if (!dialedNumber) {
      setMatchedContacts([]);
      return;
    }
    const cleanQuery = dialedNumber.replace(/[^\d]/g, '');
    const matches = contacts.filter(c => {
      const cleanPhone = (c.phone || '').replace(/[^\d]/g, '');
      const cleanSec = (c.secondaryPhone || '').replace(/[^\d]/g, '');
      return cleanPhone.includes(cleanQuery) || cleanSec.includes(cleanQuery);
    });
    setMatchedContacts(matches.slice(0, 4));
  }, [dialedNumber, contacts]);

  // Active call timer tick
  useEffect(() => {
    let interval;
    if (activeCallState && activeCallState.isConnected) {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeCallState]);

  const handleKeyPress = (digit) => {
    playDtmfTone(digit);
    setDialedNumber(prev => prev + digit);
  };

  const handleBackspace = () => {
    setDialedNumber(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setDialedNumber('');
  };

  // Direct Mobile Call / Twilio Trigger
  const handleInitiatePhoneCall = async (targetPhone = dialedNumber, contactName = 'Unknown') => {
    if (!targetPhone) return;
    
    // Play dial tone feedback
    playDtmfTone('0', 400);

    const targetName = contactName !== 'Unknown' ? contactName : (matchedContacts[0]?.name || targetPhone);

    // Execute Twilio live API or Native fallback
    const result = await triggerTwilioRealCall(targetPhone);
    
    // Log activity
    if (onLogActivity) {
      onLogActivity({
        contactName: targetName,
        type: 'phone',
        target: targetPhone,
        status: result.mode === 'twilio_live' ? 'Twilio Call Dispatched' : 'Native Call Triggered',
        notes: result.message
      });
    }

    // Set interactive active call view
    setActiveCallState({
      contactName: targetName,
      phone: targetPhone,
      isConnected: false,
      status: result.mode === 'twilio_live' ? 'Twilio Voice Dispatching...' : 'Ringing mobile number...',
      callMessage: result.message,
      callSid: result.callSid
    });

    // Simulate connection after 2.5s for rich UI experience
    setTimeout(() => {
      setActiveCallState(prev => prev ? { ...prev, isConnected: true, status: 'In Call' } : null);
    }, 2500);
  };

  // WhatsApp Call / Message
  const handleWhatsAppTrigger = (targetPhone = dialedNumber, contactName = 'Unknown') => {
    if (!targetPhone) return;
    launchWhatsApp(targetPhone);

    if (onLogActivity) {
      onLogActivity({
        contactName: contactName !== 'Unknown' ? contactName : (matchedContacts[0]?.name || targetPhone),
        type: 'whatsapp',
        target: targetPhone,
        status: 'WhatsApp Launched',
        notes: 'Opened WhatsApp direct voice / chat link'
      });
    }
  };

  // SMS Trigger
  const handleSmsTrigger = (targetPhone = dialedNumber) => {
    if (!targetPhone) return;
    launchSms(targetPhone);
  };

  const handleEndCall = () => {
    setActiveCallState(null);
    setCallTimer(0);
  };

  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Active Call In-Progress Overlay (Ringing / Ongoing UI) */}
      {activeCallState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl animate-fade-in">
          <div className="w-full max-w-md p-8 rounded-3xl glass-card border-indigo-500/30 text-center flex flex-col items-center relative shadow-2xl shadow-indigo-500/20">
            
            <div className="relative mb-6">
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-emerald-500/30 pulse-call">
                <User className="w-14 h-14" />
              </div>
              <div className="absolute -bottom-1 -right-1 p-2 rounded-full bg-emerald-500 text-white shadow-lg">
                <PhoneCall className="w-5 h-5" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-1">
              {activeCallState.contactName}
            </h3>
            <p className="text-slate-400 font-mono text-sm mb-4">
              {activeCallState.phone}
            </p>

            <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold mb-8">
              {activeCallState.isConnected ? `Connected • ${formatDuration(callTimer)}` : activeCallState.status}
            </div>

            <p className="text-xs text-slate-400 mb-8 max-w-xs">
              Direct call dispatched to mobile network. Your phone device dialer will ring target number.
            </p>

            <div className="flex items-center space-x-6">
              <button
                onClick={() => launchWhatsApp(activeCallState.phone)}
                className="p-4 rounded-full bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-all border border-emerald-500/20"
                title="Switch to WhatsApp"
              >
                <Video className="w-6 h-6" />
              </button>

              <button
                onClick={handleEndCall}
                className="p-5 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/40 transition-all hover:scale-105 active:scale-95"
                title="End Call"
              >
                <PhoneOff className="w-8 h-8" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Main Dialer Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left / Main Keypad Column */}
        <div className="lg:col-span-7 flex flex-col items-center">
          
          <div className="w-full max-w-md glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
            
            {/* Real Dialed Number Display */}
            <div className="w-full bg-slate-950/80 rounded-2xl p-4 mb-6 border border-slate-800/80 text-center flex flex-col justify-center min-h-[90px] relative group">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Real Dial Pad
              </span>
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  readOnly
                  value={dialedNumber}
                  placeholder="Enter phone number..."
                  className="w-full bg-transparent text-center text-3xl font-mono font-bold text-indigo-400 tracking-wider focus:outline-none"
                />
                {dialedNumber && (
                  <button
                    onClick={handleBackspace}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                    title="Backspace"
                  >
                    <Delete className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Instant T9 Matches Counter */}
              {matchedContacts.length > 0 && (
                <div className="mt-2 text-xs text-emerald-400 font-medium flex items-center justify-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>Matched {matchedContacts.length} Contact(s)</span>
                </div>
              )}
            </div>

            {/* Keypad Grid (3x4) */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
              {KEYPAD_KEYS.map((k) => (
                <button
                  key={k.digit}
                  onClick={() => handleKeyPress(k.digit)}
                  className="dial-btn h-16 sm:h-18 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/80 flex flex-col items-center justify-center text-white shadow-sm hover:border-indigo-500/40 hover:shadow-indigo-500/10 active:scale-95"
                >
                  <span className="text-2xl font-bold text-slate-100">{k.digit}</span>
                  {k.letters && (
                    <span className="text-[10px] font-semibold text-slate-400 tracking-widest">
                      {k.letters}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Call Trigger Buttons */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              
              {/* Native Mobile Call Button */}
              <button
                onClick={() => handleInitiatePhoneCall()}
                disabled={!dialedNumber}
                className="col-span-1 h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center space-x-2 font-bold shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
                title="Direct Phone Call to Mobile"
              >
                <Phone className="w-5 h-5 fill-current" />
                <span className="text-xs sm:text-sm">Call</span>
              </button>

              {/* WhatsApp Call & Chat */}
              <button
                onClick={() => handleWhatsAppTrigger()}
                disabled={!dialedNumber}
                className="col-span-1 h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center space-x-1.5 font-bold shadow-lg shadow-green-600/20 transition-all active:scale-95"
                title="WhatsApp Voice / Chat"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="text-xs sm:text-sm">WhatsApp</span>
              </button>

              {/* SMS Launch */}
              <button
                onClick={() => handleSmsTrigger()}
                disabled={!dialedNumber}
                className="col-span-1 h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 flex items-center justify-center space-x-1.5 font-semibold border border-slate-700 transition-all active:scale-95"
                title="Send SMS"
              >
                <Mail className="w-4 h-4" />
                <span className="text-xs sm:text-sm">SMS</span>
              </button>

            </div>

            {dialedNumber && (
              <button
                onClick={handleClear}
                className="w-full mt-4 text-xs text-slate-400 hover:text-red-400 transition-colors text-center font-medium"
              >
                Clear Dialer
              </button>
            )}

          </div>

        </div>

        {/* Right / Matched Contacts & Speed Dial Column */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* T9 Dynamic Matches Box */}
          {matchedContacts.length > 0 && (
            <div className="glass-card rounded-3xl p-5 border border-indigo-500/30">
              <h4 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider mb-3 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                <span>Matching Contacts ({matchedContacts.length})</span>
              </h4>
              <div className="space-y-2.5">
                {matchedContacts.map(c => (
                  <div
                    key={c.id}
                    className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=6366f1&color=fff`; }}
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <p className="text-sm font-bold text-white">{c.name}</p>
                          {c.isVerified && (
                            <span className="inline-flex items-center text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded border border-emerald-500/30">
                              <ShieldCheck className="w-3 h-3 mr-0.5" />
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-mono">{c.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleInitiatePhoneCall(c.phone, c.name)}
                        className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"
                        title="Call Mobile"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleWhatsAppTrigger(c.phone, c.name)}
                        className="p-2 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white transition-colors"
                        title="WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Speed Dial / Favorites Panel */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800">
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Speed Dial Favorites</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              {contacts.filter(c => c.isFavorite).slice(0, 6).map((c, idx) => (
                <div
                  key={c.id}
                  onClick={() => handleInitiatePhoneCall(c.phone, c.name)}
                  className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/80 cursor-pointer group transition-all flex items-center space-x-3"
                >
                  <div className="relative">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-10 h-10 rounded-full object-cover border border-indigo-500/40"
                      onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=6366f1&color=fff`; }}
                    />
                    <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center">
                      {idx + 1}
                    </span>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white truncate group-hover:text-indigo-400 transition-colors">
                      {c.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{c.phone}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Real Communication Note */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-slate-900/40 border border-indigo-500/20 text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-indigo-300 block mb-1">⚡ Real Mobile Connectivity:</span>
            Clicking <strong className="text-emerald-400">Call</strong> or <strong className="text-emerald-400">WhatsApp</strong> initiates actual phone calls to real mobile numbers using your system phone dialer and WhatsApp Web/App protocols.
          </div>

        </div>

      </div>
    </div>
  );
}
