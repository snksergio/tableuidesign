
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  Filter as FilterIcon, 
  Settings, 
  MoreVertical, 
  X,
  XCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit2,
  Plus,
  Rows,
  AlignJustify,
  AlignCenter,
  Calendar,
  Check,
  Download,
  ArrowUp,
  ArrowDown,
  EyeOff,
  Pin,
  Moon,
  Sun,
  Eye,
  Copy,
  Archive,
  UserPlus
} from 'lucide-react';
import { MOCK_DATA, INITIAL_COLUMNS } from './constants';
import { User, Column, Density, UserStatus } from './types';

const App: React.FC = () => {
  // Mode State
  const [darkMode, setDarkMode] = useState(false);

  // State
  const [data] = useState<User[]>(MOCK_DATA);
  const [columns, setColumns] = useState<Column[]>(INITIAL_COLUMNS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [density, setDensity] = useState<Density>('standard');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField] = useState<keyof User>('firstName');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [scrolled, setScrolled] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isDensityDropdownOpen, setIsDensityDropdownOpen] = useState(false);
  const [goToPage, setGoToPage] = useState('');

  // Hover states for resize handles
  const [hoveredResizeColumnKey, setHoveredResizeColumnKey] = useState<string | null>(null);

  // Popover States
  const [isStatusPopoverOpen, setIsStatusPopoverOpen] = useState(false);
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['Active', 'Warning']);
  const [activeColumnMenu, setActiveColumnMenu] = useState<string | null>(null);
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);
  
  const densityDropdownRef = useRef<HTMLDivElement>(null);
  const statusPopoverRef = useRef<HTMLDivElement>(null);
  const datePopoverRef = useRef<HTMLDivElement>(null);
  const columnMenuRef = useRef<HTMLDivElement>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (densityDropdownRef.current && !densityDropdownRef.current.contains(event.target as Node)) {
        setIsDensityDropdownOpen(false);
      }
      if (statusPopoverRef.current && !statusPopoverRef.current.contains(event.target as Node)) {
        setIsStatusPopoverOpen(false);
      }
      if (datePopoverRef.current && !datePopoverRef.current.contains(event.target as Node)) {
        setIsDatePopoverOpen(false);
      }
      if (columnMenuRef.current && !columnMenuRef.current.contains(event.target as Node)) {
        setActiveColumnMenu(null);
      }
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setActiveActionMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Computed Logic
  const filteredData = useMemo(() => {
    let result = [...data];
    if (searchQuery) {
      result = result.filter(item => 
        String(item[searchField]).toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedStatuses.length > 0) {
      result = result.filter(item => selectedStatuses.includes(item.status));
    }
    return result;
  }, [data, searchQuery, searchField, selectedStatuses]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(paginatedData.map(d => d.id));
    else setSelectedIds([]);
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleGoToPage = () => {
    const p = parseInt(goToPage);
    if (!isNaN(p) && p > 0 && p <= totalPages) {
      setPage(p);
      setGoToPage('');
    }
  };

  const toggleStatusSelection = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const getDensityClass = () => {
    switch (density) {
      case 'compact': return 'py-1.5 text-xs'; 
      case 'relaxed': return 'py-5 text-sm';   
      default: return 'py-3.5 text-sm';       
    }
  };

  const getDensityLabel = (d: Density) => {
    switch (d) {
      case 'compact': return 'Compact';
      case 'relaxed': return 'Comfortable';
      default: return 'Standard';
    }
  };

  // Render cell helper (Moved inside to access state)
  const renderCell = (col: Column, row: User, density: Density) => {
    const value = row[col.key as keyof User];
    const isCompact = density === 'compact';

    switch (col.key) {
      case 'firstName':
        return (
          <div className="flex items-center gap-3 whitespace-nowrap">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${row.id}`} 
              className={`${isCompact ? 'w-7 h-7' : 'w-9 h-9'} rounded-full border border-[#EAECF0] dark:border-gray-700 bg-[#F9FAFB] dark:bg-gray-800 transition-all`}
              alt="User"
            />
            <div className="flex flex-col">
              <span className={`font-semibold text-[#101828] dark:text-gray-100 leading-tight ${isCompact ? 'text-xs' : 'text-sm'}`}>{row.firstName} {row.lastName}</span>
              <span className={`${isCompact ? 'text-[10px]' : 'text-xs'} text-[#667085] dark:text-gray-500 leading-normal`}>{row.email}</span>
            </div>
          </div>
        );
      case 'status':
        const statusStyles: any = {
          Active: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50 dot-[#00A859]',
          Warning: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-emerald-800/50 dot-amber-500',
          Danger: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50 dot-rose-500',
          Inactive: 'bg-gray-50 text-gray-700 border-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dot-gray-500',
        };
        const style = statusStyles[value as string] || statusStyles.Inactive;
        const dotColorClass = style.split(' dot-')[1] || 'bg-[#00A859]';
        const isCustomHex = dotColorClass.startsWith('[#');
        
        return (
          <div className={`inline-flex items-center gap-1.5 whitespace-nowrap ${isCompact ? 'px-1.5 py-0' : 'px-2 py-0.5'} rounded-full font-semibold border ${style.split(' dot-')[0]} ${isCompact ? 'text-[10px]' : 'text-xs'}`}>
            <div 
              className={`w-1.5 h-1.5 rounded-full ${!isCustomHex ? dotColorClass : ''}`}
              style={isCustomHex ? { backgroundColor: dotColorClass.slice(1, -1) } : undefined}
            />
            {value as string === 'Warning' ? 'Vacation' : value as string}
          </div>
        );
      case 'role':
        return (
          <div className={`bg-[#F9FAFB] dark:bg-gray-800 border border-[#EAECF0] dark:border-gray-700 ${isCompact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'} rounded-lg font-medium text-[#344054] dark:text-gray-300 inline-block shadow-sm whitespace-nowrap`}>
            {value as string}
          </div>
        );
      case 'salary':
      case 'projectBudget':
        return <span className={`font-semibold text-[#101828] dark:text-gray-100 whitespace-nowrap ${isCompact ? 'text-xs' : 'text-sm'}`}>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value as number)}</span>;
      case 'actions':
        return (
          <div className="flex items-center justify-end gap-1 whitespace-nowrap">
            <button className={`${isCompact ? 'p-1' : 'p-2'} hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-[#667085] dark:text-gray-500 hover:text-[#101828] dark:hover:text-white transition-all group relative`}>
              <Edit2 size={isCompact ? 14 : 16} />
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 dark:bg-gray-700 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl">Edit</span>
            </button>
            <button className={`${isCompact ? 'p-1' : 'p-2'} hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-[#667085] dark:text-gray-500 hover:text-[#101828] dark:hover:text-white transition-all group relative`}>
              <Trash2 size={isCompact ? 14 : 16} />
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 dark:bg-gray-700 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl">Delete</span>
            </button>
            <div className="relative" ref={activeActionMenuId === row.id ? actionMenuRef : null}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveActionMenuId(activeActionMenuId === row.id ? null : row.id);
                }}
                className={`
                  ${isCompact ? 'p-1' : 'p-2'} hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-[#667085] dark:text-gray-500 transition-all
                  ${activeActionMenuId === row.id ? 'bg-gray-100 dark:bg-gray-800' : ''}
                `}
              >
                <MoreVertical size={isCompact ? 14 : 16} />
              </button>

              {/* Action Options Popover */}
              {activeActionMenuId === row.id && (
                <div className="absolute top-full right-0 mt-2 w-[220px] bg-white dark:bg-gray-800 border border-[#EAECF0] dark:border-gray-700 rounded-xl shadow-2xl z-[120] p-1 flex flex-col animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                  <button className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-[#344054] dark:text-gray-300 transition-all group/item">
                    <Eye size={16} className="text-[#667085] dark:text-gray-500 group-hover/item:text-[#101828] dark:group-hover/item:text-white" />
                    View details
                  </button>
                  <button className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-[#344054] dark:text-gray-300 transition-all group/item">
                    <Copy size={16} className="text-[#667085] dark:text-gray-500 group-hover/item:text-[#101828] dark:group-hover/item:text-white" />
                    Duplicate
                  </button>
                  <div className="h-[1px] bg-[#F2F4F7] dark:bg-gray-700 my-1 mx-1" />
                  <button className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-[#344054] dark:text-gray-300 transition-all group/item">
                    <UserPlus size={16} className="text-[#667085] dark:text-gray-500 group-hover/item:text-[#101828] dark:group-hover/item:text-white" />
                    Assign project
                  </button>
                  <div className="h-[1px] bg-[#F2F4F7] dark:bg-gray-700 my-1 mx-1" />
                  <button className="flex items-center gap-3 px-3 py-2.5 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg text-sm font-medium text-[#344054] dark:text-gray-300 transition-all group/item">
                    <Archive size={16} className="text-[#667085] dark:text-gray-500 group-hover/item:text-rose-600 dark:group-hover/item:text-rose-400" />
                    Archive user
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      case 'email':
        return <span className={`font-medium text-[#475467] dark:text-gray-400 whitespace-nowrap ${isCompact ? 'text-xs' : 'text-sm'}`}>{value as string}</span>;
      case 'joinedDate':
        return (
          <div className={`flex items-center gap-2 text-[#475467] dark:text-gray-400 whitespace-nowrap ${isCompact ? 'text-xs' : 'text-sm'}`}>
            <Calendar size={isCompact ? 12 : 14} className="text-[#98A2B3] dark:text-gray-500" />
            {value as string}
          </div>
        );
      default:
        return <span className={`text-[#475467] dark:text-gray-400 whitespace-nowrap ${isCompact ? 'text-xs' : 'text-sm'}`}>{String(value)}</span>;
    }
  };

  const staticFilters = [
    { label: 'Role', selected: [] },
    { label: 'City', selected: ['São Paulo'] },
    { label: 'Department', selected: ['Eng', 'Prod', 'Sales', 'HR'] }
  ];

  const headerBtnClass = "inline-flex items-center justify-center gap-2 px-4 h-9 border border-[#EAECF0] dark:border-gray-800 rounded-lg bg-white dark:bg-gray-800 text-sm font-semibold text-[#344054] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm outline-none whitespace-nowrap shrink-0 [&_svg]:shrink-0 [&_svg]:size-4 leading-none";

  const renderStatusTag = (status: string) => {
    const statusStyles: any = {
      Active: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50 dot-[#00A859]',
      Warning: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-emerald-800/50 dot-amber-500',
      Danger: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50 dot-rose-500',
      Inactive: 'bg-gray-50 text-gray-700 border-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dot-gray-500',
    };
    const style = statusStyles[status] || statusStyles.Inactive;
    const dotColorClass = style.split(' dot-')[1] || 'bg-[#00A859]';
    const isCustomHex = dotColorClass.startsWith('[#');
    const label = status === 'Warning' ? 'Vacation' : status;

    return (
      <div className={`inline-flex items-center gap-1.5 whitespace-nowrap px-2 py-0.5 rounded-full font-semibold border ${style.split(' dot-')[0]} text-[11px]`}>
        <div 
          className={`w-1 h-1 rounded-full ${!isCustomHex ? dotColorClass : ''}`}
          style={isCustomHex ? { backgroundColor: dotColorClass.slice(1, -1) } : undefined}
        />
        {label}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFCFD] dark:bg-[#0B0F19] p-[60px] flex flex-col gap-6 transition-colors duration-200">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-[#101828] dark:text-white">User management</h1>
            <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800/50">
              {data.length}
            </span>
          </div>
          <p className="text-sm text-[#475467] dark:text-gray-400">Manage your team members and their account permissions here.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center justify-center w-10 h-10 border border-[#EAECF0] dark:border-gray-800 rounded-lg bg-white dark:bg-gray-800 text-[#344054] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#00A859] hover:bg-[#008F4C] text-white rounded-lg text-sm font-semibold transition-all shadow-sm ring-offset-2 focus:ring-2 focus:ring-[#00A859] dark:ring-offset-gray-900">
            <Plus size={18} />
            Add User
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-[#EAECF0] dark:border-gray-800 shadow-sm flex flex-col overflow-hidden transition-colors duration-200">
        
        {/* Table Toolbar */}
        <div className="p-4 border-b border-[#EAECF0] dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-grow max-w-md">
            <div className="relative flex-grow group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085] dark:text-gray-500 transition-colors group-focus-within:text-[#00A859]" size={18} />
              <input 
                type="text" 
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 border border-[#D0D5DD] dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-4 focus:ring-[#00A859]/10 focus:border-[#00A859] outline-none transition-all placeholder-[#667085] dark:placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative" ref={densityDropdownRef}>
              <button 
                onClick={() => setIsDensityDropdownOpen(!isDensityDropdownOpen)}
                className={headerBtnClass}
              >
                <span>{getDensityLabel(density)}</span>
                <ChevronDown size={16} className="text-[#98A2B3] dark:text-gray-500" />
              </button>
              
              {isDensityDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-[#EAECF0] dark:border-gray-700 rounded-lg shadow-xl z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                  {(['compact', 'standard', 'relaxed'] as Density[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setDensity(d);
                        setIsDensityDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#344054] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left font-medium"
                    >
                      <div className="w-4 h-4 flex items-center justify-center">
                        {density === d && <Check size={14} className="text-[#00A859]" />}
                      </div>
                      {getDensityLabel(d)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className={headerBtnClass}>
              <FilterIcon size={16} />
              <span className="hidden lg:inline">Filters</span>
            </button>

            <button onClick={() => setIsConfigOpen(true)} className={headerBtnClass}>
              <Settings size={16} />
              <span className="hidden lg:inline">Customize</span>
            </button>

            <div className="h-6 w-[1px] bg-[#EAECF0] dark:bg-gray-800 mx-0.5" />
            
            <button className={headerBtnClass}>
              <Download size={16} />
              <span className="inline">Export</span>
            </button>
          </div>
        </div>

        {/* Filters Area */}
        <div className="px-4 py-2.5 bg-[#FCFCFD] dark:bg-gray-900/50 border-b border-[#EAECF0] dark:border-gray-800 flex flex-wrap items-center gap-3">
          {staticFilters.map((filter, index) => {
            const hasSelection = filter.selected.length > 0;
            return (
              <div 
                key={index}
                className="group flex items-center h-[34px] border border-dashed border-[#D0D5DD] dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 px-2 gap-2 hover:border-[#00A859]/40 transition-all cursor-pointer shadow-sm"
              >
                {hasSelection && (
                  <XCircle size={14} className="text-[#98A2B3] dark:text-gray-500 group-hover:text-rose-500 transition-colors" />
                )}
                <span className="text-sm text-[#101828] dark:text-gray-200 font-medium whitespace-nowrap">{filter.label}</span>
                {hasSelection && (
                  <>
                    <div className="w-[1px] h-3.5 bg-[#EAECF0] dark:bg-gray-700 mx-1" />
                    <div className="flex items-center gap-1.5">
                      {filter.selected.length <= 2 ? (
                        filter.selected.map((val, idx) => (
                          <span key={idx} className="bg-[#F2F4F7] dark:bg-gray-700 text-[#344054] dark:text-gray-300 px-2 py-0.5 rounded-md text-[11px] font-bold whitespace-nowrap">
                            {val}
                          </span>
                        ))
                      ) : (
                        <span className="bg-[#F2F4F7] dark:bg-gray-700 text-[#344054] dark:text-gray-300 px-2 py-0.5 rounded-md text-[11px] font-bold whitespace-nowrap">
                          {filter.selected.length} selected
                        </span>
                      )}
                    </div>
                  </>
                )}
                {!hasSelection && (
                  <ChevronDown size={14} className="text-[#98A2B3] dark:text-gray-500 ml-1" />
                )}
              </div>
            );
          })}

          {/* Interactive Status Filter Chip */}
          <div className="relative" ref={statusPopoverRef}>
            <div 
              onClick={() => setIsStatusPopoverOpen(!isStatusPopoverOpen)}
              className={`group flex items-center h-[34px] border border-dashed rounded-xl bg-white dark:bg-gray-800 px-2 gap-2 transition-all cursor-pointer shadow-sm ${isStatusPopoverOpen ? 'border-[#00A859] ring-2 ring-[#00A859]/10' : 'border-[#D0D5DD] dark:border-gray-700 hover:border-[#00A859]/40'}`}
            >
              {selectedStatuses.length > 0 && (
                <XCircle 
                  size={14} 
                  className="text-[#98A2B3] dark:text-gray-500 hover:text-rose-500 transition-colors" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStatuses([]);
                  }}
                />
              )}
              <span className="text-sm text-[#101828] dark:text-gray-200 font-medium whitespace-nowrap">Status</span>
              {selectedStatuses.length > 0 && (
                <>
                  <div className="w-[1px] h-3.5 bg-[#EAECF0] dark:bg-gray-700 mx-1" />
                  <div className="flex items-center gap-1.5">
                    {selectedStatuses.length <= 2 ? (
                      selectedStatuses.map((val, idx) => (
                        <span key={idx} className="bg-[#F2F4F7] dark:bg-gray-700 text-[#344054] dark:text-gray-300 px-2 py-0.5 rounded-md text-[11px] font-bold shadow-xs whitespace-nowrap">
                          {val === 'Warning' ? 'Vacation' : val}
                        </span>
                      ))
                    ) : (
                      <span className="bg-[#F2F4F7] dark:bg-gray-700 text-[#344054] dark:text-gray-300 px-2 py-0.5 rounded-md text-[11px] font-bold shadow-xs whitespace-nowrap">
                        {selectedStatuses.length} selected
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Status Filter Popover */}
            {isStatusPopoverOpen && (
              <div className="absolute top-full left-0 mt-2 w-[220px] bg-white dark:bg-gray-800 border border-[#EAECF0] dark:border-gray-700 rounded-xl shadow-xl z-[100] p-1 flex flex-col animate-in fade-in zoom-in-95 duration-100 origin-top-left">
                {(['Active', 'Warning', 'Danger', 'Inactive'] as string[]).map((status) => {
                  const isChecked = selectedStatuses.includes(status);
                  return (
                    <div 
                      key={status} 
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors"
                      onClick={() => toggleStatusSelection(status)}
                    >
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={() => {}} 
                        className="pointer-events-none"
                      />
                      <div className="flex items-center gap-2">
                        {renderStatusTag(status)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Date Filter Chip */}
          <div className="relative" ref={datePopoverRef}>
            <div 
              onClick={() => setIsDatePopoverOpen(!isDatePopoverOpen)}
              className={`group flex items-center h-[34px] border border-dashed rounded-xl bg-white dark:bg-gray-800 px-2 gap-2 transition-all cursor-pointer shadow-sm ${isDatePopoverOpen ? 'border-[#00A859] ring-2 ring-[#00A859]/10' : 'border-[#D0D5DD] dark:border-gray-700 hover:border-[#00A859]/40'}`}
            >
              <span className="text-sm text-[#101828] dark:text-gray-200 font-medium whitespace-nowrap">Date</span>
              <ChevronDown size={14} className={`text-[#98A2B3] dark:text-gray-500 ml-1 transition-transform duration-200 ${isDatePopoverOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Date Range Popover UI */}
            {isDatePopoverOpen && (
              <div className="absolute top-full left-0 mt-2 w-[720px] bg-white dark:bg-gray-800 border border-[#EAECF0] dark:border-gray-700 rounded-2xl shadow-2xl z-[110] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 origin-top-left">
                <div className="flex h-[360px]">
                  <div className="w-[200px] border-r border-[#F2F4F7] dark:border-gray-700 p-3 flex flex-col gap-1 overflow-y-auto">
                    {["Select past 7 days", "Previous 30 days", "Previous 6 months", "Previous year"].map((preset) => (
                      <button key={preset} className="text-left px-3 py-2 text-sm font-medium text-[#344054] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">{preset}</button>
                    ))}
                  </div>
                  <div className="flex-1 flex gap-8 p-6 bg-white dark:bg-gray-900">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <ChevronLeft size={16} className="text-[#667085] dark:text-gray-500 cursor-pointer hover:text-[#101828] dark:hover:text-white" />
                        <h4 className="text-sm font-bold text-[#101828] dark:text-gray-200">January 2023</h4>
                        <div className="w-4" />
                      </div>
                      <div className="grid grid-cols-7 gap-y-1 text-center">
                        {["M", "T", "W", "T", "F", "S", "S"].map(d => <span key={d} className="text-[11px] font-medium text-[#98A2B3] dark:text-gray-500 mb-2">{d}</span>)}
                        {Array.from({ length: 31 }).map((_, i) => {
                          const day = i + 1;
                          const isSelected = day === 25;
                          const isRange = day > 25 && day <= 30;
                          return (
                            <div key={i} className={`h-8 w-8 flex items-center justify-center text-xs font-semibold rounded-lg cursor-pointer transition-all ${isSelected ? 'bg-[#00A859] text-white shadow-sm' : ''} ${isRange ? 'bg-[#F6FEF9] dark:bg-emerald-900/20 text-[#00A859]' : 'text-[#344054] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>{day}</div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-4" />
                        <h4 className="text-sm font-bold text-[#101828] dark:text-gray-200">February 2023</h4>
                        <ChevronRight size={16} className="text-[#667085] dark:text-gray-500 cursor-pointer hover:text-[#101828] dark:hover:text-white" />
                      </div>
                      <div className="grid grid-cols-7 gap-y-1 text-center">
                        {["M", "T", "W", "T", "F", "S", "S"].map(d => <span key={d} className="text-[11px] font-medium text-[#98A2B3] dark:text-gray-500 mb-2">{d}</span>)}
                        {Array.from({ length: 28 }).map((_, i) => {
                          const day = i + 1;
                          const isSelected = day === 11;
                          const isRange = day < 11;
                          return (
                            <div key={i} className={`h-8 w-8 flex items-center justify-center text-xs font-semibold rounded-lg cursor-pointer transition-all ${isSelected ? 'bg-[#00A859] text-white shadow-sm' : ''} ${isRange ? 'bg-[#F6FEF9] dark:bg-emerald-900/20 text-[#00A859]' : 'text-[#344054] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>{day}</div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-[#F2F4F7] dark:border-gray-700 p-4 flex justify-end gap-3 bg-white dark:bg-gray-800">
                  <button onClick={() => setIsDatePopoverOpen(false)} className="px-4 py-2 border border-[#D0D5DD] dark:border-gray-700 rounded-lg text-sm font-bold text-[#344054] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm">Cancel</button>
                  <button onClick={() => setIsDatePopoverOpen(false)} className="px-4 py-2 bg-[#00A859] text-white rounded-lg text-sm font-bold hover:bg-[#008F4C] transition-all shadow-sm">Apply dates</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table Wrapper */}
        <div 
          className="relative overflow-x-auto overflow-y-hidden custom-scrollbar transition-colors duration-200"
          onScroll={(e) => setScrolled(e.currentTarget.scrollLeft > 0)}
        >
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#F9FAFB] dark:bg-gray-800/50">
                <th className="sticky left-0 z-30 bg-[#F9FAFB] dark:bg-gray-800 border-b border-[#EAECF0] dark:border-gray-700 p-4 w-12 text-left transition-colors duration-200">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                  />
                  {/* Divider Handle for Checkbox Column */}
                  <div 
                    className="absolute right-[-4px] top-0 h-full w-2 cursor-col-resize z-40 group/resizer"
                    onMouseEnter={() => setHoveredResizeColumnKey('checkbox-col')}
                    onMouseLeave={() => setHoveredResizeColumnKey(null)}
                  >
                    <div className={`
                      absolute right-[4px] top-1/2 -translate-y-1/2 w-[1.5px] transition-all duration-150
                      ${hoveredResizeColumnKey === 'checkbox-col' ? 'h-full bg-[#00A859]' : 'h-[30%] bg-[#EAECF0] dark:bg-gray-700'}
                    `} />
                  </div>
                </th>
                {columns.filter(c => c.visible).map((col, colIdx) => {
                  const isLastCol = colIdx === columns.filter(c => c.visible).length - 1;
                  return (
                    <th 
                      key={col.key}
                      className={`
                        px-4 py-3 border-b border-[#EAECF0] dark:border-gray-700 text-left select-none group relative transition-colors duration-200
                        ${col.sticky === 'left' ? 'sticky left-12 z-20 bg-[#F9FAFB] dark:bg-gray-800' : ''}
                        ${col.sticky === 'right' ? 'sticky right-0 z-20 bg-[#F9FAFB] dark:bg-gray-800' : ''}
                        ${col.sticky === 'left' && scrolled ? 'after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#EAECF0] dark:after:bg-gray-700 after:shadow-[1px_0_0_rgba(0,0,0,0.05)]' : ''}
                      `}
                      style={{ 
                        width: col.width || 'auto',
                        minWidth: col.width || 'auto'
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-1 text-xs font-medium text-[#667085] dark:text-gray-400 whitespace-nowrap cursor-pointer hover:text-[#101828] dark:hover:text-white transition-colors">
                          <span>{col.label}</span>
                          <ArrowDown size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        
                        <div className="relative" ref={activeColumnMenu === col.key ? columnMenuRef : null}>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveColumnMenu(activeColumnMenu === col.key ? null : col.key);
                            }}
                            className={`
                              p-1 hover:bg-[#F2F4F7] dark:hover:bg-gray-700 rounded-md text-[#667085] dark:text-gray-500 transition-all
                              ${activeColumnMenu === col.key ? 'opacity-100 bg-[#F2F4F7] dark:bg-gray-700' : 'opacity-0 group-hover:opacity-100'}
                            `}
                          >
                            <MoreVertical size={14} />
                          </button>

                          {/* Column Options Popover */}
                          {activeColumnMenu === col.key && (
                            <div className="absolute top-full right-0 mt-2 w-[220px] bg-white dark:bg-gray-800 border border-[#EAECF0] dark:border-gray-700 rounded-xl shadow-2xl z-[120] p-1 flex flex-col animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                              <button className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#F6FEF9] dark:hover:bg-emerald-900/20 hover:text-[#00A859] dark:hover:text-emerald-400 rounded-lg text-sm font-medium text-[#344054] dark:text-gray-300 transition-all group/item">
                                <ArrowUp size={16} className="text-[#667085] dark:text-gray-500 group-hover/item:text-[#00A859] dark:group-hover/item:text-emerald-400" />
                                Sort ascending
                              </button>
                              <button className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#F6FEF9] dark:hover:bg-emerald-900/20 hover:text-[#00A859] dark:hover:text-emerald-400 rounded-lg text-sm font-medium text-[#344054] dark:text-gray-300 transition-all group/item">
                                <ArrowDown size={16} className="text-[#667085] dark:text-gray-500 group-hover/item:text-[#00A859] dark:group-hover/item:text-emerald-400" />
                                Sort descending
                              </button>
                              <div className="h-[1px] bg-[#F2F4F7] dark:bg-gray-700 my-1 mx-1" />
                              <button className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-[#344054] dark:text-gray-300 transition-all group/item">
                                <EyeOff size={16} className="text-[#667085] dark:text-gray-500 group-hover/item:text-[#101828] dark:group-hover/item:text-white" />
                                Hide column
                              </button>
                              <div className="h-[1px] bg-[#F2F4F7] dark:bg-gray-700 my-1 mx-1" />
                              <button className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-[#344054] dark:text-gray-300 transition-all group/item">
                                <Pin size={16} className="text-[#667085] dark:text-gray-500 rotate-45 group-hover/item:text-[#101828] dark:group-hover/item:text-white" />
                                Pin to left
                              </button>
                              <button className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-[#344054] dark:text-gray-300 transition-all group/item">
                                <Pin size={16} className="text-[#667085] dark:text-gray-500 -rotate-45 group-hover/item:text-[#101828] dark:group-hover/item:text-white" />
                                Pin to right
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Interactive Divider Handle */}
                      {!isLastCol && (
                        <div 
                          className="absolute right-[-4px] top-0 h-full w-2 cursor-col-resize z-40 group/resizer"
                          onMouseEnter={() => setHoveredResizeColumnKey(col.key)}
                          onMouseLeave={() => setHoveredResizeColumnKey(null)}
                        >
                          <div className={`
                            absolute right-[4px] top-1/2 -translate-y-1/2 w-[1.5px] transition-all duration-150
                            ${hoveredResizeColumnKey === col.key ? 'h-full bg-[#00A859]' : 'h-[30%] bg-[#EAECF0] dark:bg-gray-700'}
                          `} />
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-[#EAECF0] dark:divide-gray-800 transition-colors duration-200">
              {paginatedData.map((row) => {
                const isSelected = selectedIds.includes(row.id);
                const rowBgColorClass = isSelected ? 'bg-[#F6FEF9] dark:bg-emerald-900/10' : 'bg-white dark:bg-gray-900';
                const rowHoverClass = isSelected ? 'group-hover:bg-[#ECFDF3] dark:group-hover:bg-emerald-900/20' : 'group-hover:bg-[#F9FAFB] dark:group-hover:bg-gray-800/50';
                
                return (
                  <tr 
                    key={row.id} 
                    className={`group transition-all ${rowHoverClass} ${rowBgColorClass}`}
                  >
                    <td className={`sticky left-0 z-10 p-4 w-12 border-b border-[#EAECF0] dark:border-gray-700 transition-colors duration-200 text-center relative ${rowBgColorClass} ${rowHoverClass}`}>
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => handleSelectRow(row.id)}
                      />
                      {/* Column-wide divider line when checkbox resizer is hovered */}
                      {hoveredResizeColumnKey === 'checkbox-col' && (
                        <div className="absolute right-0 top-0 h-full w-[1.5px] bg-[#00A859]/60 z-20 pointer-events-none" />
                      )}
                    </td>
                    {columns.filter(c => c.visible).map((col, idx, arr) => {
                      const isMenuOpen = activeActionMenuId === row.id && col.key === 'actions';
                      const isLastCell = idx === arr.length - 1;
                      return (
                        <td 
                          key={`${row.id}-${col.key}`}
                          className={`
                            px-4 ${getDensityClass()} border-b border-[#EAECF0] dark:border-gray-700 transition-colors duration-200 relative
                            ${rowBgColorClass} ${rowHoverClass}
                            ${col.sticky === 'left' ? `sticky left-12 z-10` : ''}
                            ${col.sticky === 'right' ? `sticky right-0 ${isMenuOpen ? 'z-40' : 'z-10'}` : ''}
                            ${col.sticky === 'left' && scrolled ? 'after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-[#EAECF0] dark:after:bg-gray-700' : ''}
                          `}
                          style={{ 
                            width: col.width || 'auto',
                            minWidth: col.width || 'auto'
                          }}
                        >
                          {renderCell(col, row, density)}
                          
                          {/* Column-wide divider line when this column resizer is hovered */}
                          {hoveredResizeColumnKey === col.key && !isLastCell && (
                            <div className="absolute right-0 top-0 h-full w-[1.5px] bg-[#00A859]/60 z-20 pointer-events-none" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Refined Final Pagination Footer */}
        <div className="p-4 bg-white dark:bg-gray-900 border-t border-[#EAECF0] dark:border-gray-800 flex flex-col xl:flex-row items-center justify-between gap-6 transition-colors duration-200">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-[#98A2B3] dark:text-gray-500">
              <span className="whitespace-nowrap font-normal">Rows per page</span>
              <div className="relative group">
                <select 
                  className="appearance-none bg-white dark:bg-gray-800 border border-[#EAECF0] dark:border-gray-700 rounded-lg pl-3 pr-7 h-9 text-sm font-semibold text-[#344054] dark:text-gray-300 outline-none focus:ring-4 focus:ring-[#00A859]/10 focus:border-[#00A859] transition-all cursor-pointer shadow-sm min-w-[60px]"
                  value={rowsPerPage}
                  onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#98A2B3] dark:text-gray-500 pointer-events-none group-hover:text-[#475467] dark:group-hover:text-gray-300" />
              </div>
            </div>
            <div className="h-4 w-[1px] bg-[#EAECF0] dark:bg-gray-800 hidden sm:block" />
            <span className="text-sm text-[#98A2B3] dark:text-gray-500 whitespace-nowrap font-normal">
              Showing {Math.min((page - 1) * rowsPerPage + 1, filteredData.length)} to {Math.min(page * rowsPerPage, filteredData.length)} of {filteredData.length} members
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                className="flex items-center justify-center gap-2 px-4 h-9 border border-[#EAECF0] dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm font-semibold text-[#344054] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronLeft size={16} />
                <span>Prev</span>
              </button>
              
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, '...', totalPages].map((p, i) => (
                  <button 
                    key={i}
                    className={`min-w-[36px] h-9 px-2 rounded-lg text-sm font-semibold transition-all border ${
                      p === page 
                      ? 'bg-white dark:bg-gray-700 text-[#101828] dark:text-white border-[#D0D5DD] dark:border-gray-600 shadow-sm ring-1 ring-[#D0D5DD] dark:ring-gray-600' 
                      : 'bg-white dark:bg-gray-800 text-[#667085] dark:text-gray-500 border-[#EAECF0] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-[#101828] dark:hover:text-white'
                    } ${typeof p !== 'number' ? 'cursor-default pointer-events-none border-transparent bg-transparent' : ''}`}
                    onClick={() => typeof p === 'number' && setPage(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button 
                disabled={page === totalPages}
                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                className="flex items-center justify-center gap-2 px-4 h-9 border border-[#EAECF0] dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm font-semibold text-[#344054] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-[#344054] dark:text-gray-300">Go to page</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center h-9 bg-white dark:bg-gray-800 border border-[#EAECF0] dark:border-gray-700 rounded-lg px-2 shadow-sm focus-within:ring-4 focus-within:ring-[#00A859]/10 focus-within:border-[#00A859] transition-all">
                  <input 
                    type="text" 
                    className="w-[44px] bg-transparent text-sm font-semibold text-center text-[#101828] dark:text-white outline-none"
                    value={goToPage}
                    onChange={(e) => setGoToPage(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => e.key === 'Enter' && handleGoToPage()}
                  />
                </div>
                <button 
                  onClick={handleGoToPage}
                  className="flex items-center gap-2 px-4 h-9 border border-[#EAECF0] dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm font-bold text-[#344054] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm active:bg-gray-100"
                >
                  Go
                  <ChevronRight size={16} className="text-[#98A2B3] dark:text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[#101828] dark:bg-gray-800 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-8 border border-white/10 dark:border-gray-700 backdrop-blur-sm ring-1 ring-black/20 transition-colors duration-200">
            <div className="flex items-center gap-3 border-r border-white/10 dark:border-gray-700 pr-6">
              <span className="text-sm font-semibold whitespace-nowrap">
                {selectedIds.length} of {data.length} members selected
              </span>
            </div>
            <div className="flex items-center gap-6">
              <button className="text-sm font-semibold hover:text-[#00A859] transition-colors">Export</button>
              <button className="text-sm font-semibold hover:text-[#00A859] transition-colors">Bulk Edit</button>
              <button className="text-sm font-semibold text-rose-400 hover:text-rose-300 transition-colors">Remove</button>
            </div>
            <button 
              onClick={() => setSelectedIds([])}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors ml-2"
            >
              <X size={18} className="text-[#667085]" />
            </button>
          </div>
        </div>
      )}

      {/* Customize Columns Modal */}
      {isConfigOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setIsConfigOpen(false)} />
          <div className="relative bg-white dark:bg-gray-900 w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-[#EAECF0] dark:border-gray-800 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#101828] dark:text-white">Customize columns</h2>
              <button onClick={() => setIsConfigOpen(false)} className="text-[#667085] hover:text-[#101828] dark:hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {columns.map((col) => (
                <div key={col.key} className="flex items-center gap-3 p-1">
                  <input 
                    type="checkbox" 
                    checked={col.visible}
                    onChange={() => setColumns(prev => prev.map(c => c.key === col.key ? {...c, visible: !c.visible} : c))}
                  />
                  <span className="text-sm font-medium text-[#344054] dark:text-gray-300">{col.label}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setIsConfigOpen(false)}
              className="w-full mt-6 py-2.5 bg-[#00A859] text-white rounded-xl font-bold shadow-sm hover:bg-[#008F4C] transition-all"
            >
              Apply Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
