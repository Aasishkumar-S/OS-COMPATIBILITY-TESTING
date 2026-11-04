import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  HardDrive,
  Clock,
  Battery,
  AlertTriangle,
  Download,
  Flame,
  Zap,
  TrendingUp
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { PerformanceSnapshot } from '../types';

interface PerformanceMonitorProps {
  metrics: PerformanceSnapshot[];
  onExportCsv: () => void;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  metrics,
  onExportCsv
}) => {
  const [selectedMetricView, setSelectedMetricView] = useState<'all' | 'cpu' | 'memory' | 'latency'>('all');

  const latest = metrics[metrics.length - 1] || {
    cpuPercentage: 35,
    memoryMb: 220,
    pssMb: 152,
    responseTimeMs: 890,
    fps: 58,
    batteryDrainMah: 8.1,
    jankyFrames: 2
  };

  const avgCpu = Math.round(metrics.reduce((a, b) => a + b.cpuPercentage, 0) / Math.max(1, metrics.length));
  const maxMemory = Math.max(...metrics.map(m => m.memoryMb));
  const totalJank = metrics.reduce((a, b) => a + b.jankyFrames, 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span>Real-Time Process Performance Telemetry (M7)</span>
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono font-medium border border-blue-100">
              dumpsys meminfo / top
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kernel-level CPU utilization, Proportional Set Size (PSS) memory footprint, and frame render jank.
          </p>
        </div>

        <button
          onClick={onExportCsv}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-lg border border-slate-200 shadow-2xs transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Metrics (CSV)</span>
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Current CPU Load</span>
            <Cpu className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <h4 className="text-2xl font-bold text-slate-900 font-mono">{latest.cpuPercentage}%</h4>
            <span className="text-xs text-slate-400 font-medium">Avg: {avgCpu}%</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Status: Optimal</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Process RSS Memory</span>
            <HardDrive className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <h4 className="text-2xl font-bold text-slate-900 font-mono">{latest.memoryMb} MB</h4>
            <span className="text-xs text-slate-400 font-medium">PSS: {latest.pssMb} MB</span>
          </div>
          <span className="text-[11px] text-amber-600 font-semibold">Peak Heap: {maxMemory} MB</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Response Latency</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <h4 className="text-2xl font-bold text-slate-900 font-mono">{(latest.responseTimeMs / 1000).toFixed(2)}s</h4>
            <span className="text-xs text-slate-400 font-medium">{latest.fps} FPS</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">UI Thread Responsive</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Janky Render Frames</span>
            <Zap className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <h4 className="text-2xl font-bold text-rose-600 font-mono">{totalJank}</h4>
            <span className="text-xs text-slate-400 font-medium">(&gt;16.6ms deadline)</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">During Recycler fling</span>
        </div>
      </div>

      {/* Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU & Latency Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <span>CPU Utilization Profile (%)</span>
            </h3>
            <span className="text-xs font-mono text-slate-400 font-medium">Live Samples</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px', fontSize: '11px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="cpuPercentage" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#cpuGradient)" name="CPU %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Memory RSS & PSS Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-teal-600" />
              <span>Heap & PSS Memory Footprint (MB)</span>
            </h3>
            <span className="text-xs font-mono text-slate-400 font-medium">Allocation Curve</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px', fontSize: '11px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="memoryMb" stroke="#0d9488" strokeWidth={2} dot={{ r: 3 }} name="Total RSS (MB)" />
                <Line type="monotone" dataKey="pssMb" stroke="#d97706" strokeWidth={2} dot={{ r: 3 }} name="Private PSS (MB)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
