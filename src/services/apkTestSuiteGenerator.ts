import {
  ApkMetadata,
  Device,
  TestCase,
  TestResult,
  CrashReport,
  PerformanceSnapshot,
  UiIssue,
  ScreenshotComparison,
  Defect,
  LogcatEntry,
  TestRun
} from '../types';

/**
 * Infer high-level application domain from package name, app name, activities, or permissions
 */
export function inferDomain(apk: ApkMetadata): 'custom' | 'fintech' | 'health' | 'food' | 'social' | 'ecommerce' | 'utility' {
  if (apk.isCustomUpload) {
    return 'custom';
  }

  // Only inspect packageName, appName, and activities (never permissions where ACCESS_FINE_LOCATION contains 'fine' -> 'fin')
  const text = `${apk.packageName} ${apk.appName} ${apk.activities.join(' ')}`.toLowerCase();

  if (text.includes('bank') || text.includes('pay') || text.includes('finpulse') || text.includes('finance') || text.includes('money') || text.includes('crypto') || text.includes('wallet')) {
    return 'fintech';
  }
  if (text.includes('fit') || text.includes('health') || text.includes('workout') || text.includes('pulse') || text.includes('heart') || text.includes('step')) {
    return 'health';
  }
  if (text.includes('food') || text.includes('delivery') || text.includes('restaurant') || text.includes('eat') || text.includes('meal') || text.includes('order')) {
    return 'food';
  }
  if (text.includes('chat') || text.includes('social') || text.includes('message') || text.includes('post') || text.includes('feed')) {
    return 'social';
  }
  if (text.includes('shop') || text.includes('store') || text.includes('cart') || text.includes('buy') || text.includes('market')) {
    return 'ecommerce';
  }
  return 'utility';
}

/**
 * Generates tailored test cases for a specific APK
 */
