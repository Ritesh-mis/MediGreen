import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Departments from './pages/Departments';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="departments" element={<Departments />} />
              <Route path="doctors" element={<Doctors />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="booking" element={<Booking />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="admin" element={<Admin />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
