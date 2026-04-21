import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import GamingNavbar from '../../components/GamingNavbar';
import api, { API_BASE } from '../../api/axios';

function ManageGamesFormUpdate() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [form, setForm]             = useState({ title: '', description: '' });
  const [gameData, setGameData]     = useState<any>(null);
  const [zipFile, setZipFile]       = useState<File | null>(null);
  const [thumbnail, setThumbnail]   = useState<File | null>(null);
  const [violations, setViolations] = useState<Record<string, { message: string }>>({});
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const username = localStorage.getItem('username') || '';

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/games/${slug}`);
        if (res.data.author !== username) { navigate(`/games/${slug}`); return; }
        setGameData(res.data);
        setForm({ title: res.data.title, description: res.data.description });
      }
      catch { setError('Failed to load game data.'); }
      finally { setPageLoading(false); }
    };
    load();
  }, [slug]);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${form.title}"? This cannot be undone.`)) return;
    try   { await api.delete(`/games/${slug}`); navigate('/manage-games'); }
    catch { setError('Failed to delete game.'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setViolations({}); setError('');

    if (thumbnail && !zipFile) {
      setError('Please also select a ZIP file — thumbnail can only be uploaded together with a game version (ZIP).');
      return;
    }

    setLoading(true);
    try {
      await api.put(`/games/${slug}`, { title: form.title, description: form.description });

      if (zipFile) {
        const formData = new FormData();
        formData.append('zipfile', zipFile);
        if (thumbnail) formData.append('thumbnail', thumbnail);
        formData.append('token', localStorage.getItem('token') || '');
        await api.post(`/games/${slug}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      navigate('/manage-games');
    }
    catch (err: any) {
      if (err.response?.data?.violations) setViolations(err.response.data.violations);
      else setError(err.response?.data?.message || 'Failed to update game.');
    }
    finally { setLoading(false); }
  };

  if (pageLoading) return <div><GamingNavbar /><main><div className="text-center py-5"><div className="spinner-border" role="status" /></div></main></div>;

  return (
    <div>
      <GamingNavbar />
      <main>
        <div className="hero py-5 bg-light">
          <div className="container text-center"><h2>Update Game</h2></div>
        </div>

        <div className="py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-5 col-md-6">
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="card card-default my-4">
                    <div className="card-body">
                      <div className="form-group">
                        <label htmlFor="title" className="mb-1 text-muted">Title <span className="text-danger">*</span></label>
                        <input id="title" type="text" value={form.title}
                          onChange={e => setForm({ ...form, title: e.target.value })}
                          className={`form-control ${violations.title ? 'is-invalid' : ''}`} required />
                        {violations.title && <div className="invalid-feedback">{violations.title.message}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="card card-default my-4">
                    <div className="card-body">
                      <div className="form-group">
                        <label htmlFor="description" className="mb-1 text-muted">Description <span className="text-danger">*</span></label>
                        <textarea id="description" value={form.description}
                          onChange={e => setForm({ ...form, description: e.target.value })}
                          className={`form-control ${violations.description ? 'is-invalid' : ''}`} rows={5} />
                        {violations.description && <div className="invalid-feedback">{violations.description.message}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="card card-default my-4">
                    <div className="card-body">
                      <div className="form-group">
                        <label htmlFor="thumbnail" className="mb-1 text-muted">Thumbnail <span className="text-success">(optional - replaces existing)</span></label>
                        <input type="file" id="thumbnail" accept="image/*" className="form-control"
                          onChange={e => setThumbnail(e.target.files?.[0] || null)} />
                        {gameData?.thumbnail && (
                          <img src={`${API_BASE}${gameData.thumbnail}`} alt="Current thumbnail" width={80} className="mt-2" onError={e => (e.currentTarget.style.display = 'none')} />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="card card-default my-4">
                    <div className="card-body">
                      <div className="form-group">
                        <label htmlFor="game" className="mb-1 text-muted">Upload New Version (ZIP) <span className="text-success">(optional)</span></label>
                        <input type="file" id="game" accept=".zip" className="form-control"
                          onChange={e => setZipFile(e.target.files?.[0] || null)} />
                        {gameData?.gamePath && (
                          <div className="mt-2 text-muted small">Current version available at: {gameData.gamePath}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 row">
                    <div className="col">
                      <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? 'Saving...' : 'Update Game'}
                      </button>
                    </div>
                    <div className="col">
                      <Link to="/manage-games" className="btn btn-secondary w-100">Back</Link>
                    </div>
                  </div>
                  <div className="mt-3">
                    <button type="button" className="btn btn-danger w-100" onClick={handleDelete}>Delete Game</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ManageGamesFormUpdate;
