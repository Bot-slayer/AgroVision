import { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Leaf, User, History, Home as HomeIcon, Info as InfoIcon, ChevronDown, Check, Plus, ShieldOff } from 'lucide-react';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Result from './pages/Result';
import Info from './pages/Info';
import Profile from './pages/Profile';
import CursorTrail from './components/CursorTrail';
import { UserProvider, useUser } from './context/UserContext';

function NavBar() {
  const { profiles, activeProfile, switchProfile, history } = useUser();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-white border-b border-gray-200 py-3 px-4 sm:px-8 md:px-12 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      <Link to="/" className="flex items-center gap-3 group shrink-0">
        <div className="bg-primary p-2 rounded-xl group-hover:bg-[#22503A] transition-colors shadow-sm">
          <Leaf className="text-white w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight font-heading leading-none">AgroVision</h1>
          <span className="text-[10px] font-semibold text-primary tracking-widest uppercase block mt-0.5">Nepal</span>
        </div>
      </Link>
      
      <nav className="flex items-center gap-2 sm:gap-4 text-sm font-medium">
        <Link 
          to="/" 
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            isActive('/') ? 'bg-green-50 text-primary font-semibold' : 'text-gray-600 hover:text-primary hover:bg-gray-50'
          }`}
        >
          <HomeIcon className="w-4 h-4 hidden sm:inline" />
          <span>Home</span>
        </Link>

        <Link 
          to="/info" 
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            isActive('/info') ? 'bg-green-50 text-primary font-semibold' : 'text-gray-600 hover:text-primary hover:bg-gray-50'
          }`}
        >
          <InfoIcon className="w-4 h-4 hidden sm:inline" />
          <span>Info</span>
        </Link>

        {/* Profile & Multi-Account Switcher Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`pl-3 pr-3 py-1.5 rounded-full border transition-all flex items-center gap-2 ${
              isActive('/profile') 
                ? 'bg-primary text-white border-primary shadow-sm font-semibold' 
                : 'bg-emerald-50/90 text-primary border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300'
            }`}
          >
            <span className="text-base">{activeProfile.avatar || '👨‍🌾'}</span>
            <span className="text-xs font-semibold max-w-[100px] truncate">{activeProfile.name}</span>
            {activeProfile.isDefault ? (
              <span className="text-[9px] bg-amber-400 text-amber-950 font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                Default
              </span>
            ) : (
              history.length > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  isActive('/profile') ? 'bg-white text-primary' : 'bg-primary text-white'
                }`}>
                  {history.length}
                </span>
              )
            )}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Account Switcher Popover Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Switch Active Account</p>
              </div>

              <div className="max-h-60 overflow-y-auto py-1">
                {profiles.map((p) => {
                  const isSelected = p.id === activeProfile.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => { switchProfile(p.id); setDropdownOpen(false); }}
                      className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors ${
                        isSelected ? 'bg-emerald-50 text-primary font-semibold' : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-lg shrink-0">{p.avatar || '👨‍🌾'}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate">{p.name}</p>
                          <p className="text-[10px] text-gray-400 truncate">
                            {p.isDefault ? '🔒 No history saved' : p.role}
                          </p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-primary shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>

              <div className="p-2 border-t border-gray-100">
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  Manage Profiles & History
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-background text-text flex flex-col font-sans relative">
          <CursorTrail />
          
          <NavBar />

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col items-center w-full max-w-5xl mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/upload/:cropName" element={<Upload />} />
              <Route path="/result" element={<Result />} />
              <Route path="/info" element={<Info />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          
          {/* Footer */}
          <footer className="w-full border-t border-gray-200 bg-white text-gray-500 py-8 mt-12">
            <div className="max-w-5xl mx-auto px-6 text-center">
              <p className="text-sm font-medium">AgroVision | AI Crop Disease Diagnostics & Multi-Profile Support</p>
              <p className="text-xs mt-1 text-gray-400">© {new Date().getFullYear()} Cultivating better yields for Nepalese agriculture.</p>
            </div>
          </footer>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
