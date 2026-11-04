
import React, { useMemo, useState, useCallback } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import Svg, { Path, Rect } from 'react-native-svg';

import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

import { useFocusEffect } from 'expo-router';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { C, styles } from '../style/activity';

import {
  initializeStepTracker,
  getTodaySteps,
  subscribeToStepUpdates,
} from '../components/stepTracker';

// Heart rate storage key
const HEART_RATE_KEY = '@heart_rate/latest_scan';

const RANGES = ['Day', 'Week', 'Month', 'Year'];
const DAY_MS = 86400000;

// Sample heart rate chart data
const seeded = (seed) => () => {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};

const makeSeries = (n, base, amp, seed) => {
  const rnd = seeded(seed);

  return Array.from(
    { length: n },
    (_, i) => base + Math.sin(i / 4) * amp * 0.6 + (rnd() - 0.5) * amp
  );
};

const HEART = makeSeries(60, 82, 14, 7);

const SLEEP = [
  3, 5, 6, 4, 5, 8, 7, 9, 6, 8, 10,
  9, 7, 8, 6, 9, 10, 8, 7, 9, 6, 8,
];

// Format sleep duration
const formatSleepDuration = (totalSeconds) => {
  const safeSeconds = Math.max(0, Number(totalSeconds) || 0);

  const hours = Math.floor(safeSeconds / 3600);

  const minutes = Math.floor(
    (safeSeconds % 3600) / 60
  );

  return `${hours}h ${minutes}m`;
};

/* ---------- Chart Width ---------- */

const useWidth = () => {
  const [w, setW] = useState(0);

  return [
    w,
    (e) => setW(e.nativeEvent.layout.width),
  ];
};

/* ---------- Dynamic Line Chart ---------- */

