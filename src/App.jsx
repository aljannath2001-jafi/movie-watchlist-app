import SignUpForm from "./components/register/SignUpForm";
import { useState, useEffect } from "react";
import axios from "axios";
import MovieCard from "./components/MovieCard";
import Watchlist from "./components/Watchlist";

function App() {
  const [registeredUser, setRegisteredUser] = useState("");
  const [movies, setMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [genre, setGenre] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
  // Fetch movies using IMDb API, Axios and useEffect
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          "https://imdb236.p.rapidapi.com/api/imdb/top250-movies",
          {
            headers: {
              "x-rapidapi-host": "imdb236.p.rapidapi.com",
              "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
            },
          }
        );

        const movieList = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];

        const formattedMovies = movieList.map((movie, index) => ({
          id: movie.id || index + 1,
          title: movie.primaryTitle || "Unknown Movie",
          genre: movie.genres?.[0] || "Other",
          year: movie.startYear || "N/A",
          rating: movie.averageRating ?? "N/A",
          poster: movie.primaryImage || "",
        }));

        setMovies(formattedMovies);
      } catch (err) {
        console.error("Movie loading error:", err);
        setError("Unable to load movies. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Add movie without duplicates
  const addToWatchlist = (movie) => {
    setWatchlist((previous) =>
      previous.some((item) => item.id === movie.id)
        ? previous
        : [...previous, movie]
    );
  };

  // Remove movie
  const removeFromWatchlist = (id) => {
    setWatchlist((previous) =>
      previous.filter((movie) => movie.id !== id)
    );
  };

  // Genre list
  const genres = [
    "All",
    ...new Set(movies.map((movie) => movie.genre)),
  ];

  // Search and genre filtering
  const filteredMovies = movies.filter((movie) => {
    const matchesGenre =
      genre === "All" || movie.genre === genre;

    const matchesSearch = movie.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesGenre && matchesSearch;
  });
  if (!registeredUser) {
  return <SignUpForm onRegister={setRegisteredUser} />;
}

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span>🎬</span> Movie
          <span className="highlight">Watch</span>
        </div>

        <input
          type="text"
          className="search-input"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <a href="#watchlist" className="watchlist-link">
          My Watchlist ({watchlist.length})
        </a>
      </header>

      <div className="welcome-user">
  <div>
    <span>👋 Welcome back,</span>
    <h2>{registeredUser}!</h2>
    <p>Ready to discover your next favourite movie?</p>
  </div>

  <button
    className="logout-btn"
    onClick={() => setRegisteredUser("")}
  >
    Logout ↗
  </button>
</div>

      <section className="hero">
        <div>
          <p className="hero-tag">YOUR CINEMA EXPERIENCE</p>
          <h1>Discover Your Next Favourite Movie</h1>
          <p>
            Explore top-rated movies and create your personal
            movie watchlist.
          </p>
          <a href="#movies" className="hero-button">
            Explore Movies
          </a>
        </div>
      </section>

      <main className="main-content">
        <section id="movies" className="movies-section">
          <h2>Explore Top Movies</h2>

          <div className="filter-buttons">
            {genres.map((item) => (
              <button
                key={item}
                className={genre === item ? "active" : ""}
                onClick={() => setGenre(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading movies...</p>
            </div>
          ) : error ? (
            <p className="empty-message">{error}</p>
          ) : filteredMovies.length === 0 ? (
            <p className="empty-message">No movies found.</p>
          ) : (
            <div className="movie-grid">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  title={movie.title}
                  genre={movie.genre}
                  year={movie.year}
                  rating={movie.rating}
                  movie={movie}
                  onAdd={addToWatchlist}
                  isAdded={watchlist.some(
                    (item) => item.id === movie.id
                  )}
                />
              ))}
            </div>
          )}
        </section>

        <section id="watchlist">
          <Watchlist
            watchlist={watchlist}
            onRemove={removeFromWatchlist}
          />
        </section>
      </main>

      <footer>
        <p>MovieWatch | Built with React ❤️</p>
        <p>Movie data loaded using Axios.</p>
      </footer>
    </div>
  );
}

export default App;
