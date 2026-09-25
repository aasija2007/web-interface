import React, { useState, useEffect } from 'react';
import { X, Mail, Send, Sparkles, CheckCircle2, ExternalLink, AlertCircle, User, ArrowRight } from 'lucide-react';
import { sendRealEmail } from '../services/emailService';

const EMAIL_TEMPLATES = [
  {
    title: 'Follow-up Meeting',
    subject: 'Quick follow-up regarding our discussion',
    body: 'Hi [Name],\n\nIt was great speaking with you earlier. I wanted to follow up on our discussion and confirm next steps.\n\nLet me know if you have any questions!\n\nBest regards,'
  },
  {
    title: 'Project Proposal',
    subject: 'Project Overview & Next Steps',
    body: 'Hi [Name],\n\nFollowing up on our recent conversation, I am sharing the project outline and key details.\n\nPlease take a look and let me know your thoughts.\n\nBest regards,'
  },
  {
    title: 'Quick Check-in',
    subject: 'Quick check-in',
    body: 'Hi [Name],\n\nHope you are having a great week! Just checking in to see how everything is going on your end.\n\nWarm regards,'
  }
];

export default function EmailComposerModal({ contact, onClose, onLogActivity }) {
  const [fromEmail, setFromEmail] = useState('user@omnicall.com');
  const [fromName, setFromName] = useState('OmniCall User');
  const [toEmail, setToEmail] = useState(contact?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sendingState, setSendingState] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
  const [statusMsg, setStatusMsg] = useState('');
  const [apiResponseInfo, setApiResponseInfo] = useState(null);

  useEffect(() => {
    if (contact?.email) {
      setToEmail(contact.email);
    }
  }, [contact]);

  if (!contact) return null;

  const applyTemplate = (tpl) => {
    setSubject(tpl.subject);
    setMessage(tpl.body.replace(/\[Name\]/g, contact.name));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!toEmail) {
      alert('Please enter a recipient To Email address.');
      return;
    }

    setSendingState('sending');
    setStatusMsg('Dispatching live email payload to API...');
    setApiResponseInfo(null);

    try {
      const result = await sendRealEmail({
        to_email: toEmail,
        to_name: contact.name,
        subject: subject || `Message from ${fromName}`,
        message: message,
        from_name: fromName,
        reply_to: fromEmail
      });

      setSendingState('success');
      setStatusMsg(result.message);
      setApiResponseInfo(result);

      if (onLogActivity) {
        onLogActivity({
          contactName: contact.name,
          type: 'email',
          target: toEmail,
          status: result.mode === 'emailjs' ? 'EmailJS API Sent (200 OK)' : 'Gmail Web Opened',
          notes: `From: ${fromEmail} | Subject: ${subject}`
        });
      }

      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (err) {
      setSendingState('error');
      setStatusMsg('EmailJS API call failed. Opening direct Gmail web composer...');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl glass-panel rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Real Email Dispatcher</h3>
              <p className="text-xs text-slate-400">Direct Gmail Web & EmailJS Live SDK Integration</p>
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
        <form onSubmit={handleSend} className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* From Email & To Email Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">From Email (Sender) *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="sender@domain.com"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">To Email (Recipient) *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400" />
                <input
                  type="email"
                  required
                  placeholder="recipient@domain.com"
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-xs font-mono text-indigo-300 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Preset Templates */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Quick Email Templates</span>
            </span>
            <div className="flex items-center space-x-2 overflow-x-auto pb-1">
              {EMAIL_TEMPLATES.map((tpl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => applyTemplate(tpl)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 whitespace-nowrap transition-colors"
                >
                  {tpl.title}
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Email Subject *</label>
            <input
              type="text"
              required
              placeholder="e.g. Q3 Discussion Followup"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl glass-input text-sm"
            />
          </div>

          {/* Message Body */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Email Message *</label>
            <textarea
              rows={5}
              required
              placeholder="Write your email message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl glass-input text-sm leading-relaxed"
            />
          </div>

          {/* Sender Name */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Sender Display Name</label>
            <input
              type="text"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl glass-input text-xs text-slate-300"
            />
          </div>

          {/* Status Message & API Response Display */}
          {sendingState !== 'idle' && (
            <div className={`p-4 rounded-2xl border text-xs flex flex-col space-y-2 transition-all ${
              sendingState === 'sending' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' :
              sendingState === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' :
              'bg-red-500/10 border-red-500/30 text-red-300'
            }`}>
              <div className="flex items-center space-x-2">
                {sendingState === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" /> : <Mail className="w-5 h-5 shrink-0 animate-pulse" />}
                <span className="font-bold text-sm">{statusMsg}</span>
              </div>
              {apiResponseInfo && (
                <div className="pl-7 text-[11px] opacity-90 font-mono">
                  Dispatch Mode: <span className="underline uppercase font-bold">{apiResponseInfo.mode}</span> • Target Inbox: {toEmail}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 hidden sm:inline">
              ⚡ Verified EmailJS & Gmail Web Dispatcher
            </span>

            <div className="flex items-center space-x-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-2xl bg-slate-900 text-slate-300 hover:text-white text-sm font-semibold transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={sendingState === 'sending' || !toEmail}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>{sendingState === 'sending' ? 'Sending...' : 'Send Real Email'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
