import React, { useState, useRef } from 'react';
import { 
  Settings, 
  Sun, 
  Moon, 
  Download, 
  RotateCcw, 
  User, 
  Users, 
  UserPlus, 
  Check, 
  Sparkles, 
  Shield, 
  Award, 
  Edit3,
  Mail,
  Briefcase,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { UserProfile } from '../../types';
import { AVAILABLE_AVATARS } from '../../data/initialHabits';

interface SettingsViewProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  teamMembers: UserProfile[];
  onSelectProfile: (profile: UserProfile) => void;
  onOpenProfileManager: () => void;
  onResetDemoData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  darkMode,
  setDarkMode,
  userProfile,
  setUserProfile,
  teamMembers,
  onSelectProfile,
  onOpenProfileManager,
  onResetDemoData,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [title, setTitle] = useState(userProfile.title);
  const [role, setRole] = useState(userProfile.role || '');
  const [email, setEmail] = useState(userProfile.email || '');
  const [bio, setBio] = useState(userProfile.bio || '');
  const [selectedAvatar, setSelectedAvatar] = useState(userProfile.avatar);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when userProfile changes
  React.useEffect(() => {
    setName(userProfile.name);
    setTitle(userProfile.title);
    setRole(userProfile.role || '');
    setEmail(userProfile.email || '');
    setBio(userProfile.bio || '');
    setSelectedAvatar(userProfile.avatar);
  }, [userProfile]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      if (base64Url) {
        setSelectedAvatar(base64Url);
        setUploadedFileName(file.name);
        setCustomAvatarUrl('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAvatar = customAvatarUrl.trim() || selectedAvatar;
    setUserProfile((prev) => ({
      ...prev,
      name: name.trim(),
      title: title.trim(),
      role: role.trim(),
      email: email.trim(),
      bio: bio.trim(),
      avatar: finalAvatar,
    }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({ 
        activeProfile: userProfile, 
        teamMembers,
        exportedAt: new Date().toISOString() 
      }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `habitflow-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in pb-12">
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Settings className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              Settings & Preferences
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Manage member profiles, theme appearance, and habit configurations
            </p>
          </div>
        </div>

        <button
          onClick={onOpenProfileManager}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer hover:scale-105"
        >
          <Users className="w-4 h-4" />
          <span>Option to select a profile</span>
        </button>
      </div>

      {/* 1. Member Profiles Management Card */}
      <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-emerald-500" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Option to Select a Profile (Profile Selection Option)
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Select any member card below to switch profiles instantly
              </p>
            </div>
          </div>
          <button
            onClick={onOpenProfileManager}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add New Member</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {teamMembers.map((member) => {
            const isActive = member.id === userProfile.id;
            return (
              <div
                key={member.id}
                onClick={() => onSelectProfile(member)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isActive
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/50 border-emerald-500/80 ring-2 ring-emerald-500/30'
                    : 'bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-xl object-cover ring-2 ring-emerald-500/40"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">
                        {member.name}
                      </span>
                      {isActive && (
                        <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-md font-extrabold uppercase">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                      {member.title}
                    </p>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                      <Award className="w-3 h-3" />
                      <span>Lvl {member.level} • {member.totalHabitsCompleted} completed</span>
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  {isActive ? (
                    <span className="p-1 rounded-full bg-emerald-500 text-white">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 group-hover:text-emerald-600">
                      Switch →
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Theme & Dark Mode Full Option Card */}
      <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
            {darkMode ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            <span>Full Appearance & Dark Mode Control</span>
          </h3>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            {darkMode ? 'Dark Mode Active' : 'Light Mode Active'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setDarkMode(false)}
            className={`p-4 rounded-2xl border flex items-center space-x-3 transition-all cursor-pointer text-left ${
              !darkMode 
                ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500 shadow-md' 
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600 shadow-xs">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-gray-900 dark:text-gray-100">Light Mode</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Clean, bright daytime visual styling</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setDarkMode(true)}
            className={`p-4 rounded-2xl border flex items-center space-x-3 transition-all cursor-pointer text-left ${
              darkMode 
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500 shadow-md shadow-emerald-950/30' 
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-indigo-950 text-amber-400 shadow-xs">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-gray-900 dark:text-gray-100">Dark Mode (Executive)</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">High-contrast OLED black & deep emeralds</div>
            </div>
          </button>
        </div>
      </div>

      {/* 3. Edit Active User Profile Info */}
      <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-xl space-y-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
          <Edit3 className="w-5 h-5 text-emerald-500" />
          <span>Edit Active Profile: {userProfile.name}</span>
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Profile New Picture Adding Option */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center space-x-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-500" />
                <span>Profile New Picture Adding Option</span>
              </label>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                Upload or Select Headshot
              </span>
            </div>

            {/* Active Picture Live Preview & Upload Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-gray-900 p-3 rounded-2xl border border-gray-200/80 dark:border-gray-700">
              <div className="relative group shrink-0">
                <img
                  src={customAvatarUrl.trim() || selectedAvatar}
                  alt="Active Preview"
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-white rounded-full">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              </div>

              <div className="flex-1 w-full space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />

                  {/* Trigger File Upload Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Picture from Device / Camera</span>
                  </button>

                  {uploadedFileName && (
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 truncate max-w-[160px]">
                      ✓ {uploadedFileName}
                    </span>
                  )}
                </div>

                {/* Custom URL Input */}
                <div className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={customAvatarUrl}
                    onChange={(e) => {
                      setCustomAvatarUrl(e.target.value);
                      setUploadedFileName('');
                    }}
                    placeholder="Or paste any web photo URL (https://...)"
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Full Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5 flex items-center space-x-1">
                <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                <span>Executive Title</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5 flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-emerald-500" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Role / Department
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Executive / Founder"
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Habit Focus & Bio
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              {savedSuccess ? '✓ Profile changes saved successfully!' : ''}
            </span>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* 4. Backup & Reset Data Card */}
      <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
          <Shield className="w-5 h-5 text-indigo-500" />
          <span>Data Management & Backup</span>
        </h3>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleExportData}
            className="flex-1 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:border-emerald-500 text-left flex items-center space-x-3 transition-colors cursor-pointer"
          >
            <Download className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100">Export Backup JSON</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Download active habits, member data & streaks</div>
            </div>
          </button>

          <button
            onClick={onResetDemoData}
            className="flex-1 p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 hover:border-rose-500 text-left flex items-center space-x-3 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-5 h-5 text-rose-500 shrink-0" />
            <div>
              <div className="text-sm font-bold text-rose-900 dark:text-rose-200">Reset Demo Data</div>
              <div className="text-xs text-rose-600/80 dark:text-rose-400/80">Restore initial sample habits & team profiles</div>
            </div>
          </button>
        </div>
      </div>

    </div>
  );
};
