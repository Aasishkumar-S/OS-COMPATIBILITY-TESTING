import React, { useState, useMemo } from 'react';
import {
  Smartphone,
  RefreshCw,
  CheckCircle2,
  Terminal,
  Cpu,
  HardDrive,
  Battery,
  Monitor,
  CheckSquare,
  Square,
  Plus,
  Play,
  Info,
  Layers,
  Sparkles,
  Server,
  Laptop,
  Check,
  Filter,
  Trash2,
  X
} from 'lucide-react';
import { Device, OsFamily } from '../types';

interface DeviceManagerProps {
  devices: Device[];
  onToggleDeviceSelect: (deviceId: string) => void;
  onSelectAllDevices: (select: boolean) => void;
  onRefreshDevices: () => void;
  onAddNewVirtualDevice: (dev: Partial<Device>) => void;
}

// OS Quick Preset definitions for instant 1-click addition
interface OsPreset {
  id: string;
  osFamily: OsFamily;
  manufacturer: string;
  skinName: string;
  name: string;
  osVersion: string;
  androidVersion: string;
  apiLevel: number;
  architecture: 'arm64-v8a' | 'x86_64';
  resolution: string;
  densityDpi: number;
  ramGb: number;
  cpuInfo: string;
  badge: string;
}

const OS_PRESETS: OsPreset[] = [
  // Multi-Brand Android OEM Skins
  {
    id: 'preset-samsung-oneui',
    osFamily: 'android',
    manufacturer: 'Samsung',
    skinName: 'One UI 6.1',
    name: 'Samsung Galaxy S24 Ultra',
    osVersion: 'Samsung One UI 6.1 (Android 14)',
    androidVersion: '14.0 (One UI 6.1)',
    apiLevel: 34,
    architecture: 'arm64-v8a',
    resolution: '1440 x 3120',
    densityDpi: 505,
    ramGb: 12,
    cpuInfo: 'Snapdragon 8 Gen 3 for Galaxy',
    badge: 'Samsung One UI 6.1'
  },
  {
    id: 'preset-xiaomi-hyperos',
    osFamily: 'android',
    manufacturer: 'Xiaomi',
    skinName: 'HyperOS 1.0',
    name: 'Xiaomi 14 Pro (HyperOS)',
    osVersion: 'Xiaomi HyperOS 1.0 (Android 14)',
    androidVersion: '14.0 (HyperOS)',
    apiLevel: 34,
    architecture: 'arm64-v8a',
    resolution: '1440 x 3200',
    densityDpi: 522,
    ramGb: 16,
    cpuInfo: 'Snapdragon 8 Gen 3 (Adreno 750)',
    badge: 'Xiaomi HyperOS'
  },
  {
    id: 'preset-oneplus-oxygenos',
    osFamily: 'android',
    manufacturer: 'OnePlus',
    skinName: 'OxygenOS 14',
    name: 'OnePlus 12 5G (OxygenOS 14)',
    osVersion: 'OnePlus OxygenOS 14.0 (Android 14)',
    androidVersion: '14.0 (OxygenOS 14)',
    apiLevel: 34,
    architecture: 'arm64-v8a',
    resolution: '1440 x 3168',
    densityDpi: 510,
    ramGb: 16,
    cpuInfo: 'Snapdragon 8 Gen 3 / Trinity Engine',
    badge: 'OnePlus OxygenOS 14'
  },
  {
    id: 'preset-nothing-os',
    osFamily: 'android',
    manufacturer: 'Nothing',
    skinName: 'Nothing OS 2.6',
    name: 'Nothing Phone (2) (Nothing OS)',
    osVersion: 'Nothing OS 2.6 (Android 14 • Glyph UI)',
    androidVersion: '14.0 (Nothing OS 2.6)',
    apiLevel: 34,
    architecture: 'arm64-v8a',
    resolution: '1080 x 2412',
    densityDpi: 394,
    ramGb: 12,
    cpuInfo: 'Snapdragon 8+ Gen 1',
    badge: 'Nothing OS 2.6'
  },
  {
    id: 'preset-a15',
    osFamily: 'android',
    manufacturer: 'Google',
    skinName: 'Pixel UI',
    name: 'Google Pixel 9 Pro',
    osVersion: 'Pixel UI • Android 15 (Vanilla Ice Cream)',
    androidVersion: '15.0 (Pixel UI)',
    apiLevel: 35,
    architecture: 'arm64-v8a',
    resolution: '1280 x 2856',
    densityDpi: 495,
    ramGb: 16,
    cpuInfo: 'Google Tensor G4 (ARM64-v8.2)',
    badge: 'Google Pixel (Android 15)'
  },
  {
    id: 'preset-a11',
    osFamily: 'android',
    manufacturer: 'Xiaomi',
    skinName: 'MIUI 14',
    name: 'Xiaomi Redmi Note 12',
    osVersion: 'Xiaomi MIUI 14 / HyperOS (Android 12)',
    androidVersion: '12.0 (MIUI 14)',
    apiLevel: 31,
    architecture: 'arm64-v8a',
    resolution: '1080 x 2400',
    densityDpi: 395,
    ramGb: 6,
    cpuInfo: 'Snapdragon 685 Octa-core',
    badge: 'Redmi MIUI 14'
  },
  // Windows Environments
  {
    id: 'preset-win11-wsa',
    osFamily: 'windows',
    manufacturer: 'Microsoft',
    skinName: 'Windows 11 WSA',
    name: 'Windows 11 WSA 2311',
    osVersion: 'Windows 11 Pro 23H2 (WSA Build 2311)',
    androidVersion: '13.0 (WSA Subsystem)',
    apiLevel: 33,
    architecture: 'x86_64',
    resolution: '1920 x 1080 (Windowed)',
    densityDpi: 240,
    ramGb: 16,
    cpuInfo: 'Intel Core i9-13900K / Hyper-V',
    badge: 'Windows 11 WSA'
  },
  {
    id: 'preset-win10-hyperv',
    osFamily: 'windows',
    manufacturer: 'Microsoft',
    skinName: 'Windows 10 VM',
    name: 'Windows 10 Hyper-V Genymotion',
    osVersion: 'Windows 10 Enterprise (Build 19045)',
    androidVersion: '12.0 (x86 VM)',
    apiLevel: 32,
    architecture: 'x86_64',
    resolution: '1440 x 2560',
    densityDpi: 440,
    ramGb: 8,
    cpuInfo: 'AMD Ryzen 7 5800X / DirectX 12',
    badge: 'Windows 10 VM'
  },
  // Linux Environments
  {
    id: 'preset-linux-waydroid',
    osFamily: 'linux',
    manufacturer: 'Canonical',
    skinName: 'Waydroid LXC',
    name: 'Ubuntu 24.04 (Waydroid Container)',
    osVersion: 'Ubuntu 24.04 LTS (Linux 6.8 / Wayland)',
    androidVersion: '13.0 (LineageOS 20 based)',
    apiLevel: 33,
    architecture: 'x86_64',
    resolution: '1920 x 1080 (Desktop Seamless)',
    densityDpi: 240,
    ramGb: 32,
    cpuInfo: 'AMD EPYC / Mesa Vulkan Passthrough',
    badge: 'Ubuntu Waydroid'
  },
  {
    id: 'preset-linux-debian-kvm',
    osFamily: 'linux',
    manufacturer: 'Debian',
    skinName: 'QEMU-KVM',
    name: 'Debian 12 / Arch (QEMU-KVM)',
    osVersion: 'Debian 12 Bookworm (Linux 6.1)',
    androidVersion: '11.0 (AOSP x86_64)',
    apiLevel: 30,
    architecture: 'x86_64',
    resolution: '1280 x 720',
    densityDpi: 213,
    ramGb: 8,
    cpuInfo: 'KVM Virtualized Host Passthrough',
    badge: 'Linux KVM'
  }
];

