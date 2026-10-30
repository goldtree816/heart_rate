
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const tabs = [
  { label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  {
    label: 'Heart Rate',
    icon: 'heart-outline',
    activeIcon: 'heart',
  },
  {
    label: 'Activity',
    icon: 'fitness-outline',
    activeIcon: 'fitness',
  },
  {
    label: 'Profile',
    icon: 'person-outline',
    activeIcon: 'person',
  },
];

export default function BottomNavigation({
  activeTab = 'Heart Rate',
  onTabPress = () => {},
}) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active = activeTab === tab.label;

        return (
          <TouchableOpacity
            key={tab.label}
            style={styles.tab}
            onPress={() => onTabPress(tab.label)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={active ? tab.activeIcon : tab.icon}
              size={22}
              color={active ? '#F43F5E' : '#8A95A5'}
            />

            <Text
              style={[
                styles.label,
                active && styles.activeLabel,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
    paddingTop: 12,
    paddingBottom: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 10,
    color: '#8A95A5',
  },
  activeLabel: {
    color: '#F43F5E',
    fontWeight: '700',
  },
});
