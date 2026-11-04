import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { ApkMetadata, Device, TestRun, TestResult, Defect, CrashReport, RiskScoreBreakdown, QualityScoreBreakdown, TestRecommendation } from '../types';

export interface ReportDataPayload {
  apk: ApkMetadata;
  devices: Device[];
  testRun: TestRun;
  testResults?: TestResult[];
  defects: Defect[];
  crashes?: CrashReport[];
  riskScore?: RiskScoreBreakdown;
  qualityScore: QualityScoreBreakdown;
  recommendations: TestRecommendation[];
}

function normalizePayload(
  arg1: any,
  arg2?: any,
  arg3?: any,
  arg4?: any,
  arg5?: any,
  arg6?: any
): ReportDataPayload {
  if (arg1 && typeof arg1 === 'object' && 'appName' in arg1 && arg2 && 'runNumber' in arg2) {
    return {
      apk: arg1,
      testRun: arg2,
      qualityScore: arg3,
      recommendations: arg4 || [],
      devices: arg5 || [],
      defects: arg6 || [],
      testResults: [],
      crashes: []
    };
  }
  return arg1 as ReportDataPayload;
}

export function generatePdfReport(dataOrApk: any, ...rest: any[]): void {
  const data = normalizePayload(dataOrApk, ...rest);
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('MOBILETEST GUARDIAN', 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Automated Quality Assessment & Compatibility Audit Report', 14, 19);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 14, 19, { align: 'right' });

  let currentY = 36;

  // Executive Summary Card
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('1.0 Executive Quality & Risk Assessment', 14, currentY);
  currentY += 6;

  const riskScoreVal = data.riskScore ? data.riskScore.totalRiskScore : (data.qualityScore.riskScore ?? 28);
  const riskLevelVal = data.riskScore ? data.riskScore.riskLevel : 'MODERATE';

  autoTable(doc, {
    startY: currentY,
    head: [['Application Quality Score', 'Quality Grade', 'Device Risk Score', 'Risk Classification', 'Test Status']],
    body: [[
      `${data.qualityScore.overallScore}/100`,
      `Grade ${data.qualityScore.grade}`,
      `${riskScoreVal}/100`,
      riskLevelVal,
      `${data.testRun.passedCount}/${data.testRun.totalCount} Passed (${Math.round((data.testRun.passedCount / Math.max(1, data.testRun.totalCount)) * 100)}%)`
    ]],
    theme: 'grid',
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3 }
  });

  // @ts-ignore
  currentY = (doc as any).lastAutoTable.finalY + 10;

  // Application & Device Metadata
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('2.0 Application & Hardware Matrix Information', 14, currentY);
  currentY += 6;

  const appMeta = [
    ['Application Name', data.apk.appName, 'Package Name', data.apk.packageName],
    ['Version', `${data.apk.versionName} (Build ${data.apk.versionCode})`, 'APK File Size', `${data.apk.apkSizeMb} MB`],
    ['Min SDK', `${data.apk.minSdkVersion} (${data.apk.minSdkName})`, 'Target SDK', `${data.apk.targetSdkVersion} (${data.apk.targetSdkName})`],
    ['Permission Risk Score', `${data.apk.permissionRiskScore}/100`, 'Debuggable Flag', data.apk.debuggable ? 'TRUE (Warning)' : 'FALSE (Secure)']
  ];

  autoTable(doc, {
    startY: currentY,
    body: appMeta,
    theme: 'striped',
    styles: { fontSize: 8, cellPadding: 2 }
  });

  // @ts-ignore
  currentY = (doc as any).lastAutoTable.finalY + 10;

  // Defects Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('3.0 Detected Defect & Crash Log Register', 14, currentY);
  currentY += 6;

  const defectRows = data.defects.map(d => [
    d.id,
    d.title,
    d.category,
    d.severity,
    d.deviceName,
    d.status
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Defect ID', 'Summary Description', 'Category', 'Severity', 'Device', 'Status']],
    body: defectRows.length > 0 ? defectRows : [['-', 'No active defects recorded.', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: [185, 28, 28], textColor: [255, 255, 255] },
    styles: { fontSize: 7, cellPadding: 2 }
  });

  // @ts-ignore
  currentY = (doc as any).lastAutoTable.finalY + 10;

  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  // Recommendations
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('4.0 Automated Engineering Recommendations', 14, currentY);
  currentY += 6;

  const recRows = data.recommendations.map((r, i) => [
    `#${i + 1}`,
    r.recommendationTitle || r.title || 'Targeted test suite',
    r.priority,
    r.rationale || r.details || 'Quality improvement recommendation'
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['#', 'Recommended Action', 'Priority', 'Engineering Rationale']],
    body: recRows.length > 0 ? recRows : [['-', 'Quality criteria met. No critical actions required.', '-', '-']],
    theme: 'striped',
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255] },
    styles: { fontSize: 7, cellPadding: 2 }
  });

  // Footer signature
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`MobileTest Guardian Capstone Framework - Confidential QA Report | Page ${i} of ${totalPages}`, 14, doc.internal.pageSize.getHeight() - 8);
  }

  doc.save(`MobileTest_Guardian_Report_${data.apk.packageName}_${Date.now()}.pdf`);
}

