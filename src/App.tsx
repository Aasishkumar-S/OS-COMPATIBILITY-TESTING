import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ActiveTab,
  ApkMetadata,
  Device,
  TestCase,
  TestRun,
  TestResult,
  CrashReport,
  PerformanceSnapshot,
  UiIssue,
  ScreenshotComparison,
  Defect,
  LogcatEntry
} from './types';
import { SAMPLE_APKS } from './data/sampleApks';
import { INITIAL_DEVICES } from './data/mockData';
import { calculateQualityScore } from './services/scoringEngine';
import { generateRecommendations } from './services/recommendationEngine';
import { parseApkFile } from './services/apkParser';
import { buildTestingStateForApk } from './services/apkTestSuiteGenerator';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ApkAnalyzer } from './components/ApkAnalyzer';
import { LiveAppSimulator } from './components/LiveAppSimulator';
import { DeviceManager } from './components/DeviceManager';
import { TestSuites } from './components/TestSuites';
import { TestExecution } from './components/TestExecution';
import { UiValidator } from './components/UiValidator';
import { VisualRegression } from './components/VisualRegression';
import { CrashAnalyzer } from './components/CrashAnalyzer';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import { DefectTracker } from './components/DefectTracker';
import { ReportGenerator } from './components/ReportGenerator';
import { PythonProjectExporter } from './components/PythonProjectExporter';
import { BTechDocs } from './components/BTechDocs';

