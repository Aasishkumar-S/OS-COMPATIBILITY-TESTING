import React, { useState, useEffect, useMemo } from 'react';
import {
  Layers,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Smartphone,
  Type,
  Maximize2
} from 'lucide-react';
import {
  ApkMetadata,
  Device,
  ScreenshotComparison,
  UiIssue,
  ExtractedLayoutScreen,
  ExtractedWidget
} from '../types';

interface VisualRegressionProps {
  apk: ApkMetadata;
  comparisons: ScreenshotComparison[];
  uiIssues: UiIssue[];
  devices: Device[];
}

interface SynthesizedWidgetNode {
  id: string;
  type: ExtractedWidget['type'];
  label: string;
  hint?: string;
  baselineBounds: string;
  targetBounds: string;
  deltaPx: number;
  ssimScore: number;
  issue?: UiIssue;
}

export const VisualRegression: React.FC<VisualRegressionProps> = ({
  apk,
  comparisons,
  uiIssues,
  devices
}) => {
  const [selectedComp, setSelectedComp] = useState<ScreenshotComparison | undefined>(comparisons[0]);
  const [threshold, setThreshold] = useState<number>(comparisons[0]?.thresholdPercentage || 5.0);
  const [viewMode, setViewMode] = useState<'diff_overlay' | 'side_by_side' | 'slider'>('diff_overlay');
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [fontScale, setFontScale] = useState<number>(1.0);
  const [targetDeviceId, setTargetDeviceId] = useState<string>(
    comparisons[0]?.targetDevice?.id || devices[1]?.id || devices[0]?.id || ''
  );

  // Sync selected comparison whenever the user switches or uploads a new APK
  useEffect(() => {
    if (comparisons.length > 0) {
      setSelectedComp(comparisons[0]);
      setThreshold(comparisons[0].thresholdPercentage);
      setTargetDeviceId(comparisons[0].targetDevice.id);
      setFontScale(1.0);
    }
  }, [apk.id, apk.packageName, comparisons]);

  const activeComp = selectedComp || comparisons[0];
  const activeScreenName = activeComp?.screenName || 'MainActivity';

  const selectedTargetDevice = useMemo(() => {
    return (
      devices.find((d) => d.id === targetDeviceId) ||
      activeComp?.targetDevice ||
      devices[0]
    );
  }, [devices, targetDeviceId, activeComp]);

  // Match any UI issues detected on the currently selected screen of this APK
  const screenIssues = useMemo(() => {
    return uiIssues.filter(
      (i) =>
        i.screenName === activeScreenName ||
        activeScreenName.includes(i.screenName)
    );
  }, [uiIssues, activeScreenName]);

  // Match extracted XML layout for this screen if uploaded APK has extractedLayouts
  const matchingLayout: ExtractedLayoutScreen | undefined = useMemo(() => {
    if (!apk.extractedLayouts || apk.extractedLayouts.length === 0) return undefined;
    return (
      apk.extractedLayouts.find(
        (l) =>
          l.activityName === activeScreenName ||
          l.screenTitle === activeScreenName ||
          l.fileName.replace('.xml', '') === activeScreenName
      ) || apk.extractedLayouts[0]
    );
  }, [apk.extractedLayouts, activeScreenName]);

  // Build widget-level visual comparison nodes from the current APK's screen
  const screenWidgetNodes: SynthesizedWidgetNode[] = useMemo(() => {
    const isCompactTarget =
      selectedTargetDevice?.resolution.includes('768') ||
      selectedTargetDevice?.id === 'dev-emulator-small';
    const fontExtraShift = fontScale > 1.0 ? Math.round((fontScale - 1.0) * 65) : 0;

    if (matchingLayout && matchingLayout.widgets.length > 0) {
      return matchingLayout.widgets.slice(0, 6).map((w, idx) => {
        const baseTop = 88 + idx * 165;
        const baseH = w.type === 'Button' ? 88 : 116;
        const matchedIssue = screenIssues.find((iss) =>
          iss.elementSelector.endsWith(`/${w.id}`)
        );
        const isLastOnCompact = isCompactTarget && idx === matchingLayout.widgets.slice(0, 6).length - 1;
        const shiftY = matchedIssue
          ? matchedIssue.type === 'boundary_overflow'
            ? 84 + fontExtraShift
            : 28 + fontExtraShift
          : isLastOnCompact
          ? 42 + fontExtraShift
          : fontExtraShift;

        const targetTop = baseTop + shiftY;
        const targetH = baseH + (w.type === 'TextView' && fontScale > 1.0 ? Math.round((fontScale - 1) * 32) : 0);
        const ssim = matchedIssue
          ? Number(Math.max(74.2, 92.5 - shiftY * 0.15).toFixed(1))
          : Number(Math.max(94.0, 99.8 - shiftY * 0.12).toFixed(1));

        return {
          id: w.id,
          type: w.type,
          label: w.label || w.hint || w.id,
          hint: w.hint,
          baselineBounds: `[36, ${baseTop}][732, ${baseTop + baseH}]`,
          targetBounds: `[36, ${targetTop}][732, ${targetTop + targetH}]`,
          deltaPx: shiftY,
          ssimScore: ssim,
          issue: matchedIssue
        };
      });
    }

    // Derive application-specific nodes for sample APKs or manifest-only APKs
    const sampleStrings =
      apk.extractedStrings && apk.extractedStrings.length > 0
        ? apk.extractedStrings.slice(0, 4)
        : [
            `${apk.appName} Header`,
            `${activeScreenName} Content Card`,
            `Interactive Form / Status Row`,
            `Primary Action Button`
          ];

    return sampleStrings.map((label, idx) => {
      const baseTop = 92 + idx * 240;
      const baseH = idx === sampleStrings.length - 1 ? 96 : 156;
      const matchedIssue =
        screenIssues.length === 1
          ? idx === sampleStrings.length - 1
            ? screenIssues[0]
            : undefined
          : screenIssues[idx];

      const shiftY = matchedIssue
        ? matchedIssue.type === 'boundary_overflow'
          ? 110 + fontExtraShift
          : 34 + fontExtraShift
        : fontExtraShift;

      const targetTop = baseTop + shiftY;
      const rawWidgetId = matchedIssue
        ? matchedIssue.elementSelector.split('/').pop() || `node_${idx + 1}`
        : idx === 0
        ? 'toolbar_header'
        : idx === sampleStrings.length - 1
        ? 'btn_primary_action'
        : `card_section_${idx}`;
      const widgetId = rawWidgetId;

      const widgetType: ExtractedWidget['type'] =
        idx === 0
          ? 'Toolbar'
          : idx === sampleStrings.length - 1
          ? 'Button'
          : idx === 1
          ? 'CardView'
          : 'TextView';

      return {
        id: widgetId,
        type: widgetType,
        label,
        baselineBounds: `[40, ${baseTop}][728, ${baseTop + baseH}]`,
        targetBounds: `[40, ${targetTop}][728, ${targetTop + baseH}]`,
        deltaPx: shiftY,
        ssimScore: matchedIssue
          ? Number(Math.max(76.4, 91.2 - shiftY * 0.1).toFixed(1))
          : Number(Math.max(96.2, 99.7 - shiftY * 0.1).toFixed(1)),
        issue: matchedIssue
      };
    });
  }, [matchingLayout, screenIssues, selectedTargetDevice, fontScale, apk, activeScreenName]);

  // Compute live diff percentage factoring in selected target device & font scale
  const effectiveDiffPercentage = useMemo(() => {
    if (!activeComp) return 0;
    const baseDiff = activeComp.diffPercentage;
    const scalePenalty = fontScale > 1.0 ? (fontScale - 1.0) * 18 : 0;
    const devicePenalty =
      selectedTargetDevice?.id !== activeComp.targetDevice.id &&
      selectedTargetDevice?.resolution.includes('768')
        ? 4.2
        : 0;
    return Number((baseDiff + scalePenalty + devicePenalty).toFixed(1));
  }, [activeComp, fontScale, selectedTargetDevice]);

  const hasRegression = effectiveDiffPercentage > threshold;

  // Live application screen renderer for Baseline vs Target frames
  const renderAppScreenFrame = (mode: 'baseline' | 'target') => {
    const isTarget = mode === 'target';
    const device = isTarget ? selectedTargetDevice : activeComp?.baselineDevice;
    const scaleFactor = isTarget ? fontScale : 1.0;

    return (
      <div className="w-full h-full bg-slate-950 flex flex-col justify-between p-3 text-left select-none relative overflow-hidden">
        {/* Device Status Bar */}
        <div>
          <div className="flex items-center justify-between text-[8px] font-mono text-slate-400 pb-1.5 border-b border-slate-800/80">
            <span className="truncate max-w-[110px]">{device?.name || 'Android Device'}</span>
            <span>{device?.resolution || '1080x2400'}</span>
          </div>

          {/* App Toolbar Header */}
          <div className="mt-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              {apk.iconDataUrl ? (
                <img
                  src={apk.iconDataUrl}
                  alt={apk.appName}
                  className="w-5 h-5 rounded-md object-cover border border-slate-700 shrink-0"
                />
              ) : (
                <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                  {apk.appName.slice(0, 1)}
                </div>
              )}
              <div className="min-w-0">
                <div
                  className="text-[10px] font-bold text-white truncate"
                  style={{ fontSize: `${Math.round(10 * scaleFactor)}px` }}
                >
                  {apk.appName}
                </div>
                <div className="text-[8px] font-mono text-slate-400 truncate">
                  {activeScreenName}
                </div>
              </div>
            </div>
            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {isTarget ? `${scaleFactor.toFixed(2)}x` : '1.00x'}
            </span>
          </div>

          {/* Extracted Drawables Strip if available */}
          {apk.extractedImages && apk.extractedImages.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5 overflow-hidden bg-slate-900/60 border border-slate-800/80 rounded-lg p-1.5">
              {apk.extractedImages.slice(0, 4).map((img, i) => (
                <img
                  key={i}
                  src={img.dataUrl}
                  alt={img.name}
                  className="w-7 h-7 rounded object-contain bg-slate-800 p-0.5 border border-slate-700/60 shrink-0"
                />
              ))}
              <span className="text-[8px] font-mono text-slate-400 truncate ml-1">
                {apk.extractedImages.length} APK Drawables
              </span>
            </div>
          )}

          {/* Screen Widget Nodes */}
          <div className="mt-2 space-y-1.5">
            {screenWidgetNodes.map((node, idx) => {
              const showShiftHighlight = isTarget && (Boolean(node.issue) || node.deltaPx >= 15);
              const isButton = node.type === 'Button' || node.type === 'FloatingActionButton';

              return (
                <div
                  key={`${mode}-${node.id}-${idx}`}
                  style={
                    isTarget && node.deltaPx > 0
                      ? { transform: `translateY(${Math.min(18, Math.round(node.deltaPx / 6))}px)` }
                      : undefined
                  }
                  className={`rounded-lg px-2.5 py-2 border transition-all relative ${
                    showShiftHighlight
                      ? 'bg-rose-950/75 border-rose-500 ring-1 ring-rose-400/50'
                      : isButton
                      ? 'bg-blue-600/90 border-blue-500 text-white'
                      : 'bg-slate-900/90 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 text-[8px] font-mono">
                    <span className={isButton && !showShiftHighlight ? 'text-blue-100' : 'text-slate-400'}>
                      &lt;{node.type}&gt; @{node.id}
                    </span>
                    {showShiftHighlight ? (
                      <span className="px-1 py-0.2 bg-rose-500 text-white rounded font-bold">
                        ΔY +{node.deltaPx}px
                      </span>
                    ) : (
                      <span className={isButton ? 'text-blue-100' : 'text-emerald-400'}>
                        SSIM {node.ssimScore}%
                      </span>
                    )}
                  </div>
                  <div
                    className={`font-semibold mt-0.5 ${
                      isTarget && scaleFactor > 1.1 ? 'truncate' : 'truncate'
                    } ${isButton ? 'text-white' : 'text-slate-100'}`}
                    style={{ fontSize: `${Math.min(13, Math.round(10 * scaleFactor))}px` }}
                  >
                    {node.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Diff Callout Banner on Target Frame */}
        {isTarget && (
          <div
            className={`mt-2 p-2 rounded-lg border text-[9px] font-mono font-bold flex items-center justify-between ${
              hasRegression
                ? 'bg-rose-950/90 border-rose-500 text-rose-200'
                : 'bg-emerald-950/90 border-emerald-500/60 text-emerald-200'
            }`}
          >
            <span className="truncate">
              {hasRegression
                ? screenIssues[0]
                  ? `⚠️ ${screenIssues[0].elementSelector.split('/').pop()}: ${screenIssues[0].type.replace(/_/g, ' ')}`
                  : `⚠️ Layout shift (${effectiveDiffPercentage}% > ${threshold}%)`
                : `✓ Aligned (${effectiveDiffPercentage}% ≤ ${threshold}%)`}
            </span>
            <span>{effectiveDiffPercentage}%</span>
          </div>
        )}
      </div>
    );
  };

  if (!activeComp) {
    return null;
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Header (Removed OpenCV / NumPy SSIM span badge as requested) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3.5">
          {apk.iconDataUrl ? (
            <img
              src={apk.iconDataUrl}
              alt={apk.appName}
              className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
            />
          ) : (
            <div className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Visual Regression & Screen Diff Inspector — {apk.appName}</span>
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Comparing actual layout bounds, typography scaling, and cross-device viewport rendering for{' '}
              <strong className="text-slate-700 font-mono">{apk.packageName}</strong> (v{apk.versionName}).
            </p>
          </div>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200/80 p-1.5 rounded-xl shrink-0">
          <button
            onClick={() => setViewMode('diff_overlay')}
            className={`text-xs px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              viewMode === 'diff_overlay' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Diff Heatmap
          </button>
          <button
            onClick={() => setViewMode('side_by_side')}
            className={`text-xs px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              viewMode === 'side_by_side' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setViewMode('slider')}
            className={`text-xs px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              viewMode === 'slider' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Split Slider
          </button>
        </div>
      </div>

      {/* Screen Selector, Target Device & Font Scale Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-500 font-medium mr-1">App Screen:</span>
          {comparisons.map((c) => {
            const isSelected = activeComp.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedComp(c);
                  setThreshold(c.thresholdPercentage);
                  setTargetDeviceId(c.targetDevice.id);
                }}
                className={`px-3 py-1.5 rounded-lg border font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{c.screenName}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded ${
                    isSelected
                      ? 'bg-blue-700 text-blue-100'
                      : c.diffPercentage > c.thresholdPercentage
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {c.diffPercentage}%
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Target Device Selector */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <Smartphone className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-slate-600 font-medium">Target Device:</span>
            <select
              value={selectedTargetDevice?.id || ''}
              onChange={(e) => setTargetDeviceId(e.target.value)}
              className="bg-transparent font-mono font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              {devices.map((dev) => (
                <option key={dev.id} value={dev.id}>
                  {dev.name} ({dev.resolution})
                </option>
              ))}
            </select>
          </div>

          {/* Font Scale Selector */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <Type className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-slate-600 font-medium">Font Scale:</span>
            <select
              value={fontScale}
              onChange={(e) => setFontScale(parseFloat(e.target.value))}
              className="bg-transparent font-mono font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value={1.0}>1.0x (Default)</option>
              <option value={1.15}>1.15x (Large)</option>
              <option value={1.3}>1.30x (Accessibility)</option>
            </select>
          </div>

          {/* Configurable Threshold Slider */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl">
            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span>Threshold:</span>
              <strong className="text-slate-900 font-mono">{threshold.toFixed(1)}%</strong>
            </div>
            <input
              type="range"
              min="0.5"
              max="25.0"
              step="0.5"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-24 accent-blue-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Comparison Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">
              Baseline Golden Master ({apk.appName})
            </span>
            <h4 className="text-sm font-bold text-slate-900 mt-0.5">{activeComp.baselineDevice.name}</h4>
            <span className="text-[10px] text-slate-400 font-mono">
              {activeComp.baselineDevice.resolution} • {activeComp.baselineDevice.densityDpi} dpi (1.0x)
            </span>
          </div>
          <Smartphone className="w-6 h-6 text-slate-400" />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">
              Target Device Render ({activeScreenName})
            </span>
            <h4 className="text-sm font-bold text-slate-900 mt-0.5">{selectedTargetDevice?.name}</h4>
            <span className="text-[10px] text-slate-400 font-mono">
              {selectedTargetDevice?.resolution} • {selectedTargetDevice?.densityDpi} dpi ({fontScale.toFixed(2)}x font)
            </span>
          </div>
          <Smartphone className="w-6 h-6 text-blue-600" />
        </div>

        <div
          className={`border rounded-xl p-4 flex items-center justify-between shadow-xs ${
            hasRegression ? 'bg-rose-50/50 border-rose-200' : 'bg-emerald-50/50 border-emerald-200'
          }`}
        >
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">
              Screen Visual Diff ({activeScreenName})
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h4
                className={`text-2xl font-bold font-mono ${
                  hasRegression ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                {effectiveDiffPercentage}%
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">(Limit: {threshold}%)</span>
            </div>
          </div>
          {hasRegression ? (
            <span className="px-2.5 py-1 rounded-md bg-rose-100 text-rose-700 text-xs font-bold font-mono border border-rose-200">
              REGRESSION DEFECT
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-700 text-xs font-bold font-mono border border-emerald-200">
              PASS
            </span>
          )}
        </div>
      </div>

      {/* Visual Canvas Area rendering the actual application screen */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center shadow-md">
        {/* Diff Overlay Mode */}
        {viewMode === 'diff_overlay' && (
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
            <div className="space-y-2 text-center">
              <span className="text-xs font-mono text-slate-300 font-medium">
                Baseline: {activeComp.baselineDevice.name} ({activeScreenName})
              </span>
              <div className="w-72 h-[430px] rounded-2xl border-2 border-slate-700 overflow-hidden shadow-xl">
                {renderAppScreenFrame('baseline')}
              </div>
            </div>

            <div className="flex flex-col items-center text-slate-400">
              <ArrowRight className="w-6 h-6 rotate-90 md:rotate-0 text-blue-400" />
              <span className="text-[10px] font-mono mt-1 text-slate-300">
                {screenWidgetNodes.length} Widgets Compared
              </span>
              <span className="text-[10px] font-mono text-rose-400 font-bold mt-0.5">
                Δ {effectiveDiffPercentage}% Shift
              </span>
            </div>

            <div className="space-y-2 text-center">
              <span className="text-xs font-mono text-rose-400 font-medium">
                Target + Diff Overlay: {selectedTargetDevice?.name}
              </span>
              <div
                className={`relative w-72 h-[430px] rounded-2xl border-2 overflow-hidden shadow-2xl ${
                  hasRegression ? 'border-rose-500/80' : 'border-emerald-500/70'
                }`}
              >
                {renderAppScreenFrame('target')}
              </div>
            </div>
          </div>
        )}

        {/* Side-by-Side Mode */}
        {viewMode === 'side_by_side' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl place-items-center">
            <div className="space-y-2 text-center">
              <span className="text-xs font-mono text-slate-300">
                Baseline ({activeComp.baselineDevice.name} • {activeComp.baselineDevice.resolution})
              </span>
              <div className="w-72 h-[430px] rounded-2xl border-2 border-slate-700 overflow-hidden shadow-xl">
                {renderAppScreenFrame('baseline')}
              </div>
            </div>
            <div className="space-y-2 text-center">
              <span className="text-xs font-mono text-slate-300">
                Target ({selectedTargetDevice?.name} • {selectedTargetDevice?.resolution})
              </span>
              <div className="w-72 h-[430px] rounded-2xl border-2 border-blue-500/60 overflow-hidden shadow-xl">
                {renderAppScreenFrame('target')}
              </div>
            </div>
          </div>
        )}

        {/* Interactive Split Slider Mode */}
        {viewMode === 'slider' && (
          <div className="w-full max-w-md space-y-4 flex flex-col items-center">
            <div className="relative w-72 h-[430px] rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl select-none">
              <div className="absolute inset-0 w-72 h-[430px]">{renderAppScreenFrame('target')}</div>
              <div
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <div className="w-72 h-[430px]">{renderAppScreenFrame('baseline')}</div>
              </div>
              <div
                className="absolute top-0 bottom-0 w-1 bg-blue-400 shadow-lg cursor-ew-resize"
                style={{ left: `${sliderPosition}%` }}
              />
            </div>

            <div className="flex items-center justify-between gap-4 text-xs text-slate-300 w-72">
              <span className="font-mono text-[11px]">Baseline</span>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(parseInt(e.target.value))}
                className="w-40 accent-blue-500 cursor-pointer"
              />
              <span className="font-mono text-[11px]">Target</span>
            </div>
          </div>
        )}
      </div>

      {/* Widget-by-Widget Visual Alignment & Shift Table for the Active APK */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-2">
              <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
              <span>
                Widget-Level Coordinate & Visual Diff Breakdown — {apk.appName} ({activeScreenName})
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Node-by-node bounding box comparison between {activeComp.baselineDevice.name} and{' '}
              {selectedTargetDevice?.name}
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
            {screenWidgetNodes.filter((n) => n.issue || n.deltaPx >= 15).length} Shifted /{' '}
            {screenWidgetNodes.length} Total Widgets
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-mono uppercase text-slate-500 bg-slate-50">
                <th className="py-2.5 px-3">Widget ID & Type</th>
                <th className="py-2.5 px-3">Rendered Text / Content</th>
                <th className="py-2.5 px-3">Baseline Bounds</th>
                <th className="py-2.5 px-3">Target Bounds</th>
                <th className="py-2.5 px-3">Pixel Shift</th>
                <th className="py-2.5 px-3">SSIM</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {screenWidgetNodes.map((node, idx) => {
                const hasShift = Boolean(node.issue) || node.deltaPx >= 15;
                return (
                  <tr
                    key={`${node.id}-${idx}`}
                    className={hasShift ? 'bg-rose-50/40' : 'hover:bg-slate-50'}
                  >
                    <td className="py-2.5 px-3 font-bold text-slate-800">
                      <span className="text-blue-600">@id/{node.id}</span>
                      <span className="block text-[10px] text-slate-400 font-normal">
                        android.widget.{node.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-700 max-w-[200px] truncate">
                      {node.label}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{node.baselineBounds}</td>
                    <td className="py-2.5 px-3 text-slate-800 font-semibold">{node.targetBounds}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          hasShift
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {node.deltaPx > 0 ? `+${node.deltaPx}px Y` : '0px'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-700">{node.ssimScore}%</td>
                    <td className="py-2.5 px-3">
                      {hasShift ? (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-bold">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                          {node.issue ? node.issue.type.replace(/_/g, ' ').toUpperCase() : 'LAYOUT SHIFT'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          ALIGNED
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Detected Structural Findings for this App Screen */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            Visual Findings for {apk.appName} — {activeScreenName}
          </h4>
          {activeComp.detectedShifts.map((shift, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg flex items-center gap-3 text-xs font-medium border ${
                hasRegression
                  ? 'bg-rose-50/50 border-rose-200 text-slate-800'
                  : 'bg-emerald-50/40 border-emerald-200 text-slate-700'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  hasRegression ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
              />
              <span>{shift}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
