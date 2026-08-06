import { AnimeCard, CARD_WIDTH } from '@src/components/AnimeCard';
import { AnimeCardSkeleton } from '@src/components/AnimeCardSkeleton';
import { SearchBar } from '@src/components/SearchBar';
import { SectionHeader } from '@src/components/SectionHeader';
import { Body, Heading } from '@src/components/common/Typography';
import { AnimeColors } from '@src/constants/theme';
import { useAnime } from '@src/hooks/useAnime';
import { useDebounce } from '@src/hooks/useDebounce';
import { AnimeService } from '@src/services/AnimeService';
import { Anime } from '@src/types/entities';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SearchScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 400);

    const { data: results, loading } = useAnime<Anime[]>(
        (signal) => AnimeService.searchAnime(debouncedQuery, signal),
        debouncedQuery.length >= 2,
        [debouncedQuery],
    );

    const { data: trending } = useAnime<Anime[]>(
        (signal) => AnimeService.getTrending(signal),
        true,
        [],
    );

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

    const showTrending = !query && trending && trending.length > 0;
    const showResults = debouncedQuery.length >= 2;
    const noResults = showResults && !loading && (!results || results.length === 0);

    return (
        <View style={[styles.screen, { paddingTop: insets.top }]}>
            <SearchBar value={query} onChangeText={setQuery} />

            {loading && showResults && (
                <View style={styles.skeletonGrid}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <View key={i} style={styles.gridItem}>
                            <AnimeCardSkeleton />
                        </View>
                    ))}
                </View>
            )}

            {noResults && (
                <View style={styles.emptyState}>
                    <Ionicons name="search-outline" size={56} color={AnimeColors.textMuted} />
                    <Heading style={{ fontSize: 18 }}>No results found</Heading>
                    <Body>Try a different search term</Body>
                </View>
            )}

            {showResults && !loading && results && results.length > 0 && (
                <FlatList
                    data={results}
                    numColumns={2}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
                    columnWrapperStyle={{ gap: 16, marginBottom: 16 }}
                    renderItem={renderCard}
                    keyExtractor={(item) => `search-${item.id}`}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {showTrending && (
                <>
                    <SectionHeader title="Trending Now" subtitle="What's popular" />
                    <FlatList
                        data={trending}
                        numColumns={2}
                        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
                        columnWrapperStyle={{ gap: 16, marginBottom: 16 }}
                        renderItem={renderCard}
                        keyExtractor={(item) => `trending-${item.id}`}
                        showsVerticalScrollIndicator={false}
                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: AnimeColors.background,
    },
    skeletonGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        gap: 16,
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
