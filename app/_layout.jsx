import React from 'react';
import { View, StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import Header from '../components/header';
import Footer from '../components/footer';

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="dark-content" />
      <Header />
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
      <Footer />
    </View>
  );
}