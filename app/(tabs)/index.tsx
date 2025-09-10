import {
    ActionTiles,
    HomeHeader,
    HomeScreenSkeleton,
    MetricsGrid,
    MoodCard,
    PrimaryCTA
    } from '@/components/screens/home';
import { Colors } from '@/constants';
import { useHomeScreen } from '@/hooks';
import {
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';


export default function HomeScreen() {
  const {
    userName,
    authLoading,
    healthLoading,
    stats,
    isDark,
    mood,
    handleMoodSelect,
    handleToggleTheme,
    onRefresh,
  } = useHomeScreen();

  if (authLoading) {
    return <HomeScreenSkeleton />;
  }

  const colors = Colors[isDark ? 'dark' : 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={healthLoading}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <HomeHeader 
          userName={userName}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
        />

        <MoodCard 
          selectedMood={mood}
          onMoodSelect={handleMoodSelect}
          isDark={isDark}
        />

        <ActionTiles isDark={isDark} />

        {stats && (
          <MetricsGrid stats={stats} isDark={isDark} />
        )}

        <PrimaryCTA isDark={isDark} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
});