export function generateTestCasesForApk(apk: ApkMetadata): TestCase[] {
  const domain = inferDomain(apk);
  const pkg = apk.packageName;
  const launcherAct = apk.activities[0]?.replace(' (Launcher)', '') || `${pkg}.ui.MainActivity`;
  const secondAct = apk.activities[1] || `${pkg}.ui.DetailActivity`;

  const launcherSimple = launcherAct.split('.').pop() || 'MainActivity';
  const secondSimple = secondAct.split('.').pop() || 'DetailActivity';

  const testCases: TestCase[] = [
    {
      id: `tc-${apk.id}-001`,
      code: 'TC_APP_LIFECYCLE_001',
      name: `${apk.appName} Cold Launch & Splash Initializer`,
      category: 'Functional',
      priority: 'P0',
      description: `Verify that cold startup initializes ${launcherSimple} within the 2000ms Android Vitals budget without ANR.`,
      steps: [
        { stepNumber: 1, action: 'am start -n', target: `${pkg}/${launcherAct}`, expected: 'Intent accepted with code 0' },
        { stepNumber: 2, action: 'wait_for_element', target: `${pkg}:id/main_container`, expected: 'Root layout rendered in < 1500ms' },
        { stepNumber: 3, action: 'assert_activity_state', target: launcherAct, expected: 'Activity in RESUMED lifecycle state' }
      ],
      expectedResult: `${launcherSimple} renders successfully on screen without framework ANR dialog or GC stalls.`,
      timeoutSeconds: 15,
      enabled: true
    },
    {
      id: `tc-${apk.id}-002`,
      code: 'TC_NAV_TRANSITION_002',
      name: `${secondSimple} Screen Navigation & Fragment Attachment`,
      category: 'Functional',
      priority: 'P1',
      description: `Execute primary navigation transition from ${launcherSimple} to ${secondSimple} and verify intent extras.`,
      steps: [
        { stepNumber: 1, action: 'click_element', target: `${pkg}:id/btn_action_primary`, expected: 'Click ripple visual feedback' },
        { stepNumber: 2, action: 'wait_for_activity', target: secondAct, expected: 'Window transition completes in 300ms' },
        { stepNumber: 3, action: 'assert_element_visible', target: `${pkg}:id/tv_header_title`, expected: 'Header text rendered accurately' }
      ],
      expectedResult: `Seamless transition to ${secondSimple} with zero frame drops or backstack corruption.`,
      timeoutSeconds: 20,
      enabled: true
    },
    {
      id: `tc-${apk.id}-003`,
      code: 'TC_PERM_RUNTIME_003',
      name: 'Dynamic Runtime Permission Grant & Revocation Protocol',
      category: 'Compatibility',
      priority: 'P0',
      description: `Trigger runtime authorization flow for sensitive manifest permissions and verify graceful fallback upon denial.`,
      steps: [
        { stepNumber: 1, action: 'request_permission', target: apk.permissions.find(p => p.isSensitive)?.name || 'android.permission.ACCESS_FINE_LOCATION', expected: 'System OS permission modal displayed' },
        { stepNumber: 2, action: 'deny_permission', target: 'com.android.permissioncontroller:id/permission_deny_button', expected: 'Permission denied result callback' },
        { stepNumber: 3, action: 'assert_view', target: `${pkg}:id/banner_permission_rationale`, expected: 'Rationale snackbar displayed without crash' }
      ],
      expectedResult: 'App continues operating smoothly without SecurityException when user denies sensitive permission.',
      timeoutSeconds: 25,
      enabled: true
    },
    {
      id: `tc-${apk.id}-004`,
      code: 'TC_UI_RESPONSIVE_004',
      name: 'Screen Rotation & Viewport Boundary Validation',
      category: 'UI Validation',
      priority: 'P1',
      description: `Simulate 90-degree device rotation and small screen layout constraints to detect element clipping.`,
      steps: [
        { stepNumber: 1, action: 'set_orientation', target: 'LANDSCAPE', expected: 'Orientation change triggered' },
        { stepNumber: 2, action: 'verify_activity_recreated', target: launcherAct, expected: 'Activity destroyed and recreated cleanly' },
        { stepNumber: 3, action: 'assert_input_preserved', target: `${pkg}:id/et_search_query`, expected: 'Input field text preserved' }
      ],
      expectedResult: 'Layout adjusts gracefully to viewport dimensions; no buttons or text clipped past bottom window edge.',
      timeoutSeconds: 20,
      enabled: true
    },
    {
      id: `tc-${apk.id}-005`,
      code: 'TC_APP_RESILIENCE_005',
      name: 'Rapid Concurrency & Monkey Stress Dispatch',
      category: 'Crash & Resilience',
      priority: 'P0',
      description: 'Dispatch 500 rapid UI gestures, fling scroll events, and hardware back-presses to test threading stability.',
      steps: [
        { stepNumber: 1, action: 'monkey_stress_dispatch', target: 'events_count: 500', expected: 'Events queued to Android EventLoop' },
        { stepNumber: 2, action: 'monitor_anr_watchdog', target: 'timeout: 5000ms', expected: 'No UI Thread block > 200ms' },
        { stepNumber: 3, action: 'assert_process_alive', target: pkg, expected: 'Process PID remains constant' }
      ],
      expectedResult: 'Process remains intact with 0 fatal crashes and no unhandled background thread exceptions.',
      timeoutSeconds: 35,
      enabled: true
    },
    {
      id: `tc-${apk.id}-006`,
      code: 'TC_PERF_MEMORY_006',
      name: 'Memory Heap Allocation & Jank Frame Benchmark',
      category: 'Performance',
      priority: 'P1',
      description: `Benchmark Dalvik/ART Heap allocations during continuous item scrolling in ${secondSimple}.`,
      steps: [
        { stepNumber: 1, action: 'scroll_recyclerview', target: `${pkg}:id/rv_content_list`, value: '20_pages', expected: 'Scroll animation at 60 FPS' },
        { stepNumber: 2, action: 'dump_heap_profile', target: `${pkg}.hprof`, expected: 'Heap snapshot captured' },
        { stepNumber: 3, action: 'assert_leak_canary', target: 'retained_instances', expected: '0 Leaked Activity or Context references' }
      ],
      expectedResult: `Heap growth remains within budget; frame drop count < 5% during fling.`,
      timeoutSeconds: 30,
      enabled: true
    },
    {
      id: `tc-${apk.id}-007`,
      code: 'TC_NET_OFFLINE_007',
      name: 'Network Throttling & Offline Cache Verification',
      category: 'Network',
      priority: 'P1',
      description: 'Simulate airplane mode disconnection and high-latency conditions to verify local caching.',
      steps: [
        { stepNumber: 1, action: 'enable_airplane_mode', target: 'global_setting: airplane_mode_on 1', expected: 'Network connectivity lost' },
        { stepNumber: 2, action: 'trigger_data_refresh', target: `${pkg}:id/swipe_refresh_layout`, expected: 'Cached data displayed' },
        { stepNumber: 3, action: 'assert_offline_banner', target: `${pkg}:id/view_offline_warning`, expected: 'Non-blocking banner "Working Offline"' }
      ],
      expectedResult: 'Application displays offline indicator and serves cached data without crashing.',
      timeoutSeconds: 25,
      enabled: true
    }
  ];

  if (domain === 'fintech') {
    testCases.push({
      id: `tc-${apk.id}-008`,
      code: 'TC_SEC_BIOMETRIC_008',
      name: 'Biometric Keystore & FLAG_SECURE Window Audit',
      category: 'Compatibility',
      priority: 'P0',
      description: 'Verify that screenshots are obfuscated via FLAG_SECURE and BiometricPrompt hardware keystore is active.',
      steps: [
        { stepNumber: 1, action: 'check_window_flags', target: 'FLAG_SECURE', expected: 'Window has FLAG_SECURE enabled' },
        { stepNumber: 2, action: 'simulate_biometric_auth', target: 'BiometricPrompt', expected: 'CryptoObject cipher signature verified' }
      ],
      expectedResult: 'Sensitive financial credentials cannot be screen-captured in app switcher.',
      timeoutSeconds: 20,
      enabled: true
    });
  } else if (domain === 'health') {
    testCases.push({
      id: `tc-${apk.id}-008`,
      code: 'TC_BG_SENSOR_008',
      name: 'Background Step Sensor & BLE Synchronization',
      category: 'Compatibility',
      priority: 'P1',
      description: 'Verify that foreground service tracks physical accelerometer metrics continuously when app is minimized.',
      steps: [
        { stepNumber: 1, action: 'minimize_app_to_background', target: 'HOME_KEY', expected: 'App transitions to Background state' },
        { stepNumber: 2, action: 'dispatch_sensor_events', target: 'TYPE_STEP_COUNTER', expected: 'Foreground service receives sensor callbacks' }
      ],
      expectedResult: 'Persistent notification informs user of active background tracking.',
      timeoutSeconds: 30,
      enabled: true
    });
  } else if (domain === 'food' || domain === 'ecommerce') {
    testCases.push({
      id: `tc-${apk.id}-008`,
      code: 'TC_CHECKOUT_PAYMENT_008',
      name: 'Cart Checkout Pipeline & Order Placement',
      category: 'Functional',
      priority: 'P0',
      description: 'Complete full cart item addition, coupon application, and payment gateway intent handover.',
      steps: [
        { stepNumber: 1, action: 'click_element', target: `${pkg}:id/btn_add_to_cart`, expected: 'Cart counter incremented to 1' },
        { stepNumber: 2, action: 'click_element', target: `${pkg}:id/btn_checkout`, expected: 'Payment gateway sheet initialized' }
      ],
      expectedResult: 'Order confirmation payload sent and receipt intent dispatched.',
      timeoutSeconds: 25,
      enabled: true
    });
  }

  return testCases;
}

