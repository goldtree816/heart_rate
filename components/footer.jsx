import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import styles from '../styles/footer';

const tabs = [
  { name: 'Home', href: '/', icon: 'home-outline', activeIcon: 'home' },
  { name: 'Activity', href: '/activity', icon: 'bar-chart-outline', activeIcon: 'bar-chart' },
  { name: 'Profile', href: '/profile', icon: 'person-outline', activeIcon: 'person' },
];

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.footer}>
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.navItem}
              onPress={() => router.navigate(tab.href)}
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
              <Text style={[styles.label, isActive && styles.activeLabel]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}