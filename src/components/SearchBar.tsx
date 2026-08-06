import { Ionicons } from '@expo/vector-icons';
import { AnimeColors } from '@src/constants/theme';
import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, TextInput, View } from 'react-native';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Search anime...' }: SearchBarProps) {
    const [isFocused, setIsFocused] = useState(false);
    const borderAnim = useRef(new Animated.Value(0)).current;

    const handleFocus = () => {
        setIsFocused(true);
        Animated.timing(borderAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const handleBlur = () => {
        setIsFocused(false);
        Animated.timing(borderAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const borderColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [AnimeColors.border, AnimeColors.accent],
    });

    return (
        <Animated.View style={[styles.container, { borderColor }]}>
            <Ionicons
                name="search"
                size={18}
                color={isFocused ? AnimeColors.accent : AnimeColors.textMuted}
            />
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={AnimeColors.textMuted}
                selectionColor={AnimeColors.accent}
                onFocus={handleFocus}
                onBlur={handleBlur}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
            />
            {value.length > 0 && (
                <Ionicons
                    name="close-circle"
                    size={18}
                    color={AnimeColors.textMuted}
                    onPress={() => onChangeText('')}
                />
            )}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: AnimeColors.surface,
        borderRadius: 12,
        borderWidth: 1.5,
        paddingHorizontal: 12,
        marginHorizontal: 16,
        marginVertical: 12,
        height: 46,
        gap: 8,
    },
    input: {
        flex: 1,
        color: AnimeColors.textPrimary,
        fontSize: 15,
        paddingVertical: 0,
    },
});
