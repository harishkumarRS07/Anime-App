/**
 * Core Domain Entities
 * Decoupled from external API schema.
 */

export interface Genre {
  id: number;
  name: string;
}

export interface AnimeImages {
  url: string;
  largeUrl: string;
}

export interface Anime {
  id: number;
  title: string;
  englishTitle?: string;
  images: AnimeImages;
  score?: number | null;
  episodes?: number | null;
  status?: string;
  synopsis?: string;
  genres: Genre[];
  year?: number;
  trailerUrl?: string;
}

export interface Episode {
  id: number;
  title: string;
  romanjiTitle?: string;
  synopsis?: string | null;
}
