
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

export default function HeartRateCircle({ bpm = 72 }) {
  const size = 190;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>

        <Svg width={size} height={size}>

          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#FCE1E7"
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Progress Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#F43F5E"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.27} ${circumference}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            fill="none"
          />

        </Svg>

        {/* Center Content */}
        <View style={styles.center}>
          <Ionicons
            name="heart"
            size={38}
            color="#F43F5E"
          />

          <Text style={styles.bpm}>{bpm}</Text>

          <Text style={styles.unit}>bpm</Text>
        </View>
      </View>

      {/* Status */}
      <View style={styles.status}>
        <View style={styles.dot} />
        <Text style={styles.statusText}>Normal</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 18,
  },

  circleContainer: {
    width: 190,
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
  },

  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bpm: {
    fontSize: 43,
    lineHeight: 49,
    fontWeight: '700',
    color: '#15283D',
  },

  unit: {
    fontSize: 14,
    fontWeight: '600',
    color: '#15283D',
  },

  status: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8EF',
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#17B978',
    marginRight: 6,
  },

  statusText: {
    color: '#17A66B',
    fontSize: 12,
    fontWeight: '600',
  },
});
