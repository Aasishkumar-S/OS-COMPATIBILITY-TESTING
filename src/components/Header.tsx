import React, { useRef } from 'react';
import { Play, Square, Download, RefreshCw, Smartphone, Package, ShieldAlert, Upload, BookOpen, Terminal, Loader2 } from 'lucide-react';
import { ApkMetadata, Device, ActiveTab } from '../types';

interface HeaderProps {
  apk?: ApkMetadata;
  currentApk?: ApkMetadata;
  devices?: Device[];
  connectedDeviceCount?: number;
  runningTest?: boolean;
  isExecuting?: boolean;
  isParsing?: boolean;
  activeTab?: ActiveTab;
  onStartTest?: () => void;
  onStartExecution?: () => void;
  onStopTest?: () => void;
  onExportReport?: () => void;
  onRefreshDevices?: () => void;
  onSelectApk: (apk: ApkMetadata) => void;
  onUploadCustomApk?: (file: File) => void;
  allApks: ApkMetadata[];
  onOpenDocs?: () => void;
  onOpenPython?: () => void;
  onOpenLiveSimulator?: () => void;
  onOpenDevices?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  apk,
  currentApk,
  devices = [],
  connectedDeviceCount,
  runningTest,
  isExecuting,
  isParsing = false,
  activeTab,
  onStartTest,
  onStartExecution,
  onStopTest,
  onExportReport,
  onRefreshDevices,
  onSelectApk,
  onUploadCustomApk,
  allApks,
  onOpenDocs,
  onOpenPython,
  onOpenLiveSimulator,
  onOpenDevices
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const activeApk = currentApk || apk || allApks[0];
  const isRunning = isExecuting !== undefined ? isExecuting : !!runningTest;
  const startHandler = onStartExecution || onStartTest || (() => {});
  const selectedDevices = devices.filter(d => d.selectedForTest && d.status === 'ready');
  const activeDeviceCount = selectedDevices.length > 0
    ? selectedDevices.length
    : connectedDeviceCount !== undefined
    ? connectedDeviceCount
    : devices.length;

  const brandNames = Array.from(
    new Set((selectedDevices.length > 0 ? selectedDevices : devices).map(d => d.manufacturer.split(' ')[0]))
  ).slice(0, 4);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs shrink-0 select-none z-10">
      {/* Target Application & Status */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Project Selector Badge + Direct APK Import */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg shadow-2xs">
          {activeApk.iconDataUrl ? (
            <img
              src={activeApk.iconDataUrl}
              alt={activeApk.appName}
              referrerPolicy="no-referrer"
              className="w-5 h-5 rounded-md object-cover border border-slate-200 shrink-0"
            />
          ) : (
            <Package className="w-4 h-4 text-blue-600 shrink-0" />
          )}
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono hidden sm:inline">App:</span>
          <select
            id="header-apk-selector"
            value={activeApk.id}
            onChange={(e) => {
              const selected = allApks.find(a => a.id === e.target.value);
              if (selected) onSelectApk(selected);
            }}
            className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer pr-1 max-w-[220px] truncate"
          >
            {allApks.map((a) => (
              <option key={a.id} value={a.id} className="bg-white text-slate-800 font-medium">
                {a.isCustomUpload ? `★ ${a.appName} (Uploaded v${a.versionName})` : `${a.appName} (v${a.versionName})`}
              </option>
            ))}
          </select>
          <span className="text-[11px] text-slate-500 font-mono tabular-nums hidden md:inline">
            ({activeApk.apkSizeMb} MB)
          </span>

          {onUploadCustomApk && (
            <>
              <div className="h-3.5 w-[1px] bg-slate-200 mx-0.5" />
              <button
                type="button"
                id="btn-header-import-apk"
                onClick={() => fileInputRef.current?.click()}
                disabled={isParsing}
                title="Import any Android .apk file to analyze and run in Live Sandbox"
                className="flex items-center gap-1 px-2 py-0.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {isParsing ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Importing...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3 h-3" />
                    <span>+ Import APK</span>
                  </>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".apk"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onUploadCustomApk(file);
                    e.target.value = '';
                  }
                }}
              />
            </>
          )}
        </div>

        <div className="hidden lg:block h-4 w-[1px] bg-slate-200" />

        {/* Connected Multi-Brand Matrix Badge */}
        <div
          onClick={onOpenDevices}
          title="Click to switch mobile OS skins & brands (Samsung, Xiaomi, OnePlus, Nothing, Pixel, Windows WSA, Linux)"
          className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 cursor-pointer transition-colors"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="whitespace-nowrap">
            <strong className="text-slate-900 font-mono font-bold tabular-nums">{activeDeviceCount}</strong> OS Nodes
          </span>
          {brandNames.length > 0 && (
            <span className="hidden xl:inline text-[11px] text-slate-500 font-mono truncate max-w-[210px]">
              ({brandNames.join(' · ')})
            </span>
          )}
          {onRefreshDevices && (
            <button
              id="btn-refresh-adb-devices"
              onClick={(e) => {
                e.stopPropagation();
                onRefreshDevices();
              }}
              title="Scan ADB Devices"
              className="text-slate-400 hover:text-slate-700 transition-colors ml-0.5 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          )}
        </div>

        {activeApk.debuggable && (
          <div className="hidden 2xl:flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2.5 py-1 whitespace-nowrap">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Debuggable APK</span>
          </div>
        )}
      </div>

      {/* Action Controls (RUN FULL SUITE removed as requested) */}
      <div className="flex items-center gap-2.5 shrink-0">
        {onOpenLiveSimulator && (
          <button
            id="btn-header-open-live-simulator"
            onClick={onOpenLiveSimulator}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'live_simulator'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-500/20'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Test App Live</span>
          </button>
        )}

        {onOpenDocs && (
          <button
            id="btn-header-open-docs"
            onClick={onOpenDocs}
            className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium whitespace-nowrap"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Thesis Docs</span>
          </button>
        )}

        {onOpenPython && (
          <button
            id="btn-header-open-python"
            onClick={onOpenPython}
            className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium whitespace-nowrap"
          >
            <Terminal className="w-3.5 h-3.5 text-slate-700" />
            <span>PyQt6 Code</span>
          </button>
        )}

        {onExportReport && (
          <button
            id="btn-header-quick-export"
            onClick={onExportReport}
            className="hidden sm:flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-medium px-3 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export</span>
          </button>
        )}
      </div>
    </header>
  );
};

