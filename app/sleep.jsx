
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Sleep() {
  const router = useRouter();

  const [isSleeping, setIsSleeping] = useState(false);
  const [alarmEnabled, setAlarmEnabled] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [seconds, setSeconds] = useState(0);
  const [startTimestamp, setStartTimestamp] = useState(null);

  const [bedTime, setBedTime] = useState('--:--');
  const [wakeUp, setWakeUp] = useState('--:--');

  // Format clock time
  const formatClock = (date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Format sleep duration
  const formatDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return `${hours}h ${minutes}m`;
  };

  // Format running timer
  const formatTimer = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return (
      `${String(hours).padStart(2, '0')}:` +
      `${String(minutes).padStart(2, '0')}:` +
      `${String(secs).padStart(2, '0')}`
    );
  };

  // Load previously saved sleep information
  useEffect(() => {
    const loadSleepData = async () => {
      try {
        const savedBedTime = await AsyncStorage.getItem('bedTime');
        const savedWakeUp = await AsyncStorage.getItem('wakeUp');
        const savedSeconds = await AsyncStorage.getItem('sleepDuration');
        const savedStartTimestamp = await AsyncStorage.getItem('sleepStartTimestamp');
        const savedIsSleeping = await AsyncStorage.getItem('isSleeping');
        const savedAlarm = await AsyncStorage.getItem('alarmEnabled');

        if (savedBedTime !== null) {
          setBedTime(savedBedTime);
        }

        if (savedWakeUp !== null) {
          setWakeUp(savedWakeUp);
        }

        if (savedSeconds !== null) {
          setSeconds(Number(savedSeconds));
        }

        if (savedAlarm !== null) {
          setAlarmEnabled(savedAlarm === 'true');
        }

        // Restore an unfinished sleep session
        if (
          savedIsSleeping === 'true' &&
          savedStartTimestamp !== null
        ) {
          const timestamp = Number(savedStartTimestamp);

          setStartTimestamp(timestamp);
          setIsSleeping(true);

          setSeconds(
            Math.floor((Date.now() - timestamp) / 1000)
          );
        } else {
          setIsSleeping(false);
          setStartTimestamp(null);
        }
      } catch (error) {
        console.log('Error loading sleep data:', error);
      } finally {
        setDataLoaded(true);
      }
    };

    loadSleepData();
  }, []);

  // Update timer every second
  useEffect(() => {
    let interval;

    if (dataLoaded && isSleeping && startTimestamp !== null) {
      interval = setInterval(() => {
        const elapsed = Math.floor(
          (Date.now() - startTimestamp) / 1000
        );

        setSeconds(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [dataLoaded, isSleeping, startTimestamp]);

  // Start or stop sleeping
  const handleSleep = async () => {
    if (!dataLoaded) return;

    try {
      if (!isSleeping) {
        // START SLEEPING
        const now = new Date();
        const timestamp = now.getTime();
        const currentBedTime = formatClock(now);

        setSeconds(0);
        setBedTime(currentBedTime);
        setWakeUp('--:--');
        setStartTimestamp(timestamp);
        setIsSleeping(true);

        // Save the new sleep session
        await AsyncStorage.multiSet([
          ['bedTime', currentBedTime],
          ['wakeUp', '--:--'],
          ['sleepDuration', '0'],
          ['sleepStartTimestamp', String(timestamp)],
          ['isSleeping', 'true'],
        ]);
      } else {
        // STOP SLEEPING
        if (startTimestamp === null) return;

        const now = new Date();

        const totalSeconds = Math.floor(
          (now.getTime() - startTimestamp) / 1000
        );

        const currentWakeUp = formatClock(now);

        setSeconds(totalSeconds);
        setWakeUp(currentWakeUp);
        setIsSleeping(false);
        setStartTimestamp(null);

        // Save the completed sleep session
        await AsyncStorage.multiSet([
          ['wakeUp', currentWakeUp],
          ['sleepDuration', String(totalSeconds)],
          ['isSleeping', 'false'],
        ]);

        await AsyncStorage.removeItem('sleepStartTimestamp');
      }
    } catch (error) {
      console.log('Error saving sleep data:', error);
      Alert.alert('Error', 'Unable to save your sleep information.');
    }
  };

  // Save alarm setting
  const handleAlarmToggle = async () => {
    const newValue = !alarmEnabled;

    setAlarmEnabled(newValue);

    try {
      await AsyncStorage.setItem(
        'alarmEnabled',
        String(newValue)
      );
    } catch (error) {
      console.log('Error saving alarm setting:', error);
    }
  };

  // Sleep goal calculation
  const sleepGoalSeconds = 8 * 60 * 60;

  const progress = Math.min(
    (seconds / sleepGoalSeconds) * 100,
    100
  );

  const remainingSeconds = Math.max(
    sleepGoalSeconds - seconds,
    0
  );

  const handleGoBack = () => {
    router.back();
  };

  const handleAlarm = () => {
    Alert.alert(
      'Sleep Reminder',
      'The reminder toggle is saved, but a scheduled alarm has not been connected yet.'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FAFAFF"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.heading}>Sleep Tracker</Text>
            <Text style={styles.subHeading}>
              Track your sleep and improve your rest
            </Text>
          </View>

          <TouchableOpacity
            style={styles.alarmIcon}
            onPress={handleAlarm}
          >
            <Ionicons
              name="alarm-outline"
              size={25}
              color="#8B72D9"
            />
          </TouchableOpacity>
        </View>

        {/* Sleep Duration Card */}
        <View style={styles.mainCard}>
          <View style={styles.moonCircle}>
            <Ionicons
              name="moon"
              size={35}
              color="#A78BFA"
            />
          </View>

          <Text style={styles.cardLabel}>
            {isSleeping ? 'SLEEPING TIME' : "LAST NIGHT'S SLEEP"}
          </Text>

          <Text style={styles.sleepDuration}>
            {formatDuration(seconds)}
          </Text>

          <Text style={styles.sleepDescription}>
            {isSleeping
              ? 'Your sleep session is in progress'
              : seconds > 0
                ? 'Your recorded sleep duration'
                : 'Start tracking your sleep'}
          </Text>

          {isSleeping && (
            <Text style={styles.liveTimer}>
              {formatTimer(seconds)}
            </Text>
          )}

          <TouchableOpacity
            style={[
              styles.sleepButton,
              isSleeping && styles.stopButton,
              !dataLoaded && styles.disabledButton,
            ]}
            onPress={handleSleep}
            activeOpacity={0.8}
            disabled={!dataLoaded}
          >
            <Ionicons
              name={isSleeping ? 'stop-circle' : 'moon'}
              size={21}
              color="#FFFFFF"
            />

            <Text style={styles.sleepButtonText}>
              {!dataLoaded
                ? 'Loading...'
                : isSleeping
                  ? 'Stop Sleeping'
                  : 'Start Sleeping'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bedtime and Wake Up */}
        <View style={styles.timeContainer}>
          <View style={styles.timeCard}>
            <View style={styles.timeIcon}>
              <Ionicons
                name="moon-outline"
                size={23}
                color="#8B72D9"
              />
            </View>

            <Text style={styles.timeLabel}>Bedtime</Text>
            <Text style={styles.timeValue}>{bedTime}</Text>
          </View>

          <View style={styles.timeCard}>
            <View style={[styles.timeIcon, styles.sunIcon]}>
              <Ionicons
                name="sunny-outline"
                size={23}
                color="#E5A84B"
              />
            </View>

            <Text style={styles.timeLabel}>Wake Up</Text>
            <Text style={styles.timeValue}>{wakeUp}</Text>
          </View>
        </View>

        {/* Sleep Goal */}
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <View>
              <Text style={styles.sectionTitle}>Sleep Goal</Text>
              <Text style={styles.goalSubtitle}>
                Your daily target is 8 hours
              </Text>
            </View>

            <View style={styles.goalIcon}>
              <Ionicons
                name="trophy-outline"
                size={24}
                color="#E5A84B"
              />
            </View>
          </View>

          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {Math.round(progress)}% completed
            </Text>

            <Text style={styles.progressText}>
              {formatDuration(seconds)} / 8h
            </Text>
          </View>

          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%` },
              ]}
            />
          </View>

          <Text style={styles.remainingText}>
            {seconds >= sleepGoalSeconds
              ? 'Congratulations! You reached your sleep goal.'
              : `${formatDuration(remainingSeconds)} remaining to reach your goal`}
          </Text>
        </View>

        {/* Sleep Reminder */}
        <View style={styles.alarmCard}>
          <View style={styles.alarmLeft}>
            <View style={styles.alarmIconBox}>
              <Ionicons
                name="notifications-outline"
                size={23}
                color="#8B72D9"
              />
            </View>

            <View>
              <Text style={styles.alarmTitle}>Sleep Reminder</Text>
              <Text style={styles.alarmSubtitle}>
                Enable your sleep reminder
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.toggle,
              alarmEnabled && styles.toggleActive,
            ]}
            onPress={handleAlarmToggle}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.toggleCircle,
                alarmEnabled && styles.toggleCircleActive,
              ]}
            />
          </TouchableOpacity>
        </View>

        {/* Footer Message */}
        <View style={styles.footerMessage}>
          <Ionicons
            name="heart-outline"
            size={19}
            color="#A78BFA"
          />
          <Text style={styles.footerText}>
            Good sleep is the foundation of a healthy life.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFF',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F0ECFA',
    borderRadius: 10,
  },

  backText: {
    fontSize: 14,
    color: '#45405C',
    marginLeft: 6,
    fontWeight: '600',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },

  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#45405C',
  },

  subHeading: {
    fontSize: 13,
    color: '#9994AA',
    marginTop: 5,
  },

  alarmIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: '#F0ECFA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 25,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#8B72D9',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 20,
  },

  moonCircle: {
    width: 75,
    height: 75,
    borderRadius: 40,
    backgroundColor: '#F1ECFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },

  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#A19BB3',
    letterSpacing: 1.5,
  },

  sleepDuration: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#45405C',
    marginTop: 8,
  },

  sleepDescription: {
    fontSize: 13,
    color: '#A19BB3',
    marginTop: 5,
  },

  liveTimer: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8B72D9',
    marginTop: 12,
    letterSpacing: 2,
  },

  sleepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A78BFA',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 25,
  },

  stopButton: {
    backgroundColor: '#E58A8A',
  },

  disabledButton: {
    opacity: 0.6,
  },

  sleepButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 9,
  },

  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
    marginBottom: 20,
  },

  timeCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 17,
    elevation: 2,
    shadowColor: '#8B72D9',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  timeIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#F1ECFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  sunIcon: {
    backgroundColor: '#FFF5E5',
  },

  timeLabel: {
    fontSize: 13,
    color: '#A19BB3',
  },

  timeValue: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#45405C',
    marginTop: 5,
  },

  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    elevation: 2,
    shadowColor: '#8B72D9',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#45405C',
  },

  goalSubtitle: {
    fontSize: 12,
    color: '#A19BB3',
    marginTop: 5,
  },

  goalIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: '#FFF5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#77718D',
  },

  progressBackground: {
    height: 10,
    backgroundColor: '#F0ECFA',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#A78BFA',
    borderRadius: 10,
  },

  remainingText: {
    fontSize: 12,
    color: '#A19BB3',
    marginTop: 12,
  },

  alarmCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#8B72D9',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    marginBottom: 22,
  },

  alarmLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  alarmIconBox: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: '#F1ECFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  alarmTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#45405C',
  },

  alarmSubtitle: {
    fontSize: 11,
    color: '#A19BB3',
    marginTop: 4,
  },

  toggle: {
    width: 48,
    height: 27,
    borderRadius: 20,
    backgroundColor: '#DDD9E8',
    padding: 3,
    justifyContent: 'center',
  },

  toggleActive: {
    backgroundColor: '#A78BFA',
    alignItems: 'flex-end',
  },

  toggleCircle: {
    width: 21,
    height: 21,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },

  toggleCircleActive: {
    backgroundColor: '#FFFFFF',
  },

  footerMessage: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },

  footerText: {
    fontSize: 11,
    color: '#A19BB3',
    marginLeft: 7,
    textAlign: 'center',
  },
});
