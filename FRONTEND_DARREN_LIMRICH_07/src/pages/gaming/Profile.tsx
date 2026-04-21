import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import GamingNavbar from '../../components/GamingNavbar';
import api, { API_BASE } from '../../api/axios';
import defaultThumbnail from '../../assets/default-thumbnail.png';

interface AuthoredGame { slug: string; title: string; description: string; thumbnail: string | null; scoreCount: number; }
interface HighscoreEntry { game: { slug: string; title: string; description: string; }; score: number; timestamp: string; }
interface UserProfile {
  username: string;
  registeredTimestamp: string;
  authoredGames: AuthoredGame[];
  highscores: HighscoreEntry[];
}

function Profile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    const load = async () => {
      try   { const res = await api.get(`/users/${username}`); setUserData(res.data); }
      catch (err: any) { setError(err.response?.status === 404 ? 'User not found.' : 'Failed to load profile.'); }
      finally { setLoading(false); }
    };
    load();
  }, [username]);

  if (loading) return <div><GamingNavbar /><main><div className="text-center py-5"><div className="spinner-border" role="status" /></div></main></div>;
  if (error)   return <div><GamingNavbar /><main><div className="container py-5"><div className="alert alert-danger">{error}</div><Link to="/discover-games" className="btn btn-danger">Back</Link></div></main></div>;

  const sortedHighscores = [...(userData?.highscores || [])].sort((a, b) => a.game.title.localeCompare(b.game.title));

  return (
    <div>
      <GamingNavbar />
      <main>
        <div className="hero py-5 bg-light">
          <div className="container text-center">
            <h2 className="mb-1">{userData?.username}</h2>
            <h5 className="mt-2">Registered: {userData?.registeredTimestamp ? new Date(userData.registeredTimestamp).toLocaleString() : ''}</h5>
          </div>
        </div>

        <div className="py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-5 col-md-6">

                {sortedHighscores.length > 0 && (
                  <>
                    <h5>Highscores per Game</h5>
                    <div className="card-body mb-3">
                      <ol>
                        {sortedHighscores.map(entry => (
                          <li key={entry.game.slug}>
                            <Link to={`/games/${entry.game.slug}`}>{entry.game.title} ({entry.score})</Link>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </>
                )}

                {userData?.authoredGames && userData.authoredGames.length > 0 && (
                  <>
                    <h5>Authored Games</h5>
                    {userData.authoredGames.map(game => (
                      <a key={game.slug} href={`/games/${game.slug}/`}
                        onClick={e => { e.preventDefault(); navigate(`/games/${game.slug}`); }}
                        className="card card-default mb-3">
                        <div className="card-body">
                          <div className="row">
                            <div className="col-4">
                              {game.thumbnail
                                ? <img src={`${API_BASE}${game.thumbnail}`} alt={game.title} style={{ width: '100%' }} onError={e => { e.currentTarget.src = defaultThumbnail; }} />
                                : <img src={defaultThumbnail} alt="default thumbnail" style={{ width: '100%' }} />
                              }
                            </div>
                            <div className="col">
                              <h5 className="mb-1">{game.title}</h5>
                              <div>{game.description?.substring(0, 100)}{game.description?.length > 100 ? '...' : ''}</div>
                              <div className="text-muted small mt-1">#scores submitted: {game.scoreCount}</div>
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </>
                )}

                {!userData?.authoredGames?.length && !sortedHighscores.length && (
                  <div className="alert alert-info">No activity yet.</div>
                )}

                <Link to="/discover-games" className="btn btn-danger w-100">Back</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
