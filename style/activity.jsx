import { StyleSheet } from "react-native";

/* ---------- Theme colors ---------- */
export const C = {
  bg: "#F7F8FC",
  ink: "#141B3B",
  muted: "#6B7391",
  track: "#EEF0F8",
  accent: "#F43F5E",
  link: "#2F6BFF",
  heart: { bg: "#FDECEF", border: "#F8D5DB", main: "#EF4B63" },
  steps: { bg: "#E8F7EE", border: "#CDEBD8", main: "#22B866" },
  cal: { bg: "#FFF1E2", border: "#F9DEC0", main: "#F59A23" },
  sleep: { bg: "#EFEBFB", border: "#DDD5F6", main: "#8B5CF6" },
};

/* ---------- Styles ---------- */
export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 20, paddingBottom: 40 },

  // Header
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  title: { fontSize: 30, fontWeight: "800", color: C.ink, letterSpacing: -0.5 },
  calBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: "#fff",
    borderWidth: 1, borderColor: "#E6E9F5", alignItems: "center", justifyContent: "center",
  },

  // Tabs
  tabs: { flexDirection: "row", backgroundColor: C.track, borderRadius: 22, padding: 4 },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 18, alignItems: "center" },
  tabActive: { backgroundColor: C.accent },
  tabText: { fontSize: 14, fontWeight: "600", color: C.ink },
  tabTextActive: { color: "#fff" },

  // Date row
  dateRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 18 },
  dateText: { fontSize: 16, fontWeight: "700", color: C.ink },

  // Cards
  card: { borderRadius: 20, borderWidth: 1, padding: 16, marginBottom: 14 },
  cardHead: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: C.ink },
  infoIcon: { marginLeft: 6 },

  row: { flexDirection: "row", alignItems: "flex-end" },
  flex1: { flex: 1 },
  leftCol: { width: 118, marginRight: 10 },
  big: { fontSize: 30, fontWeight: "800", color: C.ink, letterSpacing: -0.5 },
  bigUnit: { fontSize: 15, fontWeight: "600" },
  sub: { fontSize: 13, color: C.muted, marginTop: 2 },

  // Chart helpers
  yAxis: { height: 64, justifyContent: "space-between", alignItems: "flex-end", width: 28 },
  axisRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  axisRowWithYAxis: { marginRight: 28 },
  axisText: { fontSize: 10, color: C.muted },
  iconBadge: { backgroundColor: "#FFFFFF", borderWidth: 1, alignItems: "center", justifyContent: "center" },

  // Steps
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: "#fff", marginTop: 12, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: C.steps.main, borderRadius: 4 },
  stepsChart: { flex: 1, borderLeftWidth: 1, paddingLeft: 8 },

  // Calories + Sleep
  duo: { flexDirection: "row", gap: 12 },
  duoCard: { flex: 1, marginBottom: 0 },
  calChart: { marginTop: 14 },
  sleepChart: { marginTop: 8 },

  // Recent activity
  recentHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 22, marginBottom: 6 },
  recentTitle: { fontSize: 17, fontWeight: "800", color: C.ink },
  viewAll: { fontSize: 14, fontWeight: "600", color: C.link },

  activityRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, gap: 12 },
  activityIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  activityTitle: { fontSize: 16, fontWeight: "700", color: C.ink },
  activityMeta: { fontSize: 13, color: C.muted, marginTop: 2 },
  activityWhen: { fontSize: 12, color: C.muted },
});