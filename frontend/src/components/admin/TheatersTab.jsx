import React, { useState, useEffect } from 'react';
import { Building2, Plus, Monitor, RefreshCw, MapPin } from 'lucide-react';
import { getTheaters, createTheater, createScreen, getScreens } from '../../api/theaters';
import Alert from '../common/Alert';

export const TheatersTab = () => {
  const [theaters, setTheaters] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingScreens, setLoadingScreens] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form states
  const [theaterName, setTheaterName] = useState('');
  const [theaterAddress, setTheaterAddress] = useState('');
  const [screenName, setScreenName] = useState('');
  const [creatingTheater, setCreatingTheater] = useState(false);
  const [creatingScreen, setCreatingScreen] = useState(false);

  const fetchTheaters = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTheaters();
      setTheaters(data);
      if (data.length > 0 && !selectedTheater) {
        setSelectedTheater(data[0]);
      }
    } catch (err) {
      setError(err.backendMessage || err.message || 'Failed to load theaters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheaters();
  }, []);

  useEffect(() => {
    if (selectedTheater) {
      fetchScreens(selectedTheater.id);
    } else {
      setScreens([]);
    }
  }, [selectedTheater]);

  const fetchScreens = async (theaterId) => {
    try {
      setLoadingScreens(true);
      const data = await getScreens(theaterId);
      setScreens(data);
    } catch (err) {
      setError(err.backendMessage || err.message || 'Failed to load screens');
    } finally {
      setLoadingScreens(false);
    }
  };

  const handleCreateTheater = async (e) => {
    e.preventDefault();
    try {
      setCreatingTheater(true);
      setError(null);
      setSuccess(null);
      const newTheater = await createTheater({
        name: theaterName,
        address: theaterAddress,
      });
      setSuccess(`Theater "${newTheater.name}" created successfully!`);
      setTheaterName('');
      setTheaterAddress('');
      await fetchTheaters();
      setSelectedTheater(newTheater);
    } catch (err) {
      setError(err.backendMessage || err.message || 'Failed to create theater');
    } finally {
      setCreatingTheater(false);
    }
  };

  const handleCreateScreen = async (e) => {
    e.preventDefault();
    if (!selectedTheater) {
      setError('Please select a theater first');
      return;
    }

    try {
      setCreatingScreen(true);
      setError(null);
      setSuccess(null);
      await createScreen({
        screenName,
        theaterId: selectedTheater.id,
      });
      setSuccess(`Screen "${screenName}" added to ${selectedTheater.name}!`);
      setScreenName('');
      await fetchScreens(selectedTheater.id);
    } catch (err) {
      setError(err.backendMessage || err.message || 'Failed to create screen');
    } finally {
      setCreatingScreen(false);
    }
  };

  return (
    <div className="space-y-8">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Theater Section */}
        <div className="bg-[#121722] rounded-2xl border border-[#242f44] p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#242f44]">
            <Building2 className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-white text-base">Add New Cinema Theater</h3>
          </div>

          <form onSubmit={handleCreateTheater} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Theater Name
              </label>
              <input
                type="text"
                required
                value={theaterName}
                onChange={(e) => setTheaterName(e.target.value)}
                placeholder="e.g. PVR Cinemas - Forum Mall"
                className="w-full px-3.5 py-2.5 bg-[#0a0d14] border border-[#242f44] rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Full Address / Location
              </label>
              <input
                type="text"
                required
                value={theaterAddress}
                onChange={(e) => setTheaterAddress(e.target.value)}
                placeholder="e.g. Koramangala, Bengaluru"
                className="w-full px-3.5 py-2.5 bg-[#0a0d14] border border-[#242f44] rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              disabled={creatingTheater}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-rose-900/30"
            >
              <Plus className="w-4 h-4" />
              <span>{creatingTheater ? 'Creating...' : 'Save Theater'}</span>
            </button>
          </form>
        </div>

        {/* Create Screen Section */}
        <div className="bg-[#121722] rounded-2xl border border-[#242f44] p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#242f44]">
            <Monitor className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-white text-base">Add Screen to Theater</h3>
          </div>

          <form onSubmit={handleCreateScreen} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Select Theater
              </label>
              <select
                value={selectedTheater?.id || ''}
                onChange={(e) => {
                  const t = theaters.find((th) => th.id === e.target.value);
                  setSelectedTheater(t || null);
                }}
                className="w-full px-3.5 py-2.5 bg-[#0a0d14] border border-[#242f44] rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500"
              >
                {theaters.length === 0 && <option value="">No theaters available</option>}
                {theaters.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Screen / Auditorium Name
              </label>
              <input
                type="text"
                required
                value={screenName}
                onChange={(e) => setScreenName(e.target.value)}
                placeholder="e.g. Screen 1 - IMAX, Screen 2 - Dolby Atmos"
                className="w-full px-3.5 py-2.5 bg-[#0a0d14] border border-[#242f44] rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={creatingScreen || !selectedTheater}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-900/30"
            >
              <Plus className="w-4 h-4" />
              <span>{creatingScreen ? 'Adding Screen...' : 'Add Screen'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Theaters & Screens Explorer */}
      <div className="bg-[#121722] rounded-2xl border border-[#242f44] p-6">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#242f44]">
          <div>
            <h4 className="font-bold text-white text-base">Theaters & Screens Directory</h4>
            <p className="text-xs text-slate-400">Click a theater to view its configured auditoriums</p>
          </div>
          <button
            onClick={fetchTheaters}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {theaters.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-6 text-center">
            No theaters registered yet. Use the form above to add your first theater.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Theaters List */}
            <div className="space-y-2 border-r border-[#242f44] pr-4">
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                All Theaters
              </span>
              {theaters.map((t) => {
                const isSelected = selectedTheater?.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTheater(t)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-rose-950/40 border-rose-500 text-white'
                        : 'bg-[#0a0d14] border-[#242f44] text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-bold text-sm">{t.name}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      <span className="truncate">{t.address}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Screens List for Selected Theater */}
            <div className="md:col-span-2 pl-2">
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-3">
                Screens at {selectedTheater?.name || 'Selected Theater'}
              </span>

              {loadingScreens ? (
                <div className="py-8 text-center text-xs text-slate-400">Loading screens...</div>
              ) : screens.length === 0 ? (
                <div className="p-8 text-center bg-[#0a0d14] rounded-xl border border-dashed border-[#242f44]">
                  <Monitor className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">No screens added to this theater yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {screens.map((screen) => (
                    <div
                      key={screen.id}
                      className="p-3.5 bg-[#0a0d14] rounded-xl border border-[#242f44] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-950/50 border border-amber-500/30 flex items-center justify-center text-amber-400">
                          <Monitor className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-100">
                            {screen.screenName}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            ID: {screen.id.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TheatersTab;
