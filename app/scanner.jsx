import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import jpeg from 'jpeg-js';
import { Buffer } from 'buffer';

const STORAGE_KEY = '@heart_rate/latest_scan';

const DETECTION_TIMEOUT = 20; // seconds to wait for a finger
const SCAN_DURATION = 5; // seconds of "measuring"
const CHECK_INTERVAL = 1100; // ms between camera checks

// Analyze a (small) camera image to check for likely finger coverage
const detectFinger = (base64) => {
  try {
    const image = jpeg.decode(Buffer.from(base64, 'base64'), {
      useTArray: true,
    });

    const { width, height, data } = image;

    let redPixels = 0;
    let totalPixels = 0;
    let totalRed = 0;
    let totalGreen = 0;
    let totalBlue = 0;
    let totalBrightness = 0;
    let totalBrightnessSquared = 0;

    // Analyze the central 60% of the image
    const startX = Math.floor(width * 0.2);
    const endX = Math.floor(width * 0.8);
    const startY = Math.floor(height * 0.2);
    const endY = Math.floor(height * 0.8);

    // Image is tiny (64px wide), so sample every pixel
    for (let y = startY; y < endY; y += 1) {
      for (let x = startX; x < endX; x += 1) {
        const index = (y * width + x) * 4;

        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];

        const brightness = (r + g + b) / 3;

        totalRed += r;
        totalGreen += g;
        totalBlue += b;

        totalBrightness += brightness;
        totalBrightnessSquared += brightness * brightness;

        // Reddish/pinkish pixel
        if (r > 35 && r > g * 1.08 && r > b * 1.08) {
          redPixels++;
        }

        totalPixels++;
      }
    }

    if (totalPixels === 0) return false;

    const redRatio = redPixels / totalPixels;
    const averageRed = totalRed / totalPixels;
    const averageGreen = totalGreen / totalPixels;
    const averageBlue = totalBlue / totalPixels;
    const averageBrightness = totalBrightness / totalPixels;

    const brightnessVariance =
      totalBrightnessSquared / totalPixels -
      averageBrightness * averageBrightness;

    const brightnessDeviation = Math.sqrt(Math.max(0, brightnessVariance));

    // Uncomment to tune thresholds on your device:
    // console.log({ redRatio, averageRed, averageGreen, averageBlue, brightnessDeviation });

    // Loosened finger-like coverage conditions
    const reddishImage = redRatio > 0.25;
    const enoughLight = averageRed > 35;
    const redDominance =
      averageRed > averageGreen * 1.08 && averageRed > averageBlue * 1.08;
    const reasonablyUniform = brightnessDeviation < 100;

    return reddishImage && enoughLight && redDominance && reasonablyUniform;
  } catch (error) {
    console.log('Image analysis error:', error);
    return false;
  }
};

