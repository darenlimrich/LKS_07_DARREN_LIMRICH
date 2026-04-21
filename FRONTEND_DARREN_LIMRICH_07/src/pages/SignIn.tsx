import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function SignIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/signin', form);
      const token = res.data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('username', form.username);

      try {
        await api.get('/admins', { headers: { Authorization: `Bearer ${token}` } });
        localStorage.setItem('role', 'admin');
        navigate('/admin/dashboard');
      } catch {
        localStorage.setItem('role', 'user');
        navigate('/discover-games');
      }
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.data?.status === 'invalid') {
        setError('Wrong username or password.');
      } else if (err.response?.status === 403 && err.response?.data?.status === 'blocked') {
        setError(`Your account is blocked. Reason: ${err.response.data.reason}`);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="login">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-6">
              <h1 className="text-center mb-4">Gaming Portal</h1>
              <div className="card card-default">
                <div className="card-body">
                  <h3 className="mb-3">Sign In</h3>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <form onSubmit={handleSubmit}>
                    <div className="form-group my-3">
                      <label htmlFor="username" className="mb-1 text-muted">Username</label>
                      <input type="text" id="username" name="username" value={form.username}
                        onChange={e => setForm({ ...form, username: e.target.value })}
                        className="form-control" autoFocus required />
                    </div>
                    <div className="form-group my-3">
                      <label htmlFor="password" className="mb-1 text-muted">Password</label>
                      <input type="password" id="password" name="password" value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        className="form-control" required />
                    </div>
                    <div className="mt-4 row">
                      <div className="col">
                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                          {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                      </div>
                      <div className="col">
                        <Link to="/signup" className="btn btn-danger w-100">Sign Up</Link>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SignIn;
