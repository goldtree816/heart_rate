
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

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
      return <Feather name={item.icon} size={20} color="#233d78" />;
    }
    return <Ionicons name={item.icon} size={21} color="#233d78" />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.headerBackground} />
          <View style={styles.headerGlow} />

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
          <Text style={styles.tagline}>
            Healthier Today, Stronger Tomorrow
          </Text>

          <View style={styles.premiumBadge}>
            <Ionicons name="star" size={13} color="#f59e0b" />
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        </View>

        {/* Health Stats */}
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

        {/* Settings Menu */}
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
                color="#8a9dbb"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Health Banner */}
        <TouchableOpacity style={styles.healthBanner}>
          <View style={styles.heartCircle}>
            <Ionicons name="heart" size={23} color="#f43f5e" />
          </View>

          <View style={styles.healthText}>
            <Text style={styles.healthTitle}>Your Health Matters</Text>
            <Text style={styles.healthSubtitle}>
              Track. Improve. Live Better.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={17}
            color="#8a9dbb"
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  scrollContent: {
    paddingBottom: 20,
  },

  // Profile Header
  profileHeader: {
    alignItems: 'center',
    paddingTop: 35,
    paddingBottom: 18,
    backgroundColor: '#fcf8ff',
    overflow: 'hidden',
    position: 'relative',
  },

  headerBackground: {
    position: 'absolute',
    width: 420,
    height: 180,
    top: -100,
    left: -70,
    borderRadius: 200,
    backgroundColor: '#f5edff',
  },

  headerGlow: {
    position: 'absolute',
    width: 280,
    height: 180,
    top: 65,
    right: -120,
    borderRadius: 150,
    backgroundColor: '#f9f2ff',
  },

  settingsButton: {
    position: 'absolute',
    top: 12,
    right: 20,
    zIndex: 10,
    padding: 5,
  },

  avatarContainer: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#c5d6ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
    marginBottom: 10,
    overflow: 'hidden',
  },

  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#152b54',
    textAlign: 'center',
  },

  tagline: {
    fontSize: 11,
    color: '#637a9d',
    marginTop: 4,
    textAlign: 'center',
  },

  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#fff0c9',
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'center',
  },

  premiumText: {
    color: '#b97b19',
    fontSize: 11,
  },

  // Health Stats
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fbff',
    borderWidth: 1,
    borderColor: '#e8eef8',
    borderRadius: 14,
    paddingVertical: 16,
    marginHorizontal: 12,
    marginTop: 0,
    marginBottom: 14,
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
    fontSize: 10,
    color: '#36517e',
    marginBottom: 4,
  },

  statValue: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#152b54',
  },

  statUnit: {
    fontSize: 10,
    color: '#7183a0',
    marginTop: 3,
  },

  // Settings Menu
  menu: {
    marginTop: 0,
    paddingHorizontal: 12,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 49,
    borderBottomWidth: 1,
    borderBottomColor: '#edf1f5',
    paddingHorizontal: 6,
    paddingVertical: 9,
  },

  menuIcon: {
    width: 36,
    alignItems: 'flex-start',
  },

  menuTextContainer: {
    flex: 1,
  },

  menuTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#152b54',
  },

  menuSubtitle: {
    fontSize: 10,
    color: '#8494aa',
    marginTop: 3,
  },

  // Health Banner
  healthBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff0f3',
    borderRadius: 13,
    padding: 12,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 10,
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
    fontSize: 12,
    fontWeight: 'bold',
    color: '#152b54',
  },

  healthSubtitle: {
    fontSize: 10,
    color: '#637a9d',
    marginTop: 3,
  },
});
