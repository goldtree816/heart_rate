
import React, { useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import Header from '../Components/Header1';
import Footer from '../Components/footer1';
import HeartRateCircle from '../Components/HeartRateCircle';
import HeartRateStats from '../Components/HeartRateStats';
import HeartRateChart from '../Components/HeartRateChart';
import TimeFilter from '../Components/TimeFilter';

export default function Index() {
  const [activeTab, setActiveTab] = useState('Heart Rate');
  const [period, setPeriod] = useState('Today');

 const router = useRouter();

const handleTabPress = (tab) => {
  if (tab === 'Home') {
    router.push('/home');
  } 
  else if (tab === 'Activity') {
    router.push('/activity');
  } 
  else if (tab === 'Heart Rate') {
    return;
  } 
  else if (tab === 'Profile') {
    router.push('/profile');
  }
};

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'left', 'right']}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />


      {activeTab === 'Heart Rate' ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <HeartRateCircle bpm={72} />

          <HeartRateStats />

          <TimeFilter
            selected={period}
            onChange={setPeriod}
          />

          <HeartRateChart period={period} />

          <View style={styles.note}>
            <Ionicons
              name="information-circle-outline"
              size={17}
              color="#8993A2"
            />
            <Text style={styles.noteText}>
              Sample data only — not a medical measurement.
            </Text>
          </View>

          <Link href="/scanner" asChild>
            <TouchableOpacity
              style={styles.scanButton}
              activeOpacity={0.8}
            >
              <Ionicons
                name="heart"
                size={21}
                color="#FFFFFF"
              />
              <Text style={styles.scanButtonText}>
                Scan My Heart Rate
              </Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </Link>
        </ScrollView>
      ) : (
        <View style={styles.placeholder}>
          <Ionicons
            name={
              activeTab === 'Home'
                ? 'home-outline'
                : activeTab === 'Activity'
                ? 'fitness-outline'
                : 'person-outline'
            }
            size={45}
            color="#F43F5E"
          />

          <Text style={styles.placeholderTitle}>
            {activeTab}
          </Text>

          <Text style={styles.placeholderText}>
            Welcome to your {activeTab.toLowerCase()} screen.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => setActiveTab('Heart Rate')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              View Heart Rate
            </Text>
          </TouchableOpacity>
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 12,
    marginBottom: 12,
  },
  noteText: {
    fontSize: 10,
    color: '#8993A2',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#F43F5E',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 12,
    elevation: 3,
  },
  scanButtonText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#192D42',
    marginTop: 12,
  },
  placeholderText: {
    fontSize: 14,
    color: '#8993A2',
    marginTop: 8,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#F43F5E',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
