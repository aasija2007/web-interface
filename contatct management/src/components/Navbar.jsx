import React, { useState, useEffect } from 'react';
import { Phone, Users, History, BarChart3, Settings, Plus, Download, LogOut, User, Mail, Smartphone } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenAddContact, onOpenSettings, onOpenImportExport, currentUser, onLogout }) {
  const [time, setTime] = useState(new Date());
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'dialer', label: 'Dialer', icon: Phone },
    { id: 'history', label: 'Activity Log', icon: History },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('contacts')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-1 ring-white/20">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  OmniCall
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live Connect
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Real Dial & Gmail Communication Hub
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Buttons & Profile */}
          <div className="flex items-center space-x-2 relative">
            <button
              onClick={onOpenAddContact}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-indigo-600/25 active:scale-95"
              title="Add New Contact"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Contact</span>
            </button>

            <button
              onClick={onOpenImportExport}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
              title="Import / Export Contacts"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenSettings}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
              title="EmailJS & Call Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* User Profile Pill & Dropdown */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-200 transition-all"
                  title="User Profile"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs">
                    {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-semibold hidden lg:inline max-w-[100px] truncate">
                    {currentUser.username}
                  </span>
                </button>

                {/* Profile Popover */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl z-50 animate-fadeIn">
                    <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-base shadow-md">
                        {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-sm font-bold text-slate-100 truncate">
                          {currentUser.username}
                        </h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Active Account
                        </span>
                      </div>
                    </div>

                    {/* Account Details */}
                    <div className="py-3 space-y-2 text-xs text-slate-300">
                      <div className="flex items-center space-x-2 text-slate-400">
                        <User className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="font-mono text-slate-200">{currentUser.username}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-400">
                        <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-slate-200">{currentUser.mobile}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-400">
                        <Mail className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-slate-200 truncate">{currentUser.email}</span>
                      </div>
                    </div>

                    {/* Logout Button */}
                    <div className="pt-2 border-t border-slate-800">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onLogout();
                        }}
                        className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}

