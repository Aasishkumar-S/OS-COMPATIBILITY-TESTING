import {
  Device,
  TestCase,
  TestResult,
  TestRun,
  CrashReport,
  ScreenshotComparison,
  PerformanceSnapshot,
  Defect,
  RiskScoreBreakdown,
  QualityScoreBreakdown,
  TestRecommendation,
  LogcatEntry,
  NetworkProfile,
  UiIssue
} from '../types';

import { SAMPLE_APKS } from './sampleApks';

export const INITIAL_DEVICES: Device[] = [
  {
    id: 'dev-samsung-s24',
    serialNumber: 'R5CX10S24UL',
    name: 'Samsung Galaxy S24 Ultra',
    model: 'SM-S928B/DS',
    manufacturer: 'Samsung',
    osFamily: 'android',
    osVersion: 'Samsung One UI 6.1 (Android 14)',
    skinName: 'One UI 6.1',
    androidVersion: '14.0 (One UI 6.1)',
    apiLevel: 34,
    architecture: 'arm64-v8a',
    resolution: '1440 x 3120',
    densityDpi: 505,
    ramGb: 12,
    cpuInfo: 'Snapdragon 8 Gen 3 for Galaxy (Octa-core 3.39 GHz)',
    batteryLevel: 96,
    availableStorageGb: 214.5,
    status: 'ready',
    isEmulator: false,
    selectedForTest: true
  },
  {
    id: 'dev-xiaomi-14pro',
    serialNumber: 'XM14PRO8821H',
    name: 'Xiaomi 14 Pro',
    model: '23116PN5BC',
    manufacturer: 'Xiaomi',
    osFamily: 'android',
    osVersion: 'Xiaomi HyperOS 1.0 (Android 14)',
    skinName: 'HyperOS 1.0',
    androidVersion: '14.0 (HyperOS)',
    apiLevel: 34,
    architecture: 'arm64-v8a',
    resolution: '1440 x 3200',
    densityDpi: 522,
    ramGb: 16,
    cpuInfo: 'Snapdragon 8 Gen 3 (Adreno 750)',
    batteryLevel: 91,
    availableStorageGb: 168.0,
    status: 'ready',
    isEmulator: false,
    selectedForTest: true
  },
  {
    id: 'dev-oneplus-12',
    serialNumber: 'OP12CPH2581A',
    name: 'OnePlus 12 5G',
    model: 'CPH2581',
    manufacturer: 'OnePlus',
    osFamily: 'android',
    osVersion: 'OnePlus OxygenOS 14.0 (Android 14)',
    skinName: 'OxygenOS 14',
    androidVersion: '14.0 (OxygenOS 14)',
    apiLevel: 34,
    architecture: 'arm64-v8a',
    resolution: '1440 x 3168',
    densityDpi: 510,
    ramGb: 16,
    cpuInfo: 'Snapdragon 8 Gen 3 / Trinity Engine',
    batteryLevel: 89,
    availableStorageGb: 192.4,
    status: 'ready',
    isEmulator: false,
    selectedForTest: true
  },
  {
    id: 'dev-nothing-phone2',
    serialNumber: 'NT2A065GLYPH',
    name: 'Nothing Phone (2)',
    model: 'AIN065',
    manufacturer: 'Nothing',
    osFamily: 'android',
    osVersion: 'Nothing OS 2.6 (Android 14 • Glyph UI)',
    skinName: 'Nothing OS 2.6',
    androidVersion: '14.0 (Nothing OS 2.6)',
    apiLevel: 34,
    architecture: 'arm64-v8a',
    resolution: '1080 x 2412',
    densityDpi: 394,
    ramGb: 12,
    cpuInfo: 'Snapdragon 8+ Gen 1 (Octa-core 3.0 GHz)',
    batteryLevel: 84,
    availableStorageGb: 112.0,
    status: 'ready',
    isEmulator: false,
    selectedForTest: true
  },
  {
    id: 'dev-pixel7',
    serialNumber: '99211FDF60000P',
    name: 'Google Pixel 9 Pro',
    model: 'Pixel 9 Pro (GEC77)',
    manufacturer: 'Google',
    osFamily: 'android',
    osVersion: 'Pixel UI • Android 15 (Vanilla Ice Cream)',
    skinName: 'Pixel UI',
    androidVersion: '15.0 (Pixel UI)',
    apiLevel: 35,
    architecture: 'arm64-v8a',
    resolution: '1280 x 2856',
    densityDpi: 495,
    ramGb: 16,
    cpuInfo: 'Google Tensor G4 (ARM64-v8.2a)',
    batteryLevel: 95,
    availableStorageGb: 184.2,
    status: 'ready',
    isEmulator: false,
    selectedForTest: true
  },
  {
    id: 'dev-samsung-a52',
    serialNumber: 'R58M43XYZ9P',
    name: 'Samsung Galaxy A52',
    model: 'SM-A525F',
    manufacturer: 'Samsung',
    osFamily: 'android',
    osVersion: 'Samsung One UI 5.1 (Android 13)',
    skinName: 'One UI 5.1',
    androidVersion: '13.0 (One UI 5.1)',
    apiLevel: 33,
    architecture: 'arm64-v8a',
    resolution: '1080 x 2400',
    densityDpi: 405,
    ramGb: 6,
    cpuInfo: 'Snapdragon 720G (Octa-core 2.3 GHz)',
    batteryLevel: 65,
    availableStorageGb: 31.8,
    status: 'ready',
    isEmulator: false,
    selectedForTest: false
  },
  {
    id: 'dev-redmi-note8',
    serialNumber: '8d7e9b010f3c',
    name: 'Xiaomi Redmi Note 12',
    model: '23021RAAEG',
    manufacturer: 'Xiaomi',
    osFamily: 'android',
    osVersion: 'Xiaomi MIUI 14 / HyperOS (Android 12)',
    skinName: 'MIUI 14',
    androidVersion: '12.0 (MIUI 14)',
    apiLevel: 31,
    architecture: 'arm64-v8a',
    resolution: '1080 x 2400',
    densityDpi: 395,
    ramGb: 6,
    cpuInfo: 'Qualcomm Snapdragon 685 (Octa-core 2.8 GHz)',
    batteryLevel: 72,
    availableStorageGb: 48.2,
    status: 'ready',
    isEmulator: false,
    selectedForTest: true
  },
  {
    id: 'dev-emulator-small',
    serialNumber: 'emulator-5554',
    name: 'Compact Reference AVD (Small Screen)',
    model: 'Compact HD AVD',
    manufacturer: 'AOSP Emulator',
    osFamily: 'android',
    osVersion: 'Android 10 (Quince Tart AOSP)',
    skinName: 'AOSP 10',
    androidVersion: '10.0',
    apiLevel: 29,
    architecture: 'x86_64',
    resolution: '768 x 1280',
    densityDpi: 320,
    ramGb: 4,
    cpuInfo: 'x86_64 Virtual CPU (4 Cores)',
    batteryLevel: 100,
    availableStorageGb: 14.0,
    status: 'ready',
    isEmulator: true,
    selectedForTest: false
  },
  {
    id: 'dev-win11-wsa',
    serialNumber: '127.0.0.1:58526',
    name: 'Windows 11 WSA (Subsystem for Android)',
    model: 'Windows Subsystem for Android v2311',
    manufacturer: 'Microsoft',
    osFamily: 'windows',
    osVersion: 'Windows 11 Pro 23H2 (WSA Build 2311)',
    skinName: 'Windows 11 WSA',
    androidVersion: '13.0 (WSA Subsystem)',
    apiLevel: 33,
    architecture: 'x86_64',
    resolution: '1920 x 1080 (Windowed)',
    densityDpi: 240,
    ramGb: 16,
    cpuInfo: 'Intel Core i9-13900K / Hyper-V Direct3D 12',
    batteryLevel: 100,
    availableStorageGb: 256.0,
    status: 'ready',
    isEmulator: true,
    selectedForTest: true
  },
  {
    id: 'dev-linux-waydroid',
    serialNumber: 'waydroid-session-1000',
    name: 'Ubuntu 24.04 LTS (Waydroid Container)',
    model: 'Waydroid LXC Container on Wayland',
    manufacturer: 'Canonical / Waydroid',
    osFamily: 'linux',
    osVersion: 'Ubuntu 24.04 LTS (Linux 6.8 / Wayland)',
    skinName: 'Waydroid LXC',
    androidVersion: '13.0 (LineageOS 20)',
    apiLevel: 33,
    architecture: 'x86_64',
    resolution: '1920 x 1080 (Desktop Seamless)',
    densityDpi: 240,
    ramGb: 32,
    cpuInfo: 'AMD EPYC / Mesa Vulkan Passthrough',
    batteryLevel: 100,
    availableStorageGb: 500.0,
    status: 'ready',
    isEmulator: true,
    selectedForTest: true
  }
];

