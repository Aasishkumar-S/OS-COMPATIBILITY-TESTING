import React, { useState, useEffect, useRef } from 'react';
import {
  Smartphone,
  RotateCw,
  Wifi,
  WifiOff,
  Shield,
  Play,
  CheckCircle2,
  Eye,
  Layers,
  Terminal,
  ArrowLeft,
  Search,
  Send,
  Laptop,
  Server,
  Minus,
  Square as SquareIcon,
  X,
  Sliders,
  Cpu,
  Upload,
  ShoppingBag,
  CreditCard,
  Heart,
  MessageSquare,
  FolderLock,
  Plus,
  Check,
  Bell,
  Settings,
  User,
  Lock,
  Activity,
  Radio
} from 'lucide-react';
import { ApkMetadata, PermissionItem, OsFamily, Device } from '../types';
import { inferDomain } from '../services/apkTestSuiteGenerator';

interface LiveAppSimulatorProps {
  apk: ApkMetadata;
  allApks?: ApkMetadata[];
  devices?: Device[];
  onSelectApk?: (apk: ApkMetadata) => void;
  onUploadCustomApk?: (file: File) => void;
  onNavigateToTab?: (tab: any) => void;
}

export type SimulatedOsVersion =
  | 'samsung-oneui-6'
  | 'xiaomi-hyperos'
  | 'oneplus-oxygenos-14'
  | 'nothing-os-26'
  | 'google-pixel-a15'
  | 'redmi-miui-14'
  | 'windows-11-wsa'
  | 'windows-10-vm'
  | 'linux-waydroid-ubuntu'
  | 'linux-kvm-debian';

interface OsMetadata {
  id: SimulatedOsVersion;
  family: OsFamily;
  brand: string;
  deviceModel: string;
  skinName: string;
  title: string;
  badge: string;
  apiLevel: number;
  androidVersion: string;
  arch: string;
  kernel: string;
  graphicsDriver: string;
  frameRadius: string;
  accentColor: string;
  statusBarStyle: 'oneui' | 'hyperos' | 'oxygenos' | 'nothing' | 'pixel' | 'desktop';
}

const OS_METADATA_MAP: Record<SimulatedOsVersion, OsMetadata> = {
  'samsung-oneui-6': {
    id: 'samsung-oneui-6',
    family: 'android',
    brand: 'Samsung',
    deviceModel: 'Galaxy S24 Ultra',
    skinName: 'One UI 6.1',
    title: 'Samsung Galaxy S24 Ultra (One UI 6.1)',
    badge: 'One UI 6.1 · API 34',
    apiLevel: 34,
    androidVersion: 'Android 14 (One UI 6.1)',
    arch: 'arm64-v8a',
    kernel: 'Linux 6.1.57-android14-s24ultra',
    graphicsDriver: 'Adreno 750 (Snapdragon 8 Gen 3)',
    frameRadius: 'rounded-[22px]',
    accentColor: 'bg-blue-600',
    statusBarStyle: 'oneui'
  },
  'xiaomi-hyperos': {
    id: 'xiaomi-hyperos',
    family: 'android',
    brand: 'Xiaomi',
    deviceModel: 'Xiaomi 14 Pro',
    skinName: 'HyperOS 1.0',
    title: 'Xiaomi 14 Pro (Xiaomi HyperOS 1.0)',
    badge: 'HyperOS 1.0 · API 34',
    apiLevel: 34,
    androidVersion: 'Android 14 (HyperOS 1.0.9)',
    arch: 'arm64-v8a',
    kernel: 'Linux 6.1.68-xiaomi-hyperos',
    graphicsDriver: 'Adreno 750 / Mi HyperCore',
    frameRadius: 'rounded-[38px]',
    accentColor: 'bg-indigo-600',
    statusBarStyle: 'hyperos'
  },
  'oneplus-oxygenos-14': {
    id: 'oneplus-oxygenos-14',
    family: 'android',
    brand: 'OnePlus',
    deviceModel: 'OnePlus 12 5G',
    skinName: 'OxygenOS 14',
    title: 'OnePlus 12 5G (OxygenOS 14.0)',
    badge: 'OxygenOS 14 · API 34',
    apiLevel: 34,
    androidVersion: 'Android 14 (OxygenOS 14)',
    arch: 'arm64-v8a',
    kernel: 'Linux 6.1.62-trinity-engine',
    graphicsDriver: 'Adreno 750 / HyperBoost',
    frameRadius: 'rounded-[36px]',
    accentColor: 'bg-emerald-600',
    statusBarStyle: 'oxygenos'
  },
  'nothing-os-26': {
    id: 'nothing-os-26',
    family: 'android',
    brand: 'Nothing',
    deviceModel: 'Nothing Phone (2)',
    skinName: 'Nothing OS 2.6',
    title: 'Nothing Phone (2) (Nothing OS 2.6)',
    badge: 'Nothing OS 2.6 · API 34',
    apiLevel: 34,
    androidVersion: 'Android 14 (Nothing OS 2.6)',
    arch: 'arm64-v8a',
    kernel: 'Linux 5.15.128-nothing-pong',
    graphicsDriver: 'Adreno 730 / Glyph Matrix Composer',
    frameRadius: 'rounded-[36px]',
    accentColor: 'bg-slate-900',
    statusBarStyle: 'nothing'
  },
  'google-pixel-a15': {
    id: 'google-pixel-a15',
    family: 'android',
    brand: 'Google',
    deviceModel: 'Pixel 9 Pro',
    skinName: 'Pixel UI',
    title: 'Google Pixel 9 Pro (Android 15)',
    badge: 'Pixel UI · API 35',
    apiLevel: 35,
    androidVersion: 'Android 15 (Vanilla Ice Cream)',
    arch: 'arm64-v8.2a',
    kernel: 'Linux 6.1.84-android15-caiman',
    graphicsDriver: 'Google Tensor G4 Mali-G715',
    frameRadius: 'rounded-[40px]',
    accentColor: 'bg-blue-600',
    statusBarStyle: 'pixel'
  },
  'redmi-miui-14': {
    id: 'redmi-miui-14',
    family: 'android',
    brand: 'Xiaomi Redmi',
    deviceModel: 'Redmi Note 12',
    skinName: 'MIUI 14',
    title: 'Xiaomi Redmi Note 12 (MIUI 14)',
    badge: 'MIUI 14 · API 31',
    apiLevel: 31,
    androidVersion: 'Android 12 (MIUI 14.0.4)',
    arch: 'arm64-v8a',
    kernel: 'Linux 5.4.210-miui-tapas',
    graphicsDriver: 'Adreno 610 / OpenGL ES 3.2',
    frameRadius: 'rounded-[32px]',
    accentColor: 'bg-blue-600',
    statusBarStyle: 'hyperos'
  },
  'windows-11-wsa': {
    id: 'windows-11-wsa',
    family: 'windows',
    brand: 'Microsoft',
    deviceModel: 'Windows 11 WSA',
    skinName: 'WSA 2311',
    title: 'Windows 11 WSA 2311 (Subsystem for Android)',
    badge: 'Windows 11 · Direct3D 12',
    apiLevel: 33,
    androidVersion: '13.0 (WSA Host)',
    arch: 'x86_64',
    kernel: 'Windows NT 10.0.22631 / Hyper-V',
    graphicsDriver: 'Direct3D 12 GPU Passthrough (WDDM 3.1)',
    frameRadius: 'rounded-xl',
    accentColor: 'bg-blue-600',
    statusBarStyle: 'desktop'
  },
  'windows-10-vm': {
    id: 'windows-10-vm',
    family: 'windows',
    brand: 'Microsoft',
    deviceModel: 'Windows 10 Hyper-V',
    skinName: 'Hyper-V VM',
    title: 'Windows 10 Hyper-V Genymotion',
    badge: 'Windows 10 · x86_64 VM',
    apiLevel: 32,
    androidVersion: '12.0 (x86 VM)',
    arch: 'x86_64',
    kernel: 'Windows NT 10.0.19045 / Genymobile',
    graphicsDriver: 'DirectX 11 Hardware Acceleration',
    frameRadius: 'rounded-xl',
    accentColor: 'bg-blue-600',
    statusBarStyle: 'desktop'
  },
  'linux-waydroid-ubuntu': {
    id: 'linux-waydroid-ubuntu',
    family: 'linux',
    brand: 'Canonical',
    deviceModel: 'Ubuntu 24.04 Waydroid',
    skinName: 'Waydroid LXC',
    title: 'Ubuntu 24.04 LTS (Waydroid Container)',
    badge: 'Ubuntu 24.04 · Wayland LXC',
    apiLevel: 33,
    androidVersion: '13.0 (Waydroid LineageOS)',
    arch: 'x86_64',
    kernel: 'Linux 6.8.0-generic (Ubuntu)',
    graphicsDriver: 'Mesa 24.1.0-devel / Vulkan Wayland Bridge',
    frameRadius: 'rounded-xl',
    accentColor: 'bg-amber-600',
    statusBarStyle: 'desktop'
  },
  'linux-kvm-debian': {
    id: 'linux-kvm-debian',
    family: 'linux',
    brand: 'Debian',
    deviceModel: 'Debian 12 KVM',
    skinName: 'QEMU-KVM',
    title: 'Debian 12 / Arch Linux (QEMU-KVM)',
    badge: 'Debian 12 · KVM Host Passthrough',
    apiLevel: 30,
    androidVersion: '11.0 (AOSP Container)',
    arch: 'x86_64',
    kernel: 'Linux 6.1.0-18-amd64 (Debian)',
    graphicsDriver: 'VirGL 3D Mesa Driver',
    frameRadius: 'rounded-xl',
    accentColor: 'bg-amber-600',
    statusBarStyle: 'desktop'
  }
};

