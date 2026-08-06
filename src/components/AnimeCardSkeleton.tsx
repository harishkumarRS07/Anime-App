import { AnimeColors } from '@src/constants/theme';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.45;

export function AnimeCardSkeleton() {
    const shimmer = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmer, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmer, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]),
        ).start();
    }, [shimmer]);

    const opacity = shimmer.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <Animated.View style={[styles.card, { opacity }]}>
            <View style={styles.imagePlaceholder} />
            <View style={styles.textArea}>
                <View style={styles.titleLine} />
                <View style={styles.subLine} />
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 12,
        backgroundColor: AnimeColors.surface,
        overflow: 'hidden',
    },
    imagePlaceholder: {
        flex: 1,
        backgroundColor: AnimeColors.surfaceLight,
    },
    textArea: {
        padding: 8,
        gap: 4,
    },
    titleLine: {
        height: 12,
        width: '80%',
        backgroundColor: AnimeColors.surfaceLight,
        borderRadius: 4,
    },
    subLine: {
        height: 10,
        width: '50%',
        backgroundColor: AnimeColors.surfaceLight,
        borderRadius: 4,
    },
});
