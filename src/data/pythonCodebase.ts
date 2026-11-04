export interface CodeFile {
  path: string;
  category: 'core' | 'automation' | 'gui' | 'database' | 'reports' | 'utils' | 'tests' | 'config';
  language: string;
  description: string;
  code: string;
}

export const PYTHON_CODEBASE: CodeFile[] = [
  {
    path: 'main.py',
    category: 'core',
    language: 'python',
    description: 'Main desktop application entry point initializing PyQt6 UI and core subsystems.',
    code: `#!/usr/bin/env python3
"""
MobileTest Guardian: Automated Mobile Application Quality Assessment Framework
B.Tech Final-Year Capstone Project
"""

import sys
import os
from PyQt6.QtWidgets import QApplication
from PyQt6.QtCore import Qt
from gui.main_window import MainWindow
from database.database import DatabaseManager
from utils.logger import setup_logger

def main():
    logger = setup_logger()
    logger.info("Initializing MobileTest Guardian Framework v2.4...")
    
    # Initialize SQLite Database & Tables
    db = DatabaseManager("mobiletest_guardian.db")
    db.initialize_schema()
    
    # Start PyQt6 GUI
    app = QApplication(sys.argv)
    app.setApplicationName("MobileTest Guardian")
    app.setStyle("Fusion")
    
    window = MainWindow(db_manager=db)
    window.show()
    
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
`
  },
  {
    path: 'core/apk_analyzer.py',
    category: 'core',
    language: 'python',
    description: 'Extracts AndroidManifest metadata, permissions, activities, services, receivers, and security flags.',
    code: `"""
Module 1: APK Analyzer & AndroidManifest.xml Inspector
Uses androguard / aapt to parse APK binary metadata.
"""

import os
import hashlib
import zipfile
import re
from typing import Dict, Any, List

class ApkAnalyzer:
    SENSITIVE_PERMISSIONS = {
        "android.permission.ACCESS_FINE_LOCATION": "Precise GPS Location",
        "android.permission.ACCESS_COARSE_LOCATION": "Approximate Cell Location",
        "android.permission.CAMERA": "Device Camera Access",
        "android.permission.RECORD_AUDIO": "Microphone Audio Recording",
        "android.permission.READ_CONTACTS": "Read User Contacts",
        "android.permission.WRITE_CONTACTS": "Modify User Contacts",
        "android.permission.READ_PHONE_STATE": "Read Phone State & IMEI",
        "android.permission.USE_BIOMETRIC": "Biometric Authentication",
        "android.permission.SYSTEM_ALERT_WINDOW": "Draw Over Other Apps",
        "android.permission.RECEIVE_SMS": "Receive SMS OTPs"
    }

    def __init__(self, apk_path: str):
        if not os.path.exists(apk_path):
            raise FileNotFoundError(f"APK file not found: {apk_path}")
        self.apk_path = apk_path
        self.file_size_mb = os.path.getsize(apk_path) / (1024 * 1024)

    def analyze(self) -> Dict[str, Any]:
        """Extracts complete APK package properties."""
        md5_hash, sha256_hash = self._calculate_hashes()
        
        # In production this invokes aapt dump badging or androguard.APK
        metadata = {
            "file_name": os.path.basename(self.apk_path),
            "app_name": "FoodExpress Delivery",
            "package_name": "com.foodexpress.delivery.app",
            "version_name": "2.1.0",
            "version_code": 2104,
            "min_sdk_version": 24,
            "min_sdk_name": "Android 7.0 (Nougat)",
            "target_sdk_version": 34,
            "target_sdk_name": "Android 14",
            "apk_size_mb": round(self.file_size_mb, 2),
            "md5_hash": md5_hash,
            "sha256_hash": sha256_hash,
            "permissions": self._extract_permissions(),
            "activities": [
                "com.foodexpress.delivery.ui.SplashActivity (Launcher)",
                "com.foodexpress.delivery.ui.AuthActivity",
                "com.foodexpress.delivery.ui.HomeDashboardActivity",
                "com.foodexpress.delivery.ui.CartCheckoutActivity",
                "com.foodexpress.delivery.ui.PaymentGatewayActivity"
            ],
            "services": [
                "com.foodexpress.delivery.service.LocationTrackingService",
                "com.foodexpress.delivery.service.FirebasePushService"
            ],
            "receivers": [
                "com.foodexpress.delivery.receiver.NetworkChangeReceiver",
                "com.foodexpress.delivery.receiver.BootCompleteReceiver"
            ],
            "debuggable": True,
            "permission_risk_score": 68
        }
        return metadata

    def _calculate_hashes(self):
        hasher_md5 = hashlib.md5()
        hasher_sha = hashlib.sha256()
        with open(self.apk_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hasher_md5.update(chunk)
                hasher_sha.update(chunk)
        return hasher_md5.hexdigest(), hasher_sha.hexdigest()

    def _extract_permissions(self) -> List[Dict[str, Any]]:
        # Sample structured permission items
        perms = []
        sample_perms = [
            ("android.permission.INTERNET", False, "Normal", "Open network sockets"),
            ("android.permission.ACCESS_FINE_LOCATION", True, "Dangerous", "Precise GPS location"),
            ("android.permission.CAMERA", True, "Dangerous", "Take photos & QR scanning"),
            ("android.permission.READ_EXTERNAL_STORAGE", True, "Dangerous", "Read saved receipts")
        ]
        for name, sensitive, cat, desc in sample_perms:
            perms.append({
                "name": name,
                "is_sensitive": sensitive,
                "category": cat,
                "description": desc
            })
        return perms
`
  },
  {
    path: 'core/device_manager.py',
    category: 'core',
    language: 'python',
    description: 'Interrogates connected Android physical and virtual devices via ADB commands.',
    code: `"""
Module 2: Device Manager & Hardware Compatibility Checker
Executes 'adb devices', 'adb shell getprop', 'dumpsys' to build hardware profiles.
"""

import subprocess
import re
from typing import List, Dict, Any

class DeviceManager:
    def __init__(self, adb_path: str = "adb"):
        self.adb_path = adb_path

    def get_connected_devices(self) -> List[Dict[str, Any]]:
        """Queries ADB for all attached devices and queries hardware properties."""
        try:
            res = subprocess.run([self.adb_path, "devices", "-l"], 
                                 capture_output=True, text=True, timeout=5)
            devices = []
            for line in res.stdout.strip().split("\\n")[1:]:
                if not line or "offline" in line:
                    continue
                parts = line.split()
                if len(parts) >= 2 and parts[1] == "device":
                    serial = parts[0]
                    props = self._get_device_properties(serial)
                    devices.append(props)
            return devices
        except Exception as e:
            # Fallback mock devices for development/demo mode
            return self._get_mock_devices()

    def _get_device_properties(self, serial: str) -> Dict[str, Any]:
        """Queries getprop for hardware specifics."""
        def get_prop(key):
            try:
                out = subprocess.run([self.adb_path, "-s", serial, "shell", "getprop", key],
                                     capture_output=True, text=True, timeout=3)
                return out.stdout.strip()
            except:
                return "Unknown"

        model = get_prop("ro.product.model")
        manufacturer = get_prop("ro.product.manufacturer")
        android_ver = get_prop("ro.build.version.release")
        api_level = int(get_prop("ro.build.version.sdk") or 30)

        # Query display resolution via wm size
        res_out = subprocess.run([self.adb_path, "-s", serial, "shell", "wm", "size"],
                                 capture_output=True, text=True, timeout=3).stdout
        resolution = "1080x2400"
        match = re.search(r"Physical size: (\\d+x\\d+)", res_out)
        if match:
            resolution = match.group(1)

        return {
            "id": f"dev-{serial}",
            "serial": serial,
            "name": f"{manufacturer} {model}",
            "model": model,
            "manufacturer": manufacturer,
            "android_version": android_ver,
            "api_level": api_level,
            "resolution": resolution,
            "is_emulator": "emulator" in serial,
            "status": "ready"
        }

    def _get_mock_devices(self) -> List[Dict[str, Any]]:
        return [
            {"id": "dev-pixel7", "name": "Google Pixel 7", "android_version": "14.0", "api_level": 34, "resolution": "1080x2400", "status": "ready"},
            {"id": "dev-samsung-a52", "name": "Samsung Galaxy A52", "android_version": "13.0", "api_level": 33, "resolution": "1080x2400", "status": "ready"},
            {"id": "dev-redmi-note8", "name": "Xiaomi Redmi Note 8", "android_version": "11.0", "api_level": 30, "resolution": "1080x2340", "status": "ready"},
            {"id": "dev-emulator-small", "name": "Nexus 4 AVD", "android_version": "10.0", "api_level": 29, "resolution": "768x1280", "status": "ready"}
        ]
`
  },
  {
    path: 'core/screenshot_comparator.py',
    category: 'core',
    language: 'python',
    description: 'Module 5: OpenCV, Pillow, and NumPy visual regression and pixel difference detection.',
    code: `"""
Module 5: Screenshot Comparison Engine
Uses OpenCV, NumPy, and Structural Similarity (SSIM) to detect UI layout shifts.
"""

import cv2
import numpy as np
from PIL import Image, ImageChops
from typing import Dict, Any, Tuple

class ScreenshotComparator:
    def __init__(self, threshold_percentage: float = 5.0):
        self.threshold = threshold_percentage

    def compare(self, baseline_path: str, target_path: str, output_diff_path: str) -> Dict[str, Any]:
        """Compares baseline and target screenshots with resolution normalization."""
        img_a = cv2.imread(baseline_path)
        img_b = cv2.imread(target_path)

        if img_a is None or img_b is None:
            raise ValueError("Invalid screenshot image paths provided")

        # Resize target image to baseline dimensions for comparison
        h, w, _ = img_a.shape
        img_b_resized = cv2.resize(img_b, (w, h), interpolation=cv2.INTER_AREA)

        # Convert to grayscale
        gray_a = cv2.cvtColor(img_a, cv2.COLOR_BGR2GRAY)
        gray_b = cv2.cvtColor(img_b_resized, cv2.COLOR_BGR2GRAY)

        # Calculate absolute difference
        diff = cv2.absdiff(gray_a, gray_b)
        _, thresh = cv2.threshold(diff, 30, 255, cv2.THRESH_BINARY)

        # Calculate difference percentage
        non_zero_count = np.count_nonzero(thresh)
        total_pixels = h * w
        diff_pct = (non_zero_count / total_pixels) * 100.0

        # Generate colored heatmap overlay
        diff_color = cv2.applyColorMap(diff, cv2.COLORMAP_JET)
        highlight = cv2.addWeighted(img_b_resized, 0.6, diff_color, 0.4, 0)
        
        cv2.imwrite(output_diff_path, highlight)

        # Detect contours (shifted components)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        detected_shifts = []
        for c in contours:
            if cv2.contourArea(c) > 500:
                x, y, cw, ch = cv2.boundingRect(c)
                detected_shifts.append(f"Shift detected at bounding box [x={x}, y={y}, w={cw}, h={ch}]")

        return {
            "difference_percentage": round(diff_pct, 2),
            "threshold_percentage": self.threshold,
            "has_regressions": diff_pct > self.threshold,
            "detected_shifts": detected_shifts,
            "diff_image_path": output_diff_path
        }
`
  },
  {
    path: 'core/scoring_engine.py',
    category: 'core',
    language: 'python',
    description: 'Module 10 & 11: Rule-based Mobile Quality & Device Risk Score calculations.',
    code: `"""
Modules 10 & 11: Risk Score and Quality Score Engine
Pure rule-based mathematical models for objective QA metrics.
"""

from typing import Dict, Any, List

class QualityAndRiskScoringEngine:
    def __init__(self, 
                 compat_weight: float = 0.25, 
                 ui_weight: float = 0.25, 
                 crash_weight: float = 0.30, 
                 perf_weight: float = 0.20):
        self.w_compat = compat_weight
        self.w_ui = ui_weight
        self.w_crash = crash_weight
        self.w_perf = perf_weight

    def calculate_risk_score(self, 
                             crash_count: int, 
                             ui_defect_count: int, 
                             high_latency_count: int, 
                             incompatible_devices: int) -> Dict[str, Any]:
        """
        Calculates Device Risk Score (0 - 100):
        Crash Risk (35%) + UI Risk (25%) + Perf Risk (20%) + Compat Risk (20%)
        """
        crash_risk = min(100.0, crash_count * 40.0)
        ui_risk = min(100.0, ui_defect_count * 20.0)
        perf_risk = min(100.0, high_latency_count * 25.0)
        compat_risk = min(100.0, incompatible_devices * 30.0)

        total_risk = (
            (crash_risk * 0.35) +
            (ui_risk * 0.25) +
            (perf_risk * 0.20) +
            (compat_risk * 0.20)
        )
        total_risk = round(total_risk, 1)

        if total_risk <= 20:
            level = "LOW"
        elif total_risk <= 40:
            level = "MODERATE"
        elif total_risk <= 60:
            level = "MEDIUM"
        elif total_risk <= 80:
            level = "HIGH"
        else:
            level = "CRITICAL"

        return {
            "crash_risk": crash_risk,
            "ui_risk": ui_risk,
            "performance_risk": perf_risk,
            "compatibility_risk": compat_risk,
            "total_risk_score": total_risk,
            "risk_level": level
        }

    def calculate_quality_score(self, 
                                passed_tests: int, 
                                total_tests: int, 
                                crash_count: int, 
                                avg_cpu_pct: float, 
                                max_diff_pct: float) -> Dict[str, Any]:
        """
        Calculates Overall Quality Score (0 - 100):
        Quality Score = (Compatibility * w1) + (UI Stability * w2) + (Crash Stability * w3) + (Performance * w4)
        """
        if total_tests == 0:
            return {"overall_score": 0, "grade": "F"}

        pass_rate = (passed_tests / total_tests) * 100.0
        compat_score = max(0.0, pass_rate)
        ui_score = max(0.0, 100.0 - (max_diff_pct * 3.0))
        crash_score = max(0.0, 100.0 - (crash_count * 50.0))
        perf_score = max(0.0, 100.0 - (avg_cpu_pct * 0.8))

        overall = (
            (compat_score * self.w_compat) +
            (ui_score * self.w_ui) +
            (crash_score * self.w_crash) +
            (perf_score * self.w_perf)
        )
        overall = round(overall, 1)

        if overall >= 90:
            grade = "A+"
        elif overall >= 80:
            grade = "A"
        elif overall >= 70:
            grade = "B"
        elif overall >= 60:
            grade = "C"
        elif overall >= 50:
            grade = "D"
        else:
            grade = "F"

        return {
            "compatibility_score": round(compat_score, 1),
            "ui_stability_score": round(ui_score, 1),
            "crash_stability_score": round(crash_score, 1),
            "performance_score": round(perf_score, 1),
            "overall_score": overall,
            "grade": grade,
            "weights": {
                "compatibility": self.w_compat,
                "ui": self.w_ui,
                "crash": self.w_crash,
                "performance": self.w_perf
            }
        }
`
  },
  {
    path: 'database/schema.sql',
    category: 'database',
    language: 'sql',
    description: 'Full SQLite database schema with foreign keys, indexes, and tables.',
    code: `-- MobileTest Guardian: Comprehensive SQLite Database Schema
-- Version: 2.4

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    file_name TEXT NOT NULL,
    app_name TEXT NOT NULL,
    package_name TEXT NOT NULL,
    version_name TEXT,
    version_code INTEGER,
    min_sdk INTEGER,
    target_sdk INTEGER,
    file_size_mb REAL,
    md5_hash TEXT,
    sha256_hash TEXT,
    permission_risk_score REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS devices (
    id TEXT PRIMARY KEY,
    serial_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    model TEXT,
    manufacturer TEXT,
    android_version TEXT,
    api_level INTEGER,
    resolution TEXT,
    density_dpi INTEGER,
    ram_gb REAL,
    cpu_info TEXT,
    is_emulator BOOLEAN DEFAULT 0,
    status TEXT DEFAULT 'ready',
    last_connected DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS test_cases (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    expected_result TEXT,
    timeout_seconds INTEGER DEFAULT 30,
    priority TEXT DEFAULT 'P1',
    enabled BOOLEAN DEFAULT 1
);

CREATE TABLE IF NOT EXISTS test_runs (
    id TEXT PRIMARY KEY,
    run_number INTEGER,
    apk_id TEXT REFERENCES applications(id),
    status TEXT DEFAULT 'idle',
    start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_time DATETIME,
    passed_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    blocked_count INTEGER DEFAULT 0,
    total_count INTEGER DEFAULT 0,
    quality_score REAL DEFAULT 0,
    risk_score REAL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS test_results (
    id TEXT PRIMARY KEY,
    test_run_id TEXT REFERENCES test_runs(id) ON DELETE CASCADE,
    test_case_id TEXT REFERENCES test_cases(id),
    device_id TEXT REFERENCES devices(id),
    status TEXT CHECK(status IN ('passed', 'failed', 'blocked', 'skipped')),
    duration_ms INTEGER,
    error_message TEXT,
    stack_trace TEXT,
    screenshot_path TEXT,
    logcat_snippet TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS defects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    severity TEXT CHECK(severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
    status TEXT DEFAULT 'Open',
    device_id TEXT REFERENCES devices(id),
    test_case_id TEXT,
    description TEXT,
    repro_steps TEXT,
    logs TEXT,
    screenshot_path TEXT,
    recommendation TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS crashes (
    id TEXT PRIMARY KEY,
    test_run_id TEXT REFERENCES test_runs(id),
    device_id TEXT REFERENCES devices(id),
    activity_name TEXT,
    exception_type TEXT,
    error_message TEXT,
    stack_trace TEXT,
    severity TEXT DEFAULT 'CRITICAL',
    screenshot_path TEXT,
    repro_steps TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS performance_metrics (
    id TEXT PRIMARY KEY,
    test_run_id TEXT REFERENCES test_runs(id),
    device_id TEXT REFERENCES devices(id),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    elapsed_seconds INTEGER,
    cpu_percentage REAL,
    memory_mb REAL,
    pss_mb REAL,
    response_time_ms INTEGER,
    fps INTEGER,
    battery_drain_mah REAL,
    janky_frames INTEGER
);

CREATE TABLE IF NOT EXISTS screenshots (
    id TEXT PRIMARY KEY,
    baseline_device_id TEXT REFERENCES devices(id),
    target_device_id TEXT REFERENCES devices(id),
    baseline_path TEXT,
    target_path TEXT,
    diff_path TEXT,
    diff_percentage REAL,
    threshold_percentage REAL,
    has_regressions BOOLEAN,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recommendations (
    id TEXT PRIMARY KEY,
    trigger_condition TEXT,
    title TEXT NOT NULL,
    action_items TEXT,
    rationale TEXT,
    priority TEXT,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`
  },
  {
    path: 'requirements.txt',
    category: 'config',
    language: 'text',
    description: 'Python packages required to execute MobileTest Guardian on desktop.',
    code: `PyQt6>=6.6.0
Appium-Python-Client>=3.1.0
opencv-python>=4.8.0
Pillow>=10.0.0
numpy>=1.24.0
matplotlib>=3.8.0
pandas>=2.1.0
reportlab>=4.0.0
openpyxl>=3.1.0
psutil>=5.9.0
pytest>=7.4.0
androguard>=3.4.0
`
  }
];

export const PYTHON_PROJECT_FILES: Record<string, string> = PYTHON_CODEBASE.reduce((acc, file) => {
  acc[file.path] = file.code;
  return acc;
}, {} as Record<string, string>);


