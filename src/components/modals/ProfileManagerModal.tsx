import React, { useState, useRef } from 'react';
import { 
  X, 
  UserPlus, 
  Users, 
  Check, 
  Edit3, 
  ShieldCheck, 
  Sparkles, 
  Award, 
  Mail, 
  Briefcase, 
  Image as ImageIcon, 
  Trash2, 
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Upload,
  Camera,
  RefreshCw
} from 'lucide-react';
import { UserProfile } from '../../types';
import { AVAILABLE_AVATARS } from '../../data/initialHabits';

interface ProfileManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  teamMembers: UserProfile[];
  onSelectProfile: (profile: UserProfile) => void;
  onAddProfile: (newProfile: UserProfile) => void;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
  onDeleteProfile?: (profileId: string) => void;
}

export const ProfileManagerModal: React.FC<ProfileManagerModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  teamMembers,
  onSelectProfile,
  onAddProfile,
  onUpdateProfile,
  onDeleteProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'switch' | 'new' | 'edit'>('switch');

  // File input refs
  const newFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // New Member Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newTitle, setNewTitle] = useState('Executive & Habit Architect');
  const [newRole, setNewRole] = useState('New Member');
  const [newBio, setNewBio] = useState('Focused on building disciplined daily habits and peak performance.');
  const [newAvatar, setNewAvatar] = useState(AVAILABLE_AVATARS[0]);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [newUploadedFileName, setNewUploadedFileName] = useState('');

  // Edit Current Member State
  const [editName, setEditName] = useState(currentProfile.name);
  const [editEmail, setEditEmail] = useState(currentProfile.email || '');
  const [editTitle, setEditTitle] = useState(currentProfile.title);
  const [editRole, setEditRole] = useState(currentProfile.role || '');
  const [editBio, setEditBio] = useState(currentProfile.bio || '');
  const [editAvatar, setEditAvatar] = useState(currentProfile.avatar);
  const [editCustomUrl, setEditCustomUrl] = useState('');
  const [editUploadedFileName, setEditUploadedFileName] = useState('');

  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  // Handle local file photo upload (converts to Base64 data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditMode: boolean) => {
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
        if (isEditMode) {
          setEditAvatar(base64Url);
          setEditUploadedFileName(file.name);
          setEditCustomUrl('');
        } else {
          setNewAvatar(base64Url);
          setNewUploadedFileName(file.name);
          setCustomAvatarUrl('');
        }
        showToast(`Photo "${file.name}" loaded successfully!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const finalAvatar = customAvatarUrl.trim() || newAvatar;

    const created: UserProfile = {
      id: `member-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim() || `${newName.toLowerCase().replace(/\s+/g, '.')}@habitflow.io`,
      avatar: finalAvatar,
      level: 1,
      currentXp: 100,
      nextLevelXp: 1000,
      title: newTitle.trim() || 'Habit Practitioner',
      role: newRole.trim() || 'Team Member',
      bio: newBio.trim(),
      totalHabitsCompleted: 0,
    };

    onAddProfile(created);
    onSelectProfile(created);
    showToast(`Welcome ${created.name}! Profile activated.`);
    setNewName('');
    setNewEmail('');
    setCustomAvatarUrl('');
    setNewUploadedFileName('');
    setActiveTab('switch');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    const finalAvatar = editCustomUrl.trim() || editAvatar;

    const updated: UserProfile = {
      ...currentProfile,
      name: editName.trim(),
      email: editEmail.trim(),
      title: editTitle.trim(),
      role: editRole.trim(),
      bio: editBio.trim(),
      avatar: finalAvatar,
    };

    onUpdateProfile(updated);
    showToast('Profile updated successfully!');
    setTimeout(() => {
      setActiveTab('switch');
    }, 600);
  };

  const currentActiveAvatarForNew = customAvatarUrl.trim() || newAvatar;
  const currentActiveAvatarForEdit = editCustomUrl.trim() || editAvatar;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-blue-500/10 dark:from-emerald-950/40 dark:to-blue-950/40 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <span>Profile Selection Option</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {teamMembers.length} Available Profiles
                </span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Option to select a profile, switch active members, or register a new profile
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 pb-1 border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40 flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('switch')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'switch'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Option to select a profile ({teamMembers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('new')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'new'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add New Member</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditName(currentProfile.name);
              setEditEmail(currentProfile.email || '');
              setEditTitle(currentProfile.title);
              setEditRole(currentProfile.role || '');
              setEditBio(currentProfile.bio || '');
              setEditAvatar(currentProfile.avatar);
              setActiveTab('edit');
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Active Profile</span>
          </button>
        </div>

        {/* Floating Notification */}
        {notification && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-emerald-500 text-white text-xs font-bold flex items-center justify-between shadow-lg shadow-emerald-500/20 animate-fade-in shrink-0">
            <span className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{notification}</span>
            </span>
          </div>
        )}

        {/* Tab Content 1: Switch Profile */}
        {activeTab === 'switch' && (
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 block">
                  Option to select a profile
                </span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  Click on any profile below to activate and switch accounts
                </span>
              </div>
              <button
                onClick={() => setActiveTab('new')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1 cursor-pointer shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Member</span>
              </button>
            </div>

            <div className="space-y-3">
              {teamMembers.map((member) => {
                const isActive = member.id === currentProfile.id;
                return (
                  <div
                    key={member.id}
                    onClick={() => {
                      onSelectProfile(member);
                      showToast(`Switched active profile to ${member.name}`);
                    }}
                    className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 ${
                      isActive
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500/60 ring-2 ring-emerald-500/30'
                        : 'bg-gray-50/80 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-gray-200 dark:ring-gray-700 shadow-sm"
                        />
                        {isActive && (
                          <span className="absolute -bottom-1 -right-1 p-0.5 bg-emerald-500 text-white rounded-full ring-2 ring-white dark:ring-gray-900">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                            {member.name}
                          </h4>
                          {isActive && (
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-500 text-white">
                              Active
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {member.title}
                        </p>

                        <div className="flex items-center space-x-3 text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                          <span className="flex items-center space-x-1">
                            <Award className="w-3 h-3 text-amber-500" />
                            <span>Level {member.level}</span>
                          </span>
                          <span>•</span>
                          <span>{member.totalHabitsCompleted} Habits Completed</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {isActive ? (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                          <span>Current</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-700 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-gray-700 dark:text-gray-300 text-xs font-bold border border-gray-200 dark:border-gray-600 transition-colors"
                        >
                          Switch
                        </button>
                      )}

                      {teamMembers.length > 1 && !isActive && onDeleteProfile && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteProfile(member.id);
                            showToast(`Member profile removed.`);
                          }}
                          className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition-colors"
                          title="Remove member profile"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Content 2: Add New Member Form */}
        {activeTab === 'new' && (
          <form onSubmit={handleCreateMember} className="p-6 space-y-5 overflow-y-auto flex-1">
            
            {/* Profile New Picture Adding Option */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center space-x-1.5">
                  <ImageIcon className="w-4 h-4 text-emerald-500" />
                  <span>Profile New Picture Adding Option</span>
                </label>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  Upload or Select Photo
                </span>
              </div>

              {/* Active Picture Live Preview & Upload Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-gray-900 p-3 rounded-2xl border border-gray-200/80 dark:border-gray-700">
                <div className="relative group shrink-0">
                  <img
                    src={currentActiveAvatarForNew}
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
                      ref={newFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, false)}
                    />

                    {/* Trigger File Upload Button */}
                    <button
                      type="button"
                      onClick={() => newFileInputRef.current?.click()}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Picture from Device / Camera</span>
                    </button>

                    {newUploadedFileName && (
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 truncate max-w-[160px]">
                        ✓ {newUploadedFileName}
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
                        setNewUploadedFileName('');
                      }}
                      placeholder="Or paste any web image URL (https://...)"
                      className="w-full text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Member Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Member Full Name *
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g., Jonathan Reed, Marcus Sterling"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
              />
            </div>

            {/* Title / Profession */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5 flex items-center space-x-1">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Executive Title</span>
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Managing Partner, Senior Architect"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5 flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Email / Handle</span>
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g., name@company.io"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Bio / Habits Objective */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Member Habit Objective & Focus
              </label>
              <textarea
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                rows={2}
                placeholder="e.g., Dedicated to morning productivity, daily sprint training, and clean nutrition."
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setActiveTab('switch')}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create & Switch to Member</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab Content 3: Edit Active Profile */}
        {activeTab === 'edit' && (
          <form onSubmit={handleSaveEdit} className="p-6 space-y-5 overflow-y-auto flex-1">
            
            {/* Profile New Picture Adding Option for Edit */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center space-x-1.5">
                  <ImageIcon className="w-4 h-4 text-emerald-500" />
                  <span>Profile New Picture Adding Option</span>
                </label>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  Update Photo
                </span>
              </div>

              {/* Active Picture Live Preview & Upload Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-gray-900 p-3 rounded-2xl border border-gray-200/80 dark:border-gray-700">
                <div className="relative group shrink-0">
                  <img
                    src={currentActiveAvatarForEdit}
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
                    {/* Hidden edit file input */}
                    <input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, true)}
                    />

                    {/* Trigger File Upload Button */}
                    <button
                      type="button"
                      onClick={() => editFileInputRef.current?.click()}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Picture from Device / Camera</span>
                    </button>

                    {editUploadedFileName && (
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 truncate max-w-[160px]">
                        ✓ {editUploadedFileName}
                      </span>
                    )}
                  </div>

                  {/* Custom URL Input */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="url"
                      value={editCustomUrl}
                      onChange={(e) => {
                        setEditCustomUrl(e.target.value);
                        setEditUploadedFileName('');
                      }}
                      placeholder="Or paste any custom web image URL..."
                      className="w-full text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
              />
            </div>

            {/* Edit Title & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Executive Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Edit Bio */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Bio & Habit Motto
              </label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={2}
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Save Buttons */}
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setActiveTab('switch')}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