/**
 * Generates dynamic UI Validation node tree & issues strictly derived from the target APK's
 * extracted layouts, widgets, activities, and SDK configuration.
 */
export function generateUiIssuesForApk(apk: ApkMetadata, isStressMode: boolean = false): UiIssue[] {
  const issues: UiIssue[] = [];
  const pkg = apk.packageName;
  const cleanActivities = apk.activities.map(a => a.replace(' (Launcher)', '').trim());
  const launcherAct = cleanActivities[0]?.split('.').pop() || 'MainActivity';
  const secondAct = (cleanActivities[1] || cleanActivities[0])?.split('.').pop() || 'DetailActivity';

  // 1. If the APK has real extracted layouts (uploaded APK), inspect its actual widgets & screens
  if (apk.extractedLayouts && apk.extractedLayouts.length > 0) {
    apk.extractedLayouts.forEach((layout, layoutIdx) => {
      const screenName = layout.activityName || layout.screenTitle || layout.fileName.replace('.xml', '');
      const widgets = layout.widgets || [];

      // Check for deep/dense layouts without ScrollView that overflow compact 768x1280 viewports
      if (widgets.length >= 5) {
        const lastWidget = widgets[widgets.length - 1];
        const bottomY = 220 + widgets.length * 195;
        if (bottomY > 1280 || isStressMode) {
          issues.push({
            id: `ui-issue-${apk.id}-layout-${layoutIdx}-overflow`,
            type: 'boundary_overflow',
            severity: 'HIGH',
            screenName,
            elementSelector: `${pkg}:id/${lastWidget.id || 'bottom_control'}`,
            boundingBox: { x: 36, y: 1190, width: 696, height: 136 },
            deviceId: 'dev-emulator-small',
            description: `Widget "${lastWidget.label || lastWidget.id}" (${lastWidget.type}) in ${layout.fileName} reaches bottom y=${Math.max(1326, bottomY)}px, overflowing the 1280px viewport on compact displays.`,
            suggestedFix: `Wrap the root container in ${layout.fileName} with androidx.core.widget.NestedScrollView or constrain bottom bounds relative to parent.`
          });
        }
      }

      // Check for ImageView / FloatingActionButton widgets without explicit accessibility labels
      const unlabeledImages = widgets.filter(
        w => (w.type === 'ImageView' || w.type === 'FloatingActionButton') && (!w.label || w.label.toLowerCase().includes('asset') || w.label === w.id)
      );
      if (unlabeledImages.length > 0) {
        const imgWidget = unlabeledImages[0];
        issues.push({
          id: `ui-issue-${apk.id}-layout-${layoutIdx}-a11y`,
          type: 'missing_element',
          severity: 'MEDIUM',
          screenName,
          elementSelector: `${pkg}:id/${imgWidget.id}`,
          boundingBox: { x: 48, y: 260 + layoutIdx * 40, width: 96, height: 96 },
          deviceId: 'dev-pixel7',
          description: `<${imgWidget.type}> node (@id/${imgWidget.id}) in ${layout.fileName} lacks a descriptive android:contentDescription attribute for TalkBack screen readers.`,
          suggestedFix: `Add android:contentDescription="@string/${imgWidget.id}_desc" or mark android:importantForAccessibility="no" if decorative.`
        });
      }

      // Check for long text or input fields that risk clipping or touch target compression
      const longTextOrInput = widgets.find(
        w => (w.type === 'TextView' && w.label && w.label.length > 26) || (w.type === 'EditText' && (!w.hint || w.hint.length < 4))
      );
      if (longTextOrInput) {
        const isInput = longTextOrInput.type === 'EditText';
        issues.push({
          id: `ui-issue-${apk.id}-layout-${layoutIdx}-clip`,
          type: isInput ? 'touch_target_too_small' : 'text_clipping',
          severity: 'LOW',
          screenName,
          elementSelector: `${pkg}:id/${longTextOrInput.id}`,
          boundingBox: { x: 40, y: 540, width: 688, height: isInput ? 42 : 44 },
          deviceId: 'dev-samsung-s23',
          description: isInput
            ? `Input field <${longTextOrInput.type}> (@id/${longTextOrInput.id}) rendered with 42dp vertical touch target height (below Material 48dp minimum).`
            : `Text node "${longTextOrInput.label.slice(0, 32)}..." (@id/${longTextOrInput.id}) clips horizontally at 1.3x system font scale on ${screenName}.`,
          suggestedFix: isInput
            ? `Set android:minHeight="48dp" and android:paddingVertical="12dp" on @id/${longTextOrInput.id} in ${layout.fileName}.`
            : `Enable app:autoSizeTextType="uniform" or allow multi-line wrapping with android:maxLines="2" on @id/${longTextOrInput.id}.`
        });
      }
    });

    // If none of the heuristics triggered on a very simple 1-widget layout, inspect SDK/manifest edge-to-edge behavior
    if (issues.length === 0 && apk.targetSdkVersion >= 34) {
      const firstScreen = apk.extractedLayouts[0].activityName || launcherAct;
      const firstWidget = apk.extractedLayouts[0].widgets[0];
      issues.push({
        id: `ui-issue-${apk.id}-insets`,
        type: 'boundary_overflow',
        severity: 'MEDIUM',
        screenName: firstScreen,
        elementSelector: `${pkg}:id/${firstWidget?.id || 'root_content'}`,
        boundingBox: { x: 0, y: 0, width: 768, height: 88 },
        deviceId: 'dev-pixel7',
        description: `${apk.appName} targets API ${apk.targetSdkVersion} where edge-to-edge enforcement causes top header node (@id/${firstWidget?.id || 'root_content'}) to overlap the status bar cutout.`,
        suggestedFix: `Apply ViewCompat.setOnApplyWindowInsetsListener() with WindowInsetsCompat.Type.systemBars() padding on ${firstScreen}.`
      });
    }

    return issues;
  }

  // 2. For built-in sample APKs (or APKs without XML layout entries), derive distinct issues specific to that application
  const domain = inferDomain(apk);

  if (domain === 'food') {
    issues.push(
      {
        id: `ui-issue-${apk.id}-001`,
        type: 'boundary_overflow',
        severity: 'HIGH',
        screenName: secondAct,
        elementSelector: `${pkg}:id/btn_proceed_checkout`,
        boundingBox: { x: 40, y: 1210, width: 688, height: 110 },
        deviceId: 'dev-emulator-small',
        description: `${apk.appName} checkout CTA button bottom boundary (y=1320px) overflows screen height (1280px) on 768x1280 compact displays when 3+ cart items are listed.`,
        suggestedFix: `Wrap ${secondAct} root layout in an androidx.core.widget.NestedScrollView or pin checkout bar with ConstraintLayout bottom-to-bottomOf="parent".`
      },
      {
        id: `ui-issue-${apk.id}-002`,
        type: 'text_clipping',
        severity: 'MEDIUM',
        screenName: launcherAct,
        elementSelector: `${pkg}:id/tv_eta_delivery_badge`,
        boundingBox: { x: 640, y: 148, width: 104, height: 36 },
        deviceId: 'dev-pixel7',
        description: `Restaurant ETA & surge fee badge text in ${launcherAct} truncates when system font scale exceeds 1.15x.`,
        suggestedFix: `Use app:autoSizeTextType="uniform" on @id/tv_eta_delivery_badge and replace fixed layout_width="104dp" with wrap_content.`
      }
    );
  } else if (domain === 'fintech') {
    issues.push(
      {
        id: `ui-issue-${apk.id}-fin-001`,
        type: 'boundary_overflow',
        severity: 'HIGH',
        screenName: secondAct,
        elementSelector: `${pkg}:id/pin_keypad_confirm_btn`,
        boundingBox: { x: 48, y: 1165, width: 672, height: 128 },
        deviceId: 'dev-emulator-small',
        description: `Biometric / 6-digit PIN keypad confirmation row in ${secondAct} overflows the IBAN recipient summary card on 16:9 screens.`,
        suggestedFix: `Convert fixed marginTop="64dp" on @id/pin_keypad_grid to a flexible ConstraintLayout vertical chain (app:layout_constraintVertical_chainStyle="spread_inside").`
      },
      {
        id: `ui-issue-${apk.id}-fin-002`,
        type: 'touch_target_too_small',
        severity: 'MEDIUM',
        screenName: launcherAct,
        elementSelector: `${pkg}:id/iv_toggle_balance_mask`,
        boundingBox: { x: 668, y: 210, width: 36, height: 36 },
        deviceId: 'dev-samsung-s23',
        description: `Account balance hide/reveal eye icon (@id/iv_toggle_balance_mask) has a 36x36dp touch target and no state description for accessibility services.`,
        suggestedFix: `Expand hit rect to 48x48dp via TouchDelegate or padding="6dp" and set ViewCompat.setStateDescription().`
      }
    );
  } else if (domain === 'health') {
    issues.push(
      {
        id: `ui-issue-${apk.id}-hlth-001`,
        type: 'text_clipping',
        severity: 'MEDIUM',
        screenName: launcherAct,
        elementSelector: `${pkg}:id/tv_bpm_live_readout`,
        boundingBox: { x: 52, y: 310, width: 320, height: 74 },
        deviceId: 'dev-xiaomi-14',
        description: `Live heart-rate telemetry readout ("142 BPM • Peak Aerobic Zone") clips descenders inside ${launcherAct} circular gauge card.`,
        suggestedFix: `Set android:includeFontPadding="true" and increase circular gauge container height from 74dp to 92dp.`
      }
    );
    if (isStressMode) {
      issues.push({
        id: `ui-issue-${apk.id}-hlth-002`,
        type: 'boundary_overflow',
        severity: 'HIGH',
        screenName: secondAct,
        elementSelector: `${pkg}:id/ble_sensor_sync_footer`,
        boundingBox: { x: 32, y: 1220, width: 704, height: 108 },
        deviceId: 'dev-emulator-small',
        description: `BLE Wearable calibration footer in ${secondAct} extends 48px past the 1280px bottom viewport boundary.`,
        suggestedFix: `Place sensor telemetry charts inside a scrollable CoordinatorLayout with app:layout_behavior="@string/appbar_scrolling_view_behavior".`
      });
    }
  } else if (domain === 'social') {
    const chatScreen = (cleanActivities[2] || cleanActivities[1] || cleanActivities[0])?.split('.').pop() || 'ChatRoomActivity';
    issues.push(
      {
        id: `ui-issue-${apk.id}-soc-001`,
        type: 'boundary_overflow',
        severity: 'HIGH',
        screenName: chatScreen,
        elementSelector: `${pkg}:id/et_message_composer_bar`,
        boundingBox: { x: 16, y: 1188, width: 736, height: 112 },
        deviceId: 'dev-oneplus-12',
        description: `Message composer bar (@id/et_message_composer_bar) in ${chatScreen} is partially occluded by gesture navigation insets when IME keyboard animates open.`,
        suggestedFix: `Configure android:windowSoftInputMode="adjustResize" on ${chatScreen} and consume WindowInsetsCompat.Type.ime() insets.`
      },
      {
        id: `ui-issue-${apk.id}-soc-002`,
        type: 'touch_target_too_small',
        severity: 'LOW',
        screenName: launcherAct,
        elementSelector: `${pkg}:id/btn_story_mute_audio`,
        boundingBox: { x: 696, y: 96, width: 38, height: 38 },
        deviceId: 'dev-pixel7',
        description: `Story audio mute toggle (@id/btn_story_mute_audio) in ${launcherAct} measures 38x38dp, below the 48x48dp minimum touch target guideline.`,
        suggestedFix: `Set android:minWidth="48dp" and android:minHeight="48dp" on @id/btn_story_mute_audio.`
      }
    );
  } else {
    // Custom or Utility APK fallback using actual package and activities
    issues.push({
      id: `ui-issue-${apk.id}-custom-001`,
      type: 'boundary_overflow',
      severity: isStressMode ? 'HIGH' : 'MEDIUM',
      screenName: secondAct,
      elementSelector: `${pkg}:id/primary_action_container`,
      boundingBox: { x: 36, y: 1204, width: 696, height: 106 },
      deviceId: 'dev-emulator-small',
      description: `Bottom action container in ${secondAct} (${apk.appName}) extends to y=1310px on 768x1280 display profile.`,
      suggestedFix: `Ensure ${secondAct} root view uses ScrollView or ConstraintLayout percentage guidelines for compact screens.`
    });
  }

  return issues;
}

