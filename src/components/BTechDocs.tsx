import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  FileText,
  Database,
  Layers,
  Code,
  CheckCircle2,
  Copy,
  Check,
  Award,
  HelpCircle,
  Download,
  Share2
} from 'lucide-react';
import { BTECH_DOCUMENTATION } from '../data/btechDocumentation';

export const BTechDocs: React.FC = () => {
  const [activeChapter, setActiveChapter] = useState<string>('abstract');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const navItems = [
    { id: 'abstract', label: 'Abstract & Project Identity' },
    { id: 'ch1', label: '1. Introduction & Objectives' },
    { id: 'ch2', label: '2. Literature Review & Benchmark' },
    { id: 'ch3', label: '3. System Requirements & SRS' },
    { id: 'ch4', label: '4. System Architecture & DB Schema' },
    { id: 'ch5', label: '5. Implementation & Algorithms' },
    { id: 'ch6', label: '6. Experimental Results & Metrics' },
    { id: 'ch7', label: '7. Conclusion & Future Roadmap' },
    { id: 'viva', label: '8. Viva Examination Q&A Defense' },
    { id: 'sql', label: 'Appendix A: SQLite DDL Schema' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <span>B.Tech Final-Year Thesis Documentation & Viva Defense Guide</span>
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono font-medium border border-blue-100">
              Academic Project Complete Specification
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            "MobileTest Guardian: A Comprehensive Automated Mobile Application Quality Assessment and Compatibility Testing Framework"
          </p>
        </div>

        <button
          onClick={() => {
            const allText = Object.values(BTECH_DOCUMENTATION).map(ch => `${ch.title}\n\n${ch.content}`).join('\n\n====================\n\n');
            const blob = new Blob([allText], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `BTech_Thesis_MobileTest_Guardian.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-2xs transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Thesis (Markdown)</span>
        </button>
      </div>

      {/* Main Grid: Chapter Navigation & Reading Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1.5 h-fit shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 font-mono uppercase px-3 pb-2 block border-b border-slate-200">
            Thesis Chapters
          </span>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveChapter(item.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                activeChapter === item.id
                  ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Chapter Content Renderer */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-8 space-y-6 shadow-xs">
          {/* Render Active Chapter */}
          {activeChapter === 'abstract' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-xs font-mono text-blue-600 uppercase font-bold">Project Abstract</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{BTECH_DOCUMENTATION.abstract.title}</h3>
              </div>
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans space-y-4">
                {BTECH_DOCUMENTATION.abstract.content}
              </div>
            </div>
          )}

          {activeChapter === 'ch1' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-xs font-mono text-blue-600 uppercase font-bold">Chapter 1</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{BTECH_DOCUMENTATION.chapter1.title}</h3>
              </div>
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans space-y-4">
                {BTECH_DOCUMENTATION.chapter1.content}
              </div>
            </div>
          )}

          {activeChapter === 'ch2' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-xs font-mono text-blue-600 uppercase font-bold">Chapter 2</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{BTECH_DOCUMENTATION.chapter2.title}</h3>
              </div>
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans space-y-4">
                {BTECH_DOCUMENTATION.chapter2.content}
              </div>
            </div>
          )}

          {activeChapter === 'ch3' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-xs font-mono text-blue-600 uppercase font-bold">Chapter 3</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{BTECH_DOCUMENTATION.chapter3.title}</h3>
              </div>
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans space-y-4">
                {BTECH_DOCUMENTATION.chapter3.content}
              </div>
            </div>
          )}

          {activeChapter === 'ch4' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-xs font-mono text-blue-600 uppercase font-bold">Chapter 4</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{BTECH_DOCUMENTATION.chapter4.title}</h3>
              </div>
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans space-y-4">
                {BTECH_DOCUMENTATION.chapter4.content}
              </div>
            </div>
          )}

          {activeChapter === 'ch5' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-xs font-mono text-blue-600 uppercase font-bold">Chapter 5</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{BTECH_DOCUMENTATION.chapter5.title}</h3>
              </div>
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans space-y-4">
                {BTECH_DOCUMENTATION.chapter5.content}
              </div>
            </div>
          )}

          {activeChapter === 'ch6' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-xs font-mono text-blue-600 uppercase font-bold">Chapter 6</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{BTECH_DOCUMENTATION.chapter6.title}</h3>
              </div>
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans space-y-4">
                {BTECH_DOCUMENTATION.chapter6.content}
              </div>
            </div>
          )}

          {activeChapter === 'ch7' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-xs font-mono text-blue-600 uppercase font-bold">Chapter 7</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{BTECH_DOCUMENTATION.chapter7.title}</h3>
              </div>
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans space-y-4">
                {BTECH_DOCUMENTATION.chapter7.content}
              </div>
            </div>
          )}

          {activeChapter === 'viva' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-xs font-mono text-blue-600 uppercase font-bold">Viva Examination Defense</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{BTECH_DOCUMENTATION.vivaDefense.title}</h3>
              </div>
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans space-y-4">
                {BTECH_DOCUMENTATION.vivaDefense.content}
              </div>
            </div>
          )}

          {activeChapter === 'sql' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-blue-600 uppercase font-bold">Database Architecture</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">SQLite Production DDL Schema</h3>
                </div>
                <button
                  onClick={() => handleCopy(BTECH_DOCUMENTATION.sqliteSchema, 'sql')}
                  className="flex items-center gap-1.5 text-xs bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg font-mono border border-slate-200 shadow-2xs cursor-pointer"
                >
                  {copiedSection === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copiedSection === 'sql' ? 'Copied' : 'Copy SQL'}</span>
                </button>
              </div>
              <pre className="bg-[#1E293B] p-5 rounded-2xl border border-slate-700 text-xs font-mono text-emerald-300 overflow-x-auto max-h-[600px] custom-scrollbar leading-relaxed whitespace-pre-wrap">
                {BTECH_DOCUMENTATION.sqliteSchema}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
