
function MovieCard({
  title,
  genre,
  year,
  rating,
  movie,
  onAdd,
  isAdded,
}) {
  return (
    <div className="movie-card">
      {movie.poster ? (
        <img
          src={movie.poster}
          alt={title}
          className="movie-poster"
        />
      ) : (
        <div className="poster-placeholder">
          🎬 No Poster
        </div>
      )}

      <div className="movie-info">
        <h3>{title}</h3>
        <p>Genre: {genre}</p>
        <p>Year: {year}</p>
        <p>⭐ {rating}</p>

        <button
          onClick={() => onAdd(movie)}
          disabled={isAdded}
        >
          {isAdded ? "Added ✓" : "＋ Add to Watchlist"}
        </button>
      </div>
    </div>
  );
}

export default MovieCard;
