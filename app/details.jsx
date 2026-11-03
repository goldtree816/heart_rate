
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const STORAGE_KEY = '@heart_rate/personal_details';

export default function Details() {
  const router = useRouter();

  const [details, setDetails] = useState({
    name: '',
    address: '',
    country: '',
    age: '',
    height: '',
    weight: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load previously saved details
  useEffect(() => {
    const loadDetails = async () => {
      try {
        const savedDetails = await AsyncStorage.getItem(STORAGE_KEY);

        if (savedDetails !== null) {
          setDetails(JSON.parse(savedDetails));
        }
      } catch (error) {
        Alert.alert('Error', 'Unable to load your details.');
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, []);

  // Update input values
  const handleChange = (field, value) => {
    setDetails(previous => ({
      ...previous,
      [field]: value,
    }));
  };

  // Save details
  const handleSave = async () => {
    try {
      setSaving(true);

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(details)
      );

      Alert.alert(
        'Saved Successfully!',
        'Your personal details have been saved.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Unable to save your details. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  // Reusable input component
  const renderInput = (label, field, placeholder, keyboardType = 'default') => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={details[field]}
        onChangeText={(value) => handleChange(field, value)}
        keyboardType={keyboardType}
        autoCapitalize={field === 'name' || field === 'country' || field === 'address' ? 'words' : 'none'}
      />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#233d78" />
        <Text style={styles.loadingText}>Loading details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Personal Details</Text>
            <Text style={styles.headerSubtitle}>
              Add or update your personal information
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {renderInput('Full Name', 'name', 'Enter your full name')}

            {renderInput('Address', 'address', 'Enter your address')}

            {renderInput('Country', 'country', 'Enter your country')}

            {renderInput('Age', 'age', 'Enter your age', 'numeric')}

            {renderInput('Height (cm)', 'height', 'Enter your height', 'numeric')}

            {renderInput('Weight (kg)', 'weight', 'Enter your weight', 'numeric')}

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveButton, saving && styles.disabledButton]}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.8}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>
                  Save Details
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fc',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f7fc',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#233d78',
  },

  header: {
    paddingTop: 30,
    paddingBottom: 25,
    paddingHorizontal: 22,
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#233d78',
  },

  headerSubtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
  },

  form: {
    paddingHorizontal: 22,
    paddingBottom: 35,
  },

  inputContainer: {
    marginBottom: 18,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#233d78',
    marginBottom: 8,
  },

  input: {
    height: 52,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 15,
    color: '#222',
    borderWidth: 1,
    borderColor: '#e0e6f0',
  },

  saveButton: {
    height: 54,
    backgroundColor: '#233d78',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    elevation: 3,
  },

  disabledButton: {
    opacity: 0.7,
  },

  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
