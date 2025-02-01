import { useEffect, useState } from 'react'
import { useMovieStore } from "./store"
import MovieCard from './MovieCard';

const RecommendedMovies = () => {
    const { movie } = useMovieStore();
    const [recommendedMovies, setRecommendedMovies] = useState([])

    useEffect(() => {
        const avatarRecommendedMovies = async () => {
            const avatarRecoms = await fetch("/avatar_recommended.json");
            const data = await avatarRecoms.json();
            setRecommendedMovies(data)
        }

        const fetchRecommendedMovies = async () => {
            try {
                if (movie) {
                    const response = await fetch(`https://server-mov-rec-3000.onrender.com/recommend?movie=${movie?.title}`);
                    const data = await response.json();
                    setRecommendedMovies(data.recommendations.slice(0, 5))
                }
            } catch (error) {
                console.error("Error fetching movie data:", error);
            }
        }

        fetchRecommendedMovies();

        if (movie?.title === 'Avatar') {
            avatarRecommendedMovies();
        }
    }, [movie])

    // useEffect(() => {
    //     console.log(recommendedMovies)
    // }, [recommendedMovies])

    return (
        <div className="flex flex-col gap-6 py-8 w-full md:w-1/4">
            {recommendedMovies.map((elem) => (
                <MovieCard key={elem[0]} movieTitle={elem} />
            ))}
        </div>
    )
}

export default RecommendedMovies