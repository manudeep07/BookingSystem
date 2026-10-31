import React, { useState, useEffect } from 'react';
import { Languages, Plus, RefreshCw, Globe } from 'lucide-react';
import { getLanguages, createLanguage } from '../../api/languages';
import Alert from '../common/Alert';

export const LanguagesTab = () => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLanguages();
      setLanguages(data);
    } catch (err) {
      setError(err.backendMessage || err.message || 'Failed to load languages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      const newLang = await createLanguage(name);
      setSuccess(`Language "${newLang.name}" created successfully!`);
      setName('');
      await fetchLanguages();
    } catch (err) {
      setError(err.backendMessage || err.message || 'Failed to create language');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Language Form */}
        <div className="bg-[#121722] rounded-2xl border border-[#242f44] p-6 shadow-xl h-fit">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#242f44]">
            <Languages className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-white text-base">Add Language</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Language Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. English, Hindi, Telugu, Tamil"
                className="w-full px-3.5 py-2.5 bg-[#0a0d14] border border-[#242f44] rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-rose-900/30"
            >
              <Plus className="w-4 h-4" />
              <span>{submitting ? 'Creating...' : 'Save Language'}</span>
            </button>
          </form>
        </div>

        {/* Existing Languages List */}
        <div className="lg:col-span-2 bg-[#121722] rounded-2xl border border-[#242f44] p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#242f44]">
            <div>
              <h4 className="font-bold text-white text-base">Supported Languages</h4>
              <p className="text-xs text-slate-400">Total {languages.length} languages</p>
            </div>
            <button
              onClick={fetchLanguages}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading languages...</div>
          ) : languages.length === 0 ? (
            <div className="p-8 text-center bg-[#0a0d14] rounded-xl border border-dashed border-[#242f44]">
              <Globe className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No languages registered yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {languages.map((l) => (
                <div
                  key={l.id}
                  className="p-3.5 bg-[#0a0d14] rounded-xl border border-[#242f44] flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-rose-950/40 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold text-xs uppercase">
                    {l.name.substring(0, 2)}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-white">{l.name}</h5>
                    <div className="text-[10px] text-slate-500 font-mono truncate">
                      ID: {l.id.substring(0, 8)}...
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

export default LanguagesTab;