export const LiveAppSimulator: React.FC<LiveAppSimulatorProps> = ({
  apk,
  allApks = [],
  devices = [],
  onSelectApk,
  onUploadCustomApk,
  onNavigateToTab
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [currentOs, setCurrentOs] = useState<SimulatedOsVersion>('samsung-oneui-6');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [showInspector, setShowInspector] = useState<boolean>(false);
  const [activeActivityIndex, setActiveActivityIndex] = useState<number>(0);

  // Interactive Domain States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [counter, setCounter] = useState<number>(0);
  const [cartItems, setCartItems] = useState<{ name: string; price: number; qty: number }[]>([
    { name: 'Signature Ramen Bowl', price: 14.5, qty: 1 },
    { name: 'Crispy Gyoza (6 pcs)', price: 7.0, qty: 1 }
  ]);
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [bankBalance, setBankBalance] = useState<number>(24850.0);
  const [transferAmount, setTransferAmount] = useState<string>('120.00');
  const [transferRecipient, setTransferRecipient] = useState<string>('alex.morgan@okbank');
  const [transferSuccess, setTransferSuccess] = useState<boolean>(false);
  const [heartRateBpm, setHeartRateBpm] = useState<number>(74);
  const [stepCount, setStepCount] = useState<number>(8420);
  const [workoutActive, setWorkoutActive] = useState<boolean>(false);
  const [socialPosts, setSocialPosts] = useState<{ id: string; author: string; handle: string; text: string; likes: number; liked: boolean }[]>([
    { id: 'p1', author: 'Maya Lin', handle: '@mayalin_dev', text: 'Testing cross-OS rendering on Samsung One UI 6.1 and Xiaomi HyperOS. Zero frame drops at 120Hz!', likes: 48, liked: false },
    { id: 'p2', author: 'Arjun Mehta', handle: '@arjun_qa', text: 'Just pushed build v4.2 with WebSocket end-to-end encryption.', likes: 19, liked: true }
  ]);
  const [chatMessages, setChatMessages] = useState<{ sender: 'me' | 'peer'; text: string; time: string }[]>([
    { sender: 'peer', text: 'Hey! Did the new APK pass the Samsung & OnePlus UI boundary checks?', time: '09:38' },
    { sender: 'me', text: 'Running it live in the sandbox right now.', time: '09:40' }
  ]);
  const [customRecords, setCustomRecords] = useState<{ id: string; title: string; status: string }[]>([]);
  const [widgetInputValues, setWidgetInputValues] = useState<Record<string, string>>({});
  const [widgetToggleStates, setWidgetToggleStates] = useState<Record<string, boolean>>({});
  const [customScreenViewMode, setCustomScreenViewMode] = useState<'layout' | 'resources' | 'webview'>('layout');

  // Runtime Permission Dialog State
  const [activePermissionPrompt, setActivePermissionPrompt] = useState<PermissionItem | null>(null);
  const [grantedPermissions, setGrantedPermissions] = useState<Record<string, boolean>>({});
  const [isRunningWalkthrough, setIsRunningWalkthrough] = useState<boolean>(false);
  const [walkthroughStep, setWalkthroughStep] = useState<number>(0);

  const selectedOsMeta = OS_METADATA_MAP[currentOs];
  const domain = inferDomain(apk);

  const extractedLayouts = apk.extractedLayouts || [];

  const activities =
    apk.isCustomUpload && extractedLayouts.length > 0
      ? extractedLayouts.map(
          (l, idx) => l.activityName || `${apk.packageName}.${l.screenTitle.replace(/\s+/g, '')}Activity${idx === 0 ? ' (Launcher)' : ''}`
        )
      : apk.activities.length > 0
      ? apk.activities
      : [
          `${apk.packageName}.ui.MainActivity (Launcher)`,
          `${apk.packageName}.ui.DetailActivity`,
          `${apk.packageName}.ui.PermissionsAndServicesActivity`,
          `${apk.packageName}.ui.SettingsActivity`
        ];

  const currentActivity = activities[activeActivityIndex] || activities[0];
  const currentActivityName =
    currentActivity.replace(' (Launcher)', '').replace(' (Main/Launcher)', '').split('.').pop() || 'MainActivity';

  const [actionLogs, setActionLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setActionLogs((prev) => [`[${time}] ${msg}`, ...prev.slice(0, 45)]);
  };

  // Synchronize sandbox state whenever `apk` changes
  useEffect(() => {
    setActiveActivityIndex(0);
    setSearchQuery('');
    setInputText('');
    setOrderPlaced(false);
    setTransferSuccess(false);
    setActivePermissionPrompt(null);
    setWidgetInputValues({});
    setWidgetToggleStates({});
    setCustomScreenViewMode(apk.webBundleHtml ? 'webview' : 'layout');

    // Initialize custom records from the APK's extracted strings or activities
    const realStrings = apk.extractedStrings || [];
    if (apk.isCustomUpload && realStrings.length > 0) {
      setCustomRecords(
        realStrings.slice(0, 5).map((s, idx) => ({
          id: `str-${idx}`,
          title: s,
          status: `res/values/strings.xml #${idx + 1}`
        }))
      );
    } else {
      setCustomRecords([
        { id: 'rec-1', title: `${apk.appName} Primary Module`, status: 'Verified · Active' },
        { id: 'rec-2', title: apk.services[0]?.split('.').pop() || 'BackgroundSyncService', status: 'Running (PID 3104)' },
        { id: 'rec-3', title: `Target SDK ${apk.targetSdkVersion} (${apk.targetSdkName})`, status: 'Compliant' }
      ]);
    }

    const initialPerms: Record<string, boolean> = {};
    apk.permissions.forEach((p) => {
      if (!p.isSensitive) initialPerms[p.name] = true;
    });
    setGrantedPermissions(initialPerms);

    const launcher = apk.activities[0]?.replace(' (Launcher)', '').replace(' (Main/Launcher)', '') || `${apk.packageName}.ui.MainActivity`;
    const time = new Date().toLocaleTimeString();
    setActionLogs([
      `[${time}] [PackageManager] Installed & Mounted APK: ${apk.fileName} (${apk.apkSizeMb} MB · v${apk.versionName})`,
      `[${time}] [ActivityTaskManager] START u0 {cmp=${apk.packageName}/${launcher}} on ${selectedOsMeta.title}`,
      `[${time}] [AssetExtractor] Loaded ${apk.extractedLayouts?.length || 0} XML layouts, ${apk.extractedStrings?.length || 0} strings, ${apk.extractedImages?.length || 0} drawables`,
      `[${time}] [GraphicsPipeline] Renderer: ${selectedOsMeta.graphicsDriver} @ 60.0 FPS`
    ]);
  }, [apk.id]);

  const handleOsChange = (newOs: SimulatedOsVersion) => {
    setCurrentOs(newOs);
    const meta = OS_METADATA_MAP[newOs];
    addLog(`[OS_SWITCH] Switched target device to ${meta.title} (${meta.badge})`);
    addLog(`[Kernel] Initialized ${meta.kernel} with ${meta.graphicsDriver}`);
  };

  const handleButtonClick = (actionName: string, detail?: string) => {
    setCounter((c) => c + 1);
    addLog(
      `[UiAutomator2] CLICK @${apk.packageName}:id/${actionName.toLowerCase().replace(/\s+/g, '_')} ${
        detail ? `(${detail}) ` : ''
      }on ${selectedOsMeta.brand} ${selectedOsMeta.skinName}`
    );
  };

  const handleRequestPermission = (perm: PermissionItem) => {
    setActivePermissionPrompt(perm);
    addLog(`[PermissionController] Runtime dialog requested: ${perm.name} on ${selectedOsMeta.skinName} (API ${selectedOsMeta.apiLevel})`);
  };

  const handlePermissionDecision = (permName: string, granted: boolean) => {
    setGrantedPermissions((prev) => ({ ...prev, [permName]: granted }));
    setActivePermissionPrompt(null);
    addLog(`[PermissionController] ${permName} -> ${granted ? 'PERMISSION_GRANTED' : 'PERMISSION_DENIED'}`);
  };

  const handleActivitySwitch = (index: number) => {
    const safeIdx = Math.min(index, Math.max(0, activities.length - 1));
    setActiveActivityIndex(safeIdx);
    const actName = activities[safeIdx]?.replace(' (Launcher)', '').replace(' (Main/Launcher)', '').split('.').pop() || 'MainActivity';
    addLog(`[ActivityTaskManager] am start -n ${apk.packageName}/${activities[safeIdx]}`);
    addLog(`[Lifecycle] ${actName} -> ON_RESUME on ${selectedOsMeta.deviceModel}`);
  };

  const runAutomatedWalkthrough = () => {
    if (isRunningWalkthrough) return;
    setIsRunningWalkthrough(true);
    setWalkthroughStep(1);
    addLog(`[TestRunner] Starting Automated UI Walkthrough for ${apk.appName} on ${selectedOsMeta.title}...`);

    setTimeout(() => {
      setWalkthroughStep(2);
      handleButtonClick('btn_primary_cta', 'Auto Step 1');
      addLog(`[TestRunner] Step 1/4: Verified primary interactive component on ${currentActivityName}.`);

      setTimeout(() => {
        setWalkthroughStep(3);
        if (activities.length > 1) {
          handleActivitySwitch(1);
        }
        addLog('[TestRunner] Step 2/4: Verified intent transition to secondary Activity.');

        setTimeout(() => {
          setWalkthroughStep(4);
          const sensitivePerm = apk.permissions.find((p) => p.isSensitive) || apk.permissions[0];
          if (sensitivePerm) {
            setGrantedPermissions((prev) => ({ ...prev, [sensitivePerm.name]: true }));
            addLog(`[TestRunner] Step 3/4: Granted runtime permission ${sensitivePerm.name}.`);
          } else {
            addLog('[TestRunner] Step 3/4: Verified form input & state persistence.');
          }

          setTimeout(() => {
            setIsRunningWalkthrough(false);
            setWalkthroughStep(0);
            handleActivitySwitch(0);
            addLog(`[TestRunner] Step 4/4: Walkthrough PASSED (100%) for ${apk.appName} on ${selectedOsMeta.title}.`);
          }, 1100);
        }, 1100);
      }, 1100);
    }, 900);
  };

  // Render exact extracted APK layout, real strings, real drawables, and real icon when user uploads an APK
  const renderExactUploadedApkScreen = () => {
    const activeLayout =
      extractedLayouts[activeActivityIndex] ||
      extractedLayouts[0] || {
        fileName: 'activity_main.xml',
        screenTitle: currentActivityName,
        activityName: currentActivity,
        widgets: []
      };

    const images = apk.extractedImages || [];
    const uiStrings = apk.extractedStrings || [];

    return (
      <div className="space-y-3">
        {/* Uploaded APK Identity & Layout Source Header */}
        <div
          className={`bg-white border ${
            showInspector ? 'border-dashed border-blue-500' : 'border-slate-200'
          } rounded-xl p-3 shadow-2xs space-y-2`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              {apk.iconDataUrl ? (
                <img
                  src={apk.iconDataUrl}
                  alt={apk.appName}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {apk.appName.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">{apk.appName}</h4>
                <span className="text-[10px] font-mono text-blue-600 block truncate">{apk.packageName}</span>
                <span className="text-[9px] font-mono text-slate-400 block truncate">
                  Layout: res/layout/{activeLayout.fileName}
                </span>
              </div>
            </div>

            {/* Sub-mode switcher inside the uploaded app screen */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg shrink-0">
              <button
                onClick={() => setCustomScreenViewMode('layout')}
                className={`px-2 py-1 rounded text-[9px] font-mono font-bold cursor-pointer transition-colors ${
                  customScreenViewMode === 'layout' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                UI Layout
              </button>
              <button
                onClick={() => setCustomScreenViewMode('resources')}
                className={`px-2 py-1 rounded text-[9px] font-mono font-bold cursor-pointer transition-colors ${
                  customScreenViewMode === 'resources' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Assets ({images.length + uiStrings.length})
              </button>
              {apk.webBundleHtml && (
                <button
                  onClick={() => setCustomScreenViewMode('webview')}
                  className={`px-2 py-1 rounded text-[9px] font-mono font-bold cursor-pointer transition-colors ${
                    customScreenViewMode === 'webview' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  WebView
                </button>
              )}
            </div>
          </div>

          {showInspector && (
            <div className="text-[9px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              @layout/{activeLayout.fileName.replace(/\.xml$/i, '')} · {activeLayout.widgets.length} extracted views
            </div>
          )}
        </div>

        {/* Mode 1: Bundled Hybrid WebView HTML (if APK has assets/www/index.html) */}
        {customScreenViewMode === 'webview' && apk.webBundleHtml && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs h-80 flex flex-col">
            <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-600">
              <span>android.webkit.WebView (assets/index.html)</span>
              <span className="text-emerald-600 font-semibold">Live DOM</span>
            </div>
            <iframe
              title={`${apk.appName} Bundled WebView`}
              srcDoc={apk.webBundleHtml}
              sandbox="allow-scripts allow-forms"
              className="w-full flex-1 border-0 bg-white"
            />
          </div>
        )}

        {/* Mode 2: Extracted APK Drawables, Strings & Runtime Permissions */}
        {customScreenViewMode === 'resources' && (
          <div className="space-y-3">
            {/* Extracted Drawable Images from APK */}
            {images.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-800 block">
                  Extracted APK Drawables & Icons ({images.length})
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {images.slice(0, 6).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleButtonClick(`drawable_${img.name}`, img.path)}
                      className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg p-2 flex flex-col items-center gap-1 cursor-pointer transition-colors"
                    >
                      <img
                        src={img.dataUrl}
                        alt={img.name}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 object-contain rounded"
                      />
                      <span className="text-[9px] font-mono text-slate-600 truncate w-full text-center">
                        {img.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Extracted Strings from resources.arsc / AndroidManifest.xml */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800">
                  Extracted String Table ({uiStrings.length})
                </span>
                <span className="text-[9px] font-mono text-slate-400">resources.arsc</span>
              </div>
              <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                {uiStrings.slice(0, 20).map((str, i) => (
                  <div
                    key={i}
                    onClick={() => handleButtonClick(`string_res_${i}`, str)}
                    className="px-2 py-1 bg-slate-50 hover:bg-blue-50/50 rounded border border-slate-100 text-[11px] text-slate-700 flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span className="truncate font-medium">{str}</span>
                    <span className="text-[9px] font-mono text-slate-400 shrink-0">@string/s_{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Declared Permissions */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-800 block">
                Declared APK Permissions ({apk.permissions.length})
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {apk.permissions.map((perm) => {
                  const shortPerm = perm.name.split('.').pop() || perm.name;
                  const isGranted = !!grantedPermissions[perm.name];
                  return (
                    <div
                      key={perm.name}
                      className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[10px]"
                    >
                      <span className="font-mono font-semibold text-slate-800 truncate pr-2">{shortPerm}</span>
                      <button
                        onClick={() => handleRequestPermission(perm)}
                        className={`px-2 py-0.5 rounded text-[9px] font-mono font-semibold cursor-pointer shrink-0 ${
                          isGranted
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {isGranted ? 'GRANTED' : 'PROMPT'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Mode 3 (Default): Render the Exact Extracted XML Layout Widgets for the Active Screen */}
        {customScreenViewMode === 'layout' && (
          <div className="space-y-2.5">
            {activeLayout.widgets.map((widget, wIdx) => {
              const inspectorBorder = showInspector ? 'border-dashed border-blue-500' : 'border-slate-200';
              const sampleDrawable = images[wIdx % Math.max(1, images.length)];

              if (widget.type === 'Toolbar') {
                return (
                  <div
                    key={widget.id}
                    className={`bg-slate-900 text-white rounded-xl px-3.5 py-2.5 flex items-center justify-between shadow-2xs border ${inspectorBorder}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold truncate">{widget.label || activeLayout.screenTitle}</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 shrink-0">@id/{widget.viewId}</span>
                  </div>
                );
              }

              if (widget.type === 'ImageView') {
                const imgSrc = sampleDrawable?.dataUrl || apk.iconDataUrl;
                return (
                  <div
                    key={widget.id}
                    onClick={() => handleButtonClick(widget.viewId, widget.label)}
                    className={`bg-white border ${inspectorBorder} rounded-xl p-3 flex items-center gap-3 shadow-2xs cursor-pointer hover:bg-slate-50/70 transition-colors`}
                  >
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={widget.label}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-lg object-contain bg-slate-100 p-1 border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                        IMG
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 truncate">{widget.label}</div>
                      <div className="text-[10px] font-mono text-slate-400 truncate">
                        {widget.rawTag} · @id/{widget.viewId}
                      </div>
                      {sampleDrawable && (
                        <div className="text-[9px] font-mono text-blue-600 truncate mt-0.5">{sampleDrawable.path}</div>
                      )}
                    </div>
                  </div>
                );
              }

              if (widget.type === 'EditText') {
                const val = widgetInputValues[widget.id] ?? '';
                return (
                  <div key={widget.id} className={`bg-white border ${inspectorBorder} rounded-xl p-3 space-y-1.5 shadow-2xs`}>
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-slate-700">{widget.label}</label>
                      <span className="text-[9px] font-mono text-slate-400">@id/{widget.viewId}</span>
                    </div>
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => {
                        const v = e.target.value;
                        setWidgetInputValues((prev) => ({ ...prev, [widget.id]: v }));
                        addLog(`[UiAutomator2] setText @${apk.packageName}:id/${widget.viewId} -> "${v}"`);
                      }}
                      placeholder={widget.hint || `Enter ${widget.label.toLowerCase()}...`}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                );
              }

              if (widget.type === 'Button' || widget.type === 'FloatingActionButton') {
                return (
                  <button
                    key={widget.id}
                    onClick={() => handleButtonClick(widget.viewId, widget.label)}
                    className={`w-full py-2.5 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-between cursor-pointer transition-colors border ${
                      showInspector ? 'border-dashed border-amber-300' : 'border-blue-600'
                    }`}
                  >
                    <span className="truncate">{widget.label}</span>
                    <span className="text-[9px] font-mono text-blue-100 shrink-0 ml-2">@id/{widget.viewId}</span>
                  </button>
                );
              }

              if (widget.type === 'Switch' || widget.type === 'CheckBox') {
                const checked = !!widgetToggleStates[widget.id];
                return (
                  <div
                    key={widget.id}
                    onClick={() => {
                      const next = !checked;
                      setWidgetToggleStates((prev) => ({ ...prev, [widget.id]: next }));
                      handleButtonClick(widget.viewId, `${widget.type}=${next}`);
                    }}
                    className={`bg-white border ${inspectorBorder} rounded-xl p-3 flex items-center justify-between shadow-2xs cursor-pointer`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-semibold text-slate-900 truncate">{widget.label}</div>
                      <div className="text-[9px] font-mono text-slate-400">@id/{widget.viewId}</div>
                    </div>
                    <div
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors shrink-0 ${
                        checked ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          checked ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                );
              }

              if (widget.type === 'RecyclerView' || widget.type === 'CardView') {
                const listItems =
                  uiStrings.length >= 3
                    ? uiStrings.slice((wIdx * 3) % uiStrings.length, ((wIdx * 3) % uiStrings.length) + 3)
                    : customRecords.map((r) => r.title);

                return (
                  <div key={widget.id} className={`bg-white border ${inspectorBorder} rounded-xl p-3 space-y-2 shadow-2xs`}>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-xs font-bold text-slate-900 truncate">{widget.label}</span>
                      <span className="text-[9px] font-mono text-blue-600 shrink-0">
                        {widget.rawTag} (@id/{widget.viewId})
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {(listItems.length > 0 ? listItems : [apk.appName, currentActivityName]).map((itemText, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleButtonClick(`${widget.viewId}_item_${idx}`, itemText)}
                          className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50/60 border border-slate-100 flex items-center justify-between text-xs cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            {images[idx] ? (
                              <img
                                src={images[idx].dataUrl}
                                alt={itemText}
                                referrerPolicy="no-referrer"
                                className="w-6 h-6 rounded object-contain bg-white border border-slate-200 shrink-0"
                              />
                            ) : (
                              <span className="w-5 h-5 rounded bg-blue-100 text-blue-700 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                            )}
                            <span className="font-medium text-slate-800 truncate">{itemText}</span>
                          </div>
                          <span className="text-[9px] font-mono text-slate-400 shrink-0">Tap</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // Default: TextView / ProgressBar / BottomNavigationView / WebView
              return (
                <div
                  key={widget.id}
                  onClick={() => handleButtonClick(widget.viewId, widget.label)}
                  className={`bg-white border ${inspectorBorder} rounded-xl p-3 shadow-2xs space-y-1 cursor-pointer hover:bg-slate-50/60 transition-colors`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">{widget.label}</span>
                    <span className="text-[9px] font-mono text-slate-400 shrink-0">
                      {widget.rawTag} · @id/{widget.viewId}
                    </span>
                  </div>
                  {widget.secondaryText && (
                    <p className="text-[11px] text-slate-600 leading-relaxed">{widget.secondaryText}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Render authentic interactive content inside the device screen based on the active APK & activity
  const renderAppScreenBody = () => {
    // CRITICAL: When user uploads a custom APK, ALWAYS render the exact uploaded APK's extracted layouts, icons, strings, and assets!
    if (apk.isCustomUpload) {
      return renderExactUploadedApkScreen();
    }

    // 1. For built-in sample apps: If user is on the last tab or explicitly inspecting Permissions/Services
    if (activeActivityIndex === 3 || currentActivityName.toLowerCase().includes('setting') || currentActivityName.toLowerCase().includes('profile')) {
      return (
        <div className="space-y-3">
          <div className={`bg-white border ${showInspector ? 'border-dashed border-blue-500' : 'border-slate-200'} rounded-xl p-3.5 shadow-2xs space-y-2.5`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  {apk.appName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{apk.appName}</h4>
                  <span className="text-[10px] font-mono text-slate-500">v{apk.versionName} · API {apk.targetSdkVersion}</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Active
              </span>
            </div>
            {showInspector && (
              <div className="text-[9px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                @id/card_app_manifest_summary (328x68dp)
              </div>
            )}
          </div>

          {/* Runtime Permissions Controller inside the phone */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span>Runtime Permissions ({apk.permissions.length})</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">Tap to prompt</span>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {apk.permissions.map((perm) => {
                const shortPerm = perm.name.split('.').pop() || perm.name;
                const isGranted = !!grantedPermissions[perm.name];
                return (
                  <div
                    key={perm.name}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px]"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-mono font-semibold text-slate-800 truncate">{shortPerm}</div>
                      <div className="text-[10px] text-slate-500 truncate">{perm.category}</div>
                    </div>
                    <button
                      onClick={() => handleRequestPermission(perm)}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono font-semibold cursor-pointer shrink-0 transition-colors ${
                        isGranted
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200'
                      }`}
                    >
                      {isGranted ? 'GRANTED' : 'REQUEST'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Background Services */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs space-y-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-indigo-600" />
              <span>Declared Services ({apk.services.length})</span>
            </span>
            {apk.services.slice(0, 3).map((srv, i) => (
              <div key={i} className="flex items-center justify-between text-[11px] bg-slate-50 px-2.5 py-1.5 rounded border border-slate-100">
                <span className="font-mono text-slate-700 truncate">{srv.split('.').pop()}</span>
                <button
                  onClick={() => handleButtonClick(`service_${srv.split('.').pop()}`, 'startForegroundService')}
                  className="text-[10px] font-semibold text-blue-600 hover:underline cursor-pointer ml-2 shrink-0"
                >
                  Ping IPC
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 2. FOOD / E-COMMERCE DOMAIN RENDERER
    if (domain === 'food' || domain === 'ecommerce') {
      if (activeActivityIndex === 1 || currentActivityName.toLowerCase().includes('cart') || currentActivityName.toLowerCase().includes('payment') || currentActivityName.toLowerCase().includes('checkout')) {
        const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
        return (
          <div className="space-y-3">
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900">Order Checkout ({cartItems.length} items)</span>
                <span className="text-xs font-mono font-bold text-emerald-700 tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1">
                  <div>
                    <span className="font-medium text-slate-800">{item.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono block">Qty: {item.qty}</span>
                  </div>
                  <span className="font-mono font-semibold text-slate-800 tabular-nums">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900">
                <span>Total Payable (incl. tax)</span>
                <span className="font-mono text-blue-600 tabular-nums">${(subtotal + 2.5).toFixed(2)}</span>
              </div>
            </div>

            {orderPlaced ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-1.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <div className="text-xs font-bold text-emerald-950">Order Confirmed (#FE-{2049 + counter})</div>
                <p className="text-[11px] text-emerald-700">Dispatched via {selectedOsMeta.skinName} Notification Channel</p>
                <button
                  onClick={() => {
                    setOrderPlaced(false);
                    handleActivitySwitch(2);
                  }}
                  className="mt-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[11px] font-semibold cursor-pointer"
                >
                  Track Live Delivery →
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setOrderPlaced(true);
                  handleButtonClick('btn_confirm_checkout_payment', `Amount $${(subtotal + 2.5).toFixed(2)}`);
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors"
              >
                Confirm & Pay ${(subtotal + 2.5).toFixed(2)}
              </button>
            )}
          </div>
        );
      }

      if (activeActivityIndex === 2) {
        return (
          <div className="space-y-3">
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Live GPS Courier Telemetry</span>
                <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold">ETA 14 mins</span>
              </div>
              <div className="bg-slate-900 text-slate-200 rounded-lg p-3 font-mono text-[10px] space-y-1">
                <div>Lat: 37.4220° N · Lng: 122.0841° W</div>
                <div className="text-emerald-400">● FusedLocationProviderClient Connected</div>
              </div>
              <button
                onClick={() => {
                  const locPerm = apk.permissions.find((p) => p.name.includes('LOCATION')) || {
                    name: 'android.permission.ACCESS_FINE_LOCATION',
                    category: 'Dangerous',
                    description: 'Precise GPS tracking',
                    isSensitive: true
                  };
                  handleRequestPermission(locPerm);
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Verify Fine Location Permission
              </button>
            </div>
          </div>
        );
      }

      // Default Food / E-Commerce Catalog Screen
      const menuCatalog = [
        { name: 'Spicy Tonkotsu Ramen', tag: 'Bestseller · 20m', price: 14.5 },
        { name: 'Avocado Salmon Poke', tag: 'Healthy · 15m', price: 16.0 },
        { name: 'Truffle Artisan Pizza', tag: 'Woodfired · 25m', price: 18.5 }
      ].filter((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

      return (
        <div className="space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                addLog(`[UiAutomator2] Text entered in @id/et_search_catalog: "${e.target.value}"`);
              }}
              placeholder={`Search in ${apk.appName}...`}
              className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          {showInspector && (
            <div className="text-[9px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              RecyclerView: @id/rv_catalog_items ({menuCatalog.length} visible children)
            </div>
          )}

          {/* Catalog Items */}
          <div className="space-y-2">
            {menuCatalog.map((item, i) => (
              <div
                key={i}
                className={`bg-white border ${
                  showInspector ? 'border-dashed border-blue-500' : 'border-slate-200'
                } rounded-xl p-3 flex items-center justify-between shadow-2xs`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{item.name}</div>
                  <div className="text-[10px] text-slate-500">{item.tag} · <strong className="text-slate-800 font-mono">${item.price.toFixed(2)}</strong></div>
                </div>
                <button
                  onClick={() => {
                    setCartItems((prev) => [...prev, { name: item.name, price: item.price, qty: 1 }]);
                    handleButtonClick(`btn_add_item_${i}`, item.name);
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              </div>
            ))}
          </div>

          {/* Sticky Cart Summary Bar */}
          <div className="bg-slate-900 text-white rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold">{cartItems.length} items in cart</span>
            </div>
            <button
              onClick={() => handleActivitySwitch(1)}
              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg text-xs cursor-pointer"
            >
              Checkout →
            </button>
          </div>
        </div>
      );
    }

    // 3. FINTECH / BANKING DOMAIN RENDERER
    if (domain === 'fintech') {
      if (activeActivityIndex === 1 || currentActivityName.toLowerCase().includes('transfer')) {
        return (
          <div className="space-y-3">
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Instant UPI / Wire Transfer</span>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">TLS 1.3</span>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase font-mono">Recipient Address</label>
                <input
                  type="text"
                  value={transferRecipient}
                  onChange={(e) => setTransferRecipient(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase font-mono">Amount (USD)</label>
                <input
                  type="text"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                />
              </div>
              {transferSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-xs text-emerald-900 font-semibold flex items-center justify-between">
                  <span>✓ Sent ${transferAmount} to {transferRecipient}</span>
                  <button onClick={() => setTransferSuccess(false)} className="text-[10px] underline cursor-pointer">New</button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    const amt = parseFloat(transferAmount) || 0;
                    setBankBalance((b) => Math.max(0, b - amt));
                    setTransferSuccess(true);
                    handleButtonClick('btn_authorize_transfer', `$${amt} to ${transferRecipient}`);
                  }}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Authorize & Send ${transferAmount}
                </button>
              )}
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-3">
          {/* Vault Balance Card */}
          <div className="bg-slate-900 text-white rounded-xl p-4 space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>PRIMARY CHECKING · FLAG_SECURE</span>
              <span className="text-emerald-400">BIOMETRIC VERIFIED</span>
            </div>
            <div className="text-xl font-extrabold font-mono tabular-nums">
              ${bankBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handleActivitySwitch(1)}
                className="py-1.5 px-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Send Money</span>
              </button>
              <button
                onClick={() => {
                  const bioPerm = apk.permissions.find((p) => p.name.includes('BIOMETRIC')) || {
                    name: 'android.permission.USE_BIOMETRIC',
                    category: 'Dangerous',
                    description: 'Hardware Keystore Biometric Auth',
                    isSensitive: true
                  };
                  handleRequestPermission(bioPerm);
                }}
                className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Biometric Auth</span>
              </button>
            </div>
          </div>

          {/* Recent Ledger */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2">
            <span className="text-xs font-bold text-slate-800 block">Recent Ledger Activity</span>
            {[
              { title: 'Cloud Infrastructure AWS', date: 'Today · 09:12', amt: '-$142.00', color: 'text-slate-800' },
              { title: 'Direct Deposit Payroll', date: 'Yesterday', amt: '+$4,200.00', color: 'text-emerald-600' }
            ].map((tx, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-t border-slate-100">
                <div>
                  <div className="font-semibold text-slate-800">{tx.title}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{tx.date}</div>
                </div>
                <span className={`font-mono font-bold tabular-nums ${tx.color}`}>{tx.amt}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 4. HEALTH / FITNESS DOMAIN RENDERER
    if (domain === 'health') {
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Daily Steps</span>
              <div className="text-lg font-extrabold text-slate-900 font-mono tabular-nums mt-0.5">
                {stepCount.toLocaleString()}
              </div>
              <button
                onClick={() => {
                  setStepCount((s) => s + 250);
                  handleButtonClick('sensor_step_counter', '+250 steps');
                }}
                className="mt-2 w-full py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[11px] font-semibold cursor-pointer"
              >
                + Simulate Steps
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Heart Rate</span>
              <div className="text-lg font-extrabold text-rose-600 font-mono tabular-nums mt-0.5 flex items-center gap-1">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                <span>{heartRateBpm} BPM</span>
              </div>
              <button
                onClick={() => {
                  const nextBpm = 68 + Math.floor(Math.random() * 28);
                  setHeartRateBpm(nextBpm);
                  handleButtonClick('sensor_body_heart_rate', `${nextBpm} BPM`);
                }}
                className="mt-2 w-full py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[11px] font-semibold cursor-pointer"
              >
                Poll PPG Sensor
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Live Workout Telemetry</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${workoutActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                {workoutActive ? 'RECORDING GPS' : 'STANDBY'}
              </span>
            </div>
            <button
              onClick={() => {
                setWorkoutActive(!workoutActive);
                handleButtonClick('btn_toggle_workout', !workoutActive ? 'START_SESSION' : 'PAUSE_SESSION');
              }}
              className={`w-full py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                workoutActive ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white'
              }`}
            >
              {workoutActive ? 'Stop Foreground Workout Service' : 'Start Outdoor GPS Run'}
            </button>
          </div>
        </div>
      );
    }

    // 5. SOCIAL / MESSAGING DOMAIN RENDERER
    if (domain === 'social') {
      if (activeActivityIndex === 1 || currentActivityName.toLowerCase().includes('message') || currentActivityName.toLowerCase().includes('chat')) {
        return (
          <div className="space-y-3 flex flex-col h-full">
            <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2 flex-1 overflow-y-auto max-h-64">
              {chatMessages.map((m, idx) => (
                <div key={idx} className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-3 py-1.5 rounded-xl text-xs max-w-[85%] ${
                    m.sender === 'me' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {m.text}
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono mt-0.5">{m.time}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Write encrypted message..."
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => {
                  if (!inputText.trim()) return;
                  const msg = inputText.trim();
                  setChatMessages((prev) => [
                    ...prev,
                    { sender: 'me', text: msg, time: '09:42' },
                    { sender: 'peer', text: `ACK from ${selectedOsMeta.skinName}: Verified "${msg}"`, time: '09:42' }
                  ]);
                  setInputText('');
                  handleButtonClick('btn_send_dm', msg);
                }}
                className="px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-3">
          {/* Post Composer */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2 shadow-2xs">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Post update to ${apk.appName}...`}
                className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => {
                  if (!inputText.trim()) return;
                  setSocialPosts((prev) => [
                    { id: `p-${Date.now()}`, author: 'QA Tester', handle: '@qa_runner', text: inputText.trim(), likes: 1, liked: true },
                    ...prev
                  ]);
                  handleButtonClick('btn_publish_post', inputText.trim());
                  setInputText('');
                }}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Post
              </button>
            </div>
          </div>

          {/* Feed Cards */}
          {socialPosts.map((post) => (
            <div key={post.id} className="bg-white border border-slate-200 rounded-xl p-3 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{post.author}</span>
                <span className="text-[10px] font-mono text-slate-400">{post.handle}</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{post.text}</p>
              <div className="flex items-center gap-4 pt-1 text-[11px] text-slate-500">
                <button
                  onClick={() => {
                    setSocialPosts((prev) =>
                      prev.map((p) => (p.id === post.id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p))
                    );
                    handleButtonClick(`btn_like_${post.id}`);
                  }}
                  className={`flex items-center gap-1 font-semibold cursor-pointer ${post.liked ? 'text-rose-600' : 'text-slate-500'}`}
                >
                  <Heart className={`w-3.5 h-3.5 ${post.liked ? 'fill-rose-600' : ''}`} />
                  <span className="font-mono tabular-nums">{post.likes}</span>
                </button>
                <button
                  onClick={() => handleActivitySwitch(1)}
                  className="flex items-center gap-1 hover:text-blue-600 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Reply in DM</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // 6. DEFAULT UTILITY SAMPLE RENDERER
    return renderExactUploadedApkScreen();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Header Banner with Direct APK Switcher & Import */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue-600" />
              <span>Multi-Brand OS Live Sandbox & Interactive App Emulator</span>
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-md font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {selectedOsMeta.brand} · {selectedOsMeta.skinName}
            </span>
            {apk.isCustomUpload && (
              <span className="text-xs px-2.5 py-0.5 rounded-md font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Custom Imported APK
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Running <strong className="text-slate-900">{apk.appName}</strong> (<code className="font-mono text-slate-700">{apk.packageName}</code>) across Samsung One UI, Xiaomi HyperOS, OnePlus OxygenOS, Nothing OS, Google Pixel, Windows WSA, and Linux Waydroid.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick App Switcher inside Sandbox */}
          {allApks.length > 0 && onSelectApk && (
            <select
              aria-label="Switch Active APK in Sandbox"
              value={apk.id}
              onChange={(e) => {
                const found = allApks.find((a) => a.id === e.target.value);
                if (found) onSelectApk(found);
              }}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 cursor-pointer focus:outline-none focus:border-blue-500"
            >
              {allApks.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.isCustomUpload ? `★ ${a.appName} (Imported)` : `${a.appName} (v${a.versionName})`}
                </option>
              ))}
            </select>
          )}

          {/* Direct APK Import inside Sandbox */}
          {onUploadCustomApk && (
            <>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import APK</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".apk"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    onUploadCustomApk(f);
                    e.target.value = '';
                  }
                }}
              />
            </>
          )}

          <button
            onClick={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-all cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{orientation === 'portrait' ? 'Landscape' : 'Portrait'}</span>
          </button>

          <button
            onClick={() => {
              setIsOnline(!isOnline);
              addLog(`[NetworkMonitor] Connectivity switched: ${!isOnline ? 'Online (5G / Wi-Fi 7)' : 'Offline (Airplane Mode)'}`);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? '5G Online' : 'Offline'}</span>
          </button>

          <button
            onClick={() => setShowInspector(!showInspector)}
            className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              showInspector
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Bounds {showInspector ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={runAutomatedWalkthrough}
            disabled={isRunningWalkthrough}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunningWalkthrough ? `Step ${walkthroughStep}/4...` : 'Auto UI Test'}</span>
          </button>
        </div>
      </div>

      {/* Multi-Brand Mobile OS & Subsystem Selector Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Select Brand & Operating System Environment
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Active Device:</span>
            <span className="font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
              {selectedOsMeta.title}
            </span>
          </div>
        </div>

        {/* Brand & OS Family Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Multi-Brand Android OEM Skins (8 cols) */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Mobile Brands & Android OS Skins (Samsung, Xiaomi, OnePlus, Nothing, Pixel)</span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {(
                [
                  { id: 'samsung-oneui-6', label: 'Samsung One UI 6.1', sub: 'Galaxy S24 Ultra' },
                  { id: 'xiaomi-hyperos', label: 'Xiaomi HyperOS 1.0', sub: 'Xiaomi 14 Pro' },
                  { id: 'oneplus-oxygenos-14', label: 'OnePlus OxygenOS 14', sub: 'OnePlus 12 5G' },
                  { id: 'nothing-os-26', label: 'Nothing OS 2.6', sub: 'Nothing Phone (2)' },
                  { id: 'google-pixel-a15', label: 'Google Pixel UI', sub: 'Pixel 9 Pro · A15' },
                  { id: 'redmi-miui-14', label: 'Xiaomi MIUI 14', sub: 'Redmi Note 12' }
                ] as { id: SimulatedOsVersion; label: string; sub: string }[]
              ).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleOsChange(item.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-left transition-all cursor-pointer border ${
                    currentOs === item.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-[11px] font-bold truncate">{item.label}</div>
                  <div className={`text-[10px] font-mono truncate ${currentOs === item.id ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {item.sub}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Windows & Linux Subsystems (5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Windows Options */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-blue-800 font-bold text-xs">
                <Laptop className="w-4 h-4 text-blue-600" />
                <span>Windows Subsystem</span>
              </div>
              <div className="space-y-1.5">
                {(['windows-11-wsa', 'windows-10-vm'] as SimulatedOsVersion[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => handleOsChange(v)}
                    className={`w-full px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-semibold transition-all cursor-pointer border text-left truncate ${
                      currentOs === v
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {v === 'windows-11-wsa' ? 'Windows 11 WSA 2311' : 'Windows 10 Hyper-V'}
                  </button>
                ))}
              </div>
            </div>

            {/* Linux Options */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                <Server className="w-4 h-4 text-amber-600" />
                <span>Linux Containers</span>
              </div>
              <div className="space-y-1.5">
                {(['linux-waydroid-ubuntu', 'linux-kvm-debian'] as SimulatedOsVersion[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => handleOsChange(v)}
                    className={`w-full px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-semibold transition-all cursor-pointer border text-left truncate ${
                      currentOs === v
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {v === 'linux-waydroid-ubuntu' ? 'Ubuntu 24.04 Waydroid' : 'Debian 12 QEMU-KVM'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Active Hardware & Kernel Telemetry Strip */}
        <div className="bg-slate-900 text-slate-300 rounded-lg px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Brand/Model: <strong className="text-white">{selectedOsMeta.brand} {selectedOsMeta.deviceModel}</strong></span>
          </div>
          <div>
            <span>OS Skin: <strong className="text-emerald-400">{selectedOsMeta.skinName}</strong></span>
          </div>
          <div>
            <span>Kernel: <strong className="text-amber-300">{selectedOsMeta.kernel}</strong></span>
          </div>
          <div>
            <span>GPU: <strong className="text-blue-300">{selectedOsMeta.graphicsDriver}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Grid: Brand-Authentic Interactive Viewport & Live Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Device Viewport Column */}
        <div className="lg:col-span-6 flex justify-center">
          {selectedOsMeta.family === 'windows' ? (
            /* WINDOWS 11 WSA DESKTOP WINDOW VIEWPORT */
            <div className="w-full max-w-[480px] bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col transition-all">
              <div className="bg-[#202020] text-slate-200 px-4 py-2.5 flex items-center justify-between border-b border-slate-700 select-none">
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-semibold truncate max-w-[230px]">
                    {apk.appName} — Windows Subsystem for Android™
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 font-mono">{selectedOsMeta.skinName}</span>
                  <div className="flex items-center gap-2">
                    <button className="text-slate-400 hover:text-white p-0.5"><Minus className="w-3 h-3" /></button>
                    <button className="text-slate-400 hover:text-white p-0.5"><SquareIcon className="w-3 h-3" /></button>
                    <button className="text-slate-400 hover:text-rose-400 p-0.5"><X className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 h-[560px] flex flex-col relative text-slate-800 select-none">
                <div className="bg-blue-600 text-white p-3 flex items-center justify-between shadow-xs shrink-0">
                  <div className="flex items-center gap-2">
                    {activeActivityIndex > 0 && (
                      <button onClick={() => handleActivitySwitch(0)} className="p-1 hover:bg-blue-700 rounded cursor-pointer">
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    )}
                    <div>
                      <h3 className="text-xs font-bold">{apk.appName}</h3>
                      <span className="text-[10px] text-blue-100 font-mono">{currentActivityName}</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-blue-700/80 px-2 py-0.5 rounded font-mono">
                    Direct3D 12 Bridge
                  </span>
                </div>

                {/* Activity Tabs */}
                <div className="bg-white border-b border-slate-200 px-2 py-1.5 flex gap-1 overflow-x-auto text-[11px] font-mono shrink-0">
                  {activities.slice(0, 4).map((act, index) => {
                    const simpleName = act.replace(' (Launcher)', '').replace(' (Main/Launcher)', '').split('.').pop() || `Screen ${index + 1}`;
                    return (
                      <button
                        key={act}
                        onClick={() => handleActivitySwitch(index)}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap font-medium ${
                          activeActivityIndex === index
                            ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {simpleName}
                      </button>
                    );
                  })}
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
                  {renderAppScreenBody()}
                </div>
              </div>
            </div>
          ) : selectedOsMeta.family === 'linux' ? (
            /* LINUX WAYDROID WINDOW VIEWPORT */
            <div className="w-full max-w-[480px] bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col transition-all">
              <div className="bg-[#1A1A24] text-slate-200 px-4 py-2.5 flex items-center justify-between border-b border-slate-800 select-none">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold truncate max-w-[230px]">
                    waydroid.{apk.packageName} — {selectedOsMeta.deviceModel}
                  </span>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">
                  {selectedOsMeta.skinName}
                </span>
              </div>

              <div className="bg-slate-50 h-[560px] flex flex-col relative text-slate-800 select-none">
                <div className="bg-amber-600 text-white p-3 flex items-center justify-between shadow-xs shrink-0">
                  <div className="flex items-center gap-2">
                    {activeActivityIndex > 0 && (
                      <button onClick={() => handleActivitySwitch(0)} className="p-1 hover:bg-amber-700 rounded cursor-pointer">
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    )}
                    <div>
                      <h3 className="text-xs font-bold">{apk.appName}</h3>
                      <span className="text-[10px] text-amber-100 font-mono">{currentActivityName}</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-amber-700/80 px-2 py-0.5 rounded font-mono">
                    Wayland LXC
                  </span>
                </div>

                {/* Activity Tabs */}
                <div className="bg-white border-b border-slate-200 px-2 py-1.5 flex gap-1 overflow-x-auto text-[11px] font-mono shrink-0">
                  {activities.slice(0, 4).map((act, index) => {
                    const simpleName = act.replace(' (Launcher)', '').replace(' (Main/Launcher)', '').split('.').pop() || `Screen ${index + 1}`;
                    return (
                      <button
                        key={act}
                        onClick={() => handleActivitySwitch(index)}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap font-medium ${
                          activeActivityIndex === index
                            ? 'bg-amber-50 text-amber-800 font-bold border border-amber-200'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {simpleName}
                      </button>
                    );
                  })}
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
                  {renderAppScreenBody()}
                </div>
              </div>
            </div>
          ) : (
            /* MULTI-BRAND ANDROID SMARTPHONE VIEWPORT (Samsung S24 Ultra, Xiaomi 14 Pro, OnePlus 12, Nothing Phone 2, Pixel 9 Pro) */
            <div
              className={`relative bg-slate-900 ${selectedOsMeta.frameRadius} p-3.5 shadow-2xl border-4 ${
                selectedOsMeta.id === 'nothing-os-26'
                  ? 'border-slate-700 ring-2 ring-slate-400/30'
                  : selectedOsMeta.id === 'samsung-oneui-6'
                  ? 'border-slate-700'
                  : 'border-slate-800'
              } transition-all duration-300 ${
                orientation === 'portrait' ? 'w-[372px] min-h-[670px]' : 'w-[650px] min-h-[420px]'
              }`}
            >
              {/* Brand-Specific Camera Cutout */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center">
                {selectedOsMeta.id === 'samsung-oneui-6' ? (
                  <div className="w-3 h-3 bg-slate-950 rounded-full border border-slate-700" title="Samsung Infinity-O Camera" />
                ) : selectedOsMeta.id === 'nothing-os-26' ? (
                  <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-700">
                    <div className="w-2.5 h-2.5 bg-slate-800 rounded-full" />
                    <span className="text-[8px] font-mono text-slate-400 tracking-widest">GLYPH</span>
                  </div>
                ) : (
                  <div className="w-24 h-4 bg-slate-950 rounded-full flex items-center justify-between px-2 border border-slate-800">
                    <div className="w-2 h-2 bg-slate-800 rounded-full" />
                    <div className="w-8 h-1 bg-slate-800 rounded-full" />
                  </div>
                )}
              </div>

              {/* Inner Screen */}
              <div
                className={`bg-slate-50 ${
                  selectedOsMeta.id === 'samsung-oneui-6' ? 'rounded-[14px]' : 'rounded-[28px]'
                } overflow-hidden flex flex-col h-[615px] relative border border-slate-200 text-slate-800 shadow-inner select-none`}
              >
                {/* OEM Brand Status Bar */}
                <div className="bg-slate-900 text-white px-4 pt-2 pb-1.5 flex items-center justify-between text-[10px] font-mono shrink-0 z-20">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold tabular-nums">09:41</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                      {selectedOsMeta.skinName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    {isOnline ? <Wifi className="w-3 h-3 text-emerald-400" /> : <WifiOff className="w-3 h-3 text-rose-400" />}
                    <span className="text-[9px] font-bold">
                      {selectedOsMeta.id === 'xiaomi-hyperos' ? '5G 4.2MB/s' : '5G+'}
                    </span>
                    <span className="text-[9px] text-emerald-400 font-bold tabular-nums">96%</span>
                  </div>
                </div>

                {/* Offline Warning Banner */}
                {!isOnline && (
                  <div className="bg-amber-500 text-slate-950 px-3 py-1 text-[10px] font-semibold text-center flex items-center justify-center gap-1.5">
                    <WifiOff className="w-3 h-3" />
                    <span>Airplane Mode Active — Serving Cached Data</span>
                  </div>
                )}

                {/* App Top Bar */}
                <div className={`${selectedOsMeta.accentColor} text-white px-3.5 py-3 flex items-center justify-between shadow-xs shrink-0 relative`}>
                  <div className="flex items-center gap-2 min-w-0">
                    {activeActivityIndex > 0 && (
                      <button
                        onClick={() => handleActivitySwitch(0)}
                        className="p-1 hover:bg-black/20 rounded transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    )}
                    {apk.iconDataUrl && (
                      <img
                        src={apk.iconDataUrl}
                        alt={apk.appName}
                        referrerPolicy="no-referrer"
                        className="w-6 h-6 rounded-md object-cover bg-white/10 border border-white/25 shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold leading-tight truncate">{apk.appName}</h3>
                      <span className="text-[10px] text-white/80 font-mono block truncate">
                        {currentActivityName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[9px] bg-black/25 px-2 py-0.5 rounded text-white font-mono">
                      v{apk.versionName}
                    </span>
                  </div>
                </div>

                {/* Activity Navigation Tabs */}
                <div className="bg-white border-b border-slate-200 px-2 py-1.5 flex gap-1 overflow-x-auto text-[10px] font-mono shrink-0">
                  {activities.slice(0, 4).map((act, index) => {
                    const simpleName = act.replace(' (Launcher)', '').replace(' (Main/Launcher)', '').split('.').pop() || `Screen ${index + 1}`;
                    return (
                      <button
                        key={act}
                        onClick={() => handleActivitySwitch(index)}
                        className={`px-2 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap font-medium ${
                          activeActivityIndex === index
                            ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {simpleName}
                      </button>
                    );
                  })}
                </div>

                {/* Main App Interactive Screen Body */}
                <div className="p-3.5 flex-1 overflow-y-auto relative">
                  {renderAppScreenBody()}

                  {/* Authentic Android Runtime Permission Modal Overlay */}
                  {activePermissionPrompt && (
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-2xs flex items-center justify-center p-4 z-30">
                      <div className="bg-white rounded-2xl p-4 w-full max-w-[290px] shadow-2xl border border-slate-200 space-y-3 text-center">
                        <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-900">
                            Allow <span className="text-blue-600">{apk.appName}</span> to access{' '}
                            {activePermissionPrompt.name.split('.').pop()}?
                          </h4>
                          <p className="text-[10px] text-slate-500">
                            {activePermissionPrompt.description} ({selectedOsMeta.skinName} API {selectedOsMeta.apiLevel})
                          </p>
                        </div>
                        <div className="space-y-1.5 pt-1">
                          <button
                            onClick={() => handlePermissionDecision(activePermissionPrompt.name, true)}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                          >
                            While using the app
                          </button>
                          <button
                            onClick={() => handlePermissionDecision(activePermissionPrompt.name, true)}
                            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer"
                          >
                            Only this time
                          </button>
                          <button
                            onClick={() => handlePermissionDecision(activePermissionPrompt.name, false)}
                            className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold cursor-pointer"
                          >
                            Don&apos;t allow
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom App Navigation Bar (Thumb Zone) */}
                <div className="bg-white border-t border-slate-200 grid grid-cols-4 items-center h-12 shrink-0 text-[10px]">
                  {[
                    { idx: 0, label: 'Home', icon: Layers },
                    { idx: Math.min(1, activities.length - 1), label: 'Action', icon: Activity },
                    { idx: Math.min(2, activities.length - 1), label: 'Inspect', icon: FolderLock },
                    { idx: 3, label: 'Permissions', icon: Settings }
                  ].map((nav) => {
                    const Icon = nav.icon;
                    const isAct = activeActivityIndex === nav.idx;
                    return (
                      <button
                        key={nav.label}
                        onClick={() => handleActivitySwitch(nav.idx)}
                        className={`flex flex-col items-center justify-center h-full cursor-pointer transition-colors ${
                          isAct ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="mt-0.5 text-[9px]">{nav.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* OEM System Navigation Bar (One UI / Gesture Pill) */}
                <div className="bg-slate-900 text-slate-400 py-2 px-8 flex items-center justify-between text-xs shrink-0 border-t border-slate-800">
                  {selectedOsMeta.id === 'samsung-oneui-6' ? (
                    <>
                      <button
                        onClick={() => addLog('[OneUI] Recents key pressed (KEYCODE_APP_SWITCH)')}
                        className="hover:text-white transition-colors cursor-pointer px-2 font-mono text-[10px]"
                      >
                        |||
                      </button>
                      <button
                        onClick={() => {
                          handleActivitySwitch(0);
                          addLog('[OneUI] Home key pressed (KEYCODE_HOME)');
                        }}
                        className="w-3.5 h-3.5 border-2 border-slate-400 rounded-md hover:border-white transition-colors cursor-pointer"
                      />
                      <button
                        onClick={() => {
                          if (activeActivityIndex > 0) handleActivitySwitch(0);
                          addLog('[OneUI] Back key pressed (KEYCODE_BACK)');
                        }}
                        className="hover:text-white transition-colors cursor-pointer px-2"
                      >
                        ◀
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          if (activeActivityIndex > 0) handleActivitySwitch(0);
                          addLog('[InputManager] Back gesture triggered (KEYCODE_BACK)');
                        }}
                        className="hover:text-white transition-colors cursor-pointer p-1 text-[10px]"
                      >
                        ◀
                      </button>
                      <button
                        onClick={() => {
                          handleActivitySwitch(0);
                          addLog(`[${selectedOsMeta.skinName}] Home gesture bar swiped`);
                        }}
                        className="w-24 h-1.5 bg-slate-500 hover:bg-white rounded-full transition-colors cursor-pointer"
                      />
                      <button
                        onClick={() => addLog('[InputManager] App Switcher gesture triggered')}
                        className="w-3 h-3 border border-slate-400 rounded-xs hover:border-white transition-colors cursor-pointer"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Decompiled APK Package Inspector & Live Action Stream */}
        <div className="lg:col-span-6 space-y-4">
          {/* Active APK & Target OS Skin Summary Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3 min-w-0">
                {apk.iconDataUrl && (
                  <img
                    src={apk.iconDataUrl}
                    alt={apk.appName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase font-bold text-blue-600 block">
                    {apk.isCustomUpload ? 'Exact Uploaded APK Runtime' : 'Active Target App & OS Skin'}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5 truncate">
                    {apk.appName} <span className="text-slate-400 font-normal">on</span> {selectedOsMeta.brand} {selectedOsMeta.deviceModel}
                  </h3>
                </div>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 shrink-0">
                {selectedOsMeta.badge}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">Package ID</span>
                <span className="font-mono font-semibold text-slate-800 text-[11px] block truncate" title={apk.packageName}>
                  {apk.packageName}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">
                  {apk.isCustomUpload ? 'Extracted Resources' : 'Inferred Domain'}
                </span>
                <span className="font-mono font-semibold text-blue-700 text-[11px] uppercase block">
                  {apk.isCustomUpload
                    ? `${extractedLayouts.length} XML · ${(apk.extractedStrings || []).length} Str`
                    : `${domain} (${activities.length} Screens)`}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 col-span-2 sm:col-span-1">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">SDK Compatibility</span>
                <span className="font-mono font-semibold text-emerald-700 text-[11px] block">
                  Min API {apk.minSdkVersion} → {selectedOsMeta.apiLevel} OK
                </span>
              </div>
            </div>

            {/* Parsed Activities Quick Jump */}
            <div className="pt-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block mb-1.5">
                Decompiled APK Activities (Click to launch in viewport):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activities.map((act, idx) => {
                  const clean = act.replace(' (Launcher)', '').replace(' (Main/Launcher)', '').split('.').pop() || act;
                  return (
                    <button
                      key={act}
                      onClick={() => handleActivitySwitch(idx)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer border ${
                        activeActivityIndex === idx
                          ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {idx + 1}. {clean}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Live Action & UiAutomator2 Event Stream */}
          <div className="bg-[#1E293B] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-[#0F172A] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <Terminal className="w-4 h-4 text-blue-400" />
                <span>Live UiAutomator2 & {selectedOsMeta.skinName} Event Stream</span>
              </div>
              <button
                onClick={() => setActionLogs([`[${new Date().toLocaleTimeString()}] [Console] Log cleared on ${selectedOsMeta.title}`])}
                className="text-[11px] text-slate-400 hover:text-slate-200 font-mono cursor-pointer"
              >
                Clear Log
              </button>
            </div>

            <div className="p-4">
              <div className="font-mono text-[11px] bg-slate-950 p-3.5 rounded-lg h-64 overflow-y-auto custom-scrollbar space-y-1.5 text-slate-300">
                {actionLogs.map((log, index) => (
                  <div
                    key={index}
                    className={`leading-relaxed ${
                      log.includes('CLICK') || log.includes('Step') || log.includes('PASSED')
                        ? 'text-emerald-400 font-medium'
                        : log.includes('OS_SWITCH') || log.includes('Loaded APK')
                        ? 'text-amber-300 font-semibold'
                        : log.includes('DENIED') || log.includes('FAIL')
                        ? 'text-rose-400'
                        : log.includes('START') || log.includes('start -n')
                        ? 'text-blue-300'
                        : 'text-slate-400'
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-3 shadow-xs">
            <span className="text-xs text-slate-600">
              Ready to dispatch the full automated test suite for <strong className="text-slate-900">{apk.appName}</strong> across all {devices.filter((d) => d.selectedForTest).length || devices.length} multi-brand OS nodes?
            </span>
            <button
              onClick={() => onNavigateToTab?.('execution')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              Run Matrix Execution →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
