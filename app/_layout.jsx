
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, usePathname, useRouter } from 'expo-router';

import Header from '../components/Header1';
import Footer from '../components/footer1';

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const isScanner = pathname === '/scanner';

  const activeTab =
    pathname === '/home' ? 'Home' :
    pathname === '/activity' ? 'Activity' :
    pathname === '/profile' ? 'Profile' :
    pathname === '/' ? 'Heart Rate' : '';

  const titles = {
    '/': 'Heart Rate',
    '/home': 'Home',
    '/activity': 'Activity',
    '/profile': 'Profile',
  };

  const handleTabPress = (tab) => {
    const routes = {
      Home: '/home',
      'Heart Rate': '/',
      Activity: '/activity',
      Profile: '/profile',
    };

    if (routes[tab]) {
      router.replace(routes[tab]);
    }
  };

  return (
    <View style={styles.container}>

      {!isScanner && (
        <Header
          title={titles[pathname] || 'Health Tracker'}
          onBackPress={() => router.back()}
          onSettingsPress={() => router.push('/profile')}
        />
      )}

      <View style={styles.screen}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="home" />
          <Stack.Screen name="activity" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="scanner" />
        </Stack>
      </View>

      {!isScanner && (
        <Footer
          activeTab={activeTab}
          onTabPress={handleTabPress}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  screen: {
    flex: 1,
  },
});
