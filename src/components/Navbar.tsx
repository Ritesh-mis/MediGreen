import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Stethoscope, Menu, X, User, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Departments', path: '/departments' },
    { name: 'Doctors', path: '/doctors' },
  ];

  return (
    <nav className="bg-white border-b border-emerald-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-emerald-600 p-2 rounded-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-emerald-900">MediGreen</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-emerald-600",
                  location.pathname === link.path ? "text-emerald-600" : "text-emerald-900/70"
                )}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 text-sm font-medium text-emerald-900/70 hover:text-emerald-600"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Admin
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-sm font-medium text-emerald-900/70 hover:text-emerald-600"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-emerald-900/70 hover:text-emerald-600"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-emerald-900 p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-emerald-100 py-4 px-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-base font-medium text-emerald-900/70 hover:text-emerald-600 hover:bg-emerald-50 rounded-md"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-emerald-100 flex flex-col gap-2">
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-emerald-900/70 hover:text-emerald-600"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-emerald-900/70 hover:text-emerald-600"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-emerald-900/70 hover:text-emerald-600"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium bg-emerald-600 text-white text-center rounded-md"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
