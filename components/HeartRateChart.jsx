
import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Path, Line, Circle, Text as SvgText } from 'react-native-svg';

const readings = [
  62, 65, 61, 68, 63, 66, 72, 64, 62, 69,
  65, 70, 60, 64, 75, 68, 73, 66, 80, 72,
  76, 85, 74, 82, 96, 128, 88, 78, 70, 62,
];

export default function HeartRateChart({ period = 'Today' }) {
  const { width } = useWindowDimensions();

  const chartWidth = Math.max(260, width - 76);
  const chartHeight = 165;
  const left = 30;
  const right = chartWidth - 8;
  const top = 10;
  const bottom = 130;
  const min = 20;
  const max = 140;

  const points = readings.map((value, index) => ({
    x: left + (index / (readings.length - 1)) * (right - left),
    y: bottom - ((value - min) / (max - min)) * (bottom - top),
  }));

  const linePath = points
    .map((point, index) =>
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    )
    .join(' ');

  const areaPath =
    `${linePath} L ${right} ${bottom} L ${left} ${bottom} Z`;

  const last = points[points.length - 1];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Heart Rate Overview</Text>

      <Text style={styles.subtitle}>
        {period === 'Today'
          ? 'Your readings throughout the day'
          : `Sample readings · ${period}`}
      </Text>

      <Svg width={chartWidth} height={chartHeight}>
        {[20, 60, 100, 140].map((value) => {
          const y =
            bottom - ((value - min) / (max - min)) * (bottom - top);

          return (
            <React.Fragment key={value}>
              <Line
                x1={left}
                y1={y}
                x2={right}
                y2={y}
                stroke="#E8EDF3"
                strokeWidth={1}
                strokeDasharray="3 4"
              />
              <SvgText
                x={left - 6}
                y={y + 3}
                fontSize="9"
                fill="#8B95A5"
                textAnchor="end"
              >
                {value}
              </SvgText>
            </React.Fragment>
          );
        })}

        <Path d={areaPath} fill="#FCE4EA" />

        <Path
          d={linePath}
          stroke="#F43F5E"
          strokeWidth={2.2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <Circle
          cx={last.x}
          cy={last.y}
          r={4}
          fill="#F43F5E"
          stroke="#FFFFFF"
          strokeWidth={2}
        />
      </Svg>

      <View style={styles.labels}>
        {['12 AM', '6 AM', '12 PM', '6 PM', '12 AM'].map(
          (label, index) => (
            <Text key={`${label}-${index}`} style={styles.axisLabel}>
              {label}
            </Text>
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    paddingBottom: 12,
  },
  heading: {
    fontSize: 17,
    fontWeight: '700',
    color: '#24364B',
  },
  subtitle: {
    fontSize: 12,
    color: '#8993A2',
    marginTop: 5,
    marginBottom: 10,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 30,
    marginRight: 8,
    marginTop: -4,
  },
  axisLabel: {
    color: '#8B95A5',
    fontSize: 9,
  },
});