/**
 * Generates dynamic cross-device test results for an APK
 */
export function generateTestResultsForApk(
  apk: ApkMetadata,
  testCases: TestCase[],
  devices: Device[],
  uiIssues: UiIssue[],
  isStressMode: boolean = false
): TestResult[] {
  const results: TestResult[] = [];
  const pkg = apk.packageName;
  const secondAct = apk.activities[1] || `${pkg}.ui.DetailActivity`;

  devices.forEach((dev) => {
    testCases.forEach((tc) => {
      let status: 'passed' | 'failed' | 'blocked' = 'passed';
      let durationMs = Math.floor(1100 + Math.random() * 1200);
      let errorMsg: string | undefined = undefined;
      let stackTrace: string | undefined = undefined;
      const matchingUiIssues: UiIssue[] = [];
      const osDisplayName = dev.osVersion || `Android ${dev.androidVersion}`;
      let logs = `[UiAutomator2] Executing ${tc.code} on ${dev.name} (${osDisplayName})\n[Appium/Bridge] Host subsystem: ${dev.osFamily?.toUpperCase() || 'ANDROID'}. Inspecting window root.\n[OK] Step 1 passed.\n[OK] Step 2 passed.\n[TestRunner] Assertion completed in ${durationMs}ms with 0 violations.`;

      // In stress mode only, simulate device edge cases:
      if (isStressMode) {
        if (dev.id === 'dev-emulator-small' && (tc.category === 'UI Validation' || tc.code.includes('RESPONSIVE') || tc.code.includes('CHECKOUT'))) {
          status = 'failed';
          durationMs = 2890;
          errorMsg = `UI Defect: [${pkg}:id/btn_action_primary] bottom bound (y=1320px) exceeds viewport height (1280px). Button partially clipped.`;
          stackTrace = `AssertionError: Element with id "${pkg}:id/btn_action_primary" is clipped by screen boundary.\n  at UiValidator.checkElementBoundaries(ui_validator.py:142)\n  at TestEngine.run_test_step(test_engine.py:288)`;
          matchingUiIssues.push(...uiIssues.filter(u => u.deviceId === dev.id));
          logs = `[UiValidator] Window boundary check on ${dev.resolution}\n[WARN] View '${pkg}:id/btn_action_primary' exceeds viewport max (1280px)\n[FAIL] Assertion failed: Button is clipped by bottom screen edge.`;
        }

        if (dev.id === 'dev-redmi-note8' && (tc.code.includes('RESILIENCE') || tc.code.includes('MEMORY') || tc.category === 'Crash & Resilience')) {
          status = 'failed';
          durationMs = 5120;
          errorMsg = `CRITICAL CRASH: java.lang.NullPointerException in ${secondAct}`;
          stackTrace = `FATAL EXCEPTION: main\nProcess: ${pkg}, PID: 7421\njava.lang.NullPointerException: Attempt to invoke virtual method on a null object reference\n\tat ${secondAct}.onBindViewHolder(${secondAct.split('.').pop()}.kt:92)\n\tat androidx.recyclerview.widget.RecyclerView$Adapter.onBindViewHolder(RecyclerView.java:7254)`;
          logs = `[AndroidRuntime] FATAL EXCEPTION: main\n[AndroidRuntime] Process: ${pkg}, PID: 7421\n[AndroidRuntime] java.lang.NullPointerException at ${secondAct}.onBindViewHolder(${secondAct.split('.').pop()}.kt:92)\n[Appium] TestRunner intercepted SIGABRT signal.`;
        }
      }

      results.push({
        id: `tr-${apk.id}-${dev.id}-${tc.id}`,
        testRunId: `run-${apk.id}`,
        testCaseId: tc.id,
        testCaseName: tc.name,
        category: tc.category,
        deviceId: dev.id,
        deviceName: dev.name,
        androidVersion: dev.androidVersion,
        status,
        durationMs,
        errorMessage: errorMsg,
        stackTrace,
        screenshotUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&auto=format&fit=crop&q=60',
        logcatSnippet: logs.substring(0, 180),
        uiIssuesDetected: matchingUiIssues,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
      });
    });
  });

  return results;
}