export const DeviceManager: React.FC<DeviceManagerProps> = ({
  devices,
  onToggleDeviceSelect,
  onSelectAllDevices,
  onRefreshDevices,
  onAddNewVirtualDevice
}) => {
  const [selectedOsFilter, setSelectedOsFilter] = useState<'all' | 'android' | 'windows' | 'linux'>('all');
  const [selectedDeviceDetails, setSelectedDeviceDetails] = useState<Device | null>(devices[0] || null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Custom device form state
  const [customOsFamily, setCustomOsFamily] = useState<OsFamily>('android');
  const [customManufacturer, setCustomManufacturer] = useState<string>('Samsung');
  const [customName, setCustomName] = useState<string>('Samsung Galaxy S24 Ultra');
  const [customOsVersion, setCustomOsVersion] = useState<string>('Samsung One UI 6.1 (Android 14)');
  const [customAndroidVersion, setCustomAndroidVersion] = useState<string>('14.0 (One UI 6.1)');
  const [customApiLevel, setCustomApiLevel] = useState<number>(34);
  const [customArch, setCustomArch] = useState<'arm64-v8a' | 'x86_64'>('arm64-v8a');
  const [customResolution, setCustomResolution] = useState<string>('1440 x 3120');
  const [customRamGb, setCustomRamGb] = useState<number>(12);

  const [adbConsoleOutput, setAdbConsoleOutput] = useState<string>(
`$ adb devices -l
List of devices attached
R5CX10S24UL            device usb:1-1 product:e3q model:SM_S928B transport_id:1 (Samsung One UI 6.1)
XM14PRO8821H           device usb:1-2 product:shennong model:Xiaomi_14_Pro transport_id:2 (Xiaomi HyperOS 1.0)
OP12CPH2581A           device usb:1-3 product:waffle model:OnePlus_12 transport_id:3 (OxygenOS 14)
NT2A065GLYPH           device usb:1-4 product:Pong model:Nothing_Phone_2 transport_id:4 (Nothing OS 2.6)
99211FDF60000P         device usb:1-5 product:caiman model:Pixel_9_Pro transport_id:5 (Android 15)
127.0.0.1:58526        device product:wsa_x86_64 model:WSA_Win11 transport_id:6 (Windows 11 WSA)
waydroid-session-1000  device product:waydroid_x86 model:Ubuntu_2404 transport_id:7 (Linux Waydroid)
`
  );
  const [customCommand, setCustomCommand] = useState<string>('adb devices -l');

  // Filter devices based on selected OS tab
  const filteredDevices = useMemo(() => {
    if (selectedOsFilter === 'all') return devices;
    return devices.filter(d => {
      const family = d.osFamily || (d.name.toLowerCase().includes('windows') || d.osVersion?.toLowerCase().includes('windows')
        ? 'windows'
        : d.name.toLowerCase().includes('linux') || d.name.toLowerCase().includes('ubuntu') || d.osVersion?.toLowerCase().includes('linux')
        ? 'linux'
        : 'android');
      return family === selectedOsFilter;
    });
  }, [devices, selectedOsFilter]);

  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCommand.trim()) return;

    let response = '';
    const cmd = customCommand.trim().toLowerCase();

    if (cmd.includes('devices')) {
      response = `List of devices attached\n` + devices.map(d => `${d.serialNumber.padEnd(22)} device product:${d.model} [${d.osFamily?.toUpperCase() || 'ANDROID'}] transport_id:${d.apiLevel}`).join('\n');
    } else if (cmd.includes('wm size')) {
      response = `Physical size: ${selectedDeviceDetails ? selectedDeviceDetails.resolution : '1080x2400'}\nOverride size: ${selectedDeviceDetails ? selectedDeviceDetails.resolution : '1080x2400'}`;
    } else if (cmd.includes('getprop')) {
      response = `[ro.product.model]: [${selectedDeviceDetails?.model || 'Pixel 7'}]\n[ro.build.version.sdk]: [${selectedDeviceDetails?.apiLevel || 34}]\n[ro.product.cpu.abi]: [${selectedDeviceDetails?.architecture || 'arm64-v8a'}]\n[ro.host.os]: [${selectedDeviceDetails?.osVersion || 'Android 14'}]`;
    } else if (cmd.includes('wsa') || cmd.includes('waydroid')) {
      response = `Subsystem Bridge: Connected to host daemon on 127.0.0.1\nIPC Transport: Direct KVM/Hyper-V shared memory channel\nStatus: 0 packet loss, 60 FPS composite buffer active.`;
    } else if (cmd.includes('meminfo')) {
      response = `Applications Memory Usage (in Kilobytes):\nUptime: 243929 Realtime: 243929\n** MEMINFO in pid 7421 **\n                   Pss  Private  Private  SwapPss     Heap     Heap     Heap\n                 Total    Dirty    Clean    Dirty     Size    Alloc     Free\n                ------   ------   ------   ------   ------   ------   ------\n  Native Heap    34280    34120        0     1200    54200    42100    12100\n  Dalvik Heap    48120    48000        0        0    68000    51000    17000\n        TOTAL   182400   162120     8100     1200   122200    93100    29100`;
    } else {
      response = `Executed: ${customCommand}\n[Output]: Host ADB and Subsystem bridge responded with exit status 0.`;
    }

    setAdbConsoleOutput(prev => `${prev}\n$ ${customCommand}\n${response}\n`);
    setCustomCommand('');
  };

  const handleAddPreset = (preset: OsPreset) => {
    const newDevice: Partial<Device> = {
      id: `dev-${preset.osFamily}-${Date.now()}`,
      serialNumber: preset.osFamily === 'windows'
        ? `127.0.0.1:${Math.floor(58000 + Math.random() * 1000)}`
        : preset.osFamily === 'linux'
        ? `waydroid-${Math.floor(1000 + Math.random() * 9000)}`
        : `${preset.manufacturer.substring(0, 3).toUpperCase()}-${Math.floor(5554 + Math.random() * 900)}`,
      name: preset.name,
      model: `${preset.name} (${preset.skinName})`,
      manufacturer: preset.manufacturer,
      osFamily: preset.osFamily,
      osVersion: preset.osVersion,
      skinName: preset.skinName,
      androidVersion: preset.androidVersion,
      apiLevel: preset.apiLevel,
      architecture: preset.architecture,
      resolution: preset.resolution,
      densityDpi: preset.densityDpi,
      ramGb: preset.ramGb,
      cpuInfo: preset.cpuInfo,
      batteryLevel: 100,
      availableStorageGb: 64,
      status: 'ready',
      isEmulator: true,
      selectedForTest: true
    };

    onAddNewVirtualDevice(newDevice);
    setSelectedDeviceDetails(newDevice as Device);
  };

  const handleCreateCustomDevice = (e: React.FormEvent) => {
    e.preventDefault();
    const newDevice: Partial<Device> = {
      id: `dev-custom-${Date.now()}`,
      serialNumber: customOsFamily === 'windows'
        ? `127.0.0.1:${Math.floor(58000 + Math.random() * 1000)}`
        : customOsFamily === 'linux'
        ? `waydroid-host-${Math.floor(1000 + Math.random() * 9000)}`
        : `emulator-${Math.floor(5554 + Math.random() * 20)}`,
      name: customName || `${customOsFamily.toUpperCase()} Instance`,
      model: `${customName} (${customManufacturer})`,
      manufacturer: customOsFamily === 'windows' ? 'Microsoft' : customOsFamily === 'linux' ? 'Canonical / Linux' : customManufacturer,
      osFamily: customOsFamily,
      osVersion: customOsVersion,
      androidVersion: customAndroidVersion,
      apiLevel: customApiLevel,
      architecture: customArch,
      resolution: customResolution,
      densityDpi: 420,
      ramGb: customRamGb,
      cpuInfo: customArch === 'x86_64' ? 'Host x86_64 (KVM/Hyper-V)' : 'ARM64-v8a Virtual CPU',
      batteryLevel: 100,
      availableStorageGb: 64,
      status: 'ready',
      isEmulator: true,
      selectedForTest: true
    };

    onAddNewVirtualDevice(newDevice);
    setSelectedDeviceDetails(newDevice as Device);
    setIsAddModalOpen(false);
  };

  const allSelected = filteredDevices.length > 0 && filteredDevices.every(d => d.selectedForTest);
  const selectedCount = devices.filter(d => d.selectedForTest).length;

  const getOsIcon = (osFamily?: OsFamily, name?: string) => {
    const family = osFamily || (name?.toLowerCase().includes('windows') ? 'windows' : name?.toLowerCase().includes('linux') ? 'linux' : 'android');
    if (family === 'windows') return <Laptop className="w-4 h-4 text-blue-500" />;
    if (family === 'linux') return <Server className="w-4 h-4 text-amber-500" />;
    return <Smartphone className="w-4 h-4 text-emerald-500" />;
  };

  const getOsBadgeColor = (osFamily?: OsFamily, name?: string) => {
    const family = osFamily || (name?.toLowerCase().includes('windows') ? 'windows' : name?.toLowerCase().includes('linux') ? 'linux' : 'android');
    if (family === 'windows') return 'bg-blue-50 text-blue-700 border-blue-200';
    if (family === 'linux') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue-600" />
              <span>Multi-OS Device Matrix & Compatibility Engine (M2)</span>
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono font-medium border border-blue-100">
              Android • Windows • Linux
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure, select, and dispatch test suites across multiple Android versions (15, 14, 13, 12, 11, 10), Windows Subsystems (WSA), and Linux containers (Waydroid/KVM).
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="btn-open-add-os-instance"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom OS Runner</span>
          </button>
          <button
            onClick={onRefreshDevices}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-lg border border-slate-200 shadow-2xs transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Poll ADB & Subsystems</span>
          </button>
        </div>
      </div>

      {/* Quick-Add OS Version Presets Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Quick-Select & Instantiate OS Environments
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">1-Click to provision instance into matrix</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {OS_PRESETS.map((preset) => {
            const isAlreadyAdded = devices.some(d => d.name === preset.name || d.osVersion === preset.osVersion);
            return (
              <button
                key={preset.id}
                onClick={() => handleAddPreset(preset)}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isAlreadyAdded
                    ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    : 'border-blue-200 bg-blue-50/40 hover:bg-blue-50 text-blue-900 shadow-2xs hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1.5">
                    {getOsIcon(preset.osFamily)}
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-500">{preset.osFamily}</span>
                  </div>
                  {isAlreadyAdded ? (
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-emerald-100 text-emerald-800">
                      In Matrix
                    </span>
                  ) : (
                    <Plus className="w-3.5 h-3.5 text-blue-600" />
                  )}
                </div>

                <div className="mt-2">
                  <span className="font-semibold text-xs text-slate-900 block truncate">{preset.badge}</span>
                  <span className="text-[10px] text-slate-500 font-mono block truncate">{preset.architecture}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* OS Filter Tabs & Selection Control Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
        {/* OS Platform Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setSelectedOsFilter('all')}
            className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              selectedOsFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>All Platforms ({devices.length})</span>
          </button>
          <button
            onClick={() => setSelectedOsFilter('android')}
            className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              selectedOsFilter === 'android'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Android OS ({devices.filter(d => (d.osFamily || 'android') === 'android').length})</span>
          </button>
          <button
            onClick={() => setSelectedOsFilter('windows')}
            className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              selectedOsFilter === 'windows'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Laptop className="w-3.5 h-3.5 text-blue-600" />
            <span>Windows WSA ({devices.filter(d => (d.osFamily || (d.name.includes('Windows') ? 'windows' : 'android')) === 'windows').length})</span>
          </button>
          <button
            onClick={() => setSelectedOsFilter('linux')}
            className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              selectedOsFilter === 'linux'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-amber-600" />
            <span>Linux Containers ({devices.filter(d => (d.osFamily || (d.name.includes('Linux') || d.name.includes('Ubuntu') ? 'linux' : 'android')) === 'linux').length})</span>
          </button>
        </div>

        {/* Global Select Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectAllDevices(!allSelected)}
            className="flex items-center gap-2 font-semibold text-slate-800 hover:text-blue-600 transition-colors cursor-pointer"
          >
            {allSelected ? (
              <CheckSquare className="w-4 h-4 text-blue-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            <span>Select All in View</span>
          </button>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 font-medium">
            <strong className="text-blue-600 font-mono font-bold">{selectedCount}</strong> total target instances active
          </span>
        </div>
      </div>

      {/* Main Grid: Devices Table & Detailed Hardware Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Matrix Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-xs">
          <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 font-mono flex items-center gap-2">
              <span>Active OS Instances & Test Runners</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 text-slate-700">
                {filteredDevices.length} Available
              </span>
            </h3>
            <span className="text-[11px] text-slate-500">Select row for hardware & telemetry inspector</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-100 uppercase text-[10px] font-semibold tracking-wider bg-slate-50/40">
                <tr>
                  <th className="p-3 w-10">Target</th>
                  <th className="p-3">Platform / Model</th>
                  <th className="p-3">OS Version / API</th>
                  <th className="p-3">Arch & RAM</th>
                  <th className="p-3">Resolution</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredDevices.map((device) => {
                  const isSelected = selectedDeviceDetails?.id === device.id;
                  const family = device.osFamily || (device.name.includes('Windows') ? 'windows' : device.name.includes('Linux') || device.name.includes('Ubuntu') ? 'linux' : 'android');
                  return (
                    <tr
                      key={device.id}
                      onClick={() => setSelectedDeviceDetails(device)}
                      className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50/60 ring-1 ring-blue-500/20' : ''
                      }`}
                    >
                      <td className="p-3" onClick={(e) => { e.stopPropagation(); onToggleDeviceSelect(device.id); }}>
                        <input
                          type="checkbox"
                          checked={device.selectedForTest}
                          onChange={() => onToggleDeviceSelect(device.id)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          {getOsIcon(device.osFamily, device.name)}
                          <span>{device.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold border ${getOsBadgeColor(device.osFamily, device.name)}`}>
                            {family.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block pl-6">{device.serialNumber}</span>
                      </td>
                      <td className="p-3 font-mono">
                        <span className="text-slate-800 font-medium">{device.osVersion || `Android ${device.androidVersion}`}</span>
                        <span className="text-slate-400 block text-[10px]">API Level {device.apiLevel}</span>
                      </td>
                      <td className="p-3 font-mono text-slate-600">
                        <span className="font-semibold text-slate-800">{device.architecture || (device.cpuInfo?.includes('x86') ? 'x86_64' : 'arm64-v8a')}</span>
                        <span className="text-slate-400 block text-[10px]">{device.ramGb} GB RAM</span>
                      </td>
                      <td className="p-3 font-mono text-slate-600">{device.resolution}</td>
                      <td className="p-3 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {device.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Device Hardware Spec Card */}
        {selectedDeviceDetails && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                {getOsIcon(selectedDeviceDetails.osFamily, selectedDeviceDetails.name)}
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedDeviceDetails.name}</h3>
                  <p className="text-[11px] text-slate-500 font-mono">{selectedDeviceDetails.model} • {selectedDeviceDetails.manufacturer}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-md border text-xs font-mono font-semibold ${getOsBadgeColor(selectedDeviceDetails.osFamily, selectedDeviceDetails.name)}`}>
                {(selectedDeviceDetails.osFamily || 'ANDROID').toUpperCase()}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">OS Version & Kernel</span>
                </div>
                <span className="font-mono text-slate-800 font-medium text-[11px] truncate max-w-[170px] text-right">
                  {selectedDeviceDetails.osVersion || `Android ${selectedDeviceDetails.androidVersion}`} (API {selectedDeviceDetails.apiLevel})
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <Terminal className="w-4 h-4 text-purple-600" />
                  <span className="font-medium">Architecture / CPU</span>
                </div>
                <span className="font-mono text-slate-800 font-medium text-[11px] truncate max-w-[170px] text-right">
                  {selectedDeviceDetails.architecture || 'ARM64-v8a'} • {selectedDeviceDetails.cpuInfo?.split('(')[0] || 'Multi-core'}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <HardDrive className="w-4 h-4 text-teal-600" />
                  <span className="font-medium">Memory Allocation</span>
                </div>
                <span className="font-mono text-slate-800 font-medium text-[11px]">
                  {selectedDeviceDetails.ramGb} GB RAM • {selectedDeviceDetails.availableStorageGb} GB Free
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <Monitor className="w-4 h-4 text-amber-600" />
                  <span className="font-medium">Display & DPI</span>
                </div>
                <span className="font-mono text-slate-800 font-medium text-[11px]">
                  {selectedDeviceDetails.resolution} ({selectedDeviceDetails.densityDpi} DPI)
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <Battery className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium">Subsystem IPC / Bridge</span>
                </div>
                <span className="font-mono text-emerald-700 text-[11px] font-bold">
                  Active (Port {selectedDeviceDetails.apiLevel + 5000})
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onToggleDeviceSelect(selectedDeviceDetails.id)}
                className={`w-full py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedDeviceDetails.selectedForTest
                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20'
                }`}
              >
                {selectedDeviceDetails.selectedForTest ? 'Remove from Active Test Suite Matrix' : 'Include in Active Test Suite Matrix'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom OS Instance Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg overflow-hidden shadow-2xl space-y-0">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Provision Custom OS Test Runner</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomDevice} className="p-6 space-y-4 text-xs">
              {/* OS Family Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target OS Platform</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCustomOsFamily('android');
                      setCustomName('Android 15 Virtual Device');
                      setCustomOsVersion('Android 15 (Vanilla Ice Cream)');
                      setCustomAndroidVersion('15.0');
                      setCustomApiLevel(35);
                    }}
                    className={`p-3 rounded-xl border text-center font-semibold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      customOsFamily === 'android'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-emerald-600" />
                    <span>Android OS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCustomOsFamily('windows');
                      setCustomName('Windows 11 WSA Instance');
                      setCustomOsVersion('Windows 11 Pro 23H2 (WSA)');
                      setCustomAndroidVersion('13.0 (WSA Subsystem)');
                      setCustomApiLevel(33);
                      setCustomArch('x86_64');
                      setCustomResolution('1920 x 1080 (Windowed)');
                    }}
                    className={`p-3 rounded-xl border text-center font-semibold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      customOsFamily === 'windows'
                        ? 'border-blue-500 bg-blue-50 text-blue-800 ring-1 ring-blue-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Laptop className="w-5 h-5 text-blue-600" />
                    <span>Windows (WSA)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCustomOsFamily('linux');
                      setCustomName('Ubuntu 24.04 Waydroid Node');
                      setCustomOsVersion('Ubuntu 24.04 LTS (Waydroid Container)');
                      setCustomAndroidVersion('13.0 (Waydroid)');
                      setCustomApiLevel(33);
                      setCustomArch('x86_64');
                      setCustomResolution('1920 x 1080 (Desktop)');
                    }}
                    className={`p-3 rounded-xl border text-center font-semibold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      customOsFamily === 'linux'
                        ? 'border-amber-500 bg-amber-50 text-amber-800 ring-1 ring-amber-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Server className="w-5 h-5 text-amber-600" />
                    <span>Linux (Waydroid)</span>
                  </button>
                </div>
              </div>

              {customOsFamily === 'android' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">OEM Brand & Mobile OS Skin</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[
                      { brand: 'Samsung', name: 'Samsung Galaxy S24 Ultra', os: 'Samsung One UI 6.1 (Android 14)', ver: '14.0 (One UI 6.1)', api: 34, res: '1440 x 3120' },
                      { brand: 'Xiaomi', name: 'Xiaomi 14 Pro', os: 'Xiaomi HyperOS 1.0 (Android 14)', ver: '14.0 (HyperOS)', api: 34, res: '1440 x 3200' },
                      { brand: 'OnePlus', name: 'OnePlus 12 5G', os: 'OnePlus OxygenOS 14.0 (Android 14)', ver: '14.0 (OxygenOS 14)', api: 34, res: '1440 x 3168' },
                      { brand: 'Nothing', name: 'Nothing Phone (2)', os: 'Nothing OS 2.6 (Android 14 • Glyph UI)', ver: '14.0 (Nothing OS 2.6)', api: 34, res: '1080 x 2412' },
                      { brand: 'Google', name: 'Google Pixel 9 Pro', os: 'Pixel UI • Android 15 (Vanilla Ice Cream)', ver: '15.0 (Pixel UI)', api: 35, res: '1280 x 2856' }
                    ].map((oem) => (
                      <button
                        key={oem.brand}
                        type="button"
                        onClick={() => {
                          setCustomManufacturer(oem.brand);
                          setCustomName(oem.name);
                          setCustomOsVersion(oem.os);
                          setCustomAndroidVersion(oem.ver);
                          setCustomApiLevel(oem.api);
                          setCustomResolution(oem.res);
                        }}
                        className={`px-2 py-1.5 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer truncate ${
                          customManufacturer === oem.brand
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {oem.brand}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Name and OS Version */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Instance Identifier</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">OS Release / Skin Version</label>
                  <input
                    type="text"
                    value={customOsVersion}
                    onChange={(e) => setCustomOsVersion(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                    required
                  />
                </div>
              </div>

              {/* API Level & Architecture */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Android API Level</label>
                  <select
                    value={customApiLevel}
                    onChange={(e) => {
                      const api = Number(e.target.value);
                      setCustomApiLevel(api);
                      if (api === 35) setCustomAndroidVersion('15.0');
                      else if (api === 34) setCustomAndroidVersion('14.0');
                      else if (api === 33) setCustomAndroidVersion('13.0');
                      else if (api === 31) setCustomAndroidVersion('12.0');
                      else if (api === 30) setCustomAndroidVersion('11.0');
                      else if (api === 29) setCustomAndroidVersion('10.0');
                      else if (api === 28) setCustomAndroidVersion('9.0');
                      else if (api === 27) setCustomAndroidVersion('8.1');
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value={35}>API 35 (Android 15 - Vanilla Ice Cream)</option>
                    <option value={34}>API 34 (Android 14 - Upside Down Cake)</option>
                    <option value={33}>API 33 (Android 13 - Tiramisu)</option>
                    <option value={31}>API 31 (Android 12 - Snow Cone)</option>
                    <option value={30}>API 30 (Android 11 - Red Velvet)</option>
                    <option value={29}>API 29 (Android 10 - Quince Tart)</option>
                    <option value={28}>API 28 (Android 9.0 - Pie)</option>
                    <option value={27}>API 27 (Android 8.1 - Oreo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Instruction Architecture</label>
                  <select
                    value={customArch}
                    onChange={(e) => setCustomArch(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="arm64-v8a">ARM64-v8a (Native Mobile Silicon)</option>
                    <option value="x86_64">x86_64 (Desktop & Cloud KVM Hypervisor)</option>
                  </select>
                </div>
              </div>

              {/* Resolution and RAM */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Viewport Resolution</label>
                  <select
                    value={customResolution}
                    onChange={(e) => setCustomResolution(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="1280 x 2856">1280 x 2856 (QHD+ High-End)</option>
                    <option value="1080 x 2400">1080 x 2400 (FHD+ Standard Phone)</option>
                    <option value="768 x 1280">768 x 1280 (HD Compact Screen)</option>
                    <option value="1920 x 1080 (Windowed)">1920 x 1080 (Desktop Windowed / WSA)</option>
                    <option value="2560 x 1600">2560 x 1600 (Tablet / Foldable)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Allocated RAM (GB)</label>
                  <select
                    value={customRamGb}
                    onChange={(e) => setCustomRamGb(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value={4}>4 GB RAM</option>
                    <option value={8}>8 GB RAM</option>
                    <option value={12}>12 GB RAM</option>
                    <option value={16}>16 GB RAM (High Performance)</option>
                    <option value={32}>32 GB RAM (Host Passthrough)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Provision & Activate in Matrix</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive ADB & Subsystem Command Console */}
      <div className="bg-[#1E293B] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-[#0F172A] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span>Interactive ADB & Subsystem Bridge Terminal</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setCustomCommand('adb devices -l')}
              className="text-[10px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono cursor-pointer"
            >
              adb devices -l
            </button>
            <button
              onClick={() => setCustomCommand('adb shell getprop ro.build.version.release')}
              className="text-[10px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono cursor-pointer"
            >
              adb shell getprop
            </button>
            <button
              onClick={() => setCustomCommand('adb shell dumpsys meminfo')}
              className="text-[10px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono cursor-pointer"
            >
              dumpsys meminfo
            </button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <pre className="font-mono text-xs text-emerald-400 bg-slate-950/90 p-4 rounded-lg h-40 overflow-y-auto custom-scrollbar whitespace-pre-wrap">
            {adbConsoleOutput}
          </pre>

          <form onSubmit={handleRunCommand} className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2 text-slate-500 font-mono text-xs">$</span>
              <input
                type="text"
                value={customCommand}
                onChange={(e) => setCustomCommand(e.target.value)}
                placeholder="Enter command (e.g., adb shell wm size, adb logcat -d, wsa status)"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-7 pr-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-semibold font-mono cursor-pointer transition-colors"
            >
              Execute
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
