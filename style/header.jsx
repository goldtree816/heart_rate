import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // pushes the button to the right
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },
});