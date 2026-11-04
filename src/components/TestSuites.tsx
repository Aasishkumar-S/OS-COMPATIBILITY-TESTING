import React, { useState } from 'react';
import {
  ListTree,
  Plus,
  Play,
  CheckCircle2,
  Clock,
  Tag,
  ChevronRight,
  Filter,
  CheckSquare,
  Square,
  Code
} from 'lucide-react';
import { TestCase, TestStep } from '../types';

interface TestSuitesProps {
  testCases: TestCase[];
  onToggleTestCase: (id: string) => void;
  onSelectAllTestCases: (select: boolean) => void;
  onAddTestCase: (tc: TestCase) => void;
  onLaunchSingleTest: (tc: TestCase) => void;
}

export const TestSuites: React.FC<TestSuitesProps> = ({
  testCases,
  onToggleTestCase,
  onSelectAllTestCases,
  onAddTestCase,
  onLaunchSingleTest
}) => {
  const [selectedCase, setSelectedCase] = useState<TestCase | null>(testCases[0] || null);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New test case state
  const [newCode, setNewCode] = useState<string>('TC_CUSTOM_007');
  const [newName, setNewName] = useState<string>('Custom Checkout Promo Code Validation');
  const [newCategory, setNewCategory] = useState<any>('Functional');
  const [newDesc, setNewDesc] = useState<string>('Verify that invalid promo codes trigger inline warning message.');

  const categories = ['ALL', 'Functional', 'UI Validation', 'Crash & Resilience', 'Performance', 'Network', 'Compatibility'];

  const filteredCases = categoryFilter === 'ALL'
    ? testCases
    : testCases.filter(tc => tc.category === categoryFilter);

  const allSelected = testCases.every(tc => tc.enabled);

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    const created: TestCase = {
      id: `tc-${Date.now()}`,
      code: newCode,
      name: newName,
      category: newCategory,
      description: newDesc,
      steps: [
        { stepNumber: 1, action: 'Open screen', target: 'CartCheckoutActivity', expected: 'Screen displayed' },
        { stepNumber: 2, action: 'Type text', target: 'input_coupon_code', value: 'FAKE99', expected: 'Field populated' },
        { stepNumber: 3, action: 'Click button', target: 'btn_apply_coupon', expected: 'Error toast "Coupon Invalid"' }
      ],
      expectedResult: 'Inline banner indicates coupon is expired or invalid.',
      timeoutSeconds: 20,
      enabled: true,
      priority: 'P1'
    };
    onAddTestCase(created);
    setSelectedCase(created);
    setShowAddModal(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ListTree className="w-5 h-5 text-blue-600" />
              <span>Automated Test Scenario Library (M3)</span>
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono font-medium border border-blue-100">
              Appium / UiAutomator2
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Declarative test workflows covering Authentication, UI Viewport, Exception Resilience, and Memory Profiling.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Scenario</span>
        </button>
      </div>

      {/* Category Pills & Select All */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => onSelectAllTestCases(!allSelected)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
        >
          {allSelected ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-slate-400" />}
          <span>Toggle All ({testCases.filter(t => t.enabled).length}/{testCases.length} Active)</span>
        </button>
      </div>

      {/* Main Split View: Test List & Step Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario List */}
        <div className="space-y-3">
          {filteredCases.map((tc) => {
            const isSelected = selectedCase?.id === tc.id;
            return (
              <div
                key={tc.id}
                onClick={() => setSelectedCase(tc)}
                className={`bg-white border p-4 rounded-xl cursor-pointer transition-all shadow-xs ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/20 ring-1 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={tc.enabled}
                      onChange={(e) => {
                        e.stopPropagation();
                        onToggleTestCase(tc.id);
                      }}
                      className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs font-bold font-mono text-blue-600">{tc.code}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-bold ${
                    tc.priority === 'P0' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tc.priority}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 mt-2 leading-relaxed">{tc.name}</h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{tc.description}</p>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
                  <span>{tc.steps.length} Steps</span>
                  <span className="text-slate-600 font-medium">{tc.category}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Scenario Details & Step Sequence */}
        {selectedCase && (
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-600">{selectedCase.code}</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono font-medium">
                    {selectedCase.category}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-mono font-bold">
                    {selectedCase.priority}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedCase.name}</h3>
              </div>

              <button
                onClick={() => onLaunchSingleTest(selectedCase)}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md shadow-emerald-500/20 cursor-pointer transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Scenario</span>
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                Objective & Preconditions
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                {selectedCase.description}
              </p>
            </div>

            {/* Step Sequence Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                Appium Execution Steps ({selectedCase.steps.length})
              </h4>
              <div className="space-y-2">
                {selectedCase.steps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-start gap-3 text-xs"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold font-mono flex items-center justify-center shrink-0 text-[11px]">
                      {step.stepNumber}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-200/80 text-slate-700 font-mono text-[10px] rounded font-medium">
                          {step.action.toUpperCase()}
                        </span>
                        <span className="font-mono text-blue-700 font-semibold">{step.target}</span>
                        {step.value && (
                          <span className="text-[11px] text-teal-700 font-mono font-medium">"{step.value}"</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Expected: <strong className="text-slate-800">{step.expected}</strong>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Result */}
            <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 space-y-1 text-xs">
              <span className="font-bold text-blue-800 font-mono text-[10px] uppercase">Final Assertion Criteria</span>
              <p className="text-slate-800">{selectedCase.expectedResult}</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Test Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Create Automated Test Scenario</h3>
            <form onSubmit={handleCreateTest} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Scenario Code</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Scenario Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:border-blue-500 focus:outline-none"
                >
                  <option value="Functional">Functional</option>
                  <option value="UI Validation">UI Validation</option>
                  <option value="Crash & Resilience">Crash & Resilience</option>
                  <option value="Performance">Performance</option>
                  <option value="Network">Network</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg cursor-pointer shadow-xs"
                >
                  Save Scenario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
