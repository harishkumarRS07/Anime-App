import { Ionicons } from '@expo/vector-icons';
import { AnimeColors } from '@src/constants/theme';
import { Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: AnimeColors.tabBarActive,
                tabBarInactiveTintColor: AnimeColors.tabBarInactive,
                tabBarStyle: {
                    backgroundColor: AnimeColors.tabBar,
                    borderTopColor: AnimeColors.border,
                    borderTopWidth: 0.5,
                    height: 60 + insets.bottom,
                    paddingBottom: insets.bottom + 4,
                    paddingTop: 6,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="search" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="favorites"
                options={{
                    title: 'Favorites',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="heart" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
