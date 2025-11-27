#!/bin/bash

echo "========================================"
echo "    AutiConnect Escrow APK Builder"
echo "========================================"
echo

echo "[1/5] Checking Flutter installation..."
flutter doctor
if [ $? -ne 0 ]; then
    echo "ERROR: Flutter not found. Please install Flutter first."
    exit 1
fi

echo
echo "[2/5] Getting dependencies..."
flutter pub get
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to get dependencies."
    exit 1
fi

echo
echo "[3/5] Cleaning previous builds..."
flutter clean

echo
echo "[4/5] Building APK..."
flutter build apk --release
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to build APK."
    exit 1
fi

echo
echo "[5/5] APK built successfully!"
echo
echo "APK Location: build/app/outputs/flutter-apk/app-release.apk"
echo
echo "========================================"
echo "    Build completed successfully!"
echo "========================================"
echo 