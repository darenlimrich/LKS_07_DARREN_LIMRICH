import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GamingNavbar from '../../components/GamingNavbar';
import api, { API_BASE } from '../../api/axios';
import defaultThumbnail from '../../assets/default-thumbnail.png';

interface Game { slug: string; title: string; description: string; thumbnail: string | null; scoreCount: number; }

function ManageGames() {
  const [games, setGames]     = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const username = localStorage.getItem('username') || '';

  const load = async () => {
    setLoading(true); setError('');
    try   { const res = await api.get(`/users/${username}`); setGames(res.data.authoredGames || []); }
    catch { setError('Failed to load games.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (slug: string) => {
    if (!window.confirm(`Are you sure you want to delete "${slug}"?`)) return;
    try   { await api.delete(`/games/${slug}`); load(); }
    catch { setError('Failed to delete game.'); }
  };

  return (
    <div>
      <GamingNavbar />
      <main>
        <div className="hero py-5 bg-light">
          <div className="container">
            <Link to="/manage-games/create" className="btn btn-primary">Add Game</Link>
          </div>
        </div>

        <div className="list-form py-5">
          <div className="container">
            <h6 className="mb-3">List Games</h6>
            {error   && <div className="alert alert-danger">{error}</div>}
            {loading && <div className="text-center py-4"><div className="spinner-border" role="status" /></div>}

            {!loading && (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th style={{ width: '100px' }}>Thumbnail</th>
                    <th style={{ width: '200px' }}>Title</th>
                    <th>Description</th>
                    <th style={{ width: '200px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {games.length === 0 && (
                    <tr><td colSpan={4} className="text-center text-muted">No games yet. Add your first game!</td></tr>
                  )}
                  {games.map(game => (
                    <tr key={game.slug}>
                      <td>
                        {game.thumbnail
                          ? <img src={`${API_BASE}${game.thumbnail}`} alt={game.title} style={{ width: '80px' }} onError={e => { e.currentTarget.src = defaultThumbnail; }} />
                          : <img src={defaultThumbnail} alt="default thumbnail" style={{ width: '80px' }} />
                        }
                      </td>
                      <td>{game.title}</td>
                      <td>{game.description?.substring(0, 100)}{game.description?.length > 100 ? '...' : ''}</td>
                      <td>
                        <Link to={`/games/${game.slug}`} className="btn btn-sm btn-primary me-1">Detail</Link>
                        <Link to={`/manage-games/${game.slug}/update`} className="btn btn-sm btn-secondary me-1">Update</Link>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(game.slug) } >Delete</button>
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

export default ManageGames;
