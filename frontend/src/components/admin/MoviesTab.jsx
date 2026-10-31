import React, { useState, useEffect } from 'react';
import { Film, Plus, RefreshCw, Image, PlayCircle } from 'lucide-react';
import { getMovies, createMovie } from '../../api/movies';
import Alert from '../common/Alert';

export const MoviesTab = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [imgSource, setImgSource] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      const newMovie = await createMovie({ name, imgSource });
      setSuccess(`Movie "${newMovie.name}" added successfully!`);
      setName('');
      setImgSource('');
      await fetchMovies();
    } catch (err) {
      setError(err.backendMessage || err.message || 'Failed to add movie');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Movie Form */}
        <div className="bg-[#121722] rounded-2xl border border-[#242f44] p-6 shadow-xl h-fit">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#242f44]">
            <Film className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-white text-base">Add New Movie</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Movie Title
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Interstellar, Inception, Dune: Part Two"
                className="w-full px-3.5 py-2.5 bg-[#0a0d14] border border-[#242f44] rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Poster Image URL
              </label>
              <div className="relative">
                <Image className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="url"
                  value={imgSource}
                  onChange={(e) => setImgSource(e.target.value)}
                  placeholder="https://example.com/poster.jpg"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#0a0d14] border border-[#242f44] rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Direct image URL (JPG/PNG/WebP) for the movie poster.
              </p>
            </div>

            {/* Poster Preview */}
            {imgSource && (
              <div className="pt-2">
                <span className="text-[10px] font-medium text-slate-400 block mb-1">
                  Preview
                </span>
                <div className="w-24 aspect-[2/3] rounded-lg overflow-hidden border border-slate-700 bg-slate-900">
                  <img
                    src={imgSource}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-rose-900/30"
            >
              <Plus className="w-4 h-4" />
              <span>{submitting ? 'Adding...' : 'Add Movie to Catalog'}</span>
            </button>
          </form>
        </div>

        {/* Existing Movies List */}
        <div className="lg:col-span-2 bg-[#121722] rounded-2xl border border-[#242f44] p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#242f44]">
            <div>
              <h4 className="font-bold text-white text-base">Movies Catalog</h4>
              <p className="text-xs text-slate-400">Total {movies.length} movies in system</p>
            </div>
            <button
              onClick={fetchMovies}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading catalog...</div>
          ) : movies.length === 0 ? (
            <div className="p-8 text-center bg-[#0a0d14] rounded-xl border border-dashed border-[#242f44]">
              <Film className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No movies registered yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
              {movies.map((m) => (
                <div
                  key={m.id}
                  className="p-3 bg-[#0a0d14] rounded-xl border border-[#242f44] flex items-center gap-3"
                >
                  <div className="w-12 h-16 bg-[#181f2e] rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                    {m.imgSource ? (
                      <img src={m.imgSource} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      <PlayCircle className="w-6 h-6 text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-sm text-white truncate">{m.name}</h5>
                    <span className="text-[11px] text-rose-400 font-semibold">
                      {(m.shows || []).length} scheduled shows
                    </span>
                    <div className="text-[10px] text-slate-500 font-mono truncate">
                      ID: {m.id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoviesTab;
