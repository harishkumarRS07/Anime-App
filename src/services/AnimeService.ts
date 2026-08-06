/**
 * src/services/AnimeService.ts
 * Centralized service for all anime-related data operations.
 */

import { Anime, Episode } from '@src/types/entities';
import { fetchJikan, JikanEndpoints } from './api';

export class AnimeService {
    /**
     * Map raw Jikan anime data to our internal Anime entity
     */
    private static mapToAnime(data: any): Anime {
        return {
            id: data.mal_id,
            title: data.title,
            englishTitle: data.title_english,
            images: {
                url: data.images?.jpg?.image_url || '',
                largeUrl: data.images?.jpg?.large_image_url || '',
            },
            score: data.score,
            episodes: data.episodes,
            status: data.status,
            synopsis: data.synopsis,
            genres: data.genres?.map((g: any) => ({ id: g.mal_id, name: g.name })) || [],
            year: data.year,
            trailerUrl: data.trailer?.embed_url,
        };
    }

    /**
     * Map raw Jikan episode data to our internal Episode entity
     */
    private static mapToEpisode(data: any): Episode {
        return {
            id: data.mal_id,
            title: data.title || `Episode ${data.mal_id}`,
            romanjiTitle: data.title_romanji,
            synopsis: data.synopsis,
        };
    }

    /**
     * Fetch trending anime (Top Airing)
     */
    static async getTrending(signal?: AbortSignal): Promise<Anime[]> {
        const data = await fetchJikan<any[]>(JikanEndpoints.topAiring(), signal);
        return data.map(this.mapToAnime);
    }

    /**
     * Search for anime by query
     */
    static async searchAnime(query: string, signal?: AbortSignal): Promise<Anime[]> {
        if (!query || query.length < 2) return [];
        const data = await fetchJikan<any[]>(JikanEndpoints.search(query), signal);
        return data.map(this.mapToAnime);
    }

    /**
     * Get detailed information for a specific anime
     */
    static async getAnimeDetail(id: string | number, signal?: AbortSignal): Promise<Anime> {
        const data = await fetchJikan<any>(JikanEndpoints.animeDetail(id), signal);
        return this.mapToAnime(data);
    }

    /**
     * Get episodes for a specific anime
     */
    static async getEpisodes(id: string | number, signal?: AbortSignal): Promise<Episode[]> {
        const data = await fetchJikan<any[]>(JikanEndpoints.animeEpisodes(id), signal);
        return data.map(this.mapToEpisode);
    }

    /**
     * Fetch home feed (Airing, Popular, Upcoming)
     */
    static async getHomeFeed(signal?: AbortSignal): Promise<{
        airing: Anime[];
        popular: Anime[];
        upcoming: Anime[];
    }> {
        try {
            const data = await fetchJikan<any>(JikanEndpoints.homeFeed(), signal);
            return {
                airing: data.airing?.map((a: any) => this.mapToAnime(a)) || [],
                popular: data.popular?.map((a: any) => this.mapToAnime(a)) || [],
                upcoming: data.upcoming?.map((a: any) => this.mapToAnime(a)) || [],
            };
        } catch {
            // Fallback: fetch individually from Jikan
            const [airing, popular, upcoming] = await Promise.all([
                fetchJikan<any[]>(JikanEndpoints.topAiring(), signal),
                fetchJikan<any[]>(JikanEndpoints.topPopular(), signal),
                fetchJikan<any[]>(JikanEndpoints.topUpcoming(), signal),
            ]);
            return {
                airing: airing.map(this.mapToAnime),
                popular: popular.map(this.mapToAnime),
                upcoming: upcoming.map(this.mapToAnime),
            };
        }
    }
}
