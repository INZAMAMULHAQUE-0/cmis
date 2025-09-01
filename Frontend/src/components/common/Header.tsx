import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">CMIS</span>
          </Link>

          {/* Navigation (only visible to authenticated users) */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/courses"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Courses
              </Link>
              <Link
                to="/marks"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Marks
              </Link>
              <Link
                to="/fees"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Fees
              </Link>
              {(user as any)?.role === 'admin' && (
                <>
                  <Link
                    to="/all-students"
                    className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    All Students
                  </Link>
                  <Link
                    to="/all-faculty"
                    className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    All Faculty
                  </Link>
                </>
              )}
            </nav>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{user?.email}</span>
                </div>
                {/** Admin link visible only to admin role */}
                {(user as any)?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-sm text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                {/* Register is now admin-only; non-authenticated users don't see it */}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation (only visible to authenticated users) */}
        {isAuthenticated && (
          <nav className="md:hidden pb-4 pt-2">
            <div className="flex flex-wrap gap-4">
              <Link
                to="/courses"
                className="text-gray-600 hover:text-blue-600 text-sm font-medium"
              >
                Courses
              </Link>
              <Link
                to="/marks"
                className="text-gray-600 hover:text-blue-600 text-sm font-medium"
              >
                Marks
              </Link>
              <Link
                to="/fees"
                className="text-gray-600 hover:text-blue-600 text-sm font-medium"
              >
                Fees
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;