export const INITIAL_TEST_CASES: TestCase[] = [
  {
    id: 'tc-01',
    code: 'TC_AUTH_001',
    name: 'User Login with Valid Credentials',
    category: 'Functional',
    description: 'Verify that an existing registered user can successfully authenticate and navigate to HomeDashboard.',
    steps: [
      { stepNumber: 1, action: 'Launch app', target: 'SplashActivity', expected: 'Landing screen displayed within 2.5s' },
      { stepNumber: 2, action: 'Click button', target: 'btn_get_started', expected: 'Navigated to AuthActivity' },
      { stepNumber: 3, action: 'Type text', target: 'input_email', value: 'alex.tester@example.com', expected: 'Email field contains typed value' },
      { stepNumber: 4, action: 'Type text', target: 'input_password', value: 'SecurePass#2026', expected: 'Password masked' },
      { stepNumber: 5, action: 'Click button', target: 'btn_login_submit', expected: 'API 200 response and transition to HomeDashboard' }
    ],
    expectedResult: 'HomeDashboardActivity active with username "Alex Tester" greeting.',
    timeoutSeconds: 20,
    enabled: true,
    priority: 'P0'
  },
  {
    id: 'tc-02',
    code: 'TC_UI_002',
    name: 'Responsive UI Viewport & Button Boundary Check',
    category: 'UI Validation',
    description: 'Verify all interactive controls, checkout buttons, and text labels fit inside device viewport without clipping.',
    steps: [
      { stepNumber: 1, action: 'Open screen', target: 'CartCheckoutActivity', expected: 'Cart list loaded' },
      { stepNumber: 2, action: 'Inspect hierarchy', target: 'btn_proceed_payment', expected: 'Bounding box y2 <= screenHeight' },
      { stepNumber: 3, action: 'Validate text size', target: 'tv_delivery_instructions', expected: 'No truncated ellipsis (...) on standard DPI' }
    ],
    expectedResult: 'No overlapping elements or off-screen action buttons across all screen densities.',
    timeoutSeconds: 15,
    enabled: true,
    priority: 'P0'
  },
  {
    id: 'tc-03',
    code: 'TC_CRASH_003',
    name: 'Payment Processing Null-Safety & Exception Handling',
    category: 'Crash & Resilience',
    description: 'Trigger checkout payment flow with empty billing payload and simulate uninitialized transaction token.',
    steps: [
      { stepNumber: 1, action: 'Open screen', target: 'PaymentGatewayActivity', expected: 'Payment options rendered' },
      { stepNumber: 2, action: 'Select radio', target: 'radio_upi_instant', expected: 'UPI option checked' },
      { stepNumber: 3, action: 'Submit without token', target: 'btn_confirm_pay', expected: 'Input validation error shown gracefully, no crash' }
    ],
    expectedResult: 'Application displays friendly validation alert; no FATAL EXCEPTION NullPointerException in logcat.',
    timeoutSeconds: 25,
    enabled: true,
    priority: 'P0'
  },
  {
    id: 'tc-04',
    code: 'TC_PERF_004',
    name: 'End-to-End Restaurant List Scrolling & Memory RSS Profiling',
    category: 'Performance',
    description: 'Perform fast fling gestures through 100+ menu items to measure frame render times and memory leakage.',
    steps: [
      { stepNumber: 1, action: 'Open screen', target: 'HomeDashboardActivity', expected: 'Recycler view loaded' },
      { stepNumber: 2, action: 'Fling down 10x', target: 'rv_restaurant_list', expected: 'Smooth 60 FPS scrolling' },
      { stepNumber: 3, action: 'Poll memory', target: 'dumpsys meminfo', expected: 'PSS growth < 40MB across 30 seconds' }
    ],
    expectedResult: 'Average CPU < 35%, Janky frames < 5%, No OutOfMemoryError.',
    timeoutSeconds: 30,
    enabled: true,
    priority: 'P1'
  },
  {
    id: 'tc-05',
    code: 'TC_NET_005',
    name: 'Network Disconnection Graceful Fallback & Retry',
    category: 'Network',
    description: 'Switch device to Airplane Mode mid-request and verify retry banner and cached offline data.',
    steps: [
      { stepNumber: 1, action: 'Set network', target: 'Airplane Mode ON', expected: 'Connectivity broadcast fired' },
      { stepNumber: 2, action: 'Click refresh', target: 'swipe_refresh_layout', expected: 'Non-blocking toast "No Internet Connection"' },
      { stepNumber: 3, action: 'Set network', target: 'WiFi ON', expected: 'Auto-reconnect and re-fetch feeds' }
    ],
    expectedResult: 'Application presents retry button; UI does not freeze or ANR.',
    timeoutSeconds: 20,
    enabled: true,
    priority: 'P1'
  },
  {
    id: 'tc-06',
    code: 'TC_COMPAT_006',
    name: 'Android 10 - 14 Runtime Permissions Dialog Flow',
    category: 'Compatibility',
    description: 'Verify ACCESS_FINE_LOCATION and POST_NOTIFICATIONS grant prompt adheres to scoped permissions.',
    steps: [
      { stepNumber: 1, action: 'Revoke permissions', target: 'pm reset-permissions', expected: 'Permissions clean state' },
      { stepNumber: 2, action: 'Launch app', target: 'LiveTrackingActivity', expected: 'System permission dialog appears' },
      { stepNumber: 3, action: 'Click dialog', target: 'While using the app', expected: 'GPS initialized without SecurityException' }
    ],
    expectedResult: 'Proper runtime permission handling without security crashes.',
    timeoutSeconds: 18,
    enabled: true,
    priority: 'P1'
  }
];

