import React, { useState, useEffect } from 'react';
import { Film, Calendar, Clock, RefreshCw, ChevronRight, PlayCircle } from 'lucide-react';
import { getMovies } from '../../api/movies';
import { useAuth } from '../../context/AuthContext';
import Alert from '../common/Alert';

export const MovieList = ({ onSelectShow, onRequireAuth }) => {
  const { isAuthenticated } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMovies();
      setMovies(data);
    } catch (err) {
      setError(err.backendMessage || err.message || 'Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleShowClick = (movie, show) => {
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }
    onSelectShow({
      showId: show.id,
      movieName: movie.name,
      startTime: show.startTime,
      endTime: show.endTime,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden mb-12 bg-gradient-to-r from-rose-950/80 via-[#121722] to-[#0a0d14] border border-[#242f44] p-8 sm:p-12 shadow-2xl">
        <div className="max-w-2xl relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-600/20 text-rose-400 border border-rose-500/30 mb-4">
            <Film className="w-3.5 h-3.5" />
            Now Showing & Upcoming
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Book Tickets for the <span className="bg-gradient-to-r from-rose-500 to-amber-400 bg-clip-text text-transparent">Latest Blockbusters</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
            Reserve premium & standard seats in real time with instant Razorpay confirmation and seamless 5-minute hold protection.
          </p>
        </div>
      </div>

      {/* Header and Refresh */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#242f44]">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Movies in Theaters</h2>
          <p className="text-xs text-slate-400 mt-1">Select a movie and preferred showtime to choose seats</p>
        </div>

        <button
          onClick={fetchMovies}
          disabled={loading}
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#121722] border border-[#242f44] px-4 py-2 rounded-xl hover:border-slate-500 transition-all shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Catalog</span>
        </button>
      </div>

      {error && (
        <div className="mb-8">
          <Alert type="error" message={error} onClose={() => setError(null)} />
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-[#121722] rounded-2xl border border-[#242f44] overflow-hidden animate-pulse h-96"
            />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-20 bg-[#121722] rounded-2xl border border-[#242f44] p-8">
          <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Movies Available Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Check back shortly or log in as an administrator to add new movies and schedule shows.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => {
            const shows = movie.shows || [];

            return (
              <div
                key={movie.id}
                className="group bg-[#121722] rounded-2xl border border-[#242f44] hover:border-rose-500/50 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-rose-950/20"
              >
                {/* Poster Container */}
                <div className="relative aspect-[2/3] w-full bg-[#181f2e] overflow-hidden">
                  {movie.imgSource ? (
                    <img
                      src={movie.imgSource}
                      alt={movie.name}
                      onError={(e) => {
                        // Fallback image if source fails
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : null}
                  <div
                    style={{ display: movie.imgSource ? 'none' : 'flex' }}
                    className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#181f2e] to-[#0a0d14]"
                  >
                    <PlayCircle className="w-12 h-12 text-rose-500/60 mb-2" />
                    <span className="text-sm font-bold text-slate-300">{movie.name}</span>
                  </div>

                  {/* Shows Count Badge */}
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white border border-white/10">
                    {shows.length} {shows.length === 1 ? 'Show' : 'Shows'}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-1">
                      {movie.name}
                    </h3>
                  </div>

                  {/* Scheduled Showtimes */}
                  <div className="mt-4 pt-4 border-t border-[#242f44]/80">
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2.5 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-rose-500" />
                      <span>Available Shows</span>
                    </p>

                    {shows.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No scheduled shows</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {shows.map((show) => {
                          const date = new Date(show.startTime);
                          const timeStr = date.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          });

                          return (
                            <button
                              key={show.id}
                              onClick={() => handleShowClick(movie, show)}
                              className="px-2.5 py-1.5 bg-[#181f2e] hover:bg-rose-600 border border-[#242f44] hover:border-rose-500 rounded-lg text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm flex items-center gap-1"
                            >
                              <span>{timeStr}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MovieList;
