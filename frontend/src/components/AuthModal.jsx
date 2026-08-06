import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { X, Lock, Mail, User, ShieldCheck, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const AVATAR_OPTIONS = ['👨‍🌾', '👩‍🌾', '🌾', '🌱', '🥔', '🍅', '🌶️', '🌽'];

export default function AuthModal({ isOpen, onClose, initialTab = 'login' }) {
  const { loginWithGmail, registerWithGmail } = useUser();
  
  const [activeTab, setActiveTab] = useState(initialTab); // 'login' or 'register'
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Smallholder Farmer');
  const [region, setRegion] = useState('Chitwan, Nepal');
  const [avatar, setAvatar] = useState('👨‍🌾');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      if (activeTab === 'login') {
        const res = await loginWithGmail(email, password);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          setSuccessMsg('Successfully signed in!');
          setTimeout(() => {
            onClose();
          }, 800);
        }
      } else {
        // Validation
        if (!email.toLowerCase().includes('@')) {
          setErrorMsg('Please enter a valid Gmail address (e.g. farmer@gmail.com).');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters long.');
          setIsLoading(false);
          return;
        }

        const res = await registerWithGmail({
          email,
          password,
          name,
          role,
          region,
          avatar
        });

        if (res.error) {
          setErrorMsg(res.error);
        } else {
          setSuccessMsg('Account registered and secured successfully!');
          setTimeout(() => {
            onClose();
          }, 1000);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-emerald-50 text-primary border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 font-heading">
            {activeTab === 'login' ? 'Sign In to Your Account' : 'Create Secure Gmail Account'}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Protect your crop disease history & diagnosis records with password security.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-2xl mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              activeTab === 'login' 
                ? 'bg-white text-gray-900 shadow-sm font-bold' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              activeTab === 'register' 
                ? 'bg-white text-gray-900 shadow-sm font-bold' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Register with Gmail
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Email input */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Gmail / Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="farmer.nepal@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Additional fields for Registration */}
          {activeTab === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ram Bahadur Adhikari"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none"
                  >
                    <option value="Smallholder Farmer">Farmer</option>
                    <option value="Commercial Farmer">Commercial</option>
                    <option value="Agronomist">Agronomist</option>
                    <option value="Gardener">Gardener</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">District</label>
                  <input
                    type="text"
                    required
                    placeholder="Chitwan"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Choose Avatar</label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {AVATAR_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAvatar(opt)}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition-all ${
                        avatar === opt ? 'border-primary bg-green-50 scale-105 shadow-xs' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Feedback messages */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-[#22503A] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {activeTab === 'login' ? 'Verifying...' : 'Securing Account...'}
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                {activeTab === 'login' ? 'Sign In' : 'Create Protected Account'}
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
