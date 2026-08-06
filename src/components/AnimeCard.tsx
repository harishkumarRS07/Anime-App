import { Ionicons } from '@expo/vector-icons';
import { AnimeColors } from '@src/constants/theme';
import React, { useRef } from 'react';
import {
    Animated,
    Dimensions,
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.45;

interface AnimeCardProps {
    id: number;
    title: string;
    imageUrl: string;
    score?: number | null;
    episodes?: number | null;
    onPress: () => void;
}

export function AnimeCard({ id, title, imageUrl, score, episodes, onPress }: AnimeCardProps) {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () =>
        Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, speed: 50 }).start();
    const handlePressOut = () =>
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }).start();

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            accessibilityLabel={`${title}${score ? `, score ${score}` : ''}`}
            accessibilityRole="button">
            <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
                <ImageBackground
                    source={{ uri: imageUrl || 'https://via.placeholder.com/300x450' }}
                    style={styles.image}
                    imageStyle={styles.imageStyle}
                    resizeMode="cover">
                    <View style={styles.overlay} />
                    {score != null && (
                        <View style={styles.scoreBadge}>
                            <Ionicons name="star" size={10} color={AnimeColors.star} />
                            <Text style={styles.scoreText}>{score.toFixed(1)}</Text>
                        </View>
                    )}
                    <View style={styles.info}>
                        <Text style={styles.title} numberOfLines={2}>{title}</Text>
                        {episodes != null && (
                            <Text style={styles.episodes}>{episodes} eps</Text>
                        )}
                    </View>
                </ImageBackground>
            </Animated.View>
        </Pressable>
    );
}

export { CARD_WIDTH, CARD_HEIGHT };

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: AnimeColors.surface,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    image: { flex: 1, justifyContent: 'space-between' },
    imageStyle: { borderRadius: 12 },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    scoreBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 8,
        paddingHorizontal: 6,
        paddingVertical: 3,
        margin: 6,
        gap: 2,
    },
    scoreText: {
        color: AnimeColors.star,
        fontSize: 11,
        fontWeight: '700',
    },
    info: {
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.75)',
    },
    title: {
        color: AnimeColors.textPrimary,
        fontSize: 12,
        fontWeight: '600',
        lineHeight: 16,
    },
    episodes: {
        color: AnimeColors.textSecondary,
        fontSize: 10,
        marginTop: 2,
    },
});
