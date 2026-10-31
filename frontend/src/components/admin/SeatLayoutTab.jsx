import React, { useState, useEffect } from 'react';
import { LayoutGrid, Plus, Trash2, CheckCircle, RefreshCw, Layers } from 'lucide-react';
import { getTheaters, getScreens } from '../../api/theaters';
import { createSeats, getSeatsByScreen } from '../../api/seats';
import Alert from '../common/Alert';

export const SeatLayoutTab = () => {
  const [theaters, setTheaters] = useState([]);
  const [selectedTheaterId, setSelectedTheaterId] = useState('');
  const [screens, setScreens] = useState([]);
  const [selectedScreenId, setSelectedScreenId] = useState('');
  const [existingSeats, setExistingSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(false);

  // Form states for seatCategories: Array<{ category: string, rows: number, cols: number }>
  const [categories, setCategories] = useState([
    { category: 'VIP', rows: 2, cols: 8 },
    { category: 'REGULAR', rows: 5, cols: 8 },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch theaters on mount
  useEffect(() => {
    const loadTheaters = async () => {
      try {
        const data = await getTheaters();
        setTheaters(data);
        if (data.length > 0) {
          setSelectedTheaterId(data[0].id);
        }
      } catch (err) {
        setError(err.backendMessage || err.message || 'Failed to load theaters');
      }
    };
    loadTheaters();
  }, []);

  // Fetch screens when theater changes
  useEffect(() => {
    if (!selectedTheaterId) {
      setScreens([]);
      setSelectedScreenId('');
      return;
    }

    const loadScreens = async () => {
      try {
        const data = await getScreens(selectedTheaterId);
        setScreens(data);
        if (data.length > 0) {
          setSelectedScreenId(data[0].id);
        } else {
          setSelectedScreenId('');
          setExistingSeats([]);
        }
      } catch (err) {
        setError(err.backendMessage || err.message || 'Failed to load screens');
      }
    };
    loadScreens();
  }, [selectedTheaterId]);

  // Fetch existing seats when screen changes
  useEffect(() => {
    if (!selectedScreenId) {
      setExistingSeats([]);
      return;
    }

    fetchSeats(selectedScreenId);
  }, [selectedScreenId]);

  const fetchSeats = async (screenId) => {
    try {
      setLoadingSeats(true);
      const data = await getSeatsByScreen(screenId);
      setExistingSeats(data);
    } catch (err) {
      setError(err.backendMessage || err.message || 'Failed to load screen seats');
    } finally {
      setLoadingSeats(false);
    }
  };

  const addCategory = () => {
    setCategories((prev) => [...prev, { category: 'PREMIUM', rows: 2, cols: 8 }]);
  };

  const removeCategory = (index) => {
    setCategories((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCategory = (index, field, value) => {
    setCategories((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  };

  // Compute live preview of rows & seats
  let currentRowCode = 'A'.charCodeAt(0);
  const previewRows = categories.map((cat) => {
    const rowsList = [];
    const numRows = Math.max(1, parseInt(cat.rows) || 1);
    const numCols = Math.max(1, parseInt(cat.cols) || 1);

    for (let r = 0; r < numRows; r++) {
      const rowLetter = String.fromCharCode(currentRowCode);
      currentRowCode++;
      rowsList.push({
        letter: rowLetter,
        seats: Array.from({ length: numCols }, (_, i) => `${rowLetter}${i + 1}`),
      });
    }
    return {
      category: cat.category,
      rows: rowsList,
      totalSeats: numRows * numCols,
    };
  });

  const totalSeatsToGenerate = previewRows.reduce((sum, c) => sum + c.totalSeats, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedScreenId) {
      setError('Please select a screen first.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      // Construct exact CreateSeatRequestDTO payload
      const payload = {
        screen_id: selectedScreenId,
        seatCategories: categories.map((cat) => ({
          category: cat.category.trim(),
          pair: [
            {
              rows: parseInt(cat.rows) || 1,
              cols: parseInt(cat.cols) || 1,
            },
          ],
        })),
      };

      const result = await createSeats(payload);
      setSuccess(`Successfully generated ${result.length} seats for this screen!`);
      setExistingSeats(result);
    } catch (err) {
      setError(err.backendMessage || err.message || 'Failed to create seat layout');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      {/* Screen Selection Controls */}
      <div className="bg-[#121722] rounded-2xl border border-[#242f44] p-6 shadow-xl">
        <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-rose-500" />
          <span>Select Screen for Seat Layout</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Select Theater
            </label>
            <select
              value={selectedTheaterId}
              onChange={(e) => setSelectedTheaterId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0a0d14] border border-[#242f44] rounded-xl text-sm text-slate-100 focus:outline-none focus:border-rose-500"
            >
              {theaters.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Select Screen / Auditorium
            </label>
            <select
              value={selectedScreenId}
              onChange={(e) => setSelectedScreenId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0a0d14] border border-[#242f44] rounded-xl text-sm text-slate-100 focus:outline-none focus:border-rose-500"
            >
              {screens.length === 0 ? (
                <option value="">No screens in selected theater</option>
              ) : (
                screens.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.screenName}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Existing Seats Overview if present */}
      {existingSeats.length > 0 && (
        <div className="bg-[#121722] rounded-2xl border border-[#242f44] p-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#242f44]">
            <div>
              <h4 className="font-bold text-white text-sm">
                Current Seats in this Screen ({existingSeats.length} seats)
              </h4>
              <p className="text-xs text-slate-400">
                Seats currently configured in the database
              </p>
            </div>
            <button
              onClick={() => fetchSeats(selectedScreenId)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loadingSeats ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-[#0a0d14] rounded-xl border border-[#242f44]">
            {existingSeats.map((seat) => (
              <span
                key={seat.id}
                className="text-[11px] font-semibold px-2 py-1 bg-[#181f2e] border border-slate-700 rounded text-slate-300"
              >
                {seat.name} <span className="text-rose-400 text-[9px]">({seat.category})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Category & Matrix Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Form */}
        <div className="bg-[#121722] rounded-2xl border border-[#242f44] p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#242f44]">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-500" />
              <span>Define Categories & Blocks</span>
            </h4>
            <button
              type="button"
              onClick={addCategory}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold bg-rose-950/40 border border-rose-500/30 px-3 py-1.5 rounded-lg transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              {categories.map((cat, idx) => (
                <div
                  key={idx}
                  className="bg-[#0a0d14] rounded-xl border border-[#242f44] p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">
                      Tier #{idx + 1}
                    </span>
                    {categories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCategory(idx)}
                        className="text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1">
                      <label className="block text-[10px] font-medium text-slate-400 mb-1">
                        Category Name
                      </label>
                      <input
                        type="text"
                        required
                        value={cat.category}
                        onChange={(e) => updateCategory(idx, 'category', e.target.value)}
                        placeholder="VIP / REGULAR"
                        className="w-full px-2.5 py-1.5 bg-[#181f2e] border border-[#242f44] rounded-lg text-xs text-white uppercase focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-medium text-slate-400 mb-1">
                        Rows
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="26"
                        required
                        value={cat.rows}
                        onChange={(e) => updateCategory(idx, 'rows', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-[#181f2e] border border-[#242f44] rounded-lg text-xs text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-medium text-slate-400 mb-1">
                        Seats per Row
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="40"
                        required
                        value={cat.cols}
                        onChange={(e) => updateCategory(idx, 'cols', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-[#181f2e] border border-[#242f44] rounded-lg text-xs text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={submitting || !selectedScreenId}
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-900/40"
            >
              <CheckCircle className="w-4 h-4" />
              <span>
                {submitting
                  ? 'Saving Seat Layout...'
                  : `Generate & Save ${totalSeatsToGenerate} Seats`}
              </span>
            </button>
          </form>
        </div>

        {/* Live Visual Preview */}
        <div className="bg-[#121722] rounded-2xl border border-[#242f44] p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#242f44]">
              <h4 className="font-bold text-white text-base">Layout Preview</h4>
              <span className="text-xs font-semibold text-rose-400">
                Total: {totalSeatsToGenerate} seats
              </span>
            </div>

            {/* Screen indicator */}
            <div className="w-48 mx-auto screen-curve mb-6"></div>

            <div className="space-y-6 max-h-[420px] overflow-y-auto pr-2">
              {previewRows.map((cat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span className="uppercase text-rose-400">{cat.category}</span>
                    <span>{cat.totalSeats} seats</span>
                  </div>

                  <div className="space-y-1.5">
                    {cat.rows.map((row) => (
                      <div key={row.letter} className="flex items-center gap-1.5 justify-center">
                        <span className="w-4 text-[10px] font-bold text-slate-500 text-right">
                          {row.letter}
                        </span>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {row.seats.map((seatName) => (
                            <div
                              key={seatName}
                              className="w-6 h-6 rounded bg-[#181f2e] border border-slate-700 flex items-center justify-center text-[9px] text-slate-300 font-medium"
                            >
                              {seatName}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center mt-4">
            Seat rows will be named sequentially starting from row 'A'.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SeatLayoutTab;
