import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import api from '../../api/axios';

function UsersForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const [form, setForm] = useState({ username: '', password: '' });
  const [violations, setViolations] = useState<Record<string, { message: string }>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      try {
        const res = await api.get('/users');
        const user = (res.data.content || []).find((u: any) => String(u.id) === id);
        if (user) setForm(f => ({ ...f, username: user.username }));
      } catch {}
    };
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setViolations({}); setError(''); setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/users/${id}`, form);
      } else {
        await api.post('/users', form);
      }
      navigate('/admin/users');
    } catch (err: any) {
      if (err.response?.data?.violations) {
        setViolations(err.response.data.violations);
      } else {
        setError(err.response?.data?.message || 'Failed to save user.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <main>
        <div className="hero py-5 bg-light">
          <div className="container text-center">
            <h2>{isEdit ? 'Update User' : 'Add User'}</h2>
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
                        <label htmlFor="username" className="mb-1 text-muted">Username <span className="text-danger">*</span></label>
                        <input id="username" type="text" value={form.username}
                          onChange={e => setForm({ ...form, username: e.target.value })}
                          className={`form-control ${violations.username ? 'is-invalid' : ''}`}
                          required />
                        {violations.username && <div className="invalid-feedback">{violations.username.message}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="card card-default my-4">
                    <div className="card-body">
                      <div className="form-group">
                        <label htmlFor="password" className="mb-1 text-muted">
                          Password {isEdit && <span className="text-muted small">(leave blank to keep current)</span>}
                          {!isEdit && <span className="text-danger"> *</span>}
                        </label>
                        <input id="password" type="password" value={form.password}
                          onChange={e => setForm({ ...form, password: e.target.value })}
                          className={`form-control ${violations.password ? 'is-invalid' : ''}`}
                          required={!isEdit} />
                        {violations.password && <div className="invalid-feedback">{violations.password.message}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 row">
                    <div className="col">
                      <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? 'Saving...' : (isEdit ? 'Update User' : 'Create User')}
                      </button>
                    </div>
                    <div className="col">
                      <Link to="/admin/users" className="btn btn-danger w-100">Back</Link>
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

export default UsersForm;
