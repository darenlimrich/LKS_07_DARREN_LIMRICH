import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GamingNavbar from '../../components/GamingNavbar';
import api, { API_BASE } from '../../api/axios';
import defaultThumbnail from '../../assets/default-thumbnail.png';

interface Game { slug: string; title: string; description: string; thumbnail: string | null; uploadTimestamp: string; author: string; scoreCount: number; }

const SIZE = 10;

function DiscoverGames() {
  const navigate = useNavigate();
  const [games, setGames]           = useState<Game[]>([]);
  const [page, setPage]             = useState(0);
  const [totalElements, setTotal]   = useState(0);
  const [hasMore, setHasMore]       = useState(true);
  const [sortBy, setSortBy]         = useState('popular');
  const [sortDir, setSortDir]       = useState('asc');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async (pageNum: number, reset = false) => {
    if (loading) return;
    setLoading(true); setError('');
    try {
      const apiDir = sortBy === 'title' ? sortDir : (sortDir === 'asc' ? 'desc' : 'asc');
      const res = await api.get('/games', { params: { page: pageNum, size: SIZE, sortBy, sortDir: apiDir } });
      const { content, totalElements: total } = res.data;
      setTotal(total);
      setGames(prev => reset ? content : [...prev, ...content]);
      setHasMore((pageNum + 1) * SIZE < total);
      setPage(pageNum + 1);
    }
    catch { setError('Failed to load games.'); }
    finally { setLoading(false); }
  }, [sortBy, sortDir]);

  useEffect(() => {
    setGames([]); setPage(0); setHasMore(true);
    load(0, true);
  }, [sortBy, sortDir]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) load(page);
    }, { threshold: 0.1 });
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, page, load]);

  const handleSort = (newSortBy: string) => {
    if (newSortBy === sortBy) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(newSortBy); setSortDir('asc'); }
  };

  return (
    <div>
      <GamingNavbar />
      <main>
        <div className="hero py-5 bg-light">
          <div className="container text-center"><h1>Discover Games</h1></div>
        </div>

        <div className="list-form py-5">
          <div className="container">
            <div className="row mb-3">
              <div className="col">
                <h2 className="mb-0">{totalElements} Game{totalElements !== 1 ? 's' : ''} Available</h2>
              </div>
              <div className="col-lg-8 text-end">
                <div className="btn-group me-2" role="group">
                  <button className={`btn ${sortBy === 'popular'    ? 'btn-secondary' : 'btn-outline-primary'}`} onClick={() => handleSort('popular')}>Popularity</button>
                  <button className={`btn ${sortBy === 'uploaddate' ? 'btn-secondary' : 'btn-outline-primary'}`} onClick={() => handleSort('uploaddate')}>Recently Updated</button>
                  <button className={`btn ${sortBy === 'title'      ? 'btn-secondary' : 'btn-outline-primary'}`} onClick={() => handleSort('title')}>Alphabetically</button>
                </div>
                <div className="btn-group" role="group">
                  <button className={`btn ${sortDir === 'asc'  ? 'btn-secondary' : 'btn-outline-primary'}`} onClick={() => setSortDir('asc')}>ASC</button>
                  <button className={`btn ${sortDir === 'desc' ? 'btn-secondary' : 'btn-outline-primary'}`} onClick={() => setSortDir('desc')}>DESC</button>
                </div>
              </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row">
              {games.map(game => (
                <div className="col-md-6" key={game.slug}>
                  <a href={`/games/${game.slug}`}
                    onClick={e => { e.preventDefault(); navigate(`/games/${game.slug}`); }}
                    className="card card-default mb-3">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-4">
                          {game.thumbnail
                            ? <img src={`${API_BASE}${game.thumbnail}`} alt={`${game.title} thumbnail`} style={{ width: '100%' }} onError={e => { e.currentTarget.src = defaultThumbnail; }} />
                            : <img src={defaultThumbnail} alt="default thumbnail" style={{ width: '100%' }} />
                          }
                        </div>
                        <div className="col">
                          <h5 className="mb-1">{game.title} <small className="text-muted">By {game.author}</small></h5>
                          <div>{game.description?.substring(0, 150)}{game.description?.length > 150 ? '...' : ''}</div>
                          <hr className="mt-1 mb-1" />
                          <div className="text-muted">#scores submitted : {game.scoreCount}</div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>

            {loading && <div className="text-center py-4"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>}

            <div ref={sentinelRef} style={{ height: '1px' }} />

            {!hasMore && games.length > 0 && <div className="text-center text-muted py-3">All games loaded.</div>}
          </div>
        </div>
      </main>
    </div>
  );
}

export default DiscoverGames;
