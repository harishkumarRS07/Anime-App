/**
 * src/store/favoriteStore.ts
 * Standalone AsyncStorage store for favorites.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Anime } from '@src/types/entities';

const STORAGE_KEY = '@anikings_favorites';

/** Load all favorites from storage */
export async function loadFavorites(): Promise<Anime[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Anime[]) : [];
}

/** Persist the favorites list to storage */
export async function saveFavorites(favorites: Anime[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

/** Add an anime to favorites (no-op if already present) */
export async function addFavorite(anime: Anime): Promise<Anime[]> {
    const current = await loadFavorites();
    if (current.some((f) => f.id === anime.id)) return current;
    const updated = [...current, anime];
    await saveFavorites(updated);
    return updated;
}

/** Remove an anime from favorites by id */
export async function removeFavorite(id: number): Promise<Anime[]> {
    const current = await loadFavorites();
    const updated = current.filter((f) => f.id !== id);
    await saveFavorites(updated);
    return updated;
}

/** Check if an anime is in favorites */
export async function checkIsFavorite(id: number): Promise<boolean> {
    const current = await loadFavorites();
    return current.some((f) => f.id === id);
}