export const INITIAL_TEST_RESULTS: TestResult[] = [
  {
    id: 'tr-01-pixel7',
    testRunId: 'run-101',
    testCaseId: 'tc-01',
    testCaseName: 'User Login with Valid Credentials',
    category: 'Functional',
    deviceId: 'dev-pixel7',
    deviceName: 'Google Pixel 7',
    androidVersion: '14.0 (API 34)',
    status: 'passed',
    durationMs: 4120,
    screenshotUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&auto=format&fit=crop&q=60',
    logcatSnippet: '08-20 10:14:02.112  3104  3104 I AuthActivity: Authentication success for user: alex.tester@example.com (HTTP 200 OK)',
    uiIssuesDetected: [],
    timestamp: '2026-08-20 10:14:06'
  },
  {
    id: 'tr-01-samsung',
    testRunId: 'run-101',
    testCaseId: 'tc-01',
    testCaseName: 'User Login with Valid Credentials',
    category: 'Functional',
    deviceId: 'dev-samsung-a52',
    deviceName: 'Samsung Galaxy A52',
    androidVersion: '13.0 (API 33)',
    status: 'passed',
    durationMs: 4680,
    screenshotUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&auto=format&fit=crop&q=60',
    logcatSnippet: '08-20 10:14:12.304  4210  4210 I AuthActivity: Login payload validated. Token cached to EncryptedSharedPreferences.',
    uiIssuesDetected: [],
    timestamp: '2026-08-20 10:14:16'
  },
  {
    id: 'tr-02-emulator',
    testRunId: 'run-101',
    testCaseId: 'tc-02',
    testCaseName: 'Responsive UI Viewport & Button Boundary Check',
    category: 'UI Validation',
    deviceId: 'dev-emulator-small',
    deviceName: 'Nexus 4 AVD (768x1280)',
    androidVersion: '10.0 (API 29)',
    status: 'failed',
    durationMs: 2890,
    errorMessage: 'UI Defect: [btn_proceed_payment] bottom bound (y=1320px) exceeds viewport height (h=1280px). Button partially cut off.',
    stackTrace: 'AssertionError: Element with id "com.foodexpress.delivery.app:id/btn_proceed_payment" is clipped by screen boundary.\n  at UiValidator.checkElementBoundaries(ui_validator.py:142)\n  at TestEngine.run_test_step(test_engine.py:288)',
    screenshotUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&auto=format&fit=crop&q=60',
    logcatSnippet: '08-20 10:14:22.880  1902  1902 W View: Layout requested outside window bounds (y2=1320, winH=1280)',
    uiIssuesDetected: [
      {
        id: 'ui-issue-01',
        type: 'boundary_overflow',
        description: 'Payment CTA button "Proceed to Checkout ($24.50)" overflows bottom window boundary by 40px on small screen.',
        severity: 'HIGH',
        screenName: 'CartCheckoutActivity',
        elementSelector: 'id/btn_proceed_payment',
        boundingBox: { x: 40, y: 1210, width: 688, height: 110 },
        deviceId: 'dev-emulator-small',
        suggestedFix: 'Wrap CartCheckout root layout inside a NestedScrollView or reduce vertical bottom padding.'
      }
    ],
    timestamp: '2026-08-20 10:14:26'
  },
  {
    id: 'tr-03-redmi',
    testRunId: 'run-101',
    testCaseId: 'tc-03',
    testCaseName: 'Payment Processing Null-Safety & Exception Handling',
    category: 'Crash & Resilience',
    deviceId: 'dev-redmi-note8',
    deviceName: 'Xiaomi Redmi Note 8',
    androidVersion: '11.0 (API 30)',
    status: 'failed',
    durationMs: 5120,
    errorMessage: 'CRITICAL CRASH: java.lang.NullPointerException in PaymentGatewayActivity.initiateUpiTransaction()',
    stackTrace: 'FATAL EXCEPTION: main\nProcess: com.foodexpress.delivery.app, PID: 7421\njava.lang.NullPointerException: Attempt to invoke virtual method "java.lang.String com.foodexpress.delivery.model.PaymentSession.getTransactionToken()" on a null object reference\n\tat com.foodexpress.delivery.ui.PaymentGatewayActivity.initiateUpiTransaction(PaymentGatewayActivity.kt:184)\n\tat com.foodexpress.delivery.ui.PaymentGatewayActivity$onCreate$2.onClick(PaymentGatewayActivity.kt:92)\n\tat android.view.View.performClick(View.java:7448)',
    screenshotUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60',
    logcatSnippet: '08-20 10:14:38.991  7421  7421 E AndroidRuntime: FATAL EXCEPTION: main\n08-20 10:14:38.991  7421  7421 E AndroidRuntime: Process: com.foodexpress.delivery.app, PID: 7421\n08-20 10:14:38.992  7421  7421 E AndroidRuntime: java.lang.NullPointerException: Attempt to invoke virtual method on null object reference',
    uiIssuesDetected: [],
    timestamp: '2026-08-20 10:14:42'
  },
  {
    id: 'tr-04-pixel7',
    testRunId: 'run-101',
    testCaseId: 'tc-04',
    testCaseName: 'End-to-End Restaurant List Scrolling & Memory RSS Profiling',
    category: 'Performance',
    deviceId: 'dev-pixel7',
    deviceName: 'Google Pixel 7',
    androidVersion: '14.0 (API 34)',
    status: 'passed',
    durationMs: 8940,
    screenshotUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=60',
    logcatSnippet: '08-20 10:14:55.102  3104  3120 D Profile: RecyclerView render pass: 60 FPS maintained. 0 dropped frames.',
    uiIssuesDetected: [],
    timestamp: '2026-08-20 10:14:58'
  },
  {
    id: 'tr-05-samsung',
    testRunId: 'run-101',
    testCaseId: 'tc-05',
    testCaseName: 'Network Disconnection Graceful Fallback & Retry',
    category: 'Network',
    deviceId: 'dev-samsung-a52',
    deviceName: 'Samsung Galaxy A52',
    androidVersion: '13.0 (API 33)',
    status: 'passed',
    durationMs: 4200,
    screenshotUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&auto=format&fit=crop&q=60',
    logcatSnippet: '08-20 10:15:08.411  4210  4210 I NetworkChangeReceiver: CONNECTIVITY_ACTION -> No Internet. Showing cached menu from Room DB.',
    uiIssuesDetected: [],
    timestamp: '2026-08-20 10:15:12'
  }
];

