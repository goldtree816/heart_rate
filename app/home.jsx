import React, { useState, useCallback } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useRouter, useFocusEffect } from 'expo-router';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { LinearGradient } from 'expo-linear-gradient';

import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import styles from '../style/home';

// Name shown when the user hasn't saved their details yet
const DEFAULT_NAME = 'Guest';

// Same key used in index.jsx
const HEART_RATE_KEY = '@heart_rate/latest_scan';

// Same key used in profile.jsx
const PERSONAL_DETAILS_KEY = '@heart_rate/personal_details';

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good Morning,';
  if (hour < 17) return 'Good Afternoon,';

  return 'Good Evening,';
};

const quickActions = [
  {
    label: 'Measure\nHeart Rate',
    bg: '#fde8ea',
    icon: (
      <MaterialCommunityIcons
        name="heart-pulse"
        size={28}
        color="#ef4444"
      />
    ),
  },
  {
    label: 'Track\nActivity',
    bg: '#e3effd',
    icon: <Ionicons name="walk" size={28} color="#3b82f6" />,
  },
  {
    label: 'Log\nSleep',
    bg: '#ece8fb',
    icon: <Ionicons name="moon" size={28} color="#8b5cf6" />,
  },
  {
    label: 'View\nReports',
    bg: '#dff5ea',
    icon: (
      <Ionicons
        name="document-text"
        size={28}
        color="#22c55e"
      />
    ),
  },
];

