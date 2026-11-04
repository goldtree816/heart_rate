
import {
  NativeModules,
  NativeEventEmitter,
  PermissionsAndroid,
  Platform,
} from 'react-native';

const { StepCounter } = NativeModules;

if (!StepCounter) {
  console.warn('Native StepCounter module is not registered.');
}

const stepCounterEmitter = StepCounter
  ? new NativeEventEmitter(StepCounter)
  : null;

// Request Android activity recognition permission
async function requestStepPermission() {
  if (Platform.OS !== 'android') {
    throw new Error('Step counter is currently supported on Android only.');
  }

  if (Platform.Version >= 29) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION
    );

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      throw new Error('Activity recognition permission was denied.');
    }
  }

  return true;
}

// Initialize and start the native step counter
export async function initializeStepTracker() {
  if (!StepCounter) {
    throw new Error('Native StepCounter module is not available.');
  }

  await requestStepPermission();

  await StepCounter.startStepCounting();

  return true;
}

// Retrieve saved steps
export async function getTodaySteps() {
  if (!StepCounter) {
    throw new Error('Native StepCounter module is not available.');
  }

  const steps = await StepCounter.getSteps();

  return Number(steps ?? 0);
}

// Listen for live step updates
export function subscribeToStepUpdates(callback) {
  if (!stepCounterEmitter) {
    throw new Error('Native StepCounter module is not available.');
  }

  const subscription = stepCounterEmitter.addListener(
    'StepCounterUpdate',
    (steps) => {
      callback(Number(steps));
    }
  );

  return () => subscription.remove();
}

// Retrieve daily activity
export async function getDailyActivity() {
  await initializeStepTracker();

  const steps = await getTodaySteps();

  const calories = Math.floor(steps / 20);

  return {
    steps,
    calories,
    goal: 10000,
    progress: Math.min((steps / 10000) * 100, 100),
  };
}
