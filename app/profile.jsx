import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  SafeAreaView,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
} from 'react-native';

import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const STORAGE_KEY = '@heart_rate/personal_details';
const AVATAR_KEY = '@heart_rate/profile_picture';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// One block of info text that fades and slides in
function InfoBlock({ heading, text, index }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 260,
        delay: index * 70,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        delay: index * 70,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[styles.infoBlock, { opacity, transform: [{ translateY }] }]}
    >
      <Text style={styles.infoHeading}>{heading}</Text>
      <Text style={styles.infoText}>{text}</Text>
    </Animated.View>
  );
}

// A menu row with a rotating arrow and expandable content
function MenuRow({ item, expanded, onPress, renderIcon }) {
  const expandable = Boolean(item.content);

  const rotation = useRef(new Animated.Value(expanded ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: expanded ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [expanded]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <View style={styles.menuEntry}>
      <TouchableOpacity
        style={styles.menuItem}
        activeOpacity={0.7}
        onPress={onPress}
      >
        <View style={styles.menuIcon}>{renderIcon(item)}</View>

        <View style={styles.menuTextContainer}>
          <Text style={styles.menuTitle}>{item.title}</Text>

          {item.subtitle && (
            <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
          )}
        </View>

        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons name="chevron-forward" size={17} color="#8a9dbb" />
        </Animated.View>
      </TouchableOpacity>

      {expandable && expanded && (
        <View style={styles.expandedContent}>
          {item.content.map((entry, index) => (
            <InfoBlock
              key={entry.heading}
              heading={entry.heading}
              text={entry.text}
              index={index}
            />
          ))}
        </View>
      )}
    </View>
  );
}

export default function Profile() {
  const router = useRouter();

  const [details, setDetails] = useState({
    name: 'Unknown',
    address: '',
    country: '',
    age: '0',
    height: '0',
    weight: '0',
  });

  // true  -> user has saved some data  -> show "Edit Details"
  // false -> nothing saved yet         -> show "Add Details"
  const [hasDetails, setHasDetails] = useState(false);

  // Profile picture chosen from the gallery (null = default avatar)
  const [avatarUri, setAvatarUri] = useState(null);

  // Title of the menu item that is currently expanded (null = none)
  const [expandedItem, setExpandedItem] = useState(null);

  // Load saved profile information
  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadDetails = async () => {
        try {
          const savedAvatar = await AsyncStorage.getItem(AVATAR_KEY);
          if (active && savedAvatar) setAvatarUri(savedAvatar);
        } catch (error) {
          console.log('Error loading profile picture:', error);
        }

        try {
          const savedData = await AsyncStorage.getItem(STORAGE_KEY);

          if (!active) return;

          if (savedData) {
            const parsedData = JSON.parse(savedData);

            // Check if the user actually entered anything
            const filled = Boolean(
              parsedData.name?.trim() ||
                parsedData.address?.trim() ||
                parsedData.country?.trim() ||
                (parsedData.age && parsedData.age !== '0') ||
                (parsedData.height && parsedData.height !== '0') ||
                (parsedData.weight && parsedData.weight !== '0')
            );

            setHasDetails(filled);

            setDetails({
              name: parsedData.name || 'Unknown',
              address: parsedData.address || '',
              country: parsedData.country || '',
              age: parsedData.age || '0',
              height: parsedData.height || '0',
              weight: parsedData.weight || '0',
            });
          } else {
            setHasDetails(false);
          }
        } catch (error) {
          console.log('Error loading profile:', error);
        }
      };

      loadDetails();

      return () => {
        active = false;
      };
    }, [])
  );

  // Navigate to Personal Details
  const handleAddDetails = () => {
    router.push('/details');
  };

  // Pick a profile picture from the gallery
  const handlePickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permission needed',
          'Please allow gallery access to choose a profile picture.'
        );
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.4,
        base64: true,
      });

      if (pickerResult.canceled) return;

      const asset = pickerResult.assets?.[0];
      if (!asset?.base64) return;

      const dataUri = `data:image/jpeg;base64,${asset.base64}`;

      setAvatarUri(dataUri);
      await AsyncStorage.setItem(AVATAR_KEY, dataUri);
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Something went wrong', 'Could not set the picture.');
    }
  };

  // Expand / collapse an info section
  const toggleItem = (title) => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        240,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity
      )
    );
    setExpandedItem((current) => (current === title ? null : title));
  };

  const menuItems = [
    {
      title: 'Personal Information',
      icon: 'person-outline',
      type: 'ion',
    },
    {
      title: 'Health Goals',
      subtitle: 'Lose weight • Be more active',
      icon: 'target',
      type: 'feather',
      content: [
        {
          heading: 'Lose weight',
          text: 'Aim for gradual, steady progress. Small changes in meals and daily habits work better than crash diets.',
        },
        {
          heading: 'Be more active',
          text: 'Try to get about 30 minutes of moderate activity, like brisk walking or cycling, on most days of the week.',
        },
        {
          heading: 'Stay hydrated',
          text: 'Drink water regularly through the day, especially before and after exercise.',
        },
        {
          heading: 'Sleep well',
          text: 'Aim for 7 to 9 hours of sleep each night to support recovery and energy.',
        },
        {
          heading: 'Please note',
          text: 'These are general wellness tips, not medical advice. Talk to a doctor before starting a new diet or exercise plan.',
        },
      ],
    },
    {
      title: 'Notifications',
      icon: 'notifications-outline',
      type: 'ion',
    },
    {
      title: 'Data & Privacy',
      icon: 'shield-checkmark-outline',
      type: 'ion',
      content: [
        {
          heading: 'Stored on your device',
          text: 'Your personal details (name, age, height, weight) and your latest scan result are saved only on this phone.',
        },
        {
          heading: 'Camera use',
          text: 'The camera is used only during a scan to check whether a fingertip is covering the lens. Photos are not saved or shared.',
        },
        {
          heading: 'No sharing',
          text: 'Your information is not sold or shared with third parties.',
        },
        {
          heading: 'Deleting your data',
          text: 'Uninstalling the app or clearing its storage in your phone settings removes all saved data.',
        },
      ],
    },
    {
      title: 'Help & Support',
      icon: 'help-circle-outline',
      type: 'ion',
      content: [
        {
          heading: 'How to scan',
          text: 'Tap Start Scan, then cover the rear camera lens and flash completely with your fingertip. Keep still for about 5 seconds.',
        },
        {
          heading: 'Finger not detected?',
          text: 'Press gently but fully over the lens, keep the torch on, and avoid moving. Try again if it times out.',
        },
        {
          heading: 'Update your details',
          text: 'Tap Add Details or Edit Details at the top of this screen to change your name, age, height and weight.',
        },
        {
          heading: 'Contact us',
          text: 'Need more help? Email support@yourapp.com',
        },
      ],
    },
    {
      title: 'About App',
      icon: 'information-circle-outline',
      type: 'ion',
      content: [
        {
          heading: 'Version',
          text: '1.0.0',
        },
        {
          heading: 'What it does',
          text: 'A simple app for keeping your profile and trying out a fun heart rate scanner.',
        },
        {
          heading: 'Important note',
          text: 'Heart rate values shown by the scanner are randomly generated for fun. They are not real measurements and must not be used for medical decisions.',
        },
      ],
    },
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

          {/* Add / Edit Details Button */}
          <TouchableOpacity
            style={styles.addDetailsButton}
            onPress={handleAddDetails}
            activeOpacity={0.8}
          >
            <Ionicons
              name={hasDetails ? 'create-outline' : 'add-circle-outline'}
              size={17}
              color="#ffffff"
            />

            <Text style={styles.addDetailsText}>
              {hasDetails ? 'Edit Details' : 'Add Details'}
            </Text>
          </TouchableOpacity>

          {/* Avatar */}
          <TouchableOpacity
            style={styles.avatarWrapper}
            onPress={handlePickImage}
            activeOpacity={0.85}
          >
            <View style={styles.avatarContainer}>
              <Image
                source={
                  avatarUri
                    ? { uri: avatarUri }
                    : require('../assets/avatar.png')
                }
                style={styles.avatar}
              />
            </View>

            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={12} color="#ffffff" />
            </View>
          </TouchableOpacity>

          {/* Name */}
          <Text style={styles.name}>{details.name}</Text>

          <Text style={styles.tagline}>
            Healthier Today, Stronger Tomorrow
          </Text>

          {/* Premium Badge */}
          <View style={styles.premiumBadge}>
            <Ionicons name="star" size={13} color="#f59e0b" />
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        </View>

        {/* Health Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Age</Text>
            <Text style={styles.statValue}>{details.age}</Text>
            <Text style={styles.statUnit}>Years</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Height</Text>
            <Text style={styles.statValue}>{details.height}</Text>
            <Text style={styles.statUnit}>cm</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Weight</Text>
            <Text style={styles.statValue}>{details.weight}</Text>
            <Text style={styles.statUnit}>kg</Text>
          </View>
        </View>

        {/* Settings Menu */}
        <View style={styles.menu}>
          {menuItems.map((item) => (
            <MenuRow
              key={item.title}
              item={item}
              expanded={expandedItem === item.title}
              renderIcon={renderIcon}
              onPress={() => {
                if (item.title === 'Personal Information') {
                  handleAddDetails();
                } else if (item.content) {
                  toggleItem(item.title);
                }
              }}
            />
          ))}
        </View>

        {/* Health Banner */}
        <TouchableOpacity style={styles.healthBanner} activeOpacity={0.8}>
          <View style={styles.heartCircle}>
            <Ionicons name="heart" size={23} color="#f43f5e" />
          </View>

          <View style={styles.healthText}>
            <Text style={styles.healthTitle}>Your Health Matters</Text>

            <Text style={styles.healthSubtitle}>
              Track. Improve. Live Better.
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={17} color="#8a9dbb" />
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
    paddingTop: 45,
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

  // Add / Edit Details Button
  addDetailsButton: {
    position: 'absolute',
    top: 12,
    right: 15,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#233d78',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },

  addDetailsText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },

  // Avatar
  avatarWrapper: {
    marginBottom: 10,
  },

  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#233d78',
    borderWidth: 2,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
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

  menuEntry: {
    borderBottomWidth: 1,
    borderBottomColor: '#edf1f5',
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 49,
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

  // Expanded content (shown below a menu item, aligned with menu text)
  expandedContent: {
    marginLeft: 42,
    marginRight: 6,
    paddingLeft: 12,
    paddingTop: 2,
    marginBottom: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#c5d6ff',
  },

  infoBlock: {
    marginBottom: 10,
  },

  // Same style as menuTitle
  infoHeading: {
    fontSize: 12,
    fontWeight: '500',
    color: '#152b54',
  },

  // Same style as menuSubtitle
  infoText: {
    fontSize: 10,
    color: '#8494aa',
    marginTop: 3,
    lineHeight: 16,
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