export const INITIAL_TEST_RUN: TestRun = {
  id: 'run-101',
  runNumber: 101,
  apkId: 'apk-demo-fooddelivery',
  apkName: 'FoodDelivery_v2.1_debug.apk',
  deviceIds: ['dev-pixel7', 'dev-samsung-a52', 'dev-redmi-note8', 'dev-emulator-small'],
  testCaseIds: ['tc-01', 'tc-02', 'tc-03', 'tc-04', 'tc-05', 'tc-06'],
  status: 'completed',
  startTime: '2026-08-20 10:14:00',
  endTime: '2026-08-20 10:15:20',
  passedCount: 4,
  failedCount: 2,
  blockedCount: 0,
  totalCount: 6,
  overallScore: 78
};

export const INITIAL_DEFECTS: Defect[] = [
  {
    id: 'DEF-001',
    title: 'Fatal NullPointerException during UPI Checkout when Session Token Uninitialized',
    category: 'Crash',
    severity: 'CRITICAL',
    status: 'Open',
    deviceId: 'dev-redmi-note8',
    deviceName: 'Xiaomi Redmi Note 8',
    androidVersion: 'Android 11 (API 30)',
    testCase: 'TC_CRASH_003: Payment Processing Null-Safety',
    description: 'Tapping Confirm Payment button without prior network session sync causes an unhandled NullPointerException in PaymentGatewayActivity.initiateUpiTransaction() crashing the app.',
    reproSteps: [
      '1. Launch FoodExpress Delivery v2.1',
      '2. Add any meal item to cart and proceed to PaymentGatewayActivity',
      '3. Select UPI Radio Button immediately before network session token loads',
      '4. Click "Confirm & Pay $24.50"'
    ],
    logs: 'FATAL EXCEPTION: main\nPID: 7421\njava.lang.NullPointerException: Attempt to invoke virtual method "String PaymentSession.getTransactionToken()" on null object reference at com.foodexpress.delivery.ui.PaymentGatewayActivity.initiateUpiTransaction(PaymentGatewayActivity.kt:184)',
    screenshotUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60',
    timestamp: '2026-08-20 10:14:42',
    recommendation: 'Add null check `paymentSession?.transactionToken?.let { ... } ?: showRetrySnackbar()` and disable payment CTA button until session token is loaded.'
  },
  {
    id: 'DEF-002',
    title: 'Checkout Action Button Clipped Outside Bottom Viewport Boundary on 768x1280 Density',
    category: 'UI Overlap',
    severity: 'HIGH',
    status: 'Open',
    deviceId: 'dev-emulator-small',
    deviceName: 'Nexus 4 AVD (768x1280)',
    androidVersion: 'Android 10 (API 29)',
    testCase: 'TC_UI_002: Responsive UI Viewport & Button Boundary Check',
    description: 'On screens with height <= 1280px, the "Proceed to Checkout" floating container is pushed partially below the bottom screen edge, preventing user touch interactions.',
    reproSteps: [
      '1. Launch app on 768x1280 resolution device (Nexus 4 or small Android Go device)',
      '2. Navigate to Cart Checkout screen with 4 items',
      '3. Observe the bottom anchor position of btn_proceed_payment'
    ],
    logs: 'W/View: Layout requested outside window bounds (y2=1320px > winH=1280px)',
    screenshotUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&auto=format&fit=crop&q=60',
    timestamp: '2026-08-20 10:14:26',
    recommendation: 'Wrap the cart contents in a NestedScrollView with bottom contentPadding="96dp" to allow scrolling to the CTA.'
  },
  {
    id: 'DEF-003',
    title: 'High Initial RSS Memory Consumption (245MB) during Fast Menu Carousel Scroll',
    category: 'Performance',
    severity: 'MEDIUM',
    status: 'In Progress',
    deviceId: 'dev-pixel7',
    deviceName: 'Google Pixel 7',
    androidVersion: 'Android 14 (API 34)',
    testCase: 'TC_PERF_004: Restaurant List Scrolling & Memory RSS Profiling',
    description: 'Uncompressed high-resolution meal banner bitmaps (4K assets) are cached in memory without downsampling, causing heap spikes to 245MB.',
    reproSteps: [
      '1. Open HomeDashboardActivity',
      '2. Rapidly scroll down through 80 food categories',
      '3. Observe heap dump in Android Profiler'
    ],
    logs: 'D/Glide: BitmapPool size 180MB exceeded. Triggering trimMemory(TRIM_MEMORY_UI_HIDDEN)',
    screenshotUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=60',
    timestamp: '2026-08-20 10:14:58',
    recommendation: 'Configure Glide/Coil downsampling target size to match ImageView dimensions: `.override(Target.SIZE_ORIGINAL, 300)` and enable WebP compression.'
  }
];

