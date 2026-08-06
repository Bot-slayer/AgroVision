import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const DEFAULT_GUEST_PROFILE = {
  id: 'default_guest',
  name: 'Default Account',
  role: 'Guest (No History Saved)',
  region: 'Nepal',
  crops: ['Tomato', 'Potato', 'Maize', 'Pepper'],
  avatar: '👤',
  isDefault: true,
  isAuthenticated: false
};

const INITIAL_PROFILES = [
  DEFAULT_GUEST_PROFILE
];

export function UserProvider({ children }) {
  const [profiles, setProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem('agrovision_profiles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.some(p => p.id === DEFAULT_GUEST_PROFILE.id)) {
          return [DEFAULT_GUEST_PROFILE, ...parsed];
        }
        return parsed;
      }
      return INITIAL_PROFILES;
    } catch {
      return INITIAL_PROFILES;
    }
  });

  const [activeProfileId, setActiveProfileId] = useState(() => {
    try {
      const savedId = localStorage.getItem('agrovision_active_profile_id');
      return savedId || DEFAULT_GUEST_PROFILE.id;
    } catch {
      return DEFAULT_GUEST_PROFILE.id;
    }
  });

  const [history, setHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem('agrovision_history');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch {
      return [];
    }
  });

  // Save profiles to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('agrovision_profiles', JSON.stringify(profiles));
    } catch (e) {
      console.error('Failed to save profiles:', e);
    }
  }, [profiles]);

  // Save active profile ID
  useEffect(() => {
    try {
      localStorage.setItem('agrovision_active_profile_id', activeProfileId);
    } catch (e) {
      console.error('Failed to save active profile ID:', e);
    }
  }, [activeProfileId]);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('agrovision_history', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history:', e);
    }
  }, [history]);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0] || DEFAULT_GUEST_PROFILE;

  const switchProfile = (id) => {
    if (profiles.some(p => p.id === id)) {
      setActiveProfileId(id);
    }
  };

  const registerWithGmail = async (profileData) => {
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || 'Registration failed.' };
      }

      const safeProfile = {
        ...data.profile,
        isDefault: false,
        isAuthenticated: true
      };

      setProfiles(prev => {
        const filtered = prev.filter(p => p.id !== safeProfile.id && p.email !== safeProfile.email);
        return [...filtered, safeProfile];
      });
      setActiveProfileId(safeProfile.id);

      return { success: true, profile: safeProfile };
    } catch (err) {
      return { error: err.message || 'Server connection error.' };
    }
  };

  const loginWithGmail = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || 'Login failed.' };
      }

      const safeProfile = {
        ...data.profile,
        isDefault: false,
        isAuthenticated: true
      };

      setProfiles(prev => {
        const filtered = prev.filter(p => p.id !== safeProfile.id && p.email !== safeProfile.email);
        return [...filtered, safeProfile];
      });
      setActiveProfileId(safeProfile.id);

      return { success: true, profile: safeProfile };
    } catch (err) {
      return { error: err.message || 'Server connection error.' };
    }
  };

  const logout = () => {
    setProfiles(prev => prev.map(p =>
      p.id === activeProfile.id ? { ...p, isAuthenticated: false } : p
    ));
    setActiveProfileId(DEFAULT_GUEST_PROFILE.id);
  };

  const createProfile = (profileData) => {
    const newProfile = {
      id: 'prof_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: profileData.name || 'New Farmer',
      role: profileData.role || 'Smallholder Farmer',
      region: profileData.region || 'Nepal',
      crops: profileData.crops || ['Tomato', 'Potato'],
      avatar: profileData.avatar || '👩‍🌾',
      isDefault: false,
      isAuthenticated: false
    };

    setProfiles(prev => [...prev, newProfile]);
    setActiveProfileId(newProfile.id);
    return newProfile;
  };

  const updateProfile = (updatedFields) => {
    setProfiles(prev => prev.map(p => p.id === activeProfile.id ? { ...p, ...updatedFields } : p));
  };

  const deleteProfile = (id) => {
    if (id === DEFAULT_GUEST_PROFILE.id) return;
    setProfiles(prev => prev.filter(p => p.id !== id));
    setHistory(prev => prev.filter(h => h.profileId !== id));
    if (activeProfileId === id) {
      setActiveProfileId(DEFAULT_GUEST_PROFILE.id);
    }
  };

  const addHistoryItem = (diagnosisResult) => {
    if (activeProfile.isDefault) {
      return null;
    }

    const newItem = {
      id: 'diag_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      profileId: activeProfile.id,
      timestamp: new Date().toISOString(),
      crop: diagnosisResult.crop || 'Unknown Crop',
      disease: diagnosisResult.disease || 'Unknown Condition',
      confidence: diagnosisResult.confidence || 0,
      is_healthy: Boolean(diagnosisResult.is_healthy),
      fertilizer: diagnosisResult.fertilizer || '',
      pesticide: diagnosisResult.pesticide || '',
      prevention: diagnosisResult.prevention || '',
      mismatch_warning: diagnosisResult.mismatch_warning || null,
      imagePreview: diagnosisResult.imagePreview || null,
    };

    setHistory(prev => [newItem, ...prev]);
    return newItem;
  };

  const activeHistory = history.filter(h => h.profileId === activeProfile.id);

  const deleteHistoryItem = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    setHistory(prev => prev.filter(h => h.profileId !== activeProfile.id));
  };

  return (
    <UserContext.Provider value={{
      profiles,
      activeProfile,
      activeProfileId,
      switchProfile,
      registerWithGmail,
      loginWithGmail,
      logout,
      createProfile,
      updateProfile,
      deleteProfile,
      history: activeHistory,
      allHistory: history,
      addHistoryItem,
      deleteHistoryItem,
      clearHistory
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
