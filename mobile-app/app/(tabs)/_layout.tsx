import { Tabs } from 'expo-router';
import React, { useState, useEffect } from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'admin' | null>(null);

  // This would normally come from your auth context
  // For demo purposes, we'll show tabs after login
  useEffect(() => {
    // Listen for login events or check auth state
    // setIsLoggedIn(true);
    // setUserRole('student');
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: isLoggedIn ? {
          backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
          borderTopColor: '#0EA5E9',
          borderTopWidth: 2,
        } : {
          display: 'none', // Hide tab bar on login screen
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Login',
          tabBarButton: () => null, // Hide login tab button
        }}
      />
      <Tabs.Screen
        name="student-dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" color={color} />,
          href: isLoggedIn && userRole === 'student' ? '/student-dashboard' : null,
        }}
      />
      <Tabs.Screen
        name="admin-dashboard"
        options={{
          title: 'Admin',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gear" color={color} />,
          href: isLoggedIn && userRole === 'admin' ? '/admin-dashboard' : null,
        }}
      />
    </Tabs>
  );
}