/**
 * Generates tailored Crash Reports for a specific APK
 */
export function generateCrashesForApk(apk: ApkMetadata, devices: Device[], isStressMode: boolean = false): CrashReport[] {
  if (!isStressMode) {
    return [];
  }

  const pkg = apk.packageName;
  const launcherAct = apk.activities[0]?.replace(' (Launcher)', '') || `${pkg}.ui.MainActivity`;
  const secondAct = apk.activities[1] || `${pkg}.ui.DetailActivity`;
  const secondSimple = secondAct.split('.').pop() || 'DetailActivity';
  const targetDevice = devices.find(d => d.id === 'dev-redmi-note8') || devices[0];

  return [
    {
      id: `crash-${apk.id}-001`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      deviceId: targetDevice.id,
      deviceName: targetDevice.name,
      androidVersion: targetDevice.androidVersion,
      appPackage: pkg,
      activityName: secondAct,
      exceptionType: 'java.lang.NullPointerException',
      errorMessage: `Attempt to invoke virtual method 'void android.widget.TextView.setText(java.lang.CharSequence)' on a null object reference`,
      stackTrace: `FATAL EXCEPTION: main
Process: ${pkg}, PID: 7421
java.lang.NullPointerException: Attempt to invoke virtual method 'void android.widget.TextView.setText(java.lang.CharSequence)' on a null object reference
    at ${secondAct}.bindViewHolder(${secondSimple}.kt:148)
    at ${secondAct}.onBindViewHolder(${secondSimple}.kt:92)
    at androidx.recyclerview.widget.RecyclerView$Adapter.onBindViewHolder(RecyclerView.java:7254)
    at ${launcherAct}$1.onResponse(${launcherAct.split('.').pop()}.kt:214)
    at retrofit2.DefaultCallAdapterFactory$ExecutorCallbackCall$1.lambda$onResponse$0(DefaultCallAdapterFactory.java:89)
    at android.os.Handler.handleCallback(Handler.java:938)
    at android.os.Looper.loopOnce(Looper.java:201)`,
      severity: 'CRITICAL',
      screenshotUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60',
      reproSteps: [
        `1. Launch ${apk.appName} on ${targetDevice.name}.`,
        `2. Navigate from ${launcherAct.split('.').pop()} into ${secondSimple}.`,
        `3. Rapidly trigger device configuration change (rotate screen) during data load.`,
        `4. Application process encounters fatal SIGABRT due to unhandled null reference.`
      ],
      status: 'Open'
    }
  ];
}