const LineChart = ({
  data,
  color,
  height,
  min,
  max,
}) => {
  const [w, onLayout] = useWidth();

  const validData = data.filter(
    (v) => Number.isFinite(v)
  );

  const dataMin = validData.length
    ? Math.min(...validData)
    : 0;

  const dataMax = validData.length
    ? Math.max(...validData)
    : 0;

  const dataRange = dataMax - dataMin || 1;

  const padding = dataRange * 0.15;

  const lo = min ?? Math.max(0, dataMin - padding);
  const hi = max ?? dataMax + padding;

  const d = useMemo(() => {
    if (!w || validData.length === 0) return '';

    return validData
      .map((v, i) => {
        const x =
          validData.length === 1
            ? w / 2
            : (i / (validData.length - 1)) * w;

        const y =
          height -
          ((v - lo) / (hi - lo || 1)) * height;

        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [w, data, height, lo, hi]);

  return (
    <View onLayout={onLayout} style={{ height }}>
      {w > 0 && d !== '' && (
        <Svg width={w} height={height}>
          <Path
            d={d}
            stroke={color}
            strokeWidth={2}
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </Svg>
      )}
    </View>
  );
};

/* ---------- Dynamic Bar Chart ---------- */

const BarChart = ({
  data,
  color,
  height,
  gap = 3,
  fade = false,
}) => {
  const [w, onLayout] = useWidth();

  const max = Math.max(
    ...data.filter(Number.isFinite),
    0
  );

  const bw = w && data.length
    ? Math.max(
        0,
        (w - gap * (data.length - 1)) / data.length
      )
    : 0;

  return (
    <View onLayout={onLayout} style={{ height }}>
      {w > 0 && max > 0 && (
        <Svg width={w} height={height}>
          {data.map((v, i) => {
            if (!Number.isFinite(v) || v <= 0) {
              return null;
            }

            const h = Math.max(
              2,
              (v / max) * height
            );

            return (
              <Rect
                key={i}
                x={i * (bw + gap)}
                y={height - h}
                width={bw}
                height={h}
                rx={Math.min(2, bw / 2)}
                fill={color}
                opacity={
                  fade
                    ? 0.55 + (v / max) * 0.45
                    : 1
                }
              />
            );
          })}
        </Svg>
      )}
    </View>
  );
};

/* ---------- Axis Labels ---------- */

const AxisLabels = ({ labels, withYAxis }) => (
  <View
    style={[
      styles.axisRow,
      withYAxis && styles.axisRowWithYAxis,
    ]}
  >
    {labels.map((l, i) => (
      <Text key={i} style={styles.axisText}>
        {l}
      </Text>
    ))}
  </View>
);

/* ---------- Icon Badge ---------- */

const IconBadge = ({ name, tint, size = 28 }) => (
  <View
    style={[
      styles.iconBadge,
      {
        width: size,
        height: size,
        borderRadius: 9,
        borderColor: tint + '55',
      },
    ]}
  >
    <Icon
      name={name}
      size={size * 0.62}
      color={tint}
    />
  </View>
);

/* ---------- Activity Screen ---------- */

export default function ActivityScreen() {
  const [range, setRange] = useState('Day');
  const [offset, setOffset] = useState(0);

  // Heart rate
  const [heartRate, setHeartRate] = useState(0);

  // Steps and calories
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);

  // Sleep
  const [sleepDuration, setSleepDuration] = useState('0h 0m');
  const [bedTime, setBedTime] = useState('--:--');
  const [isSleeping, setIsSleeping] = useState(false);

  // Update steps and calories together
  const updateStepValues = useCallback((value) => {
    const totalSteps = Math.max(
      0,
      Number(value) || 0
    );

    setSteps(totalSteps);

    // Same calculation used on Home
    setCalories(Math.floor(totalSteps / 20));
  }, []);

  /* ---------- Load Step Counter ---------- */

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      let unsubscribe = null;

      const loadSteps = async () => {
        try {
          // Listen for live step updates
          unsubscribe = subscribeToStepUpdates((newSteps) => {
            if (isActive) {
              updateStepValues(newSteps);
            }
          });

          // Start native step counter
          await initializeStepTracker();

          // Read saved steps
          const savedSteps = await getTodaySteps();

          if (isActive) {
            updateStepValues(savedSteps);
          }
        } catch (error) {
          console.log('Error loading step counter:', error);
        }
      };

      loadSteps();

      return () => {
        isActive = false;

        if (unsubscribe) {
          unsubscribe();
        }
      };
    }, [updateStepValues])
  );

  /* ---------- Load Heart Rate and Sleep ---------- */

  useFocusEffect(
    useCallback(() => {
      let interval = null;
      let isActive = true;

      const loadActivityData = async () => {
        try {
          const values = await AsyncStorage.multiGet([
            HEART_RATE_KEY,
            'bedTime',
            'sleepDuration',
            'sleepStartTimestamp',
            'isSleeping',
          ]);

          if (!isActive) return;

          // Heart Rate
          const savedHeartRate = values[0][1];

          if (savedHeartRate) {
            const parsedData = JSON.parse(savedHeartRate);

            setHeartRate(
              Number(parsedData.bpm) || 0
            );
          } else {
            setHeartRate(0);
          }

          // Sleep
          const savedBedTime = values[1][1];
          const savedDuration = values[2][1];
          const savedStartTimestamp = values[3][1];
          const sleeping = values[4][1] === 'true';

          setBedTime(savedBedTime || '--:--');
          setIsSleeping(sleeping);

          if (sleeping && savedStartTimestamp) {
            const startTime = Number(savedStartTimestamp);

            const updateLiveSleep = () => {
              if (!isActive) return;

              const elapsedSeconds = Math.max(
                0,
                Math.floor(
                  (Date.now() - startTime) / 1000
                )
              );

              setSleepDuration(
                formatSleepDuration(elapsedSeconds)
              );
            };

            updateLiveSleep();

            interval = setInterval(
              updateLiveSleep,
              1000
            );
          } else if (savedDuration !== null) {
            const totalSeconds = Number(savedDuration);

            setSleepDuration(
              formatSleepDuration(totalSeconds)
            );
          } else {
            setSleepDuration('0h 0m');
          }
        } catch (error) {
          console.log(
            'Error loading activity data:',
            error
          );
        }
      };

      loadActivityData();

      return () => {
        isActive = false;

        if (interval) {
          clearInterval(interval);
        }
      };
    }, [])
  );

  /* ---------- Date ---------- */

  const dateLabel = useMemo(() => {
    const d = new Date(
      Date.now() + offset * DAY_MS
    );

    const dateText = d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    return offset === 0
      ? `Today, ${dateText}`
      : dateText;
  }, [offset]);

  // Historical step records are not currently stored.
  const isToday = offset === 0;

  const displayedSteps = isToday ? steps : 0;
  const displayedCalories = isToday ? calories : 0;

  const stepProgress = Math.min(
    (displayedSteps / 10000) * 100,
    100
  );

  const stepChartData = useMemo(
    () => [displayedSteps],
    [displayedSteps]
  );

  const calorieChartData = useMemo(
    () => [displayedCalories],
    [displayedCalories]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Activity</Text>

          <TouchableOpacity
            style={styles.calBtn}
            accessibilityLabel="Open calendar"
          >
            <Icon
              name="calendar-month-outline"
              size={22}
              color={C.ink}
            />
          </TouchableOpacity>
        </View>

        {/* Range Tabs */}
        <View style={styles.tabs}>
          {RANGES.map((r) => {
            const active = r === range;

            return (
              <TouchableOpacity
                key={r}
                onPress={() => setRange(r)}
                style={[
                  styles.tab,
                  active && styles.tabActive,
                ]}
                accessibilityRole="tab"
                accessibilityState={{
                  selected: active,
                }}
              >
                <Text
                  style={[
                    styles.tabText,
                    active && styles.tabTextActive,
                  ]}
                >
                  {r}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Date Switcher */}
        <View style={styles.dateRow}>
          <TouchableOpacity
            onPress={() => setOffset((o) => o - 1)}
            hitSlop={12}
          >
            <Icon
              name="chevron-left"
              size={24}
              color={C.ink}
            />
          </TouchableOpacity>

          <Text style={styles.dateText}>
            {dateLabel}
          </Text>

          <TouchableOpacity
            onPress={() =>
              setOffset((o) => Math.min(0, o + 1))
            }
            disabled={offset === 0}
            hitSlop={12}
          >
            <Icon
              name="chevron-right"
              size={24}
              color={
                offset === 0
                  ? C.muted + '88'
                  : C.ink
              }
            />
          </TouchableOpacity>
        </View>

        {/* Heart Rate */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: C.heart.bg,
              borderColor: C.heart.border,
            },
          ]}
        >
          <View style={styles.cardHead}>
            <IconBadge
              name="heart-pulse"
              tint={C.heart.main}
            />

            <Text style={styles.cardTitle}>
              Heart Rate
            </Text>

            <Icon
              name="information-outline"
              size={16}
              color={C.muted}
              style={styles.infoIcon}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.leftCol}>
              <Text style={styles.big}>
                {heartRate}{' '}
                <Text style={styles.bigUnit}>bpm</Text>
              </Text>

              <Text style={styles.sub}>
                {heartRate > 0
                  ? 'Latest reading'
                  : 'Not measured'}
              </Text>
            </View>

            <View style={styles.flex1}>
              <View style={styles.row}>
                <View style={styles.flex1}>
                  <LineChart
                    data={HEART}
                    color={C.heart.main}
                    height={64}
                  />
                </View>
              </View>

              <AxisLabels
                labels={[
                  '12 AM',
                  '6 AM',
                  '12 PM',
                  '6 PM',
                  '12 AM',
                ]}
              />
            </View>
          </View>
        </View>

        {/* Steps */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: C.steps.bg,
              borderColor: C.steps.border,
            },
          ]}
        >
          <View style={styles.cardHead}>
            <IconBadge
              name="shoe-print"
              tint={C.steps.main}
            />

            <Text style={styles.cardTitle}>
              Steps
            </Text>
          </View>

          <View style={styles.row}>
            <View style={styles.leftCol}>
              <Text style={styles.big}>
                {isToday
                  ? displayedSteps.toLocaleString()
                  : '--'}
              </Text>

              <Text style={styles.sub}>
                {isToday
                  ? 'of 10,000'
                  : 'Historical data unavailable'}
              </Text>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${stepProgress}%`,
                    },
                  ]}
                />
              </View>
            </View>

            <View
              style={[
                styles.stepsChart,
                {
                  borderLeftColor:
                    C.steps.main + '33',
                },
              ]}
            >
              <BarChart
                data={stepChartData}
                color={C.steps.main}
                height={56}
                gap={3}
              />

              <AxisLabels labels={['Today']} />
            </View>
          </View>
        </View>

        {/* Calories and Sleep */}
        <View style={styles.duo}>

          {/* Calories */}
          <View
            style={[
              styles.card,
              styles.duoCard,
              {
                backgroundColor: C.cal.bg,
                borderColor: C.cal.border,
              },
            ]}
          >
            <View style={styles.cardHead}>
              <IconBadge
                name="fire"
                tint={C.cal.main}
              />

              <Text style={styles.cardTitle}>
                Calories
              </Text>
            </View>

            <Text style={styles.big}>
              {isToday
                ? displayedCalories.toLocaleString()
                : '--'}{' '}
              <Text style={styles.bigUnit}>kcal</Text>
            </Text>

            <View style={styles.calChart}>
              <LineChart
                data={calorieChartData}
                color={C.cal.main}
                height={34}
              />
            </View>

            <Text style={styles.sub}>
              Estimated from steps
            </Text>
          </View>

          {/* Sleep */}
          <View
            style={[
              styles.card,
              styles.duoCard,
              {
                backgroundColor: C.sleep.bg,
                borderColor: C.sleep.border,
              },
            ]}
          >
            <View style={styles.cardHead}>
              <IconBadge
                name="moon-waning-crescent"
                tint={C.sleep.main}
              />

              <Text style={styles.cardTitle}>
                Sleep
              </Text>
            </View>

            <Text style={styles.big}>
              {sleepDuration}
            </Text>

            <Text style={styles.sub}>
              {isSleeping
                ? 'Sleep in progress'
                : `Bedtime: ${bedTime}`}
            </Text>

            <View style={styles.sleepChart}>
              <BarChart
                data={SLEEP}
                color={C.sleep.main}
                height={30}
                gap={2}
                fade
              />
            </View>
          </View>
        </View>

        {/* Recent Activity - Empty */}
        <View style={styles.recentHead}>
          <Text style={styles.recentTitle}>
            Recent Activity
          </Text>
        </View>

        <View
          style={[
            styles.card,
            {
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 25,
            },
          ]}
        >
          <Icon
            name="history"
            size={35}
            color={C.muted}
          />

          <Text
            style={[
              styles.cardTitle,
              { marginTop: 10 },
            ]}
          >
            No Recent Activity
          </Text>

          <Text
            style={[
              styles.sub,
              {
                textAlign: 'center',
                marginTop: 5,
              },
            ]}
          >
            Your recent activities will appear here.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
