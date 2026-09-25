import React from 'react';
import { BarChart3, Users, PhoneCall, MessageSquare, Mail, Star, Shield, TrendingUp } from 'lucide-react';

export default function AnalyticsDashboard({ contacts = [], history = [] }) {
  const totalContacts = contacts.length;
  const vipCount = contacts.filter(c => c.category === 'VIP').length;
  const workCount = contacts.filter(c => c.category === 'Work').length;
  const favoriteCount = contacts.filter(c => c.isFavorite).length;

  const phoneCount = history.filter(h => h.type === 'phone').length;
  const whatsappCount = history.filter(h => h.type === 'whatsapp').length;
  const emailCount = history.filter(h => h.type === 'email').length;
  const totalCalls = history.length;

  // Most Contacted Top People Calculation
  const contactStats = {};
  history.forEach(h => {
    contactStats[h.contactName] = (contactStats[h.contactName] || 0) + 1;
  });
  const topContacted = Object.entries(contactStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Dashboard Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-card rounded-3xl p-6 border border-slate-800 flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Directory</span>
            <span className="text-2xl font-extrabold text-white">{totalContacts}</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">{favoriteCount} Starred Favorites</span>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-slate-800 flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Mobile Calls</span>
            <span className="text-2xl font-extrabold text-white">{phoneCount}</span>
            <span className="text-[11px] text-emerald-400 block mt-0.5">Native Dial Triggered</span>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-slate-800 flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-green-500/20 text-green-400 border border-green-500/30">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">WhatsApp Chats</span>
            <span className="text-2xl font-extrabold text-white">{whatsappCount}</span>
            <span className="text-[11px] text-green-400 block mt-0.5">WhatsApp Web/App</span>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-slate-800 flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Gmail Dispatches</span>
            <span className="text-2xl font-extrabold text-white">{emailCount}</span>
            <span className="text-[11px] text-purple-400 block mt-0.5">Live EmailJS & Gmail</span>
          </div>
        </div>

      </div>

      {/* Analytics Main Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Channel Usage Breakdown */}
        <div className="lg:col-span-6 glass-card rounded-3xl p-6 border border-slate-800 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <span>Communication Channel Breakdown</span>
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-emerald-400">Mobile Phone Calls</span>
                <span className="text-white">{phoneCount} ({totalCalls ? Math.round((phoneCount / totalCalls) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                  style={{ width: `${totalCalls ? (phoneCount / totalCalls) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-green-400">WhatsApp Messages</span>
                <span className="text-white">{whatsappCount} ({totalCalls ? Math.round((whatsappCount / totalCalls) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-500"
                  style={{ width: `${totalCalls ? (whatsappCount / totalCalls) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-indigo-400">Gmail Inquiries</span>
                <span className="text-white">{emailCount} ({totalCalls ? Math.round((emailCount / totalCalls) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${totalCalls ? (emailCount / totalCalls) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 leading-relaxed">
            Overall engagement score is high across mobile dialing and instant WhatsApp communication.
          </div>
        </div>

        {/* Top Contacted People */}
        <div className="lg:col-span-6 glass-card rounded-3xl p-6 border border-slate-800 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Star className="w-5 h-5 text-amber-400" />
            <span>Top Contacted People</span>
          </h3>

          {topContacted.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No interactions logged yet.</p>
          ) : (
            <div className="space-y-3">
              {topContacted.map(([name, count], index) => {
                const match = contacts.find(c => c.name === name);
                return (
                  <div
                    key={name}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 text-xs font-bold flex items-center justify-center border border-indigo-500/30">
                        #{index + 1}
                      </span>
                      <img
                        src={match?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`}
                        alt={name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white">{name}</h4>
                        <p className="text-[11px] text-slate-400">{match?.phone || 'Saved Contact'}</p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold">
                      {count} Touchpoint(s)
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
