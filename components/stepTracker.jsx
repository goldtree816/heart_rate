
import {
  initialize,
  getSdkStatus,
  requestPermission,
  getGrantedPermissions,
  aggregateRecord,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';

const STEPS_PERMISSION = {
  accessType: 'read',
  recordType: 'Steps',
};

// 1. Initialize Health Connect and request permission
export async function initializeStepTracker() {
  const status = await getSdkStatus();

  if (status !== SdkAvailabilityStatus.SDK_AVAILABLE) {
    throw new Error(
      'Health Connect is not available on this device.'
    );
  }

  const initialized = await initialize();

  if (!initialized) {
    throw new Error('Failed to initialize Health Connect.');
  }

  const grantedPermissions = await getGrantedPermissions();

  const hasPermission = grantedPermissions.some(
    (permission) =>
      permission.accessType === 'read' &&
      permission.recordType === 'Steps'
  );

  if (!hasPermission) {
    const permissions = await requestPermission([
      STEPS_PERMISSION,
    ]);

    const permissionGranted = permissions.some(
      (permission) =>
        permission.accessType === 'read' &&
        permission.recordType === 'Steps'
    );

    if (!permissionGranted) {
      throw new Error('Step permission was not granted.');
    }
  }

  return true;
}

// 2. Retrieve today's total steps
export async function getTodaySteps() {
  const now = new Date();

  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const result = await aggregateRecord({
    recordType: 'Steps',
    timeRangeFilter: {
      operator: 'between',
      startTime: startOfDay.toISOString(),
      endTime: now.toISOString(),
    },
  });

  return Number(result.count ?? 0);
}

// 3. Calculate daily calories and progress
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