export const INITIAL_CRASHES: CrashReport[] = [
  {
    id: 'crash-01',
    timestamp: '2026-08-20 10:14:38',
    deviceId: 'dev-redmi-note8',
    deviceName: 'Xiaomi Redmi Note 8',
    androidVersion: 'Android 11 (API 30)',
    appPackage: 'com.foodexpress.delivery.app',
    activityName: 'com.foodexpress.delivery.ui.PaymentGatewayActivity',
    exceptionType: 'java.lang.NullPointerException',
    errorMessage: 'Attempt to invoke virtual method "java.lang.String com.foodexpress.delivery.model.PaymentSession.getTransactionToken()" on a null object reference',
    stackTrace: `FATAL EXCEPTION: main
Process: com.foodexpress.delivery.app, PID: 7421
java.lang.NullPointerException: Attempt to invoke virtual method "java.lang.String com.foodexpress.delivery.model.PaymentSession.getTransactionToken()" on a null object reference
	at com.foodexpress.delivery.ui.PaymentGatewayActivity.initiateUpiTransaction(PaymentGatewayActivity.kt:184)
	at com.foodexpress.delivery.ui.PaymentGatewayActivity$setupListeners$1.onClick(PaymentGatewayActivity.kt:92)
	at android.view.View.performClick(View.java:7448)
	at android.view.View.performClickInternal(View.java:7425)
	at android.view.View.access$3600(View.java:810)
	at android.view.View$PerformClick.run(View.java:28305)
	at android.os.Handler.handleCallback(Handler.java:938)
	at android.os.Handler.dispatchMessage(Handler.java:99)
	at android.os.Looper.loop(Looper.java:223)
	at android.app.ActivityThread.main(ActivityThread.java:7656)
	at java.lang.reflect.Method.invoke(Native Method)
	at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:592)
	at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:947)`,
    severity: 'CRITICAL',
    screenshotUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60',
    reproSteps: [
      '1. Launch FoodExpress Delivery v2.1',
      '2. Navigate to Cart Checkout -> PaymentGateway',
      '3. Select UPI Payment option',
      '4. Click "Confirm Payment" button before token API completes'
    ],
    status: 'Open'
  }
];

