
function Watchlist({ watchlist, onRemove }) {
  return (
    <div className="watchlist">
      <h2>My Watchlist ({watchlist.length})</h2>

      {watchlist.length === 0 ? (
        <p>Your watchlist is empty!</p>
      ) : (
        watchlist.map((movie) => (
          <div className="watchlist-item" key={movie.id}>
            <span>{movie.title}</span>

            <button onClick={() => onRemove(movie.id)}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Watchlist;