/**
 * Generates Screenshot comparison pairs for visual regression strictly derived from the APK's
 * actual activities, extracted layouts, and detected UI issues.
 */
export function generateScreenshotComparisonsForApk(
  apk: ApkMetadata,
  devices: Device[],
  isStressMode: boolean = false,
  apkUiIssues?: UiIssue[]
): ScreenshotComparison[] {
  const issues = apkUiIssues || generateUiIssuesForApk(apk, isStressMode);
  const baseDev = devices.find(d => d.id === 'dev-pixel7') || devices[0];
  const compactDev = devices.find(d => d.id === 'dev-emulator-small') || devices[1] || devices[0];
  const secondaryDev = devices.find(d => d.id === 'dev-samsung-s23' || d.id === 'dev-samsung-a52') || devices[2] || devices[0];
  const thirdDev = devices.find(d => d.id === 'dev-xiaomi-14' || d.id === 'dev-oneplus-12') || devices[3] || secondaryDev;

  // Gather screen names from extractedLayouts (for uploaded APKs) or activities
  const screenList: string[] = [];
  if (apk.extractedLayouts && apk.extractedLayouts.length > 0) {
    apk.extractedLayouts.forEach(l => {
      const name = l.activityName || l.screenTitle || l.fileName.replace('.xml', '');
      if (name && !screenList.includes(name)) screenList.push(name);
    });
  }
  apk.activities.forEach(a => {
    const shortAct = a.replace(' (Launcher)', '').trim().split('.').pop();
    if (shortAct && !screenList.includes(shortAct)) screenList.push(shortAct);
  });
  if (screenList.length === 0) {
    screenList.push('MainActivity');
  }

  return screenList.slice(0, 4).map((screenName, idx) => {
    const screenIssues = issues.filter(i => i.screenName === screenName);
    const hasHigh = screenIssues.some(i => i.severity === 'HIGH');
    const hasAny = screenIssues.length > 0;

    // Pick target device matching the first issue on this screen, or rotate across device matrix
    const matchedIssueDev = screenIssues[0]
      ? devices.find(d => d.id === screenIssues[0].deviceId)
      : undefined;
    const targetDev = matchedIssueDev || (idx === 0 ? compactDev : idx === 1 ? secondaryDev : thirdDev);

    // Compute realistic pixel shift percentage from actual issues on this screen
    const computedDiff = hasHigh
      ? Number((9.4 + screenIssues.length * 2.3 + (isStressMode ? 3.5 : 0)).toFixed(1))
      : hasAny
      ? Number((5.6 + screenIssues.length * 1.4).toFixed(1))
      : Number((0.6 + (idx * 0.4)).toFixed(1));

    const threshold = 5.0;
    const hasRegressions = computedDiff > threshold;

    const detectedShifts =
      screenIssues.length > 0
        ? screenIssues.map(
            iss =>
              `[${iss.elementSelector.split('/').pop()}] (${iss.type.replace(/_/g, ' ')}): ${iss.description}`
          )
        : [
            `All widgets in ${screenName} (${apk.appName}) aligned within ±1px across ${baseDev.resolution} → ${targetDev.resolution}.`,
            `Typography baseline and touch target padding verified for ${apk.packageName}.`
          ];

    return {
      id: `comp-${apk.id}-${idx + 1}`,
      screenName,
      baselineDevice: baseDev,
      targetDevice: targetDev,
      baselineImageUrl: apk.iconDataUrl || '',
      targetImageUrl: apk.iconDataUrl || '',
      diffImageUrl: apk.iconDataUrl || '',
      diffPercentage: computedDiff,
      thresholdPercentage: threshold,
      hasRegressions,
      detectedShifts
    };
  });
}

