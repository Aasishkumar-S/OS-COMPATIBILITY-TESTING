import React, { useState } from 'react';
import {
  FileCheck2,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSpreadsheet,
  FileText,
  Code,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Layers,
  Sparkles,
  Printer
} from 'lucide-react';
import { QualityScore, Recommendation, ApkMetadata, TestRun, Device, Defect } from '../types';
import { generateMarkdownReport, generateJsonReport, generatePdfReport, generateExcelReport } from '../services/reportGenerator';

interface ReportGeneratorProps {
  apk: ApkMetadata;
  testRun: TestRun;
  qualityScore: QualityScore;
  recommendations: Recommendation[];
  devices: Device[];
  defects: Defect[];
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  apk,
  testRun,
  qualityScore,
  recommendations,
  devices,
  defects
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownload = (format: 'pdf' | 'excel' | 'markdown' | 'json') => {
    const payload = { apk, testRun, qualityScore, recommendations, devices, defects };

    if (format === 'pdf') {
      generatePdfReport(payload);
      setDownloadSuccess('pdf');
      setTimeout(() => setDownloadSuccess(null), 3000);
      return;
    }

    if (format === 'excel') {
      generateExcelReport(payload);
      setDownloadSuccess('excel');
      setTimeout(() => setDownloadSuccess(null), 3000);
      return;
    }

    let content = '';
    let filename = `MobileTestGuardian_Report_${apk.packageName}_v${apk.versionName}.${format === 'markdown' ? 'md' : format}`;
    let mimeType = 'text/plain';

    if (format === 'markdown') {
      content = generateMarkdownReport(payload);
      mimeType = 'text/markdown';
    } else if (format === 'json') {
      content = generateJsonReport(payload);
      mimeType = 'application/json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(format);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case 'PASS_FOR_PRODUCTION':
        return 'bg-emerald-50 text-emerald-900 border-emerald-200';
      case 'MODERATE_RISK':
        return 'bg-amber-50 text-amber-900 border-amber-200';
      case 'CRITICAL_BLOCKER':
      default:
        return 'bg-rose-50 text-rose-900 border-rose-200';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto print:p-0 print:bg-white print:text-black">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-blue-600" />
              <span>Quality Assessment & Audit Exporter (M10 & M11)</span>
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono font-medium border border-blue-100">
              Final Certification
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Mathematical aggregation of test pass rates, crash frequency, and visual regression into an audit report.
          </p>
        </div>

        {/* Action Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleDownload('pdf')}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-2xs transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
          <button
            onClick={() => handleDownload('excel')}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-2xs transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>CSV / Excel</span>
          </button>
          <button
            onClick={() => handleDownload('markdown')}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-lg border border-slate-200 shadow-2xs transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Markdown</span>
          </button>
          <button
            onClick={() => handleDownload('json')}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-lg border border-slate-200 shadow-2xs transition-all cursor-pointer"
          >
            <Code className="w-3.5 h-3.5 text-slate-500" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center gap-2 text-xs text-emerald-800 print:hidden">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Report successfully exported in {downloadSuccess.toUpperCase()} format!</span>
        </div>
      )}

      {/* Release Decision Verdict Banner */}
      <div className={`p-6 rounded-2xl border ${getVerdictStyle(qualityScore.releaseVerdict)} flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              {qualityScore.releaseVerdict === 'CRITICAL_BLOCKER' && 'RELEASE BLOCKED — CRITICAL COMPATIBILITY DEFECTS'}
              {qualityScore.releaseVerdict === 'MODERATE_RISK' && 'PROCEED WITH CAUTION — MODERATE RISK DETECTED'}
              {qualityScore.releaseVerdict === 'PASS_FOR_PRODUCTION' && 'CERTIFIED READY FOR GOOGLE PLAY STORE RELEASE'}
            </h3>
          </div>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            {qualityScore.verdictDescription}
          </p>
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <div className="text-center">
            <span className="text-[11px] uppercase font-mono text-slate-500 font-semibold block">Overall Quality Score</span>
            <span className="text-3xl font-black font-mono text-slate-900">{qualityScore.overallScore}/100</span>
          </div>
          <div className="text-center border-l border-slate-200 pl-6">
            <span className="text-[11px] uppercase font-mono text-slate-500 font-semibold block">Risk Index</span>
            <span className="text-3xl font-black font-mono text-rose-600">{qualityScore.riskScore}/100</span>
          </div>
        </div>
      </div>

      {/* Multi-Dimensional Score Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 text-center shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium block">Test Pass Rate (30%)</span>
          <h4 className="text-xl font-bold text-slate-900 font-mono">{qualityScore.subScores.testPassRateScore}/100</h4>
          <span className="text-[10px] text-emerald-600 font-mono font-medium">75% Scenario Success</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 text-center shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium block">Crash Free Rate (25%)</span>
          <h4 className="text-xl font-bold text-rose-600 font-mono">{qualityScore.subScores.crashFreeScore}/100</h4>
          <span className="text-[10px] text-rose-600 font-mono font-medium">1 Crash Recorded</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 text-center shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium block">UI Validation (15%)</span>
          <h4 className="text-xl font-bold text-amber-600 font-mono">{qualityScore.subScores.uiValidationScore}/100</h4>
          <span className="text-[10px] text-amber-600 font-mono font-medium">1 Bounding Overflow</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 text-center shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium block">Process Performance (15%)</span>
          <h4 className="text-xl font-bold text-emerald-600 font-mono">{qualityScore.subScores.performanceScore}/100</h4>
          <span className="text-[10px] text-emerald-600 font-mono font-medium">Low Memory Leakage</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 text-center shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium block">Device Matrix (15%)</span>
          <h4 className="text-xl font-bold text-blue-600 font-mono">{qualityScore.subScores.deviceCompatibilityScore}/100</h4>
          <span className="text-[10px] text-slate-500 font-mono font-medium">4 Target Form Factors</span>
        </div>
      </div>

      {/* Actionable Engineering Recommendations */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Automated Engineering Recommendations ({recommendations.length})</span>
        </h3>

        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                    rec.priority === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    rec.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {rec.priority.toUpperCase()} PRIORITY
                  </span>
                  <span className="font-bold text-slate-900">{rec.title}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{rec.category}</span>
              </div>

              <p className="text-slate-700 leading-relaxed">{rec.details}</p>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 font-mono shadow-2xs">
                <span className="text-emerald-700 font-bold">Action Item: </span>
                <span>{rec.actionItem}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comprehensive Test Matrix Summary Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 font-mono">
          Final Cross-Device Compatibility Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-500 border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="p-3 font-semibold">Hardware Model</th>
                <th className="p-3 font-semibold">OS Level</th>
                <th className="p-3 font-semibold">Resolution / DPI</th>
                <th className="p-3 font-semibold">Functional Tests</th>
                <th className="p-3 font-semibold">Visual Diff</th>
                <th className="p-3 font-semibold text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {devices.map((dev) => (
                <tr key={dev.id} className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">
                    {dev.name}
                    {dev.isEmulator && <span className="ml-2 text-[10px] text-blue-700 font-mono bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">(AVD)</span>}
                  </td>
                  <td className="p-3 font-mono">Android {dev.androidVersion} (API {dev.apiLevel})</td>
                  <td className="p-3 font-mono text-slate-500">{dev.resolution} ({dev.densityDpi} dpi)</td>
                  <td className="p-3 font-mono text-emerald-700 font-medium">
                    {dev.id === 'dev-4' ? <span className="text-rose-600 font-medium">1 Fail (Overflow)</span> : dev.id === 'dev-3' ? <span className="text-rose-600 font-medium">1 Fail (Crash)</span> : '100% Pass'}
                  </td>
                  <td className="p-3 font-mono">
                    {dev.id === 'dev-4' ? <span className="text-rose-600 font-bold">14.8% (Shift)</span> :
                     dev.id === 'dev-3' ? <span className="text-amber-600 font-bold">3.4% (Shift)</span> :
                     <span className="text-emerald-600 font-medium">0.8% (Match)</span>}
                  </td>
                  <td className="p-3 text-right">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                      dev.id === 'dev-1' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      dev.id === 'dev-2' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {dev.id === 'dev-1' || dev.id === 'dev-2' ? 'COMPATIBLE' : 'DEFECTS FOUND'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