export function generateExcelReport(dataOrApk: any, ...rest: any[]): void {
  const data = normalizePayload(dataOrApk, ...rest);
  const wb = XLSX.utils.book_new();

  // Sheet 1: Summary
  const summaryData = [
    ['MOBILETEST GUARDIAN COMPREHENSIVE QA AUDIT'],
    ['Generated At', new Date().toISOString()],
    [],
    ['APPLICATION METADATA'],
    ['App Name', data.apk.appName],
    ['Package Name', data.apk.packageName],
    ['Version', `${data.apk.versionName} (${data.apk.versionCode})`],
    ['Min SDK', `${data.apk.minSdkVersion} (${data.apk.minSdkName})`],
    ['Target SDK', `${data.apk.targetSdkVersion} (${data.apk.targetSdkName})`],
    ['APK Size (MB)', data.apk.apkSizeMb],
    ['Permission Risk Score', data.apk.permissionRiskScore],
    [],
    ['QUALITY & RISK METRICS'],
    ['Application Quality Score', data.qualityScore.overallScore],
    ['Quality Grade', data.qualityScore.grade],
    ['Device Risk Score', data.riskScore ? data.riskScore.totalRiskScore : (data.qualityScore.riskScore ?? 28)],
    ['Total Tests', data.testRun.totalCount],
    ['Passed Tests', data.testRun.passedCount],
    ['Failed Tests', data.testRun.failedCount]
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

  // Sheet 2: Defects
  const defectsData = data.defects.map(d => ({
    'Defect ID': d.id,
    'Title': d.title,
    'Category': d.category,
    'Severity': d.severity,
    'Status': d.status,
    'Device': d.deviceName,
    'Android Version': d.androidVersion,
    'Recommended Fix': d.recommendation
  }));
  const wsDefects = XLSX.utils.json_to_sheet(defectsData);
  XLSX.utils.book_append_sheet(wb, wsDefects, 'Defects & Crashes');

  // Sheet 3: Devices Matrix
  const devicesData = data.devices.map(dev => ({
    'Device Name': dev.name,
    'Serial': dev.serialNumber,
    'Model': dev.model,
    'Manufacturer': dev.manufacturer,
    'Android OS': dev.androidVersion,
    'API Level': dev.apiLevel,
    'Resolution': dev.resolution,
    'DPI': dev.densityDpi,
    'RAM (GB)': dev.ramGb,
    'Status': dev.status
  }));
  const wsDevices = XLSX.utils.json_to_sheet(devicesData);
  XLSX.utils.book_append_sheet(wb, wsDevices, 'Device Matrix');

  XLSX.writeFile(wb, `MobileTest_Guardian_Export_${data.apk.packageName}_${Date.now()}.xlsx`);
}

export function generateMarkdownReport(dataOrApk: any, ...rest: any[]): string {
  const data = normalizePayload(dataOrApk, ...rest);
  return `# MobileTest Guardian Quality Assessment Report

## Application: ${data.apk.appName} (${data.apk.packageName})
- **Version**: ${data.apk.versionName} (Build ${data.apk.versionCode})
- **Min / Target SDK**: Android ${data.apk.minSdkVersion} -> Android ${data.apk.targetSdkVersion}
- **APK Size**: ${data.apk.apkSizeMb} MB
- **Permission Risk Score**: ${data.apk.permissionRiskScore}/100

---

## Executive Quality & Risk Summary
- **Overall Quality Score**: ${data.qualityScore.overallScore} / 100 (Grade ${data.qualityScore.grade})
- **Device Risk Score**: ${data.riskScore ? data.riskScore.totalRiskScore : (data.qualityScore.riskScore ?? 28)} / 100
- **Test Matrix Pass Rate**: ${data.testRun.passedCount} / ${data.testRun.totalCount} Passed (${Math.round((data.testRun.passedCount / Math.max(1, data.testRun.totalCount)) * 100)}%)

---

## Detected Defects & Crash Register
${data.defects.length === 0 ? '_No active defects recorded._' : data.defects.map(d => `
### [${d.id}] ${d.title} (${d.severity})
- **Category**: ${d.category}
- **Device**: ${d.deviceName} (${d.androidVersion})
- **Description**: ${d.description}
- **Recommendation**: ${d.recommendation}
`).join('\n')}

---

## Recommendations
${data.recommendations.map((r, i) => `${i + 1}. **${r.recommendationTitle || r.title}** [${r.priority}]: ${r.rationale || r.details}`).join('\n')}
`;
}

export function generateJsonReport(dataOrApk: any, ...rest: any[]): string {
  const data = normalizePayload(dataOrApk, ...rest);
  return JSON.stringify(data, null, 2);
}
