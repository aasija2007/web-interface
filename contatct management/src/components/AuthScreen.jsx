import React, { useState } from 'react';
import { User, Phone, Mail, Lock, Eye, EyeOff, LogIn, UserPlus, ShieldCheck, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { loginUser, registerUser, getDemoCredentials } from '../services/authService';

export default function AuthScreen({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form fields matching exact requested format: Username, Mobile Number, Email, Password
  const [formData, setFormData] = useState({
    username: '',
    mobile: '',
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  };

  const handleFillDemo = () => {
    const demo = getDemoCredentials();
    setFormData({
      username: demo.username,
      mobile: demo.mobile,
      email: demo.email,
      password: demo.password
    });
    setError('');
    setSuccessMessage('Demo credentials filled! Click Sign In to continue.');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Field Validations
    if (!formData.username.trim()) {
      setError('Please enter your Username.');
      return;
    }
    if (!formData.mobile.trim()) {
      setError('Please enter your Mobile Number.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter your Email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid Email address format (e.g. name@domain.com).');
      return;
    }
    if (!formData.password) {
      setError('Please enter your Password.');
      return;
    }
    if (isSignUp && formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      try {
        if (isSignUp) {
          const newUser = registerUser(formData);
          setSuccessMessage('Account created successfully!');
          setTimeout(() => {
            onLoginSuccess(newUser);
          }, 600);
        } else {
          const user = loginUser(formData);
          setSuccessMessage('Signed in successfully! Redirecting...');
          setTimeout(() => {
            onLoginSuccess(user);
          }, 600);
        }
      } catch (err) {
        setError(err.message || 'Authentication failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Dynamic Background Glow Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000"></div>

      {/* Main Glassmorphic Auth Box */}
      <div className="relative w-full max-w-md bg-slate-900/80 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/50">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-lg shadow-indigo-500/30 ring-1 ring-white/20 mb-3">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
            OmniCall Access
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Secure Contact & Multi-Channel Communications Hub
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="flex bg-slate-950/70 p-1.5 rounded-2xl border border-slate-800/80 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setError('');
              setSuccessMessage('');
            }}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              !isSignUp
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
          
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setError('');
              setSuccessMessage('');
            }}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              isSignUp
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Error / Success Feedback Banners */}
        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start space-x-2.5 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-start space-x-2.5 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Fields: Username, Mobile Number, Email, Password */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* 1. Username Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g. alex_developer"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                required
              />
            </div>
          </div>

          {/* 2. Mobile Number Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="e.g. +1 (555) 019-2834"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                required
              />
            </div>
          </div>

          {/* 3. Email Address Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. alex.developer@omnicall.io"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                required
              />
            </div>
          </div>

          {/* 4. Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Action Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-600/30 transition-all duration-200 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : isSignUp ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Register New Account</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to OmniCall</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Helper */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
          <button
            type="button"
            onClick={handleFillDemo}
            className="inline-flex items-center space-x-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fill Demo Credentials for Quick Testing</span>
          </button>
        </div>

      </div>
    </div>
  );
}
