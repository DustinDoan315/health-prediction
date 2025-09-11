import {
    BorderRadius,
    Colors,
    Elevation,
    Spacing,
    Typography
} from '@/constants';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import {
    Dimensions,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';


const { width } = Dimensions.get('window');

interface ChartData {
  labels: string[];
  data: number[];
  color: string;
}

interface DashboardData {
  steps: number;
  heartRate: number;
  sleep: number;
  calories: number;
  waterIntake: number;
}

const generateMockData = (): DashboardData => ({
  steps: Math.floor(Math.random() * 5000) + 5000,
  heartRate: Math.floor(Math.random() * 20) + 70,
  sleep: Math.floor(Math.random() * 2) + 7,
  calories: Math.floor(Math.random() * 500) + 1500,
  waterIntake: Math.floor(Math.random() * 4) + 6,
});

const generateChartData = (type: 'steps' | 'heartRate' | 'sleep' | 'calories'): ChartData => {
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  switch (type) {
    case 'steps':
      return {
        labels,
        data: labels.map(() => Math.floor(Math.random() * 3000) + 5000),
        color: '#3B82F6',
      };
    case 'heartRate':
      return {
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 20) + 70),
        color: '#EF4444',
      };
    case 'sleep':
      return {
        labels,
        data: labels.map(() => Math.floor(Math.random() * 2) + 6),
        color: '#8B5CF6',
      };
    case 'calories':
      return {
        labels,
        data: labels.map(() => Math.floor(Math.random() * 500) + 1200),
        color: '#F59E0B',
      };
    default:
      return { labels: [], data: [], color: '#6B7280' };
  }
};