export default function Scanner() {
  const router = useRouter();

  const cameraRef = useRef(null);
  const captureLock = useRef(false);
  const consecutiveFrames = useRef(0);

  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);

  const [phase, setPhase] = useState('idle'); // idle | detecting | measuring
  const [seconds, setSeconds] = useState(0);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [fingerDetected, setFingerDetected] = useState(false);
  const [message, setMessage] = useState(
    'Place your fingertip over the rear camera.'
  );
  const [result, setResult] = useState(null);

  const scanning = phase !== 'idle';

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home');
    }
  };

  // Simulated heart-rate result (just for fun)
  const generateHeartRate = () => {
    const bpm = Math.floor(Math.random() * 61) + 50; // 50-110

    const minBpm = Math.max(40, bpm - (Math.floor(Math.random() * 6) + 3));
    const maxBpm = bpm + Math.floor(Math.random() * 8) + 5;

    return {
      bpm,
      minBpm,
      maxBpm,
      timestamp: new Date().toISOString(),
    };
  };

  const startScan = () => {
    if (!cameraReady || scanning) return;

    setResult(null);
    setSeconds(0);
    setFingerDetected(false);
    consecutiveFrames.current = 0;
    setMessage('Checking for your fingertip...');
    setTorchEnabled(true);
    setPhase('detecting');
  };

  const stopScan = () => {
    setPhase('idle');
    setSeconds(0);
    setFingerDetected(false);
    consecutiveFrames.current = 0;
    setTorchEnabled(false);
    setMessage('Scan cancelled. Ready to scan.');
  };

  // Check camera images while scanning
  useEffect(() => {
    if (phase !== 'detecting' && phase !== 'measuring') return;

    const checkCamera = async () => {
      if (!cameraRef.current || !cameraReady || captureLock.current) return;

      captureLock.current = true;

      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.3,
          skipProcessing: true,
          shutterSound: false,
        });

        if (!photo?.uri) return;

        // Shrink the photo so decoding in JS is fast
        const small = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 64 } }],
          {
            base64: true,
            format: ImageManipulator.SaveFormat.JPEG,
            compress: 0.5,
          }
        );

        if (!small?.base64) return;

        const hasFinger = detectFinger(small.base64);

        if (phase === 'detecting') {
          if (hasFinger) {
            consecutiveFrames.current += 1;
          } else {
            consecutiveFrames.current = 0;
          }

          if (consecutiveFrames.current >= 3) {
            setFingerDetected(true);
            setMessage('Finger detected! Keep your finger still.');
            setSeconds(0);
            setPhase('measuring');
          } else if (hasFinger) {
            setMessage('Finger detected. Hold it in position...');
          } else {
            setFingerDetected(false);
            setMessage('No finger detected. Cover the camera lens completely.');
          }
        }

        if (phase === 'measuring') {
          if (!hasFinger) {
            consecutiveFrames.current = 0;
            setFingerDetected(false);
            setMessage('Finger removed! Please cover the camera again.');
            setPhase('detecting');
          } else {
            setFingerDetected(true);
            setMessage('Finger detected. Keep holding it still.');
          }
        }
      } catch (error) {
        console.log('Camera capture error:', error);
      } finally {
        captureLock.current = false;
      }
    };

    const interval = setInterval(checkCamera, CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [phase, cameraReady]);

  // Stop if a finger is not detected within the timeout
  useEffect(() => {
    if (phase !== 'detecting') return;

    const timeout = setTimeout(() => {
      setPhase('idle');
      setFingerDetected(false);
      setTorchEnabled(false);
      setMessage('Finger not detected. Please try again.');
    }, DETECTION_TIMEOUT * 1000);

    return () => clearTimeout(timeout);
  }, [phase]);

  // Measurement timer
  useEffect(() => {
    if (phase !== 'measuring') return;

    if (seconds >= SCAN_DURATION) {
      const newResult = generateHeartRate();

      setResult(newResult);
      setPhase('idle');
        setFingerDetected(false);
      setTorchEnabled(false);
      setMessage('Scan completed.');

      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newResult)).catch(
        (error) => {
          console.log('Storage error:', error);
        }
      );

      return;
    }

    const timer = setTimeout(() => {
      setSeconds((previous) => previous + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [phase, seconds]);

  // Assessment (every message makes clear the value is simulated)
  const getAssessment = () => {
    if (!result) return null;

    if (result.bpm < 60) {
      return {
        title: 'Low reading (simulated)',
        message:
          'This is a fun, randomly generated number, not your real heart rate.',
        color: '#2196F3',
        icon: 'alert-circle',
      };
    }

    if (result.bpm > 100) {
      return {
        title: 'High reading (simulated)',
        message:
          'This is a fun, randomly generated number, not your real heart rate.',
        color: '#F59E0B',
        icon: 'alert-circle',
      };
    }

    return {
      title: 'Typical resting range (simulated)',
      message:
        'This is a fun, randomly generated number, not your real heart rate.',
      color: '#16A36A',
      icon: 'checkmark-circle',
    };
  };

  const assessment = getAssessment();

  // Permission loading
  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F43F5E" />
      </View>
    );
  }

  // Permission request
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Ionicons name="camera-outline" size={54} color="#F43F5E" />

        <Text style={styles.title}>Camera permission required</Text>

        <Text style={styles.description}>
          Allow camera access to use the scanner.
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={26} color="#24364B" />
        </TouchableOpacity>

        <Text style={styles.title}>Heart Rate Scanner</Text>

        <Text style={styles.description}>
          Place your fingertip gently over the rear camera.
        </Text>
      </View>

      {/* Camera */}
      <View style={styles.cameraFrame}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="back"
          enableTorch={torchEnabled}
          onCameraReady={() => setCameraReady(true)}
          onMountError={(event) => {
            console.warn('Camera error:', event.message);
            setCameraReady(false);
          }}
        />

        <View style={styles.overlay}>
          <View
            style={[styles.target, fingerDetected && styles.detectedTarget]}
          >
            <Ionicons name="finger-print" size={64} color="#FFFFFF" />
          </View>

          <Text style={styles.cameraHint}>{message}</Text>
        </View>
      </View>

      {/* Detection Status */}
      <View style={styles.detectionStatus}>
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor: fingerDetected
                ? '#16A36A'
                : scanning
                ? '#F59E0B'
                : '#8493A8',
            },
          ]}
        />

        <Text style={styles.detectionText}>
          {fingerDetected
            ? 'Finger detected'
            : phase === 'detecting'
            ? 'Checking finger...'
            : phase === 'measuring'
            ? 'Waiting for finger...'
            : 'Waiting to scan'}
        </Text>
      </View>

      {/* Heart Rate Result */}
      <View style={styles.result}>
        <Ionicons name="heart" size={30} color="#F43F5E" />

        <View style={styles.bpmRow}>
          <Text style={styles.bpm}>{result ? result.bpm : 0}</Text>
          <Text style={styles.unit}>BPM</Text>
        </View>

        <Text style={styles.status}>
          {phase === 'detecting'
            ? 'Detecting finger...'
            : phase === 'measuring'
            ? `Scanning... ${seconds}/${SCAN_DURATION} seconds`
            : result
            ? 'Scan completed'
            : 'Ready to scan'}
        </Text>
      </View>

      {/* Assessment */}
      {result && assessment && (
        <View style={styles.assessmentCard}>
          <View style={styles.assessmentHeader}>
            <Ionicons
              name={assessment.icon}
              size={24}
              color={assessment.color}
            />

            <Text
              style={[styles.assessmentTitle, { color: assessment.color }]}
            >
              {assessment.title}
            </Text>
          </View>

          <Text style={styles.assessmentMessage}>{assessment.message}</Text>
        </View>
      )}

      {/* General Suggestions */}
      {result && result.bpm < 60 && (
        <View style={styles.exerciseCard}>
          <Text style={styles.exerciseTitle}>General fitness suggestions</Text>

          {[
            'Gentle walking',
            'Light cycling',
            'Gentle stretching',
            'Relaxation and breathing exercises',
          ].map((item, index) => (
            <View style={styles.exerciseItem} key={index}>
              <Ionicons name="fitness-outline" size={18} color="#2196F3" />
              <Text style={styles.exerciseText}>{item}</Text>
            </View>
          ))}

          <Text style={styles.exerciseNote}>
            These are just general wellness ideas. The reading above is random
            and not a real measurement.
          </Text>
        </View>
      )}

      {/* Statistics */}
      {result && (
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Resting HR</Text>
            <Text style={styles.statValue}>{result.bpm}</Text>
            <Text style={styles.statUnit}>BPM</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Minimum</Text>
            <Text style={styles.statValue}>{result.minBpm}</Text>
            <Text style={styles.statUnit}>BPM</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Maximum</Text>
            <Text style={styles.statValue}>{result.maxBpm}</Text>
            <Text style={styles.statUnit}>BPM</Text>
          </View>
        </View>
      )}

      {/* Start Scan */}
      <TouchableOpacity
        style={[
          styles.primaryButton,
          (!cameraReady || scanning) && styles.disabledButton,
        ]}
        disabled={!cameraReady || scanning}
        onPress={startScan}
      >
        <Text style={styles.buttonText}>
          {phase === 'detecting'
            ? 'Detecting Finger...'
            : phase === 'measuring'
            ? 'Scanning...'
            : 'Start Scan'}
        </Text>
      </TouchableOpacity>

      {/* Cancel */}
      {scanning && (
        <TouchableOpacity style={styles.cancelButton} onPress={stopScan}>
          <Text style={styles.cancelText}>Cancel Scan</Text>
        </TouchableOpacity>
      )}

      {/* Torch */}
      <TouchableOpacity
        style={styles.secondaryButton}
        disabled={scanning}
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
        Finger detection is experimental. The displayed heart-rate value is
        randomly generated for fun and is not a real pulse measurement. Do not
        use it for medical decisions.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
    paddingBottom: 35,
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
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
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
    height: 200,
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
  detectedTarget: {
    borderColor: '#22C55E',
    borderWidth: 4,
  },
  cameraHint: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 10,
  },
  detectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    gap: 8,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  detectionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#536477',
  },
  result: {
    alignItems: 'center',
    marginVertical: 20,
  },
  bpmRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bpm: {
    fontSize: 56,
    fontWeight: '800',
    color: '#192D42',
  },
  unit: {
    color: '#8493A8',
    fontSize: 14,
    marginLeft: 7,
  },
  status: {
    color: '#F43F5E',
    fontWeight: '600',
    marginTop: 8,
  },
  assessmentCard: {
    backgroundColor: '#F4F7FB',
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
  },
  assessmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  assessmentTitle: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  assessmentMessage: {
    fontSize: 13,
    color: '#788394',
    lineHeight: 20,
    marginTop: 10,
  },
  exerciseCard: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
  },
  exerciseTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#192D42',
    marginBottom: 12,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 5,
  },
  exerciseText: {
    fontSize: 13,
    color: '#536477',
  },
  exerciseNote: {
    fontSize: 11,
    color: '#788394',
    lineHeight: 17,
    marginTop: 12,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#F4F7FB',
    borderRadius: 18,
    paddingVertical: 17,
    marginBottom: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#788394',
  },
  statValue: {
    fontSize: 21,
    fontWeight: '800',
    color: '#24364B',
    marginTop: 6,
  },
  statUnit: {
    fontSize: 10,
    color: '#8493A8',
  },
  primaryButton: {
    backgroundColor: '#F43F5E',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.55,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    alignItems: 'center',
    padding: 12,
  },
  cancelText: {
    color: '#F43F5E',
    fontWeight: '600',
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