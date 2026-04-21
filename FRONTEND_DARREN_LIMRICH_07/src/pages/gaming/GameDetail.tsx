import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import GamingNavbar from '../../components/GamingNavbar';
import api, { API_BASE } from '../../api/axios';
import defaultThumbnail from '../../assets/default-thumbnail.png';

interface ScoreEntry { username: string; score: number; timestamp: string; }
interface GameData {
  slug: string; title: string; description: string;
  thumbnail: string | null; uploadTimestamp: string | null;
  author: string; scoreCount: number; gamePath: string | null;
}

function GameDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [game, setGame]           = useState<GameData | null>(null);
  const [scores, setScores]       = useState<ScoreEntry[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [scoreInput, setScoreInput] = useState('');
  const [scoreMsg, setScoreMsg]   = useState('');
  const currentUsername = localStorage.getItem('username') || '';
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadScores = async () => {
    try { const res = await api.get(`/games/${slug}/scores`); setScores(res.data.scores || []); }
    catch {}
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [gameRes] = await Promise.all([api.get(`/games/${slug}`), loadScores()]);
        setGame(gameRes.data);
      }
      catch (err: any) { setError(err.response?.status === 404 ? 'Game not found.' : 'Failed to load game.'); }
      finally { setLoading(false); }
    };
    load();
    pollingRef.current = setInterval(loadScores, 5000);
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [slug]);

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault(); setScoreMsg('');
    try {
      await api.post(`/games/${slug}/scores`, { score: parseFloat(scoreInput) });
      setScoreMsg('Score submitted!');
      setScoreInput('');
      loadScores();
    }
    catch { setScoreMsg('Failed to submit score.'); }
  };

  if (loading) return <div><GamingNavbar /><main><div className="text-center py-5"><div className="spinner-border" role="status" /></div></main></div>;
  if (error)   return <div><GamingNavbar /><main><div className="container py-5"><div className="alert alert-danger">{error}</div><Link to="/discover-games" className="btn btn-danger">Back</Link></div></main></div>;

  const userRankIdx       = scores.findIndex(s => s.username === currentUsername);
  const top10             = scores.slice(0, 10);
  const currentUserInTop10 = userRankIdx >= 0 && userRankIdx < 10;
  const currentUserBelow  = userRankIdx >= 10 ? scores[userRankIdx] : null;
  const thumbnail = game?.thumbnail ? `${API_BASE}${game.thumbnail}` : null;
  const gameUrl   = game?.gamePath  ? `${API_BASE}${game.gamePath}`  : null;

  return (
    <div>
      <GamingNavbar />
      <main>
        <div className="hero py-5 bg-light">
          <div className="container text-center">
            <h2 className="mb-1">{game?.title}</h2>
            <Link to={`/users/${game?.author}`} className="btn btn-success">By {game?.author}</Link>
            <div className="text-muted mt-2">{game?.description}</div>
            {game?.uploadTimestamp && (
              <h5 className="mt-2">Last Updated: {new Date(game.uploadTimestamp).toLocaleString()}</h5>
            )}
          </div>
        </div>

        <div className="py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-5 col-md-6">
                <div className="row">
                  <div className="col">
                    <div className="card mb-3">
                      <div className="card-body">
                        <h5>Top 10 Leaderboard</h5>
                        {scores.length === 0
                          ? <p className="text-muted">No scores yet.</p>
                          : <ol>
                              {top10.map(entry => (
                                <li key={entry.username}>
                                  {entry.username === currentUsername
                                    ? <b>{entry.username} ({entry.score})</b>
                                    : <span>{entry.username} ({entry.score})</span>
                                  }
                                </li>
                              ))}
                            </ol>
                        }
                        {currentUserBelow && (
                          <div className="mt-2 border-top pt-2 text-muted">
                            <span>#{userRankIdx + 1} </span>
                            <b>{currentUserBelow.username} ({currentUserBelow.score})</b>
                            <span className="ms-1">(you)</span>
                          </div>
                        )}
                        {currentUserInTop10 && (
                          <div className="text-muted small mt-1">You are highlighted above.</div>
                        )}
                      </div>
                    </div>

                    <div className="card mb-3">
                      <div className="card-body">
                        <h6>Submit Your Score</h6>
                        {scoreMsg && <div className={`alert py-1 ${scoreMsg === 'Score submitted!' ? 'alert-success' : 'alert-danger'}`}>{scoreMsg}</div>}
                        <form onSubmit={handleSubmitScore} className="d-flex gap-2">
                          <input type="number" step="any" className="form-control" placeholder="Your score"
                            value={scoreInput} onChange={e => setScoreInput(e.target.value)} required />
                          <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                      </div>
                    </div>
                  </div>

                  <div className="col">
                    {thumbnail
                      ? <img src={thumbnail} alt={`${game?.title} thumbnail`} style={{ width: '100%' }} onError={e => { e.currentTarget.src = defaultThumbnail; }} />
                      : <img src={defaultThumbnail} alt="default thumbnail" style={{ width: '100%' }} />
                    }
                    {gameUrl
                      ? <a href={gameUrl} target="_blank" rel="noreferrer" className="btn btn-primary w-100 mb-2 mt-2">Play Game</a>
                      : <button className="btn btn-secondary w-100 mb-2 mt-2" disabled>No game available</button>
                    }
                    {currentUsername === game?.author && (
                      <button className="btn btn-outline-secondary w-100" onClick={() => navigate(`/manage-games/${slug}/update`)}>Manage This Game</button>
                    )}
                  </div>
                </div>

                <Link to="/discover-games" className="btn btn-danger w-100">Back</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default GameDetail;
