import React, { useState } from 'react';
import {
  Bug,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Smartphone,
  Eye,
  Plus,
  ArrowUpRight,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import { Defect, Severity } from '../types';

interface DefectTrackerProps {
  defects: Defect[];
  onUpdateDefectStatus: (id: string, newStatus: any) => void;
}

export const DefectTracker: React.FC<DefectTrackerProps> = ({
  defects,
  onUpdateDefectStatus
}) => {
  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(defects[0] || null);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredDefects = defects.filter(d => {
    const matchesSeverity = severityFilter === 'ALL' || d.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchesSeverity && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Bug className="w-5 h-5 text-amber-600" />
              <span>Rule-Based Defect Classification Engine (M9)</span>
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono font-medium border border-blue-100">
              Auto-Triage
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated bug triage into Critical, High, Medium, and Low severity tiers with reproduction context.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Total Recorded Defects:</span>
          <span className="text-xs font-mono font-bold text-slate-900 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            {defects.length} Issues
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-500 font-medium">Severity:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded-lg font-mono font-semibold transition-all cursor-pointer ${
                severityFilter === sev
                  ? sev === 'CRITICAL' ? 'bg-rose-600 text-white' :
                    sev === 'HIGH' ? 'bg-orange-600 text-white' :
                    sev === 'MEDIUM' ? 'bg-amber-600 text-white' :
                    sev === 'LOW' ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Fixed">Fixed</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Split View: Defect List & Detailed Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Defect Cards */}
        <div className="space-y-3">
          {filteredDefects.map((defect) => {
            const isSelected = selectedDefect?.id === defect.id;
            return (
              <div
                key={defect.id}
                onClick={() => setSelectedDefect(defect)}
                className={`bg-white border p-4 rounded-xl cursor-pointer transition-all shadow-xs ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/20 ring-1 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-bold ${
                      defect.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      defect.severity === 'HIGH' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                      defect.severity === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {defect.severity}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">{defect.id}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-mono font-medium">
                    {defect.status}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 mt-2 leading-relaxed">{defect.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{defect.description}</p>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
                  <span className="text-slate-600 font-medium">{defect.deviceName}</span>
                  <span className="text-blue-600 font-semibold">Details →</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Defect Detail Card */}
        {selectedDefect && (
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-600">{selectedDefect.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-bold ${
                    selectedDefect.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    selectedDefect.severity === 'HIGH' ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {selectedDefect.severity} SEVERITY
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug">{selectedDefect.title}</h3>
              </div>

              {/* Status Updater */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Status:</span>
                <select
                  value={selectedDefect.status}
                  onChange={(e) => onUpdateDefectStatus(selectedDefect.id, e.target.value)}
                  className="bg-white border border-slate-200 text-xs text-slate-700 font-semibold px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Fixed">Fixed</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Meta Tags */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-mono font-semibold block">Category</span>
                <span className="font-semibold text-blue-700 mt-0.5 block">{selectedDefect.category}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-mono font-semibold block">Device</span>
                <span className="font-semibold text-slate-900 mt-0.5 block truncate">{selectedDefect.deviceName}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-mono font-semibold block">Android Version</span>
                <span className="font-semibold text-slate-900 mt-0.5 block">{selectedDefect.androidVersion}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-mono font-semibold block">Associated Test</span>
                <span className="font-semibold text-slate-700 mt-0.5 block truncate">{selectedDefect.testCase.split(':')[0]}</span>
              </div>
            </div>

            {/* Bug Summary Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                Problem Description
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                {selectedDefect.description}
              </p>
            </div>

            {/* Reproduction Steps */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                Steps to Reproduce
              </h4>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1.5 text-xs">
                {selectedDefect.reproSteps.map((step, i) => (
                  <p key={i} className="font-mono text-[11px] text-slate-700">{step}</p>
                ))}
              </div>
            </div>

            {/* Diagnostic Logs */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                Diagnostic Log Evidence
              </h4>
              <pre className="bg-[#1E293B] border border-slate-800 p-4 rounded-xl font-mono text-[11px] text-amber-300 overflow-x-auto max-h-36 custom-scrollbar whitespace-pre-wrap shadow-sm">
                {selectedDefect.logs}
              </pre>
            </div>

            {/* Recommended Fix */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-1 text-xs">
              <span className="font-bold text-emerald-800 font-mono text-[10px] uppercase">
                Recommended Developer Resolution
              </span>
              <p className="text-emerald-900 leading-relaxed">{selectedDefect.recommendation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
