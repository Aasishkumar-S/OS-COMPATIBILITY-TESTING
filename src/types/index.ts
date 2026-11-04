export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type TestStatus = 'passed' | 'failed' | 'blocked' | 'skipped';
export type RunState = 'idle' | 'running' | 'paused' | 'completed' | 'failed' | 'aborted';
export type DeviceStatus = 'ready' | 'busy' | 'offline' | 'unauthorized';

export type ActiveTab =
  | 'dashboard'
  | 'apk_analyzer'
  | 'live_simulator'
  | 'devices'
  | 'test_suites'
  | 'execution'
  | 'ui_validator'
  | 'visual_regression'
  | 'crashes'
  | 'performance'
  | 'defects'
  | 'reports'
  | 'python_code'
  | 'btech_docs';

export interface PermissionItem {
  name: string;
  isSensitive: boolean;
  category: 'Normal' | 'Dangerous' | 'Signature' | 'Special';
  description: string;
}

export interface ExtractedWidget {
  id: string;
  type: 'Toolbar' | 'TextView' | 'EditText' | 'Button' | 'ImageView' | 'RecyclerView' | 'CardView' | 'Switch' | 'CheckBox' | 'ProgressBar' | 'FloatingActionButton' | 'BottomNavigationView' | 'WebView';
  rawTag: string;
  viewId: string;
  label: string;
  hint?: string;
  secondaryText?: string;
}

export interface ExtractedLayoutScreen {
  fileName: string;
  screenTitle: string;
  activityName?: string;
  widgets: ExtractedWidget[];
}

export interface ExtractedDrawableAsset {
  path: string;
  name: string;
  dataUrl: string;
}

export interface ApkMetadata {
  id: string;
  fileName: string;
  appName: string;
  packageName: string;
  versionName: string;
  versionCode: number;
  minSdkVersion: number;
  minSdkName: string;
  targetSdkVersion: number;
  targetSdkName: string;
  apkSizeMb: number;
  md5Hash: string;
  sha256Hash: string;
  permissions: PermissionItem[];
  activities: string[];
  services: string[];
  receivers: string[];
  exportedComponentsCount: number;
  debuggable: boolean;
  permissionRiskScore: number; // 0 - 100
  securityAlerts: string[];
  isCustomUpload?: boolean;
  iconDataUrl?: string;
  extractedLayouts?: ExtractedLayoutScreen[];
  extractedStrings?: string[];
  extractedImages?: ExtractedDrawableAsset[];
  webBundleHtml?: string;
}

export type OsFamily = 'android' | 'windows' | 'linux';

export interface Device {
  id: string;
  serialNumber: string;
  name: string;
  model: string;
  manufacturer: string;
  osFamily: OsFamily;
  osVersion: string;
  skinName?: string;
  androidVersion: string;
  apiLevel: number;
  architecture?: 'arm64-v8a' | 'x86_64' | 'armeabi-v7a';
  resolution: string;
  densityDpi: number;
  ramGb: number;
  cpuInfo: string;
  batteryLevel: number;
  availableStorageGb: number;
  status: DeviceStatus;
  isEmulator: boolean;
  selectedForTest: boolean;
}

export interface TestStep {
  stepNumber: number;
  action: string;
  target: string;
  value?: string;
  expected: string;
}

export interface TestCase {
  id: string;
  code: string;
  name: string;
  category: 'Functional' | 'UI Validation' | 'Performance' | 'Crash & Resilience' | 'Compatibility' | 'Network';
  description: string;
  steps: TestStep[];
  expectedResult: string;
  timeoutSeconds: number;
  enabled: boolean;
  priority: 'P0' | 'P1' | 'P2';
}

export interface UiIssue {
  id: string;
  type: 'boundary_overflow' | 'disabled_interactive' | 'missing_element' | 'text_clipping' | 'empty_field' | 'touch_target_too_small' | 'duplicate_id' | 'contrast_violation';
  description: string;
  severity: Severity;
  screenName: string;
  elementSelector: string;
  boundingBox?: { x: number; y: number; width: number; height: number };
  deviceId: string;
  suggestedFix: string;
}

export interface TestResult {
  id: string;
  testRunId: string;
  testCaseId: string;
  testCaseName: string;
  category: string;
  deviceId: string;
  deviceName: string;
  androidVersion: string;
  status: TestStatus;
  durationMs: number;
  errorMessage?: string;
  stackTrace?: string;
  screenshotUrl?: string;
  logcatSnippet?: string;
  uiIssuesDetected: UiIssue[];
  timestamp: string;
}

