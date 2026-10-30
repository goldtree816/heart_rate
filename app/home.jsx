
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Header from '../components/Header1';
import Footer from '../components/footer1';

import styles from '../style/home';

const USER_NAME = 'Karan Kumar Shah';

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good Morning,';
  if (hour < 17) return 'Good Afternoon,';

  return 'Good Evening,';
};

const stats = [
  {
    label: 'Steps',
    value: '4,230',
    sub: '/ 10,000',
    bg: '#dff5ea',
    icon: <Ionicons name="footsteps" size={16} color="#22c55e" />,
  },
  {
    label: 'Calories',
    value: '320',
    sub: 'kcal',
    bg: '#ffeedd',
    icon: <Ionicons name="flame" size={16} color="#f97316" />,
  },
  {
    label: 'Sleep',
    value: '7h 45m',
    sub: 'Good',
    bg: '#ece8fb',
    icon: <Ionicons name="moon" size={16} color="#8b5cf6" />,
  },
];

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

  // Footer navigation
  const handleTabPress = (tab) => {
    if (tab === 'Home') {
      return;
    }

    if (tab === 'Heart Rate') {
      router.push('/');
    }

    // Add Activity and Profile navigation later
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

      
      {/* Home Screen Content */}
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
              {USER_NAME}
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
                <Text style={styles.bpmValue}>72</Text>
                <Text style={styles.bpmUnit}>bpm</Text>
              </View>

              <View style={styles.normalPill}>
                <View style={styles.normalDot} />
                <Text style={styles.normalText}>Normal</Text>
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
          >
            <Text style={styles.viewAll}>View All</Text>
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
              Your heart rate is in the normal range.
            </Text>

            <Text style={styles.overviewSub}>
              Keep up the good work!
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
