import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants';
import { HapticTab } from '@/components';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Platform } from 'react-native';
import { router, Tabs } from 'expo-router';
import { UIText } from '@/content';
import { useAppSelector } from '@/hooks';
import { useEffect } from 'react';


export default function TabLayout() {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const { isDark } = useAppSelector((state) => state.theme);

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
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 90,
            paddingBottom: 30,
            elevation: 0,
            shadowOpacity: 0.1,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: -2 },
          },
          default: {
            height: 65,
            paddingBottom: 10,
            elevation: 8,
          },
        }),
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 2,
        },
      }}>
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
