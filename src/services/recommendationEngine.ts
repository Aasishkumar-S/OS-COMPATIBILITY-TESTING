import { Defect, CrashReport, ScreenshotComparison, TestRecommendation, TestResult, UiIssue, QualityScoreBreakdown } from '../types';

export function generateRecommendations(
  defects: Defect[],
  crashes: CrashReport[],
  comparisonsOrUiIssues?: ScreenshotComparison[] | UiIssue[],
  resultsOrComparisons?: TestResult[] | ScreenshotComparison[],
  qualityScore?: QualityScoreBreakdown
): TestRecommendation[] {
  const recommendations: TestRecommendation[] = [];

  const comparisons: ScreenshotComparison[] = Array.isArray(resultsOrComparisons) && resultsOrComparisons.length > 0 && 'baselineDevice' in resultsOrComparisons[0]
    ? resultsOrComparisons as ScreenshotComparison[]
    : (Array.isArray(comparisonsOrUiIssues) && comparisonsOrUiIssues.length > 0 && 'baselineDevice' in comparisonsOrUiIssues[0]
        ? comparisonsOrUiIssues as ScreenshotComparison[]
        : []);

  const results: TestResult[] = Array.isArray(resultsOrComparisons) && resultsOrComparisons.length > 0 && 'testCaseId' in resultsOrComparisons[0]
    ? resultsOrComparisons as TestResult[]
    : [];

  // Rule 1: Payment or Checkout Crash
  const hasPaymentCrash = crashes.some(c => 
    c.activityName.toLowerCase().includes('payment') || 
    c.errorMessage.toLowerCase().includes('nullpointer')
  );
  if (hasPaymentCrash) {
    recommendations.push({
      id: `rec-${Date.now()}-1`,
      title: 'Execute Targeted Checkout Race-Condition & Asynchronous Session Suite',
      details: 'Payment crashes directly block revenue conversion and result in catastrophic customer abandonment.',
      actionItem: 'Inject simulated slow network responses (3000ms latency) during payment session token retrieval.',
      triggerCondition: 'Critical NullPointerException in Payment Gateway / Checkout Flow',
      recommendationTitle: 'Execute Targeted Checkout Race-Condition & Asynchronous Session Suite',
      actionItems: [
        'Inject simulated slow network responses (3000ms latency) during payment session token retrieval.',
        'Execute fast-click concurrency test: spam "Confirm Payment" button 5 times within 500ms.',
        'Verify session state preservation when device orientation changes during payment handshake.'
      ],
      rationale: 'Payment crashes directly block revenue conversion and result in catastrophic customer abandonment.',
      priority: 'CRITICAL',
      category: 'Regression'
    });
  }

  // Rule 2: Visual Regressions or Viewport Clipping
  const hasVisualRegression = comparisons.some(c => c.hasRegressions) || defects.some(d => d.category === 'UI Overlap');
  if (hasVisualRegression) {
    recommendations.push({
      id: `rec-${Date.now()}-2`,
      title: 'Expand Device Compatibility Matrix to Ultra-Compact and Foldable Displays',
      details: 'Over 28% of global Android devices operate on compact or non-standard resolutions where fixed height containers fail.',
      actionItem: 'Add test runs on 480x800 (WVGA), 720x1520 (notch), and 1080x2640 (tall aspect ratio) virtual devices.',
      triggerCondition: 'UI Viewport clipping / element boundary overflow on compact screen resolutions',
      recommendationTitle: 'Expand Device Compatibility Matrix to Ultra-Compact and Foldable Displays',
      actionItems: [
        'Add test runs on 480x800 (WVGA), 720x1520 (notch), and 1080x2640 (tall aspect ratio) virtual devices.',
        'Run test suite with Android Accessibility Large Font scaling enabled (1.3x and 1.5x font scale).',
        'Validate landscape mode viewport rendering across all primary workflow screens.'
      ],
      rationale: 'Over 28% of global Android devices operate on compact or non-standard resolutions where fixed height containers fail.',
      priority: 'HIGH',
      category: 'Device Matrix'
    });
  }

  // Rule 3: High Performance / Heap Spikes
  const hasPerfIssues = defects.some(d => d.category === 'Performance');
  if (hasPerfIssues) {
    recommendations.push({
      id: `rec-${Date.now()}-3`,
      title: 'Conduct Bitmap Downsampling & Memory Leak Lifetime Profiling',
      details: 'Uncontrolled memory consumption triggers Garbage Collector pauses, resulting in visible janky frame stutter.',
      actionItem: 'Execute LeakCanary automated dump analysis on activity transitions to detect unreleased Activity context references.',
      triggerCondition: 'High RSS Memory Heap Consumption during fast RecyclerView fling gestures',
      recommendationTitle: 'Conduct Bitmap Downsampling & Memory Leak Lifetime Profiling',
      actionItems: [
        'Execute LeakCanary automated dump analysis on activity transitions to detect unreleased Activity context references.',
        'Profile Glide/Coil image cache limits to enforce hardware bitmap downsampling.',
        'Run 15-minute monkey stress test with 500 rapid navigation intent events.'
      ],
      rationale: 'Uncontrolled memory consumption triggers Garbage Collector pauses, resulting in visible janky frame stutter and OS low-memory killer terminations.',
      priority: 'MEDIUM',
      category: 'Stress Test'
    });
  }

  // Rule 4: Network Resilience
  const networkTests = results.filter(r => r.category === 'Network');
  const hasNetworkFail = networkTests.some(r => r.status === 'failed');
  if (hasNetworkFail || networkTests.length === 0) {
    recommendations.push({
      id: `rec-${Date.now()}-4`,
      title: 'Simulate Degraded 2G / 3G and High Latency Profile Matrices',
      details: 'Mobile users frequently encounter transit dead zones; apps without graceful offline state degrade user experience.',
      actionItem: 'Configure ADB network throttle to 250kbps down / 50kbps up with 500ms latency.',
      triggerCondition: 'Network packet loss or airplane mode edge case validation required',
      recommendationTitle: 'Simulate Degraded 2G / 3G and High Latency Profile Matrices',
      actionItems: [
        'Configure ADB network throttle to 250kbps down / 50kbps up with 500ms latency.',
        'Validate that offline SQLite/Room cache gracefully serves read requests when WiFi disconnects.',
        'Verify exponential backoff retry algorithms prevent server request storms upon reconnection.'
      ],
      rationale: 'Mobile users frequently encounter transit dead zones; apps without graceful offline state degrade user experience.',
      priority: 'HIGH',
      category: 'Network Profile'
    });
  }

  return recommendations;
}
