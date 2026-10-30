
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Profile() {
  const menuItems = [
    { title: 'Personal Information', icon: 'person-outline', type: 'ion' },
    { title: 'Health Goals', subtitle: 'Lose weight • Be more active', icon: 'target', type: 'feather' },
    { title: 'Notifications', icon: 'notifications-outline', type: 'ion' },
    { title: 'Data & Privacy', icon: 'shield-checkmark-outline', type: 'ion' },
    { title: 'Help & Support', icon: 'help-circle-outline', type: 'ion' },
    { title: 'About App', icon: 'information-circle-outline', type: 'ion' },
  ];

  const renderIcon = (item) => {
    if (item.type === 'feather') {
      return <Feather name={item.icon} size={21} color="#233d78" />;
    }
    return <Ionicons name={item.icon} size={22} color="#233d78" />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff9fc" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={22} color="#233d78" />
          </TouchableOpacity>

          <View style={styles.avatarContainer}>
          <Image
            source={require('../assets/avatar.png')}
            style={styles.avatar}
            />
          </View>

          <Text style={styles.name}>Karan Kumar Shah</Text>
          <Text style={styles.tagline}>Healthier Today, Stronger Tomorrow</Text>

          <View style={styles.premiumBadge}>
            <Ionicons name="star" size={14} color="#f59e0b" />
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        </View>

        {/* Health stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Age</Text>
            <Text style={styles.statValue}>30</Text>
            <Text style={styles.statUnit}>Years</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Height</Text>
            <Text style={styles.statValue}>175</Text>
            <Text style={styles.statUnit}>cm</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Weight</Text>
            <Text style={styles.statValue}>68</Text>
            <Text style={styles.statUnit}>kg</Text>
          </View>
        </View>

        {/* Settings menu */}
        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => {}}
            >
              <View style={styles.menuIcon}>
                {renderIcon(item)}
              </View>

              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                {item.subtitle && (
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                )}
              </View>

              <Ionicons
                name="chevron-forward"
                size={17}
                color="#9ba9c0"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Health banner */}
        <TouchableOpacity style={styles.healthBanner}>
          <View style={styles.heartCircle}>
            <Ionicons name="heart" size={24} color="#f43f5e" />
          </View>

          <View style={styles.healthText}>
            <Text style={styles.healthTitle}>Your Health Matters</Text>
            <Text style={styles.healthSubtitle}>
              Track. Improve. Live Better.
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={17} color="#9ba9c0" />
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.replace('/')}
        >
          <Ionicons name="home" size={23} color="#8092aa" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="bar-chart" size={23} color="#8092aa" />
          <Text style={styles.navText}>Activity</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={23} color="#f43f5e" />
          <Text style={styles.activeNavText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 25,
  },
  header: {
    alignItems: 'center',
    paddingTop: 35,
    paddingBottom: 16,
    backgroundColor: '#fff9fc',
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  settingsButton: {
    position: 'absolute',
    right: 5,
    top: 15,
    zIndex: 1,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#c5d6ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
    marginBottom: 8,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#152b54',
  },
  tagline: {
    fontSize: 12,
    color: '#637a9d',
    marginTop: 3,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fff0c9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
  },
  premiumText: {
    color: '#b97b19',
    fontSize: 12,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fbff',
    borderWidth: 1,
    borderColor: '#edf1f8',
    borderRadius: 15,
    paddingVertical: 15,
    marginTop: 15,
    marginBottom: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 42,
    backgroundColor: '#e6edf6',
  },
  statLabel: {
    fontSize: 11,
    color: '#36517e',
    marginBottom: 3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#152b54',
  },
  statUnit: {
    fontSize: 11,
    color: '#7183a0',
    marginTop: 2,
  },
  menu: {
    marginTop: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 53,
    borderBottomWidth: 1,
    borderBottomColor: '#edf1f5',
    paddingHorizontal: 5,
    paddingVertical: 9,
  },
  menuIcon: {
    width: 32,
    alignItems: 'flex-start',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#152b54',
  },
  menuSubtitle: {
    fontSize: 10,
    color: '#8494aa',
    marginTop: 3,
  },
  healthBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff0f3',
    borderRadius: 13,
    padding: 12,
    marginTop: 15,
  },
  heartCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffd1dc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  healthText: {
    flex: 1,
  },
  healthTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#152b54',
  },
  healthSubtitle: {
    fontSize: 10,
    color: '#637a9d',
    marginTop: 3,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#edf1f5',
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 11,
    color: '#8092aa',
  },
  activeNavText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#f43f5e',
  },
});
