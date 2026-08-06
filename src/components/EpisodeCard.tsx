import { Ionicons } from '@expo/vector-icons';
import { AnimeColors } from '@src/constants/theme';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface EpisodeCardProps {
    episodeNumber: number;
    title: string;
    synopsis?: string;
    isWatched?: boolean;
    onPress: () => void;
}

export function EpisodeCard({ episodeNumber, title, synopsis, isWatched, onPress }: EpisodeCardProps) {
    return (
        <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
            <View style={[styles.numberBadge, isWatched && styles.watchedBadge]}>
                {isWatched ? (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                ) : (
                    <Text style={styles.numberText}>{episodeNumber}</Text>
                )}
            </View>
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                {synopsis && (
                    <Text style={styles.synopsis} numberOfLines={2}>{synopsis}</Text>
                )}
            </View>
            <Ionicons name="play-circle" size={28} color={AnimeColors.accent} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: AnimeColors.border,
    },
    pressed: { opacity: 0.7 },
    numberBadge: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: AnimeColors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    watchedBadge: {
        backgroundColor: AnimeColors.success,
    },
    numberText: {
        color: AnimeColors.textSecondary,
        fontSize: 13,
        fontWeight: '700',
    },
    info: { flex: 1, gap: 2 },
    title: {
        color: AnimeColors.textPrimary,
        fontSize: 14,
        fontWeight: '600',
    },
    synopsis: {
        color: AnimeColors.textMuted,
        fontSize: 11,
        lineHeight: 15,
    },
});
