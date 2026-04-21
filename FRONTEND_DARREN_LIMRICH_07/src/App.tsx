import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

import DiscoverGames from './pages/gaming/DiscoverGames';
import GameDetail from './pages/gaming/GameDetail';
import ManageGames from './pages/gaming/ManageGames';
import ManageGamesForm from './pages/gaming/ManageGamesForm';
import ManageGamesFormUpdate from './pages/gaming/ManageGamesFormUpdate';
import Profile from './pages/gaming/Profile';

import AdminDashboard from './pages/admin/Dashboard';
import AdminAdmins from './pages/admin/Admins';
import AdminUsers from './pages/admin/Users';
import AdminUsersForm from './pages/admin/UsersForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/discover-games" element={<ProtectedRoute allowedRoles={['user']}><DiscoverGames /></ProtectedRoute>} />
        <Route path="/games/:slug" element={<ProtectedRoute allowedRoles={['user']}><GameDetail /></ProtectedRoute>} />
        <Route path="/manage-games" element={<ProtectedRoute allowedRoles={['user']}><ManageGames /></ProtectedRoute>} />
        <Route path="/manage-games/create" element={<ProtectedRoute allowedRoles={['user']}><ManageGamesForm /></ProtectedRoute>} />
        <Route path="/manage-games/:slug/update" element={<ProtectedRoute allowedRoles={['user']}><ManageGamesFormUpdate /></ProtectedRoute>} />
        <Route path="/users/:username" element={<ProtectedRoute allowedRoles={['user']}><Profile /></ProtectedRoute>} />

        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/admins" element={<ProtectedRoute allowedRoles={['admin']}><AdminAdmins /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/users/create" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsersForm /></ProtectedRoute>} />
        <Route path="/admin/users/:id/update" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsersForm /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
