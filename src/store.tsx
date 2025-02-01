import { create } from 'zustand';

export interface Movie {
    budget: number;
    genres: { id: number; name: string }[];
    homepage: string;
    id: number;
    keywords: { id: number; name: string }[];
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    production_companies: { name: string; id: number }[];
    production_countries: { iso_3166_1: string; name: string }[];
    release_date: string;
    revenue: number;
    runtime: number;
    spoken_languages: { iso_639_1: string; name: string }[];
    status: string;
    tagline: string;
    title: string;
    vote_average: number;
    vote_count: number;
}

interface MovieStore {
    movie: Movie | null;
    setMovie: (movie: Movie | null) => void;
}

export const useMovieStore = create<MovieStore>((set) => ({
    movie: null,
    setMovie: (movie) => set({ movie }),
}));