export default function Home() {
  const router = useRouter();

  // User name (loaded from profile details)
  const [userName, setUserName] = useState(DEFAULT_NAME);

  // Sleep data
  const [bedTime, setBedTime] = useState('--:--');
  const [sleepDuration, setSleepDuration] = useState('0h 0m');

  // Heart rate data
  const [heartRate, setHeartRate] = useState(0);

  // Load all dashboard data whenever Home becomes active
  useFocusEffect(
    useCallback(() => {
      let interval = null;
      let isMounted = true;

      const loadDashboardData = async () => {
        try {
          // Load Sleep, Heart Rate and Profile data together
          const values = await AsyncStorage.multiGet([
            'bedTime',
            'sleepDuration',
            'sleepStartTimestamp',
            'isSleeping',
            HEART_RATE_KEY,
            PERSONAL_DETAILS_KEY,
          ]);

          if (!isMounted) return;

          // -----------------------------
          // USER NAME (from profile)
          // -----------------------------

          const savedDetails = values[5][1];

          if (savedDetails) {
            try {
              const parsedDetails = JSON.parse(savedDetails);
              const savedName = parsedDetails.name?.trim();

              setUserName(savedName || DEFAULT_NAME);
            } catch (parseError) {
              setUserName(DEFAULT_NAME);
            }
          } else {
            setUserName(DEFAULT_NAME);
          }

          // -----------------------------
          // SLEEP DATA
          // -----------------------------

          const savedBedTime = values[0][1];
          const savedDuration = values[1][1];
          const savedStartTimestamp = values[2][1];
          const savedIsSleeping = values[3][1] === 'true';

          if (savedBedTime) {
            setBedTime(savedBedTime);
          } else {
            setBedTime('--:--');
          }

          // If currently sleeping, calculate live duration
          if (savedIsSleeping && savedStartTimestamp) {
            const startTime = Number(savedStartTimestamp);

            const updateLiveDuration = () => {
              if (!isMounted) return;

              const elapsedSeconds = Math.max(
                0,
                Math.floor((Date.now() - startTime) / 1000)
              );

              const hours = Math.floor(elapsedSeconds / 3600);

              const minutes = Math.floor(
                (elapsedSeconds % 3600) / 60
              );

              setSleepDuration(`${hours}h ${minutes}m`);
            };

            updateLiveDuration();

            interval = setInterval(updateLiveDuration, 1000);
          } else if (savedDuration !== null) {
            // Show the last completed sleep duration
            const totalSeconds = Number(savedDuration);

            const hours = Math.floor(totalSeconds / 3600);

            const minutes = Math.floor(
              (totalSeconds % 3600) / 60
            );

            setSleepDuration(`${hours}h ${minutes}m`);
          } else {
            setSleepDuration('0h 0m');
          }

          // -----------------------------
          // HEART RATE DATA
          // -----------------------------

          const savedHeartRate = values[4][1];

          if (savedHeartRate) {
            const parsedData = JSON.parse(savedHeartRate);

            setHeartRate(Number(parsedData.bpm) || 0);
          } else {
            setHeartRate(0);
          }

        } catch (error) {
          console.log('Error loading dashboard data:', error);
        }
      };

      loadDashboardData();

      // Clear timer when leaving Home
      return () => {
        isMounted = false;

        if (interval) {
          clearInterval(interval);
        }
      };
    }, [])
  );

  // Health statistics
  const stats = [
    {
      label: 'Steps',
      value: '0',
      sub: '/ 10,000',
      bg: '#dff5ea',
      icon: (
        <Ionicons
          name="footsteps"
          size={16}
          color="#22c55e"
        />
      ),
    },
    {
      label: 'Calories',
      value: '0',
      sub: 'kcal',
      bg: '#ffeedd',
      icon: (
        <Ionicons
          name="flame"
          size={16}
          color="#f97316"
        />
      ),
    },
    {
      label: 'Sleep',
      value: sleepDuration,
      sub: `Bedtime: ${bedTime}`,
      bg: '#ece8fb',
      icon: (
        <Ionicons
          name="moon"
          size={16}
          color="#8b5cf6"
        />
      ),
    },
  ];

  // Quick Actions navigation
  const handleQuickAction = (item) => {
    if (item.label.includes('Measure')) {
      router.push('/');
    } else if (item.label.includes('Track')) {
      router.push('/activity');
    } else if (item.label.includes('Log')) {
      router.push('/sleep');
    } else if (item.label.includes('View')) {
      router.push('/activity');
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
      }}
      edges={['top', 'left', 'right']}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Greeting + bell */}
        <View style={styles.topRow}>
          <View>
            <Text style={styles.greetingSmall}>
              {getGreeting()}
            </Text>

            <Text style={styles.userName}>
              {userName}
            </Text>

            <Text style={styles.tagline}>
              Small steps make big changes 🌿
            </Text>
          </View>

          <TouchableOpacity
            style={styles.bell}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Ionicons
              name="notifications-outline"
              size={26}
              color="#0f172a"
            />

            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>

        {/* Heart Rate Card */}
        <LinearGradient
          colors={['#fb5a78', '#f43f5e']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heartCard}
        >
          <View style={styles.heartHeader}>
            <Text style={styles.heartTitle}>
              Heart Rate
            </Text>

            <Ionicons
              name="chevron-forward"
              size={18}
              color="#ffffff"
            />
          </View>

          <View style={styles.heartBody}>
            <View style={styles.heartCircle}>
              <MaterialCommunityIcons
                name="heart-pulse"
                size={34}
                color="#ffffff"
              />
            </View>

            <View style={styles.heartInfo}>
              <View style={styles.bpmRow}>
                <Text style={styles.bpmValue}>
                  {heartRate}
                </Text>

                <Text style={styles.bpmUnit}>
                  bpm
                </Text>
              </View>

              <View style={styles.normalPill}>
                <View style={styles.normalDot} />

                <Text style={styles.normalText}>
                  {heartRate > 0
                    ? 'Latest reading'
                    : 'Not measured'}
                </Text>
              </View>
            </View>

            <Ionicons
              name="pulse"
              size={56}
              color="#ffffff"
              style={styles.ecg}
            />
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsRow}>
          {stats.map((item) => (
            <View key={item.label} style={styles.statCard}>
              <View
                style={[
                  styles.statIcon,
                  { backgroundColor: item.bg },
                ]}
              >
                {item.icon}
              </View>

              <Text style={styles.statLabel}>
                {item.label}
              </Text>

              <Text style={styles.statValue}>
                {item.value}
              </Text>

              <Text style={styles.statSub}>
                {item.sub}
              </Text>
            </View>
          ))}
        </View>

        {/* Today's Overview */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Today's Overview
          </Text>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="View all"
            onPress={() => router.push('/activity')}
          >
            <Text style={styles.viewAll}>
              View All
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.overviewCard}>
          <View style={styles.overviewIcon}>
            <MaterialCommunityIcons
              name="heart-pulse"
              size={26}
              color="#ffffff"
            />
          </View>

          <View style={styles.overviewText}>
            <Text style={styles.overviewTitle}>
              Your health data is waiting.
            </Text>

            <Text style={styles.overviewSub}>
              Start tracking your health today!
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color="#64748b"
          />
        </View>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, styles.quickTitle]}>
          Quick Actions
        </Text>

        <View style={styles.actionsRow}>
          {quickActions.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.actionTile,
                { backgroundColor: item.bg },
              ]}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={item.label.replace('\n', ' ')}
              onPress={() => handleQuickAction(item)}
            >
              {item.icon}

              <Text style={styles.actionLabel}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Banner */}
        <TouchableOpacity
          style={styles.banner}
          activeOpacity={0.8}
        >
          <View style={styles.bannerIllustration}>
            <Ionicons
              name="walk"
              size={44}
              color="#3b82f6"
            />
          </View>

          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>
              Stay Healthy{' \n'}Live Better
            </Text>

            <Text style={styles.bannerSub}>
              Track your health, reach your goals.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#0f172a"
          />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}