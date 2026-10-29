import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import styles from '../style/header';

export default function Header({ onSettingsPress, isSettingsActive }) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={onSettingsPress}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Open settings"
          accessibilityState={{ selected: isSettingsActive }}
        >
          <Ionicons
            name={isSettingsActive ? 'settings' : 'settings-outline'}
            size={24}
            color={isSettingsActive ? '#f43f5e' : '#64748b'}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}