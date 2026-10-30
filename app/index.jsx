
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
import { useRouter } from 'expo-router';

import HeartRateCircle from '../components/HeartRateCircle';
import HeartRateStats from '../components/HeartRateStats';
import HeartRateChart from '../components/HeartRateChart';
import TimeFilter from '../components/TimeFilter';

export default function Index() {
  const router = useRouter();

  const [period, setPeriod] = useState('Today');

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
