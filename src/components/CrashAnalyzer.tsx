import React, { useState } from 'react';
import {
  Flame,
  AlertOctagon,
  Copy,
  Check,
  Smartphone,
  Eye,
  Calendar,
  Share2,
  Bug,
  Terminal,
  Layers,
  ShieldCheck,
  RefreshCw,
  Trash2,
  Sparkles
} from 'lucide-react';
import { CrashReport } from '../types';

interface CrashAnalyzerProps {
  crashes: CrashReport[];
  onLogDefectFromCrash: (crash: CrashReport) => void;
  onClearCrashes?: () => void;
  onSimulateStressCrash?: () => void;
}

export const CrashAnalyzer: React.FC<CrashAnalyzerProps> = ({
  crashes,
  onLogDefectFromCrash,
  onClearCrashes,
  onSimulateStressCrash
}) => {
  const [selectedCrash, setSelectedCrash] = useState<CrashReport | null>(crashes[0] || null);
  const [copiedTrace, setCopiedTrace] = useState<boolean>(false);

  const handleCopyTrace = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTrace(true);
    setTimeout(() => setCopiedTrace(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Flame className={`w-5 h-5 ${crashes.length > 0 ? 'text-rose-600 animate-pulse' : 'text-slate-400'}`} />
              <span>Crash Ingestion & Stack Trace Analyzer (M6)</span>
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono font-medium border border-blue-100">
              Logcat Regex Hook
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time AndroidRuntime and FATAL EXCEPTION logcat stream monitoring with automated stack demangling.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {crashes.length > 0 ? (
            <>
              <span className="text-xs text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg font-mono font-semibold">
                {crashes.length} Fatal Exception{crashes.length > 1 ? 's' : ''} Logged
              </span>
              {onClearCrashes && (
                <button
                  onClick={onClearCrashes}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-slate-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear & Resolve All</span>
                </button>
              )}
            </>
          ) : (
            <>
              <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg font-mono font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>0 Fatal Crashes - 100% Stable</span>
              </span>
              {onSimulateStressCrash && (
                <button
                  onClick={onSimulateStressCrash}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Inject Stress Exception</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main Grid: Crash List & Deep Diagnostics */}
      {crashes.length === 0 ? (
        /* Zero Crashes Clean State */
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-2xl mx-auto space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Zero Unhandled Exceptions Detected</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
              Your application process executed without any fatal runtime SIGABRT signals, NullPointerExceptions, or memory leaks across the connected device matrix.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {onSimulateStressCrash && (
              <button
                onClick={onSimulateStressCrash}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer shadow-xs"
              >
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span>Simulate Low-RAM Monkey Crash Test</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Crash Cards List */}
          <div className="space-y-3">
            {crashes.map((crash) => {
              const isSelected = selectedCrash?.id === crash.id;
              return (
                <div
                  key={crash.id}
                  onClick={() => setSelectedCrash(crash)}
                  className={`bg-white border p-4 rounded-xl cursor-pointer transition-all shadow-xs ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      {crash.severity}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{crash.timestamp}</span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 mt-2 leading-snug">{crash.exceptionType}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 truncate">{crash.activityName.split('.').pop()}</p>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{crash.errorMessage}</p>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
                    <span className="text-slate-600 font-medium">{crash.deviceName}</span>
                    <span className="text-rose-600 font-semibold">Inspect →</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Crash Deep Analysis */}
          {selectedCrash && (
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-rose-600">{selectedCrash.exceptionType}</span>
                  <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                    {selectedCrash.errorMessage}
                  </h3>
                </div>

                <button
                  onClick={() => onLogDefectFromCrash(selectedCrash)}
                  className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md shadow-rose-600/20 transition-all cursor-pointer shrink-0"
                >
                  <Bug className="w-4 h-4" />
                  <span>Promote to Defect (M9)</span>
                </button>
              </div>

              {/* Hardware & Activity Environment */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-mono font-semibold">Device Model</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block truncate">{selectedCrash.deviceName}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-mono font-semibold">Android OS</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{selectedCrash.androidVersion}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-mono font-semibold">Activity</span>
                  <span className="font-semibold text-blue-700 mt-0.5 block truncate">{selectedCrash.activityName.split('.').pop()}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-mono font-semibold">Status</span>
                  <span className="font-semibold text-rose-600 mt-0.5 block">{selectedCrash.status}</span>
                </div>
              </div>

              {/* Stack Trace Demangler View */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 font-mono uppercase">
                    Fatal Stack Trace Buffer
                  </span>
                  <button
                    onClick={() => handleCopyTrace(selectedCrash.stackTrace)}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-mono font-medium cursor-pointer"
                  >
                    {copiedTrace ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTrace ? 'Copied' : 'Copy Stack'}</span>
                  </button>
                </div>

                <pre className="bg-[#1E293B] border border-slate-800 p-4 rounded-xl font-mono text-xs text-rose-300 overflow-x-auto max-h-56 custom-scrollbar whitespace-pre-wrap leading-relaxed shadow-sm">
                  {selectedCrash.stackTrace}
                </pre>
              </div>

              {/* Automated Reproduction Steps */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 font-mono uppercase">
                  Automated Bug Reproduction Steps
                </span>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1.5 text-xs text-slate-700">
                  {selectedCrash.reproSteps.map((step, i) => (
                    <p key={i} className="font-mono text-[11px] text-slate-700">{step}</p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