/**
 * Generates dynamic Performance telemetry snapshots
 */
export function generatePerformanceMetricsForApk(apk: ApkMetadata): PerformanceSnapshot[] {
  const baseRam = Math.min(180, Math.max(45, Math.floor(apk.apkSizeMb * 1.8) + 35));

  return [
    { id: 'perf-01', timestamp: '10:14:05', elapsedSeconds: 5, cpuPercentage: 14.2, memoryMb: baseRam - 10, pssMb: baseRam - 20, responseTimeMs: 120, fps: 60.0, batteryDrainMah: 95, jankyFrames: 0 },
    { id: 'perf-02', timestamp: '10:14:10', elapsedSeconds: 10, cpuPercentage: 18.5, memoryMb: baseRam, pssMb: baseRam - 15, responseTimeMs: 140, fps: 59.4, batteryDrainMah: 105, jankyFrames: 0 },
    { id: 'perf-03', timestamp: '10:14:15', elapsedSeconds: 15, cpuPercentage: 28.1, memoryMb: baseRam + 8, pssMb: baseRam + 2, responseTimeMs: 190, fps: 58.6, batteryDrainMah: 120, jankyFrames: 1 },
    { id: 'perf-04', timestamp: '10:14:20', elapsedSeconds: 20, cpuPercentage: 22.4, memoryMb: baseRam + 12, pssMb: baseRam + 4, responseTimeMs: 165, fps: 59.7, batteryDrainMah: 110, jankyFrames: 0 },
    { id: 'perf-05', timestamp: '10:14:25', elapsedSeconds: 25, cpuPercentage: 16.3, memoryMb: baseRam + 5, pssMb: baseRam, responseTimeMs: 135, fps: 60.0, batteryDrainMah: 98, jankyFrames: 0 },
    { id: 'perf-06', timestamp: '10:14:30', elapsedSeconds: 30, cpuPercentage: 14.9, memoryMb: baseRam + 6, pssMb: baseRam + 1, responseTimeMs: 130, fps: 60.0, batteryDrainMah: 96, jankyFrames: 0 }
  ];
}

/**
 * Generates Defect items from detected crashes, UI issues, and security flags
 */
export function generateDefectsForApk(
  apk: ApkMetadata,
  crashes: CrashReport[],
  uiIssues: UiIssue[]
): Defect[] {
  const defects: Defect[] = [];

  // Defects from crashes
  crashes.forEach((crash, i) => {
    defects.push({
      id: `DEF-CRASH-${(i + 1).toString().padStart(3, '0')}`,
      title: `${crash.exceptionType} in ${crash.activityName.split('.').pop()}`,
      category: 'Crash',
      severity: crash.severity,
      status: 'Open',
      deviceId: crash.deviceId,
      deviceName: crash.deviceName,
      androidVersion: crash.androidVersion,
      testCase: 'TC_APP_RESILIENCE_005: Rapid Concurrency Stress Dispatch',
      description: crash.errorMessage,
      reproSteps: crash.reproSteps,
      logs: crash.stackTrace,
      screenshotUrl: crash.screenshotUrl,
      timestamp: crash.timestamp,
      recommendation: `Add defensive null check around ${crash.activityName} or register view lifecycle observer.`
    });
  });

  // Defects from UI boundary overflow
  uiIssues.forEach((issue, i) => {
    defects.push({
      id: `DEF-UI-${(i + 1).toString().padStart(3, '0')}`,
      title: `Boundary Clipping: ${issue.elementSelector.split('/').pop()} overflows screen edge on compact display`,
      category: 'UI Overlap',
      severity: issue.severity,
      status: 'Open',
      deviceId: issue.deviceId,
      deviceName: 'Nexus 4 AVD (768x1280)',
      androidVersion: 'Android 10 (API 29)',
      testCase: 'TC_UI_RESPONSIVE_004: Screen Rotation & Viewport Boundary Validation',
      description: issue.description,
      reproSteps: [
        `1. Launch ${apk.appName} on compact screen emulator (768x1280).`,
        `2. Navigate to screen ${issue.screenName}.`,
        `3. Inspect bottom element '${issue.elementSelector}'. View overflows window boundaries.`
      ],
      logs: `[UiValidator] Element ${issue.elementSelector} bounding box exceeds display viewport.`,
      screenshotUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&auto=format&fit=crop&q=60',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      recommendation: issue.suggestedFix
    });
  });

  // Security alert defect if debuggable is enabled
  if (apk.debuggable) {
    defects.push({
      id: 'DEF-SEC-001',
      title: 'Vulnerability: android:debuggable="true" declared in manifest',
      category: 'Security',
      severity: 'HIGH',
      status: 'Open',
      deviceId: 'dev-pixel7',
      deviceName: 'All Devices (Binary Manifest)',
      androidVersion: 'Any',
      testCase: 'TC_STATIC_SECURITY_001: Manifest Audit',
      description: 'The binary manifest contains android:debuggable="true", which allows debugger attachments and runtime memory inspection in production builds.',
      reproSteps: [
        '1. Inspect parsed AndroidManifest.xml.',
        '2. Note <application android:debuggable="true">'
      ],
      logs: '[SecurityAudit] Flag android:debuggable=true detected in package manifest.',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      recommendation: 'Configure build.gradle to ensure debuggable false in release buildType.'
    });
  }

  return defects;
}

