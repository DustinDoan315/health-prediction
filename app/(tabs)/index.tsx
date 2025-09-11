import {
  ActionTiles,
  HomeHeader,
  HomeScreenSkeleton,
  MetricsGrid,
  MoodCard,
  UserStatusCard,
} from '@/components/screens/home';
import { Colors } from '@/constants';
import { useHomeScreen } from '@/hooks';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
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
    <View
      style={[styles.container, { backgroundColor: colors.background }]}
    >
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

        <UserStatusCard
          mood={mood}
          isDark={isDark}
          isNewUser={!stats || Object.keys(stats).length === 0}
          userStats={stats}
        />

        <ActionTiles
          isDark={isDark}
          mood={mood}
          isNewUser={!stats || Object.keys(stats).length === 0}
        />

        {stats && <MetricsGrid stats={stats} isDark={isDark} />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
  scrollView: {
    flex: 1,
    paddingVertical: 45,
  },
});
