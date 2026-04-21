import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function GamingNavbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';

  const handleSignOut = async () => {
    try { await api.post('/auth/signout'); } catch (_) {}
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top bg-primary navbar-dark">
      <div className="container">
        <Link className="navbar-brand" to="/discover-games">Gaming Portal</Link>
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
          <li><Link to="/discover-games" className="nav-link px-2 text-white">Discover Games</Link></li>
          <li><Link to="/manage-games" className="nav-link px-2 text-white">Manage Games</Link></li>
          <li><Link to={`/users/${username}`} className="nav-link px-2 text-white">User Profile</Link></li>
          <li className="nav-item">
            <span className="nav-link bg-dark px-2">Welcome, {username}</span>
          </li>
          <li className="nav-item">
            <button onClick={handleSignOut} className="btn bg-white text-primary ms-4">Sign Out</button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default GamingNavbar;
