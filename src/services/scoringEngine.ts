import {
  QualityScoreBreakdown,
  QualityScoreWeights,
  RiskScoreBreakdown,
  TestResult,
  Defect,
  CrashReport,
  UiIssue,
  PerformanceSnapshot,
  Device,
  ScreenshotComparison
} from '../types';

export const DEFAULT_QUALITY_WEIGHTS: QualityScoreWeights = {
  compatibilityWeight: 0.25,
  uiWeight: 0.25,
  crashWeight: 0.30,
  performanceWeight: 0.20
};

export function calculateDeviceRiskScore(
  crashes: CrashReport[],
  defects: Defect[],
  uiDefectCount: number = 2,
  incompatibleDeviceCount: number = 1
): RiskScoreBreakdown {
  const crashCount = crashes.length;
  const criticalDefectCount = defects.filter(d => d.severity === 'CRITICAL').length;
  const highPerfDefects = defects.filter(d => d.category === 'Performance' && (d.severity === 'HIGH' || d.severity === 'CRITICAL')).length;

  const crashRisk = Math.min(100, (crashCount * 40) + (criticalDefectCount * 20));
  const uiRisk = Math.min(100, uiDefectCount * 22);
  const performanceRisk = Math.min(100, highPerfDefects * 30 + 15);
  const compatibilityRisk = Math.min(100, incompatibleDeviceCount * 35);

  const totalRiskScore = Math.round(
    (crashRisk * 0.35) +
    (uiRisk * 0.25) +
    (performanceRisk * 0.20) +
    (compatibilityRisk * 0.20)
  );

  let riskLevel: 'LOW' | 'MODERATE' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (totalRiskScore > 80) riskLevel = 'CRITICAL';
  else if (totalRiskScore > 60) riskLevel = 'HIGH';
  else if (totalRiskScore > 40) riskLevel = 'MEDIUM';
  else if (totalRiskScore > 20) riskLevel = 'MODERATE';

  const riskFactors: string[] = [];
  if (crashCount > 0) riskFactors.push(`Detected ${crashCount} fatal unhandled runtime exceptions in active test runs.`);
  if (uiDefectCount > 0) riskFactors.push(`Identified ${uiDefectCount} UI viewport overflows and element clipping defects.`);
  if (compatibilityRisk > 30) riskFactors.push('Device matrix failures detected on Android 10/11 legacy API levels.');
  if (performanceRisk > 40) riskFactors.push('Elevated CPU and memory heap consumption during recycler scrolling.');

  return {
    crashRisk,
    uiRisk,
    performanceRisk,
    compatibilityRisk,
    totalRiskScore,
    riskLevel,
    riskFactors
  };
}

export function calculateQualityScore(
  results: TestResult[],
  crashes: CrashReport[],
  uiIssuesOrWeights?: UiIssue[] | QualityScoreWeights,
  metricsOrAvgCpu?: PerformanceSnapshot[] | number,
  devicesOrDiff?: Device[] | number,
  comparisons?: ScreenshotComparison[]
): QualityScoreBreakdown {
  const weights: QualityScoreWeights = (uiIssuesOrWeights && 'compatibilityWeight' in uiIssuesOrWeights)
    ? uiIssuesOrWeights
    : DEFAULT_QUALITY_WEIGHTS;

  if (results.length === 0) {
    return {
      compatibilityScore: 0,
      uiStabilityScore: 0,
      crashStabilityScore: 0,
      performanceScore: 0,
      overallScore: 0,
      riskScore: 0,
      grade: 'F',
      releaseVerdict: 'CRITICAL_BLOCKER',
      verdictDescription: 'No test execution data available.',
      subScores: {
        testPassRateScore: 0,
        crashFreeScore: 0,
        uiValidationScore: 0,
        performanceScore: 0,
        deviceCompatibilityScore: 0
      },
      weights
    };
  }

  const passedCount = results.filter(r => r.status === 'passed').length;
  const passRate = (passedCount / results.length) * 100;

  let avgCpuPercent = 38;
  if (Array.isArray(metricsOrAvgCpu) && metricsOrAvgCpu.length > 0) {
    avgCpuPercent = metricsOrAvgCpu.reduce((acc, m) => acc + m.cpuPercentage, 0) / metricsOrAvgCpu.length;
  } else if (typeof metricsOrAvgCpu === 'number') {
    avgCpuPercent = metricsOrAvgCpu;
  }

  let maxVisualDiffPct = 18.4;
  if (comparisons && comparisons.length > 0) {
    maxVisualDiffPct = Math.max(...comparisons.map(c => c.diffPercentage));
  } else if (typeof devicesOrDiff === 'number') {
    maxVisualDiffPct = devicesOrDiff;
  }

  const compatibilityScore = Math.max(0, Math.min(100, Math.round(passRate)));
  const uiStabilityScore = Math.max(0, Math.min(100, Math.round(100 - (maxVisualDiffPct * 2.5))));
  const crashStabilityScore = Math.max(0, Math.min(100, Math.round(100 - (crashes.length * 45))));
  const performanceScore = Math.max(0, Math.min(100, Math.round(100 - (avgCpuPercent * 0.75))));

  const total = (
    (compatibilityScore * weights.compatibilityWeight) +
    (uiStabilityScore * weights.uiWeight) +
    (crashStabilityScore * weights.crashWeight) +
    (performanceScore * weights.performanceWeight)
  );

  const overallScore = Math.max(0, Math.min(100, Math.round(total)));
  const riskScore = Math.max(0, Math.min(100, 100 - overallScore));

  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  if (overallScore >= 90) grade = 'A+';
  else if (overallScore >= 80) grade = 'A';
  else if (overallScore >= 70) grade = 'B';
  else if (overallScore >= 60) grade = 'C';
  else if (overallScore >= 50) grade = 'D';

  let releaseVerdict: 'PASS_FOR_PRODUCTION' | 'MODERATE_RISK' | 'CRITICAL_BLOCKER' = 'CRITICAL_BLOCKER';
  let verdictDescription = 'Critical blocking crashes or layout clipping found. Resolve before release.';

  if (overallScore >= 85 && crashes.length === 0) {
    releaseVerdict = 'PASS_FOR_PRODUCTION';
    verdictDescription = 'All core sanity & compatibility thresholds satisfied for store release.';
  } else if (overallScore >= 65) {
    releaseVerdict = 'MODERATE_RISK';
    verdictDescription = 'Release candidate functional with minor edge-case compatibility warnings.';
  }

  return {
    compatibilityScore,
    uiStabilityScore,
    crashStabilityScore,
    performanceScore,
    overallScore,
    riskScore,
    grade,
    releaseVerdict,
    verdictDescription,
    subScores: {
      testPassRateScore: compatibilityScore,
      crashFreeScore: crashStabilityScore,
      uiValidationScore: uiStabilityScore,
      performanceScore,
      deviceCompatibilityScore: compatibilityScore
    },
    weights
  };
}
