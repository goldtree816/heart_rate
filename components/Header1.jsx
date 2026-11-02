
import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Header({
  title = 'Heart Rate',
  onBackPress,
  onSettingsPress,
}) {
  const router = useRouter();

  const handleBack = () => {
    // Use custom callback only if provided
    if (onBackPress) {
      onBackPress();
      return;
    }

    // Check navigation history
    if (router.canGoBack()) {
      router.back();
    } else {
      // Fallback when no previous screen exists
      router.replace('/home');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handleBack}
      >
        <Ionicons
          name="chevron-back"
          size={25}
          color="#24364B"
        />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={onSettingsPress}
      >
        <Ionicons
          name="settings-outline"
          size={22}
          color="#24364B"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  button: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#192D42',
  },
});
