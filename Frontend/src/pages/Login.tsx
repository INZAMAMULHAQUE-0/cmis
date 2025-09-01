import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import LoginForm from '../components/forms/LoginForm';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login: React.FC = () => {
  const { login, error, clearError } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    clearError();
  }, [clearError]);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        addToast('success', 'Welcome back! You have been successfully logged in.');
        navigate('/');
      }
    } catch (err) {
      addToast('error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <LogIn className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your college management dashboard
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-gray-200">
          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            error={error}
          />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;