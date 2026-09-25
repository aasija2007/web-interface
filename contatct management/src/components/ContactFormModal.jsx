import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, Building, Briefcase, MapPin, FileText, Tag, Camera, Check, ShieldCheck, Send, KeyRound, ShieldAlert } from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&auto=format&fit=crop&q=80'
];

export default function ContactFormModal({ contactToEdit, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    secondaryPhone: '',
    email: '',
    category: 'Work',
    company: '',
    jobTitle: '',
    address: '',
    notes: '',
    avatar: AVATAR_PRESETS[0],
    isFavorite: false,
    isVerified: false
  });

  // OTP Verification state
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');

  useEffect(() => {
    if (contactToEdit) {
      setFormData({
        ...contactToEdit,
        secondaryPhone: contactToEdit.secondaryPhone || '',
        email: contactToEdit.email || '',
        company: contactToEdit.company || '',
        jobTitle: contactToEdit.jobTitle || '',
        address: contactToEdit.address || '',
        notes: contactToEdit.notes || '',
        isVerified: contactToEdit.isVerified || false
      });
    }
  }, [contactToEdit]);

  const handleSendOtp = () => {
    if (!formData.phone) {
      alert('Please enter a mobile phone number first.');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    setOtpError('');
    setOtpInput('');
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpInput.trim() === generatedOtp) {
      setFormData(prev => ({ ...prev, isVerified: true }));
      setOtpSent(false);
      setOtpError('');
    } else {
      setOtpError('Invalid 6-digit OTP code. Please enter the correct code shown below.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    
    // Auto-generate UI Avatar if default avatar or empty
    let avatarUrl = formData.avatar;
    if (!avatarUrl) {
      avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=6366f1&color=fff`;
    }

    onSave({
      ...formData,
      id: contactToEdit ? contactToEdit.id : 'cnt-' + Date.now(),
      avatar: avatarUrl,
      createdAt: contactToEdit ? contactToEdit.createdAt : new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl glass-panel rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <User className="w-5 h-5 text-indigo-400" />
            <span>{contactToEdit ? 'Edit Contact Details' : 'Add New Contact'}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Avatar Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Profile Photo Preset
            </label>
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              {AVATAR_PRESETS.map((img, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setFormData({ ...formData, avatar: img })}
                  className={`relative shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${
                    formData.avatar === img ? 'border-indigo-500 scale-105 shadow-md shadow-indigo-500/30' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Avatar option" className="w-12 h-12 object-cover" />
                  {formData.avatar === img && (
                    <div className="absolute inset-0 bg-indigo-600/40 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-2xl glass-input text-sm bg-slate-900 text-white"
              >
                <option value="VIP">VIP</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Family">Family</option>
                <option value="Friends">Friends</option>
              </select>
            </div>
          </div>

          {/* Phone Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">Mobile Phone *</label>
                {formData.isVerified ? (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send OTP</span>
                  </button>
                )}
              </div>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value, isVerified: false })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Secondary Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  placeholder="Optional work number"
                  value={formData.secondaryPhone}
                  onChange={(e) => setFormData({ ...formData, secondaryPhone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-sm font-mono"
                />
              </div>
            </div>
          </div>

          {/* OTP Dispatch & 6-digit Code Entry Card */}
          {otpSent && !formData.isVerified && (
            <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-300 flex items-center space-x-1.5">
                  <KeyRound className="w-4 h-4 text-indigo-400" />
                  <span>OTP Sent to {formData.phone}</span>
                </span>
                <span className="font-mono text-emerald-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-emerald-500/30">
                  Code: {generatedOtp}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl glass-input text-sm font-mono tracking-widest text-center font-bold text-indigo-300"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30"
                >
                  Verify Code
                </button>
              </div>

              {otpError && (
                <div className="text-[11px] text-red-400 font-semibold flex items-center space-x-1">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Gmail / Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder="name@domain.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-sm"
              />
            </div>
          </div>

          {/* Company & Job Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Org</label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Google Inc."
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Job Title</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Lead Developer"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-sm"
                />
              </div>
            </div>
          </div>

          {/* Location & Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Address / City</label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="City, State, or Full Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Contact Notes</label>
            <textarea
              rows={3}
              placeholder="Important notes, preferred contact hours..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl glass-input text-sm"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl bg-slate-900 text-slate-300 hover:text-white text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              {contactToEdit ? 'Save Changes' : 'Create Contact'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
