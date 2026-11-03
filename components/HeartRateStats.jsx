
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HeartRateStats({
  bpm = 0,
  minBpm = 0,
  maxBpm = 0,
}) {
  const stats = [
    {
      label: 'Resting HR',
      value: bpm,
      icon: 'heart',
      color: '#F43F5E',
    },
    {
      label: 'Min',
      value: minBpm,
      icon: 'trending-down',
      color: '#2196F3',
    },
    {
      label: 'Max',
      value: maxBpm,
      icon: 'trending-up',
      color: '#9B51E0',
    },
  ];

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

          <Text style={styles.label}>
            {item.label}
          </Text>

          <Text style={styles.value}>
            {item.value}
            <Text style={styles.unit}> bpm</Text>npx 
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FC',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 8,
    marginTop: 20,
    marginBottom: 20,
  },

  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  divider: {
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },

  label: {
    fontSize: 12,
    color: '#8993A2',
    marginTop: 8,
    marginBottom: 5,
  },

  value: {
    fontSize: 20,
    fontWeight: '800',
    color: '#192D42',
  },

  unit: {
    fontSize: 10,
    fontWeight: '500',
    color: '#8993A2',
  },
});
