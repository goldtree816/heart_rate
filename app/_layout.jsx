
import React from 'react';
import { Tabs, useRouter, usePathname } from 'expo-router';

import Footer from '../Components/footer1';

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const activeTab =
    pathname === '/home' ? 'Home' :
    pathname === '/activity' ? 'Activity' :
    pathname === '/profile' ? 'Profile' :
    pathname === '/' ? 'Heart Rate' : '';

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
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={() => (
        <Footer
          activeTab={activeTab}
          onTabPress={handleTabPress}
        />
      )}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="home" />
      <Tabs.Screen name="activity" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen
        name="scanner"
        options={{ href: null }}
      />
    </Tabs>
  );
}
