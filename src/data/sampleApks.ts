import { ApkMetadata } from '../types';

export const SAMPLE_APKS: ApkMetadata[] = [
  {
    id: 'apk-demo-fooddelivery',
    fileName: 'FoodDelivery_v2.1_debug.apk',
    appName: 'FoodExpress Delivery',
    packageName: 'com.foodexpress.delivery.app',
    versionName: '2.1.0',
    versionCode: 2104,
    minSdkVersion: 24,
    minSdkName: 'Android 7.0 (Nougat)',
    targetSdkVersion: 34,
    targetSdkName: 'Android 14 (Upside Down Cake)',
    apkSizeMb: 48.6,
    md5Hash: '7b28f902ac791a8c9e8312e4f501bd29',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    permissions: [
      { name: 'android.permission.INTERNET', isSensitive: false, category: 'Normal', description: 'Allows applications to open network sockets' },
      { name: 'android.permission.ACCESS_FINE_LOCATION', isSensitive: true, category: 'Dangerous', description: 'Allows app to access precise GPS location for delivery tracking' },
      { name: 'android.permission.ACCESS_COARSE_LOCATION', isSensitive: true, category: 'Dangerous', description: 'Allows app to access approximate cell/wifi location' },
      { name: 'android.permission.CAMERA', isSensitive: true, category: 'Dangerous', description: 'Required for scanning QR codes at pickup stations' },
      { name: 'android.permission.POST_NOTIFICATIONS', isSensitive: false, category: 'Dangerous', description: 'Allows app to send order arrival and discount alerts' },
      { name: 'android.permission.READ_EXTERNAL_STORAGE', isSensitive: true, category: 'Dangerous', description: 'Allows reading cached meal images and receipts' },
      { name: 'android.permission.WAKE_LOCK', isSensitive: false, category: 'Normal', description: 'Keeps CPU awake during live GPS turn-by-turn navigation' },
      { name: 'android.permission.VIBRATE', isSensitive: false, category: 'Normal', description: 'Haptic feedback on item selection' }
    ],
    activities: [
      'com.foodexpress.delivery.ui.SplashActivity (Main/Launcher)',
      'com.foodexpress.delivery.ui.AuthActivity',
      'com.foodexpress.delivery.ui.HomeDashboardActivity',
      'com.foodexpress.delivery.ui.RestaurantDetailActivity',
      'com.foodexpress.delivery.ui.CartCheckoutActivity',
      'com.foodexpress.delivery.ui.PaymentGatewayActivity',
      'com.foodexpress.delivery.ui.LiveTrackingActivity',
      'com.foodexpress.delivery.ui.UserProfileActivity'
    ],
    services: [
      'com.foodexpress.delivery.service.LocationTrackingService (Foreground)',
      'com.foodexpress.delivery.service.FirebasePushService',
      'com.foodexpress.delivery.service.SyncCartService'
    ],
    receivers: [
      'com.foodexpress.delivery.receiver.NetworkChangeReceiver',
      'com.foodexpress.delivery.receiver.BootCompleteReceiver',
      'com.foodexpress.delivery.receiver.GeofenceBroadcastReceiver'
    ],
    exportedComponentsCount: 4,
    debuggable: true,
    permissionRiskScore: 68,
    securityAlerts: [
      'Application has android:debuggable="true" enabled. Strip before production release.',
      '3 dangerous runtime permissions (ACCESS_FINE_LOCATION, CAMERA, READ_EXTERNAL_STORAGE) detected.',
      'Exported receiver "BootCompleteReceiver" lacks explicit permission filter protection.'
    ]
  },
  {
    id: 'apk-fintech-bank',
    fileName: 'FinPulse_Bank_Secure_v1.4.apk',
    appName: 'FinPulse Mobile Banking',
    packageName: 'com.finpulse.bank.secure',
    versionName: '1.4.2',
    versionCode: 1420,
    minSdkVersion: 26,
    minSdkName: 'Android 8.0 (Oreo)',
    targetSdkVersion: 34,
    targetSdkName: 'Android 14',
    apkSizeMb: 32.4,
    md5Hash: 'a58f9104c882190bb10928374d9e1122',
    sha256Hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    permissions: [
      { name: 'android.permission.INTERNET', isSensitive: false, category: 'Normal', description: 'Secure encrypted TLS 1.3 socket communication' },
      { name: 'android.permission.USE_BIOMETRIC', isSensitive: true, category: 'Dangerous', description: 'Biometric fingerprint / face unlock authentication' },
      { name: 'android.permission.ACCESS_NETWORK_STATE', isSensitive: false, category: 'Normal', description: 'Monitor connectivity switches for transaction safety' },
      { name: 'android.permission.READ_PHONE_STATE', isSensitive: true, category: 'Dangerous', description: 'Hardware IMEI / SIM binding for anti-fraud device fingerprinting' },
      { name: 'android.permission.RECEIVE_SMS', isSensitive: true, category: 'Dangerous', description: 'Auto-detect banking OTP verification messages' }
    ],
    activities: [
      'com.finpulse.bank.ui.LockScreenPinActivity (Launcher)',
      'com.finpulse.bank.ui.AccountOverviewActivity',
      'com.finpulse.bank.ui.TransferFundsActivity',
      'com.finpulse.bank.ui.UpiQrScannerActivity',
      'com.finpulse.bank.ui.StatementDownloadActivity'
    ],
    services: [
      'com.finpulse.bank.security.RootDetectionService',
      'com.finpulse.bank.security.SessionTimeoutService'
    ],
    receivers: [
      'com.finpulse.bank.receiver.SmsOtpReceiver'
    ],
    exportedComponentsCount: 1,
    debuggable: false,
    permissionRiskScore: 42,
    securityAlerts: [
      'RECEIVE_SMS requires Google Play Store sensitive permission approval waiver.',
      'FLAG_SECURE is enforced to disable screenshots on transaction screens.'
    ]
  },
  {
    id: 'apk-fitness-pulse',
    fileName: 'HealthFit_Pulse_v3.0.apk',
    appName: 'HealthFit Pulse Tracker',
    packageName: 'org.healthfit.pulse.wearable',
    versionName: '3.0.1',
    versionCode: 3010,
    minSdkVersion: 23,
    minSdkName: 'Android 6.0 (Marshmallow)',
    targetSdkVersion: 33,
    targetSdkName: 'Android 13',
    apkSizeMb: 61.2,
    md5Hash: '3c8109d949b9101ff80010992384a28f',
    sha256Hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    permissions: [
      { name: 'android.permission.INTERNET', isSensitive: false, category: 'Normal', description: 'Cloud sync' },
      { name: 'android.permission.ACTIVITY_RECOGNITION', isSensitive: true, category: 'Dangerous', description: 'Physical step count and motion detection' },
      { name: 'android.permission.BODY_SENSORS', isSensitive: true, category: 'Dangerous', description: 'Heart rate and ECG sensor access' },
      { name: 'android.permission.BLUETOOTH_CONNECT', isSensitive: true, category: 'Dangerous', description: 'Pairing with BLE smartwatch bands' },
      { name: 'android.permission.ACCESS_FINE_LOCATION', isSensitive: true, category: 'Dangerous', description: 'Outdoor running GPS mapping' }
    ],
    activities: [
      'org.healthfit.pulse.ui.MainActivity',
      'org.healthfit.pulse.ui.LiveWorkoutActivity',
      'org.healthfit.pulse.ui.HeartRateGraphActivity',
      'org.healthfit.pulse.ui.SleepAnalysisActivity'
    ],
    services: [
      'org.healthfit.pulse.service.BleSyncService',
      'org.healthfit.pulse.service.StepCounterService'
    ],
    receivers: [
      'org.healthfit.pulse.receiver.StepAlertReceiver'
    ],
    exportedComponentsCount: 2,
    debuggable: false,
    permissionRiskScore: 55,
    securityAlerts: [
      'BODY_SENSORS runtime permissions require prominent disclosure dialog before prompt.',
      'MinSDK 23 targets legacy devices without Scoped Storage constraints.'
    ]
  },
  {
    id: 'apk-social-chatsphere',
    fileName: 'ChatSphere_Messenger_v4.2.apk',
    appName: 'ChatSphere Social',
    packageName: 'io.chatsphere.social.connect',
    versionName: '4.2.0',
    versionCode: 4208,
    minSdkVersion: 26,
    minSdkName: 'Android 8.0 (Oreo)',
    targetSdkVersion: 35,
    targetSdkName: 'Android 15 (Vanilla Ice Cream)',
    apkSizeMb: 54.8,
    md5Hash: '9d124a8c71e0944b5218a92b0e123456',
    sha256Hash: '7a91c82b44e0192837465fa9102837465bcdef01928374655647382910abcdef',
    permissions: [
      { name: 'android.permission.INTERNET', isSensitive: false, category: 'Normal', description: 'Real-time WebSocket message & feed streaming' },
      { name: 'android.permission.CAMERA', isSensitive: true, category: 'Dangerous', description: 'Capture stories, reels, and video call streams' },
      { name: 'android.permission.RECORD_AUDIO', isSensitive: true, category: 'Dangerous', description: 'Voice notes and encrypted audio calling' },
      { name: 'android.permission.READ_CONTACTS', isSensitive: true, category: 'Dangerous', description: 'Discover friends from address book' },
      { name: 'android.permission.POST_NOTIFICATIONS', isSensitive: false, category: 'Dangerous', description: 'Direct message and mention push notifications' }
    ],
    activities: [
      'io.chatsphere.social.ui.FeedTimelineActivity (Launcher)',
      'io.chatsphere.social.ui.DirectMessageThreadActivity',
      'io.chatsphere.social.ui.CreateStoryCameraActivity',
      'io.chatsphere.social.ui.UserProfileSettingsActivity'
    ],
    services: [
      'io.chatsphere.social.service.WebSocketMessagingService',
      'io.chatsphere.social.service.MediaUploadWorkerService'
    ],
    receivers: [
      'io.chatsphere.social.receiver.PushReplyActionReceiver'
    ],
    exportedComponentsCount: 3,
    debuggable: false,
    permissionRiskScore: 52,
    securityAlerts: [
      'CAMERA, RECORD_AUDIO, and READ_CONTACTS require runtime permission rationale dialogs.',
      'Deep link intent filter on FeedTimelineActivity should enforce autoVerify="true".'
    ]
  },
  {
    id: 'apk-utility-omnivault',
    fileName: 'OmniVault_System_Tools_v2.8.apk',
    appName: 'OmniVault System Utility',
    packageName: 'com.omnivault.tools.manager',
    versionName: '2.8.4',
    versionCode: 2840,
    minSdkVersion: 24,
    minSdkName: 'Android 7.0 (Nougat)',
    targetSdkVersion: 34,
    targetSdkName: 'Android 14 (Upside Down Cake)',
    apkSizeMb: 19.4,
    md5Hash: '4e88120c9a71b2389012f8c7123490ab',
    sha256Hash: '1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
    permissions: [
      { name: 'android.permission.INTERNET', isSensitive: false, category: 'Normal', description: 'Cloud backup synchronization' },
      { name: 'android.permission.READ_EXTERNAL_STORAGE', isSensitive: true, category: 'Dangerous', description: 'Analyze storage partitions and duplicate files' },
      { name: 'android.permission.USE_BIOMETRIC', isSensitive: true, category: 'Normal', description: 'Hardware vault encryption unlock' },
      { name: 'android.permission.FOREGROUND_SERVICE', isSensitive: false, category: 'Normal', description: 'Background archive compression task' }
    ],
    activities: [
      'com.omnivault.tools.ui.StorageAnalyzerActivity (Launcher)',
      'com.omnivault.tools.ui.EncryptedVaultActivity',
      'com.omnivault.tools.ui.NetworkPingDiagnosticsActivity',
      'com.omnivault.tools.ui.SystemSettingsActivity'
    ],
    services: [
      'com.omnivault.tools.service.FileIndexerService'
    ],
    receivers: [
      'com.omnivault.tools.receiver.StorageLowWarningReceiver'
    ],
    exportedComponentsCount: 1,
    debuggable: false,
    permissionRiskScore: 34,
    securityAlerts: [
      'Scoped Storage enforcement on Android 11+ restricts broad filesystem scanning without MANAGE_EXTERNAL_STORAGE.'
    ]
  }
];

