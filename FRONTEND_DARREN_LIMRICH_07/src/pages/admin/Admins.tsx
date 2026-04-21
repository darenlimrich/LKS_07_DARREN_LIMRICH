import { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import api from '../../api/axios';

interface Admin { username: string; last_login_at: string; created_at: string; updated_at: string; }

function Admins() {
  const [admins, setAdmins]   = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try   { const res = await api.get('/admins'); setAdmins(res.data.content || []); }
    catch { setError('Failed to load admins.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const fmt = (d: string) => d ? new Date(d).toLocaleString() : '-';

  return (
    <div>
      <AdminNavbar />
      <main>
        <div className="hero py-5 bg-light">
          <div className="container text-center"><h1>Administrators</h1></div>
        </div>
        <div className="list-form py-5">
          <div className="container">
            {error   && <div className="alert alert-danger">{error}</div>}
            {loading && <div className="text-center py-4"><div className="spinner-border" role="status" /></div>}
            {!loading && (
              <table className="table table-striped">
                <thead>
                  <tr><th>Username</th><th>Last Login</th><th>Created At</th><th>Updated At</th></tr>
                </thead>
                <tbody>
                  {admins.length === 0 && <tr><td colSpan={4} className="text-center text-muted">No admins found.</td></tr>}
                  {admins.map(a => (
                    <tr key={a.username}>
                      <td>{a.username}</td>
                      <td>{fmt(a.last_login_at)}</td>
                      <td>{fmt(a.created_at)}</td>
                      <td>{fmt(a.updated_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Admins;
