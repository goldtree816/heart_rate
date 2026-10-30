
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [torchEnabled, setTorchEnabled] = useState(true);

  useEffect(() => {
    if (!scanning) return;

    const timer = setInterval(() => {
      setSeconds((previous) => {
        if (previous >= 29) {
          clearInterval(timer);
          setScanning(false);
          return 30;
        }
        return previous + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [scanning]);

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F43F5E" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Ionicons name="camera-outline" size={54} color="#F43F5E" />
        <Text style={styles.title}>Camera permission required</Text>
        <Text style={styles.description}>
          Allow camera access to use the finger scanner.
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Heart Rate Scanner</Text>
        <Text style={styles.description}>
          Place your fingertip gently over the rear camera and flash.
        </Text>
      </View>

      <View style={styles.cameraFrame}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          enableTorch={torchEnabled}
          onCameraReady={() => setCameraReady(true)}
          onMountError={(event) => {
            console.warn('Camera error:', event.message);
          }}
        />
        <View style={styles.overlay}>
          <View style={styles.target}>
            <Ionicons name="finger-print" size={64} color="#FFFFFF" />
          </View>
          <Text style={styles.cameraHint}>
            Camera preview — cover the lens with your fingertip
          </Text>
        </View>
      </View>

      <View style={styles.result}>
        <Ionicons name="heart" size={28} color="#F43F5E" />
        <Text style={styles.bpm}>--</Text>
        <Text style={styles.unit}>BPM</Text>
        <Text style={styles.status}>
          {scanning
            ? `Scanner demo: ${seconds}/30 seconds`
            : seconds === 30
            ? 'Demo complete — no pulse measured'
            : 'Ready to scan'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        disabled={!cameraReady}
        onPress={() => {
          setSeconds(0);
          setScanning(true);
        }}
      >
        <Text style={styles.buttonText}>
          {scanning ? 'Scanning demo…' : 'Start Scan'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => setTorchEnabled((value) => !value)}
      >
        <Ionicons
          name={torchEnabled ? 'flashlight' : 'flashlight-outline'}
          size={20}
          color="#F43F5E"
        />
        <Text style={styles.secondaryText}>
          {torchEnabled ? 'Turn Torch Off' : 'Turn Torch On'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        Preview only. Actual heart rate measurement is not implemented yet.
        Stop if the flash becomes uncomfortable or your phone gets hot.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#192D42',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#8493A8',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 21,
  },
  cameraFrame: {
    height: 210,
    overflow: 'hidden',
    borderRadius: 22,
    backgroundColor: '#222222',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  target: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraHint: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 10,
  },
  result: {
    alignItems: 'center',
    marginVertical: 20,
  },
  bpm: {
    fontSize: 56,
    fontWeight: '800',
    color: '#192D42',
  },
  unit: {
    color: '#8493A8',
    fontSize: 14,
  },
  status: {
    color: '#F43F5E',
    fontWeight: '600',
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: '#F43F5E',
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
  },
  secondaryText: {
    color: '#F43F5E',
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 11,
    color: '#8493A8',
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 10,
  },
});
