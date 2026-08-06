import { useFavoritesContext } from '@src/context/FavoritesContext';
import { Anime } from '@src/types/entities';

interface UseFavoritesReturn {
    favorites: Anime[];
    isFavorite: (id: number) => boolean;
    toggleFavorite: (anime: Anime) => Promise<void>;
    loading: boolean;
    refreshFavorites: () => Promise<void>;
}

/**
 * useFavorites Hook
 * Thin wrapper around the global FavoritesContext.
 */
export function useFavorites(): UseFavoritesReturn {
    const {
        favorites,
        isFavorite,
        toggleFavorite,
        loading,
        refreshFavorites
    } = useFavoritesContext();

    return {
        favorites,
        isFavorite,
        toggleFavorite,
        loading,
        refreshFavorites
    };
}
