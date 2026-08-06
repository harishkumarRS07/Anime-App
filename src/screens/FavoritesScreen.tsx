import { AnimeCard, CARD_WIDTH } from '@src/components/AnimeCard';
import { Body, Heading } from '@src/components/common/Typography';
import { AnimeColors } from '@src/constants/theme';
import { useFavorites } from '@src/hooks/useFavorites';
import { Anime } from '@src/types/entities';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FavoritesScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { favorites, loading, refreshFavorites } = useFavorites();

    const navigateToAnime = useCallback((id: number) => {
        router.push(`/anime/${id}` as any);
    }, [router]);

    const renderCard = useCallback(({ item }: { item: Anime }) => (
        <View style={styles.gridItem}>
            <AnimeCard
                id={item.id}
                title={item.englishTitle || item.title}
                imageUrl={item.images.url}
                score={item.score}
                episodes={item.episodes}
                onPress={() => navigateToAnime(item.id)}
            />
        </View>
    ), [navigateToAnime]);

    if (loading) {
        return (
            <View style={[styles.center, { paddingTop: insets.top }]}>
                <ActivityIndicator color={AnimeColors.accent} size="large" />
            </View>
        );
    }

    return (
        <View style={[styles.screen, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Heading>Favorites</Heading>
                <Body>{favorites.length} title{favorites.length !== 1 ? 's' : ''}</Body>
            </View>

            {favorites.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="heart-outline" size={64} color={AnimeColors.textMuted} />
                    <Heading style={{ fontSize: 18 }}>No favorites yet</Heading>
                    <Body>Tap the heart icon on any anime to save it here</Body>
                </View>
            ) : (
                <FlatList
                    data={favorites}
                    numColumns={2}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
                    columnWrapperStyle={{ gap: 16, marginBottom: 16 }}
                    renderItem={renderCard}
                    keyExtractor={(item) => `fav-${item.id}`}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={refreshFavorites}
                            tintColor={AnimeColors.accent}
                            colors={[AnimeColors.accent]}
                        />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: AnimeColors.background,
    },
    center: {
        flex: 1,
        backgroundColor: AnimeColors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 4,
    },
    gridItem: {
        width: CARD_WIDTH,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        paddingBottom: 100,
    },
});
