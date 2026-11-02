
import React, { useEffect, useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';

const STORAGE_KEY = '@heart_rate/latest_scan';

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [result, setResult] = useState(null);

  // Generate a simulated heart-rate reading
  const generateHeartRate = () => {
    const bpm = Math.floor(Math.random() * 41) + 60;

    const minBpm = Math.max(
      40,
      bpm - (Math.floor(Math.random() * 6) + 3)
    );

    const maxBpm =
      bpm + Math.floor(Math.random() * 8) + 5;

    return {
      bpm,
      minBpm,
      maxBpm,
      timestamp: new Date().toISOString(),
    };
  };

  // Finish the simulated scan after 30 seconds
  useEffect(() => {
    if (!scanning) return;

    if (seconds >= 30) {
      const newResult = generateHeartRate();

      setResult(newResult);
      setScanning(false);

      AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(newResult)
      ).catch((error) => {
        console.log('Storage error:', error);
      });

      return;
    }

    const timer = setTimeout(() => {
      setSeconds((previous) => previous + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [scanning, seconds]);

  const startScan = () => {
    if (!cameraReady || scanning) return;

    setResult(null);
    setSeconds(0);
    setScanning(true);
  };

  const stopScan = () => {
    setScanning(false);
    setSeconds(0);
  };

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

        <Text style={styles.title}>
          Camera permission required
        </Text>

        <Text style={styles.description}>
          Allow camera access to use the scanner.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>
            Allow Camera
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getAssessment = () => {
    if (!result) return null;

    if (result.bpm < 60) {
      return {
        title: 'Your heart rate is low',
        message:
          'A low reading can be normal for some people. If you experience dizziness, fainting or unusual weakness, seek medical advice.',
        color: '#2196F3',
        icon: 'alert-circle',
      };
    }

    if (result.bpm > 100) {
      return {
        title: 'Your heart rate is elevated',
        message:
          'Rest quietly and repeat the measurement. Seek medical advice if it remains elevated or you have concerning symptoms.',
        color: '#F59E0B',
        icon: 'alert-circle',
      };
    }

    if (result.bpm <= 79) {
      return {
        title: 'Excellent! Your reading is in range',
        message:
          'Your simulated heart-rate reading is within the typical adult resting range.',
        color: '#16A36A',
        icon: 'checkmark-circle',
      };
    }

    return {
      title: 'Your heart rate is good and stable',
      message:
        'Your simulated heart-rate reading is within the typical adult resting range.',
      color: '#16A36A',
      icon: 'checkmark-circle',
    };
  };

  const assessment = getAssessment();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          Heart Rate Scanner
        </Text>

        <Text style={styles.description}>
          Place your fingertip gently over the rear camera.
        </Text>
      </View>

      {/* Camera Preview */}
      <View style={styles.cameraFrame}>
        <CameraView
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
          <View style={styles.target}>
            <Ionicons
              name="finger-print"
              size={64}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.cameraHint}>
            {scanning
              ? 'Scanning simulation in progress...'
              : 'Cover the camera lens with your fingertip'}
          </Text>
        </View>
      </View>

      {/* Heart Rate Result */}
      <View style={styles.result}>
        <Ionicons
          name="heart"
          size={30}
          color="#F43F5E"
        />

        <View style={styles.bpmRow}>
          <Text style={styles.bpm}>
            {result ? result.bpm : 0}
          </Text>

          <Text style={styles.unit}>BPM</Text>
        </View>

        <Text style={styles.status}>
          {scanning
            ? `Scanning... ${seconds}/30 seconds`
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
              style={[
                styles.assessmentTitle,
                { color: assessment.color },
              ]}
            >
              {assessment.title}
            </Text>
          </View>

          <Text style={styles.assessmentMessage}>
            {assessment.message}
          </Text>
        </View>
      )}

      {/* Exercise Suggestions */}
      {result && result.bpm < 60 && (
        <View style={styles.exerciseCard}>
          <Text style={styles.exerciseTitle}>
            General fitness suggestions
          </Text>

          {[
            'Gentle walking',
            'Light cycling',
            'Gentle stretching',
            'Relaxation and breathing exercises',
          ].map((item, index) => (
            <View style={styles.exerciseItem} key={index}>
              <Ionicons
                name="fitness-outline"
                size={18}
                color="#2196F3"
              />
              <Text style={styles.exerciseText}>
                {item}
              </Text>
            </View>
          ))}

          <Text style={styles.exerciseNote}>
            Exercise is not a treatment for a low heart rate.
            Stop if you feel unwell and consult a healthcare
            professional if you have symptoms.
          </Text>
        </View>
      )}

      {/* Min and Max Statistics */}
      {result && (
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>
              Resting HR
            </Text>
            <Text style={styles.statValue}>
              {result.bpm}
            </Text>
            <Text style={styles.statUnit}>BPM</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Minimum</Text>
            <Text style={styles.statValue}>
              {result.minBpm}
            </Text>
            <Text style={styles.statUnit}>BPM</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Maximum</Text>
            <Text style={styles.statValue}>
              {result.maxBpm}
            </Text>
            <Text style={styles.statUnit}>BPM</Text>
          </View>
        </View>
      )}

      {/* Scan Button */}
      <TouchableOpacity
        style={[
          styles.primaryButton,
          (!cameraReady || scanning) && styles.disabledButton,
        ]}
        disabled={!cameraReady || scanning}
        onPress={startScan}
      >
        <Text style={styles.buttonText}>
          {scanning ? 'Scanning...' : 'Start Scan'}
        </Text>
      </TouchableOpacity>

      {scanning && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={stopScan}
        >
          <Text style={styles.cancelText}>
            Cancel Scan
          </Text>
        </TouchableOpacity>
      )}

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
        The camera does not measure your actual pulse.
        Do not use these readings for medical decisions.
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
  demoBadge: {
    color: '#F43F5E',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 10,
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