export const INITIAL_VISUAL_COMPARISONS: ScreenshotComparison[] = [
  {
    id: 'vc-01',
    screenName: 'Cart Checkout Screen',
    baselineDevice: INITIAL_DEVICES[0], // Pixel 7
    targetDevice: INITIAL_DEVICES[3], // Emulator Small
    baselineImageUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&auto=format&fit=crop&q=60',
    targetImageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=60',
    diffImageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&auto=format&fit=crop&q=60',
    diffPercentage: 18.4,
    thresholdPercentage: 5.0,
    hasRegressions: true,
    detectedShifts: [
      'Checkout CTA button offset by +140px on Y-axis (clipped off-screen)',
      'Subtotal calculation summary text truncated on right edge by 22px',
      'Horizontal padding condensed from 24dp to 8dp on low-density display'
    ]
  },
  {
    id: 'vc-02',
    screenName: 'Home Dashboard Category Carousel',
    baselineDevice: INITIAL_DEVICES[0], // Pixel 7
    targetDevice: INITIAL_DEVICES[1], // Samsung A52
    baselineImageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=60',
    targetImageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=60',
    diffImageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=60',
    diffPercentage: 1.2,
    thresholdPercentage: 5.0,
    hasRegressions: false,
    detectedShifts: [
      'Minor font antialiasing difference (OneUI vs Stock Android Roboto font engine)'
    ]
  }
];

export const INITIAL_SCREENSHOT_COMPARISONS: ScreenshotComparison[] = INITIAL_VISUAL_COMPARISONS;


