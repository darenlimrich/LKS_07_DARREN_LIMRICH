import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import api from '../../api/axios';

interface User {
  id: number; username: string;
  last_login_at: string; created_at: string; updated_at: string;
  deleted_at?: string | null;
}

function Users() {
  const [users, setUsers]           = useState<User[]>([]);
  const [totalElements, setTotal]   = useState(0);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res = await api.get('/users');
      setUsers(res.data.content || []);
      setTotal(res.data.totalElements || 0);
    }
    catch { setError('Failed to load users.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleLock = async (id: number, reason: string) => {
    try   { await api.delete(`/users/${id}`, { data: { delete_reason: reason } }); load(); }
    catch { setError('Failed to lock user.'); }
  };

  const handleUnlock = async (id: number) => {
    try   { await api.delete(`/users/${id}`, { params: { action: 'restore' } }); load(); }
    catch { setError('Failed to unlock user.'); }
  };

  const handleDelete = async (id: number, username: string) => {
    if (!window.confirm(`Delete user "${username}"?`)) return;
    try   { await api.delete(`/users/${id}`); load(); }
    catch { setError('Failed to delete user.'); }
  };

  const fmt       = (d: string) => d ? new Date(d).toLocaleString() : '-';
  const isBlocked = (u: User) => !!u.deleted_at;

  return (
    <div>
      <AdminNavbar />
      <main>
        <div className="hero py-5 bg-light">
          <div className="container">
            <Link to="/admin/users/create" className="btn btn-primary">Add User</Link>
          </div>
        </div>

        <div className="list-form py-5">
          <div className="container">
            <h6 className="mb-3">List Users ({totalElements})</h6>
            {error   && <div className="alert alert-danger">{error}</div>}
            {loading && <div className="text-center py-4"><div className="spinner-border" role="status" /></div>}

            {!loading && (
              <table className="table table-striped">
                <thead>
                  <tr><th>Username</th><th>Created At</th><th>Last Login</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {users.length === 0 && <tr><td colSpan={5} className="text-center text-muted">No users found.</td></tr>}
                  {users.map(user => (
                    <tr key={user.id}>
                      <td><a href={`/users/${user.username}`} target="_blank" rel="noreferrer">{user.username}</a></td>
                      <td>{fmt(user.created_at)}</td>
                      <td>{fmt(user.last_login_at)}</td>
                      <td>
                        {isBlocked(user)
                          ? <span className="bg-danger text-white p-1 d-inline-block">Blocked</span>
                          : <span className="bg-success text-white p-1 d-inline-block">Active</span>
                        }
                      </td>
                      <td>
                        {isBlocked(user) ? (
                          <button className="btn btn-sm btn-primary me-1" onClick={() => handleUnlock(user.id)}>Unlock</button>
                        ) : (
                          <div className="btn-group me-1" role="group">
                            <button type="button" className="btn btn-primary btn-sm dropdown-toggle" data-bs-toggle="dropdown">Lock</button>
                            <ul className="dropdown-menu">
                              <li><button className="dropdown-item" onClick={() => handleLock(user.id, 'spamming')}>Spamming</button></li>
                              <li><button className="dropdown-item" onClick={() => handleLock(user.id, 'cheating')}>Cheating</button></li>
                              <li><button className="dropdown-item" onClick={() => handleLock(user.id, 'other')}>Other</button></li>
                            </ul>
                          </div>
                        )}
                        <Link to={`/admin/users/${user.id}/update`} className="btn btn-sm btn-secondary me-1">Update</Link>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user.id, user.username)}>Delete</button>
                      </td>
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

export default Users;
