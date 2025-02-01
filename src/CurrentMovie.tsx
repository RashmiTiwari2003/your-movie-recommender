import { useEffect, useState } from "react"
import { ThumbsUp, ChartNoAxesCombined, Clapperboard, Menu, X } from 'lucide-react';
// import { ThumbsUp, ChartNoAxesCombined, Clapperboard, Menu, X } from 'lucide-react';
import { useMovieStore, Movie } from "./store";

const APIKEY = import.meta.env.VITE_POSTERAPI;

const CurrentMovie = () => {

  const [poster, setPoster] = useState<string>("");
  const { movie, setMovie } = useMovieStore();
  const [movieSearch, setMovieSearch] = useState<string>("")
  const [filteredMovies, setFilteredMovies] = useState<{ id: number; original_title: string }[]>([]);
  // const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [genres, setGenres] = useState<string[]>([]);

  const [menuOpen, setMenuOpen] = useState<boolean>(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setMenuOpen(window.innerWidth >= 768); // true for md+, false for < md
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial state

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const response = await fetch("/movie_data.json");
        const data: Movie[] = await response.json();
        const initialMovie = data.find((movie) => movie.original_title === "Avatar");
        if (initialMovie) {
          setMovie(initialMovie);
        }
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    const setGenresData = async () => {
      try {
        const res = await fetch("/uniqueGenres.json");
        const data = await res.json();
        setGenres(data)
      } catch (error) {
        console.error("Error fetching Genres: ", error)
      }
    }

    fetchMovieData();
    setGenresData();
  }, [])

  useEffect(() => {
    const fetchPosterData = async () => {
      try {
        if (movie) {
          const response = await fetch(`http://www.omdbapi.com/?t=${movie.title}&apikey=${APIKEY}`)
          const posterData = await response.json();
          setPoster(posterData.Poster)
        }
      } catch (error) {
        console.error("Error fetching poster data:", error);
      }
    }

    fetchPosterData();
  }, [movie])

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) {
      return "N/A"
    };
    if (amount >= 10000000) {
      return `₹ ${(amount / 10000000).toFixed(2)} Crores`;
    } else if (amount >= 100000) {
      return `₹ ${(amount / 100000).toFixed(2)} Lakhs`;
    } else {
      return `₹ ${amount.toLocaleString()}`;
    }
  };

  const handleSearch = async (query: string) => {
    const database = await fetch("/3000-movies.json");
    const movieDb = await database.json();

    if (query === '') {
      setFilteredMovies([])
      setMovieSearch(query)
      return;
    }

    const results = movieDb.filter((movie: { id: number; original_title: string; }) =>
      movie.original_title.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 7);

    console.log(results)
    setFilteredMovies(results)

    setMovieSearch(query)
  }

  const showMovie = async (movieTitle: string) => {
    try {
      const response = await fetch("/movie_data.json");
      const data: Movie[] = await response.json();
      const newMovie = data.find((movie) => movie.original_title === `${movieTitle}`);
      if (newMovie) {
        setMovie(newMovie);
        setFilteredMovies([])
        setMovieSearch('')
      }
    } catch (error) {
      console.error("Error fetching movie data:", error);
    }
  }

  const showMovieFromGenre = async (elem: string) => {
    try {
      const response = await fetch("/movie_data.json");
      const data: Movie[] = await response.json();

      const filteredMovies = data.filter((movie) =>
        movie.genres.some((genre) => genre.name === `${elem}`)
      );

      const randomIndex = Math.floor(Math.random() * filteredMovies.length);
      setMovie(filteredMovies[randomIndex]);
    } catch (error) {
      console.error("Error fetching movie data:", error);
    }
  }

  return (
    <div className={`flex transition-all duration-300 ease-in-out ${menuOpen ? 'flex-row' : 'flex-col'}  mr-10 md:mr-0 py-8 w-full md:w-3/4 text-white`}>
      <div className="flex flex-col md:w-1/5">
        <button className="md:hidden pb-2 hover:cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
        </button>
        {menuOpen && (
          <div className={`flex  ease-in-out transition-all duration-300 flex-col gap-2 md:gap-4  bg-black/95 ${menuOpen ? 'w-full' : 'w-0'}`}>
            {genres.map((elem) => (
              <div onClick={() => showMovieFromGenre(elem)} className="w-full font-medium hover:cursor-pointer">
                {elem}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={`${menuOpen ? 'md:block hidden w-full' : 'w-full'} flex flex-col justify-center md:justify-start duration-300 transition-all ease-in-out md:px-2`}>
        <div className={`flex gap-2 pb-5 font-bold text-center text-xl w-full md:text-start`}>
          MOVIE RECOMMENDER
          <Clapperboard />
        </div>
        <div className="pb-5">
          <input type="text" value={movieSearch} onChange={(e) => handleSearch(e.target.value)} placeholder="Search..." className="bg-white px-3 rounded-md w-full h-9 text-black" />
          <div className='w-full'>
            {
              filteredMovies.length > 0 && (
                <div className="z-10 absolute bg-black/80 px-5 w-full md:w-3/4">
                  {
                    filteredMovies.map((elem) => (
                      <div onClick={() => showMovie(elem.original_title)} className="border-white py-4 border-b-1 last:border-b-0 h-16 text-white hover:cursor-pointer" key={elem.id}>
                        {elem.original_title}
                      </div>
                    ))
                  }
                </div>
              )
            }
          </div>
        </div>
        <div className="flex md:flex-row flex-col justify-start items-start gap-5 max-h-fit">
          <div className="bg-white p-4 rounded-xl max-w-fit" >
            <a href={movie?.homepage} target="_blank">
              <img width={300} height={600} src={poster} alt="movie-poster" />
            </a>
          </div>
          <div className="flex flex-col gap-3 px-3 py-2 w-full md:w-3/4">
            <div className="flex font-bold text-white text-xl md:text-4xl">
              {movie?.title}
            </div>
            <div className="text-lg">
              {movie?.tagline}
            </div>
            <div className="font-light">
              {movie?.overview}
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp />
              {movie?.vote_average}
            </div>
            <div className="flex gap-x-2">
              {movie?.genres.map((elem, ind) => (
                <div key={ind} className="flex items-center border-2 border-white px-2 py-1 rounded-lg font-bold text-center text-white text-xs">
                  {elem.name.toUpperCase()}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-x-1 text-sm">
              <div className="text-slate-400">
                Status:
              </div>
              {movie?.status}
            </div>
            <div className="flex items-center gap-x-1 text-sm">
              <div className="text-slate-400">
                Budget:
              </div>
              {formatCurrency(movie?.budget)}
            </div>
            <div className="flex items-center gap-x-1 text-sm">
              <div className="text-slate-400">
                Spoken Languages:
              </div>
              {movie?.spoken_languages.map((elem) => elem.name).join(", ")}
            </div>
            <div className="flex items-center gap-x-1 text-sm">
              <div className="text-slate-400">
                Production Countries:
              </div>
              {movie?.production_countries.map((elem) => elem.name).join(", ")}
            </div>
            <div className="flex items-center gap-x-1 text-sm">
              <div className="text-slate-400">
                Production Companies:
              </div>
              {movie?.production_companies.map((elem) => elem.name).join(", ")}
            </div>
          </div>
        </div>
        <div className="flex gap-8 py-6 w-full">
          <div className="flex flex-col text-md md:text-xl">
            <div className="text-slate-400">
              RUNTIME
            </div>
            <div>
              {movie?.runtime} minutes
            </div>
          </div>
          <div className="flex flex-col text-md md:text-xl">
            <div className="text-slate-400">
              INITIAL RELEASE
            </div>
            <div className="">
              {movie?.release_date}
            </div>
          </div>
          <div className="flex items-end gap-3 text-md md:text-xl">
            <ChartNoAxesCombined size={40} />
            <div className="flex flex-col">
              <div className="text-slate-400">
                REVENUE
              </div>
              <div className="text-white">
                {formatCurrency(movie?.revenue)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // <div className="flex flex-col w-screen text-black">
    //   <div className="flex flex-wrap">
    //     {movie?.keywords.map((elem, ind) => (
    //       <div key={ind} className="flex">
    //         {elem.name + ", "}
    //       </div>
    //     ))}
    //   </div>
    //   <div>
    //     {movie?.popularity}
    //   </div>
    //   <div>
    //     {movie?.vote_count}
    //   </div>
    // </div>
  )
}

export default CurrentMovie