export const INITIAL_PERFORMANCE_METRICS: PerformanceSnapshot[] = [
  { id: 'perf-1', timestamp: '10:14:00', elapsedSeconds: 0, cpuPercentage: 12, memoryMb: 140, pssMb: 92, responseTimeMs: 420, fps: 60, batteryDrainMah: 1.1, jankyFrames: 0 },
  { id: 'perf-2', timestamp: '10:14:10', elapsedSeconds: 10, cpuPercentage: 28, memoryMb: 168, pssMb: 110, responseTimeMs: 650, fps: 59, batteryDrainMah: 2.3, jankyFrames: 1 },
  { id: 'perf-3', timestamp: '10:14:20', elapsedSeconds: 20, cpuPercentage: 45, memoryMb: 210, pssMb: 145, responseTimeMs: 1120, fps: 55, batteryDrainMah: 3.8, jankyFrames: 3 },
  { id: 'perf-4', timestamp: '10:14:30', elapsedSeconds: 30, cpuPercentage: 74, memoryMb: 248, pssMb: 180, responseTimeMs: 2300, fps: 42, batteryDrainMah: 5.4, jankyFrames: 8 },
  { id: 'perf-5', timestamp: '10:14:40', elapsedSeconds: 40, cpuPercentage: 88, memoryMb: 265, pssMb: 195, responseTimeMs: 3100, fps: 31, batteryDrainMah: 7.2, jankyFrames: 14 },
  { id: 'perf-6', timestamp: '10:14:50', elapsedSeconds: 50, cpuPercentage: 35, memoryMb: 220, pssMb: 152, responseTimeMs: 890, fps: 58, batteryDrainMah: 8.1, jankyFrames: 2 },
  { id: 'perf-7', timestamp: '10:15:00', elapsedSeconds: 60, cpuPercentage: 22, memoryMb: 195, pssMb: 138, responseTimeMs: 510, fps: 60, batteryDrainMah: 8.9, jankyFrames: 0 }
];

export const INITIAL_RECOMMENDATIONS: TestRecommendation[] = [
  {
    id: 'rec-01',
    triggerCondition: 'Critical NullPointerException detected in PaymentGatewayActivity',
    recommendationTitle: 'Execute Targeted Checkout State & Asynchronous Mock Suite',
    actionItems: [
      'Inject simulated slow network responses (3000ms latency) during payment session token retrieval.',
      'Test fast-click concurrency: spam "Confirm Payment" button 5 times within 500ms.',
      'Verify session restore when activity is recreated during screen rotation.'
    ],
    rationale: 'Race conditions between payment token initialization and click listeners represent the #1 cause of e-commerce checkout abandonment and revenue loss.',
    priority: 'CRITICAL',
    category: 'Regression'
  },
  {
    id: 'rec-02',
    triggerCondition: 'UI Viewport clipping detected on 768x1280 screen resolution',
    recommendationTitle: 'Expand Device Compatibility Matrix to Ultra-Compact and Foldable Displays',
    actionItems: [
      'Add test execution on 480x800 (wvga), 720x1520 (notch), and 1080x2640 (tall aspect ratio) virtual devices.',
      'Execute tests in landscape orientation mode to verify scrolling bounds.',
      'Validate accessibility large font scaling (1.3x and 1.5x system text size).'
    ],
    rationale: 'Budget and older Android devices frequently have non-standard viewports where fixed padding breaks checkout workflows.',
    priority: 'HIGH',
    category: 'Device Matrix'
  },
  {
    id: 'rec-03',
    triggerCondition: 'Debuggable flag active & 3 dangerous permissions present in APK manifest',
    recommendationTitle: 'Run Android V2 Signature & Hardened ProGuard Obfuscation Verification',
    actionItems: [
      'Verify ProGuard/R8 minification rules strip all debugging log strings from release APK.',
      'Audit exported receiver permissions to prevent unauthorized inter-process intent injection.'
    ],
    rationale: 'Debuggable APKs allow local ADB process attachment and memory inspection, failing Google Play Store security audits.',
    priority: 'MEDIUM',
    category: 'Stress Test'
  }
];

