import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  label: {
    marginTop: 2,
    fontSize: 12,
    color: '#8493a8',
  },
  activeLabel: {
    color: '#f43f5e',
    fontWeight: '600',
  },
});