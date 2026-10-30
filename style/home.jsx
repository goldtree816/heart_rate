import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  // Greeting row
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 4,
    marginBottom: 18,
  },
  greetingSmall: {
    fontSize: 15,
    color: '#475569',
  },
  userName: {
    marginTop: 2,
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  tagline: {
    marginTop: 4,
    fontSize: 14,
    color: '#64748b',
  },
  bell: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#ef4444',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },

  // Heart rate card
  heartCard: {
    borderRadius: 20,
    padding: 18,
    overflow: 'hidden',
  },
  heartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  heartBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  heartCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartInfo: {
    marginLeft: 16,
    flex: 1,
  },
  bpmRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bpmValue: {
    fontSize: 44,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 48,
  },
  bpmUnit: {
    marginLeft: 6,
    marginBottom: 6,
    fontSize: 18,
    fontWeight: '500',
    color: '#ffffff',
  },
  normalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#ffffff',
  },
  normalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    marginRight: 6,
  },
  normalText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  ecg: {
    opacity: 0.85,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  statCard: {
    width: '31.5%',
    backgroundColor: '#f6f9fd',
    borderWidth: 1,
    borderColor: '#e8eef7',
    borderRadius: 16,
    padding: 12,
  },
  statIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    marginTop: 12,
    fontSize: 13,
    color: '#475569',
  },
  statValue: {
    marginTop: 2,
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  statSub: {
    marginTop: 2,
    fontSize: 12,
    color: '#64748b',
  },

  // Section headings
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },

  // Overview card
  overviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f6ec',
    borderRadius: 16,
    padding: 14,
  },
  overviewIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#22b573',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewText: {
    flex: 1,
    marginHorizontal: 12,
  },
  overviewTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  overviewSub: {
    marginTop: 2,
    fontSize: 13,
    color: '#64748b',
  },

  // Quick actions
  quickTitle: {
    marginTop: 24,
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionTile: {
    width: '23%',
    aspectRatio: 0.85,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  actionLabel: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    color: '#0f172a',
  },

  // Banner
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#e3effd',
    borderRadius: 16,
    padding: 14,
  },
  bannerIllustration: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    flex: 1,
    marginHorizontal: 14,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  bannerSub: {
    marginTop: 4,
    fontSize: 12,
    color: '#64748b',
  },
});