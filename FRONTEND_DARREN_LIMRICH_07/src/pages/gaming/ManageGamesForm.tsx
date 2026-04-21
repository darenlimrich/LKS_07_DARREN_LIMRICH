import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GamingNavbar from '../../components/GamingNavbar';
import api from '../../api/axios';

function ManageGamesForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '' });
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [violations, setViolations] = useState<Record<string, { message: string }>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setViolations({}); setError('');

    if (thumbnail && !zipFile) {
      setError('Please also select a ZIP file — thumbnail can only be uploaded together with a game version (ZIP).');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/games', form);
      const slug = res.data.slug;

      if (zipFile && slug) {
        const formData = new FormData();
        formData.append('zipfile', zipFile);
        if (thumbnail) formData.append('thumbnail', thumbnail);
        formData.append('token', localStorage.getItem('token') || '');
        await api.post(`/games/${slug}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      navigate('/manage-games');
    } catch (err: any) {
      if (err.response?.data?.violations) {
        setViolations(err.response.data.violations);
      } else if (err.response?.data?.slug) {
        setError(err.response.data.slug);
      } else {
        setError(err.response?.data?.message || 'Failed to create game.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <GamingNavbar />
      <main>
        <div className="hero py-5 bg-light">
          <div className="container text-center">
            <h2>Add New Game</h2>
          </div>
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
                          className={`form-control ${violations.title ? 'is-invalid' : ''}`}
                          placeholder="Game title" required />
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
                          className={`form-control ${violations.description ? 'is-invalid' : ''}`}
                          placeholder="Game description" rows={5} />
                        {violations.description && <div className="invalid-feedback">{violations.description.message}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="card card-default my-4">
                    <div className="card-body">
                      <div className="form-group">
                        <label htmlFor="thumbnail" className="mb-1 text-muted">Thumbnail <span className="text-muted small">(optional, requires ZIP)</span></label>
                        <input type="file" id="thumbnail" accept="image/*" className="form-control"
                          onChange={e => setThumbnail(e.target.files?.[0] || null)} />
                      </div>
                    </div>
                  </div>

                  <div className="card card-default my-4">
                    <div className="card-body">
                      <div className="form-group">
                        <label htmlFor="zipfile" className="mb-1 text-muted">Game File (ZIP) <span className="text-muted small">(optional - can upload later)</span></label>
                        <input type="file" id="zipfile" accept=".zip" className="form-control"
                          onChange={e => setZipFile(e.target.files?.[0] || null)} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 row">
                    <div className="col">
                      <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? 'Saving...' : 'Create Game'}
                      </button>
                    </div>
                    <div className="col">
                      <Link to="/manage-games" className="btn btn-danger w-100">Back</Link>
                    </div>
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

export default ManageGamesForm;