export default function App() {
  // Navigation & Core States
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [allApks, setAllApks] = useState<ApkMetadata[]>(SAMPLE_APKS);
  const [currentApk, setCurrentApk] = useState<ApkMetadata>(SAMPLE_APKS[0]);
  const [isStressMode, setIsStressMode] = useState<boolean>(false);

  // APK Parsing UI state
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [parsingProgress, setParsingProgress] = useState<string>('');

  // Matrix Entities
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);

  // Initialize dynamic testing state for the first APK in clean mode
  const initialTestingState = useMemo(() => {
    return buildTestingStateForApk(SAMPLE_APKS[0], INITIAL_DEVICES, false);
  }, []);

  const [testCases, setTestCases] = useState<TestCase[]>(initialTestingState.testCases);
  const [testRun, setTestRun] = useState<TestRun>(initialTestingState.testRun);
  const [testResults, setTestResults] = useState<TestResult[]>(initialTestingState.testResults);
  const [crashes, setCrashes] = useState<CrashReport[]>(initialTestingState.crashes);
  const [metrics, setMetrics] = useState<PerformanceSnapshot[]>(initialTestingState.metrics);
  const [uiIssues, setUiIssues] = useState<UiIssue[]>(initialTestingState.uiIssues);
  const [comparisons, setComparisons] = useState<ScreenshotComparison[]>(initialTestingState.comparisons);
  const [defects, setDefects] = useState<Defect[]>(initialTestingState.defects);
  const [logcatEntries, setLogcatEntries] = useState<LogcatEntry[]>(initialTestingState.logcatEntries);

  // Execution Engine Automation State
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [currentRunningIndex, setCurrentRunningIndex] = useState<number>(0);

  // Function to dynamically switch/generate testing state for any APK
  const applyApkTestingState = useCallback((targetApk: ApkMetadata, currentDevices: Device[] = devices, stress: boolean = isStressMode) => {
    const newState = buildTestingStateForApk(targetApk, currentDevices, stress);
    setTestCases(newState.testCases);
    setTestResults(newState.testResults);
    setCrashes(newState.crashes);
    setUiIssues(newState.uiIssues);
    setComparisons(newState.comparisons);
    setMetrics(newState.metrics);
    setDefects(newState.defects);
    setLogcatEntries(newState.logcatEntries);
    setTestRun(newState.testRun);
  }, [devices, isStressMode]);

  // Handler to select any sample/uploaded APK
  const handleSelectApk = (apk: ApkMetadata) => {
    setCurrentApk(apk);
    applyApkTestingState(apk, devices, isStressMode);
  };

  // Dynamic Real-time Calculations
  const qualityScore = useMemo(() => {
    return calculateQualityScore(
      testResults,
      crashes,
      uiIssues,
      metrics,
      devices,
      comparisons
    );
  }, [testResults, crashes, uiIssues, metrics, devices, comparisons]);

  const recommendations = useMemo(() => {
    return generateRecommendations(defects, crashes, comparisons, testResults, qualityScore);
  }, [defects, crashes, comparisons, testResults, qualityScore]);

  // Device Management Handlers
  const handleToggleDeviceSelect = (deviceId: string) => {
    setDevices(prev => {
      const updated = prev.map(d => d.id === deviceId ? { ...d, selectedForTest: !d.selectedForTest } : d);
      return updated;
    });
  };

  const handleSelectAllDevices = (select: boolean) => {
    setDevices(prev => prev.map(d => ({ ...d, selectedForTest: select })));
  };

  const handleRefreshDevices = () => {
    setDevices(prev => [...prev]);
  };

  const handleAddNewVirtualDevice = (dev: Partial<Device>) => {
    const newDev: Device = {
      id: dev.id || `dev-${Date.now()}`,
      name: dev.name || 'Custom Virtual Runner',
      model: dev.model || 'Virtual_Instance_Node',
      manufacturer: dev.manufacturer || 'Cloud AVD',
      osFamily: dev.osFamily || 'android',
      osVersion: dev.osVersion || `Android ${dev.androidVersion || '14.0'}`,
      androidVersion: dev.androidVersion || '14.0',
      apiLevel: dev.apiLevel || 34,
      architecture: dev.architecture || 'arm64-v8a',
      resolution: dev.resolution || '1080 x 2400',
      densityDpi: dev.densityDpi || 420,
      cpuInfo: dev.cpuInfo || 'Virtual Octa-core CPU',
      ramGb: dev.ramGb || 8,
      availableStorageGb: dev.availableStorageGb || 64,
      batteryLevel: 100,
      status: 'ready',
      isEmulator: true,
      selectedForTest: true,
      serialNumber: dev.serialNumber || `emulator-${Math.floor(5554 + Math.random() * 20)}`
    };
    setDevices(prev => [...prev, newDev]);
  };

  // Test Suites Handlers
  const handleToggleTestCase = (id: string) => {
    setTestCases(prev => prev.map(tc => tc.id === id ? { ...tc, enabled: !tc.enabled } : tc));
  };

  const handleSelectAllTestCases = (select: boolean) => {
    setTestCases(prev => prev.map(tc => ({ ...tc, enabled: select })));
  };

  const handleAddTestCase = (newCase: TestCase) => {
    setTestCases(prev => [...prev, newCase]);
  };

  // Execution Handlers
  const handleStartExecution = () => {
    const activeTests = testCases.filter(t => t.enabled);
    const activeDevs = devices.filter(d => d.selectedForTest);

    if (activeTests.length === 0 || activeDevs.length === 0) {
      alert('Please select at least 1 test case and 1 target device.');
      return;
    }

    setIsExecuting(true);
    setCurrentRunningIndex(0);

    // Set initial test run state
    setTestRun(prev => ({
      ...prev,
      runNumber: prev.runNumber + 1,
      status: 'running',
      passedCount: 0,
      failedCount: 0,
      blockedCount: 0,
      totalCount: testResults.length
    }));
  };

  const handleStopExecution = () => {
    setIsExecuting(false);
    setTestRun(prev => ({
      ...prev,
      status: 'aborted'
    }));
  };

  // Execution Step Simulator
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isExecuting && currentRunningIndex < testResults.length) {
      timer = setTimeout(() => {
        const targetRes = testResults[currentRunningIndex];
        const newLog: LogcatEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().substring(11, 19),
          pid: 3104,
          tid: 3104,
          level: targetRes.status === 'failed' ? 'E' : 'I',
          tag: targetRes.status === 'failed' ? 'AndroidRuntime' : 'UiAutomator2',
          message: targetRes.status === 'failed' 
            ? `FATAL EXCEPTION in ${targetRes.testCaseName}: ${targetRes.errorMessage}`
            : `Scenario ${targetRes.testCaseName} completed successfully on ${targetRes.deviceName}.`
        };

        setLogcatEntries(prev => [newLog, ...prev.slice(0, 100)]);

        if (targetRes.status === 'passed') {
          setTestRun(prev => ({ ...prev, passedCount: prev.passedCount + 1 }));
        } else {
          setTestRun(prev => ({ ...prev, failedCount: prev.failedCount + 1 }));
        }

        setCurrentRunningIndex(prev => prev + 1);
      }, 1200);
    } else if (isExecuting && currentRunningIndex >= testResults.length) {
      setIsExecuting(false);
      setTestRun(prev => ({ ...prev, status: 'completed' }));
    }

    return () => clearTimeout(timer);
  }, [isExecuting, currentRunningIndex, testResults]);

  // Defect Handlers
  const handleUpdateDefectStatus = (id: string, newStatus: any) => {
    setDefects(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
  };

  const handleLogDefectFromCrash = (crash: CrashReport) => {
    const newDefect: Defect = {
      id: `DEF-CRASH-${Date.now().toString().slice(-4)}`,
      category: 'Crash',
      title: `${crash.exceptionType} in ${crash.activityName.split('.').pop()}`,
      description: crash.errorMessage,
      severity: 'CRITICAL',
      status: 'Open',
      deviceId: crash.deviceId,
      deviceName: crash.deviceName,
      androidVersion: crash.androidVersion,
      testCase: 'TC_APP_RESILIENCE_005',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      reproSteps: crash.reproSteps,
      logs: crash.stackTrace,
      recommendation: `Add defensive null check or exception boundary around ${crash.activityName}.`
    };

    setDefects(prev => [newDefect, ...prev]);
    setActiveTab('defects');
  };

  const handleClearAllCrashes = () => {
    setCrashes([]);
    setDefects(prev => prev.filter(d => d.category !== 'Crash'));
  };

  const handleSimulateStressCrash = () => {
    setIsStressMode(true);
    applyApkTestingState(currentApk, devices, true);
  };

  // Upload Real Custom APK Handler with direct client-side parsing
  const handleUploadCustomApk = async (file: File) => {
    try {
      setIsParsing(true);
      setParsingProgress('Opening APK archive and reading binary headers...');

      const metadata = await parseApkFile(file, (status) => {
        setParsingProgress(status);
      });

      // Keep sample apps until user uploads an APK, then display only the user's uploaded APK(s)
      setAllApks(prev => {
        const existingCustom = prev.filter(a => a.isCustomUpload && a.fileName !== metadata.fileName);
        return [metadata, ...existingCustom];
      });
      setCurrentApk(metadata);
      setIsStressMode(false);
      applyApkTestingState(metadata, devices, false);

      setIsParsing(false);
      setActiveTab('live_simulator'); // Jump straight into Live App Sandbox to test and show the uploaded app!
    } catch (err: any) {
      console.error('Error parsing APK:', err);
      setIsParsing(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden antialiased select-none">
      {/* Structural Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        defectCount={defects.filter(d => d.status === 'Open').length}
        crashCount={crashes.length}
        uiIssueCount={uiIssues.length}
        visualDiffCount={comparisons.filter(c => c.hasRegressions).length}
        devices={devices}
        currentApk={currentApk}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F8FAFC]">
        {/* Global Context Header */}
        <Header
          currentApk={currentApk}
          devices={devices}
          activeTab={activeTab}
          isExecuting={isExecuting}
          isParsing={isParsing}
          connectedDeviceCount={devices.filter(d => d.selectedForTest).length || devices.length}
          onSelectApk={handleSelectApk}
          onUploadCustomApk={handleUploadCustomApk}
          allApks={allApks}
          onStartExecution={handleStartExecution}
          onStopTest={handleStopExecution}
          onRefreshDevices={handleRefreshDevices}
          onOpenDocs={() => setActiveTab('btech_docs')}
          onOpenPython={() => setActiveTab('python_code')}
          onOpenLiveSimulator={() => setActiveTab('live_simulator')}
          onOpenDevices={() => setActiveTab('devices')}
        />

        {/* View Routing */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] custom-scrollbar">
          {activeTab === 'dashboard' && (
            <Dashboard
              apk={currentApk}
              testRun={testRun}
              testResults={testResults}
              devices={devices}
              qualityScore={qualityScore}
              recommendations={recommendations}
              defects={defects}
              crashes={crashes}
              metrics={metrics}
              onNavigate={(tab) => setActiveTab(tab)}
              onRunAllTests={handleStartExecution}
            />
          )}

          {activeTab === 'apk_analyzer' && (
            <ApkAnalyzer
              apk={currentApk}
              onSelectSampleApk={handleSelectApk}
              allApks={allApks}
              onUploadCustomApk={handleUploadCustomApk}
              isParsing={isParsing}
              parsingProgress={parsingProgress}
              onOpenLiveSimulator={() => setActiveTab('live_simulator')}
            />
          )}

          {activeTab === 'live_simulator' && (
            <LiveAppSimulator
              apk={currentApk}
              allApks={allApks}
              devices={devices}
              onSelectApk={handleSelectApk}
              onUploadCustomApk={handleUploadCustomApk}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'devices' && (
            <DeviceManager
              devices={devices}
              onToggleDeviceSelect={handleToggleDeviceSelect}
              onSelectAllDevices={handleSelectAllDevices}
              onRefreshDevices={handleRefreshDevices}
              onAddNewVirtualDevice={handleAddNewVirtualDevice}
            />
          )}

          {activeTab === 'test_suites' && (
            <TestSuites
              testCases={testCases}
              onToggleTestCase={handleToggleTestCase}
              onSelectAllTestCases={handleSelectAllTestCases}
              onAddTestCase={handleAddTestCase}
              onLaunchSingleTest={(_tc) => {
                setActiveTab('execution');
                handleStartExecution();
              }}
            />
          )}

          {activeTab === 'execution' && (
            <TestExecution
              testRun={testRun}
              testResults={testResults}
              devices={devices}
              running={isExecuting}
              onStartExecution={handleStartExecution}
              onStopExecution={handleStopExecution}
              logcatEntries={logcatEntries}
              currentRunningIndex={currentRunningIndex}
            />
          )}

          {activeTab === 'ui_validator' && (
            <UiValidator apk={currentApk} uiIssues={uiIssues} />
          )}

          {activeTab === 'visual_regression' && (
            <VisualRegression
              apk={currentApk}
              comparisons={comparisons}
              uiIssues={uiIssues}
              devices={devices}
            />
          )}

          {activeTab === 'crashes' && (
            <CrashAnalyzer
              crashes={crashes}
              onLogDefectFromCrash={handleLogDefectFromCrash}
              onClearCrashes={handleClearAllCrashes}
              onSimulateStressCrash={handleSimulateStressCrash}
            />
          )}

          {activeTab === 'performance' && (
            <PerformanceMonitor
              metrics={metrics}
              onExportCsv={() => {
                const csv = 'Timestamp,CPU(%),Memory(MB),PSS(MB),Latency(ms),FPS,Jank\n' +
                  metrics.map(m => `${m.timestamp},${m.cpuPercentage},${m.memoryMb},${m.pssMb},${m.responseTimeMs},${m.fps},${m.jankyFrames}`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Performance_Metrics_${currentApk.packageName}.csv`;
                a.click();
              }}
            />
          )}

          {activeTab === 'defects' && (
            <DefectTracker
              defects={defects}
              onUpdateDefectStatus={handleUpdateDefectStatus}
            />
          )}

          {activeTab === 'reports' && (
            <ReportGenerator
              apk={currentApk}
              testRun={testRun}
              qualityScore={qualityScore}
              recommendations={recommendations}
              devices={devices}
              defects={defects}
            />
          )}

          {activeTab === 'python_code' && (
            <PythonProjectExporter />
          )}

          {activeTab === 'btech_docs' && (
            <BTechDocs />
          )}
        </main>

        {/* Bottom Status Bar */}
        <footer className="h-9 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-[11px] text-slate-500 font-mono shrink-0 select-none">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-slate-700 font-medium">Appium 2.5: Active</span>
            </div>
            <span className="text-slate-300">|</span>
            <span>Target: <strong className="text-slate-800 font-semibold">{currentApk.appName}</strong> ({currentApk.packageName})</span>
            <span className="text-slate-300">|</span>
            <span>ADB: 127.0.0.1:5037</span>
            <span className="text-slate-300">|</span>
            <span>Suite: {testCases.filter(t => t.enabled).length} tests active</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Quality Index: <strong className="text-slate-800 font-bold">{qualityScore.overallScore}/100</strong> ({qualityScore.grade})</span>
            <span className="text-slate-300">|</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">MobileTest Guardian</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
