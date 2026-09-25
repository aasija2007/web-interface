import React, { useState, useEffect } from 'react';
import { X, Settings, Key, Mail, Phone, Save, Check, RefreshCw, HelpCircle, PhoneCall } from 'lucide-react';
import { getEmailConfig, saveEmailConfig } from '../services/emailService';
import { getTwilioConfig, saveTwilioConfig } from '../services/twilioService';

export default function SettingsModal({ onClose, onResetSampleData }) {
  const [emailConfig, setEmailConfigState] = useState({
    serviceId: '',
    templateId: '',
    publicKey: '',
    useDirectGmailWeb: true
  });

  const [twilioConfig, setTwilioConfigState] = useState({
    accountSid: '',
    authToken: '',
    fromTwilioNumber: '',
    twimlUrl: 'http://demo.twilio.com/docs/voice.xml'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const emailCfg = getEmailConfig();
    setEmailConfigState(emailCfg);

    const twilioCfg = getTwilioConfig();
    setTwilioConfigState(twilioCfg);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    saveEmailConfig(emailConfig);
    saveTwilioConfig(twilioConfig);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl glass-panel rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Twilio & EmailJS Settings</h3>
              <p className="text-xs text-slate-400">Configure credentials for real phone call dispatching and Gmail messaging</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Twilio Real Voice API Credentials */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Twilio Real Phone Call Voice Credentials</span>
            </h4>

            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your <a href="https://www.twilio.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline">Twilio Console</a> credentials to trigger real automated outbound calls directly to mobile phones.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Twilio Account SID</label>
                <input
                  type="text"
                  placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={twilioConfig.accountSid || ''}
                  onChange={(e) => setTwilioConfigState({ ...twilioConfig, accountSid: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Twilio Auth Token</label>
                <input
                  type="password"
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={twilioConfig.authToken || ''}
                  onChange={(e) => setTwilioConfigState({ ...twilioConfig, authToken: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">From Twilio Number</label>
                <input
                  type="tel"
                  placeholder="+18005550199"
                  value={twilioConfig.fromTwilioNumber || ''}
                  onChange={(e) => setTwilioConfigState({ ...twilioConfig, fromTwilioNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">TwiML URL (Optional)</label>
                <input
                  type="url"
                  placeholder="http://demo.twilio.com/docs/voice.xml"
                  value={twilioConfig.twimlUrl || ''}
                  onChange={(e) => setTwilioConfigState({ ...twilioConfig, twimlUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* EmailJS Live SDK Configuration */}
          <div className="pt-4 border-t border-slate-800/80 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>EmailJS Live API Credentials (Optional)</span>
            </h4>

            <p className="text-xs text-slate-400 leading-relaxed">
              To send emails seamlessly in the background to any Gmail account without opening popups, enter your free <a href="https://www.emailjs.com" target="_blank" rel="noreferrer" className="text-indigo-400 underline">EmailJS.com</a> keys below.
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">EmailJS Public Key</label>
              <input
                type="text"
                placeholder="e.g. user_xxxxxxxxxxxxxx"
                value={emailConfig.publicKey || ''}
                onChange={(e) => setEmailConfigState({ ...emailConfig, publicKey: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Service ID</label>
                <input
                  type="text"
                  placeholder="e.g. service_gmail"
                  value={emailConfig.serviceId || ''}
                  onChange={(e) => setEmailConfigState({ ...emailConfig, serviceId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Template ID</label>
                <input
                  type="text"
                  placeholder="e.g. template_contact"
                  value={emailConfig.templateId || ''}
                  onChange={(e) => setEmailConfigState({ ...emailConfig, templateId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Reset App Data */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Maintenance & Reset</h4>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div>
                <span className="text-xs font-bold text-white block">Restore Sample Demo Contacts</span>
                <span className="text-[11px] text-slate-400 block">Reload original test contacts and clear storage</span>
              </div>
              <button
                type="button"
                onClick={onResetSampleData}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Data</span>
              </button>
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center space-x-2">
              <Check className="w-4 h-4" />
              <span>Twilio & Email Settings saved successfully!</span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl bg-slate-900 text-slate-300 hover:text-white text-sm font-semibold transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
