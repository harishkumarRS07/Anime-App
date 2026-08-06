import { Ionicons } from '@expo/vector-icons';
import { AnimeColors } from '@src/constants/theme';
import * as Haptics from 'expo-haptics';
import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

interface FavoriteButtonProps {
    isFavorite: boolean;
    onToggle: () => void;
    size?: number;
}

export function FavoriteButton({ isFavorite, onToggle, size = 24 }: FavoriteButtonProps) {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Animated.sequence([
            Animated.spring(scale, { toValue: 1.35, useNativeDriver: true, speed: 80 }),
            Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 80 }),
        ]).start();
        onToggle();
    };

    return (
        <Pressable onPress={handlePress} hitSlop={12} style={styles.container}>
            <Animated.View style={{ transform: [{ scale }] }}>
                <Ionicons
                    name={isFavorite ? 'heart' : 'heart-outline'}
                    size={size}
                    color={isFavorite ? AnimeColors.accent : AnimeColors.textSecondary}
                />
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({ container: { padding: 4 } });
