
import React, { useState, useCallback } from 'react';

import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

import { useRouter, useFocusEffect } from 'expo-router';

import HeartRateCircle from '../components/HeartRateCircle';
import HeartRateStats from '../components/HeartRateStats';
import HeartRateChart from '../components/HeartRateChart';
import TimeFilter from '../components/TimeFilter';

const STORAGE_KEY = '@heart_rate/latest_scan';

export default function Index() {
  const router = useRouter();

  const [period, setPeriod] = useState('Today');

  const [latestScan, setLatestScan] = useState({
    bpm: 0,
    minBpm: 0,
    maxBpm: 0,
  });

  // Load the latest scan whenever the dashboard becomes active
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadLatestScan = async () => {
        try {
          const savedData = await AsyncStorage.getItem(STORAGE_KEY);

          if (savedData && isActive) {
            const parsedData = JSON.parse(savedData);

            setLatestScan({
              bpm: parsedData.bpm ?? 0,
              minBpm: parsedData.minBpm ?? 0,
              maxBpm: parsedData.maxBpm ?? 0,
            });
          }
        } catch (error) {
          console.log('Error loading heart rate:', error);
        }
      };

      loadLatestScan();

      return () => {
        isActive = false;
      };
    }, [])
  );

  // Navigate to scanner screen
  const handleScan = () => {
    router.push('/scanner');
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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* Main Heart Rate Display */}
        <HeartRateCircle bpm={latestScan.bpm} />

        {/* Heart Rate Statistics */}
        <HeartRateStats
          bpm={latestScan.bpm}
          minBpm={latestScan.minBpm}
          maxBpm={latestScan.maxBpm}
        />

        {/* Time Filter */}
        <TimeFilter
          selected={period}
          onChange={setPeriod}
        />

        {/* Heart Rate Chart */}
        <HeartRateChart period={period} />

        {/* Information Note */}
        <View style={styles.note}>
          <Ionicons
            name="information-circle-outline"
            size={17}
            color="#8993A2"
          />

          <Text style={styles.noteText}>
            Readings only — not a medical measurement.
          </Text>
        </View>

        {/* Scan Heart Rate Button */}
        <TouchableOpacity
          style={styles.scanButton}
          activeOpacity={0.8}
          onPress={handleScan}
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

      </ScrollView>
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
});
