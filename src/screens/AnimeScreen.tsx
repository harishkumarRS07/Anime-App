import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@src/components/Badge';
import { Button } from '@src/components/common/Button';
import { Body, Heading, Small } from '@src/components/common/Typography';
import { EpisodeCard } from '@src/components/EpisodeCard';
import { FavoriteButton } from '@src/components/FavoriteButton';
import { SectionHeader } from '@src/components/SectionHeader';
import { AnimeColors } from '@src/constants/theme';
import { useAnime } from '@src/hooks/useAnime';
import { useFavorites } from '@src/hooks/useFavorites';
import { AnimeService } from '@src/services/AnimeService';
import { Anime, Episode } from '@src/types/entities';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');
const HERO_HEIGHT = height * 0.45;

export default function AnimeScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const navigation = useNavigation();

    const { data: anime, loading } =
        useAnime<Anime>(
            (signal) => AnimeService.getAnimeDetail(id, signal),
            !!id,
            [id]
        );

    const { data: episodes, loading: epsLoading } =
        useAnime<Episode[]>(
            (signal) => AnimeService.getEpisodes(id, signal),
            !!id,
            [id]
        );

    const { isFavorite, toggleFavorite } = useFavorites();

    useLayoutEffect(() => {
        if (!anime) return;
        navigation.setOptions({
            headerRight: () => (
                <FavoriteButton isFavorite={isFavorite(anime.id)} onToggle={() => toggleFavorite(anime)} size={26} />
            ),
        });
    }, [anime, isFavorite]);

    if (loading) return <View style={styles.center}><ActivityIndicator color={AnimeColors.accent} size="large" /></View>;
    if (!anime) return (
        <View style={styles.center}>
            <Ionicons name="warning-outline" size={56} color={AnimeColors.error} />
            <Body color={AnimeColors.error}>Anime not found.</Body>
        </View>
    );

    const watchEpisode = (epNumber: number) => {
        router.push({
            pathname: `/player/${id}` as any,
            params: {
                ep: epNumber,
                title: anime.englishTitle || anime.title,
                total: anime.episodes?.toString() || '0'
            }
        });
    };

    const statusVariant = anime.status === 'Currently Airing' ? 'airing' : anime.status === 'Finished Airing' ? 'finished' : 'upcoming';

    return (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={styles.hero}>
                <Image source={{ uri: anime.images.largeUrl }} style={styles.heroImage} resizeMode="cover" />
                <View style={styles.heroGradient} />
                <View style={styles.heroContent}>
                    <Heading style={styles.title}>{anime.englishTitle || anime.title}</Heading>
                    <View style={styles.statsRow}>
                        {anime.score != null && (
                            <View style={styles.stat}>
                                <Ionicons name="star" size={14} color={AnimeColors.star} />
                                <Small color="#eee" style={styles.statText}>{anime.score.toFixed(1)}</Small>
                            </View>
                        )}
                        {anime.episodes != null && (
                            <View style={styles.stat}>
                                <Ionicons name="play-circle" size={14} color="#ccc" />
                                <Small color="#eee" style={styles.statText}>{anime.episodes} Episodes</Small>
                            </View>
                        )}
                        {anime.year && (
                            <View style={styles.stat}>
                                <Ionicons name="calendar-outline" size={14} color="#ccc" />
                                <Small color="#eee" style={styles.statText}>{anime.year}</Small>
                            </View>
                        )}
                    </View>
                </View>
            </View>

            <View style={styles.body}>
                <View style={styles.badgeRow}>
                    <Badge label={anime.status || 'Unknown'} variant={statusVariant} />
                    {anime.genres.slice(0, 3).map((g) => <Badge key={g.id} label={g.name} variant="genre" />)}
                </View>

                {/* Hero Actions */}
                <View style={styles.actionRow}>
                    <Button
                        title="Start Watching"
                        onPress={() => watchEpisode(1)}
                        icon={<Ionicons name="play" size={24} color="#fff" />}
                        style={styles.mainPlayBtn}
                    />
                    <Button
                        title="Trailer"
                        variant="secondary"
                        onPress={() => router.push(`/player/${id}` as any)}
                        icon={<Ionicons name="film-outline" size={20} color={AnimeColors.textPrimary} />}
                        style={styles.trailerBtn}
                    />
                </View>

                {anime.synopsis && <>
                    <Heading style={styles.sectionLabel}>Synopsis</Heading>
                    <Body style={styles.synopsis} numberOfLines={4}>{anime.synopsis}</Body>
                </>}

                <SectionHeader title="Episodes" />
                {epsLoading ? (
                    <ActivityIndicator color={AnimeColors.accent} style={{ marginVertical: 30 }} />
                ) : !episodes?.length ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="layers-outline" size={40} color={AnimeColors.textMuted} />
                        <Body color={AnimeColors.textMuted}>Episode listing arriving soon.</Body>
                    </View>
                ) : (
                    <View style={{ paddingBottom: 20 }}>
                        {episodes.map((ep, idx) => (
                            <EpisodeCard
                                key={ep.id}
                                episodeNumber={ep.id}
                                title={ep.romanjiTitle || ep.title}
                                synopsis={ep.synopsis ?? undefined}
                                isWatched={idx === 0}
                                onPress={() => watchEpisode(ep.id)}
                            />
                        ))}
                    </View>
                )}
                <View style={{ height: 40 }} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: { flex: 1, backgroundColor: AnimeColors.background },
    center: { flex: 1, backgroundColor: AnimeColors.background, alignItems: 'center', justifyContent: 'center', gap: 16 },
    hero: { height: HERO_HEIGHT, position: 'relative' },
    heroImage: { width, height: HERO_HEIGHT, position: 'absolute' },
    heroGradient: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,10,10,0.5)' },
    heroContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, gap: 10 },
    title: { color: '#fff', textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6 },
    statsRow: { flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'center' },
    stat: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    statText: { fontWeight: '700' },
    body: { paddingTop: 20, backgroundColor: AnimeColors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20 },
    badgeRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 8, marginBottom: 20 },
    actionRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 24 },
    mainPlayBtn: { flex: 2 },
    trailerBtn: { flex: 1 },
    sectionLabel: { fontSize: 18, paddingHorizontal: 20, marginBottom: 10 },
    synopsis: { paddingHorizontal: 20, marginBottom: 24 },
    emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, gap: 12 },
});
