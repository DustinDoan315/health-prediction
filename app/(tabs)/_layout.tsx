import { HapticTab } from '@/components/shared';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants';
import { UIText } from '@/content';
import { useAppSelector } from '@/hooks';
import { router, Tabs } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';


export default function TabLayout() {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const { isDark } = useAppSelector(state => state.theme);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/welcome');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[isDark ? 'dark' : 'light'].primary,
        tabBarInactiveTintColor:
          Colors[isDark ? 'dark' : 'light'].textSecondary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            height: 85,
            paddingBottom: 25,
            elevation: 0,
            shadowOpacity: isDark ? 0.2 : 0.08,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: -2 },
            backgroundColor: Colors[isDark ? 'dark' : 'light'].surface,
            borderTopWidth: 1,
            borderTopColor: isDark ? '#374151' : '#E5E7EB',
          },
          default: {
            height: 65,
            paddingBottom: 10,
            elevation: 8,
            backgroundColor: Colors[isDark ? 'dark' : 'light'].surface,
            borderTopWidth: 1,
            borderTopColor: isDark ? '#374151' : '#E5E7EB',
          },
        }),
        tabBarIconStyle: {
          marginTop: 45,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: UIText.navigation.home,
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 30 : 26}
              name="house.fill"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: UIText.navigation.chat,
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 30 : 26}
              name="message.fill"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="medical-history"
        options={{
          title: UIText.navigation.history,
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 30 : 26}
              name="list.bullet"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: UIText.navigation.settings,
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 30 : 26}
              name="gearshape.fill"
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
