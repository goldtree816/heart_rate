import React, { useState } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/header';
import Footer from '../components/footer';
import styles from '../style/style';

const screens = {
  Home: { icon: 'home', description: 'Welcome to your home screen!' },
  Activity: { icon: 'bar-chart', description: 'View your recent activities here.' },
  Profile: { icon: 'person', description: 'Manage your profile here.' },
  Settings: { icon: 'settings', description: 'Customize your app settings here.' },
};

export default function Index() {
  const [activeTab, setActiveTab] = useState('Home');
  const screen = screens[activeTab];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header
        isSettingsActive={activeTab === 'Settings'}
        onSettingsPress={() => setActiveTab('Settings')}
      />

      <View style={styles.content}>
        <Ionicons name={screen.icon} size={45} color="#f43f5e" />
        <Text style={styles.title}>{activeTab}</Text>
        <Text style={styles.description}>{screen.description}</Text>
      </View>

      <Footer activeTab={activeTab} onTabPress={setActiveTab} />
    </View>
  );
}