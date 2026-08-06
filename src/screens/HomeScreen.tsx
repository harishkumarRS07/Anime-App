import { AnimeCard, CARD_WIDTH } from '@src/components/AnimeCard';
import { AnimeCardSkeleton } from '@src/components/AnimeCardSkeleton';
import { SectionHeader } from '@src/components/SectionHeader';
import { AnimeColors } from '@src/constants/theme';
import { useAnime } from '@src/hooks/useAnime';
import { AnimeService } from '@src/services/AnimeService';
import { Anime } from '@src/types/entities';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import {
    Dimensions,
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface HomeFeed {
    airing: Anime[];
    popular: Anime[];
    upcoming: Anime[];
}

export default function HomeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const { data: feed, loading, refetch } = useAnime<HomeFeed>(
        (signal) => AnimeService.getHomeFeed(signal),
        true,
        [],
    );

    const navigateToAnime = useCallback((id: number) => {
        router.push(`/anime/${id}` as any);
    }, [router]);

    const renderHorizontalCard = useCallback(({ item }: { item: Anime }) => (
        <View style={{ marginRight: 12 }}>
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

    const renderGridCard = useCallback(({ item }: { item: Anime }) => (
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

    const renderSkeletons = () => (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {Array.from({ length: 4 }).map((_, i) => (
                <View key={i} style={{ marginRight: 12 }}>
                    <AnimeCardSkeleton />
                </View>
            ))}
        </ScrollView>
    );

    return (
        <ScrollView
            style={[styles.screen, { paddingTop: insets.top }]}
            refreshControl={
                <RefreshControl
                    refreshing={false}
                    onRefresh={refetch}
                    tintColor={AnimeColors.accent}
                    colors={[AnimeColors.accent]}
                />
            }
            showsVerticalScrollIndicator={false}>

            {/* Airing Now */}
            <SectionHeader title="Airing Now" subtitle="Currently on air" />
            {loading ? renderSkeletons() : (
                <FlatList
                    data={feed?.airing || []}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                    renderItem={renderHorizontalCard}
                    keyExtractor={(item, index) => `airing-${item.id}-${index}`}
                />
            )}

            {/* Upcoming */}
            <SectionHeader title="Upcoming" subtitle="Coming soon" />
            {loading ? renderSkeletons() : (
                <FlatList
                    data={feed?.upcoming || []}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                    renderItem={renderHorizontalCard}
                    keyExtractor={(item, index) => `upcoming-${item.id}-${index}`}
                />
            )}

            {/* Popular — Grid */}
            <SectionHeader title="Most Popular" subtitle="Fan favorites" />
            {loading ? (
                <View style={styles.gridContainer}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <View key={i} style={styles.gridItem}>
                            <AnimeCardSkeleton />
                        </View>
                    ))}
                </View>
            ) : (
                <FlatList
                    data={feed?.popular || []}
                    numColumns={2}
                    scrollEnabled={false}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                    columnWrapperStyle={{ gap: 16, marginBottom: 16 }}
                    renderItem={renderGridCard}
                    keyExtractor={(item, index) => `popular-${item.id}-${index}`}
                />
            )}

            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: AnimeColors.background,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        gap: 16,
    },
    gridItem: {
        width: CARD_WIDTH,
    },
});
