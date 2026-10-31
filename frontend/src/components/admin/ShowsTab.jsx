import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, Film, Monitor, RefreshCw, DollarSign } from 'lucide-react';
import { getMovies } from '../../api/movies';
import { getTheaters, getScreens } from '../../api/theaters';
import { getLanguages } from '../../api/languages';
import { getSeatsByScreen } from '../../api/seats';
import { createShow } from '../../api/shows';
import Alert from '../common/Alert';

export const ShowsTab = () => {
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [screens, setScreens] = useState([]);
  const [languages, setLanguages] = useState([]);

  // Form selections
  const [movieId, setMovieId] = useState('');
  const [theaterId, setTheaterId] = useState('');
  const [screenId, setScreenId] = useState('');
  const [languageId, setLanguageId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Categories & prices on selected screen
  const [screenCategories, setScreenCategories] = useState([]);
  const [categoryPrices, setCategoryPrices] = useState({});
  const [loadingScreenSeats, setLoadingScreenSeats] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Load initial dropdown dependencies
  const loadDependencies = async () => {
    try {
      setError(null);
      const [moviesData, theatersData, langsData] = await Promise.all([
        getMovies(),
        getTheaters(),
        getLanguages(),
      ]);

      setMovies(moviesData);
      setTheaters(theatersData);
      setLanguages(langsData);

      if (moviesData.length > 0) setMovieId(moviesData[0].id);
      if (theatersData.length > 0) setTheaterId(theatersData[0].id);
      if (langsData.length > 0) setLanguageId(langsData[0].id);
    } catch (err) {
      setError(err.backendMessage || err.message || 'Failed to load show setup data');
    }
  };

  useEffect(() => {
    loadDependencies();
  }, []);

  // When theater changes, load its screens
  useEffect(() => {
    if (!theaterId) {
      setScreens([]);
      setScreenId('');
      return;
    }

    const loadScreens = async () => {
      try {
        const data = await getScreens(theaterId);
        setScreens(data);
        if (data.length > 0) {
          setScreenId(data[0].id);
        } else {
          setScreenId('');
        }
      } catch (err) {
        setError(err.backendMessage || err.message || 'Failed to load screens for theater');
      }
    };

    loadScreens();
  }, [theaterId]);

  // When screen changes, detect seat categories present on this screen
  useEffect(() => {
    if (!screenId) {
      setScreenCategories([]);
      setCategoryPrices({});
      return;
    }

    const loadScreenSeats = async () => {
      try {
        setLoadingScreenSeats(true);
        const seats = await getSeatsByScreen(screenId);
        const cats = [...new Set(seats.map((s) => s.category || 'STANDARD'))];
        setScreenCategories(cats);

        // Prepopulate default prices
        const initialPrices = {};
        cats.forEach((cat) => {
          if (cat.toUpperCase().includes('VIP')) initialPrices[cat] = '350';
          else if (cat.toUpperCase().includes('PREMIUM')) initialPrices[cat] = '250';
          else initialPrices[cat] = '180';
        });
        setCategoryPrices(initialPrices);
      } catch (err) {
        setError(err.backendMessage || err.message || 'Failed to inspect screen seat categories');
      } finally {
        setLoadingScreenSeats(false);
      }
    };

    loadScreenSeats();
  }, [screenId]);

  const handlePriceChange = (category, value) => {
    setCategoryPrices((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!movieId || !screenId || !languageId || !startTime || !endTime) {
      setError('Please fill in all show schedule fields');
      return;
    }

    if (screenCategories.length === 0) {
      setError(
        'The selected screen has NO seats configured yet. Please configure seat layout in "Seat Layout" tab before scheduling a show!'
      );
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      // Convert datetime-local strings (e.g. 2026-09-23T18:00) into ISO LocalDateTime format
      const formattedStartTime = startTime.length === 16 ? `${startTime}:00` : startTime;
      const formattedEndTime = endTime.length === 16 ? `${endTime}:00` : endTime;

      // Construct categoryToPrices Map<String, BigDecimal>
      const categoryToPrices = {};
      for (const cat of screenCategories) {
        const p = parseFloat(categoryPrices[cat]);
        if (isNaN(p) || p <= 0) {
          setError(`Please provide a valid price for category: ${cat}`);
          setSubmitting(false);
          return;
        }
        categoryToPrices[cat] = p;
      }

      const payload = {
        movie_id: movieId,
        screen_id: screenId,
        language_id: languageId,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        categoryToPrices,
      };

      const result = await createShow(payload);
      setSuccess(`Show scheduled successfully! Show ID: ${result.id}`);
      await loadDependencies();
    } catch (err) {
      setError(err.backendMessage || err.message || 'Failed to create show');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      <div className="bg-[#121722] rounded-2xl border border-[#242f44] p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#242f44]">
          <Calendar className="w-5 h-5 text-rose-500" />
          <div>
            <h3 className="font-bold text-white text-base">Schedule New Movie Show</h3>
            <p className="text-xs text-slate-400">
              Create a screening session with customized per-category seat pricing
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Select Movie */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-rose-500" />
                <span>Select Movie</span>
              </label>
              <select
                required
                value={movieId}
                onChange={(e) => setMovieId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0a0d14] border border-[#242f44] rounded-xl text-sm text-slate-100 focus:outline-none focus:border-rose-500"
              >
                {movies.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Theater */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-amber-500" />
                <span>Select Theater</span>
              </label>
              <select
                required
                value={theaterId}
                onChange={(e) => setTheaterId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0a0d14] border border-[#242f44] rounded-xl text-sm text-slate-100 focus:outline-none focus:border-rose-500"
              >
                {theaters.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Screen */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-amber-500" />
                <span>Auditorium / Screen</span>
              </label>
              <select
                required
                value={screenId}
                onChange={(e) => setScreenId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0a0d14] border border-[#242f44] rounded-xl text-sm text-slate-100 focus:outline-none focus:border-rose-500"
              >
                {screens.length === 0 ? (
                  <option value="">No screens in this theater</option>
                ) : (
                  screens.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.screenName}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Select Language */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Screening Language
              </label>
              <select
                required
                value={languageId}
                onChange={(e) => setLanguageId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0a0d14] border border-[#242f44] rounded-xl text-sm text-slate-100 focus:outline-none focus:border-rose-500"
              >
                {languages.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Show Start Time</span>
              </label>
              <input
                type="datetime-local"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#0a0d14] border border-[#242f44] rounded-xl text-sm text-slate-100 focus:outline-none focus:border-rose-500 [color-scheme:dark]"
              />
            </div>

            {/* End Time */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Show End Time</span>
              </label>
              <input
                type="datetime-local"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#0a0d14] border border-[#242f44] rounded-xl text-sm text-slate-100 focus:outline-none focus:border-rose-500 [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Seat Category Pricing Matrix */}
          <div className="bg-[#0a0d14] rounded-2xl border border-[#242f44] p-5">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#242f44]">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider">
                Category Pricing (₹ INR)
              </h4>
            </div>

            {loadingScreenSeats ? (
              <p className="text-xs text-slate-400 py-3">
                Detecting seat categories on selected screen...
              </p>
            ) : screenCategories.length === 0 ? (
              <p className="text-xs text-amber-400 py-3">
                ⚠️ Selected screen has no seats configured. You must create seat layout for this screen first.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                {screenCategories.map((cat) => (
                  <div
                    key={cat}
                    className="p-3 bg-[#121722] rounded-xl border border-[#242f44] flex items-center justify-between"
                  >
                    <span className="text-xs font-bold text-rose-400 uppercase">
                      {cat} Tier
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-400">₹</span>
                      <input
                        type="number"
                        min="1"
                        required
                        value={categoryPrices[cat] || ''}
                        onChange={(e) => handlePriceChange(cat, e.target.value)}
                        placeholder="Price"
                        className="w-24 px-2.5 py-1.5 bg-[#0a0d14] border border-[#242f44] rounded-lg text-xs font-bold text-emerald-400 text-right focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || screenCategories.length === 0}
            className="w-full py-3 bg-gradient-to-r from-rose-600 to-brand-600 hover:from-rose-500 hover:to-brand-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-900/40"
          >
            <Plus className="w-4 h-4" />
            <span>{submitting ? 'Creating Show...' : 'Schedule Show & Populate Seats'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShowsTab;
