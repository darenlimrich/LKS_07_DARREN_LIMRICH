import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [violations, setViolations] = useState<Record<string, { message: string }>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setViolations({}); setError(''); setLoading(true);
    try {
      const res = await api.post('/auth/signup', form);
      const token = res.data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('username', form.username);
      localStorage.setItem('role', 'user');
      navigate('/discover-games');
    } catch (err: any) {
      if (err.response?.data?.violations) {
        setViolations(err.response.data.violations);
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>

                <div className="hero py-5 bg-light">
              <div className='container text-center'>
                <h2 className='mb-3'>
                  Sign Up - Gaming Portal
                </h2>
                <div className='text-muted'>
               Lorem ipsum, dolor sit amet consectetur adipisicing elit.

                </div>
            </div>
          </div>
      <section className="login">
        <div className="container">

          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-6">
              <div className="card card-default">
                <div className="card-body">
                  <h3 className="mb-3">Sign Up</h3>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <form onSubmit={handleSubmit}>
                    <div className="form-group my-3">
                      <label htmlFor="username" className="mb-1 text-muted">Username</label>
                      <input type="text" id="username" name="username" value={form.username}
                        onChange={e => setForm({ ...form, username: e.target.value })}
                        className={`form-control ${violations.username ? 'is-invalid' : ''}`}
                        autoFocus required />
                      {violations.username && <div className="invalid-feedback">{violations.username.message}</div>}
                    </div>
                    <div className="form-group my-3">
                      <label htmlFor="password" className="mb-1 text-muted">Password</label>
                      <input type="password" id="password" name="password" value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        className={`form-control ${violations.password ? 'is-invalid' : ''}`}
                        required />
                      {violations.password && <div className="invalid-feedback">{violations.password.message}</div>}
                    </div>
                    <div className="mt-4 row">
                      <div className="col">
                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                          {loading ? 'Registering...' : 'Sign Up'}
                        </button>
                      </div>
                      <div className="col">
                        <Link to="/" className="btn btn-danger w-100">Sign In</Link>
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

export default SignUp;
