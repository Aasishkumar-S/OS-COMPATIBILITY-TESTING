import React, { useState } from 'react';
import {
  FolderTree,
  FileCode,
  Download,
  Copy,
  Check,
  Terminal,
  Play,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { PYTHON_PROJECT_FILES } from '../data/pythonCodebase';

export const PythonProjectExporter: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>('main.py');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [downloadingZip, setDownloadingZip] = useState<boolean>(false);

  const currentFileContent = PYTHON_PROJECT_FILES[selectedFile] || '';

  const handleCopyCode = (filename: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleDownloadSingleFile = (filename: string, code: string) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.split('/').pop() || filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllAsProject = () => {
    setDownloadingZip(true);
    // Bundle all files into a consolidated Python project script and README
    const consolidated = Object.entries(PYTHON_PROJECT_FILES).map(([filename, content]) => {
      return `################################################################################\n# FILE: ${filename}\n################################################################################\n\n${content}`;
    }).join('\n\n\n');

    const blob = new Blob([consolidated], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MobileTestGuardian_Python_Source_Bundle.py`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => setDownloadingZip(false), 1500);
  };

  const fileGroups = {
    'Project Root': ['main.py', 'requirements.txt', 'README.md'],
    'GUI Layer (PyQt6)': ['gui/main_window.py'],
    'Core Automation Engines': [
      'core/apk_analyzer.py',
      'core/device_manager.py',
      'core/test_engine.py',
      'core/visual_comparator.py',
      'core/crash_monitor.py',
      'core/performance_profiler.py'
    ],
    'Database & Reports': [
      'database/db_manager.py',
      'reports/pdf_generator.py'
    ]
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-blue-600" />
              <span>Runnable Python + PyQt6 Desktop Source Code Tree</span>
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono font-medium border border-emerald-200">
              Desktop Codebase
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete, structured, and modular Python implementation utilizing PyQt6, Appium-Python-Client, OpenCV, ReportLab, and SQLite.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadAllAsProject}
            disabled={downloadingZip}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-2xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{downloadingZip ? 'Bundling Source...' : 'Export Complete Python Project'}</span>
          </button>
        </div>
      </div>

      {/* Quick Setup & Run Instructions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
            How to Run Locally on Your PC / Laptop (PyQt6 Desktop Mode)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-mono">
            <span className="text-slate-500 block text-[10px] font-semibold">STEP 1: CLONE & VENV</span>
            <span className="text-emerald-700 font-bold block mt-1">python -m venv venv</span>
            <span className="text-slate-500 text-[10px]">source venv/bin/activate (or .\venv\Scripts\activate)</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-mono">
            <span className="text-slate-500 block text-[10px] font-semibold">STEP 2: INSTALL DEPENDENCIES</span>
            <span className="text-emerald-700 font-bold block mt-1">pip install -r requirements.txt</span>
            <span className="text-slate-500 text-[10px]">Installs PyQt6, Appium, OpenCV, ReportLab</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-mono">
            <span className="text-slate-500 block text-[10px] font-semibold">STEP 3: LAUNCH GUI</span>
            <span className="text-emerald-700 font-bold block mt-1">python main.py</span>
            <span className="text-slate-500 text-[10px]">Starts native dark-themed PyQt6 window</span>
          </div>
        </div>
      </div>

      {/* File Explorer & Code Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Directory Structure */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 h-fit shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 font-mono uppercase px-2 block">
            Project Files ({Object.keys(PYTHON_PROJECT_FILES).length})
          </span>

          {Object.entries(fileGroups).map(([groupName, files]) => (
            <div key={groupName} className="space-y-1">
              <span className="text-[10px] font-mono text-blue-700 font-semibold px-2 uppercase block">
                {groupName}
              </span>
              <div className="space-y-0.5">
                {files.map((file) => {
                  const isSelected = selectedFile === file;
                  return (
                    <button
                      key={file}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <FileCode className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{file.split('/').pop()}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Code Canvas View */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-xs">
          <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-blue-600" />
              <span className="font-mono text-xs font-bold text-slate-900">{selectedFile}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyCode(selectedFile, currentFileContent)}
                className="flex items-center gap-1 text-xs bg-white hover:bg-slate-50 text-slate-700 px-3 py-1 rounded-lg font-mono border border-slate-200 transition-colors shadow-2xs cursor-pointer"
              >
                {copiedFile === selectedFile ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copiedFile === selectedFile ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={() => handleDownloadSingleFile(selectedFile, currentFileContent)}
                className="flex items-center gap-1 text-xs bg-white hover:bg-slate-50 text-slate-700 px-3 py-1 rounded-lg font-mono border border-slate-200 transition-colors shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Save</span>
              </button>
            </div>
          </div>

          <pre className="p-5 bg-[#1E293B] font-mono text-xs text-slate-200 overflow-x-auto max-h-[640px] custom-scrollbar leading-relaxed">
            {currentFileContent}
          </pre>
        </div>
      </div>
    </div>
  );
};
