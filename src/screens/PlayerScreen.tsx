import { Ionicons } from '@expo/vector-icons';
import { AnimeColors } from '@src/constants/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

export default function PlayerScreen() {
    const { id, ep, title, total } = useLocalSearchParams<{
        id: string;
        ep?: string;
        title?: string;
        total?: string;
    }>();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const currentEp = parseInt(ep || '1', 10);
    const totalEps = parseInt(total || '0', 10);

    // Build a YouTube embed URL from the trailer (or just a placeholder)
    const embedUrl = `https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=1&modestbranding=1&rel=0`;

    const goBack = useCallback(() => router.back(), [router]);

    const goToEpisode = (epNum: number) => {
        router.replace({
            pathname: `/player/${id}` as any,
            params: { ep: epNum.toString(), title, total },
        });
    };

    return (
        <View style={styles.screen}>
            <StatusBar hidden />
            {/* Video area */}
            <View style={styles.videoContainer}>
                {loading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator color={AnimeColors.accent} size="large" />
                    </View>
                )}
                <WebView
                    source={{ uri: embedUrl }}
                    style={styles.video}
                    allowsFullscreenVideo
                    allowsInlineMediaPlayback
                    mediaPlaybackRequiresUserAction={false}
                    onLoadEnd={() => setLoading(false)}
                    javaScriptEnabled
                />
            </View>

            {/* HUD */}
            <View style={styles.hud}>
                <Pressable onPress={goBack} style={styles.hudButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>

                <View style={styles.hudInfo}>
                    <Text style={styles.hudTitle} numberOfLines={1}>
                        {title || 'Now Playing'}
                    </Text>
                    {ep && (
                        <Text style={styles.hudEpisode}>
                            Episode {currentEp}{totalEps > 0 ? ` / ${totalEps}` : ''}
                        </Text>
                    )}
                </View>
            </View>

            {/* Episode Navigation */}
            {totalEps > 0 && (
                <View style={styles.epNav}>
                    <Pressable
                        onPress={() => goToEpisode(currentEp - 1)}
                        disabled={currentEp <= 1}
                        style={[styles.epButton, currentEp <= 1 && styles.epButtonDisabled]}>
                        <Ionicons name="play-skip-back" size={20} color="#fff" />
                        <Text style={styles.epButtonText}>Previous</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => goToEpisode(currentEp + 1)}
                        disabled={currentEp >= totalEps}
                        style={[styles.epButton, currentEp >= totalEps && styles.epButtonDisabled]}>
                        <Text style={styles.epButtonText}>Next</Text>
                        <Ionicons name="play-skip-forward" size={20} color="#fff" />
                    </Pressable>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#000',
    },
    videoContainer: {
        width,
        height: height * 0.4,
        backgroundColor: '#000',
    },
    video: {
        flex: 1,
        backgroundColor: '#000',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    hud: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
        backgroundColor: AnimeColors.surface,
    },
    hudButton: {
        padding: 8,
    },
    hudInfo: {
        flex: 1,
        gap: 2,
    },
    hudTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    hudEpisode: {
        color: AnimeColors.textSecondary,
        fontSize: 13,
    },
    epNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: AnimeColors.surface,
        borderTopWidth: 1,
        borderTopColor: AnimeColors.border,
    },
    epButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: AnimeColors.accent,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    epButtonDisabled: {
        opacity: 0.3,
    },
    epButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});
