import { AnimeColors } from '@src/constants/theme';
import React from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    icon?: React.ReactNode;
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
}

const variantStyles: Record<ButtonVariant, { bg: string; text: string; border?: string }> = {
    primary: { bg: AnimeColors.accent, text: '#fff' },
    secondary: { bg: AnimeColors.surfaceLight, text: AnimeColors.textPrimary },
    outline: { bg: 'transparent', text: AnimeColors.accent, border: AnimeColors.accent },
};

export function Button({
    title,
    onPress,
    variant = 'primary',
    icon,
    loading,
    disabled,
    style,
}: ButtonProps) {
    const vs = variantStyles[variant];

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            style={({ pressed }) => [
                styles.button,
                { backgroundColor: vs.bg },
                vs.border ? { borderWidth: 1.5, borderColor: vs.border } : undefined,
                pressed && styles.pressed,
                (disabled || loading) && styles.disabled,
                style,
            ]}>
            {loading ? (
                <ActivityIndicator color={vs.text} size="small" />
            ) : (
                <View style={styles.content}>
                    {icon}
                    <Text style={[styles.text, { color: vs.text }]}>{title}</Text>
                </View>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    text: {
        fontSize: 15,
        fontWeight: '700',
    },
    pressed: { opacity: 0.8 },
    disabled: { opacity: 0.5 },
});
