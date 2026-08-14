import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  Clock, 
  Package, 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Trash2, 
  Edit3, 
  ChevronDown, 
  ChevronUp, 
  Building2, 
  DollarSign, 
  Sparkles,
  Phone,
  FileSpreadsheet,
  Printer,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { DayWorkProjectLog, DayWorkMaterialItem, DayWorkCollaborator, UserProfile } from '../../types';

interface DayWorkViewProps {
  dayWorkLogs: DayWorkProjectLog[];
  setDayWorkLogs: React.Dispatch<React.SetStateAction<DayWorkProjectLog[]>>;
  activeProfile: UserProfile;
}

export const DayWorkView: React.FC<DayWorkViewProps> = ({
  dayWorkLogs,
  setDayWorkLogs,
  activeProfile,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'logs' | 'new-entry' | 'projects' | 'materials' | 'neighbors'>('logs');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('all');
  const [selectedPlaceFilter, setSelectedPlaceFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);

  // New Work Form State
  const [workName, setWorkName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [place, setPlace] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('08:00 AM');
  const [endTime, setEndTime] = useState('04:30 PM');
  const [durationHours, setDurationHours] = useState('8.0');
  const [checkInTime, setCheckInTime] = useState('07:50 AM');
  const [checkOutTime, setCheckOutTime] = useState('04:45 PM');
  const [status, setStatus] = useState<'completed' | 'in-progress' | 'pending' | 'review'>('completed');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('high');
  const [rating, setRating] = useState(5);
  const [description, setDescription] = useState('');
  const [weatherOrNotes, setWeatherOrNotes] = useState('');

  // Materials dynamic state
  const [materials, setMaterials] = useState<DayWorkMaterialItem[]>([
    { id: 'mat-1', name: 'Portland Cement (Grade 40)', quantity: '10', unit: 'bags', estimatedCost: '$120', status: 'used', notes: 'Standard mixing' }
  ]);
  const [newMatName, setNewMatName] = useState('');
  const [newMatQty, setNewMatQty] = useState('');
  const [newMatUnit, setNewMatUnit] = useState('pcs');
  const [newMatCost, setNewMatCost] = useState('');
  const [newMatStatus, setNewMatStatus] = useState<'available' | 'used' | 'ordered' | 'needed'>('used');
  const [newMatNotes, setNewMatNotes] = useState('');

  // Neighbors / Collaborators dynamic state
  const [neighbors, setNeighbors] = useState<DayWorkCollaborator[]>([
    { id: 'collab-1', name: activeProfile.name, role: activeProfile.title || 'Work Lead', phone: activeProfile.email || '' }
  ]);
  const [newNeighborName, setNewNeighborName] = useState('');
  const [newNeighborRole, setNewNeighborRole] = useState('Neighboring Site Co-Worker');
  const [newNeighborPhone, setNewNeighborPhone] = useState('');

  const [formSavedSuccess, setFormSavedSuccess] = useState(false);

  // Filter options derived from data
  const projectList = Array.from(new Set(dayWorkLogs.map(l => l.projectName).filter(Boolean)));
  const placeList = Array.from(new Set(dayWorkLogs.map(l => l.place).filter(Boolean)));

  // Aggregate Metrics
  const totalHours = dayWorkLogs.reduce((acc, curr) => acc + (curr.durationHours || 0), 0);
  const totalMaterialsUsed = dayWorkLogs.reduce((acc, curr) => acc + (curr.materials ? curr.materials.length : 0), 0);
  const totalCollaborators = dayWorkLogs.reduce((acc, curr) => acc + (curr.neighbors ? curr.neighbors.length : 0), 0);
  const completedLogsCount = dayWorkLogs.filter(l => l.status === 'completed').length;

  // Filtered Logs
  const filteredLogs = dayWorkLogs.filter(log => {
    const matchesSearch = 
      log.workName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.place.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.description && log.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.materials && log.materials.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (log.neighbors && log.neighbors.some(n => n.name.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesProject = selectedProjectFilter === 'all' || log.projectName === selectedProjectFilter;
    const matchesPlace = selectedPlaceFilter === 'all' || log.place === selectedPlaceFilter;
    const matchesStatus = selectedStatusFilter === 'all' || log.status === selectedStatusFilter;

    return matchesSearch && matchesProject && matchesPlace && matchesStatus;
  });

  // Material helpers
  const handleAddMaterial = () => {
    if (!newMatName.trim()) return;
    const item: DayWorkMaterialItem = {
      id: `mat-${Date.now()}`,
      name: newMatName.trim(),
      quantity: newMatQty.trim() || '1',
      unit: newMatUnit.trim() || 'pcs',
      estimatedCost: newMatCost.trim() ? (newMatCost.startsWith('$') ? newMatCost.trim() : `$${newMatCost.trim()}`) : undefined,
      status: newMatStatus,
      notes: newMatNotes.trim() || undefined
    };
    setMaterials(prev => [...prev, item]);
    setNewMatName('');
    setNewMatQty('');
    setNewMatCost('');
    setNewMatNotes('');
  };

  const handleRemoveMaterial = (id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
  };

  // Neighbor / Collaborator helpers
  const handleAddNeighbor = () => {
    if (!newNeighborName.trim()) return;
    const collab: DayWorkCollaborator = {
      id: `collab-${Date.now()}`,
      name: newNeighborName.trim(),
      role: newNeighborRole.trim() || 'Collaborator',
      phone: newNeighborPhone.trim() || undefined
    };
    setNeighbors(prev => [...prev, collab]);
    setNewNeighborName('');
    setNewNeighborRole('Neighboring Site Co-Worker');
    setNewNeighborPhone('');
  };

  const handleRemoveNeighbor = (id: string) => {
    setNeighbors(prev => prev.filter(n => n.id !== id));
  };

  // Submit Work Log
  const handleSubmitWorkLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workName.trim() || !projectName.trim()) return;

    if (editingLogId) {
      // Edit existing log
      setDayWorkLogs(prev => prev.map(item => {
        if (item.id === editingLogId) {
          return {
            ...item,
            workName: workName.trim(),
            projectName: projectName.trim(),
            place: place.trim() || 'Main Site',
            date,
            startTime,
            endTime,
            durationHours: parseFloat(durationHours) || 8.0,
            checkInTime,
            checkOutTime,
            status,
            priority,
            rating,
            description: description.trim(),
            weatherOrNotes: weatherOrNotes.trim(),
            materials,
            neighbors
          };
        }
        return item;
      }));
      setEditingLogId(null);
    } else {
      // Create new log
      const newLog: DayWorkProjectLog = {
        id: `dwl-${Date.now()}`,
        workName: workName.trim(),
        projectName: projectName.trim(),
        place: place.trim() || 'Main Operations Place',
        date,
        startTime,
        endTime,
        durationHours: parseFloat(durationHours) || 8.0,
        checkInTime,
        checkOutTime,
        status,
        priority,
        rating,
        description: description.trim(),
        weatherOrNotes: weatherOrNotes.trim(),
        materials,
        neighbors,
        createdByProfileId: activeProfile.id,
        createdByProfileName: activeProfile.name,
        createdAt: new Date().toISOString()
      };
      setDayWorkLogs(prev => [newLog, ...prev]);
    }

    setFormSavedSuccess(true);
    setTimeout(() => {
      setFormSavedSuccess(false);
      setActiveSubTab('logs');
      resetForm();
    }, 1200);
  };

  const resetForm = () => {
    setWorkName('');
    setProjectName('');
    setPlace('');
    setDate(new Date().toISOString().split('T')[0]);
    setStartTime('08:00 AM');
    setEndTime('04:30 PM');
    setDurationHours('8.0');
    setCheckInTime('07:50 AM');
    setCheckOutTime('04:45 PM');
    setStatus('completed');
    setPriority('high');
    setRating(5);
    setDescription('');
    setWeatherOrNotes('');
    setMaterials([]);
    setNeighbors([{ id: `collab-${Date.now()}`, name: activeProfile.name, role: activeProfile.title || 'Work Lead', phone: activeProfile.email || '' }]);
    setEditingLogId(null);
  };

  const handleEditLog = (log: DayWorkProjectLog) => {
    setEditingLogId(log.id);
    setWorkName(log.workName);
    setProjectName(log.projectName);
    setPlace(log.place);
    setDate(log.date);
    setStartTime(log.startTime || '08:00 AM');
    setEndTime(log.endTime || '04:30 PM');
    setDurationHours((log.durationHours || 8.0).toString());
    setCheckInTime(log.checkInTime || '07:50 AM');
    setCheckOutTime(log.checkOutTime || '04:45 PM');
    setStatus(log.status);
    setPriority(log.priority || 'medium');
    setRating(log.rating || 5);
    setDescription(log.description || '');
    setWeatherOrNotes(log.weatherOrNotes || '');
    setMaterials(log.materials || []);
    setNeighbors(log.neighbors || []);
    setActiveSubTab('new-entry');
  };

  const handleDeleteLog = (id: string) => {
    if (window.confirm('Are you sure you want to delete this day work log?')) {
      setDayWorkLogs(prev => prev.filter(l => l.id !== id));
    }
  };

  // Export functions
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify(dayWorkLogs, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `day-work-logs-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    let csv = 'ID,Date,Project Name,Work Name,Place / Location,Start Time,End Time,Duration (Hours),Status,Rating,Materials Used,Neighbors/Collaborators,Notes\n';
    dayWorkLogs.forEach(log => {
      const matStr = (log.materials || []).map(m => `${m.name} (${m.quantity} ${m.unit})`).join('; ').replace(/"/g, '""');
      const neighStr = (log.neighbors || []).map(n => `${n.name} [${n.role}]`).join('; ').replace(/"/g, '""');
      const desc = (log.description || '').replace(/"/g, '""');
      csv += `"${log.id}","${log.date}","${log.projectName}","${log.workName}","${log.place}","${log.startTime || ''}","${log.endTime || ''}","${log.durationHours || 0}","${log.status}","${log.rating}","${matStr}","${neighStr}","${desc}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', `day-work-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in pb-16">
      
      {/* 1. Page Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5" />
              <span>WORK UP • Day Work Operations & Site Management</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white flex items-center space-x-3">
              <span>WORK UP</span>
              <span className="text-xs sm:text-sm font-bold px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 uppercase tracking-wider">
                Day Work
              </span>
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl font-medium">
              Track day-to-day work execution, project assignments, site locations & places, date and time check-ins, materials ledger, and collaborator/neighbor involvement.
            </p>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                resetForm();
                setActiveSubTab('new-entry');
              }}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all cursor-pointer hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>+ Log New Day Work</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold backdrop-blur-md transition-all cursor-pointer"
              title="Download CSV Report"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold backdrop-blur-md transition-all cursor-pointer"
              title="Download JSON Backup"
            >
              <Download className="w-4 h-4 text-blue-300" />
              <span>JSON</span>
            </button>
          </div>
        </div>

        {/* 2. Top Summary KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Completed Work</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {completedLogsCount} <span className="text-xs font-normal text-slate-400">/ {dayWorkLogs.length} logs</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold">
              <Clock className="w-4 h-4" />
              <span>Total Hours Logged</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {totalHours.toFixed(1)} <span className="text-xs font-normal text-slate-400">hrs</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold">
              <Package className="w-4 h-4" />
              <span>Materials Tracked</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {totalMaterialsUsed} <span className="text-xs font-normal text-slate-400">items</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="flex items-center space-x-2 text-purple-400 text-xs font-bold">
              <Users className="w-4 h-4" />
              <span>Neighbors & Co-workers</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {totalCollaborators} <span className="text-xs font-normal text-slate-400">active</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('logs')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'logs'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
              : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200/80 dark:border-gray-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Work Logs & History ({dayWorkLogs.length})</span>
        </button>

        <button
          onClick={() => {
            if (activeSubTab !== 'new-entry') resetForm();
            setActiveSubTab('new-entry');
          }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'new-entry'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
              : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200/80 dark:border-gray-800'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{editingLogId ? 'Edit Work Entry' : '+ Log New Day Work'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('projects')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'projects'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
              : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200/80 dark:border-gray-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Projects Overview ({projectList.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('materials')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'materials'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
              : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200/80 dark:border-gray-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Materials Ledger</span>
        </button>

        <button
          onClick={() => setActiveSubTab('neighbors')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'neighbors'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
              : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200/80 dark:border-gray-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Neighbors & Laborers Directory</span>
        </button>
      </div>

      {/* 4. SUBTAB CONTENT 1: Work Logs & History */}
      {activeSubTab === 'logs' && (
        <div className="space-y-5">
          {/* Search & Filters Card */}
          <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-md flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search work name, project, place, materials, neighbors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Project Filter */}
              <select
                value={selectedProjectFilter}
                onChange={(e) => setSelectedProjectFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Projects</option>
                {projectList.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>

              {/* Place Filter */}
              <select
                value={selectedPlaceFilter}
                onChange={(e) => setSelectedPlaceFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Places / Sites</option>
                {placeList.map(pl => (
                  <option key={pl} value={pl}>{pl}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="pending">Pending</option>
                <option value="review">Under Review</option>
              </select>
            </div>
          </div>

          {/* Logs List Cards */}
          {filteredLogs.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center border border-gray-200 dark:border-gray-800 shadow-md space-y-3">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">No Day Work Logs Found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                No logs match your search and filter criteria. You can create a new work entry to begin tracking.
              </p>
              <button
                onClick={() => {
                  resetForm();
                  setActiveSubTab('new-entry');
                }}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Create New Day Work Entry</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log) => {
                const isExpanded = expandedLogId === log.id;
                return (
                  <div
                    key={log.id}
                    className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all overflow-hidden"
                  >
                    {/* Main Row */}
                    <div className="p-5 sm:p-6 space-y-4">
                      {/* Top Bar of Card */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center space-x-2.5">
                          {/* Project Tag */}
                          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold">
                            <Building2 className="w-3.5 h-3.5" />
                            <span>{log.projectName}</span>
                          </span>

                          {/* Place Tag */}
                          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{log.place}</span>
                          </span>

                          {/* Priority Tag */}
                          {log.priority && (
                            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                              log.priority === 'urgent' ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' :
                              log.priority === 'high' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                              'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}>
                              {log.priority}
                            </span>
                          )}
                        </div>

                        {/* Date & Action Controls */}
                        <div className="flex items-center space-x-2 text-xs">
                          <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 font-medium mr-2">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{log.date}</span>
                          </div>

                          <button
                            onClick={() => handleEditLog(log)}
                            className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-emerald-600 transition-colors cursor-pointer"
                            title="Edit Work Log"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteLog(log.id)}
                            className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete Log"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                            className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1 cursor-pointer"
                          >
                            <span>{isExpanded ? 'Less' : 'Details'}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Work Name / Task Title */}
                      <div>
                        <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-gray-100">
                          {log.workName}
                        </h3>
                        {log.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {log.description}
                          </p>
                        )}
                      </div>

                      {/* Key Meta Badges */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                        {/* Time & Duration */}
                        <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                            Time & Duration
                          </span>
                          <span className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center space-x-1 mt-0.5">
                            <Clock className="w-3 h-3 text-blue-500" />
                            <span>{log.startTime || '08:00 AM'} - {log.endTime || '04:30 PM'} ({log.durationHours}h)</span>
                          </span>
                        </div>

                        {/* Check-in / Check-out */}
                        <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                            Check In / Out
                          </span>
                          <span className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center space-x-1 mt-0.5">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            <span>In: {log.checkInTime || '07:50 AM'} | Out: {log.checkOutTime || '04:45 PM'}</span>
                          </span>
                        </div>

                        {/* Materials Option Count */}
                        <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                            Materials Option
                          </span>
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1 mt-0.5">
                            <Package className="w-3 h-3" />
                            <span>{log.materials ? log.materials.length : 0} items listed</span>
                          </span>
                        </div>

                        {/* Neighbors / Collaborators */}
                        <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                            Neighbors & Laborers
                          </span>
                          <span className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center space-x-1 mt-0.5">
                            <Users className="w-3 h-3" />
                            <span>{log.neighbors ? log.neighbors.length : 0} members attached</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* EXPANDABLE SECTION: Deep Details, Materials Option & Neighbors */}
                    {isExpanded && (
                      <div className="p-5 sm:p-6 bg-gray-50/90 dark:bg-gray-850 border-t border-gray-200 dark:border-gray-800 space-y-6">
                        
                        {/* Rating & Weather / Field Notes */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 space-y-1.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block">
                              Execution Quality & Rating
                            </span>
                            <div className="flex items-center space-x-1">
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <Star
                                  key={idx}
                                  className={`w-5 h-5 ${
                                    idx < (log.rating || 5)
                                      ? 'text-amber-400 fill-amber-400'
                                      : 'text-gray-300 dark:text-gray-700'
                                  }`}
                                />
                              ))}
                              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-2">
                                {log.rating || 5} / 5 Stars
                              </span>
                            </div>
                          </div>

                          <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 space-y-1.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block">
                              Environment / Site Notes
                            </span>
                            <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                              {log.weatherOrNotes || 'Site conditions optimal. All safety guidelines adhered to.'}
                            </p>
                          </div>
                        </div>

                        {/* Materials Option Section */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                              <Package className="w-4 h-4 text-amber-500" />
                              <span>Materials Option & Ledger ({log.materials?.length || 0})</span>
                            </h4>
                          </div>

                          {log.materials && log.materials.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {log.materials.map((mat) => (
                                <div
                                  key={mat.id}
                                  className="p-3.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 space-y-1 shadow-xs"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-extrabold text-gray-900 dark:text-gray-100">
                                      {mat.name}
                                    </span>
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 uppercase">
                                      {mat.status || 'used'}
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center justify-between">
                                    <span>Quantity: <strong className="text-gray-900 dark:text-gray-200">{mat.quantity} {mat.unit}</strong></span>
                                    {mat.estimatedCost && (
                                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{mat.estimatedCost}</span>
                                    )}
                                  </div>
                                  {mat.notes && (
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 italic">
                                      {mat.notes}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400 italic">No specific materials registered for this work entry.</p>
                          )}
                        </div>

                        {/* Neighbors / Collaborators Section */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                            <Users className="w-4 h-4 text-purple-500" />
                            <span>Neighbors, Laborers & Team Members ({log.neighbors?.length || 0})</span>
                          </h4>

                          {log.neighbors && log.neighbors.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {log.neighbors.map((neigh) => (
                                <div
                                  key={neigh.id}
                                  className="p-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center space-x-3 shadow-xs"
                                >
                                  <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-extrabold text-xs">
                                    {neigh.name.slice(0, 2).toUpperCase()}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">
                                      {neigh.name}
                                    </div>
                                    <div className="text-[11px] text-purple-600 dark:text-purple-400 truncate">
                                      {neigh.role || 'Collaborator'}
                                    </div>
                                    {neigh.phone && (
                                      <div className="text-[10px] text-gray-400 flex items-center space-x-1">
                                        <Phone className="w-2.5 h-2.5" />
                                        <span>{neigh.phone}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400 italic">No neighbor contacts attached.</p>
                          )}
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. SUBTAB CONTENT 2: Log New Day Work Form */}
      {activeSubTab === 'new-entry' && (
        <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-gray-100">
                {editingLogId ? 'Edit Day Work Entry' : 'Log New Day Work & Project Task'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Fill in project details, site place, timing, materials used, and neighbor/collaborator contacts
              </p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setActiveSubTab('logs');
              }}
              className="text-xs font-bold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmitWorkLog} className="space-y-6">
            
            {/* 1. Basic Work & Project Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Work / Task Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electrical Conduit Wiring & Panel Setup"
                  value={workName}
                  onChange={(e) => setWorkName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5 flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Project Name *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Skyline Heights Tower B"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* 2. Place & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Place / Site Location *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector 9 North Site, Level 3 / Workshop B"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Date *</span>
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* 3. Time, Duration, Check-in & Check-out */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>Date & Time Logging Details</span>
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Start Time
                  </label>
                  <input
                    type="text"
                    placeholder="08:00 AM"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    End Time
                  </label>
                  <input
                    type="text"
                    placeholder="04:30 PM"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Duration (Hours)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="8.0"
                    value={durationHours}
                    onChange={(e) => setDurationHours(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Check-In Time
                  </label>
                  <input
                    type="text"
                    placeholder="07:50 AM"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Check-Out Time
                  </label>
                  <input
                    type="text"
                    placeholder="04:45 PM"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* 4. MATERIALS OPTION (Add items dynamically) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center space-x-1.5">
                  <Package className="w-4 h-4 text-amber-600" />
                  <span>Materials Option & Supplies</span>
                </span>
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                  {materials.length} Items Attached
                </span>
              </div>

              {/* Current Materials List */}
              {materials.length > 0 && (
                <div className="space-y-2">
                  {materials.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-amber-200/80 dark:border-amber-900/80 text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-gray-900 dark:text-gray-100">{m.name}</span>
                        <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold">
                          {m.quantity} {m.unit}
                        </span>
                        {m.estimatedCost && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{m.estimatedCost}</span>
                        )}
                        <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">[{m.status}]</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMaterial(m.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Material Row */}
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 pt-2 border-t border-amber-200/60 dark:border-amber-900/40">
                <input
                  type="text"
                  placeholder="Material Name (e.g. Copper Wire)"
                  value={newMatName}
                  onChange={(e) => setNewMatName(e.target.value)}
                  className="sm:col-span-2 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
                />
                <input
                  type="text"
                  placeholder="Qty (e.g. 50)"
                  value={newMatQty}
                  onChange={(e) => setNewMatQty(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
                />
                <input
                  type="text"
                  placeholder="Unit (meters/kg/pcs)"
                  value={newMatUnit}
                  onChange={(e) => setNewMatUnit(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
                />
                <input
                  type="text"
                  placeholder="Cost ($)"
                  value={newMatCost}
                  onChange={(e) => setNewMatCost(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddMaterial}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Material</span>
                </button>
              </div>
            </div>

            {/* 5. NEIGHBORS & COLLABORATORS OPTION */}
            <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 flex items-center space-x-1.5">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>Neighbors, Laborers & Collaborators Option</span>
                </span>
                <span className="text-[11px] font-bold text-purple-700 dark:text-purple-400">
                  {neighbors.length} Members Attached
                </span>
              </div>

              {/* Current Neighbors List */}
              {neighbors.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {neighbors.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-purple-200/80 dark:border-purple-900/80 text-xs"
                    >
                      <div>
                        <span className="font-bold text-gray-900 dark:text-gray-100">{n.name}</span>
                        <span className="text-gray-500 dark:text-gray-400 text-[11px] block">{n.role}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveNeighbor(n.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Neighbor Row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 border-t border-purple-200/60 dark:border-purple-900/40">
                <input
                  type="text"
                  placeholder="Neighbor / Worker Name"
                  value={newNeighborName}
                  onChange={(e) => setNewNeighborName(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
                />
                <input
                  type="text"
                  placeholder="Role (e.g. Lead Electrician / Site Neighbor)"
                  value={newNeighborRole}
                  onChange={(e) => setNewNeighborRole(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
                />
                <input
                  type="text"
                  placeholder="Phone / Radio Contact"
                  value={newNeighborPhone}
                  onChange={(e) => setNewNeighborPhone(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddNeighbor}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Member</span>
                </button>
              </div>
            </div>

            {/* 6. Work Description & Execution Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Work Summary & Daily Execution Notes
              </label>
              <textarea
                rows={3}
                placeholder="Detail what was accomplished, challenges solved, milestone progress..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* 7. Status, Priority & Rating */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Execution Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-800 dark:text-gray-200"
                >
                  <option value="completed">Completed ✓</option>
                  <option value="in-progress">In Progress ⏳</option>
                  <option value="pending">Pending 📋</option>
                  <option value="review">Under Review 🔍</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-800 dark:text-gray-200"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent ⚡</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Rating (1 - 5 Stars)
                </label>
                <div className="flex items-center space-x-2 pt-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className="cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          num <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                    {rating} / 5
                  </span>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {formSavedSuccess ? '✓ Day work log saved successfully!' : ''}
              </span>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setActiveSubTab('logs');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all cursor-pointer hover:scale-105"
                >
                  {editingLogId ? 'Update Day Work Entry' : 'Save Day Work Entry'}
                </button>
              </div>
            </div>

          </form>
        </div>
      )}

      {/* 6. SUBTAB CONTENT 3: Projects Overview */}
      {activeSubTab === 'projects' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectList.map((proj) => {
              const projectLogs = dayWorkLogs.filter(l => l.projectName === proj);
              const projHours = projectLogs.reduce((acc, c) => acc + (c.durationHours || 0), 0);
              const projMaterials = projectLogs.reduce((acc, c) => acc + (c.materials?.length || 0), 0);
              const projCollaborators = Array.from(new Set(projectLogs.flatMap(l => (l.neighbors || []).map(n => n.name))));

              return (
                <div
                  key={proj}
                  className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800 shadow-md space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {projectLogs.length} Logs
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{proj}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Places: {Array.from(new Set(projectLogs.map(l => l.place))).join(', ')}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Total Hours</span>
                      <span className="font-extrabold text-gray-800 dark:text-gray-200">{projHours.toFixed(1)} hrs</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Materials Used</span>
                      <span className="font-extrabold text-amber-600 dark:text-amber-400">{projMaterials} items</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Active Neighbors & Team ({projCollaborators.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {projCollaborators.slice(0, 4).map((c, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. SUBTAB CONTENT 4: Materials Ledger */}
      {activeSubTab === 'materials' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
              <Package className="w-5 h-5 text-amber-500" />
              <span>Comprehensive Materials & Supplies Ledger</span>
            </h3>
            <span className="text-xs font-bold text-gray-500">
              Aggregated across all projects
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-400 uppercase font-bold text-[10px]">
                  <th className="pb-2">Material Name</th>
                  <th className="pb-2">Quantity & Unit</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Estimated Cost</th>
                  <th className="pb-2">Project</th>
                  <th className="pb-2">Place / Site</th>
                  <th className="pb-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {dayWorkLogs.flatMap(log => 
                  (log.materials || []).map(mat => (
                    <tr key={`${log.id}-${mat.id}`} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 font-bold text-gray-900 dark:text-gray-100">{mat.name}</td>
                      <td className="py-3 font-semibold text-gray-700 dark:text-gray-300">{mat.quantity} {mat.unit}</td>
                      <td className="py-3">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 uppercase">
                          {mat.status || 'used'}
                        </span>
                      </td>
                      <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">{mat.estimatedCost || '—'}</td>
                      <td className="py-3 text-blue-600 dark:text-blue-400 font-medium">{log.projectName}</td>
                      <td className="py-3 text-gray-500">{log.place}</td>
                      <td className="py-3 text-gray-400">{log.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. SUBTAB CONTENT 5: Neighbors Directory */}
      {activeSubTab === 'neighbors' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-500" />
              <span>Neighbors, Laborers & Collaborators Directory</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from(new Set(dayWorkLogs.flatMap(l => (l.neighbors || []).map(n => JSON.stringify(n))))).map((str: string, idx) => {
              const neigh: DayWorkCollaborator = JSON.parse(str);
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 flex items-center space-x-3.5 shadow-xs"
                >
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-extrabold text-sm ring-2 ring-purple-500/20">
                    {neigh.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                      {neigh.name}
                    </h4>
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold truncate">
                      {neigh.role || 'Site Neighbor / Worker'}
                    </p>
                    {neigh.phone && (
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center space-x-1 mt-0.5">
                        <Phone className="w-3 h-3 text-emerald-500" />
                        <span>{neigh.phone}</span>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