export const INITIAL_LOGCAT_ENTRIES: LogcatEntry[] = [
  { id: 'log-1', timestamp: '10:14:00.102', pid: 3104, tid: 3104, level: 'I', tag: 'ActivityTaskManager', message: 'START u0 {act=android.intent.action.MAIN cat=[android.intent.category.LAUNCHER] flg=0x10200000 cmp=com.foodexpress.delivery.app/.ui.SplashActivity} with ID 42' },
  { id: 'log-2', timestamp: '10:14:01.450', pid: 3104, tid: 3104, level: 'D', tag: 'SplashActivity', message: 'Initializing MobileTest Guardian telemetry SDK v2.4...' },
  { id: 'log-3', timestamp: '10:14:02.112', pid: 3104, tid: 3104, level: 'I', tag: 'AuthActivity', message: 'Authentication success for user: alex.tester@example.com (HTTP 200 OK)' },
  { id: 'log-4', timestamp: '10:14:15.890', pid: 3104, tid: 3122, level: 'D', tag: 'LocationService', message: 'Requesting fine location update from FusedLocationProviderClient' },
  { id: 'log-5', timestamp: '10:14:22.880', pid: 1902, tid: 1902, level: 'W', tag: 'ViewRootImpl', message: 'Layout requested outside window bounds (y2=1320, winH=1280) in CartCheckoutActivity' },
  { id: 'log-6', timestamp: '10:14:38.991', pid: 7421, tid: 7421, level: 'E', tag: 'AndroidRuntime', message: 'FATAL EXCEPTION: main' },
  { id: 'log-7', timestamp: '10:14:38.992', pid: 7421, tid: 7421, level: 'E', tag: 'AndroidRuntime', message: 'Process: com.foodexpress.delivery.app, PID: 7421' },
  { id: 'log-8', timestamp: '10:14:38.993', pid: 7421, tid: 7421, level: 'E', tag: 'AndroidRuntime', message: 'java.lang.NullPointerException: Attempt to invoke virtual method "String PaymentSession.getTransactionToken()" on a null object reference' },
  { id: 'log-9', timestamp: '10:14:38.994', pid: 7421, tid: 7421, level: 'E', tag: 'AndroidRuntime', message: '    at com.foodexpress.delivery.ui.PaymentGatewayActivity.initiateUpiTransaction(PaymentGatewayActivity.kt:184)' },
  { id: 'log-10', timestamp: '10:14:55.102', pid: 3104, tid: 3120, level: 'D', tag: 'Profile', message: 'RecyclerView render pass: 60 FPS maintained. 0 dropped frames.' }
];

export const INITIAL_LOGCAT: LogcatEntry[] = INITIAL_LOGCAT_ENTRIES;

export const INITIAL_UI_ISSUES: UiIssue[] = [
  {
    id: 'ui-issue-1',
    type: 'boundary_overflow',
    description: 'Payment CTA button bottom boundary (y=1320px) overflows screen height (1280px) on 768x1280 compact displays.',
    severity: 'CRITICAL',
    screenName: 'CartCheckoutActivity',
    elementSelector: 'com.foodexpress.delivery.app:id/btn_proceed_payment',
    boundingBox: { x: 40, y: 1210, width: 688, height: 110 },
    deviceId: 'dev-emulator-small',
    suggestedFix: 'Wrap root layout in NestedScrollView or set dynamic constraint to bottom of parent with 0dp layout_height RecyclerView.'
  },
  {
    id: 'ui-issue-2',
    type: 'text_clipping',
    description: 'Subtotal pricing calculation string clipped horizontally on right edge by 22px on low-density screen.',
    severity: 'MEDIUM',
    screenName: 'CartCheckoutActivity',
    elementSelector: 'com.foodexpress.delivery.app:id/tv_subtotal_amount',
    boundingBox: { x: 520, y: 1050, width: 220, height: 40 },
    deviceId: 'dev-emulator-small',
    suggestedFix: 'Replace fixed width with wrap_content and set ellipsize="none" with maxLines="1".'
  },
  {
    id: 'ui-issue-3',
    type: 'touch_target_too_small',
    description: 'Filter category icon button touch target is 32x32dp (Material standard requires >=48x48dp).',
    severity: 'LOW',
    screenName: 'HomeDashboardActivity',
    elementSelector: 'com.foodexpress.delivery.app:id/btn_filter_vegan',
    boundingBox: { x: 12, y: 80, width: 32, height: 32 },
    deviceId: 'dev-pixel7',
    suggestedFix: 'Add android:minWidth="48dp" and android:minHeight="48dp" or increase padding to 12dp.'
  }
];

export const NETWORK_PROFILES: NetworkProfile[] = [
  { id: 'net-5g', name: '5G Ultra Wideband (Ideal)', type: '5G', latencyMs: 15, downloadKbps: 150000, uploadKbps: 50000, packetLossRate: 0, status: 'active' },
  { id: 'net-4g', name: '4G LTE Standard', type: '4G LTE', latencyMs: 45, downloadKbps: 25000, uploadKbps: 10000, packetLossRate: 0.1, status: 'inactive' },
  { id: 'net-3g', name: '3G Slow Mobile Web', type: '3G Slow', latencyMs: 350, downloadKbps: 750, uploadKbps: 250, packetLossRate: 2.0, status: 'inactive' },
  { id: 'net-2g', name: '2G EDGE Degraded Bandwidth', type: '2G Edge', latencyMs: 800, downloadKbps: 150, uploadKbps: 50, packetLossRate: 5.0, status: 'inactive' },
  { id: 'net-loss', name: 'Flaky Connection (15% Loss)', type: 'Custom Packet Loss', latencyMs: 250, downloadKbps: 2000, uploadKbps: 1000, packetLossRate: 15.0, status: 'inactive' },
  { id: 'net-offline', name: 'Airplane Mode (Offline)', type: 'Offline', latencyMs: 9999, downloadKbps: 0, uploadKbps: 0, packetLossRate: 100, status: 'inactive' }
];


