import { AnimeColors } from '@src/constants/theme';
import React from 'react';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';

interface TypographyProps extends TextProps {
    color?: string;
    style?: TextStyle;
}

export function Heading({ color, style, ...props }: TypographyProps) {
    return (
        <Text
            style={[styles.heading, color ? { color } : undefined, style]}
            {...props}
        />
    );
}

export function Subheading({ color, style, ...props }: TypographyProps) {
    return (
        <Text
            style={[styles.subheading, color ? { color } : undefined, style]}
            {...props}
        />
    );
}

export function Body({ color, style, ...props }: TypographyProps) {
    return (
        <Text
            style={[styles.body, color ? { color } : undefined, style]}
            {...props}
        />
    );
}

export function Small({ color, style, ...props }: TypographyProps) {
    return (
        <Text
            style={[styles.small, color ? { color } : undefined, style]}
            {...props}
        />
    );
}

const styles = StyleSheet.create({
    heading: {
        color: AnimeColors.textPrimary,
        fontSize: 22,
        fontWeight: '700',
        lineHeight: 28,
    },
    subheading: {
        color: AnimeColors.textPrimary,
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 22,
    },
    body: {
        color: AnimeColors.textSecondary,
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
    },
    small: {
        color: AnimeColors.textMuted,
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 16,
    },
});
