import { FavoritesProvider } from '@src/context/FavoritesContext';
import { AnimeColors } from '@src/constants/theme';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <FavoritesProvider>
                <Stack
                    screenOptions={{
                        headerStyle: { backgroundColor: AnimeColors.background },
                        headerTintColor: AnimeColors.textPrimary,
                        headerTitleStyle: { fontWeight: '700' },
                        contentStyle: { backgroundColor: AnimeColors.background },
                    }}>
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen
                        name="anime/[id]"
                        options={{
                            headerTransparent: true,
                            headerTitle: '',
                            headerBackTitle: 'Back',
                        }}
                    />
                    <Stack.Screen
                        name="player/[id]"
                        options={{
                            headerShown: false,
                            presentation: 'fullScreenModal',
                        }}
                    />
                </Stack>
                <StatusBar style="light" />
            </FavoritesProvider>
        </SafeAreaProvider>
    );
}
