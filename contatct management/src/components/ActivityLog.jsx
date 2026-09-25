import React, { useState } from 'react';
import { History, Phone, MessageSquare, Mail, Trash2, Clock, Filter, User, ArrowUpRight } from 'lucide-react';
import { makePhoneCall, launchWhatsApp } from '../services/dialerService';

export default function ActivityLog({ history = [], onClearHistory, onOpenEmailModal, contacts = [] }) {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'phone' | 'whatsapp' | 'email'

  const filteredHistory = history.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const handleRedialOrContact = (logItem) => {
    if (logItem.type === 'phone') {
      makePhoneCall(logItem.target);
    } else if (logItem.type === 'whatsapp') {
      launchWhatsApp(logItem.target);
    } else if (logItem.type === 'email' && onOpenEmailModal) {
      const match = contacts.find(c => c.email === logItem.target || c.name === logItem.contactName);
      if (match) onOpenEmailModal(match);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header Toolbar */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Activity & Call History</h2>
            <p className="text-xs text-slate-400">Complete record of dialed calls, WhatsApp chats, and Gmail dispatches</p>
          </div>
        </div>

        {/* Filter Chips & Clear */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            {['all', 'phone', 'whatsapp', 'email'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition-all ${
                  filterType === type ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all"
              title="Clear Log History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* History Timeline */}
      {filteredHistory.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-slate-800/80 flex flex-col items-center justify-center space-y-3">
          <Clock className="w-12 h-12 text-slate-600" />
          <h3 className="text-base font-bold text-white">No activity logged yet</h3>
          <p className="text-xs text-slate-400">
            Dial numbers or send messages to build your real-time communication timeline.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-2xl p-4 border border-slate-800/80 hover:border-indigo-500/30 flex items-center justify-between transition-all"
            >
              <div className="flex items-center space-x-4">
                
                {/* Channel Icon Badge */}
                <div className={`p-3 rounded-2xl shrink-0 ${
                  item.type === 'phone' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  item.type === 'whatsapp' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                  'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                }`}>
                  {item.type === 'phone' ? <Phone className="w-5 h-5" /> :
                   item.type === 'whatsapp' ? <MessageSquare className="w-5 h-5" /> :
                   <Mail className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-white">{item.contactName}</h4>
                    <span className="text-[10px] font-semibold text-slate-400 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800">
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1 font-mono">
                    <span>Target: {item.target}</span>
                    {item.notes && <span className="text-slate-400 hidden sm:inline">• {item.notes}</span>}
                  </div>
                </div>

              </div>

              <div className="flex items-center space-x-4">
                <span className="text-xs text-slate-400 font-mono hidden md:inline">
                  {formatDate(item.timestamp)}
                </span>

                <button
                  onClick={() => handleRedialOrContact(item)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-indigo-600 hover:text-white border border-slate-800 text-slate-300 transition-all flex items-center space-x-1 text-xs font-semibold"
                  title="Re-connect"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="hidden sm:inline">Re-connect</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
