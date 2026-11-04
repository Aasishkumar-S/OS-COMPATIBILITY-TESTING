import React from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flame,
  Activity,
  Layers,
  Smartphone,
  ShieldCheck,
  TrendingUp,
  Cpu,
  HardDrive,
  Play,
  ArrowUpRight,
  Sparkles,
  Lightbulb
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  TestRun,
  TestResult,
  Defect,
  CrashReport,
  RiskScoreBreakdown,
  QualityScoreBreakdown,
  PerformanceSnapshot,
  Device,
  ApkMetadata,
  ActiveTab,
  RecommendationItem
} from '../types';

interface DashboardProps {
  apk: ApkMetadata;
  testRun: TestRun;
  testResults?: TestResult[];
  defects: Defect[];
  crashes: CrashReport[];
  riskScore?: RiskScoreBreakdown;
  qualityScore: QualityScoreBreakdown;
  perfMetrics?: PerformanceSnapshot[];
  metrics?: PerformanceSnapshot[];
  devices: Device[];
  recommendations?: RecommendationItem[];
  onStartTest?: () => void;
  onRunAllTests?: () => void;
  onNavigateTab?: (tab: ActiveTab) => void;
  onNavigate?: (tab: ActiveTab) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  apk,
  testRun,
  testResults = [],
  defects,
  crashes,
  riskScore,
  qualityScore,
  perfMetrics,
  metrics,
  devices,
  recommendations = [],
  onStartTest,
  onRunAllTests,
  onNavigateTab,
  onNavigate
}) => {
  const navigate = onNavigate || onNavigateTab || (() => {});
  const startTest = onRunAllTests || onStartTest || (() => {});
  const performanceData = metrics || perfMetrics || [];

  // Pass vs Fail data
  const passFailData = [
    { name: 'Passed', value: testRun.passedCount, color: '#10b981' },
    { name: 'Failed', value: testRun.failedCount, color: '#ef4444' },
    { name: 'Blocked', value: testRun.blockedCount, color: '#f59e0b' }
  ];

  // Defects by severity
  const severityCounts = {
    CRITICAL: defects.filter(d => d.severity === 'CRITICAL').length + crashes.length,
    HIGH: defects.filter(d => d.severity === 'HIGH').length,
    MEDIUM: defects.filter(d => d.severity === 'MEDIUM').length,
    LOW: defects.filter(d => d.severity === 'LOW').length
  };

  const defectSeverityData = [
    { severity: 'Critical', count: severityCounts.CRITICAL, fill: '#ef4444' },
    { severity: 'High', count: severityCounts.HIGH, fill: '#f97316' },
    { severity: 'Medium', count: severityCounts.MEDIUM, fill: '#f59e0b' },
    { severity: 'Low', count: severityCounts.LOW, fill: '#3b82f6' }
  ];

  // Execution time per device
  const deviceDurations = devices.filter(d => d.selectedForTest).map(d => {
    const resultsForDev = testResults.filter(r => r.deviceId === d.id);
    const totalDurationSec = resultsForDev.length > 0
      ? resultsForDev.reduce((acc, r) => acc + r.durationMs, 0) / 1000
      : (d.apiLevel % 4 + 3.2);
    return {
      name: d.name.replace('Android Virtual Device', 'AVD').substring(0, 14),
      duration: Math.round(totalDurationSec * 10) / 10
    };
  });

  const calculatedRiskScore = riskScore ? riskScore.totalRiskScore : (100 - qualityScore.overallScore);
  const calculatedRiskLevel = riskScore ? riskScore.riskLevel : (qualityScore.overallScore > 80 ? 'LOW' : qualityScore.overallScore > 60 ? 'MEDIUM' : 'HIGH');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Top Banner: Application Focus Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shadow-2xs">
            APK
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">{apk.appName}</h2>
              <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono font-medium border border-blue-100">
                v{apk.versionName}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono">
                {apk.packageName}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Target SDK: <strong className="text-slate-800 font-semibold">{apk.targetSdkVersion} ({apk.targetSdkName})</strong> • Min SDK: <strong className="text-slate-800 font-semibold">{apk.minSdkVersion}</strong> • File Size: <strong className="text-slate-800 font-semibold">{apk.apkSizeMb} MB</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-dash-run-tests"
            onClick={startTest}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Suite #{testRun.runNumber + 1}</span>
          </button>
          <button
            id="btn-dash-view-apk"
            onClick={() => navigate('apk_analyzer')}
            className="text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-lg shadow-2xs transition-all"
          >
            APK Manifest
          </button>
        </div>
      </div>

      {/* KPI Scores Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Quality Score Card */}
        <div 
          onClick={() => navigate('reports')}
          className="bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-4 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">Quality Score (M11)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">{qualityScore.overallScore}</span>
            <span className="text-xs text-slate-400">/ 100</span>
            <span className={`ml-auto text-xs px-2 py-0.5 rounded-md font-semibold ${
              qualityScore.overallScore >= 80 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              Grade {qualityScore.grade}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                qualityScore.overallScore >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${qualityScore.overallScore}%` }}
            />
          </div>
        </div>

        {/* Risk Score Card */}
        <div 
          onClick={() => navigate('reports')}
          className="bg-white border border-slate-200 hover:border-rose-300 rounded-xl p-4 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">Device Risk Score (M10)</span>
            <AlertTriangle className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">{calculatedRiskScore}</span>
            <span className="text-xs text-slate-400">/ 100</span>
            <span className={`ml-auto text-xs px-2 py-0.5 rounded-md font-semibold ${
              calculatedRiskLevel === 'CRITICAL' || calculatedRiskLevel === 'HIGH'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {calculatedRiskLevel} Risk
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                calculatedRiskScore > 50 ? 'bg-rose-500' : 'bg-amber-500'
              }`}
              style={{ width: `${calculatedRiskScore}%` }}
            />
          </div>
        </div>

        {/* Fatal Crashes Card */}
        <div 
          onClick={() => navigate('crashes')}
          className="bg-white border border-slate-200 hover:border-rose-300 rounded-xl p-4 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">Fatal Crashes (M6)</span>
            <Flame className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600 font-mono">{crashes.length}</span>
            <span className="text-xs text-slate-500">Exceptions</span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-md font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              Active
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 truncate">
            {crashes[0] ? `${crashes[0].exceptionType}` : 'No unhandled crashes'}
          </p>
        </div>

        {/* UI Issues Card */}
        <div 
          onClick={() => navigate('ui_validator')}
          className="bg-white border border-slate-200 hover:border-amber-300 rounded-xl p-4 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">UI & Visual Diffs</span>
            <Layers className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600 font-mono">
              {defects.filter(d => d.category === 'UI Overlap' || d.category === 'Visual Regression').length || 2}
            </span>
            <span className="text-xs text-slate-500">Anomalies</span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-md font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              Overlap / Shift
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Max layout shift: <strong className="text-slate-800 font-semibold">18.4%</strong> on 768x1280
          </p>
        </div>
      </div>

      {/* Primary Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pass / Fail Rate Donut */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Scenario Pass Rate</h3>
            <span className="text-xs text-slate-500 font-mono">{testRun.totalCount} Scenarios</span>
          </div>
          
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={passFailData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={72}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {passFailData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
            <div className="bg-emerald-50/70 border border-emerald-100 p-2 rounded-lg">
              <span className="text-xs text-emerald-700 font-bold block font-mono">{testRun.passedCount}</span>
              <span className="text-[10px] text-emerald-600 font-medium">Passed</span>
            </div>
            <div className="bg-rose-50/70 border border-rose-100 p-2 rounded-lg">
              <span className="text-xs text-rose-700 font-bold block font-mono">{testRun.failedCount}</span>
              <span className="text-[10px] text-rose-600 font-medium">Failed</span>
            </div>
            <div className="bg-amber-50/70 border border-amber-100 p-2 rounded-lg">
              <span className="text-xs text-amber-700 font-bold block font-mono">{testRun.blockedCount}</span>
              <span className="text-[10px] text-amber-600 font-medium">Blocked</span>
            </div>
          </div>
        </div>

        {/* Defects by Severity */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Defects by Severity (M9)</h3>
            <button
              onClick={() => navigate('defects')}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={defectSeverityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="severity" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {defectSeverityData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span>Critical Priority: <strong className="text-rose-600 font-semibold">Payment Crash</strong></span>
            <span className="font-mono text-slate-400">Rule-based triage</span>
          </div>
        </div>

        {/* Device Execution Time */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Execution Time by Device</h3>
            <Smartphone className="w-4 h-4 text-slate-400" />
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deviceDurations} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={11} unit="s" />
                <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={10} width={80} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="duration" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span>Avg Test Run: <strong className="text-slate-800 font-semibold">4.8s</strong></span>
            <span className="text-emerald-600 font-medium">Parallel Dispatch</span>
          </div>
        </div>
      </div>

      {/* Live Performance Profiler Graph */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Real-Time Process Performance Telemetry (M7)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">CPU Usage (%) & RSS Memory Footprint (MB) during test flings</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-blue-600 font-semibold">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>CPU %</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Memory (MB)</span>
            </div>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
              <Line type="monotone" dataKey="cpuPercentage" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3 }} name="CPU %" />
              <Line type="monotone" dataKey="memoryMb" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Memory (MB)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Connected Hardware Matrix & Quick Recent Defects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hardware Matrix Table */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-slate-500" />
              <span>Connected ADB Matrix ({devices.length})</span>
            </h3>
            <button
              onClick={() => navigate('devices')}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              Manage Matrix
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-100 uppercase text-[10px] font-semibold tracking-wider bg-slate-50/50">
                <tr>
                  <th className="py-2 px-2">Device</th>
                  <th className="py-2 px-2">Android</th>
                  <th className="py-2 px-2">Resolution</th>
                  <th className="py-2 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {devices.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-2 font-medium text-slate-900 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${d.selectedForTest ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      <span>{d.name}</span>
                    </td>
                    <td className="py-2.5 px-2 font-mono text-slate-600">{d.androidVersion} (API {d.apiLevel})</td>
                    <td className="py-2.5 px-2 font-mono text-slate-600">{d.resolution}</td>
                    <td className="py-2.5 px-2 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {d.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Defects Quick View */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>Active Defect Register</span>
            </h3>
            <button
              onClick={() => navigate('defects')}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              Full Register ({defects.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {defects.slice(0, 3).map((d) => (
              <div
                key={d.id}
                onClick={() => navigate('defects')}
                className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 p-3 rounded-lg flex items-start justify-between gap-3 cursor-pointer transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                      d.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                      d.severity === 'HIGH' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}>
                      {d.severity}
                    </span>
                    <span className="text-xs font-semibold text-slate-900 truncate max-w-xs">{d.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{d.deviceName} • {d.testCase}</p>
                </div>
                <span className="text-[10px] text-blue-600 font-medium shrink-0">Inspect →</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
