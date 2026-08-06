import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { 
  User, Edit3, Trash2, Search, Filter, Calendar, CheckCircle2, 
  AlertTriangle, Sprout, MapPin, X, Eye, ArrowLeft,
  Activity, Leaf, FileText, Check, AlertCircle, Users, PlusCircle, ShieldOff, CheckCircle,
  ShieldCheck, LogOut, KeyRound, Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthModal from '../components/AuthModal';

const AVATAR_OPTIONS = ['👨‍🌾', '👩‍🌾', '🌾', '🌱', '🥔', '🍅', '🌶️', '🌽', '👤', '🧑‍🌾'];

export default function Profile() {
  const { 
    profiles, 
    activeProfile, 
    switchProfile, 
    createProfile, 
    updateProfile, 
    deleteProfile, 
    logout,
    history, 
    deleteHistoryItem, 
    clearHistory 
  } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [authModalEmail, setAuthModalEmail] = useState('');

  // Edit profile state
  const [name, setName] = useState(activeProfile.name);
  const [role, setRole] = useState(activeProfile.role);
  const [region, setRegion] = useState(activeProfile.region);
  const [avatar, setAvatar] = useState(activeProfile.avatar || '👨‍🌾');

  // Create new profile state
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Smallholder Farmer');
  const [newRegion, setNewRegion] = useState('Chitwan, Nepal');
  const [newAvatar, setNewAvatar] = useState('👩‍🌾');
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState('All');
  const [healthFilter, setHealthFilter] = useState('All');

  // Detail Modal state
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState(null);

  const openEditModal = () => {
    setName(activeProfile.name);
    setRole(activeProfile.role);
    setRegion(activeProfile.region);
    setAvatar(activeProfile.avatar);
    setIsEditing(true);
  };

  const openAuth = (tab, email = '') => {
    setAuthModalTab(tab);
    setAuthModalEmail(email);
    setAuthModalOpen(true);
  };

  const handleProfileClick = (profile) => {
    if (profile.email && !profile.isAuthenticated) {
      openAuth('login', profile.email);
      return;
    }
    switchProfile(profile.id);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({ name, role, region, avatar });
    setIsEditing(false);
  };

  const handleCreateProfile = (e) => {
    e.preventDefault();
    createProfile({
      name: newName,
      role: newRole,
      region: newRegion,
      avatar: newAvatar,
      crops: ['Tomato', 'Potato', 'Maize', 'Pepper']
    });
    setNewName('');
    setIsCreating(false);
  };

  // Filter history items
  const filteredHistory = history.filter(item => {
    const matchesSearch = 
      item.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fertilizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pesticide.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCrop = selectedCropFilter === 'All' || item.crop.toLowerCase() === selectedCropFilter.toLowerCase();
    const matchesHealth = healthFilter === 'All' || 
      (healthFilter === 'Healthy' && item.is_healthy) ||
      (healthFilter === 'Diseased' && !item.is_healthy);

    return matchesSearch && matchesCrop && matchesHealth;
  });

  // Calculate statistics
  const totalScans = history.length;
  const healthyCount = history.filter(i => i.is_healthy).length;
  const diseaseCount = totalScans - healthyCount;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-secondary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => openAuth('login')}
            className="inline-flex items-center gap-1.5 bg-white text-gray-700 hover:text-primary border border-gray-200 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-2xs hover:bg-gray-50 transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-primary" />
            Sign In with Gmail
          </button>
        </div>
      </div>

      {/* Account Switcher Banner & Quick Select */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-50 text-primary p-2 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 font-heading">Switch Account / Profile</h2>
              <p className="text-xs text-gray-500">Sign in with Gmail or select an active account profile.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openAuth('register')}
              className="inline-flex items-center gap-1.5 bg-primary text-white hover:bg-[#22503A] text-xs font-semibold px-3.5 py-2 rounded-xl shadow-sm transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              Register Gmail Account
            </button>
            <button
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Quick Local Profile
            </button>
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {profiles.map((p) => {
            const isActive = p.id === activeProfile.id;
            return (
              <div
                key={p.id}
                onClick={() => handleProfileClick(p)}
                className={`group relative p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  isActive 
                    ? 'bg-emerald-50/70 border-primary shadow-sm ring-2 ring-primary/20' 
                    : 'bg-gray-50/60 border-gray-200 hover:bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-2xl shrink-0 shadow-xs">
                    {p.avatar || '👨‍🌾'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-gray-900 font-heading truncate">{p.name}</h4>
                      {isActive && (
                        <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                      )}
                    </div>
                    {p.isDefault ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md mt-0.5">
                        <ShieldOff className="w-2.5 h-2.5" /> No History Saved
                      </span>
                    ) : p.isAuthenticated ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md mt-0.5 truncate">
                        <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" /> {p.email}
                      </span>
                    ) : p.email ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md mt-0.5 truncate">
                        <Lock className="w-2.5 h-2.5 text-amber-700" /> Login required
                      </span>
                    ) : (
                      <p className="text-xs text-gray-500 truncate">{p.role}</p>
                    )}
                  </div>
                </div>

                {!p.isDefault && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setProfileToDelete(p); }}
                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-all ml-2"
                    title="Delete Account"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active User Profile Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-[#1e4633] to-[#2d5d44] text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-4xl shadow-inner shrink-0">
              {activeProfile.avatar || '👨‍🌾'}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold font-heading">{activeProfile.name}</h1>
                <span className="bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-medium tracking-wide">
                  {activeProfile.role}
                </span>
                
                {activeProfile.isAuthenticated ? (
                  <span className="bg-emerald-400/90 text-emerald-950 font-bold text-xs px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-950" /> Password Secured ({activeProfile.email})
                  </span>
                ) : activeProfile.isDefault ? (
                  <span className="bg-amber-400 text-amber-950 font-bold text-xs px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <ShieldOff className="w-3.5 h-3.5" /> Default (No History)
                  </span>
                ) : null}
              </div>

              <p className="flex items-center gap-2 text-green-100 text-sm mt-1.5 font-medium">
                <MapPin className="w-4 h-4 text-emerald-300 shrink-0" />
                {activeProfile.region}
              </p>
              {!activeProfile.isDefault && (
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="text-xs text-green-200 font-medium">Main Crops:</span>
                  {activeProfile.crops?.map((c, idx) => (
                    <span key={idx} className="bg-emerald-950/40 text-emerald-200 text-xs px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            <button
              onClick={openEditModal}
              className="inline-flex items-center gap-2 bg-white text-primary hover:bg-emerald-50 font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all text-sm"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>

            {!activeProfile.isDefault && (
              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 bg-emerald-900/60 hover:bg-emerald-900 text-green-200 font-semibold px-3 py-2.5 rounded-xl transition-all text-sm border border-emerald-500/30"
                title="Sign Out to Default Account"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Default Account Notice Banner */}
      {activeProfile.isDefault && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-900 flex items-start justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm font-heading">You are using the Default Account (Incognito Mode)</h4>
              <p className="text-xs text-amber-800 leading-relaxed mt-0.5">
                Diagnosis history is <strong>not saved</strong> under this default account. Sign in with your Gmail and password to keep your crop history password-protected.
              </p>
            </div>
          </div>
          <button
            onClick={() => openAuth('register')}
            className="inline-flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0 shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Create Gmail Account
          </button>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Saved Scans</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5 font-heading">{totalScans}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Healthy Crop Scans</p>
            <p className="text-2xl font-bold text-emerald-600 mt-0.5 font-heading">{healthyCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Diseases Detected</p>
            <p className="text-2xl font-bold text-amber-600 mt-0.5 font-heading">{diseaseCount}</p>
          </div>
        </div>
      </div>

      {/* History Controls & List */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              {activeProfile.name}'s Diagnosis History
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {activeProfile.isDefault 
                ? "Search history is disabled for Default Account. Switch or sign in to start saving history." 
                : "Review and manage your saved crop disease diagnostics and treatment recommendations."}
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="self-start sm:self-center inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear History
            </button>
          )}
        </div>

        {!activeProfile.isDefault && (
          <>
            {/* Filter Controls */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by disease, crop, treatment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                {/* Crop Filter */}
                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl p-1 text-xs font-semibold">
                  <span className="text-gray-400 px-2 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" /> Crop:
                  </span>
                  {['All', 'Tomato', 'Potato', 'Maize', 'Pepper'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCropFilter(c)}
                      className={`px-2.5 py-1.5 rounded-lg transition-all ${
                        selectedCropFilter === c 
                          ? 'bg-primary text-white shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                {/* Health Filter */}
                <select
                  value={healthFilter}
                  onChange={(e) => setHealthFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="All">All Statuses</option>
                  <option value="Healthy">Healthy Only</option>
                  <option value="Diseased">Action Needed Only</option>
                </select>
              </div>
            </div>

            {/* History List */}
            {filteredHistory.length === 0 ? (
              <div className="text-center py-16 px-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                <Sprout className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-700 font-heading">No Diagnosis History Saved</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                  {history.length === 0 
                    ? `You haven't uploaded any leaf images under ${activeProfile.name}'s account yet. Your saved scans will appear here automatically.` 
                    : "No saved records match your current filter and search terms."}
                </p>
                {history.length === 0 && (
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-5 py-2.5 rounded-xl text-sm mt-5 shadow-sm hover:bg-[#22503A] transition-colors"
                  >
                    Start Crop Diagnosis
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredHistory.map((item) => (
                  <div 
                    key={item.id}
                    className="group relative bg-white border border-gray-200 rounded-2xl p-4 hover:border-primary hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          {item.imagePreview ? (
                            <img 
                              src={item.imagePreview} 
                              alt={item.disease} 
                              className="w-14 h-14 rounded-xl object-cover border border-gray-200 bg-gray-50 shrink-0" 
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-primary shrink-0">
                              <Leaf className="w-7 h-7" />
                            </div>
                          )}
                          <div>
                            <span className="text-xs font-bold text-primary bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                              {item.crop}
                            </span>
                            <h4 className="text-base font-bold text-gray-900 font-heading mt-1 line-clamp-1">
                              {item.disease}
                            </h4>
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3" />
                              {new Date(item.timestamp).toLocaleString([], { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteHistoryItem(item.id)}
                          className="text-gray-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Status & Confidence Badge */}
                      <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-xl border border-gray-100 mb-3 text-xs">
                        <span className={`inline-flex items-center gap-1 font-semibold ${item.is_healthy ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {item.is_healthy ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Healthy Crop
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Action Needed
                            </>
                          )}
                        </span>
                        <span className="font-medium text-gray-600">
                          Confidence: <strong className="text-gray-900 font-semibold">{item.confidence}%</strong>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedHistoryItem(item)}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 bg-gray-100 hover:bg-primary hover:text-white text-gray-700 rounded-xl text-xs font-semibold transition-all mt-2"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Full Report & Treatment
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Auth Modal for Sign In / Sign Up */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
        initialEmail={authModalEmail}
      />

      {/* Create Local Account Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <h3 className="text-xl font-bold text-gray-900 font-heading flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-primary" /> Create Quick Local Profile
              </h3>
              <button 
                onClick={() => setIsCreating(false)} 
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProfile} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Choose Avatar Icon</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {AVATAR_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setNewAvatar(opt)}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border transition-all ${
                        newAvatar === opt ? 'border-primary bg-green-50 shadow-sm scale-105' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Account Holder Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sita Adhikari"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Role / Occupation</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                >
                  <option value="Smallholder Farmer">Smallholder Farmer</option>
                  <option value="Commercial Farmer">Commercial Farmer</option>
                  <option value="Agronomist / Extension Worker">Agronomist / Extension Worker</option>
                  <option value="Agricultural Student">Agricultural Student</option>
                  <option value="Gardener">Gardener</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Location / District</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jhapa, Nepal"
                  value={newRegion}
                  onChange={(e) => setNewRegion(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-[#22503A] transition-colors shadow-sm"
                >
                  Create & Switch Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <h3 className="text-xl font-bold text-gray-900 font-heading">Edit Profile Information</h3>
              <button 
                onClick={() => setIsEditing(false)} 
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Select Avatar</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {AVATAR_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAvatar(opt)}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border transition-all ${
                        avatar === opt ? 'border-primary bg-green-50 shadow-sm scale-105' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Occupation / Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                >
                  <option value="Guest (No History)">Guest (No History)</option>
                  <option value="Smallholder Farmer">Smallholder Farmer</option>
                  <option value="Commercial Farmer">Commercial Farmer</option>
                  <option value="Agronomist / Extension Worker">Agronomist / Extension Worker</option>
                  <option value="Agricultural Student">Agricultural Student</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Location / District</label>
                <input
                  type="text"
                  required
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-[#22503A] transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Profile Confirmation Modal */}
      {profileToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-gray-100 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 font-heading mb-2">Delete Profile '{profileToDelete.name}'?</h3>
            <p className="text-xs text-gray-500 mb-6">
              All saved search history for this profile will be permanently deleted.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setProfileToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => { deleteProfile(profileToDelete.id); setProfileToDelete(null); }}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm"
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Item Report Detail Modal */}
      {selectedHistoryItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedHistoryItem(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-primary bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                {selectedHistoryItem.crop} Diagnosis Report
              </span>
              <span className="text-xs text-gray-400">
                {new Date(selectedHistoryItem.timestamp).toLocaleString()}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 font-heading mb-4">
              {selectedHistoryItem.disease}
            </h3>

            {selectedHistoryItem.imagePreview && (
              <div className="w-full h-64 bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden mb-6 flex items-center justify-center">
                <img 
                  src={selectedHistoryItem.imagePreview} 
                  alt={selectedHistoryItem.disease} 
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Status Summary Banner */}
            <div className={`p-4 rounded-2xl border mb-6 flex items-center justify-between ${
              selectedHistoryItem.is_healthy 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center gap-3">
                {selectedHistoryItem.is_healthy ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                )}
                <div>
                  <p className="font-bold text-sm">
                    {selectedHistoryItem.is_healthy ? 'Plant Status: Healthy' : 'Treatment Action Required'}
                  </p>
                  <p className="text-xs opacity-90">
                    Model Confidence Rating: {selectedHistoryItem.confidence}%
                  </p>
                </div>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="space-y-4">
              {selectedHistoryItem.fertilizer && (
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1 flex items-center gap-1.5">
                    <Sprout className="w-4 h-4" /> Fertilizer Advice
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">
                    {selectedHistoryItem.fertilizer}
                  </p>
                </div>
              )}

              {selectedHistoryItem.pesticide && (
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Pesticide / Fungicide Treatment
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">
                    {selectedHistoryItem.pesticide}
                  </p>
                </div>
              )}

              {selectedHistoryItem.prevention && (
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-1 flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Prevention & Care Tips
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">
                    {selectedHistoryItem.prevention}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedHistoryItem(null)}
                className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-[#22503A] transition-colors"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear History Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-gray-100 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 font-heading mb-2">Clear History for {activeProfile.name}?</h3>
            <p className="text-xs text-gray-500 mb-6">
              This action will delete all saved search and diagnosis records for {activeProfile.name}. This cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => { clearHistory(); setShowClearConfirm(false); }}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
