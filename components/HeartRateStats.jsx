
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const stats = [
  {
    label: 'Resting HR',
    value: 68,
    icon: 'heart',
    color: '#F43F5E',
  },
  {
    label: 'Min',
    value: 56,
    icon: 'trending-down',
    color: '#2196F3',
  },
  {
    label: 'Max',
    value: 128,
    icon: 'trending-up',
    color: '#9B51E0',
  },
];

export default function HeartRateStats() {
  return (
    <View style={styles.container}>
      {stats.map((item, index) => (
        <View
          key={item.label}
          style={[
            styles.card,
            index !== stats.length - 1 && styles.divider,
          ]}
        >
          <Ionicons
            name={item.icon}
            size={21}
            color={item.color}
          />

          <Text style={styles.label}>{item.label}</Text>

          <Text style={styles.value}>
            {item.value}
            <Text style={styles.unit}> bpm</Text>
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F4F7FB',
    borderRadius: 18,
    marginTop: 22,
    paddingVertical: 16,
    paddingHorizontal: 5,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    borderRightWidth: 1,
    borderRightColor: '#E5EAF1',
  },
  label: {
    fontSize: 11,
    color: '#788394',
    marginTop: 7,
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    fontWeight: '700',
    color: '#24364B',
  },
  unit: {
    fontSize: 10,
    fontWeight: '400',
  },
});
