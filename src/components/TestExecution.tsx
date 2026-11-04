import React, { useState } from 'react';
import {
  PlayCircle,
  Square,
  Pause,
  Play,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Terminal,
  Smartphone,
  Eye,
  Search,
  Filter,
  FileSpreadsheet
} from 'lucide-react';
import { TestRun, TestResult, Device, LogcatEntry } from '../types';

interface TestExecutionProps {
  testRun: TestRun;
  testResults: TestResult[];
  devices: Device[];
  running: boolean;
  onStartExecution: () => void;
  onStopExecution: () => void;
  logcatEntries: LogcatEntry[];
  currentRunningIndex: number;
}

export const TestExecution: React.FC<TestExecutionProps> = ({
  testRun,
  testResults,
  devices,
  running,
  onStartExecution,
  onStopExecution,
  logcatEntries,
  currentRunningIndex
}) => {
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(testResults[2] || testResults[0] || null);
  const [logFilter, setLogFilter] = useState<string>('');
  const [logLevelFilter, setLogLevelFilter] = useState<string>('ALL');

  const filteredLogs = logcatEntries.filter(entry => {
    const matchesText = !logFilter || 
      entry.message.toLowerCase().includes(logFilter.toLowerCase()) || 
      entry.tag.toLowerCase().includes(logFilter.toLowerCase());
    const matchesLevel = logLevelFilter === 'ALL' || entry.level === logLevelFilter;
    return matchesText && matchesLevel;
  });

  const progressPercent = testRun.totalCount > 0 
    ? Math.round(((testRun.passedCount + testRun.failedCount) / testRun.totalCount) * 100) 
    : 0;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Engine Controls Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-blue-600" />
              <span>Automated Test Execution Pipeline (M3/M4)</span>
            </h2>
            <span className={`text-xs px-2.5 py-0.5 rounded-md font-mono font-semibold ${
              running ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {running ? 'ENGINE RUNNING' : 'STANDBY READY'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time Appium UiAutomator2 multi-device execution pipeline with parallel logcat ingestion.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {running ? (
            <button
              onClick={onStopExecution}
              className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-all cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Abort Execution</span>
            </button>
          ) : (
            <button
              onClick={onStartExecution}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Suite #{testRun.runNumber + 1}</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress & Live Run Stats */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900">Execution Progress:</span>
            <span className="font-mono text-blue-600 font-semibold">{testRun.passedCount + testRun.failedCount} / {testRun.totalCount} Scenarios Completed</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{testRun.passedCount} Passed</span>
            <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-100">{testRun.failedCount} Failed</span>
            <span className="text-slate-600 font-bold">{progressPercent}%</span>
          </div>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
          <div
            className={`h-full transition-all duration-500 ${
              testRun.failedCount > 0 ? 'bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500' : 'bg-blue-600'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Split View: Live Matrix Test Results & Inspection Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Results Matrix Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-xs">
          <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 font-mono">
              Test Scenario Evaluation Register ({testResults.length})
            </h3>
            <span className="text-[11px] text-slate-500">Select scenario for stack trace & screenshot</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-100 uppercase text-[10px] font-semibold tracking-wider bg-slate-50/40">
                <tr>
                  <th className="p-3">Scenario</th>
                  <th className="p-3">Target Device</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Latency</th>
                  <th className="p-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {testResults.map((result, idx) => {
                  const isSelected = selectedResult?.id === result.id;
                  const isCurrentRunning = running && currentRunningIndex === idx;
                  return (
                    <tr
                      key={result.id}
                      onClick={() => setSelectedResult(result)}
                      className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50/60' : ''
                      } ${isCurrentRunning ? 'animate-pulse bg-amber-50' : ''}`}
                    >
                      <td className="p-3 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          {result.status === 'passed' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                          {result.status === 'failed' && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                          {result.status === 'blocked' && <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />}
                          <span className="truncate max-w-[200px]">{result.testCaseName}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block pl-6">{result.category}</span>
                      </td>

                      <td className="p-3 font-mono">
                        <span className="text-slate-800 font-medium">{result.deviceName}</span>
                        <span className="text-slate-400 block text-[10px]">{result.androidVersion}</span>
                      </td>

                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                          result.status === 'passed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          result.status === 'failed' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {result.status.toUpperCase()}
                        </span>
                      </td>

                      <td className="p-3 font-mono text-slate-500">
                        {(result.durationMs / 1000).toFixed(2)}s
                      </td>

                      <td className="p-3 text-right text-blue-600 font-medium text-[11px]">
                        Inspect →
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Result Inspector Pane */}
        {selectedResult && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                  selectedResult.status === 'passed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {selectedResult.status.toUpperCase()}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">{selectedResult.testCaseName}</h3>
              </div>
            </div>

            <div className="text-xs space-y-2 text-slate-600">
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Target Device:</span>
                <span className="font-mono text-slate-800 font-medium">{selectedResult.deviceName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">OS Version:</span>
                <span className="font-mono text-slate-800 font-medium">{selectedResult.androidVersion}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Duration:</span>
                <span className="font-mono text-slate-800 font-medium">{(selectedResult.durationMs / 1000).toFixed(2)}s</span>
              </div>
            </div>

            {/* Error & Stack Trace */}
            {selectedResult.errorMessage && (
              <div className="space-y-2 text-xs">
                <span className="font-bold text-rose-600 font-mono uppercase text-[10px]">Error Diagnostic</span>
                <p className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 font-mono text-[11px] leading-relaxed">
                  {selectedResult.errorMessage}
                </p>
              </div>
            )}

            {selectedResult.stackTrace && (
              <div className="space-y-1 text-xs">
                <span className="font-bold text-slate-500 font-mono uppercase text-[10px]">Appium Stack Trace</span>
                <pre className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[10px] overflow-x-auto max-h-32 custom-scrollbar whitespace-pre-wrap">
                  {selectedResult.stackTrace}
                </pre>
              </div>
            )}

            {/* Screenshot on Failure */}
            {selectedResult.screenshotUrl && (
              <div className="space-y-1.5">
                <span className="font-bold text-slate-600 font-mono uppercase text-[10px] flex items-center gap-1">
                  <Eye className="w-3 h-3 text-blue-600" />
                  <span>Captured Screen Buffer</span>
                </span>
                <div className="relative rounded-lg overflow-hidden border border-slate-200 max-h-48 bg-slate-100">
                  <img
                    src={selectedResult.screenshotUrl}
                    alt="Failure Screen"
                    className="w-full h-44 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[9px] font-mono px-2 py-0.5 rounded">
                    Auto-Captured on Exception
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Live Logcat Stream Terminal */}
      <div className="bg-[#1E293B] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-[#0F172A] px-4 py-3 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span>Live ADB Logcat Stream (adb logcat -v time)</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
              <input
                type="text"
                value={logFilter}
                onChange={(e) => setLogFilter(e.target.value)}
                placeholder="Filter logs (e.g. FATAL, View)..."
                className="bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-2.5 py-1 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500 w-48"
              />
            </div>

            <select
              value={logLevelFilter}
              onChange={(e) => setLogLevelFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 font-mono focus:outline-none"
            >
              <option value="ALL">All Levels</option>
              <option value="E">Errors (E)</option>
              <option value="W">Warnings (W)</option>
              <option value="I">Info (I)</option>
              <option value="D">Debug (D)</option>
            </select>
          </div>
        </div>

        <div className="p-4">
          <div className="font-mono text-xs bg-slate-950/90 p-4 rounded-lg h-56 overflow-y-auto custom-scrollbar space-y-1">
            {filteredLogs.map((entry) => (
              <div
                key={entry.id}
                className={`leading-relaxed ${
                  entry.level === 'E' ? 'text-rose-400 font-semibold' :
                  entry.level === 'W' ? 'text-amber-400' :
                  entry.level === 'I' ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                <span className="text-slate-500">[{entry.timestamp}]</span>{' '}
                <span className="px-1 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300">
                  {entry.level}/{entry.tag}
                </span>{' '}
                <span>{entry.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
