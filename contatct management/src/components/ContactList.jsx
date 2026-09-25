import React, { useState } from 'react';
import { Search, Plus, Star, Phone, MessageSquare, Mail, MoreVertical, Building, Briefcase, Grid, List, Sparkles, Filter, ShieldCheck } from 'lucide-react';
import { makePhoneCall, launchWhatsApp } from '../services/dialerService';

const CATEGORIES = ['All', 'Favorites', 'VIP', 'Work', 'Personal', 'Friends'];

export default function ContactList({
  contacts = [],
  onSelectContact,
  onOpenAddContact,
  onOpenEmailModal,
  onOpenWhatsAppModal,
  onToggleFavorite,
  onDeleteContact,
  onLogActivity
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Filter contacts by search & category
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch =
      contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone?.includes(searchQuery) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Favorites') return contact.isFavorite;
    return contact.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleCall = (e, contact) => {
    e.stopPropagation();
    makePhoneCall(contact.phone);
    if (onLogActivity) {
      onLogActivity({
        contactName: contact.name,
        type: 'phone',
        target: contact.phone,
        status: 'Native Call Triggered',
        notes: `Dialed call to ${contact.name}`
      });
    }
  };

  const handleWhatsApp = (e, contact) => {
    e.stopPropagation();
    if (onOpenWhatsAppModal) {
      onOpenWhatsAppModal(contact);
    } else {
      launchWhatsApp(contact.phone);
    }
  };

  const handleEmail = (e, contact) => {
    e.stopPropagation();
    if (onOpenEmailModal) {
      onOpenEmailModal(contact);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Search & Category Filter Toolbar */}
      <div className="glass-card rounded-3xl p-4 sm:p-6 border border-slate-800 space-y-4">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search contacts, phones, emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl glass-input text-sm text-white placeholder-slate-400 transition-all focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Controls: View Mode Toggle & Add Button */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <span className="text-xs text-slate-400 font-medium px-2">
              {filteredContacts.length} Contact(s)
            </span>
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Contacts View Container */}
      {filteredContacts.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-slate-800/80 flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No contacts found</h3>
          <p className="text-sm text-slate-400 max-w-sm">
            Try adjusting your search criteria or add a new contact to your directory.
          </p>
          <button
            onClick={onOpenAddContact}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors"
          >
            Create New Contact
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map(contact => (
            <div
              key={contact.id}
              onClick={() => onSelectContact(contact)}
              className="glass-card rounded-3xl p-6 border border-slate-800/80 relative group cursor-pointer transition-all duration-200 hover:-translate-y-1"
            >
              
              {/* Category Badge & Favorite Star */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  contact.category === 'VIP' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  contact.category === 'Work' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                  contact.category === 'Family' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' :
                  'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {contact.category || 'General'}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(contact.id);
                  }}
                  className={`p-1.5 rounded-full transition-colors ${
                    contact.isFavorite ? 'text-amber-400 bg-amber-400/10' : 'text-slate-600 hover:text-slate-400'
                  }`}
                  title={contact.isFavorite ? 'Unstar' : 'Star Favorite'}
                >
                  <Star className={`w-4 h-4 ${contact.isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Avatar & Name */}
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/30 group-hover:border-indigo-500/80 transition-colors shadow-lg"
                  onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=6366f1&color=fff`; }}
                />
                <div className="overflow-hidden">
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                    {contact.name}
                  </h3>
                  <div className="flex items-center space-x-1.5">
                    <p className="text-xs text-slate-400 font-mono truncate">{contact.phone}</p>
                    {contact.isVerified && (
                      <span className="inline-flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20" title="OTP Verified Number">
                        <ShieldCheck className="w-3 h-3 mr-0.5" />
                        Verified
                      </span>
                    )}
                  </div>
                  {contact.jobTitle && (
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {contact.jobTitle} {contact.company ? `at ${contact.company}` : ''}
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Communication Buttons */}
              <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2">
                <button
                  onClick={(e) => handleCall(e, contact)}
                  className="py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white transition-all flex items-center justify-center space-x-1 text-xs font-semibold border border-emerald-500/20"
                  title="Direct Mobile Call"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </button>

                <button
                  onClick={(e) => handleWhatsApp(e, contact)}
                  className="py-2 px-3 rounded-xl bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white transition-all flex items-center justify-center space-x-1 text-xs font-semibold border border-green-500/20"
                  title="WhatsApp Chat"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={(e) => handleEmail(e, contact)}
                  className="py-2 px-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white transition-all flex items-center justify-center space-x-1 text-xs font-semibold border border-indigo-500/20"
                  title="Send Gmail"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      ) : (

        /* LIST VIEW */
        <div className="glass-card rounded-3xl p-2 border border-slate-800/80 divide-y divide-slate-800/80">
          {filteredContacts.map(contact => (
            <div
              key={contact.id}
              onClick={() => onSelectContact(contact)}
              className="p-4 hover:bg-slate-900/60 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-11 h-11 rounded-xl object-cover border border-slate-700"
                  onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=6366f1&color=fff`; }}
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {contact.name}
                    </h4>
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-slate-800 text-slate-300">
                      {contact.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-slate-400 mt-0.5 font-mono">
                    <span className="flex items-center space-x-1">
                      <span>{contact.phone}</span>
                      {contact.isVerified && (
                        <span className="inline-flex items-center text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20" title="Verified Number">
                          <ShieldCheck className="w-3 h-3 mr-0.5" />
                          Verified
                        </span>
                      )}
                    </span>
                    {contact.email && <span className="hidden sm:inline text-slate-500">{contact.email}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => handleCall(e, contact)}
                  className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"
                  title="Call"
                >
                  <Phone className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => handleWhatsApp(e, contact)}
                  className="p-2 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white transition-colors"
                  title="WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => handleEmail(e, contact)}
                  className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-colors"
                  title="Email"
                >
                  <Mail className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(contact.id);
                  }}
                  className={`p-2 rounded-xl transition-colors ${
                    contact.isFavorite ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                  }`}
                >
                  <Star className={`w-4 h-4 ${contact.isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

            </div>
          ))}
        </div>

      )}

    </div>
  );
}
