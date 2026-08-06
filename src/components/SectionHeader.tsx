import { AnimeColors } from '@src/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.accent} />
            <View>
                <Text style={styles.title}>{title}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 10,
    },
    accent: {
        width: 4,
        height: 24,
        backgroundColor: AnimeColors.accent,
        borderRadius: 2,
    },
    title: {
        color: AnimeColors.textPrimary,
        fontSize: 18,
        fontWeight: '700',
    },
    subtitle: {
        color: AnimeColors.textSecondary,
        fontSize: 12,
        marginTop: 2,
    },
});
