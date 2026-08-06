import * as favoriteStore from '@src/store/favoriteStore';
import { Anime } from '@src/types/entities';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface FavoritesContextType {
    favorites: Anime[];
    loading: boolean;
    isFavorite: (id: number) => boolean;
    toggleFavorite: (anime: Anime) => Promise<void>;
    refreshFavorites: () => Promise<void>;
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshFavorites = useCallback(async () => {
        try {
            const data = await favoriteStore.loadFavorites();
            setFavorites(data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshFavorites();
    }, [refreshFavorites]);

    const isFavorite = useCallback((id: number) => {
        return favorites.some(fav => fav.id === id);
    }, [favorites]);

    const toggleFavorite = useCallback(async (anime: Anime) => {
        const currentlyFavorite = favorites.some(fav => fav.id === anime.id);
        let updated: Anime[];
        
        if (currentlyFavorite) {
            updated = await favoriteStore.removeFavorite(anime.id);
        } else {
            updated = await favoriteStore.addFavorite(anime);
        }
        
        setFavorites(updated);
    }, [favorites]);

    return (
        <FavoritesContext.Provider value={{ favorites, loading, isFavorite, toggleFavorite, refreshFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export function useFavoritesContext() {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavoritesContext must be used within a FavoritesProvider');
    }
    return context;
}