export interface TestRun {
  id: string;
  runNumber: number;
  apkId: string;
  apkName: string;
  deviceIds: string[];
  testCaseIds: string[];
  status: RunState;
  startTime: string;
  endTime?: string;
  passedCount: number;
  failedCount: number;
  blockedCount: number;
  totalCount: number;
  overallScore: number;
}

export interface ScreenshotComparison {
  id: string;
  screenName: string;
  baselineDevice: Device;
  targetDevice: Device;
  baselineImageUrl: string;
  targetImageUrl: string;
  diffImageUrl: string;
  diffPercentage: number;
  thresholdPercentage: number;
  hasRegressions: boolean;
  detectedShifts: string[];
}

export interface CrashReport {
  id: string;
  timestamp: string;
  deviceId: string;
  deviceName: string;
  androidVersion: string;
  appPackage: string;
  activityName: string;
  exceptionType: string;
  errorMessage: string;
  stackTrace: string;
  severity: Severity;
  screenshotUrl: string;
  reproSteps: string[];
  status: 'Open' | 'Investigating' | 'Resolved';
}

export interface PerformanceSnapshot {
  id: string;
  timestamp: string;
  elapsedSeconds: number;
  cpuPercentage: number;
  memoryMb: number;
  pssMb: number;
  responseTimeMs: number;
  fps: number;
  batteryDrainMah: number;
  jankyFrames: number;
}

export interface Defect {
  id: string;
  title: string;
  category: 'Crash' | 'UI Overlap' | 'Performance' | 'Functional' | 'Compatibility' | 'Security';
  severity: Severity;
  status: 'Open' | 'In Progress' | 'Fixed' | 'Closed';
  deviceId: string;
  deviceName: string;
  androidVersion: string;
  testCase: string;
  description: string;
  reproSteps: string[];
  logs: string;
  screenshotUrl?: string;
  timestamp: string;
  recommendation: string;
}

export interface RiskScoreBreakdown {
  crashRisk: number; // 0-100
  uiRisk: number; // 0-100
  performanceRisk: number; // 0-100
  compatibilityRisk: number; // 0-100
  totalRiskScore: number; // 0-100
  riskLevel: 'LOW' | 'MODERATE' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskFactors: string[];
}

export interface QualityScoreWeights {
  compatibilityWeight: number; // default 0.25
  uiWeight: number; // default 0.25
  crashWeight: number; // default 0.30
  performanceWeight: number; // default 0.20
}

export interface QualityScoreSubScores {
  testPassRateScore: number;
  crashFreeScore: number;
  uiValidationScore: number;
  performanceScore: number;
  deviceCompatibilityScore: number;
}

export interface QualityScoreBreakdown {
  compatibilityScore: number;
  uiStabilityScore: number;
  crashStabilityScore: number;
  performanceScore: number;
  overallScore: number;
  riskScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  releaseVerdict: 'PASS_FOR_PRODUCTION' | 'MODERATE_RISK' | 'CRITICAL_BLOCKER';
  verdictDescription: string;
  subScores: QualityScoreSubScores;
  weights: QualityScoreWeights;
}

export type QualityScore = QualityScoreBreakdown;

export interface TestRecommendation {
  id: string;
  title?: string;
  details?: string;
  actionItem?: string;
  triggerCondition?: string;
  recommendationTitle?: string;
  actionItems?: string[];
  rationale?: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'High' | 'Medium' | 'Low';
  category: string;
}


export type Recommendation = TestRecommendation;
export type RecommendationItem = TestRecommendation;

export interface LogcatEntry {
  id: string;
  timestamp: string;
  pid?: number;
  tid?: number;
  level: 'V' | 'D' | 'I' | 'W' | 'E' | 'F';
  tag: string;
  message: string;
}

export interface NetworkProfile {
  id: string;
  name: string;
  type: '5G' | '4G LTE' | '3G Slow' | '2G Edge' | 'Offline' | 'Custom Packet Loss';
  latencyMs: number;
  downloadKbps: number;
  uploadKbps: number;
  packetLossRate: number;
  status: 'active' | 'inactive';
}

export interface DatabaseRecord {
  table: string;
  columns: string[];
  rows: Record<string, any>[];
}
