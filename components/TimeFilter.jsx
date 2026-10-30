
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const periods = ['Today', '7 Days', '30 Days', 'Custom'];

export default function TimeFilter({
  selected = 'Today',
  onChange = () => {},
}) {
  return (
    <View style={styles.container}>
      {periods.map((period) => {
        const active = selected === period;

        return (
          <TouchableOpacity
            key={period}
            activeOpacity={0.7}
            onPress={() => onChange(period)}
            style={[
              styles.button,
              active && styles.activeButton,
            ]}
          >
            <Text
              style={[
                styles.text,
                active && styles.activeText,
              ]}
            >
              {period}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F1F4F8',
    borderRadius: 25,
    padding: 4,
    marginTop: 22,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 22,
  },
  activeButton: {
    backgroundColor: '#F43F5E',
  },
  text: {
    fontSize: 10,
    color: '#7A8494',
    fontWeight: '500',
  },
  activeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
