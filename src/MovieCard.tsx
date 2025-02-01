import { Movie } from "./store"
import { useEffect, useState } from "react";
import { ThumbsUp } from 'lucide-react';
import { useMovieStore } from "./store";

interface MovieCardProps {
    movieTitle: string;
}

const APIKEY = import.meta.env.VITE_POSTERAPI;

const MovieCard = ({ movieTitle }: MovieCardProps) => {

    const { setMovie } = useMovieStore();
    const [poster, setPoster] = useState<string>("");
    const [movieData, setMovieData] = useState<Movie | null>(null)

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const response = await fetch("/movie_data.json");
                const data: Movie[] = await response.json();
                const currentMovie = data.find((movie) => movie.original_title === `${movieTitle[1]}`);
                if (currentMovie) {
                    setMovieData(currentMovie);
                }
            } catch (error) {
                console.error("Error fetching movie data:", error);
            }
        };

        fetchMovieData();
    }, [])

    useEffect(() => {
        const fetchPosterData = async () => {
            try {
                if (movieData) {
                    const response = await fetch(`https://www.omdbapi.com/?t=${movieData.title}&apikey=${APIKEY}`)
                    const posterData = await response.json();
                    setPoster(posterData.Poster)
                }
            } catch (error) {
                console.error("Error fetching poster data:", error);
            }
        }

        fetchPosterData();
    }, [movieData])

    return (
        <div className='flex justify-start gap-x-4 border-1 p-2 rounded-md w-full h-1/6 text-white hover:cursor-pointer' onClick={() => setMovie(movieData) } >
            <div className="w-1/4">
                <img className="rounded-lg w-full h-full" height={10} width={20} src={poster} alt="movie-poster" />
            </div>
            <div className="flex flex-col justify-center">
                <div className="flex items-center gap-x-1 min-w-full text-sm">
                    <div className="font-bold">
                        {movieData?.title}
                    </div>
                    <div className="text-xs">
                        ({movieData?.release_date.slice(0, 4)})
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <ThumbsUp size={20} />
                    {movieData?.vote_average}
                </div>
                <div className="text-slate-400 text-sm">
                    {movieData?.status}
                </div>
            </div>
        </div>
    )
}

export default MovieCard