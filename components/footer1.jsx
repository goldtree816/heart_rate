
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import styles from '../style/footer';

const tabs = [
  { name: 'Home', icon: 'home-outline', activeIcon: 'home' },
  {
    name: 'Heart Rate',
    icon: 'heart-outline',
    activeIcon: 'heart',
  },
  {
    name: 'Activity',
    icon: 'bar-chart-outline',
    activeIcon: 'bar-chart',
  },
  {
    name: 'Profile',
    icon: 'person-outline',
    activeIcon: 'person',
  },
];

export default function Footer({ activeTab, onTabPress }) {
  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.footer}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name;

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.navItem}
              onPress={() => onTabPress(tab.name)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={tab.name}
              accessibilityState={{ selected: isActive }}
            >
              <Ionicons
                name={isActive ? tab.activeIcon : tab.icon}
                size={24}
                color={isActive ? '#f43f5e' : '#8493a8'}
              />

              <Text
                style={[
                  styles.label,
                  isActive && styles.activeLabel,
                ]}
              >
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