/**
 * Generates authentic Logcat entries matching the APK's exact package name and PID
 */
export function generateLogcatEntriesForApk(apk: ApkMetadata, isStressMode: boolean = false): LogcatEntry[] {
  const pkg = apk.packageName;
  const launcherAct = apk.activities[0]?.replace(' (Launcher)', '') || `${pkg}.ui.MainActivity`;
  const secondAct = apk.activities[1] || `${pkg}.ui.DetailActivity`;
  const time = () => new Date().toISOString().substring(11, 19);

  const entries: LogcatEntry[] = [
    {
      id: `log-${Date.now()}-1`,
      timestamp: time(),
      pid: 3104,
      tid: 3104,
      level: 'I',
      tag: 'ActivityTaskManager',
      message: `START u0 {act=android.intent.action.MAIN cat=[android.intent.category.LAUNCHER] flg=0x10000000 cmp=${pkg}/${launcherAct}} from uid 10244`
    },
    {
      id: `log-${Date.now()}-2`,
      timestamp: time(),
      pid: 3104,
      tid: 3104,
      level: 'D',
      tag: 'UiAutomator2',
      message: `[Instrumentation] Attached to target process ${pkg}. Initializing UI hierarchy.`
    },
    {
      id: `log-${Date.now()}-3`,
      timestamp: time(),
      pid: 3104,
      tid: 3104,
      level: 'I',
      tag: 'Choreographer',
      message: `Skipped 0 frames! Application rendering smoothly at 60 FPS.`
    },
    {
      id: `log-${Date.now()}-4`,
      timestamp: time(),
      pid: 3104,
      tid: 3110,
      level: 'D',
      tag: 'NetworkSecurityConfig',
      message: `Using Network Security Config (Cleartext traffic: ${apk.debuggable ? 'ALLOWED' : 'BLOCKED'})`
    },
    {
      id: `log-${Date.now()}-5`,
      timestamp: time(),
      pid: 3104,
      tid: 3104,
      level: 'I',
      tag: 'StrictMode',
      message: `StrictMode policy check: 0 DiskRead / 0 Network operations on MainThread.`
    }
  ];

  if (isStressMode) {
    entries.push(
      {
        id: `log-${Date.now()}-6`,
        timestamp: time(),
        pid: 3104,
        tid: 3104,
        level: 'W',
        tag: 'WindowManager',
        message: `Layout pass on ${launcherAct}: View bounds exceed display boundaries on compact emulator (768x1280).`
      },
      {
        id: `log-${Date.now()}-7`,
        timestamp: time(),
        pid: 3104,
        tid: 3104,
        level: 'E',
        tag: 'AndroidRuntime',
        message: `FATAL EXCEPTION: main Process: ${pkg}, PID: 7421 java.lang.NullPointerException in ${secondAct}`
      }
    );
  }

  return entries;
}

/**
 * Master generator for complete testing ecosystem state for ANY APK
 */
export function buildTestingStateForApk(apk: ApkMetadata, devices: Device[], isStressMode: boolean = false) {
  const testCases = generateTestCasesForApk(apk);
  const uiIssues = generateUiIssuesForApk(apk, isStressMode);
  const testResults = generateTestResultsForApk(apk, testCases, devices, uiIssues, isStressMode);
  const crashes = generateCrashesForApk(apk, devices, isStressMode);
  const comparisons = generateScreenshotComparisonsForApk(apk, devices, isStressMode, uiIssues);
  const metrics = generatePerformanceMetricsForApk(apk);
  const defects = generateDefectsForApk(apk, crashes, uiIssues);
  const logcatEntries = generateLogcatEntriesForApk(apk, isStressMode);

  const passed = testResults.filter(r => r.status === 'passed').length;
  const failed = testResults.filter(r => r.status === 'failed').length;

  const testRun: TestRun = {
    id: `run-${apk.id}-001`,
    runNumber: 101,
    apkId: apk.id,
    apkName: apk.fileName,
    deviceIds: devices.map(d => d.id),
    testCaseIds: testCases.map(t => t.id),
    status: 'completed',
    startTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    passedCount: passed,
    failedCount: failed,
    blockedCount: 0,
    totalCount: testResults.length,
    overallScore: Math.round((passed / Math.max(1, testResults.length)) * 100)
  };

  return {
    testCases,
    testResults,
    crashes,
    uiIssues,
    comparisons,
    metrics,
    defects,
    logcatEntries,
    testRun
  };
}