const SimpleChart = ({ data, color, height = 100 }: { data: ChartData; color: string; height?: number }) => {
  const maxValue = Math.max(...data.data);
  const minValue = Math.min(...data.data);
  const range = maxValue - minValue || 1;

  return (
    <View style={[styles.chartContainer, { height }]}>
      <View style={styles.chart}>
        {data.data.map((value, index) => {
          const barHeight = ((value - minValue) / range) * (height - 20);
          const barWidth = (width - 80) / data.data.length - 4;
          
          return (
            <View
              key={index}
              style={[
                styles.bar,
                {
                  height: barHeight,
                  width: barWidth,
                  backgroundColor: color,
                  marginLeft: index === 0 ? 0 : 4,
                },
              ]}
            />
          );
        })}
      </View>
      <View style={styles.chartLabels}>
        {data.labels.slice(0, 7).map((label, index) => (
          <Text key={index} style={styles.chartLabel}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
};

const MetricCard = ({ 
  title, 
  value, 
  unit, 
  icon, 
  color, 
  onPress 
}: { 
  title: string; 
  value: number; 
  unit: string; 
  icon: string; 
  color: string; 
  onPress?: () => void;
}) => (
  <TouchableOpacity 
    style={[styles.metricCard, { backgroundColor: color }]} 
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.metricHeader}>
      <Text style={styles.metricIcon}>{icon}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
    </View>
    <Text style={styles.metricValue}>{value.toLocaleString()}</Text>
    <Text style={styles.metricUnit}>{unit}</Text>
  </TouchableOpacity>
);

export default function DashboardScreen() {
  const [dashboardData, setDashboardData] = useState<DashboardData>(generateMockData());
  const [stepsChartData, setStepsChartData] = useState<ChartData>(generateChartData('steps'));
  const [heartRateChartData, setHeartRateChartData] = useState<ChartData>(generateChartData('heartRate'));
  const [sleepChartData, setSleepChartData] = useState<ChartData>(generateChartData('sleep'));
  const [caloriesChartData, setCaloriesChartData] = useState<ChartData>(generateChartData('calories'));
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const refreshData = useCallback(() => {
    setIsRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setTimeout(() => {
      setDashboardData(generateMockData());
      setStepsChartData(generateChartData('steps'));
      setHeartRateChartData(generateChartData('heartRate'));
      setSleepChartData(generateChartData('sleep'));
      setCaloriesChartData(generateChartData('calories'));
      setIsRefreshing(false);
    }, 1000);
  }, []);

  const handleMetricPress = useCallback((metric: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/health-logbook');
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <LinearGradient
      colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refreshData}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Health Dashboard
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Your health metrics at a glance
            </Text>
          </View>

          <View style={styles.metricsGrid}>
            <MetricCard
              title="Steps"
              value={dashboardData.steps}
              unit="steps"
              icon="👟"
              color="#3B82F6"
              onPress={() => handleMetricPress('steps')}
            />
            <MetricCard
              title="Heart Rate"
              value={dashboardData.heartRate}
              unit="bpm"
              icon="❤️"
              color="#EF4444"
              onPress={() => handleMetricPress('heartRate')}
            />
            <MetricCard
              title="Sleep"
              value={dashboardData.sleep}
              unit="hours"
              icon="😴"
              color="#8B5CF6"
              onPress={() => handleMetricPress('sleep')}
            />
            <MetricCard
              title="Calories"
              value={dashboardData.calories}
              unit="kcal"
              icon="🔥"
              color="#F59E0B"
              onPress={() => handleMetricPress('calories')}
            />
          </View>

          <View style={styles.chartsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Weekly Trends
            </Text>

            <View style={[styles.chartCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.chartTitle, { color: colors.text }]}>
                Daily Steps
              </Text>
              <SimpleChart data={stepsChartData} color="#3B82F6" />
            </View>

            <View style={[styles.chartCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.chartTitle, { color: colors.text }]}>
                Heart Rate (24h)
              </Text>
              <SimpleChart data={heartRateChartData} color="#EF4444" height={80} />
            </View>

            <View style={[styles.chartCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.chartTitle, { color: colors.text }]}>
                Sleep Hours
              </Text>
              <SimpleChart data={sleepChartData} color="#8B5CF6" />
            </View>

            <View style={[styles.chartCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.chartTitle, { color: colors.text }]}>
                Daily Calories
              </Text>
              <SimpleChart data={caloriesChartData} color="#F59E0B" />
            </View>
          </View>

          <View style={styles.quickActions}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Quick Actions
            </Text>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                onPress={() => router.push('/health-logbook')}
              >
                <Text style={styles.actionButtonIcon}>📝</Text>
                <Text style={[styles.actionButtonText, { color: colors.surface }]}>
                  Log Data
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: colors.secondary }]}
                onPress={() => router.push('/health-goals-onboarding')}
              >
                <Text style={styles.actionButtonIcon}>🎯</Text>
                <Text style={[styles.actionButtonText, { color: colors.surface }]}>
                  Set Goals
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: colors.accent }]}
                onPress={() => router.push('/(tabs)/chat')}
              >
                <Text style={styles.actionButtonIcon}>💬</Text>
                <Text style={[styles.actionButtonText, { color: colors.surface }]}>
                  AI Chat
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  headerTitle: {
    ...Typography.h1,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  headerSubtitle: {
    ...Typography.body,
    textAlign: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Elevation.card,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  metricIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  metricTitle: {
    ...Typography.body,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  metricValue: {
    ...Typography.h2,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: Spacing.xs,
  },
  metricUnit: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  chartsSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    fontWeight: '600',
    marginBottom: Spacing.lg,
  },
  chartCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    ...Elevation.card,
  },
  chartTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  chartContainer: {
    marginBottom: Spacing.md,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '80%',
    paddingHorizontal: Spacing.sm,
  },
  bar: {
    borderRadius: 2,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
  },
  chartLabel: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    fontSize: 10,
  },
  quickActions: {
    marginBottom: Spacing.xl,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Elevation.card,
  },
  actionButtonIcon: {
    fontSize: 24,
    marginBottom: Spacing.sm,
  },
  actionButtonText: {
    ...Typography.body,
    fontWeight: '600',
  },
});
