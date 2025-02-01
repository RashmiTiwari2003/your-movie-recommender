import CurrentMovie from "./CurrentMovie"
import RecommendedMovies from "./RecommendedMovies"

const App = () => {
  return (
    <div className="flex md:flex-row flex-col justify-between gap-6 bg-black px-8 w-full min-h-screen">
      <CurrentMovie />
      <RecommendedMovies />
    </div>
  )
}

export default App