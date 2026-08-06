import { AnimeColors } from '@src/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type BadgeVariant = 'genre' | 'airing' | 'finished' | 'upcoming' | 'default';

interface BadgeProps {
    label: string;
    variant?: BadgeVariant;
}

const variantColors: Record<BadgeVariant, { bg: string; text: string }> = {
    genre: { bg: '#2A1F40', text: '#C084FC' },
    airing: { bg: '#1A3328', text: AnimeColors.success },
    finished: { bg: '#1F2937', text: '#9CA3AF' },
    upcoming: { bg: '#332B1A', text: AnimeColors.warning },
    default: { bg: AnimeColors.surfaceLight, text: AnimeColors.textSecondary },
};

export function Badge({ label, variant = 'default' }: BadgeProps) {
    const colors = variantColors[variant];
    return (
        <View style={[styles.badge, { backgroundColor: colors.bg }]}>
            <Text style={[styles.text, { color: colors.text }]}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    text: {
        fontSize: 11,
        fontWeight: '600',
    },
});
