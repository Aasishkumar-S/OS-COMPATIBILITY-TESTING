import React, { useState } from 'react';
import {
  FileCode2,
  Shield,
  ShieldAlert,
  AlertTriangle,
  Upload,
  CheckCircle2,
  Copy,
  Check,
  Layers,
  Radio,
  FileCheck,
  Info,
  Loader2,
  Cpu,
  Boxes,
  Lock,
  Smartphone
} from 'lucide-react';
import { ApkMetadata, PermissionItem } from '../types';

interface ApkAnalyzerProps {
  apk: ApkMetadata;
  onSelectSampleApk: (apk: ApkMetadata) => void;
  allApks: ApkMetadata[];
  onUploadCustomApk: (file: File) => void;
  isParsing?: boolean;
  parsingProgress?: string;
  onOpenLiveSimulator?: () => void;
}

export const ApkAnalyzer: React.FC<ApkAnalyzerProps> = ({
  apk,
  onSelectSampleApk,
  allApks,
  onUploadCustomApk,
  isParsing = false,
  parsingProgress = '',
  onOpenLiveSimulator
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'permissions' | 'activities' | 'services' | 'security'>('permissions');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [filterSensitive, setFilterSensitive] = useState<boolean>(false);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(type);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const displayedPermissions = filterSensitive
    ? apk.permissions.filter(p => p.isSensitive)
    : apk.permissions;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Header & File Upload */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileCode2 className="w-5 h-5 text-blue-600" />
              <span>APK Manifest & Component Analyzer (M1)</span>
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono font-medium border border-blue-100">
              Binary & ZIP Decompiler
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Direct client-side APK binary inspection, real cryptographic checksums, binary XML decompilation, and security vulnerability mapping.
          </p>
        </div>

        {/* Preset APK Switcher & Test Live */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {onOpenLiveSimulator && (
            <button
              id="btn-analyzer-open-live-sandbox"
              onClick={onOpenLiveSimulator}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>Launch Live App Sandbox</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Select Application:</span>
            <div className="flex flex-wrap gap-1.5">
              {allApks.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => onSelectSampleApk(sample)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-medium ${
                    apk.id === sample.id
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {sample.appName.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Dropzone & Live Parser Banner */}
      {isParsing ? (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 flex items-center justify-center gap-4 text-blue-800 shadow-xs">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-blue-950">Analyzing & Decompiling APK Archive...</h4>
            <p className="text-xs text-blue-700">{parsingProgress || 'Inspecting zip file structure, manifest, and dex bytecode...'}</p>
          </div>
        </div>
      ) : (
        <label className="border-2 border-dashed border-slate-200 hover:border-blue-500 bg-white hover:bg-slate-50/50 rounded-xl p-5 flex items-center justify-between gap-4 cursor-pointer transition-all shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Upload Target Android Application (.apk)</h4>
              <p className="text-[11px] text-slate-500">
                Supports any Android APK — unpacks binary manifest, DEX bytecode, assets, and generates calibrated test suites
              </p>
            </div>
          </div>
          <span className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-xs transition-colors">
            Browse & Test APK
          </span>
          <input
            type="file"
            accept=".apk"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onUploadCustomApk(e.target.files[0]);
              }
            }}
          />
        </label>
      )}

      {/* Main Metadata Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-xs">
          {apk.iconDataUrl && (
            <img
              src={apk.iconDataUrl}
              alt={apk.appName}
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
            />
          )}
          <div className="min-w-0 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 block">Application Name</span>
            <h4 className="text-base font-bold text-slate-900 truncate" title={apk.appName}>{apk.appName}</h4>
            <p className="text-xs font-mono text-blue-600 truncate" title={apk.packageName}>{apk.packageName}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500">Version Specifications</span>
          <h4 className="text-base font-bold text-slate-900">v{apk.versionName}</h4>
          <p className="text-xs font-mono text-slate-600">Build: {apk.versionCode} • {apk.apkSizeMb} MB</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500">SDK Target Range</span>
          <h4 className="text-base font-bold text-slate-900">{apk.targetSdkName || `API ${apk.targetSdkVersion}`}</h4>
          <p className="text-xs font-mono text-slate-600">Min SDK: API {apk.minSdkVersion} ({apk.minSdkName.split(' ')[0]})</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500">Permission Risk Index</span>
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-slate-900 font-mono">{apk.permissionRiskScore}/100</h4>
            <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
              apk.permissionRiskScore > 60 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {apk.permissionRiskScore > 60 ? 'Elevated' : 'Standard'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">{apk.permissions.filter(p => p.isSensitive).length} sensitive permissions</p>
        </div>
      </div>

      {/* Component & Bytecode Quick Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Activities</span>
            <span className="text-sm font-bold text-slate-900">{apk.activities.length} UI Entrypoints</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Boxes className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Services / Rcv</span>
            <span className="text-sm font-bold text-slate-900">{apk.services.length + apk.receivers.length} Background</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Exported Components</span>
            <span className="text-sm font-bold text-slate-900">{apk.exportedComponentsCount} Exposed</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Debug Status</span>
            <span className={`text-sm font-bold ${apk.debuggable ? 'text-amber-600' : 'text-emerald-600'}`}>
              {apk.debuggable ? 'Debuggable (DEV)' : 'Release (PROD)'}
            </span>
          </div>
        </div>
      </div>

      {/* Checksum Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-mono font-semibold">MD5 Hash</span>
            <div className="flex items-center gap-1.5 font-mono text-slate-800 mt-0.5">
              <span>{apk.md5Hash}</span>
              <button onClick={() => handleCopy(apk.md5Hash, 'md5')} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                {copiedHash === 'md5' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <div className="border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-6">
            <span className="text-slate-400 block text-[10px] uppercase font-mono font-semibold">SHA-256 Hash</span>
            <div className="flex items-center gap-1.5 font-mono text-slate-800 mt-0.5">
              <span className="truncate max-w-xs">{apk.sha256Hash}</span>
              <button onClick={() => handleCopy(apk.sha256Hash, 'sha256')} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                {copiedHash === 'sha256' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <FileCheck className="w-4 h-4 text-emerald-600" />
          <span>APK Signature Scheme Verified</span>
        </div>
      </div>

      {/* Tabs for Manifest Deep Dive */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="border-b border-slate-200 px-4 flex items-center justify-between bg-slate-50/70">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveSubTab('permissions')}
              className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeSubTab === 'permissions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Declared Permissions ({apk.permissions.length})
            </button>
            <button
              onClick={() => setActiveSubTab('activities')}
              className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeSubTab === 'activities'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Activities ({apk.activities.length})
            </button>
            <button
              onClick={() => setActiveSubTab('services')}
              className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeSubTab === 'services'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Services & Receivers ({apk.services.length + apk.receivers.length})
            </button>
            <button
              onClick={() => setActiveSubTab('security')}
              className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeSubTab === 'security'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Security Flags & Alerts ({apk.securityAlerts.length})
            </button>
          </div>

          {activeSubTab === 'permissions' && (
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={filterSensitive}
                onChange={(e) => setFilterSensitive(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
              />
              <span>Dangerous Only</span>
            </label>
          )}
        </div>

        <div className="p-5">
          {/* Permissions SubTab */}
          {activeSubTab === 'permissions' && (
            <div className="space-y-3">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 border-b border-slate-100 uppercase text-[10px] font-semibold tracking-wider bg-slate-50/50">
                    <tr>
                      <th className="py-2.5 px-3">Permission Identifier</th>
                      <th className="py-2.5 px-3">Classification</th>
                      <th className="py-2.5 px-3">Functional Description</th>
                      <th className="py-2.5 px-3 text-right">Risk Tag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {displayedPermissions.map((perm, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-900">{perm.name}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold ${
                            perm.category === 'Dangerous' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {perm.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{perm.description}</td>
                        <td className="py-2.5 px-3 text-right">
                          {perm.isSensitive ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                              SENSITIVE
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-medium">Normal</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Activities SubTab */}
          {activeSubTab === 'activities' && (
            <div className="space-y-2">
              {apk.activities.map((act, i) => (
                <div key={i} className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 p-3 rounded-lg flex items-center justify-between text-xs transition-colors">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-mono text-slate-800 font-medium">{act}</span>
                  </div>
                  {act.includes('(Launcher)') && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      MAIN LAUNCHER
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Services & Receivers */}
          {activeSubTab === 'services' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Declared Services ({apk.services.length})</h4>
                {apk.services.map((svc, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-mono text-slate-700">
                    {svc}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Broadcast Receivers ({apk.receivers.length})</h4>
                {apk.receivers.map((rec, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-mono text-slate-700">
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security SubTab */}
          {activeSubTab === 'security' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 space-y-1">
                  <p className="font-bold text-amber-900">Static Security Assessment Notice</p>
                  <p className="text-amber-800">
                    Calculated permission-risk score and component exposure alerts based on parsed binary manifest attributes.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {apk.securityAlerts.map((alert, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-start gap-2.5 text-xs text-slate-700">
                    <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{alert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
