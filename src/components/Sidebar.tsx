import React from 'react';
import {
  LayoutDashboard,
  FileCode2,
  Smartphone,
  ListTree,
  PlayCircle,
  Eye,
  Layers,
  Flame,
  Activity,
  Bug,
  FileSpreadsheet,
  ShieldCheck
} from 'lucide-react';
import { ActiveTab, Device, ApkMetadata } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  defectCount: number;
  crashCount: number;
  uiIssueCount?: number;
  visualDiffCount?: number;
  devices?: Device[];
  currentApk?: ApkMetadata;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  defectCount,
  crashCount,
  uiIssueCount = 0,
  visualDiffCount = 0,
  devices = [],
  currentApk
}) => {
  const activeDevices = devices.filter(d => d.selectedForTest);
  const displayCount = activeDevices.length > 0 ? activeDevices.length : devices.length || 8;
  const activeBrands = Array.from(
    new Set(
      (activeDevices.length > 0 ? activeDevices : devices).map(d => d.manufacturer.split(' ')[0])
    )
  ).slice(0, 5);

  const navSections = [
    {
      group: 'Overview',
      items: [
        { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard, badge: null }
      ]
    },
    {
      group: 'Core Engines',
      items: [
        { id: 'apk_analyzer' as ActiveTab, label: 'APK Analyzer', icon: FileCode2, badge: currentApk?.isCustomUpload ? 'Custom' : null, badgeColor: 'bg-blue-500/20 text-blue-300' },
        { id: 'live_simulator' as ActiveTab, label: 'Live App Sandbox', icon: Smartphone, badge: 'Live UI', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
        { id: 'devices' as ActiveTab, label: 'Device Matrix', icon: Smartphone, badge: `${displayCount}`, badgeColor: 'bg-slate-800 text-slate-300' },
        { id: 'test_suites' as ActiveTab, label: 'Test Scenarios', icon: ListTree, badge: null },
        { id: 'execution' as ActiveTab, label: 'Test Execution', icon: PlayCircle, badge: null }
      ]
    },
    {
      group: 'Diagnostics',
      items: [
        {
          id: 'ui_validator' as ActiveTab,
          label: 'UI Hierarchy',
          icon: Eye,
          badge: uiIssueCount > 0 ? `${uiIssueCount} ${uiIssueCount === 1 ? 'Issue' : 'Issues'}` : 'Clean',
          badgeColor: uiIssueCount > 0 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300'
        },
        {
          id: 'visual_regression' as ActiveTab,
          label: 'Visual Diffs',
          icon: Layers,
          badge: visualDiffCount > 0 ? `${visualDiffCount} ${visualDiffCount === 1 ? 'Diff' : 'Diffs'}` : 'Aligned',
          badgeColor: visualDiffCount > 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300'
        },
        { id: 'crashes' as ActiveTab, label: 'Crash Detector', icon: Flame, badge: crashCount > 0 ? `${crashCount}` : null, badgeColor: 'bg-rose-500 text-white' },
        { id: 'performance' as ActiveTab, label: 'Performance', icon: Activity, iconColor: '', badge: null }
      ]
    },
    {
      group: 'Quality & Reports',
      items: [
        { id: 'defects' as ActiveTab, label: 'Defect Tracker', icon: Bug, badge: defectCount > 0 ? `${defectCount}` : null, badgeColor: 'bg-amber-500 text-white' },
        { id: 'reports' as ActiveTab, label: 'Audit Reports', icon: FileSpreadsheet, badge: 'PDF/XLS' }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#0F172A] text-slate-300 flex flex-col border-r border-slate-800 shrink-0 h-screen select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
            <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
          </div>
          <div>
            <h1 className="text-white font-bold text-base leading-tight">
              MobileTest <span className="text-blue-400">Guardian</span>
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-3 h-3 text-blue-400" />
              <span className="text-[11px] text-slate-400 font-medium">Enterprise QA Suite</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4 custom-scrollbar">
        {navSections.map((section) => (
          <div key={section.group} className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              {section.group}
            </div>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id}>
                    <button
                      id={`nav-item-${item.id}`}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600/15 text-blue-400 font-semibold shadow-sm'
                          : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium tabular-nums ${
                            item.badgeColor
                              ? item.badgeColor
                              : isActive
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer ADB Daemon Status (CSS Selector 1 Target) */}
      <div className="p-4 border-t border-slate-800 bg-[#0c1322]">
        <div
          onClick={() => setActiveTab('devices')}
          title="Click to configure Multi-Brand OS Device Matrix"
          className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-blue-500/40 rounded-lg p-3 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
            <span>Multi-OS ADB Matrix</span>
            <span className="text-blue-400 font-mono">Manage →</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <div className="text-xs text-slate-100 font-mono font-semibold tabular-nums">
                {displayCount} OS Nodes Active
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-mono tabular-nums">Port 5037</span>
          </div>
          <div className="mt-1.5 pt-1.5 border-t border-slate-700/50 text-[10px] text-slate-400 font-mono truncate">
            {activeBrands.length > 0 ? activeBrands.join(' · ') : 'Samsung · Xiaomi · OnePlus · Nothing · Pixel'}
          </div>
        </div>
      </div>
    </aside>
  );
};

